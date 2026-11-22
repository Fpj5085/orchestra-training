(function () {
  "use strict";

  function makeNumberControls(count, captionPrefix) {
    return Array.from({ length: count }, function (_, index) {
      var value = String(index + 1);
      return {
        id: value,
        label: value,
        value: value,
        caption: captionPrefix + " " + value
      };
    });
  }

  var trombone = {
    id: "trombone",
    displayName: "Trombone",
    localName: "长号",
    pageTitle: "长号识谱训练室",
    clef: "bass",
    clefLabel: "BASS CLEF SCAN",
    transposition: "concert",
    inputType: "slide-position",
    operationName: "把位",
    operationPluralName: "把位",
    controlDeckLabel: "TROMBONE SLIDE POSITIONS",
    controlDeckTitle: "1-7 把位控制台",
    controls: makeNumberControls(7, "Slide"),
    pitchMap: {
      "Bb2": { label: "Bb", staffStep: -2, operations: ["1"] },
      "B2": { label: "B", staffStep: -2, operations: ["2"] },
      "C3": { label: "C", staffStep: -3, operations: ["3", "6"] },
      "Db3": { label: "Db", staffStep: -4, operations: ["4", "5"] },
      "D3": { label: "D", staffStep: -4, operations: ["4"] },
      "Eb3": { label: "Eb", staffStep: -5, operations: ["3"] },
      "E3": { label: "E", staffStep: -5, operations: ["2"] },
      "F3": { label: "F", staffStep: -6, operations: ["1", "6"] },
      "Gb3": { label: "Gb", staffStep: -7, operations: ["5"] },
      "G3": { label: "G", staffStep: -7, operations: ["4"] },
      "Ab3": { label: "Ab", staffStep: -8, operations: ["3"] },
      "A3": { label: "A", staffStep: -8, operations: ["2"] },
      "Bb3": { label: "Bb", staffStep: -9, operations: ["1"] },
      "B3": { label: "B", staffStep: -9, operations: ["2"] },
      "C4": { label: "C", staffStep: -10, operations: ["3"] },
      "Db4": { label: "Db", staffStep: -11, operations: ["4", "5"] },
      "D4": { label: "D", staffStep: -11, operations: ["1", "4"] },
      "Eb4": { label: "Eb", staffStep: -12, operations: ["3"] },
      "E4": { label: "E", staffStep: -12, operations: ["2"] },
      "F4": { label: "F", staffStep: -13, operations: ["1"] }
    },
    sequence: [
      ["Bb3", 0, 1], ["C4", 2, 1], ["D4", 4, 1], ["F4", 6, 1], ["Eb4", 8, 1],
      ["D4", 10, 1], ["C4", 12, 1], ["Bb3", 14, 1], ["D4", 16, 1], ["F4", 18, 1],
      ["E4", 20, 1], ["Eb4", 22, 1], ["D4", 24, 1], ["C4", 26, 1], ["F4", 28, 1]
    ]
  };

  var trumpet = {
    id: "trumpet",
    displayName: "Trumpet",
    localName: "小号",
    pageTitle: "小号识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "written-bb-trumpet-training",
    inputType: "valve-combination",
    operationName: "按键组合",
    operationPluralName: "按键组合",
    controlDeckLabel: "TRUMPET VALVE MATRIX",
    controlDeckTitle: "小号按键组合控制台",
    controls: [
      { id: "open", label: "0", value: "open", caption: "Open" },
      { id: "2", label: "2", value: "2", caption: "Valve 2" },
      { id: "1", label: "1", value: "1", caption: "Valve 1" },
      { id: "12", label: "1+2", value: "12", caption: "Valves 1+2" },
      { id: "23", label: "2+3", value: "23", caption: "Valves 2+3" },
      { id: "13", label: "1+3", value: "13", caption: "Valves 1+3" },
      { id: "123", label: "1+2+3", value: "123", caption: "All valves" }
    ],
    pitchMap: {
      "C4": { label: "C", staffStep: 2, operations: ["open"] },
      "D4": { label: "D", staffStep: 1, operations: ["13"] },
      "E4": { label: "E", staffStep: 0, operations: ["12"] },
      "F4": { label: "F", staffStep: -1, operations: ["1"] },
      "G4": { label: "G", staffStep: -2, operations: ["open"] },
      "A4": { label: "A", staffStep: -3, operations: ["12"] },
      "B4": { label: "B", staffStep: -4, operations: ["2"] },
      "C5": { label: "C", staffStep: -5, operations: ["open"] },
      "D5": { label: "D", staffStep: -6, operations: ["1"] },
      "E5": { label: "E", staffStep: -7, operations: ["open"] },
      "F5": { label: "F", staffStep: -8, operations: ["1"] }
    },
    sequence: [
      ["C4", 0, 1], ["D4", 2, 1], ["E4", 4, 1], ["F4", 6, 1], ["G4", 8, 1],
      ["A4", 10, 1], ["B4", 12, 1], ["C5", 14, 1], ["D5", 16, 1], ["E5", 18, 1],
      ["F5", 20, 1], ["E5", 22, 1], ["D5", 24, 1], ["C5", 26, 1], ["G4", 28, 1]
    ]
  };

  var euphonium = {
    id: "euphonium",
    displayName: "Euphonium",
    localName: "次中音号 / 上低音号",
    pageTitle: "次中音号 / 上低音号识谱训练室",
    clef: "bass",
    clefLabel: "BASS CLEF SCAN",
    transposition: "concert",
    inputType: "valve-combination",
    operationName: "按键组合",
    operationPluralName: "按键组合",
    controlDeckLabel: "EUPHONIUM VALVE MATRIX",
    controlDeckTitle: "次中音号 / 上低音号按键组合控制台",
    controls: [
      { id: "open", label: "0", value: "open", caption: "Open" },
      { id: "2", label: "2", value: "2", caption: "Valve 2" },
      { id: "1", label: "1", value: "1", caption: "Valve 1" },
      { id: "12", label: "1+2", value: "12", caption: "Valves 1+2" },
      { id: "23", label: "2+3", value: "23", caption: "Valves 2+3" },
      { id: "13", label: "1+3", value: "13", caption: "Valves 1+3" },
      { id: "123", label: "1+2+3", value: "123", caption: "All valves" }
    ],
    pitchMap: {
      "Bb2": { label: "Bb", staffStep: -2, operations: ["open"] },
      "B2": { label: "B", staffStep: -2, operations: ["123"] },
      "C3": { label: "C", staffStep: -3, operations: ["13"] },
      "Db3": { label: "Db", staffStep: -4, operations: ["23"] },
      "D3": { label: "D", staffStep: -4, operations: ["12"] },
      "Eb3": { label: "Eb", staffStep: -5, operations: ["1"] },
      "E3": { label: "E", staffStep: -5, operations: ["2"] },
      "F3": { label: "F", staffStep: -6, operations: ["open"] },
      "Gb3": { label: "Gb", staffStep: -7, operations: ["23"] },
      "G3": { label: "G", staffStep: -7, operations: ["12"] },
      "Ab3": { label: "Ab", staffStep: -8, operations: ["1"] },
      "A3": { label: "A", staffStep: -8, operations: ["2"] },
      "Bb3": { label: "Bb", staffStep: -9, operations: ["open"] },
      "B3": { label: "B", staffStep: -9, operations: ["123"] },
      "C4": { label: "C", staffStep: -10, operations: ["13"] },
      "Db4": { label: "Db", staffStep: -11, operations: ["23"] },
      "D4": { label: "D", staffStep: -11, operations: ["12"] },
      "Eb4": { label: "Eb", staffStep: -12, operations: ["1"] },
      "E4": { label: "E", staffStep: -12, operations: ["2"] },
      "F4": { label: "F", staffStep: -13, operations: ["open"] }
    },
    sequence: [
      ["Bb2", 0, 1], ["D3", 2, 1], ["F3", 4, 1], ["Bb3", 6, 1], ["Ab3", 8, 1],
      ["G3", 10, 1], ["F3", 12, 1], ["Eb3", 14, 1], ["F3", 16, 1], ["Bb3", 18, 1],
      ["C4", 20, 1], ["D4", 22, 1], ["Bb3", 24, 1], ["F3", 26, 1], ["Bb2", 28, 1]
    ]
  };

  var euphoniumChallenge = {
    id: "euphoniumChallenge",
    displayName: "Euphonium Challenge",
    localName: "上低音号挑战",
    pageTitle: "上低音号挑战训练室",
    clef: "bass",
    clefLabel: "BASS CLEF CHALLENGE",
    transposition: "concert",
    inputType: "valve-combination",
    operationName: "按键组合",
    operationPluralName: "按键组合",
    controlDeckLabel: "EUPHONIUM CHALLENGE MATRIX",
    controlDeckTitle: "上低音号挑战按键组合控制台",
    controls: euphonium.controls,
    pitchMap: euphonium.pitchMap,
    sequence: [
      ["Bb2", 0, 0.5], ["F3", 1, 0.5], ["C4", 2, 0.5], ["D4", 3, 0.5],
      ["Db4", 4, 0.5], ["B3", 5, 0.5], ["E4", 6, 0.5], ["Ab3", 7, 0.5],
      ["Gb3", 8, 0.5], ["Bb3", 9, 0.5], ["C3", 10, 0.5], ["F4", 11, 0.5],
      ["Eb4", 12, 0.5], ["D3", 13, 0.5], ["A3", 14, 0.5], ["Db3", 15, 0.5],
      ["G3", 16, 0.5], ["B2", 17, 0.5], ["C4", 18, 0.5], ["E3", 19, 0.5],
      ["F3", 20, 0.5], ["Ab3", 21.5, 0.5], ["D4", 23, 0.5], ["Bb3", 24.5, 0.5],
      ["Gb3", 26, 0.5], ["F4", 28, 0.5]
    ],
    sourceNote: "Challenge mode reuses the conservative bass-clef euphonium valve map but increases tempo, interval width and chromatic targets."
  };

  var horn = {
    id: "horn",
    displayName: "Horn in F",
    localName: "圆号",
    pageTitle: "圆号识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "written-f-horn-training",
    inputType: "valve-combination",
    operationName: "按键组合",
    operationPluralName: "按键组合",
    controlDeckLabel: "HORN VALVE MATRIX",
    controlDeckTitle: "圆号按键组合控制台",
    controls: [
      { id: "open", label: "0", value: "open", caption: "Open" },
      { id: "2", label: "2", value: "2", caption: "Valve 2" },
      { id: "1", label: "1", value: "1", caption: "Valve 1" },
      { id: "12", label: "1+2", value: "12", caption: "Valves 1+2" },
      { id: "23", label: "2+3", value: "23", caption: "Valves 2+3" },
      { id: "13", label: "1+3", value: "13", caption: "Valves 1+3" },
      { id: "123", label: "1+2+3", value: "123", caption: "All valves" }
    ],
    pitchMap: {
      "C4": { label: "C", staffStep: 2, operations: ["open"] },
      "D4": { label: "D", staffStep: 1, operations: ["1"] },
      "E4": { label: "E", staffStep: 0, operations: ["open"] },
      "F4": { label: "F", staffStep: -1, operations: ["1"] },
      "G4": { label: "G", staffStep: -2, operations: ["open"] },
      "A4": { label: "A", staffStep: -3, operations: ["12"] },
      "Bb4": { label: "Bb", staffStep: -4, operations: ["1"] },
      "B4": { label: "B", staffStep: -4, operations: ["2"] },
      "C5": { label: "C", staffStep: -5, operations: ["open"] },
      "D5": { label: "D", staffStep: -6, operations: ["1"] },
      "E5": { label: "E", staffStep: -7, operations: ["open"] },
      "F5": { label: "F", staffStep: -8, operations: ["1"] }
    },
    sequence: [
      ["C4", 0, 1], ["D4", 2, 1], ["E4", 4, 1], ["F4", 6, 1], ["G4", 8, 1],
      ["A4", 10, 1], ["Bb4", 12, 1], ["C5", 14, 1], ["D5", 16, 1], ["E5", 18, 1],
      ["F5", 20, 1], ["E5", 22, 1], ["D5", 24, 1], ["C5", 26, 1], ["G4", 28, 1]
    ]
  };

  var tuba = {
    id: "tuba",
    displayName: "Tuba",
    localName: "大号",
    pageTitle: "大号识谱训练室",
    clef: "bass",
    clefLabel: "BASS CLEF SCAN",
    transposition: "concert-bb-tuba-training",
    inputType: "valve-combination",
    operationName: "按键组合",
    operationPluralName: "按键组合",
    controlDeckLabel: "TUBA VALVE MATRIX",
    controlDeckTitle: "大号按键组合控制台",
    controls: [
      { id: "open", label: "0", value: "open", caption: "Open" },
      { id: "2", label: "2", value: "2", caption: "Valve 2" },
      { id: "1", label: "1", value: "1", caption: "Valve 1" },
      { id: "12", label: "1+2", value: "12", caption: "Valves 1+2" },
      { id: "23", label: "2+3", value: "23", caption: "Valves 2+3" },
      { id: "13", label: "1+3", value: "13", caption: "Valves 1+3" },
      { id: "123", label: "1+2+3", value: "123", caption: "All valves" }
    ],
    pitchMap: {
      "Bb1": { label: "Bb", staffStep: 5, operations: ["open"] },
      "C2": { label: "C", staffStep: 4, operations: ["13"] },
      "D2": { label: "D", staffStep: 3, operations: ["12"] },
      "Eb2": { label: "Eb", staffStep: 2, operations: ["1"] },
      "E2": { label: "E", staffStep: 2, operations: ["2"] },
      "F2": { label: "F", staffStep: 1, operations: ["open"] },
      "G2": { label: "G", staffStep: 0, operations: ["12"] },
      "A2": { label: "A", staffStep: -1, operations: ["2"] },
      "Bb2": { label: "Bb", staffStep: -2, operations: ["open"] },
      "C3": { label: "C", staffStep: -3, operations: ["13"] },
      "D3": { label: "D", staffStep: -4, operations: ["12"] },
      "Eb3": { label: "Eb", staffStep: -5, operations: ["1"] },
      "F3": { label: "F", staffStep: -6, operations: ["open"] }
    },
    sequence: [
      ["Bb1", 0, 1], ["F2", 2, 1], ["Bb2", 4, 1], ["C3", 6, 1], ["D3", 8, 1],
      ["Eb3", 10, 1], ["F3", 12, 1], ["Eb3", 14, 1], ["D3", 16, 1], ["C3", 18, 1],
      ["Bb2", 20, 1], ["A2", 22, 1], ["G2", 24, 1], ["F2", 26, 1], ["Bb1", 28, 1]
    ]
  };

  var flute = {
    id: "flute",
    displayName: "Flute",
    localName: "长笛",
    pageTitle: "长笛识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "concert",
    inputType: "woodwind-fingering",
    operationName: "指法组合",
    operationPluralName: "指法组合",
    controlDeckLabel: "FLUTE FINGERING MATRIX",
    controlDeckTitle: "长笛指法组合控制台",
    controls: [
      { id: "T123-123", label: "T123|123", value: "T123-123", caption: "D4" },
      { id: "T123-12-Eb", label: "T123|12-Eb", value: "T123-12-Eb", caption: "E" },
      { id: "T123-1--Eb", label: "T123|1--Eb", value: "T123-1--Eb", caption: "F" },
      { id: "T123----Eb", label: "T123|---Eb", value: "T123----Eb", caption: "G" },
      { id: "T12----Eb", label: "T12-|---Eb", value: "T12----Eb", caption: "A" },
      { id: "B1-----Eb", label: "B 1--|---Eb", value: "B1-----Eb", caption: "B" },
      { id: "1-----Eb", label: "1--|---Eb", value: "1-----Eb", caption: "C" },
      { id: "T-23-123", label: "T-23|123", value: "T-23-123", caption: "D5" }
    ],
    pitchMap: {
      "D4": { label: "D", staffStep: 1, operations: ["T123-123"] },
      "E4": { label: "E", staffStep: 0, operations: ["T123-12-Eb"] },
      "F4": { label: "F", staffStep: -1, operations: ["T123-1--Eb"] },
      "G4": { label: "G", staffStep: -2, operations: ["T123----Eb"] },
      "A4": { label: "A", staffStep: -3, operations: ["T12----Eb"] },
      "B4": { label: "B", staffStep: -4, operations: ["B1-----Eb"] },
      "C5": { label: "C", staffStep: -5, operations: ["1-----Eb"] },
      "D5": { label: "D", staffStep: -6, operations: ["T-23-123"] }
    },
    sequence: [
      ["D4", 0, 1], ["E4", 2, 1], ["F4", 4, 1], ["G4", 6, 1], ["A4", 8, 1],
      ["B4", 10, 1], ["C5", 12, 1], ["D5", 14, 1], ["C5", 16, 1], ["B4", 18, 1],
      ["A4", 20, 1], ["G4", 22, 1], ["F4", 24, 1], ["E4", 26, 1], ["D4", 28, 1]
    ]
  };

  var piccolo = {
    id: "piccolo",
    displayName: "Piccolo",
    localName: "短笛",
    pageTitle: "短笛识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "concert-octave-up-training",
    inputType: "woodwind-fingering",
    operationName: "指法组合",
    operationPluralName: "指法组合",
    controlDeckLabel: "PICCOLO FINGERING MATRIX",
    controlDeckTitle: "短笛指法组合控制台",
    controls: [
      { id: "T123-123", label: "T123|123", value: "T123-123", caption: "D4" },
      { id: "T123-12-Eb", label: "T123|12-Eb", value: "T123-12-Eb", caption: "E" },
      { id: "T123-1--Eb", label: "T123|1--Eb", value: "T123-1--Eb", caption: "F" },
      { id: "T123----Eb", label: "T123|---Eb", value: "T123----Eb", caption: "G" },
      { id: "T12----Eb", label: "T12-|---Eb", value: "T12----Eb", caption: "A" },
      { id: "B1-----Eb", label: "B 1--|---Eb", value: "B1-----Eb", caption: "B" },
      { id: "1-----Eb", label: "1--|---Eb", value: "1-----Eb", caption: "C" },
      { id: "T-23-123", label: "T-23|123", value: "T-23-123", caption: "D5" }
    ],
    pitchMap: {
      "D4": { label: "D", staffStep: 1, operations: ["T123-123"] },
      "E4": { label: "E", staffStep: 0, operations: ["T123-12-Eb"] },
      "F4": { label: "F", staffStep: -1, operations: ["T123-1--Eb"] },
      "G4": { label: "G", staffStep: -2, operations: ["T123----Eb"] },
      "A4": { label: "A", staffStep: -3, operations: ["T12----Eb"] },
      "B4": { label: "B", staffStep: -4, operations: ["B1-----Eb"] },
      "C5": { label: "C", staffStep: -5, operations: ["1-----Eb"] },
      "D5": { label: "D", staffStep: -6, operations: ["T-23-123"] }
    },
    sequence: [
      ["D4", 0, 1], ["F4", 2, 1], ["G4", 4, 1], ["A4", 6, 1], ["B4", 8, 1],
      ["C5", 10, 1], ["D5", 12, 1], ["C5", 14, 1], ["B4", 16, 1], ["A4", 18, 1],
      ["G4", 20, 1], ["F4", 22, 1], ["E4", 24, 1], ["F4", 26, 1], ["D4", 28, 1]
    ]
  };

  var saxophone = {
    id: "saxophone",
    displayName: "Alto Saxophone",
    localName: "萨克斯",
    pageTitle: "萨克斯识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "written-eb-alto-sax-training",
    inputType: "woodwind-fingering",
    operationName: "指法组合",
    operationPluralName: "指法组合",
    controlDeckLabel: "SAXOPHONE FINGERING MATRIX",
    controlDeckTitle: "萨克斯指法组合控制台",
    controls: [
      { id: "123-123", label: "123|123", value: "123-123", caption: "D" },
      { id: "123-12-", label: "123|12-", value: "123-12-", caption: "E" },
      { id: "123-1--", label: "123|1--", value: "123-1--", caption: "F" },
      { id: "123----", label: "123|---", value: "123----", caption: "G" },
      { id: "12-----", label: "12-|---", value: "12-----", caption: "A" },
      { id: "1------", label: "1--|---", value: "1------", caption: "B" },
      { id: "-2-----", label: "-2-|---", value: "-2-----", caption: "C" },
      { id: "oct-123-123", label: "O+123|123", value: "oct-123-123", caption: "D5" }
    ],
    pitchMap: {
      "D4": { label: "D", staffStep: 1, operations: ["123-123"] },
      "E4": { label: "E", staffStep: 0, operations: ["123-12-"] },
      "F4": { label: "F", staffStep: -1, operations: ["123-1--"] },
      "G4": { label: "G", staffStep: -2, operations: ["123----"] },
      "A4": { label: "A", staffStep: -3, operations: ["12-----"] },
      "B4": { label: "B", staffStep: -4, operations: ["1------"] },
      "C5": { label: "C", staffStep: -5, operations: ["-2-----"] },
      "D5": { label: "D", staffStep: -6, operations: ["oct-123-123"] }
    },
    sequence: [
      ["D4", 0, 1], ["E4", 2, 1], ["F4", 4, 1], ["G4", 6, 1], ["A4", 8, 1],
      ["B4", 10, 1], ["C5", 12, 1], ["D5", 14, 1], ["C5", 16, 1], ["B4", 18, 1],
      ["A4", 20, 1], ["G4", 22, 1], ["F4", 24, 1], ["E4", 26, 1], ["D4", 28, 1]
    ]
  };

  var sopranoSaxophone = {
    id: "sopranoSaxophone",
    displayName: "Soprano Saxophone",
    localName: "高音萨克斯",
    pageTitle: "高音萨克斯识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "written-bb-soprano-sax-training",
    inputType: "woodwind-fingering",
    operationName: "指法组合",
    operationPluralName: "指法组合",
    controlDeckLabel: "SOPRANO SAX FINGERING MATRIX",
    controlDeckTitle: "高音萨克斯指法组合控制台",
    controls: [
      { id: "123-123", label: "123|123", value: "123-123", caption: "D" },
      { id: "123-12-", label: "123|12-", value: "123-12-", caption: "E" },
      { id: "123-1--", label: "123|1--", value: "123-1--", caption: "F" },
      { id: "123----", label: "123|---", value: "123----", caption: "G" },
      { id: "12-----", label: "12-|---", value: "12-----", caption: "A" },
      { id: "1------", label: "1--|---", value: "1------", caption: "B" },
      { id: "-2-----", label: "-2-|---", value: "-2-----", caption: "C" },
      { id: "oct-123-123", label: "O+123|123", value: "oct-123-123", caption: "D5" }
    ],
    pitchMap: {
      "D4": { label: "D", staffStep: 1, operations: ["123-123"] },
      "E4": { label: "E", staffStep: 0, operations: ["123-12-"] },
      "F4": { label: "F", staffStep: -1, operations: ["123-1--"] },
      "G4": { label: "G", staffStep: -2, operations: ["123----"] },
      "A4": { label: "A", staffStep: -3, operations: ["12-----"] },
      "B4": { label: "B", staffStep: -4, operations: ["1------"] },
      "C5": { label: "C", staffStep: -5, operations: ["-2-----"] },
      "D5": { label: "D", staffStep: -6, operations: ["oct-123-123"] }
    },
    sequence: [
      ["G4", 0, 1], ["A4", 2, 1], ["B4", 4, 1], ["C5", 6, 1], ["D5", 8, 1],
      ["C5", 10, 1], ["B4", 12, 1], ["A4", 14, 1], ["G4", 16, 1], ["F4", 18, 1],
      ["E4", 20, 1], ["D4", 22, 1], ["F4", 24, 1], ["A4", 26, 1], ["G4", 28, 1]
    ]
  };

  var clarinet = {
    id: "clarinet",
    displayName: "Clarinet",
    localName: "单簧管",
    pageTitle: "单簧管识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "written-bb-clarinet-training",
    inputType: "woodwind-fingering",
    operationName: "指法组合",
    operationPluralName: "指法组合",
    controlDeckLabel: "CLARINET FINGERING MATRIX",
    controlDeckTitle: "单簧管 Boehm-system 基础指法控制台",
    controls: [
      { id: "T123-123-E", label: "T123|123+E", value: "T123-123-E", caption: "E" },
      { id: "T123-123", label: "T123|123", value: "T123-123", caption: "F" },
      { id: "T123-12-", label: "T123|12-", value: "T123-12-", caption: "G" },
      { id: "T123-1--", label: "T123|1--", value: "T123-1--", caption: "A" },
      { id: "T123----", label: "T123|---", value: "T123----", caption: "B" },
      { id: "T12-----", label: "T12-|---", value: "T12-----", caption: "C" },
      { id: "T1------", label: "T1--|---", value: "T1------", caption: "D" },
      { id: "T-------", label: "T---|---", value: "T-------", caption: "E" },
      { id: "open", label: "OPEN", value: "open", caption: "G" },
      { id: "A-key", label: "A KEY", value: "A-key", caption: "A" },
      { id: "T1-reg", label: "R+T1", value: "T1-reg", caption: "B" },
      { id: "T12-reg", label: "R+T12", value: "T12-reg", caption: "C" }
    ],
    pitchMap: {
      "E3": { label: "E", staffStep: 7, operations: ["T123-123-E"] },
      "F3": { label: "F", staffStep: 6, operations: ["T123-123"] },
      "G3": { label: "G", staffStep: 5, operations: ["T123-12-"] },
      "A3": { label: "A", staffStep: 4, operations: ["T123-1--"] },
      "B3": { label: "B", staffStep: 3, operations: ["T123----"] },
      "C4": { label: "C", staffStep: 2, operations: ["T12-----"] },
      "D4": { label: "D", staffStep: 1, operations: ["T1------"] },
      "E4": { label: "E", staffStep: 0, operations: ["T-------"] },
      "G4": { label: "G", staffStep: -2, operations: ["open"] },
      "A4": { label: "A", staffStep: -3, operations: ["A-key"] },
      "B4": { label: "B", staffStep: -4, operations: ["T1-reg"] },
      "C5": { label: "C", staffStep: -5, operations: ["T12-reg"] }
    },
    sequence: [
      ["E3", 0, 1], ["F3", 2, 1], ["G3", 4, 1], ["A3", 6, 1], ["B3", 8, 1],
      ["C4", 10, 1], ["D4", 12, 1], ["E4", 14, 1], ["G4", 16, 1], ["A4", 18, 1],
      ["B4", 20, 1], ["C5", 22, 1], ["A4", 24, 1], ["G4", 26, 1], ["E4", 28, 1]
    ],
    sourceNote: "Conservative Boehm-system clarinet MVP. Written pitch training uses low-register stepwise patterns plus basic throat/register notes; advanced alternate fingerings are intentionally out of scope."
  };

  var bassoon = {
    id: "bassoon",
    displayName: "Bassoon",
    localName: "大管",
    pageTitle: "大管识谱训练室",
    clef: "bass",
    clefLabel: "BASS CLEF SCAN",
    transposition: "concert",
    inputType: "woodwind-fingering",
    operationName: "指法组合",
    operationPluralName: "指法组合",
    controlDeckLabel: "BASSOON FINGERING MATRIX",
    controlDeckTitle: "大管 Heckel-system 基础指法控制台",
    controls: [
      { id: "CD123-E123F", label: "C D 123|E 123 F", value: "CD123-E123F", caption: "C2" },
      { id: "D123-E123F", label: "D 123|E 123 F", value: "D123-E123F", caption: "D2" },
      { id: "W123-E123F", label: "W 123|E 123 F", value: "W123-E123F", caption: "E2" },
      { id: "W123-123F", label: "W 123|123 F", value: "W123-123F", caption: "F2" },
      { id: "W123-123", label: "W 123|123", value: "W123-123", caption: "G2" },
      { id: "W123-12-", label: "W 123|12-", value: "W123-12-", caption: "A2" },
      { id: "W123-1--", label: "W 123|1--", value: "W123-1--", caption: "B2" },
      { id: "W123----", label: "W 123|---", value: "W123----", caption: "C3" },
      { id: "W12-----", label: "W 12-|---", value: "W12-----", caption: "D3" },
      { id: "W1------", label: "W 1--|---", value: "W1------", caption: "E3" },
      { id: "W-------", label: "W ---|---", value: "W-------", caption: "F3" }
    ],
    pitchMap: {
      "C2": { label: "C", staffStep: 4, operations: ["CD123-E123F"] },
      "D2": { label: "D", staffStep: 3, operations: ["D123-E123F"] },
      "E2": { label: "E", staffStep: 2, operations: ["W123-E123F"] },
      "F2": { label: "F", staffStep: 1, operations: ["W123-123F"] },
      "G2": { label: "G", staffStep: 0, operations: ["W123-123"] },
      "A2": { label: "A", staffStep: -1, operations: ["W123-12-"] },
      "B2": { label: "B", staffStep: -2, operations: ["W123-1--"] },
      "C3": { label: "C", staffStep: -3, operations: ["W123----"] },
      "D3": { label: "D", staffStep: -4, operations: ["W12-----"] },
      "E3": { label: "E", staffStep: -5, operations: ["W1------"] },
      "F3": { label: "F", staffStep: -6, operations: ["W-------"] }
    },
    sequence: [
      ["C2", 0, 1], ["D2", 2, 1], ["E2", 4, 1], ["F2", 6, 1], ["G2", 8, 1],
      ["A2", 10, 1], ["B2", 12, 1], ["C3", 14, 1], ["D3", 16, 1], ["E3", 18, 1],
      ["F3", 20, 1], ["E3", 22, 1], ["D3", 24, 1], ["C3", 26, 1], ["G2", 28, 1]
    ],
    sourceNote: "Heckel-system beginner range based on Woodwind Fingering Guide basic bassoon chart."
  };

  var violin = {
    id: "violin",
    displayName: "Violin",
    localName: "小提琴",
    pageTitle: "小提琴识谱训练室",
    clef: "treble",
    clefLabel: "TREBLE CLEF SCAN",
    transposition: "concert",
    inputType: "string-fingering",
    operationName: "弦位指法",
    operationPluralName: "弦位指法",
    controlDeckLabel: "VIOLIN FIRST POSITION MATRIX",
    controlDeckTitle: "小提琴一把位两段式控制台",
    compoundInput: {
      mode: "string-finger",
      groups: [
        {
          id: "string",
          label: "STRING",
          options: [
            { id: "G", label: "G弦", value: "G", caption: "最低弦" },
            { id: "D", label: "D弦", value: "D", caption: "中低弦" },
            { id: "A", label: "A弦", value: "A", caption: "中高弦" },
            { id: "E", label: "E弦", value: "E", caption: "最高弦" }
          ]
        },
        {
          id: "finger",
          label: "FINGER",
          options: [
            { id: "0", label: "0", value: "0", caption: "开放弦" },
            { id: "1", label: "1", value: "1", caption: "1指" },
            { id: "2L", label: "低2", value: "2L", caption: "低2指" },
            { id: "2", label: "2", value: "2", caption: "2指" },
            { id: "3", label: "3", value: "3", caption: "3指" }
          ]
        }
      ]
    },
    controls: [
      { id: "G0", label: "G0", value: "G0", caption: "G弦 开放" },
      { id: "G1", label: "G1", value: "G1", caption: "G弦 1指" },
      { id: "G2", label: "G2", value: "G2", caption: "G弦 2指" },
      { id: "G3", label: "G3", value: "G3", caption: "G弦 3指" },
      { id: "D0", label: "D0", value: "D0", caption: "D弦 开放" },
      { id: "D1", label: "D1", value: "D1", caption: "D弦 1指" },
      { id: "D2L", label: "D2L", value: "D2L", caption: "D弦 低2指" },
      { id: "D3", label: "D3", value: "D3", caption: "D弦 3指" },
      { id: "A0", label: "A0", value: "A0", caption: "A弦 开放" },
      { id: "A1", label: "A1", value: "A1", caption: "A弦 1指" },
      { id: "A2L", label: "A2L", value: "A2L", caption: "A弦 低2指" },
      { id: "A3", label: "A3", value: "A3", caption: "A弦 3指" },
      { id: "E0", label: "E0", value: "E0", caption: "E弦 开放" },
      { id: "E1L", label: "E1L", value: "E1L", caption: "E弦 低1指" },
      { id: "E2L", label: "E2L", value: "E2L", caption: "E弦 低2指" },
      { id: "E3", label: "E3", value: "E3", caption: "E弦 3指" }
    ],
    pitchMap: {
      "G3": { label: "G", staffStep: 5, operations: ["G0"] },
      "A3": { label: "A", staffStep: 4, operations: ["G1"] },
      "B3": { label: "B", staffStep: 3, operations: ["G2"] },
      "C4": { label: "C", staffStep: 2, operations: ["G3"] },
      "D4": { label: "D", staffStep: 1, operations: ["D0"] },
      "E4": { label: "E", staffStep: 0, operations: ["D1"] },
      "F4": { label: "F", staffStep: -1, operations: ["D2L"] },
      "G4": { label: "G", staffStep: -2, operations: ["D3"] },
      "A4": { label: "A", staffStep: -3, operations: ["A0"] },
      "B4": { label: "B", staffStep: -4, operations: ["A1"] },
      "C5": { label: "C", staffStep: -5, operations: ["A2L"] },
      "D5": { label: "D", staffStep: -6, operations: ["A3"] },
      "E5": { label: "E", staffStep: -7, operations: ["E0"] },
      "F5": { label: "F", staffStep: -8, operations: ["E1L"] },
      "G5": { label: "G", staffStep: -9, operations: ["E2L"] },
      "A5": { label: "A", staffStep: -10, operations: ["E3"] }
    },
    sequence: [
      ["G3", 0, 1], ["A3", 2, 1], ["B3", 4, 1], ["C4", 6, 1], ["D4", 8, 1],
      ["E4", 10, 1], ["F4", 12, 1], ["G4", 14, 1], ["A4", 16, 1], ["B4", 18, 1],
      ["C5", 20, 1], ["D5", 22, 1], ["E5", 24, 1], ["F5", 26, 1], ["G5", 28, 1]
    ],
    sourceNote: "Conservative violin first-position C major MVP: open strings plus 1, low-2 and 3 finger positions."
  };

  function makeStringControls(definitions) {
    return definitions.map(function (definition) {
      return {
        id: definition[0],
        label: definition[1],
        value: definition[0],
        caption: definition[2]
      };
    });
  }

  function makeViolinStringModel(config) {
    return {
      id: config.id,
      displayName: config.displayName,
      localName: config.localName,
      pageTitle: config.pageTitle,
      clef: "treble",
      clefLabel: "TREBLE CLEF SCAN",
      transposition: "concert",
      inputType: "string-fingering-single",
      operationName: "指位",
      operationPluralName: "指位",
      controlDeckLabel: config.controlDeckLabel,
      controlDeckTitle: config.controlDeckTitle,
      controls: makeStringControls(config.controls),
      pitchMap: config.pitchMap,
      sequence: config.sequence,
      sourceNote: config.sourceNote
    };
  }

  var violinG = makeViolinStringModel({
    id: "violinG",
    displayName: "Violin G String",
    localName: "小提琴 G 弦",
    pageTitle: "小提琴 G 弦识谱训练室",
    controlDeckLabel: "VIOLIN G STRING",
    controlDeckTitle: "小提琴 G 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2", "2", "2指"], ["3", "3", "3指"]],
    pitchMap: {
      "G3": { label: "G", staffStep: 5, operations: ["0"] },
      "A3": { label: "A", staffStep: 4, operations: ["1"] },
      "B3": { label: "B", staffStep: 3, operations: ["2"] },
      "C4": { label: "C", staffStep: 2, operations: ["3"] }
    },
    sequence: [
      ["G3", 0, 1], ["A3", 2, 1], ["B3", 4, 1], ["C4", 6, 1], ["B3", 8, 1],
      ["A3", 10, 1], ["G3", 12, 1], ["B3", 14, 1], ["C4", 16, 1], ["A3", 18, 1],
      ["G3", 20, 1], ["A3", 22, 1], ["B3", 24, 1], ["C4", 26, 1], ["G3", 28, 1]
    ],
    sourceNote: "Violin first-position C major on G string: G open, A 1, B 2, C 3."
  });

  var violinD = makeViolinStringModel({
    id: "violinD",
    displayName: "Violin D String",
    localName: "小提琴 D 弦",
    pageTitle: "小提琴 D 弦识谱训练室",
    controlDeckLabel: "VIOLIN D STRING",
    controlDeckTitle: "小提琴 D 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2L", "低2", "低2指"], ["3", "3", "3指"]],
    pitchMap: {
      "D4": { label: "D", staffStep: 1, operations: ["0"] },
      "E4": { label: "E", staffStep: 0, operations: ["1"] },
      "F4": { label: "F", staffStep: -1, operations: ["2L"] },
      "G4": { label: "G", staffStep: -2, operations: ["3"] }
    },
    sequence: [
      ["D4", 0, 1], ["E4", 2, 1], ["F4", 4, 1], ["G4", 6, 1], ["F4", 8, 1],
      ["E4", 10, 1], ["D4", 12, 1], ["F4", 14, 1], ["G4", 16, 1], ["E4", 18, 1],
      ["D4", 20, 1], ["E4", 22, 1], ["F4", 24, 1], ["G4", 26, 1], ["D4", 28, 1]
    ],
    sourceNote: "Violin first-position C major on D string: D open, E 1, F low-2, G 3."
  });

  var violinA = makeViolinStringModel({
    id: "violinA",
    displayName: "Violin A String",
    localName: "小提琴 A 弦",
    pageTitle: "小提琴 A 弦识谱训练室",
    controlDeckLabel: "VIOLIN A STRING",
    controlDeckTitle: "小提琴 A 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2L", "低2", "低2指"], ["3", "3", "3指"]],
    pitchMap: {
      "A4": { label: "A", staffStep: -3, operations: ["0"] },
      "B4": { label: "B", staffStep: -4, operations: ["1"] },
      "C5": { label: "C", staffStep: -5, operations: ["2L"] },
      "D5": { label: "D", staffStep: -6, operations: ["3"] }
    },
    sequence: [
      ["A4", 0, 1], ["B4", 2, 1], ["C5", 4, 1], ["D5", 6, 1], ["C5", 8, 1],
      ["B4", 10, 1], ["A4", 12, 1], ["C5", 14, 1], ["D5", 16, 1], ["B4", 18, 1],
      ["A4", 20, 1], ["B4", 22, 1], ["C5", 24, 1], ["D5", 26, 1], ["A4", 28, 1]
    ],
    sourceNote: "Violin first-position C major on A string: A open, B 1, C low-2, D 3."
  });

  var violinE = makeViolinStringModel({
    id: "violinE",
    displayName: "Violin E String",
    localName: "小提琴 E 弦",
    pageTitle: "小提琴 E 弦识谱训练室",
    controlDeckLabel: "VIOLIN E STRING",
    controlDeckTitle: "小提琴 E 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1L", "低1", "低1指"], ["2L", "低2", "低2指"], ["3", "3", "3指"]],
    pitchMap: {
      "E5": { label: "E", staffStep: -7, operations: ["0"] },
      "F5": { label: "F", staffStep: -8, operations: ["1L"] },
      "G5": { label: "G", staffStep: -9, operations: ["2L"] },
      "A5": { label: "A", staffStep: -10, operations: ["3"] }
    },
    sequence: [
      ["E5", 0, 1], ["F5", 2, 1], ["G5", 4, 1], ["A5", 6, 1], ["G5", 8, 1],
      ["F5", 10, 1], ["E5", 12, 1], ["G5", 14, 1], ["A5", 16, 1], ["F5", 18, 1],
      ["E5", 20, 1], ["F5", 22, 1], ["G5", 24, 1], ["A5", 26, 1], ["E5", 28, 1]
    ],
    sourceNote: "Violin first-position C major on E string: E open, F low-1, G low-2, A 3."
  });

  function makeCelloStringModel(config) {
    return {
      id: config.id,
      displayName: config.displayName,
      localName: config.localName,
      pageTitle: config.pageTitle,
      clef: "bass",
      clefLabel: "BASS CLEF SCAN",
      transposition: "concert",
      inputType: "string-fingering-single",
      operationName: "指位",
      operationPluralName: "指位",
      controlDeckLabel: config.controlDeckLabel,
      controlDeckTitle: config.controlDeckTitle,
      controls: makeStringControls(config.controls),
      pitchMap: config.pitchMap,
      sequence: config.sequence,
      sourceNote: config.sourceNote
    };
  }

  var celloC = makeCelloStringModel({
    id: "celloC",
    displayName: "Cello C String",
    localName: "大提琴 C 弦",
    pageTitle: "大提琴 C 弦识谱训练室",
    controlDeckLabel: "CELLO C STRING",
    controlDeckTitle: "大提琴 C 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["3", "3", "3指"], ["4", "4", "4指"]],
    pitchMap: {
      "C2": { label: "C", staffStep: 4, operations: ["0"] },
      "D2": { label: "D", staffStep: 3, operations: ["1"] },
      "E2": { label: "E", staffStep: 2, operations: ["3"] },
      "F2": { label: "F", staffStep: 1, operations: ["4"] }
    },
    sequence: [
      ["C2", 0, 1], ["D2", 2, 1], ["E2", 4, 1], ["F2", 6, 1], ["E2", 8, 1],
      ["D2", 10, 1], ["C2", 12, 1], ["E2", 14, 1], ["F2", 16, 1], ["D2", 18, 1],
      ["C2", 20, 1], ["D2", 22, 1], ["E2", 24, 1], ["F2", 26, 1], ["C2", 28, 1]
    ],
    sourceNote: "Cello first-position C major on C string: C open, D 1, E 3, F 4."
  });

  var celloG = makeCelloStringModel({
    id: "celloG",
    displayName: "Cello G String",
    localName: "大提琴 G 弦",
    pageTitle: "大提琴 G 弦识谱训练室",
    controlDeckLabel: "CELLO G STRING",
    controlDeckTitle: "大提琴 G 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["3", "3", "3指"], ["4", "4", "4指"]],
    pitchMap: {
      "G2": { label: "G", staffStep: 0, operations: ["0"] },
      "A2": { label: "A", staffStep: -1, operations: ["1"] },
      "B2": { label: "B", staffStep: -2, operations: ["3"] },
      "C3": { label: "C", staffStep: -3, operations: ["4"] }
    },
    sequence: [
      ["G2", 0, 1], ["A2", 2, 1], ["B2", 4, 1], ["C3", 6, 1], ["B2", 8, 1],
      ["A2", 10, 1], ["G2", 12, 1], ["B2", 14, 1], ["C3", 16, 1], ["A2", 18, 1],
      ["G2", 20, 1], ["A2", 22, 1], ["B2", 24, 1], ["C3", 26, 1], ["G2", 28, 1]
    ],
    sourceNote: "Cello first-position C major on G string: G open, A 1, B 3, C 4."
  });

  var celloD = makeCelloStringModel({
    id: "celloD",
    displayName: "Cello D String",
    localName: "大提琴 D 弦",
    pageTitle: "大提琴 D 弦识谱训练室",
    controlDeckLabel: "CELLO D STRING",
    controlDeckTitle: "大提琴 D 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2", "2", "2指"], ["4", "4", "4指"]],
    pitchMap: {
      "D3": { label: "D", staffStep: -4, operations: ["0"] },
      "E3": { label: "E", staffStep: -5, operations: ["1"] },
      "F3": { label: "F", staffStep: -6, operations: ["2"] },
      "G3": { label: "G", staffStep: -7, operations: ["4"] }
    },
    sequence: [
      ["D3", 0, 1], ["E3", 2, 1], ["F3", 4, 1], ["G3", 6, 1], ["F3", 8, 1],
      ["E3", 10, 1], ["D3", 12, 1], ["F3", 14, 1], ["G3", 16, 1], ["E3", 18, 1],
      ["D3", 20, 1], ["E3", 22, 1], ["F3", 24, 1], ["G3", 26, 1], ["D3", 28, 1]
    ],
    sourceNote: "Cello first-position C major on D string: D open, E 1, F 2, G 4."
  });

  var celloA = makeCelloStringModel({
    id: "celloA",
    displayName: "Cello A String",
    localName: "大提琴 A 弦",
    pageTitle: "大提琴 A 弦识谱训练室",
    controlDeckLabel: "CELLO A STRING",
    controlDeckTitle: "大提琴 A 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2", "2", "2指"], ["4", "4", "4指"]],
    pitchMap: {
      "A3": { label: "A", staffStep: -8, operations: ["0"] },
      "B3": { label: "B", staffStep: -9, operations: ["1"] },
      "C4": { label: "C", staffStep: -10, operations: ["2"] },
      "D4": { label: "D", staffStep: -11, operations: ["4"] }
    },
    sequence: [
      ["A3", 0, 1], ["B3", 2, 1], ["C4", 4, 1], ["D4", 6, 1], ["C4", 8, 1],
      ["B3", 10, 1], ["A3", 12, 1], ["C4", 14, 1], ["D4", 16, 1], ["B3", 18, 1],
      ["A3", 20, 1], ["B3", 22, 1], ["C4", 24, 1], ["D4", 26, 1], ["A3", 28, 1]
    ],
    sourceNote: "Cello first-position C major on A string: A open, B 1, C 2, D 4."
  });

  function makeViolaStringModel(config) {
    return {
      id: config.id,
      displayName: config.displayName,
      localName: config.localName,
      pageTitle: config.pageTitle,
      clef: "alto",
      clefLabel: "ALTO CLEF SCAN",
      transposition: "concert",
      inputType: "string-fingering-single",
      operationName: "指位",
      operationPluralName: "指位",
      controlDeckLabel: config.controlDeckLabel,
      controlDeckTitle: config.controlDeckTitle,
      controls: makeStringControls(config.controls),
      pitchMap: config.pitchMap,
      sequence: config.sequence,
      sourceNote: config.sourceNote
    };
  }

  var violaC = makeViolaStringModel({
    id: "violaC",
    displayName: "Viola C String",
    localName: "中提琴 C 弦",
    pageTitle: "中提琴 C 弦识谱训练室",
    controlDeckLabel: "VIOLA C STRING",
    controlDeckTitle: "中提琴 C 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2", "2", "2指"], ["3", "3", "3指"]],
    pitchMap: {
      "C3": { label: "C", staffStep: 3, operations: ["0"] },
      "D3": { label: "D", staffStep: 2, operations: ["1"] },
      "E3": { label: "E", staffStep: 1, operations: ["2"] },
      "F3": { label: "F", staffStep: 0, operations: ["3"] }
    },
    sequence: [
      ["C3", 0, 1], ["D3", 2, 1], ["E3", 4, 1], ["F3", 6, 1], ["E3", 8, 1],
      ["D3", 10, 1], ["C3", 12, 1], ["E3", 14, 1], ["F3", 16, 1], ["D3", 18, 1],
      ["C3", 20, 1], ["D3", 22, 1], ["E3", 24, 1], ["F3", 26, 1], ["C3", 28, 1]
    ],
    sourceNote: "Viola first-position C major on C string: C open, D 1, E 2, F 3."
  });

  var violaG = makeViolaStringModel({
    id: "violaG",
    displayName: "Viola G String",
    localName: "中提琴 G 弦",
    pageTitle: "中提琴 G 弦识谱训练室",
    controlDeckLabel: "VIOLA G STRING",
    controlDeckTitle: "中提琴 G 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2", "2", "2指"], ["3", "3", "3指"]],
    pitchMap: {
      "G3": { label: "G", staffStep: -1, operations: ["0"] },
      "A3": { label: "A", staffStep: -2, operations: ["1"] },
      "B3": { label: "B", staffStep: -3, operations: ["2"] },
      "C4": { label: "C", staffStep: -4, operations: ["3"] }
    },
    sequence: [
      ["G3", 0, 1], ["A3", 2, 1], ["B3", 4, 1], ["C4", 6, 1], ["B3", 8, 1],
      ["A3", 10, 1], ["G3", 12, 1], ["B3", 14, 1], ["C4", 16, 1], ["A3", 18, 1],
      ["G3", 20, 1], ["A3", 22, 1], ["B3", 24, 1], ["C4", 26, 1], ["G3", 28, 1]
    ],
    sourceNote: "Viola first-position C major on G string: G open, A 1, B 2, C 3."
  });

  var violaD = makeViolaStringModel({
    id: "violaD",
    displayName: "Viola D String",
    localName: "中提琴 D 弦",
    pageTitle: "中提琴 D 弦识谱训练室",
    controlDeckLabel: "VIOLA D STRING",
    controlDeckTitle: "中提琴 D 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2L", "低2", "低2指"], ["3", "3", "3指"]],
    pitchMap: {
      "D4": { label: "D", staffStep: -5, operations: ["0"] },
      "E4": { label: "E", staffStep: -6, operations: ["1"] },
      "F4": { label: "F", staffStep: -7, operations: ["2L"] },
      "G4": { label: "G", staffStep: -8, operations: ["3"] }
    },
    sequence: [
      ["D4", 0, 1], ["E4", 2, 1], ["F4", 4, 1], ["G4", 6, 1], ["F4", 8, 1],
      ["E4", 10, 1], ["D4", 12, 1], ["F4", 14, 1], ["G4", 16, 1], ["E4", 18, 1],
      ["D4", 20, 1], ["E4", 22, 1], ["F4", 24, 1], ["G4", 26, 1], ["D4", 28, 1]
    ],
    sourceNote: "Viola first-position C major on D string: D open, E 1, F low-2, G 3."
  });

  var violaA = makeViolaStringModel({
    id: "violaA",
    displayName: "Viola A String",
    localName: "中提琴 A 弦",
    pageTitle: "中提琴 A 弦识谱训练室",
    controlDeckLabel: "VIOLA A STRING",
    controlDeckTitle: "中提琴 A 弦一把位指位控制台",
    controls: [["0", "0", "开放弦"], ["1", "1", "1指"], ["2L", "低2", "低2指"], ["3", "3", "3指"]],
    pitchMap: {
      "A4": { label: "A", staffStep: -9, operations: ["0"] },
      "B4": { label: "B", staffStep: -10, operations: ["1"] },
      "C5": { label: "C", staffStep: -11, operations: ["2L"] },
      "D5": { label: "D", staffStep: -12, operations: ["3"] }
    },
    sequence: [
      ["A4", 0, 1], ["B4", 2, 1], ["C5", 4, 1], ["D5", 6, 1], ["C5", 8, 1],
      ["B4", 10, 1], ["A4", 12, 1], ["C5", 14, 1], ["D5", 16, 1], ["B4", 18, 1],
      ["A4", 20, 1], ["B4", 22, 1], ["C5", 24, 1], ["D5", 26, 1], ["A4", 28, 1]
    ],
    sourceNote: "Viola first-position C major on A string: A open, B 1, C low-2, D 3."
  });

  function makeDoubleBassStringModel(config) {
    return {
      id: config.id,
      displayName: config.displayName,
      localName: config.localName,
      pageTitle: config.pageTitle,
      clef: "bass",
      clefLabel: "BASS CLEF SCAN",
      transposition: "written-octave-up-double-bass-training",
      inputType: "string-fingering-single",
      operationName: "指位",
      operationPluralName: "指位",
      controlDeckLabel: config.controlDeckLabel,
      controlDeckTitle: config.controlDeckTitle,
      controls: makeStringControls([["0", "0", "开放弦"], ["1", "1", "1指"], ["2", "2", "2指"], ["4", "4", "4指"]]),
      pitchMap: config.pitchMap,
      sequence: config.sequence,
      sourceNote: config.sourceNote
    };
  }

  var doubleBassE = makeDoubleBassStringModel({
    id: "doubleBassE",
    displayName: "Double Bass E String",
    localName: "低音提琴 E 弦",
    pageTitle: "低音提琴 E 弦识谱训练室",
    controlDeckLabel: "DOUBLE BASS E STRING",
    controlDeckTitle: "低音提琴 E 弦半把位指位控制台",
    pitchMap: {
      "E2": { label: "E", staffStep: 2, operations: ["0"] },
      "F2": { label: "F", staffStep: 1, operations: ["1"] },
      "F#2": { label: "F#", staffStep: 1, operations: ["2"] },
      "G2": { label: "G", staffStep: 0, operations: ["4"] }
    },
    sequence: [
      ["E2", 0, 1], ["F2", 2, 1], ["F#2", 4, 1], ["G2", 6, 1], ["F#2", 8, 1],
      ["F2", 10, 1], ["E2", 12, 1], ["F#2", 14, 1], ["G2", 16, 1], ["F2", 18, 1],
      ["E2", 20, 1], ["F2", 22, 1], ["F#2", 24, 1], ["G2", 26, 1], ["E2", 28, 1]
    ],
    sourceNote: "Double bass written-pitch half position on E string: E open, F 1, F# 2, G 4."
  });

  var doubleBassA = makeDoubleBassStringModel({
    id: "doubleBassA",
    displayName: "Double Bass A String",
    localName: "低音提琴 A 弦",
    pageTitle: "低音提琴 A 弦识谱训练室",
    controlDeckLabel: "DOUBLE BASS A STRING",
    controlDeckTitle: "低音提琴 A 弦半把位指位控制台",
    pitchMap: {
      "A2": { label: "A", staffStep: -1, operations: ["0"] },
      "Bb2": { label: "Bb", staffStep: -2, operations: ["1"] },
      "B2": { label: "B", staffStep: -2, operations: ["2"] },
      "C3": { label: "C", staffStep: -3, operations: ["4"] }
    },
    sequence: [
      ["A2", 0, 1], ["Bb2", 2, 1], ["B2", 4, 1], ["C3", 6, 1], ["B2", 8, 1],
      ["Bb2", 10, 1], ["A2", 12, 1], ["B2", 14, 1], ["C3", 16, 1], ["Bb2", 18, 1],
      ["A2", 20, 1], ["Bb2", 22, 1], ["B2", 24, 1], ["C3", 26, 1], ["A2", 28, 1]
    ],
    sourceNote: "Double bass written-pitch half position on A string: A open, Bb 1, B 2, C 4."
  });

  var doubleBassD = makeDoubleBassStringModel({
    id: "doubleBassD",
    displayName: "Double Bass D String",
    localName: "低音提琴 D 弦",
    pageTitle: "低音提琴 D 弦识谱训练室",
    controlDeckLabel: "DOUBLE BASS D STRING",
    controlDeckTitle: "低音提琴 D 弦半把位指位控制台",
    pitchMap: {
      "D3": { label: "D", staffStep: -4, operations: ["0"] },
      "Eb3": { label: "Eb", staffStep: -5, operations: ["1"] },
      "E3": { label: "E", staffStep: -5, operations: ["2"] },
      "F3": { label: "F", staffStep: -6, operations: ["4"] }
    },
    sequence: [
      ["D3", 0, 1], ["Eb3", 2, 1], ["E3", 4, 1], ["F3", 6, 1], ["E3", 8, 1],
      ["Eb3", 10, 1], ["D3", 12, 1], ["E3", 14, 1], ["F3", 16, 1], ["Eb3", 18, 1],
      ["D3", 20, 1], ["Eb3", 22, 1], ["E3", 24, 1], ["F3", 26, 1], ["D3", 28, 1]
    ],
    sourceNote: "Double bass written-pitch half position on D string: D open, Eb 1, E 2, F 4."
  });

  var doubleBassG = makeDoubleBassStringModel({
    id: "doubleBassG",
    displayName: "Double Bass G String",
    localName: "低音提琴 G 弦",
    pageTitle: "低音提琴 G 弦识谱训练室",
    controlDeckLabel: "DOUBLE BASS G STRING",
    controlDeckTitle: "低音提琴 G 弦半把位指位控制台",
    pitchMap: {
      "G3": { label: "G", staffStep: -7, operations: ["0"] },
      "Ab3": { label: "Ab", staffStep: -8, operations: ["1"] },
      "A3": { label: "A", staffStep: -8, operations: ["2"] },
      "Bb3": { label: "Bb", staffStep: -9, operations: ["4"] }
    },
    sequence: [
      ["G3", 0, 1], ["Ab3", 2, 1], ["A3", 4, 1], ["Bb3", 6, 1], ["A3", 8, 1],
      ["Ab3", 10, 1], ["G3", 12, 1], ["A3", 14, 1], ["Bb3", 16, 1], ["Ab3", 18, 1],
      ["G3", 20, 1], ["Ab3", 22, 1], ["A3", 24, 1], ["Bb3", 26, 1], ["G3", 28, 1]
    ],
    sourceNote: "Double bass written-pitch half position on G string: G open, Ab 1, A 2, Bb 4."
  });

  var percussion = {
    id: "percussion",
    displayName: "Drum Kit",
    localName: "架子鼓及打击乐",
    pageTitle: "架子鼓节奏训练室",
    clef: "percussion",
    clefLabel: "PERCUSSION STAFF SCAN",
    transposition: "rhythm-only",
    inputType: "percussion-pad",
    operationName: "击打目标",
    operationPluralName: "击打目标",
    controlDeckLabel: "DRUM KIT TRIGGER PADS",
    controlDeckTitle: "架子鼓节奏触发控制台",
    controls: [
      { id: "KICK", label: "KICK", value: "KICK", caption: "低鼓" },
      { id: "SNARE", label: "SNARE", value: "SNARE", caption: "军鼓" },
      { id: "HIHAT", label: "HI-HAT", value: "HIHAT", caption: "踩镲" },
      { id: "TOM", label: "TOM", value: "TOM", caption: "通鼓" },
      { id: "CRASH", label: "CRASH", value: "CRASH", caption: "吊镲" }
    ],
    pitchMap: {
      "BD": { label: "Kick", staffStep: 2, operations: ["KICK"] },
      "SN": { label: "Snare", staffStep: -2, operations: ["SNARE"] },
      "HH": { label: "HiHat", staffStep: -6, operations: ["HIHAT"] },
      "TM": { label: "Tom", staffStep: -4, operations: ["TOM"] },
      "CR": { label: "Crash", staffStep: -8, operations: ["CRASH"] }
    },
    sequence: [
      ["HH", 0, 0.5], ["BD", 1, 0.5], ["HH", 2, 0.5], ["SN", 3, 0.5],
      ["HH", 4, 0.5], ["BD", 5, 0.5], ["HH", 6, 0.5], ["SN", 7, 0.5],
      ["CR", 8, 1], ["BD", 10, 0.5], ["HH", 11, 0.5], ["SN", 12, 0.5],
      ["TM", 14, 0.5], ["HH", 15, 0.5], ["BD", 16, 0.5], ["SN", 18, 0.5],
      ["HH", 20, 0.5], ["BD", 22, 0.5], ["SN", 24, 0.5], ["CR", 28, 1]
    ],
    sourceNote: "Percussion MVP focuses rhythm and target-pad recognition rather than pitch naming."
  };

  var INSTRUMENT_MODELS = {
    trombone: trombone,
    trumpet: trumpet,
    euphonium: euphonium,
    euphoniumChallenge: euphoniumChallenge,
    horn: horn,
    tuba: tuba,
    flute: flute,
    piccolo: piccolo,
    saxophone: saxophone,
    sopranoSaxophone: sopranoSaxophone,
    clarinet: clarinet,
    bassoon: bassoon,
    violin: violin,
    violinG: violinG,
    violinD: violinD,
    violinA: violinA,
    violinE: violinE,
    violaC: violaC,
    violaG: violaG,
    violaD: violaD,
    violaA: violaA,
    celloC: celloC,
    celloG: celloG,
    celloD: celloD,
    celloA: celloA,
    doubleBassE: doubleBassE,
    doubleBassA: doubleBassA,
    doubleBassD: doubleBassD,
    doubleBassG: doubleBassG,
    percussion: percussion
  };

  function createNoteSequence(instrumentId, tempoBpm, leadInMs) {
    var instrument = INSTRUMENT_MODELS[instrumentId] || INSTRUMENT_MODELS.trombone;
    var beatMs = 60000 / tempoBpm;

    return instrument.sequence.map(function (entry, index) {
      var pitchKey = entry[0];
      var beat = entry[1];
      var durationBeats = entry[2];
      var pitch = instrument.pitchMap[pitchKey];

      return {
        id: instrument.id + "-note-" + index,
        index: index,
        instrumentId: instrument.id,
        clef: instrument.clef,
        pitchKey: pitchKey,
        pitchLabel: pitch.label,
        beat: beat,
        durationBeats: durationBeats,
        targetTimeMs: leadInMs + beat * beatMs,
        durationMs: durationBeats * beatMs,
        staffStep: pitch.staffStep,
        validOperations: pitch.operations.slice(),
        validPositions: pitch.operations.slice(),
        judged: false,
        judgement: null
      };
    });
  }

  function isValidOperation(note, operationValue) {
    return note.validOperations.indexOf(String(operationValue)) !== -1;
  }

  window.InstrumentModels = {
    models: INSTRUMENT_MODELS,
    createNoteSequence: createNoteSequence,
    isValidOperation: isValidOperation
  };
})();
