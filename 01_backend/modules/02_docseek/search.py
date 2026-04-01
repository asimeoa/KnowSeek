"""
search.py — KnowSeek.Ai — DocSeek Module
─────────────────────────────────────────
Searches ChromaDB for relevant chunks.
Returns results with confidence score 🟢🟡🔴

Version: rev08_001 — 30.03.2026
Branch:  main_sia09

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
        3.1 get_confidence_signal()
        3.2 format_result()
        3.3 check_domain_relevance()
        3.4 rerank_with_bm25()
    4. Main Functions
        4.1 get_collection()
        4.2 search()
        4.3 search_with_filter()
        4.4 search_multi()
    5. Run

Hybrid Search Strategy (rev06_002):
    Step 1 — Domain Check:
        Query has no domain keywords → RED immediately
        No ChromaDB or llama3 call needed → faster

    Step 2 — ChromaDB Semantic Search:
        Find top N chunks by vector similarity

    Step 3 — BM25 Reranking:
        Score returned chunks by keyword match
        BM25 = 0 → no keywords matched → RED
        BM25 > 0 → keywords found → keep original signal

    Why this works:
        ChromaDB answers: "Which chunk is most similar?"
        BM25 answers:     "Does this query match our knowledge?"
        Combined:         Accurate + fast + no extra LLM call
"""


# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
from pathlib import Path

import chromadb
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction
from rank_bm25 import BM25Okapi


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

DB_PATH         = str(Path(__file__).resolve().parents[3] / "chroma_db")
COLLECTION_NAME = "knowseek"   # ONE collection for all modules
MODULE          = "docseek"    # this module's filter value
N_RESULTS       = 5

# Confidence thresholds
THRESHOLD_GREEN  = 0.85   # > 85% → 🟢 Reliable
THRESHOLD_YELLOW = 0.60   # 60-85% → 🟡 Check source

# Domain keywords — automotive engineering
# If NONE of these appear in query → RED immediately
DOMAIN_KEYWORDS = [
    # Corrosion
    "corrosion", "salt spray", "ktl", "aging", "rust",
    "korrosion", "salzsprüh", "korrosionsschutz",
    # Painting / Coating
    "paint", "coating", "e-coat", "zinc", "zink",
    "beschichtung", "lackierung", "phosphat",
    # Standards / Norms
    "oem", "norm", "standard", "spec", "requirement",
    "anforderung", "lastenheft", "din", "iso", "mbn", "vda",
    # Parts
    "screw", "bolt", "nut", "flange", "torx", "hex",
    "schraube", "mutter", "flansch", "bracket", "winkel",
    # Test methods
    "test", "prüf", "cyclic", "spray", "humidity",
    "temperature", "duration", "hours", "weeks",
    # OEM names (anonymized)
    "oem-g", "oem-m", "oem-z", "oem-h", "oem-s",
]


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 get_confidence_signal
def get_confidence_signal(score: float) -> str:
    """
    Convert similarity score to traffic light signal.
    ChromaDB cosine distance: 0 = identical, 2 = opposite
    Converted to similarity: 1 - (distance / 2)
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
        "module":     metadata.get("module", ""),
        "doc_type":   metadata.get("doc_type", ""),
        "language":   metadata.get("language", ""),
    }


# 3.3 check_domain_relevance
def check_domain_relevance(query: str) -> bool:
    """
    Check if query contains automotive domain keywords.
    Returns False → RED immediately, no ChromaDB call needed.
    Returns True  → proceed with semantic search.

    This is Step 1 of the Hybrid Search pipeline.
    Prevents nonsense queries from getting YELLOW signal.
    """
    query_lower = query.lower()
    return any(kw in query_lower for kw in DOMAIN_KEYWORDS)


def build_chroma_where(where_filter: dict | None, module: str) -> dict:
    """Build valid Chroma where filter with a single top-level operator."""
    if not where_filter:
        return {"module": module}

    where = dict(where_filter)
    where["module"] = module

    if "$and" in where or "$or" in where:
        return where
    if len(where) == 1:
        return where
    return {"$and": [{k: v} for k, v in where.items()]}


# 3.4 rerank_with_bm25
def rerank_with_bm25(query: str, results: list[dict]) -> list[dict]:
    """
    Rerank ChromaDB results using BM25 keyword scoring.
    This is Step 3 of the Hybrid Search pipeline.

    BM25 = 0.0 → no keywords matched in chunk → override to RED
    BM25 > 0.0 → keywords found → keep original ChromaDB signal

    Why BM25 after ChromaDB:
        ChromaDB: "Which chunk is most similar?" (relative)
        BM25:     "Does this query match the chunk?" (absolute)
        Combined: Best of both worlds

    Usage:
        results = search_chromadb(query)
        results = rerank_with_bm25(query, results)
    """
    if not results:
        return results

    # Tokenize all chunks
    corpus = [r["text"].lower().split() for r in results]
    bm25   = BM25Okapi(corpus)

    # Score query against all chunks
    scores = bm25.get_scores(query.lower().split())

    for i, r in enumerate(results):
        r["bm25_score"] = round(float(scores[i]), 3)

        # Override signal if BM25 = 0 (no keywords matched)
        if scores[i] == 0.0:
            r["signal"] = "RED"

    return results


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
    where_filter: dict | None = None,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Hybrid search: Domain Check → ChromaDB → BM25 Reranking.
    Always filters by module="docseek".

    Step 1: Domain Check — no keywords → RED immediately
    Step 2: ChromaDB Semantic Search — find similar chunks
    Step 3: BM25 Reranking — keyword validation

    Usage:
        results = search("salt spray test OEM-V")
        results = search("Korrosionsanforderungen", n_results=3)
    """
    start = time.time()

    # Step 1 — Domain Check
    if not check_domain_relevance(query):
        elapsed = round((time.time() - start) * 1000, 1)
        if verbose:
            print(f"Query:    {query}")
            print(f"Signal:   🔴 RED — no domain keywords found")
            print(f"Time:     {elapsed}ms")
        return [{
            "rank":       1,
            "score":      0.0,
            "signal":     "RED",
            "bm25_score": 0.0,
            "text":       "Query contains no automotive domain keywords.",
            "filename":   "",
            "page":       0,
            "source_id":  "",
            "oem_code":   "",
            "category":   "",
            "module":     MODULE,
            "doc_type":   "",
            "language":   "",
        }]

    # Step 2 — ChromaDB Semantic Search
    collection = get_collection()
    base_where = build_chroma_where(where_filter, MODULE)

    raw = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=base_where,
        include=["documents", "metadatas", "distances"]
    )

    results = []
    for i, (text, meta, dist) in enumerate(zip(
        raw["documents"][0],
        raw["metadatas"][0],
        raw["distances"][0]
    )):
        results.append(format_result(text, meta, dist, rank=i+1))

    # Step 3 — BM25 Reranking
    results = rerank_with_bm25(query, results)

    elapsed = round((time.time() - start) * 1000, 1)

    if verbose:
        print(f"Query:    {query}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            bm25        = r.get("bm25_score", "?")
            print(f"  [{r['rank']}] {signal_icon} semantic={r['score']:.3f} bm25={bm25} — {r['filename']} p.{r['page']}")
            print(f"       {r['text'][:120]}...")
            print()

    return results


# 4.3 search_with_filter
def search_with_filter(
    query: str,
    oem_code: str = None,
    category: str = None,
    where_filter: dict | None = None,
    n_results: int = N_RESULTS,
    verbose: bool = True
) -> list[dict]:
    """
    Hybrid search with additional metadata filters.
    Always includes module="docseek" + Domain Check + BM25.

    Usage:
        results = search_with_filter("salt spray", oem_code="OEM-V")
        results = search_with_filter("coating", category="Painting")
    """
    # Step 1 — Domain Check
    if not check_domain_relevance(query):
        if verbose:
            print(f"Query:  {query}")
            print(f"Signal: 🔴 RED — no domain keywords found")
        return []

    # Step 2 — ChromaDB with filters
    collection = get_collection()

    if where_filter:
        where = build_chroma_where(where_filter, MODULE)
    else:
        where = {"module": MODULE}
        if oem_code and category:
            where = {"$and": [{"module": MODULE}, {"oem_code": oem_code}, {"category": category}]}
        elif oem_code:
            where = {"$and": [{"module": MODULE}, {"oem_code": oem_code}]}
        elif category:
            where = {"$and": [{"module": MODULE}, {"category": category}]}

    start = time.time()
    raw   = collection.query(
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
        results.append(format_result(text, meta, dist, rank=i+1))

    # Step 3 — BM25 Reranking
    results = rerank_with_bm25(query, results)

    if verbose:
        filter_info = f"oem={oem_code or 'all'} category={category or 'all'}"
        print(f"Query:    {query}")
        print(f"Filter:   {filter_info}")
        print(f"Results:  {len(results)}")
        print(f"Time:     {elapsed}ms")
        print()
        for r in results:
            signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(r["signal"], "⚪")
            print(f"  [{r['rank']}] {signal_icon} semantic={r['score']:.3f} bm25={r.get('bm25_score','?')} — {r['filename']} p.{r['page']}")

    return results


# 4.4 search_multi
def search_multi(
    queries: list[str],
    n_results: int = 3,
    verbose: bool = True
) -> dict[str, list[dict]]:
    """
    Run multiple queries — for OEM comparison.
    Each query goes through full hybrid search pipeline.

    Usage:
        results = search_multi([
            "salt spray test OEM-V",
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
    print("TEST 1 — Domain Check (should be RED)")
    print("=" * 50)
    results = search("bitcoin cryptocurrency stock market")

    print("=" * 50)
    print("TEST 2 — Salt Spray (should be YELLOW/GREEN)")
    print("=" * 50)
    results = search("salt spray test corrosion requirements")

    print("=" * 50)
    print("TEST 3 — Filtered Search")
    print("=" * 50)
    results = search_with_filter("coating standard", category="Painting")

    print("=" * 50)
    print("TEST 4 — Multi Search")
    print("=" * 50)
    results = search_multi([
        "corrosion performance standard",
        "salt spray test hours",
        "cathodic e-coating requirements"
    ])
