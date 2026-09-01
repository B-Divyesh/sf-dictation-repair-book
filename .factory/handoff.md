# Repair 11 handoff — deterministic native guard and exact release identity

**Verifier report repaired:** `d94792dad4c166310785a93cdf53c27a2ab8d022`

**Repaired source candidate:** `7981b50c25e1ec2e1d77836a4b3497351c956a87`

**Published desktop release:** [`v0.1.9`](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.9)

**Static deployment:** https://dictation-repair-book.sociobot.in/

## Release-blocking repairs

1. The original portable-native unit test synchronously ran `cargo tree`.
   Cargo can refresh or resolve its registry on a cold worker, making the
   otherwise static feature-topology assertion exceed Vitest's five-second
   timeout.
2. Reproduced the verifier's exact failure against the original source in an
   isolated checkout: a seven-second Cargo-tree response produced `Test timed
   out in 5000ms` and a 7.60-second Vitest run. Evidence:
   `.factory/qa-evidence/repair-11-live/native-portability-before.log`.
3. Added `scripts/verify-native-portability.mjs`. It checks the native feature
   topology directly from the manifest, build guard, and claims contract. It
   has no Cargo invocation and therefore no registry or GUI-package dependency.
4. Replaced the timing-sensitive Vitest body with that policy check plus a
   sub-one-second regression bound. With the same delayed `cargo` executable
   on `PATH`, the repaired test passes in 63 ms (670 ms including Vitest
   startup). Evidence:
   `.factory/qa-evidence/repair-11-live/native-portability-after.log`.
   The real no-GUI Rust privacy tests remain in `npm test` and continue to run
   with `cargo test --no-default-features`.
5. Bumped the application, Cargo, Tauri, landing, and release defaults to
   0.1.9. The demo footer now uses the build tag rather than a stale literal.

## Clean verification

Completed on 2026-09-01 from this repaired source:

- `npm ci`: 168 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm test`: 27 Vitest checks, the installer checksum contract, four no-GUI
  native Rust checks, and 45/45 Playwright checks passed.
- `npm run typecheck`, `npm run lint`, `npm run build`, and
  `cargo fmt --manifest-path src-tauri/Cargo.toml --check` passed.
- `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`
  passed. The full desktop package compilation is exercised by the successful
  GitHub release matrix on Linux, Windows, and both macOS targets.
- Production output is present at `dist/app/` and `dist/site/`. Largest app
  JavaScript is 10.02 KB gzip; landing JavaScript is 1.88 KB gzip plus a
  0.44 KB preload helper; landing CSS is 3.23 KB gzip.
- Browser coverage includes desktop, 390 px mobile, keyboard, 44 px targets,
  reduced motion, dark mode, skip-link focus, Axe serious/critical scans,
  demo isolation, same-origin privacy, service-worker offline reload, and
  404 behavior.

## Publication, package, and identity evidence

- Tag `v0.1.9` resolves to exactly
  `7981b50c25e1ec2e1d77836a4b3497351c956a87`; the release source guard
  printed the same full commit before every platform build.
- GitHub Actions run
  [`33562313973`](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33562313973)
  completed successfully. The macOS arm64/x64, Windows x64, and Linux x64
  jobs each passed the packaged-webview identity check. The publish job passed
  artifact provenance and checksum verification before creating the release.
- The public release has all six desktop bundles plus `SHA256SUMS`,
  `latest.json`, and `build-info.json`. Both identity manifests say
  `v0.1.9` and the exact repaired commit.
- Downloaded public Linux DEB SHA-256:
  `b08d47302f9782b5f4980449ef8c869a14f8e59bd381455f8b8d307b4f2e7210`;
  it matches the public `SHA256SUMS`. Its package metadata says version 0.1.9,
  architecture amd64, and the expected GTK/WebKit/application-indicator
  runtime dependencies.
- After installing only those declared runtime dependencies in this disposable
  verifier, the extracted published app started in isolated XDG data. Its
  first-run footer visibly reported `v0.1.9 · 7981b50c25e1`, the exact
  12-character prefix of the release-manifest commit. No vault files were
  created before a real repair book was started. Screenshot:
  `.factory/qa-evidence/repair-11-live/release-v0.1.9/published-native-first-run.png`.
- The live download resolver makes zero GitHub API calls before user intent,
  then makes one call and links to the real v0.1.9 Linux AppImage with no
  browser errors. Evidence:
  `.factory/qa-evidence/repair-11-live/release-lookup.json`.

## Live deployment verification

- Deployed only `sf-dictation-repair-book`; deployment ID
  `2cc21df9-58b2-44c9-a700-172109db73ad`.
- All 36 public files in the fresh `dist/site/` match the live deployment
  byte-for-byte by SHA-256. Evidence:
  `.factory/qa-evidence/repair-11-live/deployment-byte-compare.tsv`.
- `/opt/fleet/lib/verify-url.sh` passed: HTTPS 200, route title, `lang=en`,
  one `h1`, `main`, complete image alt text, labelled buttons, and no console
  errors. Evidence:
  `.factory/qa-evidence/repair-11-live/verify-url/`.
- Live browser test: the demo changed “Deploy the cube or net ease service.”
  into “Deploy the Kubernetes service.”; requests stayed on the product
  origin; landing and demo Axe scans had zero serious/critical findings;
  keyboard skip navigation focused `main`; 390 px dark/reduced-motion mode had
  no overflow or active animations; offline demo navigation returned 200.
  Evidence: `.factory/qa-evidence/repair-11-live/browser-summary.json`.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.056 s and CLS 0. Evidence:
  `.factory/qa-evidence/repair-11-live/lighthouse-mobile.json`.

## Known gap and operator action

The builds are intentionally unsigned. macOS notarization and Windows
Authenticode require owner-managed `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`
GitHub secrets. No signing secret is stored in this repository.
