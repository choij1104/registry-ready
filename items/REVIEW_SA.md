# REVIEW_SA — independent clinical review of SA.json

Reviewed: 18 items (SA-001 to SA-018). Changed: 2. Deleted: 0.
Checked against SPEC.md, 2025 AHA CPR/ECC, National EMS Scope of Practice (EMT), 2018 joint SMR statement, 2021 Field Triage Guideline, and ABA burn referral criteria.

## Changes
| id | problem | fix |
|---|---|---|
| SA-013 | Tourniquet is already applied, yet shock is worsening; the rationale did not tell the learner to check the tourniquet or look for another bleeding source, which is the first practical step. | Added "recheck the tourniquet and look for other bleeding" to `why`. Key and options unchanged. |
| SA-017 | `wrong[2]` gave two alternative explanations ("counts the arm as 18% or doubles the trunk"), which was muddled. | Rewrote to one specific reason: 36% requires counting the arm as 18%; an adult arm is 9%. |

## Items passed without change
SA-001, SA-002, SA-003, SA-004, SA-005, SA-006, SA-007, SA-008, SA-009, SA-010, SA-011, SA-012, SA-014, SA-015, SA-016, SA-018.
Each has a single defensible key, accurate `wrong` reasons, EMT-scope actions only, internally consistent vitals, and no protocol-number dependence (SA-002 uses "meter reading is low" rather than a cutoff; SA-014 defers repeat inhaler dosing to protocol).

## Notes (no change needed)
- SA-010: pedestrian struck at 30 mph is a high-risk mechanism under the 2021 field triage guideline (>20 mph impact); age 67 adds risk.
- SA-018: partial-thickness hand burns and circumferential burns meet ABA burn center referral criteria regardless of TBSA.
- SA-012/SA-009: Cushing triad and new unilateral pupil dilation interpreted correctly; actions stay within EMT scope.
- Validator: 0 errors after edits.
