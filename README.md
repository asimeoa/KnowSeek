# KnowSeek.Ai 
> **Stop searching. Start knowing.**

**Version:** rev05_003 22.03.2026  - **Branch:** main_sia05

KnowSeek.Ai is a local AI knowledge tool built for small engineering companies. Instead of spending hours searching through documents and part libraries, engineers simply ask a question in plain English or German and get a direct answer — with the exact source included. Everything runs on your own computer. No internet needed. No data ever leaves your building.

---

## 1. 🛠 Modules

### 1.1 📄 DocSeek.Ai — ✅ MVP
Ask any question about your technical documents and get an instant answer. Works with OEM specs, internal reports, and customer requirements. Also spots differences between document versions automatically.

### 1.2 🔍 PartSeek.Ai — ✅ MVP
Describe a part in plain text and find the matching component in your parts library. Shows dimensions, material, strength values, and which OEM it applies to. Image search via LLaVA planned for 27.03.

### 1.3 📏 NormSeek.Ai — *(Phase 2)*
Automatically checks your product data against ISO and OEM standards to catch compliance issues early.

### 1.4 💰 CostSeek.Ai — *(Phase 2)*
Shows the cost impact of design decisions while you are still in the development phase — before it gets expensive.

---

## 2. 🔒 Privacy & Security

- **On-Premise** — The AI runs on your local machine. Nothing leaves your network.
- **GDPR Ready** — Fully compliant with European data protection law (DSGVO).
- **IP Safe** — Your technical knowledge stays yours.

---

## 3. 📈 Why KnowSeek.Ai?

- Engineers find answers in seconds instead of hours
- New team members get up to speed faster
- No cloud costs, no data risk, no vendor lock-in
- Works in German and English out of the box

---

## 4. 🧰 Tech Stack

### Currently Built
| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TailwindCSS, Framer Motion, shadcn/ui |
| LLM | llama3:8b via Ollama |
| Embedding | nomic-embed-text via Ollama (DE + EN) |
| Vector DB | ChromaDB |
| RAG | LangChain |
| OCR | pytesseract + Pillow + fpdf2 |
| Backend API | FastAPI (Python 3.11.3) — port 8001 |
| Experiment Tracking | MLFlow (local, port 5000) |
| DevOps | Git, GitHub, gh CLI |

> Ollama is used for TWO functions: LLM (llama3) + Embedding (nomic-embed-text)

### Planned
| Layer | Technology |
|-------|------------|
| Image Search | LLaVA via Ollama *(try for 27.03)* |
| Infrastructure | Docker Compose |
| Testing | Pytest |

---

## 5. 🚀 Run Locally

### What you need
- Python **3.11.3** (exact version required)
- pyenv
- Node.js v18 or higher
- npm v9 or higher
- Ollama

### Clone the repo

```bash
git clone https://github.com/asimeoa/KnowSeek.git
cd KnowSeek
```

> ⚠️ This project requires data files in `05_data/` — see Section 6 below.

---

### `macOS` — type the following commands:

* Install the virtual environment and the required packages:

```bash
pyenv local 3.11.3
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

* Start Ollama and pull the required models (only needed once):

```bash
brew services start ollama
ollama pull llama3
ollama pull nomic-embed-text
```

* Start the frontend:

```bash
cd 02_frontend/01_src
npm install
npm run dev
```

Open your browser at `http://localhost:8081` — press `Ctrl + C` to stop.

* Start MLFlow:

```bash
echo http://127.0.0.1:5000/ > .mlflow_uri
mlflow ui
```

Open in browser: `http://127.0.0.1:5000`

* Start FastAPI Backend:
```bash
cd 01_backend
python main.py
```

Open in browser: `http://localhost:8001/docs`






---

### `WindowsOS` — type the following commands:

For `PowerShell` CLI:

```bash
pyenv local 3.11.3
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

For `Git-Bash` CLI:

```bash
pyenv local 3.11.3
python -m venv .venv
source .venv/Scripts/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

* Start Ollama and pull the required models (only needed once):

```bash
ollama serve
ollama pull llama3
ollama pull nomic-embed-text
```

* Start the frontend:

```bash
cd 02_frontend/01_src
npm install
npm run dev
```

Open your browser at `http://localhost:8081` — press `Ctrl + C` to stop.

* Start MLFlow:

```bash
echo http://127.0.0.1:5000/ > .mlflow_uri
mlflow ui
```

Open in browser: `http://127.0.0.1:5000`

* Start FastAPI Backend:
```bash
cd 01_backend
python main.py
```

Open in browser: `http://localhost:8001/docs`

---

### `Linux / Unix` — type the following commands:

```bash
pyenv local 3.11.3
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

* Start Ollama and pull the required models (only needed once):

```bash
ollama serve
ollama pull llama3
ollama pull nomic-embed-text
```

* Start the frontend:

```bash
cd 02_frontend/01_src
npm install
npm run dev
```

Open your browser at `http://localhost:8081` — press `Ctrl + C` to stop.

* Start MLFlow:

```bash
echo http://127.0.0.1:5000/ > .mlflow_uri
mlflow ui
```

Open in browser: `http://127.0.0.1:5000`

* Start FastAPI Backend:
```bash
cd 01_backend
python main.py
```

Open in browser: `http://localhost:8001/docs`

---

## 6. 📂 Data Setup

> ⚠️ The `05_data/` folder is not included in this repo (IP protection).

Put your files here before running the notebook:
```
05_data/
├── 01_Fasteners/     ← part datasheets (PDF)
├── 02_Specifikation/ ← OEM specification PDFs
└── 03_Painting/      ← paint standard PDFs
```

- Phase 2: add `04_Norms/` for NormSeek
- Phase 3: add `05_Cost/` for CostSeek

Supported file types: `.pdf` `.png` `.webp` `.jpg` `.docx` `.xlsx`

Then run the ingest pipeline:

```bash
python 01_backend/modules/02_docseek/ingest.py
```

---

## 7. 📊 Current Status

| Component | Version | Status |
|-----------|---------|--------|
| Frontend UI | rev02_001 | ✅ Done |
| Ollama + llama3 | 0.17.7 | ✅ Running |
| nomic-embed-text | 274MB | ✅ Installed |
| ChromaDB | 1.5.5 | ✅ Installed |
| rank-bm25 | 0.2.2 | ✅ Installed |
| MLFlow | 3.10.1 | ✅ Running |
| ingest.py (DocSeek) | rev05_003 | ✅ Done — 121 chunks, 39 docs |
| search.py (DocSeek) | rev05_003 | ✅ Done — 4 categories |
| answer.py (DocSeek) | rev05_003 | ✅ Done — RAG + OEM comparison |
| check_pdfs.py | rev05_003 | ✅ Done — auto OCR pipeline |
| ingest.py (PartSeek) | rev05_003 | ✅ Done |
| search.py (PartSeek) | rev05_003 | ✅ Done — filter + collision warning |
| answer.py (PartSeek) | rev05_003 | ✅ Done |
| FastAPI main.py | rev05_003 | ✅ Running — port 8001 |
| EDA Notebook | rev05_003 | ✅ Done — Chapter 1-6 |
| Technical PPT | — | 🔜 Week 3 |
| Stakeholder PPT | — | 🔜 Week 4 |

---

## 8. 📅 Key Dates

| Date | Goal |
|------|------|
| 20.03.2026 | Midterm — business case, EDA, model comparison |
| 27.03.2026 | Dry Run — live demo + 10 min presentation |
| 02.04.2026 | Stakeholder Presentation — final delivery |

---

*© 2026 KnowSeek.Ai — Efficiency through Intelligence.*