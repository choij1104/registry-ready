// Validates an item JSON file against SPEC.md. Usage: node validate.js file.json [file2.json ...]
const fs = require("fs");
const D = ["SCENE", "PRIMARY", "SECONDARY", "TREAT", "OPS"];
const B = [-1.5, -1, -0.5, 0, 0.5, 1, 1.5];
const SRC = ["AHA", "STD", "START", "ERG", "FTG", "SMR", "NRP"];
let total = 0, errs = 0;
const seenIds = new Set();
for (const f of process.argv.slice(2)) {
  let arr;
  try { arr = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { console.log(`${f}: JSON parse error: ${e.message}`); errs++; continue; }
  if (!Array.isArray(arr)) { console.log(`${f}: not an array`); errs++; continue; }
  const types = {}, topics = {}, ansPos = [0, 0, 0, 0, 0, 0];
  for (const [i, it] of arr.entries()) {
    const e = m => { console.log(`${f} #${i} ${it.id || "?"}: ${m}`); errs++; };
    if (!it.id || typeof it.id !== "string") e("missing id");
    if (seenIds.has(it.id)) e("duplicate id"); seenIds.add(it.id);
    if (!D.includes(it.d)) e("bad d");
    if (!it.topic) e("missing topic");
    if (!it.concept || !/^[a-z0-9-]+$/.test(it.concept)) e("concept must be kebab-case");
    if (!B.includes(it.b)) e("bad b");
    if (!SRC.includes(it.src)) e("bad src " + it.src);
    if (!it.stem || it.stem.split(/\s+/).length > 110) e("stem missing or too long");
    if (!it.key || it.key.length > 160) e("key missing or too long");
    if (!it.why) e("missing why");
    types[it.type] = (types[it.type] || 0) + 1; topics[it.topic] = (topics[it.topic] || 0) + 1;
    if (it.type === "mc") {
      if (!Array.isArray(it.opts) || it.opts.length !== 4) e("mc needs 4 opts");
      if (!Number.isInteger(it.ans) || it.ans < 0 || it.ans > 3) e("mc ans must be 0-3"); else ansPos[it.ans]++;
    } else if (it.type === "mr") {
      if (!Array.isArray(it.opts) || ![5, 6].includes(it.opts.length)) e("mr needs 5 or 6 opts");
      const need = it.opts && it.opts.length === 5 ? 2 : 3;
      if (!Array.isArray(it.ans) || it.ans.length !== need || new Set(it.ans).size !== need || it.ans.some(a => a < 0 || a >= it.opts.length)) e(`mr ans must be ${need} distinct indices`);
      if (!/select (two|three)/i.test(it.stem)) e("mr stem must say Select TWO/THREE");
    } else if (it.type === "order") {
      if (!Array.isArray(it.opts) || it.opts.length < 4 || it.opts.length > 7) e("order needs 4-7 steps");
    } else if (it.type === "table") {
      if (!Array.isArray(it.cols) || it.cols.length < 2 || it.cols.length > 4) e("table needs 2-4 cols");
      if (!Array.isArray(it.rows) || it.rows.length < 3 || it.rows.length > 5) e("table needs 3-5 rows");
      else if (it.rows.some(r => !Array.isArray(r) || typeof r[0] !== "string" || !Number.isInteger(r[1]) || r[1] < 0 || r[1] >= it.cols.length)) e("bad row");
    } else e("bad type");
    if (it.type === "mc" || it.type === "mr") {
      if (!Array.isArray(it.wrong) || it.wrong.length !== (it.opts || []).length) e("wrong[] must match opts length");
      else {
        const keyed = it.type === "mc" ? [it.ans] : it.ans || [];
        it.wrong.forEach((w, k) => { if (keyed.includes(k) && w) e(`wrong[${k}] should be empty for keyed option`); if (!keyed.includes(k) && !w) e(`wrong[${k}] missing reason`); });
      }
      if (/all of the above|none of the above/i.test((it.opts || []).join("|"))) e("all/none of the above");
    }
  }
  total += arr.length;
  console.log(`${f}: ${arr.length} items; types ${JSON.stringify(types)}; mc answer positions ${JSON.stringify(ansPos.slice(0, 4))}`);
  console.log(`  topics ${JSON.stringify(topics)}`);
}
console.log(`TOTAL ${total} items, ${errs} errors`);
process.exit(errs ? 1 : 0);
