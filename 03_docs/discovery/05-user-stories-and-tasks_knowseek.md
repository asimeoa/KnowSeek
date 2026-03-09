# 05 – User Stories and Task Mapping: KnowSeek.ai

## 💡 Strategy: 19-Day Solo Sprint
To ensure steady progress, each task is designed for a **3–4 hour time block**. This allows for two major "commits" per day, keeping the momentum high and the 3-week deadline realistic.

---

### 📖 User Stories (The "Why")

1. **Cross-Language Search:** *As an engineer (Konstantin), I want to query English PDFs in German so that I can understand complex OEM requirements without a translator.*
2. **Visual Comparison:** *As a project lead (Petra), I want to see a side-by-side comparison of two spec versions so that I can instantly identify changed test cycles.*
3. **Part Discovery:** *As a designer (Konstantin), I want to search for parts using metadata extracted from drawing headers so that I don't create duplicate parts.*
4. **Final Decision (HITL):** *As a lead (Petra), I want to click "Approve V2" to save the final decision into the "Golden Truth" log, merging email and PDF facts.*

---

### 🧱 Epic A: DocSeek – RAG & Comparison (Days 1–5)
**Goal:** Implement the core multi-lingual search and version comparison.

| Day | Slot | Task Description | Input / Output |
|:--- | :--- | :--- | :--- |
| **1** | AM | **Data Sourcing:** Creating 2 Volvo Spec versions (PDF) with intentional discrepancies. | Text -> 2 PDFs |
| **1** | PM | **Embedding Setup:** Integration of OpenAI `text-embedding-3-small` for DE/EN support. | PDF -> Vector DB |
| **2** | AM | **Retrieval Logic:** Building Python function to fetch relevant chunks from both versions simultaneously. | Query -> Chunks V1/V2 |
| **2** | PM | **Comparison Prompting:** Developing the prompt that outputs differences as structured JSON. | Chunks -> JSON Diff |
| **3** | AM | **UI Layout (Lovable):** Creating the Sidebar and the main Dashboard shell. | Design -> UI Frame |
| **3** | PM | **Comparison UI:** Implementing the side-by-side view with visual red/green markers. | JSON -> HTML View |
| **4** | AM | **Multilingual Bridge:** System prompt optimization for German queries on English sources. | DE Query -> DE Answer |
| **4** | PM | **Source Citation:** Displaying page numbers and original text snippets in the UI. | Metadata -> UI Link |
| **5** | ALL | **Buffer & Testing:** Prompt refinement to prevent hallucinations and fixing UI responsiveness. | Buglist -> Fixed |



---

### 🧱 Epic B: PartSeek – Drawing Extraction (Days 6–9)
**Goal:** Extracting part metadata directly from technical drawing (PDF) headers.

| Day | Slot | Task Description | Input / Output |
|:--- | :--- | :--- | :--- |
| **6** | AM | **Drawing OCR:** Vision-LLM prompt to read title blocks (Part No, Material, Finish). | PDF -> Metadata |
| **6** | PM | **Part Database:** Building a local index for the extracted drawing data. | Metadata -> Index |
| **7** | AM | **Search Interface:** Building the PartSeek search mask in Lovable. | Input -> Search |
| **7** | PM | **Result Cards:** Designing cards with metadata fields and drawing thumbnail placeholders. | Data -> Card View |
| **8** | AM | **Where-used Logic:** Linking parts to existing project data (Who used this before?). | ID -> Project List |
| **8** | PM | **Image Preview:** Implementing a modal to view the full drawing PDF in the dashboard. | Click -> Modal |
| **9** | ALL | **Buffer:** Optimizing OCR accuracy for varying drawing styles/fonts. | Docs -> Data |



---

### 🧱 Epic C: Decision Hub & Email Integration (Days 10–13)
**Goal:** Merging email approvals with PDF facts for Human-in-the-Loop decisions.

| Day | Slot | Task Description | Input / Output |
|:--- | :--- | :--- | :--- |
| **10** | AM | **Email Simulation:** Creating 3 Markdown files representing key approvals for the Volvo case. | Context -> MD Files |
| **10** | PM | **Email RAG:** Integrating mail texts into the existing DocSeek search pipeline. | Query -> Mail Chunk |
| **11** | AM | **Context UI:** Displaying the matching email snippet next to the PDF conflict. | UI -> Context Box |
| **11** | PM | **HITL Buttons:** Implementing "Approve V1/V2" or "Manual Edit" buttons in the UI. | Click -> Selection |
| **12** | AM | **Decision Log:** Saving the user’s final decision into a "Golden Truth" JSON log. | Selection -> JSON |
| **12** | PM | **Bonus: Gmail API:** (Optional) Setup of API credentials for live mail fetching. | API -> Content |
| **13** | ALL | **Workflow Polish:** Smoothing the "Find Conflict -> Check Mail -> Decide" flow. | Workflow Test |

---

### 🧱 Epic D: UI/UX Polishing & Demo Prep (Days 14–17)
**Goal:** High-fidelity finish for the final presentation.

| Day | Slot | Task Description | Input / Output |
|:--- | :--- | :--- | :--- |
| **14** | AM | **Theming:** Finalizing the Automotive Design (Colors, Fonts, Icons). | CSS -> Pro Look |
| **14** | PM | **Skeleton Loaders:** Adding loading animations for AI processing feedback. | UX -> Smooth Feel |
| **15** | AM | **Onboarding Tour:** Building a short guided tour through the tool for the demo. | Guide -> UI |
| **15** | PM | **Responsiveness:** Ensuring the dashboard works well on high-res monitors and tablets. | Flex Layout |
| **16** | AM | **Final Data Check:** Scrubbing Volvo sample texts for logic errors. | Data Scrubbing |
| **16** | PM | **Demo Video:** Recording a "Happy Path" screen-recording as a fallback. | Video File |
| **17** | ALL | **Final Polish:** Minor bugfixes and CSS tweaks. | - |

---

### 📅 Closing Phase (Days 18–19)
* **Day 18:** Dress rehearsal of the presentation (The Story of Konstantin & Petra).
* **Day 19:** Final submission and project documentation wrap-up.

---


## 💡 Why this exercise matters
This document translates the strategic vision into daily execution. Since this is a 1-person project for a 3-week sprint, we break down every Epic into "Atomic Tasks" (max. 1 day each) to ensure a visible progress in the UI and Backend every single day.

## 🎯 Expected Outcomes
- **Outcome Goal:** A functional RAG-platform that resolves technical conflicts and finds parts.
- **User Stories:** Real-world scenarios for "Konstrukteur Konstantin" and "Projektleiterin Petra".
- **Tasks:** A clear technical roadmap for Python and Lovable.

---

### 🧱 Epic A – DocSeek: Smart Requirement Retrieval (Volvo Case)
**Purpose:** Multi-lingual search and side-by-side comparison of PDF specifications.

**User Stories**
1. *As an engineer, I want to query English PDFs in German so that I can understand complex OEM requirements without a translator.*
2. *As a project lead, I want to compare two PDF versions so that I can instantly see changed values (e.g., test cycles).*

**Tasks**
- [ ] **Data Prep:** Create 2 PDF versions of a "Volvo Seat Rail Spec" with 3 distinct differences (1 day).
- [ ] **Backend:** Setup ChromaDB and implement OpenAI `text-embedding-3-small` for multilingual support (1 day).
- [ ] **Prompting:** Design "Comparison Prompt" to output JSON with `{requirement_id, change_type, value_v1, value_v2}` (1 day).
- [ ] **Frontend:** Build the "Comparison-View" in Lovable with synchronized scrolling and red/green highlighting (1 day).

---

### 🧱 Epic B – PartSeek: Technical Drawing Extraction
**Purpose:** Finding fastener metadata directly from drawing title blocks.

**User Stories**
1. *As a designer, I want to search for parts and see metadata extracted from drawings so that I don't create duplicate parts.*
2. *As a user, I want to see a preview of the drawing header so that I can verify the part number visually.*



**Tasks**
- [ ] **Extraction:** Implement Vision-LLM prompt to extract "Part-No", "Material", and "Finish" from PDF drawing headers (1 day).
- [ ] **Search Logic:** Build the semantic search engine in Python to link queries to drawing metadata (1 day).
- [ ] **Frontend:** Design "Part-Result-Cards" in Lovable with metadata fields and a "View Drawing" button (1 day).
- [ ] **Integration:** Connect Lovable search bar to the Python backend via API (1 day).

---

### 🧱 Epic C – The "Decision Hub" (Email & HITL)
**Purpose:** Merging informal email approvals with formal document facts.

**User Stories**
1. *As a lead, I want to see a matching Email snippet next to a PDF conflict so that I can verify the customer's latest decision.*
2. *As a user, I want to click "Approve V2" to save the final decision into the "Golden Truth" log (Human-in-the-Loop).*

**Tasks**
- [ ] **Email Prep:** Create 3 Markdown files representing key Gmail approvals for the Volvo case (0.5 day).
- [ ] **HITL UI:** Build "Decision Buttons" (Accept V1 / Accept V2 / Manual) in the Lovable sidebar (1 day).
- [ ] **Logic:** Implement a simple "Golden Truth" logger that saves the user's decision to a JSON file (1 day).
- [ ] **Optional Bonus:** Setup Gmail API authentication for live fetching (2 days - Week 3 only).

---

### 🧱 Epic D – UX/UI Polishing (The Presentation Layer)
**Purpose:** Creating a professional "Automotive Grade" interface.

**Tasks**
- [ ] **Theming:** Set up "Engineering Gray" color palette and Dark Mode in Lovable (1 day).
- [ ] **Navigation:** Finalize the Sidebar to switch between DocSeek, PartSeek, NormSeek, and CostSeek (0.5 day).
- [ ] **Demo Prep:** Record the "Happy Path" video and prepare the Volvo sample data for the live-run (1 day).

---

### 📊 Sprint Overview (1-Person Team)

| Level | Description | Est. Effort | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **User Story** | Cross-language search (DE -> EN) | – | Query "Sitzschiene" finds "Seat Rail" in PDF. |
| **Task** | Multilingual Embeddings | 1 day | Vector search returns correct chunks regardless of language. |
| **Task** | Build Comparison-UI | 1 day | Side-by-side view shows red/green diffs clearly. |
| **Task** | Part-Drawing Preview | 1 day | Clicking a result opens the corresponding PDF page/image. |

---

### 💡 Personal Learning Goal
> "I want to master **Vision-RAG** (extracting data from engineering drawings) and build a high-fidelity **AI-Dashboard in Lovable** that feels like a market-ready enterprise tool."


## gantt

    title KnowSeek.ai MVP - 19 Day Solo Sprint
    dateFormat  YYYY-MM-DD
    section Epic A: DocSeek (RAG & Comp)
    Data Prep & Embedding Setup       :a1, 2026-03-09, 2d
    Retrieval & Comparison Logic      :a2, after a1, 2d
    Comparison UI (Lovable)           :a3, after a2, 1d
    section Epic B: PartSeek (Drawings)
    Drawing OCR (Vision-LLM)          :b1, after a3, 2d
    Search UI & Result Cards          :b2, after b1, 1d
    Image Preview & Metadata Links    :b3, after b2, 1d
    section Epic C: Decision Hub (Mail)
    Email RAG & Simulation            :c1, after b3, 1d
    HITL Buttons & Logic              :c2, after c1, 1d
    Decision Logging (Golden Truth)   :c3, after c2, 1d
    Gmail API (Optional Upgrade)      :c4, after c3, 1d
    section Epic D: UI/UX & Demo
    Automotive Theming (Lovable)      :d1, after c4, 2d
    Final Data Check & Video          :d2, after d1, 1d
    Final Polish & Buffer             :d3, after d2, 1d
    section Final Phase
    Dress Rehearsal                   :f1, after d3, 1d
    Submission                        :f2, after f1, 1d