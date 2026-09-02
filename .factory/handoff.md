# Polish round 4 retry 1 handoff — PASS

## Shipped

- Made `npm test` portable on Linux by moving real PowerShell execution to `npm run test:installer-windows`.
- Kept checksum coverage intact. The portable test checks the shipped checksum-before-launch control flow and both Windows CI call sites. Windows executes the shipped `install.ps1` with matching, mismatching, and missing checksums.
- Added push, pull-request, and manual quality CI with a Linux product suite and a Windows installer job. The release workflow runs the same Windows fixture.
- Retained every review 1–4 repair, including one-click isolated sample data, demo reset/exit, native sample isolation, real routes and titles, Back/Forward focus, the designed 404, legal links, mobile layout, privacy, offline use, and accessible controls.
- Updated the catalog line to a 79-character verb-first description and published version 0.1.11.

## Verification

- Product/release commit: `e3fa407cc2be1bfa4521be618a8130f730c89db0`.
- Fresh clone: all 34 claim commands passed separately. `npm test` passed 27 Vitest tests, the portable installer contract, four Rust tests, and 46 Playwright tests.
- Fresh clone: `npm run typecheck`, `npm run lint`, `npm run build`, `cargo check --no-default-features`, and `cargo fmt --check` passed.
- Build output: `dist/app/index.html` and `dist/site/index.html`; initial landing JavaScript is 1.88 KB gzip and CSS is 3.23 KB gzip.
- Cross-platform quality: [run 33577027016](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33577027016) passed Linux and Windows. The Windows log ends with “PowerShell installer checksum match, mismatch, and missing-checksum paths passed.”
- Desktop release: [run 33577561255](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33577561255) passed macOS arm64, macOS x64, Windows x64, Linux x64, and release publication.
- Release: [v0.1.11](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.11) contains two DMGs, MSI, EXE, AppImage, DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`. The Linux DEB checksum passed and its metadata is version 0.1.11, amd64.
- Static deployment: Azure deployment `4b4d461c-0799-4578-a888-95c49b8d182c` at <https://dictation-repair-book.sociobot.in>.
- Cold live check: `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; the designed missing route returns 404. Titles, `lang=en`, one h1, main landmark, alt text, console, Axe, mobile overflow, 44 px controls, reduced motion, offline routes, and demo egress pass.
- History regression: Back restores `/demo/?demo=1`, **Approved rules**, h1 focus, and its announcement. Forward restores Test in the same way.
- Deployment identity: all 36 served build files match `dist/site` by SHA-256. The live `install.ps1` hash matches the shipped source.
- Download path: a cold Linux visit resolves the platform action to the v0.1.11 AppImage and shows “v0.1.11 · checksum published · unsigned build” without a console error.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms.
- Evidence and screenshots: `.factory/qa-evidence/polish-4-retry1/live/`.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

Run the executable Windows installer fixture on Windows:

```powershell
npm run test:installer-windows
```

## Known gaps and operator action

No review finding or product-scope gap remains. Desktop packages are intentionally unsigned and the site discloses this. Signing later requires operator-owned Apple and Windows certificates; the current workflow expects no signing secrets. No operator action is required for this release.
