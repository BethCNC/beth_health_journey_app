import json
import os
from datetime import datetime
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Notion event type mapping
TYPE_MAP = {
    'lab result': 'Lab Result',
    'laboratory test': 'Lab Result',
    'laboratory test (c-reactive protein)': 'Lab Result',
    'ct': 'Imaging Test/Scan',
    'radiology report': 'Imaging Test/Scan',
    'mri': 'Imaging Test/Scan',
    'doctor appointment': 'Doctor Appointment',
    'appt': 'Doctor Appointment',
    'visit': 'Doctor Appointment',
    'flare': 'Flare',
    'menstrual cycle': 'Menstrual Cycle',
    'daily journal': 'Daily Journal',
    'test results': 'Test Results',
    'rachel meeting': 'Rachel Meeting',
    # Add more as needed
}

INPUT_FILE = "data/processed/2022/normalized_events.json"
OUTPUT_FILE = "data/processed/2022/cleaned_events.json"
LOG_FILE = "data/processed/2022/cleaned_events_skipped.log"
AI_LOG_FILE = "data/processed/2022/ai_completion_log.jsonl"

SUPPORTED_TYPES = set(TYPE_MAP.values())
REQUIRED_FIELDS = ["Name", "Date", "Type", "Doctor"]

# AI prompt for Notion Medical Calendar extraction
def build_ai_prompt(event):
    # New, strict prompt for Notion Medical Calendar normalization
    prompt = f'''
You are a medical data assistant. Given the following medical event data, extract and map the information to fit the Notion Medical Calendar database schema. 

Return a JSON object with these exact fields:
- Name: (the main event name/title)
- Date: (the date and time of the event, ISO format preferred)
- Doctor: (the main provider, as a string)
- Related Diagnoses: (list of diagnosis names, or [] if none)
- Linked Symptoms: (list of symptom names, or [] if none)
- Medications: (list of medication names, or [] if none)
- Lab Result: (all lab results, formatted as a string, or empty if none)
- Doctors Notes: (all doctor notes, formatted as a string, or empty if none)

If a field is not present, leave it empty or as an empty list. Do not invent information. Use only what is present in the event data. 

Event data:
{json.dumps(event, indent=2)}

Return only the JSON object, nothing else.
'''
    return prompt

def call_openai(prompt):
    try:
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0
        )
        content = response.choices[0].message.content if response.choices and hasattr(response.choices[0].message, 'content') else None
        return content
    except Exception as e:
        print(f"AI completion failed: {e}")
        return None

def parse_ai_json(ai_content):
    try:
        # Try to find the first JSON object in the response
        start = ai_content.find('{')
        end = ai_content.rfind('}') + 1
        if start != -1 and end != -1:
            return json.loads(ai_content[start:end])
        return json.loads(ai_content)
    except Exception as e:
        print(f"Failed to parse AI JSON: {e}")
        return None

def normalize_date(date_str):
    if not date_str or date_str.lower() in ["not specified", "null", "none"]:
        return None
    # Try parsing with common formats
    for fmt in ("%B %d, %Y", "%b %d, %Y", "%m/%d/%Y", "%Y-%m-%d", "%B %d, %Y %I:%M %p", "%b %d, %Y %I:%M %p", "%Y-%m-%dT%H:%M:%S"):
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.isoformat()
        except Exception:
            continue
    # If already ISO
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.isoformat()
    except Exception:
        pass
    return None

def ensure_list(val):
    if val is None or val == "" or val == []:
        return []
    if isinstance(val, list):
        return val
    if isinstance(val, str):
        # Split by comma if looks like a list
        if "," in val:
            return [v.strip() for v in val.split(",") if v.strip()]
        return [val.strip()]
    return [str(val)]

def build_ai_date_prompt(event):
    prompt = f'''
You are a medical data assistant. Given the following medical event data, extract ONLY the date of the event. Return the date in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS). If no date is present, return null. Do NOT use the patient's birthdate (9/13/1982) as the event date under any circumstances.

Event data:
{json.dumps(event, indent=2)}

Return only the date as a JSON string, e.g. "2022-10-26" or null.
'''
    return prompt

def call_openai_date(prompt):
    try:
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=20,
            temperature=0
        )
        content = response.choices[0].message.content if response.choices and hasattr(response.choices[0].message, 'content') else None
        if content:
            return content.strip()
        return None
    except Exception as e:
        print(f"AI date extraction failed: {e}")
        return None

def parse_ai_date(ai_content):
    try:
        # Expecting a JSON string, e.g. "2022-10-26" or null
        date_val = json.loads(ai_content)
        if date_val == "1982-09-13" or date_val == "1982-09-13T00:00:00":
            return None
        return date_val
    except Exception as e:
        print(f"Failed to parse AI date: {e}")
        return None

def build_ai_type_prompt(event):
    allowed_types = [
        "Lab Result",
        "Imaging Test/Scan",
        "Doctor Appointment",
        "Flare",
        "Menstrual Cycle",
        "Daily Journal",
        "Test Results",
        "Rachel Meeting"
    ]
    prompt = f'''
You are a medical data assistant. Given the following medical event data, infer the most appropriate event type for the Notion Medical Calendar. Choose ONLY from this list:
{allowed_types}
Return only the type as a JSON string, e.g. "Lab Result".

Event data:
{json.dumps(event, indent=2)}
'''
    return prompt

def call_openai_type(prompt):
    try:
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=20,
            temperature=0
        )
        content = response.choices[0].message.content if response.choices and hasattr(response.choices[0].message, 'content') else None
        if content:
            return content.strip()
        return None
    except Exception as e:
        print(f"AI type extraction failed: {e}")
        return None

def parse_ai_type(ai_content):
    try:
        # Expecting a JSON string, e.g. "Lab Result"
        type_val = json.loads(ai_content)
        return type_val
    except Exception as e:
        print(f"Failed to parse AI type: {e}")
        return None

def keyword_type_fallback(event):
    name = event.get("Name", "").lower()
    notes = (event.get("Notes", []) or [])
    notes_str = " ".join(notes).lower() if isinstance(notes, list) else str(notes).lower()
    combined = name + " " + notes_str
    if any(k in combined for k in ["cbc", "panel", "lab", "test", "blood", "thyroid", "result"]):
        return "Lab Result"
    if any(k in combined for k in ["mri", "ct", "x-ray", "imaging", "scan", "radiology"]):
        return "Imaging Test/Scan"
    if any(k in combined for k in ["appt", "appointment", "visit", "consult", "note", "doctor"]):
        return "Doctor Appointment"
    if "flare" in combined:
        return "Flare"
    if "menstrual" in combined or "cycle" in combined:
        return "Menstrual Cycle"
    if "journal" in combined:
        return "Daily Journal"
    if "rachel" in combined:
        return "Rachel Meeting"
    return None

def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        events = json.load(f)
    cleaned = []
    ai_log = []
    for i, event in enumerate(events):
        warnings = []
        # Try to normalize as before
        name = event.get("Name", "").strip()
        raw_type = event.get("Type", None)
        date = event.get("Date", "")
        # If any required field is missing or invalid, use AI to fill in
        needs_ai = False
        if not name or not raw_type or not date or date.lower() in ["not specified", "null", "none", ""]:
            needs_ai = True
        # Try to parse date
        norm_date = normalize_date(date)
        if not norm_date:
            # Use AI to extract date
            date_prompt = build_ai_date_prompt(event)
            ai_date_content = call_openai_date(date_prompt)
            ai_date = parse_ai_date(ai_date_content) if ai_date_content else None
            if ai_date:
                norm_date = ai_date
        # If AI or normalization gives birthdate, set to None
        if norm_date in ["1982-09-13", "1982-09-13T00:00:00"]:
            norm_date = None
        if not norm_date:
            needs_ai = True
        # Type normalization and inference
        norm_type = None
        if raw_type:
            norm_type = TYPE_MAP.get(raw_type.strip().lower(), None)
        if not norm_type:
            # Use AI to infer type
            type_prompt = build_ai_type_prompt(event)
            ai_type_content = call_openai_type(type_prompt)
            ai_type = parse_ai_type(ai_type_content) if ai_type_content else None
            if ai_type in SUPPORTED_TYPES:
                norm_type = ai_type
        if not norm_type:
            # Fallback to keyword logic
            norm_type = keyword_type_fallback(event)
        if not norm_type:
            needs_ai = True
        else:
            event["Type"] = norm_type
        if not needs_ai:
            # Use existing event, but ensure lists and add warnings if needed
            event["Related Diagnoses"] = ensure_list(event.get("Related Diagnoses"))
            event["Medications"] = ensure_list(event.get("Medications"))
            event["Linked Symptoms"] = ensure_list(event.get("Linked Symptoms"))
            event["Notes"] = ensure_list(event.get("Notes"))
            event["Date"] = norm_date
            event["Warnings"] = warnings
            cleaned.append(event)
            continue
        # Use AI to fill in missing fields
        prompt = build_ai_prompt(event)
        ai_content = call_openai(prompt)
        ai_result = None
        if ai_content:
            ai_result = parse_ai_json(ai_content)
        if ai_result:
            # Normalize lists and date
            ai_result["Related Diagnoses"] = ensure_list(ai_result.get("Related Diagnoses"))
            ai_result["Medications"] = ensure_list(ai_result.get("Medications"))
            ai_result["Linked Symptoms"] = ensure_list(ai_result.get("Linked Symptoms"))
            ai_result["Notes"] = ensure_list(ai_result.get("Notes"))
            ai_result["Date"] = normalize_date(ai_result.get("Date", ""))
            # Add manual review flag if any required field is missing
            missing_fields = [f for f in REQUIRED_FIELDS if not ai_result.get(f)]
            if missing_fields:
                ai_result["ManualReview"] = True
                ai_result.setdefault("Warnings", []).append(f"Missing required fields: {', '.join(missing_fields)}")
            else:
                ai_result["ManualReview"] = False
            cleaned.append(ai_result)
            ai_log.append({"index": i, "prompt": prompt, "ai_content": ai_content, "ai_result": ai_result})
        else:
            # If AI fails, add event with manual review flag
            event["ManualReview"] = True
            event.setdefault("Warnings", []).append("AI completion failed or could not parse result.")
            cleaned.append(event)
            ai_log.append({"index": i, "prompt": prompt, "ai_content": ai_content, "ai_result": None})
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2)
    with open(AI_LOG_FILE, "w", encoding="utf-8") as f:
        for entry in ai_log:
            f.write(json.dumps(entry) + "\n")
    print(f"Normalization complete. {len(cleaned)} events processed. See {OUTPUT_FILE} and {AI_LOG_FILE}.")

if __name__ == "__main__":
    main() 