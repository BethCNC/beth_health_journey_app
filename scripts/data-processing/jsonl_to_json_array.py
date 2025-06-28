import json

input_path = 'data/processed/notion_ready/medical_calendar_entries_2018.jsonl'
output_path = 'data/processed/notion_ready/notion_ready_entries_2018.json'

with open(input_path, 'r', encoding='utf-8') as infile:
    entries = [json.loads(line) for line in infile if line.strip()]

with open(output_path, 'w', encoding='utf-8') as outfile:
    json.dump(entries, outfile, indent=2) 