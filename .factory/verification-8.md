# Independent verification 8 — FAIL

**Acceptance candidate:** `65e106d7bb491862c2739a109c57d24fc0ef6def`

**Live URL:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-30 UTC

**Result:** **FAIL — do not release this candidate.**

No product code was changed during verification. The downloadable desktop app is not built from the candidate and omits a privacy/data-loss fix that exists in candidate source. Three additional product defects were also found.

## Release-blocking findings

### Critical — published desktop installers are stale and retain the native sample data-loss path

The live download action resolves to GitHub release `v0.1.5`. Its published `latest.json` and `build-info.json` both identify source commit `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc`, not candidate `65e106d7bb491862c2739a109c57d24fc0ef6def`.

This is not a documentation-only difference. Candidate commits `6a86dd8` and `da535be` change `src/main.ts`, `src/storage.ts`, `src/style.css`, and add `src/native-sample.ts`. The distributed `2f2e706` app predates those changes. In particular:

- The old native sample Settings screen exposes the real license and **Erase all local data** controls.
- Its remove-license and erase handlers have no `nativeSampleMode` guard, so sample mode can clear the real license or encrypted vault.
- The candidate adds `mayTouchRealNativeData(nativeSampleMode)` guards specifically to close that path.
- The old app also says `$24` in its free-limit and purchase UI while the live checkout and candidate say `$12`.

Therefore the published desktop product fails candidate claims `native-sample-isolation` and `checkout-price`, even though their source-level tests pass against the newer checkout. This violates the brief's deletion/privacy boundary and the demo sandbox contract.

Fresh distribution evidence:

- GitHub latest release: `v0.1.5`, published `2026-08-30T00:41:33Z`.
- Release manifest commit: `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc`.
- Candidate commit: `65e106d7bb491862c2739a109c57d24fc0ef6def`.
- The live Linux download points to `.../v0.1.5/Dictation-Repair-Book-linux-x64.AppImage`.
- The downloaded DEB matched published SHA-256 `7e116f8d02666e9eea7e910aada4c23177853658fc16a564e5f8df0b7b48d1d2`.
- DEB metadata: package `dictation-repair-book`, version `0.1.5`, architecture `amd64`.
- Its extracted binary remained alive for the 12-second Xvfb smoke interval. The artifact is usable, but it is the wrong source revision.

### Medium — a live mobile touch target is below the 44px baseline

At 390×844 in the dark/reduced-motion demo, the `DR BK, Dictation Repair Book home` link measures **220.36×42 CSS px**. The required minimum is 44×44 CSS px. Other measured mobile controls passed. Evidence: `.factory/qa-evidence/verification-8/live-qa.json` and `demo-mobile.png`.

### Medium — the Capture walkthrough frame does not show Capture

`public/assets/walkthrough-capture.png` and `public/assets/walkthrough-rules.png` are byte-identical (`90fd4b9f...`), and both show the Approved rules screen. The first frame's caption and alt text say it shows original/corrected Capture fields. This makes the required desktop-app screenshot walkthrough inaccurate.

### Low — app section links use non-anchor hash routes

The demo exposes `#capture`, `#rules`, `#test`, and `#settings` as link targets, but none exists as an element ID. JavaScript interprets them as routes and the flows work, but this conflicts with the site-structure contract that reserves hash URLs for real in-page anchors and asks real places to use real routes.

## Mandatory first-read and demo gate

**PASS.** A cold 1440×900 and 390×844 visit answers all three questions on the first screen:

- What: “Turn dictation corrections into reusable rules.”
- For whom: dictation users with names, medications, code terms, or workplace jargon.
- First click: **Try it with sample data**, followed by “Opens a separate sample repair book. Nothing enters your real book.”

The action and explanation are inside the first viewport. One click opens `/demo/?demo=1`, showing three realistic rules and the persistent Demo banner with Reset demo and Start for real. Evidence: `.factory/first-read-live.png`, `qa-evidence/verification-8/landing-{desktop,mobile}.png`, and `live-qa.json`.

## Claims gate — 33/33 source tests PASS

`.factory/claims.json` exists. A source scan found exactly one `@claim:<id>` tag for each of its 33 IDs. The untouched clone initially had no Node modules and the base container lacked Tauri Linux headers and PowerShell; after `npm ci` and installing those verifier prerequisites outside the repository, every exact declared command executed successfully.

| Claim | Exact test | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `rule-management` | `npm run test:e2e -- --grep @claim:rule-management` | PASS |
| `literal-code-replacement` | `npm run test:unit -- --testNamePattern @claim:literal-code-replacement` | PASS |
| `longest-rule-first` | `npm run test:unit -- --testNamePattern @claim:longest-rule-first` | PASS |
| `local-repair` | `npm run test:e2e -- --grep @claim:local-repair` | PASS |
| `portable-exports` | `npm run test:e2e -- --grep @claim:portable-exports` | PASS |
| `json-roundtrip` | `npm run test:e2e -- --grep @claim:json-roundtrip` | PASS |
| `whisper-export` | `npm run test:e2e -- --grep @claim:whisper-export` | PASS |
| `private-demo` | `npm run test:e2e -- --grep @claim:private-demo` | PASS |
| `website-privacy` | `npm run test:e2e -- --grep @claim:website-privacy` | PASS |
| `on-demand-release-lookup` | `npm run test:e2e -- --grep @claim:on-demand-release-lookup` | PASS |
| `explicit-access` | `npm run test:unit -- --testNamePattern @claim:explicit-access` | PASS |
| `clipboard-on-command` | `npm run test:e2e -- --grep @claim:clipboard-on-command` | PASS |
| `free-book` | `npm run test:e2e -- --grep @claim:free-book` | PASS |
| `erase-local-book` | `npm run test:e2e -- --grep @claim:erase-local-book` | PASS |
| `native-erase` | `cargo test --manifest-path src-tauri/Cargo.toml claim_native_erase_removes_vault_and_key` | PASS |
| `license-backoff` | `npm run test:e2e -- --grep @claim:license-backoff` | PASS |
| `license-daily-cache` | `npm run test:e2e -- --grep @claim:license-daily-cache` | PASS |
| `license-request-privacy` | `npm run test:e2e -- --grep @claim:license-request-privacy` | PASS |
| `license-return` | `npm run test:e2e -- --grep @claim:license-return` | PASS |
| `encrypted-vault` | `cargo test --manifest-path src-tauri/Cargo.toml claim_encrypted_vault_uses_aes_256_gcm` | PASS |
| `per-device-key` | `cargo test --manifest-path src-tauri/Cargo.toml claim_per_device_key_is_random_and_private_on_unix` | PASS |
| `revoked-license-locks` | `npm run test:e2e -- --grep @claim:revoked-license-locks` | PASS |
| `checksum-installers` | `npm run test:unit -- --testNamePattern @claim:checksum-installers` | PASS |
| `powershell-checksum-installer` | `pwsh -NoLogo -NoProfile -File tests/installers.ps1` | PASS |
| `release-matrix` | `npm run test:unit -- --testNamePattern @claim:release-matrix` | PASS |
| `unsigned-build` | `npm run test:unit -- --testNamePattern @claim:unsigned-build` | PASS |
| `offline-demo` | `npm run test:e2e -- --grep @claim:offline-demo` | PASS |
| `native-sample-isolation` | `npm run test:e2e -- --grep @claim:native-sample-isolation` | PASS in candidate source; **FAIL in published app provenance** |
| `checkout-price` | `npm run test:unit -- --testNamePattern @claim:checkout-price` | PASS in candidate source; **FAIL in published app copy** |
| `build-output` | `npm run test:unit -- --testNamePattern @claim:build-output` | PASS |
| `release-source-identity` | `npm run test:unit -- --testNamePattern @claim:release-source-identity` | PASS |

The source claim gate passes; deployment parity turns two of those promises into release findings.

## Clean checkout and build gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages, 0 vulnerabilities |
| `npm test` | PASS — 24 Vitest + 44 Playwright tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/app/` and `dist/site/` produced |
| `cargo fmt --manifest-path src-tauri/Cargo.toml --check` | PASS |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — 4 tests |
| `cargo check --manifest-path src-tauri/Cargo.toml` | PASS |
| `pwsh -NoLogo -NoProfile -File tests/installers.ps1` | PASS — match and mismatch paths |

Production bundle sizes pass: landing JavaScript 1.88 KB gzip, demo/app JavaScript 9.71/9.94 KB gzip, site/app CSS 3.23/4.03 KB gzip, no web fonts, and the mobile hero transfer was 47.8 KB.

## Independent live workflow

The live demo completed the useful job end to end:

- `Deploy the cube or net ease service; then call Neem about met a pro lol.` became `Deploy the Kubernetes service; then call Niamh about metoprolol.` with three applied rules reported.
- An empty required transcript was rejected by native form validation.
- Identical before/after phrases produced the specific recovery message; corrected input then proposed and approved `ray dis → Redis`.
- Search returned zero rows for a missing term and recovered for `redis`.
- Delete exposed Undo, and Undo restored the rule.
- CSV downloaded as `dictation-rules.csv`.
- Invalid JSON reported that the current book was unchanged; the Redis rule remained.
- The complete flow made **zero requests outside the product origin** and produced no unexpected console, page, or request errors.

## Accessibility and responsive behavior

- Playwright Axe found **0 serious/critical** violations on landing, demo, Privacy, Terms, and the real 404 page at desktop width, plus landing/demo in 390px dark/reduced-motion mode.
- `verify-url.sh` passed: title, `lang=en`, one `h1`, `main`, no missing alt attributes, and no load errors.
- Skip link is the first keyboard target and moves focus to `main`.
- App route changes focus the new `h1`; focus outlines measured 3px.
- Alt+number keyboard navigation, Enter activation, native form validation, dark theme, and reduced-motion `scroll-behavior:auto` worked.
- Landing and demo have no 390px horizontal overflow; first-screen facts end at y=607 of 844.
- A local 200% root-text stress check retained width and content, but the mobile 42px wordmark target remains a failure.

## PWA, privacy, headers, rate limit, and performance

- Service worker update completed without an unexpected error.
- After first control, `/demo` reloaded offline with sample data; an unknown offline route retained status 404 and its designed page.
- Standard live routes made no third-party script, font, or analytics requests. The landing page contacts GitHub only after download intent; the demo repair flow stayed same-origin.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and CSP with `frame-ancestors 'none'`.
- HTML and `sw.js`: `public, must-revalidate, max-age=30`; hashed assets: `public, max-age=31536000, immutable`.
- The license verification API allowed 30 consecutive requests from one client. Request 31 returned **429** with **`Retry-After: 3`**; a request after four seconds returned 200. CORS allowed the product origin and responses used `no-store`.
- Fresh Lighthouse mobile: performance **100**, accessibility **100**, best practices **100**, SEO **100**; LCP **1151 ms**, FCP **1113 ms**, CLS **0**, TBT **68.5 ms**.

## Deployment parity

- Fresh candidate `npm run build` matched the live static website byte-for-byte for **36/36 served files**. `staticwebapp.config.json` is deployment configuration and was correctly excluded.
- The static site is therefore current.
- The downloadable desktop release is not current; its manifest proves the `2f2e706` source mismatch described above.

## Required next verification

Publish a new versioned desktop release built from the repaired candidate (or a descendant containing the same fixes), verify its manifest commit equals the tested candidate, then download and exercise that exact artifact. Also raise the mobile demo wordmark to 44px, replace the duplicated Capture frame, and replace hash pseudo-routes with contract-compliant routes or real anchors.
