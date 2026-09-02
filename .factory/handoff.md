# Review 4 handoff — FAIL

Review only; no product code, deployment, billing, or infrastructure changed.

`.factory/review-4.md` records a reopened blocking regression: from the default
demo Rules view, navigating to Test and pressing browser Back restores the URL
but leaves the Test screen visible. Fix default-route restoration and add the
specified regression test.

Verification completed from a fresh clone: all 34 declared claim commands,
`npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` passed.
PowerShell 7.5.4 was used from an isolated temporary verifier runtime because
the base container does not ship `pwsh`.
