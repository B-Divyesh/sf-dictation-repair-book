# Independent verification 5 — FAIL

**Acceptance candidate:** `a20c5c1380da039f273f120a3cdd7bfdae5dc98b`

**Live URL:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

**Result:** **FAIL — do not accept this candidate.**

This was a fresh independent verification. No product code was changed. The earlier deployment/artifact failure is resolved, but the mandatory cold first-read contract fails.

## Release-blocking findings

| Severity | Finding | Fresh evidence | Required resolution |
| --- | --- | --- | --- |
| **Blocker** | The desktop first screen has no visible one-click **Try it with sample data** action. | In a cold 1440×900 Chromium context, the heading and audience copy are clear, but the sample CTA begins at `y=920.09`, below the 900px viewport. The visible actions are the vague **Demo** navigation link and **Choose a download**. The required sample explanation is also below the fold. See [live-cold-desktop.png](verification-evidence/live-cold-desktop.png). | Put **Try it with sample data** and its result in the initial desktop viewport, then verify at common laptop heights. |
| **High** | One claim is not traceable by the required claim tag. | Exact search found one `@claim:<id>` occurrence for 27 claims and zero for `powershell-checksum-installer`. `tests/installers.ps1` passes, but contains no `@claim:powershell-checksum-installer` tag. | Add the exact claim tag to the single owning test and retain the manifest command. |
| **Medium** | Four mobile interactive targets are below the 44px baseline. | At 390×844, both focusable install-command `<code tabindex="0">` blocks are 43px tall. The Privacy **public issue tracker** and Terms **project issue tracker** links are 19px tall. | Give each target a minimum 44×44px hit area without changing inline reading order. |

The first blocker alone mandates FAIL under the supplied plain-words and demo-sandbox contract.

## Mandatory claims

`.factory/claims.json` exists and lists 28 claims. After `npm ci`, every listed command was run individually before broader QA. The pristine worker image lacked GTK/WebKit development packages and `pwsh`, so the three native Rust claim commands initially stopped at missing `glib-2.0`, and the PowerShell command initially returned command-not-found. After installing the exact Linux prerequisites from the release workflow and temporary PowerShell 7.5.4, all four exact commands passed. Final observable claim result: **28/28 pass**; traceability result: **27/28 correctly tagged**.

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | PASS | Exact Playwright command: 1 passed |
| `no-account` | PASS | Exact Playwright command: 1 passed |
| `rule-management` | PASS | Exact Playwright command: 1 passed |
| `literal-code-replacement` | PASS | Exact Vitest command: 1 passed |
| `longest-rule-first` | PASS | Exact Vitest command: 1 passed |
| `local-repair` | PASS | Exact Playwright command: 1 passed |
| `portable-exports` | PASS | Exact Playwright command: 1 passed |
| `json-roundtrip` | PASS | Exact Playwright command: 1 passed |
| `whisper-export` | PASS | Exact Playwright command: 1 passed |
| `private-demo` | PASS | Exact Playwright command: 1 passed |
| `website-privacy` | PASS | Exact Playwright command: 1 passed |
| `explicit-access` | PASS | Exact Vitest command: 1 passed |
| `clipboard-on-command` | PASS | Exact Playwright command: 1 passed |
| `free-book` | PASS | Exact Playwright command: 1 passed |
| `erase-local-book` | PASS | Exact Playwright command: 1 passed |
| `native-erase` | PASS after documented native prerequisites | Exact Cargo command: 1 passed |
| `license-backoff` | PASS | Exact Playwright command: 1 passed |
| `license-daily-cache` | PASS | Exact Playwright command: 1 passed |
| `license-request-privacy` | PASS | Exact Playwright command: 1 passed |
| `license-return` | PASS | Exact Playwright command: 1 passed |
| `encrypted-vault` | PASS after documented native prerequisites | Exact Cargo command: 1 passed |
| `per-device-key` | PASS after documented native prerequisites | Exact Cargo command: 1 passed |
| `revoked-license-locks` | PASS | Exact Playwright command: 1 passed |
| `checksum-installers` | PASS | Exact Vitest command: 1 passed |
| `powershell-checksum-installer` | PASS after installing PowerShell | Both checksum match and mismatch paths passed; missing required claim tag |
| `release-matrix` | PASS | Exact Vitest command: 1 passed |
| `unsigned-build` | PASS | Exact Vitest command: 1 passed |
| `offline-demo` | PASS | Exact Playwright command: 1 passed |

## Build and automated checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages, 0 audit vulnerabilities |
| `CI=1 npm test` | PASS — 19 Vitest and 39 Playwright tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — emitted `dist/app/` and `dist/site/` |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — 4/4 |
| `cargo fmt --manifest-path src-tauri/Cargo.toml --check` | PASS |
| `cargo check --manifest-path src-tauri/Cargo.toml` | PASS |
| `CI=true npm run tauri build -- --bundles deb` | PASS — produced `Dictation Repair Book_0.1.4_amd64.deb` |

The harness exports `CI=1`; Tauri expects `true` or `false`, so the first native package invocation failed before compilation. With the workflow-equivalent `CI=true`, the optimized native build and DEB bundle completed. This is an environment compatibility note, not a product defect.

Unit boundary coverage passed for empty/unchanged corrections, whole-term matching, overlapping rules, replacement metacharacters, malformed backups, CSV escaping, and removed-source naming.

## End-to-end product evidence

- Live demo normal case: `Deploy the cube or net ease service.` became `Deploy the Kubernetes service.`
- Invalid recovery: importing a partially shaped JSON backup displayed “Your current book was not changed,” and the Kubernetes rule remained.
- The demo opened with realistic sample rules, no account controls, and a persistent reset/start-for-real banner.
- Search, approve, delete, undo, CSV/JSON export, JSON restore, Whisper export, the 25-rule free boundary, revoked licenses, and erasure passed the repository’s isolated end-to-end tests.
- The native Rust vault tests proved AES-256-GCM round-trip without plaintext, random private Unix keys, validation before encryption, and deletion of vault/temp/key files.

## Accessibility, responsive layout, and browser quality

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each returned 200 directly, had `lang=en`, one `h1`, one `main`, complete image alt text, and zero console/page/request errors.
- Axe found zero serious or critical findings on all five routes; light and dark landing checks had zero Axe violations.
- Keyboard skip navigation focused `#main`; app navigation and rule controls were operable by keyboard. In reduced-motion mode the 3px focus outline finishes its 0.01ms transition and is visible.
- Landing and demo layouts had no horizontal overflow at 390px. Reduced motion set scroll behavior to `auto`. Demo reset/start targets were each 44px high.
- The four undersized targets are listed above because automated Axe/Lighthouse checks did not flag them.
- `/opt/fleet/lib/verify-url.sh` passed live: title, language, one heading, main landmark, alt text, labelled buttons, 3,156 characters of content, and zero console errors. Evidence: [verify.json](verification-evidence/verify.json).

## Privacy, headers, PWA, and request allowance

- Cold landing and the complete sample repair flow requested only `https://dictation-repair-book.sociobot.in`; no analytics, third-party scripts, or third-party fonts were observed.
- After explicit download intent, the only external request was the disclosed GitHub Releases API. It resolved to the v0.1.4 Linux AppImage URL without a console error.
- Live HTML headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a Permissions Policy denying camera, microphone, and geolocation.
- HTML revalidates after 30 seconds; hashed assets use `max-age=31536000, immutable`; installer scripts use 300 seconds.
- Service-worker registration and update completed. An offline reload of `/demo/` returned 200 with sample data and no errors. Unknown routes returned the designed 404 with status 404 both online and offline.
- Fresh license-verification requests 1–30 returned 200. Request 31 returned **429** with **`Retry-After: 3`**; requests 32–35 remained 429. Observed allowance: **30 requests per client/window**.
- No sign-in exists, so the Microsoft Entra authority requirement is not applicable.

## Performance and budgets

Fresh mobile Lighthouse against the live URL scored **100 performance / 100 accessibility / 100 best practices / 100 SEO**, with LCP **1.1s**, FCP **0.8s**, Speed Index **0.9s**, TBT **0ms**, and CLS **0**.

Landing payloads are well within budget: 5.24KB uncompressed initial JavaScript, 11.36KB CSS, no web fonts, and a 47,766-byte mobile hero. The demo bundle is 25.58KB JavaScript plus tiny shared chunks and 14.47KB CSS.

## Deployment and desktop release identity

The prior deployment-only problem is closed:

- Fresh SHA-256 comparisons matched **all 28** rebuilt candidate site files to the deployed responses, including every route, script, stylesheet, image, service worker, and installer script.
- Candidate `a20c5c1` differs from release commit `1659d8a7` only by `.factory` handoff/evidence files; no product source or package file differs.
- GitHub release `v0.1.4` publishes macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- The downloaded Linux DEB SHA-256 was `93f761e6fd80443619340146634c7adb905ae6ec6366b9432d52b2c8f5262400`, exactly matching `SHA256SUMS`. Metadata is package `dictation-repair-book`, version `0.1.4`, architecture `amd64`.
- Its extracted binary stayed running under Xvfb until the intentional 12-second timeout. The tray warned only that the minimal container lacked `dbus-launch`.
- The $24 purchase endpoint is registered and returned 303 to the hosted Dodo checkout. No provider is embedded in the product.

## Decision

**FAIL.** Deployment, release packaging, privacy, offline behavior, core repair flows, tests, and performance are sound. Acceptance remains blocked by the missing first-viewport sample action. Claim-tag traceability and the undersized touch targets also need correction before re-verification.
