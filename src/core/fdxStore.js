export class FDXStore {
  constructor() {
    this._fileHandle = null;
    this._originalContent = null;
  }

  get hasFileHandle() {
    return this._fileHandle !== null;
  }

  get isModified() {
    return this._originalContent !== null;
  }

  async openFile() {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'Final Draft Script',
          accept: { 'application/fdx': ['.fdx'] }
        }],
        multiple: false
      });
      this._fileHandle = handle;
      return await this.readFromHandle(handle);
    } catch (err) {
      if (err.name === 'AbortError') return null;
      throw err;
    }
  }

  async saveFile(xmlContent) {
    if (!this._fileHandle) {
      return await this.saveAsFile(xmlContent);
    }
    return await this.writeToHandle(this._fileHandle, xmlContent);
  }

  async saveAsFile(xmlContent) {
    try {
      const handle = await window.showSaveFilePicker({
        types: [{
          description: 'Final Draft Script',
          accept: { 'application/fdx': ['.fdx'] }
        }],
        suggestedName: 'Screenplay.fdx'
      });
      this._fileHandle = handle;
      return await this.writeToHandle(handle, xmlContent);
    } catch (err) {
      if (err.name === 'AbortError') return false;
      throw err;
    }
  }

  async readFromHandle(handle) {
    const file = await handle.getFile();
    this._originalContent = await file.text();
    return {
      name: file.name,
      content: this._originalContent,
      lastModified: file.lastModified
    };
  }

  async writeToHandle(handle, content) {
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    this._originalContent = content;
    return true;
  }

  getFileName() {
    return this._fileHandle?.name || 'Screenplay.fdx';
  }

  releaseHandle() {
    this._fileHandle = null;
    this._originalContent = null;
  }
}

export const fdxStore = new FDXStore();