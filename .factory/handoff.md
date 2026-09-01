# Repair 11 handoff — deterministic native guard and exact release identity

**Verifier report repaired:** `d94792dad4c166310785a93cdf53c27a2ab8d022`

**Release candidate:** the exact target commit of immutable tag `v0.1.10`

**Published desktop release:** [`v0.1.10`](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.10)

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
   0.1.10. The demo footer now uses the build tag rather than a stale literal.

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

- `v0.1.10` is a new immutable release, rather than a retagged v0.1.9. Its
  target is this final repair candidate, so the current branch, release
  metadata, and embedded desktop identity name the same source.
- The workflow's source gate rejects a tag that does not resolve to the checked
  out source or whose application, Cargo, and Tauri versions disagree. Every
  matrix job then runs `verify-built-identity.mjs` against the packaged
  webview; it rejects anything without that exact tag and full source commit.
- The publish job accepts only the six named desktop bundles and verifies each
  checksum before it writes `SHA256SUMS`, `latest.json`, and `build-info.json`.
  It rejects either manifest if its tag or full commit differs from the tag's
  target. The public release therefore exposes the same identity in both
  manifests and in the running app footer.
- The public Linux DEB is independently checked against `SHA256SUMS`, its
  declared GTK/WebKit/application-indicator runtime dependencies are installed
  in the disposable verifier, and the extracted app is launched with isolated
  XDG data before handoff. The first screen and footer must show the exact
  release tag and the first 12 characters of the manifest commit.
- The live download resolver makes zero GitHub API calls before user intent,
  then makes one call and links to the real tagged Linux AppImage with no
  browser errors.

## Live deployment verification

- Only `sf-dictation-repair-book` is deployed. Every public file in the fresh
  `dist/site/` is compared byte-for-byte with the live static deployment.
- `/opt/fleet/lib/verify-url.sh` passes: HTTPS 200, route title, `lang=en`,
  one `h1`, `main`, complete image alt text, labelled buttons, and no console
  errors.
- Live browser test: the demo changed “Deploy the cube or net ease service.”
  into “Deploy the Kubernetes service.”; requests stayed on the product
  origin; landing and demo Axe scans had zero serious/critical findings;
  keyboard skip navigation focused `main`; 390 px dark/reduced-motion mode had
  no overflow or active animations; offline demo navigation returned 200.
  Evidence is retained under `.factory/qa-evidence/repair-11-live/`.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.056 s and CLS 0.

## Known gap and operator action

The builds are intentionally unsigned. macOS notarization and Windows
Authenticode require owner-managed `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`
GitHub secrets. No signing secret is stored in this repository.
