# EMT Prep 2026: Exam & Skills

(Repository and application ID keep the original working name, Registry Ready.)

Practice for the NREMT EMT cognitive exam and psychomotor skills. Published by HAKOYA LLC.

- **Adaptive practice exam** — Rasch/EAP ability estimate; items drawn in the proportions of the
  NREMT EMT test plan (2023 BLS Practice Analysis, in use since April 2025); 70–120 items,
  2-hour limit; stops when the 95% interval clears the practice cut.
- **Spaced review** — Leitner boxes; missed items return in 10 minutes, correct ones at 1/3/7/16/35 days.
- **Weak-domain analysis** — exam weight × share missed; weakest topics.
- **Skills checklists** — nine stations with critical failures, timer and run log.
- **Listen mode** — questions, choices and answers read aloud (native TTS on Android).
- **Memory cards** — 51 cards with a memory hook each.

250 original items. None are taken from the NREMT item pool. Resuscitation content follows the
2025 AHA Guidelines for CPR and ECC.

## Layout
- `src/` — `domains.js`, `cards.js`, `audio.js`, `engine.js` (grading, CAT, spaced review, analysis), `skills.js`,
  `ui.js`, `template.html`
- `items/` — item bank JSON (250 items), spec, validators
- `build.py` — assembles `index.html` (the web app, also the Claude artifact page)
- `privacy.html` — privacy policy (GitHub Pages)
- `android/` — Google Play build; see `android/PLAY.md`
- `tools/` — icon and screenshot generators

## Build
    python3 build.py

NREMT is a registered trademark of the National Registry of Emergency Medical Technicians.
EMT Prep 2026 is not affiliated with or endorsed by the National Registry.
