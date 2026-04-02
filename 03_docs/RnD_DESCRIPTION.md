# KnowSeek.ai — RnD Description
**On-Premise AI Knowledge Platform**
*Capstone Project — MVP Reference Document*
*Version: rev09.001*
*Last updated: 02.04.2026 — Branch: main_sia10*

> All data stays local. No cloud. No internet required.

---

## Module Overview

| # | Module | Color | Status |
|---|--------|-------|--------|
| 01 | **DocSeek.ai** | Emerald Green #10B981 | ✅ MVP |
| 02 | **PartSeek.ai** | Electric Blue #0EA5E9 | ✅ MVP |
| 03 | **NormSeek.ai** | Indigo #9199F4 | ⏳ Phase 2 |
| 04 | **CostSeek.ai** | Orange #FC9D57 | ⏳ Phase 3 |

**Midterm: 20.03.2026 ✅ · Dry Run: 27.03.2026 ✅ · Stakeholder: 02.04.2026**
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

### Objective

> "Give engineers instant answers from their own documents —
> local, private, with source included, and a clear trust signal
> 🟢🟡🔴 they can see at a glance."

### Key Results — MVP Overall

| # | Key Result | Status |
|---|------------|--------|
| KR1 | Answer time measured + visualized | ✅ EDA Chapter 6 |
| KR2 | System runs 100% offline | ✅ Verified |
| KR3 | Works in DE + EN | ✅ nomic-embed-text |
| KR4 | Confidence score 🟢🟡🔴 on every result | ✅ Frontend + API |

### Key Results — DocSeek.ai

| # | Key Result | Status |
|---|------------|--------|
| KR1 | OEM comparison working | ✅ compare endpoint |
| KR2 | Source link on every result | ✅ filename + page |
| KR3 | Hybrid Search prevents hallucination | ✅ BM25 filter |

### Key Results — PartSeek.ai

| # | Key Result | Status |
|---|------------|--------|
| KR1 | Text search finds parts | ✅ ChromaDB + metadata |
| KR2 | Team collision warning | ✅ collision field in API |
| KR3 | Metadata extracted at ingest | ✅ thread/material/oem/part_type |

---

## 5. How It Works — RAG Pipeline with Hybrid Search

```
STEP 1 — Ingest (done once):
Documents → split into chunks → convert to vectors → store in ChromaDB

STEP 2 — Answer (every query):

  Query
    ↓
  Track Engine (analyze_query)
  → detect module, category, oem, intent
    ↓
  ChromaDB Semantic Search (with metadata filter)
    ↓
  BM25 Reranking
  BM25 = 0 → 🔴 RED override
    ↓
  llama3 (DocSeek only — GREEN/YELLOW chunks)
    ↓
  Answer + confidence 🟢🟡🔴 + source
```

**Confidence traffic light:**

| Score | Color | Meaning |
|-------|-------|---------|
| > 85% | 🟢 Green | Reliable answer — source found |
| 60–85% | 🟡 Yellow | Partial match — check the source |
| < 60% | 🔴 Red | Low confidence — verify manually |
| BM25 = 0 | 🔴 Red | Query outside knowledge domain |

---

## 6. Tech Stack — MVP

| Component | Technology | Why |
|-----------|-----------|-----|
| LLM | llama3:8b via Ollama | 100% offline |
| Embedding | nomic-embed-text via Ollama | DE + EN support |
| Hybrid Search | ChromaDB + rank-bm25 | Semantic + keyword |
| Vector DB | ChromaDB | Local, persistent |
| RAG framework | LangChain | PDF loaders + memory |
| OCR | pytesseract + Pillow + fpdf2 | Scanned PDFs |
| Backend API | FastAPI (Python 3.11.3) | REST API port 8001 |
| Frontend | React + Vite + TailwindCSS | Port 8081 |
| UI components | shadcn/ui + Framer Motion | Animations |
| Experiment tracking | MLFlow (local, port 5000) | Model comparison |

---

## 7. Code Structure

```
01_backend/
├── main.py                  ✅ rev09.001 — FastAPI port 8001
├── modules/
│   ├── 01_partseek/
│   │   ├── ingest.py        ✅ rev09.001 — extract_thread/material/oem/part_type
│   │   ├── search.py        ✅ rev09.001 — Ollama embedding + BM25 Hybrid
│   │   └── answer.py        ✅ rev09.001 — structured results + collision
│   ├── 02_docseek/
│   │   ├── ingest.py        ✅ rev09.001 — OEM mapping (GM/Volvo/MB/DIN/VW/Ford)
│   │   ├── search.py        ✅ rev09.001 — Hybrid Search + Ollama embedding
│   │   └── answer.py        ✅ rev09.001 — RAG + OEM compare
│   ├── 03_normseek/         ⏳ Phase 2
│   └── 04_costseek/         ⏳ Phase 3
└── utils/
    └── track_engine.py      ✅ rev09.001 — analyze_query() + build_where_filter()

02_frontend/
└── 01_src/                  ✅ rev09.001 — React running port 8081
    └── src/components/
        ├── DocSeekView.tsx   ✅ rev09.001 — 3-level track UI
        ├── PartSeekView.tsx  ✅ rev09.001 — Focus track + ScrewSketch
        └── ScrewSketch.tsx   ✅ rev09.001 — SVG technical drawing

06_notebooks/
└── EDA.ipynb                ✅ rev09.001 — Chapter 1-6
```

---

## 8. OEM Mapping — Real Names (rev09.001)

| OEM | Code in System | Files |
|-----|---------------|-------|
| General Motors | GM | GM_Fastener_*.pdf |
| Volvo | Volvo | Volvo_*.pdf, VCS_*.pdf |
| Mercedes-Benz | MB | MBN_*.pdf |
| DIN Norm | DIN | DIN_*.pdf |
| Volkswagen | VW | VW_*.pdf |
| Ford | Ford | Ford_*.pdf |

> Note: Previous anonymization codes (OEM-G, OEM-M, OEM-Z, OEM-H, OEM-S) replaced with real names in rev09.001.

---

## 9. ChromaDB — Current State (02.04.2026)

```
Collection: knowseek
Total chunks:    4807 + 692 (PartSeek structured)
DocSeek chunks:  603
PartSeek chunks: 692 (with full metadata extraction)
Total docs:      41 PDFs
Ingest time:     ~86s
```

**PartSeek Metadata extracted at ingest:**
- `thread` — M6, M8, M10, M12, M14, M16
- `material` — Steel, Stainless Steel, Plastic, Aluminum
- `part_type` — flange_screw, bolt, nut, washer, rivet, weld_nut
- `surface_color` — Black, Silver, Zinc, Blank
- `oem` — GM, Volvo, DIN, VW, Ford

---

## 10. API Endpoints — Active (rev09.001)

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | /api/health | ✅ |
| POST | /api/docseek/query | ✅ |
| POST | /api/docseek/compare | ✅ |
| POST | /api/partseek/query | ✅ |
| POST | /api/query (unified) | ✅ |

---

## 11. Demo Scenarios — 02.04.2026

### DocSeek Demo (Primary)
**Question:** `"What are the corrosion requirements for automotive components?"`
**Expected:** Answer with source, confidence 🟢 GREEN ~0.88, time ~25s

### PartSeek Demo (Concept)
**Question:** `"flange screw Volvo"`
**Expected:** found: true, material: Steel, oem: Volvo, part_type: flange_screw

### Key Message for Stakeholders
> "DocSeek is production-ready. PartSeek Phase 1 proves the concept —
> Phase 2 brings structured data from ERP/SAP for exact part filtering."

---

## 12. Known Limitations — MVP

| Limitation | Impact | Phase |
|------------|--------|-------|
| PartSeek metadata from PDF text | N/A fields where text is unclear | Phase 2 |
| Thread filter not exact (semantic) | M10 search may return M6 | Phase 2 — SQL filter |
| OEM-UNKNOWN for some docs | Missing OEM filter | Phase 2 — better filename mapping |
| DocSeek OEM filter not fully active | All OEMs searched | Phase 2 |
| No user authentication | All docs visible to all | Phase 2 |
| Manual ingest required | No auto-update | Phase 2 — watchdog |

---

## 13. Roadmap

### Phase 2

| Feature | Notes |
|---------|-------|
| NormSeek.ai | ISO / OEM norm comparison |
| SQL/ERP integration for PartSeek | Exact thread/material filter |
| YOLO image search | Start with 10 images |
| Multi-user + auth | Team features |
| Auto folder watcher | watchdog library |
| Docker Compose | One-command startup |

### Phase 3

| Feature | Notes |
|---------|-------|
| CostSeek.ai | Design-to-cost analysis |
| ERP / SAP connection | Live data integration |
| NX CAD metadata | Part geometry search |

---

## 14. Sprint Overview

| Week | Goal | Status |
|------|------|--------|
| Week 1 — 10–16.03 | Repo + Environment | ✅ Done |
| Week 2 — 17–20.03 | Midterm | ✅ Done |
| Week 3 — 21–26.03 | DocSeek + PartSeek + FastAPI | ✅ Done |
| Week 4 — 27.03 | Dry Run | ✅ Done |
| Final — 02.04 | Stakeholder Presentation | 🔜 Today |

---

## 15. System Architecture

```
User types question
        ↓
React Frontend (port 8081)
        ↓
FastAPI Backend (port 8001)
        ↓
Track Engine → analyze_query() → build_where_filter()
        ↓
ChromaDB (collection: knowseek)
  module=docseek  → llama3 → Answer + Source
  module=partseek → Structured Result + Collision Warning
        ↓
Confidence 🟢🟡🔴 + Source → Frontend
```

---

## 16. Hybrid Search — Design Decision

Semantic search alone answers: *"Which chunk is most similar?"* — always returns a result, even for nonsense queries.

**Solution — Hybrid Search (BM25 + Semantic):**

```
Step 1 — Domain Check:    No keywords → 🔴 RED immediately
Step 2 — Semantic Search: ChromaDB vector similarity
Step 3 — BM25 Reranking:  BM25=0 → 🔴 RED override
Step 4 — LLM Answer:      Only for GREEN/YELLOW (DocSeek only)
```

**Test results:**
```
corrosion requirements → BM25 > 0 → 🟢 GREEN ✅
bitcoin crypto         → BM25 = 0 → 🔴 RED   ✅
```

---

## 17. PPT Key Arguments — 02.04.2026

1. **Challenge:** Standard AI is "number-blind" — M6 vs M8 confusion
2. **Solution:** Hybrid Precision — Metadata Filter + BM25 + Track Method
3. **Data Quality:** Structured metadata extracted at ingest — no guessing
4. **Privacy:** 100% on-premise — no data leaves the company
5. **ROI:** Engineers save hours per week — break-even within 12 months
6. **Roadmap:** Phase 2 ERP integration → exact part filtering

---

*This document is the single source of truth for all KnowSeek.ai development.*
*Version: rev09.001 — Date: 02.04.2026 — Branch: main_sia10*