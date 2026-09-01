# Repair 9 handoff — portable claim commands

**Base verification:** `cfe4f5bf03133c9b8cc4644547e0baeb4088e846`
(`.factory/verification-9.md`)

## Release-blocking repairs

- Reproduced the verifier's exact clean-Linux failures before changing code:
  `cargo test --manifest-path src-tauri/Cargo.toml
  claim_native_erase_removes_vault_and_key` exited 101 because `glib-2.0`
  metadata was absent; `pwsh -NoLogo -NoProfile -File tests/installers.ps1`
  exited 127 because PowerShell was absent.
- Split the Rust core into GUI-independent `privacy` and desktop-only modules.
  Tauri, the opener plugin, and clipboard access are optional behind the default
  `desktop` feature. `cargo test --no-default-features` runs the real AES-256-
  GCM vault, per-device key, and native erase code without GLib, GTK, or
  WebKit dependencies.
- Updated the three native privacy claim commands to use that no-GUI target.
  A unit regression executes `cargo tree --no-default-features` and rejects a
  GUI dependency leak.
- Added `tests/installers.mjs` as the portable checksum contract test. It
  exercises matching and mismatching fixture packages, proves a mismatch is
  removed without launching MSI installation, and checks that the shipped
  PowerShell script keeps the same download/hash/refusal ordering.
- Kept `tests/installers.ps1` as the real PowerShell fixture and added it to
  the Windows matrix job in `.github/workflows/release.yml`.
- Every claim still has exactly one `@claim:<id>` owner. The portable Node
  runner now owns `powershell-checksum-installer` so it works in a clean Linux
  clone.

## Verification evidence

Completed after a clean `npm ci` (168 packages; 0 vulnerabilities):

- `npm test`: unit suite, portable installer contract, no-GUI native suite,
  and the complete 44-test Playwright desktop/mobile suite passed. The final
  unit suite has **26 tests**; the native suite has **4 tests**.
- Independently executed all **33** literal commands in `.factory/claims.json`;
  all completed successfully on Linux. The repaired exact commands are:

  ```sh
  cargo test --manifest-path src-tauri/Cargo.toml --no-default-features claim_native_erase_removes_vault_and_key
  cargo test --manifest-path src-tauri/Cargo.toml --no-default-features claim_encrypted_vault_uses_aes_256_gcm
  cargo test --manifest-path src-tauri/Cargo.toml --no-default-features claim_per_device_key_is_random_and_private_on_unix
  node tests/installers.mjs
  ```

- `cargo tree --manifest-path src-tauri/Cargo.toml --no-default-features`
  contains no `glib`, `glib-sys`, `gtk`, or `webkit` package.
- `npm run typecheck`, `npm run lint`, `npm run build`, and
  `cargo fmt --manifest-path src-tauri/Cargo.toml --check` passed. Production
  build output includes `dist/app/index.html` and `dist/site/index.html`; the
  largest initial app JavaScript is 9.98 KB gzip and landing JavaScript is
  1.88 KB gzip.
- Browser coverage includes cold-load console/request checks, 390px mobile,
  keyboard/focus/skip link, Axe serious/critical scan, demo privacy boundary,
  offline reload, service-worker update, and route/status behavior.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173
  .factory/qa-evidence/repair-9-local` passed: HTTP 200, title, `lang=en`, one
  `h1`, `main`, complete image alt text, labeled buttons, and no console
  errors. Its JSON evidence records a 596 ms local load.

## Publish and deployment

- Committed and pushed `12f481099fb210cededd042dd20fdc0d13eeda25`
  (`fix: make privacy claim checks portable`) to `main`.
- Deployed `dist/site/` through the scoped static work-order configuration.
  Azure deployment `738c3fce-8e8e-4dfd-bbb3-455b4881c8fa` completed
  successfully; `https://dictation-repair-book.sociobot.in` returned HTTP 200.
- Live URL verification passed with no page or console errors and the same
  title, language, heading, main landmark, image alt coverage, and labelled
  controls as the local build. Evidence is in
  `.factory/qa-evidence/repair-9-live/` (970 ms cold load).
- The live response has CSP, HSTS, `nosniff`, strict-origin referrer policy,
  and camera/microphone/geolocation-denying Permissions-Policy headers. A
  SHA-256 comparison matched all **36** served files from the local `dist/site`
  build byte-for-byte; the deployment-only `staticwebapp.config.json` is
  intentionally not served.

## Operator action

Desktop releases remain intentionally unsigned. macOS notarization and Windows
Authenticode require the owner-managed `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` GitHub secrets; none are stored in this repository.
