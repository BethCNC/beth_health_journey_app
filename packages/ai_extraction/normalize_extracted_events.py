import json
import os
from datetime import datetime

# Helper to normalize keys (case/spacing insensitive)
def normalize_key(key):
    return key.lower().replace(" ", "_")

# Map all possible variants to Notion schema
FIELD_MAP = {
    "document_type": "Type",
    "type": "Type",
    "imaging_type": "Type",
    "date_of_service": "Date",
    "date": "Date",
    "date_of_study": "Date",
    "collection_date": "Date",
    "result_date": "Date",
    "provider": "Doctor",
    "doctor": "Doctor",
    "provider_name_and_specialty": "Doctor",
    "ordering_provider": "Doctor",
    "reading_physician": "Doctor",
    "primary_complaint_or_purpose": "Purpose",
    "chief_complaint": "Purpose",
    "purpose": "Purpose",
    "diagnoses": "Related Diagnoses",
    "diagnoses_mentioned": "Related Diagnoses",
    "medications": "Medications",
    "medications_mentioned": "Medications",
    "test_results": "Lab Result",
    "test_results_with_reference_ranges": "Lab Result",
    "results": "Lab Result",
    "treatment_plan": "Doctors Notes",
    "treatment_plan_and_follow_up": "Doctors Notes",
    "plan": "Doctors Notes",
    "key_findings": "Personal Notes",
    "key_medical_findings": "Personal Notes",
    "summary": "Personal Notes",
    "symptoms": "Linked Symptoms",
    "notes": "Notes"
}

REQUIRED_FIELDS = [
    "Name", "Date", "Doctor", "Type", "Purpose", "Related Diagnoses", "Medications",
    "Lab Result", "Doctors Notes", "Personal Notes", "Linked Symptoms", "Notes"
]

INPUT_FILE = os.path.join(os.path.dirname(__file__), '../../data/processed/2022/structured_events.json')
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '../../data/processed/2022/normalized_events.json')

def extract_doctor(event):
    # Try all possible keys for provider
    for key in ["provider_name_and_specialty", "ordering_provider", "reading_physician", "provider", "doctor"]:
        for k in event.keys():
            if normalize_key(k) == key:
                val = event[k]
                if isinstance(val, dict):
                    # Prefer ordering provider, then reading physician
                    return val.get("Ordering provider") or val.get("Reading physician") or next(iter(val.values()), None)
                return val
    return None

def extract_name(event):
    # Prefer complaint/purpose, else document type, else imaging type, else fallback
    for key in ["primary_complaint_or_purpose", "chief_complaint", "purpose", "document_type", "imaging_type", "test_name"]:
        for k in event.keys():
            if normalize_key(k) == key:
                val = event[k]
                if val:
                    return str(val)
    # Fallback: use Type + Date
    t = event.get("Document type") or event.get("Imaging type") or event.get("type")
    d = event.get("Date of service") or event.get("Date of study") or event.get("date")
    if t and d:
        return f"{t} - {d}"
    return "Medical Event"

def extract_field(event, field_keys):
    for key in field_keys:
        for k in event.keys():
            if normalize_key(k) == key:
                return event[k]
    return None

def normalize_date(date_val):
    # Try to parse and format as YYYY-MM-DD
    if not date_val:
        return None
    for fmt in ("%B %d, %Y", "%b %d, %Y", "%m/%d/%Y", "%Y-%m-%d", "%b %d %Y", "%B %d %Y", "%Y"):
        try:
            return datetime.strptime(date_val, fmt).strftime("%Y-%m-%d")
        except Exception:
            continue
    return date_val  # fallback

def flatten_list(val):
    if isinstance(val, list):
        return ", ".join(str(x) for x in val if x)
    if isinstance(val, dict):
        return ", ".join(f"{k}: {v}" for k, v in val.items())
    return val

def normalize_event(event):
    normalized = {}
    # Name
    normalized["Name"] = extract_name(event)
    # Date
    date_val = extract_field(event, ["date_of_service", "date_of_study", "collection_date", "result_date", "date"])
    normalized["Date"] = normalize_date(date_val)
    # Doctor
    normalized["Doctor"] = extract_doctor(event)
    # Map all other fields
    for src_key, notion_key in FIELD_MAP.items():
        val = extract_field(event, [src_key])
        if val is not None:
            if notion_key in ["Related Diagnoses", "Medications", "Linked Symptoms"]:
                normalized[notion_key] = flatten_list(val)
            else:
                normalized[notion_key] = flatten_list(val)
    # Fill missing required fields
    for field in REQUIRED_FIELDS:
        if field not in normalized:
            normalized[field] = None
    return normalized

def main():
    with open(INPUT_FILE) as f:
        events = json.load(f)
    normalized_events = [normalize_event(e) for e in events]
    with open(OUTPUT_FILE, "w") as f:
        json.dump(normalized_events, f, indent=2)
    print(f"Normalized {len(normalized_events)} events. Output: {OUTPUT_FILE}")

if __name__ == "__main__":
    main() 