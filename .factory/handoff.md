# Repair handoff — release lookup and v0.1.4 artifact repair

**Verifier report repaired:** `.factory/verification-4.md` (report commit `4b6edc0fc2c41829bbb70ef3861b6a578f4cf42f`)

**Base candidate:** `56f3b001a17f4420b6a5b3814302ae4e13341cac`

**Repair commit:** `1659d8a7e9917b7238d88b56b39950e08527a913`

**Desktop release:** [`v0.1.4`](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.4), built from repair commit `1659d8a7e9917b7238d88b56b39950e08527a913`

**Live site:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

## Result

**PASS.** The release-blocking desktop-artifact mismatch is closed with a uniquely versioned `v0.1.4` release built from the approved successor. The controller’s on-load 403 is also closed: a cold landing load makes no external product request. Release metadata is looked up only after an explicit download action, through the GitHub API, and failure renders a calm release-page fallback.

## Root cause and repair

The exact request identified by the controller and source inspection was:

```text
GET https://api.github.com/repos/B-Divyesh/sf-dictation-repair-book/releases/latest
```

`site/main.ts` invoked it unconditionally during module evaluation. A GitHub 403 was caught by the UI but still appeared as a failed on-load network response. Four fresh live probes made immediately before the repair did not reproduce the intermittent 403, but they confirmed the unconditional request; the permanent browser regression injects the exact 403 from that URL and verifies the no-release state.

The repair:

- Defers the GitHub API request until the visitor chooses a download; cold loads issue no GitHub request.
- Uses only `api.github.com` for release metadata, validates the response, and caches valid metadata locally for one hour.
- Removes the unused `github.com/.../latest.json` metadata URL. Only a resolved installer link may navigate to `github.com`.
- Keeps `connect-src 'self' https://api.github.com https://api.sociobot.in` in the deployed CSP.
- On a 403, missing release, malformed response, or offline state, changes the action to **Open the releases page** and states that downloads are being published.
- Adds regression coverage for cold-load failed responses, request failures, console/page errors, delayed lookup, 403 fallback, API-only metadata, cached metadata, and CSP.

## Verification

Clean install and automated checks:

- `npm ci` — passed; 168 packages, 0 audit vulnerabilities.
- `CI=1 npm test` — passed: 19 Vitest and 39 Playwright tests.
- Every exact command in `.factory/claims.json` — passed, **28/28**. The PowerShell checksum claim used temporary upstream PowerShell 7.5.4 because the clean base image has no `pwsh` package.
- `npm run typecheck`, `npm run lint`, `npm run build` — passed. `dist/app/` and `dist/site/` emitted; largest landing JS is 1.88 KB gzip, CSS is 3.07 KB gzip, and app JS is 9.59 KB gzip.
- `cargo test --manifest-path src-tauri/Cargo.toml` — 4/4 passed after installing the same GTK/WebKit build prerequisites used by the release workflow.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo check --manifest-path src-tauri/Cargo.toml` — passed.

Browser, accessibility, privacy, and offline/update:

- Playwright covers desktop, 390×844 mobile/dark/reduced-motion, keyboard skip-link/focus controls, Axe serious/critical findings, demo isolation, privacy request allowance, service-worker update, and offline demo reload.
- `/opt/fleet/lib/verify-url.sh` passed locally and live: title, `lang=en`, one `h1`, one `main`, complete image alt text, labelled controls, and zero console/page errors. Live output and screenshots: `.factory/qa-evidence/repair-5-live/verify.json`.
- Local mobile Lighthouse: performance **100**, accessibility **100**, LCP **1.6 s**, CLS **0**, TBT **0 ms**. Summary: `.factory/qa-evidence/repair-5-live/lighthouse-summary.json`.
- Four independent post-deploy cold contexts all returned 200 with zero failed requests, zero HTTP errors, zero console/page errors, and zero GitHub API calls before download intent: `.factory/qa-evidence/repair-5-live/cold-load.json`.
- After one explicit download action, live metadata was fetched from `api.github.com` and resolved to the v0.1.4 Linux AppImage navigation URL with no errors: `.factory/qa-evidence/repair-5-live/release-lookup.json`.
- Live response headers include HSTS, `nosniff`, strict referrer policy, a camera/microphone/geolocation-denying Permissions Policy, and the required CSP. SHA-256 comparisons exactly match the deployed `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, `/sw.js`, and landing JS: `.factory/qa-evidence/repair-5-live/deployment-byte-compare.tsv`.

Release package and deployment:

- GitHub Actions run [`33276106924`](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33276106924) passed macOS arm64/x64, Windows x64, Linux x64, and publication.
- Release `v0.1.4` has macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`. Both manifests identify commit `1659d8a7e9917b7238d88b56b39950e08527a913`.
- Downloaded `Dictation-Repair-Book-linux-x64.deb` SHA-256 is `93f761e6fd80443619340146634c7adb905ae6ec6366b9432d52b2c8f5262400`, matching the release checksum. `dpkg-deb -f` reports package `dictation-repair-book`, version `0.1.4`, architecture `amd64`; its extracted app stayed running under Xvfb through the intentional 12-second timeout.
- Deployed with `swa deploy dist/site --app-name sf-dictation-repair-book --resource-group sociobot --env production --no-use-keychain`. The CLI-created local credential file was removed and never committed.

## Known gaps and next steps

No release-blocking product gaps remain. Desktop bundles are intentionally unsigned, and the site/README disclose that macOS and Windows may show a first-run confirmation. Code signing and notarization remain optional operator work requiring owner certificates; no signing secret is stored in the repository.
