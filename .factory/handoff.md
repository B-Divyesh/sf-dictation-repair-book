# Polish round 1 handoff

Repaired the candidate `d476b4dd900130ff1748712af6db90c754c1c9cd` against every F-1-1 through F-1-30 finding in `.factory/review-1.md`. The detailed finding-to-change-to-evidence ledger is `.factory/polish-1.md`.

## Delivered

- Added an isolated one-click demo at `/demo/?demo=1`, plus the `/?demo=1` landing alias, persistent banner, safe reset/exit, deep-linkable demo views, back/forward state, h1 focus, title updates, and route announcement.
- Added native first-run **Load sample repair book**. It remains in memory until **Keep this repair book**; **Start for real** discards it.
- Added four real desktop UI walkthrough captures under `public/assets/` and recorded their provenance in the design thesis.
- Rewrote first-screen, FAQ, privacy, legal, README, and install copy around actual behavior. The catalog line is in `.factory/catalog-description.txt`.
- Repaired service-worker 404 status handling, installer-code keyboard access, mobile demo banner layout, production-vault claim coverage, PowerShell installer behavior coverage, release-artifact fixture coverage, and request-privacy coverage.
- Expanded `.factory/claims.json` to 28 registered, executable claims.

## Verification

Executed in this clean checkout after `npm ci` and after installing the exact Tauri Linux packages declared in `.github/workflows/release.yml`:

- `npm test` — passed: 16 Vitest tests and 32 Playwright tests (including mobile Axe serious/critical checks, offline demo, service-worker 404, routing/focus, and privacy request capture).
- Every one of the 28 commands listed in `.factory/claims.json` — passed individually. The PowerShell claim was run with PowerShell 7.5.1 in this container and exercised both matching and mismatching downloads.
- `npm run typecheck`, `npm run lint`, `npm run build` — passed. Build emits `dist/app/` and `dist/site/`.
- `cargo test --manifest-path src-tauri/Cargo.toml` — passed: 4 Rust tests.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo check --manifest-path src-tauri/Cargo.toml` — passed.

Static production sizes remain inside budget: landing JS 1.52 KB gzip, demo JS 9.34 KB gzip, landing CSS 3.07 KB gzip, demo CSS 3.84 KB gzip. The lazy walkthrough images are not first-screen assets.

## Deployment and live check

Commit and deployment evidence are appended after push and cold live verification. The repo has no local deploy script; the static work-order deployment is triggered from the pushed `main` branch.

## Known gaps / operator action

No product defects are intentionally deferred. Desktop releases remain unsigned by design and the download site discloses the required operating-system confirmation. Signing would require operator-provided Apple and Windows certificates; no signing secrets are configured.
