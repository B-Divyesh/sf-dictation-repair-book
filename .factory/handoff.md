# Repair handoff — Dictation Repair Book v0.1.1

## Result

This repair resolves every repository-controlled finding in independent verification report `0385ce8b7279b01ad49daaf85298c128fb0e89ab` for candidate `e3540ff869c27b2cb40e917347346a9a7b7519f7`.

- Added a real one-click `/demo/` with three shipped correction rules, a persistent Demo banner, Reset demo, Start for real, and a separate `demo:drb_web_preview_state` namespace. It never reads or writes the normal browser preview key or native vault.
- Added `.factory/claims.json`, eight exact claim tests, `.factory/demo.md`, and `.factory/copy-audit.md`.
- Removed the two keyboard-inaccessible horizontal installer-code scroll regions by wrapping commands instead. Landing and demo Axe checks now have no serious or critical violations.
- Added deployment CSP, real `404.html`, and Static Web Apps 404 response override; removed the landing-page navigation fallback that returned arbitrary paths with `200`.
- CSV now exports the user-visible source application name instead of an internal UUID.
- License verification honors `429 Retry-After`, prevents a retry during the wait, and no longer optimistically activates a manually pasted, unverified token.
- Bumped desktop/package metadata to `0.1.1` so the release tag can identify this repair commit.

The verifier's external billing-gateway burst was reproduced on 2026-08-29: 30 requests returned `200`, request 31 returned `429` with `Retry-After: 3` and `X-RateLimit-After: 3`. The upstream endpoint is now rate limited; the client regression test covers compliant handling.

## How verified

Executed from a clean dependency install on 2026-08-29:

```sh
npm ci
npm test
npm run typecheck
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml
```

Results:

- `npm test`: 6 Vitest tests and 14 Chromium Playwright tests passed. The browser suite covers desktop, 390 px, keyboard skip-link focus, landing/demo Axe, isolated demo reset, local repair, CSV/JSON exports, CSV source names, privacy request boundary, 25-rule free limit, erase confirmation, and retry-after backoff.
- `npm run typecheck`: passed.
- `npm run build`: passed. `dist/app/` and `dist/site/` are emitted. Initial landing JavaScript is 1.43 KB gzip, landing CSS is 2.96 KB gzip, demo JavaScript is 8.19 KB gzip, and demo CSS is 3.63 KB gzip.
- Native: the AES-256-GCM regression test passed; `cargo fmt --check` and `cargo check` passed after installing the same Linux WebKit/GTK prerequisites declared in the release workflow.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4174/ <evidence-dir>` passed: HTTP 200, title, `lang=en`, one h1, main landmark, image alt coverage, and zero page/console errors (592 ms local load).
- The standalone `@axe-core/cli` could not start Chrome in this container. The supported Playwright Axe integration ran instead and passed with zero serious/critical violations on landing and demo.

## Release and deployment

- Static deployment root remains `dist/site/`; deployment class remains `static`.
- Committed and pushed repair `7d1fce55e5210354e57352d7b5b99aaa2f109f1b`; pushed annotated tag `v0.1.1` (`d739305c7762d193d768bc3e320ed56345a5b26d`). GitHub Actions release run `33257799963` was started from that commit to build the signed-status-unchanged desktop matrix (two macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB), checksums, and `latest.json`.
- Deployed `dist/site/` with `/opt/fleet/lib/deploy-static.sh dictation-repair-book /work/repo/dist/site`. Post-deploy verification at `https://dictation-repair-book.sociobot.in` passed: 200, zero console errors, title/lang/one h1/main/alt checks, 390 px width `390/390`, keyboard skip focus moved to `#main`, landing and demo Axe serious/critical count `0`, offline reload retained the title, and `/does-not-exist` returned 404. The live CSP header contains the configured `default-src 'self'` policy.

## Known boundaries / operator action

- Desktop binaries are intentionally unsigned until signing credentials are supplied. Expected future secrets remain `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`.
- This app has no automatic updater. `v0.1.1` provides the repaired traceable artifact release, not an updater manifest.
- Billing registration and the gateway rate limiter are operated by Sociobot. The product does not embed a payment-provider secret or any Azure key.
