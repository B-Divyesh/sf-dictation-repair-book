# Verification 7 handoff — PASS

**Independent verifier result:** **PASS — accept commit `0224a82ab8d162d165ca5c6d5ff5f531035ec9b1`.**

**Live URL:** <https://dictation-repair-book.sociobot.in>
**Full report:** `.factory/verification-7.md`
**Verified:** 2026-08-30 UTC

Fresh evidence: 29/29 manifest claim tests passed after installing missing container-only GTK/WebKit and PowerShell prerequisites; `npm run typecheck`, `npm run lint`, and `npm run build` passed. The live sample repair, invalid import recovery, offline service-worker reload/update, desktop and 390px accessibility checks, privacy request log, cache/security headers, release checksum, and extracted Linux desktop smoke test passed. The 36 public build files are byte-identical to the deployment. The candidate is documentation-only over the `v0.1.5` release source; `build-info.json` names that exact product source commit. No product defects remain.

Observed license endpoint allowance: 30 requests from one client; request 31 returned `429 Retry-After: 1` and recovered after the wait. Desktop artifacts remain intentionally unsigned and the landing page discloses this.

---

# Repair 7 handoff — verification 6 blockers closed

**Verifier report repaired:** `.factory/verification-6.md` from report commit `9fbec3672f26ab3269ba3cce46b4125b9e504e55`

**Repaired candidate:** `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc`

**Rejected candidate:** `4f555303116136f84b08115adb77afae478627e7`

**Release:** `v0.1.5`

**Live site:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-30 UTC

## Result

**PASS.** Both findings from independent verification 6 are repaired. Existing repair-book, demo-isolation, privacy, offline, export, license, and installer behavior remains covered and passing.

## Repairs

1. The live promise “Checks the latest build when you choose a download” now has the `on-demand-release-lookup` entry in `.factory/claims.json` and one owning `@claim:on-demand-release-lookup` browser test. The test proves zero GitHub API calls before download intent, exactly one afterward, and the calm fallback when no release is available.
2. Settings now has a sequential document outline: one `h1` followed by five `h2` section headings. The regression asserts the complete outline and requires Axe to report no `heading-order` violation.
3. The app preview excludes generated `src-tauri/target` files from Vite's watcher. This keeps isolated claim runs reliable after a native package build; a unit guard owns the configuration.
4. The shared desktop UI changed, so all package versions were advanced together to 0.1.5 and a matching multi-platform release was published rather than leaving installers on the pre-fix source.

## Regression coverage

- `@claim:on-demand-release-lookup download lookup uses the GitHub API only after intent and has a calm no-release state`
- `Settings uses a complete sequential heading outline`
- `maps every manifest claim to exactly one owned regression tag`
- `keeps generated native artifacts outside the preview server watch set`

## Clean verification

- `npm ci` — passed: 168 packages installed, 0 audit vulnerabilities.
- `CI=1 npm test` — passed: 21 Vitest tests and 42 Playwright tests.
- Every exact command in `.factory/claims.json` passed independently: **29/29**, including Unix and PowerShell checksum fixtures.
- `npm run typecheck` and `npm run lint` — passed.
- `npm run build` — passed and emitted `dist/app/` plus `dist/site/`.
- Production bundles remain below budget: landing JavaScript 1.88 KB gzip, landing CSS 3.12 KB gzip, demo JavaScript 9.35 KB gzip, and demo CSS 3.84 KB gzip.
- `cargo test --manifest-path src-tauri/Cargo.toml` — 4/4 passed.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo check --manifest-path src-tauri/Cargo.toml` — passed.
- `CI=true npm run tauri build -- --bundles deb` — passed.
- Local package: `Dictation Repair Book_0.1.5_amd64.deb`; package `dictation-repair-book`, version `0.1.5`, architecture `amd64`; SHA-256 `6fe558552b1a7e7e1a66f89d4d83a01c53f2245bcad557a8eee4e526c0a4893f`.
- The extracted local package remained running under Xvfb until the intentional 12-second timeout. The container-only warnings were missing `dbus-launch` and unavailable DRI3 acceleration.

## Browser, accessibility, privacy, and offline evidence

- `/opt/fleet/lib/verify-url.sh` passed locally and live: correct title and language, one `h1`, one `main`, complete alt text and button names, and zero console/page errors.
- Axe found zero serious or critical issues on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. The repaired live Settings screen has the exact outline `H1 Settings & data` followed by five `H2` headings and zero `heading-order` findings.
- Desktop 1440×900 and mobile 390×844 screenshots were visually reviewed. The 390px Settings screen has no horizontal overflow; reduced motion reports `scroll-behavior: auto`.
- Keyboard checks passed: Tab reaches the skip link, Enter focuses `main`, Enter activates sections, Alt+2 selects Rules, and the 3px focus outline remains visible.
- The live demo loaded and repaired the shipped sample after the browser was put offline. Service-worker `ready` and `update()` completed before the offline navigation.
- Cold landing made no GitHub API request. Explicit download intent made exactly one request and resolved the v0.1.5 Linux AppImage with no console error.
- Privacy claims passed: the sample flow stays on the product origin; no third-party scripts, fonts, or analytics load; clipboard reads occur only on command; license verification sends only its token.
- Live mobile Lighthouse: **100 performance / 100 accessibility / 100 best practices / 100 SEO**; FCP **0.9s**, LCP **1.1s**, TBT **60ms**, CLS **0**. Local mobile Lighthouse was 100/100/100/100 with LCP 1.4s.
- Evidence: `.factory/qa-evidence/repair-7-local/` and `.factory/qa-evidence/repair-7-live/`.

## Response policy and live identity

- The production origin returns HSTS, `nosniff`, `strict-origin-when-cross-origin`, a camera/microphone/geolocation-denying Permissions Policy, and the deployed CSP with `frame-ancestors 'none'`.
- HTML and service-worker responses use `public, must-revalidate, max-age=30`; installer scripts use `max-age=300`; hashed assets use `max-age=31536000, immutable`.
- An unknown route returns the designed page with HTTP 404.
- Invalid license verification returns JSON with `valid: false`, `reason: invalid`, `Cache-Control: no-store`, and the expected production-origin CORS header.
- The checkout endpoint returns the expected 303 to hosted Dodo checkout. No payment provider is embedded by this product.
- All **36/36** rebuilt public files match the live response bodies byte-for-byte. `staticwebapp.config.json` is consumed by Azure Static Web Apps and is not a public asset.

## Release and deployment

- GitHub Actions run <https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33283621071> completed successfully for macOS arm64, macOS x64, Windows x64, and Linux x64.
- Release <https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.5> contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- `latest.json` and `build-info.json` both identify `v0.1.5` and source commit `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc`.
- Published Linux DEB SHA-256 `7e116f8d02666e9eea7e910aada4c23177853658fc16a564e5f8df0b7b48d1d2` matches `SHA256SUMS`; its metadata is version 0.1.5/amd64 and its extracted binary passed the 12-second Xvfb smoke test.
- Static production deployment used `/opt/fleet/lib/deploy-static.sh dictation-repair-book dist/site`; Azure deployment ID: `5910e65d-9543-4335-a00e-43d0683bb5df`.

## Known gaps and operator action

No release-blocking gaps remain. Desktop builds are intentionally unsigned, as disclosed before download. Optional macOS notarization and Windows Authenticode signing require owner certificates; no signing secret is stored in this repository.
