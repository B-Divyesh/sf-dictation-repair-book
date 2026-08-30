# Repair 8 handoff — PASS

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

- Committed and pushed repair `99fdc51de4a209400cdb7b03a6bd443175aae5f5` as `fix: publish exact-source desktop repair`, then tagged and pushed **`v0.1.6`** from that exact commit.
- GitHub Actions run [33292742097](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33292742097) completed successfully: macOS arm64/x64, Windows x64, Linux x64, and Publish release all passed. The workflow's new provenance/checksum gate ran before the GitHub Release upload.
- GitHub Release `v0.1.6` published at `2026-08-30T04:39:59Z`. Downloaded `latest.json` and `build-info.json` both declare `v0.1.6` and source commit `99fdc51de4a209400cdb7b03a6bd443175aae5f5`; `build-info.json` lists all six bundles (two macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB).
- The released `SHA256SUMS` contains all six bundle entries and matches `latest.json`. The downloaded Linux DEB checksum is `4e087babc80fe7f5ed61638d440f7f081c7213b062a8af0157fba2d697fed600`; `sha256sum -c` passed, package metadata is `dictation-repair-book 0.1.6 amd64`, and its extracted binary remained running under Xvfb for 12 seconds.
- Deployed `dist/site/` using `/opt/fleet/lib/deploy-static.sh dictation-repair-book dist/site`; Azure deployment `b054e037-6c50-4639-b685-4504a03648c5` succeeded. Live `https://dictation-repair-book.sociobot.in` serves v0.1.6 with HSTS, CSP, `nosniff`, strict-origin referrer policy, and no console errors. A 390px live browser test measured the home link at 220.36×44px and resolved its download action to the real v0.1.6 Linux AppImage without errors.

## Operator action

The release is intentionally unsigned. macOS notarization and Windows Authenticode still require the owner's `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub secrets; no secret is embedded in this repository.
