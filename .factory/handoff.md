# Polish 5 handoff — PASS

Repaired review base `b67ff87c66543a934b59032fb6d10650dec429a8` in product commits `f1529d7` and `0c4ed42`.

## Done

- Made every GitHub and Sociobot checkout link visibly identify its off-site destination. This covers the landing’s initial, resolved, and fallback download links; checkout; source; legal issue links; and both desktop-app checkout actions.
- Added exact-name regression checks at 1440×900 and 390×844 for landing GitHub/checkout links, legal GitHub links, and the desktop checkout link.
- Preserved all prior demo isolation, routing/focus, service-worker 404, native vault, privacy, installer, release, accessibility, copy, and mobile repairs. The complete finding map is in `.factory/polish-5.md`.
- Updated the verb-first catalog description and copy audit.
- Built and deployed `dist/site` to the product-only Static Web App `sf-dictation-repair-book`; the current live URL is <https://dictation-repair-book.sociobot.in>.

## Verified

- Fresh clone (`0c4ed42`): ran every one of the 34 `.factory/claims.json` commands separately. All passed.
- Fresh clone full gate: `npm test` (48 tests), `npm run typecheck`, `npm run lint`, `npm run build`, `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`, and `cargo fmt --manifest-path src-tauri/Cargo.toml --check` all passed.
- Cold production check: `node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in .factory/qa-evidence/polish-5/live` passed. It verifies valid route 200s, an actual 404, metadata, semantic shell, alt text, console, desktop/mobile Axe, demo isolation, Back/Forward focus/announcement, and offline route behavior.
- Exact production link check passed at desktop and phone widths. See `.factory/qa-evidence/polish-5/live/external-links.json` and the matching full-page captures.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,056 ms, CLS 0, TBT 31 ms (`.factory/qa-evidence/polish-5/live/lighthouse-mobile.json`).

## How to run

`npm ci && npm test && npm run typecheck && npm run lint && npm run build`

For the installed-app release path, use the existing tag-triggered `.github/workflows/release.yml`; current builds are unsigned as disclosed on the site. The static landing deploy input is `dist/site` plus `public/staticwebapp.config.json`.

## Known gaps

None. No prior review finding remains unresolved.
