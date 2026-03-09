# 🗺️ 02 – Now-Next-Future Roadmap: KnowSeek.ai

## 💡 Why this exercise matters
This roadmap ensures that we deliver a functional "Conflict-Resolution" engine within the 3-week Capstone period while maintaining a clear vision for a full-scale SME knowledge platform.

---

## 🚀 NOW (Weeks 1–3) – The MVP Phase
**Focus: Validating the "Human-in-the-Loop" & Multi-Format Search**

* **Week 1: Data Foundations**
    * Setup of the RAG-Pipeline (Jupyter Notebook).
    * Ingestion of PDF (Lastenheft), Excel (Fastener list), and Email (simulated .msg).
    * Basic Semantic Search logic.
* **Week 2: Core Feature Build (DocSeek & PartSeek)**
    * Implementation of the "Version Comparison" logic for DocSeek.ai.
    * Metadata extraction for PartSeek.ai (Part Number, CAD-Status, Where-used).
    * Initial UI Setup in Lovable.dev (Sidebar + Search Bar).
* **Week 3: Integration & Feedback**
    * Connecting Backend Logic with Frontend UI.
    * Implementing the "1, 2, or 3" Decision Button for conflict resolution.
    * Final testing with "Volvo CMA" test-case data.

---

## ⏩ NEXT (Month 2) – Trust & Connectivity
**Focus: Expanding beyond the prototype & ensuring data integrity**

* **NormSeek.ai Integration:** Connect the search to a local database of DIN/ISO standards.
* **User Authentication:** Role-based access (who is allowed to "approve" a document version?).
* **Advanced OCR:** Improved handling of scanned legacy drawings and complex technical tables.
* **Live Connectors:** Initial integration with local network drives (Windows File Share) to auto-index new files.

---

## 🔭 FUTURE (Month 3+) – Full Automation & Scaling
**Focus: Strategic AI-Integration and Cost Efficiency**

* **CostSeek.ai:** Automatic price estimation based on geometry and material extracted from PartSeek.
* **Voice-to-Knowledge:** Natural language interface for hands-free search in the workshop/production line.
* **Proactive Conflict Detection:** The system alerts the PM via Email when a new customer requirement contradicts an existing internal standard.
* **API-First Ecosystem:** Connecting KnowSeek to existing ERP/PLM systems (e.g., SAP, Teamcenter).

---

## 🛠️ Key Dependencies & Risks
1.  **Data Quality:** Highly formatted Excel sheets or messy Email threads might require custom parsing logic.
2.  **Performance:** Ensuring the local LLM responds fast enough for a "30-second-search" goal.
3.  **UI Complexity:** Keeping the "Conflict UI" simple enough for non-technical users.