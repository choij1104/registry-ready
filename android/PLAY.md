# Registry Ready — Google Play build

Free app. Application ID `com.hakoya.registryready`. Publisher: HAKOYA LLC.

The store build is `scripts/build-store.py` run on the repository's `index.html`: the web app
unchanged except that its three typefaces are bundled from @fontsource instead of loaded from
Google Fonts. The build fails if the bundle would make a network request, register a service
worker, or load an external script or stylesheet. No Capacitor plugins; manifest permission
INTERNET only (Capacitor's local web server).

## Build
GitHub Actions → "Android build (Google Play)". Runs on a push to `main` that touches the app or
the Android build, or by manual dispatch (enter the versionName). Produces an **unsigned** App
Bundle as a workflow artifact and on the `android-artifacts` branch at
`dist/registry-ready-<version>-<code>-unsigned.aab` (`dist/LATEST` names the newest).
versionCode = workflow run number.

Local check of the web bundle:

    cd android && npm ci && npm run build:www
    python3 -m http.server -d www 8000

## Sign
Done in CI when the repository secrets are set (Settings → Secrets and variables → Actions),
entered by the account holder:
- `UPLOAD_KEYSTORE_BASE64` — the HAKOYA LLC upload keystore (same key as TOXCARD; Drive
  00_CLAUDE_HQ/TOXCARD_Android_UploadKey) as one base64 line
- `UPLOAD_KEYSTORE_PASSWORD` — its password (same for store and key)
- `UPLOAD_KEY_ALIAS` — `toxcard-upload`

The signed bundle lands next to the unsigned one on `android-artifacts`
(`dist/LATEST-SIGNED` names it) and in the workflow artifact.

## Play Console (first release)
1. Create app: name "Registry Ready: EMT Exam Prep", English (US), App, Free.
2. App content: answers in `listing/app-content.md`.
3. Main store listing: `listing/listing.md`, icon, feature graphic, screenshots.
4. Countries: United States.
5. Production → Create release → upload the signed .aab → release notes from `listing/listing.md`.

## Files
- `scripts/build-store.py` — store web bundle with bundled fonts and offline checks
- `scripts/native-setup.py` — icons, splash, version, ID, targetSdk and permission checks
- `capacitor.config.json`, `package.json`, `package-lock.json`
- `listing/` — listing text, App content answers, feature graphic, screenshots
- `../tools/screenshots.js` — regenerates the screenshots from the store build
