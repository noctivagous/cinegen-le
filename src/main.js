import './styles/global.css';
import { CineGenApp } from './components/cinegen-app.js';
import { CinegenEditor } from './components/cinegen-editor.js';
import { CinegenEntities, CinegenCharacters, CinegenLocations, CinegenProps, CinegenWardrobe } from './components/cinegen-entities.js';
import { CinegenBreakdown } from './components/cinegen-breakdown.js';
import { CinegenBeats } from './components/cinegen-beats.js';
import { CinegenProduction } from './components/cinegen-production.js';
import { CinegenInspector } from './components/cinegen-inspector.js';

customElements.define('cinegen-app', CineGenApp);
customElements.define('cinegen-editor', CinegenEditor);
customElements.define('cinegen-entities', CinegenEntities);
customElements.define('cinegen-characters', CinegenCharacters);
customElements.define('cinegen-locations', CinegenLocations);
customElements.define('cinegen-props', CinegenProps);
customElements.define('cinegen-wardrobe', CinegenWardrobe);
customElements.define('cinegen-breakdown', CinegenBreakdown);
customElements.define('cinegen-beats', CinegenBeats);
customElements.define('cinegen-production', CinegenProduction);
customElements.define('cinegen-inspector', CinegenInspector);

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('cinegen-app');
  if (app) {
    app.initialize?.();
  }
});