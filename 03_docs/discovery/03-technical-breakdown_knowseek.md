# 🛠️ 03 – Technical Work Breakdown: KnowSeek.ai

## 💡 Why this exercise matters
This document translates the "Seek-Vision" into buildable technical tasks. It ensures we prioritize the RAG-logic (extraction from drawings/specs) and the "Human-in-the-Loop" UI over less critical features.

---

### 🔧 Feature Breakdown & Effort Estimation

| Area | Description | Effort (S/M/C) | Risks |
|------|---------------|----------------|-------|
| **Data / Model** | **RAG Pipeline & Extraction:** Setup of local Vector DB. Prompt design for extracting technical specs from PDFs (Volvo) and **metadata from Drawing Title Blocks (PDF)** or BOMs. | **M** (3-4 days) | OCR accuracy on technical drawing headers (non-standard fonts). |
| **Data / Model** | **Conflict Detection Logic:** Prompt engineering to compare two versions of a requirement and identify discrepancies (e.g., 100k vs 120k cycles). | **S** (2 days) | LLM might hallucinate or miss subtle differences in units. |
| **Backend** | **Python Processing Hub:** Jupyter-based backend to handle file uploads, text chunking, and serving the search results. | **S** (2 days) | Performance of local embedding models. |
| **Frontend** | **Integrated UI (Lovable):** Sidebar navigation for all 4 modules. Search interface for DocSeek & PartSeek. Results display with **Image/Drawing Preview**. | **M** (3-5 days) | Complex side-by-side comparison view for document versions. |
| **Frontend** | **Human-in-the-Loop (HITL):** Implementing the "1, 2, or 3" decision flow to update the "Golden Truth" entry. | **S** (1-2 days) | State management between user selection and backend. |
| **Integration** | **End-to-End Pipeline:** Linking Python logic to Lovable UI and ensuring **Part metadata from drawings** is correctly mapped. | **S** (2 days) | API connectivity between local environment and the frontend. |
| **Analytics** | **Success Tracking:** Simple logging of search queries and "Successful retrieval" vs "Manual correction". | **S** (1 day) | - |

---

### 🗺️ Risk & Dependency Map

1.  **Dependency: Data Ingestion (Drawings)**
    * *Problem:* If the OCR/Parser for the drawing title blocks fails, PartSeek cannot show specific part metadata.
    * *Mitigation:* Focus on high-quality PDF exports of drawings with readable text layers (no scans) for the MVP.
2.  **Risk: Hallucination in technical specs**
    * *Problem:* KI changes "125.000 cycles" to "12.500".
    * *Mitigation:* **Mandatory Source Citation.** Direct visual link to the PDF snippet or Drawing head so the engineer can verify.
3.  **Risk: Time Constraint (1 Person / 3 Weeks)**
    * *Mitigation:* Focus strictly on DocSeek and PartSeek; NormSeek and CostSeek remain as UI-placeholders (Visuals only).

---

### 🚀 Future-Proof Architecture & Scalability
While the MVP focuses on high-quality PDF and drawing-header parsing to ensure stability, the underlying RAG-pipeline is designed for modular expansion:

* **Email & Communication:** Integration of `.msg` files and Gmail API (Optional Upgrade) to capture informal decisions.
* **CAD & 3D Metadata:** Extension of PartSeek.ai to index lightweight 3D formats like **JT-files** or **STEP-metadata** to allow visual part identification.
* **Legacy Systems:** Connectivity to PLM/ERP database exports to sync "Where-used" data in real-time.
* **Multilingual Support:** Cross-language retrieval (e.g., searching in German for specifications written in English).

---

### 🛠️ Technical Stack (Confirmation)
* **Language:** Python (Main logic)
* **Framework:** Jupyter Notebooks / FastAPI
* **Vector DB:** ChromaDB (Local storage)
* **Frontend:** Lovable.dev (Product Interface)
* **Data Formats:** PDF (Lastenhefte & Drawings), TXT/MD (Email Simulation)