"""
main.py — KnowSeek.Ai — FastAPI Backend
─────────────────────────────────────────
REST API connecting Frontend to all KnowSeek modules.

Version: rev08_001 — 30.03.2026
Branch:  main_sia09

Modules:
    01 PartSeek.Ai  — Part search         ✅ Active
    02 DocSeek.Ai   — Document search     ✅ Active
    03 NormSeek.Ai  — Norm search         ⏳ Phase 2
    04 CostSeek.Ai  — Cost analysis       ⏳ Phase 3

Endpoints:
    GET  /api/health              → Check all services
    POST /api/docseek/query       → Ask a question (RAG)
    POST /api/docseek/compare     → Compare across OEMs
    POST /api/partseek/query      → Search for parts
    POST /api/normseek/query      → Search norms     ⏳
    POST /api/costseek/query      → Cost analysis    ⏳
"""

# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import sys
import requests
import importlib.util
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import chromadb


# ─────────────────────────────────────────────────────
# 2. PATHS — auto-detect, works from anywhere
# ─────────────────────────────────────────────────────

ROOT    = Path(__file__).resolve().parent.parent
DB_PATH = str(ROOT / "chroma_db")
MODULES = ROOT / "01_backend" / "modules"

# importlib with full path
def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def load_track_engine():
    """Load track engine helpers from utils/track_engine.py."""
    track_path = ROOT / "01_backend" / "utils" / "track_engine.py"
    track_mod = load_module("track_engine", track_path)
    return track_mod.analyze_query, track_mod.build_where_filter


#sys.path.insert(0, str(MODULES / "03_normseek"))  # NormSeek ⏳
#sys.path.insert(0, str(MODULES / "04_costseek"))  # CostSeek ⏳

# ─────────────────────────────────────────────────────
# 3. IMPORT MODULES — graceful fallback if not ready
# ─────────────────────────────────────────────────────

# DocSeek — Active ✅
try:
    docseek_answer = load_module("docseek_answer", 
        MODULES / "02_docseek" / "answer.py")
    ask           = docseek_answer.ask
    ask_with_filter = docseek_answer.ask_with_filter
    compare_oems  = docseek_answer.compare_oems
    DOCSEEK_READY = True
    print("✅ DocSeek module loaded")
except Exception as e:
    DOCSEEK_READY = False
    print(f"⚠️  DocSeek not available: {e}")


# PartSeek — Active ✅
try:
    partseek_answer = load_module("partseek_answer",
        MODULES / "01_partseek" / "answer.py")
    find_part           = partseek_answer.find_part
    find_part_with_filter = partseek_answer.find_part_with_filter
    PARTSEEK_READY = True
    print("✅ PartSeek module loaded")
except Exception as e:
    PARTSEEK_READY = False
    print(f"⚠️  PartSeek not available: {e}")

# Track Engine — Active ✅
try:
    analyze_query, build_where_filter = load_track_engine()
    TRACK_ENGINE_READY = True
    print("✅ Track Engine loaded")
except Exception as e:
    TRACK_ENGINE_READY = False
    print(f"⚠️  Track Engine not available: {e}")


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
    version="rev08_001"
)

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
    module: Optional[str] = None
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
                "status":           "ok",
                "llama3":           any(m["name"].startswith("llama3") for m in models),
                "nomic-embed-text": any("nomic-embed-text" in m["name"] for m in models)
            }
        return {"status": "error", "message": f"HTTP {r.status_code}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def check_chromadb() -> dict:
    """Check ChromaDB knowseek collection and return module chunk counts."""
    try:
        client     = chromadb.PersistentClient(path=DB_PATH)
        collection = client.get_collection("knowseek")
        total      = collection.count()

        # Count chunks per module
        docseek_data  = collection.get(where={"module": "docseek"},  include=[])
        partseek_data = collection.get(where={"module": "partseek"}, include=[])

        return {
            "status":     "ok",
            "collection": "knowseek",
            "total":      total,
            "docseek":    len(docseek_data["ids"]),
            "partseek":   len(partseek_data["ids"]),
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
        "version": "rev08_001",
        "modules": {
            "docseek":  "✅ active",
            "partseek": "✅ active",
            "track_engine": "✅ active" if TRACK_ENGINE_READY else "⚠️ unavailable",
            "normseek": "⏳ Phase 2",
            "costseek": "⏳ Phase 3",
        }
    }


# 7.2 Health Check
@app.get("/api/health")
def health_check():
    """Check if all services are running."""
    ollama  = check_ollama()
    chroma  = check_chromadb()
    overall = "ok" if ollama["status"] == "ok" and chroma["status"] == "ok" else "degraded"

    return {
        "status":   overall,
        "ollama":   ollama,
        "chromadb": chroma,
        "modules": {
            "docseek":  DOCSEEK_READY,
            "partseek": PARTSEEK_READY,
            "track_engine": TRACK_ENGINE_READY,
            "normseek": NORMSEEK_READY,
            "costseek": COSTSEEK_READY,
        }
    }


# 7.2b Unified Query via Track Engine ✅
@app.post("/api/query")
def unified_query(request: QueryRequest):
    """
    Unified query endpoint.
    Query -> Track Engine -> where_filter -> module-specific pipeline.
    """
    if not TRACK_ENGINE_READY:
        raise HTTPException(status_code=503, detail="Track Engine not available")

    track = analyze_query(request.question)
    where_filter = build_where_filter(track)

    print("TRACK:", track)
    print("FILTER:", where_filter)

    if track.get("missing") and track.get("module") != "partseek":
        return {
            "status": "incomplete",
            "module": track.get("module"),
            "missing": track.get("missing", []),
            "track": track,
        }

    if track.get("module") == "partseek":
        if not PARTSEEK_READY:
            raise HTTPException(status_code=503, detail="PartSeek not available")

        result = find_part_with_filter(
            query=request.question,
            oem=where_filter.get("oem_code"),
            thread=track.get("filters", {}).get("thread"),
            material=track.get("filters", {}).get("material"),
            verbose=False,
        )
        return result

    if not DOCSEEK_READY:
        raise HTTPException(status_code=503, detail="DocSeek module not available")

    result = ask_with_filter(
        question=request.question,
        oem_code=where_filter.get("oem_code"),
        category=where_filter.get("category"),
        where_filter=where_filter,
        verbose=False,
    )
    return result


# 7.3 DocSeek Query ✅
@app.post("/api/docseek/query")
def docseek_query(request: QueryRequest):
    """Ask a question using DocSeek pipeline with Track-first filtering."""
    if not DOCSEEK_READY:
        raise HTTPException(status_code=503, detail="DocSeek module not available")
    if not TRACK_ENGINE_READY:
        raise HTTPException(status_code=503, detail="Track Engine not available")

    try:
        track = analyze_query(request.question)
        where_filter = build_where_filter(track)

        # Force module safety for direct DocSeek endpoint.
        where_filter["module"] = "docseek"

        # Explicit request fields override inferred filters.
        if request.oem_code:
            where_filter["oem_code"] = request.oem_code
        if request.category:
            where_filter["category"] = request.category

        print("TRACK:", track)
        print("FILTER:", where_filter)

        if track.get("missing") and not (request.oem_code or request.category):
            return {
                "status": "incomplete",
                "module": "docseek",
                "missing": track.get("missing", []),
                "track": track,
            }

        result = ask(
            question=request.question,
            where_filter=where_filter,
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
    """Search for parts with Track-first filtering."""
    if not PARTSEEK_READY:
        raise HTTPException(status_code=503, detail="PartSeek not available")
    if not TRACK_ENGINE_READY:
        raise HTTPException(status_code=503, detail="Track Engine not available")

    try:
        track = analyze_query(request.question)
        where_filter = build_where_filter(track)

        # Force module safety for direct PartSeek endpoint.
        where_filter["module"] = "partseek"

        # Explicit request fields override inferred filters.
        if request.oem_code:
            where_filter["oem_code"] = request.oem_code
        if request.category:
            where_filter["category"] = request.category
        if request.module:
            where_filter["module"] = request.module

        print("TRACK:", track)
        print("FILTER:", where_filter)

        result = find_part_with_filter(
            query=request.question,
            oem=where_filter.get("oem_code"),
            thread=track.get("filters", {}).get("thread"),
            material=track.get("filters", {}).get("material"),
            verbose=False
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 7.6 NormSeek Query ⏳
@app.post("/api/normseek/query")
def normseek_query(request: QueryRequest):
    """Search norms and standards. Coming in Phase 2."""
    raise HTTPException(
        status_code=503,
        detail="NormSeek not yet active — planned Phase 2"
    )


# 7.7 CostSeek Query ⏳
@app.post("/api/costseek/query")
def costseek_query(request: QueryRequest):
    """Cost analysis. Coming in Phase 3."""
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