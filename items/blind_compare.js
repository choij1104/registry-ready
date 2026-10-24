// Compares a blind-solve answer file with the keys. Usage: node blind_compare.js answers.json
const fs = require("fs");
const ans = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const key = {};
for (const p of ["SC", "PA1", "PA2", "SA", "TT", "OP"]) for (const i of JSON.parse(fs.readFileSync(__dirname + "/" + p + ".json", "utf8"))) key[i.id] = i;
let n = 0, miss = [];
for (const [id, a] of Object.entries(ans)) {
  const i = key[id]; if (!i) continue; n++;
  const want = i.type === "mc" ? i.ans : i.type === "mr" ? [...i.ans].sort() : i.rows.map(r => r[1]);
  const got = Array.isArray(a) && i.type === "mr" ? [...a].sort() : a;
  if (JSON.stringify(want) !== JSON.stringify(got)) miss.push({ id, want, got });
}
console.log(`${n} compared, ${miss.length} disagree`);
for (const m of miss) console.log(`${m.id}: key ${JSON.stringify(m.want)} blind ${JSON.stringify(m.got)}`);
