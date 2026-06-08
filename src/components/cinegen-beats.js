import { LitElement, html, css } from 'lit';
import { projectState } from '../core/projectState.js';

export class CinegenBeats extends LitElement {
  static styles = css`
    :host { display: block; max-width: 960px; margin: 0 auto; width: 100%; }
    h2 { font-family: 'Space Grotesk', sans-serif; color: #96b2cb; }
    .flex-row { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1.5rem; }
    .beat-card { min-width: 200px; padding: 1.25rem; border-radius: 12px; background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51,65,85,0.5); border-left: 4px solid #f59e0b; transition: all 0.3s; }
    .beat-card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
    .beat-num { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted, #64748b); }
    .beat-name { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.25rem; margin-top: 4px; }
    .beat-footer { margin-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; }
    .beat-emotion { padding: 2px 8px; border-radius: 4px; background: rgba(30,41,59,0.5); border: 1px solid var(--border, #334155); font-weight: 700; text-transform: uppercase; letter-spacing: -0.01em; color: var(--text-muted, #64748b); }
    .beat-scene { font-family: 'JetBrains Mono', monospace; color: #10b981; }
    .beat-edit { margin-top: 1.25rem; width: 100%; padding: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 8px; background: rgba(30,41,59,0.5); border: 1px solid var(--border, #334155); color: var(--text-secondary, #cbd5e1); cursor: pointer; font-family: inherit; }
    .desc { font-size: 14px; color: var(--text-muted, #64748b); margin-bottom: 1.5rem; }
  `;

  render() {
    const beats = [
      { name: 'Inciting Incident', emotion: 'Growth', scene: '1' },
      { name: 'First Act Climax', emotion: 'Connection', scene: '4' },
      { name: 'Midpoint', emotion: 'Center', scene: '7' },
      { name: 'Dark Night', emotion: 'Depth', scene: '9' },
      { name: 'Climax', emotion: 'Release', scene: '12' }
    ];
    return html`
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:4px">Beat Timeline</h2>
      <p class="desc">Narrative structure with emotional arcs • Linked to scenes & characters</p>
      <div class="flex-row scrollbar-thin">
        ${beats.map((beat, i) => html`
          <div class="beat-card">
            <div class="beat-num">Beat ${i+1}</div>
            <div class="beat-name">${beat.name}</div>
            <div class="beat-footer">
              <span class="beat-emotion">${beat.emotion}</span>
              <span class="beat-scene">Scene ${beat.scene}</span>
            </div>
            <button class="beat-edit">Edit Beat</button>
          </div>
        `)}
      </div>
    `;
  }
}