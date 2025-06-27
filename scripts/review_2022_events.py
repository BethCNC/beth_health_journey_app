import json
from datetime import datetime
from pathlib import Path

# Allowed types and icon mapping (from icon_url_mapping.md and Notion)
ALLOWED_TYPES = {
    'Doctor Appointment': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F0aed0285-8b81-4a7c-9215-7eff9f914b67%2Fmedical_team.png?table=custom_emoji&id=1f086edc-ae2c-802a-8a63-007a1c53574a&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Imaging Test - Scan': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F54f4aa29-2a9b-4c63-9ac7-2a47ce95a4c1%2Fxray.png?table=custom_emoji&id=1f186edc-ae2c-8012-b2bb-007aa19103c7&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Rachel - Patient Advocate': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F60bdd696-b135-4b2c-953b-4f205fc3fcfb%2Fjournal-1.png?table=custom_emoji&id=1f186edc-ae2c-8038-8800-007a1e76a0a5&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Menstrual Cycle': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Faf69a1e6-5ea2-4c3e-9d3e-a50192e05de4%2Fmenstration.png?table=custom_emoji&id=1f186edc-ae2c-8065-99e1-007a425b1e7a&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Flare': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Ffb7c8490-e437-40e5-b617-246a0a107426%2Fflare.png?table=custom_emoji&id=1f186edc-ae2c-8060-b015-007add542886&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Daily Journal': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F093b883c-9f97-49c5-87d7-c9569c058758%2Fjournal.png?table=custom_emoji&id=1f186edc-ae2c-80ca-bf77-007abea85f05&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Test Results': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F9b2e4b49-9ec0-4cbd-a07c-89f13edb2158%2Flab_tests.png?table=custom_emoji&id=1f186edc-ae2c-8024-9ff4-007ad71a6c13&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
    'Lab Test': 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F9b2e4b49-9ec0-4cbd-a07c-89f13edb2158%2Flab_tests.png?table=custom_emoji&id=1f186edc-ae2c-8024-9ff4-007ad71a6c13&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2',
}

# Acceptable alternate keys for type normalization
TYPE_ALIASES = {
    'Image/Scan': 'Imaging Test - Scan',
    'Imaging Test/Scan': 'Imaging Test - Scan',
    'Rachel Meeting': 'Rachel - Patient Advocate',
    'Test Result': 'Test Results',
    'Lab Result': 'Lab Test',
    'Patient Advocacy': 'Rachel - Patient Advocate',
}

def normalize_type(type_val):
    if not type_val:
        return None
    if type_val in ALLOWED_TYPES:
        return type_val
    if type_val in TYPE_ALIASES:
        return TYPE_ALIASES[type_val]
    # Try case-insensitive match
    for k in ALLOWED_TYPES:
        if type_val.lower() == k.lower():
            return k
    for k, v in TYPE_ALIASES.items():
        if type_val.lower() == k.lower():
            return v
    return None

def is_2022(date_str):
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.year == 2022
    except Exception:
        return False

def main():
    input_path = Path('data/processed/2022/final_events_for_import.json')
    output_path = Path('data/2022_event_review.md')
    with open(input_path, 'r', encoding='utf-8') as f:
        events = json.load(f)
    
    header = '| Name | Date | Type | Icon URL | Doctor | Medications | Symptoms | Diagnoses | Issues |\n|---|---|---|---|---|---|---|---|---|'
    rows = [header]
    for event in events:
        if not isinstance(event, dict):
            continue
        date = event.get('Date', '')
        if not date or not is_2022(date):
            continue
        name = event.get('Name', '')
        raw_type = event.get('Type', '')
        norm_type = normalize_type(raw_type)
        icon_url = ALLOWED_TYPES.get(norm_type, '')
        doctor_val = event.get('Doctor') or []
        if isinstance(doctor_val, list):
            doctor = ', '.join(doctor_val)
        elif isinstance(doctor_val, str):
            doctor = doctor_val
        else:
            doctor = ''
        meds_val = event.get('Medications') or []
        if isinstance(meds_val, list):
            meds = ', '.join(meds_val)
        elif isinstance(meds_val, str):
            meds = meds_val
        else:
            meds = ''
        symptoms_val = event.get('Linked Symptoms') or []
        if isinstance(symptoms_val, list):
            symptoms = ', '.join(symptoms_val)
        elif isinstance(symptoms_val, str):
            symptoms = symptoms_val
        else:
            symptoms = ''
        diagnoses_val = event.get('Related Diagnoses') or []
        if isinstance(diagnoses_val, list):
            diagnoses = ', '.join(diagnoses_val)
        elif isinstance(diagnoses_val, str):
            diagnoses = diagnoses_val
        else:
            diagnoses = ''
        issues = []
        if not norm_type:
            issues.append(f'Unrecognized type: {raw_type}')
        if not icon_url:
            issues.append('Missing icon')
        if norm_type == 'Doctor Appointment' and not doctor:
            issues.append('Missing doctor relation')
        if not date:
            issues.append('Missing date')
        row = f'| {name} | {date} | {norm_type or raw_type} | {icon_url} | {doctor} | {meds} | {symptoms} | {diagnoses} | {"; ".join(issues)} |'
        rows.append(row)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(rows))
    print(f'Review table written to {output_path}')

if __name__ == '__main__':
    main() 