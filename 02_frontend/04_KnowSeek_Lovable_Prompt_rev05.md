# KnowSeek.Ai

Save this file 06_KnowSeek_Lovable_Prompt_rev05
Last updated: March 2026 — rev05 time 22:25

---

## MAIN PROMPT

```
Build a full React application called "KnowSeek.Ai" — an on-premise AI knowledge platform for industrial engineering teams. All data stays local. No cloud. No internet required.

---

SECTION 1 — GLOBAL NAMING RULE

Applies everywhere in the UI without exception:
- Always write: DocSeek.Ai / PartSeek.Ai / NormSeek.Ai / CostSeek.Ai
- The ".Ai" suffix always uses capital A and lowercase i. Never ".AI" or ".ai"
- This applies in sidebar, badges, cards, headers, tooltips, buttons, and all text

Font: Inter throughout. All corners: minimum 12px border-radius. Icons: Lucide React.

---

SECTION 2 — VISUAL IDENTITY: "The Infinite Book"

- Theme: Deep Dark Mode. Background: #0F172A. Card surfaces: #1E293B.
- Glassmorphism on all panels: frosted glass with subtle light borders.
- When a document or result is open, the central workspace switches to Paper-White (#F8FAFC).
- All transitions use Spring Physics — the UI has weight and physical momentum.
- Module transitions: smooth horizontal wipes. Never hard instant cuts.
- Hovering any card or button: Z-axis lift — scale up slightly, increase shadow.
- Every interactive element shows a minimal tooltip on hover.

---

SECTION 3 — MODULE COLOR SYSTEM

When a module is selected, its color bleeds into every border, glow, accent, result card, highlight, and badge.

- DocSeek.Ai   — Emerald Green — #10B981 — Active
- PartSeek.Ai  — Electric Blue — #0EA5E9 — Active
- NormSeek.Ai  — Deep Indigo   — #6366F1 — Under construction
- CostSeek.Ai  — Amber Orange  — #EA580C — Under construction

---

SECTION 4 — GLOBAL TOP BAR

Always visible, full width, fixed at top. Height: 56px. Background: #0D1526. Border: 1px solid #1E293B.

CENTER — KnowSeek.Ai Masthead:
Three elements in one horizontal line, perfectly centered:
  "NOTHING IS IMPOSSIBLE."   ·   KnowSeek.Ai   ·   "START WITH WHAT YOU KNOW."

KnowSeek.Ai — metallic text with aura, NO border, NO plate, NO box:
Use this exact CSS — do not wrap it in any container with a visible border or background:

  position: relative;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(180deg, #E2E8F0 0%, #94A3B8 40%, #64748B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(203,213,225,0.15));

Behind the text, place a radial glow aura (NOT a border box):
  position: absolute, centered behind the text
  width: 260px, height: 54px
  background: radial-gradient(ellipse at center, rgba(100,116,139,0.13) 0%, rgba(100,116,139,0.05) 45%, transparent 72%)
  border-radius: 50%
  pointer-events: none

The text appears to float and glow softly from within — NO visible plate, border, or background box around it.
Every letter K, n, o, w, S, e, e, k, ., A, i — exact same font-size. No exceptions.

Left tagline — "NOTHING IS IMPOSSIBLE.":
  font-size: 10px, letter-spacing: 3px, uppercase, color: #334155, font-weight: 400

Right tagline — "START WITH WHAT YOU KNOW.":
  Exact same style as left tagline.

Separator dots ( · ) in color #1E293B between the three center elements.

RIGHT SIDE — two buttons, same size, same height, gap 10px:

Button 1 — Hamburger (left):
  Width: 36px, Height: 36px, border-radius: 10px
  Background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)
  Border: 1px solid rgba(255,255,255,0.1)
  Box-shadow: 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)
  Content: exactly 3 horizontal lines, ALL THE SAME LENGTH (width: 20px each), evenly spaced vertically
  Line style: stroke rgba(148,163,184,0.95), stroke-width 1.5px, stroke-linecap round
  Lines are spread across the full height of the SVG — NOT bunched together in the center
  SVG viewBox: "0 0 20 17"
  Line positions: y=1, y=8.5, y=16 — equal spacing

Button 2 — Avatar (right):
  Width: 36px, Height: 36px, border-radius: 10px
  Background: linear-gradient(145deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.04) 100%)
  Border: 1px solid rgba(16,185,129,0.45)
  Box-shadow: 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(16,185,129,0.18), 0 0 12px rgba(16,185,129,0.1)
  Content: SVG with viewBox "0 0 30 30", two elements stacked:
    1. Head: circle cx=15, cy=7, r=4, stroke=#10B981, stroke-width=1.5, fill=none
    2. Shoulders: SVG arc path — "M3 18 A16 8.5 0 0 1 27 18"
       stroke=#10B981, stroke-width=1.5, stroke-linecap=round, fill=none
       This creates a clean flat arc directly below the head — like shoulders seen from front
    3. SIA text: x=15, y=27, text-anchor=middle, fill=#10B981, font-size=7.5, font-weight=900,
       letter-spacing=1.2, font-family=Inter — sits in the chest area below the arc
  The head and shoulder arc are visually close together — forming a recognizable person silhouette
  Border color always matches active module color
  Border pulses softly while AI is processing — stops when results appear

On click: dropdown showing search history, filter by module, "Team searches" placeholder greyed out.

---

SECTION 5 — LEFT SIDEBAR

- Default: 48px wide, icons only, vertically centered
- On hover: expands to 220px — spring animation with slight overshoot
- Active module icon: slow breathing glow in module color
- All 4 modules always visible
- NormSeek.Ai + CostSeek.Ai: 40% opacity — selectable but under construction

Sidebar icons — each icon has a small magnifier overlay at bottom-right corner:

DocSeek.Ai icon:
  Primary: document/file icon with text lines (Lucide FileText)
  Magnifier: small search circle overlay, bottom-right, 9x9px, fill=#0D1526, stroke=module color

PartSeek.Ai icon:
  Primary: two interlocking gears — large gear left (spur gear with teeth), small gear bottom-right
  Large gear: circle with rectangular teeth at top, bottom, left, right, and 4 diagonal positions
  Center of large gear: magnifier circle (search icon integrated INTO the gear center hole)
  Magnifier line extends bottom-right from the circle
  Small gear: smaller circle with 4 rectangular teeth at cardinal positions
  All in Electric Blue #0EA5E9

NormSeek.Ai icon:
  Primary: compliance checklist — document with 3 checkmarks (Lucide ClipboardCheck style)
  Magnifier overlay bottom-right

CostSeek.Ai icon:
  Primary: currency symbol + downward trend arrow (cost reduction concept)
  Magnifier overlay bottom-right

---

SECTION 6 — SEARCH BLOCK DESIGN

This is the core UI element. Each module has TWO SEPARATE BOXES stacked with a 4px gap between them.
They are NOT connected — each has its own complete rounded border.

BOX 1 — Module Name Badge (top box, STATIC — never pulses):
  border-radius: 12px
  border: 0.5px solid [module color at 90% opacity] — very thin line
  background: [module color at 5% opacity]
  box-shadow: inset 0 0 20px [module color at 8% opacity], inset 0 0 6px [module color at 5% opacity]
  padding: 11px 18px
  Content: module icon (22px) + module name text (15px, font-weight 700)
  NO animation. Completely static at all times.

BOX 2 — Search Input Field (bottom box, PULSES when empty):
  border-radius: 12px
  border: 1px solid [module color at 50-60% opacity]
  background: [module color at 4% opacity]
  padding: 18px 16px — tall enough to feel inviting
  Content: text input (flex:1) + submit button (28px circle, right side)
  Submit button: background [module color at 20% opacity], color [module color], search icon 12px
  PULSE animation when input is empty:
    @keyframes pulse: border-color fades between 35% and 85% opacity, box-shadow 0 to 10px glow
    Duration: 3.5s ease-in-out infinite
  Pulse STOPS immediately when user types — restarts when field is cleared

DocSeek.Ai placeholder: "Ask anything... e.g. What are the salt spray test requirements for Volvo?"
PartSeek.Ai placeholder: "Describe the part... e.g. M16 stainless steel bolt, high axial load"

NormSeek.Ai + CostSeek.Ai:
  Both boxes shown but at 55% opacity
  Search box is NOT interactive — shows centered text "Under construction" in module color
  NO pulse animation on either box

---

SECTION 7 — PULSE BEHAVIOR RULE

"Pulsing = the system is waiting, you can act here."

- ONLY the search input box (Box 2) pulses — Badge box (Box 1) is always static
- Pulse is a slow subtle sine wave — NOT a flash, NOT aggressive
- Stops immediately when results appear
- Restarts only when search field is cleared back to empty
- Avatar border pulses only while AI is actively processing
- NormSeek.Ai and CostSeek.Ai never pulse

---

SECTION 8 — RESULT COLOR RULE

All result cards, borders, highlights, and badges use the active module color.
DocSeek.Ai results: #10B981 — PartSeek.Ai results: #0EA5E9
NormSeek.Ai and CostSeek.Ai show no results — only under construction message.

---

SECTION 9 — MODULE 1: DocSeek.Ai (Emerald Green #10B981)

Purpose: Search all company documents in German or English.

Search Block: Two separate boxes as described in Section 6.

Query History Dropdown (below search block):
- Label: "Recent searches" — last 10 queries, each clickable to reload
- Small greyed team icon — tooltip: "Team history — coming in Phase 2"

Results Panel:
- Compact result cards: answer text, confidence level, source document name
- All borders and accents in #10B981
- On hover/click: card expands with spring animation + Source Panel slides in from right

Risk Comparison Table (for comparison queries):
- Columns: Requirement | Document / OEM | Value | Status
- Status badges: Green "Same" / Red "Different" / Amber "Conflict"
- Sorted: red (worst) → amber → green (low risk)
- Each row: arrow icon opens Source Panel

Source Panel (slides in from right):
- Highlighted text in #10B981
- Header: document name, page number, date
- Buttons: "Download" and "Summarize"

---

SECTION 10 — MODULE 2: PartSeek.Ai (Electric Blue #0EA5E9)

Purpose: Find internal standard parts via text or image upload.

Search Block: Two separate boxes as described in Section 6.

Image Upload Zone (below search block):
- Dashed border in #0EA5E9 — label: "Or upload a photo of the part"
- Drag and drop supported
- On upload: AI analyzes image and auto-fills text field

Team Alert Banner (above results):
- Background: #0EA5E9 at 15% opacity, border: 1px solid #0EA5E9
- Text: "Thomas Bauer searched for M16x21 recently. Consider aligning on a shared part."

Results — each card split into two halves:

Left half:
- Part image or technical drawing placeholder
- Dimension diagram A/B/C/D in DIN/ISO style, labels in #0EA5E9

Right half:
- Part name + part number (large, bold) + revision
- Drawing link, material, surface treatment, strength class
- Fa max, Fr max values
- OEM badges: VW, Volvo, GM, Stellantis

Phase 2 placeholders (visible, greyed):
- "Used in projects" — tooltip: "Coming in Phase 2"
- "Recommended torque values" — tooltip: "Coming in Phase 2"

---

SECTION 11 — MODULE 3: NormSeek.Ai (Deep Indigo #6366F1) — UNDER CONSTRUCTION

Sidebar icon: #6366F1 at 40% opacity. Selectable.
Search block: two static boxes at 55% opacity as per Section 6 rules.
Below block: "NormSeek.Ai — Compare requirements against ISO and OEM standards. Available in Phase 2."

---

SECTION 12 — MODULE 4: CostSeek.Ai (Amber Orange #EA580C) — UNDER CONSTRUCTION

Sidebar icon: #EA580C at 40% opacity. Selectable.
Search block: two static boxes at 55% opacity as per Section 6 rules.
Below block: "CostSeek.Ai — Design-to-cost analysis in the development phase. Available in Phase 2."

---

SECTION 13 — GENERAL INTERACTION RULES

- All loading states: slow pulsing glow in active module color. Never a plain spinner.
- Empty states: "Start by uploading a document or asking a question."
- All buttons: hover lift — scale 1.02, increased shadow.
- No transition ever instant. Minimum 200ms. Always spring easing.
- Results never pulse. Results are always calm and readable.
- Only colors defined above are used. No random color introductions.
- Backend connect (when ready): POST http://localhost:8001/api/docseek/query and /api/partseek/query
```

---

## FOLLOW-UP PROMPTS

Use these one at a time after first generation if something needs fixing:

**If KnowSeek.Ai text has a visible border or box around it:**
> "Remove any visible border, background box, or plate from around the KnowSeek.Ai masthead text. The text should float freely with only a radial gradient aura glow behind it — no container border, no background color box, no plate shape. Only the text itself and the soft radial glow behind it."

**If the metallic text effect is too light or not metallic enough:**
> "Strengthen the KnowSeek.Ai metallic text effect. Apply this exact CSS gradient: linear-gradient(180deg, #E2E8F0 0%, #94A3B8 40%, #64748B 100%). Add these filters: drop-shadow(0 1px 2px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(203,213,225,0.15)). The text should look like dark polished steel."

**If the badge box pulses instead of only the search field:**
> "The module name badge (Box 1, top box) must be completely static — zero animation at all times. Only the search input field (Box 2, bottom box) should have the pulse animation. Remove all animation from the badge box immediately."

**If the two search boxes are connected or share a border:**
> "The module badge and the search input field must be two completely separate rounded boxes with a 4px gap between them. Both have border-radius: 12px on all corners. They must NOT share any borders, be visually connected, or look like one pill shape. Separate boxes, 4px apart."

**If hamburger lines are different lengths:**
> "All three hamburger lines must be exactly the same length — 20px each. Use SVG with viewBox='0 0 20 17', three lines at y=1, y=8.5, y=16. All lines: x1=0, x2=20, same stroke width, same color. No line should be shorter or longer than the others."

**If the avatar person is not recognizable:**
> "The avatar button must show a recognizable person silhouette using SVG. Use viewBox='0 0 30 30'. Head: circle at cx=15, cy=7, r=4, fill=none, stroke=#10B981, stroke-width=1.5. Shoulders arc: path 'M3 18 A16 8.5 0 0 1 27 18', fill=none, stroke=#10B981, stroke-width=1.5. SIA text at x=15, y=27, font-size=7.5, font-weight=900. Head and arc should be close together to form a visible person shape."

**If the pulse animation is too strong or too aggressive:**
> "Make the pulse animation more subtle. At 0% and 100%: border-color at 35% opacity, box-shadow: none. At 50%: border-color at 85% opacity, box-shadow: 0 0 10px [color at 20% opacity]. Duration: 3.5s ease-in-out infinite. It should breathe gently, not flash."

**Connect to backend — use when API is ready:**
> "Replace all hardcoded demo data with API calls to http://localhost:8001. DocSeek.Ai: POST /api/docseek/query body { query: string }. PartSeek.Ai: POST /api/partseek/query body { query: string, image?: base64 }. Both return JSON: { answer, sources, results }."

---

* https://knowseek-rev05.lovable.app


---


**09.März2029 time 09:55**
Additional prompt need to be in but today no credits on Lovable:

Fix 1 — Sidebar: Hover-Verzögerung + Pulse + Tooltip Farbe
Fix the sidebar with these exact changes:
1. Add a hover-out delay of 400ms before the sidebar collapses — use CSS transition-delay or a setTimeout so the menu stays open briefly when the mouse leaves, preventing accidental closes.
2. The active module icon (DocSeek.Ai) must have a slow breathing glow pulse animation — @keyframes sine wave on box-shadow in the module color, 3s ease-in-out infinite. Not a flash — a slow breathe.
3. The tooltip that appears on long hover must use the module color as background but lighter — for DocSeek.Ai use #34D399 (lighter emerald), for NormSeek.Ai use #818CF8 (lighter indigo), for CostSeek.Ai use #FB923C (lighter orange). Text color: #0F172A (dark). The tooltip should describe the module function briefly.

Fix 2 — Sidebar Icons: Farben heller
Fix sidebar icon and text colors:
1. DocSeek.Ai icon and label text: use #10B981 (full emerald green, not grey) — same brightness as the active state.
2. NormSeek.Ai icon and label text: change from current color to #818CF8 (lighter indigo) for better readability on dark background. Keep 40% opacity on the container but make the icon stroke color #818CF8.
3. CostSeek.Ai icon and label text: change to #FB923C (lighter orange-amber) for better readability. Keep 40% opacity on container.
4. PartSeek.Ai icon and label: use #0EA5E9 full opacity.

Fix 2b — NormSeek + CostSeek Badge + Suchfeld heller
Fix the colors for NormSeek.Ai and CostSeek.Ai in the main workspace:
1. NormSeek.Ai — change ALL instances of #6366F1 to #818CF8 (lighter indigo) — this applies to the badge border, badge text, badge background tint, search field border, and "Under construction" text. The darker indigo is unreadable on dark background.
2. CostSeek.Ai — change ALL instances of #EA580C to #FB923C (lighter orange) — same applies to badge border, badge text, badge background tint, search field border, and "Under construction" text.
3. Also update the under construction message text below the search block to use the same lighter colors.
Keep the 55% opacity on the containers — only the base color changes from dark to lighter variant.

Fix 2c — Alle Farben noch heller
Increase brightness on NormSeek.Ai and CostSeek.Ai colors across the entire app:

1. NormSeek.Ai — change #818CF8 to #A5B4FC everywhere — badge border, badge text, search field border, "Under construction" text, sidebar icon stroke, sidebar label text.

2. CostSeek.Ai — change #FB923C to #FCA773 everywhere — badge border, badge text, search field border, "Under construction" text, sidebar icon stroke, sidebar label text.

Both sidebar icons should be noticeably brighter and clearly readable on the dark #0F172A background.

Fix — Orange + Indigo letzte Stufe heller
Increase brightness one more step:

1. NormSeek.Ai — change #A5B4FC to #C7D2FE everywhere — badge, search field, sidebar icon, sidebar text.

2. CostSeek.Ai — change #FCA773 to #FDB896 everywhere — badge, search field, sidebar icon, sidebar text.

---

Fix B    → Icons heller + Pulse sichtbar (NormSeek + CostSeek)
Fix 2d   → Sidebar Icons gleiche Helligkeit wie Rest
Fix 3    → Innerer Lichtstrahl Suchfeld zurück 

---

Fix B — Icons heller + Pulse sichtbar (danach eingeben)
Fix sidebar icons for NormSeek.Ai and CostSeek.Ai:

1. NormSeek.Ai sidebar icon stroke color: #E0E7FF — full brightness, no opacity reduction on the icon stroke itself.

2. CostSeek.Ai sidebar icon stroke color: #FED7AA — full brightness, no opacity reduction on the icon stroke itself.

3. Add a slow breathing pulse animation to both icons:
   @keyframes: box-shadow from 0 to 0 0 8px rgba(icon-color, 0.4) at 50%
   Duration: 3s ease-in-out infinite
   This makes the pulse visible even at reduced container opacity.


!!! Fix A → warten ✅ → Fix B → Screenshot schicken! 🚀


Fix 2e(Fix 2d von cloud genant) — Farben letzte Stufe
Increase brightness one final step:

1. NormSeek.Ai — change #C7D2FE to #E0E7FF everywhere — badge, search field, "Under construction" text.

2. CostSeek.Ai — change #FDB896 to #FED7AA everywhere — badge, search field, "Under construction" text.




Fix 3 — Suchfeld: Innerer Lichtstrahl zurück
Fix the search input field glow effect:
The search box must have an inward light diffusion effect — an inner glow that radiates from the border inward. Apply this box-shadow to the search field:
  box-shadow: inset 0 0 20px rgba([module-color], 0.08), inset 0 0 8px rgba([module-color], 0.05)
For DocSeek.Ai: inset 0 0 20px rgba(16,185,129,0.08), inset 0 0 8px rgba(16,185,129,0.05)
For PartSeek.Ai: inset 0 0 20px rgba(14,165,233,0.08), inset 0 0 8px rgba(14,165,233,0.05)
This creates a soft light ray coming inward from the border — subtle, not aggressive