# Handoff — Dictation Repair Book v0.1.0

## What shipped

- Tauri 2 desktop tray utility for explicit before/after correction capture.
- Whole-term rule inference, approval/discard, searchable glossary, reversible single-rule deletion, fresh-transcript retesting, and hit counts.
- Explicit named application sources; clipboard reads occur only after the user clicks a paste button. No audio capture, field monitoring, keystroke logging, or telemetry.
- AES-256-GCM native vault with a random per-device key, temporary-file writes, Unix key permissions, JSON import/backup, CSV export, Whisper vocabulary export, and complete in-app vault/key erasure.
- Free tier with 25 approved rules and ungated testing/export/deletion; $24 one-time Sociobot license unlock for unlimited approved rules, including return-token capture, daily verification cache, offline optimistic state, revocation handling, and manual restore.
- Responsive neo-brutalist “repair ledger” desktop UI and landing page; light/dark app treatments, keyboard navigation, designed focus, reduced-motion behavior, empty/error/offline states, and 390 px layouts.
- Original generated hero artwork with prompt/provenance under `assets/src/`; responsive WebP derivatives are 47.8 KB and 182.7 KB.
- Static `/privacy` and `/terms`, service worker, caching/security config, OS-detected release download, checksum-verifying shell/PowerShell installers, and unsigned-build guidance.
- GitHub Actions release matrix for macOS ARM64/x64, Windows x64, and Linux x64. The publish job attaches DMG, MSI, EXE, AppImage, DEB, `SHA256SUMS`, and `latest.json` using stable filenames.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run typecheck
npm run build
```

Results on 2026-08-28:

- `npm test`: 5 unit tests and 6 Chromium end-to-end tests passed. Coverage includes term inference, longest/whole-term replacement, CSV escaping, the capture → approve → retest flow, release lookup failure, legal routes, axe, and 390 px overflow.
- Axe: zero serious or critical violations on the landing page and desktop app empty state.
- `npm run typecheck`: passed.
- `npm run build`: passed; static deploy root is exactly `dist/site/index.html` and Tauri webview assets are in `dist/app/`.
- Production-bundle Lighthouse mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.4 s**, CLS **0**, total blocking time **0 ms**, and zero console errors.
- Initial bundle sizes, uncompressed: landing JS **3.90 KB**, landing CSS **10.68 KB**, app JS **20.70 KB total**, app CSS **12.88 KB**. No font payload.
- `bash -n public/install.sh` and `node --check scripts/prepare-release.mjs`: passed.
- `cargo fmt --check` and `cargo check --manifest-path src-tauri/Cargo.toml`: passed on Linux after installing the same GTK/WebKit system libraries used by the release workflow.

## Product boundaries / known gaps

- v0.1 is deliberately explicit: an application name is a user-visible source label, not foreground-process enforcement. The app does not watch arbitrary fields or automatically observe edits.
- Whisper support is an interoperable vocabulary prompt export; the app does not bundle or call a speech-recognition model.
- The local encryption key is separate and permission-restricted, but not yet stored in the OS keychain. It protects ordinary at-rest exposure, not malware running as the same OS user.
- There is no automatic updater; users return to the website or releases page for new builds. Accordingly, no updater manifest is shipped.
- First-party releases are unsigned until operator certificates are provided. The landing page and README explain macOS right-click → Open and the Windows publisher warning.
- The factory must register the paid product slug before checkout works in production; no product ID or payment-provider secret is embedded here.
- GitHub's release-download CDN does not send browser CORS headers for JSON. The site therefore discovers the live release and stable asset URL through GitHub's CORS-enabled Releases API, while requiring that release to contain `latest.json`; the published manifest remains canonical for installers and non-browser clients.

## Release verification

- Tag: `v0.1.0`
- Workflow: `.github/workflows/release.yml`
- Release URL: `https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.0`
- Workflow run `33156523197`: all four platform builds and the publish job completed successfully.
- Published assets verified present: two DMGs, MSI, NSIS EXE, AppImage, DEB, `SHA256SUMS`, and valid four-platform `latest.json`.
- Downloaded `Dictation-Repair-Book-linux-x64.deb` from the public release and verified SHA-256 `a643aa214a6919da68f355f84cde4a284898d8c932dea01a29f1ee3f979a075b` against `SHA256SUMS`.
- Browser smoke test resolved the Linux detected-platform CTA to the real v0.1.0 AppImage with zero console errors.

## Needs operator action

- Register `dictation-repair-book` with the Sociobot billing API at the documented $24 one-time price and production return URL.
- Add signing credentials when available. Expected future secrets: `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`. The current workflow intentionally does not reference absent secrets and produces unsigned builds.
- Submit distribution metadata to Homebrew/winget only if those channels are desired later; v0.1 already provides direct verified installers for all three operating-system families.

## Suggested next steps

1. Move the vault key into Keychain/Credential Manager/Secret Service while retaining export and deletion semantics.
2. Add optional, user-confirmed foreground-app identity checks without adding continuous field monitoring.
3. Run the brief's 50-correction/top-20-term blind retest with real users and display that measured accuracy locally.
