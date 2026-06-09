import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { projectState } from '../core/projectState.js';
import { syncEngine } from '../core/syncEngine.js';
import { fdxStore } from '../core/fdxStore.js';
import { scriptParser } from '../core/scriptParser.js';

export class CinegenEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    h2 {
      color: #96b2cb;
      font-size: 1.25rem !important;
      font-family: 'Space Grotesk', sans-serif !important;
    }

    h3 {
      border-bottom: 1pt solid #4d4d4d !important;
      padding-bottom: 0.25em !important;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .header-left h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 4px;
      color: #96b2cb;
    }

    .header-left p {
      font-size: 12px;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    .btn-outline {
      background: transparent;
      color: var(--text-secondary, #cbd5e1);
      border: 1px solid var(--border, #334155);
    }

    .btn-outline:hover {
      background: rgba(51, 65, 85, 0.5);
    }

    .btn-success {
      background: #059669;
      color: white;
    }

    .btn-success:hover {
      background: #047857;
    }

    .diff-banner {
      background: linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0));
      border: 1px solid rgba(245,158,11,0.4);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .diff-banner.hidden {
      display: none;
    }

    .diff-banner-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .diff-banner-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(245,158,11,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .diff-banner-icon i {
      color: #f59e0b;
    }

    .diff-banner-text p:first-child {
      font-size: 14px;
      font-weight: 700;
      color: #fbbf24;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    .diff-banner-text p:last-child {
      font-size: 11px;
      color: rgba(252,211,77,0.6);
      font-weight: 500;
    }

    .diff-banner .btn {
      background: #f59e0b;
      color: #0f172a;
    }

    .diff-banner .btn:hover {
      background: #d97706;
    }

    .editor-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 1280px) {
      .editor-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .editor-wrap {
      background: #0b1220;
      border: 1px solid #1f2a44;
      border-top: 1pt solid gray;
      border-radius: 12px;
      box-shadow: 1px 1px 1px white;
      overflow: hidden;
    }

    .editor-toolbar {
      background: #0f172a;
      border-bottom: 1px solid #1f2a44;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .editor-toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .editor-filename {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #64748b);
    }

    .editor-status {
      padding: 2px 8px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      border-radius: 4px;
      background: rgba(16,185,129,0.1);
      color: #10b981;
      border: 1px solid rgba(16,185,129,0.2);
    }

    .editor-toolbar-actions {
      display: flex;
      gap: 4px;
    }

    .editor-toolbar-btn {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--text-muted, #64748b);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .editor-toolbar-btn:hover {
      background: rgba(30, 41, 59, 0.8);
    }

    .editor-body {
      display: flex;
      background: #0b1220;
    }

    .line-numbers {
      padding: 1rem 0 1rem 1rem;
      min-width: 48px;
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13.5px;
      line-height: 1.7;
      color: #e8f0f8;
      user-select: none;
      border-right: 2px solid rgba(0, 100, 100, 0.4);
      background: darkcyan;
      white-space: pre;
    }

    .editor-textarea {
      flex: 1;
      padding: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13.5px;
      line-height: 1.7;
      tab-size: 4;
      background: transparent;
      color: #e2e8f0;
      border: none;
      resize: none;
      min-height: 500px;
      outline: none;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .panel {
      background: #2e3647;
      border-right: 1pt solid #9a9797;
      border-bottom: 1pt solid gray;
      border-radius: 0.5em;
      padding: 1.25rem;
      transition: all 0.3s;
    }

    .panel:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
      border-color: var(--accent, #3b82f6);
    }

    .panelHeadingBlock {
      border-bottom: 1pt solid #4d4d4d;
      padding-bottom: 0.25em;
    }

    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
      border-color: var(--accent, #3b82f6);
    }

    .panel-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.5);
    }

    .outline-item {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 4px 0;
    }

    .outline-num {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: rgba(30, 41, 59, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent, #3b82f6);
      transition: all 0.2s;
    }

    .outline-item:hover .outline-num {
      background: #2563eb;
      color: white;
    }

    .outline-label {
      font-size: 12px;
      color: var(--text-secondary, #cbd5e1);
      transition: color 0.2s;
    }

    .outline-item:hover .outline-label {
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .stat-card {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(51, 65, 85, 0.3);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent, #3b82f6);
    }

    .stat-label {
      font-size: 9px;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
    }

    .sync-notice {
      margin-top: 1rem;
      padding: 8px 16px;
      font-size: 11px;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      background: rgba(16,185,129,0.05);
      border: 1px solid rgba(16,185,129,0.1);
      border-radius: 12px;
      width: fit-content;
    }
  `;

  static properties = {
    scriptText: { type: String },
    lineCount: { type: Number },
    isDirty: { type: Boolean },
    fileName: { type: String },
    sceneCount: { type: Number },
    pageCount: { type: Number }
  };

  constructor() {
    super();
    this.scriptText = `INT. ROOFTOP OBSERVATORY - NIGHT

The city stretches below like scattered diamonds. Dr. Elena Voss stands at the telescope, wind whipping her coat.

ELENA
The signal's getting stronger. It's not random.

She turns as a shadow falls across the observatory floor.`;
    this.lineCount = 1;
    this.isDirty = false;
    this.fileName = 'Screenplay.fdx';
    this.sceneCount = 2;
    this.pageCount = 1;
    this._unsubSync = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubSync = syncEngine.subscribe((event, data) => {
      if (event === 'file-opened' && data.name) {
        this.fileName = data.name;
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubSync) this._unsubSync();
  }

  firstUpdated() {
    this._updateLineNumbers();
  }

  updated(changed) {
    if (changed.has('scriptText')) {
      this._updateLineNumbers();
    }
  }

  _updateLineNumbers() {
    const numLines = this.scriptText.split('\n').length;
    const lineNums = this.shadowRoot?.querySelector('.line-numbers');
    if (lineNums) {
      lineNums.textContent = Array.from({length: numLines}, (_,i) => i+1).join('\n');
    }
  }

  _handleInput(e) {
    this.scriptText = e.target.value;
    this.isDirty = true;
    syncEngine.syncFromEditor(this.scriptText);
  }

  async _handleOpen() {
    try {
      const result = await syncEngine.openFDXFile();
      if (result) {
        if (this.scriptText.startsWith('<?xml') || this.scriptText.startsWith('<FinalDraft')) {
          const script = scriptParser.parseFDX(result.content);
          this.scriptText = scriptParser.scriptToFountain(script);
        } else {
          this.scriptText = result.content;
        }
        this.fileName = result.name;
        this.isDirty = false;
      }
    } catch (err) {
      console.error('Error opening file:', err);
    }
  }

  async _handleSave() {
    try {
      const state = projectState.state;
      if (!state.script) {
        const script = scriptParser.parseFountain(this.scriptText);
        state.script = script;
      }
      const success = await syncEngine.saveFDXFile();
      if (success) {
        this.isDirty = false;
      }
    } catch (err) {
      console.error('Error saving file:', err);
    }
  }

  async _handleSaveAs() {
    try {
      const state = projectState.state;
      if (!state.script) {
        const script = scriptParser.parseFountain(this.scriptText);
        state.script = script;
      }
      const success = await syncEngine.saveAsFDXFile();
      if (success) {
        this.isDirty = false;
        this.fileName = fdxStore.getFileName();
      }
    } catch (err) {
      console.error('Error saving file:', err);
    }
  }

  _handleParse() {
    syncEngine.parseAndSync(this.scriptText);
    this.isDirty = false;
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="panelHeadingBlock header">
        <div class="header-left">
          <h2>Script Editor</h2>
          <p>Fountain syntax • Auto-parsed entities</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" @click=${this._handleOpen}>
            <i class="fa-solid fa-folder-open"></i>
            <span>Open FDX</span>
          </button>
          <button class="btn btn-outline" @click=${this._handleSave}>
            <i class="fa-solid fa-floppy-disk"></i>
            <span>Save</span>
          </button>
          <button class="btn btn-outline" @click=${this._handleSaveAs}>
            <i class="fa-solid fa-save"></i>
            <span>Save As</span>
          </button>
          <button class="btn btn-primary" @click=${this._handleParse}>
            <i class="fa-solid fa-sync"></i>
            <span>Parse & Sync Entities</span>
          </button>
        </div>
      </div>

      <div class="diff-banner ${classMap({ hidden: !this.isDirty })}">
        <div class="diff-banner-left">
          <div class="diff-banner-icon">
            <i class="fa-solid fa-code-branch"></i>
          </div>
          <div class="diff-banner-text">
            <p>Script changed since last sync</p>
            <p>Entities, breakdown and boards may be out of date.</p>
          </div>
        </div>
        <button class="btn" @click=${this._handleParse}>Sync Now</button>
      </div>

      <div class="editor-grid">
        <div class="editor-wrap">
          <div class="editor-toolbar">
            <div class="editor-toolbar-left">
              <span class="editor-filename">${this.fileName}</span>
              <span class="editor-status">Parsed</span>
            </div>
            <div class="editor-toolbar-actions">
              <button class="editor-toolbar-btn" aria-label="Search" title="Search"><i class="fa-solid fa-search fa-xs"></i></button>
              <button class="editor-toolbar-btn" aria-label="More options" title="More options"><i class="fa-solid fa-ellipsis fa-xs"></i></button>
            </div>
          </div>
          <div class="editor-body">
            <div class="line-numbers">${Array.from({length: this.lineCount}, (_,i) => i+1).join('\n')}</div>
            <textarea class="editor-textarea scrollbar-thin"
                      aria-label="Script editor"
                      .value=${this.scriptText}
                      @input=${this._handleInput}
                      placeholder="Start writing your screenplay in Fountain syntax..."></textarea>
          </div>
        </div>

        <div class="sidebar">
          <div class="panel">
            <div class="panel-title">Parsed Outline</div>
            <div class="outline-item">
              <div class="outline-num">1</div>
              <span class="outline-label">Observatory Discovery</span>
            </div>
            <div class="outline-item">
              <div class="outline-num">2</div>
              <span class="outline-label">Neon Alley Investigation</span>
            </div>
          </div>

          <div class="panel">
            <div class="panel-title">Script Stats</div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${this.pageCount}</div>
                <div class="stat-label">Pages</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${this.sceneCount}</div>
                <div class="stat-label">Scenes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sync-notice">
        <i class="fa-solid fa-check-circle"></i>
        <span>18 entities detected • 3 new locations added to project</span>
      </div>
    `;
  }
}