Implementation Plan: FDX-based Script Editor with Project-wide Parser Sync
Research Summary
The screenplay-tools library (wildwinter/screenplay-tools) is perfect for this - it's MIT-licensed, has JavaScript/ESM support, and provides:
- FDX Parser - Parses Final Draft XML to a Script object
- FDX Writer - Converts Script object back to FDX XML
- Fountain Parser/Writer - For Fountain format support
- CallbackParser - For real-time dialogue+character pairing
- FormatHelper - Fountain markup → HTML conversion
- Built browser files available in releases (screenplayTools.js and screenplayTools.min.js)
Architecture Overview
┌─────────────────────────────────────────────────────────────────┐
│                        CINE GEN APP                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │ Script Editor│    │  FDX Store   │    │  Project Parser  │  │
│  │  (textarea)  │◄───│  (IndexedDB) │───►│  (screenplay-tools)│  │
│  └──────────────┘    └──────────────┘    └────────┬─────────┘  │
│         ▲                                        │            │
│         │              ┌─────────────────────────┼────────┐    │
│         │              ▼                         ▼        ▼    │
│         └──────────►┌──────────────────────────────────────┐   │
│                     │        SYNC ENGINE                    │   │
│                     │  • Characters → Entities tab          │   │
│                     │  • Locations → Entities/Plan View     │   │
│                     │  • Scenes → Breakdown/Beat Timeline   │   │
│                     │  • Dialogue → Shot Composer           │   │
│                     └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
File Structure (New External JS Files)
cinegen-le/
├── index.html                    # Main entry (renamed from cinegen-le.html)
├── js/
│   ├── lib/
│   │   └── screenplayTools.min.js     # Bundled library (from releases)
│   ├── core/
│   │   ├── fdxStore.js          # IndexedDB wrapper for .fdx files
│   │   ├── scriptParser.js      # High-level parser using screenplay-tools
│   │   ├── syncEngine.js        # Project-wide sync coordinator
│   │   └── projectState.js      # Central state management
│   ├── editor/
│   │   ├── scriptEditor.js      # Script editor component
│   │   ├── fountainAdapter.js   # Fountain ↔ Editor sync
│   │   └── lineNumbers.js       # Line number gutter
│   ├── panels/
│   │   ├── entitiesPanel.js     # Characters/Locations/Props/Wardrobe
│   │   ├── breakdownPanel.js    # Scene breakdown
│   │   ├── beatsPanel.js        # Beat timeline
│   │   ├── shotComposer.js      # Shot composer
│   │   └── locationsPlan.js     # Camera/lighting plan view
│   └── app.js                   # Main app initialization
└── styles/
    └── editor.css               # Extracted CSS
Phase 1: Core Infrastructure (Week 1)
1.1 js/lib/screenplayTools.min.js
- Download from GitHub releases v0.0.10
- Provides: FDXParser, FDXWriter, FountainParser, FountainWriter, Script, ElementType, etc.
1.2 js/core/fdxStore.js
// IndexedDB wrapper for .fdx file persistence
class FDXStore {
  // init(), saveScript(projectId, script), loadScript(projectId), 
  // exportFDX(projectId), importFDX(file), getAllVersions(projectId)
}
1.3 js/core/scriptParser.js
// High-level parser using screenplay-tools
class ScriptParser {
  // parseFDX(xmlString) → Script object
  // parseFountain(text) → Script object  
  // scriptToFDX(script) → XML string
  // scriptToFountain(script) → string
  // extractEntities(script) → { characters, locations, scenes, shots }
  // extractDialogue(script) → [{character, parenthetical, text, scene}]
}
1.4 js/core/projectState.js
// Central reactive state (like a mini Redux/Vue reactivity)
class ProjectState {
  // script: Script object
  // entities: { characters, locations, props, wardrobe }
  // scenes: Scene[]
  // shots: Shot[]
  // currentProject: ProjectConfig
  // subscribers: Set<callback>
  // subscribe(), notify(), getState()
}
Phase 2: Sync Engine (Week 1-2)
js/core/syncEngine.js
class SyncEngine {
  constructor(projectState, fdxStore, scriptParser) {}
  
  // parseAndSync(fdxOrFountain) → parsed entities
  // syncCharacters(script) → updates Entities panel
  // syncLocations(script) → updates Locations/Plan View
  // syncScenes(script) → updates Breakdown/Beats
  // syncShots(script) → updates Shot Composer
  // onScriptChange(debounced) → re-parse + diff + notify
  
  // Diff algorithm: compare lastSyncHash vs current
  // Only update changed entities (incremental sync)
}
Phase 3: Editor Components (Week 2)
js/editor/scriptEditor.js
- Textarea with line numbers
- Fountain input (user writes in Fountain)
- Real-time FDX sync (debounced save to IndexedDB)
- Toolbar: Save, Export FDX, Import FDX, Parse & Sync
- Diff banner when out of sync
js/editor/fountainAdapter.js
- Converts editor text → Fountain → Script object
- Converts Script object → Fountain for editor display
- Handles cursor position preservation
Phase 4: Panel Integrations (Week 2-3)
Each panel subscribes to ProjectState changes:
Panel	Data Source	Sync Trigger
Entities → Characters	scriptParser.extractEntities().characters	Character names from dialogue
Entities → Locations	Scene headings (INT./EXT.)	Scene heading parsing
Breakdown	Full scene elements	Scene-by-scene parse
Beats	Scene headings + transitions	Structural analysis
Shot Composer	Loaded scene's shots	Scene selection
Locations Plan	Camera markers + lighting	Manual + AI generation
Key Technical Decisions
Decision	Recommendation
Source of Truth	.fdx file in IndexedDB (binary blob)
Editor Format	Fountain (human-editable, diff-friendly)
Parse Trigger	Debounced (500ms) on editor input + explicit "Parse & Sync" button
Sync Strategy	Incremental diff via hash comparison (lastSyncHash)
Storage	IndexedDB (client-side) + optional File System Access API for real .fdx files
Library Loading	<script src="js/lib/screenplayTools.min.js"> (IIFE global ScreenplayTools)
Integration Points in Existing HTML
1. Replace inline <script> with js/app.js + modular imports
2. Script Editor → use new ScriptEditor class
3. Parse & Sync button → calls syncEngine.parseAndSync()
4. Entities panel → subscribes to projectState.on('entitiesChanged', ...)
5. Breakdown/Beats/Shot Composer → same pattern
Clarifying Questions
1. File System Access: Do you want real .fdx file read/write via File System Access API, or is IndexedDB sufficient for now?
2. Bidirectional Sync: Should edits in Entities/Breakdown panels write back to the script (FDX), or is it one-way (Script → Panels only)?
3. Collaboration: Any plans for multi-user editing? (Affects conflict resolution strategy)
4. Build Step: Want to keep it no-build (ESM in browser) or add Vite/esbuild for bundling?
5. Existing Data Migration: How to handle existing mockData in the current HTML?
Next Steps
Once you confirm the approach, I'll:
1. Download screenplayTools.min.js from releases
2. Create the file structure
3. Implement core modules (fdxStore, scriptParser, projectState, syncEngine)
4. Refactor the HTML to use external JS
5. Wire up the Script Editor → FDX → Parser → Panels pipeline
Want me to proceed with this plan? Any modifications to the architecture?
▣  Plan · Nemotron 3 Ultra (free) · 9m 12s
1. real .fdx file read/write via File System Access API 2. Bidirectional Sync 3. plan for multi-user  4. vite  5. however you see fit. we are writing a lit-based component app.  write the plan to file: PLAN.md