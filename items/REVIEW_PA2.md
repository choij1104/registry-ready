# Review of PA2.json (51 items)

Independent review against SPEC.md. Result: 51 items kept, 0 deleted, 10 items edited.
Validator: `node validate.js PA2.json` gives 0 errors (types: mc 40, mr 5, order 3, table 3; mc answer positions 10/10/10/10).

## Changes

| id | Problem | Fix |
|---|---|---|
| PA2-004 | Keyed option was noticeably longer than the distractors (length cue). `why` said the pad "may damage the device", which is not the main reason the guidance gives. | Shortened the keyed option to "Place the pad off the device and analyze without delay". Rewrote `why` around blocked or diverted current, with front-to-back placement as the alternative. |
| PA2-005 | Keyed option (15 words) was much longer than the distractors (9–11). | Shortened it to "Remove the patch with gloves, wipe the skin, then apply the pad". |
| PA2-010 | Keyed option was the longest. | Tightened it to "Switch compressors during the analysis, in under 5 seconds". |
| PA2-015 | `wrong[2]` said packing is only for "junctional or cavity" wounds. Packing is also used for deep extremity wounds where surface pressure fails, and "cavity" packing is wrong (do not pack chest or abdomen). | Rewrote it: packing is for deep wounds where surface pressure cannot reach the source, such as junctional wounds. |
| PA2-016 | Keyed option (14 words) was the longest of the four, which cued the answer. | Shortened it to "Apply a tourniquet 2 to 3 inches above the wound". The joint caution stays in `key`. |
| PA2-041 | Keyed option was long and used "coordinate … rather than waiting on scene", which echoes the stem. | Changed it to "Begin transport now and arrange an ALS intercept per protocol". |
| PA2-043 | The item cited the 2021 Field Triage Guideline, but the wording did not match it. The guideline lists "Anticoagulant use" and "Low-level falls in … older adults (age ≥ 65) with significant head impact" as **risk factors under EMS judgment** (the yellow tier). They are not a red criterion or a mandatory trauma-center rule. The keyed option was also long. | Rewrote the keyed option, `key`, `why` and `wrong[1]` to match the guideline's own wording. It now keys on transport and evaluation at an appropriate facility, not on an automatic trauma-center rule. |
| PA2-044 | Keyed option was the longest and used technical wording. | Shortened it to "It may be falsely normal because carbon monoxide reads as oxygen". |
| PA2-045 | Distractor "His heart rate of 104" referred to a heart rate that the stem never gave (internal inconsistency). | Added "HR 104, RR 18" to the stem. |
| PA2-051 | The step "After about 1 minute" fixed a single timing. Sources and protocols use 1 to 3 minutes after the position change, so one fixed number is protocol-dependent. | Changed the step to "After 1 to 3 minutes" and matched `key` to it. |

## Deletions
None. Every item had one defensible best answer, or exactly the keyed set, after the edits above.

## Checked and left unchanged (notable)
- **PA2-001 and 002 (agonal breathing):** consistent with 2025 AHA Part 7. Agonal breathing is "slow, irregular gasping respirations that are ineffective for ventilation"; check the pulse for no more than 10 s and start CPR if no definite pulse is felt.
- **PA2-007 and 008 (infant technique and ratio):** 2025 AHA. The two-finger technique is no longer recommended; use the heel of one hand or two-thumb encircling. Ratios are 30:2 for one rescuer and 15:2 for two rescuers with an infant or child. Depth is about 1.5 in (one-third of the AP diameter).
- **PA2-006 (adult pads on a child):** 2025 pediatric BLS. An attenuator is preferred for children under 8; if none is available, an AED without one may be used. Pads must not touch, and front-to-back placement is acceptable (pad placement may be anterolateral or anteroposterior).
- **PA2-010, 011 and 014:** 2025 AHA Part 7. Switch compressors about every 2 min. Resume compressions immediately after a shock instead of pausing for a rhythm or pulse check. Rate 100–120/min, depth at least 2 in while avoiding excessive depth (2.4 in / 6 cm per SPEC), full recoil, no leaning.
- **PA2-003, 004 and 005 (AED special situations):** BLS provider materials. Remove the patient from standing water and dry only the pad sites. Do not place a pad over the implanted generator and do not wait. Remove a patch at the pad site with gloves and wipe the skin.
- **PA2-012 and 013:** termination is framed as a medical direction or protocol decision, consistent with EMT scope.
- **PA2-016 to 023 (hemorrhage):** consistent with Stop the Bleed / ACS teaching. Place the tourniquet 2–3 in above the wound, not over a joint; tighten until bleeding stops; lock the windlass; record the time; do not loosen. If the first is fully tightened and bleeding continues, add a second tourniquet just proximal to it. Pack deep junctional wounds and hold continuous pressure. The 2021 FTG red criterion "Active bleeding requiring a tourniquet or wound packing with continuous pressure" supports these keys.
- **PA2-031:** burping the occlusive dressing is within EMT scope, and needle decompression is correctly excluded.
- **PA2-044 and 045 (pulse oximetry):** standard oximeters read carboxyhemoglobin as oxyhemoglobin, giving a falsely normal SpO2. Poor perfusion, cold fingers and motion degrade the reading.
- **PA2-047:** glucose 42 mg/dL is low under any protocol, so the key does not depend on a local cutoff number. Oral glucose is appropriate because he can swallow.
- **PA2-050:** HR +30 with SBP −20 and symptoms on sitting is abnormal under any commonly used orthostatic criterion. The key does not rest on a cutoff number.
- **PA2-034 and 035 (last known well):** "last known well" is the last time the patient was seen at baseline, not when symptoms were discovered (wake-up stroke).
- **PA2-026:** BP 98/60 is above the 5-year-old hypotension threshold (70 + 2×5 = 80), so "normal for age" holds.
- **PA2-038:** 96.0 °F (35.6 °C) is below 36 °C and RR 26 is above 22, so both are valid sepsis-screen abnormalities.
- I checked all vital signs for internal consistency. No other giveaway length cues remain (an automated check flagged none after the edits).

## Sources consulted
- AHA 2025 Part 7, Adult BLS (cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support): compression rate and depth, recoil, switching every 2 min, immediate resumption after a shock, agonal breathing, 10 s pulse check, pad positions.
- AHA 2025 guideline highlights PDF (heart.org): two-finger technique no longer recommended; heel of one hand or two-thumb encircling.
- JournalFeed summary of 2025 pediatric BLS: attenuator preferred, AED without an attenuator acceptable; ventilation 20–30/min.
- 2021 National Guideline for the Field Triage of Injured Patients, ACS handout (ww2.facs.org field-triage-handout): red and yellow criteria, anticoagulant use, low-level falls at age 65 and older.
- Global Medical Response Stop the Bleed resource: tourniquet 2–3 in above the wound, not over a joint, windlass, note the time, packing.
- BLS AED special-situations summary (open-exam-prep, based on the AHA BLS manual): water, implanted devices, patches.
- Pulse oximetry limitation references (Osmosis, Lecturio and nursing clinical-skills texts): carbon monoxide, perfusion, motion.
- MSD Manual, orthostatic hypotension: measurement at 1–3 min after standing.

Not reachable: the AHA journal full text (ahajournals.org CIR.0000000000001369) and the cpr.heart.org pediatric BLS page were blocked by the permission system. I verified the pediatric points from the AHA highlights PDF and the secondary summary instead.
