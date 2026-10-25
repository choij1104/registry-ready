/* Registry Ready — UI */
(() => {
const E = ENGINE;
const VERSION = "1.0.0";
const LS_KEY = "registry-ready-v1";
const $view = document.getElementById("view");
const $sync = document.getElementById("sync");

/* ---------- tiny DOM helper ---------- */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "style") el.setAttribute("style", v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(String(k)));
  return el;
}
const pct = x => x == null ? "—" : Math.round(x * 100) + "%";
const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const fmtDate = t => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const LET = "ABCDEF";

/* ---------- state + persistence ---------- */
const blank = () => ({ v: 1, srs: {}, hist: [], exams: [], skills: [], cards: {}, updated: 0 });
let S = blank();
try { const raw = localStorage.getItem(LS_KEY); if (raw) S = Object.assign(blank(), JSON.parse(raw)); } catch (e) {}
let dbRef = null, saveTimer = null, writing = Promise.resolve();

function trim() {
  if (S.hist.length > 3000) S.hist = S.hist.slice(-3000);
  if (S.exams.length > 40) S.exams = S.exams.slice(-40);
  if (S.skills.length > 300) S.skills = S.skills.slice(-300);
}
function save() {
  S.updated = Date.now(); trim();
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {}
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    if (!dbRef) return;
    const body = JSON.parse(JSON.stringify(S));
    writing = writing.then(() => dbRef.set(body)).then(() => { $sync.textContent = "Synced to your account"; }).catch(() => { $sync.textContent = "Saved on this device"; });
  }, 1200);
}
(async () => {
  try {
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!db || !user) return;
    const uid = await user.id(); if (!uid) return;
    dbRef = db.doc("data/users/" + uid + "/progress");
    const snap = await dbRef.get();
    if (snap.exists) {
      const remote = snap.data();
      if ((remote.updated || 0) > (S.updated || 0)) {
        S = Object.assign(blank(), JSON.parse(JSON.stringify(remote)));
        try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {}
        if (!ctx) render();
      } else if ((S.updated || 0) > (remote.updated || 0)) save();
    } else if (S.updated) save();
    $sync.textContent = "Synced to your account";
  } catch (e) { /* stays local */ }
})();

function record(item, ok, mode) {
  S.hist.push({ id: item.id, ok, t: Date.now(), m: mode });
  E.srsUpdate(S.srs, item.id, ok);
  save();
}

/* ---------- speech helpers ---------- */
function itemSpeech(item, letters) {
  const parts = [item.stem];
  if (item.type === "mr") parts.push(`Select ${item.ans.length === 2 ? "two" : "three"}.`);
  (letters || item.opts.map((_, i) => i)).forEach((orig, k) => parts.push(`${LET[k]}. ${item.opts[orig]}.`));
  return parts.join(" ");
}
function answerSpeech(item, letters) {
  const pos = orig => LET[(letters || item.opts.map((_, i) => i)).indexOf(orig)];
  const keyed = item.type === "mc" ? [item.ans] : item.ans;
  const lead = keyed.length === 1 ? `The answer is ${pos(keyed[0])}. ${item.opts[keyed[0]]}.` : `The answers are ${keyed.map(pos).join(" and ")}.`;
  return `${lead} ${item.key || ""} ${item.why}`;
}
function speakButton(label, getText) {
  if (!AUDIO.available()) return null;
  let on = false;
  const b = h("button", { class: "btn small", type: "button", onclick: async () => {
    if (on) { AUDIO.stop(); return; }
    AUDIO.stop(); on = true; b.textContent = "Stop";
    await AUDIO.speak(getText());
    on = false; b.textContent = label;
  } }, label);
  return b;
}

/* ---------- question player ---------- */
function player(item, { feedback, onDone, footer, practice }) {
  const box = h("section", { class: "panel", "aria-live": "polite" });
  const dom = DOMAINS[item.d];
  let resp = null, done = false;
  const submit = h("button", { class: "btn primary", disabled: true, onclick: () => finish() }, "Submit");
  const body = h("div", { class: "opts" });
  let need = 0, perm = null, order, cells = [];

  const typeLabel = { mc: "Choose one", mr: "", order: "Put in order", table: "Classify each row" }[item.type];
  if (item.type === "mc" || item.type === "mr") {
    perm = shuffle(item.opts.map((_, i) => i));
    need = item.type === "mr" ? item.ans.length : 1;
    resp = item.type === "mr" ? [] : null;
    perm.forEach((orig, k) => {
      const b = h("button", { class: "opt", "aria-pressed": "false", "data-o": orig, onclick: () => {
        if (done) return;
        if (item.type === "mc") { resp = orig; body.querySelectorAll(".opt").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false")); }
        else {
          const on = resp.includes(orig);
          if (!on && resp.length >= need) return;
          resp = on ? resp.filter(x => x !== orig) : resp.concat(orig);
          b.setAttribute("aria-pressed", on ? "false" : "true");
        }
        submit.disabled = item.type === "mc" ? resp == null : resp.length !== need;
      } }, h("span", { class: "k" }, LET[k]), h("span", { class: "ot" }, item.opts[orig]));
      body.append(b);
    });
  } else if (item.type === "order") {
    do { order = shuffle(item.opts.map((_, i) => i)); } while (order.every((v, i) => v === i));
    const ol = h("ol", { class: "olist" });
    const draw = () => {
      ol.replaceChildren(...order.map((orig, k) => h("li", { "data-o": orig },
        h("span", { class: "k mono" }, k + 1), h("span", { class: "t" }, item.opts[orig]),
        h("button", { class: "btn small", "aria-label": "Move up", disabled: k === 0 || done, onclick: () => { [order[k - 1], order[k]] = [order[k], order[k - 1]]; draw(); } }, "↑"),
        h("button", { class: "btn small", "aria-label": "Move down", disabled: k === order.length - 1 || done, onclick: () => { [order[k + 1], order[k]] = [order[k], order[k + 1]]; draw(); } }, "↓"))));
    };
    draw(); body.append(ol); submit.disabled = false;
    resp = order;
  } else if (item.type === "table") {
    resp = item.rows.map(() => null);
    item.rows.forEach((row, r) => {
      const seg = h("div", { class: "seg", role: "group", "aria-label": row[0] });
      item.cols.forEach((c, ci) => seg.append(h("button", { "aria-pressed": "false", "data-c": ci, onclick: (ev) => {
        if (done) return; resp[r] = ci;
        seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === ev.currentTarget ? "true" : "false"));
        submit.disabled = resp.some(x => x == null);
      } }, c)));
      cells.push(seg);
      body.append(h("div", { class: "trow" }, h("div", null, row[0]), seg));
    });
  }

  const listen = (item.type === "mc" || item.type === "mr") ? speakButton("Listen", () => itemSpeech(item, perm)) : null;
  box.append(
    h("div", { class: "qmeta" }, h("span", { class: "label" }, dom.name), h("span", { class: "label" }, item.topic)),
    h("p", { class: "stem" }, item.stem),
    item.type === "mr" ? h("p", { class: "label", style: "color:var(--accent)" }, `Select ${need === 2 ? "two" : "three"}`) : h("p", { class: "label" }, typeLabel),
    body, h("div", { class: "row" }, submit, listen, footer || null));

  function finish() {
    if (done) return; done = true;
    AUDIO.stop();
    const ok = E.grade(item, item.type === "order" ? order.slice() : resp);
    submit.remove(); if (listen) listen.remove();
    if (!feedback) { onDone(ok, resp); return; }
    if (item.type === "mc" || item.type === "mr") {
      const right = item.type === "mc" ? [item.ans] : item.ans;
      body.querySelectorAll(".opt").forEach(b => {
        const o = +b.dataset.o;
        if (right.includes(o)) b.classList.add("is-right");
        else if (b.getAttribute("aria-pressed") === "true") b.classList.add("is-wrong");
        const reason = item.wrong && item.wrong[o];
        if (reason) b.querySelector(".ot").append(h("span", { class: "why-not" }, reason));
      });
    } else if (item.type === "order") {
      body.querySelectorAll("li").forEach((li, k) => li.classList.add(+li.dataset.o === k ? "is-right" : "is-wrong"));
      body.querySelectorAll("button").forEach(b => b.disabled = true);
    } else {
      cells.forEach((seg, r) => seg.querySelectorAll("button").forEach(b => { if (+b.dataset.c === item.rows[r][1]) b.classList.add("is-right"); }));
    }
    const rel = E.related(item);
    const fb = h("div", { class: "feedback" + (ok ? "" : " wrong") },
      h("strong", null, ok ? "Correct" : "Not quite"),
      item.type === "order" && !ok ? h("ol", { style: "margin:0;padding-left:20px" }, item.opts.map(s => h("li", null, s))) : null,
      item.key ? h("p", { class: "keyline" }, h("span", { class: "label" }, "Core principle"), h("br"), item.key) : null,
      h("p", null, item.why),
      h("p", { class: "muted", style: "font-size:.85rem" }, "Reference: " + (SRC[item.src] || item.src)));
    const next = h("button", { class: "btn primary", onclick: () => { AUDIO.stop(); onDone(ok, resp); } }, "Next");
    const more = practice && rel.length ? h("button", { class: "btn", onclick: () => { AUDIO.stop(); practice(rel, ok); } }, `Practice this principle (${rel.length})`) : null;
    const say = (item.type === "mc" || item.type === "mr") ? speakButton("Listen to explanation", () => answerSpeech(item, perm)) : speakButton("Listen to explanation", () => `${item.key || ""} ${item.why}`);
    box.append(fb, h("div", { class: "row" }, next, more, say));
    next.focus({ preventScroll: true });
  }
  return box;
}

/* ---------- views ---------- */
let tab = "today", ctx = null;

function domainBars(ds) {
  return E.DKEYS.map(d => {
    const x = ds[d];
    return h("div", { class: "dom" },
      h("div", { class: "head" }, h("span", null, DOMAINS[d].name), h("span", { class: "mono" }, `${pct(x.acc)} · ${x.n} ans`)),
      h("div", { class: "bar", role: "img", "aria-label": `${DOMAINS[d].name} accuracy ${pct(x.acc)}` },
        h("i", { style: `width:${Math.round((x.acc ?? 0) * 100)}%` }), h("b", { style: "left:70%" })),
      h("div", { class: "muted", style: "font-size:.82rem" }, `Exam weight ${DOMAINS[d].lo}–${DOMAINS[d].hi}%`));
  });
}
function readiness() {
  const a = E.overallAbility(S.hist);
  if (!a || a.n < 15) return { text: "Not enough data", cls: "warn", detail: `Answer ${Math.max(0, 15 - (a ? a.n : 0))} more questions for a first estimate.`, est: null };
  const lo = a.theta - 1.96 * a.se, hi = a.theta + 1.96 * a.se;
  const est = 1 / (1 + Math.exp(-a.theta));
  if (lo > E.CAT.cut) return { text: "Above practice cut", cls: "good", est, a };
  if (hi < E.CAT.cut) return { text: "Below practice cut", cls: "bad", est, a };
  return { text: "Near practice cut", cls: "warn", est, a };
}
const cardsDue = () => CARDS.filter(c => { const s = S.cards[c.id]; return !s || s.due <= Date.now(); });

function viewToday() {
  const due = E.dueItems(S.srs).length;
  const ds = E.domainStats(S.hist);
  const weakest = E.DKEYS.slice().sort((a, b) => ds[b].priority - ds[a].priority)[0];
  const r = readiness();
  const last = S.exams[S.exams.length - 1];
  const seen = Object.keys(S.srs).length;
  return [
    h("h1", null, "Today's study"),
    h("section", { class: "panel" },
      h("div", { class: "row", style: "justify-content:space-between" }, h("h3", null, "Readiness"), h("span", { class: "pill " + r.cls }, r.text)),
      r.est != null ? h("p", null, h("span", { class: "big" }, pct(r.est)), " ", h("span", { class: "muted" }, "expected on average-difficulty items")) : h("p", { class: "muted" }, r.detail),
      h("p", { class: "muted", style: "font-size:.85rem" }, "This estimate uses this app's own item difficulties. It is a study signal, not an NREMT score.")),
    h("div", { class: "stats" },
      h("div", { class: "stat hot" }, h("div", { class: "label" }, "Due now"), h("div", { class: "big" }, due)),
      h("div", { class: "stat" }, h("div", { class: "label" }, "Seen"), h("div", { class: "big" }, `${seen}`), h("div", { class: "muted mono", style: "font-size:.8rem" }, `of ${BANK.length}`)),
      h("div", { class: "stat" }, h("div", { class: "label" }, "Cards due"), h("div", { class: "big" }, cardsDue().length))),
    h("section", { class: "panel" },
      h("h2", null, "Review set"),
      h("p", null, due ? `${due} question${due === 1 ? "" : "s"} you missed or are due to see again, then new ones from your weakest area.` : "New questions from your weakest area. Missed ones come back in 10 minutes, right answers at 1, 3, 7, 16 and 35 days."),
      h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => startSet("review", E.reviewQueue(S, 15)) }, "Start 15-question review"))),
    h("section", { class: "panel" },
      h("h2", null, "On the go"),
      h("p", null, "Listen mode reads each question, gives you time to think, then reads the answer and why. Memory cards drill the lists and numbers you must know cold."),
      h("div", { class: "row" }, h("button", { class: "btn", onclick: () => openListen() }, "Start listening"), h("button", { class: "btn", onclick: () => openCards(null) }, "Memory cards"))),
    h("section", { class: "panel" },
      h("h2", null, "Focus area"),
      h("p", null, h("strong", null, DOMAINS[weakest].name), ` — ${ds[weakest].n >= 3 ? pct(ds[weakest].acc) + " correct recently" : "not enough answers yet"}, ${DOMAINS[weakest].lo}–${DOMAINS[weakest].hi}% of the exam.`),
      h("div", { class: "row" }, h("button", { class: "btn", onclick: () => startDrill(weakest) }, "Drill 10 questions"))),
    last ? h("section", { class: "panel" }, h("h3", null, "Last practice exam"),
      h("p", null, `${fmtDate(last.t)} · ${last.n} questions · `, h("span", { class: "pill " + verdictCls(last.verdict) }, verdictText(last.verdict)))) : null
  ];
}

function verdictText(v) { return { above: "Above practice cut", below: "Below practice cut", "near-above": "Near cut, leaning above", "near-below": "Near cut, leaning below" }[v] || v; }
function verdictCls(v) { return v === "above" ? "good" : v === "below" ? "bad" : "warn"; }

function viewExam() {
  return [
    h("h1", null, "Adaptive practice exam"),
    h("section", { class: "panel" },
      h("p", null, "Questions get harder or easier based on your answers, and domains are drawn in the same proportions as the NREMT EMT test plan. No feedback until the end and no going back, like test day."),
      h("div", { class: "list" },
        h("div", null, h("strong", null, "Length: "), `${E.CAT.min} to ${E.CAT.max} questions, 2-hour limit. It ends at ${E.CAT.min} or later once your result is clear with 95% confidence.`),
        h("div", null, h("strong", null, "Question types: "), "multiple choice, multiple response, build list, and options table."),
        h("div", null, h("strong", null, "Same as the real exam: "), "70 to 120 questions in 2 hours. The real exam also includes 10 unscored pilot questions.")),
      h("div", { class: "row" }, h("button", { class: "btn primary", onclick: startExam }, "Start practice exam"))),
    S.exams.length ? h("section", { class: "panel" }, h("h3", null, "History"),
      h("div", { class: "list" }, S.exams.slice().reverse().slice(0, 8).map(x => h("div", { class: "row", style: "justify-content:space-between" },
        h("span", { class: "mono" }, `${fmtDate(x.t)} · ${x.n} q`), h("span", { class: "pill " + verdictCls(x.verdict) }, verdictText(x.verdict)))))) : null
  ];
}

function viewStudy() {
  const ds = E.domainStats(S.hist);
  const decks = [...new Set(CARDS.map(c => c.deck))];
  return [
    h("h1", null, "Study"),
    h("section", { class: "panel" },
      h("h2", null, "Listen"),
      h("p", { class: "muted" }, "Hands-free practice for driving or walking. Each question is read aloud, you get time to think, then the answer and explanation are read."),
      AUDIO.available() ? h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => openListen() }, "Start listening")) : h("p", { class: "muted" }, "Speech is not available on this device.")),
    h("section", { class: "panel" },
      h("h2", null, "Memory cards"),
      h("p", { class: "muted" }, `${CARDS.length} cards for the lists, criteria and numbers. ${cardsDue().length} due now.`),
      h("div", { class: "chips" }, h("button", { class: "chip", onclick: () => openCards(null) }, "All decks"), decks.map(d => h("button", { class: "chip", onclick: () => openCards(d) }, d)))),
    h("section", { class: "panel" },
      h("h2", null, "Domain drill"),
      h("p", { class: "muted" }, "Ten questions with feedback after each one."),
      h("div", { class: "opts" }, E.DKEYS.map(d => h("button", { class: "opt", onclick: () => startDrill(d) },
        h("span", { style: "flex:1" }, h("strong", null, DOMAINS[d].name), h("br"), h("span", { class: "muted", style: "font-size:.88rem" }, `${ds[d].bank} questions · exam weight ${DOMAINS[d].lo}–${DOMAINS[d].hi}%`)),
        h("span", { class: "mono" }, pct(ds[d].acc))))))
  ];
}

/* ---------- Listen mode ---------- */
function openListen() {
  AUDIO.stop();
  ctx = { mode: "listen" };
  let think = 8, running = false, idx = 0, queue = [], current = null, marked = false;
  try { think = +localStorage.getItem("rr-think") || 8; } catch (e) {}
  const status = h("p", { class: "muted mono", style: "font-size:.85rem" }, "Ready");
  const stage = h("div", { class: "listen-stage" }, h("p", { class: "muted" }, "Press Play. Questions come from your review set: missed and due questions first, then new ones from your weakest area."));
  const play = h("button", { class: "btn primary", onclick: () => running ? pause() : start() }, "Play");
  const skip = h("button", { class: "btn", onclick: () => { AUDIO.stop(); if (running) { running = false; idx++; start(); } } }, "Skip");
  const got = h("button", { class: "btn small", disabled: true, onclick: () => mark(true) }, "I got it");
  const miss = h("button", { class: "btn small", disabled: true, onclick: () => mark(false) }, "I missed it");
  const seg = (vals, cur, fmt, on) => h("div", { class: "seg" }, vals.map(v => h("button", { "aria-pressed": v === cur ? "true" : "false", onclick: e => { e.currentTarget.parentNode.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === e.currentTarget ? "true" : "false")); on(v); } }, fmt(v))));
  function mark(ok) { if (!current || marked) return; marked = true; record(current, ok, "listen"); got.disabled = miss.disabled = true; status.textContent = ok ? "Marked: got it" : "Marked: missed — it will come back soon"; }
  function pause() { running = false; AUDIO.stop(); play.textContent = "Play"; status.textContent = "Paused"; releaseLock(); }
  let lock = null;
  async function holdLock() { try { lock = await navigator.wakeLock?.request("screen"); } catch (e) { lock = null; } }
  function releaseLock() { try { lock && lock.release(); } catch (e) {} lock = null; }
  async function start() {
    if (!queue.length || idx >= queue.length) { queue = E.reviewQueue(S, 20).filter(i => i.type === "mc" || i.type === "mr"); idx = 0; }
    if (!queue.length) { status.textContent = "No questions available"; return; }
    running = true; play.textContent = "Pause"; holdLock();
    while (running && idx < queue.length) {
      current = queue[idx]; marked = false; got.disabled = miss.disabled = false;
      const it = current;
      stage.replaceChildren(h("p", { class: "label" }, `Question ${idx + 1} of ${queue.length} · ${DOMAINS[it.d].name}`), h("p", { class: "stem" }, it.stem),
        h("ol", { type: "A", style: "margin:0;padding-left:22px;display:grid;gap:4px" }, it.opts.map(o => h("li", null, o))));
      status.textContent = "Reading the question";
      if (!(await AUDIO.speak(`Question ${idx + 1}. ${itemSpeech(it)}`)) || !running) return;
      status.textContent = `Think: ${think} seconds`;
      if (!(await AUDIO.wait(think * 1000)) || !running) return;
      const keyed = it.type === "mc" ? [it.ans] : it.ans;
      stage.append(h("div", { class: "feedback" }, h("strong", null, "Answer: " + keyed.map(k => LET[k]).join(", ")), it.key ? h("p", { class: "keyline" }, it.key) : null, h("p", null, it.why)));
      status.textContent = "Reading the answer";
      if (!(await AUDIO.speak(answerSpeech(it))) || !running) return;
      status.textContent = "Next in 3 seconds";
      if (!(await AUDIO.wait(3000)) || !running) return;
      idx++;
    }
    if (running) { running = false; play.textContent = "Play"; status.textContent = "Set finished. Press Play for the next set."; queue = []; releaseLock(); }
  }
  $view.replaceChildren(
    h("div", { class: "row", style: "justify-content:space-between" }, h("button", { class: "btn small", onclick: () => { pause(); go("study"); } }, "← Study"), h("span", { class: "label" }, "Listen mode")),
    h("h1", null, "Listen"),
    h("section", { class: "panel" }, h("div", { class: "row" }, play, skip), status, stage, h("div", { class: "row" }, got, miss),
      h("p", { class: "muted", style: "font-size:.85rem" }, "Optional: tap I got it or I missed it so the question is scheduled for review.")),
    h("section", { class: "panel" },
      h("div", { class: "label" }, "Thinking time"), seg([5, 8, 12, 20], think, v => v + " s", v => { think = v; try { localStorage.setItem("rr-think", String(v)); } catch (e) {} }),
      h("div", { class: "label" }, "Speaking speed"), seg([0.8, 1, 1.2, 1.4], AUDIO.rate, v => v + "×", v => AUDIO.setRate(v))));
  window.scrollTo(0, 0);
}

/* ---------- Memory cards ---------- */
function openCards(deck) {
  AUDIO.stop();
  ctx = { mode: "cards" };
  const now = Date.now();
  const pool = CARDS.filter(c => !deck || c.deck === deck);
  const due = pool.filter(c => !S.cards[c.id] || S.cards[c.id].due <= now);
  const queue = (due.length ? due : pool.slice().sort((a, b) => (S.cards[a.id]?.due || 0) - (S.cards[b.id]?.due || 0))).slice(0, 20);
  let i = 0, right = 0;
  const box = h("div", { style: "display:grid;gap:12px" });
  function show() {
    AUDIO.stop();
    if (i >= queue.length) {
      box.replaceChildren(h("section", { class: "panel" }, h("h2", null, "Deck done"), h("p", null, h("span", { class: "big" }, `${right}/${queue.length}`), " ", h("span", { class: "muted" }, "known")),
        h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => openCards(deck) }, "Next round"), h("button", { class: "btn", onclick: () => go("study") }, "Study"))));
      return;
    }
    const c = queue[i];
    const back = h("div", { class: "cardback", hidden: true }, h("p", { class: "cardans" }, c.back), c.tip ? h("p", { class: "muted" }, h("span", { class: "label" }, "How to remember"), h("br"), c.tip) : null);
    const reveal = h("button", { class: "btn primary", onclick: () => { back.hidden = false; reveal.hidden = true; grade.hidden = false; } }, "Show answer");
    const grade = h("div", { class: "row", hidden: true },
      h("button", { class: "btn", onclick: () => rate(false) }, "Again"),
      h("button", { class: "btn primary", onclick: () => rate(true) }, "I knew it"));
    function rate(ok) { if (ok) right++; E.srsUpdate(S.cards, c.id, ok); save(); i++; show(); }
    const say = speakButton("Listen", () => `${c.front}. ... ${c.back}. ${c.tip || ""}`);
    box.replaceChildren(h("section", { class: "panel flash" },
      h("div", { class: "row", style: "justify-content:space-between" }, h("span", { class: "label" }, c.deck), h("span", { class: "mono" }, `${i + 1} / ${queue.length}`)),
      h("p", { class: "cardfront" }, c.front), back, h("div", { class: "row" }, reveal, grade, say)));
  }
  $view.replaceChildren(
    h("div", { class: "row", style: "justify-content:space-between" }, h("button", { class: "btn small", onclick: () => { AUDIO.stop(); go("study"); } }, "← Study"), h("span", { class: "label" }, deck || "All decks")),
    h("h1", null, "Memory cards"), box);
  show();
  window.scrollTo(0, 0);
}

/* ---------- Skills ---------- */
function viewSkills() {
  const recent = S.skills.slice(-6).reverse();
  return [
    h("h1", null, "Skills practice"),
    h("p", { class: "muted" }, "Rehearse each station step by step with a partner or out loud. These are practice prompts; your program grades on the official NREMT skill sheets, so compare against those."),
    h("div", { class: "opts" }, SKILLS.map(s => {
      const runs = S.skills.filter(r => r.id === s.id);
      const lastRun = runs[runs.length - 1];
      return h("button", { class: "opt", onclick: () => openSkill(s) }, h("span", { style: "flex:1" }, h("strong", null, s.name), h("br"),
        h("span", { class: "muted", style: "font-size:.88rem" }, lastRun ? `Last run ${fmtDate(lastRun.t)} · ${lastRun.missed} missed, ${lastRun.crit} critical` : `${s.steps.length} steps · not practiced yet`)));
    })),
    recent.length ? h("section", { class: "panel" }, h("h3", null, "Recent runs"), h("div", { class: "list" }, recent.map(r => h("div", { class: "row", style: "justify-content:space-between" },
      h("span", null, SKILLS.find(s => s.id === r.id)?.name || r.id), h("span", { class: "mono" }, `${fmtDate(r.t)} · ${r.missed} missed · ${fmtTime(r.sec)}`))))) : null
  ];
}

function openSkill(s) {
  AUDIO.stop();
  ctx = { mode: "skill" };
  const checks = s.steps.map(() => false), crits = s.critical.map(() => false);
  let start = null, timerId = null, sec = 0;
  const tEl = h("span", { class: "timer" }, "0:00");
  const tick = () => { sec = Math.floor((Date.now() - start) / 1000); tEl.textContent = fmtTime(sec); };
  const tBtn = h("button", { class: "btn", onclick: () => {
    if (timerId) { clearInterval(timerId); timerId = null; tBtn.textContent = "Resume timer"; }
    else { start = Date.now() - sec * 1000; timerId = setInterval(tick, 250); tBtn.textContent = "Pause timer"; }
  } }, "Start timer");
  const stepEls = [];
  const stepList = h("div", null, s.steps.map((st, i) => { const el = h("label", { class: "chk", for: `st-${s.id}-${i}` },
    h("input", { type: "checkbox", id: `st-${s.id}-${i}`, onchange: e => checks[i] = e.target.checked }), h("span", null, h("span", { class: "mono muted" }, `${i + 1}. `), st)); stepEls.push(el); return el; }));
  const critList = h("div", null, s.critical.map((c, i) => h("label", { class: "chk", for: `cr-${s.id}-${i}` },
    h("input", { type: "checkbox", id: `cr-${s.id}-${i}`, style: "accent-color:var(--bad)", onchange: e => crits[i] = e.target.checked }), h("span", null, c))));
  const finish = () => {
    if (timerId) clearInterval(timerId); AUDIO.stop();
    const missed = checks.filter(x => !x).length, crit = crits.filter(x => x).length;
    S.skills.push({ id: s.id, t: Date.now(), missed, crit, sec, missedSteps: checks.map((c, i) => c ? null : i).filter(x => x != null) });
    save();
    ctx = null;
    $view.replaceChildren(h("h1", null, s.name), h("section", { class: "panel" },
      h("span", { class: "pill " + (crit ? "bad" : missed ? "warn" : "good") }, crit ? "Critical failure marked" : missed ? `${missed} step${missed > 1 ? "s" : ""} missed` : "All steps done"),
      missed ? h("ul", null, checks.map((c, i) => c ? null : h("li", null, s.steps[i]))) : null,
      h("p", { class: "mono" }, `Time ${fmtTime(sec)}`),
      h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => openSkill(s) }, "Run again"), h("button", { class: "btn", onclick: () => go("skills") }, "All skills"))));
    window.scrollTo(0, 0);
  };
  const walk = AUDIO.available() ? h("button", { class: "btn", onclick: async () => {
    AUDIO.stop(); await AUDIO.wait(50);
    if (!(await AUDIO.speak(`${s.name}. Say and do each step.`))) return;
    for (let i = 0; i < s.steps.length; i++) {
      stepEls[i].scrollIntoView({ block: "center", behavior: "smooth" }); stepEls[i].classList.add("now");
      const ok = await AUDIO.speak(`Step ${i + 1}. ${s.steps[i]}`);
      if (ok) await AUDIO.wait(4000);
      stepEls[i].classList.remove("now");
      if (!ok) return;
    }
    await AUDIO.speak("Finished. Check off what you did and review the critical failures.");
  } }, "Talk me through it") : null;
  $view.replaceChildren(
    h("div", { class: "row", style: "justify-content:space-between" }, h("button", { class: "btn small", onclick: () => { if (timerId) clearInterval(timerId); AUDIO.stop(); ctx = null; go("skills"); } }, "← Skills"), h("span", { class: "label" }, "Practice checklist")),
    h("h1", null, s.name),
    h("section", { class: "panel" }, h("div", { class: "row", style: "justify-content:space-between" }, tEl, h("div", { class: "row" }, tBtn, walk)),
      h("p", { class: "muted", style: "font-size:.88rem" }, "Talk through each step as you do it. A partner ticks the box when the step is done or clearly verbalized.")),
    h("section", { class: "panel" }, h("h3", null, "Steps"), stepList),
    h("section", { class: "crit" }, h("h3", { style: "color:var(--bad)" }, "Critical failures"), h("p", { class: "muted", style: "font-size:.88rem" }, "Tick any that happened. One is enough to fail a station."), critList),
    h("div", { class: "row" }, h("button", { class: "btn primary", onclick: finish }, "Finish and log run")));
  window.scrollTo(0, 0);
}

function viewProgress() {
  const ds = E.domainStats(S.hist);
  const ranked = E.DKEYS.slice().sort((a, b) => ds[b].priority - ds[a].priority);
  const topics = E.topicStats(S.hist).slice(0, 6);
  const known = Object.values(S.cards).filter(c => c.box >= 3).length;
  const confirmBox = h("div", { class: "confirm", hidden: true },
    h("p", null, "Erase all answers, review schedule, cards, exam history and skill runs? This cannot be undone."),
    h("div", { class: "row" },
      h("button", { class: "btn", style: "border-color:var(--bad);color:var(--bad)", onclick: () => { S = blank(); save(); render(); } }, "Erase everything"),
      h("button", { class: "btn", onclick: () => confirmBox.hidden = true }, "Keep my data")));
  return [
    h("h1", null, "Progress"),
    h("section", { class: "panel" }, h("h3", null, "Accuracy by domain"),
      h("p", { class: "muted", style: "font-size:.85rem" }, "Last 40 answers per domain. The orange tick marks 70%."),
      ...domainBars(ds)),
    h("section", { class: "panel" }, h("h3", null, "Where to spend time"),
      h("p", { class: "muted", style: "font-size:.85rem" }, "Ranked by exam weight × share of questions missed. High-weight domains with modest gaps outrank small domains with big gaps."),
      h("ol", { style: "margin:0;padding-left:22px;display:grid;gap:6px" }, ranked.map(d => h("li", null, h("strong", null, DOMAINS[d].name), h("span", { class: "muted" }, ` — ${ds[d].n >= 3 ? pct(ds[d].acc) + " correct" : "needs more answers"}`))))),
    topics.length ? h("section", { class: "panel" }, h("h3", null, "Weakest topics"),
      h("div", { class: "list" }, topics.map(t => h("div", { class: "row", style: "justify-content:space-between" },
        h("span", null, t.topic, h("span", { class: "muted", style: "font-size:.85rem" }, ` · ${DOMAINS[t.d].name}`)), h("span", { class: "mono" }, `${pct(t.acc)} of ${t.n}`))))) : null,
    h("section", { class: "panel" }, h("h3", null, "Memory cards"), h("p", null, h("span", { class: "big" }, known), " ", h("span", { class: "muted" }, `of ${CARDS.length} cards known well`))),
    h("section", { class: "panel foot" },
      h("h3", { style: "color:var(--ink)" }, "About"),
      h("p", null, `EMT Prep 2026 ${VERSION}. ${BANK.length} original practice questions, ${CARDS.length} memory cards and ${SKILLS.length} skills checklists · HAKOYA LLC dba Auravyx Systems · admin@hakoyallc.com.`),
      h("p", null, "Domains and weights follow the NREMT EMT Examination Specifications (2023 BLS Practice Analysis, in use since April 2025). Resuscitation content follows the 2025 AHA Guidelines for CPR and ECC. Follow your local protocols and your program's teaching where they differ."),
      h("p", null, "NREMT is a registered trademark of the National Registry of Emergency Medical Technicians. This app is not affiliated with or endorsed by the National Registry, and its questions are not taken from the exam."),
      h("div", { class: "row" }, h("button", { class: "btn small", onclick: () => { confirmBox.hidden = false; } }, "Erase my data")), confirmBox)
  ];
}

/* ---------- sessions ---------- */
function startSet(mode, items, title) {
  if (!items.length) return;
  AUDIO.stop();
  ctx = { mode, items, i: 0, right: 0, missed: [], title: title || "Review set" };
  stepSet();
}
function startDrill(d) {
  const pool = BANK.filter(i => i.d === d);
  const scored = shuffle(pool).sort((a, b) => ((S.srs[a.id]?.box ?? -1) - (S.srs[b.id]?.box ?? -1)));
  startSet("drill", scored.slice(0, 10), DOMAINS[d].name);
}
function stepSet() {
  const c = ctx;
  if (c.i >= c.items.length) return endSet();
  const item = c.items[c.i];
  const quit = h("button", { class: "btn small", onclick: endSet }, "End set");
  $view.replaceChildren(
    h("div", { class: "row", style: "justify-content:space-between" }, h("span", { class: "label" }, c.title), h("span", { class: "mono" }, `${c.i + 1} / ${c.items.length}`)),
    player(item, { feedback: true, footer: quit,
      practice: (rel, ok) => { // answer counts, then up to 3 questions on the same principle come next
        record(item, ok, c.mode); if (ok) c.right++; else c.missed.push(item.id);
        const ids = new Set(c.items.map(x => x.id));
        c.items.splice(c.i + 1, 0, ...rel.filter(r => !ids.has(r.id)).slice(0, 3));
        c.i++; stepSet(); window.scrollTo(0, 0);
      },
      onDone: ok => { record(item, ok, c.mode); if (ok) c.right++; else c.missed.push(item.id); c.i++; stepSet(); window.scrollTo(0, 0); } }));
}
function endSet() {
  const c = ctx; ctx = null; AUDIO.stop();
  const n = c.i;
  $view.replaceChildren(h("h1", null, "Set complete"),
    h("section", { class: "panel" },
      h("p", null, h("span", { class: "big" }, `${c.right}/${n}`), " ", h("span", { class: "muted" }, "correct")),
      c.missed.length ? h("p", null, `${c.missed.length} missed question${c.missed.length > 1 ? "s" : ""} will come back in about 10 minutes.`) : n ? h("p", null, "Nothing missed. These questions move to longer intervals.") : null,
      h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => startSet("review", E.reviewQueue(S, 15)) }, "Another review set"), h("button", { class: "btn", onclick: () => go("today") }, "Today"))));
}

function startExam() {
  AUDIO.stop();
  ctx = { mode: "exam", s: { items: [] }, t0: Date.now() };
  stepExam();
}
function stepExam() {
  const c = ctx;
  const elapsedS = Math.floor((Date.now() - c.t0) / 1000);
  if (E.catShouldStop(c.s) || elapsedS >= E.CAT.seconds) return endExam();
  const item = E.nextCatItem(c.s);
  const remain = h("span", { class: "mono" });
  const upd = () => { const left = Math.max(0, E.CAT.seconds - Math.floor((Date.now() - c.t0) / 1000)); remain.textContent = fmtTime(left) + " left"; if (left <= 0) endExam(); };
  upd(); clearInterval(c.tid); c.tid = setInterval(upd, 1000);
  const confirm = h("div", { class: "confirm", hidden: true }, h("p", null, "End the exam now? Answers so far will be scored."),
    h("div", { class: "row" }, h("button", { class: "btn", onclick: endExam }, "End and score"), h("button", { class: "btn", onclick: () => confirm.hidden = true }, "Keep going")));
  $view.replaceChildren(
    h("div", { class: "row", style: "justify-content:space-between" }, h("span", { class: "label" }, `Practice exam · question ${c.s.items.length + 1}`), remain),
    player(item, { feedback: false, footer: h("button", { class: "btn small", onclick: () => confirm.hidden = false }, "End exam"), onDone: ok => { E.catRecord(c.s, item, ok); record(item, ok, "exam"); stepExam(); window.scrollTo(0, 0); } }),
    confirm);
}
function endExam() {
  const c = ctx; if (!c || c.mode !== "exam") return;
  clearInterval(c.tid); ctx = null; AUDIO.stop();
  const s = c.s;
  if (!s.items.length) return go("exam");
  const by = {};
  for (const x of s.items) { const d = E.byId[x.id].d; by[d] = by[d] || { n: 0, right: 0 }; by[d].n++; if (x.ok) by[d].right++; }
  const verdict = E.catVerdict(s);
  const sec = Math.floor((Date.now() - c.t0) / 1000);
  S.exams.push({ t: Date.now(), n: s.items.length, theta: +s.theta.toFixed(3), se: +s.se.toFixed(3), verdict, by, sec });
  save();
  const missed = s.items.filter(x => !x.ok).map(x => E.byId[x.id]);
  $view.replaceChildren(h("h1", null, "Practice exam result"),
    h("section", { class: "panel" },
      h("span", { class: "pill " + verdictCls(verdict) }, verdictText(verdict)),
      h("p", { class: "mono" }, `${s.items.length} questions · ${s.items.filter(x => x.ok).length} correct · ${fmtTime(sec)}`),
      h("p", { class: "muted", style: "font-size:.85rem" }, "Like the real exam, the verdict depends on the difficulty of what you answered correctly, not only on percent correct.")),
    h("section", { class: "panel" }, h("h3", null, "By domain"),
      h("div", { class: "list" }, E.DKEYS.filter(d => by[d]).map(d => h("div", { class: "row", style: "justify-content:space-between" }, h("span", null, DOMAINS[d].name), h("span", { class: "mono" }, `${by[d].right}/${by[d].n}`))))),
    missed.length ? h("section", { class: "panel" }, h("h3", null, `Missed questions (${missed.length})`),
      h("p", { class: "muted", style: "font-size:.88rem" }, "These are now in your review set."),
      h("div", { class: "list" }, missed.map(it => h("div", null, h("p", null, h("strong", null, it.stem)), it.key ? h("p", { class: "keyline" }, it.key) : null)))) : null,
    h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => startSet("review", missed.length ? missed : E.reviewQueue(S, 15), "Exam review") }, missed.length ? "Review missed questions" : "Review set"), h("button", { class: "btn", onclick: () => go("today") }, "Today")));
  window.scrollTo(0, 0);
}

/* ---------- routing ---------- */
const VIEWS = { today: viewToday, exam: viewExam, study: viewStudy, skills: viewSkills, progress: viewProgress };
function render() {
  document.querySelectorAll("nav.tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.tab === tab ? "page" : "false"));
  $view.replaceChildren(...VIEWS[tab]().filter(Boolean));
}
function go(t) {
  if (ctx && ctx.mode === "exam") clearInterval(ctx.tid);
  AUDIO.stop();
  ctx = null; tab = t; render(); window.scrollTo(0, 0);
}
document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => go(b.dataset.tab)));
const start = (location.hash || "").slice(1);
if (VIEWS[start]) tab = start;
render();
})();
