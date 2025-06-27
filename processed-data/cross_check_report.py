import os
import json
from pathlib import Path

# Directories to scan
ORIGINAL_DIRS = [
    'data/atrium_summary',
    'data/novant_summary',
    'data/atrium-exports/all_import',
    'data/binder-data',
]
EXTRACTED_TEXT_DIR = 'data/extracted_text'
PROCESSED_JSON_DIR = 'data/processed/notion_ready'
REPORT_PATH = 'data/processing_gaps_report.md'

# Helper: Recursively list all files in a directory (excluding .DS_Store, .gitkeep, etc.)
def list_all_files(directory):
    file_list = []
    for root, _, files in os.walk(directory):
        for f in files:
            if not f.startswith('.') and not f.endswith('.gitkeep'):
                file_list.append(os.path.relpath(os.path.join(root, f), start=directory))
    return file_list

# Helper: Load all .txt files in extracted_text
extracted_txt_files = set(os.listdir(EXTRACTED_TEXT_DIR))

# Helper: Load processed JSONs and collect all referenced source files
processed_source_files = set()
for json_name in [
    'medical_calendar_entries.json',
    'diagnosis_entries.json',
    'provider_entries.json',
    'symptom_entries.json',
]:
    json_path = os.path.join(PROCESSED_JSON_DIR, json_name)
    if not os.path.exists(json_path):
        continue
    with open(json_path, 'r') as f:
        try:
            data = json.load(f)
            for entry in data:
                # Check for 'source_file' field (can be str or list)
                source = entry.get('source_file')
                if isinstance(source, str):
                    processed_source_files.add(source)
                elif isinstance(source, list):
                    for s in source:
                        processed_source_files.add(s)
        except Exception as e:
            print(f"Error loading {json_name}: {e}")

# Step 1: Inventory all original files
original_files = set()
for orig_dir in ORIGINAL_DIRS:
    if not os.path.exists(orig_dir):
        continue
    for root, _, files in os.walk(orig_dir):
        for f in files:
            if not f.startswith('.') and not f.endswith('.gitkeep'):
                original_files.add(f)

# Step 2: Cross-check
missing_from_extracted = []
missing_from_processed = []

for orig_file in sorted(original_files):
    # Check for .txt in extracted_text (by filename match)
    txt_match = orig_file.replace('.pdf', '.txt').replace('.PDF', '.txt')
    if txt_match not in extracted_txt_files:
        missing_from_extracted.append(orig_file)
    # Check for reference in processed JSONs
    if orig_file not in processed_source_files and txt_match not in processed_source_files:
        missing_from_processed.append(orig_file)

# Step 3: Write report
with open(REPORT_PATH, 'w') as report:
    report.write('# Processing Gaps Report\n\n')
    report.write('## Files missing from extracted_text/\n')
    for f in missing_from_extracted:
        report.write(f'- {f}\n')
    report.write('\n## Files not referenced in processed JSONs\n')
    for f in missing_from_processed:
        report.write(f'- {f}\n')
    report.write('\n## Files needing manual review\n')
    for f in set(missing_from_extracted) | set(missing_from_processed):
        report.write(f'- {f}\n')

print(f"Cross-check complete. See {REPORT_PATH} for results.") 