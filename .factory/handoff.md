# Polish round 4 handoff — PASS

## Shipped

- Fixed the reopened browser-history defect. Returning from Test to `/demo/?demo=1` now restores the default **Approved rules** view, focuses its h1, and announces it. Forward restores Test in the same way.
- Added the deterministic Playwright regression and the same cold-live assertion to `scripts/verify-live.mjs`.
- Retained and reverified every repair from reviews 1–3: isolated browser/native samples, all claim tests, real routes and metadata, 404 status, mobile layout, accessibility, privacy, offline behavior, installers, and release artifacts.
- Updated the catalog description to a 92-character verb-first sentence and refreshed the copy audit.
- Deployed `dist/site` from product commit `cde5814c0522ad5e069345300f07ee898a0d43dd` to <https://dictation-repair-book.sociobot.in>. Azure deployment id: `6e4c677d-2735-4e38-815a-1fd578dfc320`.

## Verification

- Fresh clone at `cde5814c0522ad5e069345300f07ee898a0d43dd`: all 34 claim commands passed separately. Evidence: `.factory/qa-evidence/polish-4/clean-clone/claim-run.log`.
- `npm test`: 27 Vitest tests, the executable shell/PowerShell installer contract, four Rust tests, and 46 Playwright tests passed. PowerShell 7.5.4 was supplied as an isolated test runtime.
- `npm run typecheck`, `npm run lint`, `npm run build`, `cargo check --no-default-features`, and `cargo fmt --check` passed. Build output includes `dist/app/index.html` and `dist/site/index.html`; landing JavaScript is 1.88 KB gzip.
- Focused regression: `browser Back restores the default demo Rules view and Forward restores Test` passed. Evidence: `.factory/qa-evidence/polish-4/back-regression.log`.
- Cold live history result: Back URL `/demo/?demo=1`, h1/announcement `Approved rules`, focused `true`; Forward URL includes `view=test`, h1/announcement `Test your repair book`, focused `true`. Evidence: `.factory/qa-evidence/polish-4/live/live-recheck.json`.
- Live route, console, semantic, Axe, mobile, reduced-motion, privacy, and offline checks passed. `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; the designed missing route returns 404. Evidence and screenshots: `.factory/qa-evidence/polish-4/live/`.
- `/opt/fleet/lib/verify-url.sh` passed with no console errors, one h1, `lang=en`, a main landmark, and complete image alt text.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms. Evidence: `.factory/qa-evidence/polish-4/lighthouse-live-mobile.json`.
- The live demo JavaScript hash matches the deployed local build. GitHub main contains repair commit `cde5814` and its retained evidence. The v0.1.10 release still exposes all required platform artifacts, and its Linux DEB matches the published SHA-256 checksum.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

PowerShell 7 is required for the executable Windows installer fixture on Linux.

## Known gaps and next steps

No review finding or product-scope gap remains. Current desktop packages are intentionally unsigned and the site discloses this. Future signing would require operator-owned Apple and Windows certificates; the current workflow expects no signing secrets and needs no operator action for this release.
