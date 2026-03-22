"""
check_pdfs.py — KnowSeek.Ai — DocSeek Module
─────────────────────────────────────────────
Checks all PDFs for readable text.
Auto-converts image-only PDFs via OCR.
Flags files that cannot be converted — needs YOLO (Phase 2).

Version: rev05_003 | Date: 22.03.2026 17:16
Branch:  main_sia05 

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
        3.1 check_single_pdf()
        3.2 convert_with_ocr()
    4. Main Functions
        4.1 run_check()
    5. Run
"""


# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

from pathlib import Path
import pdfplumber
import pytesseract
import fitz          # PyMuPDF
from PIL import Image
from fpdf import FPDF


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

MIN_CHARS = 10       # minimum chars to consider a PDF readable
OCR_DPI   = 200      # DPI for image extraction
OCR_LANG  = "deu+eng"


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 check_single_pdf
def check_single_pdf(pdf_path: Path) -> int:
    """
    Check how many chars a PDF has on page 1.
    Returns 0 if no text found.
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = pdf.pages[0].extract_text()
            return len(text) if text else 0
    except Exception:
        return 0


# 3.2 convert_with_ocr
def convert_with_ocr(pdf_path: Path) -> bool:
    """
    Convert image-only PDF to searchable PDF via OCR.
    Overwrites the original file with searchable version.
    Returns True if successful, False if failed.
    """
    try:
        # Extract page as image
        doc      = fitz.open(pdf_path)
        page     = doc[0]
        pix      = page.get_pixmap(dpi=OCR_DPI)
        img_path = pdf_path.parent / (pdf_path.stem + "_temp_ocr.png")
        pix.save(str(img_path))
        doc.close()

        # Run OCR
        img      = Image.open(img_path)
        ocr_text = pytesseract.image_to_string(img, lang=OCR_LANG)
        img_path.unlink()  # delete temp image

        if len(ocr_text.strip()) < MIN_CHARS:
            return False

        # Save as searchable PDF
        pdf_out = FPDF()
        pdf_out.add_page()
        pdf_out.set_font("Helvetica", size=9)
        pdf_out.set_auto_page_break(auto=True, margin=15)

        for line in ocr_text.split("\n"):
            safe_line = line.encode("latin-1", "replace").decode("latin-1")
            pdf_out.cell(0, 5, safe_line, ln=True)

        pdf_out.output(str(pdf_path))
        return True

    except Exception:
        # Clean up temp file if it exists
        temp = pdf_path.with_suffix("_temp_ocr.png")
        if temp.exists():
            temp.unlink()
        return False


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

# 4.1 run_check
def run_check(data_path: Path = None) -> dict:
    """
    Check all PDFs in data_path for readable text.
    Auto-converts image-only PDFs via OCR.
    Flags files that still cannot be read after OCR.

    Step 1: Check each PDF — how many chars?
    Step 2: If 0 chars → OCR automatically applied
    Step 3: Check again after OCR
    Step 4: If still 0 chars → needs YOLO (Phase 2)

    Usage:
        from check_pdfs import run_check
        run_check(data_path=Path("../05_data"))
    """
    if data_path is None:
        data_path = Path(__file__).resolve().parents[2] / "05_data"

    readable  = []
    converted = []
    failed    = []

    pdf_files = list(data_path.rglob("*.pdf"))

    print(f"Checking {len(pdf_files)} PDFs in {data_path.name}/")
    print()

    for f in pdf_files:
        chars = check_single_pdf(f)

        if chars >= MIN_CHARS:
            readable.append(f.name)
        else:
            success = convert_with_ocr(f)
            if success:
                converted.append(f.name)
            else:
                failed.append(f.name)

    print(f"✅ Readable:   {len(readable)} files — text already extractable")
    print(f"🔄 Converted:  {len(converted)} files — OCR applied successfully")
    print()
    if failed:
        print(f"⚠️  Cannot read: {len(failed)} files — needs YOLO (Phase 2)")
    else:
        print("✅ All files are now readable")

    return {
        "readable":  len(readable),
        "converted": len(converted),
        "failed":    len(failed),
        "total":     len(pdf_files)
    }


# ─────────────────────────────────────────────────────
# 5. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    DATA_PATH = Path(__file__).resolve().parents[2] / "05_data"
    result = run_check(data_path=DATA_PATH)
    print()
    print(f"Summary: {result['total']} total | "
          f"{result['readable']} readable | "
          f"{result['converted']} converted | "
          f"{result['failed']} failed")
