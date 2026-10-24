// Reports option-length cues. Usage: node lengthcheck.js file.json
// Goal per file: keyed option is the strictly longest in at most 25% of mc items, and in mr items
// the keyed options are not on average much longer than the unkeyed ones.
const fs = require("fs");
for (const f of process.argv.slice(2)) {
  const a = JSON.parse(fs.readFileSync(f, "utf8"));
  const mc = a.filter(i => i.type === "mc");
  const flagged = mc.filter(i => { const L = i.opts.map(o => o.length); return L[i.ans] === Math.max(...L) && L.filter(x => x === L[i.ans]).length === 1; });
  const ratio = mc.length ? flagged.length / mc.length : 0;
  console.log(`${f}: key strictly longest in ${flagged.length}/${mc.length} mc (${Math.round(ratio * 100)}%) — target ≤25%`);
  for (const i of flagged) console.log(`  ${i.id}: ${i.opts.map((o, k) => (k === i.ans ? "*" : "") + o.length).join(" / ")}`);
  for (const i of a.filter(i => i.type === "mr")) {
    const k = i.ans.map(x => i.opts[x].length), u = i.opts.filter((_, x) => !i.ans.includes(x)).map(o => o.length);
    const avg = v => v.reduce((s, x) => s + x, 0) / v.length;
    if (avg(k) > avg(u) * 1.25) console.log(`  ${i.id} (mr): keyed avg ${Math.round(avg(k))} vs others ${Math.round(avg(u))}`);
  }
}
