# Verification 10 — FAIL

**Candidate:** `3b25f03ad7f011a7132062de9df5e7e00039ab5e`
(`docs: record portable claim repair evidence`)
**Live URL:** https://dictation-repair-book.sociobot.in/
**Verified:** 2026-09-01 from a clean checkout of the candidate
**Decision:** **FAIL — the candidate desktop build is not published.**

## First read

Confirmed on a cold 1440×900 live load that the first screen states the job:
“Turn dictation corrections into reusable rules.” It names dictation users with
names, medications, code terms, or workplace jargon. It presents **Try it with
sample data** in the first viewport and explains that the action opens a
separate sample repair book. The one-click action opens three realistic rules
with the persistent “Demo — sample data, nothing is saved” notice. This gate
passes.

## Findings

### High — published desktop downloads do not contain the candidate

Checked the live download lookup, GitHub release metadata, release manifests,
and a running Linux package. The live site offers release `v0.1.6`, whose
`build-info.json` and `latest.json` both identify commit
`99fdc51de4a209400cdb7b03a6bd443175aae5f5`. The running desktop app shows
`v0.1.6 · 99fdc51de4a2` in its footer. The requested candidate is
`3b25f03ad7f011a7132062de9df5e7e00039ab5e` and no tag points to it.

Confirmed that the difference is material to the desktop source and release
process: after `v0.1.6`, the candidate changes `src-tauri/Cargo.toml`,
`src-tauri/build.rs`, `src-tauri/src/lib.rs`, adds
`src-tauri/src/desktop.rs` and `src-tauri/src/privacy.rs`, and changes the
release workflow. The candidate therefore has no installable artifact that can
be checked as the candidate. This fails the required deployed-build identity
check for a desktop product.

Evidence: [published Linux app](verification-artifacts-10/published-linux-app.png)
and the release metadata recorded in the command results for this work order.

### Medium — native sample banner covers the active page heading

Confirmed in the published Linux app and in the candidate's native-mode UI at
the default configured 1180×780 window. After **Load sample repair book**, the
fixed banner rectangle is `x=464, y=12, width=700, height=64`. It intersects the
page kicker, the “Approved rules” heading, and the approved-rule count. The
mobile layout makes the banner static and does not overlap content, but the
default desktop window does. This conflicts with the product requirement that
fixed bars not hide content.

Evidence: [published native sample](verification-artifacts-10/published-linux-sample.png).

## Claim checks

Confirmed that `.factory/claims.json` exists, parses, and contains 33 entries.
Ran every listed `test` command independently before the general suite. Every
command completed successfully.

| Claim | Result | Confirmed outcome |
| --- | --- | --- |
| `demo-sandbox` | PASS | Separate sample state, reset, and exit cleanup |
| `no-account` | PASS | Sample repair without sign-in |
| `rule-management` | PASS | Approve, search, delete, undo, and reuse |
| `literal-code-replacement` | PASS | Literal `$&` replacement |
| `longest-rule-first` | PASS | Longest overlapping rule first |
| `local-repair` | PASS | Shipped Kubernetes sample repair |
| `portable-exports` | PASS | Free CSV/JSON and retained source name |
| `json-roundtrip` | PASS | Complete JSON export/import round trip |
| `whisper-export` | PASS | Unique Whisper vocabulary output |
| `private-demo` | PASS | Sample flow stays on the product origin |
| `website-privacy` | PASS | No third-party scripts, fonts, or analytics |
| `on-demand-release-lookup` | PASS | Release lookup begins only after download intent |
| `explicit-access` | PASS | No audio, global-keyboard, or arbitrary-field capability |
| `clipboard-on-command` | PASS | Clipboard read begins only after the named action |
| `free-book` | PASS | 25-rule free limit, free exports, and cached-license path |
| `erase-local-book` | PASS | Browser book and license keys removed |
| `native-erase` | PASS | Native vault, temporary file, and key removed |
| `license-backoff` | PASS | Client honors `Retry-After` without a second request |
| `license-daily-cache` | PASS | Valid verdict reused for one day |
| `license-request-privacy` | PASS | License-only verification request fixture |
| `license-return` | PASS | Returned token stored and removed from the URL |
| `encrypted-vault` | PASS | AES-256-GCM round trip with no plaintext term on disk |
| `per-device-key` | PASS | Random 32-byte keys and Unix mode `0600` |
| `revoked-license-locks` | PASS | Revoked fixture prevents further paid approvals |
| `checksum-installers` | PASS | Unix checksum mismatch is refused |
| `powershell-checksum-installer` | PASS | Portable Windows checksum contract |
| `release-matrix` | PASS | Six platform bundles plus manifests and checksums |
| `unsigned-build` | PASS | Unsigned state and user notice |
| `offline-demo` | PASS | Demo reload after the network is unavailable |
| `native-sample-isolation` | PASS | Native sample actions leave real storage untouched |
| `checkout-price` | PASS | One-time USD price is $12 |
| `build-output` | PASS | `dist/app/` and `dist/site/` produced |
| `release-source-identity` | PASS | Workflow source/tag consistency guard |

## Repository and build checks

- Confirmed `npm ci`: 168 packages installed; audit reported 0
  vulnerabilities.
- Confirmed `npm test`: 26 Vitest checks, the portable installer contract,
  four native Rust checks, and 44 Playwright checks passed.
- Confirmed `npm run typecheck`, `npm run lint`,
  `cargo fmt --manifest-path src-tauri/Cargo.toml --check`, and
  `cargo check --manifest-path src-tauri/Cargo.toml --no-default-features`.
- Confirmed the exact `npm run build`. It produced `dist/app/index.html` and
  `dist/site/index.html`.
- Confirmed build budgets: app JavaScript is 9.98 KB gzip, app CSS is 4.03 KB
  gzip, landing JavaScript is 1.88 KB gzip plus a 0.44 KB preload helper, and
  landing CSS is 3.23 KB gzip. The 390px hero uses the 47,766-byte WebP.
- Confirmed the visual-system record, original image provenance, MIT license,
  README, demo documentation, privacy page, and terms page are present.

## Live product checks

- Confirmed all 36 publicly served build files match the fresh `dist/site/`
  files byte-for-byte by SHA-256. The deployment website matches the candidate
  static build.
- Confirmed the sample changes “Deploy the cube or net ease service.” to
  “Deploy the Kubernetes service.” An empty transcript receives the browser's
  required-field message and focus. A no-match phrase returns “No matching
  approved terms.” An invalid JSON backup reports that the current book was not
  changed, and the sample rules remain present.
- Confirmed the live sample flow made requests only to
  `https://dictation-repair-book.sociobot.in`. No failed request, response at
  400 or above, console error, or page error occurred.
- Confirmed desktop and 390px layouts, no horizontal overflow, all visible
  landing targets at least 44×44 CSS pixels, and no banner/content overlap on
  the mobile demo.
- Confirmed keyboard-only activation of the sample link. The skip link,
  wordmark, download action, and sample action each show a 3px cobalt outline
  with 4px offset. The check also passed with reduced motion enabled.
- Confirmed no running animation with reduced motion enabled.
- Confirmed Axe found no serious or critical issue on `/`, `/demo/`,
  `/privacy/`, `/terms/`, or `/404.html` at 1440px and 390px. Confirmed dark
  demo colors also return no serious or critical issue.
- Confirmed the service worker was active, completed an update check, and
  loaded `/demo/` with its sample while the browser was offline.
- Confirmed an unknown route returns HTTP 404 with a product-styled page and
  working routes back home and to the sample.
- Confirmed the live response has CSP, HSTS, `nosniff`, referrer policy, and a
  camera/microphone/geolocation-denying Permissions-Policy. HTML revalidates
  after 30 seconds; hashed assets use one-year immutable caching; installer
  scripts use five-minute caching.
- Confirmed the URL-check helper passed: HTTP 200, title, `lang=en`, one `h1`,
  `main`, complete image alternative text, labelled buttons, and no console
  errors. It measured a 660 ms cold load.
- Confirmed Lighthouse mobile scores of 100 performance, 100 accessibility,
  100 best practices, and 100 SEO. Recorded FCP 1.1 s, LCP 1.2 s, total
  blocking time 0 ms, CLS 0, and speed index 1.1 s.

## Published package checks

- Confirmed release `v0.1.6` contains macOS arm64 and x64 DMGs, Windows MSI
  and EXE packages, Linux AppImage and DEB packages, `SHA256SUMS`,
  `latest.json`, and `build-info.json`.
- Confirmed a fresh Linux DEB download matches its published SHA-256 value.
- Confirmed the DEB declares version 0.1.6, architecture amd64, and its GTK,
  WebKitGTK, and application-indicator runtime dependencies.
- Confirmed the extracted Linux desktop app starts in an isolated data
  directory. **Load sample repair book** shows three rules, and a fresh sample
  transcript produces “Deploy the Kubernetes service.” with one rule applied.
  No vault or key file is created by that in-memory sample flow.

Evidence: [native sample repair result](verification-artifacts-10/published-linux-repair-result.png),
[live desktop sample](verification-artifacts-10/live-demo-desktop.png),
[live 390px reduced-motion sample](verification-artifacts-10/live-demo-mobile-reduced.png),
[dark sample](verification-artifacts-10/live-demo-dark.png),
[URL helper evidence](verification-artifacts-10/verify-url/verify.json), and
[Lighthouse JSON](verification-artifacts-10/lighthouse-mobile.json).

## Scope notes

- Confirmed the product has no product-owned server endpoint and requires no
  sign-in, so server concurrency, server persistence, health identity, and
  Microsoft Entra checks do not apply.
- The optional license check uses the external Sociobot billing service. In
  accordance with the assigned resource boundary, no volume test was sent to
  that service. The product's fixture confirms client handling of a `429` plus
  `Retry-After`, but this report does not state a live service allowance.

## Required follow-up

1. Publish desktop installers built from the candidate source, with manifests
   naming the candidate commit, and confirm one downloaded artifact.
2. Reposition the native sample banner so it does not cover the page kicker,
   heading, or approved-rule count at 1180×780.
3. Rerun this verification against the new candidate and release.
