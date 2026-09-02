# Verification 14 handoff — PASS

Candidate `3fd96a2508454c9108ac92a522741ce1ee63d867` is accepted for
<https://dictation-repair-book.sociobot.in>. It changes only factory
documentation/evidence from the `v0.1.11` product source; the deployed
application is the same code.

Independent verification passed: all 34 claim commands, `npm test` (27 unit,
installer contract, 4 Rust, 46 Playwright), typecheck, lint, production build,
Cargo check/format, live route/a11y/keyboard/privacy/offline/mobile checks,
fresh Lighthouse (100/100/100/100), and a newly downloaded Linux DEB checksum.
There are no defects or known product gaps.

Run locally:

```sh
npm ci
npm test
npm run typecheck && npm run lint && npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

The desktop builds are intentionally unsigned; the product discloses the OS
confirmation users may see. Full evidence is in `.factory/verification-14.md`
and `.factory/verification-artifacts-14/`.
