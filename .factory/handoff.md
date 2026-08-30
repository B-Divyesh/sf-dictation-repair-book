# Polish round 2 handoff

## Completed repair

This repair closes every finding in `.factory/review-1.md` and `.factory/review-2.md`. The detailed finding-to-evidence mapping is in `.factory/polish-2.md`.

- Aligned all public and app purchase copy to the verified `$12` one-time checkout price, with a read-only checkout claim test and recorded session fixture for checkout-service outages.
- Isolated native sample mode from the encrypted vault and real license storage. Its purchase controls are unavailable and its erase action resets only sample data.
- Normalized valid slashless site routes in the service worker, added the missing mobile first-screen facts, and gave demo the shared header/footer and full navigation.
- Rewrote the reviewed copy, terminology, sample application labels, legal footer wording, README release instructions, and catalog sentence. Refreshed all four walkthrough captures from the repaired UI.
- Added the build-output and release-source claims plus exact test coverage; the claim inventory now has 33 entries with one tagged test each.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo test --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
pwsh -NoLogo -NoProfile -File tests/installers.ps1
```

The local verification completed on 2026-08-30:

- `npm test`: 24 Vitest tests and 44 Playwright tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed. Build output contains `dist/app/index.html` and `dist/site/index.html`; initial app JavaScript is 9.87 KB gzip and site demo JavaScript is 9.63 KB gzip.
- Rust formatting, 4 Rust tests, Rust type check, and PowerShell checksum match/mismatch paths passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/qa-evidence/polish-2-local` passed with no console errors, one title, `lang=en`, one `h1`, `main`, and no missing image alt text.
- Playwright Axe checks found no serious or critical violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/not-found`; see `.factory/qa-evidence/polish-2-local/axe-playwright.json`. Desktop and 390 px captures are in the same directory.

## Demo and privacy

- Direct demo URL: `https://dictation-repair-book.sociobot.in/demo/?demo=1`.
- The shipped sample uses Notes and VS Code. Browser demo storage is `demo:drb_web_preview_state`; native sample state is in memory only. Reset restores the sample, and Start for real discards it. See `.factory/demo.md`.
- The app has no telemetry. The static site calls GitHub only after an explicit download choice; the desktop app calls Sociobot only when the visitor explicitly verifies a pasted license.

## Deployment and live verification

Deploy `dist/site/` through `/opt/fleet/lib/deploy-static.sh dictation-repair-book dist/site`, then run the live cold-route and demo checks documented in the final section of this handoff. The exact deployment URL, commit, and live evidence are appended after deployment.

## Operator action

Desktop release artifacts remain unsigned by design. A future signed release needs the owner’s `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub Action secrets. No other operator action is required for this static repair.
