import os
import re
import json
import glob
from datetime import datetime

EXTRACTED_TEXT_DIR = 'data/extracted_text/'
OUTPUT_FILE = 'data/processed/medical_events_cleaned.jsonl'
LOG_FILE = 'processed-data/data_cleaning_issues.log'

# Helper regex patterns
DATE_PATTERNS = [
    r'(\d{1,2}/\d{1,2}/\d{2,4})',
    r'(\d{4}-\d{2}-\d{2})',
    r'(\w{3,9} \d{1,2}, \d{4})',
]
FILENAME_DATE_PATTERNS = [
    r'(\d{4}-\d{2}-\d{2})',
    r'(\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}Z)',
    r'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)'
]
DOB_KEYWORDS = ['date of birth', 'dob', 'birthdate']
LAB_KEYWORDS = ['labcorp', 'result', 'reference range', 'test', 'specimen', 'component', 'value']
IMAGING_KEYWORDS = ['mri', 'ct', 'x-ray', 'imaging', 'radiology', 'scan']
DOCTOR_VISIT_KEYWORDS = ['visit', 'appointment', 'provider', 'doctor', 'assessment', 'plan']

# Dummy mapping tables (to be replaced with real ones if available)
PROVIDER_MAP = {}
DIAGNOSIS_MAP = {}
MEDICATION_MAP = {}
SYMPTOM_MAP = {}

# List of non-medical files to skip
SKIP_FILES = [
    'address.txt', 'lucylogo.txt', 'pagefooter.txt', 'pagebackground.txt', 'pagetop.txt',
    'phone.txt', 'org.txt', 'metadata.txt', 'lucydrive.txt', 'lucy_colors.css', 'style.xsl',
    'training_data_beth_voice.jsonl'
]

# Helper to extract date from filename
def extract_date_from_filename(filename):
    for pattern in FILENAME_DATE_PATTERNS:
        match = re.search(pattern, filename, re.IGNORECASE)
        if match:
            date_str = match.group(1)
            # Try to parse date
            for fmt in ('%Y-%m-%d', '%Y-%m-%dT%H_%M_%SZ', '%Y-%m-%dT%H:%M:%SZ'):
                try:
                    dt = datetime.strptime(date_str, fmt)
                    return dt.strftime('%Y-%m-%d')
                except Exception:
                    continue
    return None

# Helper to clean filename for Notion title
REMOVE_SUFFIXES = ['-impression', '-narrative', '-report', '-summary', '-note', '-notes', '-scan', '-result', '-findings']
def clean_filename_for_title(filename):
    name = os.path.splitext(filename)[0]
    # Remove date/time patterns
    name = re.sub(r'-\d{4}-\d{2}-\d{2}(T\d{2}_\d{2}_\d{2}Z)?', '', name)
    # Remove known suffixes
    for suf in REMOVE_SUFFIXES:
        if name.lower().endswith(suf):
            name = name[:-(len(suf))]
    # Replace underscores and dashes with spaces
    name = name.replace('_', ' ').replace('-', ' ')
    # Capitalize words
    name = ' '.join([w.capitalize() for w in name.split()])
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name).strip()
    return name

def extract_date(text):
    # Find all date-like strings
    for pattern in DATE_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for date_str in matches:
            # Check context to avoid DOB
            idx = text.lower().find(date_str.lower())
            context = text[max(0, idx-40):idx+40].lower() if idx != -1 else ''
            if not any(kw in context for kw in DOB_KEYWORDS):
                # Try to parse date
                for fmt in ('%m/%d/%Y', '%m/%d/%y', '%Y-%m-%d', '%B %d, %Y', '%b %d, %Y'):
                    try:
                        dt = datetime.strptime(date_str, fmt)
                        return dt.strftime('%Y-%m-%d')
                    except Exception:
                        continue
    return None

def identify_event_type(text):
    lower = text.lower()
    if any(kw in lower for kw in LAB_KEYWORDS):
        return 'Lab Result'
    if any(kw in lower for kw in IMAGING_KEYWORDS):
        return 'Image/Scan'
    if any(kw in lower for kw in DOCTOR_VISIT_KEYWORDS):
        return "Doctor's Notes - Appt Notes"
    return 'Other'

def extract_lab_results(text):
    # Very basic: extract lines with test, value, and reference range
    results = []
    for line in text.splitlines():
        if re.search(r'(\d+\.\d+|Negative|Positive|Detected|Not Detected)', line):
            # Try to extract test name, value, and reference range
            parts = re.split(r'\s{2,}', line)
            if len(parts) >= 2:
                test = parts[0].strip()
                value = parts[1].strip()
                ref = parts[2].strip() if len(parts) > 2 else ''
                results.append({'test': test, 'value': value, 'reference_range': ref})
    return results

def extract_provider(text):
    # Look for provider names (very basic)
    match = re.search(r'(Dr\.? [A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+ [A-Z][a-z]+,? (MD|DO|PA|NP))', text)
    if match:
        return match.group(0)
    return None

def extract_diagnoses(text):
    # Look for lines with known diagnosis keywords (expand as needed)
    diagnoses = []
    for line in text.splitlines():
        if 'diagnosis' in line.lower() or 'dx:' in line.lower():
            diagnoses.append(line.strip())
    return diagnoses

def extract_medications(text):
    # Look for lines with medication-like patterns
    meds = []
    for line in text.splitlines():
        if re.search(r'(mg|tablet|capsule|dose|daily|prn)', line.lower()):
            meds.append(line.strip())
    return meds

def extract_symptoms(text):
    # Look for lines with symptom-like patterns
    symptoms = []
    for line in text.splitlines():
        if 'pain' in line.lower() or 'fatigue' in line.lower() or 'nausea' in line.lower():
            symptoms.append(line.strip())
    return symptoms

def extract_purpose(text):
    # Look for purpose/assessment/plan
    for line in text.splitlines():
        if 'purpose' in line.lower() or 'assessment' in line.lower() or 'plan' in line.lower():
            return line.strip()
    return ''

def main():
    files = glob.glob(os.path.join(EXTRACTED_TEXT_DIR, '*.txt'))
    cleaned = []
    issues = []
    for file in files:
        basename = os.path.basename(file)
        if basename.lower() in SKIP_FILES:
            continue  # skip non-medical files
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
        event_date = extract_date(text)
        # Fallback: try to extract date from filename if not found in text
        if not event_date:
            event_date = extract_date_from_filename(basename)
        if not event_date:
            issues.append(f'{basename}: Missing or ambiguous event date')
        event_type = identify_event_type(text)
        if event_type == 'Lab Result':
            title = 'Lab Results'
            lab_results = extract_lab_results(text)
            provider = ''
        else:
            provider = extract_provider(text) or ''
            title = f"Doctor Visit - {provider} - {event_date}" if provider else ''
            lab_results = []
        # Fallback: use cleaned filename as title if title is empty
        if not title:
            title = clean_filename_for_title(basename)
        diagnoses = extract_diagnoses(text)
        medications = extract_medications(text)
        symptoms = extract_symptoms(text)
        purpose = extract_purpose(text)
        event = {
            'title': title,
            'date': event_date,
            'type': event_type,
            'doctor': provider if event_type != 'Lab Result' else '',
            'diagnoses': diagnoses,
            'symptoms': symptoms,
            'medications': medications,
            'purpose': purpose,
            'lab_results': lab_results,
            'content': text,
            'source_file': basename
        }
        cleaned.append(event)
    # Write cleaned data
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        for event in cleaned:
            out.write(json.dumps(event) + '\n')
    # Write issues log
    with open(LOG_FILE, 'w', encoding='utf-8') as log:
        for issue in issues:
            log.write(issue + '\n')

if __name__ == '__main__':
    main() 