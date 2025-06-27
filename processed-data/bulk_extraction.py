import os
import re
import sys
import shutil
from html.parser import HTMLParser
import xml.etree.ElementTree as ET

# Paths
GAPS_REPORT = 'data/processing_gaps_report.md'
EXTRACTED_TEXT_DIR = 'data/extracted_text/'
ERROR_LOG = 'processed-data/extraction_errors.log'

# Ensure output dir exists
os.makedirs(EXTRACTED_TEXT_DIR, exist_ok=True)

def get_missing_files():
    files = []
    in_section = False
    with open(GAPS_REPORT, 'r') as f:
        for line in f:
            if line.strip().startswith('## Files missing from extracted_text/'):
                in_section = True
                continue
            if in_section:
                if line.strip().startswith('##'):
                    break
                m = re.match(r'- (.+)', line.strip())
                if m:
                    files.append(m.group(1))
    return files

def extract_pdf(file_path, out_path):
    # Try to use pdftotext if available
    if shutil.which('pdftotext'):
        os.system(f'pdftotext "{file_path}" "{out_path}"')
        return os.path.exists(out_path)
    # Fallback: log as needing manual extraction
    return False

def extract_rtf(file_path, out_path):
    # No stdlib RTF parser, log as needing manual extraction
    return False

def extract_html(file_path, out_path):
    class MyHTMLParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.text = []
        def handle_data(self, data):
            if data.strip():
                self.text.append(data.strip())
    parser = MyHTMLParser()
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        parser.feed(f.read())
    with open(out_path, 'w', encoding='utf-8') as out:
        out.write('\n'.join(parser.text))
    return True

def extract_xml(file_path, out_path):
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        text = []
        for elem in root.iter():
            if elem.text and elem.text.strip():
                text.append(elem.text.strip())
        with open(out_path, 'w', encoding='utf-8') as out:
            out.write('\n'.join(text))
        return True
    except Exception:
        return False

def extract_csv(file_path, out_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        with open(out_path, 'w', encoding='utf-8') as out:
            out.write(content)
        return True
    except Exception:
        return False

def main():
    missing_files = get_missing_files()
    errors = []
    for filename in missing_files:
        base, ext = os.path.splitext(filename)
        ext = ext.lower().strip('.')
        # Output path
        out_path = os.path.join(EXTRACTED_TEXT_DIR, base + '.txt')
        # Skip if already extracted
        if os.path.exists(out_path):
            continue
        # Find the file in data dirs
        found = False
        for root, dirs, files in os.walk('data'):
            if filename in files:
                file_path = os.path.join(root, filename)
                found = True
                break
        if not found:
            errors.append(f'File not found: {filename}')
            continue
        # Extraction logic
        success = False
        if ext == 'pdf':
            success = extract_pdf(file_path, out_path)
            if not success:
                errors.append(f'PDF extraction failed or needs manual: {filename}')
        elif ext == 'rtf':
            success = extract_rtf(file_path, out_path)
            if not success:
                errors.append(f'RTF extraction needs manual: {filename}')
        elif ext == 'html' or ext == 'htm':
            success = extract_html(file_path, out_path)
            if not success:
                errors.append(f'HTML extraction failed: {filename}')
        elif ext in ('png', 'jpg', 'jpeg', 'tif', 'tiff', 'bmp'):  # images
            errors.append(f'Image file needs OCR/manual extraction: {filename}')
        elif ext == 'xml':
            success = extract_xml(file_path, out_path)
            if not success:
                errors.append(f'XML extraction failed: {filename}')
        elif ext == 'csv':
            success = extract_csv(file_path, out_path)
            if not success:
                errors.append(f'CSV extraction failed: {filename}')
        else:
            errors.append(f'Unknown or unsupported file type: {filename}')
    # Write errors
    if errors:
        with open(ERROR_LOG, 'w') as f:
            for err in errors:
                f.write(err + '\n')
    print(f'Extraction complete. {len(errors)} issues logged to {ERROR_LOG}')

if __name__ == '__main__':
    main() 