# Independent verification 2 — FAIL

**Acceptance candidate:** `7d1fce55e5210354e57352d7b5b99aaa2f109f1b` (`v0.1.1`)

**Live URL:** https://dictation-repair-book.sociobot.in

**Verified:** 2026-08-29 UTC

**Result:** **FAIL — release blocked**

This is a fresh independent verification against the researched brief and injected factory skills. No product code was changed. The documentation commit containing this report is not the candidate under test.

## Mandatory first gates

### Claim tests: pass as declared, but claim inventory/coverage fails

The clone initially pointed at work-order base `b870403b8f25f817a5125ace79dab702cf9b87c9`; I detached exactly at the requested candidate, ran `npm ci`, installed the Linux prerequisites declared by `.github/workflows/release.yml`, and executed every command in `.factory/claims.json` independently.

| Claim | Exact test | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | Pass, 1 test |
| `local-repair` | `npm run test:e2e -- --grep @claim:local-repair` | Pass, 1 test |
| `portable-exports` | `npm run test:e2e -- --grep @claim:portable-exports` | Pass, 1 test |
| `private-demo` | `npm run test:e2e -- --grep @claim:private-demo` | Pass, 1 test |
| `free-book` | `npm run test:e2e -- --grep @claim:free-book` | Pass, 1 test |
| `erase-local-book` | `npm run test:e2e -- --grep @claim:erase-local-book` | Pass, 1 test |
| `license-backoff` | `npm run test:e2e -- --grep @claim:license-backoff` | Pass, 1 test |
| `encrypted-vault` | `cargo test --manifest-path src-tauri/Cargo.toml claim_encrypted_vault_uses_aes_256_gcm` | Pass, 1 test |

The native claim first stopped before compilation because the clean container lacked GLib/WebKit development packages. After installing the exact workflow prerequisites, the exact claim command passed. This is setup evidence, not a product failure.

The claims contract still fails because substantial live/README claims are not listed and tagged: native vault-and-key deletion, Whisper export/import, no audio/keylogging/arbitrary-field access, checksum-verifying installers, at-most-daily license verification, and updates through v1.x. Two listed claims also fail valid supported variants:

- After removing `Engineering notes`, its visible rule sources become `Any approved app`, while exported CSV exposes `sample-engineering-notes`. This contradicts the declared claim that CSV identifies the visible source application.
- Approving a rule in the browser demo says `Rule approved and encrypted in your local book.` The stored `demo:drb_web_preview_state` is readable plaintext JSON. The encryption claim is correctly scoped to native in `claims.json`, but the live browser feedback is false.

Under the supplied claims contract, unlisted or false reliance claims are release-blocking.

### Cold first read: pass

At 1440×900 and 390×844, the first screen answers all required questions in plain words:

- What: `Teach dictation your words.`
- For whom/change: dictation users with names, medications, code terms, or workplace jargon can turn corrections into reusable rules.
- First click: `Try it with sample data`, followed by what opens.

The action opens `/demo/` in one click with three realistic rules. Cold `/` returned 200 with no console/page errors. Evidence: `qa-evidence/live-first-read-desktop.png` and `qa-evidence/live-mobile-390-reduced-verify2.png`.

## Release-blocking defects

### Blocker — claim integrity is incomplete and contradicted

The manifest does not inventory all visitor-reliance claims, the browser falsely reports encryption, and the portable-source export claim fails after the supported source-removal workflow. Details and exact observed CSV are above.

### Serious — malformed JSON import persists a permanently broken state

On live `/demo/`, import `{"version":1,"corrections":[]}`. The app accepts and stores it because validation checks only `version` and `corrections`. Rendering then throws:

- `TypeError: Cannot read properties of undefined (reading 'map')`
- `TypeError: Cannot read properties of undefined (reading 'theme')`

Reload leaves only the skip-link and zero children under `#app`; no recovery UI is available. The corrupt JSON remains in local storage. This fails invalid-input recovery and can affect the native encrypted vault through the same UI path. Evidence: `qa-evidence/live-demo-after-malformed-import-verify2.png`.

### Serious — valid code-term replacement `$&` silently fails

I approved `ampersand token` → `$&`, then repaired `Use ampersand token now.` The result stayed unchanged, while the UI reported `1 rule applied: $&`. `String.replace` interprets `$&` as the entire match. This directly affects the brief's code-term users and produces false success feedback.

### Serious — “Erase all local data” retains license data

After seeding a license token and cached verdict, accepting `Erase all local data` removed the repair-book state but left both license keys. Live demo evidence left:

- `demo:sb_license:dictation-repair-book`
- `demo:sb_license_verdict:dictation-repair-book`

The same action path omits `clearLicense()` in native mode. The control's wording and privacy expectation are therefore false.

### Serious — demo lifecycle does not meet the sandbox contract

After approving `post grass` → `Postgres`, choosing `Start for real` left `demo:drb_web_preview_state` present. Returning to `/demo/` showed the change. The required exit behavior is to discard demo changes (or explicitly offer a one-time transfer), and the required banner says sample data is not saved. This banner instead says only that data stays separate.

### Serious — mobile app views overflow and some targets are undersized

At 390 px, the live demo Rules screen has document width 474 px (84 px horizontal overflow), and Settings is 398 px wide because the license section extends from -8 to 398. The Rules table's action column is clipped until horizontal scrolling. Demo `Reset demo` and `Start for real` are 38 px tall; legal/footer links are 19 px tall. The baseline requires no page overflow and 44 px touch targets. Evidence: `qa-evidence/live-demo-mobile-rules-overflow-verify2.png`.

## Other findings

### Medium — offline navigation to the precached demo is broken

After one online landing visit and service-worker activation, I went offline and opened `/demo/`. The cached HTML returned 200, but the app stayed blank because its JS/CSS were not precached. The generic fallback served landing HTML for missing JS/CSS, producing three strict-MIME console errors. Offline reload of `/` itself passes. `registration.update()` completed with the existing worker active and no waiting/installing worker.

### Medium — required metadata and route inventory are incomplete

The site has no canonical link, Open Graph fields, Twitter card, Apple touch icon, or 1200×630 social image. Legal and 404 pages also lack meta descriptions. `sitemap.xml` omits `/demo/`. Footers omit the required version/build identity. These are mandatory in the supplied site-structure contract.

### Minor — accessible-name mismatch

Lighthouse flags the compact mobile wordmark: visible text `DR BK` is not contained in accessible name `Dictation Repair Book home`. The weighted Lighthouse accessibility score remains 100, and Playwright Axe found no serious/critical issues.

## What passed

| Area | Fresh evidence |
| --- | --- |
| Install | `npm ci`: 66 packages installed, 0 vulnerabilities |
| Full web test | `npm test`: 6 Vitest + 14 Playwright tests passed |
| Types / lint | `npm run typecheck` passed; no lint script exists |
| Production build | `npm run build` passed; emitted `dist/app/` and `dist/site/` |
| Native gates | Full `cargo test`, `cargo fmt --check`, and `cargo check` passed |
| Normal product flow | Medication, Kubernetes, and Niamh samples repaired correctly; unmatched text remained unchanged; proposal, approval, search, delete/undo, CSV/JSON export, and reset worked |
| Invalid unchanged correction | Clear recovery message: `I could not isolate a changed term...` |
| Live identity | Landing, demo, privacy, terms, 404 body, service worker, and all tested hashed JS/CSS matched the fresh candidate build byte-for-byte |
| Release provenance | Annotated `v0.1.1` tag dereferences to candidate `7d1fce5`; release contains both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, and `latest.json` |
| Artifact checksum | Fresh Linux DEB SHA-256 `0fc593b151926d4e8b4c6061c5b64ccd548539ddb7e36e4758d3c717507c6691` matches both release checksum sources |
| Native smoke | Extracted DEB metadata/version/dependencies were valid; released binary remained running for 10 seconds under Xvfb (timeout 124), with headless portal/display warnings but no app crash |
| Accessibility automation | All five live routes had one h1, one main, `lang=en`, and zero Axe serious/critical findings in light and dark/reduced-motion checks; keyboard focus rings were 3 px cobalt and the skip link worked |
| Worker URL check | 200, 892 ms load, title/lang/one h1/main/alt checks pass, zero errors; see `qa-evidence/verify-url-live-verify2/verify.json` |
| Landing mobile | 390/390 px, no overflow; reduced-motion matched and computed smooth scrolling became `auto` |
| Lighthouse mobile | 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 1.0 s, LCP 1.1 s, TBT 30 ms, CLS 0 |
| Bundles | Landing JS 1.94 KB gzip total, CSS 2.98 KB gzip; demo JS 8.50 KB gzip total, CSS 3.65 KB gzip; mobile hero 47,766 bytes |
| Headers/cache | CSP includes `frame-ancestors 'none'`; HSTS, nosniff, strict-origin referrer, and camera/microphone/geolocation denial present. Hashed assets cache one year immutable; HTML/SW 30 seconds; installers 300 seconds |
| Privacy requests | Cold landing contacted only same origin and the disclosed GitHub release API. Full demo repair flow contacted same origin only. No analytics, third-party fonts, or third-party scripts observed |
| Routes/links | `/`, `/demo/`, `/privacy/`, `/terms/` return 200; unknown path returns designed 404; every rendered internal/external link resolved successfully |
| Billing endpoint | Requests 1–30 returned 200 invalid verdicts; request 31 returned 429 with `Retry-After: 3`. Observed allowance: 30 requests per client/window. Checkout returned 303 to hosted Dodo checkout. No sign-in exists |

## Verification notes

- The live 404 document necessarily logs the 404 resource status when opened directly; successful routes had no load errors.
- The product has no first-party backend. Backend concurrency and persistence checks do not apply; the external license endpoint's rate limit was tested as required.
- This is a desktop product, not a library/CLI, so clean-consumer package/API tests do not apply.
- Native interaction was limited to the released Linux package smoke plus native Rust storage crypto tests; the browser demo exercises the shared UI and repair logic.

## Required before acceptance

Validate imported data completely before persisting it and provide recovery for already-corrupt state; use a replacement callback so literal code strings are preserved; make erase clear license data; discard demo mutations on exit; preserve source display names after source removal; fix 390 px overflow and touch targets; repair offline asset fallback; complete metadata; and bring every visitor claim under one tagged claim test.
