# Review 3 handoff — FAIL

Reviewer-only work order. No product source, deployment, infrastructure, or billing configuration was changed.

## What was done

- Read the brief, design contract, claims inventory, demo documentation, every prior review/polish record, and the previous handoff.
- Opened the live site cold in new 390×844 and 1440×900 browser contexts; exercised the one-click demo, reset, real-data sentinel isolation, local repair, exit, privacy request log, offline service-worker routes, demo deep link/back/focus behavior, metadata, 404, accessibility, and link crawl.
- Cloned the repository into a fresh temporary directory; ran `npm ci --ignore-scripts`, each of the 34 declared claim commands separately, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.

## Result

The review is **FAIL**, documented in `.factory/review-3.md`.

- **Blocking F-1-7:** the declared PowerShell installer claim runs a JavaScript simulation and text check, not the shipped `install.ps1`. A separate PowerShell fixture exists, but is not the declared claim test.
- **Minor F-3-1:** the landing footer's original-art/provenance assertion is not in `claims.json`.

All 34 declared commands exited successfully, but the PowerShell command's test design does not establish the behavior its claim promises. The full regression gate passed: 27 Vitest tests, installer contract, 4 no-GUI Rust tests, 45 Playwright tests, typecheck, lint, and build. `dist/app/` and `dist/site/` were produced in the clean clone.

## Next step

Declare and execute `tests/installers.ps1` as the PowerShell claim test on a Windows/PowerShell clean sandbox, then remove or claim-test the footer provenance sentence and rerun review 3.
