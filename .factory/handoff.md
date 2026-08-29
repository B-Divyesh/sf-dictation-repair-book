# Repair handoff — PASS

**Repaired verifier report:** `.factory/verification-4.md` (original candidate `7c8df71269c779c09e21ac667adf85bbd00bbfa0`)

**Released product commit:** `cdfcf3eb76694aacefc952d43c77842d50d3128a`

**Desktop release:** [`v0.1.3`](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.3)

**Live site:** <https://dictation-repair-book.sociobot.in>

**Verified:** 2026-08-29 UTC

## Result

**PASS.** The release-blocking mismatch is repaired. The published desktop release is the uniquely versioned `v0.1.3` tag at `cdfcf3eb76694aacefc952d43c77842d50d3128a`; its manifest and `build-info.json` carry that same exact commit. The live download button resolves to the new release asset.

## What changed

- Bumped the app, Tauri, Cargo, package-lock, desktop UI, and static-site release surfaces from `0.1.2` to `0.1.3`.
- Added `scripts/verify-release.mjs`. Release jobs now reject a tag unless it is the checked-out commit and all three version sources agree with the tag.
- Made manual dispatch check out the supplied existing tag, rather than implicitly building a branch tip.
- Added commit identity to `latest.json` and new `build-info.json`; production desktop builds also receive the tag and commit for the app’s build identity.
- Added exact regression coverage for both failure modes: version disagreement and a source commit made after the tag. Extended the release-matrix test to require commit-bearing manifest/build metadata.

## Verification

Clean install and automated checks:

- `npm ci` — passed; 168 packages installed; `npm audit` reported 0 vulnerabilities.
- Every exact `.factory/claims.json` command — **28/28 passed** individually. This includes the PowerShell installer fixture under temporary PowerShell 7.5.4.
- `npm test` — passed: 17 Vitest tests and 33 Playwright tests.
- `npm run typecheck` and `npm run lint` — passed.
- `npm run build` — passed and emitted `dist/app/` plus `dist/site/`. Largest initial app JS is 9.59 KB gzip; landing JS is 1.52 KB gzip plus 0.44 KB preload; landing CSS is 3.07 KB gzip.
- `cargo test --manifest-path src-tauri/Cargo.toml` — passed: 4/4.
- `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo check --manifest-path src-tauri/Cargo.toml` — passed after installing the exact Linux GUI development packages from the release workflow.
- `node scripts/verify-release.mjs v0.1.3` — passed and emitted tag/version/commit identity for `cdfcf3e`.

Desktop artifact and release verification:

- GitHub Actions run [`33271865055`](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33271865055) completed successfully for macOS arm64/x64, Windows x64, Linux x64, and release publication.
- Release `v0.1.3` contains six desktop bundles, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- `latest.json` and `build-info.json` both name `v0.1.3` and `cdfcf3eb76694aacefc952d43c77842d50d3128a`.
- The downloaded Linux DEB SHA-256 is `968ea39cbe3f07d5a655518b2539c4ad09519b981b2081e9eb7a1be69c49102e`, matching the published checksum. `dpkg-deb -f` reports `dictation-repair-book` version `0.1.3`, architecture `amd64`.
- The extracted DEB stayed running under Xvfb for the intentional 12-second timeout and wrote no stderr.

Live deployment and product QA:

- Deployed `dist/site/` to the existing Azure Static Web App; the custom domain returned HTTPS 200.
- Fresh SHA-256 comparisons found exact local/live matches for `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/sw.js`.
- `/opt/fleet/lib/verify-url.sh https://dictation-repair-book.sociobot.in .factory/qa-evidence/repair-3` passed: title, `lang=en`, one `<h1>`, one `<main>`, image alt text, labelled buttons, and no console/page errors. Evidence: `verify.json`, desktop screenshot, mobile screenshot, and captured HTML in `.factory/qa-evidence/repair-3/`.
- Live browser smoke: landing made requests only to the product origin plus the disclosed GitHub Releases API; demo made same-origin requests only. The live demo loaded offline after the first visit with HTTP 200 and the Kubernetes sample.
- At 390 px, dark/reduced-motion demo width was exactly 390 px, computed scrolling was `auto`, and Reset demo was 44 px high. Keyboard activation reached Settings. Playwright Axe found zero serious/critical findings on the live landing and demo; the permanent Playwright suite covers all public routes.
- The live release chooser now shows **Download for Linux AppImage**, points at the `v0.1.3` release asset, and says `v0.1.3 · checksum published · unsigned build` with no console errors.

## Known gaps and next steps

No known product gaps remain from verification 4. Desktop bundles are intentionally unsigned, as disclosed on the landing page and in the README. Code signing/notarization remains optional operator work requiring the owner’s signing certificates; it is not needed for the repaired release to install with the documented operating-system confirmation flow.
