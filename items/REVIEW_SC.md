# Review of SC.json (Scene Size-up and Safety)

Reviewer: independent review against SPEC.md. 43 items reviewed, 43 retained, 0 deleted.
Validator: `node validate.js SC.json` gives 0 errors (types mc 34, mr 4, table 3, order 2; mc answer positions 8/9/9/8).

## Changes

| ID | Problem | Fix |
|---|---|---|
| SC-005 | `wrong[0]` said she "has no stated SMR indication", but the stem gives chest pain and no neuro or spine findings either way. The reason added nothing and could be challenged | Rationale now covers only the hazard: a running car in gear. |
| SC-015 | `src` was ERG, but the item is about CO poisoning in a home, which the ERG does not cover | `src` set to STD. |
| SC-016 | `src` was ERG, but the item is about confined-space and manure-pit entry, which the ERG does not cover | `src` set to STD. |
| SC-019 | Length clue: the keyed option was the only long option and carried its own explanation ("since alcohol rub does not reliably kill C. difficile spores"). The `why` also overstated CDC guidance | All four options rewritten to similar length, with no explanation inside the keyed option. `key` and `why` now match CDC: alcohol does not kill spores, washing removes more of them, and CDC prefers soap and water during C. difficile outbreaks. Gloves and gown remain the main protection. |
| SC-020 | Order item named a "standard sequence". It needs to name the CDC version, because CDC also allows a sequence where the gown and gloves come off together (Example 2). The `key` gave the order as gloves, eye protection, gown, mask, which is right, but called it "most to least contaminated", which is not CDC's rationale | Stem now names CDC Example 1. `key` and `why` restate the CDC order (gloves, goggles/face shield, gown, mask/respirator, then hand hygiene) without the contamination ranking. Keyed order unchanged and verified. |
| SC-021 | Mild length clue: the keyed option was longer than the others ("…right away per your exposure plan") | Shortened to "…then report the exposure immediately". |
| SC-032 | Keyed option was noticeably longer than the distractors | Shortened to "Matching ambulances from staging to hospitals and tracking each patient sent". |
| SC-040 | Distractors were much shorter than the keyed option, which was a length clue | Distractors lengthened to similar size. `wrong[2]` now states the JumpSTART limit of 15. |
| SC-043 | Stem made the candidate "the triage officer", an ICS role that does not usually triage every patient alone | Stem changed to "You are triaging 25 patients". `wrong[2]` reworded to match. |

## Items checked with no change needed
SC-001 to SC-004, SC-006 to SC-014, SC-017, SC-018, SC-022 to SC-031, SC-033 to SC-039, SC-041, SC-042. Each has one defensible best answer (or the exact keyed set), stays within EMT scope, and has no protocol-number key. `wrong`, `key` and `why` are consistent with each other.

## Verified by search (sources)
- **2021 National Guideline for the Field Triage of Injured Patients** (ACS field triage handout, https://ww2.facs.org/media/2zdltley/field-triage-handout-vfinal-revise.pdf):
  - Red injury patterns: amputation proximal to wrist or ankle; suspected pelvic fracture.
  - Red mental status: unable to follow commands (motor GCS < 6).
  - Red vital signs: SBP < 90 or HR > SBP for ages 10–64; SBP < 110 or HR > SBP for age 65 and older; SBP < 70 + 2×age for ages 0–9; RR < 10 or > 29; SpO2 < 90%.
  - Yellow: death in passenger compartment (high-risk auto crash); fall > 10 ft.
  - Anticoagulant use is a risk factor under EMS judgment. Rollover is not a listed criterion.
  - Yellow means a trauma center, which need not be the highest level.
  - All keys in SC-026, SC-027 and SC-028 are correct.
- **ERG structure** (Wikipedia "Emergency Response Guidebook", which summarizes the PHMSA ERG):
  - Yellow pages: by 4-digit ID number. Blue pages: alphabetical by name. Both give the orange guide number.
  - Orange pages: the guides.
  - Green pages: TIH isolation and protective-action distances, for highlighted materials only.
  - Guide 111: mixed load or unidentified cargo.
  - Placard table: used when the ID number or name is not available.
  - SC-011 and SC-012 are correct.
- **START / JumpSTART** (Wikipedia "JumpSTART triage"; START algorithm):
  - JumpSTART: apneic child with a pulse gets 5 rescue breaths. Breathing resumes → immediate; still apneic → expectant. Apneic with no pulse → expectant.
  - JumpSTART red findings: RR < 15 or > 45, no palpable peripheral pulse, inappropriate AVPU.
  - Adult START: walkers → minor; apnea after airway repositioning → expectant; RR > 30, absent radial pulse or capillary refill > 2 s, or not following commands → immediate.
  - SC-035 to SC-043 are correct.
- **CDC PPE doffing, Example 1**: gloves, then face shield/goggles, then gown, then mask/respirator, with hand hygiene immediately after all PPE is removed. Confirmed from CDC-derived training material: the CDPH "Basics of PPE" slide deck and Augusta University's rapid review of CDC doffing. Footnote: gown and gloves may be removed together (Example 2). The CDC PDF itself (https://www.cdc.gov/infection-control/media/pdfs/ppe-sequence-p.pdf) could not be fetched in this session (permission request not answered).
- **C. difficile hand hygiene** (CDC "Clinical Safety: Hand Hygiene", https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html):
  - Alcohol does not kill spores.
  - Soap and water is preferred when hands are visibly soiled and when caring for C. difficile or norovirus patients during outbreaks.
  - Gloves are the main protection.
  - Note: CDC calls the evidence for routine soap and water limited. Among the four SC-019 options, soap and water is still clearly the best answer.
- **TB precautions** (NYS DOH EMS policy 13-05, https://health.ny.gov/professionals/ems/pdf/13-05.pdf, following CDC): staff transporting a suspected or confirmed TB patient wear an N95 respirator, and the patient wears a surgical mask. SC-017 and SC-018 are correct.
