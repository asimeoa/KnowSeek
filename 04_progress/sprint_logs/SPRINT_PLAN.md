# KnowSeek.ai — Sprint Plan
**Version: rev09.001 — Last updated: 02.04.2026 — Branch: main_sia11**
*Solo Project — Antonios Simeonidis*

---

## Deadlines

| Date | Deliverable | Status |
|------|-------------|--------|
| 20.03.2026 | **Midterm** — PPT delivered | ✅ Done |
| 27.03.2026 | **Dry Run** — Live demo | ✅ Done |
| **02.04.2026** | **Stakeholder Presentation** | ✅ Done |

---

## Component Status — rev09.001 (02.04.2026)

| Component | Version | Status |
|-----------|---------|--------|
| Frontend UI | rev09.001 | ✅ Running port 8081 |
| PartSeekView.tsx | rev09.001 | ✅ Real API + Focus Track UI |
| DocSeekView.tsx | rev09.001 | ✅ Real API + 3-level Track UI |
| ScrewSketch.tsx | rev09.001 | ✅ SVG technical drawing |
| Ollama + llama3 | 0.17.7 | ✅ Running |
| nomic-embed-text | 274MB | ✅ Installed |
| ChromaDB | 1.5.5 | ✅ 4807 chunks + 692 PartSeek |
| rank-bm25 | 0.2.2 | ✅ Installed |
| MLFlow | 3.10.1 | ✅ Running port 5000 |
| ingest.py (DocSeek) | rev09.001 | ✅ Real OEM names (GM/Volvo/MB/DIN/VW/Ford) |
| search.py (DocSeek) | rev09.001 | ✅ Ollama embedding fix |
| answer.py (DocSeek) | rev09.001 | ✅ OEM codes updated |
| ingest.py (PartSeek) | rev09.001 | ✅ Metadata: thread/material/oem/part_type |
| search.py (PartSeek) | rev09.001 | ✅ Ollama embedding fix + oem_code field fix |
| answer.py (PartSeek) | rev09.001 | ✅ Structured output + collision |
| FastAPI main.py | rev09.001 | ✅ Running port 8001 |
| track_engine.py | rev08.001 | ✅ Active |
| EDA Notebook | rev09.001 | ✅ Chapter 1-6 + BASE_PATH fix |
| RnD_DESCRIPTION.md | rev09.001 | ✅ Updated 02.04.2026 |
| Stakeholder PPT | rev09.001 | ✅ PDF in 03_docs/ |
| requirements.txt | rev09.001 | ✅ plotly added |

---

## Final Sprint — main_sia10 (01.04. – 02.04.) ✅ DONE

| Issue | Task | Status |
|-------|------|--------|
| #80 | Fix ChromaDB embedding conflict (Ollama missing in search.py PartSeek) | ✅ Done |
| #81 | Fix oem_code field name → oem in search_part_with_filter | ✅ Done |
| #82 | Remove invalid thread/material filter from main.py PartSeek route | ✅ Done |
| #83 | Replace anonymous OEM codes with real names (GM/Volvo/MB/DIN/VW/Ford) | ✅ Done |
| #84 | Add GM + Volvo to CATEGORY_MAP in ingest.py | ✅ Done |
| #85 | Fix DocSeek incomplete block — oem_code no longer required | ✅ Done |
| #86 | Add VCS → Volvo to OEM_MAP | ✅ Done |
| #87 | Fix BASE_PATH in EDA Notebook (cwd-based, no hardcoded paths) | ✅ Done |
| #88 | Fix f-string syntax error in EDA Notebook | ✅ Done |
| #89 | Fix setApiData → setRealData in DocSeekView.tsx | ✅ Done |
| #90 | Update DocOem types — real OEM names in Frontend | ✅ Done |
| #91 | PartSeek ingest restored — metadata extraction active | ✅ Done |
| #92 | Remove duplicate chroma_db in 06_notebooks/ | ✅ Done |
| #93 | Add plotly to requirements.txt | ✅ Done |
| #94 | Stakeholder PDF pushed to GitHub | ✅ Done |

---

## Week 4 — Retrieval Refactor + Precision Pivot (main_sia09) ✅ DONE

| Issue | Task | Status |
|-------|------|--------|
| #60 | Build Track Engine | ✅ |
| #61 | Integrate Track Engine in FastAPI | ✅ |
| #62 | PartSeek: Apply metadata filter before search | ✅ |
| #63 | PartSeek: Remove LLM call | ✅ |
| #64 | DocSeek: Apply metadata filter before semantic search | ✅ |
| #65 | DocSeek: Improve LLM prompt | ✅ |
| #66 | Chunking: Reduce chunk_size → 250, re-ingest | ✅ |
| #70 | Over-Retrieval N×4 pool + BM25 Hybrid (60/40) | ✅ |
| #71 | Metadata-Pass: extract_thread/material/oem/part_type | ✅ |
| #75 | Data Pipeline: split GM catalog | ✅ |
| #76 | Data Pipeline: split Volvo catalog | ✅ |
| #77 | Extraction Validation: 4-case test | ✅ |

---

## Week 3 — DocSeek + PartSeek + FastAPI (main_sia05–08) ✅ DONE

| Branch | Task | Status |
|--------|------|--------|
| main_sia05 | FastAPI health + docseek + partseek | ✅ |
| main_sia06 | ChromaDB restructured → knowseek | ✅ |
| main_sia07 | Hybrid Search BM25 + Domain Filter | ✅ |
| main_sia07 | PartSeekView.tsx — real API connected | ✅ |
| main_sia08 | EDA Chapter 1-6 complete | ✅ |

---

## Week 2 — Midterm (17–20.03) ✅ DONE

| Task | Status |
|------|--------|
| EDA Chapter 6 — BM25 vs RAG comparison | ✅ |
| Answer time measured + visualized | ✅ |
| Midterm PPT delivered | ✅ 20.03.2026 |

---

## Week 1 — Setup (10–16.03) ✅ DONE

| Task | Status |
|------|--------|
| GitHub repo structure | ✅ |
| Ollama + llama3 + nomic-embed-text | ✅ |
| ChromaDB + rank-bm25 | ✅ |
| MLFlow running | ✅ |
| OCR pipeline | ✅ |
| Frontend UI Design | ✅ |

---

## Capstone Requirements Checklist

- [x] Business question clearly stated with background and impact
- [x] Technical EDA completed in Python (Chapter 1-6)
- [x] Multiple models tried and compared (BM25 vs RAG)
- [x] MLFlow experiment tracking in place
- [x] All work stored in GitHub repo
- [x] Final presentation PDF in GitHub repo
- [x] 10 min presentation ready
- [x] Solo approval confirmed by coach

---

## Demo Scenarios — 02.04.2026

### DocSeek
```bash
curl -X POST http://localhost:8001/api/docseek/query \
  -H "Content-Type: application/json" \
  -d '{"question": "corrosion requirements for automotive components"}'
```
Expected: confidence ~0.88 🟢, sources from KTL + Volvo docs

### PartSeek
```bash
curl -X POST http://localhost:8001/api/partseek/query \
  -H "Content-Type: application/json" \
  -d '{"question": "flange screw Volvo"}'
```
Expected: found: true, material: Steel, oem: Volvo, part_type: flange_screw

---

## Services Start — Demo Day

```bash
cd /Users/asimeoa/aipm-1711/KnowSeek
source .venv/bin/activate
brew services start ollama
python3 01_backend/main.py

# New terminal:
cd 02_frontend/01_src
npm run dev
```

URLs:
- Frontend: http://localhost:8081
- Backend: http://localhost:8001
- MLFlow: http://localhost:5000

---

## Phase 2 Roadmap (after Capstone)

| Feature | Notes |
|---------|-------|
| NormSeek.ai | ISO / OEM norm comparison |
| SQL/ERP integration for PartSeek | Exact thread/material filter |
| YOLO image search | Start with 10 images |
| Docker Compose | One-command startup |
| Multi-user + auth | Team features |
| Auto folder watcher | watchdog library |

---

*Version: rev09.001 — Last updated: 02.04.2026 — Branch: main_sia11*