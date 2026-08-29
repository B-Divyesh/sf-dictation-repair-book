# Review 1 handoff — FAIL

Completed an adversarial first-read review of commit `3741e9cb2fd0268988f8693a9db9d2407020c3df` and the live site at <https://dictation-repair-book.sociobot.in>. No product code was changed. The full report is `.factory/review-1.md`.

## Verification performed

- Fresh Chromium contexts at 390×844 and 1440×900, including cold first screen, demo entry/reset/exit, storage sentinels, offline reload, request logs, keyboard focus, deep links, Back, route metadata, unknown routes, and link crawl.
- Fresh local Git clone with `npm ci`; all 22 exact `.factory/claims.json` commands passed after installing the README-listed Tauri Linux prerequisites.
- Full gates: the first `npm test` run hit a Chromium process crash after 25 browser passes; the exact rerun passed 14/14 Vitest and 26/26 Playwright tests. `npm run build`, `npm run typecheck`, and `npm run lint` passed.
- Live Axe at 390px, live GitHub release inventory, direct and service-worker-controlled 404 behavior, and byte comparison between the fresh build and deployed public documents/service worker.
- Every prior repair group in the earlier handoff was rechecked. Partial fixes and regressions are mapped in the review.

## Result

Five blocking findings remain: mobile demo-banner overlap, broken demo deep-link/history/focus behavior, missing desktop first-run sample and screenshot walkthrough, a serious mobile keyboard-access violation on install commands, and HTTP 200 for missing routes when the service worker supplies cached 404 content. Additional findings cover incomplete claim tests, unlisted claims, unclear or inconsistent copy, first-screen hierarchy, and route skeleton consistency.

The repository is left buildable and only `.factory/review-1.md` plus this handoff were changed. The review remains `FAIL` until every finding is resolved and independently retested.
