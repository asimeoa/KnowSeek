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

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

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
- [x] #4 Ask coach: Solo project approval ✅ — approved
- [x] #3 Solo project approval confirmed
- [x] #5 Lovable Fix B — NormSeek + CostSeek sidebar icons
- [x] #6 Lovable Fix 2d — Sidebar icons equal brightness
- [x] #7 Lovable Fix 3 — Search field inner light ray effect
- [x] #8 Ollama install and test locally — llama3
- [x] #9 ChromaDB install and test locally

### Still open — Week 1

- [ ] 🔴 Git commit + push all changes — branch main_sia_03
- [ ] 🔴 #10 Python virtual environment + requirements.txt
- [ ] 🔴 #39 Create fictional OEM test documents — OEM-V / OEM-W / OEM-G specs
- [ ] 🔴 Pull nomic-embed-text — `ollama pull nomic-embed-text`
- [ ] 🔴 Setup ChromaDB — `pip install chromadb`
- [ ] 🟡 #15 FastAPI basic endpoints — `GET /api/health` + `POST /api/docseek/query`
- [ ] 🟡 #12 MLFlow local setup — `http://127.0.0.1:5000`
- [ ] 🟡 #11 EDA Notebook — load and analyze anonymized documents

---

## Week 2 — Integration + Midterm (17–20.03)

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

| Day | Issue | Task | Deliverable |
|-----|-------|------|-------------|
| 17.03 | #18 | DocSeek end-to-end working | Query → retrieve → answer → source |
| 17.03 | #26 | OEM brand names anonymized | OEM-V / OEM-W / OEM-G in frontend + docs |
| 17.03 | — | PartSeek basic search working | Text search returns part + metadata |
| 18.03 | #13 | Baseline BM25 + MLFlow logged | Baseline vs llama3 comparison |
| 18.03 | #14 | llama3 RAG pipeline results logged | MLFlow experiment complete |
| 18.03 | #11 | EDA Notebook clean version | Charts, spider diagram, language distribution |
| 18.03 | 🎯 #29 | Answer time measured + visualized | Baseline vs RAG bar chart in EDA.ipynb |
| 18.03 | 🎯 #31 | Multi language DE/EN working | Test queries in DE + EN — results verified |
| 18.03 | 🎯 #32 | Zero data leaves machine verified | No external API calls confirmed |
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

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

| Day | Issue | Task | Deliverable |
|-----|-------|------|-------------|
| 21.03 | — | Midterm feedback → prioritize | Updated task list |
| 21.03 | — | Demo flow defined | Exact 10 min script |
| 22.03 | #18 | DocSeek full end-to-end with real data | OEM-V vs OEM-W vs OEM-G working |
| 22.03 | 🎯 #33 | DocSeek — 3 OEM comparisons working | Demo scenario runs without errors |
| 22.03 | 🎯 #34 | Risk table correct | same / different / conflict verified |
| 22.03 | 🎯 #35 | Source link clickable on every result | Manual test — every result has source |
| 22.03 | #16 | Frontend connected to backend | Error handling + loading states |
| 23.03 | 🎯 #36 | PartSeek — text search + time visualized | Measured + shown in EDA.ipynb |
| 23.03 | 🎯 #37 | Team collision warning works | Tested with 2 similar part queries |
| 23.03 | 🎯 #38 | All metadata shown on part result | Material, strength, OEM logo verified |
| 23.03 | 🎯 #30 | Confidence score 🟢🟡🔴 on all results | Visible on every result card |
| 24.03 | #27 | **Technical PPT — build** | See slide structure below |
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

> 🎯 marked tasks are OKR Key Results — tracked in GitHub Kanban Board with label `okr`

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

Tags: `frontend` `backend` `data` `ppt` `docs` `fix` `security` `okr`

Milestones:
- Week 1: Environment + Setup
- Week 2: Midterm Presentation
- Week 3 + 4: Final Demo

---

## New Issues to Create — Copy & Paste to Terminal as example 

### Technical + Setup Issues (#27,#32)

```bash
# #27 — OEM Anonymization
gh issue create \
  --title "Security: Anonymize OEM brand names in frontend + docs" \
  --body "Replace real OEM names with OEM-V / OEM-W / OEM-G in DocSeekView.tsx and RnD_DESCRIPTION.md. PDF filenames also anonymized." \
  --label "security" \
  --milestone "Week 2: Midterm Presentation"


# #32 — Stakeholder PPT
gh issue create \
  --title "Docs: Stakeholder PPT — business case + live demo" \
  --body "10 slides: problem, target users, solution, live demo DocSeek + PartSeek, trust signal, data privacy, OKR results, roadmap." \
  --label "documentation" \
  --milestone "Week 3 + 4: Final Demo"
```

### OKR Issues (#33,#42)

```bash
# #33 — OKR Overall KR1
gh issue create \
  --title "OKR: Answer time measured + visualized — KR1 Overall" \
  --body "Measure answer time baseline vs RAG. Show as bar chart in EDA.ipynb. Proves system performance without being hardware dependent." \
  --label "okr" \
  --milestone "Week 2: Midterm Presentation"



# #42 — OKR PartSeek KR3
gh issue create \
  --title "OKR: All metadata shown on part result — KR3 PartSeek" \
  --body "Every part result shows: material, surface treatment, strength class, force values, OEM logo, part number, drawing link." \
  --label "okr" \
  --milestone "Week 3 + 4: Final Demo"
```

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
  --label "labelname" \
  --milestone "Milestone Title Exact"

# Add label to existing issue
gh issue edit <number> --add-label "labelname"

# Remove label from existing issue
gh issue edit <number> --remove-label "labelname"
```

---

*Save in: `04_progress/sprint_logs/SPRINT_PLAN_rev03.md`*
*Version: rev03 — Last updated: 12.03.2026 — Branch: main_sia_03*
