"""
search.py — PartSeek Module
────────────────────────────────────────
Search for parts in ChromaDB using text queries.

Version: rev05_004 
Branch:  main_sia06
Date:    24.03.2026 16:20
"""

from pathlib import Path
import chromadb
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction


# ─────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────

BASE_PATH = Path(__file__).resolve().parents[3]
DB_PATH = str(BASE_PATH / "chroma_db")
COLLECTION_NAME = "partseek"
N_RESULTS = 5  # how many parts to return per query


# ─────────────────────────────────────────────────────
# EMBEDDING FUNCTION
# ─────────────────────────────────────────────────────

ollama_ef = OllamaEmbeddingFunction(
    url="http://localhost:11434/api/embeddings",
    model_name="nomic-embed-text"
)


# ─────────────────────────────────────────────────────
# GET COLLECTION
# ─────────────────────────────────────────────────────

def get_collection():
    """Get the PartSeek collection from ChromaDB"""
    client = chromadb.PersistentClient(path=DB_PATH)
    collection = client.get_collection(
        name=COLLECTION_NAME,
        embedding_function=ollama_ef
    )
    return collection


# ─────────────────────────────────────────────────────
# SEARCH PARTS
# ─────────────────────────────────────────────────────

def search_parts(query: str, n_results: int = N_RESULTS, verbose: bool = False):
    """
    Search for parts using text query
    
    Args:
        query: User question (e.g., "M8 screw 25mm torx")
        n_results: How many results to return
        verbose: Print debug info
    
    Returns:
        dict with results
    """
    collection = get_collection()
    
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    if verbose:
        print(f"Query: {query}")
        print(f"Found: {len(results['ids'][0])} results")
    
    parts = []
    for i in range(len(results["ids"][0])):
        parts.append({
            "id": results["ids"][0][i],
            "text": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "score": float(results["distances"][0][i])
        })
    
    return {
        "query": query,
        "results": parts,
        "count": len(parts)
    }
