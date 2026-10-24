/* Registry Ready — original item bank.
   All items are original. None are taken from the NREMT item pool.
   Domains and weights follow the NREMT EMT Examination Specifications (2023 BLS
   Practice Analysis; administered from April 2025). Clinical content follows the
   2025 AHA Guidelines for CPR and ECC where resuscitation is involved.
   b = practice difficulty on this app's internal scale (-2 easy ... +2 hard). */

const DOMAINS = {
  SCENE:     { name: "Scene Size-up and Safety",       lo: 15, hi: 19 },
  PRIMARY:   { name: "Primary Assessment",             lo: 39, hi: 43 },
  SECONDARY: { name: "Secondary Assessment",           lo: 5,  hi: 9  },
  TREAT:     { name: "Patient Treatment and Transport", lo: 20, hi: 24 },
  OPS:       { name: "Operations",                     lo: 10, hi: 14 }
};

const SRC = {
  NR: "NREMT EMT Examination Specifications (2025)",
  AHA: "AHA 2025 Guidelines for CPR and ECC",
  STD: "National EMS Education Standards, EMT level",
  START: "START / JumpSTART mass-casualty triage",
  ERG: "Emergency Response Guidebook (PHMSA)"
};

const BANK = [];
function M(id, d, topic, b, stem, opts, ans, why, src) { BANK.push({ id, d, topic, b, type: "mc", stem, opts, ans, why, src: src || "STD" }); }
function R(id, d, topic, b, stem, opts, ans, why, src) { BANK.push({ id, d, topic, b, type: "mr", stem, opts, ans, why, src: src || "STD" }); }
function O(id, d, topic, b, stem, steps, why, src) { BANK.push({ id, d, topic, b, type: "order", stem, opts: steps, why, src: src || "STD" }); }
function T(id, d, topic, b, stem, cols, rows, why, src) { BANK.push({ id, d, topic, b, type: "table", stem, cols, rows, why, src: src || "STD" }); }

/* ---------------- SCENE SIZE-UP AND SAFETY ---------------- */
M("S01","SCENE","Scene safety",-1.0,
 "You are dispatched to a residence for a man with a gunshot wound. Dispatch reports the shooter may still be inside. What do you do?",
 ["Enter quickly with your partner and remove the patient","Stage at a safe distance until law enforcement reports the scene secure","Call the patient's phone and ask him to walk outside","Approach the door and announce yourself as EMS"],1,
 "Your own safety comes first. An unsecured violent scene is entered only after law enforcement makes it safe.");
M("S02","SCENE","Hazardous materials",-0.5,
 "An overturned tanker truck displays a placard with a four-digit number. Which reference identifies the material and the initial isolation distance?",
 ["The truck driver's logbook","The Emergency Response Guidebook","Poison control by phone after patient contact","The bill of lading inside the cab, retrieved by you"],1,
 "The ERG converts the placard number to the material and gives initial isolation and protective-action distances.","ERG");
M("S03","SCENE","Hazardous materials",-1.0,
 "Where should you position the ambulance at a suspected hazardous-materials spill?",
 ["Downhill and downwind, close enough to see the placard","Uphill and upwind, at a safe distance","Directly beside the vehicle to shorten patient carry","Downhill and upwind"],1,
 "Gases and liquids travel with wind and gravity. Uphill and upwind keeps the crew out of the plume and runoff.","ERG");
M("S04","SCENE","Triage",-1.5,
 "Using START triage, a patient who can walk to the designated area on command is tagged:",
 ["Immediate (red)","Delayed (yellow)","Minor (green)","Expectant (black)"],2,
 "Anyone able to walk is sorted to minor (green) first and re-triaged later.","START");
M("S05","SCENE","Triage",-0.5,
 "In START triage, an adult is not breathing. You reposition the airway and the patient still does not breathe. Category?",
 ["Immediate (red)","Delayed (yellow)","Minor (green)","Expectant/deceased (black)"],3,
 "An adult who stays apneic after one airway repositioning is tagged expectant/deceased in START.","START");
M("S06","SCENE","Triage",0.0,
 "In START triage, an adult who cannot walk is breathing 36 times per minute. Category?",
 ["Immediate (red)","Delayed (yellow)","Minor (green)","Re-check after all others are tagged"],0,
 "A respiratory rate over 30 is an immediate (red) finding in START.","START");
M("S07","SCENE","Triage",0.5,
 "In START triage, a non-ambulatory adult breathes 22 times per minute and has a radial pulse but cannot follow simple commands. Category?",
 ["Delayed (yellow)","Immediate (red)","Minor (green)","Expectant (black)"],1,
 "Failure to follow simple commands is an immediate (red) criterion even when breathing and perfusion pass.","START");
T("S08","SCENE","Triage",0.5,
 "Classify each adult patient using START.",
 ["Minor","Delayed","Immediate","Expectant"],
 [["Walking, holding a deformed forearm",0],["Cannot walk; RR 24, radial pulse present, follows commands",1],["Cannot walk; RR 34",2],["Apneic after airway repositioning",3]],
 "Walk = minor. RR over 30, no radial pulse (or capillary refill over 2 s), or not following commands = immediate. Apneic after repositioning = expectant.","START");
M("S09","SCENE","Triage",1.0,
 "Using JumpSTART, a 5-year-old is apneic with a palpable peripheral pulse after you reposition the airway. Next step?",
 ["Tag expectant and move on","Give 5 rescue breaths, then reassess breathing","Begin chest compressions","Tag immediate without further action"],1,
 "JumpSTART adds 5 rescue breaths for an apneic child with a pulse. If breathing resumes, tag immediate; if not, expectant.","START");
R("S10","SCENE","PPE",0.5,
 "A patient has a productive cough, fever, night sweats and weight loss. Tuberculosis is suspected. Select the TWO most appropriate precautions.",
 ["Fit-tested N95 (or higher) respirator for the EMT","Surgical mask on the patient if tolerated","Gown as the only added protection","Surgical mask alone for the EMT","No added precautions unless the patient is coughing blood"],[0,1],
 "TB is airborne. Responders wear an N95 or higher; a surgical mask on the patient reduces droplet spread.");
M("S11","SCENE","Scene safety",0.0,
 "You arrive at a closed garage where a car engine is running. Two family members report headache and dizziness and say someone is down inside. Best action?",
 ["Hold your breath, enter and drag the patient out","Keep everyone out, request fire department with SCBA, and treat the symptomatic family outside","Open the door and enter after 2 minutes of ventilation","Enter with a surgical mask and gloves"],1,
 "Suspected carbon monoxide is an atmospheric hazard. Rescue from it requires SCBA, which is not EMT equipment.");
M("S12","SCENE","Mechanism of injury",-0.5,
 "An unrestrained driver struck a pole head-on. The steering wheel is bent. Which injury pattern should you suspect first?",
 ["Isolated ankle fractures","Chest and upper-abdominal injury","Hand burns from the airbag","Lower back strain only"],1,
 "A deformed steering wheel means the chest struck it with force. Suspect rib fractures, pulmonary contusion, cardiac and upper-abdominal injury.");
M("S13","SCENE","Resources",-0.5,
 "You and your partner arrive at a single-vehicle crash and find three injured occupants. When should you request more units?",
 ["After the first patient is packaged","After completing primary assessments on all three","During scene size-up, before committing to patient care","Only if a patient becomes unstable"],2,
 "Resource needs are identified during size-up. Patients outnumbering crew is the trigger to call early.");
R("S14","SCENE","Scene safety",0.0,
 "At a vehicle crash, which THREE findings must be addressed or mitigated before you make patient contact?",
 ["Fuel pooling under the engine near a hot exhaust","Power line lying across the hood","Vehicle resting on its side and rocking","Patient screaming that his leg hurts","A bystander recording video","Police already blocking traffic"],[0,1,2],
 "Fire, electrical and vehicle-stability hazards can injure the crew. A screaming patient is breathing and perfused; the other items are not hazards.");
M("S15","SCENE","Scene safety",-0.5,
 "A power line lies across a car. The driver is awake and asks if he should get out. You should:",
 ["Tell him to step out carefully without touching the ground","Tell him to stay inside, not touch metal, and wait while the utility company is called","Remove the line with a dry wooden backboard","Approach and open the door to assess him"],1,
 "Stepping out can complete a circuit to ground. Lines stay energized until the utility confirms otherwise.");
M("S16","SCENE","Scene safety",0.0,
 "While treating a patient at a large gathering, the crowd becomes hostile and starts pushing toward you. Best action?",
 ["Continue full assessment on scene","Move the patient into the ambulance and leave the area, completing care en route or at a safe location","Ask the crowd to step back and continue","Leave the patient and retreat"],1,
 "When the scene turns unsafe, remove yourself and, if possible, the patient. Care continues once safe.");
M("S17","SCENE","PPE",-1.0,
 "Your patient is actively vomiting. In addition to gloves, which protection is indicated?",
 ["None; gloves are sufficient","Eye protection and a mask","Gown only","Shoe covers"],1,
 "Splash or spray risk calls for eye and face protection on top of gloves.");

/* ---------------- PRIMARY ASSESSMENT ---------------- */
M("P01","PRIMARY","Level of consciousness",-1.5,
 "An adult patient opens his eyes and moans only when you pinch his trapezius. On AVPU he is:",
 ["A","V","P","U"],2,"He responds only to a painful stimulus: P.");
M("P02","PRIMARY","Level of consciousness",0.5,
 "A patient opens her eyes when spoken to, is confused about the date, and moves your hand away from a painful stimulus. Her GCS is:",
 ["10","11","12","13"],2,"Eyes to voice 3 + confused 4 + localizes pain 5 = 12.");
M("P03","PRIMARY","Airway",-1.0,
 "An unresponsive medical patient with no suspected trauma has snoring respirations. First action?",
 ["Insert a nasopharyngeal airway","Head-tilt, chin-lift","Apply a non-rebreather","Begin chest compressions"],1,
 "Snoring means the tongue is partially obstructing the airway. Open it manually first.");
M("P04","PRIMARY","Airway",-1.0,
 "An unresponsive patient fell from a ladder. Which maneuver opens the airway?",
 ["Head-tilt, chin-lift","Jaw thrust","Hyperextend the neck","Recovery position"],1,
 "With possible spinal injury, the jaw thrust opens the airway with minimal neck movement.");
M("P05","PRIMARY","Airway",-0.5,
 "How do you size an oropharyngeal airway?",
 ["Tip of the nose to the earlobe","Corner of the mouth to the earlobe or angle of the jaw","Center of the lips to the chin","Length of the patient's little finger"],1,
 "OPA: corner of mouth to earlobe or angle of jaw. Tip of nose to earlobe is the NPA measurement.");
M("P06","PRIMARY","Airway",0.0,
 "Which finding is a reason to avoid a nasopharyngeal airway?",
 ["Intact gag reflex","Clenched teeth","Clear fluid draining from the nose after head trauma","Snoring respirations"],2,
 "Clear nasal drainage after head trauma suggests a basilar skull fracture. An NPA is avoided in that setting.");
M("P07","PRIMARY","Airway",-1.0,
 "You hear gurgling when your unresponsive patient breathes. Next action?",
 ["Insert an OPA","Suction the airway","Apply high-flow oxygen","Count the respiratory rate"],1,
 "Gurgling means fluid in the upper airway. Clear it before anything else.");
M("P08","PRIMARY","Airway",-0.5,
 "What is the maximum duration of a single suction attempt in an adult?",
 ["5 seconds","10 seconds","15 seconds","30 seconds"],2,
 "Suction removes oxygen along with secretions. Adults: no more than 15 seconds per attempt.");
M("P09","PRIMARY","Breathing",0.0,
 "An adult has a strong carotid pulse but is not breathing. How often do you ventilate?",
 ["1 breath every 2 to 3 seconds","1 breath every 6 seconds","2 breaths every 30 seconds","1 breath every 10 seconds"],1,
 "Adult rescue breathing with a pulse: 1 breath every 6 seconds (10 per minute).","AHA");
M("P10","PRIMARY","Breathing",0.5,
 "A child with a pulse of 110 has respiratory arrest. How often do you ventilate?",
 ["1 breath every 6 seconds","1 breath every 2 to 3 seconds","1 breath every second","2 breaths after every 15 seconds"],1,
 "Infants and children with a pulse: 1 breath every 2 to 3 seconds (20 to 30 per minute).","AHA");
M("P11","PRIMARY","Breathing",0.0,
 "When ventilating with a BVM, each breath should be:",
 ["Delivered as fast as possible","Given over about 1 second with just enough volume for visible chest rise","Given until the bag is fully empty","Held for 3 seconds"],1,
 "Over-ventilation raises intrathoracic pressure and causes gastric inflation. Give each breath over about 1 second with visible chest rise.","AHA");
M("P12","PRIMARY","Breathing",0.0,
 "A confused adult breathes 8 times per minute with shallow chest rise and cyanotic lips. Best intervention?",
 ["Non-rebreather at 15 L/min","Nasal cannula at 4 L/min","Assist ventilations with a BVM and supplemental oxygen","Recovery position and observe"],2,
 "A slow, shallow rate with cyanosis is inadequate breathing. A mask cannot move air for the patient; a BVM can.");
M("P13","PRIMARY","Circulation",-1.0,
 "How long should a pulse check take in an unresponsive adult?",
 ["No more than 10 seconds","15 to 20 seconds","30 seconds","As long as needed to be sure"],0,
 "Long pulse checks delay compressions. Check for no more than 10 seconds.","AHA");
M("P14","PRIMARY","CPR",-1.5,
 "Adult chest compression rate:",
 ["60 to 80 per minute","80 to 100 per minute","100 to 120 per minute","120 to 140 per minute"],2,"100 to 120 per minute.","AHA");
M("P15","PRIMARY","CPR",-0.5,
 "Adult chest compression depth:",
 ["About 1 inch","At least 2 inches but not more than 2.4 inches","At least 3 inches","One-half the chest depth"],1,
 "Adults: at least 2 in (5 cm), not more than 2.4 in (6 cm), with full recoil.","AHA");
M("P16","PRIMARY","CPR",0.0,
 "Two EMTs are performing CPR on an infant. Compression-to-ventilation ratio?",
 ["30:2","15:2","5:1","3:1"],1,"Two-rescuer infant and child CPR uses 15:2.","AHA");
M("P17","PRIMARY","CPR",0.5,
 "Under the 2025 AHA guidelines, which infant chest compression technique is no longer recommended?",
 ["Two-thumb encircling hands","Heel of one hand","Two-finger technique","All three remain recommended"],2,
 "The two-finger technique often fails to reach adequate depth. Use the heel of one hand or the two-thumb encircling technique.","AHA");
O("P18","PRIMARY","CPR",0.5,
 "Put the steps for an unresponsive adult in cardiac arrest in order once an AED is brought to you.",
 ["Confirm the scene is safe","Check responsiveness, breathing and pulse (10 seconds or less)","Begin high-quality chest compressions","Apply the AED pads","Clear the patient while the AED analyzes","Deliver a shock if advised","Resume compressions immediately"],
 "Compressions start as soon as arrest is recognized and continue until the pads are on. After a shock, compressions resume without a pulse check.","AHA");
M("P19","PRIMARY","CPR",0.0,
 "The AED has just delivered a shock. What next?",
 ["Check for a pulse","Re-analyze immediately","Resume chest compressions immediately","Give 2 rescue breaths, then check a pulse"],2,
 "Resume compressions right away; the AED will prompt the next rhythm check after about 2 minutes.","AHA");
M("P20","PRIMARY","CPR",0.5,
 "A 5-year-old is in cardiac arrest. Your AED has adult pads only. You should:",
 ["Withhold the AED until pediatric pads arrive","Use the adult pads, making sure they do not touch","Use one adult pad only","Cut the adult pads to size"],1,
 "Use pediatric pads or an attenuator when available. If not, adult pads are acceptable; place them so they do not overlap (front and back if needed).","AHA");
M("P21","PRIMARY","Airway obstruction",0.5,
 "A conscious adult is clutching her throat and cannot speak or cough. Under the 2025 AHA guidelines you should:",
 ["Give abdominal thrusts only until the object is expelled","Give repeated cycles of 5 back blows followed by 5 abdominal thrusts","Perform a blind finger sweep","Encourage her to drink water"],1,
 "The 2025 update starts with back blows and alternates 5 back blows with 5 abdominal thrusts until relief or unresponsiveness.","AHA");
M("P22","PRIMARY","Airway obstruction",0.0,
 "A conscious infant is choking and cannot cry. Correct sequence?",
 ["Abdominal thrusts","5 back blows, then 5 chest thrusts, repeated","Blind finger sweep, then back blows","Compressions-only CPR"],1,
 "Infants: alternate 5 back blows and 5 chest thrusts. Abdominal thrusts are not used in infants.","AHA");
M("P23","PRIMARY","Airway obstruction",0.5,
 "Your choking adult patient becomes unresponsive. Next action?",
 ["Continue abdominal thrusts with the patient standing","Lower the patient, begin CPR, and look in the mouth before each set of breaths, removing any visible object","Perform blind finger sweeps until the object is found","Give 5 back blows on the floor"],1,
 "Unresponsive with obstruction: start CPR. Compressions may dislodge the object. Remove it only if you can see it.","AHA");
M("P24","PRIMARY","Airway obstruction",0.5,
 "A choking woman is visibly pregnant in her third trimester. Instead of abdominal thrusts, use:",
 ["Back blows only","Chest thrusts","Finger sweeps","Nothing; wait for her to cough"],1,
 "For late pregnancy or when you cannot encircle the abdomen, substitute chest thrusts.","AHA");
M("P25","PRIMARY","Hemorrhage",0.0,
 "During your primary assessment you find bright red blood spurting from a thigh wound. What is your immediate action?",
 ["Finish checking airway and breathing first","Control the bleeding now with direct pressure or a tourniquet","Obtain a blood pressure","Elevate the leg and continue the assessment"],1,
 "Life-threatening hemorrhage is treated the moment it is found.");
M("P26","PRIMARY","Hemorrhage",0.0,
 "Where should a limb tourniquet be placed?",
 ["Directly over the wound","2 to 3 inches above the wound, not over a joint","Just below the wound","Over the nearest joint for better compression"],1,
 "Place it proximal to the wound on the limb, avoiding joints. If the wound location is unclear, place it as high on the limb as possible.");
M("P27","PRIMARY","Hemorrhage",1.0,
 "You applied a tourniquet but bright red bleeding continues. Best next step?",
 ["Loosen it to restore distal circulation","Tighten it further; if bleeding still continues, apply a second tourniquet just above the first","Remove it and use a pressure dressing","Elevate the limb and wait"],1,
 "Ongoing bleeding means it is not tight enough. Tighten, then add a second device proximal to the first.");
M("P28","PRIMARY","Shock",0.0,
 "Which finding is an early sign of shock in an adult?",
 ["Systolic pressure of 80","Restlessness and a rising heart rate","Fixed, dilated pupils","Bradycardia"],1,
 "Compensated shock shows anxiety and tachycardia while blood pressure is maintained. Hypotension is a late sign.");
M("P29","PRIMARY","Circulation",0.5,
 "Capillary refill is most reliable as a perfusion sign in:",
 ["Elderly adults","Children younger than 6 years","Hypothermic adults","Patients taking beta blockers"],1,
 "Cold, age and medications reduce reliability in adults; it is more useful in young children.");
M("P30","PRIMARY","General impression",0.0,
 "The Pediatric Assessment Triangle evaluates:",
 ["Pulse, blood pressure, temperature","Appearance, work of breathing, circulation to the skin","Airway, breathing, circulation","Activity, pulse, grimace"],1,
 "PAT is a from-the-doorway impression: appearance, work of breathing, and skin circulation.");
R("P31","PRIMARY","Priority",-0.5,
 "Which THREE patients are high priority for rapid transport?",
 ["Unresponsive patient with no gag reflex","Chest pain with systolic pressure of 82","Difficulty breathing, speaking in two-word phrases","Isolated wrist deformity with good distal pulse","Small forearm laceration, bleeding controlled","Alert patient with ankle pain after a twist"],[0,1,2],
 "Unresponsiveness, hypoperfusion, and severe respiratory distress are high-priority findings.");
M("P32","PRIMARY","Vital signs",-1.5,
 "Normal resting respiratory rate for an adult:",
 ["6 to 10","12 to 20","22 to 30","30 to 40"],1,"12 to 20 breaths per minute.");
M("P33","PRIMARY","Oxygenation",0.0,
 "A patient with suspected acute coronary syndrome is not short of breath. Supplemental oxygen is indicated when SpO2 is below:",
 ["99%","97%","94%","85%"],2,
 "Give oxygen to keep SpO2 at 94% or higher. Routine oxygen in a well-saturated chest-pain patient is not recommended.","AHA");
M("P34","PRIMARY","Oxygenation",-1.0,
 "Typical oxygen flow rate for a non-rebreather mask:",
 ["1 to 6 L/min","6 to 8 L/min","10 to 15 L/min","25 L/min"],2,"10 to 15 L/min, enough to keep the reservoir bag inflated.");
M("P35","PRIMARY","Oxygenation",-1.0,
 "Typical oxygen flow rate for a nasal cannula:",
 ["1 to 6 L/min","8 to 10 L/min","10 to 15 L/min","15 to 25 L/min"],0,"1 to 6 L/min.");
M("P36","PRIMARY","Breathing",0.0,
 "An unresponsive adult has occasional gasping breaths and no pulse you can feel within 10 seconds. You should:",
 ["Treat the gasps as breathing and give oxygen","Start CPR","Place in recovery position","Count the respiratory rate for 30 seconds"],1,
 "Agonal gasps are not effective breathing. Treat the patient as in cardiac arrest.","AHA");
M("P37","PRIMARY","Airway",1.0,
 "A feverish 4-year-old sits upright leaning forward, drooling, with soft inspiratory stridor. Best approach?",
 ["Inspect the throat with a tongue depressor","Keep the child calm with the caregiver, offer oxygen as tolerated, and transport without agitating","Lay the child flat for assessment","Insert an oropharyngeal airway"],1,
 "This picture suggests upper-airway swelling. Agitation or instrumentation can cause complete obstruction.");
M("P38","PRIMARY","Breathing",0.5,
 "A patient with a suspected opioid overdose is unresponsive, breathing 4 times per minute, with a pulse. First priority?",
 ["Give naloxone before anything else","Ventilate with a BVM and oxygen, then give naloxone per protocol","Apply a non-rebreather and observe","Start chest compressions"],1,
 "Oxygenation and ventilation come first. Naloxone treats the cause but takes time to work.","AHA");
M("P39","PRIMARY","Breathing",1.0,
 "You are ventilating an apneic patient with a BVM and see no chest rise. You reposition the head and re-seal the mask. Still no rise. Most likely problem?",
 ["The oxygen is not connected","Airway obstruction","The patient is breathing on his own","The bag is too large"],1,
 "No chest rise despite proper position and seal means an obstructed airway until proven otherwise.");
M("P40","PRIMARY","Circulation",-1.0,
 "Skin findings most consistent with poor perfusion:",
 ["Pink, warm, dry","Pale, cool, clammy","Flushed, hot, dry","Pink, warm, moist"],1,
 "Vasoconstriction and sympathetic sweating produce pale, cool, clammy skin.");
T("P41","PRIMARY","Breathing",0.5,
 "Classify each adult's breathing.",
 ["Adequate","Inadequate - assist ventilation"],
 [["RR 16, full chest rise, speaking in full sentences",0],["RR 6, shallow, minimal chest rise",1],["RR 40, shallow, now confused",1],["RR 22, anxious, normal chest rise, SpO2 96%",0]],
 "Judge rate together with depth and mental status. Too slow, or fast and shallow with altered mentation, both fail to ventilate.");
M("P42","PRIMARY","Stroke",0.0,
 "A patient shows facial droop and arm drift. Which piece of history matters most to the receiving stroke team?",
 ["Last oral intake","Time last known well","Allergies","Family history of stroke"],1,
 "Treatment eligibility depends on time from last known well.");

/* ---------------- SECONDARY ASSESSMENT ---------------- */
M("A01","SECONDARY","History",-1.5,
 "In OPQRST, the P stands for:",["Pain","Provocation or palliation","Pulse","Past history"],1,"What makes it better or worse.");
M("A02","SECONDARY","History",-1.5,
 "In SAMPLE, the L stands for:",["Location of pain","Last oral intake","Level of consciousness","Length of illness"],1,"Last oral intake.");
M("A03","SECONDARY","Physical exam",-1.0,
 "In DCAP-BTLS, the T stands for:",["Temperature","Tenderness","Tracheal deviation","Trauma"],1,"Deformities, Contusions, Abrasions, Punctures/penetrations, Burns, Tenderness, Lacerations, Swelling.");
M("A04","SECONDARY","Reassessment",-0.5,
 "How often should you reassess an unstable patient?",["Every 2 minutes","Every 5 minutes","Every 15 minutes","Only after interventions"],1,
 "Unstable: about every 5 minutes. Stable: about every 15 minutes, and after every intervention.");
M("A05","SECONDARY","Reassessment",0.0,
 "You assisted a patient with his prescribed nitroglycerin. What should you reassess first, within a few minutes?",
 ["Blood glucose","Blood pressure and the patient's chest pain","Pupil size","Capillary refill"],1,
 "Nitroglycerin can drop blood pressure. Recheck BP and the effect on pain.");
M("A06","SECONDARY","Physical exam",0.5,
 "After a head injury, the patient's right pupil is now larger than the left and reacts slowly. This most likely indicates:",
 ["Normal variation","Rising pressure inside the skull","Opioid use","Hypoglycemia"],1,
 "A new unequal, sluggish pupil after head trauma suggests increasing intracranial pressure. Treat as time-critical.");
M("A07","SECONDARY","History",0.0,
 "A patient with chest pain tells you he is not short of breath and is not nauseated. In your report, these are:",
 ["Chief complaints","Pertinent negatives","Signs","Irrelevant findings"],1,
 "Pertinent negatives are expected findings that are absent and that help narrow the problem.");
M("A08","SECONDARY","Burns",0.5,
 "Using the adult rule of nines, burns cover the entire right arm and the entire front of the trunk. Total body surface area?",
 ["18%","27%","36%","45%"],1,"Arm 9% + anterior trunk 18% = 27%.");

/* ---------------- PATIENT TREATMENT AND TRANSPORT ---------------- */
M("T01","TREAT","Medication",0.0,
 "A chest-pain patient with prescribed nitroglycerin took sildenafil 12 hours ago. You should:",
 ["Assist with nitroglycerin; the time has passed","Not assist with nitroglycerin","Assist with half a tablet","Assist only if systolic pressure exceeds 150"],1,
 "Recent phosphodiesterase-5 inhibitor use can cause severe hypotension with nitrates. Withhold.");
M("T02","TREAT","Medication",-0.5,
 "How should aspirin be given to an adult with suspected acute coronary syndrome and no contraindications?",
 ["Swallowed whole with water","Chewed","Placed under the tongue to dissolve","Mixed in juice"],1,
 "Chewing speeds absorption. Withhold for allergy or active bleeding.","AHA");
M("T03","TREAT","Medication",-0.5,
 "Where is an epinephrine auto-injector given?",
 ["Deltoid","Anterolateral thigh","Abdomen","Upper buttock"],1,"Anterolateral thigh, through clothing if needed.");
M("T04","TREAT","Medication",0.0,
 "After a bee sting, a patient has hives, wheezing, and a blood pressure of 84/50. She carries a prescribed auto-injector. Best action?",
 ["Give oral antihistamine and observe","Assist with the epinephrine auto-injector and transport","Apply ice and transport without medication","Wait for hypotension to worsen before treating"],1,
 "Skin signs with respiratory compromise and hypotension indicate anaphylaxis. Epinephrine is the first treatment.");
M("T05","TREAT","Medication",0.0,
 "Which condition must be met before you give oral glucose?",
 ["Blood glucose above 120 mg/dL","Patient can swallow and protect the airway","Patient is unresponsive","A family member consents"],1,
 "Oral glucose is only for a patient awake enough to swallow and protect the airway.");
M("T06","TREAT","Medication",-0.5,
 "Before assisting an asthma patient with a metered-dose inhaler, you confirm:",
 ["It is prescribed to this patient and not expired","It belongs to a family member with asthma","The patient has used it fewer than 10 times today","The patient's SpO2 is above 98%"],0,
 "Check right patient, right medication, right dose, right route, right time, and expiration.");
M("T07","TREAT","Breathing",0.5,
 "Which finding is a contraindication to CPAP?",
 ["Respiratory rate of 28","SpO2 of 89%","Systolic blood pressure of 82","Crackles in both lungs"],2,
 "CPAP raises intrathoracic pressure and can worsen hypotension. Other contraindications include unresponsiveness, vomiting and suspected pneumothorax.");
M("T08","TREAT","Medical emergencies",-1.0,
 "A patient is having a generalized seizure. You should:",
 ["Place a bite block between the teeth","Protect the patient from injury without restraining","Hold the arms and legs still","Pour water on the face"],1,
 "Move hazards away, protect the head, and never put anything in the mouth.");
M("T09","TREAT","Trauma",0.0,
 "A stab wound to the chest bubbles with each breath. Immediate care?",
 ["Pack the wound with gauze","Cover with an occlusive dressing (a vented chest seal, or one taped on three sides)","Leave it open to air","Apply a tourniquet-style chest wrap"],1,
 "Seal the open chest wound to stop air entry while letting air escape.");
M("T10","TREAT","Trauma",1.0,
 "After sealing an open chest wound, the patient becomes more short of breath, breath sounds disappear on that side, and blood pressure falls. Best action?",
 ["Add a second occlusive dressing","Briefly lift (burp) the dressing to release trapped air","Lay the patient flat","Slow down ventilations"],1,
 "These are signs of tension pneumothorax. Releasing the seal lets trapped air escape.");
M("T11","TREAT","Trauma",-0.5,
 "Abdominal organs protrude from a laceration. Correct care?",
 ["Push the organs back inside","Cover with a moist sterile dressing and an occlusive layer","Cover with dry gauze only","Rinse with tap water and leave uncovered"],1,
 "Keep organs moist and covered. Never replace them.");
M("T12","TREAT","Trauma",-1.0,
 "A screwdriver is embedded in a patient's thigh. You should:",
 ["Remove it and apply pressure","Stabilize it in place with bulky dressings","Cut it short","Twist it to check depth"],1,
 "Removing an impaled object can cause uncontrolled bleeding. Stabilize it.");
M("T13","TREAT","Trauma",1.0,
 "An object is impaled through the cheek and is blocking the airway, and blood is pooling in the mouth. You should:",
 ["Stabilize it in place","Remove it, pack the inside of the cheek if needed, and suction","Leave it and give oxygen by mask","Push it further through"],1,
 "An impaled object in the cheek is removed when it interferes with the airway.");
M("T14","TREAT","Musculoskeletal",-1.0,
 "When splinting a long-bone fracture, immobilize:",
 ["Only the injured bone","The joints above and below the injury","The joint closest to the injury","The entire limb plus the spine"],1,
 "Immobilizing the adjacent joints keeps bone ends from moving.");
M("T15","TREAT","Musculoskeletal",0.5,
 "A traction splint is appropriate for:",
 ["Fracture near the knee","Isolated mid-shaft femur fracture","Pelvic fracture","Hip dislocation"],1,
 "Traction splints are for isolated mid-shaft femur fractures without pelvic, hip, knee or ankle injury on that side.");
M("T16","TREAT","Musculoskeletal",-1.0,
 "When must you check distal pulse, motor and sensation in an injured extremity?",
 ["Only before splinting","Only after splinting","Before and after splinting","Only if the patient complains of numbness"],2,
 "Before to establish a baseline, after to confirm the splint did not compromise circulation or nerves.");
M("T17","TREAT","Special populations",0.0,
 "A woman at 34 weeks' gestation becomes dizzy and hypotensive lying on her back. Best position?",
 ["Supine with legs raised","On her left side","Prone","Sitting upright with legs dangling"],1,
 "The uterus compresses the inferior vena cava when supine. Left lateral positioning relieves it.");
M("T18","TREAT","Special populations",1.0,
 "During labor, you see the umbilical cord protruding from the vagina before the baby. Which action is correct?",
 ["Push the cord back in","Insert gloved fingers to lift the presenting part off the cord, elevate the hips, and transport rapidly","Clamp and cut the cord","Pull gently on the cord to speed delivery"],1,
 "Keep pressure off the cord to preserve blood flow to the fetus, and transport immediately.");
M("T19","TREAT","Special populations",0.5,
 "As the head delivers, you feel the cord loosely wrapped around the neck. You should:",
 ["Clamp and cut it immediately","Gently slip it over the baby's head","Push the head back in","Pull the baby out quickly"],1,
 "A loose nuchal cord is slipped over the head. Clamp and cut between clamps only if it cannot be loosened.");
M("T20","TREAT","Environmental",0.0,
 "A runner is confused with hot skin after a summer race. Most important treatment?",
 ["Oral fluids and rest in the shade","Rapid active cooling and transport","Warm blankets for shivering","Salt tablets"],1,
 "Altered mental status with hyperthermia is heat stroke, a life threat. Cool aggressively.");
M("T21","TREAT","Environmental",0.5,
 "A patient with severe hypothermia must be moved. How should you handle him?",
 ["Have him walk to the ambulance to generate heat","Handle gently and keep him horizontal","Rub the extremities vigorously","Give hot coffee"],1,
 "Rough handling can trigger ventricular fibrillation in a cold heart.");
O("T22","TREAT","Hemorrhage",0.0,
 "Put the steps for applying a windlass tourniquet in order.",
 ["Expose the wound","Place the tourniquet 2 to 3 inches above the wound","Tighten the windlass until bleeding stops","Secure the windlass","Record the time of application"],
 "Expose, place proximal, tighten until bleeding stops, lock the windlass, and document the time.");
T("T23","TREAT","Medication",0.5,
 "A chest-pain patient has his own prescribed nitroglycerin. For each situation, decide.",
 ["May assist","Do not assist"],
 [["Systolic 132, no recent erectile-dysfunction medication",0],["Took tadalafil yesterday",1],["Systolic 84",1],["Already took 3 doses in the last 15 minutes",1]],
 "Withhold for hypotension, recent PDE-5 inhibitor use, or when the maximum doses under your protocol have been given.");
M("T24","TREAT","Transport",0.0,
 "Your patient has a positive stroke screen and was last known well 45 minutes ago. Best transport decision?",
 ["Nearest clinic for evaluation","Stroke-capable hospital per local protocol, with early notification","Wait on scene for symptoms to resolve","Any hospital; time does not matter"],1,
 "Stroke is time-sensitive. Destination and prenotification follow your system's stroke protocol.");
M("T25","TREAT","Spinal motion restriction",0.0,
 "Which finding indicates spinal motion restriction after a fall?",
 ["Patient walked at the scene, no complaints, alert","Patient is confused and cannot report pain reliably","Isolated finger laceration","Patient refuses a cervical collar but is otherwise normal"],1,
 "Altered mental status removes a reliable exam. Restrict motion.");
R("T26","TREAT","Spinal motion restriction",0.5,
 "Select THREE findings that indicate spinal motion restriction in a trauma patient.",
 ["Midline cervical spine tenderness","Intoxication after a fall","New numbness in both hands","Isolated ankle sprain, walking at scene","Abrasion on the knee","Normal mental status and no pain"],[0,1,2],
 "Midline tenderness, impaired reliability (intoxication, altered mentation, distracting injury) and neurologic deficits indicate restriction.");
M("T27","TREAT","Medical emergencies",0.0,
 "A known diabetic is confused but can swallow. Glucometer reads low. Best treatment within EMT scope?",
 ["Insulin from the patient's supply","Oral glucose","Nothing by mouth; transport only","Aspirin"],1,
 "An awake patient who can swallow and protect the airway receives oral glucose.");

/* ---------------- OPERATIONS ---------------- */
M("O01","OPS","Legal",0.5,
 "Which element is NOT required to prove negligence?",
 ["Duty to act","Breach of duty","Damages","Intent to harm"],3,
 "Negligence requires duty, breach, damages and proximate cause. Intent is not an element.");
M("O02","OPS","Legal",-0.5,
 "Abandonment is best described as:",
 ["Refusing to transport a patient who refused care","Ending care without transferring the patient to someone of equal or higher training","Calling for ALS","Leaving the scene after a valid refusal"],1,
 "Once care begins, it continues until handed to an equal or higher provider.");
M("O03","OPS","Legal",0.0,
 "A competent adult refuses transport after a fall. Which step is required?",
 ["Transport anyway to protect yourself","Explain the risks, encourage care, and document the refusal with a signature","Leave without documentation","Ask a family member to sign consent instead"],1,
 "Make sure the refusal is informed and document it thoroughly.");
M("O04","OPS","Legal",-1.0,
 "You treat an unresponsive adult who cannot consent. You are operating under:",
 ["Expressed consent","Implied consent","Involuntary consent","Informed refusal"],1,
 "The law presumes an unresponsive person would consent to emergency care.");
M("O05","OPS","Documentation",-0.5,
 "You find an error in a patient care report you are writing. Correct method?",
 ["Erase it","Draw a single line through it, write the correction, and initial and date it","Black it out completely","Start a new report and discard the old one"],1,
 "The original entry must remain readable.");
M("O06","OPS","Equipment",0.5,
 "An oxygen cylinder should be replaced when the pressure falls to about:",
 ["1000 psi","500 psi","200 psi (safe residual)","0 psi"],2,"About 200 psi is the safe residual pressure.");
M("O07","OPS","Wellness",-1.5,
 "Correct lifting technique:",
 ["Bend at the waist and lift with your back","Keep the load close, back straight, and lift with your legs","Twist while lifting to save time","Hold the load at arm's length"],1,"Power lift: legs do the work, load close to the body.");
M("O08","OPS","Vehicle operations",0.0,
 "When driving with lights and siren, you:",
 ["Have absolute right of way","Must still drive with due regard for the safety of others","May ignore all traffic laws","Do not need to stop at red lights"],1,
 "Emergency vehicle exemptions are conditional on due regard.");
M("O09","OPS","Legal",-0.5,
 "Under HIPAA, you may share a patient's protected health information with:",
 ["A reporter at the scene","The receiving hospital staff caring for the patient","The patient's employer","Your friends after the shift"],1,"Sharing for treatment with the receiving facility is permitted.");
M("O10","OPS","Wellness",0.0,
 "You sustain a needlestick from a used needle. First action?",
 ["Finish the call and report at the end of the week","Wash the site with soap and water and report immediately per your exposure control plan","Apply a tourniquet above the site","Ignore it if the patient looks healthy"],1,"Clean the site and report right away so post-exposure care can start.");
M("O11","OPS","Wellness",0.0,
 "After a pediatric death call, a crewmate has trouble sleeping and avoids talking about it. The most appropriate step is to:",
 ["Tell him to toughen up","Encourage use of peer support or the employee assistance program","Report him for unfitness","Ignore it unless it lasts a year"],1,"Early support reduces long-term stress effects.");
M("O12","OPS","Equipment",-0.5,
 "When should the AED be checked?",
 ["Only after it is used","At the start of each shift per the manufacturer and agency policy","Once a year","Only when the indicator shows a fault"],1,"Routine checks catch dead batteries and expired pads before a call.");
M("O13","OPS","Legal",0.0,
 "A 15-year-old with a serious injury needs care and no parent can be reached. You:",
 ["Wait for a parent before treating","Treat under implied consent","Ask the teenager's friend to consent","Transport only if police order it"],1,"Emergency care of a minor without a reachable guardian proceeds under implied consent.");
M("O14","OPS","Legal",0.5,
 "A family presents a valid, signed out-of-hospital DNR for a patient in cardiac arrest. You should:",
 ["Start CPR anyway","Withhold resuscitation and provide comfort and support per protocol","Call the patient's lawyer","Perform CPR only if family members disagree"],1,"Follow a valid DNR under your local protocol and support the family.");
