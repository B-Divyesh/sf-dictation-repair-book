# Verification 12 — PASS

**Verified candidate:** `bf5b55fee35e848d4c4657fd7e54ef73be5e13d4`
**Live URL:** https://dictation-repair-book.sociobot.in/
**Date:** 2026-09-01
**Verdict:** **PASS** — no release-blocking defects found.

## Required first checks

### Claims and clean checkout

`npm ci` completed with 168 packages and zero audit vulnerabilities. `.factory/claims.json` exists and contains 34 claims. I ran every command in its `test` field individually from this clean checkout before the live first-read test; all exited 0. The complete regression gate then independently passed:

- `npm test`: 27/27 Vitest, installer checksum contract, 4/4 no-GUI native Rust tests, and 45/45 Playwright tests.
- `npm run typecheck`, `npm run lint`, `npm run build`, `cargo fmt --manifest-path src-tauri/Cargo.toml --check`, and `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`: passed.

| Claim IDs with passing declared checks |
| --- |
| `demo-sandbox`, `no-account`, `rule-management`, `literal-code-replacement`, `longest-rule-first`, `local-repair`, `portable-exports`, `json-roundtrip`, `whisper-export` |
| `private-demo`, `website-privacy`, `on-demand-release-lookup`, `explicit-access`, `clipboard-on-command`, `free-book`, `erase-local-book`, `native-erase` |
| `license-backoff`, `license-daily-cache`, `license-request-privacy`, `license-return`, `encrypted-vault`, `per-device-key`, `revoked-license-locks` |
| `checksum-installers`, `powershell-checksum-installer`, `release-matrix`, `unsigned-build`, `offline-demo`, `native-sample-isolation`, `checkout-price` |
| `build-output`, `release-source-identity`, `artifact-identity` |

### Cold live first read

Fresh desktop Chromium load: HTTP 200, title `Dictation Repair Book — reusable dictation rules`, one h1, no page/console errors, and only same-origin requests.

The first screen plainly answers all three required questions:

- **What:** “Turn dictation corrections into reusable rules.”
- **For whom:** “For dictation users with names, medications, code terms, or workplace jargon.”
- **First action:** visible **Try it with sample data**; its adjacent explanation says it opens a separate sample repair book and does not enter the real book.

This satisfies the first-read and one-click demo contract. The cold-page screenshot was reviewed at `/tmp/drb-first-read.png` during verification.

## Product and live QA

- The live `/demo/` flow repaired `Deploy the cube or net ease service.` to `Deploy the Kubernetes service.` locally.
- Empty transcript input uses native required-field validation, returns focus to the transcript textarea, and exposes “Please fill out this field.”
- Demo reset/isolation, rule management, search/delete/undo, CSV/JSON/Whisper export, license limits/backoff, invalid import recovery, and native-vault erase/encryption are covered by the passing claim tests above.
- A fresh live demo request log contained no non-product origin. A fresh landing log likewise contained no third-party script/font/analytics request. The GitHub release API made zero calls before download intent and exactly one after the download action; it produced the real `v0.1.10` Linux AppImage link without console errors.
- The registered service worker is `https://dictation-repair-book.sociobot.in/sw.js`, active cache `drb-site-v7`. After the first visit, a fresh offline context navigated to `/demo/` with HTTP 200 and displayed the sample rule, with no browser errors.
- Desktop and 390×844 dark/reduced-motion views had no horizontal overflow. The reduced-motion view had no running animations. Tab first focused the visible 3 px cobalt “Skip to content” link; Enter moved focus to `main`.
- Axe on the live landing and live demo reported zero serious or critical violations. The unknown route returns a styled 404, status 404, title `Page not found — Dictation Repair Book`, and h1 `Page not found`.

## Privacy, headers, and performance

The live page response supplies HTTPS/HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, microphone/camera/geolocation-denying Permissions Policy, and a CSP with `frame-ancestors 'none'`. HTML uses 30-second revalidation; hashed JS/CSS have `public, max-age=31536000, immutable` caching.

There is no product backend. The only runtime API is the factory license verifier. A harmless invalid-token production check returned `{ "valid": false, "reason": "invalid" }` and contained no repair-book text. The repository documents no server allowance, so I exercised it to discover the enforced bound: 30 requests from this client returned 200; request 31 returned **429** with `Retry-After: 4`. The app’s client-side 429 backoff also passed its declared test.

Production first-load code is comfortably under budget: `index-CUAqEr4u.js` is 1,906 B gzip plus 482 B gzip preload helper; CSS is 3,238 B gzip; the mobile hero is 47,766 B. A Lighthouse CLI run was attempted with the supplied Chromium but its browser tab crashed before producing a report, so no Lighthouse score is claimed in this verification. This was an environment/tool limitation; all independent browser/a11y/bundle checks above passed.

## Candidate/deployment/release identity

- The deployed root, routes, scripts, styles, service worker, assets, installers, and demo bundles hash-match this candidate’s built `dist/site/` output. This includes `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, the referenced JS/CSS/image assets, `sw.js`, and both installer scripts.
- Public tag `v0.1.10` dereferences to `bf5b55fee35e848d4c4657fd7e54ef73be5e13d4` (the tag object is `d9af1a7…`). Release `build-info.json` and `latest.json` name the same version and full commit.
- The release contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- Downloaded `Dictation-Repair-Book-linux-x64.deb` and verified it against published `SHA256SUMS`: **OK**. Its metadata is version `0.1.10`, architecture `amd64`, and declares GTK/WebKit/appindicator runtime dependencies.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.
- **Informational:** Lighthouse CLI could not complete because the container Chromium tab crashed. It did not affect the separately completed browser QA, Axe, offline, headers, or bundle checks.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
```
