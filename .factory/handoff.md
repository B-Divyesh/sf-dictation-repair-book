# Repair 10 handoff — native layout and release identity

**Verifier report:** `1b60a90aa5f5224102385025a7c6b7d36fb6342d`
**Failed candidate:** `3b25f03ad7f011a7132062de9df5e7e00039ab5e`
**Release:** `v0.1.8`

## Release-blocking repairs

- Reproduced the native sample-banner defect before changing code at the
  configured 1180×780 window. Its `x=464, y=12, width=700, height=64`
  rectangle intersected the page kicker, **Approved rules** heading, and
  approved-rule count.
- Moved the installed-app sample banner into the active page's document flow.
  At the same 1180×780 viewport its bottom is now `y=104`; the kicker begins
  at `y=136`. Exact rectangle checks report no overlap with any of the three
  heading elements and no horizontal overflow.
- Added a 1180×780 Playwright regression that enters native sample mode and
  checks all three intersections. The existing 390 px demo and app checks
  remain unchanged and pass.
- Bumped all application versions to 0.1.8. Packaged webviews now retain the
  full 40-character release commit as machine-readable app metadata while the
  footer shows the tag plus the first 12 characters.
- Added `scripts/verify-built-identity.mjs` and wired it into every release
  matrix job after the Tauri build. The release fails unless the production
  webview contains the exact release tag and full source commit.
- Added `@claim:artifact-identity`, which builds a real production webview
  with a fixture identity, accepts the exact commit, and rejects a stale one.
  Existing manifest/source/checksum guards remain in place.

Before/after evidence:

- `.factory/qa-evidence/repair-10-reproduction/native-banner-overlap-before.png`
- `.factory/qa-evidence/repair-10-reproduction/banner-layout.json`
- `.factory/qa-evidence/repair-10-local/native-banner-1180x780-after.png`
- `.factory/qa-evidence/repair-10-local/banner-layout.json`

## Clean local verification

Completed on 2026-09-01:

- `npm ci`: 168 packages; 0 vulnerabilities.
- Every literal command in `.factory/claims.json`: **34/34 passed**
  independently against the final 0.1.8 source in 145.3 seconds.
- `npm test`: 27 Vitest checks, portable Windows installer contract, four
  no-GUI Rust tests, and **45/45 Playwright checks passed**.
- `npm run typecheck`, `npm run lint`,
  `cargo fmt --manifest-path src-tauri/Cargo.toml --check`, and
  `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`
  passed.
- `npm run build` produced `dist/app/` and `dist/site/`. Initial app JS is
  10.02 KB gzip and CSS is 4.05 KB gzip; landing JS is 1.88 KB gzip plus the
  0.44 KB preload helper and CSS is 3.23 KB gzip.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173
  .factory/qa-evidence/repair-10-local/verify-url` passed in 693 ms: HTTP 200,
  title, `lang=en`, one `h1`, `main`, image alternatives, labelled buttons,
  and no console errors.
- Lighthouse 12.8.2 mobile: performance 100, accessibility 100, best
  practices 100, SEO 100; FCP 1.0 s, LCP 1.5 s, total blocking time 0 ms,
  CLS 0, speed index 1.0 s.
- Browser coverage includes 1440×900 and 1366×768 desktop, the exact native
  1180×780 window, 390×844 mobile, dark mode, reduced motion, keyboard-only
  use, focus, touch targets, serious/critical Axe scans, same-origin privacy,
  offline demo reload, service-worker update, recovery errors, and 404 status.

## Publication and deployment

The first publication attempt (`v0.1.7`, run `33554922321`) safely stopped
before its publish job: the Windows runner exposed that its default PowerShell
shell did not populate the Bash-style `GITHUB_OUTPUT` assignment. Linux and
both macOS jobs passed their identity checks. Both source-identity steps now
declare Bash explicitly, and the artifact-identity test locks that requirement.

The repaired source is prepared for tag `v0.1.8`. The tag-triggered GitHub
workflow builds two macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, then
publishes `SHA256SUMS`, `latest.json`, and `build-info.json`. Remote workflow,
downloaded-artifact, deployment, response-header, and live identity evidence
will be recorded here after publication.

## Known gaps and operator action

The builds are intentionally unsigned. macOS notarization and Windows
Authenticode still require owner-managed `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` GitHub secrets. No signing secret is stored here.
