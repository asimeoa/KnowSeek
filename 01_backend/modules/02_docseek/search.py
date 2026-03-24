"""
search.py — KnowSeek.Ai — DocSeek Module 
─────────────────────────────────────────
Searches ChromaDB for relevant chunks.
Returns results with confidence score 🟢🟡🔴s

Version: rev05_004 24.03.2026 12:11
Branch:  main_sia06 

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
        3.1 get_confidence_signal()
        3.2 format_result()
    4. Main Functions
        4.1 get_collection()
        4.2 search()
        4.3 search_with_filter()
        4.4 search_multi()
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

BASE_PATH = Path(__file__).resolve().parents[3]
DB_PATH = str(BASE_PATH / "chroma_db")
COLLECTION_NAME = "docseek"
N_RESULTS       = 5       # how many chunks to return per query

# Confidence thresholds
THRESHOLD_GREEN  = 0.85   # > 85% → 🟢 Reliable
THRESHOLD_YELLOW = 0.60   # 60-85% → 🟡 Check source


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 get_confidence_signal
def get_confidence_signal(score: float) -> str:
    """
    Convert a similarity score to a traffic light signal.

    ChromaDB cosine distance: 0 = identical, 2 = opposite
    We convert to similarity: 1 - (distance / 2)

    Returns: "🟢 Green", "🟡 Yellow", or "🔴 Red"
    """
    if score >= THRESHOLD_GREEN:
        return "GREEN"
    elif score >= THRESHOLD_YELLOW:
        return "YELLOW"
    else:
        return "RED"


# 3.2 format_result
def format_result(text: str, metadata: dict, distance: float, rank: int) -> dict:
    """
    Format a single ChromaDB result into a clean dict.
    Converts cosine distance to similarity score.
    """
    similarity = round(1 - (distance / 2), 4)

    return {
        "rank":       rank,
        "score":      similarity,
        "signal":     get_confidence_signal(similarity),
        "text":       text[:300] + "..." if len(text) > 300 else text,
        "filename":   metadata.get("filename", "unknown"),
        "page":       metadata.get("page", 0),
        "source_id":  metadata.get("source_id", ""),
        "oem_code":   metadata.get("oem_code", ""),
        "category":   metadata.get("category", ""),
        "doc_type":   metadata.get("doc_type", ""),
        "language":   metadata.get("language", ""),
    }


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

# 4.1 get_collection
def get_collection(
    db_path: str = DB_PATH,
    collection_name: str = COLLECTION_NAME
) -> chromadb.Collection:
    """
    Connect to ChromaDB and return the collection.
    Uses nomic-embed-text via Ollama for embeddings.

    Usage:
        collection = get_collection()
    """
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


# 4.2 search
def search(
    query: str,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Search ChromaDB for chunks relevant to the query.
    Returns list of results with score + metadata.

    Usage:
        results = search("salt spray test OEM-V")
        results = search("Schrauben M16 Korrosion", n_results=3)
    """
    start = time.time()
    collection = get_collection()

    raw = collection.query(
        query_texts=[query],
        n_results=n_results,
        include=["documents", "metadatas", "distances"]
    )

    elapsed = round((time.time() - start) * 1000, 1)

    results = []
    for i, (text, meta, dist) in enumerate(zip(
        raw["documents"][0],
        raw["metadatas"][0],
        raw["distances"][0]
    )):
        results.append(format_result(text, meta, dist, rank=i+1))

    if verbose:
        print(f"Query:    {query}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} {r['score']:.3f} — {r['filename']} p.{r['page']}")
            print(f"       {r['text'][:120]}...")
            print()

    return results


# 4.3 search_with_filter
def search_with_filter(
    query: str,
    oem_code: str = None,
    category: str = None,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Search with metadata filter — e.g. only OEM-V docs.

    Usage:
        results = search_with_filter("salt spray", oem_code="OEM-V")
        results = search_with_filter("coating", category="Painting")
    """
    collection = get_collection()

    where = {}
    if oem_code and category:
        where = {"$and": [{"oem_code": oem_code}, {"category": category}]}
    elif oem_code:
        where = {"oem_code": oem_code}
    elif category:
        where = {"category": category}

    start = time.time()
    raw = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=where if where else None,
        include=["documents", "metadatas", "distances"]
    )
    elapsed = round((time.time() - start) * 1000, 1)

    results = []
    for i, (text, meta, dist) in enumerate(zip(
        raw["documents"][0],
        raw["metadatas"][0],
        raw["distances"][0]
    )):
        results.append(format_result(text, meta, dist, rank=i+1))

    if verbose:
        filter_info = f"oem={oem_code or 'all'} category={category or 'all'}"
        print(f"Query:    {query}")
        print(f"Filter:   {filter_info}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} {r['score']:.3f} — {r['filename']} p.{r['page']}")

    return results


# 4.4 search_multi
def search_multi(
    queries: list[str],
    n_results: int = 3,
    verbose: bool = True
) -> dict[str, list[dict]]:
    """
    Run multiple queries at once — for OEM comparison.
    Returns dict with query as key and results as value.

    Usage:
        results = search_multi([
            "salt spray test OEM-V",
            "salt spray test OEM-W",
            "salt spray test OEM-G"
        ])
    """
    all_results = {}

    if verbose:
        print(f"Multi-search: {len(queries)} queries")
        print()

    for query in queries:
        results = search(query, n_results=n_results, verbose=verbose)
        all_results[query] = results

    return all_results


# ─────────────────────────────────────────────────────
# 5. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":

    print("=" * 50)
    print("TEST 1 — Basic Search")
    print("=" * 50)
    results = search("salt spray test corrosion requirements")

    print("=" * 50)
    print("TEST 2 — Filtered Search (Painting only)")
    print("=" * 50)
    results = search_with_filter("coating standard", category="Painting")

    print("=" * 50)
    print("TEST 3 — Multi Search (OEM Comparison)")
    print("=" * 50)
    results = search_multi([
        "corrosion performance standard",
        "salt spray test hours",
        "cathodic e-coating requirements"
    ])
