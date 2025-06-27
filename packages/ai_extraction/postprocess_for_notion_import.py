import json
import os

# Updated Notion select options for 'Type'
TYPE_MAP = {
    'flare': 'Flare',
    'symptom flare': 'Flare',
    'daily journal': 'Daily Journal',
    'journal': 'Daily Journal',
    'test result': 'Test Result',
    'lab result': 'Test Result',
    'bloodwork': 'Test Result',
    'doctor appointment': 'Doctor Appointment',
    'doctor appt': 'Doctor Appointment',
    'appointment': 'Doctor Appointment',
    'appt': 'Doctor Appointment',
    'image/scan': 'Image/Scan',
    'imaging test - scan': 'Image/Scan',
    'imaging': 'Image/Scan',
    'ct': 'Image/Scan',
    'mri': 'Image/Scan',
    'x-ray': 'Image/Scan',
    'radiology': 'Image/Scan',
    'radiology report': 'Image/Scan',
    'scan': 'Image/Scan',
    'lab test': 'Lab Test',
    'rachel': 'Rachel - Patient Advocate',
    'patient advocate': 'Rachel - Patient Advocate',
    'rachel meeting': 'Rachel - Patient Advocate',
    'menstrual cycle': 'Menstrual Cycle',
    'menstrual': 'Menstrual Cycle',
    'cycle': 'Menstrual Cycle',
}

ALLOWED_TYPES = set(TYPE_MAP.values())

RELATION_FIELDS = [
    'Related Diagnoses',
    'Medications',
    'Linked Symptoms',
    'Doctor'
]

INPUT_FILE = 'data/processed/2022/cleaned_events.json'
OUTPUT_FILE = 'data/processed/2022/final_events_for_import.json'
LOG_FILE = 'data/processed/2022/final_events_for_import.log'

# Optionally, load Notion DB entries for relations for stricter matching
# For now, just normalize and flag unknowns

def normalize_type(raw_type):
    if not isinstance(raw_type, str):
        return None, 'Type missing or not a string'
    t = raw_type.strip().lower()
    if t in TYPE_MAP:
        return TYPE_MAP[t], None
    # Try partial match
    for k, v in TYPE_MAP.items():
        if k in t:
            return v, f"Type '{raw_type}' mapped by partial match to '{v}'"
    return None, f"Type '{raw_type}' not recognized or not allowed. Allowed: {sorted(ALLOWED_TYPES)}"

def normalize_relation(val):
    if val is None:
        return []
    if isinstance(val, str):
        return [val.strip()] if val.strip() else []
    if isinstance(val, list):
        return list({str(x).strip() for x in val if str(x).strip()})
    return []

def main():
    with open(INPUT_FILE, 'r') as f:
        events = json.load(f)
    processed = []
    log = []
    for i, event in enumerate(events):
        warnings = []
        manual_review = False
        # Normalize Type
        notion_type, type_warn = normalize_type(event.get('Type'))
        if not notion_type:
            manual_review = True
            warnings.append(type_warn)
        event['Type'] = notion_type or event.get('Type')
        # Normalize relation fields
        for field in RELATION_FIELDS:
            rel = event.get(field)
            rel_norm = normalize_relation(rel)
            if rel and not rel_norm:
                warnings.append(f"{field} could not be normalized: {rel}")
                manual_review = True
            event[field] = rel_norm
        # Deduplicate and trim
        for field in RELATION_FIELDS:
            event[field] = sorted(set([x.strip() for x in event.get(field, []) if x and isinstance(x, str)]))
        # Add warnings/manual_review
        if warnings:
            event['warnings'] = warnings
        event['manual_review'] = manual_review
        processed.append(event)
        if manual_review:
            log.append({'index': i, 'event': event, 'warnings': warnings})
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(processed, f, indent=2)
    with open(LOG_FILE, 'w') as f:
        for entry in log:
            f.write(json.dumps(entry, indent=2) + '\n')
    print(f"Processed {len(processed)} events. {len(log)} flagged for manual review.")

if __name__ == '__main__':
    main() 