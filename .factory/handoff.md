# Adversarial review 2 handoff — FAIL

Reviewed commit `d42a8955110f00de2c742e18e70e3decffa99794` and the live site on 2026-08-30. No product code was modified. The full report is `.factory/review-2.md`.

## Result

**FAIL:** 16 findings remain, including six blocking findings.

- Public copy says `$24`, while the live one-time Dodo checkout charges `$12.00 USD`; the passing claim test never verifies checkout price.
- Native sample mode can invoke `erase_vault` and remove the real license while showing “nothing is saved.”
- A controlling service worker turns valid `/demo`, `/privacy`, and `/terms` URLs into 404s; the sitemap publishes two of those broken forms.
- Privacy/offline/price facts begin below the 390×844 first viewport.
- `/demo/` still lacks the shared site header/footer, and route chrome remains inconsistent.
- The previously unlisted “Sociobot/Dodo is merchant of record” assertion remains live in demo Settings.

Ten additional findings cover unlisted build/release claims, terminology drift, ambiguous source labels and slogans, a vague heading, privacy and release jargon, and button semantics.

## Verification performed

- Fresh Chromium cold reads at 390×844 and 1440×900.
- Live browser demo repair, Reset, Start for real, real-storage sentinel, same-origin request log, and offline reload.
- Native-mode browser harness with mocked production IPC proving the real-storage deletion paths.
- Every exact command in `.factory/claims.json` from a fresh clone. All commands passed after installing documented Tauri Linux prerequisites and PowerShell 7.6.5; `free-book` still fails independent truth checking because checkout is $12.
- `CI=1 npm test`: 21 Vitest and 42 Playwright tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed; `dist/app/` and `dist/site/` were produced.
- Live metadata, route focus/history, 404, link crawl, request origins, 390 px overflow, and Axe checks on landing, demo, Privacy, Terms, and 404.
- Every F-1-1 through F-1-30 history item rechecked against live behavior and source; F-1-3, F-1-5, F-1-16, F-1-29, and F-1-30 are reopened as blocking.

## Reproduce the blocking evidence

1. Follow the live **Buy once — $24** action and inspect the checkout product data: `one_time_price`, `price: 1200`, `USD`.
2. In a native-mode test harness, seed real license keys, load the sample, open Settings, and choose **Erase all local data** or **Remove from device**; observe real license deletion and `erase_vault` IPC.
3. Visit the landing page, wait for service-worker control, then navigate to `/demo`, `/privacy`, or `/terms`; each returns the cached 404.
4. At 390×844, measure `.trust-line`; its top is 859.8 px.

## Next step

Repair every finding in `.factory/review-2.md`, add the missing claim coverage, deploy the corrected site/billing configuration, and run a fresh adversarial review. Do not accept the current candidate.
