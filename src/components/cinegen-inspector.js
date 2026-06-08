import { LitElement, html, css } from 'lit';

export class CinegenInspector extends LitElement {
  static styles = css`
    :host { display: block; }
    .empty-state { text-align: center; padding: 3rem 0; color: rgba(71,85,105,0.6); }
    .empty-state i { font-size: 1.5rem; margin-bottom: 12px; opacity: 0.2; }
    .empty-state p { font-size: 11px; text-transform: uppercase; letter-spacing: -0.01em; }
  `;

  render() {
    return html`
      <div class="empty-state">
        <i class="fa-solid fa-mouse-pointer"></i>
        <p>Select an item to inspect</p>
      </div>
    `;
  }
}