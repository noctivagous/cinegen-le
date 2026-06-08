import { LitElement, html, css } from 'lit';
import { projectState } from '../core/projectState.js';

export class CinegenEntities extends LitElement {
  static styles = css`
    :host { display: block; max-width: 1200px; margin: 0 auto; width: 100%; }
    h2 { font-family: 'Space Grotesk', sans-serif; color: #96b2cb; font-size: 1.25rem !important; }
    .placeholder { text-align: center; padding: 3rem 0; color: var(--text-muted, #64748b); font-size: 14px; }
    .placeholder i { font-size: 2rem; margin-bottom: 1rem; opacity: 0.2; }
    .placeholder p { text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; font-weight: 700; }
    .placeholder span { font-size: 10px; color: rgba(100,116,139,0.6); }
  `;

  static properties = {
    topTab: { type: String }
  };

  constructor() {
    super();
    this.topTab = 'characters';
  }

  render() {
    if (this.topTab === 'characters') {
      return html`<cinegen-characters></cinegen-characters>`;
    }
    if (this.topTab === 'locations') {
      return html`<cinegen-locations></cinegen-locations>`;
    }
    if (this.topTab === 'props') {
      return html`<cinegen-props></cinegen-props>`;
    }
    if (this.topTab === 'wardrobe') {
      return html`<cinegen-wardrobe></cinegen-wardrobe>`;
    }
    return html`
      <div class="placeholder">
        <i class="fa-solid fa-cube"></i>
        <p>Entities — ${this.topTab}</p>
        <span>View coming soon</span>
      </div>
    `;
  }
}

export class CinegenCharacters extends LitElement {
  static styles = css`
    :host { display: block; max-width: 960px; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
    .header h2 { margin-bottom: 4px; }
    .header p { font-size: 14px; color: var(--text-muted, #64748b); }
    .btn { padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: white; color: #0f172a; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .card { background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51,65,85,0.5); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); border-color: var(--accent, #3b82f6); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .card-name { font-weight: 600; font-size: 1.125rem; }
    .card-desc { font-size: 12px; color: var(--text-muted, #64748b); margin-top: 2px; }
    .card-badges { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .badge { padding: 2px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid; }
    .badge-locked { background: rgba(16,185,129,0.2); color: #10b981; border-color: rgba(16,185,129,0.2); }
    .badge-unlocked { background: rgba(51,65,85,0.5); color: var(--text-muted, #64748b); border-color: rgba(51,65,85,0.5); }
    .badge-ready { background: rgba(16,185,129,0.2); color: #10b981; border-color: rgba(16,185,129,0.2); }
    .badge-warning { background: rgba(245,158,11,0.2); color: #f59e0b; border-color: rgba(245,158,11,0.2); }
    .badge-danger { background: rgba(239,68,68,0.2); color: #ef4444; border-color: rgba(239,68,68,0.2); }
    .lock-section { margin-top: 1.25rem; }
    .lock-header { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
    .lock-header span:first-child { color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; font-size: 9px; }
    .lock-header span:last-child { font-family: 'JetBrains Mono', monospace; color: #10b981; }
    input[type="range"] { width: 100%; accent-color: #10b981; height: 4px; background: rgba(51,65,85,0.5); border-radius: 8px; cursor: pointer; }
    .lock-labels { display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted, #64748b); margin-top: 4px; text-transform: uppercase; font-weight: 700; letter-spacing: -0.01em; }
    .card-footer { margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
    .card-footer .refs { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--text-muted, #64748b); }
    .lock-btn { padding: 6px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: none; cursor: pointer; transition: background 0.2s; }
    .lock-btn.locked { background: #059669; color: white; }
    .lock-btn.unlocked { background: rgba(51,65,85,0.5); color: var(--text-secondary, #cbd5e1); }
    .info-box { margin-top: 2rem; padding: 1.25rem; border-radius: 12px; background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51,65,85,0.5); font-size: 12px; color: var(--text-muted, #64748b); line-height: 1.5; }
    .info-box strong { color: #10b981; }
  `;

  static properties = {
    characters: { type: Array }
  };

  constructor() {
    super();
    this.characters = [];
  }

  connectedCallback() {
    super.connectedCallback();
    const state = projectState.state;
    this.characters = state.entities?.characters || [];
    projectState.subscribe((s) => {
      this.characters = s.entities?.characters || [];
    });
  }

  render() {
    return html`
      <div class="header">
        <div>
          <h2>Characters</h2>
          <p>Lock characters for consistent AI generation across shots</p>
        </div>
        <button class="btn" @click=${this._addNew}>
          <i class="fa-solid fa-plus"></i>
          <span>New Character</span>
        </button>
      </div>
      <div class="grid">
        ${this.characters.map(char => html`
          <div class="card">
            <div class="card-top">
              <div>
                <div class="card-name">${char.name}</div>
                <div class="card-desc">${char.description}</div>
              </div>
              <div class="card-badges">
                <div class="badge ${char.locked ? 'badge-locked' : 'badge-unlocked'}">
                  ${char.locked ? 'LOCKED' : 'Unlocked'}
                </div>
                <div class="badge ${char.readiness >= 70 ? 'badge-ready' : char.readiness >= 40 ? 'badge-warning' : 'badge-danger'}">
                  ${char.readiness}% Ready
                </div>
              </div>
            </div>
            <div class="lock-section">
              <div class="lock-header">
                <span>Lock Strength</span>
                <span>${char.lockStrength}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" .value=${char.lockStrength}
                     @change=${(e) => this._updateLock(char.id, parseInt(e.target.value))}>
              <div class="lock-labels">
                <div>Loose</div>
                <div>Strict</div>
              </div>
            </div>
            <div class="card-footer">
              <span class="refs">${char.references} refs</span>
              <button class="lock-btn ${char.locked ? 'locked' : 'unlocked'}"
                      @click=${(e) => this._toggleLock(char.id, e)}>
                ${char.locked ? 'Unlock' : 'Lock'}
              </button>
            </div>
          </div>
        `)}
      </div>
      <div class="info-box">
        <strong>How Character Locking Works:</strong><br>
        When locked, this character reference is automatically injected into every generation with the chosen strength.
        This ensures visual consistency across shots — a core requirement for professional AI filmmaking tools.
      </div>
    `;
  }

  _addNew() {
    const name = prompt("New character name:");
    if (!name) return;
    const state = projectState.state;
    const chars = [...(state.entities?.characters || [])];
    chars.push({
      id: Date.now(),
      name,
      description: "New character",
      locked: false,
      lockStrength: 70,
      references: 0,
      readiness: 0
    });
    projectState.update('entities', { ...state.entities, characters: chars });
    this.characters = chars;
  }

  _toggleLock(id, e) {
    e.stopImmediatePropagation();
    const state = projectState.state;
    const chars = (state.entities?.characters || []).map(c => {
      if (c.id === id) {
        const locked = !c.locked;
        return { ...c, locked, lockStrength: locked && c.lockStrength < 50 ? 75 : c.lockStrength };
      }
      return c;
    });
    projectState.update('entities', { ...state.entities, characters: chars });
    this.characters = chars;
  }

  _updateLock(id, val) {
    const state = projectState.state;
    const chars = (state.entities?.characters || []).map(c => {
      if (c.id === id) {
        const strength = val;
        return { ...c, lockStrength: strength, locked: strength > 60 ? true : c.locked };
      }
      return c;
    });
    projectState.update('entities', { ...state.entities, characters: chars });
    this.characters = chars;
  }
}

export class CinegenLocations extends LitElement {
  static styles = css`
    :host { display: block; max-width: 1200px; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem; }
    .header h2 { margin-bottom: 4px; }
    .btn { padding: 8px 16px; border-radius: 12px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: white; color: #0f172a; }
    .flex { display: flex; gap: 1.5rem; }
    .library { width: 288px; flex-shrink: 0; }
    .library-title { font-size: 12px; font-weight: 700; color: var(--text-muted, #64748b); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; padding: 0 4px; }
    .loc-card { cursor: pointer; padding: 1rem; border-radius: 12px; background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51,65,85,0.5); display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; margin-bottom: 8px; }
    .loc-card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); border-color: var(--accent, #3b82f6); }
    .loc-card.active { border-color: #3b82f6; box-shadow: 0 0 0 1px rgba(59,130,246,0.5); }
    .loc-name { font-weight: 600; font-size: 14px; }
    .loc-scenes { font-size: 10px; color: var(--text-muted, #64748b); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
    .loc-badges { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .loc-badge { padding: 2px 8px; border-radius: 999px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; }
    .loc-badge.has { background: rgba(16,185,129,0.2); color: #10b981; }
    .loc-badge.missing { background: rgba(245,158,11,0.2); color: #f59e0b; }
    .workspace { flex: 1; }
    .plan-panel { padding: 1.25rem; border-radius: 12px; background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51,65,85,0.5); }
    .plan-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .plan-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .plan-loc-name { font-size: 10px; padding: 2px 12px; background: rgba(30,41,59,0.5); border-radius: 999px; color: var(--text-muted, #64748b); border: 1px solid var(--border, #334155); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
    .plan-actions { display: flex; gap: 8px; }
    .plan-actions button { padding: 6px 12px; border-radius: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .btn-upload { background: rgba(30,41,59,0.5); color: var(--text-secondary, #cbd5e1); border: 1px solid var(--border, #334155); }
    .btn-ai { background: #2563eb; color: white; }
    .plan-view { position: relative; width: 100%; height: 320px; border-radius: 12px; background: var(--bg-secondary, #1e293b); border: 2px solid var(--border, #334155); overflow: hidden; cursor: crosshair; display: flex; align-items: center; justify-content: center; }
    .plan-placeholder { text-align: center; font-size: 12px; color: var(--text-muted, #64748b); pointer-events: none; }
    .plan-placeholder i { font-size: 1.75rem; margin-bottom: 8px; opacity: 0.4; }
    .plan-placeholder span { font-size: 10px; }
    .placeholder-view { text-align: center; padding: 3rem; color: var(--text-muted, #64748b); }
  `;

  static properties = {
    locations: { type: Array },
    selectedId: { type: Number }
  };

  constructor() {
    super();
    this.locations = [];
    this.selectedId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const state = projectState.state;
    this.locations = state.entities?.locations || [];
    projectState.subscribe((s) => {
      this.locations = s.entities?.locations || [];
    });
  }

  render() {
    const selected = this.locations.find(l => l.id === this.selectedId);
    return html`
      <div class="header">
        <div>
          <h2>Locations</h2>
          <p style="font-size:14px;color:var(--text-muted)">Manage backdrops, camera positions & lighting</p>
        </div>
        <button class="btn" @click=${this._addNew}><i class="fa-solid fa-plus"></i><span>New Location</span></button>
      </div>
      <div class="flex">
        <div class="library">
          <div class="library-title">Library</div>
          ${this.locations.map(loc => html`
            <div class="loc-card ${classMap({ active: this.selectedId === loc.id })}" @click=${() => this._select(loc.id)}>
              <div>
                <div class="loc-name">${loc.name}</div>
                <div class="loc-scenes">Scenes: ${loc.scenes || '—'}</div>
              </div>
              <div class="loc-badges">
                <div class="loc-badge ${loc.hasGuide ? 'has' : 'missing'}">${loc.backdrops || 0} backdrops</div>
              </div>
            </div>
          `)}
        </div>
        <div class="workspace">
          ${selected ? html`
            <div class="plan-panel">
              <div class="plan-header">
                <div>
                  <span class="plan-title">Plan View</span>
                  <span class="plan-loc-name">${selected.name}</span>
                </div>
                <div class="plan-actions">
                  <button class="btn-upload"><i class="fa-solid fa-upload"></i>Upload Plan</button>
                  <button class="btn-ai"><i class="fa-solid fa-magic"></i>AI Generate All</button>
                </div>
              </div>
              <div class="plan-view">
                <div class="plan-placeholder">
                  <i class="fa-solid fa-map"></i><br>
                  Upload floor plan or aerial photo<br>
                  <span>Click to place camera markers</span>
                </div>
              </div>
            </div>
          ` : html`
            <div class="placeholder-view">
              <i class="fa-solid fa-map" style="font-size:2rem;margin-bottom:1rem;opacity:0.2"></i>
              <p style="text-transform:uppercase;letter-spacing:0.05em;font-size:11px;font-weight:700">Select a location to view plan</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  _select(id) {
    this.selectedId = id;
  }

  _addNew() {
    const name = prompt("New location name:");
    if (!name) return;
    const state = projectState.state;
    const locs = [...(state.entities?.locations || [])];
    locs.push({ id: Date.now(), name, scenes: '—', backdrops: 0, hasGuide: false, readiness: 0 });
    projectState.update('entities', { ...state.entities, locations: locs });
  }
}

function classMap(classes) {
  return Object.entries(classes).filter(([,v]) => v).map(([k]) => k).join(' ');
}

export class CinegenProps extends LitElement {
  static styles = css`
    :host { display: block; max-width: 960px; }
    h2 { margin-bottom: 4px; }
    .placeholder { text-align: center; padding: 3rem; color: var(--text-muted, #64748b); }
  `;
  render() { return html`<h2>Props</h2><div class="placeholder"><i class="fa-solid fa-couch" style="font-size:2rem;margin-bottom:1rem;opacity:0.2"></i><p>Props view coming soon</p></div>`; }
}

export class CinegenWardrobe extends LitElement {
  static styles = css`
    :host { display: block; max-width: 960px; }
    h2 { margin-bottom: 4px; }
    .placeholder { text-align: center; padding: 3rem; color: var(--text-muted, #64748b); }
  `;
  render() { return html`<h2>Wardrobe</h2><div class="placeholder"><i class="fa-solid fa-shirt" style="font-size:2rem;margin-bottom:1rem;opacity:0.2"></i><p>Wardrobe view coming soon</p></div>`; }
}