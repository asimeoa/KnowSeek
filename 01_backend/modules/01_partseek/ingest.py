"""
ingest.py — KnowSeek.Ai — PartSeek Module
─────────────────────────────────────────
PartSeek uses the same ChromaDB as DocSeek.
Parts are ingested via DocSeek ingest.py with
category="Bolts+Torque" automatically assigned.

Version: rev05_003 21.03.2026 16:58
Branch:  main_sia05

How it works:
    1. Put part datasheets in 05_data/01_Fasteners/
    2. Run DocSeek ingest.py
    3. Files with keywords (screw, bolt, flange, torx, hex, nut, din, mbn)
       are automatically tagged category="Bolts+Torque"
    4. PartSeek search.py finds them via category filter

To add new parts:
    → Add PDF to 05_data/01_Fasteners/
    → Run: python 01_backend/modules/02_docseek/ingest.py
    → PartSeek finds them automatically

File naming convention:
    PART-DESCRIPTION_OEM.pdf
    e.g. Hexagon-Screw-M8_PV.pdf  → OEM-V (Volvo)
         Flange-Bolt-M10_PM.pdf   → OEM-G (Mercedes-Benz)
         DIN-34802_SIA.pdf        → Internal

OEM Suffix Mapping:
    _PM → Mercedes-Benz (OEM-G) — US Presidents theme
    _PG → GM            (OEM-M) — Disney theme
    _PV → Volvo         (OEM-Z) — Greek Gods theme
    _CH → China/Internal(OEM-S) — Musicians theme
    _SIA → Internal     (own)   — Project owner

Phase 2 — Planned:
    → Image ingestion via LLaVA
    → Structured metadata extraction
    → Supplier database integration
"""

import sys
from pathlib import Path

# Point to DocSeek ingest
DOCSEEK_PATH = Path(__file__).resolve().parents[1] / "02_docseek"
sys.path.insert(0, str(DOCSEEK_PATH))


def run_partseek_ingest():
    """
    PartSeek ingest runs DocSeek ingest.
    Parts in 05_data/01_Fasteners/ are auto-tagged Bolts+Torque.
    """
    from ingest import run_ingest
    print("PartSeek ingest — running DocSeek ingest pipeline...")
    print("Parts in 05_data/01_Fasteners/ will be tagged category=Bolts+Torque")
    print()
    summary = run_ingest()
    print()
    print("✅ PartSeek data ready in ChromaDB")
    print("   Use search.py to find parts")
    return summary


if __name__ == "__main__":
    run_partseek_ingest()
