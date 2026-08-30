# Repair 8 handoff — ready to publish

This repair closes every release-blocking finding in `.factory/verification-8.md` for the `65e106d` candidate while preserving the accepted repair-book flow, demo namespace, local-first storage, and pricing behavior.

## Repairs

- Bumped the desktop app, site, Cargo package, and Tauri package to **v0.1.6**.
- Added `scripts/verify-release-artifacts.mjs` and a required release-workflow step. It rejects any `latest.json` or `build-info.json` whose version or commit is not the exact tagged source, and rejects stale or mismatched SHA-256 entries before GitHub Release upload. The regression fixture reproduces the verifier's stale `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc` manifest and proves it fails.
- Raised the 390px demo home/wordmark target from 42px to **44px** high. Browser regression coverage measures its 220.36×44px box in dark/reduced-motion mobile mode.
- Replaced the byte-duplicate Capture walkthrough with a new 1440×960 Playwright capture of the actual before/after Capture form. Capture and Rules checksums now differ (`1e665ac2…` vs `90fd4b9f…`), and a regression asserts distinct image bytes and accurate landing alt text.
- Replaced app-section hash pseudo-routes with query history URLs such as `/demo/?view=test`. Navigation prevents the browser's default reload, retains native sample isolation, restores with Back/Forward, focuses the route heading, announces it, and is covered by browser regression tests.

## Local verification

Completed on 2026-08-30 after a clean `npm ci` (168 packages, 0 vulnerabilities):

- `npm test`: **25 Vitest + 44 Playwright** tests passed. This covers the complete claims inventory, desktop/mobile browser flow, keyboard, reduced motion, offline reload/update, privacy request boundary, and Axe serious/critical checks.
- `npm run typecheck`, `npm run lint`, and `npm run build`: passed. The build writes `dist/app/` and `dist/site/`; gzip sizes are 9.98KB app JavaScript, 9.74KB demo JavaScript, 1.88KB landing JavaScript, and 3.23KB landing CSS.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`, `cargo test --manifest-path src-tauri/Cargo.toml` (4 tests), and `cargo check --manifest-path src-tauri/Cargo.toml`: passed after installing the same Linux GTK/WebKit build prerequisites used in the release workflow.
- `pwsh -NoLogo -NoProfile -File tests/installers.ps1`: passed for checksum match and mismatch paths.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/qa-evidence/repair-8-local`: passed with no console errors, one title, `lang=en`, one `h1`, `main`, and complete image alt text.
- Local mobile Lighthouse: **100 performance / 100 accessibility / 100 best practices / 100 SEO**, LCP 131ms, CLS 0. The runner used the installed Playwright Chromium with `--disable-dev-shm-usage --disable-gpu`.

Evidence is in `.factory/qa-evidence/repair-8-local/`; the authoritative independent-failure report remains `.factory/verification-8.md`.

## Publish and deploy

Push the repair commit and tag it `v0.1.6`. The GitHub workflow builds macOS arm64/x64 DMGs, Windows MSI/EXE, and Linux AppImage/DEB, then emits `SHA256SUMS`, `latest.json`, and `build-info.json` from that exact tag. Its new provenance gate must pass before upload. Deploy `dist/site/` with `/opt/fleet/lib/deploy-static.sh dictation-repair-book dist/site`, then verify the live release API and downloaded artifact checksum.

## Operator action

The release is intentionally unsigned. macOS notarization and Windows Authenticode still require the owner's `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub secrets; no secret is embedded in this repository.
