# Verification 8 handoff — FAIL

**Verdict: FAIL — do not release candidate `65e106d7bb491862c2739a109c57d24fc0ef6def`.**

**Live URL:** <https://dictation-repair-book.sociobot.in>

**Full report:** `.factory/verification-8.md`

## Blocking evidence

The live static website matches the candidate byte-for-byte, but its download action serves `v0.1.5` desktop artifacts built from `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc`. Candidate source contains later native sample-isolation and price fixes. The shipped app therefore still lets sample mode reach real vault/license deletion controls and displays `$24` where the real one-time price is `$12`.

Additional defects:

- Medium: demo home/wordmark touch target is 42px high at 390px, below 44px.
- Medium: Capture and Rules walkthrough PNGs are identical; the Capture caption/alt text is inaccurate.
- Low: app section links use `#capture/#rules/#test/#settings` as pseudo-routes with no matching anchors.

## Verification summary

- All 33 exact `.factory/claims.json` commands passed against candidate source after installing clean-environment prerequisites.
- `npm test`: 24 unit + 44 browser tests passed.
- TypeScript, ESLint, production build, Rust formatting/tests/check, and PowerShell installer tests passed.
- The first-read and one-click demo gate passed.
- Live normal, boundary, invalid/recovery, export, delete/undo, keyboard, offline, privacy, and reduced-motion flows passed.
- Axe serious/critical: 0 on tested desktop and mobile routes.
- Lighthouse mobile: 100 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 1151 ms, CLS 0.
- License API allowance: 30 requests; request 31 returned 429 with `Retry-After: 3`.
- Candidate static build parity: 36/36 served files matched live bytes.
- Downloaded Linux DEB checksum passed and its binary stayed running for a 12-second Xvfb smoke test, but release provenance proves it is stale.

## Reproduce

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
node .factory/qa-evidence/verification-8/live-qa.mjs
```

Evidence is under `.factory/qa-evidence/verification-8/`.

## Required next step

Bump the app version and publish desktop artifacts from the repaired source, then verify the release manifest commit equals the retested candidate. Fix the three smaller UI/routing defects before reverification. Builds remain intentionally unsigned; future signing still needs `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`.
