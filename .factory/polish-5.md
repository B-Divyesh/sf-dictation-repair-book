# Polish round 5 — PASS

Repair base: `b67ff87c66543a934b59032fb6d10650dec429a8` (review 5). Product changes are `f1529d7` and `0c4ed42`. The freshly built static site was published to `https://dictation-repair-book.sociobot.in` from the product-scoped Static Web App on 2026-09-02 UTC. Final live evidence is in `.factory/qa-evidence/polish-5/live/`.

| Finding | Change made or retained repair | Evidence |
| --- | --- | --- |
| F-1-1 | The demo banner remains in normal phone flow above the active work header. | E2E `demo banner does not cover the active heading on a 390px phone`; `live/live-demo-390.png`; `/demo/?demo=1`. |
| F-1-2 | Query routes, Back/Forward restoration, title, h1 focus, and polite announcement remain wired; the default Rules URL is restored when no `view` is present. | E2E `browser Back restores the default demo Rules view and Forward restores Test`; `live/live-recheck.json`; `/demo/?demo=1&view=test`. |
| F-1-3 | The installed app keeps its in-memory sample guards and first-run **Load sample repair book** action; the site retains four captioned app frames. | `@claim:native-sample-isolation`; `live/live-landing-desktop.png`; `/#walkthrough`. |
| F-1-4 | Installer commands remain keyboard-focusable, named scroll regions with a visible focus ring. | E2E `landing page is accessible`; `live/live-a11y.json`; `/` at 390 px. |
| F-1-5 | The worker still normalizes valid route variants and creates 404 responses for unknown routes online and offline. | E2E `service-worker controlled unknown routes keep their 404 status online and offline`; `live/live-recheck.json`; `/polish-four-missing-page`. |
| F-1-6 | The native encryption claim still saves and loads through the production vault and rejects plaintext on disk. | `@claim:encrypted-vault`; clean-clone claim run; `/privacy/`. |
| F-1-7 | The portable claim contract and required Windows executable installer CI wiring remain intact. | `npm run test:installer-contract` (`@claim:powershell-checksum-installer`); clean-clone full gate; `/install.ps1`. |
| F-1-8 | Fixture release preparation still validates the output set, checksums, and manifest. | `@claim:release-matrix`; clean-clone claim run; release workflow source. |
| F-1-9 | Reset and exit preserve the byte-identical real browser book while deleting only demo data and demo license keys. | `@claim:demo-sandbox`; `live/live-recheck.json`; `/demo/?demo=1`. |
| F-1-10 | A clean visitor can use the populated sample without authentication. | `@claim:no-account`; `live/live-demo-390.png`; `/demo/?demo=1`. |
| F-1-11 | Compatibility copy remains limited to pasted transcript text and local replacements. | `@claim:local-repair`; `.factory/copy-audit.md`; `/#limits`. |
| F-1-12 | Overlapping approved rules continue to run longest first. | `@claim:longest-rule-first`; clean-clone claim run; `/demo/?view=test`. |
| F-1-13 | Fresh native vault directories still receive distinct random 32-byte keys. | `@claim:per-device-key`; clean-clone claim run; `/privacy/`. |
| F-1-14 | The same production-key test still verifies Unix mode `0600`. | `@claim:per-device-key`; clean-clone claim run; `/privacy/`. |
| F-1-15 | Privacy wording remains limited to the OS-user access boundary. | `.factory/copy-audit.md`; `@claim:encrypted-vault`; `/privacy/`. |
| F-1-16 | Merchant-of-record wording remains absent; free-rule and export wording remains claim-backed. | `@claim:free-book`, `@claim:portable-exports`; `live/live-landing-desktop.png`; `/terms/`. |
| F-1-17 | License verification remains limited to a token without repair-book text. | `@claim:license-request-privacy`; clean-clone claim run; `/privacy/`. |
| F-1-18 | Public privacy wording remains bounded to the tested demo and license-request flows. | `@claim:private-demo`, `@claim:website-privacy`; `live/live-recheck.json`; `/privacy/`. |
| F-1-19 | The unsupported reproducible-build promise remains removed. | `.factory/copy-audit.md`; clean-clone `npm run build`; repository README. |
| F-1-20 | Unsigned-build disclosure remains inventory-tested and visible. | `@claim:unsigned-build`; `live/live-landing-desktop.png`; `/#install`. |
| F-1-21 | Copy distinguishes checksum-verifying install commands from direct downloads with a published checksum. | `@claim:checksum-installers`, `@claim:powershell-checksum-installer`; `/install`. |
| F-1-22 | The landing h1 still names the correction-to-rule job. | E2E `landing page fits a 390px phone`; `live/live-landing-390.png`; `/`. |
| F-1-23 | Monitoring wording still names fields and keystrokes plainly. | `.factory/copy-audit.md`; `live/live-landing-390.png`; `/`. |
| F-1-24 | Workflow copy describes saved corrections and local replacements without recognizer generalisations. | `@claim:local-repair`; `.factory/copy-audit.md`; `/#how`. |
| F-1-25 | The privacy heading remains “How the app stores your repair book.” | E2E `every public route has complete metadata and one semantic page heading`; `live/live-landing-desktop.png`; `/privacy/`. |
| F-1-26 | The export/deletion FAQ remains direct and specific. | `.factory/copy-audit.md`; `live/live-landing-desktop.png`; `/#limits`. |
| F-1-27 | Controls name their immediate result; external destinations are now also disclosed. | E2E `GitHub and checkout links disclose their external destination on desktop and mobile`; `live/external-links.json`; `/`. |
| F-1-28 | Visitor and README terminology remains **rule** for an entry and **repair book** for the collection. | `.factory/copy-audit.md`; `live/live-demo-390.png`; `/demo/?demo=1`. |
| F-1-29 | Privacy, offline, and price facts stay inside the 390×844 first screen, with only Try visually primary. | E2E `landing page fits a 390px phone`; `live/live-landing-390.png`; `/`. |
| F-1-30 | Landing, demo, legal, and 404 routes retain shared navigation/footer, legal links, metadata, and one visible h1. | E2E `every public route has complete metadata and one semantic page heading`; `live/live-route-check.json`; `/demo/`, `/privacy/`, `/terms/`. |
| F-2-1 | Public price and checkout contract remain $12 USD once. | `@claim:checkout-price`; clean-clone claim run; `/#price`. |
| F-2-2 | Build output remains inventoried and verifies both `dist/app/` and `dist/site/`. | `@claim:build-output`; clean-clone `npm run build`; repository README. |
| F-2-3 | Release source/version refusal remains claim-inventoried and tested. | `@claim:release-source-identity`; clean-clone claim run; release workflow source. |
| F-2-4 | Approved entries remain rules and their collection remains the repair book. | `.factory/copy-audit.md`; `live/live-demo-desktop.png`; `/demo/?demo=1`. |
| F-2-5 | The shipped sample applications remain Notes and VS Code. | `@claim:portable-exports`; `live/live-demo-desktop.png`; `/demo/?demo=1`. |
| F-2-6 | Storage/export/erase copy remains concrete rather than absolute slogans. | `.factory/copy-audit.md`; `live/live-landing-desktop.png`; `/`. |
| F-2-7 | “Product limits and compatibility” remains the contextual FAQ heading. | `.factory/copy-audit.md`; `live/live-landing-desktop.png`; `/#limits`. |
| F-2-8 | Internal release-repair jargon remains absent from public footers. | `.factory/copy-audit.md`; `live/live-landing-390.png`; `/`. |
| F-2-9 | README still names the three version files and tag-based release procedure. | `@claim:release-source-identity`; clean-clone claim run; repository README. |
| F-2-10 | Demo section controls remain real links with query URLs. | E2E `demo sections use real query URLs, restore with history, announce, and focus their h1`; `live/live-recheck.json`; `/demo/?view=test`. |
| F-2-11 | Privacy copy still says the app does not record typing, read other fields, or keep audio. | `@claim:explicit-access`; `.factory/copy-audit.md`; `/#privacy`. |
| F-3-1 | The untestable public artwork-provenance sentence remains removed; required provenance stays in `.factory/design.md`. | E2E/live absence assertion in `scripts/verify-live.mjs`; `live/live-landing-desktop.png`; `/`. |
| C-4-1 | The PowerShell contract remains portable locally while the release/quality workflow retains its real Windows executable fixture. | `npm run test:installer-contract`; `.github/workflows/quality.yml`; `/install.ps1`. |
| F-5-1 | Every GitHub and checkout link now visibly identifies its destination: initial and resolved GitHub downloads, GitHub source/issues links, website checkout, and desktop checkout. The links use `rel="external"`; exact labels are tested at desktop and 390px phone widths. | E2E `GitHub and checkout links disclose their external destination on desktop and mobile` and `desktop checkout link names Sociobot on desktop and mobile`; `live/external-links.json`, `live/live-landing-desktop.png`, `live/live-landing-390.png`; `/`, `/privacy/`, `/terms/`. |

## Verification

- A fresh clone at repair commit `0c4ed42` ran all 34 commands declared in `.factory/claims.json` separately, then passed `npm test` (48 browser/unit/native tests), `npm run typecheck`, `npm run lint`, `npm run build`, `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`, and `cargo fmt --manifest-path src-tauri/Cargo.toml --check`.
- Production build sizes remain small: landing JavaScript is 1.90 KB gzip and the desktop webview’s main JavaScript is 10.04 KB gzip.
- `scripts/verify-live.mjs` passed cold against production. It recorded 200s for `/`, `/demo/`, `/privacy/`, and `/terms/`; a designed 404 for an unknown route; no serious/critical Axe findings; no console errors on valid routes; isolated demo storage; correct history/focus; and offline demo/404 status preservation.
- A dedicated cold-live exact-label check passed at 1440×900 and 390×844. It recorded the three landing links and both GitHub issue links in `live/external-links.json`.
- Mobile Lighthouse report: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,056 ms, CLS 0, TBT 31 ms. See `live/lighthouse-mobile.json`.

No review finding remains open.
