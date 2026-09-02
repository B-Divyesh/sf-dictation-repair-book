# Repair 12 handoff — PASS

## Result

The release-blocking finding in
[`verification-16.md`](verification-16.md) is repaired and deployed.

- Repair commit: `90295dc8f2eaaa6e9cdfc50080e53ae025a31f09`
  (`fix: make Windows installer claim portable`).
- Quality gates: [run 33594030338](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33594030338)
  passed on Linux and Windows.
- Published desktop release: [v0.1.14](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.14),
  built from that exact commit. Its all-platform release workflow is
  [run 33594217175](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33594217175).
- Static deployment: `5723f32f-cb7f-463e-aa53-c5829fbce43c` to
  https://dictation-repair-book.sociobot.in.

## Reproduction and repair

The required original command was reproduced first in the standard Linux
verifier:

```text
$ npm run test:installer-windows
sh: 1: pwsh: not found
exit 127
```

The claim now uses the cross-platform command
`npm run test:installer-windows-portable`, registered in
`.factory/claims.json`. It executes Node fixtures for matching, mismatching,
and missing checksum manifests. The mismatch fixture proves that the temporary
MSI is removed and that no MSI launch occurs; the matching fixture proves the
verified MSI launch contract.

The same test binds that exercised behavior to the shipped `public/install.ps1`
commands and their order: package download, `SHA256SUMS` download, checksum
selection, SHA-256 comparison, mismatch removal, then `msiexec.exe` launch.
The direct PowerShell test remains `npm run test:installer-windows`, and both
the Windows quality job and Windows release matrix run it. The Windows quality
job passed both the portable contract and the actual PowerShell fixture.

The desktop version is `0.1.14` in package, Cargo, Tauri, app identity, site,
and regression expectations so packaged installers carry this repair's source
identity.

## Verification

From a clean `npm ci` install on the final source:

- All 34 claim commands in `.factory/claims.json` passed independently.
- `npm test` passed: 27 Vitest checks, portable installer contract, four
  GUI-free native Rust checks, and 50 Playwright checks.
- `npm run typecheck`, `npm run lint`, `npm run build`,
  `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`, and
  `cargo fmt --manifest-path src-tauri/Cargo.toml --check` passed.
- `npm run build` produced `dist/app/` and `dist/site/`. Production initial
  site JavaScript is 1.90 kB gzip plus a 0.44 kB preload helper; CSS is 3.23
  kB gzip.
- The factory URL checker passed locally and live. The Playwright Axe
  integration checked desktop and 390px views with no serious or critical
  issues; the suite also covers keyboard focus, privacy request capture,
  service-worker update, offline demo/404 reloads, reduced motion, and all
  621–800px intermediate app views.
- Live `/`, `/demo/`, `/privacy/`, and `/terms/` return 200 with one h1,
  `lang=en`, a main landmark, no missing alternatives, and no console errors;
  the tested missing route returns a styled 404. Live response headers include
  CSP, HSTS, `nosniff`, strict referrer policy, and a camera/microphone/
  geolocation-denying Permissions Policy.
- The release contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux
  AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`. Downloaded
  `Dictation-Repair-Book-linux-x64.deb` passed `sha256sum -c`, and Debian
  metadata reports `dictation-repair-book` `0.1.14` `amd64`.
- `latest.json` and `build-info.json` both identify
  `90295dc8f2eaaa6e9cdfc50080e53ae025a31f09`. All 36 publicly served static
  build files match the local deployment build byte-for-byte. A live Linux
  download intent made exactly one GitHub API request and resolved to the
  v0.1.14 AppImage.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.05 s, CLS 0, TBT 18 ms.

Evidence is retained in `.factory/qa-evidence/repair-12-local/`,
`.factory/qa-evidence/repair-12-release/`, and
`.factory/qa-evidence/repair-12-live/`.

## Known gaps and operator action

No release-blocking gap remains. The desktop installers are intentionally
unsigned and disclose that state. Signing a future build requires the owner to
provide `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`; no credentials are stored
in this repository.
