# 📘 KnowSeek.ai – Frontend & UI/UX Manifesto

This document is the definitive source of truth for the KnowSeek user interface. It ensures that the "Infinite Book" experience remains consistent across all development stages.

---

## 1. The "Infinite Book" Vision
KnowSeek is not a static dashboard; it is a **living knowledge environment**. 
* **Tactile Experience:** Navigation must feel like swiping through high-quality, heavy paper.
* **Momentum:** Use "Spring Physics" for all transitions to give the UI a sense of weight and physical reality.
* **The Living Pulse:** Active elements should "breathe" with a subtle, slow-moving glow to signal that the AI is active in the background.

---

## 2. Visual Identity & Module Color Logic
Each module has a dedicated signature color. When a module is selected, the UI "bleeds" this color into accents, borders, and glows.

| #  | Module | Name | Color | Focus Area |
| :-- | :--- | :--- | :--- | :--- |
| **01** | **PartSeek** | `Electric Blue` | Geometry, CAD & Component Search |
| **02** | **DocSeek** | `Emerald Green` | Specifications, RAG & Lastenhefte |
| **03** | **NormSeek** | `Amber Gold` | ISO Standards, OEM Norms & Compliance |
| **04** | **CostSeek** | `Ruby Red` | Design-to-Cost & Financial Feedback |

---

## 3. Core UI Components

### A. The "Smart Sidebar" (Left)
- **Idle State:** A minimal, semi-transparent sliver showing only icons.
- **Interaction:** On hover, it expands smoothly (macOS Dock-style "swell") to reveal full labels.
- **Persistence:** The active parent module remains visible with a soft "breathing" pulse, even when deep in sub-menus.

### B. The "Paper-Reader" Layout
- **Frame:** The general application environment uses a **Deep Dark Mode** (Slate/Charcoal) with glassmorphism.
- **Workspace:** When a document is opened, the central area transitions to a **Paper-White / Light-Grey** background.
- **Logic:** This creates a focused, high-contrast frame that mimics reading a real technical specification on a desk.

### C. The Morphing Navigation (Top Right)
- **State 1:** Three horizontal lines (Hamburger Menu).
- **State 2:** When a sub-menu or document is open, the lines smoothly morph into a **Circle**.
- **Action:** Clicking the circle cancels the current view and returns to the "Infinite Book" main layer.

---

## 4. Interaction & Feedback
- **Visual Lift:** Hovering over any button or card triggers a Z-axis elevation (Scale + Shadow).
- **Info Tooltips:** Every interactive element reveals a sleek, minimal info-text on hover to explain its function.
- **Wipe Effect:** Transitions between modules are never "hard cuts" but smooth horizontal wipes/page flips.

---

## 5. Global AI Master-Prompt
*Use this prompt for generating the UI in Lovable, v0, or Cursor:*

> "Create a high-end React dashboard for 'KnowSeek.ai'. 
> Theme: Deep Dark Mode with Glassmorphism, featuring a central 'Paper-White' document workspace. 
> Sidebar: A left-aligned vertical bar that expands like a macOS dock on hover. 
> Logic: Use 4 colors: PartSeek (Blue), DocSeek (Green), NormSeek (Gold), CostSeek (Red). 
> Nav: Animate a top-right 3-line menu to morph into a Circle on click. 
> Animation: UI must feel like an 'Infinite Book' with spring-physics transitions and elements that 'lift' on hover. 
> Active elements must have a subtle, color-coded 'breathing' pulse."

---

## 6. Project Structure Reference
To maintain logical ordering in GitHub/VS Code:
1. `01_backend/` (AI Logic)
2. `02_frontend/` (The Living UI)
3. `03_docs/` (Discovery & Strategy)
4. `04_progress/` (PDCA Logs)
5. `05_data/` (Synthetic Testing)

