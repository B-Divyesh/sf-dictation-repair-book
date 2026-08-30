# Independent verification 7 — PASS

**Acceptance candidate:** `0224a82ab8d162d165ca5c6d5ff5f531035ec9b1`  
**Live URL:** <https://dictation-repair-book.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Result:** **PASS — accept this candidate.**

No product code was changed during verification. The candidate differs from the published `v0.1.5` source commit `2f2e706eaa2d59e9b327bf91236e566fd7d5f9bc` only in factory handoff/evidence files. The release manifest identifies that source commit, so the shipped app is the product portion of this candidate.

## Mandatory cold-read and demo gate

**PASS.** On a cold 1440px and 390px visit the first screen says what it does (“Turn dictation corrections into reusable rules”), who it is for (users with names, medications, code terms, or workplace jargon), and what to do first (the visible one-click **Try it with sample data** link). That link opens `/demo/?demo=1`, immediately showing Kubernetes, metoprolol, and Niamh sample rules plus the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls.

## Claims gate — 29/29 PASS

`.factory/claims.json` exists and every ID maps to exactly one `@claim:<id>` test. After `npm ci`, all listed commands passed:

- Browser claims: `npm run test:e2e` completed **42/42** tests, including all 19 claim-tagged browser tests (demo isolation, local repair, exports/import, Whisper, privacy, free limit/licensing, erase, offline, and deferred release lookup).
- Unit claims: all six exact `npm run test:unit -- --testNamePattern @claim:<id>` commands passed (literal replacement, longest-first ordering, permissions, checksum installer, release matrix, unsigned disclosure).
- Native claims: the three exact `cargo test --manifest-path src-tauri/Cargo.toml <claim>` commands passed for native erase, AES-256-GCM vault encryption, and the 32-byte private per-device key.
- `pwsh -NoLogo -NoProfile -File tests/installers.ps1` passed both PowerShell checksum match and refusal paths.

The untouched base image initially lacked Linux GTK/WebKit development headers and PowerShell, so the first native/PowerShell command could not start. After installing those verifier prerequisites, each exact command passed. This was an environment prerequisite, not a product behavior failure.

## Build and product checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — produced `dist/app` and `dist/site` |
| Initial JS budget | PASS — landing 1.88 KB gzip; demo 9.35 KB gzip; CSS 3.12/3.84 KB gzip |
| Live repair | PASS — `Deploy the cube or net ease service.` became `Deploy the Kubernetes service.` |
| Recovery | PASS — invalid JSON reports that the current book is unchanged |
| PWA | PASS — controlled service worker updates cleanly; `/demo/` reloads offline |
| Mobile | PASS — 390px demo has no horizontal overflow |

## Accessibility, privacy, and headers

Fresh Chromium checks at 1440×900 and 390×844 found no console or page errors, and Axe reported **zero serious or critical violations**. The live page has `lang=en`, a title, one `h1`, one `main`, labelled controls, visible 3px focus indicators, and a working skip link. Reduced-motion use was emulated.

The complete live sample flow made requests only to `https://dictation-repair-book.sociobot.in`; no third-party scripts, fonts, or analytics loaded. Production responses include HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and a CSP with `frame-ancestors 'none'`. HTML and the service worker use 30-second must-revalidate caching; hashed assets use one-year immutable caching.

The product’s license verification endpoint was probed from one client with invalid test tokens: requests 1–30 returned 200, request 31 returned **429** with **`Retry-After: 1`**, and a request after two seconds returned 200. The observed allowance is 30 requests per client burst/window.

## Deployment and desktop release identity

Fresh `npm run build` output matched the live bytes for **36/36 served files** (landing, demo, legal pages, 404, worker, assets, and metadata). The sole file not served is `staticwebapp.config.json`, which is deployment configuration.

GitHub release `v0.1.5` has the required macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`. The downloaded Linux DEB passed `sha256sum -c`; its metadata is `dictation-repair-book` version `0.1.5`, `amd64`. Its extracted binary remained running under Xvfb for the 12-second smoke interval (only expected headless DRI3/session-bus warnings).

## Defects

No release-blocking, high, medium, or low product defects found. Builds are intentionally unsigned, and the live install copy discloses the operating-system confirmation requirement.
