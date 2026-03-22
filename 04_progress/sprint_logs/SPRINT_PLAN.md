# KnowSeek.ai — Sprint Plan
**Version: rev05_003 — Last updated: 22.03.2026 — Branch: main_sia05**
*Solo Project — Antonios Simeonidis*

---

## Deadlines

| Date | Deliverable |
|------|-------------|
| 20.03.2026 | **Midterm** — PPT: business case, EDA, model comparison ✅ |
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
| Midterm PPT | 20.03 | Coach / Bootcamp | Business case + EDA + model comparison |
| Technical PPT | Week 3 | Technical audience | RAG pipeline + architecture + MLFlow results |
| Stakeholder PPT | 27.03 | Business audience | Problem + solution + demo + value |

---

## Week 1 — Repo + Frontend + PM + Environment (10–16.03)

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

### Completed ✅

- [x] Frontend UI Design finalized (rev02_work) — Lovable exported + tested
- [x] GitHub repo structure clean — Folder 01–06 in place
- [x] README rev05_003 — macOS + Windows + Linux setup
- [x] Sprint Plan created — this file
- [x] DEV_NOTES created — local setup instructions
- [x] GitHub Projects Board — 39 issues, 3 milestones
- [x] GitHub Issues #24, #25, #26 — Security, Data, OEM Icons
- [x] GitHub Issue — OEM Anonymization (brand names → OEM-V / OEM-W / OEM-G)
- [x] Frontend glow fixes — NormSeek #9199F4, CostSeek #FC9D57
- [x] Pulse animations in index.css — outer glow in pulse
- [x] AppSidebar.tsx colors — all 4 module colors correct
- [x] SearchBlock.tsx colors — glow colors corrected
- [x] Index.tsx overflow + padding — container fixed
- [x] Ollama installed — v0.17.7, llama3 downloaded (4.7GB)
- [x] Embedding model decided — nomic-embed-text via Ollama (DE + EN)
- [x] Chunking strategy decided — 4 document types, chunk sizes defined
- [x] Code structure decided — .py files for logic, notebooks for EDA only
- [x] OKRs defined — Objective + KRs for platform, DocSeek, PartSeek
- [x] RnD_DESCRIPTION.md rev05_003 — EVA + OKRs + Metadata Schema
- [x] OKR Diagram — okr_diagram.svg in 03_docs/pictures/
- [x] Folder cleanup — strategy.md + PROGRESS.md deleted
- [x] Branch main_sia_03 → main_sia_04 → main_sia05
- [x] #3 Solo project approval confirmed
- [x] #4 Ask coach: Solo project approval ✅ — approved
- [x] #5 Lovable Fix B — NormSeek + CostSeek sidebar icons
- [x] #6 Lovable Fix 2d — Sidebar icons equal brightness
- [x] #7 Lovable Fix 3 — Search field inner light ray effect
- [x] #8 Ollama install and test locally — llama3
- [x] #9 ChromaDB install and test locally
- [x] #10 Python virtual environment + requirements.txt rev05_003 ✅
- [x] Setup ChromaDB — chromadb 1.5.5 installed ✅
- [x] #39 Anonymized OEM test data loaded — 01_Fasteners / 02_Specifikation / 03_Painting ✅
- [x] Pull nomic-embed-text — nomic-embed-text 274MB installed ✅
- [x] #11 EDA Notebook — Chapter 1-6 complete ✅
- [x] #12 MLFlow local setup — running on http://127.0.0.1:5000 ✅
- [x] #13 BM25 Baseline — avg_score: 4.712 — logged in MLFlow ✅
- [x] #14 RAG llama3 — avg_score: 0.861 — logged in MLFlow ✅
- [x] #15 FastAPI — GET /api/health + POST /api/docseek/query ✅
- [x] #18 DocSeek end-to-end — ingest.py + search.py + answer.py ✅
- [x] #30 🎯 Confidence score 🟢🟡🔴 on every result ✅
- [x] #31 🎯 Multi language DE + EN working ✅
- [x] #32 🎯 Zero data leaves local machine — verified ✅
- [x] OCR pipeline — pytesseract + Pillow + fpdf2 ✅
- [x] check_pdfs.py — auto OCR check + conversion ✅
- [x] PNG → searchable PDF conversion — 01_Fasteners ✅
- [x] DE/EN language detection — get_language() in ingest.py ✅
- [x] Bolts+Torque category — CATEGORY_MAP updated ✅
- [x] EDA Chapter 3 complete — Data Overview + PDF Analysis + Chunk Size + Language ✅

---

## Week 2 — Integration + Midterm (17–20.03)

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

| Day | Issue | Task | Status |
|-----|-------|------|--------|
| 17.03 | #11 | EDA Chapter 6 — BM25 vs RAG comparison | ✅ |
| 17.03 | #29 🎯 | Answer time measured + visualized | ✅ |
| 18–19.03 | #19 | Midterm PPT — build | ✅ |
| 19.03 | #20 | PPT finalized + rehearsed | ✅ |
| 19.03 | #20 | PPT pushed to GitHub | ✅ |
| 20.03 🎯 | — | **Midterm Presentation** | ✅ Delivered |

### Midterm PPT — Slide Structure

| Slide | Content |
|-------|---------|
| 1 | Title + Name + Date |
| 2 | Business Problem + Impact |
| 3 | Target User + Use Case |
| 4 | Solution Overview (KnowSeek.ai) |
| 5 | EDA — Data Overview |
| 6 | EDA — Key Findings |
| 7 | Model Comparison (Baseline vs llama3) |
| 8 | MLFlow Results Screenshot |
| 9 | Architecture — Data Flow Diagram |
| 10 | Next Steps (Week 3 + 4) |

---

## Week 3 — DocSeek + PartSeek + FastAPI (21–26.03)

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

### Completed in main_sia05 ✅

| Day | Issue | Task | Status |
|-----|-------|------|--------|
| 21.03 | — | Apply Midterm feedback | ✅ |
| 21.03 | — | Before/After time comparison planned | ✅ |
| 21.03 | — | ROI calculation planned | ✅ |
| 22.03 | — | Load more documents — 39 docs / 121 chunks | ✅ |
| 22.03 | — | check_pdfs.py — auto OCR pipeline | ✅ |
| 22.03 | #15 | FastAPI — GET /api/health + POST /api/docseek/query | ✅ |
| 22.03 | — | PartSeek search.py + answer.py + ingest.py | ✅ |
| 22.03 | — | EDA rebuild — all chapters independent | ✅ |
| 22.03 | — | 01_backend/utils/ — shared tools folder | ✅ |

### Open — moves to main_sia06 🔜

| Day | Issue | Task | Deliverable |
|-----|-------|------|-------------|
| 23.03 | #16 | Frontend connected to backend | Error handling + loading states |
| 23.03 | #33 🎯 | DocSeek — 3 OEM comparisons working | Demo scenario runs without errors |
| 23.03 | #34 🎯 | Risk table correct | same / different / conflict verified |
| 23.03 | #35 🎯 | Source link clickable on every result | Manual test |
| 24.03 | #36 🎯 | PartSeek — text search + time visualized | Measured + shown in EDA.ipynb |
| 24.03 | #37 🎯 | Team collision warning works | Tested with 2 similar part queries |
| 24.03 | #38 🎯 | All metadata shown on part result | Material, strength, OEM logo verified |
| 24.03 | #27 | **Technical PPT — build** | See slide structure below |
| 25.03 | — | Before/After time comparison | Human: 2h vs KnowSeek: 3s |
| 25.03 | — | ROI calculation | 1 day saved per employee per year |
| 25.03 | — | All code clean + commented | Pytest passing |
| 26.03 | #22 | Full dress rehearsal | 10 min timed |
| 26.03 | — | GitHub repo final check | All files in place |

### Technical PPT — Slide Structure

| Slide | Content |
|-------|---------|
| 1 | Title — KnowSeek.ai Technical Overview |
| 2 | RAG Pipeline — Step by step |
| 3 | Embedding Model Evaluation — Why nomic-embed-text |
| 4 | Chunking Strategy — Document types + parameters |
| 5 | ChromaDB + Vector Search — How it works |
| 6 | MLFlow — Experiment results + spider diagram |
| 7 | System Architecture — Ports + Data Flow |
| 8 | Code Structure — .py files + Notebooks |
| 9 | Known Limitations + Mitigations |
| 10 | Phase 2 + Phase 3 Roadmap |

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
| 9 | OKR Results + ROI — 1 saved day per employee per year |
| 10 | Roadmap — Phase 2 + Phase 3 |

---

## Component Status

| Component | Version | Status |
|-----------|---------|--------|
| Frontend UI | rev02_001 | ✅ Done |
| AppSidebar.tsx | rev02_001 | ✅ Colors correct |
| SearchBlock.tsx | rev02_001 | ✅ Glow correct |
| index.css | rev02_001 | ✅ Pulse animations correct |
| Ollama + llama3 | 0.17.7 | ✅ Running |
| nomic-embed-text | 274MB | ✅ Installed |
| ChromaDB | 1.5.5 | ✅ Installed |
| rank-bm25 | 0.2.2 | ✅ Installed |
| MLFlow | 3.10.1 | ✅ Running — BM25 + RAG logged |
| 05_data | — | ✅ 39 docs / 121 chunks / 4 categories |
| ingest.py (DocSeek) | rev05_003 | ✅ Done — OCR + language detect |
| search.py (DocSeek) | rev05_003 | ✅ Done — filter + confidence score |
| answer.py (DocSeek) | rev05_003 | ✅ Done — RAG + OEM comparison |
| check_pdfs.py | rev05_003 | ✅ Done — auto OCR pipeline |
| ingest.py (PartSeek) | rev05_003 | ✅ Done — calls DocSeek ingest |
| search.py (PartSeek) | rev05_003 | ✅ Done — Bolts+Torque filter |
| answer.py (PartSeek) | rev05_003 | ✅ Done — structured results + collision |
| FastAPI main.py | rev05_003 | ✅ Running — port 8001 |
| EDA Notebook | rev05_003 | ✅ Chapter 1-6 complete |
| Midterm PPT | rev05_003 | ✅ Delivered 20.03.2026 |
| Technical PPT | — | 🔜 main_sia06 |
| Stakeholder PPT | — | 🔜 main_sia06 |
| RnD_DESCRIPTION.md | rev05_003 | ✅ Done |
| README.md | rev05_003 | ✅ Done |
| requirements.txt | rev05_003 | ✅ Done |
| build_ppt.py | rev05_002 | ✅ Done |
| docker-compose.yml | — | 🔜 Phase 2 |

---

## GitHub Projects Board

```
Backlog → In Progress → Review → Done
```

Tags: `frontend` `backend` `data` `ppt` `docs` `fix` `security` `okr`

Milestones:
- Week 1: Environment + Setup
- Week 2: Midterm Presentation
- Week 3 + 4: Final Demo

---

## GitHub CLI — Useful Commands

```bash
# Show all issues with status + labels
gh issue list --limit 50 --state all --json number,title,state,labels | python3 -c "
import json,sys
issues = json.load(sys.stdin)
for i in issues:
    labels = [l['name'] for l in i['labels']]
    print(f\"#{i['number']:3} {i['state']:6} {', '.join(labels):15} {i['title'][:50]}\")
"

# Show all milestones
gh api repos/asimeoa/KnowSeek/milestones | grep '"title"'

# Close an issue
gh issue close <number>

# Create a label
gh label create "labelname" --color "#HEX" --description "description"

# Create an issue
gh issue create \
  --title "Title" \
  --body "Description" \
  --label "okr" \
  --milestone "Week 3 : Dry Run Due: 27.03.2026"

# Add label to existing issue
gh issue edit <number> --add-label "labelname"

# Remove label from existing issue
gh issue edit <number> --remove-label "labelname"
```

---

*Save in: `04_progress/sprint_logs/SPRINT_PLAN.md`*
*Version: rev05_003 — Last updated: 22.03.2026 — Branch: main_sia05*