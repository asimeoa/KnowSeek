"""
answer.py — KnowSeek.Ai — PartSeek Module
─────────────────────────────────────────
Returns structured part results.
No LLM needed — direct metadata display.

Version: rev08_004 — 01.04.2026
Branch:  main_sia09
"""

# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
import importlib.util
from pathlib import Path

partseek_search_path = Path(__file__).resolve().parent / "search.py"
spec = importlib.util.spec_from_file_location("partseek_search", partseek_search_path)
search_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(search_module)
search_part = search_module.search_part
search_part_with_filter = search_module.search_part_with_filter


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

COLLISION_THRESHOLD = 0.85


def _na(value) -> str:
    """Return readable placeholder for missing metadata."""
    if value is None or value == "N/A":
        return "N/A"
    if isinstance(value, str) and not value.strip():
        return "N/A"
    return str(value)


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

def format_answer(query: str, results: list[dict], elapsed_ms: float) -> dict:
    """Format PartSeek results into clean response."""
    if not results:
        return {
            "query":   query,
            "found":   False,
            "message": "No parts found. Try different search terms.",
            "results": [],
            "time_ms": elapsed_ms,
        }

    top = results[0]

    return {
        "query":       query,
        "found":       True,
        "confidence":  top["score"],
        "signal":      top["signal"],
        "signal_icon": {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(top["signal"], "⚪"),
        "results":     results,
        "time_ms":     elapsed_ms,
    }


def check_collision(results: list[dict]) -> dict:
    """Check if similar part exists (collision warning)."""
    if not results:
        return {"collision": False}

    top = results[0]
    if top["score"] >= COLLISION_THRESHOLD:
        return {
            "collision": True,
            "message":   "⚠️ A similar part already exists. Check before creating new one.",
            "score":     top["score"],
            "oem":       top.get("oem", "N/A"),
        }
    return {"collision": False}


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

def find_part(
    query: str,
    verbose: bool = True
) -> dict:
    """
    Find parts matching query.
    
    Usage:
        result = find_part("M8 Torx screw steel")
        result = find_part("Flanschschraube M10")
    """
    start   = time.time()
    results = search_part(query, verbose=False)
    elapsed = round((time.time() - start) * 1000, 1)

    answer    = format_answer(query, results, elapsed)
    collision = check_collision(results)

    if verbose:
        print(f"Query:    {query}")
        print(f"Found:    {len(results)} parts")
        print(f"Time:     {elapsed}ms")
        print()

        for r in results:
            icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  {icon} Score: {r['score']:.3f} — OEM: {_na(r.get('oem'))}")
            print(f"     Thread:   {_na(r.get('thread'))}")
            print(f"     Material: {_na(r.get('material'))}")
            print(f"     Type:     {_na(r.get('part_type'))}")
            print(f"     Surface:  {_na(r.get('surface_color'))}")
            print(f"     Length:   {_na(r.get('length'))} mm")
            print()

        if collision["collision"]:
            print(collision["message"])

    return {**answer, "collision": collision}


def find_part_with_filter(
    query: str,
    oem: str = None,
    thread: str = None,
    material: str = None,
    category: str = None,
    module: str = None,
    where_filter: dict | None = None,
    track_filters: dict | None = None,
    verbose: bool = True
) -> dict:
    """
    Find parts with filters.
    
    Usage:
        result = find_part_with_filter("screw", oem="Volvo")
        result = find_part_with_filter("bolt", thread="M8", material="Steel")
    """
    start   = time.time()
    results = search_part_with_filter(
        query,
        thread=thread,
        oem=oem,
        material=material,
        verbose=False
    )
    elapsed = round((time.time() - start) * 1000, 1)

    answer    = format_answer(query, results, elapsed)
    collision = check_collision(results)

    if verbose:
        print(f"Query:    {query}")
        print(f"Filter:   thread={thread or 'all'} oem={oem or 'all'} material={material or 'all'}")
        print(f"Found:    {len(results)} parts")
        print(f"Time:     {elapsed}ms")
        print()

        for r in results:
            icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  {icon} {r.get('oem')} | {r.get('thread')} | {r.get('material')} | {r.get('part_type')}")
            print()

        if collision["collision"]:
            print(collision["message"])

    return {**answer, "collision": collision}


# ─────────────────────────────────────────────────────
# 5. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    
    print("=" * 50)
    print("TEST 1 — Find Part")
    print("=" * 50)
    result = find_part("M8 Torx screw steel")
    
    print("=" * 50)
    print("TEST 2 — Find with Filter")
    print("=" * 50)
    result = find_part_with_filter("screw", thread="M8")
    
    print("=" * 50)
    print("TEST 3 — OEM Filter")
    print("=" * 50)
    result = find_part_with_filter("bolt", oem="Volvo")