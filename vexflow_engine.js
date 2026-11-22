(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  function createSvgElement(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function ScoreEngine(svg, options) {
    this.svg = svg;
    this.notes = [];
    this.instrument = null;
    this.clef = options.clef || "bass";
    this.width = 900;
    this.height = 330;
    this.hitXRatio = options.hitXRatio || 0.28;
    this.pixelsPerMs = options.pixelsPerMs || 0.118;
    this.staffTop = 112;
    this.staffGap = 18;
    this.noteNodes = {};
  }

  ScoreEngine.prototype.resize = function () {
    var box = this.svg.getBoundingClientRect();
    this.width = Math.max(320, Math.floor(box.width || 900));
    this.height = Math.max(250, Math.floor(box.height || 330));
    this.svg.setAttribute("viewBox", "0 0 " + this.width + " " + this.height);
    this.staffTop = Math.round(this.height * 0.44);
    this.staffGap = Math.max(12, Math.min(17, Math.round(this.height * 0.046)));
  };

  ScoreEngine.prototype.load = function (notes, instrument) {
    this.notes = notes;
    this.instrument = instrument || null;
    this.clef = instrument && instrument.clef ? instrument.clef : (notes[0] && notes[0].clef) || this.clef;
    this.noteNodes = {};
    this.renderStatic();
  };

  ScoreEngine.prototype.renderStatic = function () {
    var svg = this.svg;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    this.resize();

    var staffGroup = createSvgElement("g", { class: "staff" });
    for (var i = 0; i < 5; i += 1) {
      staffGroup.appendChild(createSvgElement("line", {
        x1: 0,
        y1: this.staffTop + i * this.staffGap,
        x2: this.width,
        y2: this.staffTop + i * this.staffGap,
        stroke: "#17242b",
        "stroke-width": 2
      }));
    }

    var isTreble = this.clef === "treble";
    var isAlto = this.clef === "alto";
    var isPercussion = this.clef === "percussion";
    var clefText = createSvgElement("text", {
      x: 20,
      y: isTreble ? this.staffTop + this.staffGap * 3.55 : isAlto ? this.staffTop + this.staffGap * 3.4 : this.staffTop + this.staffGap * 3.25,
      fill: "#17242b",
      "font-size": Math.round(this.staffGap * (isTreble ? 4.45 : isAlto ? 3.9 : isPercussion ? 3.25 : 4.1)),
      "font-family": "Georgia, serif",
      "font-weight": "700"
    });
    clefText.textContent = isTreble ? "𝄞" : isAlto ? "𝄡" : isPercussion ? "||" : "𝄢";
    staffGroup.appendChild(clefText);
    svg.appendChild(staffGroup);

    var noteLayer = createSvgElement("g", { class: "note-layer" });
    svg.appendChild(noteLayer);

    this.notes.forEach(function (note) {
      var group = createSvgElement("g", {
        id: "score-" + note.id,
        class: "score-note"
      });
      var y = this.pitchToY(note.staffStep);
      group.appendChild(createSvgElement("ellipse", {
        cx: 0,
        cy: y,
        rx: Math.max(9, this.staffGap * 0.68),
        ry: Math.max(6, this.staffGap * 0.46),
        transform: "rotate(-18 0 " + y + ")",
        fill: "#101820",
        stroke: "#101820",
        "stroke-width": 2
      }));

      if (note.pitchKey.indexOf("b") !== -1) {
        group.appendChild(createSvgElement("text", {
          x: -27,
          y: y + this.staffGap * 0.38,
          fill: "#101820",
          "font-size": Math.max(18, this.staffGap * 1.35),
          "font-family": "Georgia, serif",
          "font-weight": "700",
          "text-anchor": "middle"
        })).textContent = "♭";
      }

      if (note.pitchKey.indexOf("#") !== -1) {
        group.appendChild(createSvgElement("text", {
          x: -27,
          y: y + this.staffGap * 0.38,
          fill: "#101820",
          "font-size": Math.max(18, this.staffGap * 1.35),
          "font-family": "Georgia, serif",
          "font-weight": "700",
          "text-anchor": "middle"
        })).textContent = "♯";
      }

      var stemUp = note.staffStep > -4;
      group.appendChild(createSvgElement("line", {
        x1: stemUp ? Math.max(8, this.staffGap * 0.62) : -Math.max(8, this.staffGap * 0.62),
        y1: y,
        x2: stemUp ? Math.max(8, this.staffGap * 0.62) : -Math.max(8, this.staffGap * 0.62),
        y2: stemUp ? y - this.staffGap * 3 : y + this.staffGap * 3,
        stroke: "#101820",
        "stroke-width": 2
      }));
      group.appendChild(createSvgElement("text", {
        x: -14,
        y: y + this.staffGap * 1.8,
        fill: "#41515a",
        "font-size": Math.max(10, this.staffGap * 0.72),
        "font-family": "Consolas, monospace",
        "text-anchor": "middle"
      })).textContent = note.pitchLabel;

      this.appendLedgerLines(group, note.staffStep);

      noteLayer.appendChild(group);
      this.noteNodes[note.id] = group;
    }, this);
  };

  ScoreEngine.prototype.pitchToY = function (staffStep) {
    return this.staffTop + this.staffGap * 4 + staffStep * (this.staffGap / 2);
  };

  ScoreEngine.prototype.appendLedgerLines = function (group, staffStep) {
    var ledgerStep;

    if (staffStep <= -10) {
      for (ledgerStep = -10; ledgerStep >= staffStep; ledgerStep -= 2) {
        group.appendChild(this.createLedgerLine(ledgerStep));
      }
      return;
    }

    if (staffStep >= 2) {
      for (ledgerStep = 2; ledgerStep <= staffStep; ledgerStep += 2) {
        group.appendChild(this.createLedgerLine(ledgerStep));
      }
    }
  };

  ScoreEngine.prototype.createLedgerLine = function (staffStep) {
    var y = this.pitchToY(staffStep);
    return createSvgElement("line", {
      x1: -20,
      y1: y,
      x2: 20,
      y2: y,
      stroke: "#101820",
      "stroke-width": 2
    });
  };

  ScoreEngine.prototype.update = function (elapsedMs) {
    var hitX = this.width * this.hitXRatio;

    this.notes.forEach(function (note) {
      var node = this.noteNodes[note.id];
      if (!node) {
        return;
      }
      var x = hitX + (note.targetTimeMs - elapsedMs) * this.pixelsPerMs;
      node.setAttribute("transform", "translate(" + x.toFixed(2) + " 0)");
      node.setAttribute("opacity", x < -60 || x > this.width + 120 ? "0" : "1");

      if (note.judgement === "Perfect" || note.judgement === "Good") {
        node.setAttribute("class", "score-note hit");
        node.setAttribute("opacity", "0.35");
      } else if (note.judged) {
        node.setAttribute("class", "score-note miss");
        node.setAttribute("opacity", "0.4");
      }
    }, this);
  };

  ScoreEngine.prototype.getNextNote = function () {
    for (var i = 0; i < this.notes.length; i += 1) {
      if (!this.notes[i].judged) {
        return this.notes[i];
      }
    }
    return null;
  };

  window.VexflowEngine = {
    create: function (svg, options) {
      return new ScoreEngine(svg, options || {});
    }
  };
})();
