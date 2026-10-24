# Registry Ready

Practice for the NREMT EMT cognitive exam and psychomotor skills. Published by HAKOYA LLC.

- **Adaptive practice exam** — Rasch/EAP ability estimate; items drawn in the proportions of the
  NREMT EMT test plan (2023 BLS Practice Analysis, in use since April 2025); 30–60 items; stops
  when the 95% interval clears the practice cut.
- **Spaced review** — Leitner boxes; missed items return in 10 minutes, correct ones at 1/3/7/16/35 days.
- **Weak-domain analysis** — exam weight × share missed; weakest topics.
- **Skills checklists** — nine stations with critical failures, timer and run log.

108 original items. None are taken from the NREMT item pool. Resuscitation content follows the
2025 AHA Guidelines for CPR and ECC.

## Layout
- `src/` — `bank.js` (items), `engine.js` (grading, CAT, spaced review, analysis), `skills.js`,
  `ui.js`, `template.html`
- `build.py` — assembles `index.html` (the web app, also the Claude artifact page)
- `privacy.html` — privacy policy (GitHub Pages)
- `android/` — Google Play build; see `android/PLAY.md`
- `tools/` — icon and screenshot generators

## Build
    python3 build.py

NREMT is a registered trademark of the National Registry of Emergency Medical Technicians.
This app is not affiliated with or endorsed by the National Registry.
