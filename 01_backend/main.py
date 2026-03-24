"""
main.py — KnowSeek.Ai — FastAPI Backend
─────────────────────────────────────────
REST API connecting Frontend to all KnowSeek modules.

Version: rev05_003 21.03.2026 17:01
Branch:  main_sia05

Modules:
    01 PartSeek.Ai  — Part search         🔜 Week 3
    02 DocSeek.Ai   — Document search     ✅ Active
    03 NormSeek.Ai  — Norm search         ⏳ Phase 2
    04 CostSeek.Ai  — Cost analysis       ⏳ Phase 3

Endpoints:
    GET  /api/health              → Check all services
    POST /api/docseek/query       → Ask a question (RAG)
    POST /api/docseek/compare     → Compare across OEMs
    POST /api/partseek/query      → Search for parts     🔜
    POST /api/normseek/query      → Search norms         ⏳
    POST /api/costseek/query      → Cost analysis        ⏳
"""

# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import sys
import requests
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import chromadb

# ─────────────────────────────────────────────────────
# 2. PATHS — auto-detect, works from anywhere
# ─────────────────────────────────────────────────────

# Root of the repo — always works regardless of where you run from
ROOT     = Path(__file__).resolve().parent.parent
DB_PATH = str(Path(__file__).resolve().parents[1] / "chroma_db")
MODULES  = ROOT / "01_backend" / "modules"

# Add all module paths
sys.path.insert(0, str(MODULES / "02_docseek"))   # DocSeek  ✅
sys.path.insert(0, str(MODULES / "01_partseek"))  # PartSeek 🔜
sys.path.insert(0, str(MODULES / "03_normseek"))  # NormSeek ⏳
sys.path.insert(0, str(MODULES / "04_costseek"))  # CostSeek ⏳

# ─────────────────────────────────────────────────────
# 3. IMPORT MODULES — graceful fallback if not ready
# ─────────────────────────────────────────────────────

# DocSeek — Active ✅
try:
    from answer import ask, ask_with_filter, compare_oems
    from ingest import run_ingest
    from search import get_collection
    DOCSEEK_READY = True
    print("✅ DocSeek module loaded")
except ImportError as e:
    DOCSEEK_READY = False
    print(f"⚠️  DocSeek not available: {e}")

# PartSeek — Active 🔜
try:
    sys.path.insert(0, str(MODULES / "01_partseek"))
    from answer import find_part, find_part_with_filter
    PARTSEEK_READY = True
    print("✅ PartSeek module loaded")
except ImportError as e:
    PARTSEEK_READY = False
    print(f"⚠️  PartSeek not available: {e}")

# NormSeek — Phase 2 ⏳
NORMSEEK_READY = False
print("⏳ NormSeek not yet active — Phase 2")

# CostSeek — Phase 3 ⏳
COSTSEEK_READY = False
print("⏳ CostSeek not yet active — Phase 3")

# ─────────────────────────────────────────────────────
# 4. APP SETUP
# ─────────────────────────────────────────────────────

app = FastAPI(
    title="KnowSeek.Ai API",
    description="Local AI Knowledge Platform — On-Premise RAG System",
    version="rev05_003"
)

# Allow Frontend to call Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────
# 5. REQUEST / RESPONSE MODELS
# ─────────────────────────────────────────────────────

class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    oem_code: Optional[str] = None
    category: Optional[str] = None
    n_results: int = Field(5, ge=1, le=20)

class CompareRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    oem_codes: Optional[list[str]] = None

# ─────────────────────────────────────────────────────
# 6. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

def check_ollama() -> dict:
    """Check if Ollama is running with required models."""
    try:
        r = requests.get("http://localhost:11434/api/tags", timeout=3)
        if r.status_code == 200:
            models = r.json().get("models", [])
            return {
                "status": "ok",
                "llama3": any(m["name"].startswith("llama3") for m in models),
                "nomic-embed-text": any("nomic-embed-text" in m["name"] for m in models)
            }
        return {"status": "error", "message": f"HTTP {r.status_code}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def check_chromadb() -> dict:
    """Check ChromaDB and return collection info."""
    try:
        client = chromadb.PersistentClient(path=DB_PATH)
        collections = client.list_collections()
        if not collections:
            return {"status": "warning", "message": "No collections — run ingest first"}
        return {
            "status": "ok",
            "collections": [c.name for c in collections]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─────────────────────────────────────────────────────
# 7. ENDPOINTS
# ─────────────────────────────────────────────────────

# 7.1 Root
@app.get("/")
def root():
    return {
        "name":    "KnowSeek.Ai API",
        "version": "rev05_003",
        "modules": {
            "docseek":  "✅ active",
            "partseek": "🔜 Week 3",
            "normseek": "⏳ Phase 2",
            "costseek": "⏳ Phase 3",
        }
    }


# 7.2 Health Check
@app.get("/api/health")
def health_check():
    """Check if all services are running."""
    ollama   = check_ollama()
    chroma   = check_chromadb()
    overall  = "ok" if ollama["status"] == "ok" and chroma["status"] == "ok" else "degraded"

    return {
        "status":   overall,
        "ollama":   ollama,
        "chromadb": chroma,
        "modules": {
            "docseek":  DOCSEEK_READY,
            "partseek": PARTSEEK_READY,
            "normseek": NORMSEEK_READY,
            "costseek": COSTSEEK_READY,
        }
    }


# 7.3 DocSeek Query ✅
@app.post("/api/docseek/query")
def docseek_query(request: QueryRequest):
    """Ask a question using RAG pipeline."""
    if not DOCSEEK_READY:
        raise HTTPException(status_code=503, detail="DocSeek module not available")
    try:
        if request.oem_code or request.category:
            result = ask_with_filter(
                question=request.question,
                oem_code=request.oem_code,
                category=request.category,
                verbose=False
            )
        else:
            result = ask(
                question=request.question,
                n_results=request.n_results,
                verbose=False
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 7.4 DocSeek OEM Compare ✅
@app.post("/api/docseek/compare")
def docseek_compare(request: CompareRequest):
    """Compare a topic across multiple OEMs."""
    if not DOCSEEK_READY:
        raise HTTPException(status_code=503, detail="DocSeek module not available")
    try:
        result = compare_oems(
            topic=request.topic,
            oem_codes=request.oem_codes,
            verbose=False
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 7.5 PartSeek Query ✅
@app.post("/api/partseek/query")
def partseek_query(request: QueryRequest):
    """Search for parts by text query."""
    if not PARTSEEK_READY:
        raise HTTPException(
            status_code=503,
            detail="PartSeek not available"
        )
    try:
        if request.oem_code:
            result = find_part_with_filter(
                query=request.question,
                oem_code=request.oem_code,
                verbose=False
            )
        else:
            result = find_part(
                query=request.question,
                verbose=False
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 7.6 NormSeek Query ⏳
@app.post("/api/normseek/query")
def normseek_query(request: QueryRequest):
    """Search norms and standards. Coming in Phase 2."""
    if not NORMSEEK_READY:
        raise HTTPException(
            status_code=503,
            detail="NormSeek not yet active — planned Phase 2"
        )


# 7.7 CostSeek Query ⏳
@app.post("/api/costseek/query")
def costseek_query(request: QueryRequest):
    """Cost analysis. Coming in Phase 3."""
    if not COSTSEEK_READY:
        raise HTTPException(
            status_code=503,
            detail="CostSeek not yet active — planned Phase 3"
        )


# ─────────────────────────────────────────────────────
# 8. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("KnowSeek.Ai FastAPI Backend")
    print("=" * 50)
    print(f"ROOT:    {ROOT}")
    print(f"DB_PATH: {DB_PATH}")
    print()
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
