# Independent QA handoff — FAIL

## Result

**FAIL — do not release candidate `7d1fce55e5210354e57352d7b5b99aaa2f109f1b`.**

Fresh verification on 2026-08-29 covered the live deployment at https://dictation-repair-book.sociobot.in and the tagged `v0.1.1` desktop release. The live static files and release tag match the candidate. All declared claim commands and repository quality gates pass, but independent product paths expose release-blocking claim-integrity, data-recovery, correctness, privacy/deletion, demo-lifecycle, and mobile defects.

The authoritative evidence and severity list are in [`.factory/verification-2.md`](verification-2.md).

## Highest-priority defects

1. Malformed-but-partially-shaped JSON is persisted, throws page errors, and leaves the app blank after reload.
2. A code-term rule whose intended text is `$&` reports success but leaves the original phrase unchanged.
3. `Erase all local data` leaves the stored license token and cached verdict.
4. Demo changes survive `Start for real`; the sandbox does not discard them as required.
5. Removing a source makes visible rules say `Any approved app`, but CSV exposes the internal source ID, contradicting the portable-export claim.
6. The demo Rules screen is 474 px wide at a 390 px viewport; Settings is 398 px wide, and several touch targets are under 44 px.
7. Visitor claims remain outside `.factory/claims.json`, including native deletion, Whisper import/export, checksum installer behavior, and several privacy promises.

## Verification summary

- `npm ci`: pass, 0 vulnerabilities.
- Every `.factory/claims.json` command: pass after installing the Linux prerequisites used by the release workflow.
- `npm test`: pass, 6 unit + 14 Playwright tests.
- `npm run typecheck`: pass. No lint script exists.
- `npm run build`: pass; both `dist/app/` and `dist/site/` emitted.
- Full native `cargo test`, `cargo fmt --check`, and `cargo check`: pass.
- Lighthouse mobile: 100/100/100/100; LCP 1.1 s, TBT 30 ms, CLS 0.
- Live Axe: zero serious/critical issues across landing, demo, privacy, terms, and 404; dark/reduced-motion demo also clean.
- Billing verification allowance: 30 requests; request 31 returned 429 with `Retry-After: 3`.
- Fresh Linux DEB checksum matched; the extracted released app stayed running for a 10-second headless smoke.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run build
sudo apt-get install -y libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev patchelf
cargo test --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml
```

Screenshots, Lighthouse JSON, and the URL verifier output are under `.factory/qa-evidence/`.

## Scope and known limits

No product code was modified. Native UI automation was limited by the headless Linux environment; the published binary/package smoke, Rust crypto test, and shared browser UI were exercised. Signing still requires the operator credentials documented by the builder. No infrastructure, DNS, billing configuration, or payment-provider state was changed.
