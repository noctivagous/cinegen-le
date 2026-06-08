import { projectState } from './projectState.js';
import { scriptParser } from './scriptParser.js';
import { fdxStore } from './fdxStore.js';

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return h.toString(16);
}

class SimpleCRDT {
  constructor(siteId = 'local') {
    this.siteId = siteId;
    this.counter = 0;
    this.operations = [];
  }

  nextOpId() {
    return `${this.siteId}:${this.counter++}`;
  }

  createOp(type, path, value, version) {
    return {
      opId: this.nextOpId(),
      type,
      path,
      value,
      version,
      siteId: this.siteId,
      timestamp: Date.now()
    };
  }
}

export class SyncEngine {
  constructor() {
    this._crdt = new SimpleCRDT('local');
    this._debounceTimers = new Map();
    this._subscribers = new Set();
    this._fdxContent = '';
    this._lastSyncHash = '';
  }

  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }

  _notify(event, data) {
    for (const cb of this._subscribers) {
      cb(event, data);
    }
  }

  async openFDXFile() {
    const result = await fdxStore.openFile();
    if (!result) return null;

    this._fdxContent = result.content;
    this._lastSyncHash = hash(result.content);

    const state = projectState.state;
    state.projectFileHandle = fdxStore._fileHandle;
    state.projectName = result.name.replace('.fdx', '');

    this._notify('file-opened', { name: result.name });

    return this.parseAndSync(result.content);
  }

  async saveFDXFile() {
    const state = projectState.state;
    if (!state.script) {
      throw new Error('No script to save');
    }
    const xmlContent = scriptParser.scriptToFDX(state.script);
    const success = await fdxStore.saveFile(xmlContent);
    if (success) {
      this._fdxContent = xmlContent;
      this._lastSyncHash = hash(xmlContent);
      this._notify('file-saved', { name: fdxStore.getFileName() });
    }
    return success;
  }

  async saveAsFDXFile() {
    const state = projectState.state;
    if (!state.script) {
      throw new Error('No script to save');
    }
    const xmlContent = scriptParser.scriptToFDX(state.script);
    const success = await fdxStore.saveAsFile(xmlContent);
    if (success) {
      this._fdxContent = xmlContent;
      this._lastSyncHash = hash(xmlContent);
      state.projectName = fdxStore.getFileName().replace('.fdx', '');
      this._notify('file-saved', { name: fdxStore.getFileName() });
    }
    return success;
  }

  parseAndSync(content) {
    const state = projectState.state;

    let script;
    if (content.trim().startsWith('<?xml') || content.trim().startsWith('<FinalDraft')) {
      script = scriptParser.parseFDX(content);
    } else {
      script = scriptParser.parseFountain(content);
    }

    state.script = script;
    const entities = scriptParser.extractEntities(script);
    state.entities = entities;

    state.scenes = entities.scenes;

    this._lastSyncHash = hash(content);
    state.lastSyncHash = this._lastSyncHash;

    this._notify('sync-complete', {
      characters: entities.characters.length,
      locations: entities.locations.length,
      scenes: entities.scenes.length
    });

    return entities;
  }

  syncFromEditor(text) {
    const currentHash = hash(text);
    if (currentHash === this._lastSyncHash) return;

    this._debounced('editor-sync', () => {
      const script = scriptParser.parseFountain(text);
      const state = projectState.state;
      state.script = script;
      const entities = scriptParser.extractEntities(script);
      state.entities = entities;
      state.scenes = entities.scenes;
      state.lastSyncHash = currentHash;
      this._lastSyncHash = currentHash;

      this._notify('sync-from-editor', {
        characters: entities.characters.length,
        locations: entities.locations.length,
        scenes: entities.scenes.length
      });
    }, 500);
  }

  syncFromPanel(panelType, data) {
    const op = this._crdt.createOp(
      'update',
      `entities.${panelType}`,
      data,
      this._crdt.counter
    );

    const state = projectState.state;
    this._applyPanelUpdate(state, panelType, data);

    this._notify('sync-from-panel', { panelType, data, op });
  }

  _debounced(key, fn, delay) {
    if (this._debounceTimers.has(key)) {
      clearTimeout(this._debounceTimers.get(key));
    }
    this._debounceTimers.set(key, setTimeout(() => {
      this._debounceTimers.delete(key);
      fn();
    }, delay));
  }

  _applyPanelUpdate(state, panelType, data) {
    switch (panelType) {
      case 'characters':
        state.entities.characters = data;
        break;
      case 'locations':
        state.entities.locations = data;
        break;
      case 'props':
        state.entities.props = data;
        break;
      case 'wardrobe':
        state.entities.wardrobe = data;
        break;
      case 'scenes':
        state.scenes = data;
        break;
      case 'shots':
        state.shots = data;
        break;
    }
    state.isDirty = true;
  }

  getCRDTSnapshot() {
    return {
      operations: [...this._crdt.operations],
      counter: this._crdt.counter
    };
  }

  getIsDirty() {
    const state = projectState.state;
    const currentHash = state.script
      ? hash(scriptParser.scriptToFountain(state.script))
      : '';
    return currentHash !== this._lastSyncHash;
  }
}

export const syncEngine = new SyncEngine();