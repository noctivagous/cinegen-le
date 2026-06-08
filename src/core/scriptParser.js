export class ScriptParser {
  constructor() {
    this._ST = window.ScreenplayTools;
    if (!this._ST) {
      throw new Error('ScreenplayTools library not loaded. Include screenplayTools.min.js.');
    }
  }

  parseFDX(xmlContent) {
    const parser = new this._ST.FDX.FDXParser();
    return parser.parse(xmlContent);
  }

  parseFountain(text) {
    const parser = new this._ST.Fountain.FountainParser();
    parser.addText(text);
    return parser.script;
  }

  scriptToFDX(script) {
    const writer = new this._ST.FDX.FDXWriter();
    return writer.write(script);
  }

  scriptToFountain(script) {
    const writer = new this._ST.Fountain.FountainWriter();
    writer.prettyPrint = true;
    return writer.write(script);
  }

  fountainToHtml(fountainText) {
    const helper = new this._ST.Fountain.FountainFormatHelper();
    return helper.fountainToHtml(fountainText);
  }

  extractEntities(script) {
    const characters = new Map();
    const locations = new Map();
    const scenes = [];
    const props = [];
    const wardrobe = [];

    let lastScene = null;
    let sceneNumber = 0;

    for (const element of script.elements) {
      const type = element.type;
      
      if (type === this._ST.ElementType.HEADING) {
        sceneNumber++;
        const heading = element.text;
        const locMatch = heading.match(/^(?:INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s+(.+?)(?:\s*-\s*.+)?$/i);
        let locationName = locMatch ? locMatch[1].trim() : 'Unknown';
        
        const timeMatch = heading.match(/- (.+)$/);
        const timeOfDay = timeMatch ? timeMatch[1].trim() : '';

        const scene = {
          number: sceneNumber,
          heading,
          location: locationName,
          timeOfDay,
          characters: new Set(),
          props: []
        };
        scenes.push(scene);
        lastScene = scene;

        if (!locations.has(locationName)) {
          locations.set(locationName, {
            name: locationName,
            scenes: [],
            backdrops: 0,
            hasGuide: false,
            readiness: 0
          });
        }
        locations.get(locationName).scenes.push(sceneNumber);

      } else if (type === this._ST.ElementType.CHARACTER) {
        const name = element.name;
        if (name && name !== '') {
          if (!characters.has(name)) {
            characters.set(name, {
              id: characters.size + 1,
              name,
              description: '',
              locked: false,
              lockStrength: 50,
              references: 0,
              readiness: 0
            });
          }
          if (lastScene) {
            lastScene.characters.add(name);
          }
        }
      }
    }

    return {
      characters: Array.from(characters.values()),
      locations: Array.from(locations.values()).map(l => ({
        ...l,
        scenes: l.scenes.join(', ')
      })),
      scenes: scenes.map(s => ({
        number: s.number,
        heading: s.heading,
        location: s.location,
        status: 'needs-breakdown',
        characters: Array.from(s.characters)
      })),
      props,
      wardrobe
    };
  }

  extractDialogue(script) {
    const dialogue = [];
    let currentCharacter = null;

    for (const element of script.elements) {
      const type = element.type;
      if (type === this._ST.ElementType.CHARACTER) {
        currentCharacter = {
          character: element.name,
          extension: element.extension || null,
          lines: []
        };
      } else if (type === this._ST.ElementType.PARENTHETICAL) {
        if (currentCharacter) {
          currentCharacter.parenthetical = element.text;
        }
      } else if (type === this._ST.ElementType.DIALOGUE) {
        if (currentCharacter) {
          currentCharacter.lines.push(element.text);
        }
      } else {
        if (currentCharacter && currentCharacter.lines.length > 0) {
          dialogue.push({ ...currentCharacter, line: currentCharacter.lines.join('\n') });
          currentCharacter = null;
        }
      }
    }

    if (currentCharacter && currentCharacter.lines.length > 0) {
      dialogue.push({ ...currentCharacter, line: currentCharacter.lines.join('\n') });
    }

    return dialogue;
  }
}

export const scriptParser = new ScriptParser();