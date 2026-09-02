# Verification 15 handoff — PASS

Independent QA passed candidate
`eb5106cdd9a3012fb90f90127ef1d2ee6182fdc2` at
<https://dictation-repair-book.sociobot.in> on 2026-09-02 UTC.

## What was verified

- All 34 `.factory/claims.json` commands passed when run separately before the
  broader QA.
- The cold first screen plainly says what the product does, who it serves, and
  presents **Try it with sample data** as a one-click isolated demo.
- `npm ci`, `npm test`, typecheck, lint, the exact production build, Rust check,
  Rust formatting, native-portability check, and the real PowerShell installer
  tests passed.
- The live product passed desktop and 390 px mobile flows, keyboard and focus
  checks, light/dark contrast checks, reduced motion, serious/critical Axe,
  console/page-error checks, malformed-input recovery, export/import, offline
  reload, service-worker update, privacy request logging, and security-header
  inspection.
- Fresh mobile Lighthouse scored 100 in Performance, Accessibility, Best
  Practices, and SEO. LCP was 1,096 ms, TBT 8 ms, and CLS 0.
- All 36 live deployable files match the candidate production build exactly.
  Candidate changes after release tag `v0.1.12` affect only `.factory/` files.
- GitHub release v0.1.12 has all six required installers and three metadata
  files. A fresh Linux DEB matched `SHA256SUMS`, declared its runtime
  dependencies, launched under Xvfb, and loaded the native sample repair book.
- The Sociobot license verification endpoint allowed 30 requests from one
  client; request 31 returned 429 with `Retry-After: 4`.

## Defects

- **Low — DRB-QA-15-01:** the demo Settings view has horizontal page overflow
  between 621 and about 725 CSS px because its two-column layout resumes above
  the 620 px phone breakpoint. At 640 px, `scrollWidth` is 726 px. The required
  390 px mobile and desktop layouts pass and all content remains reachable.
- No critical, high, or medium defects.

## Evidence and rerun

The complete report is `.factory/verification-15.md`. Fresh screenshots and
machine-readable results are in `.factory/verification-artifacts-15/`.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in .factory/verification-artifacts-15/live
```

`npm run test:installer-windows` also passed with a temporary PowerShell 7.5.2
runtime because `pwsh` was not included in the base QA image.

## Next step

Adjust the Settings responsive breakpoint or shrink its columns so the narrow
621–725 px range does not require horizontal scrolling. No deployment or
operator action is required for this PASS.
