# Independent verification 4 — FAIL

**Acceptance candidate:** `7c8df71269c779c09e21ac667adf85bbd00bbfa0`
**Live URL:** <https://dictation-repair-book.sociobot.in>
**Verified:** 2026-08-29 UTC
**Result:** **FAIL — do not accept this desktop-app candidate.**

This was an independent clean-clone verification. No product source code was changed.

## Release-blocking defect

| Severity | Finding | Fresh evidence | Required resolution |
| --- | --- | --- | --- |
| **Blocker** | The downloadable desktop release is not built from this candidate. | Git tag `v0.1.2` dereferences to `61302673d33e836edfd718da47b4adf3fe923cd5` at 15:48 UTC; its GitHub release published at 15:55 UTC. Candidate `7c8df71` is later (18:15 UTC) and includes post-tag runtime changes: `src/main.ts`, `src/storage.ts`, `src/license.ts`, `src/style.css`, `src-tauri/src/lib.rs`, `public/sw.js`, and site runtime files. The release workflow builds only on `v*` tags. The published Linux DEB is version `0.1.2`; it verifies against that old release's `SHA256SUMS`, but contains no candidate build identity. | Publish a uniquely versioned/tagged desktop release built from the candidate (or its approved successor), including fresh assets, `SHA256SUMS`, and `latest.json`; then reverify the desktop package. |

The live **web** deployment does match the candidate exactly, but that does not repair the desktop artifact mismatch. A visitor downloading the advertised desktop app receives the earlier tagged build, not the candidate reviewed here.

## Mandatory claims: PASS, 28/28

`.factory/claims.json` is present. Before broader QA and the cold first-read, every listed command was started from the clean clone after `npm ci`. The disposable image initially lacked the GTK/WebKit development dependencies required by native Tauri tests and PowerShell; I installed the exact Linux packages in `.github/workflows/release.yml` and used a temporary PowerShell 7.5.4 runtime. I then reran **every exact manifest command** individually with recorded statuses: all 28 passed. See [claims-rerun-summary.tsv](qa-evidence/verification-4/claims-rerun-summary.tsv).

This includes demo isolation, account-free sample use, correction approval/search/delete/undo/test, literal code replacement, longest-rule ordering, exports/backup/import/Whisper prompt, local-only demo requests, capabilities, command-only clipboard read, the free limit and license cases, browser/native erase, encryption and per-device key checks, installer checksum checks, release-matrix fixtures, unsigned-build disclosure, and offline demo reload.

## Cold first-read: PASS

A new 1440 px browser context, without retained site data, loaded the live landing page. It says **“Turn dictation corrections into reusable rules.”** It identifies people with names, medications, code terms, or workplace jargon, and gives **“Try it with sample data”** as the first action with the plain result: it opens a separate sample repair book and does not enter the real book. The first-read screenshot is [live-first-read-desktop.png](qa-evidence/verification-4/live-first-read-desktop.png).

## Clean build and automated checks: PASS

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 168 packages installed, `npm audit` reported 0 vulnerabilities. |
| `npm test` | Passed: 16 Vitest tests and 32 Playwright tests. |
| `npm run typecheck` | Passed. |
| `npm run lint` | Passed. |
| `npm run build` | Passed; emitted `dist/app/` and `dist/site/`. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Passed: 4/4. |
| `cargo fmt --manifest-path src-tauri/Cargo.toml --check` | Passed. |
| `cargo check --manifest-path src-tauri/Cargo.toml` | Passed. |

Production output is within the static budgets: landing JS is 1.52 KB gzip plus a 0.44 KB preload polyfill; demo JS is 9.34 KB gzip plus a 0.15 KB shared core; landing CSS is 3.07 KB gzip; demo CSS is 3.84 KB gzip. The mobile hero is 47,766 bytes and no third-party font is loaded.

## Independent live product QA: PASS

- Normal demo flow repaired `Deploy the cube or net ease service.` to `Deploy the Kubernetes service.` locally.
- Invalid-input recovery: importing malformed JSON displayed the recovery message that the current book was not changed; the existing Kubernetes rule remained.
- Demo privacy: the complete observed sample flow made no request outside `dictation-repair-book.sociobot.in`.
- PWA: after an online visit, the service worker controlled the page and `registration.update()` completed. Offline navigation to `/demo/` returned 200, rendered the Kubernetes sample, and emitted no console/page errors.
- Keyboard: Skip to content focused `#main`; keyboard-driven rule focus showed the designed `3px` focus outline. There was no keyboard trap in the exercised views.
- Mobile/reduced motion: at 390×844 in dark/reduced-motion mode, demo Rules/Settings were exactly 390 px wide, CSS scroll behavior was `auto`, and Reset demo/Start for real were each 44 px tall. Screenshot: [live-demo-mobile-390-dark-reduced.png](qa-evidence/verification-4/live-demo-mobile-390-dark-reduced.png).
- Accessibility: Axe found zero serious or critical findings on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`; each had `lang=en`, exactly one `h1`, and one `main`. The repository does not contain the requested `verify-url.sh`; equivalent title/lang/main/alt/console checks were run in Playwright.
- Successful live pages had zero console errors and zero page errors. There is no sign-in or identity provider.

## Privacy, headers, and request allowance: PASS

- Cold landing requests were same-origin assets plus only the disclosed GitHub Releases API lookup. No analytics, third-party scripts, or third-party fonts were observed. The demo flow was same-origin only.
- Live headers include CSP (`frame-ancestors 'none'`), HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a Permissions Policy denying camera/microphone/geolocation. HTML is revalidated at 30 seconds; hashed assets use one-year immutable caching. See [live-response-headers.txt](qa-evidence/verification-4/live-response-headers.txt).
- License verification rate limit was tested directly from one client. Invalid requests 1–30 received 200; request 31 received **429** with **`Retry-After: 3`**. Requests 32–35 remained 429 (Retry-After 3 then 2). Observed allowance: **30 requests per client/window**. See [license-rate-limit.tsv](qa-evidence/verification-4/license-rate-limit.tsv).

## Live deployment identity: partial PASS

Fresh SHA-256 comparisons found exact local-candidate/live matches for `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, `/sw.js`, `qa.css`, both live JS bundles, both relevant CSS bundles, and the hero image. See [deployment-byte-compare.tsv](qa-evidence/verification-4/deployment-byte-compare.tsv). Thus the deployment-only concern is resolved for the website, but not for the installable desktop artifact.

The old published DEB itself is internally coherent: its SHA-256 is `c2131227279662bc7dd924ba760886656e342abea047f28e26195da8a54164bc`, matching the old release checksum, and it remained running under Xvfb until the intentional 12-second timeout. That confirms only that `v0.1.2` is installable, not that it is the candidate.

## Notes

- Desktop builds are unsigned, but the live landing and installer copy disclose the operating-system confirmation requirement. This is not a separate finding.
- No source changes were made by this verifier. Verification evidence is under `.factory/qa-evidence/verification-4/`.
