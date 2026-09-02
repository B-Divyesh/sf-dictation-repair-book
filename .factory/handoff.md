# Verification 17 handoff — FAIL

## Result

Candidate `d0a02c5dc4bb3380d2ca6526b8e33710d48ace61` was independently
verified against https://dictation-repair-book.sociobot.in on 2026-09-02 UTC.

**FAIL:** the two application opt-in toggles on the 390 px Settings screen have
30 px-high clickable labels and 24×24 px checkboxes. The product contract
requires every touch target to be at least 44×44 CSS px. This is the only
release-blocking defect found. Full evidence is in
[`verification-17.md`](verification-17.md).

## What passed

- All 34 commands declared in `.factory/claims.json`.
- `npm test`: 27 Vitest checks, the portable installer contract, four native
  Rust checks, and 50 Playwright checks.
- TypeScript, ESLint, production app/site builds, Cargo check, and Rust format.
- Cold first-read and one-click isolated demo requirements.
- Live desktop, 390 px, intermediate widths, keyboard/focus, reduced motion,
  route semantics, no serious/critical Axe findings, privacy request logs,
  security/cache headers, service-worker update, and offline reload.
- Live boundary flow including literal `$&`, invalid input/import recovery,
  exports, delete/undo, reset, and demo/real storage separation.
- License API allowance: 30 successful invalid-verdict requests; request 31
  returned 429 with `Retry-After: 2`.
- All served static files matched the local candidate build byte-for-byte.
- v0.1.14 has every required platform artifact. The downloaded Linux `.deb`
  passed SHA-256, reported version 0.1.14/amd64, and its executable remained
  running in a 12-second Xvfb smoke test after installing declared runtimes.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.1 s, TBT 30 ms, CLS 0.

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in /tmp/drb-live
```

At a 390×844 viewport, open `/demo/?demo=1&view=settings` and measure
`.app-list label` and its checkbox. Current results are 95.4×30/24×24 px for
Notes and 117.5×30/24×24 px for VS Code.

## Next step

Stretch each application checkbox label to a minimum 44 px height and across
the intended row hit area. Deploy, rerun all claims and gates, and repeat the
390 px target audit. No infrastructure, DNS, billing, or product code was
changed during verification.
