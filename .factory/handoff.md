# Verification 3 — PASS

**Verified candidate:** `d476b4dd900130ff1748712af6db90c754c1c9cd`
**Verified URL:** <https://dictation-repair-book.sociobot.in>
**Independent result:** **PASS — accepted for release.**

Fresh independent QA completed on 2026-08-29 UTC. All 22 declared claims passed individually; `npm test` (14 Vitest + 26 Playwright), typecheck, lint, production Vite build, full Rust test, Rust format check, and Rust compile check passed. The cold landing page clearly identifies the product, audience, and one-click sample demo. Live desktop/mobile, keyboard, reduced-motion, offline-reload, request-log, headers, Axe, and rate-limit checks passed. The observed license-verification allowance is 30 requests per client/window; request 31 returned `429 Retry-After: 3`.

The live static deployment byte-matches the candidate `dist/site` assets and routes. The released Linux package checksum matches `SHA256SUMS` and its extracted binary stayed running under Xvfb for the 10-second smoke window. There are no blocker, serious, medium, or minor product defects from this verification. Full evidence is in `.factory/verification-3.md`.

The only testing-tool note is that Lighthouse produced 100/100/100/100 and the expected web metrics, then its Chromium process reported `TARGET_CRASHED` while capturing a full-page screenshot; independent Playwright page loads had no crash or console errors.

# Repair 2 handoff — PASS

## Outcome

All release-blocking findings in independent report commit `486bf3776ea8456e952cb30b0e294169007d5a6e` for candidate `7d1fce55e5210354e57352d7b5b99aaa2f109f1b` were reproduced and repaired. The static site is deployed at <https://dictation-repair-book.sociobot.in>. The desktop version is `v0.1.2`; GitHub Actions run `33261243977` builds the platform packages from tag `v0.1.2`.

## Finding-by-finding repair

1. **Malformed import and corrupt-state recovery:** every top-level and nested state field is parsed before render or persistence. Invalid browser state is removed with a recovery notice. Invalid native state opens a recoverable empty UI and can be erased. Native persistence independently rejects malformed state. Regression: `invalid stored and imported data recovers without replacing the current book` plus Rust `rejects_partially_shaped_state_before_encryption`.
2. **Literal code replacements:** `String.replace` now uses a replacement callback, so `$&`, `$'`, and other replacement syntax stays literal. Regression: `@claim:literal-code-replacement`.
3. **Complete erasure:** `Erase all local data` now removes the repair book, license token, verdict, and backoff key; native erase removes the vault, temporary vault, and key. Regressions: `@claim:erase-local-book` and `claim_native_erase_removes_vault_and_key`.
4. **Demo lifecycle:** the banner now states `Demo — sample data, nothing is saved`; `Start for real` deletes demo state and demo license keys before leaving. Regression: `@claim:demo-sandbox`.
5. **Removed-source portability:** each correction records its source display name. Removing an approved source preserves that name in Rules, JSON, and CSV; internal IDs are never substituted into CSV. Regression: `@claim:portable-exports`.
6. **390 px layout and touch:** Rules becomes a stacked mobile ledger, Settings no longer uses negative edge margins, demo controls are 44 px high, and legal/footer links have 44 px targets. Regression: `demo Rules and Settings fit 390px and primary touch targets are at least 44px`.
7. **Offline demo:** service-worker install now discovers and precaches every built route dependency, updates take control immediately, obsolete caches are removed, and cache lookup uses normalized paths. Missing non-navigation assets no longer receive landing HTML. Regression: `@claim:offline-demo` and the service-worker contract unit test.
8. **Metadata and route inventory:** every public route now has a description, canonical URL, Open Graph fields, Twitter card, Apple touch icon, and product social image. `/demo/` is in the sitemap. Footers and app chrome show `v0.1.2 · repair 2`. The compact wordmark accessible name includes visible `DR BK`. Regression: `every public route has complete metadata and one semantic page heading`.
9. **Claim integrity:** `.factory/claims.json` now inventories 22 visitor-reliance claims. Each has exactly one tagged test. Browser approval/import feedback says encryption only in the native app. The untestable future-update promise was removed. Installer mismatch behavior is executed with an isolated fake download, not only string-matched. Search/delete/undo and revoked-license behavior now have explicit coverage too.

The existing marked-up repair-ledger visual system and approved generated hero were preserved. The 1200×630 social card is a local crop of that approved art; the 180×180 touch icon derives from the hand-authored app icon. Provenance is recorded in `.factory/design.md`. Runtime AI was intentionally not added: deterministic local replacement is the researched job and avoids sending sensitive vocabulary to a model.

## Verification evidence

Run from `/work/repo`:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml
```

Results on 2026-08-29 UTC:

- Clean install: 168 packages, 0 vulnerabilities.
- Unit: 14/14 passed.
- Playwright: 26/26 passed against `dist/site`; desktop, 390×844, dark mode, reduced motion, keyboard, offline, and Axe included.
- Every one of the 22 commands in `.factory/claims.json` passed independently. Tag audit found exactly one `@claim:<id>` marker per claim.
- TypeScript typecheck and ESLint: passed.
- Production build: passed; `dist/app/` and `dist/site/` created. Site JavaScript totals 30,281 bytes raw; CSS totals 25,520 bytes raw; no font payload; mobile hero is 47,766 bytes.
- Native: 3 Rust tests passed; format and compile checks passed.
- Local URL verifier: 200 in 655 ms, one title/lang/h1/main, all image alt text present, zero console errors. Evidence: `.factory/qa-evidence/repair-2-local/verify.json`.
- Local mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0. Evidence: `.factory/qa-evidence/repair-2-lighthouse-mobile.json`.
- Live mobile Lighthouse: 100/100/100/100; FCP 0.9 s, LCP 1.1 s, TBT 30 ms, CLS 0. Evidence: `.factory/qa-evidence/repair-2-lighthouse-live-mobile.json`.
- Live URL verifier: 200 in 736 ms, correct title/lang, one h1/main, zero missing alt text, zero unlabeled buttons, zero console errors. Evidence: `.factory/qa-evidence/repair-2-live/verify.json`.
- Live demo: desktop 1440 px and Rules/Settings at 390 px had no page overflow; dark/reduced-motion rendered correctly; demo controls measured at least 44 px; zero console/page errors and zero Axe serious/critical issues. Screenshots are under `.factory/qa-evidence/repair-2-live/`.
- Live privacy/offline: the full demo contacted only the product origin. After one landing visit, `/demo/` opened offline with its scripts and styles and zero errors.
- Live identity: `/`, `/demo/`, `/privacy/`, `/terms/`, `/sw.js`, `/apple-touch-icon.png`, and `/assets/social-card.jpg` match the local `dist/site` files byte-for-byte. An unknown route returns the designed 404 with HTTP 404.
- Live response policy: CSP includes `frame-ancestors 'none'`; HSTS, nosniff, strict-origin referrer, and camera/microphone/geolocation denial are present. Invalid license verification returned `200 {valid:false, reason:"invalid"}`. Checkout returned 303 to the hosted Dodo checkout.
- Release consumer check: downloaded `Dictation-Repair-Book-linux-x64.deb` is a valid Debian package at version `0.1.2`. Its measured SHA-256 is `c2131227279662bc7dd924ba760886656e342abea047f28e26195da8a54164bc`, exactly matching the published `SHA256SUMS`. Its installed binary launched under Xvfb and stayed running until the intentional eight-second timeout.

## Deployment and release

- Main branch product code was pushed through commit `61302673d33e836edfd718da47b4adf3fe923cd5` before deployment. Final regression coverage and evidence are committed later on `main`.
- Static deployment: Azure Static Web App `sf-dictation-repair-book`, resource group `sociobot`, production environment. CLI reported success at the resource hostname; the custom domain serves the matching build.
- Desktop release: <https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.2>, tag `v0.1.2` at product commit `61302673d33e836edfd718da47b4adf3fe923cd5`; GitHub Actions run `33261243977` completed successfully.
- Published assets: macOS arm64 DMG (2,194,316 bytes), macOS x64 DMG (2,292,540), Windows EXE (1,869,084), Windows MSI (2,375,680), Linux AppImage (77,609,464), Linux DEB (2,709,186), `SHA256SUMS`, and `latest.json`.
- `latest.json` is valid `v0.1.2` JSON with macOS arm64/x64, Windows x64, and Linux x64 download records. Every manifest digest matches the corresponding entry in `SHA256SUMS`.
- Live detected-platform check on Linux resolved to the real `v0.1.2` AppImage URL, showed `v0.1.2 · checksum published · unsigned build`, and logged zero console errors.

## Known gaps and operator action

- Desktop packages remain unsigned, as disclosed on the site. The current workflow does not consume signing credentials. To sign later, the operator must add signing steps and configure `APPLE_CERTIFICATE` for macOS and `WINDOWS_CERT_PFX` for Windows, with their corresponding passwords and platform signing metadata.
- Native GUI interaction is covered through the shared browser UI plus native Rust storage tests; platform bundles are produced only on GitHub’s native runners, as required.
