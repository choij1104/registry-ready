# Registry Ready — item writing spec (v2 bank)

You are writing ORIGINAL practice items for the NREMT **EMT** cognitive exam. The author of record is
Jae H. Choi, PhD, DVSc (emergency medicine researcher). Accuracy matters more than volume: if you are not
certain an answer is correct under current national guidance, do not write that item.

## What the real exam is like (NREMT EMT Examination Specifications, in use since April 2025)
Domains: Scene Size-up and Safety 15–19%, Primary Assessment 39–43%, Secondary Assessment 5–9%,
Patient Treatment and Transport 20–24%, Operations 10–14%. Computer adaptive; items test clinical
judgment in realistic situations, not recall of acronyms. Item types: multiple choice (1 of 4),
multiple response (2 of 5 or 3 of 6), build list (ordering), options table / drag-and-drop
(classify rows). All scored all-or-nothing.

## Item standard
1. **Scenario-based.** At least 85% of items put the candidate in a situation: patient age/sex, setting,
   what you see/hear, vital signs where relevant (BP, HR, RR, SpO2, skin, mental status, glucose when
   relevant). Ask what the EMT should do / suspect / prioritize next. Pure recall items are allowed only
   for genuinely testable facts (≤15%), and even those should be framed in a situation where possible.
2. **Single best answer.** Exactly one option is defensibly best (or exactly the keyed set for multiple
   response). Distractors must be plausible actions a weak candidate would choose — the right action at
   the wrong time, a correct intervention for a different problem, an over- or under-treatment.
   Options similar in length and grammar. Never "all of the above", "none of the above", or giveaway
   absolutes. Negative stems ("Which is NOT…") at most 1 in 20, with NOT capitalized.
3. **EMT scope only** (National EMS Scope of Practice Model, EMT level): oxygen, BVM, OPA/NPA, suction,
   CPAP, AED, manual airway maneuvers, hemorrhage control incl. tourniquet and wound packing, splinting incl.
   traction, spinal motion restriction, oral glucose, aspirin, assisting with the patient's own
   nitroglycerin and prescribed metered-dose inhaler, epinephrine auto-injector, naloxone, childbirth
   assistance. No IV/IO, no ALS drugs, no advanced airways, no ECG interpretation, no needle decompression.
4. **Current guidance.** Resuscitation follows the **2025 AHA Guidelines for CPR and ECC**:
   adult compressions 100–120/min, depth 2–2.4 in, full recoil, minimize pauses; 30:2 single rescuer,
   15:2 two-rescuer child/infant; pulse + breathing check ≤10 s; rescue breathing with a pulse: adult 1 breath
   every 6 s, infant/child 1 every 2–3 s; each breath over ~1 s with visible chest rise; resume compressions
   immediately after a shock; pediatric pads/attenuator when available, otherwise adult pads not touching.
   **Choking (2025):** adult and child — repeated cycles of 5 back blows then 5 abdominal thrusts; chest thrusts
   for late pregnancy or when you cannot encircle the abdomen; infant — 5 back blows then 5 chest thrusts
   (heel of one hand), no abdominal thrusts; unresponsive — start CPR, look in the mouth before breaths, remove
   only a visible object. **Infant compressions (2025):** heel of one hand or two-thumb encircling; the
   two-finger technique is no longer recommended. Opioid-associated emergency: support ventilation first;
   naloxone in addition. Oxygen for suspected ACS only if SpO2 < 90–94% / dyspnea / shock (do not key an
   item on giving O2 to a well-saturated, comfortable ACS patient).
   Spinal motion restriction: 2018 ACS-COT/ACEP/NAEMSP joint position statement (SMR, not routine long-board
   immobilization; indications: altered mental status/intoxication, midline spinal tenderness, focal neuro
   deficit, anatomic deformity of the spine, distracting injury; penetrating trauma alone is not an indication).
   Newborn: warm, dry, stimulate, position airway; suction only if obstructed; begin PPV if apneic/gasping or
   HR < 100 after initial steps; compressions (3:1) if HR < 60 despite 30 s of effective ventilation.
   Field triage: 2021 National Guideline for the Field Triage of Injured Patients.
5. **Avoid protocol-dependent keys.** If the correct answer depends on a number or practice that varies by
   local protocol (exact nitro BP cutoff, glucose cutoff, specific transport times), do not make that the
   discriminating point. Where it matters, phrase "per protocol / medical direction".
6. **Originality.** Write every item from scratch. Do not reproduce or paraphrase items from the NREMT,
   any textbook, any commercial question bank, or any website. Do not use real people's names.
7. **Language.** Plain US English, generic drug names, US units (lb/in where natural, mg, mm Hg). Stems
   ≤ 90 words. Options ≤ 25 words each.

## JSON schema (write a JSON array to your output file)
```json
{
  "id": "PA1-001",
  "d": "PRIMARY",
  "topic": "Airway",
  "concept": "ventilate-before-naloxone",
  "b": 0.5,
  "type": "mc",
  "stem": "…",
  "opts": ["…","…","…","…"],
  "ans": 1,
  "key": "One sentence, ≤140 characters: the principle the item tests.",
  "why": "2–3 sentences: why the keyed answer is best.",
  "wrong": ["why A is wrong", "", "why C is wrong", "why D is wrong"],
  "src": "AHA"
}
```
- `d`: SCENE | PRIMARY | SECONDARY | TREAT | OPS (as assigned).
- `topic`: one of the topics listed for your part (exact spelling).
- `concept`: short kebab-case id of the principle. Write 2–4 items per concept from different angles
  (different patient, setting, or item type) so a learner who misses one can practice the same principle.
- `b`: difficulty, one of -1.5, -1, -0.5, 0, 0.5, 1, 1.5. Aim for roughly: 15% ≤ -1, 35% -0.5..0, 35% 0.5..1, 15% 1.5.
- `type`:
  - `mc`: `opts` 4, `ans` integer index.
  - `mr`: `opts` 5 (2 correct) or 6 (3 correct); `ans` array of indices; stem says "Select TWO" / "Select THREE".
  - `order`: `opts` 4–7 steps listed in the CORRECT order (the app shuffles them); omit `ans` and `wrong`.
  - `table`: omit `opts`/`ans`/`wrong`; give `cols` (2–4 category labels) and `rows` ([text, colIndex], 3–5 rows).
- `wrong`: same length as `opts`; "" for keyed options; a specific, accurate reason for every other option.
- `src`: AHA (2025 AHA CPR/ECC) | STD (National EMS Education Standards / Scope of Practice, EMT) |
  START (START/JumpSTART) | ERG (Emergency Response Guidebook) | FTG (2021 Field Triage Guideline) |
  SMR (2018 joint SMR statement) | NRP (neonatal resuscitation, AHA/AAP 2025).
- Mix: about 78% mc, 10% mr, 6% order, 6% table.
- Spread the keyed `ans` index across 0–3.

## Finish
Validate with: `node /home/claude/registry-ready/items/validate.js <your-file>` and fix every error.
Report: file path, item count, counts by type and by topic, and any item you removed for uncertainty.
