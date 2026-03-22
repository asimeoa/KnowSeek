"""
answer.py — KnowSeek.Ai — PartSeek Module
─────────────────────────────────────────
Returns structured part results.
No LLM needed — direct metadata display.

Version: rev05_003
Branch:  main_sia05

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
        3.1 format_answer()
        3.2 check_collision()
    4. Main Functions
        4.1 find_part()
        4.2 find_part_with_filter()
    5. Run
"""


# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import sys
import time
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
from search import search_part, search_part_with_filter


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

COLLISION_THRESHOLD = 0.85   # Score above this = possible duplicate


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 format_answer
def format_answer(query: str, results: list[dict], elapsed_ms: float) -> dict:
    """
    Format PartSeek results into clean response.
    No LLM — direct structured data.
    """
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
        "query":      query,
        "found":      True,
        "confidence": top["score"],
        "signal":     top["signal"],
        "signal_icon": {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(top["signal"], "⚪"),
        "results":    results,
        "time_ms":    elapsed_ms,
    }


# 3.2 check_collision
def check_collision(results: list[dict]) -> dict:
    """
    Check if a similar part already exists.
    Returns warning if score > COLLISION_THRESHOLD.

    This is the Team Collision Warning feature:
    "A colleague recently searched for a similar part."
    """
    if not results:
        return {"collision": False}

    top = results[0]
    if top["score"] >= COLLISION_THRESHOLD:
        return {
            "collision": True,
            "message":   "⚠️ A similar part already exists. Check before creating a new one.",
            "score":     top["score"],
            "oem_code":  top["oem_code"],
        }
    return {"collision": False}


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

# 4.1 find_part
def find_part(
    query: str,
    verbose: bool = True
) -> dict:
    """
    Find parts matching the query.
    Returns structured list — no LLM.

    Usage:
        result = find_part("M8 Torx screw 10.9")
        result = find_part("Flanschschraube verzinkt")
    """
    start = time.time()
    results = search_part(query, verbose=False)
    elapsed = round((time.time() - start) * 1000, 1)

    answer = format_answer(query, results, elapsed)
    collision = check_collision(results)

    if verbose:
        print(f"Query:    {query}")
        print(f"Found:    {len(results)} parts")
        print(f"Time:     {elapsed}ms")
        print()

        for r in results:
            icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  {icon} Score: {r['score']:.3f} — OEM: {r['oem_code']} ({r['oem_real'] or '?'})")
            if r["thread_size"]:    print(f"     Thread:        {r['thread_size']}")
            if r["strength_class"]: print(f"     Strength:      {r['strength_class']}")
            if r["drive_type"]:     print(f"     Drive:         {r['drive_type']}")
            if r["coating"]:        print(f"     Coating:       {r['coating']}")
            if r["norm"]:           print(f"     Norm:          {r['norm']}")
            if r["self_locking"]:   print(f"     Self-locking:  Yes")
            print()

        if collision["collision"]:
            print(collision["message"])

    return {**answer, "collision": collision}


# 4.2 find_part_with_filter
def find_part_with_filter(
    query: str,
    oem_code: str = None,
    thread_size: str = None,
    verbose: bool = True
) -> dict:
    """
    Find parts with specific filters.

    Usage:
        result = find_part_with_filter("screw", oem_code="OEM-V")
        result = find_part_with_filter("coating", thread_size="M8")
    """
    start = time.time()
    results = search_part_with_filter(
        query,
        oem_code=oem_code,
        thread_size=thread_size,
        verbose=False
    )
    elapsed = round((time.time() - start) * 1000, 1)

    answer = format_answer(query, results, elapsed)
    collision = check_collision(results)

    if verbose:
        print(f"Query:    {query}")
        print(f"Filter:   oem={oem_code or 'all'} thread={thread_size or 'all'}")
        print(f"Found:    {len(results)} parts")
        print(f"Time:     {elapsed}ms")
        print()

        for r in results:
            icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  {icon} {r['oem_code']} | {r['thread_size']} | {r['strength_class']} | {r['drive_type']}")

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
    result = find_part("M8 Torx screw steel 10.9")

    print("=" * 50)
    print("TEST 2 — Find with OEM Filter")
    print("=" * 50)
    result = find_part_with_filter("flange screw", oem_code="OEM-V")

    print("=" * 50)
    print("TEST 3 — Collision Check")
    print("=" * 50)
    result = find_part("DIN 34802 screw")
