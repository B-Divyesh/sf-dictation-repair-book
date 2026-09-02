# Independent verification 16 — FAIL

**Candidate:** `848bef3d02ca7aa67dc8d84cf485eb887d1b6fce` (`main`)

**Live URL:** https://dictation-repair-book.sociobot.in

**Verified:** 2026-09-02 UTC from a clean checkout in `/work/repo`.

## Release decision

**FAIL — release blocking.** The required claim command for
`powershell-checksum-installer` does not run in this clean verifier image:

```text
$ npm run test:installer-windows
> pwsh -NoLogo -NoProfile -File tests/installers.ps1
sh: 1: pwsh: not found
```

The claim manifest explicitly names that command, and the work order says a
missing or failing claim test blocks release. `npm test` passes because it only
runs a structural Node check for the PowerShell installer; it does not execute
the Windows checksum behavior claim.

## Required claim tests

`.factory/claims.json` is present and contains 34 claims. I ran every listed
command from this clean checkout before broader QA. **33 passed; 1 failed** as
described above.

- Passed e2e claims: demo sandbox, no account, rule management, local repair,
  portable CSV/JSON exports, JSON round trip, Whisper prompt, local-only demo
  requests, website request privacy, on-demand release lookup, clipboard only
  on command, free limit/license behavior, erase, retry backoff, daily license
  cache, license request privacy/return/revocation, offline demo, and native
  sample isolation.
- Passed unit claims: literal `$&` replacement, longest rule first, explicit
  capability set, Unix installer checksum, release matrix, unsigned warning,
  build output, release-source identity, artifact identity, and $12 checkout.
- Passed native claims: encrypted AES-256-GCM vault, per-device private key,
  and native erase.
- Failed: `powershell-checksum-installer` — `pwsh` executable unavailable.

The complete `npm run test:e2e` run also passed all **50** Playwright tests
(`test-results/.last-run.json` recorded `{"status":"passed"}`).

## First read and live QA

The cold production page passed the plain-words/demo check. Its first screen
says it turns dictation corrections into reusable rules, names people with
uncommon names, medications, code terms, or workplace jargon, and places
**Try it with sample data** beside “Opens a separate sample repair book.
Nothing enters your real book.”

- Cold desktop and 390 px mobile: no console/page errors, no horizontal
  overflow, visible skip-link keyboard flow, route focus/announcement history,
  and reduced-motion behavior passed.
- `node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in
  /tmp/drb-live-verify` passed: `/`, `/demo/`, `/privacy/`, and `/terms/` all
  200; the tested missing URL returned a styled 404; each had one h1, `lang`,
  and `main`; Axe reported no serious or critical findings.
- `/opt/fleet/lib/verify-url.sh` passed after creating its output directory:
  title, language, one h1, main landmark, image alternatives, and console
  errors all clean.
- Privacy: cold landing and complete demo request logs contained only the
  product origin. The demo did not read the seeded real storage key. Response
  CSP restricts scripts/styles/images to self and connects to self plus the
  disclosed GitHub release and Sociobot billing origins. No product-owned
  server endpoint exists, so a product API allowance/429 test is not
  applicable.
- Service worker: a returning page was controlled by `/sw.js`; an explicit
  `registration.update()` completed with no waiting worker or errors; an
  offline `/demo/` reload returned 200 and displayed Kubernetes.
- Headers: HSTS, `nosniff`, strict referrer policy, microphone/camera denied,
  and a CSP with response-header `frame-ancestors 'none'` were present. Hashed
  JS/CSS/WebP assets use `max-age=31536000, immutable`; the document and
  service worker use a 30-second revalidation cache.
- Production initial JS is 4.51 kB (1.90 kB gzip) plus the 0.77 kB preload
  helper; CSS is 11.98 kB (3.23 kB gzip); the mobile hero WebP is 182,720 B.

## Local gates and deployment identity

Passed:

```text
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

`npm run build` produced both `dist/app/` and `dist/site/`. The live hashes
for `index-oEGPrSfE.js` and `site-D642qofu.css` exactly match locally-built
candidate assets. The candidate contains no product-runtime changes after
release source `35cecb2fa2c129551f58f9a760d66061b2c4043a`; its later changes
are verification/documentation only.

GitHub latest release is `v0.1.13` with all macOS DMG, Windows MSI/EXE, and
Linux AppImage/DEB assets, `SHA256SUMS`, and `latest.json`. Downloaded
`Dictation-Repair-Book-linux-x64.deb` passed `sha256sum -c`; its Debian control
metadata reports version `0.1.13` and a desktop executable.

## Defects

### High — release blocker

1. **The declared Windows checksum claim cannot execute from the clean test
   environment.** `package.json` requires `pwsh`, but the clean verifier image
   has no `pwsh`; no bootstrap/preflight provides it. The normal `npm test`
   gate therefore does not prove the required behavior. Add a supported
   PowerShell test environment or a portable executable test path, then make
   the claims command pass in the standard clean verification workflow.

## Evidence locations

- `/tmp/drb-live-cold-desktop.png`
- `/tmp/drb-live-verify/live-recheck.json`
- `/tmp/drb-live-verify/live-a11y.json`
- `/tmp/drb-verify-url/verify.json`
- `/tmp/drb-release/SHA256SUMS`, `latest.json`, `build-info.json`

