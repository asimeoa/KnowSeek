# KnowSeek.ai — Sprint Plan
**Version: rev03 — Last updated: 11.03.2026 — Branch: main_sia_03**
*Solo Project — Antonios Simeonidis*

---

## Deadlines

| Date | Deliverable |
|------|-------------|
| 20.03.2026 | **Midterm** — PPT: business case, EDA, model comparison |
| 27.03.2026 | **Final** — Live demo + 10 min presentation in GitHub |

---

## Capstone Requirements Checklist

- [ ] Business question clearly stated with background and impact
- [ ] Technical EDA completed in Python
- [ ] Multiple models tried and compared
- [ ] MLFlow experiment tracking in place
- [ ] All work stored in GitHub repo
- [ ] Final presentation slides in GitHub repo
- [ ] 10 min presentation ready
- [ ] Solo approval confirmed by coach ⚠️

---

## PPT Deliverables Overview

| PPT | When | Audience | Purpose |
|-----|------|----------|---------|
| Midterm PPT | 20.03 | Coach / Bootcamp | Business case + EDA + model comparison |
| Technical PPT | Week 3 | Technical audience | RAG pipeline + architecture + MLFlow results |
| Stakeholder PPT | 27.03 | Business audience | Problem + solution + demo + value |

---

## Week 1 — Repo + Frontend + PM + Environment (10–16.03)

### Completed ✅

- [x] Frontend UI Design finalized (rev02_work) — Lovable exported + tested
- [x] GitHub repo structure clean — Folder 01–06 in place
- [x] README created — venv, Ollama, MLFlow URI
- [x] Sprint Plan created — this file
- [x] DEV_NOTES created — local setup instructions
- [x] GitHub Projects Board — 20 issues, 3 milestones
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
- [x] RnD_DESCRIPTION.md complete — EVA + OKRs + Master merged
- [x] Folder cleanup — strategy.md + PROGRESS.md deleted
- [x] Branch main_sia_03 — rev02_001 active

### Still open — Week 1

- [ ] 🔴 Ask coach: Solo project approval — before midterm
- [ ] 🔴 Git commit + push all changes — branch main_sia_03
- [ ] 🔴 #10 Python virtual environment + requirements.txt
- [ ] 🔴 #28 Pull nomic-embed-text — `ollama pull nomic-embed-text`
- [ ] 🔴 #29 Setup ChromaDB — `pip install chromadb`
- [ ] 🔴 #27 OEM brand names anonymized — frontend + docs
- [ ] 🟡 #15 FastAPI basic endpoints — `GET /api/health` + `POST /api/docseek/query`
- [ ] 🟡 #12 MLFlow local setup — `http://127.0.0.1:5000`
- [ ] 🟡 #11 EDA Notebook — load and analyze anonymized documents
- [ ] 🟡 #30 Setup docker-compose.yml — planned end of Phase 1

---

## Week 2 — Integration + Midterm (17–20.03)

| Day | Issue | Task | Deliverable |
|-----|-------|------|-------------|
| 17.03 | #18 | DocSeek end-to-end working | Query → retrieve → answer → source |
| 17.03 | #27 | OEM brand names anonymized | OEM-V / OEM-W / OEM-G in frontend + docs |
| 17.03 | — | PartSeek basic search working | Text search returns part + metadata |
| 18.03 | #13 | Baseline BM25 + MLFlow logged | Baseline vs llama3 comparison |
| 18.03 | #14 | llama3 RAG pipeline results logged | MLFlow experiment complete |
| 18.03 | #11 | EDA Notebook clean version | Charts, spider diagram, language distribution |
| 18–19.03 | #19 | **Midterm PPT — build** | See slide structure below |
| 19.03 | #20 | PPT finalized + rehearsed | 10 min timing |
| 19.03 | #20 | PPT pushed to GitHub | `04_progress/` |
| 20.03 🎯 | — | **Midterm Presentation** | Delivered |

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

## Week 3 — DocSeek + PartSeek + Technical PPT (21–26.03)

| Day | Issue | Task | Deliverable |
|-----|-------|------|-------------|
| 21.03 | — | Midterm feedback → prioritize | Updated task list |
| 21.03 | — | Demo flow defined | Exact 10 min script |
| 22.03 | #18 | DocSeek full end-to-end with real data | OEM-V vs OEM-W vs OEM-G working |
| 22.03 | #16 | Frontend connected to backend | Error handling + loading states |
| 23.03 | — | PartSeek polished | Team collision warning working |
| 23.03 | — | Confidence score 🟢🟡🔴 on all results | All modules |
| 24.03 | #31 | **Technical PPT — build** | See slide structure below |
| 25.03 | — | All code clean + commented | Pytest passing |
| 25.03 | — | README final version | Setup in 3 commands |
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
| #32 | **Stakeholder PPT finalized** | See slide structure below |
| #21 | All PPTs pushed to GitHub | `04_progress/` |
| — | Live demo running | DocSeek + PartSeek on local machine |
| — | Repo clean | No temp files, all committed |
| — | **Final Presentation delivered** | 10 min — live demo included |

### Stakeholder PPT — Slide Structure

| Slide | Content |
|-------|---------|
| 1 | Title — KnowSeek.ai |
| 2 | The Problem — time lost, knowledge silos |
| 3 | Who Is It For — target users |
| 4 | The Solution — what KnowSeek.ai does |
| 5 | Live Demo — DocSeek (OEM comparison) |
| 6 | Live Demo — PartSeek (part search) |
| 7 | Trust Signal — Confidence 🟢🟡🔴 explained |
| 8 | Data Privacy — 100% local, no cloud |
| 9 | OKR Results — what we achieved |
| 10 | Roadmap — Phase 2 + Phase 3 |

---

## Component Status

| Component | Version | Status |
|-----------|---------|--------|
| Frontend UI | rev02_001 | ✅ Done — branch main_sia_03 |
| AppSidebar.tsx | rev02_001 | ✅ Colors correct |
| SearchBlock.tsx | rev02_001 | ✅ Glow correct |
| index.css | rev02_001 | ✅ Pulse animations correct |
| Ollama + llama3 | 0.17.7 | ✅ Running |
| nomic-embed-text | — | 🔜 Pull needed |
| ChromaDB | — | 🔜 Next |
| FastAPI | — | 🔜 Next |
| MLFlow | — | 🔜 Next |
| EDA Notebook | — | 🔜 Week 1 remaining |
| Midterm PPT | — | 🔜 Week 2 |
| Technical PPT | — | 🔜 Week 3 |
| Stakeholder PPT | — | 🔜 Week 4 |
| RnD_DESCRIPTION.md | rev02_001 | ✅ Done |
| docker-compose.yml | — | 🔜 Planned |

---

## GitHub Projects Board

```
Backlog → In Progress → Review → Done
```

Tags: `frontend` `backend` `data` `ppt` `docs` `fix` `security`

Milestones:
- Week 1: Environment + Setup
- Week 2: Midterm Presentation
- Week 3 + 4: Final Demo

---

## New Issues to Create — Copy & Paste to Terminal

```bash
# #27 — OEM Anonymization
gh issue create \
  --title "Security: Anonymize OEM brand names in frontend + docs" \
  --body "Replace real OEM names with OEM-V / OEM-W / OEM-G in DocSeekView.tsx and RnD_DESCRIPTION.md. PDF filenames also anonymized." \
  --label "security" \
  --milestone "Week 2: Midterm Presentation"

# #28 — nomic-embed-text
gh issue create \
  --title "Backend: Pull nomic-embed-text via Ollama" \
  --body "Run: ollama pull nomic-embed-text. Verify DE + EN embedding works. Required before ChromaDB setup." \
  --label "backend" \
  --milestone "Week 1: Environment + Setup"

# #29 — ChromaDB
gh issue create \
  --title "Backend: Setup ChromaDB — install + first index test" \
  --body "pip install chromadb. Create first collection. Index 2-3 test PDFs. Verify similarity search returns results." \
  --label "backend" \
  --milestone "Week 1: Environment + Setup"

# #30 — docker-compose.yml
gh issue create \
  --title "Infrastructure: Setup docker-compose.yml" \
  --body "Create docker-compose.yml for Ollama + ChromaDB + FastAPI + MLFlow. One command starts everything. Planned end of Phase 1." \
  --label "backend" \
  --milestone "Week 1: Environment + Setup"

# #31 — Technical PPT
gh issue create \
  --title "Docs: Technical PPT — RAG pipeline + architecture + MLFlow" \
  --body "10 slides: RAG pipeline, embedding evaluation, chunking strategy, ChromaDB, MLFlow results, architecture, code structure, limitations, roadmap." \
  --label "documentation" \
  --milestone "Week 3 + 4: Final Demo"

# #32 — Stakeholder PPT
gh issue create \
  --title "Docs: Stakeholder PPT — business case + live demo" \
  --body "10 slides: problem, target users, solution, live demo DocSeek + PartSeek, trust signal, data privacy, OKR results, roadmap." \
  --label "documentation" \
  --milestone "Week 3 + 4: Final Demo"
```

---

*Save in: `04_progress/sprint_logs/SPRINT_PLAN_rev03.md`*
*Version: rev03 — Last updated: 11.03.2026 — Branch: main_sia_03*
