export class ProjectState {
  constructor() {
    this._state = {
      script: null,
      entities: { characters: [], locations: [], props: [], wardrobe: [] },
      scenes: [],
      shots: {},
      currentLeftTab: 'script',
      currentTopTab: 'editor',
      selectedLocation: null,
      selectedMarker: null,
      cameraMarkers: [],
      currentShot: null,
      scratchShots: [],
      projectFileHandle: null,
      projectName: 'Untitled Project',
      lastSyncHash: '',
      isDirty: false
    };
    this._subscribers = new Set();
    this._prevState = {};
  }

  get state() {
    return this._state;
  }

  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this._subscribers.delete(callback);
  }

  _notify(changePath) {
    for (const cb of this._subscribers) {
      cb(this._state, changePath);
    }
  }

  update(path, value) {
    const parts = path.split('.');
    let current = this._state;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    this._state.isDirty = true;
    this._notify(path);
  }

  batch(updates) {
    for (const [path, value] of Object.entries(updates)) {
      const parts = path.split('.');
      let current = this._state;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
    }
    this._state.isDirty = true;
    this._notify('batch');
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this._state));
  }

  loadSnapshot(snapshot) {
    this._state = JSON.parse(JSON.stringify(snapshot));
    this._notify('full');
  }
}

export const projectState = new ProjectState();