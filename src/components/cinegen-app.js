import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { projectState } from '../core/projectState.js';
import { syncEngine } from '../core/syncEngine.js';
import './cinegen-editor.js';
import './cinegen-entities.js';
import './cinegen-breakdown.js';
import './cinegen-beats.js';
import './cinegen-production.js';
import './cinegen-inspector.js';

export class CineGenApp extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-primary, #0f172a);
      color: var(--text-primary, #f1f5f9);
      font-family: 'Inter', sans-serif;
    }

    .top-bar {
      height: 56px;
      border-bottom: 1px solid var(--border, #334155);
      background: #070c15;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo i {
      color: white;
      font-size: 14px;
    }

    .app-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .project-badge {
      padding: 4px 12px;
      font-size: 10px;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 999px;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--border, #334155);
    }

    .project-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .stats-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      padding: 6px 12px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 8px;
      border: 1px solid var(--border, #334155);
    }

    .export-btn {
      padding: 6px 16px;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .export-btn:hover {
      background: #1d4ed8;
    }

    .export-btn i {
      font-size: 12px;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 12px;
      border-left: 1px solid var(--border, #334155);
    }

    .user-avatar img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--border, #334155);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 11px;
      font-weight: 600;
      line-height: 1;
    }

    .user-role {
      font-size: 9px;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }

    .body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .left-tabs {
      width: 240px;
      background: #0b121d;
      border-right: 1px solid var(--border, #334155);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex-shrink: 0;
    }

    .left-tabs-header {
      padding: 1.25rem 1rem 0.75rem;
    }

    .left-tabs-header span {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
    }

    .left-tab {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-secondary, #cbd5e1);
      margin: 4px 0.5rem;
    }

    .left-tab:hover {
      background: rgba(51, 65, 85, 0.5);
    }

    .left-tab.active {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .left-tab i {
      width: 20px;
      text-align: center;
    }

    .ai-readiness {
      margin-top: auto;
      padding: 1rem;
      border-top: 1px solid var(--border, #334155);
      background: rgba(15, 23, 42, 0.3);
    }

    .ai-readiness-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #64748b);
      padding: 0 0.75rem;
    }

    .ai-readiness-bar {
      margin-top: 0.5rem;
      padding: 0 0.75rem;
    }

    .ai-readiness-bar .bar {
      height: 6px;
      background: rgba(30, 41, 59, 0.8);
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid rgba(51, 65, 85, 0.5);
    }

    .ai-readiness-bar .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #10b981);
      border-radius: 999px;
      transition: width 0.5s ease;
    }

    .ai-readiness-stats {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      margin-top: 6px;
    }

    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-tabs-bar {
      height: 56px;
      border-bottom: 1px solid var(--border, #334155);
      background: #0f141c;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .top-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
    }

    .top-tab {
      padding: 0 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text-muted, #64748b);
      border-bottom: 2px solid transparent;
      height: 100%;
      display: flex;
      align-items: center;
      background: none;
      border-top: none;
      border-left: none;
      border-right: none;
      font-family: inherit;
    }

    .top-tab:hover {
      color: var(--text-secondary, #cbd5e1);
    }

    .top-tab.active {
      color: var(--accent, #3b82f6);
      border-bottom-color: var(--accent, #3b82f6);
      font-weight: 600;
    }

    .top-tab-right {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
    }

    .sync-badge {
      padding: 6px 12px;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-muted, #64748b);
      border: 1px solid var(--border, #334155);
    }

    .sync-badge i {
      color: #10b981;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      padding-top: 0.75em;
      background: var(--bg-primary, #0f172a);
      border-top: 1pt solid gray;
      border-left: 1pt solid gray;
      border-right: 1px solid white;
    }

    .right-inspector {
      width: 288px;
      border-left: 1px solid var(--border, #334155);
      background: var(--bg-secondary, #1e293b);
      padding: 1rem;
      overflow-y: auto;
      flex-shrink: 0;
      display: none;
    }

    @media (min-width: 1024px) {
      .right-inspector {
        display: block;
      }
    }

    .status-bar {
      height: 36px;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--text-muted, #64748b);
      font-weight: 500;
      background: var(--bg-primary, #0f172a);
      border-top: 1px solid var(--border, #334155);
      flex-shrink: 0;
    }

    .status-left, .status-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-num {
      font-family: 'JetBrains Mono', monospace;
      color: var(--accent, #3b82f6);
    }

    .status-ready {
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status-ready i {
      font-size: 10px;
    }

    .toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: var(--bg-secondary, #1e293b);
      border: 1px solid var(--border, #334155);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
      z-index: 1000;
      transition: opacity 0.3s;
    }

    .toast i {
      color: #10b981;
    }

    .toast.hidden {
      opacity: 0;
      pointer-events: none;
    }
  `;

  static properties = {
    leftTabs: { type: Array },
    topTabs: { type: Array },
    currentLeftTab: { type: String },
    currentTopTab: { type: String },
    toastMessage: { type: String },
    toastVisible: { type: Boolean },
    projectName: { type: String },
    sceneCount: { type: Number },
    characterCount: { type: Number },
    locationCount: { type: Number }
  };

  constructor() {
    super();
    this.leftTabs = [
      { id: 'script', icon: 'fa-scroll', label: 'Script' },
      { id: 'breakdown', icon: 'fa-list-check', label: 'Breakdown' },
      { id: 'entities', icon: 'fa-cube', label: 'Entities' },
      { id: 'beats', icon: 'fa-chart-line', label: 'Beats' },
      { id: 'production', icon: 'fa-clapperboard', label: 'Production' }
    ];
    this.topTabs = [];
    this.currentLeftTab = 'script';
    this.currentTopTab = 'editor';
    this.toastMessage = '';
    this.toastVisible = false;
    this.projectName = 'THE LAST SIGNAL';
    this.sceneCount = 0;
    this.characterCount = 0;
    this.locationCount = 0;
    this._unsubState = null;
    this._updateTopTabs('script');
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubState = projectState.subscribe((state, path) => {
      this.sceneCount = state.entities?.scenes?.length || 0;
      this.characterCount = state.entities?.characters?.length || 0;
      this.locationCount = state.entities?.locations?.length || 0;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubState) this._unsubState();
  }

  _switchLeftTab(tabId) {
    this.currentLeftTab = tabId;
    this._updateTopTabs(tabId);
    this.requestUpdate();
  }

  _switchTopTab(tabId) {
    this.currentTopTab = tabId;
    this.requestUpdate();
  }

  _updateTopTabs(leftTab) {
    const tabMap = {
      script: [
        { id: 'editor', label: 'Editor' },
        { id: 'outline', label: 'Outline' },
        { id: 'parse', label: 'Parse & Sync' }
      ],
      breakdown: [
        { id: 'all', label: 'All Scenes' },
        { id: 'per-scene', label: 'Per Scene' }
      ],
      entities: [
        { id: 'characters', label: 'Characters' },
        { id: 'locations', label: 'Locations' },
        { id: 'props', label: 'Props' },
        { id: 'wardrobe', label: 'Wardrobe' }
      ],
      beats: [
        { id: 'timeline', label: 'Timeline' },
        { id: 'treatment', label: 'Treatment' }
      ],
      production: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'drafts', label: 'Drafts' },
        { id: 'export', label: 'Export' }
      ]
    };
    this.topTabs = tabMap[leftTab] || [];
    const defaultTab = this.topTabs[0];
    if (defaultTab && !this.topTabs.find(t => t.id === this.currentTopTab)) {
      this.currentTopTab = defaultTab.id;
    }
  }

  _getActiveContent() {
    if (this.currentLeftTab === 'script') {
      return html`<cinegen-editor></cinegen-editor>`;
    }
    if (this.currentLeftTab === 'entities') {
      return html`<cinegen-entities .topTab=${this.currentTopTab}></cinegen-entities>`;
    }
    if (this.currentLeftTab === 'breakdown') {
      return html`<cinegen-breakdown></cinegen-breakdown>`;
    }
    if (this.currentLeftTab === 'beats') {
      return html`<cinegen-beats></cinegen-beats>`;
    }
    if (this.currentLeftTab === 'production') {
      return html`<cinegen-production></cinegen-production>`;
    }
    return html`<div>Select a tab</div>`;
  }

  async _handleExport() {
    this.dispatchEvent(new CustomEvent('show-export', { bubbles: true, composed: true }));
  }

  _showToast(msg) {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => { this.toastVisible = false; }, 2200);
  }

  render() {
    return html`
      <div class="top-bar">
        <div class="top-bar-left">
          <div class="logo"><i class="fa-solid fa-film"></i></div>
          <span class="app-title">CineGen</span>
          <div class="project-badge">
            <div class="dot"></div>
            <span style="color:#10b981;font-weight:500;letter-spacing:0.05em;text-transform:uppercase">
              Project: ${this.projectName}
            </span>
          </div>
        </div>
        <div class="top-bar-right">
          <div class="stats-badge">
            <span style="color:var(--text-muted)">${this.sceneCount} scenes</span>
            <span style="color:var(--border)">•</span>
            <span style="color:#10b981">87% ready</span>
          </div>
          <button class="export-btn" @click=${this._handleExport}>
            <i class="fa-solid fa-download"></i>
            <span>Export</span>
          </button>
          <div class="user-avatar">
            <img src="https://i.pravatar.cc/24?img=47" alt="User">
            <div class="user-info">
              <span class="user-name">Maya Chen</span>
              <span class="user-role">Director</span>
            </div>
          </div>
        </div>
      </div>

      <div class="body">
        <nav class="left-tabs">
          <div class="left-tabs-header">
            <span>Workflow</span>
          </div>
          ${this.leftTabs.map(tab => html`
            <div class="left-tab ${classMap({ active: this.currentLeftTab === tab.id })}"
                 @click=${() => this._switchLeftTab(tab.id)}>
              <i class="fa-solid ${tab.icon}"></i>
              <span>${tab.label}</span>
            </div>
          `)}
          <div class="ai-readiness">
            <div class="ai-readiness-label">AI Readiness</div>
            <div class="ai-readiness-bar">
              <div class="bar">
                <div class="bar-fill" style="width:87%"></div>
              </div>
              <div class="ai-readiness-stats">
                <span style="color:#60a5fa">87%</span>
                <span style="color:var(--text-muted);text-transform:uppercase;letter-spacing:-0.02em">Ready for gen</span>
              </div>
            </div>
          </div>
        </nav>

        <div class="main-area">
          <div class="top-tabs-bar">
            <div class="top-tabs">
              ${this.topTabs.map(tab => html`
                <button class="top-tab ${classMap({ active: this.currentTopTab === tab.id })}"
                        @click=${() => this._switchTopTab(tab.id)}>
                  ${tab.label}
                </button>
              `)}
            </div>
            <div class="top-tab-right">
              <div class="sync-badge">
                <i class="fa-solid fa-globe"></i>
                <span>12 references synced</span>
              </div>
            </div>
          </div>

          <div class="content-area scrollbar-thin">
            ${this._getActiveContent()}
          </div>

          <div class="status-bar">
            <div class="status-left">
              <div>
                <span class="status-num">${this.sceneCount}</span> scenes •
                <span class="status-num">${this.characterCount}</span> characters •
                <span class="status-num">${this.locationCount}</span> locations
              </div>
              <div class="status-ready">
                <i class="fa-solid fa-check-circle"></i>
                <span>Backdrops ready: 6/7</span>
              </div>
            </div>
            <div class="status-right">
              <span style="text-transform:uppercase;letter-spacing:0.05em;font-size:9px;color:var(--text-muted)">Last sync: just now</span>
              <span style="color:var(--border)">•</span>
              <span style="color:rgba(16,185,129,0.8);text-transform:uppercase;letter-spacing:0.05em;font-size:9px">Auto-save enabled</span>
            </div>
          </div>
        </div>

        <aside class="right-inspector">
          <div style="font-size:10px;font-weight:700;color:var(--text-muted);margin-bottom:1rem;padding:0 4px;text-transform:uppercase;letter-spacing:0.05em">Inspector</div>
          <cinegen-inspector></cinegen-inspector>
        </aside>
      </div>

      <div class="toast ${classMap({ hidden: !this.toastVisible })}">
        <i class="fa-solid fa-check"></i>
        <span>${this.toastMessage}</span>
      </div>
    `;
  }
}