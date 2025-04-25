import fitz  # PyMuPDF
import re

def extract_and_clean_pdf(file_path: str) -> list[str]:
    doc = fitz.open(file_path)
    text = "\n".join(page.get_text() for page in doc)

    # 1. 레퍼런스, 목차, figure caption 제거
    lines = text.split("\n")
    clean_lines = []
    for line in lines:
        if re.match(r"^\s*\d+\s*$", line):  # page number
            continue
        if "table of contents" in line.lower():
            continue
        if "references" in line.lower():
            break
        if re.match(r"^\s*fig(ure)?\s*\d+[:.]?", line.lower()):
            continue
        clean_lines.append(line.strip())

    clean_text = "\n".join(clean_lines)
    paragraphs = [p for p in clean_text.split("\n\n") if len(p) > 50]
    return paragraphs
