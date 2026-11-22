(function () {
  "use strict";

  function countBy(values) {
    return values.reduce(function (acc, value) {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  function buildWorstPositions(events) {
    var positionErrors = {};
    events.forEach(function (event) {
      if (event.type !== "Wrong Position" && event.type !== "Miss") {
        return;
      }

      var keys = event.expectedPositions && event.expectedPositions.length
        ? event.expectedPositions
        : [event.inputPosition || "unknown"];

      keys.forEach(function (position) {
        var key = String(position);
        positionErrors[key] = (positionErrors[key] || 0) + 1;
      });
    });

    return Object.keys(positionErrors)
      .map(function (position) {
        return { position: position, errors: positionErrors[position] };
      })
      .sort(function (a, b) {
        return b.errors - a.errors;
      });
  }

  function generateReport(summary) {
    var noteEvents = summary.events.filter(function (event) {
      return event.noteId;
    });
    var rhythmBuckets = countBy(noteEvents.map(function (event) {
      return event.rhythmBucket;
    }));
    var inputMethods = countBy(summary.events.map(function (event) {
      return event.inputMethod || "unknown";
    }));

    var report = {
      schemaVersion: "1.1.0",
      instrument: summary.instrument,
      totalNotes: summary.totalNotes,
      hits: summary.stats.hits,
      misses: summary.stats.misses,
      wrongPositions: summary.stats.wrongPositions,
      perfectCount: summary.stats.perfectCount,
      goodCount: summary.stats.goodCount,
      falseInputs: summary.stats.falseInputs,
      accuracy: summary.totalNotes ? Number((summary.stats.hits / summary.totalNotes).toFixed(4)) : 0,
      maxCombo: summary.stats.maxCombo,
      worstPositions: buildWorstPositions(summary.events),
      rhythmErrorDistribution: {
        veryEarly: rhythmBuckets.veryEarly || 0,
        early: rhythmBuckets.early || 0,
        center: rhythmBuckets.center || 0,
        late: rhythmBuckets.late || 0,
        veryLate: rhythmBuckets.veryLate || 0,
        missed: rhythmBuckets.missed || 0
      },
      inputMethodDistribution: {
        keyboard: inputMethods.keyboard || 0,
        pointer: inputMethods.pointer || 0,
        system: inputMethods.system || 0,
        unknown: inputMethods.unknown || 0
      },
      bloodPressurePeak: summary.bloodPressurePeak,
      gameOverReason: summary.gameOverReason,
      startedAt: summary.startedAt,
      endedAt: summary.endedAt,
      noteEvents: summary.events
    };

    window.__REHEARSAL_BOMB_REPORT__ = report;
    console.log("[REHEARSAL_BOMB_REPORT]", report);
    return report;
  }

  function generateCozePayload(report) {
    return {
      hookName: "generateCozePayload",
      purpose: "future-coze-commentary",
      safeForClientOnlyMvp: true,
      report: report
    };
  }

  window.ReportGenerator = {
    generateReport: generateReport,
    generateCozePayload: generateCozePayload
  };
  window.generateCozePayload = generateCozePayload;
})();
