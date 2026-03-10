# 🚀 KnowSeek.ai Project Progress

## 🚦 Aktueller Status: [Woche 1 - Tag 1]
**Nächstes Ziel:** RAG-Pipeline mit Testdaten aufsetzen.

---

## 🛠️ Task Board (Abgehakt = Erledigt)

### Woche 1: DocSeek Core (RAG & Version Comparison)
- [ ] **Tag 1 AM:** Data Sourcing (Volvo Specs V1 & V2 erstellen)
- [ ] **Tag 1 PM:** Embedding Setup (OpenAI + ChromaDB)
- [ ] **Tag 2 AM:** Retrieval Logic (Fetch from both versions simultaneously)
- [ ] **Tag 2 PM:** Comparison Prompting (JSON Diff Output: "Was hat sich geändert?")
- [ ] **Tag 3 AM:** UI Layout in Lovable (Sidebar & Main Shell)
- [ ] **Tag 3 PM:** Comparison UI (Side-by-side View mit Red/Green Highlights)
- [ ] **Tag 4 AM:** Multilingual Bridge (DE Query -> EN Source -> DE Answer)
- [ ] **Tag 4 PM:** Source Citation (Anzeige von Seitenzahlen & Original-Snippets)
- [ ] **Tag 5:** Buffer & Testing (Fixing Hallucinations & UI-Polishing)

### Woche 2: PartSeek & Vision-RAG (Technical Drawings)
- [ ] **Tag 6 AM:** Drawing OCR Setup (Vision-LLM für Zeichnungsköpfe)
- [ ] **Tag 6 PM:** Metadata Indexing (Teilenummer, Material in DB speichern)
- [ ] **Tag 7 AM:** PartSeek Search Interface (Suchmaske in Lovable)
- [ ] **Tag 7 PM:** Result Cards (Design der Bauteil-Karten mit Metadaten)
- [ ] **Tag 8 AM:** "Where-used" Logic (Verknüpfung Projekt <-> Bauteil)
- [ ] **Tag 8 PM:** Image Preview (Modal-Ansicht für technische Zeichnungen)
- [ ] **Tag 9:** Buffer & Drawing-Quality Check (OCR-Optimierung)

### Woche 3: Decision Hub & Final Polish
- [ ] **Tag 10 AM:** Email Simulation (MD-Files für Freigaben erstellen)
- [ ] **Tag 10 PM:** Email-to-RAG Integration (Mails in Suche einbinden)
- [ ] **Tag 11 AM:** Context UI (Mail-Snippet neben PDF-Konflikt anzeigen)
- [ ] **Tag 11 PM:** HITL Buttons (Approve V1 / Approve V2 Buttons)
- [ ] **Tag 12 AM:** Decision Logging (Golden Truth JSON Log)
- [ ] **Tag 12 PM:** *Optional:* Gmail API Setup (Live Fetching)
- [ ] **Tag 13:** Workflow Polish (End-to-End Test: Find -> Check -> Decide)
- [ ] **Tag 14 AM:** Automotive Theming (Farben, Fonts, Dark Mode)
- [ ] **Tag 14 PM:** Skeleton Loaders & UX Feedback (Lade-Animationen)
- [ ] **Tag 15 AM:** Onboarding Tour (Interaktive Demo-Anleitung)
- [ ] **Tag 15 PM:** Responsive Check (Tablet & Desktop-Optimierung)

### Abschlussphase
- [ ] **Tag 16:** Final Data Scrubbing & Demo Video (Backup-Aufnahme)
- [ ] **Tag 17:** Final Polish (Letzte Bugfixes & Dokumentation)
- [ ] **Tag 18:** Dress Rehearsal (Präsentations-Training)
- [ ] **Tag 19:** Submission / Projekt-Abgabe 🏁
...
KnowSeek/
├── 📂 01_backend/              # Technical Core (Python & AI Modules)
│   ├── 📂 modules/             # The 4 Core Engines
│   │   ├── 📂 01_partseek/     # Geometry & Component Search
│   │   ├── 📂 02_docseek/      # Document & Requirements Search
│   │   ├── 📂 03_normseek/     # Standards & Compliance Check
│   │   └── 📂 04_costseek/     # Design-to-Cost Analysis
│   └── main.py                 # Entry point for AI logic
├── 📂 02_frontend/             # User Interface (React/Streamlit)
│   ├── 📂 src/                 # UI source code
│   ├── 📂 public/              # Icons and static images
│   └── README.md               # Interface setup instructions
├── 📂 03_docs/                 # Project Brain & Strategy
│   ├── 📂 discovery/           # YOUR FILES (00-05_knowseek.md)
│   └── strategy.md             # Business strategy & vision
├── 📂 04_progress/             # Development Logs & PDCA
│   ├── 📂 01_sprint_logs/      # Weekly PDCA updates
│   └── 📂 02_test_results/     # Logs from Jupyter Sandbox
├── 📂 05_data/                 # Sandboxed Environment
│   └── .gitkeep                # Placeholder for synthetic test data
├── .gitignore                  # Protection: Prevents accidental upload of real data
├── README.md                   # Main Table of Contents & Navigation
├── requirements.txt            # Python dependencies
└── knowseek_prototype.ipynb    # Sandbox for "dry run" testing