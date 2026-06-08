# CINEGEN DUAL-TAB UI + SHOT COMPOSER DEVELOPMENT CONTEXT
# (All key discussions compiled for future AI coding assistants)

## 1. Core Philosophy & Workflow
- Script is the primary anchor. App is project-entity-forward: auto-parses scenes, 
characters, locations, props from script.
- Minimum requirements before storyboard generation: Location backdrops (multi-angle), 
Character guides (full-body, profile, close-up + wardrobe), Time of day, Weather.
- Dual purpose of Shot Composer:
  - Primary: Define/configure a **Shot** (parameters, references, lighting, camera)
  - Secondary: Generate one or more **Storyboard Frames** from that defined shot.
- A Scene contains multiple Shots. A Shot can have 1+ Storyboard Frames.
- Support multiple workflows (Script-first, Visual/Mood-first, Beat-first, Asset-first) 
via dual-tab navigation.

## 2. Dual-Tab UI Structure
- **Left Vertical Big Tabs** (fixed sidebar):
  1. Script
  2. Breakdown
  3. Entities (Characters | Locations | Props | Wardrobe)
  4. Beats & Structure
  5. Visuals (Mood Board | References | Storyboard | Shot Composer)
  6. Production (Dashboard | Timeline | Drafts)

- **Top Horizontal Tabs**: Dynamic based on left selection.
- Right Inspector: Context-aware details.
- Strong integration of **Locations + Camera + Lighting** (critical for AI model consistency).

## 3. Key Features in Entities → Locations
- Plan View: Upload floorplan/aerial → Click to place camera markers.
- Camera Details: Label, Shot Type, Angle, Rotation, FOV.
- **Camera Path Simulation**: Path mode, multiple points, types (Static, Dolly, Orbit, Pan).
- **Lighting Setup**: Per-camera or per-shot (3-Point, Rim Light, High Key, Low Key, Natural, etc.).

## 4. Character Locking
- Toggle + strength slider (70-85% recommended default).
- High strength = strong consistency but risks stiffness.
- Locked characters auto-injected into prompts with strength %.
- Not all models support explicit strength; app should intelligently translate.

## 5. Shot Composer Requirements (Final Vision)
- **Shot Navigator** at top: Horizontal carousel/list of shots from current scene/script (e.g. 1A, 1B, 1C).
- Clicking a shot loads its parameters into the composer.
- **Define the Shot** section:
  - Field Size: ECU, CU, MCU, MS, LS, ELS, WS, FS, etc.
  - Camera Movement / Path (from plan view)
  - Duration
  - Lighting Setup (imported from plan view or selectable)
- **Active References Panel**: Shows locked characters (with %), location backdrop, lighting, camera path.
- **Live Prompt Builder**: Automatically assembles full prompt from all sources.
- **Generate Section**: "Generate 1 Frame", "Generate 3 Variations", "Generate Video" from the defined shot.
- **Scratchpad Mode**: "Create Custom Shot (Scratchpad)" for experimental shots not tied to script.

## 6. Current Artifact State
- Self-contained HTML demo at `/home/workdir/artifacts/cinegen-dual-tab-ui.html`
- Implements dual-tab layout, Locations plan view with camera + paths, Character locking, enhanced Shot Composer with navigator + scratchpad.
- Designed to be easily extended and later wired to real backend (Lit 3 components, API calls, etc.).

## 7. Future Goals
- Strong foundation for RunwayML / LTX Studio / Higgfield parity, especially in visual consistency (backdrops, camera control, character locking, structured lighting).
- Clean separation between shot definition and frame generation.
- Full propagation between Script ↔ Entities ↔ Visuals.

Use this full context when extending the UI, implementing new Lit components, or connecting to generation backends.