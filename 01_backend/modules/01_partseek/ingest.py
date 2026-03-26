"""
ingest.py — KnowSeek.Ai — PartSeek Module
─────────────────────────────────────────
PartSeek uses the same ChromaDB as DocSeek and all KnowSeek modules,
but with module="partseek" tag for filtering.
Parts are ingested via DocSeek ingest.py.
Category and module are assigned automatically.

Version: rev06_001 — 25.03.2026 08:57
Branch:  main_sia07

How it works:
    1. Put part datasheets in 05_data/01_Fasteners/
    2. Run this file or DocSeek ingest.py directly
    3. Files are auto-tagged by category:
       OEM-Fastener      → MBN, DIN norms
       Supplier-Fastener → Screw, Bolt, Torx datasheets
       Bracket           → Winkel, Clip, Halter
    4. All PartSeek categories get module="partseek"
    5. PartSeek search.py finds them via module filter

To add new parts:
    → Add PDF to 05_data/01_Fasteners/
    → Run: python 01_backend/modules/01_partseek/ingest.py
    → PartSeek finds them automatically

File naming convention
!(only for the published dataset, not required for ingestion. later use the original as you have it):
    PART-DESCRIPTION_OEM.pdf
    e.g. Hexagon-Screw-M8_PV.pdf  → OEM-Z (Volvo)
         Flange-Bolt-M10_PM.pdf   → OEM-G (Mercedes-Benz)
         DIN-34802_SIA.pdf        → Internal
         MBN-10101_PM.pdf         → OEM-G (Mercedes-Benz)

OEM Suffix Mapping:
    _PM  → Mercedes-Benz (OEM-G) — US Presidents theme
    _PG  → GM            (OEM-M) — Disney theme
    _PV  → Volvo         (OEM-Z) — Greek Gods theme
    _CH  → China/Internal(OEM-S) — Musicians theme
    _SIA → Internal      (own)   — Project owner

Part Categories (all get module="partseek"):
    OEM-Fastener      → OEM norms (MBN, DIN)
    Supplier-Fastener → Supplier datasheets (screws, bolts)
    Bracket           → Brackets, clips, holders

Phase 2 — Planned:
    → Image ingestion via YOLO / LLaVA
    → Structured metadata extraction
    → Supplier database integration (EJoT, Würth, Fischer)
    → Self-locking detection (Mikroverkapselung, Prevailing Torque)
"""

import sys
from pathlib import Path

# ─────────────────────────────────────────────────────
# Point to DocSeek ingest — shared pipeline
# ─────────────────────────────────────────────────────
DOCSEEK_PATH = Path(__file__).resolve().parents[1] / "02_docseek"
sys.path.insert(0, str(DOCSEEK_PATH))


def run_partseek_ingest():
    """
    PartSeek ingest runs DocSeek ingest pipeline.
    All part files are auto-tagged with correct category + module="partseek".

    Usage:
        python 01_backend/modules/01_partseek/ingest.py
    """
    from ingest import run_ingest

    print("PartSeek ingest — running DocSeek ingest pipeline...")
    print("Categories assigned automatically:")
    print("  OEM-Fastener      → MBN, DIN norms")
    print("  Supplier-Fastener → Screw, Bolt, Torx datasheets")
    print("  Bracket           → Winkel, Clip, Halter")
    print("  module=partseek   → all above categories")
    print()

    summary = run_ingest()

    print()
    print("✅ PartSeek data ready in ChromaDB collection 'knowseek'")
    print("   Filter: module='partseek'")
    print("   Use search.py to find parts")
    return summary


if __name__ == "__main__":
    run_partseek_ingest()