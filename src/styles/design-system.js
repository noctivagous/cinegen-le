import { css } from 'lit';

export const designTokens = {
  // Flat panel colors (restored from old design)
  panelBg: '#2e3647',
  panelBorderRight: '#9a9797',
  panelBorderBottom: 'gray',
  panelRadius: '0.5em',

  // Beveled light source: top-left
  // Raised elements: light top/left, dark bottom/right
  // Sunken elements: dark top/left, light bottom/right
  bevelLight: '#9a9797',
  bevelDark: 'gray',
  bevelWhite: 'white',

  // Background layers (darkest to lightest)
  bgDeep: '#070c15',      // top bar
  bgDark: '#0b121d',      // left tabs
  bgMid: '#0f141c',       // top tabs container
  bgContent: '#0f172a',   // main content area

  // Foreground contrast
  headingColor: '#96b2cb',
  lineNumBg: 'darkcyan',
  textareaBg: 'transparent'
};

// Raised panel: lighter top/left edges, darker bottom/right => appears to protrude
export const raisedPanel = css`
  background: #2e3647;
  border-right: 1pt solid #9a9797;
  border-bottom: 1pt solid gray;
  border-radius: 0.5em;
  border-top: none;
  border-left: none;
`;

// Sunken panel: darker top/left edges, lighter bottom/right => appears pressed in
export const sunkenPanel = css`
  background: #0b1220;
  border-top: 1pt solid gray;
  border-left: 1pt solid gray;
  border-right: 1px solid white;
  border-bottom: none;
`;

// White drop shadow (used on editor widget)
export const whiteDropShadow = css`
  box-shadow: 1px 1px 1px white;
`;

// Heading section divider (panelHeadingBlock / h3)
export const sectionDivider = css`
  border-bottom: 1pt solid #4d4d4d;
  padding-bottom: 0.25em;
`;

// Items-start border (used on flex items)
export const itemsStartBorder = css`
  border-bottom: 1px solid #595e69;
`;

// Panel header
export const panelHeader = css`
  padding-bottom: 0.25em;
`;

// Full span cards
export const fullSpanCards = css`
  .fullSpanCards .card-hover {
    padding: 1.25rem !important;
  }
`;

// h2 heading style
export const h2Style = css`
  h2 {
    color: #96b2cb;
    font-size: 1.25rem !important;
    font-family: 'Space Grotesk', sans-serif !important;
  }
`;

// h3 heading style
export const h3Style = css`
  h3 {
    border-bottom: 1pt solid #4d4d4d !important;
    padding-bottom: 0.25em !important;
  }
`;