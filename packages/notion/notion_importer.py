#!/usr/bin/env python3
"""
Script to import processed medical records into Notion Medical Calendar database.

This script reads the JSON file created by import_2018_2019_records.py
and imports the records into the Notion Medical Calendar database.
"""

import os
import json
import datetime
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
INPUT_FILE = "data/processed/2022/final_events_for_import.json"
NOTION_API_KEY = os.getenv("NOTION_TOKEN")
MEDICAL_CALENDAR_DB_ID = os.getenv("NOTION_MEDICAL_CALENDAR_DATABASE_ID")
DOCTOR_DB_ID = os.getenv("NOTION_MEDICAL_TEAM_DATABASE_ID")
DIAGNOSES_DB_ID = os.getenv("NOTION_HEALTH_PAGES_DATABASE_ID")
SYMPTOMS_DB_ID = os.getenv("NOTION_SYMPTOMS_DATABASE_ID")
MEDICATIONS_DB_ID = os.getenv("NOTION_MEDICATIONS_DATABASE_ID")
NOTES_DB_ID = os.getenv("NOTION_NOTES_DATABASE_ID")

# Notion API endpoints
NOTION_API_BASE = "https://api.notion.com/v1"
PAGES_ENDPOINT = f"{NOTION_API_BASE}/pages"
DB_QUERY_ENDPOINT = f"{NOTION_API_BASE}/databases/{MEDICAL_CALENDAR_DB_ID}/query"
DOCTORS_QUERY_ENDPOINT = f"{NOTION_API_BASE}/databases/{DOCTOR_DB_ID}/query"

# Custom icon URL mapping for event types
ICON_URL_MAP = {
    "Doctor Appointment": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F0aed0285-8b81-4a7c-9215-7eff9f914b67%2Fmedical_team.png?table=custom_emoji&id=1f086edc-ae2c-802a-8a63-007a1c53574a&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2",
    "Imaging Test/Scan": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F54f4aa29-2a9b-4c63-9ac7-2a47ce95a4c1%2Fxray.png?table=custom_emoji&id=1f186edc-ae2c-8012-b2bb-007aa19103c7&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2",
    "Rachel Meeting": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F60bdd696-b135-4b2c-953b-4f205fc3fcfb%2Fjournal-1.png?table=custom_emoji&id=1f186edc-ae2c-8038-8800-007a1e76a0a5&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2",
    "Menstrual Cycle": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Faf69a1e6-5ea2-4c3e-9d3e-a50192e05de4%2Fmenstration.png?table=custom_emoji&id=1f186edc-ae2c-8065-99e1-007a425b1e7a&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2",
    "Flare": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2Ffb7c8490-e437-40e5-b617-246a0a107426%2Fflare.png?table=custom_emoji&id=1f186edc-ae2c-8060-b015-007add542886&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2",
    "Daily Journal": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F093b883c-9f97-49c5-87d7-c9569c058758%2Fjournal.png?table=custom_emoji&id=1f186edc-ae2c-80ca-bf77-007abea85f05&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2",
    "Test Results": "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F9b2e4b49-9ec0-4cbd-a07c-89f13edb2158%2Flab_tests.png?table=custom_emoji&id=1f186edc-ae2c-8024-9ff4-007ad71a6c13&spaceId=a0059cff-6806-46d7-9af3-63784e549871&width=70&userId=e913fd11-cd1b-4098-b4b4-2c2adadcddb8&cache=v2"
}
DEFAULT_ICON_URL = ICON_URL_MAP["Doctor Appointment"]

def get_notion_headers():
    """Get headers for Notion API requests."""
    if not NOTION_API_KEY:
        raise ValueError("NOTION_API_KEY environment variable not set.")
    
    return {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

def get_doctor_ids_by_names(doctor_names):
    """Get Notion doctor IDs by doctor name(s)."""
    headers = get_notion_headers()
    ids = []
    if not doctor_names:
        return ids
    # Always treat as list
    if isinstance(doctor_names, str):
        doctor_names = [doctor_names]
    for doctor_name in doctor_names:
        if not isinstance(doctor_name, str) or not doctor_name.strip():
            continue
        last_name = doctor_name.split()[-1]
        payload = {
            "filter": {
                "property": "Name",
                "rich_text": {
                    "contains": last_name
                }
            }
        }
        response = requests.post(DOCTORS_QUERY_ENDPOINT, headers=headers, json=payload)
        if response.status_code != 200:
            print(f"Error querying doctors database: {response.text}")
            continue
        results = response.json().get("results", [])
        if not results:
            print(f"No doctor found with name containing '{last_name}'")
            continue
        ids.append({"id": results[0]["id"]})
    return ids

def format_title(entry):
    """Format the title for Notion consistency: just the event name, no date."""
    event_type = entry.get('Type', '')
    name = entry.get('Name', '')
    # For Lab Results, use the test name or result name
    if event_type == 'Lab Result':
        if entry.get('Lab Result'):
            test_name = entry['Lab Result'].split('\n')[0].strip()
            if test_name and test_name.lower() != 'lab results':
                return test_name
        elif entry.get('Medications') and isinstance(entry['Medications'], list) and len(entry['Medications']) > 0:
            test_name = entry['Medications'][0].split(' ')[0].strip()
            if test_name:
                return test_name
        return 'Lab Result'
    # For other events, use Name field directly
    return name

def get_relation_ids_by_names(db_id, property_name, names):
    """Get Notion page IDs for a list of names in a given database."""
    headers = get_notion_headers()
    ids = []
    if not names:
        return ids
    for name in names:
        payload = {
            "filter": {
                "property": property_name,
                "rich_text": {"contains": name}
            }
        }
        response = requests.post(f"{NOTION_API_BASE}/databases/{db_id}/query", headers=headers, json=payload)
        if response.status_code == 200:
            results = response.json().get("results", [])
            if results:
                ids.append({"id": results[0]["id"]})
            else:
                print(f"No match found for '{name}' in DB {db_id}")
        else:
            print(f"Error querying DB {db_id} for '{name}': {response.text}")
    return ids

def create_record_in_notion(entry):
    """Create a record in the Notion Medical Calendar database with icons and relations."""
    headers = get_notion_headers()
    date_val = entry.get("Date")
    if not isinstance(date_val, str) or not date_val.strip():
        print(f"Skipping record with missing or invalid date: {entry.get('Name', '[No Name]')}")
        return False
    try:
        date_obj = datetime.datetime.fromisoformat(date_val)
    except Exception as e:
        print(f"Skipping record with unparseable date '{date_val}': {entry.get('Name', '[No Name]')} ({e})")
        return False
    doctor_ids = get_doctor_ids_by_names(entry.get("Doctor"))
    formatted_title = format_title(entry)
    # Prepare properties
    properties = {
        "Name": {"title": [{"text": {"content": formatted_title}}]},
        "Date": {"date": {"start": date_obj.isoformat()}},
        "Type": {"select": {"name": entry["Type"]}},
    }
    if doctor_ids:
        properties["Doctor"] = {"relation": doctor_ids}
    # Add Related Diagnoses relation
    diag_ids = get_relation_ids_by_names(DIAGNOSES_DB_ID, "Name", entry.get("Related Diagnoses"))
    if diag_ids:
        properties["Related Diagnoses"] = {"relation": diag_ids}
    # Add Symptoms relation
    symptom_ids = get_relation_ids_by_names(SYMPTOMS_DB_ID, "Name", entry.get("Symptoms"))
    if symptom_ids:
        properties["Symptoms"] = {"relation": symptom_ids}
    # Add Medications relation
    med_ids = get_relation_ids_by_names(MEDICATIONS_DB_ID, "Name", entry.get("Medications"))
    if med_ids:
        properties["Medications"] = {"relation": med_ids}
    # Add Notes relation (if applicable)
    note_ids = get_relation_ids_by_names(NOTES_DB_ID, "Name", entry.get("Notes"))
    if note_ids:
        properties["Notes"] = {"relation": note_ids}
    # Set icon based on event type using custom URL
    icon_url = ICON_URL_MAP.get(entry["Type"], DEFAULT_ICON_URL)
    icon = {"type": "external", "external": {"url": icon_url}}
    # Create page in Notion
    payload = {
        "parent": {"database_id": MEDICAL_CALENDAR_DB_ID},
        "properties": properties,
        "icon": icon,
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {"content": entry.get("Doctors Notes") or ""}
                        }
                    ]
                }
            }
        ]
    }
    response = requests.post(PAGES_ENDPOINT, headers=headers, json=payload)
    if response.status_code != 200:
        print(f"Error creating record: {response.text}")
        return False
    return True

def main():
    """Main function to import records into Notion."""
    print("Starting import of medical records into Notion...")
    if not NOTION_API_KEY:
        print("Error: NOTION_API_KEY environment variable not set.")
        print("Set your Notion API key with: export NOTION_API_KEY=your_api_key")
        return
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file not found: {INPUT_FILE}")
        print("Run import_2018_2019_records.py first to generate this file.")
        return
    with open(INPUT_FILE, 'r', encoding='utf-8') as infile:
        entries = json.load(infile)
    print(f"Found {len(entries)} records to import.")
    success_count = 0
    for i, entry in enumerate(entries):
        formatted_title = format_title(entry)
        print(f"Importing record {i+1}/{len(entries)}: {formatted_title}")
        if create_record_in_notion(entry):
            success_count += 1
    print(f"Import complete. Successfully imported {success_count}/{len(entries)} records.")

if __name__ == "__main__":
    main() 