import { LitElement, css } from 'lit';

export class CinegenPanel extends LitElement {
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
  `;
}