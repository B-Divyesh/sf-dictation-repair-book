# Polish round 3 handoff — PASS

Repair base: `68dff62068353eddcffb3a8c2f44852cd224df77` / review record `4aacb4324bcf7a7b15600a5c887ba2555427255f`.

## Delivered

- Repaired blocking **F-1-7**. The declared `powershell-checksum-installer` claim now runs `pwsh -NoLogo -NoProfile -File tests/installers.ps1`, which invokes the shipped `public/install.ps1` through isolated matching and mismatch fixtures. The full `npm test` gate also requires that executable fixture. `tests/installers.mjs` is retained only as a clearly labelled static smoke check, with no claim tag.
- Resolved **F-3-1** by removing the visitor-facing hero-art provenance assertion from the landing footer. Required provenance remains in `.factory/design.md`.
- Rechecked and recorded every review-1, review-2, and review-3 finding in [.factory/polish-3.md](polish-3.md). No finding remains open.
- Updated the catalog description to a verb-first, 93-character sentence.
- Added `scripts/verify-live.mjs`, a repeatable cold-live verifier for public routes, titles, metadata landmarks, demo isolation, routing/focus, mobile layout, reduced motion, Axe, request egress, and service-worker offline behavior.

## Commits and deployment

- Repair implementation: `6f4938d734b3d54ddc54a92b24fd41a3127d2faf` (`fix: execute PowerShell installer claim`).
- Static deployment: built with `npm run build:site` and deployed on 2026-09-01 UTC with the scoped `sf-dictation-repair-book` Static Web App to <https://dictation-repair-book.sociobot.in>.
- The deployed landing footer is the repaired version: it says `v0.1.10 · Built by Param Factory` and contains no hero-art provenance claim.

## Verification

All evidence is committed in [.factory/qa-evidence/polish-3](qa-evidence/polish-3).

- Fresh clone at `6f4938d734b3d54ddc54a92b24fd41a3127d2faf`: `npm ci --ignore-scripts`, then all **34/34** `.factory/claims.json` commands separately passed. The exact command transcript is [clean-claim-run.log](qa-evidence/polish-3/clean-claim-run.log).
- The repaired claim was exercised by PowerShell 7.5.4: matching SHA-256 reaches the mocked MSI launcher; mismatch throws `Checksum mismatch; refusing to install.` and never launches it.
- Fresh-clone full gate passed: 27 Vitest tests, Node static installer smoke check, executable PowerShell installer fixture, 4 no-GUI Rust tests, and 45 Playwright tests; then `npm run typecheck`, `npm run lint`, and `npm run build`. See [clean-full-suite.log](qa-evidence/polish-3/clean-full-suite.log).
- The same complete local gate passed again after adding the repeatable live verifier and final evidence: [final-local-suite.log](qa-evidence/polish-3/final-local-suite.log).
- Both production outputs exist: `dist/app/index.html` and `dist/site/index.html`. Site JavaScript is 1.88 KB gzip; desktop-webview JavaScript is 10.02 KB gzip.
- Required URL helper passed on the deployed root: HTTP 200, title, `lang=en`, one h1, main landmark, all image alt attributes, and zero page/console errors. See [verify.json](qa-evidence/polish-3/verify-url/verify.json).
- Cold production recheck passed for `/`, `/demo/`, `/privacy/`, `/terms/`, and a real 404: each has its route-specific title, one h1, main, no missing alt attributes, and zero serious/critical Axe violations. The controlled worker serves offline `/demo` as 200 and an offline unknown route as 404. See [live-recheck.json](qa-evidence/polish-3/live-recheck.json), [live-route-check.json](qa-evidence/polish-3/live-route-check.json), and [live-a11y.json](qa-evidence/polish-3/live-a11y.json).
- Live demo recheck: `/?demo=1` reaches `/demo/?demo=1`; the banner stays clear of the mobile heading; Reset restores sample data; Start for real deletes `demo:drb_web_preview_state`; the real-state sentinel is unchanged; demo repair has no third-party request. Screenshots: [desktop landing](qa-evidence/polish-3/live-landing-desktop.png), [390 px landing](qa-evidence/polish-3/live-landing-390.png), [desktop demo](qa-evidence/polish-3/live-demo-desktop.png), and [390 px demo](qa-evidence/polish-3/live-demo-390.png).
- Mobile Lighthouse against production: **100 performance / 100 accessibility / 100 best practices / 100 SEO**; FCP 1.1 s, LCP 1.1 s, CLS 0. See [lighthouse-summary.json](qa-evidence/polish-3/lighthouse-summary.json) and [lighthouse-live-mobile.json](qa-evidence/polish-3/lighthouse-live-mobile.json).

## Known gaps and next steps

None for this repair. The site and sample remain local-first and analytics-free.

Current desktop release artifacts are intentionally unsigned, and the landing page says so. If an operator later wants signed distribution, configure `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` in the release environment before publishing a new desktop tag.
