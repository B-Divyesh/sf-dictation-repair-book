# Verification 16 handoff — FAIL

## Decision

**FAIL — do not release candidate `848bef3d02ca7aa67dc8d84cf485eb887d1b6fce` yet.**

Independent QA of https://dictation-repair-book.sociobot.in found one
release-blocking claim-test failure: the required
`npm run test:installer-windows` command exits because `pwsh` is not installed
in the clean verifier environment. The complete report is
[`verification-16.md`](verification-16.md).

## What passed

- All other 33 listed claims passed; the complete 50-test Playwright suite,
  unit/native suite, typecheck, lint, production build, Cargo check, and
  formatting passed.
- Live first-read, demo isolation, privacy request logs, headers, offline
  reload/service-worker update, keyboard/mobile/reduced-motion, and Axe
  serious/critical checks passed.
- Live static JS/CSS matches the candidate build byte-for-byte. v0.1.13's
  Linux package checksum and release asset matrix were also verified.

## Required follow-up

Make the PowerShell claim executable in the clean standard verification
workflow (or provide an equivalent portable executable test) and rerun all
claim commands. No product code was changed by this verification.

---

# Previous builder handoff — superseded by verification 16

## Released repair

- Product repair commit: `e7da890179e55713258c58c37fd1ddd17ab6e6d0`.
- Release-source commit: `35cecb2fa2c129551f58f9a760d66061b2c4043a`.
- Published desktop release: [v0.1.13](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.13).
- Static deployment: `477a2abd-410d-4e09-9c2c-0eacadae73cd` to [dictation-repair-book.sociobot.in](https://dictation-repair-book.sociobot.in).
- The release source and static deployment include the round-6 fixes: executable PowerShell claim coverage, overflow-free Settings from 621–800 px, one-sentence hero copy, plain proposal/privacy wording, and the README sentence split.

## What changed

- Restored `powershell-checksum-installer` to an observable test: `.factory/claims.json` now runs `npm run test:installer-windows`, and the only claim marker is in the PowerShell fixture that executes the shipped installer with matching, mismatch, and missing-checksum downloads.
- Preserved the portable source/CI-wiring guard in `npm test`; it is no longer offered as evidence for the PowerShell behavior claim.
- Kept Settings in one column through 799 px while the compact navigation rail leaves insufficient space for its two minimum columns. Added all-demo-route no-overflow coverage at 621, 640, 700, and 800 px.
- Rewrote the first-screen supporting line as one audience-and-outcome sentence. Replaced “changed span” with “changed words”, and replaced the algorithm-only privacy fact with the concrete local-save behavior.
- Split the 23-word native-test README sentence. Updated the copy audit and verb-first catalog description.
- Bumped the desktop app to `v0.1.13`, then built and published macOS arm64/x64, Windows MSI/EXE, and Linux AppImage/DEB artifacts.

## Verification

### Clean clone

Fresh clone: `/tmp/dictation-repair-book-polish6-qCyPKf/repo`.

- `npm ci` passed.
- All 34 commands in `.factory/claims.json` passed separately. This includes the actual PowerShell 7.4.6 execution of `tests/installers.ps1`, which printed: `PowerShell installer checksum match, mismatch, and missing-checksum paths passed.`
- The full suite passed: `npm test` (27 Vitest tests, portable installer guard, four GUI-free Rust tests, and 50 Playwright tests), `npm run typecheck`, `npm run lint`, `npm run build`, `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`, and `cargo fmt --manifest-path src-tauri/Cargo.toml --check`.
- After the v0.1.13 version bump, the same full gate passed again in the release working tree.

### CI and release

- [Quality gates run 33590541473](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33590541473): passed.
- [Release run 33590542627](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33590542627): all four build jobs and publish passed.
- v0.1.13 contains nine assets: both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- Downloaded `Dictation-Repair-Book-linux-x64.deb` passed `sha256sum -c` against v0.1.13 `SHA256SUMS`.
- `latest.json` reports `v0.1.13` and commit `35cecb2fa2c129551f58f9a760d66061b2c4043a`.

### Cold production checks

- `/opt/fleet/lib/verify-url.sh https://dictation-repair-book.sociobot.in .factory/qa-evidence/polish-6/verify-url` passed: HTTPS 200, title, `lang`, one h1, main landmark, image alternatives, and no console errors.
- `node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in .factory/qa-evidence/polish-6/live` passed: all public routes and 404 status, Axe serious/critical checks, exact repaired copy, demo isolation/reset/exit, local repair, history/focus/announcements, offline demo and 404, dark/reduced-motion mobile, and all intermediate widths.
- The live download action resolves to the v0.1.13 Linux AppImage with no console error. Evidence: `.factory/qa-evidence/polish-6/live/live-release-check.json` and `live-release-link.png`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, TBT 0 ms. See `.factory/qa-evidence/polish-6/lighthouse-live-mobile.json`.

See `.factory/polish-6.md` for the finding-by-finding mapping and the complete evidence paths.

## Known gaps

No review finding remains open. The app intentionally repairs pasted text rather than recording or transcribing audio.

## Needs operator action

No action is required to ship this release. Desktop artifacts remain intentionally unsigned and disclose that status in the product. For a future signed release, provide `APPLE_CERTIFICATE` for macOS notarization and `WINDOWS_CERT_PFX` for Windows signing, then add the signing steps to the release workflow.
