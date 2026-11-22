/**
 * report_sync.js — 2.0 增量挂载（C2 / P1）
 * 数据源：main.js 结算时挂载的 window.__REHEARSAL_BOMB_REPORT__（不改动 main.js 逻辑）。
 * 行为：学生已登录（localStorage.orc_token）时，把结算报告 POST 到后端 /api/records。
 *       未登录或后端不可达时静默跳过，1.x 训练功能不受影响。
 */
(function () {
  'use strict';

  var API_BASE = (function () {
    try { return localStorage.getItem('orc_api_base') || 'http://localhost:8083'; }
    catch (e) { return 'http://localhost:8083'; }
  })();

  function instrumentId() {
    try {
      return (window.REHEARSAL_GAME_CONFIG && window.REHEARSAL_GAME_CONFIG.instrumentId) || 'unknown';
    } catch (e) { return 'unknown'; }
  }

  function pickNumber(obj, keys) {
    for (var i = 0; i < keys.length; i++) {
      var v = obj && obj[keys[i]];
      if (typeof v === 'number' && isFinite(v)) return v;
    }
    return null;
  }

  function pickFirst(obj, summary, keys) {
    var v = pickNumber(obj, keys);
    return v === null ? pickNumber(summary, keys) : v;
  }

  function mapReport(report) {
    var summary = report && (report.summary || report.stats || {});
    var accuracy = pickFirst(report, summary, ['accuracy', 'hitRate']);
    var score = pickFirst(report, summary, ['score', 'totalScore', 'finalScore']);
    // P1 约定：1.x 报告无独立 score 字段时，score = round(accuracy * 100)
    if (score === null && typeof accuracy === 'number') score = Math.round(accuracy * 100);
    return {
      instrumentId: instrumentId(),
      taskId: (function () {
        try { var t = localStorage.getItem('orc_task_id'); return t ? Number(t) : null; } catch (e) { return null; }
      })(),
      score: score,
      accuracy: accuracy,
      durationMs: (function () {
        var direct = pickFirst(report, summary, ['durationMs', 'gameDurationMs', 'elapsedMs']);
        if (direct !== null) return direct;
        if (report && report.startedAt && report.endedAt) {
          var ms = Date.parse(report.endedAt) - Date.parse(report.startedAt);
          return isFinite(ms) ? ms : null;
        }
        return null;
      })(),
      report: report
    };
  }

  var lastSubmitted = null;

  function trySubmit(report) {
    var token;
    try { token = localStorage.getItem('orc_token'); } catch (e) { return; }
    if (!token || !report) return;
    var payload = mapReport(report);
    var fingerprint = JSON.stringify([payload.instrumentId, payload.score, payload.accuracy, payload.durationMs, report && report.endedAt]);
    if (fingerprint === lastSubmitted) return;
    fetch(API_BASE + '/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (res.ok) { lastSubmitted = fingerprint; console.log('[report_sync] 成绩已提交', res.status); }
      else { res.text().then(function (t) { console.warn('[report_sync] 提交失败', res.status, t); }); }
    }).catch(function (err) { console.warn('[report_sync] 后端不可达，跳过同步', err); });
  }

  setInterval(function () { trySubmit(window.__REHEARSAL_BOMB_REPORT__); }, 1000);
  trySubmit(window.__REHEARSAL_BOMB_REPORT__);
})();
