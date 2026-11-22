const out = document.getElementById('out');
const show = (v) => out.textContent = typeof v === 'string' ? v : JSON.stringify(v, null, 2);
let token = localStorage.getItem('orc_token') || '';
let role = localStorage.getItem('orc_role') || '';
const who = document.getElementById('who');
const refreshWho = () => who.textContent = token ? ('已登录: ' + role) : '未登录（演示账号 teacher01/teacher123 · student01/student123）';
refreshWho();

async function api(method, path, body) {
  const res = await fetch(path, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  show(res.status + ' ' + res.statusText + '\n' + (text || '(empty)'));
  if (!res.ok) throw new Error(res.status);
  return text ? JSON.parse(text) : null;
}
const v = (id) => document.getElementById(id).value.trim();
const rows = (tableId, items, cells) => {
  const tbody = document.querySelector('#' + tableId + ' tbody');
  tbody.innerHTML = items.map(it => '<tr>' + cells(it).map(c => '<td>' + c + '</td>').join('') + '</tr>').join('');
};
const esc = (x) => x === null || x === undefined ? '-' : String(x);
const fmtTime = (s) => esc(s).replace('T', ' ').slice(0, 19);

async function login() {
  const data = await api('POST', '/api/auth/login', {
    username: v('username'), password: v('password'), role: v('role')
  });
  token = data.token; role = data.role;
  localStorage.setItem('orc_token', token); localStorage.setItem('orc_role', role);
  refreshWho();
}

async function listClasses() {
  const data = await api('GET', '/api/classes');
  rows('classTable', data, c => [c.id, esc(c.name), '<b>' + esc(c.joinCode) + '</b>', esc(c.teacherUsername)]);
}

async function createTask() {
  await api('POST', '/api/tasks', {
    instrumentId: v('tInstrument'), title: v('tTitle'), requirement: v('tReq'),
    deadlineAt: v('tDeadline') || null
  });
  listTasks();
}

async function listTasks() {
  const data = await api('GET', '/api/tasks/progress');
  rows('taskTable', data, t => [t.id, esc(t.instrumentId), esc(t.title), fmtTime(t.deadlineAt), '<span class="badge">' + t.doneStudents + ' 人完成</span>']);
}

async function queryRecords() {
  const qs = new URLSearchParams({ studentNo: v('qStudent'), instrumentId: v('qInstrument'), taskId: v('qTask') }).toString();
  const data = await api('GET', '/api/records?' + qs);
  rows('recordTable', data, r => [r.id, esc(r.studentNo), esc(r.instrumentId), r.taskId === null ? '自由练习' : '#' + r.taskId,
    r.score === null ? '-' : r.score, r.accuracy === null ? '-' : r.accuracy, esc(r.durationMs), fmtTime(r.submittedAt)]);
}

async function stats() {
  const data = await api('GET', '/api/students/' + (v('statStudent') || 'student01') + '/stats');
  document.getElementById('cCount').textContent = data.count;
  document.getElementById('cAvg').textContent = (Math.round(data.avgScore * 10) / 10);
  document.getElementById('cBest').textContent = (Math.round(data.bestScore * 10) / 10);
  const today = new Date().toISOString().slice(0, 10);
  const t = (data.daily || []).find(d => d.statDate === today);
  document.getElementById('cToday').textContent = t ? t.practiceCount : 0;
  rows('dailyTable', data.daily || [], d => [d.statDate, d.practiceCount, Math.round(d.avgScore * 10) / 10, Math.round(d.bestScore * 10) / 10]);
}

async function submitRecord() {
  await api('POST', '/api/records', {
    instrumentId: v('rInstrument'), taskId: v('rTask') ? Number(v('rTask')) : null,
    score: Number(v('rScore')), accuracy: Number(v('rAcc')), durationMs: Number(v('rDur')),
    report: { schema: '1.1.0', source: 'console-demo' }
  });
  stats();
}

const myRecords = () => api('GET', '/api/records/me');
