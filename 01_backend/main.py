"""
main.py — KnowSeek.Ai — FastAPI Backend
─────────────────────────────────────────
REST API for DocSeek + PartSeek RAG system.

Version: rev05_004 24.03.2026 16:30
Branch:  main_sia06
Date:    24.03.2026
"""


# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import sys
import requests
from typing import Optional

# Add modules to path
DOCSEEK_PATH = Path(__file__).parent / "modules" / "02_docseek"
PARTSEEK_PATH = Path(__file__).parent / "modules" / "01_partseek"
sys.path.insert(0, str(DOCSEEK_PATH))
sys.path.insert(0, str(PARTSEEK_PATH))

# Import DocSeek modules
try:
    from modules.m02_docseek import answer as docseek_answer
    from modules.m02_docseek import search as docseek_search
except ImportError:
    try:
        import answer as docseek_answer
        import search as docseek_search
    except ImportError as e:
        print(f"ERROR: Could not import DocSeek modules: {e}")
        sys.exit(1)

# Import PartSeek modules  
try:
    from modules.m01_partseek import answer as partseek_answer
    from modules.m01_partseek import search as partseek_search
except ImportError:
    # Fallback: try direct import (when run from modules folder)
    import answer as partseek_answer_fallback
    import search as partseek_search_fallback
    partseek_answer = partseek_answer_fallback
    partseek_search = partseek_search_fallback


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

app = FastAPI(
    title="KnowSeek.Ai API",
    description="RAG system for automotive engineering - DocSeek + PartSeek",
    version="rev06_001"
)

# CORS - allow frontend (port 8081) to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"


# ─────────────────────────────────────────────────────
# 3. REQUEST/RESPONSE MODELS
# ─────────────────────────────────────────────────────

# ─── DocSeek Models ───────────────────────────────────

class DocSeekRequest(BaseModel):
    """Request body for /api/docseek/query"""
    question: str = Field(..., min_length=1, description="User question")
    oem_code: Optional[str] = Field(None, description="Filter by OEM (e.g., OEM-G)")
    category: Optional[str] = Field(None, description="Filter by category")
    n_results: int = Field(5, ge=1, le=20, description="Number of results")


class SourceInfo(BaseModel):
    """Source document info"""
    filename: str
    page: int
    oem_code: str
    score: float
    signal: str


class DocSeekResponse(BaseModel):
    """Response body for /api/docseek/query"""
    question: str
    answer: str
    confidence: float
    signal: str
    signal_icon: str
    sources: list[SourceInfo]
    time_ms: float


# ─── PartSeek Models ───────────────────────────────────

class PartSeekRequest(BaseModel):
    """Request body for /api/partseek/query"""
    question: str = Field(..., min_length=1, description="Part description or question")
    n_results: int = Field(5, ge=1, le=20, description="Number of results")


class PartInfo(BaseModel):
    """Part information"""
    text: str
    oem_code: str
    category: str
    score: float
    filename: str


class PartSeekResponse(BaseModel):
    """Response body for /api/partseek/query"""
    question: str
    answer: str
    found: bool
    parts: list[PartInfo]
    time_ms: float


# ─── Health Check Model ────────────────────────────────

class HealthResponse(BaseModel):
    """Response body for /api/health"""
    status: str
    ollama: dict
    chromadb: dict


# ─────────────────────────────────────────────────────
# 4. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

def check_ollama() -> dict:
    """Check if Ollama is running and models are available"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            has_llama3 = any(m["name"].startswith("llama3") for m in models)
            has_nomic = any("nomic-embed-text" in m["name"] for m in models)
            
            return {
                "status": "ok",
                "models": {
                    "llama3": has_llama3,
                    "nomic-embed-text": has_nomic
                }
            }
        else:
            return {"status": "error", "message": f"HTTP {response.status_code}"}
    except requests.RequestException as e:
        return {"status": "error", "message": str(e)}


def check_chromadb() -> dict:
    """Check if ChromaDB collections exist and have data"""
    try:
        # Check DocSeek collection
        docseek_collection = docseek_search.get_collection()
        docseek_count = docseek_collection.count()
        
        # Check PartSeek collection
        try:
            partseek_collection = partseek_search.get_collection()
            partseek_count = partseek_collection.count()
        except:
            partseek_count = 0
        
        return {
            "status": "ok",
            "collections": {
                "docseek": docseek_count,
                "partseek": partseek_count
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ─────────────────────────────────────────────────────
# 5. ENDPOINTS
# ─────────────────────────────────────────────────────

@app.get("/")
def root():
    """API info"""
    return {
        "name": "KnowSeek.Ai API",
        "version": "rev06_001",
        "modules": ["DocSeek", "PartSeek"],
        "endpoints": {
            "health": "GET /api/health",
            "docseek": "POST /api/docseek/query",
            "partseek": "POST /api/partseek/query"
        }
    }


@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """
    Check if all services are running:
    - Ollama (llama3 + nomic-embed-text)
    - ChromaDB (collections exist + have data)
    """
    ollama_status = check_ollama()
    chromadb_status = check_chromadb()
    
    # Determine overall status
    if (ollama_status["status"] == "ok" and 
        chromadb_status["status"] == "ok"):
        overall = "healthy"
    elif (ollama_status["status"] == "error" or 
          chromadb_status["status"] == "error"):
        overall = "unhealthy"
    else:
        overall = "degraded"
    
    return {
        "status": overall,
        "ollama": ollama_status,
        "chromadb": chromadb_status
    }


@app.post("/api/docseek/query", response_model=DocSeekResponse)
def query_documents(request: DocSeekRequest):
    """
    Ask a question about documents using RAG pipeline.
    
    Example:
        POST /api/docseek/query
        {
            "question": "What are the corrosion requirements?",
            "oem_code": "OEM-G",  # optional
            "category": "Painting"  # optional
        }
    """
    try:
        # Use filtered search if filters provided
        if request.oem_code or request.category:
            result = docseek_answer.ask_with_filter(
                question=request.question,
                oem_code=request.oem_code,
                category=request.category,
                verbose=False
            )
        else:
            result = docseek_answer.ask(
                question=request.question,
                n_results=request.n_results,
                verbose=False
            )
        
        # Convert to response model
        return DocSeekResponse(
            question=result["question"],
            answer=result["answer"],
            confidence=result["confidence"],
            signal=result["signal"],
            signal_icon=result["signal_icon"],
            sources=[
                SourceInfo(**source) for source in result["sources"]
            ],
            time_ms=result["time_ms"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing DocSeek query: {str(e)}"
        )


@app.post("/api/partseek/query", response_model=PartSeekResponse)
def query_parts(request: PartSeekRequest):
    """
    Search for parts using text query.
    
    Example:
        POST /api/partseek/query
        {
            "question": "M8 screw 25mm with torx drive"
        }
    """
    try:
        result = partseek_answer.ask(
            question=request.question,
            n_results=request.n_results,
            verbose=False
        )
        
        # Convert to response model
        return PartSeekResponse(
            question=result["question"],
            answer=result["answer"],
            found=result["found"],
            parts=[
                PartInfo(**part) for part in result["parts"]
            ],
            time_ms=result["time_ms"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing PartSeek query: {str(e)}"
        )


# ─────────────────────────────────────────────────────
# 6. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("KnowSeek.Ai FastAPI Server")
    print("=" * 60)
    print()
    print("Modules: DocSeek + PartSeek")
    print()
    print("Starting server...")
    print("  API docs: http://localhost:8001/docs")
    print("  Health:   http://localhost:8001/api/health")
    print("  Frontend: http://localhost:8081 (connect here)")
    print()
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )