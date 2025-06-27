import os
import re
import shutil
import subprocess

ERROR_LOG = 'processed-data/extraction_errors.log'
EXTRACTED_TEXT_DIR = 'data/extracted_text/'
MANUAL_ERROR_LOG = 'processed-data/manual_extraction_errors.log'

os.makedirs(EXTRACTED_TEXT_DIR, exist_ok=True)

def get_error_files():
    files = []
    with open(ERROR_LOG, 'r') as f:
        for line in f:
            m = re.search(r': (.+)$', line.strip())
            if m:
                files.append(m.group(1))
    return files

def is_mac():
    return sys.platform == 'darwin'

def run_textutil(rtf_path, txt_path):
    try:
        subprocess.run(['textutil', '-convert', 'txt', rtf_path, '-output', txt_path], check=True)
        return os.path.exists(txt_path)
    except Exception:
        return False

def run_tesseract(img_path, txt_path):
    try:
        subprocess.run(['tesseract', img_path, txt_path[:-4]], check=True)  # tesseract adds .txt
        # tesseract outputs to txt_path without .txt, so add .txt
        tesseract_out = txt_path[:-4] + '.txt'
        if os.path.exists(tesseract_out):
            shutil.move(tesseract_out, txt_path)
            return True
        return False
    except Exception:
        return False

def main():
    files = get_error_files()
    errors = []
    for filename in files:
        base, ext = os.path.splitext(filename)
        ext = ext.lower().strip('.')
        out_path = os.path.join(EXTRACTED_TEXT_DIR, base + '.txt')
        # Skip if already extracted
        if os.path.exists(out_path):
            continue
        # Find the file in data dirs
        found = False
        for root, dirs, files_in_dir in os.walk('data'):
            if filename in files_in_dir:
                file_path = os.path.join(root, filename)
                found = True
                break
        if not found:
            errors.append(f'File not found: {filename}')
            continue
        # RTF extraction
        if ext == 'rtf':
            if is_mac() and shutil.which('textutil'):
                success = run_textutil(file_path, out_path)
                if not success:
                    errors.append(f'RTF extraction failed: {filename}')
            else:
                errors.append(f'RTF extraction needs manual (not macOS or textutil missing): {filename}')
        # Image OCR
        elif ext in ('png', 'jpg', 'jpeg', 'tif', 'tiff', 'bmp'):
            if shutil.which('tesseract'):
                success = run_tesseract(file_path, out_path)
                if not success:
                    errors.append(f'OCR failed: {filename}')
            else:
                errors.append(f'OCR needs manual (tesseract missing): {filename}')
        # Copy .txt files
        elif ext == 'txt':
            if not os.path.exists(out_path):
                shutil.copy(file_path, out_path)
        else:
            errors.append(f'Unknown or unsupported file type: {filename}')
    # Write errors
    if errors:
        with open(MANUAL_ERROR_LOG, 'w') as f:
            for err in errors:
                f.write(err + '\n')
    print(f'Manual extraction complete. {len(errors)} issues logged to {MANUAL_ERROR_LOG}')

if __name__ == '__main__':
    import sys
    main() 