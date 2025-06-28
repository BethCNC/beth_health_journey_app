import os
import json
import re
from datetime import datetime

CLEANED_FILE = 'data/processed/medical_events_cleaned.jsonl'
OUTPUT_FILE = 'data/processed/notion_ready/medical_calendar_entries.jsonl'
LOG_FILE = 'processed-data/notion_import_issues.log'

# Dummy mapping tables (to be replaced with real ones if available)
PROVIDER_MAP = {}
MEDICATION_MAP = {}
SYMPTOM_MAP = {}
DIAGNOSIS_MAP = {}

def format_lab_results(lab_results):
    if not lab_results:
        return ''
    lines = []
    for r in lab_results:
        test = r.get('test', '')
        value = r.get('value', '')
        ref = r.get('reference_range', '')
        line = f"{test}: {value} (Ref: {ref})" if ref else f"{test}: {value}"
        lines.append(line)
    return '\n'.join(lines)

def map_relation(items, mapping):
    # Map list of items to Notion relation IDs or names if mapping available
    return [mapping.get(i, i) for i in items if i]

def main():
    if not os.path.exists(os.path.dirname(OUTPUT_FILE)):
        os.makedirs(os.path.dirname(OUTPUT_FILE))
    notion_ready = []
    issues = []
    with open(CLEANED_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                event = json.loads(line)
            except Exception as e:
                issues.append(f'JSON decode error: {e} in line: {line[:100]}')
                continue
            notion_event = {
                'Name': event.get('title', ''),
                'Date': event.get('date', ''),
                'Type': event.get('type', ''),
                'Purpose': event.get('purpose', ''),
                'Doctor': PROVIDER_MAP.get(event.get('doctor', ''), event.get('doctor', '')),
                'Medications': map_relation(event.get('medications', []), MEDICATION_MAP),
                'Lab Result': format_lab_results(event.get('lab_results', [])) if event.get('type') == 'Lab Result' else '',
                'Linked Symptoms': map_relation(event.get('symptoms', []), SYMPTOM_MAP),
                'Related Diagnoses': map_relation(event.get('diagnoses', []), DIAGNOSIS_MAP),
                'Doctors Notes': event.get('content', '') if event.get('type') != 'Lab Result' else '',
                'Personal Notes': '',
                'Notes': [],
                'Glows': '',
                'Grows': '',
                'Source File': event.get('source_file', '')
            }
            # Check for required fields
            if not notion_event['Name'] or not notion_event['Date'] or not notion_event['Type']:
                issues.append(f"Missing required field in event from {event.get('source_file','')}")
            notion_ready.append(notion_event)
    # Write output
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        for entry in notion_ready:
            out.write(json.dumps(entry) + '\n')
    # Write issues log
    with open(LOG_FILE, 'w', encoding='utf-8') as log:
        for issue in issues:
            log.write(issue + '\n')

if __name__ == '__main__':
    main() 