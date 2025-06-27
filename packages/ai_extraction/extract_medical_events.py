import os
import openai
import json
from dotenv import load_dotenv
from utils import extract_text_from_file, get_prompt_for_file

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

RAW_DATA_DIRS = [
    "../../data/atrium-exports/all_import/2022/GP",
    "../../data/atrium-exports/all_import/2022/Rheumatology",
    "../../data/novant_summary/Novant_Health"
]
OUTPUT_FILE = "../../data/processed/2022/structured_events.json"

SUPPORTED_EXTS = ('.pdf', '.rtf', '.txt', '.docx')

def analyze_file(filepath):
    text = extract_text_from_file(filepath)
    if not text.strip():
        print(f"No text extracted from {filepath}")
        return None
    prompt = get_prompt_for_file(filepath)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ],
            max_tokens=1500,
            temperature=0.1,
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return None

def main():
    results = []
    for data_dir in RAW_DATA_DIRS:
        for root, _, files in os.walk(data_dir):
            for fname in files:
                if fname.lower().endswith(SUPPORTED_EXTS):
                    fpath = os.path.join(root, fname)
                    print(f"Processing {fpath}")
                    result = analyze_file(fpath)
                    if result:
                        results.append(result)
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main() 