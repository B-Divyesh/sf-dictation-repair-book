# Repair handoff — verification 5 release blockers

**Verifier report repaired:** `.factory/verification-5.md` from report commit `c0dc1f53d259f95200063757e5c443a2bc179893`

**Verified candidate:** `3b521cf` (`fix: repair landing QA blockers`)

**Base candidate:** `a20c5c1380da039f273f120a3cdd7bfdae5dc98b`

**Live site:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

## Result

**PASS.** All three release-blocking findings in independent verification 5 are repaired without changing the approved desktop repair flow, demo isolation, privacy model, or release artifact class.

## Repairs

1. The landing headline now follows the visual thesis's documented 42–72px scale (`clamp(44px, 3.8vw, 58px)`). The complete sample-action group, including its explanation, is inside the cold first viewport:
   - 1440×900: group `y=557.70`, bottom `734.08`.
   - 1366×768: group `y=583.66`, bottom `760.03`.
2. `tests/installers.ps1` now owns the exact `@claim:powershell-checksum-installer` tag. A unit regression reads `.factory/claims.json` and requires every manifest claim to have exactly one tag across the owned test sources.
3. Both focusable install commands now have a 44px minimum hit area. The Privacy and Terms issue-tracker links use an inline 44px hit area that preserves sentence order. A 390px browser regression scans every visible landing and legal control for both dimensions.

## Regression coverage

- `the sample action and its result stay inside the first desktop viewport` checks 1440×900 and 1366×768 and requires the entire `.hero-actions` group to fit.
- `every visible landing and legal control has a 44px target at 390px` checks all visible links, buttons, fields, summaries, and focusable elements on `/`, `/privacy/`, and `/terms/`.
- `maps every manifest claim to exactly one owned regression tag` prevents a future untraceable claim.

## Verification

Clean install and product checks:

- `npm ci` — passed; 168 packages, 0 audit vulnerabilities.
- `CI=1 npm test` — passed: 20 Vitest tests and 41 Playwright tests.
- Every exact command in `.factory/claims.json` passed independently: **28/28**, including the PowerShell checksum fixture under temporary PowerShell 7.5.4.
- `npm run typecheck`, `npm run lint`, and `npm run build` — passed. `dist/app/` and `dist/site/` emitted; landing JavaScript is 1.88 KB gzip and landing CSS 3.12 KB gzip.
- `cargo test --manifest-path src-tauri/Cargo.toml` — 4/4 passed; `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo check --manifest-path src-tauri/Cargo.toml` passed after installing the release workflow's documented GTK/WebKit prerequisites.
- `CI=true npm run tauri build -- --bundles deb` — passed. The local package is `Dictation Repair Book_0.1.4_amd64.deb` (package `dictation-repair-book`, version `0.1.4`, `amd64`), SHA-256 `d04a8ae4dccd0cb3bf27211472408007e16ea4f4bf3bd393778a6677714a07c1`. Its extracted binary remained running under Xvfb for the intentional 12-second smoke timeout. The only messages were expected container warnings for missing `dbus-launch` and DRI3 acceleration.

Browser, accessibility, privacy, and update checks:

- `/opt/fleet/lib/verify-url.sh` passed locally and live with a title, `lang=en`, exactly one `h1`, a `main`, complete image alt text, labelled buttons, and zero console/page errors.
- The installed `@axe-core/cli` wrapper could not find a system Chrome in this container. The repository's pinned Playwright Chromium + `@axe-core/playwright` integration was used instead; `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each had zero serious or critical findings locally and live.
- Live desktop keyboard verification confirmed the skip link moves focus into `main`. Live mobile verification confirmed no undersized visible landing/legal targets, no console errors, and the sample repair changed `Deploy the cube or net ease service.` to `Deploy the Kubernetes service.` without a request outside the product origin.
- The live cold landing made same-origin requests only. A GitHub release API request occurred only after explicit **Download for your computer** intent, resolved the Linux AppImage, and caused no console error.
- Service-worker update and offline sample behavior are covered by the passing `@claim:offline-demo` and service-worker Playwright regressions.
- Live mobile Lighthouse: **100 performance, 100 accessibility, 100 best practices, 100 SEO**; LCP **1.052s**, CLS **0**, TBT **0ms**.
- Production response headers include HSTS, `nosniff`, `strict-origin-when-cross-origin`, a camera/microphone/geolocation-denying Permissions Policy, and the deployed CSP. All 36 public files in the rebuilt `dist/site/` match their live responses byte-for-byte; `staticwebapp.config.json` is consumed by Static Web Apps and intentionally is not a public response.

Evidence is in `.factory/qa-evidence/repair-6-local/` and `.factory/qa-evidence/repair-6-live/`, including first-read screenshots, mobile captures, browser/layout reports, Axe reports, Lighthouse JSON, and the live byte comparison.

## Deployment

Deployed the rebuilt static site with:

```sh
swa deploy dist/site --app-name sf-dictation-repair-book --resource-group sociobot --env production --no-use-keychain
```

The CLI-created local credential file was removed immediately after deployment and was not committed. The repair changes the static landing/legal surface and its regression suite only; the existing `v0.1.4` desktop release remains the published multi-platform artifact. Desktop builds are intentionally unsigned, as disclosed on the landing page and in the README.

## Known gaps and next steps

No release-blocking gaps remain. Code signing and macOS notarization remain optional operator work requiring owner certificates; no certificate or signing secret is stored in this repository.
