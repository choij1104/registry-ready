# EMT Prep 2026 — Play Console "App content" answers

## Privacy policy
https://choij1104.github.io/registry-ready/privacy.html (GitHub Pages on this repo, main branch, root)

## Ads
No ads.

## App access
All functionality is available without special access. No login. No first-launch gate.

## Content rating (IARC)
Category: **Reference, News, or Educational**. Email for the certificate: admin@hakoyallc.com.

| Topic | Answer | Note |
|---|---|---|
| Violence | No | Questions describe injuries in text (e.g. a stab wound) as clinical training content; no images, no depiction of violence |
| Blood / gore | No | Text only, clinical context |
| Fear / horror | No | |
| Sexuality / nudity | No | Childbirth questions are clinical training content |
| Language | No | |
| Controlled substances | **Yes** | Questions mention medications (aspirin, nitroglycerin, epinephrine, naloxone) and an opioid overdose in an educational, clinical-training context; no use or glorification |
| Gambling | No | |
| Users interact or share content | No | |
| Shares location | No | |
| Digital purchases | No | Paid app (USD 0.99); no in-app purchases |
| Unrestricted internet | No | |

## Target audience
**18 and over.** Not designed for children; not in the Families program. The listing does not appeal to children.

## Data safety
| Question | Answer |
|---|---|
| Does the app collect or share any required user data types? | **No** |

Basis: the store build makes no network request (build-store.py fails the build if one appears); progress is kept in the WebView's local storage on the device only and is never transmitted; no analytics, ads, crash reporting or third-party SDKs; one Capacitor plugin (on-device text-to-speech, no network); manifest permission INTERNET only (Capacitor's local web server). Result on Google Play: "No data collected", "No data shared".

## Health apps declaration
| Feature | Tick |
|---|---|
| Medical reference and education | **Yes** (EMT exam preparation; clinical training questions) |
| Clinical decision support, diagnosis, disease management | No |
| Medication management, medical device, EHR, telehealth | No |
| Health & fitness tracking, mental health tools | No |

Regulatory: not a medical device; no FDA clearance claimed; collects no health data; no Health Connect.

## Government app / Financial features / News / COVID-19
No / None / No / No.
