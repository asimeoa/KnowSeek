# KnowSeek.Ai 🧠
> **Stop searching. Start knowing.**

**Version: rev02_001 — Last updated: 11.03.2026 — Branch: main_sia_03**

KnowSeek.Ai is a local AI knowledge tool built for small engineering companies. Instead of spending hours searching through documents and part libraries, engineers simply ask a question in plain English or German and get a direct answer — with the exact source included. Everything runs on your own computer. No internet needed. No data ever leaves your building.

---

## 1. 🛠 Modules

### 1.1 📄 DocSeek.Ai — ✅ MVP
Ask any question about your technical documents and get an instant answer. Works with OEM specs, internal reports, and customer requirements. Also spots differences between document versions automatically.

### 1.2 🔍 PartSeek.Ai — ✅ MVP
Describe a part in plain text or upload a photo and find the matching component in your parts library. Shows dimensions, material, strength values, and which OEM it applies to.

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
| DevOps | Git, GitHub |

### Planned
| Layer | Technology |
|-------|------------|
| Backend | Python 3.11.3, FastAPI, LangChain |
| AI / ML | Ollama 0.17.7 (Llama3) |
| Vector Database | ChromaDB |
| Experiment Tracking | MLFlow (local) |
| Infrastructure | Docker |
| Testing | Pytest |

---

## 5. 🚀 Run Locally

### What you need
- Node.js v18 or higher
- npm v9 or higher
- Python **3.11.3** (exact version required)
- pyenv
- Ollama 0.17.7

### Start the frontend
```bash
# Step 1 — Clone the repo
git clone https://github.com/asimeoa/KnowSeek.git

# Step 2 — Go to the frontend folder
cd 02_frontend/01_src

# Step 3 — Install packages (only needed once)
npm install

# Step 4 — Start the app
npm run dev
```

Open your browser and go to the URL shown in the terminal — usually `http://localhost:8080` or `http://localhost:8081`.

### Stop the app
Press `Ctrl + C` in the terminal.

### Set up Python environment *(backend — coming soon)*
```bash
# Step 1 — Set Python version
pyenv local 3.11.3

# Step 2 — Create virtual environment
python -m venv .venv

# Step 3 — Activate environment
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\Activate.ps1      # Windows PowerShell
# source .venv/Scripts/activate   # Windows Git-Bash

# Step 4 — Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Start Ollama + Llama3
```bash
# Start Ollama service
brew services start ollama

# Run Llama3 model
ollama run llama3
```

### Start MLFlow
MLFlow tracks and compares AI model experiments locally. All data stays on your machine.
```bash
# Save MLFlow URI locally (never pushed to GitHub)
echo http://127.0.0.1:5000/ > .mlflow_uri

# Start MLFlow UI
mlflow ui
```
Open in browser: `http://127.0.0.1:5000`

---

## 6. 📊 Current Status

| Component | Version | Status | Branch |
|-----------|---------|--------|--------|
| Frontend UI | rev02_work | ✅ Done | main_sia_03 |
| Frontend Fixes | rev02_001 | ✅ Done | main_sia_03 |
| Ollama | 0.17.7 | ✅ Installed | - |
| Backend | - | 🔜 Next | - |
| Vector DB (ChromaDB) | - | 🔜 Next | - |
| Experiment Tracking (MLFlow) | - | 🔜 Next | - |
| EDA Notebook | - | 🔜 Next | - |

---

## 7. 📅 Key Dates

| Date | Goal |
|------|------|
| 20.03.2026 | Midterm — business case, EDA, model comparison |
| 27.03.2026 | Final — live demo + 10 min presentation |

---

*© 2026 KnowSeek.Ai — Efficiency through Intelligence.*