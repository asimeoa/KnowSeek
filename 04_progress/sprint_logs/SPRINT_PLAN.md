# KnowSeek.ai — Sprint Plan
**Version: rev07_002 — Last updated: 27.03.2026 21:10 — Branch: main_sia08**
*Solo Project — Antonios Simeonidis*

---

## Deadlines

| Date | Deliverable |
|------|-------------|
| 20.03.2026 | **Midterm** ✅ — PPT delivered |
| 27.03.2026 | **Dry Run** — Live demo + 10 min presentation |
| 02.04.2026 | **Stakeholder** — Final presentation |

---

## Capstone Requirements Checklist

- [ ] Business question clearly stated with background and impact
- [x] Technical EDA completed in Python
- [x] Multiple models tried and compared
- [x] MLFlow experiment tracking in place
- [x] All work stored in GitHub repo
- [ ] Final presentation slides in GitHub repo
- [ ] 10 min presentation ready
- [x] Solo approval confirmed by coach

---

## PPT Deliverables Overview

| PPT | When | Audience | Purpose |
|-----|------|----------|---------|
| Midterm PPT | 20.03 ✅ | Coach / Bootcamp | Business case + EDA + model comparison |
| Technical PPT | 26.03 | Technical audience | RAG + Hybrid Search + architecture |
| Stakeholder PPT | 27.03 | Business audience | Problem + solution + demo + value |

---

## Week 1 — Repo + Frontend + PM + Environment ✅

### Completed ✅

- [x] Frontend UI Design finalized — Lovable exported + tested
- [x] GitHub repo structure clean — Folder 01–06 in place
- [x] README rev06_001 — macOS + Windows + Linux setup
- [x] Sprint Plan + DEV_NOTES created
- [x] GitHub Projects Board — 44 issues, 3 milestones
- [x] OEM Anonymization schema defined
- [x] Frontend glow + pulse animations
- [x] Ollama v0.17.7 + llama3 + nomic-embed-text
- [x] ChromaDB 1.5.5 + rank-bm25 0.2.2
- [x] Python venv + requirements.txt ✅
- [x] MLFlow running on port 5000 ✅
- [x] #30 🎯 Confidence score 🟢🟡🔴 on every result ✅
- [x] #31 🎯 Multi language DE + EN working ✅
- [x] #32 🎯 Zero data leaves local machine — verified ✅
- [x] OCR pipeline — pytesseract + fpdf2 ✅
- [x] check_pdfs.py rev06_001 — auto OCR in utils/ ✅
- [x] EDA Chapter 1-3 complete ✅

---

## Week 2 — Midterm (17–20.03) ✅

| Day | Issue | Task | Status |
|-----|-------|------|--------|
| 17.03 | #11 | EDA Chapter 6 — BM25 vs RAG comparison | ✅ |
| 17.03 | #29 🎯 | Answer time measured + visualized | ✅ |
| 18–19.03 | #19 | Midterm PPT — build | ✅ |
| 20.03 | — | **Midterm Presentation** | ✅ Delivered |

---

## Week 3 — DocSeek + PartSeek + FastAPI + Hybrid Search (21–26.03)

### Completed in main_sia05 → main_sia08 ✅

| Branch | Issue | Task | Rev | Status |
|--------|-------|------|-----|--------|
| main_sia05 | — | Load more documents | — | ✅ 39 docs / 121 chunks |
| main_sia05 | #15 | FastAPI — health + docseek + partseek | rev05_003 | ✅ |
| main_sia05 | #18 | DocSeek end-to-end | rev05_003 | ✅ |
| main_sia06 | — | ChromaDB restructured "docseek" → "knowseek" | rev06_001 | ✅ |
| main_sia07 | — | ingest.py — CATEGORY_MAP + get_module() | rev06_001 | ✅ |
| main_sia07 | — | search.py DocSeek — module filter | rev06_001 | ✅ |
| main_sia07 | — | answer.py DocSeek — RAG + OEM comparison | rev06_001 | ✅ |
| main_sia07 | — | search.py PartSeek — module="partseek" filter | rev06_001 | ✅ |
| main_sia07 | — | answer.py PartSeek — structured + collision | rev06_001 | ✅ |
| main_sia07 | — | ingest.py PartSeek — wrapper → DocSeek | rev06_001 | ✅ |
| main_sia07 | — | main.py — importlib fix + health check | rev06_002 | ✅ |
| main_sia07 | — | EDA Notebook Chapter 1-6 | rev06_002 | ✅ |
| main_sia07 | — | PartSeekView.tsx — real API connected | rev06_001 | ✅ |
| main_sia07 | #40 | Hybrid Search BM25 + Domain Filter | rev06_002 | ✅ |
| main_sia07 | — | search.py DocSeek — Domain + BM25 Reranking | rev06_002 | ✅ |
| main_sia07 | — | answer.py DocSeek — llama3 only GREEN/YELLOW | rev06_002 | ✅ |
| main_sia07 | — | yolo_ingest.py — LLaVA + YOLO image ingest | rev07_001 | ✅ |
| main_sia07 | — | yolo_train.py — YOLO training pipeline | rev07_001 | ✅ |
| main_sia07 | — | YOLO_GUIDE.md — training guide | rev07_001 | ✅ |
| main_sia07 | — | RnD_DESCRIPTION.md — Hybrid Search documented | rev07_001 | ✅ |

### Open — main_sia08 🔜

| Day | Issue | Task | Deliverable |
|-----|-------|------|-------------|
| 27.03 | #41 | EDA Chapter 6.3 — real confidence classes (Green/Yellow/Red) | ✅ Measured, no synthetic scores |
| 27.03 | — | EDA Chapter 6.1 — hardcoded values removed | ✅ Runtime benchmark now fully measured |
| 27.03 | — | EDA Chapter 6.4 — denominator fix + color update | ✅ Scores no longer identical, Detailed=orange |
| 26.03 | #42 | DocSeekView.tsx — connected to real API | Answer + signal + sources shown |
| 26.03 | #33 🎯 | DocSeek — 3 OEM comparisons working | Demo scenario runs without errors |
| 26.03 | #34 🎯 | Risk table correct | same / different / conflict verified |
| 26.03 | #35 🎯 | Source link clickable on every result | Manual test |
| 26.03 | #36 🎯 | PartSeek — text search + time visualized | Measured + shown in EDA.ipynb |
| 26.03 | #37 🎯 | Team collision warning works | Tested with 2 similar part queries |
| 26.03 | #38 🎯 | All metadata shown on part result | Material, strength, OEM verified |
| 26.03 | #43 | YOLO/LLaVA — ollama pull llava + test | 10 images ingested |
| 26.03 | #27 | **Technical PPT — build** | See slide structure below |
| 26.03 | — | Before/After Zeitvergleich | Human: 2h vs KnowSeek: 3s |
| 26.03 | — | ROI Rechnung | 1 day saved per employee per year |
| 26.03 | #22 | Full dress rehearsal | 10 min timed |
| 26.03 | — | GitHub repo final check | All files in place |

### Technical PPT — Slide Structure (updated)

| Slide | Content |
|-------|---------|
| 1 | Title — KnowSeek.ai Technical Overview |
| 2 | RAG Pipeline — Step by step |
| 3 | Hybrid Search — BM25 + Semantic — Why + How |
| 4 | Embedding Model Evaluation — Why nomic-embed-text |
| 5 | Chunking Strategy — Document types + parameters |
| 6 | ChromaDB Architecture — One collection + module filtering |
| 7 | MLFlow — Experiment results |
| 8 | System Architecture — Ports + Data Flow |
| 9 | Known Limitations + Mitigations |
| 10 | Phase 2 Roadmap — YOLO + NormSeek |

---

## Week 4 — Final Demo + Stakeholder PPT (27.03)

| Issue | Task | Deliverable |
|-------|------|-------------|
| #28 | **Stakeholder PPT finalized** | See slide structure below |
| #21 | All PPTs pushed to GitHub | `04_progress/` |
| — | Live demo running | DocSeek + PartSeek on local machine |
| — | Repo clean | No temp files, all committed |
| — | **Final Presentation delivered** | 10 min — live demo included |

### Stakeholder PPT — Slide Structure

| Slide | Content |
|-------|---------|
| 1 | Title — KnowSeek.ai |
| 2 | The Problem — time lost, knowledge silos + ROI impact |
| 3 | Before/After — Human 2h vs KnowSeek 3s |
| 4 | The Solution — what KnowSeek.ai does |
| 5 | Live Demo — DocSeek (OEM comparison) |
| 6 | Live Demo — PartSeek (part search) |
| 7 | Trust Signal — Confidence 🟢🟡🔴 explained |
| 8 | Data Privacy — 100% local, no cloud |
| 9 | OKR Results + ROI |
| 10 | Roadmap — Phase 2 + Phase 3 |

---

## Component Status

| Component | Version | Status |
|-----------|---------|--------|
| Frontend UI | rev02_001 | ✅ Done |
| AppSidebar.tsx | rev02_001 | ✅ Colors correct |
| SearchBlock.tsx | rev02_001 | ✅ Glow correct |
| PartSeekView.tsx | rev06_001 | ✅ Real API connected |
| DocSeekView.tsx | — | 🔜 #42 main_sia08 |
| Ollama + llama3 | 0.17.7 | ✅ Running |
| nomic-embed-text | 274MB | ✅ Installed |
| LLaVA | — | 🔜 #44 ollama pull llava |
| ChromaDB | 1.5.5 | ✅ knowseek collection |
| rank-bm25 | 0.2.2 | ✅ Dual role: baseline + hybrid search |
| MLFlow | 3.10.1 | ✅ Running |
| 05_data | — | ✅ 39 docs / 121 chunks |
| ingest.py (DocSeek) | rev06_001 | ✅ knowseek + module field |
| search.py (DocSeek) | rev06_002 | ✅ Hybrid Search: Domain + ChromaDB + BM25 |
| answer.py (DocSeek) | rev06_002 | ✅ llama3 only GREEN/YELLOW |
| ingest.py (PartSeek) | rev06_001 | ✅ wrapper → DocSeek |
| search.py (PartSeek) | rev06_001 | ✅ module="partseek" filter |
| answer.py (PartSeek) | rev06_001 | ✅ structured + collision |
| check_pdfs.py | rev06_001 | ✅ auto OCR in utils/ |
| yolo_ingest.py | rev07_001 | ✅ Ready — needs llava |
| yolo_train.py | rev07_001 | ✅ Ready — needs images |
| YOLO_GUIDE.md | rev07_001 | ✅ Done |
| FastAPI main.py | rev06_002 | ✅ importlib fix — port 8001 |
| EDA Notebook | rev07_001 | ✅ Chapter 1-6 (6.1/6.3/6.4 revalidated with measured logic) |
| Midterm PPT | rev05_003 | ✅ Delivered 20.03.2026 |
| Technical PPT | — | 🔜 #27 26.03 |
| Stakeholder PPT | — | 🔜 #28 27.03 |
| RnD_DESCRIPTION.md | rev07_001 | ✅ Hybrid Search documented |
| README.md | rev06_001 | ✅ Done |
| SPRINT_PLAN.md | rev07_002 | ✅ This file |
| requirements.txt | rev06_001 | ✅ Done |
| docker-compose.yml | — | 🔜 Phase 2 |

---

## GitHub Projects Board

```
Backlog → In Progress → Review → Done
```

Tags: `frontend` `backend` `data` `ppt` `docs` `fix` `security` `okr`

Milestones:
- Week 1: Environment + Setup ✅
- Week 2: Midterm Presentation ✅
- Week 3: Final Presentation Due: 27.03.2026

---

## GitHub CLI — Useful Commands

```bash
# Show all issues
gh issue list --limit 50 --state all --json number,title,state,labels | python3 -c "
import json,sys
issues = json.load(sys.stdin)
for i in issues:
    labels = [l['name'] for l in i['labels']]
    print(f\"#{i['number']:3} {i['state']:6} {', '.join(labels):15} {i['title'][:50]}\")
"

# Close an issue
gh issue close <number>

# Create a label
gh label create "labelname" --color "#HEX" --description "description"

# Create an issue
gh issue create \
  --title "Title" \
  --body "Description" \
  --label "backend" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"
```

---

*Save in: `04_progress/sprint_logs/SPRINT_PLAN.md`*
*Version: rev07_002 — Last updated: 27.03.2026 21:10 — Branch: main_sia08*
