# Verification 9 — FAIL

**Candidate:** `dcd899edc7e34c18b7b5bfc1ae460736445bc959` (`docs: record repair 8 release evidence`)
**Live URL:** https://dictation-repair-book.sociobot.in/
**Verified:** 2026-09-01, clean checkout at the candidate commit
**Decision:** **FAIL — release blocked.**

## First read

On a cold load, the first screen says “Turn dictation corrections into reusable
rules.” It identifies people whose names, medications, code terms, or workplace
jargon are repeatedly miswritten by dictation. The first action is **Try it with
sample data**, with the immediate result stated beside it: it opens a separate
sample repair book and does not enter the real book. This meets the plain-words
and one-click demo acceptance checks.

## Release-blocking findings

### High — four mandatory claim commands did not complete in this clean verifier

The claim register is present and has 33 entries. Each ID occurs exactly once in
the shipped tests. Twenty browser claim commands and nine JavaScript unit claim
commands completed successfully. The following four exact required commands
cannot pass in this clean verifier environment:

| Claim | Required command | Fresh evidence |
| --- | --- | --- |
| `native-erase` | `cargo test --manifest-path src-tauri/Cargo.toml claim_native_erase_removes_vault_and_key` | Cargo cannot build `glib-sys`: `pkg-config` cannot find `glib-2.0 >= 2.70`. |
| `encrypted-vault` | `cargo test --manifest-path src-tauri/Cargo.toml claim_encrypted_vault_uses_aes_256_gcm` | Same unavailable GLib development prerequisite. |
| `per-device-key` | `cargo test --manifest-path src-tauri/Cargo.toml claim_per_device_key_is_random_and_private_on_unix` | Same unavailable GLib development prerequisite. |
| `powershell-checksum-installer` | `pwsh -NoLogo -NoProfile -File tests/installers.ps1` | `pwsh` is not installed in the clean verifier image. |

The native error is reproducible with `cargo check --manifest-path
src-tauri/Cargo.toml`: `Package glib-2.0 was not found in the pkg-config search
path`. These claims cover encryption at rest, local-key permissions, secure
native erase, and Windows installer checksum behavior. The work order makes any
failing claim test a release blocker, so this candidate cannot receive a PASS.

The repository documents Tauri prerequisites, but it does not make these four
mandatory commands runnable in this clean verifier. No product code was changed
in this verification.

## Checks that passed

- `npm ci`: completed; 168 packages installed, audit reported 0 vulnerabilities.
- All 29 independently runnable claim commands passed: 20 Playwright demo/site
  claims and 9 Vitest claims. The ordinary full run reported **25/25 Vitest**
  tests and launched the complete **44-test Playwright** suite.
- `npm run typecheck`, `npm run lint`, and exact `npm run build`: passed.
  Build output contains `dist/app/index.html` and `dist/site/index.html`.
  Gzipped initial product JavaScript is 9.98 KB (app) and 1.88 KB (landing);
  landing CSS is 3.23 KB, within the stated static budgets.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check`: passed.
- `/opt/fleet/lib/verify-url.sh https://dictation-repair-book.sociobot.in ...`:
  passed after preparing its evidence directory. It found HTTP 200, title,
  `lang=en`, one `h1`, `main`, complete image alt text, and no console errors.
- Cold live load: HTTP 200, no console/page errors, and requests only to
  `https://dictation-repair-book.sociobot.in`.
- Live demo: repaired `deploy the cube or net ease service` to `deploy the
  Kubernetes service`; an empty transcript remains invalid with the browser
  message “Please fill out this field.” The demo request log contained only the
  product origin.
- Live demo after the first visit: offline navigation to `/demo/` loaded
  “Approved rules” with no console errors.
- Axe Playwright scan: no serious or critical findings on desktop or at 390 px.
  At 390 px with reduced motion, `scrollWidth` equalled `clientWidth` (390),
  there were no active animations, and no errors. Keyboard Tab reached a native
  select with a visible `rgb(49, 87, 213) solid 3px` focus outline.
- Response headers include CSP, HSTS, `nosniff`, strict-origin referrer policy,
  and a microphone/camera/geolocation-denying Permissions-Policy. Hashed JS and
  CSS use `Cache-Control: public, max-age=31536000, immutable`; HTML uses a
  short 30-second revalidation policy. The 404 response is HTTP 404 with the
  same security headers.
- Every live deployed asset referenced from the landing page was compared to
  the local candidate build by SHA-256. `index.html`, site CSS/JS, module
  preload script, hero, and all four walkthrough images match byte-for-byte.
  Internal landing links to Demo, Privacy, and Terms returned HTTP 200 with
  route-specific titles.

## Scope note

The product has no product-owned server endpoint. The optional paid license
verification is an external `api.sociobot.in` call. Per the assigned resource
boundary, this verification did not contact that non-product service, so no
live allowance or `429`/`Retry-After` observation is claimed. Its browser
fixture tests ran locally; this is not evidence of the external service’s live
allowance.

## Evidence

- [Cold live desktop screenshot](verification-evidence/verification-9-live-cold-desktop.png)
- [Live demo desktop screenshot](verification-evidence/verification-9-live-demo-desktop.png)
- [Live demo 390px reduced-motion screenshot](verification-evidence/verification-9-live-demo-mobile-reduced.png)
- `verification-evidence/verification-9-verify-url/` contains the URL-check
  helper capture.

## Required follow-up

Provide the documented Linux Tauri build prerequisites and PowerShell 7 in the
clean verification image, then rerun all four named claim commands. A PASS
requires all four to pass; this report should then be superseded by a new
verification report.
