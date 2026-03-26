# KnowSeek.ai — RnD Description
**On-Premise AI Knowledge Platform**
*Capstone Project — MVP Reference Document*
*Version: rev06_001 — Last updated: 25.03.2026 09:14 — Branch: main_sia07*

> All data stays local. No cloud. No internet required.

---

## Module Overview

| # | Module | Color | Status |
|---|--------|-------|--------|
| 01 | **DocSeek.ai** | Emerald Green #10B981 | ✅ MVP |
| 02 | **PartSeek.ai** | Electric Blue #0EA5E9 | ✅ MVP |
| 03 | **NormSeek.ai** | Indigo #9199F4 | ⏳ Phase 2 |
| 04 | **CostSeek.ai** | Orange #FC9D57 | ⏳ Phase 3 |

**Midterm: 20.03.2026 ✅ · Dry Run: 27.03.2026 · Stakeholder: 02.04.2026**
**Solo developer · On-Premise / Ollama**

---

## 1. Vision

KnowSeek.ai is a fully local AI knowledge platform for industrial companies.

Engineers ask questions in plain German or English and get a direct answer — with the exact source included. Everything runs on the company's own machine. No internet needed. No data ever leaves the building.

**Key principle:** Fast answers. Local. Private. Secure.

---

## 2. The Problem

Engineers waste time every day because of:

- PDF specs scattered across folders and projects
- No easy way to compare requirements across different OEMs
- Long searches in parts catalogs — often repeated by different people
- Conflicting standards and norms with no clear overview
- New team members take weeks to find the right documents
- No visibility into what colleagues already searched for

**The result:** Slower development, higher costs, quality risks, and knowledge stuck in people's heads instead of being shared.

KnowSeek.ai solves this directly.

---

## 3. Who Is It For?

- Automotive suppliers
- Mechanical engineering companies
- Development and engineering teams
- Quality management
- Purchasing and cost engineering
- Any company that must keep data on-premise (GDPR / IP protection)

---

## 4. OKR — Objectives & Key Results

### Objective (Platform)

> "Give engineers instant answers from their own documents —
> local, private, with source included, and a clear trust signal
> 🟢🟡🔴 they can see at a glance."

![OKR Structure](pictures/okr_diagram.svg)

### Key Results — MVP Overall

| # | Key Result | How We Measure It |
|---|------------|------------------|
| KR1 | Answer time measured + visualized | Baseline vs RAG — bar chart in EDA.ipynb |
| KR2 | System runs 100% offline — verified | No external API calls during query — network monitor check |
| KR3 | Works in multi language (DE, EN) | Test queries in both languages — results verified ✅ |
| KR4 | Confidence score 🟢🟡🔴 shown on every result | Visible on every result card in frontend ✅ |

### Key Results — DocSeek.ai

| # | Key Result | How We Measure It |
|---|------------|------------------|
| KR1 | 3 OEM comparisons working (OEM-V / OEM-W / OEM-G) | Demo scenario runs without errors |
| KR2 | Risk table correct (same / different / conflict) | Verified against known test documents |
| KR3 | Source link clickable on every result | Manual test — every result has source |

### Key Results — PartSeek.ai

| # | Key Result | How We Measure It |
|---|------------|------------------|
| KR1 | Text search finds correct part — time visualized | Measured + shown in EDA.ipynb |
| KR2 | Team collision warning works | Tested with 2 similar part queries |
| KR3 | All metadata shown (material, strength, OEM logo) | Verified on demo datasheets |

---

## 5. How It Works — RAG Pipeline

KnowSeek.ai uses a method called **RAG — Retrieval Augmented Generation**.

```
STEP 1 — Ingest (done once):
Documents → split into chunks → convert to vectors → store in ChromaDB

STEP 2 — Answer (every query):
Question → convert to vector → find matching chunks → llama3 → answer + source
```

This means the AI does not guess — it reads your actual documents and tells you exactly where the answer comes from.

**Confidence is always shown as a traffic light:**

| Score | Color | Meaning |
|-------|-------|---------|
| > 85% | 🟢 Green | Reliable answer — source found |
| 60–85% | 🟡 Yellow | Partial match — check the source |
| < 60% | 🔴 Red | Low confidence — verify manually |

**FastAPI connects the AI backend to the React frontend:**

```
React Frontend  →  FastAPI  →  ChromaDB → llama3
(JavaScript)       (Python)    (vectors)  (answers)

POST /api/docseek/query   ← document question
POST /api/partseek/query  ← part search
GET  /api/health          ← server status check
```

---

## 6. Tech Stack — MVP

### Selected Tools

| Component | Technology | Why |
|-----------|-----------|-----|
| LLM | llama3:8b via Ollama | 100% offline, runs well on Mac M1 |
| Embedding model | nomic-embed-text via Ollama | Full DE + EN support, no extra package |
| Baseline model | rank-bm25 | Keyword search — baseline for MLFlow comparison |
| Vector database | ChromaDB | Simple, local, persistent, no server needed |
| RAG framework | LangChain | PDF/DOCX/XLSX loaders + memory + multi-query |
| OCR | pytesseract + Pillow + fpdf2 | Convert image-based files to searchable PDF |
| Backend API | FastAPI (Python 3.11.3) | REST API between AI logic and frontend |
| Frontend | React + Vite + TailwindCSS | Fast, modern UI |
| UI components | shadcn/ui + Framer Motion | Spring physics animations |
| Experiment tracking | MLFlow (local, port 5000) | Track and compare model experiments |
| Infrastructure | Docker Compose *(planned)* | One command starts everything |
| Dev machine | Mac M1 16GB | Unified memory — Ollama runs fast |

### Ollama — Two Functions

> Ollama is used for TWO functions in KnowSeek.ai:
> 1. **LLM** — `llama3:8b` — generates answers
> 2. **Embedding** — `nomic-embed-text` — converts text to vectors (DE + EN)

### Embedding Model — Why We Chose nomic-embed-text

We evaluated 5 models before deciding:

| Model | Size | DE Support | Decision |
|-------|------|-----------|----------|
| all-MiniLM-L6-v2 | 80MB | ❌ | Rejected — English only |
| paraphrase-multilingual-MiniLM-L12-v2 | 120MB | ✅ | Rejected — extra package needed |
| paraphrase-multilingual-mpnet-base-v2 | 280MB | ✅ | Rejected — too large |
| all-mpnet-base-v2 | 420MB | ❌ | Rejected — English only |
| **nomic-embed-text (Ollama)** | 270MB | ✅ | ✅ **Selected** |

**Why nomic-embed-text won:**
- Full DE + EN support — works when question is German but document is English
- Runs via Ollama — already installed, no extra package
- One command: `ollama pull nomic-embed-text`

### Image Recognition Model — Evaluated

| Model | Type | Decision | Notes |
|-------|------|----------|-------|
| LLaVA (Ollama) | Vision LLM — describes images in text | 🟡 Phase 2 | No training needed — start with 10 images |
| YOLO (Ultralytics) | Object detection — finds + classifies parts | 🟡 Phase 2 | Can start with 10 images, improve over time |

> **YOLO strategy — incremental approach:**
> - Start with 10 images → Proof of Concept
> - Add 50 images → Better recognition
> - Add 500 images → Production ready
> - Dataset source: Roboflow Universe — pre-labeled fastener datasets available
> - ChromaDB architecture already supports image chunks — no restructuring needed
> - Image chunks get module="partseek" + doc_type="Image"

### Visualization Tools (Notebooks)

| Tool | Purpose |
|------|---------|
| Pandas | Load and analyze data |
| Seaborn | Statistical charts, heatmaps |
| Plotly | Interactive charts, spider diagram |
| MLFlow UI | Experiment comparison (port 5000) |

---

## 7. Code Structure — Python + Notebooks

All production logic lives in `.py` files. Notebooks call these files and are only used for visualization and EDA.

```
01_backend/
├── main.py             ✅ rev06_001 — FastAPI all 4 modules (port 8001)
├── modules/
│   ├── 01_partseek/
│   │   ├── ingest.py   ✅ rev06_001 — calls DocSeek ingest pipeline
│   │   ├── search.py   ✅ rev06_001 — filter by module="partseek"
│   │   └── answer.py   ✅ rev06_001 — structured results + collision warning
│   ├── 02_docseek/
│   │   ├── ingest.py   ✅ rev06_001 — load, OCR, chunk, module tag, store
│   │   ├── search.py   ✅ rev06_001 — filter by module="docseek"
│   │   └── answer.py   ✅ rev06_001 — RAG + llama3 + OEM comparison
│   ├── 03_normseek/    ⏳ Phase 2
│   └── 04_costseek/    ⏳ Phase 3
└── utils/
    └── check_pdfs.py   ✅ rev06_001 — auto OCR check for all modules

06_notebooks/
└── EDA.ipynb           ✅ rev06_001 — Chapter 1-6 complete
```

**Key functions in DocSeek ingest.py:**
- `get_language(text)` — detects DE vs EN automatically
- `get_category(filename)` — maps filename to category
- `get_module(category)` — assigns module based on category
- `get_oem_code(filename)` — maps filename to OEM code
- `run_ingest()` — full pipeline: load → chunk → vectorize → store

**Category → Module mapping:**
```python
# PartSeek categories:
OEM-Fastener, Supplier-Fastener, Bracket → module="partseek"

# DocSeek categories (everything else):
Corrosion, Painting, General → module="docseek"
```

> The notebook is the **window** — the .py files are the **engine**.

---

## 8. EVA — **I**nput / **P**rocessing / **O**utput

| Symbol | German | English |
|--------|--------|---------|
| E | Eingabe | Input |
| V | Verarbeitung | Processing |
| A | Ausgabe | Output |

**Rating:**

| Symbol | Meaning |
|--------|---------|
| 🟢 | Reliable — tested, works as expected |
| 🟡 | Conditional — works with limitations |
| 🔴 | Not in MVP — Phase 2 or 3 |
| `*` | Phase 2 planned |
| `**` | Phase 3 planned |

---

### E — INPUT

#### E1. File Formats

| Format | Tool | R/Y/G | Notes |
|--------|------|--------|-------|
| PDF (digital) | pdfplumber + LangChain | 🟢 | Main format — specs, reports, standards |
| PDF (scanned) | pytesseract (OCR) | 🟡 | Quality depends on scan resolution |
| PNG / WEBP (images) | pytesseract + fpdf2 | 🟡 | Converted to searchable PDF via OCR ✅ |
| Word (.docx) | LangChain DocLoader | 🟢 | Technical documents, reports |
| Excel (.xlsx) | LangChain + openpyxl | 🟢 | Requirements lists, test tables |
| Images with tables | pdfplumber | 🟡 | Digital PDFs only — not scanned |
| CAD drawings (DXF/DWG) | PyMuPDF | 🟡 | Text fields only — no geometry |
| Part images (YOLO)* | YOLO / LLaVA | 🟡 | Phase 2 — start with 10 images |
| Email (.msg/.pst) | extract-msg* | 🔴 | Phase 2 — use PDF export for MVP |
| CAD metadata (NX) | NX Open API** | 🔴 | Phase 3 |
| JT 3D files | jt-js + three.js* | 🔴 | Phase 2 |

> ⚠️ **Known limitation:** Geometry from technical drawings cannot be extracted with text tools.
> LLaVA (Phase 2) can describe shapes but cannot measure exact geometry.
> The system will always show a warning when a file type is not fully supported.

> **Info: Anonymization Schema for Test Data**
>
> | Code | Theme | OEM | Kürzel |
> |------|-------|-----|--------|
> | OEM-G | US Presidents (GEORGE) | Mercedes-Benz | _PM |
> | OEM-M | Disney (MICKEY) | GM | _PG |
> | OEM-Z | Greek Gods (ZEUS) | Volvo | _PV |
> | OEM-H | Greek Gods (HADES) | Volvo | _PV |
> | OEM-S | Musicians (SWIFT) | China / Internal | _CH |
> | _SIA | — | Internal (Antonios) | _SIA |

#### E2. Language Support

| Model | Size | DE Support | Decision |
|-------|------|-----------|----------|
| all-MiniLM-L6-v2 | 80MB | ❌ | Rejected — English only |
| paraphrase-multilingual-MiniLM-L12-v2 | 120MB | ✅ | Rejected — extra package |
| paraphrase-multilingual-mpnet-base-v2 | 280MB | ✅ | Rejected — too large |
| all-mpnet-base-v2 | 420MB | ❌ | Rejected — English only |
| **nomic-embed-text (Ollama)** | 270MB | ✅ | ✅ Selected |

#### E3. User Input

| Input Type | Module | R/Y/G | Notes |
|------------|--------|--------|-------|
| Free text query (DE/EN) | DocSeek + PartSeek | 🟢 | Core feature — verified ✅ |
| Follow-up questions | DocSeek | 🟢 | Last 5 queries remembered |
| Multi-document comparison | DocSeek | 🟢 | Multi-Query Retrieval (LangChain) |
| Image upload (photo of part) | PartSeek | 🟡 | Phase 2 — YOLO / LLaVA |
| Voice input | — | 🔴 | Not planned |

---

### V — PROCESSING

#### V1. Document Processing

| Step | Tool | R/Y/G | Notes |
|------|------|--------|-------|
| PDF text extraction | pdfplumber | 🟢 | Best for digital PDFs with tables |
| PDF image extraction | PyMuPDF (fitz) | 🟢 | Images + metadata |
| OCR (scanned docs + images) | pytesseract + Pillow | 🟡 | Tested on fastener datasheets ✅ |
| Image → searchable PDF | fpdf2 | 🟢 | OCR text saved as PDF ✅ |
| Language detection | get_language() | 🟢 | DE vs EN — heuristic keyword check ✅ |
| Module assignment | get_module() | 🟢 | category → module tag ✅ |
| DOCX parsing | LangChain DocLoader | 🟢 | Clean extraction |
| XLSX parsing | LangChain + openpyxl | 🟢 | Tables and structured data |
| Image recognition | YOLO / LLaVA* | 🟡 | Phase 2 — incremental training |

#### V2. Chunking Strategy

| Document Type | Size | Chunk | Overlap | R/Y/G |
|---------------|------|-------|---------|--------|
| 1-Pager (1–2 pages) | < 1MB | 256 | 50 | 🟢 |
| Technical sheet (5–20p) | 1–3MB | 500 | 100 | 🟢 |
| Small Lastenheft (~50p) | ~6MB | 500 | 100 | 🟢 |
| Large Lastenheft (~300p) | ~10MB | 1000 | 200 | 🟡 |

> Smart pre-processor detects document type and applies the right chunking automatically.

#### V3. Vector Database

| Tool | R/Y/G | Decision | Notes |
|------|--------|----------|-------|
| **ChromaDB** | 🟢 | ✅ Selected | Local, simple, persistent |
| FAISS | 🟡 | ❌ Rejected | Faster but limited metadata support |

#### V4. RAG Framework

| Tool | R/Y/G | Decision | Notes |
|------|--------|----------|-------|
| **LangChain** | 🟢 | ✅ Selected | Loaders + Memory + Multi-Query |

#### V5. LLM + Baseline

| Model | Size | R/Y/G | Decision |
|-------|------|--------|----------|
| **llama3:8b (Ollama)** | 4.7GB | 🟢 | ✅ Selected — main model |
| **rank-bm25** | — | 🟢 | ✅ Baseline — keyword search for MLFlow comparison |
| LLaVA (Ollama)* | 4.5GB | 🟡 | Phase 2 — vision model, no training needed |

#### V6. Experiment Tracking

| Tool | R/Y/G | Decision | Notes |
|------|--------|----------|-------|
| **MLFlow (local)** | 🟢 | ✅ Selected | Tracks embedding + chunking experiments |

**MLFlow Experiments logged:**
- BM25 Baseline — avg_score: 4.712, avg_time: 0.19ms ✅
- RAG llama3 — avg_score: 0.861, avg_time: 17932ms ✅

#### V7. Memory & Conversation

| Feature | Tool | R/Y/G | Notes |
|---------|------|--------|-------|
| Follow-up questions | ConversationBufferMemory | 🟢 | Last 5 queries |
| Multi-doc comparison | Multi-Query Retrieval | 🟢 | e.g. OEM-V vs OEM-W vs OEM-G |
| Long-term memory | — | 🔴 | Not in MVP |

#### V8. Infrastructure

| Service | Port | R/Y/G | Notes |
|---------|------|--------|-------|
| Ollama (llama3 + nomic-embed-text) | 11434 | 🟢 | ✅ Running |
| ChromaDB | local | 🟢 | ✅ Installed + tested |
| FastAPI Backend | 8001 | 🟢 | ✅ Running — DocSeek + PartSeek |
| React Frontend | 8081 | 🟢 | ✅ Running |
| MLFlow UI | 5000 | 🟢 | ✅ Running |
| Docker Compose | — | 🔴 | Planned — Phase 2 |

#### V9. Frontend & DevOps

| Tool | R/Y/G | Decision | Notes |
|------|--------|----------|-------|
| React + Vite | 🟢 | ✅ Selected | Fast, modern frontend |
| TailwindCSS | 🟢 | ✅ Selected | Utility-first styling |
| Framer Motion | 🟢 | ✅ Selected | Spring physics animations |
| shadcn/ui | 🟢 | ✅ Selected | Component library |
| Lovable.ai | 🟢 | ✅ Used | AI UI generator — code now in repo |
| FastAPI | 🟢 | ✅ Active | REST API — port 8001 ✅ |
| Git + GitHub + gh CLI | 🟢 | ✅ Selected | Version control + automation |
| Pytest | 🟢 | ✅ Selected | Backend testing |
| three.js + jt-js* | 🔴 | Phase 2 | 3D viewer |

---

### A — OUTPUT

#### A1. Search Results

| Feature | R/Y/G | Notes |
|---------|--------|-------|
| Answer + source link + highlight | 🟢 | Core feature — working ✅ |
| Confidence score 🟢🟡🔴 | 🟢 | ChromaDB similarity score — working ✅ |
| Risk table (same / different / conflict) | 🟢 | Prompt engineering |
| Warning for unsupported file types | 🟢 | Always shown |
| Document not found warning | 🟢 | When no match exists |

#### A2. DocSeek Output

| Feature | R/Y/G | Notes |
|---------|--------|-------|
| Compare across all docs | 🟢 | OEM comparison working ✅ |
| Follow-up questions | 🟢 | Context remembered |
| Query history dropdown | 🟢 | Stored in frontend |
| Summary + table of contents | 🟢 | LLM structured output |
| Download original document | 🟢 | From ChromaDB metadata |
| Team visibility (who asked?) | 🔴 | Phase 2 |
| Auto folder watcher | 🔴 | Phase 2 — watchdog |

#### A3. PartSeek Output

| Feature | R/Y/G | Notes |
|---------|--------|-------|
| Part search by text | 🟢 | Semantic search via ChromaDB ✅ |
| Thread size detection | 🟢 | Extracted from chunk text ✅ |
| Strength class detection | 🟢 | Extracted from chunk text ✅ |
| Drive type detection | 🟢 | Torx, Hex, Innensechskant ✅ |
| Coating detection | 🟢 | verzinkt, KTL, Zn ✅ |
| Self-locking detection | 🟢 | Mikroverkapselung, Prevailing Torque ✅ |
| Norm detection | 🟢 | DIN, MBN, ISO from text ✅ |
| OEM filter | 🟢 | Filter by oem_code ✅ |
| Team collision warning | 🟡 | MVP: basic — full Phase 2 |
| Part image search (YOLO) | 🟡 | Phase 2 — incremental |
| Project usage | 🔴 | Phase 2 |
| Recommended torque values | 🔴 | Phase 2 — linked to NormSeek |

---

## 9. DocSeek.ai — Full Feature List

### 9.1 Supported File Types

| Format | Tool | R/Y/G | Notes |
|--------|------|--------|-------|
| PDF (digital) | pdfplumber + LangChain | 🟢 | Main format |
| PDF (scanned) | pytesseract (OCR) | 🟡 | Quality depends on scan |
| PNG / WEBP | pytesseract + fpdf2 | 🟡 | OCR → searchable PDF ✅ |
| Word (.docx) | LangChain DocLoader | 🟢 | Clean extraction |
| Excel (.xlsx) | LangChain + openpyxl | 🟢 | Tables + structured data |
| Images with tables | pdfplumber | 🟡 | Digital PDFs only |
| CAD drawings (DXF/DWG) | PyMuPDF | 🟡 | Text fields only — no geometry |
| Email (.msg/.pst) | extract-msg* | 🔴 | Phase 2 |
| CAD metadata (NX) | NX Open API** | 🔴 | Phase 3 |
| JT 3D files | jt-js + three.js* | 🔴 | Phase 2 |

### 9.2 Chunking Strategy

| Document Type | Size | Chunk | Overlap | R/Y/G |
|---------------|------|-------|---------|--------|
| 1-Pager | < 1MB | 256 | 50 | 🟢 |
| Technical sheet (5–20p) | 1–3MB | 500 | 100 | 🟢 |
| Small Lastenheft (~50p) | ~6MB | 500 | 100 | 🟢 |
| Large Lastenheft (~300p) | ~10MB | 1000 | 200 | 🟡 |

### 9.3 Demo Scenario

**Question:**
> "Compare all salt spray test requirements for OEM-V, OEM-W and OEM-G."

**Expected output:**
A table with requirement, OEM, value, and status (🟢 same / ❌ different / ⚠️ conflict) — with a direct link to each source document.

---

## 10. PartSeek.ai — Full Feature List

### 10.1 Search Input

| Input | R/Y/G | Notes |
|-------|--------|-------|
| Text description | 🟢 | Semantic search via ChromaDB ✅ |
| Search by properties | 🟢 | Thread size, strength, coating, drive type ✅ |
| OEM filter | 🟢 | Filter by OEM code ✅ |
| Image upload — LLaVA | 🟡 | Phase 2 — no training needed |
| Image upload — YOLO | 🟡 | Phase 2 — incremental training from 10 images |

### 10.2 Team Collision Feature

If Engineer A searches for M16x20 and Engineer B searches for M16x21:

> *"A colleague recently searched for a similar part. Alignment recommended."*

**Goal:** Reduce part variety, encourage standardization.

### 10.3 YOLO — Incremental Image Training Plan

| Phase | Images | Goal |
|-------|--------|------|
| Phase 2a | 10 images | Proof of concept — basic part recognition |
| Phase 2b | 50 images | Better recognition — more part types |
| Phase 2c | 500 images | Production ready — high accuracy |

> Dataset source: Roboflow Universe — pre-labeled fastener datasets available.
> ChromaDB architecture already supports this — image chunks get:
> `module="partseek"` + `doc_type="Image"` + `category="Supplier-Fastener"`
> No restructuring needed when YOLO is added.

---

## 11. System Architecture

```
User types question
        ↓
React Frontend (port 8081)
        ↓
FastAPI Backend (port 8001)
        ↓
module filter → ChromaDB "knowseek" collection
        ↓
module="docseek"  → llama3 → text answer + source
module="partseek" → structured list + collision check
        ↓
Answer + confidence 🟢🟡🔴 + source → Frontend
```

---

## 12. Metadata Schema

Every document chunk stored in ChromaDB has metadata attached.
This prevents hallucination — llama3 can only answer based on verified source chunks.

### Base Schema — All Documents (rev06_001)

```python
metadata = {
    "source_id":    "#74ABC",
    "filename":     "OEM-G_Corrosion_PM.pdf",
    "page":         14,
    "chunk_index":  3,
    "oem_code":     "OEM-G",        # OEM-G / OEM-M / OEM-Z / OEM-H / OEM-S
    "category":     "Corrosion",    # Corrosion / Painting / OEM-Fastener /
                                    # Supplier-Fastener / Bracket / General
    "module":       "docseek",      # docseek / partseek / normseek / costseek
    "doc_type":     "Standard",     # 1-Pager / Datasheet / Standard / Lastenheft
    "language":     "EN",           # DE / EN — auto-detected by get_language()
    "verified":     True,
    "chunk_config": "medium",       # small / medium / large
}
```

### Category → Module Mapping

```python
# PartSeek categories — module="partseek"
PART_CATEGORIES = ["OEM-Fastener", "Supplier-Fastener", "Bracket"]

# DocSeek categories — module="docseek"
# Everything else: Corrosion, Painting, General
```

### Note on Categorization

> Categorization is based on **filename** — not chunk content.
> All chunks from one file get the same category and module.
> This is a known limitation — see Section 15.

### Drawing Warning — Anti-Hallucination

```python
metadata = {
    ...
    "geometry":  False,
    "text_only": True,
    "warning":   "Geometry not extractable — text fields only."
}
```

---

## 13. Repository Structure

```
KnowSeek/
├── 01_backend/
│   ├── main.py             ✅ rev06_001 — FastAPI port 8001
│   ├── modules/
│   │   ├── 01_partseek/
│   │   │   ├── ingest.py   ✅ rev06_001 — calls DocSeek ingest
│   │   │   ├── search.py   ✅ rev06_001 — filter module="partseek"
│   │   │   └── answer.py   ✅ rev06_001 — structured results + collision
│   │   ├── 02_docseek/
│   │   │   ├── ingest.py   ✅ rev06_001 — load + OCR + module tag + store
│   │   │   ├── search.py   ✅ rev06_001 — filter module="docseek"
│   │   │   └── answer.py   ✅ rev06_001 — RAG + llama3 + OEM comparison
│   │   ├── 03_normseek/    ⏳ Phase 2
│   │   └── 04_costseek/    ⏳ Phase 3
│   └── utils/
│       └── check_pdfs.py   ✅ rev06_001 — auto OCR for all modules
├── 02_frontend/
│   └── 01_src/             ✅ React running port 8081
├── 03_docs/
│   ├── discovery/          ← original planning docs (historical)
│   ├── pictures/
│   │   └── okr_diagram.svg
│   └── RnD_DESCRIPTION.md  ← This file — rev06_001
├── 04_progress/
│   └── sprint_logs/
│       └── SPRINT_PLAN.md  ← rev06_001
├── 05_data/                ← Local only — never pushed to GitHub
│   ├── 01_Fasteners/       ← PDFs (OCR converted) ✅
│   ├── 02_Specifikation/   ← OEM specification PDFs ✅
│   └── 03_Painting/        ← Paint standard PDFs ✅
├── 06_notebooks/
│   └── EDA.ipynb           ✅ rev06_001 — Chapter 1-6
├── build_ppt.py
├── docker-compose.yml      ← Planned Phase 2
├── .gitignore
├── LICENSE
├── README.md               ✅ rev06_001
└── requirements.txt        ✅ rev06_001
```

---

## 14. Sprint Plan Overview

| Week | Dates | Goal | Key Deliverable |
|------|-------|------|-----------------|
| Week 1 | 10–16.03 | Repo + Frontend + PM + Environment | ✅ Done |
| Week 2 | 17–20.03 | Midterm ready | ✅ EDA + MLFlow + Midterm PPT delivered |
| Week 3 | 21–26.03 | DocSeek + PartSeek + FastAPI | ✅ RAG pipeline + FastAPI running |
| Week 4 | 27.03 | Dry Run + Stakeholder PPT | Live demo + repo clean |
| Final | 02.04 | Stakeholder Presentation | Final delivery |

### Week 3 — Status (21–25.03)

| Area | Status | Notes |
|------|--------|-------|
| FastAPI main.py | ✅ | Running port 8001 — DocSeek + PartSeek |
| ChromaDB restructuring | ✅ | "docseek" → "knowseek" + module field |
| ingest.py rev06_001 | ✅ | New CATEGORY_MAP + get_module() |
| search.py DocSeek rev06_001 | ✅ | where=module="docseek" |
| search.py PartSeek rev06_001 | ✅ | where=module="partseek" |
| answer.py DocSeek rev06_001 | ✅ | RAG + OEM comparison |
| answer.py PartSeek rev06_001 | ✅ | Structured results + collision |
| check_pdfs.py | ✅ | Auto OCR in utils/ |
| EDA Notebook rev06_001 | ✅ | Chapter 1-6 + knowseek collection |
| 39 docs / 121 chunks | ✅ | 4 categories — docseek + partseek |
| Frontend connected to backend | 🔜 | main_sia07 |

---

## 15. Known Limitations

| Limitation | Impact | Workaround | When Fixed |
|------------|--------|------------|------------|
| Categorization based on filename only | Wrong module for some docs | Careful file naming | Phase 2 — chunk-level categorization |
| All chunks from one file = same module | Cross-module docs not split | Accepted for MVP | Phase 2 |
| "iso" keyword too broad | CRASH-ISO docs → partseek | Remove "iso" from CATEGORY_MAP | rev06_002 |
| Geometry from drawings not extractable | Image search limited | Text fields only | Phase 2 LLaVA / YOLO |
| Scanned PDFs — OCR quality varies | Some docs partially indexed | Warning shown | MVP accepted |
| OCR on technical drawings — partial | Symbols (±, ⌀, °) often missed | Use digital PDFs | MVP accepted |
| Embedding space changes with dataset size (Hypothesis) | EDA observation: 59 chunks → correct RED for nonsense. 121 chunks → score 0.797 for same query. Root cause: Semantic search finds relative best match, not absolute fit. **Question:** "Which chunk is best?" (relative) vs "Does this fit our knowledge?" (absolute). **Verification in progress** | **Hybrid Search (BM25 + Semantic):** Use BM25 as absolute filter — if BM25 score = 0 (no keywords match), return RED immediately. Only run semantic search if BM25 > 0. Answers the right question: "Does this query fit?" ✅ MVP-ready | Phase 2 exploration |
| High ChromaDB score ≠ good answer | Misleading confidence signal | Explain in UI | Phase 2 |
| Large Lastenhefte (300p) — slow | Ingestion takes time | Background processing | MVP accepted |
| Mac M1 16GB — resource limit | Can't run all services at once | Stop unused services | Docker Compose |
| No user authentication | All docs visible to all | Accepted for MVP demo | Phase 2 |
| Manual document ingestion | No auto-update | Run ingest script manually | Phase 2 watchdog |

---

## 16. Roadmap

### Phase 2 (after Capstone)

| Feature | Notes |
|---------|-------|
| NormSeek.ai | ISO / OEM norm comparison |
| YOLO image search | Start with 10 images — incremental training |
| LLaVA image search | No training needed — describe parts in text |
| JT 3D Viewer | three.js + jt-js |
| Multi-user + auth | Team features |
| Auto folder watcher | watchdog library |
| Email parsing | extract-msg / python-pst |
| CAD metadata from NX | NX Open API |
| Chunk-level categorization | LLM analyzes chunk text for better module assignment |

### Phase 3 (Production)

| Feature | Notes |
|---------|-------|
| CostSeek.ai | Design-to-cost analysis |
| Part project usage | Where is each part used |
| Recommended torque values | Linked to NormSeek |
| ERP / SAP connection | Structured database integration |

---

## 17. UI Design Principles

- **The Infinite Book** — navigation feels like turning pages
- **Spring Physics** — all transitions have weight and momentum
- **Living Pulse** — active AI elements breathe with a slow glow
- **Module Color Bleeding** — active module color bleeds into borders and glows
- **Paper-Reader Layout** — dark frame with bright document workspace
- **No hard cuts** — all transitions are smooth

---

## 18. Data Privacy & Notebook Rules

### 05_data — Never in GitHub
- All data stays local — never pushed
- .gitignore protects 05_data/

### Notebook Design Rules
- No file listings — only summary (count + size)
- No filenames visible in output
- Unsupported file types → warning shown early
- Data path shown — not file content

### PDF Readability Check — Auto OCR
Before ingest, all PDFs are checked for readable text.
- Step 1: Check each PDF — how many chars?
- Step 2: If 0 chars → OCR automatically applied
- Step 3: Check again after OCR
- Step 4: If still 0 chars → needs YOLO (Phase 2)

This check runs automatically in EDA Chapter 2.2.0 via `check_pdfs.py`.

### Supported File Types
✅ .pdf .png .webp .jpg .docx .xlsx
⚠️ everything else → warning at runtime

---

## 19. ChromaDB Architecture — One Collection, Module Filtering

All KnowSeek modules share ONE ChromaDB collection called **"knowseek"**.
Data is not separated by collection — it is separated by the `module` metadata field.

```
Collection "knowseek":
┌────────────────────────────────────────────────────┐
│ chunk → module="docseek"  + category="Corrosion"   │
│ chunk → module="docseek"  + category="Painting"    │
│ chunk → module="docseek"  + category="General"     │
│ chunk → module="partseek" + category="OEM-Fastener"│
│ chunk → module="partseek" + category="Supplier-..."│
│ chunk → module="normseek" + category="ISO-Standard"│ ← Phase 2
│ chunk → module="costseek" + category="Pricing"     │ ← Phase 3
└────────────────────────────────────────────────────┘
```

**Why one collection:**
- No data duplication — shared documents accessible by all modules
- Easy to scale — add NormSeek/CostSeek by adding module tag
- Simple ingest — one pipeline for all modules

**Why module filtering:**
- Each module shows only relevant results
- DocSeek gets documents — PartSeek gets parts
- Different response formats per module
- User chooses module in frontend — gets focused results

**Search examples:**
```python
# DocSeek — only document chunks
where={"module": "docseek"}

# PartSeek — only part chunks
where={"module": "partseek"}

# Cross-module — all chunks (no filter)
# e.g. for future global search feature
```

---

*This document is the single source of truth for all KnowSeek.ai development.*
*Version: rev06_001 — Last updated: 25.03.2026 — Branch: main_sia07*