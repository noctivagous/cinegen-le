// fast-xml-parser browser shim
// Bundles fast-xml-parser's XMLParser and XMLBuilder into a global `fastXmlParser`
(function() {
  const exports = {};

  // Minimal XMLParser implementation
  class XMLParser {
    constructor(options) {
      this.options = options || {};
    }
    parse(xmlStr) {
      const result = {};
      // Parse the XML string into a structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlStr, 'text/xml');
      
      function parseNode(node) {
        if (node.nodeType === 3) { // TEXT_NODE
          return node.nodeValue.trim();
        }
        if (node.nodeType === 4) { // CDATA
          return node.nodeValue;
        }
        
        const obj = {};
        const attrs = {};
        const children = [];
        
        if (node.attributes) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            attrs['@_' + attr.name] = attr.value;
          }
        }
        if (Object.keys(attrs).length > 0) {
          for (const [k, v] of Object.entries(attrs)) {
            obj[k] = v;
          }
        }
        
        let textContent = '';
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === 3) {
            textContent += child.nodeValue;
          } else if (child.nodeType === 4) {
            textContent += child.nodeValue;
          } else {
            children.push(parseNode(child));
          }
        }
        
        // Handle text nodes
        if (children.length === 0 && textContent.trim()) {
          if (this.options && this.options.textNodeName) {
            obj[this.options.textNodeName] = textContent;
          } else {
            obj['#text'] = textContent;
          }
        } else if (children.length > 0) {
          // Group children by tag name
          const groups = {};
          let hasText = false;
          for (const child of children) {
            if (typeof child === 'string') {
              hasText = true;
              continue;
            }
            for (const tagName of Object.keys(child)) {
              if (!groups[tagName]) groups[tagName] = [];
              groups[tagName].push(child[tagName]);
            }
          }
          if (this.options && this.options.textNodeName && textContent.trim()) {
            obj[this.options.textNodeName] = textContent;
          }
          if (hasText && textContent.trim()) {
            obj['#text'] = textContent;
          }
          for (const [tagName, items] of Object.entries(groups)) {
            obj[tagName] = items.length === 1 ? items[0] : items;
          }
        }
        
        return obj;
      }
      
      const root = doc.documentElement;
      if (root) {
        const parsed = parseNode(root);
        const keys = Object.keys(parsed);
        // If the root has attributes and text, wrap in tag name
        const tagResult = {};
        tagResult[root.tagName] = parsed;
        return tagResult;
      }
      return result;
    }
  }

  // Minimal XMLBuilder implementation using DOM
  class XMLBuilder {
    constructor(options) {
      this.options = options || {};
    }
    build(obj) {
      function buildNode(obj, tagName) {
        let xml = '';
        if (Array.isArray(obj)) {
          for (const item of obj) {
            xml += buildNode(item, tagName);
          }
          return xml;
        }
        xml += `<${tagName}`;
        const attrs = {};
        const children = {};
        for (const [k, v] of Object.entries(obj)) {
          if (k.startsWith('@_')) {
            attrs[k.slice(2)] = v;
          } else {
            children[k] = v;
          }
        }
        for (const [k, v] of Object.entries(attrs)) {
          xml += ` ${k}="${v}"`;
        }
        if (Object.keys(children).length === 0) {
          xml += ' />';
          return xml;
        }
        xml += '>';
        for (const [k, v] of Object.entries(children)) {
          if (k === '#text' || k === 'Text') {
            xml += typeof v === 'string' ? v : '';
          } else if (typeof v === 'string') {
            xml += `<${k}>${v}</${k}>`;
          } else if (Array.isArray(v)) {
            for (const item of v) {
              if (typeof item === 'string') {
                xml += `<${k}>${item}</${k}>`;
              } else {
                xml += buildNode(item, k);
              }
            }
          } else if (typeof v === 'object') {
            xml += buildNode(v, k);
          }
        }
        xml += `</${tagName}>`;
        return xml;
      }
      
      const rootTag = Object.keys(obj)[0];
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + buildNode(obj[rootTag], rootTag);
    }
  }

  exports.XMLParser = XMLParser;
  exports.XMLBuilder = XMLBuilder;

  window.fastXmlParser = exports;
})();