"""
answer.py — PartSeek Module
────────────────────────────────────────
Generate answers for part queries using llama3.

Version: rev06_001 24.03.2026 16:22
Branch:  main_sia06
Date:    24.03.2026
"""

import time
import requests
from search import search_parts


# ─────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"


# ─────────────────────────────────────────────────────
# ASK - Main function
# ─────────────────────────────────────────────────────

def ask(question: str, n_results: int = 5, verbose: bool = False):
    """
    Ask a question about parts and get an answer
    
    Args:
        question: User question (e.g., "I need M8 screw 25mm torx")
        n_results: How many parts to search
        verbose: Print debug info
    
    Returns:
        dict with answer, parts, and metadata
    """
    start_time = time.time()
    
    # Step 1: Search for parts
    search_result = search_parts(question, n_results=n_results, verbose=verbose)
    parts = search_result["results"]
    
    if not parts:
        return {
            "question": question,
            "answer": "No matching parts found in database.",
            "found": False,
            "parts": [],
            "time_ms": round((time.time() - start_time) * 1000, 1)
        }
    
    # Step 2: Build context for llama3
    context = "Available parts:\n\n"
    for i, part in enumerate(parts, 1):
        meta = part["metadata"]
        context += f"Part {i}:\n"
        context += f"  Text: {part['text'][:200]}\n"
        context += f"  OEM: {meta.get('oem_code', 'N/A')}\n"
        context += f"  Category: {meta.get('category', 'N/A')}\n"
        context += f"  Score: {part['score']:.3f}\n\n"
    
    # Step 3: Build prompt
    prompt = f"""You are a helpful engineering assistant for finding parts.

Question: {question}

{context}

Based on the parts above, answer the question.
Include:
- Which part(s) match best
- Key specifications
- OEM codes
- Any important notes

Keep your answer clear and concise."""
    
    # Step 4: Call llama3
    if verbose:
        print(f"Calling llama3...")
    
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=30
    )
    
    if response.status_code != 200:
        return {
            "question": question,
            "answer": f"Error calling llama3: {response.status_code}",
            "found": False,
            "parts": [],
            "time_ms": round((time.time() - start_time) * 1000, 1)
        }
    
    answer_text = response.json().get("response", "No answer generated")
    
    # Step 5: Format response
    elapsed_ms = round((time.time() - start_time) * 1000, 1)
    
    # Format parts for output
    formatted_parts = []
    for part in parts:
        meta = part["metadata"]
        formatted_parts.append({
            "text": part["text"][:300],
            "oem_code": meta.get("oem_code", "UNKNOWN"),
            "category": meta.get("category", "N/A"),
            "score": part["score"],
            "filename": meta.get("filename", "N/A")
        })
    
    return {
        "question": question,
        "answer": answer_text,
        "found": True,
        "parts": formatted_parts,
        "time_ms": elapsed_ms
    }
