import { LitElement, html, css } from 'lit';

export class CinegenProduction extends LitElement {
  static styles = css`
    :host { display: block; max-width: 960px; margin: 0 auto; width: 100%; }
    h2 { font-family: 'Space Grotesk', sans-serif; color: #96b2cb; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .stat-card { padding: 1.25rem; border-radius: 12px; background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(51,65,85,0.5); transition: all 0.3s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); border-color: var(--accent, #3b82f6); }
    .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted, #64748b); }
    .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 2.25rem; font-weight: 700; margin-top: 8px; }
    .stat-value.blue { color: #3b82f6; }
    .stat-value.green { color: #10b981; }
    .stat-value.amber { color: #f59e0b; }
    .stat-value.violet { color: #8b5cf6; }
  `;

  render() {
    return html`
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:4px">Production Dashboard</h2>
      <div class="grid">
        <div class="stat-card">
          <div class="stat-label">Scenes</div>
          <div class="stat-value blue">42</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Backdrops Ready</div>
          <div class="stat-value green">6<span style="font-size:1rem;vertical-align:super;color:var(--text-muted)">/7</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Camera Setups</div>
          <div class="stat-value amber">31</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">AI Generations</div>
          <div class="stat-value violet">184</div>
        </div>
      </div>
    `;
  }
}