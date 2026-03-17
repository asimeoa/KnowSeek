"""
answer.py — KnowSeek.Ai — DocSeek Module rev 05 main_sia05
─────────────────────────────────────────
Takes search results from search.py,
sends them to llama3 via Ollama,
returns a clean answer with source + confidence.

Version: rev05_002
Branch:  main_sia05

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
"""


# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
import requests
import json
from pathlib import Path

import sys
sys.path.append(str(Path(__file__).resolve().parent))

from search import search, search_with_filter, search_multi


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

OLLAMA_URL   = "http://localhost:11434/api/generate"
LLM_MODEL    = "llama3"
MAX_CONTEXT  = 3      # how many chunks to send to llama3
TEMPERATURE  = 0.1    # low = more focused answers


# ─────────────────────────────────────────────────────
# 3. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 3.1 build_context
def build_context(results: list[dict]) -> str:
    """
    Build context string from search results.
    Only uses top N results above minimum score.
    """
    context_parts = []
    for r in results[:MAX_CONTEXT]:
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
    return f"""You are a professional engineering assistant for an automotive supplier.

RULES:
- Answer based on the documents provided below.
- Always include the source document and page number.
- If you find exact information — state it clearly.
- If you find related or partial information — share it but mark it as: "Based on similar content:"
- If truly nothing is found — say: "I could not find this information in the available documents."
- Do not guess. Do not invent numbers.
- Keep your answer short and technical.

DOCUMENTS:
{context}

QUESTION:
{question}

ANSWER:"""


# 3.3 format_answer
def format_answer(question: str, answer: str, results: list[dict], elapsed_ms: float) -> dict:
    """
    Format the final answer dict with all metadata.
    """
    top = results[0] if results else {}
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
    n_results: int = 5,
    verbose: bool = True
) -> dict:
    """
    Full RAG pipeline — search + answer.
    1. Search ChromaDB for relevant chunks
    2. Build context from top results
    3. Send to llama3
    4. Return answer + source + confidence

    Usage:
        result = ask("What are the salt spray test requirements?")
        result = ask("Welche Korrosionsanforderungen gibt es?")
    """
    start = time.time()

    # Step 1 — Search
    if verbose:
        print(f"Searching for: {question}")
    results = search(question, n_results=n_results, verbose=False)

    if not results:
        return {
            "question": question,
            "answer": "No documents found in the database.",
            "confidence": 0.0,
            "signal": "RED",
            "signal_icon": "🔴",
            "sources": [],
            "time_ms": 0
        }

    # Step 2 — Build context
    context = build_context(results)
    if not context:
        return {
            "question": question,
            "answer": "No relevant content found above confidence threshold.",
            "confidence": results[0]["score"],
            "signal": "RED",
            "signal_icon": "🔴",
            "sources": [],
            "time_ms": 0
        }

    # Step 3 — Send to llama3
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

    # Step 4 — Format result
    result = format_answer(question, answer_text, results, elapsed_ms)

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
    verbose: bool = True
) -> dict:
    """
    Ask with metadata filter — e.g. only Painting docs.

    Usage:
        result = ask_with_filter("coating thickness", category="Painting")
        result = ask_with_filter("requirements", oem_code="OEM-G")
    """
    start = time.time()
    results = search_with_filter(
        question,
        oem_code=oem_code,
        category=category,
        verbose=False
    )

    if not results:
        return {"question": question, "answer": "No results found.", "signal": "RED"}

    context = build_context(results)
    prompt  = build_prompt(question, context)

    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": LLM_MODEL, "prompt": prompt, "stream": False, "temperature": TEMPERATURE},
            timeout=120
        )
        answer_text = response.json().get("response", "No response.")
    except Exception as e:
        answer_text = f"Error: {e}"

    elapsed_ms = round((time.time() - start) * 1000, 1)
    result = format_answer(question, answer_text, results, elapsed_ms)

    if verbose:
        print(f"{result['signal_icon']} {result['answer']}")
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
    Returns a comparison dict with results per OEM.

    Usage:
        result = compare_oems("salt spray test requirements")
        result = compare_oems("corrosion", oem_codes=["OEM-G", "OEM-M"])
    """
    if oem_codes is None:
        oem_codes = ["OEM-G", "OEM-M", "OEM-H", "OEM-S", "OEM-Z"]

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
    print("TEST 1 — Basic Question")
    print("=" * 50)
    result = ask("What are the corrosion performance requirements?")

    print()
    print("=" * 50)
    print("TEST 2 — German Question")
    print("=" * 50)
    result = ask("Welche Anforderungen gibt es für Korrosionsschutz?")

    print()
    print("=" * 50)
    print("TEST 3 — OEM Comparison")
    print("=" * 50)
    result = compare_oems("corrosion performance standard")
