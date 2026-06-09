import { html, css } from 'lit';
import { CinegenPanel } from './cinegen-panel.js';
import { projectState } from '../core/projectState.js';

export class CinegenBreakdown extends CinegenPanel {
  static styles = [
    super.styles,
    css`
    .panelHeader {
      padding-bottom: 0.25em;
    }

    .fullSpanCards .card-hover {
      padding: 1.25rem !important;
    }

    .scene-card {
      background: #2e3647;
      border-right: 1pt solid #9a9797;
      border-bottom: 1pt solid gray;
      border-radius: 0.5em;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .scene-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2);
      border-color: var(--accent, #3b82f6);
    }
    .scene-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .scene-num { font-family: 'JetBrains Mono', monospace; font-size: 1.125rem; font-weight: 600; }
    .scene-heading { font-size: 14px; color: var(--text-secondary, #cbd5e1); }
    .scene-status { padding: 4px 12px; border-radius: 999px; font-size: 12px; }
    .status-ready { background: rgba(6,78,59,0.8); color: #34d399; }
    .status-needs { background: rgba(120,53,15,0.8); color: #fbbf24; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; font-size: 12px; }
    .grid-3 h4 { font-size: 12px; font-weight: 600; margin-bottom: 8px; }
    .grid-3 h4:first-child { color: #34d399; }
    .grid-3 h4:nth-child(2) { color: #a78bfa; }
    .grid-3 h4:last-child { color: #fbbf24; }
    .elem { display: flex; justify-content: space-between; background: rgba(30,41,59,0.5); padding: 6px 12px; border-radius: 8px; margin-bottom: 4px; }
    .scene-actions { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border, #334155); display: flex; gap: 12px; font-size: 12px; }
    .scene-actions button { padding: 8px 16px; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .scene-actions .btn-outline { background: rgba(30,41,59,0.5); color: var(--text-secondary, #cbd5e1); }
    .scene-actions .btn-primary { background: #2563eb; color: white; }
    .desc { font-size: 14px; color: var(--text-muted, #64748b); margin-bottom: 1.25rem; }
  `];

  render() {
    return html`
      <div class="panelHeader">
        <h2>Breakdown</h2>
        <p class="desc">Scene-by-scene element extraction • Auto-tagged from script + manual overrides</p>
      </div>
      <div class="fullSpanCards">
        <div class="scene-card card-hover">
          <div class="scene-header">
            <div>
              <div class="scene-num">Scene 1</div>
              <div class="scene-heading">INT. ROOFTOP OBSERVATORY - NIGHT</div>
            </div>
            <div class="scene-status status-ready">Ready for Production</div>
          </div>
          <div class="grid-3">
            <div>
              <h4>CHARACTERS</h4>
              <div class="elem"><span>Dr. Elena Voss</span><span style="color:#34d399">Main</span></div>
              <div class="elem"><span>Marcus Hale</span><span style="color:var(--text-muted)">Supporting</span></div>
            </div>
            <div>
              <h4>PROPS & WARDROBE</h4>
              <div class="elem">Telescope • Vintage</div>
              <div class="elem">Dr. Voss Coat (Leather)</div>
            </div>
            <div>
              <h4>SFX / VFX / TIME</h4>
              <div class="elem">Wind (practical + SFX)</div>
              <div class="elem">Golden Hour lighting</div>
            </div>
          </div>
          <div class="scene-actions">
            <button class="btn-outline">Open Location Guide</button>
            <button class="btn-primary">Open in Shot Composer</button>
          </div>
        </div>
      </div>
`;
  }
}