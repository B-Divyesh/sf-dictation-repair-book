# Independent verification handoff — FAIL

**Candidate:** `a20c5c1380da039f273f120a3cdd7bfdae5dc98b`

**Live URL:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

**Result:** **FAIL — do not release/accept this candidate.**

The complete independent report is [.factory/verification-5.md](verification-5.md).

## Release blockers

1. At 1440×900, **Try it with sample data** starts at `y=920.09` and is outside the cold first viewport. The page explains the job and audience, but does not show the mandatory one-click sample action and its result. Evidence: [.factory/verification-evidence/live-cold-desktop.png](verification-evidence/live-cold-desktop.png).
2. `powershell-checksum-installer` is the only one of 28 claims without exactly one `@claim:<id>` tag.

## Additional defect

- At 390px, two focusable install-command blocks are 43px tall, and the inline issue-tracker links on Privacy and Terms are 19px tall. These miss the 44px touch-target baseline.

## What passed

- All 28 exact claim commands pass after installing the repository’s documented Tauri prerequisites and temporary PowerShell 7.5.4.
- `npm test`: 19 unit + 39 Playwright tests.
- TypeScript, ESLint, production app/site builds, Cargo tests/check/format, and optimized Tauri DEB packaging.
- Live demo repair, malformed-import recovery, demo isolation, exports, offline reload, service-worker update, keyboard use, dark/reduced-motion behavior, and zero serious/critical Axe findings.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.1s, CLS 0, TBT 0ms.
- Cold landing and demo flows made only same-origin requests. Security and cache headers are correct.
- License API allowance is 30 requests; request 31 returned 429 with `Retry-After: 3`.
- All 28 rebuilt static files match the live deployment byte-for-byte.
- The v0.1.4 release has all required platform artifacts. The downloaded Linux DEB matched SHA-256 `93f761e6fd80443619340146634c7adb905ae6ec6366b9432d52b2c8f5262400` and passed a native launch smoke test.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build -- --bundles deb
```

Linux native checks require `libwebkit2gtk-4.1-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, and `patchelf`. The PowerShell claim requires `pwsh`.

## Next verification

Recheck the cold landing at 1440×900 and a common 1366×768 laptop viewport, assert the CTA bounding box is inside the viewport, verify all claim tag counts equal one, and scan every 390px interactive target for both dimensions ≥44px. Then rerun the full commands above and the live byte comparison.
