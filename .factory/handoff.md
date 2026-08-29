# Repair handoff — Playwright lifecycle repair

**Verifier report repaired:** `.factory/verification-4.md` (report commit `4b6edc0fc2c41829bbb70ef3861b6a578f4cf42f`)

**Base candidate:** `b12ff3b589416214c991411f41c671be3684c818`

**Desktop release retained:** [`v0.1.3`](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.3), built from `cdfcf3eb76694aacefc952d43c77842d50d3128a`

**Live site:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

## Result

**PASS.** The earlier release-artifact blocker remains repaired by the published `v0.1.3` desktop release. This repair fixes the controller’s subsequent release-blocking test instability without changing application or site runtime behavior: the CI browser suite now owns and closes its preview servers and gives every test a new Chromium browser and browser context.

## Reproduced controller finding

From a clean `npm ci` install, the unmodified candidate was run with `CI=1 npm test`. Vitest passed **17/17**. Chromium then ran with two workers, passed **32/33** browser tests, and crashed while the final `keyboard skip link moves focus into the landing main content` test attempted to create its context. The browser log recorded `Received signal 11 SEGV_MAPERR`, and Playwright reported `browser.newContext: Target page, context or browser has been closed`.

## What changed

- Made CI browser execution serial (`CI=1` uses one worker).
- Added a test-scoped fixture that launches, closes, and isolates one Chromium browser/context/page per browser test. A browser crash or storage/service-worker state can no longer spill into a later test.
- Made Playwright own strict-port preview processes. The commands use `exec`, never reuse an existing server, receive explicit `SIGTERM` shutdown, and the e2e wrapper fails if ports `4173` or `1420` survive the run.
- Added regression coverage for the CI configuration, explicit browser/context closure, and cross-test local-storage isolation.
- Preserved the existing release identity repair, all product claims, Tauri functionality, static artifact class, and deployment configuration.

## Verification

Clean install and browser lifecycle:

- `npm ci` — passed; 168 packages installed; audit reported 0 vulnerabilities.
- `CI=1 npm test` — **18 Vitest + 36 Playwright tests passed** in one worker. This includes the final skip-link test that previously failed.
- `CI=1 npm run test:e2e` — 36/36 passed; the runner verified that both preview ports were closed afterward. The suite now also calls `ServiceWorkerRegistration.update()` and asserts no console/page errors.
- Every exact command in `.factory/claims.json` passed individually (**28/28**), including all privacy, demo, offline, license, installer, release-matrix, encryption, native erase, and PowerShell checksum claims. The clean image needed the release workflow’s Linux WebKit/GLib prerequisites and a temporary PowerShell 7.5.4 runtime; neither is a repository change.

Quality and accessibility:

- `npm run typecheck`, `npm run lint`, and `npm run build` — passed. `dist/app/` and `dist/site/` were emitted; largest app JS is 9.59 KB gzip and landing JS is 1.52 KB gzip.
- `cargo test --manifest-path src-tauri/Cargo.toml` — 4/4 passed. `cargo fmt --check` and `cargo check` passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173` passed against the production build: title, `lang=en`, exactly one `<h1>`, one `<main>`, complete image alt text, labelled controls, and no console/page errors. Playwright Axe coverage on the public routes remains green for serious/critical findings; desktop, 390 px mobile, keyboard, privacy, service-worker offline, and update paths run in the permanent suite.

Published desktop package:

- GitHub Release `v0.1.3` contains the six desktop bundles, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- The downloaded Linux DEB SHA-256 was `968ea39cbe3f07d5a655518b2539c4ad09519b981b2081e9eb7a1be69c49102e`, matching published `SHA256SUMS`; `dpkg-deb -f` reports `dictation-repair-book` `0.1.3` for `amd64`.
- The extracted release ran under Xvfb for the intentional 12-second timeout and wrote zero stderr bytes.

Live deployment:

- Repair commit `17dc1e4` was pushed to `origin/main`.
- `swa deploy dist/site --app-name sf-dictation-repair-book --resource-group sociobot --env production --no-use-keychain` completed against the existing production Static Web App.
- The custom domain returned HTTPS 200 after deployment. `verify-url.sh` measured a 1,231 ms load with zero console/page errors and the expected title, `lang=en`, one `<h1>`, one `<main>`, complete alt text, and labelled controls. Response headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, the strict referrer policy, and a camera/microphone/geolocation-denying Permissions Policy.
- Fresh SHA-256 comparisons exactly matched `dist/site/` and the live `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/sw.js` responses.

## Known gaps and next steps

No product gaps remain. Desktop bundles are intentionally unsigned, as disclosed on the landing page and in the README. Code signing and notarization remain optional operator work requiring owner certificates; no signing secrets are in this repository.
