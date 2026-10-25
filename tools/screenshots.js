// Play Store screenshots of the store build (android/www) with example progress data.
// Usage: node tools/screenshots.js <path-to-puppeteer-dir>
const path = require("path");
const base = process.argv[2];
const chromium = require(path.join(base, "node_modules/@sparticuz/chromium"));
const pp = require(path.join(base, "node_modules/puppeteer-core"));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "android/listing/screenshots");
const url = "file://" + path.join(ROOT, "android/www/index.html");

// Example progress: ~140 answers, accuracy by domain, one practice exam, two skill runs.
function seed() {
  const fs = require("fs");
  const items = ["SC", "PA1", "PA2", "SA", "TT", "OP"].flatMap(p => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, "items", p + ".json"), "utf8")); } catch (e) { return []; } });
  const acc = { SCENE: 0.82, PRIMARY: 0.71, SECONDARY: 0.9, TREAT: 0.58, OPS: 0.86 };
  const now = Date.now(), DAY = 86400000;
  const hist = [], srs = {};
  let k = 0, r = 7;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (const it of items.filter((_, i) => i % 2 === 0)) {
    const ok = rnd() < acc[it.d];
    hist.push({ id: it.id, ok, t: now - (200 - k++) * 3600000, m: "review" });
    srs[it.id] = { box: ok ? 3 : 1, due: ok ? now + 3 * DAY : now - 60000, seen: 1, right: ok ? 1 : 0 };
  }
  return { v: 1, srs, hist, cards: {}, exams: [{ t: now - DAY, n: 84, theta: 0.42, se: 0.24, verdict: "near-above", by: {}, sec: 5110 }],
    skills: [{ id: "arrest", t: now - 2 * DAY, missed: 1, crit: 0, sec: 412, missedSteps: [10] }, { id: "trauma", t: now - DAY, missed: 3, crit: 0, sec: 598, missedSteps: [4, 13, 22] }], updated: now };
}

(async () => {
  const b = await pp.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: true });
  const shots = [
    { name: "1-today", theme: "light", go: async p => {} },
    { name: "2-feedback", theme: "light", go: async p => {
      await click(p, "Study"); await click(p, "Patient Treatment and Transport");
      await p.evaluate(() => { const v = document.getElementById("view"); const m = v.textContent.match(/Select (two|three)/); const o = [...v.querySelectorAll(".opt")]; o.slice(0, m ? (m[1] === "two" ? 2 : 3) : 1).forEach(x => x.click()); [...v.querySelectorAll(".seg")].forEach(sg => sg.querySelector("button").click()); });
      await click(p, "Submit");
      await p.evaluate(() => document.querySelector("#view .stem").scrollIntoView({ block: "start" })); } },
    { name: "3-exam", theme: "dark", go: async p => {
      await click(p, "Exam"); await click(p, "Start practice exam");
      for (let i = 0; i < 4; i++) {
        const isMc = await p.evaluate(() => document.querySelectorAll("#view .opt").length === 4 && !/Select (two|three)/.test(document.getElementById("view").textContent));
        if (isMc && i > 0) break;
        await p.evaluate(() => { const segs = [...document.querySelectorAll("#view .seg")]; segs.forEach(s => s.querySelector("button").click()); const o = document.querySelector("#view .opt"); if (o) o.click(); [...document.querySelectorAll("#view button")].find(x => x.textContent === "Submit").click(); });
      }
      await p.evaluate(() => { const o = [...document.querySelectorAll("#view .opt")]; if (o[0]) o[0].click(); }); } },
    { name: "4-cards", theme: "light", go: async p => { await click(p, "Study"); await click(p, "CPR"); await click(p, "Show answer"); } },
    { name: "6-progress", theme: "light", go: async p => { await click(p, "Progress"); } },
    { name: "5-skills", theme: "dark", go: async p => {
      await click(p, "Skills"); await click(p, "Cardiac Arrest Management / AED");
      await p.evaluate(() => [...document.querySelectorAll("#view input[type=checkbox]")].slice(0, 5).forEach(c => c.click()));
      await p.evaluate(() => document.querySelector("#view h1").scrollIntoView({ block: "start" })); } },
  ];
  for (const s of shots) {
    const p = await b.newPage();
    await p.emulateMediaFeatures([{ name: "prefers-color-scheme", value: s.theme }]);
    await p.setViewport({ width: 400, height: 800, deviceScaleFactor: 2.7 });
    await p.evaluateOnNewDocument(st => { try { localStorage.setItem("registry-ready-v1", JSON.stringify(st)); } catch (e) {} }, seed());
    await p.goto(url, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await s.go(p);
    await new Promise(r => setTimeout(r, 300));
    await p.screenshot({ path: path.join(OUT, s.name + ".png") });
    await p.close();
  }
  // feature graphic 1024x500
  const p = await b.newPage();
  await p.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
  const icon = "file://" + path.join(ROOT, "icon-512.png");
  const fonts = "file://" + path.join(ROOT, "android/www/fonts/");
  const fgFile = path.join(ROOT, "android/www/_feature.html");
  require("fs").writeFileSync(fgFile, `<html><head><style>
    @font-face{font-family:BC;src:url(${fonts}barlow-condensed-latin-800-normal.woff2)}
    @font-face{font-family:AH;src:url(${fonts}atkinson-hyperlegible-latin-400-normal.woff2)}
    body{margin:0;width:1024px;height:500px;background:#16324A;color:#F2F6F7;font-family:AH;position:relative;overflow:hidden}
    .chev{position:absolute;left:0;right:0;bottom:70px;height:46px;background:repeating-linear-gradient(-45deg,#D9480F 0 30px,#F4C430 30px 60px)}
    .t{position:absolute;left:300px;top:118px;font-family:BC;font-size:96px;letter-spacing:3px;text-transform:uppercase;line-height:.95}
    .s{position:absolute;left:304px;top:236px;font-size:26px;opacity:.9}
    img{position:absolute;left:64px;top:78px;width:200px;height:200px;border-radius:28px}
  </style></head><body><img src="${icon}"><div class="t">EMT Prep 2026</div><div class="s">EMT exam practice · adaptive · offline</div><div class="chev"></div></body></html>`);
  await p.goto("file://" + fgFile, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(ROOT, "android/listing/feature-1024x500.png") });
  require("fs").unlinkSync(fgFile);
  await b.close();
  console.log("screenshots done");
})().catch(e => { console.error(e); process.exit(1); });

async function click(p, text) {
  const ok = await p.evaluate(t => { const all = [...document.querySelectorAll("button")]; const el = all.find(b => b.textContent.trim() === t) || all.find(b => b.textContent.trim().startsWith(t)); if (el) el.click(); return !!el; }, text);
  if (!ok) throw new Error("button not found: " + text);
  await new Promise(r => setTimeout(r, 150));
}
