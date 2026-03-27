"""
search.py — KnowSeek.Ai — PartSeek Module
─────────────────────────────────────────
Searches ChromaDB for fastener and part documents.
Uses same ChromaDB as all KnowSeek modules,
filtered by module="partseek".

Version: rev07_002 — 27.03.2026 21:10
Branch:  main_sia08

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
        3.1 get_confidence_signal()
        3.2 format_part_result()
    4. Main Functions
        4.1 get_collection()
        4.2 search_part()
        4.3 search_part_with_filter()
    5. Run
"""

# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
from pathlib import Path

import chromadb
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

DB_PATH         = str(Path(__file__).resolve().parents[3] / "chroma_db")
COLLECTION_NAME = "knowseek"   # ONE collection for all modules
MODULE          = "partseek"   # this module's filter value
N_RESULTS       = 5

# Confidence thresholds
THRESHOLD_GREEN  = 0.85
THRESHOLD_YELLOW = 0.60

# Thread sizes we support
THREAD_SIZES = ["M4", "M5", "M6", "M8", "M10", "M12", "M14", "M16", "M20"]

# Length range (mm)
LENGTH_MIN = 10
LENGTH_MAX = 45

# OEM suffix mapping — from filename suffix to real OEM name
OEM_SUFFIX_MAP = {
    "_PM":  "Mercedes-Benz",
    "_PG":  "GM",
    "_PV":  "Volvo",
    "_CH":  "China / Internal",
    "_SIA": "Internal",
}

# Canonical PartSeek part types (specific -> generic order)
PART_TYPE_KEYWORDS = [
    ("flange_screw", ["flange screw", "flanschschraube", "bundschraube", "hex flange"]),
    ("threaded_insert", ["threaded insert", "gewindeeinsatz", "insert nut", "helicoil"]),
    ("rivet", ["rivet", "blind rivet", "niet", "nietmutter"]),
    ("washer", ["washer", "scheibe", "unterlegscheibe", "federscheibe"]),
    ("nut", ["nut", "mutter", "sechskantmutter", "hex nut"]),
    ("bolt", ["bolt", "bolzen", "hex bolt", "schraubbolzen"]),
    ("screw", ["screw", "schraube", "torx", "innensechskant", "socket head"]),
    ("bracket", ["bracket", "winkel", "clip", "clamp", "halter"]),
]

# Which result types are still acceptable for a specific query intent
PART_TYPE_COMPATIBILITY = {
    "flange_screw": {"flange_screw", "screw", "bolt"},
    "screw": {"screw", "flange_screw", "bolt"},
    "bolt": {"bolt", "screw", "flange_screw"},
    "nut": {"nut", "threaded_insert"},
    "washer": {"washer"},
    "rivet": {"rivet"},
    "threaded_insert": {"threaded_insert", "nut"},
    "bracket": {"bracket"},
}


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 get_confidence_signal
def get_confidence_signal(score: float) -> str:
    if score >= THRESHOLD_GREEN:
        return "GREEN"
    elif score >= THRESHOLD_YELLOW:
        return "YELLOW"
    else:
        return "RED"


def infer_part_type(text: str) -> str | None:
    """Infer canonical part type from free text using domain keywords."""
    text_low = (text or "").lower()
    for part_type, keywords in PART_TYPE_KEYWORDS:
        if any(kw in text_low for kw in keywords):
            return part_type
    return None


def rerank_by_part_type(results: list[dict], query: str) -> list[dict]:
    """
    Re-rank semantic results using query intent vs inferred part type.
    This compensates for broad categories like Supplier-Fastener.
    """
    query_type = infer_part_type(query)
    if not query_type:
        return results

    compatible = PART_TYPE_COMPATIBILITY.get(query_type, {query_type})

    for r in results:
        result_type = r.get("part_type")
        adjusted = r.get("score", 0.0)

        if result_type == query_type:
            adjusted += 0.14
        elif result_type in compatible:
            adjusted += 0.07
        elif result_type is None:
            adjusted -= 0.03
        else:
            adjusted -= 0.12

        # Keep score in [0, 1] after type-based adjustment.
        r["score"] = round(max(0.0, min(1.0, adjusted)), 4)
        r["signal"] = get_confidence_signal(r["score"])
        r["query_type"] = query_type

    results.sort(key=lambda x: x.get("score", 0.0), reverse=True)
    for i, r in enumerate(results, start=1):
        r["rank"] = i

    return results


# 3.2 format_part_result
def format_part_result(text: str, metadata: dict, distance: float, rank: int) -> dict:
    """
    Format a single ChromaDB result for PartSeek.
    Extracts part-specific info from text + metadata.
    """
    similarity = round(1 - (distance / 2), 4)

    # Try to detect thread size from text
    thread_size = None
    for t in THREAD_SIZES:
        if t.lower() in text.lower():
            thread_size = t
            break

    # Try to detect strength class from text
    strength_class = None
    for sc in ["12.9", "10.9", "8.8", "8.0", "6.8", "4.8"]:
        if sc in text:
            strength_class = sc
            break

    # Try to detect drive type from text
    drive_type = None
    for d in ["Torx", "Hex", "Innensechskant", "Phillips", "Schlitz", "TORX"]:
        if d.lower() in text.lower():
            drive_type = d
            break

    # Try to detect coating from text
    coating = None
    for c in ["verzinkt", "zinc", "Zn", "KTL", "blank", "phosphatiert"]:
        if c.lower() in text.lower():
            coating = c
            break

    # Try to detect self-locking from text
    self_locking = any(kw in text.lower() for kw in [
        "mikroverkapselung", "prevailing torque", "self-lock",
        "self locking", "klebe", "loctite",
        "kraftschlüssig", "formschlüssig", "stoffschlüssig",
        "federscheibe", "sicherungslack"
    ])

    # Try to detect norm from text
    norm = None
    for n in ["DIN EN ISO", "DIN", "MBN", "ISO", "EN"]:
        if n in text:
            idx = text.find(n)
            norm = text[idx:idx+20].strip()
            break

    # Get OEM real name from filename suffix
    filename = metadata.get("filename", "")
    oem_real = None
    for suffix, real in OEM_SUFFIX_MAP.items():
        if suffix in filename:
            oem_real = real
            break

    part_type = infer_part_type(" ".join([
        text,
        metadata.get("filename", ""),
        metadata.get("category", "")
    ]))

    return {
        "rank":           rank,
        "score":          similarity,
        "signal":         get_confidence_signal(similarity),
        "text":           text[:300] + "..." if len(text) > 300 else text,
        "oem_code":       metadata.get("oem_code", ""),
        "oem_real":       oem_real,
        "category":       metadata.get("category", ""),
        "module":         metadata.get("module", ""),
        "page":           metadata.get("page", 0),
        "norm":           norm,
        "part_type":      part_type,
        "thread_size":    thread_size,
        "strength_class": strength_class,
        "drive_type":     drive_type,
        "coating":        coating,
        "self_locking":   self_locking,
    }


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

# 4.1 get_collection
def get_collection(
    db_path: str = DB_PATH,
    collection_name: str = COLLECTION_NAME
) -> chromadb.Collection:
    """Connect to ChromaDB and return the collection."""
    ollama_ef = OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="nomic-embed-text"
    )
    client = chromadb.PersistentClient(path=db_path)
    collection = client.get_collection(
        name=collection_name,
        embedding_function=ollama_ef
    )
    return collection


# 4.2 search_part
def search_part(
    query: str,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Search for parts in ChromaDB.
    Always filters by module="partseek".

    Usage:
        results = search_part("M8 Torx screw")
        results = search_part("Flanschschraube 10.9 verzinkt")
    """
    start = time.time()
    collection = get_collection()

    raw = collection.query(
        query_texts=[query],
        n_results=n_results,
        where={"module": MODULE},
        include=["documents", "metadatas", "distances"]
    )
    elapsed = round((time.time() - start) * 1000, 1)

    results = []
    for i, (text, meta, dist) in enumerate(zip(
        raw["documents"][0],
        raw["metadatas"][0],
        raw["distances"][0]
    )):
        results.append(format_part_result(text, meta, dist, rank=i+1))

    results = rerank_by_part_type(results, query)

    if verbose:
        print(f"Query:    {query}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} {r['score']:.3f} — OEM: {r['oem_code']} ({r['oem_real'] or '?'})")
            if r["thread_size"]:    print(f"       Thread:   {r['thread_size']}")
            if r["strength_class"]: print(f"       Strength: {r['strength_class']}")
            if r["drive_type"]:     print(f"       Drive:    {r['drive_type']}")
            if r["coating"]:        print(f"       Coating:  {r['coating']}")
            if r["norm"]:           print(f"       Norm:     {r['norm']}")
            if r["self_locking"]:   print(f"       Self-locking: Yes")
            print()

    return results


# 4.3 search_part_with_filter
def search_part_with_filter(
    query: str,
    oem_code: str = None,
    thread_size: str = None,
    category: str = None,
    module: str = None,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Search parts with additional filters.
    Always includes module="partseek" filter.

    Usage:
        results = search_part_with_filter("screw", oem_code="OEM-V")
        results = search_part_with_filter("coating", thread_size="M8")
    """
    collection = get_collection()

    # Always filter by module — add optional filters on top.
    # module can be overridden for focused tracks (e.g. REQUIREMENT).
    module_filter = module or MODULE
    clauses = [{"module": module_filter}]
    if oem_code:
        clauses.append({"oem_code": oem_code})
    if category:
        clauses.append({"category": category})
    where = clauses[0] if len(clauses) == 1 else {"$and": clauses}

    start = time.time()
    raw = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=where,
        include=["documents", "metadatas", "distances"]
    )
    elapsed = round((time.time() - start) * 1000, 1)

    results = []
    for i, (text, meta, dist) in enumerate(zip(
        raw["documents"][0],
        raw["metadatas"][0],
        raw["distances"][0]
    )):
        result = format_part_result(text, meta, dist, rank=i+1)

        # Post-filter by thread size if specified
        if thread_size and result["thread_size"] != thread_size:
            continue

        results.append(result)

    results = rerank_by_part_type(results, query)

    if verbose:
        print(f"Query:    {query}")
        print(
            f"Filter:   module={module_filter} "
            f"oem={oem_code or 'all'} category={category or 'all'} thread={thread_size or 'all'}"
        )
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} {r['score']:.3f} — {r['oem_code']} | {r['thread_size']} | {r['strength_class']} | {r['drive_type']}")

    return results


# ─────────────────────────────────────────────────────
# 5. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":

    print("=" * 50)
    print("TEST 1 — Basic Part Search")
    print("=" * 50)
    results = search_part("M8 Torx screw steel")

    print("=" * 50)
    print("TEST 2 — Filtered Search (OEM-V only)")
    print("=" * 50)
    results = search_part_with_filter("flange screw", oem_code="OEM-V")

    print("=" * 50)
    print("TEST 3 — Thread Size Filter")
    print("=" * 50)
    results = search_part_with_filter("screw coating", thread_size="M8")