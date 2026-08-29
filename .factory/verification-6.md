# Independent verification 6 — FAIL

**Acceptance candidate:** `4f555303116136f84b08115adb77afae478627e7`

**Live URL:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

**Result:** **FAIL — do not accept this candidate.**

This was a fresh independent verification from the requested commit. No product code was changed. The earlier deployment-only failure and the three verification-5 defects are resolved. Core repair flows, privacy behavior, offline use, release artifacts, and performance pass, but the claims inventory and semantic heading baseline do not.

## Release findings

| Severity | Finding | Fresh evidence | Required resolution |
| --- | --- | --- | --- |
| **Blocker** | A live, user-reliance claim is missing from `.factory/claims.json`. | The first-screen download note says **“Checks the latest build when you choose a download.”** at `site/index.html:86`. No claim entry covers on-demand release lookup. A matching regression exists at `tests/e2e/site.spec.ts:45`, but it has no `@claim:<id>` tag and is absent from the manifest. The supplied claims contract says any unlisted claim fails review. | Add one claim entry for on-demand release lookup, tag its single owning test, and keep the assertion that GitHub is contacted only after explicit download intent; or remove the promise. |
| **Medium** | The Settings screen skips heading level 2. | Live `/demo/?demo=1#settings` exposes `H1 Settings & data` followed by five `H3` section headings. Axe 4.13 reports `heading-order` with moderate impact on “Application access.” This violates the supplied semantic baseline requiring headings in order. Evidence: [a11y-settings.json](qa-evidence/verification-6-live/a11y-settings.json). | Make the Settings section headings `<h2>` or introduce a meaningful `<h2>` parent before the `<h3>` headings. Add a regression for the full document outline. |

## Mandatory first-read and demo gate

**PASS.** A cold visitor can state, without inference:

- What it does: **“Turn dictation corrections into reusable rules.”**
- Who it is for: dictation users with names, medications, code terms, or workplace jargon.
- What to click first: **“Try it with sample data.”**

The action and its explanation are fully visible at 1440×900, 1366×768, and 390×844. At 1366×768 the complete action group spans `y=583.66` to `760.03`. One click opens `/demo/?demo=1` with three realistic rules and the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. Screenshots: [desktop](qa-evidence/verification-6-live/screenshot-desktop.png) and [mobile](qa-evidence/verification-6-live/landing-mobile.png).

## Mandatory claims gate

`.factory/claims.json` exists with 28 entries. After `npm ci`, every listed command was run independently so one failure could not hide another. The base image initially lacked the documented Tauri GTK/WebKit development packages and PowerShell; after installing those verifier prerequisites, every exact command passed.

**Final claim execution result: 28/28 PASS.** Every manifest ID also has exactly one `@claim:<id>` tag.

| Claim ID | Exact-command result |
| --- | --- |
| `demo-sandbox` | PASS — 1 Playwright test |
| `no-account` | PASS — 1 Playwright test |
| `rule-management` | PASS — 1 Playwright test |
| `literal-code-replacement` | PASS — 1 Vitest test |
| `longest-rule-first` | PASS — 1 Vitest test |
| `local-repair` | PASS — 1 Playwright test |
| `portable-exports` | PASS — 1 Playwright test |
| `json-roundtrip` | PASS — 1 Playwright test |
| `whisper-export` | PASS — 1 Playwright test |
| `private-demo` | PASS — 1 Playwright test |
| `website-privacy` | PASS — 1 Playwright test |
| `explicit-access` | PASS — 1 Vitest test |
| `clipboard-on-command` | PASS — 1 Playwright test |
| `free-book` | PASS — 1 Playwright test |
| `erase-local-book` | PASS — 1 Playwright test |
| `native-erase` | PASS — 1 Cargo test |
| `license-backoff` | PASS — 1 Playwright test |
| `license-daily-cache` | PASS — 1 Playwright test |
| `license-request-privacy` | PASS — 1 Playwright test |
| `license-return` | PASS — 1 Playwright test |
| `encrypted-vault` | PASS — 1 Cargo test |
| `per-device-key` | PASS — 1 Cargo test |
| `revoked-license-locks` | PASS — 1 Playwright test |
| `checksum-installers` | PASS — 1 Vitest test |
| `powershell-checksum-installer` | PASS — checksum match and mismatch paths |
| `release-matrix` | PASS — 1 Vitest test |
| `unsigned-build` | PASS — 1 Vitest test |
| `offline-demo` | PASS — 1 Playwright test |

The separate unlisted-claim finding above remains blocking even though the underlying release-lookup behavior has an ordinary regression test.

## Build and automated checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages, 0 audit vulnerabilities |
| `CI=1 npm test` | PASS — 20 Vitest tests and 41 Playwright tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — emitted `dist/app/` and `dist/site/` |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — 4/4 |
| `cargo fmt --manifest-path src-tauri/Cargo.toml --check` | PASS |
| `cargo check --manifest-path src-tauri/Cargo.toml` | PASS |
| `CI=true npm run tauri build -- --bundles deb` | PASS |

The candidate Linux package is `Dictation Repair Book_0.1.4_amd64.deb`, package `dictation-repair-book`, version `0.1.4`, architecture `amd64`, SHA-256 `c1ccb89f842969bb6d6188683550703597abdf93676a4180f636ad9aa7de44cd`. Its extracted binary stayed running until the intentional 12-second Xvfb timeout.

## End-to-end product evidence

Fresh live demo results:

- Started with `metoprolol`, `Kubernetes`, and `Niamh` rules.
- `Deploy the cube or net ease service.` became `Deploy the Kubernetes service.` with one applied rule.
- `Take met a pro lol after breakfast.` became `Take metoprolol after breakfast.`
- Unmatched text stayed unchanged and reported “No matching approved terms.”
- Empty required input stayed focused on the invalid field and created no proposal.
- Identical before/after input returned a plain recovery instruction and created no proposal.
- A new `ampersand token → $&` rule inserted `$&` literally in a fresh transcript.
- A malformed JSON import reported that the current book was unchanged; the existing Kubernetes rule remained.
- Denied clipboard permission reported “Paste with Ctrl/Command+V instead.” and did not change the field.

The full observed flow requested only the product origin and emitted no console, page, or request errors. Evidence: [e2e-flow.json](qa-evidence/verification-6-live/e2e-flow.json).

The repository claims additionally cover search, delete/undo, CSV and JSON downloads, restore, Whisper copy, the 25/26 rule boundary, license revocation, and full erasure.

## Accessibility and responsive behavior

- `/opt/fleet/lib/verify-url.sh` passed live: title, `lang=en`, one `h1`, one `main`, complete image alt text, labelled buttons, and zero console errors. Evidence: [verify.json](qa-evidence/verification-6-live/verify.json).
- Live `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` have zero Axe serious or critical findings in fresh desktop contexts.
- Light, dark-preference, reduced-motion, desktop, and 390px checks have no horizontal overflow.
- All visible controls on landing, demo, privacy, and terms are at least 44×44 CSS px at 390px.
- Keyboard-only checks pass: Tab reaches the skip link, Enter focuses `main`, Enter changes app sections, Alt+2 selects Rules, and the designed focus outline is 3px cobalt with 3px offset.
- Reduced motion changes smooth scrolling to `auto`; no active animation was observed.
- The moderate Settings heading-order defect is documented above. Screenshot: [Settings](qa-evidence/verification-6-live/settings-heading-order.png).

## Privacy, headers, offline use, and allowance

- Cold landing and the complete sample repair flow contacted only `https://dictation-repair-book.sociobot.in`.
- GitHub release metadata was not requested until explicit download intent. One click then made one disclosed GitHub API request and resolved the real v0.1.4 Linux AppImage without errors.
- Browser response headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, `strict-origin-when-cross-origin`, and a Permissions Policy denying camera, microphone, and geolocation.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets use `max-age=31536000, immutable`; installer scripts use `max-age=300`.
- Service-worker registration and `update()` succeeded. Offline `/demo/` returned 200 and repaired the Kubernetes sample. An offline unknown route returned the designed page with status 404. The only console resource message occurred for that intentional 404 navigation.
- Fresh license-verification requests 1–30 returned 200. Request 31 returned **429** with **`Retry-After: 3`**; requests 32–35 remained 429. Observed allowance: **30 requests per client/window**.
- No sign-in exists, so the Microsoft Entra authority requirement is not applicable.
- The buy endpoint returned 303 to hosted Dodo checkout; no payment provider is embedded in product code.

## Performance and budgets

Fresh mobile Lighthouse: **99 performance / 100 accessibility / 100 best practices / 100 SEO**. FCP was **1.1s**, LCP **1.2s**, TBT **0ms**, and CLS **0**. Evidence: [Lighthouse JSON](qa-evidence/verification-6-live/lighthouse-mobile.json).

- Landing JavaScript: 5,239 bytes decoded / 2,836 bytes transferred.
- Landing CSS: 11,974 bytes decoded / 4,009 bytes transferred.
- Mobile hero WebP: 47,766 bytes.
- Demo JavaScript: 26,482 bytes decoded / 10,860 bytes transferred.
- Demo CSS: 14,471 bytes decoded / 4,227 bytes transferred.
- No web fonts load. Mobile landing resources observed before interaction totaled 150,246 transfer bytes.

All stated static-product budgets pass.

## Deployment and release identity

- Candidate checkout is exactly `4f555303116136f84b08115adb77afae478627e7`; the worktree was clean before evidence/report creation.
- All **36/36** rebuilt public files match live response bodies byte-for-byte. `staticwebapp.config.json` is platform configuration and is not expected to be public.
- Candidate changes since desktop release tag `v0.1.4` affect only landing/legal CSS/HTML and tests; native app runtime sources and package configuration are unchanged.
- GitHub release `v0.1.4` contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- Downloaded release DEB SHA-256 `93f761e6fd80443619340146634c7adb905ae6ec6366b9432d52b2c8f5262400` exactly matches `SHA256SUMS`. Package metadata is version `0.1.4`, `amd64`; its extracted binary stayed running through the 12-second smoke window.
- The link crawl found no dead link: every internal page and GitHub destination returned 200; checkout returned the expected 303.

## Decision

**FAIL.** The product itself is useful and the earlier deployment, first-screen, touch-target, and claim-tag repairs are live. Acceptance is still blocked by the unlisted download-lookup promise. The Settings heading outline also needs correction to meet the non-negotiable accessibility baseline.
