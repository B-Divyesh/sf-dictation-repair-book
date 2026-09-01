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

Tag `v0.1.8` points to the exact repaired source commit
`49fd9e80d963157bf0763e041420b5ff748ea3ba`. GitHub Actions run
[`33556576508`](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33556576508)
completed successfully for that commit. The release contains both macOS DMGs,
Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and
`build-info.json`. Both identity manifests name the full tag commit.

The published Linux DEB was downloaded independently. Its SHA-256 is
`1091f6804001c9d122c05ff6e71cd36b3b00ea1dad9e584bb08dcb253f14f032`,
which matches `SHA256SUMS`; package metadata reports version 0.1.8 and
architecture amd64. The extracted published binary was run with isolated
data, config, and cache directories under a real 1180×780 native window. Its
footer reported `v0.1.8 · 49fd9e80d963`. Loading the sample and repairing
“Deploy the cube or net ease service.” produced “Deploy the Kubernetes
service.” with one Kubernetes rule applied. The published sample banner did
not overlap the kicker, heading, or rule count.

The static site was deployed only to `sf-dictation-repair-book`; deployment ID
`1155d55c-9988-4cea-a1ba-9ca3133da4e6`. All 36 deployed files match the local
`dist/site` files byte-for-byte by SHA-256. The live platform resolver links
to the real v0.1.8 AppImage, shows its checksum state, and logs no browser
errors. The live site returns the expected CSP, HSTS, referrer, permissions,
and content-type headers; hashed assets are immutable for one year and an
unknown route returns 404.

Live verification at
`https://dictation-repair-book.sociobot.in`:

- `verify-url.sh`: HTTP 200 in 784 ms, correct title and language, one `h1`,
  `main`, no missing alternatives or unlabelled buttons, and no errors.
- Browser: desktop keyboard/skip-link checks passed. At 390×844, the page has
  no overflow or banner overlap; dark mode, reduced motion, sample repair,
  same-origin privacy, serious/critical Axe scans, and offline reload passed.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 30 ms, CLS 0, speed index 0.9 s.

Release and live evidence:

- `.factory/qa-evidence/repair-10-live/release-v0.1.8/`
- `.factory/qa-evidence/repair-10-live/native/published-first-run.png`
- `.factory/qa-evidence/repair-10-live/native/published-sample-1180x780.png`
- `.factory/qa-evidence/repair-10-live/native/published-repair-result.png`
- `.factory/qa-evidence/repair-10-live/browser-summary.json`
- `.factory/qa-evidence/repair-10-live/lighthouse-mobile.json`
- `.factory/qa-evidence/repair-10-live/verify-url/`
- `.factory/qa-evidence/repair-10-live/release-and-deploy-summary.json`

## Known gaps and operator action

The builds are intentionally unsigned. macOS notarization and Windows
Authenticode still require owner-managed `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` GitHub secrets. No signing secret is stored here.
