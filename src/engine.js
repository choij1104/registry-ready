/* Registry Ready — engine: grading, ability estimate, adaptive selection, spaced review, weak-domain analysis.
   Pure functions; no DOM. */

const ENGINE = (() => {
  const DKEYS = Object.keys(DOMAINS);
  const target = d => (DOMAINS[d].lo + DOMAINS[d].hi) / 2 / 100;
  const byId = Object.fromEntries(BANK.map(i => [i.id, i]));

  /* ---- grading: dichotomous, like the real exam ---- */
  function grade(item, resp) {
    if (resp == null) return false;
    if (item.type === "mc") return resp === item.ans;
    if (item.type === "mr") {
      const a = [...item.ans].sort().join(","), r = [...resp].sort().join(",");
      return a === r;
    }
    if (item.type === "order") return resp.every((v, i) => v === i) && resp.length === item.opts.length;
    if (item.type === "table") return item.rows.every((row, i) => resp[i] === row[1]);
    return false;
  }

  /* ---- Rasch ability estimate (EAP, N(0,1) prior) ---- */
  const GRID = []; for (let t = -4; t <= 4.0001; t += 0.05) GRID.push(t);
  function eap(responses) { // [{b, ok}]
    let w = GRID.map(t => Math.exp(-t * t / 2));
    for (const r of responses) {
      w = w.map((v, k) => { const p = 1 / (1 + Math.exp(-(GRID[k] - r.b))); return v * (r.ok ? p : 1 - p); });
      const s = w.reduce((a, c) => a + c, 0); w = w.map(v => v / s);
    }
    const s = w.reduce((a, c) => a + c, 0);
    const mean = GRID.reduce((a, t, k) => a + t * w[k], 0) / s;
    const v = GRID.reduce((a, t, k) => a + (t - mean) ** 2 * w[k], 0) / s;
    return { theta: mean, se: Math.sqrt(v) };
  }

  /* ---- adaptive practice exam ---- */
  const CAT = { min: 70, max: 120, cut: 0, z: 1.96, seconds: 7200 };
  function nextCatItem(session, rand = Math.random) {
    const used = new Set(session.items.map(x => x.id));
    const n = session.items.length;
    const counts = Object.fromEntries(DKEYS.map(d => [d, 0]));
    session.items.forEach(x => counts[byId[x.id].d]++);
    const order = DKEYS.map(d => ({ d, def: target(d) * (n + 1) - counts[d] })).sort((a, b) => b.def - a.def);
    const theta = session.theta ?? 0;
    for (const { d } of order) {
      const pool = BANK.filter(i => i.d === d && !used.has(i.id));
      if (!pool.length) continue;
      pool.sort((a, b) => Math.abs(a.b - theta) - Math.abs(b.b - theta));
      const top = pool.slice(0, Math.min(3, pool.length));
      return top[Math.floor(rand() * top.length)];
    }
    return null;
  }
  function catRecord(session, item, ok) {
    session.items.push({ id: item.id, ok });
    const est = eap(session.items.map(x => ({ b: byId[x.id].b, ok: x.ok })));
    session.theta = est.theta; session.se = est.se;
    return est;
  }
  function catShouldStop(session) {
    const n = session.items.length;
    if (n >= CAT.max) return "max";
    if (n >= CAT.min) {
      const lo = session.theta - CAT.z * session.se, hi = session.theta + CAT.z * session.se;
      if (lo > CAT.cut || hi < CAT.cut) return "confident";
    }
    if (!nextCatItem(session, () => 0)) return "bank";
    return null;
  }
  function catVerdict(session) {
    const lo = session.theta - CAT.z * session.se, hi = session.theta + CAT.z * session.se;
    if (lo > CAT.cut) return "above";
    if (hi < CAT.cut) return "below";
    return session.theta >= CAT.cut ? "near-above" : "near-below";
  }

  /* ---- spaced review (Leitner boxes) ---- */
  const DAY = 86400000;
  const INTERVAL = [0, 0, 1, 3, 7, 16, 35]; // days, index = box (1..6)
  function srsUpdate(srs, id, ok, now = Date.now()) {
    const c = srs[id] || { box: 0, due: now, seen: 0, right: 0 };
    c.seen++; if (ok) c.right++;
    c.box = ok ? Math.min(6, Math.max(1, c.box) + 1) : 1;
    c.due = now + (ok ? INTERVAL[c.box] * DAY : 10 * 60000); // missed: back in 10 minutes
    srs[id] = c;
    return c;
  }
  function dueItems(srs, now = Date.now()) {
    return Object.entries(srs).filter(([id, c]) => c.due <= now && byId[id]).sort((a, b) => a[1].due - b[1].due).map(([id]) => byId[id]);
  }

  /* ---- weak-domain analysis ---- */
  function domainStats(hist, window = 40) {
    const out = {};
    for (const d of DKEYS) {
      const rows = hist.filter(h => byId[h.id] && byId[h.id].d === d).slice(-window);
      const n = rows.length, right = rows.filter(r => r.ok).length;
      const acc = n ? right / n : null;
      const accForPriority = n >= 3 ? acc : 0.5;
      out[d] = { n, right, acc, weight: target(d), priority: target(d) * (1 - accForPriority), bank: BANK.filter(i => i.d === d).length };
    }
    return out;
  }
  function topicStats(hist) {
    const t = {};
    for (const h of hist) {
      const it = byId[h.id]; if (!it) continue;
      const k = it.d + "|" + it.topic;
      t[k] = t[k] || { d: it.d, topic: it.topic, n: 0, right: 0 };
      t[k].n++; if (h.ok) t[k].right++;
    }
    return Object.values(t).filter(x => x.n >= 2).map(x => ({ ...x, acc: x.right / x.n })).sort((a, b) => a.acc - b.acc);
  }
  function overallAbility(hist, last = 150) {
    const rows = hist.slice(-last).filter(h => byId[h.id]).map(h => ({ b: byId[h.id].b, ok: h.ok }));
    return rows.length ? { ...eap(rows), n: rows.length } : null;
  }

  /* ---- build a smart review queue: due first, then unseen items from the weakest domain ---- */
  function reviewQueue(state, size = 15, now = Date.now()) {
    const q = dueItems(state.srs, now).slice(0, size);
    if (q.length < size) {
      const ds = domainStats(state.hist);
      const ranked = DKEYS.slice().sort((a, b) => ds[b].priority - ds[a].priority);
      const seen = new Set(Object.keys(state.srs));
      const inQ = new Set(q.map(i => i.id));
      for (const d of ranked) {
        for (const it of BANK.filter(i => i.d === d && !seen.has(i.id) && !inQ.has(i.id)).sort((a, b) => a.b - b.b)) {
          if (q.length >= size) break;
          q.push(it); inQ.add(it.id);
        }
      }
      if (q.length < size) { // everything seen: earliest-due next
        const rest = Object.entries(state.srs).filter(([id]) => !inQ.has(id) && byId[id]).sort((a, b) => a[1].due - b[1].due);
        for (const [id] of rest) { if (q.length >= size) break; q.push(byId[id]); }
      }
    }
    return q;
  }

  function related(item) { return BANK.filter(i => i.concept && i.concept === item.concept && i.id !== item.id); }

  return { related, DKEYS, target, byId, grade, eap, CAT, nextCatItem, catRecord, catShouldStop, catVerdict, srsUpdate, dueItems, domainStats, topicStats, overallAbility, reviewQueue };
})();
