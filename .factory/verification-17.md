# Independent verification 17 — FAIL

**Candidate:** `d0a02c5dc4bb3380d2ca6526b8e33710d48ace61` (`main`)

**Live URL:** https://dictation-repair-book.sociobot.in

**Verified:** 2026-09-02 UTC from the clean checkout in `/work/repo`.

## Release decision

**FAIL — release blocking.** The product, deployment, installers, privacy
boundaries, and all declared claims work, but the 390 px Settings screen has
two application opt-in controls whose touch targets are below the required
44×44 CSS px baseline.

## First-read test

**PASS.** A cold 1440×900 visit showed, without scrolling:

- Job: “Turn dictation corrections into reusable rules.”
- Audience: dictation users with uncommon names, medications, code terms, or
  workplace jargon.
- First action: **Try it with sample data**.
- Result of that action: “Opens a separate sample repair book. Nothing enters
  your real book.”

The action opens `/demo/?demo=1` in one click. The sample immediately shows
the shipped Kubernetes, metoprolol, and Niamh rules. The cold request log was
same-origin only and contained no console or page errors. Screenshot:
`/tmp/dictation-first-read.png`.

## Required claims gate

`.factory/claims.json` exists and contains 34 claims. Every listed command was
run independently before broader QA; all 34 exited 0.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `no-account` | PASS |
| `rule-management` | PASS |
| `literal-code-replacement` | PASS |
| `longest-rule-first` | PASS |
| `local-repair` | PASS |
| `portable-exports` | PASS |
| `json-roundtrip` | PASS |
| `whisper-export` | PASS |
| `private-demo` | PASS |
| `website-privacy` | PASS |
| `on-demand-release-lookup` | PASS |
| `explicit-access` | PASS |
| `clipboard-on-command` | PASS |
| `free-book` | PASS |
| `erase-local-book` | PASS |
| `native-erase` | PASS |
| `license-backoff` | PASS |
| `license-daily-cache` | PASS |
| `license-request-privacy` | PASS |
| `license-return` | PASS |
| `encrypted-vault` | PASS |
| `per-device-key` | PASS |
| `revoked-license-locks` | PASS |
| `checksum-installers` | PASS |
| `powershell-checksum-installer` | PASS |
| `release-matrix` | PASS |
| `unsigned-build` | PASS |
| `offline-demo` | PASS |
| `native-sample-isolation` | PASS |
| `checkout-price` | PASS |
| `build-output` | PASS |
| `release-source-identity` | PASS |
| `artifact-identity` | PASS |

The complete browser suite also passed all 50 tests. The candidate CI run
[33595093122](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33595093122)
passed both the Linux product suite and the actual Windows PowerShell installer
job.

## Local quality gates

All passed:

```text
npm ci
npm test                         # 27 unit, installer contract, 4 native, 50 e2e
npm run typecheck
npm run lint
npm run build                    # dist/app and dist/site
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

`npm ci` reported zero vulnerabilities.

## End-to-end behavior

A fresh live demo flow passed normal, boundary, invalid-input, and recovery
cases:

- Browser-required fields rejected a blank correction.
- Identical before/after text showed a useful recovery message.
- A `dollar amp` → `$&` rule was proposed, approved, found by search, applied
  literally to fresh text, deleted, and restored with Undo.
- CSV and JSON downloads contained the new rule; the CSV had one header and
  four data rows.
- An invalid JSON import was rejected without changing the current book.
- Reset restored exactly the three shipped rules.
- A sentinel in the real preview namespace remained untouched throughout.
- The complete flow made no request outside the product origin and logged no
  console, page, or request errors.

The same shipped Kubernetes repair ran successfully at 390×844 with no
horizontal overflow. Keyboard checks confirmed that Tab exposes a 3 px focus
ring, Enter activates the skip link and focuses `main`, Alt+3 opens Test, route
changes focus and announce the h1, and the next form control retains a visible
3 px focus ring.

## Accessibility and responsive QA

- `/`, `/demo/`, `/privacy/`, and `/terms/` each returned 200 with `lang=en`,
  one h1, one main landmark, complete image alternatives, and no console/page
  errors.
- The styled unknown route returned 404 with the expected browser 404 resource
  message and no application exception.
- Axe found zero serious or critical violations on every public route and on
  the 390 px landing/demo views.
- Desktop, 390 px, and intermediate 621/640/700/800 px app views had no
  horizontal overflow. The fixed mobile navigation did not prevent content
  from scrolling clear of it.
- Dark mode and `prefers-reduced-motion: reduce` were exercised; computed
  scroll behavior was `auto` and no errors occurred.
- `/opt/fleet/lib/verify-url.sh` passed title, language, h1, main, image-alt,
  and console checks.

Evidence: `/tmp/drb-v17-live-ZkNHJu/`,
`/tmp/drb-v17-url-f2nE2G/`, and `/tmp/drb-v17-settings-390.png`.

## Privacy, headers, offline behavior, and allowance

- A cold landing and the complete sample flow contacted only the product
  origin. No cookies, local-storage keys, analytics, third-party fonts, or
  third-party scripts appeared before explicit download/license actions.
- The response CSP allows only self-hosted scripts/styles/images and the
  disclosed GitHub and Sociobot API connections. HSTS, `nosniff`, strict
  referrer policy, `frame-ancestors 'none'`, and camera/microphone/geolocation
  denial were present.
- The service worker was active and controlling, `registration.update()`
  completed without an error or waiting worker, cache `drb-site-v7` was
  present, and an offline `/demo/?demo=1` reload returned 200 with sample data.
- The product has no first-party backend or sign-in. Backend concurrency,
  server persistence, and Entra checks are not applicable.
- The Sociobot license verifier was probed with harmless invalid tokens from
  one client. Requests 1–30 returned 200/`invalid`; request 31 and requests
  32–35 returned 429 with `Retry-After: 2`. CORS allowed the product origin.
  Observed allowance: **30 requests per client/window**.

## Deployment, release, and performance

Every publicly served build file (HTML, JS, CSS, images, service worker,
installers, metadata, robots, and sitemap) matched the locally generated
`dist/site` file byte-for-byte. The published desktop release is v0.1.14 from
`90295dc8f2eaaa6e9cdfc50080e53ae025a31f09`; the only candidate change after
that release source is `.factory` verification documentation.

The release provides both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB,
`SHA256SUMS`, `latest.json`, and `build-info.json`. A fresh Linux `.deb`
download passed its published checksum and reported package version 0.1.14,
architecture amd64. After installing its declared GTK/WebKit dependencies,
the extracted packaged executable stayed running for the full 12-second Xvfb
smoke test. A live Linux download choice made exactly one GitHub API request
and resolved to the v0.1.14 AppImage. Checkout returned 303 to hosted Dodo.

Build budgets:

- Site initial JS: 1.90 kB gzip plus 0.44 kB preload helper.
- Site CSS: 3.23 kB gzip.
- Desktop webview JS: 10.36 kB gzip total.
- Mobile hero: 47,766 bytes; desktop hero: 182,720 bytes.
- Hashed assets: `max-age=31536000, immutable`; documents and service worker:
  30-second revalidation.

Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
100, SEO 100; FCP 1.1 s, LCP 1.1 s, TBT 30 ms, CLS 0.

## Defects

### Medium — release blocker

1. **Application opt-in controls miss the 44×44 px touch-target baseline.** At
   390 px on `/demo/?demo=1&view=settings`, the `Notes` label measured
   95.4×30 px and its checkbox 24×24 px; `VS Code` measured 117.5×30 px with a
   24×24 px checkbox. Only the label/checkbox area toggles the source, not the
   52 px row around it. Increase the clickable label area to at least 44 px
   high (for example, stretch the label across the row). Recheck every visible
   control at 390 px afterward.

## Retest guidance

Fix only the application-toggle hit areas, rerun all 34 claim commands and the
full local gates, then repeat the 390 px all-controls measurement and live
deployment hash comparison.
