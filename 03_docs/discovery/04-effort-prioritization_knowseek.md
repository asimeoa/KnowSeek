# ⚖️ 04 – Effort-Informed Prioritization: KnowSeek.ai

## 💡 Why this exercise matters
This matrix balances the technical RAG-logic with a high-end UI/UX. For a Capstone project, the visual presentation is as crucial as the backend to demonstrate professional market-readiness.

---

#### 🔧 Prioritization Matrix (Value × Effort)

| Feature | Estimated Effort | Priority | Reason |
| :--- | :--- | :--- | :--- |
| **UX/UI Design & Automotive Theme** | 4 days | ✅ **MUST HAVE** | **Crucial for Presentation:** Professional look & feel in Lovable. |
| **DocSeek: PDF RAG & Search** | 3 days | ✅ **MUST HAVE** | Core logic for requirement retrieval (Volvo Case). |
| **DocSeek: Comparison UI** | 3 days | ✅ **MUST HAVE** | Visual side-by-side view with intuitive diff-highlighting. |
| **Multilingual Support** | 1 day | ✅ **MUST HAVE** | Query in German → Find in English source documents. |
| **PartSeek: Drawing & BOM Extraction** | 3-4 days | ✅ **MUST HAVE** | Finding fasteners and mapping "Where-used" data. |
| **Email Context (Simulated)** | 1 day | ✅ **MUST HAVE** | Ingesting key email approvals as text/markdown for the demo. |
| **Source Citation / Linking UI** | 1 day | ⚙️ **SHOULD HAVE** | Visual tags to original PDF pages to build user trust. |
| **Live Gmail Integration** | +2 days | 💡 **COULD HAVE** | **Upgrade Option:** Transition from simulated text-mails to live API fetching if time permits. |
| **Direct Outlook/PST Connector** | 5+ days | 🚫 **WON’T HAVE** | Complexity of offline .msg/.pst archives too high for MVP. |
| **NormSeek / CostSeek (Full)** | 6+ days | 🚫 **WON’T HAVE** | Will remain as high-fidelity visual placeholders. |

**Total Estimated Effort:** ≈ 17 days (+2 Optional)  
**Buffer:** + 2 days for UI-Polishing & Final Demo Prep  
✅ **Total Capacity:** 19 days (1 person x 3 weeks).

---

### 🧩 Outcome Goal → Epic → Deliverables

**Outcome Goal 1: High-Fidelity Presentation (UX/UI)**
* **Epic:** Professional Automotive Interface
* **Deliverables:** Sidebar navigation, Dashboard, and Comparison View.
* **Tasks:** * Design dark/light-mode automotive theme in Lovable.
    * Build the "Hero" Comparison UI with visual conflict markers.

**Outcome Goal 2: Cross-Language Intelligence**
* **Epic:** Multilingual Knowledge Retrieval
* **Tasks:** * Implement multi-lingual embeddings.
    * Prompt design for German answers from English PDF sources.

**Outcome Goal 3: Fastener Visibility (PartSeek)**
* **Epic:** Internal Part Discovery
* **Tasks:** Index Excel metadata and design search result cards with "Where-used" info.

---

## ⚡ Strategic Parallel Track (Bonus Features)
If the core UI and RAG-pipeline are stable ahead of schedule:
1. **AI-Driven Summary:** Auto-generating a 3-sentence summary of long PDF documents.
2. **Contextual Chat:** Enabling follow-up questions directly on a specific search result.