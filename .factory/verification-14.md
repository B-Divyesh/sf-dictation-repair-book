# Independent verification 14 — PASS

**Candidate:** `3fd96a2508454c9108ac92a522741ce1ee63d867`  
**URL:** <https://dictation-repair-book.sociobot.in>  
**Verified:** 2026-09-02 (UTC)

## Release decision

**PASS.** There are no release-blocking findings.

The candidate changes only `.factory` documentation and evidence compared with
the published `v0.1.11` source commit `e3fa407cc2be1bfa4521be618a8130f730c89db0`.
`git diff --quiet v0.1.11 HEAD -- ':!/.factory'` returned success. The deployed
application is therefore the same product code as the candidate; a fresh live
check matched all 36 served site files byte-for-byte with the local production
build. The deployment deliberately does not serve its private
`staticwebapp.config.json` as public content.

## Required first-read and claims gate

The 34 commands in `.factory/claims.json` were run from this clean checkout
before opening the live product. All passed. The subsequent complete suite
again covered the claims: 27 Vitest tests, the installer contract, four native
Rust tests, and 46 Playwright tests passed.

Cold first read at 1440 × 900:

- It says it turns dictation corrections into reusable rules.
- It names dictation users with names, medications, code terms, or workplace
  jargon as its audience.
- The first action is **Try it with sample data**, immediately explained as
  opening a separate sample repair book which cannot enter the real book.

This satisfies the plain-words and one-click demo gate.

## Local verification

Passed from a clean `npm ci` installation:

```text
npm test                         27 unit + installer + 4 native + 46 E2E passed
npm run typecheck                passed
npm run lint                     passed
npm run build                    passed; dist/app and dist/site produced
cargo check --no-default-features passed
cargo fmt --check               passed
```

The production build’s initial landing assets are 1.88 KB gzip JavaScript and
3.23 KB gzip CSS, inside the stated budgets. The exhaustive demo tests cover
normal correction approval/reuse, code-token replacement, overlapping rules,
search/delete/undo, export/import round trip, 25-rule boundary and license
lock, malformed local/imported data recovery, clipboard-on-command, erase,
offline reload, and native sample isolation.

## Live verification

`scripts/verify-live.mjs` passed against the URL. It checked `/`, `/demo/`,
`/privacy/`, `/terms/`, and a missing route (correct 404): each real route has
one `h1`, `main`, `lang=en`, correct title, no missing image alt text, no
serious/critical Axe findings, and no page/console error. The expected browser
network error for the deliberately missing route was the only 404 log.

- Desktop: skip link is first and focuses `main`; demo history back/forward
  restores the view, focused `h1`, and live announcement. A sample Kubernetes
  phrase repaired locally; Reset restored sample data; Start for real discarded
  only demo data.
- Mobile 390 × 844 in dark/reduced-motion mode: no horizontal overflow, no
  demo-banner overlap, reduced scroll behaviour is `auto`, and no serious or
  critical Axe issue.
- Privacy: the full sample flow made zero requests outside the product origin.
  Cold load had no console error. Response CSP permits only `self`, GitHub’s
  release API, and the documented Sociobot billing API; permissions disable
  camera, microphone, and geolocation. No tracking, third-party font, or
  third-party script request was observed.
- Offline: once controlled by the service worker, `/demo` returned 200 and the
  shipped Kubernetes sample was visible offline; an offline missing route still
  returned its designed 404.
- Headers: HTTPS, HSTS, `nosniff`, strict-origin referrer policy, restrictive
  CSP including response-header `frame-ancestors 'none'`, and 30-second HTML
  revalidation were present. There is no product server endpoint; licensing is
  an on-demand external Sociobot verification flow and its client backoff is
  covered by `@claim:license-backoff`.

Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
100, SEO 100; LCP 1,497 ms, CLS 0, and TBT 10 ms.

## Desktop release

GitHub release `v0.1.11` is published with both macOS DMGs, Windows MSI/EXE,
Linux AppImage/DEB, `SHA256SUMS`, and `latest.json`. I downloaded the Linux
DEB anew and verified it against the published checksum (`OK`); its metadata
is `dictation-repair-book` version `0.1.11`, architecture `amd64`. Builds are
intentionally unsigned and the site warns users before download.

## Evidence

Fresh artifacts are in `.factory/verification-artifacts-14/`:

- `live-cold.png` — cold first-read capture
- `live/` — route/a11y/desktop/mobile/offline results and screenshots
- `lighthouse-live-mobile.json` — fresh mobile Lighthouse report

## Defects

No critical, high, medium, or low defects found. No code was modified during
this verification.
