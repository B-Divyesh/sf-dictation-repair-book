# Independent verification 3 — PASS

**Acceptance candidate:** `d476b4dd900130ff1748712af6db90c754c1c9cd`
**Live URL:** <https://dictation-repair-book.sociobot.in>
**Verified:** 2026-08-29 UTC
**Result:** **PASS — release accepted**

This was a clean-checkout, independent verification. Product code was not changed. The only repository changes made by this verifier are this report and the verification note in `.factory/handoff.md`.

## Mandatory gates

### Claims: 22/22 passed

`.factory/claims.json` exists and contains 22 claims. After `npm ci`, every listed command was run individually, before broader product inspection. The initial native invocation correctly reported the clean image was missing the standard Linux Tauri development libraries; after installing the same Linux prerequisites declared in `.github/workflows/release.yml`, both exact native commands passed. This is verifier-environment setup, not a product failure.

| Claim IDs | Exact listed command form | Result |
| --- | --- | --- |
| `demo-sandbox`, `rule-management`, `local-repair`, `portable-exports`, `json-roundtrip`, `whisper-export`, `private-demo`, `website-privacy`, `clipboard-on-command`, `free-book`, `erase-local-book`, `license-backoff`, `license-daily-cache`, `license-return`, `revoked-license-locks`, `offline-demo` | `npm run test:e2e -- --grep @claim:<id>` | Pass individually, 16/16 |
| `literal-code-replacement`, `explicit-access`, `checksum-installers`, `release-matrix` | `npm run test:unit -- --testNamePattern @claim:<id>` | Pass individually, 4/4 |
| `native-erase` | `cargo test --manifest-path src-tauri/Cargo.toml claim_native_erase_removes_vault_and_key` | Pass |
| `encrypted-vault` | `cargo test --manifest-path src-tauri/Cargo.toml claim_encrypted_vault_uses_aes_256_gcm` | Pass |

### Cold first-read: pass

On a fresh 1440 px browser visit, the first screen says **“Teach dictation your words.”** It plainly identifies the audience as dictation users with names, medications, code terms, or workplace jargon; explains that explicit corrections become inspectable reusable rules; and presents **“Try it with sample data”** as the first action, including the immediate consequence: it opens a separate sample repair book and does not enter the real book. The one-click action opened `/demo/` with the three shipped realistic sample rules.

At 390 px the same intent, action, and privacy facts remain visible and there is no horizontal overflow.

## Build and automated quality gates

| Check | Fresh result |
| --- | --- |
| `npm ci` | Passed; 168 packages installed; npm audit reported 0 vulnerabilities. |
| `npm test` | Passed: Vitest 14/14 and Playwright 26/26. |
| `npm run typecheck` | Passed. |
| `npm run lint` | Passed. |
| `npm run build` | Passed; emitted `dist/app/` and `dist/site/`. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Passed: 3/3 Rust tests. |
| `cargo fmt --manifest-path src-tauri/Cargo.toml --check` | Passed. |
| `cargo check --manifest-path src-tauri/Cargo.toml` | Passed. |

The production static build is small: landing JavaScript is 1.94 KB gzip, demo JavaScript 8.50 KB gzip, landing CSS 2.97 KB gzip, demo CSS 3.82 KB gzip, and the mobile hero is 47,766 bytes. No external fonts are loaded.

Mobile Lighthouse collected 100/100/100/100 (performance/accessibility/best-practices/SEO), with FCP/LCP 1.2 s, TBT 0 ms, and CLS 0. The Lighthouse process then reported `TARGET_CRASHED` while collecting its full-page screenshot; the report already contained the scores and every equivalent live Playwright navigation completed with no page crash or console error. This is recorded as a verifier-browser artifact, not a product defect.

## Independent functional QA

- Normal demo flow: repaired `Deploy the cube or net ease service.` to `Deploy the Kubernetes service.` locally.
- Boundary and rule-management coverage: the independently executed claim suite covered the 25-rule free limit, cached/revoked licensing, deletion/undo, search, source removal, CSV/JSON round-trip, unique Whisper export, literal `$&` code-term replacement, and native encrypted-vault deletion.
- Invalid input and recovery: unchanged before/after text produced the clear recovery message “I could not isolate a changed term…”. A malformed partial JSON backup showed “That file is not a valid Dictation Repair Book backup. Your current book was not changed.” and did not cause a page error.
- Demo isolation: demo requests stayed on the product origin; only `demo:drb_web_preview_state` was present after the flow. Reset and “Start for real” behavior passed its isolated-storage claim test.
- PWA: after the first online visit, a service worker controlled the page (`drb-site-v5` cache). `registration.update()` completed with no waiting/installation error. With the browser offline, `/demo/` returned 200, rendered the Kubernetes sample, and emitted no console/page errors.
- Keyboard and accessibility: the landing skip link focused and moved focus to `#main`; demo Settings opened by keyboard; visible focus outlines measured 3 px. On `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404, Playwright Axe found zero serious or critical violations. The worker `verify-url.sh` is not present in this repository, so the equivalent title/lang/main/alt/console checks were performed in Playwright.
- Mobile/reduced motion: at 390×844 in dark + reduced-motion mode, Rules and Settings both measured 390 px scroll/client width, `scroll-behavior` was `auto`, and Reset demo/Start for real measured 44 px high.

## Privacy, headers, requests, and rate limit

- Cold landing requests were only same-origin assets plus the disclosed `https://api.github.com/.../releases/latest` lookup. The complete demo repair flow made same-origin requests only. No analytics, third-party scripts, or third-party fonts were observed.
- Live headers include CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, and a permissions policy denying camera, microphone, and geolocation. Hashed assets are `max-age=31536000, immutable`; HTML/service-worker responses are revalidated at 30 seconds; installers cache for 300 seconds.
- The product has no sign-in. It does not use any identity provider.
- The Sociobot license-verification endpoint was exercised as required. Requests 1–30 from one client with an invalid test token returned 200 invalid verdicts; request 31 returned **429** with **`Retry-After: 3`**. Observed allowance: **30 requests per client/window**.

## Deployment and desktop-release identity

The live static deployment is the candidate build. Fresh byte comparisons matched local `dist/site` for `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, `/sw.js`, the landing JS/CSS, demo JS, and the hero image. For example, both local and live `/assets/index-WamkOEId.js` SHA-256 values were `457c7fb2deb2f9e74a4a7c7c6c31aa249e86cb50cf46d689f834eb4252b14dc5`.

The published `v0.1.2` desktop release contains all required macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, and `latest.json`. The downloaded Linux DEB SHA-256 was `c2131227279662bc7dd924ba760886656e342abea047f28e26195da8a54164bc`, exactly matching the release checksum. `dpkg-deb -I` reports package version `0.1.2` and appropriate GTK/WebKit/AppIndicator dependencies. Extracted under Xvfb, the binary remained running until the intentional 10-second timeout; only expected headless EGL/session-bus warnings occurred.

The release tag dereferences to `61302673d33e836edfd718da47b4adf3fe923cd5`. The delta from that tag to this candidate has no `src/`, `src-tauri/`, `site/`, or `public/` runtime change; it is README, claim/test, and prior verification evidence. Thus the packaged runtime source is also the candidate runtime source.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Blocker | None. |
| Serious | None. |
| Medium | None. |
| Minor | None. |

## Notes

- Unknown-route navigation correctly returns the designed 404 with HTTP 404. Its browser console naturally records the failed 404 resource; successful routes had zero console/page errors.
- The desktop packages are unsigned, but this is disclosed on the landing page and in the README. It is a known operator/signing limitation, not a hidden defect.
