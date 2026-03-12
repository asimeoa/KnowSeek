#!/bin/bash
# KnowSeek.ai — Create all missing GitHub Issues
# Run from: /Users/asimeoa/aipm-1711/KnowSeek
# Date: 11.03.2026

# ─────────────────────────────────────────────
# TECHNICAL + SETUP ISSUES (#27–#32)
# ─────────────────────────────────────────────

# #27 — OEM Anonymization
gh issue create \
  --title "Security: Anonymize OEM brand names in frontend + docs" \
  --body "Replace real OEM names with OEM-V / OEM-W / OEM-G in DocSeekView.tsx and RnD_DESCRIPTION.md. PDF filenames also anonymized." \
  --label "security" \
  --milestone "Week 2 : Midterm Presentation Due: 20.03.2026"

# #28 — nomic-embed-text
gh issue create \
  --title "Backend: Pull nomic-embed-text via Ollama" \
  --body "Run: ollama pull nomic-embed-text. Verify DE + EN embedding works. Required before ChromaDB setup." \
  --label "backend" \
  --milestone "Week 1: Backend Foundation Due: 15.03.2026"

# #29 — ChromaDB
gh issue create \
  --title "Backend: Setup ChromaDB — install + first index test" \
  --body "pip install chromadb. Create first collection. Index 2-3 test PDFs. Verify similarity search returns results." \
  --label "backend" \
  --milestone "Week 1: Backend Foundation Due: 15.03.2026"

# #30 — docker-compose.yml
gh issue create \
  --title "Infrastructure: Setup docker-compose.yml" \
  --body "Create docker-compose.yml for Ollama + ChromaDB + FastAPI + MLFlow. One command starts everything. Planned end of Phase 1." \
  --label "backend" \
  --milestone "Week 1: Backend Foundation Due: 15.03.2026"

# #31 — Technical PPT
gh issue create \
  --title "Docs: Technical PPT — RAG pipeline + architecture + MLFlow" \
  --body "10 slides: RAG pipeline, embedding evaluation, chunking strategy, ChromaDB, MLFlow results, architecture, code structure, limitations, roadmap." \
  --label "documentation" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #32 — Stakeholder PPT
gh issue create \
  --title "Docs: Stakeholder PPT — business case + live demo" \
  --body "10 slides: problem, target users, solution, live demo DocSeek + PartSeek, trust signal, data privacy, OKR results, roadmap." \
  --label "documentation" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# ─────────────────────────────────────────────
# OKR ISSUES (#33–#42)
# ─────────────────────────────────────────────

# #33 — OKR Overall KR1
gh issue create \
  --title "OKR: Answer time measured + visualized — KR1 Overall" \
  --body "Measure answer time baseline vs RAG. Show as bar chart in EDA.ipynb. Proves system performance without being hardware dependent." \
  --label "okr" \
  --milestone "Week 2 : Midterm Presentation Due: 20.03.2026"

# #34 — OKR Overall KR4
gh issue create \
  --title "OKR: Confidence score on every result — KR4 Overall" \
  --body "Every result card shows confidence 🟢🟡🔴. >85% green / 60-85% yellow / <60% red. Verified in frontend manually." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #35 — OKR Overall KR3
gh issue create \
  --title "OKR: Multi language DE + EN working — KR3 Overall" \
  --body "Run test queries in German and English. Verify results returned correctly in both languages using nomic-embed-text." \
  --label "okr" \
  --milestone "Week 2 : Midterm Presentation Due: 20.03.2026"

# #36 — OKR Overall KR2
gh issue create \
  --title "OKR: Zero data leaves local machine — KR2 Overall" \
  --body "Verify no external API calls are made during query. Network monitor check. All processing stays on-premise." \
  --label "okr" \
  --milestone "Week 2 : Midterm Presentation Due: 20.03.2026"

# #37 — OKR DocSeek KR1
gh issue create \
  --title "OKR: DocSeek — 3 OEM comparisons working — KR1 DocSeek" \
  --body "Demo scenario runs without errors: OEM-V vs OEM-W vs OEM-G salt spray test comparison. Full risk table shown." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #38 — OKR DocSeek KR2
gh issue create \
  --title "OKR: Risk table correct — KR2 DocSeek" \
  --body "Risk table shows same / different / conflict correctly. Verified against known test documents." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #39 — OKR DocSeek KR3
gh issue create \
  --title "OKR: Source link clickable on every result — KR3 DocSeek" \
  --body "Every answer card has a clickable source link. Opens correct document at correct page. Manual test on all demo docs." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #40 — OKR PartSeek KR1
gh issue create \
  --title "OKR: PartSeek text search + time visualized — KR1 PartSeek" \
  --body "Text search finds correct part. Response time measured and shown in EDA.ipynb as chart." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #41 — OKR PartSeek KR2
gh issue create \
  --title "OKR: Team collision warning works — KR2 PartSeek" \
  --body "Test with 2 similar part queries (M16x20 and M16x21). Warning shown: colleague searched for similar part." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

# #42 — OKR PartSeek KR3
gh issue create \
  --title "OKR: All metadata shown on part result — KR3 PartSeek" \
  --body "Every part result shows: material, surface treatment, strength class, force values, OEM logo, part number, drawing link." \
  --label "okr" \
  --milestone "Week3: Final Presentation Due: 27.03.2026"

echo "✅ All issues created!"
