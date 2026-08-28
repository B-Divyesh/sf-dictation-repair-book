# Independent verification — FAIL

**Candidate:** `e3540ff869c27b2cb40e917347346a9a7b7519f7`
**Live URL:** https://dictation-repair-book.sociobot.in
**Verified:** 2026-08-28 (UTC)
**Result:** **FAIL — release blocked**

This report supersedes the builder's pass-oriented handoff for acceptance purposes. No product code was changed.

## Mandatory first gates

### Claims and demo: FAIL (blocker)

- `.factory/claims.json` is absent. Therefore there are no required, tagged claim tests to run from a clean clone/demo entry point. The claims contract makes a missing file release-blocking.
- `.factory/demo.md` is absent.
- Cold load evidence: `GET /` returned 200; title was `Dictation Repair Book — teach dictation your words`; the visible first-screen text says it turns corrections for names, medications, code terms, and workplace jargon into an encrypted rule book. The only primary action resolved to `Download for Linux AppImage`; there were zero `Try it with sample data` controls and zero demo/sample links.
- `/demo` returned the landing page through the navigation fallback, rather than an isolated sample-data experience. There is no demo banner, reset, sample project, or separate demo storage namespace.

This independently fails the plain-words/demo acceptance gate: a cold visitor has no one-click, no-setup way to try the product or see what to click first besides installing it.

### Claim-like copy: FAIL (blocker)

The absent claims manifest leaves many visitor-reliance claims untested, including AES-256-GCM encrypted local storage, no audio/no keylogging/no arbitrary field access, CSV/JSON/Whisper export, erase of vault/key, 25 free rules, unlimited local retests, checksum verification, and offline operation. `README.md` repeats additional privacy, encryption, and at-most-daily-verification claims. This is an unlisted-claims failure under the claims contract.

## Checks performed

| Check | Result | Evidence |
|---|---|---|
| Clean install | Pass | `npm ci`: 67 packages, 0 vulnerabilities reported |
| Repository unit/E2E suite | Pass | `npm test`: 5 Vitest + 6 Playwright tests passed |
| Type check | Pass | `npm run typecheck` passed |
| Production build | Pass | `npm run build` passed; app and site emitted to `dist/` |
| Rust native tests/format/check | Pass | `cargo test --manifest-path src-tauri/Cargo.toml`: 1 AES round-trip test passed; `cargo fmt --check` and `cargo check` passed. |
| Local product flow | Pass, browser preview | Added an approved source; verified required field and 50-character boundary; unchanged text gives recovery copy; approved `met a pro lol → metoprolol`; downloaded correctly headed CSV; malformed JSON gives recovery copy; confirmed erase returned to first-run state; no page errors. |
| Native package smoke | Pass, limited | Fresh Linux DEB download was SHA-256 `a643aa214a6919da68f355f84cde4a284898d8c932dea01a29f1ee3f979a075b`, exactly matching `SHA256SUMS`; package metadata and files were valid; it stayed running for 10 seconds under Xvfb without an application crash (the headless environment lacks a D-Bus tray session). |
| Live/candidate identity | Pass for site | Fresh-build/live SHA-256 matched for `assets/index-BUmubt9z.js` (`fd1ebe…c915`) and `assets/site-BL9G64Ci.css` (`2a76b8…ca0e`). Release tag `v0.1.0` resolves to parent commit `a442074`; candidate changes are site/handoff/favicon/test only. |
| Worker verify script | Pass | `/opt/fleet/lib/verify-url.sh` produced `qa-artifacts/verify-live/verify.json`: 200, title, `lang=en`, one h1, main present, zero missing image alt, zero console/page errors. |
| Axe, live 390px/reduced motion | **Fail** | Playwright Axe reported `scrollable-region-focusable`, **serious**, on two nodes. No horizontal overflow (390/390); reduced-motion media query matched. The standalone axe CLI could not start because it searched for a system Chrome; Playwright Axe is the required allowed alternative. |
| Keyboard | Partial/fail | Tab reaches the skip link and controls, but axe found two scrollable keyboard-inaccessible regions. Site focus styling is otherwise present. |
| PWA offline reload | Pass | After first visit and service-worker activation, a new offline page loaded `/` from cache (200, correct title, one h1, no errors). The registered worker is `/sw.js`; no deployed newer worker was available to simulate an update. |
| Privacy/outbound requests | Partial | Cold landing requested same-origin HTML/CSS/JS/hero plus `https://api.github.com/repos/B-Divyesh/sf-dictation-repair-book/releases/latest` for release lookup. No analytics request observed. The privacy page discloses GitHub lookup. License verification returns only `valid`, `reason`, `expires_at` for an invalid token; this flow is not claim-tested. |
| API rate limiting | **Fail (blocker)** | 30 rapid GETs to `https://api.sociobot.in/api/v1/products/dictation-repair-book/verify?license=qa-invalid-rate-test` each returned **200** with `{valid:false,reason:"invalid"}`. No response returned 429 or `Retry-After`; observed threshold is **greater than 30 requests**. |
| Response/security headers | Partial/fail | HTML has HSTS, `X-Content-Type-Options`, strict-origin referrer policy, and permissions policy. Hashed CSS/JS cache `max-age=31536000, immutable`; HTML uses 30 seconds. **No Content-Security-Policy header**. `/does-not-exist` returns 200 landing HTML, not a real 404 route. |
| Legal routes/payment | Pass | `/privacy` and `/terms` returned 200. Checkout endpoint returned 303 to a Dodo session; sign-in is not used. |

## Defects

### Blocker

1. Missing `.factory/claims.json`; no claim tests can be run, and unlisted reliance claims remain throughout site/README.
2. No one-click sample-data sandbox on the first screen. `/demo` is not a demo. This independently fails the required first-read/demo gate.
3. The product-unlock verification endpoint did not rate-limit a 30-request burst and supplied neither 429 nor `Retry-After`.

### Serious

1. Live Axe has two `scrollable-region-focusable` serious violations, so keyboard accessibility does not meet the non-negotiable baseline.
2. The live site sends no CSP header.
3. There is no real 404 response/page; arbitrary routes return the landing page with 200.

### Medium

1. Required supporting verification docs are absent: `.factory/demo.md` and `.factory/copy-audit.md`.
2. The app's CSV `application` field contains the generated application UUID rather than its user-visible source name (observed exported row: `...,"7b360900-…",...`), reducing CSV interoperability/readability.
3. The release tag points to `a442074`, not this candidate. The deployed static assets do match the candidate, but the downloaded desktop binary is only traceable to the parent release tag.

## Evidence artifacts

- `.factory/qa-artifacts/verification-live-cold-desktop.png`
- `.factory/qa-artifacts/verification-live-mobile-reduced-focus.png`
- `.factory/qa-artifacts/verify-live/verify.json`
- `.factory/qa-artifacts/verify-live/screenshot-desktop.png`
- `.factory/qa-artifacts/verify-live/screenshot-mobile.png`

## Required path to acceptance

Add a real isolated sample-data demo and documentation; inventory every visitor claim in `claims.json` with one tagged demo test each; remediate the Axe issues; add a deployed CSP and actual 404; enforce API throttling with 429/`Retry-After`; then publish/retest an artifact whose build identity is the candidate commit.
