(function () {
  "use strict";

  var config = window.REHEARSAL_GAME_CONFIG || {};
  var TEMPO_BPM = Number(config.tempoBpm) || 66;
  var LEAD_IN_MS = Number(config.leadInMs) || 3600;
  var GAME_DURATION_MS = Number(config.gameDurationMs) || 30000;
  var MAX_BLOOD_PRESSURE = 100;

  var els = {};
  var game = null;
  var instrumentId = config.instrumentId || "trombone";
  var bloodPressureAnimationTimer = null;
  var compoundInputState = {};
  var operationKeyboardBindings = {};
  var modeKeyboardBindings = {};

  var KEYBOARD_LAYOUTS = {
    "slide-position": [
      keySlot("Digit1", "1", ["Numpad1"]), keySlot("Digit2", "2", ["Numpad2"]),
      keySlot("Digit3", "3", ["Numpad3"]), keySlot("Digit4", "4", ["Numpad4"]),
      keySlot("Digit5", "5", ["Numpad5"]), keySlot("Digit6", "6", ["Numpad6"]),
      keySlot("Digit7", "7", ["Numpad7"])
    ],
    "valve-combination": letterSlots(["A", "S", "D", "F", "G", "H", "J"]),
    "woodwind-fingering": letterSlots(["Q", "W", "E", "R", "A", "S", "D", "F", "Z", "X", "C", "V"]),
    "string-fingering-single": letterSlots(["A", "S", "D", "F"]),
    "percussion-pad": letterSlots(["A", "S", "D", "F", "G"])
  };

  var COMPOUND_KEYBOARD_LAYOUTS = [
    letterSlots(["Q", "W", "E", "R", "T"]),
    letterSlots(["A", "S", "D", "F", "G", "H", "J"])
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function keySlot(code, label, aliases) {
    return {
      code: code,
      label: label,
      aliases: aliases || []
    };
  }

  function letterSlots(letters) {
    return letters.map(function (letter) {
      return keySlot("Key" + letter, letter);
    });
  }

  function initialStats() {
    return {
      hits: 0,
      misses: 0,
      wrongPositions: 0,
      perfectCount: 0,
      goodCount: 0,
      falseInputs: 0,
      combo: 0,
      maxCombo: 0
    };
  }

  function getInstrument() {
    return window.InstrumentModels.models[instrumentId] || window.InstrumentModels.models.trombone;
  }

  function getControlKeyboardSlot(instrument, control, index) {
    if (control.hotkeyCode) {
      return keySlot(control.hotkeyCode, control.hotkeyLabel || control.hotkeyCode, control.hotkeyAliases || []);
    }
    var layout = KEYBOARD_LAYOUTS[instrument.inputType] || [];
    return layout[index] || null;
  }

  function registerKeyboardBinding(bindingMap, slot, binding) {
    if (!slot) {
      return;
    }
    [slot.code].concat(slot.aliases).forEach(function (code) {
      bindingMap[code] = binding;
    });
  }

  function appendKeyboardHint(button, slot) {
    if (!slot) {
      return;
    }
    button.dataset.hotkey = slot.label;
    button.setAttribute("aria-keyshortcuts", slot.label);
    var hint = document.createElement("kbd");
    hint.className = "keyboard-hint";
    hint.textContent = slot.label;
    hint.setAttribute("aria-hidden", "true");
    button.appendChild(hint);
  }

  function resetGameState() {
    var instrument = getInstrument();
    var notes = window.InstrumentModels.createNoteSequence(instrument.id, TEMPO_BPM, LEAD_IN_MS);
    game = {
      state: "idle",
      instrument: instrument,
      notes: notes,
      stats: initialStats(),
      events: [],
      startedAt: null,
      endedAt: null,
      startClock: 0,
      elapsedMs: 0,
      bloodPressure: 20,
      bloodPressurePeak: 20,
      consecutiveErrors: 0,
      animationFrameId: null,
      gameOverReason: null,
      lastBeat: -1
    };
    game.scoreEngine = els.scoreEngine;
    compoundInputState = {};
    window.__REHEARSAL_BOMB_REPORT__ = null;
    els.resultModal.classList.add("hidden");
    els.resultModal.classList.remove("result-failed");
    updateFailureVisual(false);
    els.scoreEngine.load(notes, instrument);
    els.scoreEngine.update(0);
    updateHud();
    setJudgement("按下 START 后，在扫描线附近点击正确" + instrument.operationName + "。", "");
  }

  function renderControls() {
    var instrument = getInstrument();
    els.positionGrid.innerHTML = "";
    els.positionGrid.dataset.inputType = instrument.inputType;
    operationKeyboardBindings = {};

    if (instrument.compoundInput) {
      renderCompoundControls(instrument);
      return;
    }

    instrument.controls.forEach(function (control, index) {
      var button = document.createElement("button");
      button.className = "position-button";
      button.type = "button";
      button.dataset.operation = String(control.value);
      button.setAttribute("aria-label", instrument.localName + " " + control.label + " " + instrument.operationName);
      button.innerHTML = "<strong>" + control.label + "</strong><span>" + control.caption + "</span>";
      var slot = getControlKeyboardSlot(instrument, control, index);
      appendKeyboardHint(button, slot);
      registerKeyboardBinding(operationKeyboardBindings, slot, {
        type: "operation",
        value: control.value,
        button: button
      });
      button.addEventListener("pointerdown", function () {
        handleOperationInput(control.value, button, "pointer");
      });
      els.positionGrid.appendChild(button);
    });
  }

  function renderModeSelector() {
    if (!els.modeSelector || !config.instrumentVariants || !config.instrumentVariants.length) {
      return;
    }

    els.modeSelector.innerHTML = "";
    modeKeyboardBindings = {};
    config.instrumentVariants.forEach(function (variant, index) {
      var button = document.createElement("button");
      button.className = "mode-button";
      button.type = "button";
      button.dataset.instrumentId = variant.instrumentId;
      button.innerHTML = "<strong>" + variant.label + "</strong><span>" + variant.caption + "</span>";
      var slot = keySlot("Digit" + (index + 1), String(index + 1), ["Numpad" + (index + 1)]);
      appendKeyboardHint(button, slot);
      registerKeyboardBinding(modeKeyboardBindings, slot, {
        instrumentId: variant.instrumentId,
        button: button
      });
      button.addEventListener("click", function () {
        selectInstrumentVariant(variant.instrumentId);
      });
      els.modeSelector.appendChild(button);
    });
    updateModeSelector();
  }

  function selectInstrumentVariant(nextInstrumentId) {
    if (instrumentId === nextInstrumentId) {
      return;
    }
    instrumentId = nextInstrumentId;
    applyPageLabels();
    renderControls();
    resetGameState();
    updateModeSelector();
  }

  function updateModeSelector() {
    if (!els.modeSelector) {
      return;
    }
    Array.from(els.modeSelector.querySelectorAll(".mode-button")).forEach(function (button) {
      button.classList.toggle("selected", button.dataset.instrumentId === instrumentId);
    });
  }

  function renderCompoundControls(instrument) {
    els.positionGrid.dataset.compoundMode = instrument.compoundInput.mode;
    instrument.compoundInput.groups.forEach(function (group, groupIndex) {
      var panel = document.createElement("div");
      panel.className = "compound-panel";
      panel.dataset.group = group.id;

      var title = document.createElement("span");
      title.className = "compound-panel-label";
      title.textContent = group.label;
      panel.appendChild(title);

      var options = document.createElement("div");
      options.className = "compound-options";

      group.options.forEach(function (option, optionIndex) {
        var button = document.createElement("button");
        button.className = "position-button compound-button";
        button.type = "button";
        button.dataset.compoundGroup = group.id;
        button.dataset.compoundValue = String(option.value);
        button.setAttribute("aria-label", instrument.localName + " " + option.label);
        button.innerHTML = "<strong>" + option.label + "</strong><span>" + option.caption + "</span>";
        var groupLayout = COMPOUND_KEYBOARD_LAYOUTS[groupIndex] || [];
        var slot = groupLayout[optionIndex] || null;
        appendKeyboardHint(button, slot);
        registerKeyboardBinding(operationKeyboardBindings, slot, {
          type: "compound",
          instrument: instrument,
          groupId: group.id,
          value: option.value,
          button: button
        });
        button.addEventListener("pointerdown", function () {
          handleCompoundInput(instrument, group.id, option.value, button, "pointer");
        });
        options.appendChild(button);
      });

      panel.appendChild(options);
      els.positionGrid.appendChild(panel);
    });
  }

  function handleCompoundInput(instrument, groupId, value, button, inputMethod) {
    compoundInputState[groupId] = String(value);
    markCompoundSelection(groupId, value);

    var groups = instrument.compoundInput.groups;
    var missing = groups.filter(function (group) {
      return !compoundInputState[group.id];
    });

    if (missing.length) {
      setJudgement("已选择 " + formatCompoundSelection(instrument) + "，再选" + missing[0].label + "。", "");
      flashButton(button, true);
      return;
    }

    var operation = groups.map(function (group) {
      return compoundInputState[group.id];
    }).join("");
    handleOperationInput(operation, button, inputMethod || "pointer");
    compoundInputState = {};
    clearCompoundSelections();
  }

  function markCompoundSelection(groupId, value) {
    Array.from(els.positionGrid.querySelectorAll("[data-compound-group='" + groupId + "']")).forEach(function (node) {
      node.classList.toggle("selected", String(node.dataset.compoundValue) === String(value));
    });
  }

  function clearCompoundSelections() {
    Array.from(els.positionGrid.querySelectorAll(".compound-button.selected")).forEach(function (node) {
      node.classList.remove("selected");
    });
  }

  function isEditableKeyboardTarget(target) {
    if (!target || !target.closest) {
      return false;
    }
    return !!target.closest("input, textarea, select, [contenteditable='true']");
  }

  function isResultVisible() {
    return els.resultModal && !els.resultModal.classList.contains("hidden");
  }

  function flashKeyboardButton(button) {
    if (!button) {
      return;
    }
    button.classList.remove("keyboard-active");
    void button.offsetWidth;
    button.classList.add("keyboard-active");
    window.clearTimeout(button.__keyboardFlashTimer);
    button.__keyboardFlashTimer = window.setTimeout(function () {
      button.classList.remove("keyboard-active");
    }, 150);
  }

  function handleKeyboardInput(event) {
    if (event.defaultPrevented || event.repeat || event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isEditableKeyboardTarget(event.target)) {
      return;
    }
    if (isResultVisible()) {
      return;
    }

    if (event.code === "Enter") {
      var active = document.activeElement;
      var hasOtherInteractiveFocus = active && active !== document.body && active !== els.startButton && active.matches && active.matches("button, a, summary, input, textarea, select");
      if (hasOtherInteractiveFocus) {
        return;
      }
      event.preventDefault();
      flashKeyboardButton(els.startButton);
      playAudio("uiClick");
      startGame();
      return;
    }

    var modeBinding = modeKeyboardBindings[event.code];
    if (modeBinding && (!game || game.state !== "playing")) {
      event.preventDefault();
      flashKeyboardButton(modeBinding.button);
      playAudio("uiClick");
      selectInstrumentVariant(modeBinding.instrumentId);
      return;
    }

    var binding = operationKeyboardBindings[event.code];
    if (!binding) {
      return;
    }

    event.preventDefault();
    flashKeyboardButton(binding.button);
    if (binding.type === "compound") {
      handleCompoundInput(binding.instrument, binding.groupId, binding.value, binding.button, "keyboard");
      return;
    }
    handleOperationInput(binding.value, binding.button, "keyboard");
  }

  function formatCompoundSelection(instrument) {
    if (!instrument.compoundInput) {
      return "";
    }
    return instrument.compoundInput.groups.map(function (group) {
      var selected = compoundInputState[group.id];
      if (!selected) {
        return group.label + "?";
      }
      var option = group.options.filter(function (item) {
        return String(item.value) === String(selected);
      })[0];
      return option ? option.label : selected;
    }).join(" + ");
  }

  function applyPageLabels() {
    var instrument = getInstrument();
    var clefName = instrument.clef === "treble" ? "Treble Clef" : instrument.clef === "alto" ? "Alto Clef" : instrument.clef === "percussion" ? "Percussion Staff" : "Bass Clef";
    document.title = instrument.pageTitle;
    if (els.pageTitle) {
      els.pageTitle.textContent = instrument.pageTitle;
    }
    if (els.missionEyebrow) {
      els.missionEyebrow.textContent = instrument.displayName.toUpperCase() + " SIGHT READING";
    }
    if (els.missionMeta) {
      els.missionMeta.textContent = instrument.displayName + " / " + clefName + " / " + instrument.operationPluralName;
    }
    if (els.scoreClefLabel) {
      els.scoreClefLabel.textContent = instrument.clefLabel;
    }
    if (els.positionDeck) {
      els.positionDeck.setAttribute("aria-label", instrument.localName + instrument.operationName + "控制台");
    }
    if (els.deckLabel) {
      els.deckLabel.textContent = instrument.controlDeckLabel;
    }
    if (els.deckTitle) {
      els.deckTitle.textContent = instrument.controlDeckTitle;
    }
  }

  function startGame() {
    if (game.state === "playing") {
      return;
    }
    if (game.state !== "idle") {
      resetGameState();
    }
    game.state = "playing";
    game.startedAt = new Date().toISOString();
    game.startClock = performance.now();
    game.lastBeat = -1;
    els.resultModal.classList.add("hidden");
    if (window.AudioManager) {
      window.AudioManager.playBgm("bgmGame");
    }
    requestLoop();
  }

  function requestLoop() {
    if (game.animationFrameId) {
      cancelAnimationFrame(game.animationFrameId);
    }
    game.animationFrameId = requestAnimationFrame(gameLoop);
  }

  function gameLoop(now) {
    if (game.state !== "playing") {
      return;
    }

    game.elapsedMs = now - game.startClock;
    game.scoreEngine.update(game.elapsedMs);
    processMisses();
    updateBeatPulse();
    updateHud();

    if (game.bloodPressure >= MAX_BLOOD_PRESSURE) {
      endGame("bloodPressureExplosion");
      return;
    }

    if (game.elapsedMs >= GAME_DURATION_MS) {
      endGame("survived30Seconds");
      return;
    }

    game.animationFrameId = requestAnimationFrame(gameLoop);
  }

  function processMisses() {
    var misses = window.RhythmValidator.collectMisses(game.notes, game.elapsedMs);
    misses.forEach(function (note) {
      game.stats.misses += 1;
      registerError(14, "Miss", note, null, note.deltaMs, "system");
      setJudgement("MISS - 慢慢来，先看准扫描线", "miss");
      flashShell(false);
    });
  }

  function handleOperationInput(operation, button, inputMethod) {
    inputMethod = inputMethod || "pointer";
    if (!game || game.state !== "playing") {
      setJudgement("先按 START，再开始训练。", "wrong");
      flashButton(button, false);
      playAudio("wrong");
      return;
    }

    game.elapsedMs = Math.max(0, performance.now() - game.startClock);

    var note = window.RhythmValidator.findCandidateNote(game.notes, game.elapsedMs);
    if (!note) {
      game.stats.falseInputs += 1;
      registerError(7, "False Input", null, operation, null, inputMethod);
      setJudgement("空拍乱按 - 等音符靠近红线", "wrong");
      flashButton(button, false);
      flashShell(false);
      return;
    }

    var deltaMs = game.elapsedMs - note.targetTimeMs;
    var timing = window.RhythmValidator.classifyTiming(deltaMs);
    var valid = window.InstrumentModels.isValidOperation(note, operation);

    note.judged = true;
    note.deltaMs = Math.round(deltaMs);

    if (valid && (timing === "Perfect" || timing === "Good")) {
      note.judgement = timing;
      game.stats.hits += 1;
      game.stats.combo += 1;
      game.stats.maxCombo = Math.max(game.stats.maxCombo, game.stats.combo);
      if (timing === "Perfect") {
        game.stats.perfectCount += 1;
      } else {
        game.stats.goodCount += 1;
      }
      game.consecutiveErrors = 0;
      changeBloodPressure(timing === "Perfect" ? -4 : -2);
      pushEvent(timing, note, operation, deltaMs, inputMethod);
      setJudgement(timing.toUpperCase() + " - " + note.pitchLabel + " / " + formatOperation(operation), timing.toLowerCase());
      playAudio(timing === "Perfect" ? "hit" : "good");
      if (game.stats.combo > 0 && game.stats.combo % 5 === 0) {
        playAudio("combo", { volume: 0.74 });
      }
      flashButton(button, true);
      flashShell(true);
    } else if (!valid) {
      note.judgement = "Wrong Position";
      game.stats.wrongPositions += 1;
      registerError(16, "Wrong Position", note, operation, deltaMs, inputMethod);
      setJudgement("WRONG - 目标 " + note.validOperations.map(formatOperation).join(" / "), "wrong");
      flashButton(button, false);
      flashShell(false);
    } else {
      note.judgement = "Miss";
      game.stats.misses += 1;
      registerError(12, "Miss", note, operation, deltaMs, inputMethod);
      setJudgement("节奏窗口炸了 - " + Math.round(deltaMs) + "ms", "miss");
      flashButton(button, false);
      flashShell(false);
    }
  }

  function formatOperation(operation) {
    if (String(operation) === "open") {
      return "0";
    }
    var instrument = game && game.instrument;
    if (instrument && instrument.controls) {
      for (var i = 0; i < instrument.controls.length; i += 1) {
        if (String(instrument.controls[i].value) === String(operation)) {
          return instrument.controls[i].label;
        }
      }
    }
    if (/^\d+$/.test(String(operation))) {
      return String(operation).split("").join("+");
    }
    return String(operation);
  }

  function pushEvent(type, note, inputOperation, deltaMs, inputMethod) {
    game.events.push({
      type: type,
      inputMethod: inputMethod || (inputOperation === null ? "system" : "pointer"),
      noteId: note ? note.id : null,
      noteIndex: note ? note.index : null,
      pitchKey: note ? note.pitchKey : null,
      inputPosition: inputOperation,
      inputOperation: inputOperation,
      expectedPositions: note ? note.validOperations.slice() : [],
      expectedOperations: note ? note.validOperations.slice() : [],
      deltaMs: typeof deltaMs === "number" ? Math.round(deltaMs) : null,
      rhythmBucket: window.RhythmValidator.buildRhythmBucket(deltaMs),
      bloodPressure: Math.round(game.bloodPressure),
      elapsedMs: Math.round(game.elapsedMs)
    });
  }

  function registerError(basePressure, type, note, inputOperation, deltaMs, inputMethod) {
    playAudio(type === "Wrong Position" ? "wrongGliss" : "wrong");
    game.stats.combo = 0;
    game.consecutiveErrors += 1;
    changeBloodPressure(basePressure + Math.max(0, game.consecutiveErrors - 1) * 4);
    pushEvent(type, note, inputOperation, deltaMs, inputMethod);
  }

  function changeBloodPressure(delta) {
    var previous = game.bloodPressure;
    game.bloodPressure = Math.max(0, Math.min(MAX_BLOOD_PRESSURE, game.bloodPressure + delta));
    game.bloodPressurePeak = Math.max(game.bloodPressurePeak, game.bloodPressure);
    triggerBloodPressureAnimation(game.bloodPressure - previous);
  }

  function triggerBloodPressureAnimation(delta) {
    if (!els.pressurePanel || delta === 0) {
      return;
    }
    var className = delta > 0 ? "pressure-spike" : "pressure-stabilize";
    els.pressurePanel.classList.remove("pressure-spike", "pressure-stabilize");
    els.conductorPortrait.classList.remove("mood-jolt");
    void els.pressurePanel.offsetWidth;
    els.pressurePanel.classList.add(className);
    els.conductorPortrait.classList.add("mood-jolt");
    window.clearTimeout(bloodPressureAnimationTimer);
    bloodPressureAnimationTimer = window.setTimeout(function () {
      els.pressurePanel.classList.remove("pressure-spike", "pressure-stabilize");
      els.conductorPortrait.classList.remove("mood-jolt");
    }, 520);
  }

  function updateBeatPulse() {
    var beatMs = 60000 / TEMPO_BPM;
    var beat = Math.max(0, Math.floor((game.elapsedMs - LEAD_IN_MS) / beatMs) + 1);
    if (beat !== game.lastBeat && game.elapsedMs >= LEAD_IN_MS) {
      els.pulseRing.classList.remove("pulse");
      void els.pulseRing.offsetWidth;
      els.pulseRing.classList.add("pulse");
      game.lastBeat = beat;
    }
    els.beatReadout.textContent = game.elapsedMs < LEAD_IN_MS ? "Lead-in" : "Beat " + beat;
  }

  function updateHud() {
    var remaining = Math.max(0, GAME_DURATION_MS - (game ? game.elapsedMs : 0));
    els.countdown.textContent = formatTime(remaining);
    els.gameStateLabel.textContent = game.state === "playing" ? "训练中" : game.state === "idle" ? "待命" : "结算";
    els.bloodPressureText.textContent = Math.round(game.bloodPressure) + "%";
    els.bloodPressureFill.style.width = Math.round(game.bloodPressure) + "%";
    els.bloodPressureFill.classList.toggle("danger", game.bloodPressure >= 72);
    els.bloodPressureFill.parentElement.setAttribute("aria-valuenow", String(Math.round(game.bloodPressure)));
    els.hitsText.textContent = game.stats.hits;
    els.missText.textContent = game.stats.misses;
    els.wrongText.textContent = game.stats.wrongPositions;
    els.comboText.textContent = game.stats.combo;

    var next = game.scoreEngine.getNextNote();
    els.currentTarget.textContent = next
      ? "目标 " + next.pitchLabel + " | 可用" + game.instrument.operationPluralName + " " + next.validOperations.map(formatOperation).join("/")
      : "守住倒计时，别乱按。";

    if (game.bloodPressure >= 85) {
      els.conductorLine.textContent = "指挥进入火山模式，下一个错音可能就炸。";
      els.conductorPortrait.dataset.mood = "furious";
    } else if (game.bloodPressure >= 60) {
      els.conductorLine.textContent = "指挥停止微笑，但还愿意给你一拍。";
      els.conductorPortrait.dataset.mood = "angry";
    } else if (game.bloodPressure >= 35) {
      els.conductorLine.textContent = "指挥开始敲谱架：先稳住节奏。";
      els.conductorPortrait.dataset.mood = "alert";
    } else {
      els.conductorLine.textContent = "指挥还在微笑，适合练慢一点。";
      els.conductorPortrait.dataset.mood = "happy";
    }
  }

  function formatTime(ms) {
    var totalSeconds = ms / 1000;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);
    var tenths = Math.floor((totalSeconds % 1) * 10);
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0") + "." + tenths;
  }

  function setJudgement(text, type) {
    els.judgementText.textContent = text;
    els.judgementStrip.className = "judgement-strip" + (type ? " " + type : "");
  }

  function flashButton(button, ok) {
    if (!button) {
      return;
    }
    var className = ok ? "correct-flash" : "wrong-flash";
    button.classList.remove("correct-flash", "wrong-flash");
    void button.offsetWidth;
    button.classList.add(className);
    window.setTimeout(function () {
      button.classList.remove(className);
    }, 190);
  }

  function flashShell(ok) {
    document.body.classList.remove("feedback-correct", "feedback-wrong");
    void document.body.offsetWidth;
    document.body.classList.add(ok ? "feedback-correct" : "feedback-wrong");
    window.setTimeout(function () {
      document.body.classList.remove("feedback-correct", "feedback-wrong");
    }, 190);
  }

  function endGame(reason) {
    if (game.animationFrameId) {
      cancelAnimationFrame(game.animationFrameId);
      game.animationFrameId = null;
    }
    game.state = "ended";
    game.gameOverReason = reason;
    game.endedAt = new Date().toISOString();
    updateHud();

    var report = window.ReportGenerator.generateReport({
      instrument: game.instrument.displayName,
      totalNotes: game.notes.length,
      stats: game.stats,
      events: game.events,
      bloodPressurePeak: Math.round(game.bloodPressurePeak),
      gameOverReason: reason,
      startedAt: game.startedAt,
      endedAt: game.endedAt
    });
    window.__REHEARSAL_BOMB_REPORT__ = report;
    if (typeof globalThis !== "undefined") {
      globalThis.__REHEARSAL_BOMB_REPORT__ = report;
    }
    renderReport(report);
  }

  function renderReport(report) {
    var hitRate = Math.round(report.accuracy * 100);
    var resultCopy = getResultCopy(report.gameOverReason, hitRate);
    var failed = report.gameOverReason !== "survived30Seconds";
    els.resultTitle.textContent = resultCopy.title;
    els.resultSubtitle.textContent = resultCopy.subtitle;
    els.resultModal.classList.toggle("result-failed", failed);
    updateFailureVisual(failed);
    playAudio(failed ? "wrongGliss" : "clear");
    els.reportSummary.innerHTML = [
      ["命中率", hitRate + "%"],
      ["Perfect", report.perfectCount],
      ["Good", report.goodCount],
      ["Miss", report.misses],
      ["错误", report.wrongPositions],
      ["Max Combo", report.maxCombo],
      ["血压峰值", report.bloodPressurePeak + "%"],
      ["结局", resultCopy.badge]
    ].map(function (item) {
      return "<div class=\"report-card\"><span>" + item[0] + "</span><strong>" + item[1] + "</strong></div>";
    }).join("");
    els.reportJson.textContent = JSON.stringify(report, null, 2);
    els.resultModal.classList.remove("hidden");
  }

  function updateFailureVisual(visible) {
    if (!els.resultSubtitle) {
      return;
    }

    var visual = byId("failureVisual");
    if (!visual) {
      visual = document.createElement("div");
      visual.id = "failureVisual";
      visual.className = "failure-visual hidden";

      var image = document.createElement("img");
      image.src = "./assets/pig.gif";
      image.alt = "关卡失败动画";
      image.decoding = "async";
      visual.appendChild(image);
      els.resultSubtitle.insertAdjacentElement("afterend", visual);
    }

    visual.classList.toggle("hidden", !visible);
  }

  function getResultCopy(reason, hitRate) {
    if (reason === "survived30Seconds") {
      return {
        title: "成功撑过 30 秒",
        subtitle: hitRate >= 70 ? "指挥点头了：这次像个能进排练室的人。" : "倒计时归零，训练通过；但指挥建议你回去再摸一遍指法。",
        badge: "训练通过"
      };
    }
    if (reason === "bloodPressureExplosion") {
      return {
        title: "指挥血压爆表",
        subtitle: "排练暂停。先别急着嘴硬，看看哪里最容易炸。",
        badge: "血压爆表"
      };
    }
    return {
      title: "训练结束",
      subtitle: "本轮战报已生成，下一轮继续。",
      badge: "结束"
    };
  }

  function copyReport() {
    var report = window.__REHEARSAL_BOMB_REPORT__;
    if (!report) {
      return;
    }
    var text = JSON.stringify(report, null, 2);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
      return;
    }
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }

  function playAudio(key, options) {
    if (window.AudioManager && window.AudioManager.play) {
      window.AudioManager.play(key, options);
    }
  }

  function bindElements() {
    [
      "countdown", "gameStateLabel", "bloodPressureText", "bloodPressureFill", "pressurePanel", "conductorLine",
      "conductorPortrait", "currentTarget", "beatReadout", "pulseRing", "scoreSvg", "judgementStrip",
      "judgementText", "hitsText", "missText", "wrongText", "comboText", "startButton", "restartButton",
      "positionGrid", "positionDeck", "resultModal", "reportSummary", "reportJson", "resultTitle",
      "resultSubtitle", "playAgainButton", "copyReportButton", "pageTitle", "missionEyebrow", "missionMeta",
      "scoreClefLabel", "deckLabel", "deckTitle", "modeSelector"
    ].forEach(function (id) {
      els[id] = byId(id);
    });
  }

  function init() {
    bindElements();
    if (window.AudioManager) {
      window.AudioManager.init({ context: "game" });
    }
    document.body.classList.add("page-ready");
    applyPageLabels();
    els.scoreEngine = window.VexflowEngine.create(els.scoreSvg, {
      hitXRatio: 0.28,
      pixelsPerMs: 0.078,
      clef: getInstrument().clef
    });
    renderModeSelector();
    renderControls();
    resetGameState();
    appendKeyboardHint(els.startButton, keySlot("Enter", "ENTER"));
    els.startButton.addEventListener("click", startGame);
    els.restartButton.addEventListener("click", resetGameState);
    els.playAgainButton.addEventListener("click", function () {
      resetGameState();
      startGame();
    });
    els.copyReportButton.addEventListener("click", copyReport);
    window.addEventListener("keydown", handleKeyboardInput);
    window.addEventListener("resize", function () {
      if (game && els.scoreEngine) {
        els.scoreEngine.renderStatic();
        els.scoreEngine.update(game.elapsedMs || 0);
      }
    });
  }

  window.addEventListener("DOMContentLoaded", init);
})();
