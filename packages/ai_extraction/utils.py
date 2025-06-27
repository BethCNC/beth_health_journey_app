import os
from PyPDF2 import PdfReader
from docx import Document

# For RTF extraction
try:
    from striprtf.striprtf import rtf_to_text
except ImportError:
    rtf_to_text = None

def extract_text_from_file(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    if ext == '.pdf':
        with open(filepath, 'rb') as f:
            reader = PdfReader(f)
            return '\n'.join(page.extract_text() or '' for page in reader.pages)
    elif ext == '.docx':
        doc = Document(filepath)
        return '\n'.join([p.text for p in doc.paragraphs])
    elif ext == '.rtf' and rtf_to_text:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return rtf_to_text(f.read())
    elif ext == '.txt':
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    else:
        return ''

def get_prompt_for_file(filepath):
    fname = os.path.basename(filepath).lower()
    if 'lab' in fname or 'cbc' in fname or 'tsh' in fname or 'panel' in fname:
        return open(os.path.join(os.path.dirname(__file__), 'prompts/lab_result.txt')).read()
    elif 'mri' in fname or 'ct' in fname or 'xray' in fname or 'imaging' in fname or 'scan' in fname:
        return open(os.path.join(os.path.dirname(__file__), 'prompts/imaging.txt')).read()
    else:
        return open(os.path.join(os.path.dirname(__file__), 'prompts/visit_note.txt')).read() 