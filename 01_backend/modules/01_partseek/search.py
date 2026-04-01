"""
search.py — KnowSeek.Ai — PartSeek Module
─────────────────────────────────────────
Searches ChromaDB for fastener and part documents.
Uses same ChromaDB as all KnowSeek modules,
filtered by module="partseek".

Version: rev08_003 — 31.03.2026
Branch:  main_sia09

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
    4. Main Functions
    5. Run Tests
"""

# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
import re
from pathlib import Path

import chromadb
from rank_bm25 import BM25Okapi

# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

DB_PATH         = str(Path(__file__).resolve().parents[3] / "chroma_db")
COLLECTION_NAME = "knowseek"
MODULE          = "partseek"
N_RESULTS       = 5

# Confidence thresholds
THRESHOLD_GREEN  = 0.85
THRESHOLD_YELLOW = 0.60

# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

def get_confidence_signal(score: float) -> str:
    """Convert score to traffic light signal"""
    if score >= THRESHOLD_GREEN:
        return "GREEN"
    elif score >= THRESHOLD_YELLOW:
        return "YELLOW"
    else:
        return "RED"


def format_part_result(text: str, metadata: dict, distance: float, rank: int) -> dict:
    """Format search result with new metadata fields"""
    
    score = round(1 - (distance / 2), 4)
    
    # Signal based on score
    if score >= 0.7:
        signal = "GREEN"
    elif score >= 0.5:
        signal = "YELLOW"
    else:
        signal = "RED"
    
    return {
        "rank": rank,
        "score": score,
        "signal": signal,
        "text": text[:200],
        "filename": metadata.get("filename", "?"),
        "page": metadata.get("page", "?"),
        "module": metadata.get("module", "partseek"),
        "category": metadata.get("category", ""),
        
        # NEW metadata fields
        "thread": metadata.get("thread", "N/A"),
        "material": metadata.get("material", "N/A"),
        "part_type": metadata.get("part_type", "N/A"),
        "surface_color": metadata.get("surface_color", "N/A"),
        "oem": metadata.get("oem", "N/A"),
        "length": metadata.get("length", "N/A"),
        
        # Legacy (for API compatibility)
        "oem_code": metadata.get("oem", "N/A"),
        "oem_real": metadata.get("oem", None),
    }


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

def get_collection(
    db_path: str = DB_PATH,
    collection_name: str = COLLECTION_NAME
) -> chromadb.Collection:
    """Connect to ChromaDB and return collection"""
    client = chromadb.PersistentClient(path=db_path)
    collection = client.get_collection(name=collection_name)
    return collection


def search_part(
    query: str,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Hybrid Search: Semantic + BM25 with metadata boosting
    
    Steps:
    1. Get more results from ChromaDB for BM25 pool
    2. Calculate BM25 keyword scores
    3. Combine semantic + BM25 (60/40 split)
    4. Boost results where thread matches query
    5. Sort and return top N
    """
    
    start = time.time()
    collection = get_collection()
    
    # Step 1: Semantic search - get 4x results for BM25 pool
    raw = collection.query(
        query_texts=[query],
        n_results=n_results * 4,
        where={"module": MODULE},
        include=["documents", "metadatas", "distances"]
    )
    
    # Step 2: BM25 keyword scoring
    documents = raw["documents"][0]
    tokenized_docs = [doc.split() for doc in documents]
    bm25 = BM25Okapi(tokenized_docs)
    bm25_scores = bm25.get_scores(query.split())
    
    # Normalize BM25 scores to 0-1 range
    max_bm25 = max(bm25_scores) if max(bm25_scores) > 0 else 1
    normalized_bm25 = [score / max_bm25 for score in bm25_scores]
    
    # Step 3: Combine semantic + BM25 (60% semantic, 40% keyword)
    combined = []
    for i, (semantic_dist, bm25_norm) in enumerate(zip(raw["distances"][0], normalized_bm25)):
        semantic_score = 1 - semantic_dist
        hybrid_score = 0.6 * semantic_score + 0.4 * bm25_norm
        combined.append((i, hybrid_score))
    
    # Step 4: Boost if thread matches query
    query_thread = None
    for word in query.upper().split():
        if word.startswith("M") and len(word) > 1 and word[1:].replace(".", "").isdigit():
            query_thread = word
            break
    
    if query_thread:
        boosted = []
        for i, score in combined:
            doc_thread = raw["metadatas"][0][i].get("thread", "")
            if doc_thread == query_thread:
                boosted.append((i, score * 1.5))  # 50% boost for exact match
            else:
                boosted.append((i, score))
        combined = boosted
    
    # Step 5: Sort by final score and take top N
    combined.sort(key=lambda x: x[1], reverse=True)
    top_indices = [idx for idx, _ in combined[:n_results]]
    
    # Step 6: Format results
    results = []
    for rank, idx in enumerate(top_indices, 1):
        # Find final score for this index
        final_score = next(score for i, score in combined if i == idx)
        distance = 1 - final_score  # Convert back to distance for formatting
        
        results.append(format_part_result(
            raw["documents"][0][idx],
            raw["metadatas"][0][idx],
            distance,
            rank
        ))
    
    elapsed = round((time.time() - start) * 1000, 1)
    
    # Display results if verbose
    if verbose:
        print(f"Query:    {query}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} {r['score']:.3f} — OEM: {r['oem_code']} ({r['oem_real'] or '?'})")
            if r["thread"] != "N/A":        print(f"       Thread:   {r['thread']}")
            if r["material"] != "N/A":      print(f"       Material: {r['material']}")
            if r["part_type"] != "N/A":     print(f"       Type:     {r['part_type']}")
            if r["surface_color"] != "N/A": print(f"       Surface:  {r['surface_color']}")
            if r["length"] != "N/A":        print(f"       Length:   {r['length']} mm")
            print()
    
    return results


def search_part_with_filter(
    query: str,
    thread: str = None,
    oem: str = None,
    material: str = None,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Search with metadata filters
    
    Usage:
        results = search_part_with_filter("screw", thread="M8")
        results = search_part_with_filter("bolt", oem="Volvo", material="Steel")
    """
    
    collection = get_collection()
    
    # Build where filter - ChromaDB needs $and for multiple conditions
    conditions = [{"module": MODULE}]
    if thread:
        conditions.append({"thread": thread})
    if oem:
        conditions.append({"oem": oem})
    if material:
        conditions.append({"material": material})
    
    # Use $and if multiple conditions, otherwise single condition
    where = conditions[0] if len(conditions) == 1 else {"$and": conditions}
    
    start = time.time()
    raw = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=where,
        include=["documents", "metadatas", "distances"]
    )
    elapsed = round((time.time() - start) * 1000, 1)
    
    # Format results
    results = []
    for i, (text, meta, dist) in enumerate(zip(
        raw["documents"][0],
        raw["metadatas"][0],
        raw["distances"][0]
    )):
        results.append(format_part_result(text, meta, dist, rank=i+1))
    
    if verbose:
        print(f"Query:    {query}")
        print(f"Filter:   thread={thread or 'all'} oem={oem or 'all'} material={material or 'all'}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} {r['score']:.3f} — {r['oem']} | {r['thread']} | {r['material']}")
            print()
    
    return results


# ─────────────────────────────────────────────────────
# 5. RUN TESTS
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    
    print("=" * 50)
    print("TEST 1 — Hybrid Search")
    print("=" * 50)
    search_part("M8 Torx screw steel")
    
    print("=" * 50)
    print("TEST 2 — Filtered Search")
    print("=" * 50)
    search_part_with_filter("screw", thread="M8")
    
    print("=" * 50)
    print("TEST 3 — OEM Filter")
    print("=" * 50)
    search_part_with_filter("bolt", oem="Volvo")