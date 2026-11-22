(function () {
  "use strict";

  var PERFECT_WINDOW_MS = 95;
  var GOOD_WINDOW_MS = 230;
  var HIT_WINDOW_MS = 430;
  var MISS_AFTER_MS = 430;

  function classifyTiming(deltaMs) {
    var abs = Math.abs(deltaMs);
    if (abs <= PERFECT_WINDOW_MS) {
      return "Perfect";
    }
    if (abs <= GOOD_WINDOW_MS) {
      return "Good";
    }
    if (abs <= HIT_WINDOW_MS) {
      return "Late/Early";
    }
    return "Out";
  }

  function findCandidateNote(notes, nowMs) {
    var best = null;
    var bestAbs = Infinity;

    notes.forEach(function (note) {
      if (note.judged) {
        return;
      }
      var delta = nowMs - note.targetTimeMs;
      var abs = Math.abs(delta);
      if (abs <= HIT_WINDOW_MS && abs < bestAbs) {
        best = note;
        bestAbs = abs;
      }
    });

    return best;
  }

  function collectMisses(notes, nowMs) {
    var misses = [];
    notes.forEach(function (note) {
      if (!note.judged && nowMs > note.targetTimeMs + MISS_AFTER_MS) {
        note.judged = true;
        note.judgement = "Miss";
        note.deltaMs = nowMs - note.targetTimeMs;
        misses.push(note);
      }
    });
    return misses;
  }

  function buildRhythmBucket(deltaMs) {
    if (typeof deltaMs !== "number") {
      return "missed";
    }
    if (deltaMs < -GOOD_WINDOW_MS) {
      return "veryEarly";
    }
    if (deltaMs < -PERFECT_WINDOW_MS) {
      return "early";
    }
    if (deltaMs <= PERFECT_WINDOW_MS) {
      return "center";
    }
    if (deltaMs <= GOOD_WINDOW_MS) {
      return "late";
    }
    return "veryLate";
  }

  window.RhythmValidator = {
    windows: {
      perfectMs: PERFECT_WINDOW_MS,
      goodMs: GOOD_WINDOW_MS,
      hitMs: HIT_WINDOW_MS,
      missAfterMs: MISS_AFTER_MS
    },
    classifyTiming: classifyTiming,
    findCandidateNote: findCandidateNote,
    collectMisses: collectMisses,
    buildRhythmBucket: buildRhythmBucket
  };
})();
