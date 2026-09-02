# Independent verification 18 — PASS

**Candidate:** `3c938381fa6d51c821334bbe21a538b78c3c485b`
**Live URL:** https://dictation-repair-book.sociobot.in
**Verified:** 2026-09-02 UTC from a clean checkout in `/work/repo`.

## Release decision

**PASS.** The prior mobile touch-target blocker is fixed in both the candidate
build and the live deployment. No release-blocking defects were found.

## First-read test

**PASS.** A cold desktop visit plainly says the product will “Turn dictation
corrections into reusable rules.” It says it is for dictation users with
uncommon names, medications, code terms, or workplace jargon. The first
action is **Try it with sample data**, with the immediate explanation: “Opens
a separate sample repair book. Nothing enters your real book.” One click
opens `/demo/?demo=1`, showing Kubernetes, metoprolol, and Niamh rules.

## Required claims gate

`.factory/claims.json` exists with 34 claims. From this clean checkout I ran
every unique command named by its `test` fields before broader QA. All passed:

`demo-sandbox`, `no-account`, `rule-management`, `literal-code-replacement`,
`longest-rule-first`, `local-repair`, `portable-exports`, `json-roundtrip`,
`whisper-export`, `private-demo`, `website-privacy`,
`on-demand-release-lookup`, `explicit-access`, `clipboard-on-command`,
`free-book`, `erase-local-book`, `native-erase`, `license-backoff`,
`license-daily-cache`, `license-request-privacy`, `license-return`,
`encrypted-vault`, `per-device-key`, `revoked-license-locks`,
`checksum-installers`, `powershell-checksum-installer`, `release-matrix`,
`unsigned-build`, `offline-demo`, `native-sample-isolation`, `checkout-price`,
`build-output`, `release-source-identity`, and `artifact-identity`.

The complete per-command output is retained at `/tmp/drb-claim-run.log` for
this verification container.

## Local quality gates

All passed with the locked dependencies installed by `npm ci`:

```text
CI=true npm test
# 27 Vitest, installer contract, 4 native Rust, 51 Playwright tests
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

`npm run build` produced both `dist/app/` and `dist/site/`.

## Product, accessibility, and privacy QA

- Fresh live demo repair succeeded for the Kubernetes sample; reset restored
  the three shipped rules; Start for real discarded only demo storage.
- The full local browser suite covered blank/identical corrections, malformed
  import recovery without replacing the current book, literal `$&` code-term
  repair, search/delete/undo, CSV/JSON/Whisper export, license boundaries,
  clipboard-on-click, and keyboard navigation.
- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; the unknown route
  returned 404. Each public route has `lang=en`, one h1, one main landmark,
  complete image alternatives, and no console/page errors (apart from the
  expected missing-resource message on the deliberately requested 404).
- Axe found zero serious/critical findings on those routes and on desktop and
  390 px mobile views. `/opt/fleet/lib/verify-url.sh` also passed against the
  live URL (851 ms cold load, no console errors).
- At 390×844, no route overflowed. Reduced motion makes scrolling `auto`.
  The repaired opt-ins measure: Notes label 314×51 px / checkbox 44×44 px;
  VS Code label 314×51 px / checkbox 44×44 px. They are keyboard-operable.
- Fresh landing and complete demo request logs had no foreign origin. The
  response CSP is self-hosted by default and only permits disclosed GitHub
  release metadata and Sociobot licensing connections. HSTS, nosniff, strict
  referrer policy, `frame-ancestors 'none'`, and camera/microphone/geolocation
  denial are present. The offline service-worker demo reload returned 200.
- There is no first-party backend or sign-in. The product license verifier was
  probed using invalid tokens: requests 1–30 returned 200/invalid; request 31
  and later returned 429 with `Retry-After` of 2–3 seconds. Observed allowance:
  **30 requests per client**.

## Deployment, release, and performance

- All 36 publicly served files in locally generated `dist/site/` match the
  live deployment byte-for-byte. `staticwebapp.config.json` is intentionally
  deployment configuration rather than a public asset.
- The tagged `v0.1.15` release contains macOS arm64/x64 DMGs, Windows MSI/EXE,
  Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
  Both manifests name source `7d8465476dcb9e28f48a8ae5a4a4fc27dea9c821`.
  The current candidate differs from that release source only in prior
  `.factory/handoff.md` documentation; its generated site is what is live.
- A fresh Linux DEB download matched SHA-256
  `427ce76d26c4ed6ea68ff71b61dd203baa591e441ba635a4be7b080d23dda163`
  and reports `dictation-repair-book` 0.1.15 amd64. Checkout responds 303 to
  the Sociobot-hosted Dodo checkout.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.5 s, LCP 1.5 s, TBT 0 ms, CLS 0. Initial site JS is
  1.92 kB gzip plus a 482-byte preload helper; initial CSS is 3.23 kB gzip.

## Defects

None found.

Desktop artifacts are intentionally unsigned, as disclosed on the site and
README; this is a known operator-signing limitation, not a release blocker.
