// Writes items without keys/explanations for a blind solve. Usage: node blind_export.js out.json
const fs = require("fs");
const out = [];
for (const p of ["SC", "PA1", "PA2", "SA", "TT", "OP"]) {
  for (const i of JSON.parse(fs.readFileSync(__dirname + "/" + p + ".json", "utf8"))) {
    if (i.type === "mc" || i.type === "mr") out.push({ id: i.id, type: i.type, stem: i.stem, opts: i.opts });
    else if (i.type === "table") out.push({ id: i.id, type: i.type, stem: i.stem, cols: i.cols, rows: i.rows.map(r => r[0]) });
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(out.length, "items exported");
