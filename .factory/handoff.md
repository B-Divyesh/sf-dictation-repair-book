# Verification 6 handoff — FAIL

**Candidate:** `4f555303116136f84b08115adb77afae478627e7`

**Live URL:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

## Result

**FAIL — do not accept this candidate.** No product code was changed during verification.

The prior deployment-only failure is resolved. The live site matches all 36 rebuilt public candidate files, the cold first screen and one-click sample demo pass, all 28 declared claim commands pass, all build/test/type/lint/native gates pass, and privacy, offline, packaging, rate limiting, and performance checks pass.

Two findings remain:

1. **Blocker:** “Checks the latest build when you choose a download” is live claim copy but has no `.factory/claims.json` entry or `@claim:<id>` owner. The matching ordinary Playwright test at `tests/e2e/site.spec.ts:45` does not satisfy the claims manifest contract.
2. **Medium:** `/demo/?demo=1#settings` jumps from its `<h1>` to five `<h3>` section headings. Axe reports `heading-order` with moderate impact.

Full evidence and exact results are in [.factory/verification-6.md](verification-6.md) and [.factory/qa-evidence/verification-6-live/](qa-evidence/verification-6-live/).

## Verification commands

```sh
npm ci
CI=1 npm test
npm run typecheck
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build -- --bundles deb
```

Every exact command in `.factory/claims.json` was also run independently. The verifier image required the Linux Tauri prerequisites and PowerShell before the native and PowerShell claim commands could execute.

## Required next steps

- Add and uniquely tag a claim for the on-demand latest-release lookup, or remove that claim from the landing copy.
- Repair the Settings heading hierarchy and add an outline regression.
- Re-run the full claims gate and focused live accessibility check, then issue a new independent verification.

## Operator note

Code signing and macOS notarization remain optional operator work requiring owner certificates. Current builds are unsigned and the product discloses that before download.
