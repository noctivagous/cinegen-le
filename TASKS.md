# CINEGEN DUAL-TAB UI DEMO - COMPLETION TASK LIST
# Goal: Make the HTML artifact production-grade and easy to wire into real Lit 3 backend

## Phase 1: Core Navigation & Shell (High Priority)
- [ ] Implement persistent state for (leftTab, topTab) using URL hash or localStorage
- [ ] Add smooth CSS transitions between tab content changes
- [ ] Make right inspector fully dynamic (shows relevant data based on current view/selection)
- [ ] Add global top bar with Project Title, Save, Export, and Status indicators
- [ ] Implement footer status bar (scene count, character count, location readiness %, etc.)
- [ ] Add subtle guidance banner ("Next recommended step: Complete location backdrops")

## Phase 2: Script Integration
- [ ] Enhance Script tab with realistic CodeMirror-like editor (textarea with syntax highlights)
- [ ] Auto-parse demo script on load (scenes, characters, locations)
- [ ] Show parsed entities in Outline panel
- [ ] Add "Parse & Sync" button that populates other tabs with mock data
- [ ] Implement basic diff/reconciliation simulation when "re-pasting" script

## Phase 3: Entities Tab (Critical for AI grounding)
### Locations Sub-tab
- [ ] Improve Plan View: Better visual grid/floorplan background
- [ ] Polish camera marker system (numbered, colored by shot type, drag + delete)
- [ ] Fully implement Camera Path system (add/edit points, path types, duration)
- [ ] Expand Lighting controls (3-Point, Rim, High Key, Low Key, presets with visual indicators)
- [ ] Add multi-angle backdrop thumbnails per camera marker
- [ ] "Generate Backdrop" button with mock loading + result preview

### Characters Sub-tab
- [ ] Complete Character cards with locking toggle + strength slider
- [ ] Add reference image slots (Face, Full Body, Profile, Wardrobe)
- [ ] Show emotional range palette
- [ ] Visual "LOCKED" indicators with strength %

## Phase 4: Shot Composer (Visuals Tab) - Most Important
- [ ] Polish Shot Navigator (horizontal scrollable pills for shots 1A, 1B, etc.)
- [ ] Clear visual separation:
  - Section 1: "Define the Shot" (Field Size dropdown, Movement, Duration, Lighting)
  - Section 2: "Active References" (auto-imported locked chars, location, camera path)
  - Section 3: "Live Prompt Builder" (editable, well-formatted)
  - Section 4: "Generate Storyboard Frames" (1 Frame, 3 Variations, Generate Video)
- [ ] Scratchpad mode fully integrated ("Create Custom Shot", "Load Scratch Shot", list of custom shots)
- [ ] Show current loaded shot header ("Scene 1 • Shot 1B - Define Shot")
- [ ] Make prompt update live when changing any parameter

## Phase 5: Storyboard & Visuals Tab
- [ ] Add dedicated Storyboard sub-tab with horizontal frame strip
- [ ] Clicking a frame opens it in Shot Composer for editing
- [ ] Show generated mock frames with status (Draft/Approved)
- [ ] Basic drag-to-reorder frames

## Phase 6: Polish & Realism
- [ ] Add realistic mock data across all tabs (pre-populated scenes, shots, entities)
- [ ] Implement toast notifications for actions (e.g., "Backdrop generated", "Shot saved")
- [ ] Add undo simulation for key actions
- [ ] Make all buttons feel responsive with loading states where appropriate
- [ ] Dark cinematic theme consistency (improve colors, spacing, typography)
- [ ] Mobile / responsive improvements for key views (especially Shot Composer)

## Phase 7: Data Model & Future Wiring Readiness
- [ ] Define clean JavaScript data structures (Shot, Scene, LocationCamera, Character, etc.)
- [ ] Add "Save Shot Configuration" that stores full structured object
- [ ] Add JSON export button for current project state (for backend handoff)
- [ ] Comment all major interactive sections clearly for Lit 3 porting
- [ ] Create a "Backend Simulation" section showing example API payloads

## Phase 8: Documentation & Handover
- [ ] Add inline comments explaining how each section maps to real backend entities
- [ ] Update the compiled context document with latest decisions
- [ ] Create a simple README section inside the HTML file

**Priority Order Recommendation:**
1. Finish Shot Composer + Navigator (core value)
2. Polish Locations + Camera + Lighting
3. Character Locking + References
4. Script ↔ Entities sync
5. Overall shell & polish

Once these are complete, the demo will be highly representative and ready for conversion into Lit 3 components.