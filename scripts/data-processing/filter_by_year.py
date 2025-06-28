import json

INPUT_FILE = 'data/processed/notion_ready/medical_calendar_entries.jsonl'
OUTPUT_FILE = 'data/processed/notion_ready/medical_calendar_entries_2018.jsonl'
YEAR = '2018'

with open(INPUT_FILE, 'r') as infile, open(OUTPUT_FILE, 'w') as outfile:
    for line in infile:
        try:
            entry = json.loads(line)
            date = entry.get('Date', '')
            if date.startswith(YEAR):
                outfile.write(json.dumps(entry) + '\n')
        except Exception as e:
            # Skip malformed lines
            continue 