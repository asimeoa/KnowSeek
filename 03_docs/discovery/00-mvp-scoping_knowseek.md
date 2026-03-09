# 🚀 00 – MVP Scoping: KnowSeek.ai (Capstone Project)

## 💡 Why this MVP matters
SMEs (KMU) often lose efficiency because internal knowledge is buried in fragmented folders. KnowSeek.ai acts as an intelligent layer above this data, making standard parts and complex requirements instantly searchable and comparable for every employee through a user-friendly LLM interface.

---

## 🔧 Project Context
* **Team Size:** 1 Person (Project Lead / AI-PM)
* **Timeline:** 3 Weeks
* **Focus:** Internal Knowledge Retrieval (Standard Parts & Technical Requirements).

---

## 1️⃣ MVP Goal (User + Learning focused)
Develop a functional prototype that enables employees to find internal company information via a simple AI-search.
* **Core Task 1 (PartSeek):** Find existing standard parts or fasteners (e.g., "Show me all M8 bolts we currently have in stock/approved").
* **Core Task 2 (DocSeek):** Search within technical requirement books and compare different document versions (e.g., "Compare the durability specs for Volvo CMA seat rails in v1 vs v2").
* **Learning Goal:** Prove that an LLM-based search is more intuitive and accurate for SMEs than traditional folder-based systems.

---

## 2️⃣ Core Hypothesis to Validate
"By providing an LLM-powered search over **fragmented internal data (PDFs, Excel, Word, and Outlook/Email archives)**, employees find the correct technical specifications and fasteners **60% faster** than through manual folder navigation. This significantly reduces the risk of using outdated standards or redundant parts by providing a 'Single Point of Truth' regardless of the original file format."

---

## 3️⃣ MVP Core Components (Must-haves)

* **Global Navigation**
    * Sidebar featuring all 4 core modules (and placeholders for future expansion) to demonstrate the full integrated ecosystem.

* **DocSeek.ai (Deep-Dive)**
    * **Intelligent Cross-Format Search:** Semantic retrieval across technical requirements stored in PDFs, Word docs, and Email archives.
    * **Version Comparison:** Side-by-side visualization of two document revisions with automated highlighting of conflicting technical parameters.

* **PartSeek.ai (Deep-Dive)**
    * **Semantic Fastener Search:** Intuitive finding of standard parts and fasteners using natural language (e.g., "M8 bolts for interior mounting").
    * **Rich Metadata Display:** Instant access to internal part numbers, CAD-status, material specs, and "Where-used" (Verwendungsnachweis) information to prevent redundant part creation.

---

## 4️⃣ Strategic Module Overview (Platform Scope)
* **PartSeek.ai:** Semantic search and identification of internal standard parts and fasteners to avoid duplicate part creation.
* **DocSeek.ai:** AI-powered retrieval of technical requirements and automated comparison between document versions/revisions.
* **NormSeek.ai:** Automated cross-referencing with external industry standards (DIN/ISO) and OEM-specific norms.
* **CostSeek.ai:** Real-time estimation of component costs based on selected geometry and historical procurement data.

---

## 5️⃣ Later Features (Should / Nice to Have)
* **Should Have:** * **NormSeek:** Automatic cross-referencing with live OEM standard databases.
    * **CostSeek:** Real-time price estimation based on selected geometry.
* **Nice to Have:** * Voice-to-Search ("Search for the latest Volvo CMA seat-rail specs").
    * 3D-STEP file viewer integrated into PartSeek.

---

## 6️⃣ Technical Stack & Workflow
* **Frontend:** Lovable.dev (for the interactive multi-page UI).
* **Backend Logic:** Jupyter Notebook (Python) for testing the RAG-pipeline and conflict extraction.
* **Database:** Local Vector Store (ChromaDB or similar simulation).

---

## 7️⃣ Individual Learning Goals
* Master the implementation of a **Human-in-the-Loop** interface for document comparison.
* Optimization of **RAG (Retrieval-Augmented Generation)** for highly specific technical terminology and multi-format data (Excel/Mail/PDF) in the automotive sector.

---

## ✅ Deliverable Summary
A professional 4-module platform prototype. The focus lies on the intuitive retrieval of internal SME knowledge. By showcasing the power of **PartSeek** and **DocSeek**, the MVP proves that AI can transform "passive data" into "active knowledge," ensuring that every employee has the latest "golden truth" at their fingertips.