# REVIEW_PA1: independent clinical review of PA1.json

Reviewed: 51 items (PA1-001 to PA1-051): 39 mc, 5 mr, 3 order, 4 table. Deleted: 0.
Keys changed: 0. Clinical content changes: 6 items. Option wording rebalanced for length cue: 37 items. Meaning of every key is unchanged.
Validator: `node validate.js PA1.json` reports 51 items, 0 errors.

## Clinical changes
| id | problem | fix |
|---|---|---|
| PA1-018 | `wrong[1]` said an OPA would trigger vomiting "in a patient with a gag reflex", but the stem does not say whether he has a gag reflex. | Reworded: a patient who is actively vomiting probably has a gag reflex, and an OPA would provoke it further. |
| PA1-019 | Removing "or he becomes unresponsive" from the key (length fix) dropped the end point of the FBAO sequence. | Added to `why`: if he becomes unresponsive, start CPR (2025 AHA adult FBAO algorithm). |
| PA1-042 | Distractor 3, "recheck SpO2 in 10 min", was weak. | Changed to "recheck on another finger in 10 min" and updated `wrong[3]`: every finger reads falsely normal with CO. |
| PA1-045 | `why` did not say what to do with oxygen after ventilation is assisted in a CO2-retaining COPD patient. | Added: titrate oxygen to the protocol target instead of leaving it at maximum. Key unchanged (assist with BVM; never remove oxygen). |
| PA1-050 | `why` did not say when a bradycardic child needs compressions. | Added the 2025 AHA pediatric rule: start CPR if HR stays < 60 with poor perfusion despite effective ventilation. The stem's HR of 70 keeps ventilation as the correct answer. |
| PA1-012 | Distractor 0 was made more specific ("harder and faster"). | Updated `wrong[0]` to cover rate and force. |

## Length-cue rebalancing (no change in meaning)
Keys were shortened and distractors made equally specific in: 001, 004, 005, 010, 011, 012, 014, 015, 017, 018, 019, 021, 022, 023, 025, 026, 028, 029, 030, 033, 035, 036, 038, 040, 042, 044, 045, 046, 048, 050, 051, and mr 039. Each edited distractor still matches its `wrong[]` reason. The edits leave no new length cue in the other direction: the key is now the shortest option in only 3 of 39 mc items.

- Before: key strictly longest in 31/39 mc (79%), and mr PA1-039 was flagged (keyed avg 67 vs 50).
- **After: key strictly longest in 0/39 mc (0%), with no mr item flagged.**

## Items passed on clinical content (wording-only edits, or none)
001–011, 013–017, 020–041, 043, 044, 046–049, 051. Each has one defensible key (or exactly the keyed set), accurate `wrong` reasons, EMT-scope actions only, realistic vitals, and no key that depends on a local protocol number. Oxygen targets and naloxone dosing are left to "per protocol".

## Facts verified against sources
- **2025 AHA FBAO (PA1-019 to 022):** adult and child severe obstruction: repeated cycles of 5 back blows then 5 abdominal thrusts. Late pregnancy or when you cannot encircle the abdomen: chest thrusts instead. Mild obstruction: encourage coughing. Unresponsive: start CPR and check the mouth for a visible object before breaths. Infant: 5 back blows plus 5 chest thrusts with the heel of one hand, no abdominal thrusts. Sources: AHA 2025 Adult FBAO algorithm (cpr.heart.org, Algorithm-BLS-Adult-FBAO-250630); AHA 2025 "Top Things to Know"; AHA 2025 highlights PDF (heart.org); Contemporary Pediatrics summary of the 2025 update (infant heel of hand).
- **Rescue breathing with a pulse (PA1-031, 032, 050):** adult 1 breath every 6 s (10/min), with naloxone if opioid overdose is suspected (AHA 2025 Adult BLS Healthcare Provider algorithm text). Child 1 breath every 2–3 s (20–30/min); CPR if HR < 60 with poor perfusion despite ventilation (AHA 2025 Pediatric BLS 2-rescuer algorithm).
- **BVM technique (PA1-028, 029, 030):** visible chest rise; avoid both too large and too many breaths (AHA 2025 highlights). Breaths of about 1 s per SPEC/AHA.
- **Opioid emergency (PA1-033, 034):** support ventilation first; naloxone in addition and must not interfere with standard care (AHA 2025 algorithm and highlights).
- **NPA/OPA (PA1-014 to 016):** NPA is contraindicated or avoided with suspected basilar skull or midface fracture (RPPEO Medic Ask, citing Atanelov 2024). NPA is sized from the nose tip to the earlobe and lubricated with water-soluble gel. An OPA is used only without a gag reflex. Jaw thrust for suspected spinal injury; switch to head tilt-chin lift if the jaw thrust fails (AHA BLS).
- **CPAP (PA1-036, 037, 045):** indicated for moderate to severe distress from pulmonary edema in an alert patient. Contraindicated with altered mental status or inability to protect the airway, hypotension, respiratory arrest, vomiting or facial trauma (SF EMSA Policy 7.02, June 2026). CPAP is in the EMT scope per the National EMS Scope of Practice Model and SPEC.
- **Oxygen, COPD, SpO2 and CO (PA1-040 to 045):** never withhold oxygen from a hypoxic COPD patient; titrate it to the protocol target. Standard oximetry reads carboxyhemoglobin as oxygenated, so the SpO2 is falsely normal. Poor peripheral perfusion gives unreliable readings.
- **PAT, croup vs epiglottitis, infant airway (PA1-023, 046 to 051):** PAT components are appearance, work of breathing and circulation to skin. Epiglottitis: sudden high fever, drooling, tripod position, soft stridor; do not examine the throat. Croup: barking cough, stridor with agitation. Infant airway: shoulder roll for a neutral position; young infants are preferential nose breathers.
- **GCS (PA1-008, 009) recomputed:** E2 + V2 + M4 = 8; E3 + V4 + M6 = 13. Both correct.

## Notes
- No negative stems. No real names. All drugs are generic.
- PA1-044 distractor "only if SpO2 < 75%" is a numeric distractor, but the key does not depend on any local number.
