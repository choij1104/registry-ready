/* Registry Ready — domains (NREMT EMT Examination Specifications, 2023 BLS Practice Analysis; in use since April 2025) and source labels. */
const DOMAINS = {
  SCENE:     { name: "Scene Size-up and Safety",        lo: 15, hi: 19 },
  PRIMARY:   { name: "Primary Assessment",              lo: 39, hi: 43 },
  SECONDARY: { name: "Secondary Assessment",            lo: 5,  hi: 9  },
  TREAT:     { name: "Patient Treatment and Transport", lo: 20, hi: 24 },
  OPS:       { name: "Operations",                      lo: 10, hi: 14 }
};
const SRC = {
  AHA: "2025 AHA Guidelines for CPR and ECC",
  NRP: "2025 AHA/AAP Neonatal Resuscitation Guidelines",
  STD: "National EMS Education Standards and Scope of Practice Model, EMT level",
  START: "START / JumpSTART mass-casualty triage",
  ERG: "Emergency Response Guidebook (PHMSA)",
  FTG: "2021 National Guideline for the Field Triage of Injured Patients",
  SMR: "2018 ACS-COT/ACEP/NAEMSP joint statement on spinal motion restriction"
};
