"""
answer.py — KnowSeek.Ai — DocSeek Module
─────────────────────────────────────────
Takes search results from search.py,
sends them to llama3 via Ollama,
returns a clean answer with source + confidence.

Version: rev08_001 — 30.03.2026
Branch:  main_sia09

Chapters:
    1. Imports
    2. Config
    3. Helper Functions
        3.1 build_context()
        3.2 build_prompt()
        3.3 format_answer()
    4. Main Functions
        4.1 ask()
        4.2 ask_with_filter()
        4.3 compare_oems()
    5. Run

Processing Order (rev06_002):
    1. Domain Check (search.py) — no keywords → RED, stop
    2. ChromaDB Semantic Search — find similar chunks
    3. BM25 Reranking (search.py) — keyword validation
    4. llama3 — only called if signal is GREEN or YELLOW
    → llama3 is NEVER called for nonsense queries
    → faster + saves resources
"""


# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
import requests
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent))
from search import search, search_with_filter


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

OLLAMA_URL  = "http://localhost:11434/api/generate"
LLM_MODEL   = "llama3"
MAX_CONTEXT = 3      # how many chunks to send to llama3
TEMPERATURE = 0.1    # low = more focused answers


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 build_context
def build_context(results: list[dict]) -> str:
    """
    Build context string from search results.
    Only uses chunks with signal GREEN or YELLOW.
    RED chunks are excluded — BM25 said they don't match.
    """
    context_parts = []
    for r in results[:MAX_CONTEXT]:
        # Skip RED results — BM25 or domain check failed
        if r.get("signal") == "RED":
            continue
        if r["score"] < 0.60:
            continue
        part = (
            f"[Source: {r['filename']} | Page: {r['page']} | "
            f"OEM: {r['oem_code']} | Score: {r['score']}]\n"
            f"{r['text']}"
        )
        context_parts.append(part)

    return "\n\n---\n\n".join(context_parts)


# 3.2 build_prompt
def build_prompt(question: str, context: str) -> str:
    """
    Build the full prompt for llama3.
    System prompt tells llama3 to act as engineering assistant.
    """
    return f"""You are an automotive specification assistant.

Instructions:
- ONLY use the provided context
- Identify the MOST relevant chunk
- Ignore less relevant ones
- If OEM is mentioned:
  → ONLY answer for that OEM
- Be precise, not general
- If exact value exists → return it directly
- If answer is not in context → say "Not found"
- Always include the source document and page number.

DOCUMENTS:
{context}

QUESTION:
{question}

ANSWER:"""


# 3.3 format_answer
def format_answer(question: str, answer: str, results: list[dict], elapsed_ms: float) -> dict:
    """
    Format the final answer dict with all metadata.
    Uses first non-RED result as top result.
    """
    # Find first non-RED result
    top = next((r for r in results if r.get("signal") != "RED"), results[0] if results else {})

    signal_icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(
        top.get("signal", "RED"), "🔴"
    )

    sources = [
        {
            "filename": r["filename"],
            "page":     r["page"],
            "oem_code": r["oem_code"],
            "score":    r["score"],
            "signal":   r["signal"],
        }
        for r in results[:MAX_CONTEXT]
        if r.get("signal") != "RED"
    ]

    return {
        "question":    question,
        "answer":      answer.strip(),
        "confidence":  top.get("score", 0.0),
        "signal":      top.get("signal", "RED"),
        "signal_icon": signal_icon,
        "sources":     sources,
        "time_ms":     elapsed_ms,
    }


# ─────────────────────────────────────────────────────
# 4. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

# 4.1 ask
def ask(
    question: str,
    where_filter: dict | None = None,
    n_results: int = 5,
    verbose: bool = True
) -> dict:
    """
    Full RAG pipeline with Hybrid Search:
    1. Domain Check — no keywords → RED, no llama3
    2. ChromaDB Semantic Search
    3. BM25 Reranking
    4. llama3 — only for GREEN/YELLOW results

    Usage:
        result = ask("What are the salt spray test requirements?")
        result = ask("Welche Korrosionsanforderungen gibt es?")
    """
    start = time.time()

    if verbose:
        print(f"Searching for: {question}")

    # Steps 1-3 happen in search()
    results = search(
        question,
        where_filter=where_filter,
        n_results=n_results,
        verbose=False
    )

    if not results:
        return {
            "question":    question,
            "answer":      "No documents found in the database.",
            "confidence":  0.0,
            "signal":      "RED",
            "signal_icon": "🔴",
            "sources":     [],
            "time_ms":     0
        }

    # Check if all results are RED — domain check or BM25 failed
    all_red = all(r.get("signal") == "RED" for r in results)
    if all_red:
        elapsed_ms = round((time.time() - start) * 1000, 1)
        return {
            "question":    question,
            "answer":      "This query does not match the knowledge base. Please use automotive engineering terminology.",
            "confidence":  0.0,
            "signal":      "RED",
            "signal_icon": "🔴",
            "sources":     [],
            "time_ms":     elapsed_ms
        }

    # Step 4 — Build context (skips RED chunks)
    context = build_context(results)
    if not context:
        elapsed_ms = round((time.time() - start) * 1000, 1)
        return {
            "question":    question,
            "answer":      "No relevant content found above confidence threshold.",
            "confidence":  results[0]["score"],
            "signal":      "RED",
            "signal_icon": "🔴",
            "sources":     [],
            "time_ms":     elapsed_ms
        }

    # Step 5 — Send to llama3
    prompt = build_prompt(question, context)
    if verbose:
        print(f"Sending to llama3...")

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model":       LLM_MODEL,
                "prompt":      prompt,
                "stream":      False,
                "temperature": TEMPERATURE,
            },
            timeout=120
        )
        answer_text = response.json().get("response", "No response from llama3.")
    except Exception as e:
        answer_text = f"Error connecting to Ollama: {e}"

    elapsed_ms = round((time.time() - start) * 1000, 1)
    result     = format_answer(question, answer_text, results, elapsed_ms)

    if verbose:
        print()
        print("─── Answer ───────────────────────────────")
        print(f"Q: {result['question']}")
        print()
        print(f"A: {result['answer']}")
        print()
        print(f"Confidence: {result['signal_icon']} {result['confidence']:.3f}")
        print(f"Time:       {result['time_ms']}ms")
        print()
        print("Sources:")
        for s in result["sources"]:
            icon = {"GREEN": "🟢", "YELLOW": "🟡", "RED": "🔴"}.get(s["signal"], "⚪")
            print(f"  {icon} {s['filename']} p.{s['page']} ({s['oem_code']})")
        print("──────────────────────────────────────────")

    return result


# 4.2 ask_with_filter
def ask_with_filter(
    question: str,
    oem_code: str = None,
    category: str = None,
    where_filter: dict | None = None,
    verbose: bool = True
) -> dict:
    """
    Ask with metadata filter — e.g. only Painting docs.
    Full hybrid search pipeline applied.

    Usage:
        result = ask_with_filter("coating thickness", category="Painting")
        result = ask_with_filter("requirements", oem_code="OEM-G")
    """
    start   = time.time()
    results = search_with_filter(
        question,
        oem_code=oem_code,
        category=category,
        where_filter=where_filter,
        verbose=False
    )

    if not results:
        return {
            "question":    question,
            "answer":      "No results found — query may not match domain or filter.",
            "confidence":  0.0,
            "signal":      "RED",
            "signal_icon": "🔴",
            "sources":     [],
            "time_ms":     0
        }

    all_red = all(r.get("signal") == "RED" for r in results)
    if all_red:
        elapsed_ms = round((time.time() - start) * 1000, 1)
        return {
            "question":    question,
            "answer":      "No relevant content found for this query and filter combination.",
            "confidence":  0.0,
            "signal":      "RED",
            "signal_icon": "🔴",
            "sources":     [],
            "time_ms":     elapsed_ms
        }

    context    = build_context(results)
    prompt     = build_prompt(question, context)

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model":       LLM_MODEL,
                "prompt":      prompt,
                "stream":      False,
                "temperature": TEMPERATURE
            },
            timeout=120
        )
        answer_text = response.json().get("response", "No response.")
    except Exception as e:
        answer_text = f"Error: {e}"

    elapsed_ms = round((time.time() - start) * 1000, 1)
    result     = format_answer(question, answer_text, results, elapsed_ms)

    if verbose:
        print(f"{result['signal_icon']} {result['answer']}")
        if result["sources"]:
            print(f"Source: {result['sources'][0]['filename']} p.{result['sources'][0]['page']}")
        print(f"Time: {result['time_ms']}ms")

    return result


# 4.3 compare_oems
def compare_oems(
    topic: str,
    oem_codes: list[str] = None,
    verbose: bool = True
) -> dict:
    """
    Compare a topic across multiple OEM documents.
    Each OEM goes through full hybrid search pipeline.

    Usage:
        result = compare_oems("salt spray test requirements")
        result = compare_oems("corrosion", oem_codes=["OEM-G", "OEM-M"])
    """
    if oem_codes is None:
        oem_codes = ["GM", "Volvo", "MB", "DIN", "VW", "Ford", "China"]

    if verbose:
        print(f"Comparing: {topic}")
        print(f"OEMs: {oem_codes}")
        print()

    comparison = {}
    for oem in oem_codes:
        if verbose:
            print(f"  Searching {oem}...")
        result = ask_with_filter(topic, oem_code=oem, verbose=False)
        comparison[oem] = result

    if verbose:
        print()
        print("─── OEM Comparison ───────────────────────")
        print(f"Topic: {topic}")
        print()
        for oem, r in comparison.items():
            icon = r.get("signal_icon", "⚪")
            print(f"  {oem} {icon}")
            print(f"  {r.get('answer', 'No answer')[:200]}")
            print()
        print("──────────────────────────────────────────")

    return comparison


# ─────────────────────────────────────────────────────
# 5. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":

    print("=" * 50)
    print("TEST 1 — Nonsense Query (should be RED, no llama3)")
    print("=" * 50)
    result = ask("bitcoin cryptocurrency stock market price")

    print()
    print("=" * 50)
    print("TEST 2 — Valid Query")
    print("=" * 50)
    result = ask("What are the corrosion performance requirements?")

    print()
    print("=" * 50)
    print("TEST 3 — OEM Comparison")
    print("=" * 50)
    result = compare_oems("corrosion performance standard")
