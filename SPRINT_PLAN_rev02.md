# KnowSeek.Ai — Sprint Plan
**Version: rev02_work — Last updated: 09.03.2026**
*Solo Project — Antonios Simeonidis*

---

## 🎯 Deadlines

| Date | Deliverable |
|------|-------------|
| 20.03.2026 | **Midterm** — PPT: business case, EDA, model comparison |
| 27.03.2026 | **Final** — Live demo + 10 min presentation in GitHub |

---

## ✅ Capstone Requirements Checklist

- [ ] Business question clearly stated with background and impact
- [ ] Technical EDA completed in Python
- [ ] Multiple models tried and compared
- [ ] MLFlow experiment tracking in place
- [ ] All work stored in GitHub repo
- [ ] Final presentation slides in GitHub repo
- [ ] 10 min presentation ready
- [ ] Solo approval confirmed by coach ⚠️

---

## 📅 Week 1 — Setup & Backend Foundation (09.03 - 15.03)

### Day 1 — 09.03 ✅ DONE
- [x] Frontend UI Design finalized (rev02_work)
- [x] Lovable frontend exported and tested locally
- [x] GitHub repo structure clean and pushed
- [x] README, Sprint Plan, DEV_NOTES created
- [x] Rev system established

### Day 2 — 10.03
- [x] Solo project allowed? What extra documentation needed?
- [ ] GitHub Projects Board setup (link to repo)
- [ ] Frontend Fixes in Lovable: Fix B, Fix 2d, Fix 3
- [ ] Frontend rev02 released if fixes approved
- [ ] Ollama installed and running locally (llama3)
- [ ] ChromaDB installed and tested

### Day 3 — 11.03
- [ ] Python virtual environment setup (.venv)
- [ ] requirements.txt created
- [ ] EDA Notebook started in Jupyter
- [ ] Anonymized company documents loaded
- [ ] First document analysis (chunk size, token count, language distribution)

### Day 4 — 12.03
- [ ] MLFlow local setup running (http://127.0.0.1:5000)
- [ ] First MLFlow experiment created: "knowseek-docseek-v1"
- [ ] Baseline model defined (BM25 / keyword search)
- [ ] Baseline results logged in MLFlow

### Day 5 — 13.03
- [ ] Ollama llama3 RAG pipeline basic version
- [ ] llama3 results logged in MLFlow
- [ ] First model comparison: Baseline vs llama3
- [ ] FastAPI basic setup (POST /api/docseek/query, GET /api/health)

### Day 6 — 14.03
- [ ] Frontend connected to backend (first test)
- [ ] Source citation working (document name + page)
- [ ] EDA notebook first clean version

### Day 7 — 15.03
- [ ] Buffer day — fix open issues
- [ ] GitHub repo clean and up to date
- [ ] Midterm PPT outline ready

---

## 📅 Week 2 — Integration + Midterm (16.03 - 20.03)

### Day 8 — 16.03
- [ ] DocSeek end-to-end working (query → retrieve → answer → source)
- [ ] Results displayed in frontend

### Day 9 — 17.03
- [ ] PartSeek basic search working
- [ ] MLFlow: second model variant tested and logged

### Day 10 — 18.03
- [ ] **Midterm PPT — build**
  - Slide 1: Title + Team
  - Slide 2: Business Problem + Impact
  - Slide 3: Target User + Use Case
  - Slide 4: Solution Overview (KnowSeek.Ai)
  - Slide 5: EDA — Data Overview
  - Slide 6: EDA — Key Findings
  - Slide 7: Model Comparison (Baseline vs llama3)
  - Slide 8: MLFlow Results Screenshot
  - Slide 9: Live Demo Screenshot / Architecture
  - Slide 10: Next Steps

### Day 11 — 19.03
- [ ] PPT finalized and rehearsed (10 min timing)
- [ ] PPT added to GitHub repo
- [ ] All code committed and pushed

### Day 12 — 20.03 🎯 MIDTERM
- [ ] **Midterm Presentation delivered**

---

## 📅 Week 3 — Polish + Final (21.03 - 27.03)

### Day 13 — 21.03
- [ ] Midterm feedback noted and prioritized
- [ ] Demo flow defined (exactly what to show in 10 min)

### Day 14 — 22.03
- [ ] DocSeek with real data — full end-to-end test
- [ ] Error handling + loading states in frontend

### Day 15 — 23.03
- [ ] PartSeek polished
- [ ] Full demo rehearsal

### Day 16 — 24.03
- [ ] Final PPT started (updated from Midterm version)
- [ ] Demo video recorded (backup plan)

### Day 17 — 25.03
- [ ] Final PPT done
- [ ] All code clean and commented
- [ ] README final version

### Day 18 — 26.03
- [ ] Full dress rehearsal (10 min, timed)
- [ ] GitHub repo final check — all files in place
- [ ] PPT pushed to GitHub

### Day 19 — 27.03 🏁 FINAL
- [ ] **Final Presentation delivered**

---

## 📊 Component Status

| Component | Version | Status |
|-----------|---------|--------|
| Frontend UI | rev02_work | In progress |
| Frontend Fixes | rev02_001 | Pending (Lovable credits) |
| Backend FastAPI | - | Not started |
| ChromaDB | - | Not started |
| Ollama llama3 | - | Not started |
| MLFlow | - | Not started |
| EDA Notebook | - | Not started |
| Midterm PPT | - | Not started |
| Final PPT | - | Not started |

---

## 🗂 GitHub Projects Board — Columns

```
Backlog → In Progress → Review → Done
```

Tags:
- `frontend` `backend` `data` `ppt` `docs` `fix`

---

*Save in: `04_progress/01_sprint_logs/Sprint_Plan_rev02.md`*
