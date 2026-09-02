# Polish round 4

Repair base: `986b2bcd62784cef5aa0f1978e60597369f6a1e0`. Product repair and release source: `e3fa407cc2be1bfa4521be618a8130f730c89db0`. This retry re-read every review and polish record, retained every earlier repair, and made the installer gate portable without removing the real Windows test. Fresh live evidence is under `.factory/qa-evidence/polish-4-retry1/live/`. The exact route, focus, announcement, mobile, Axe, privacy, and offline states are in `live-recheck.json`; cold captures are `live-landing-desktop.png`, `live-landing-390.png`, `live-demo-desktop.png`, and `live-demo-390.png`.

| Finding | Change made or retained repair | Evidence |
| --- | --- | --- |
| F-1-1 | The demo banner stays in normal mobile flow above the active work header. | E2E `demo banner does not cover the active heading on a 390px phone`; `live/live-demo-390.png`; live `/demo/?demo=1`. |
| F-1-2 | `popstate` now resolves a demo URL without `view` to the default Rules page. Back restores Rules URL, h1 focus, and announcement; Forward restores Test. | E2E `browser Back restores the default demo Rules view and Forward restores Test`; `back-regression.log`; `live/live-demo-desktop.png`; live state values in `live/live-recheck.json`; `/demo/?demo=1`. |
| F-1-3 | The installed app retains its isolated in-memory sample book, guarded vault/license paths, first-run load action, and four captioned app captures. | `@claim:native-sample-isolation`; `clean-clone/claim-run.log`; `live/live-landing-desktop.png`; live `/#walkthrough`. |
| F-1-4 | Installer commands remain labelled, focusable scroll regions with visible focus. | E2E `landing page is accessible`; mobile Axe in `live/live-a11y.json`; `live/live-landing-390.png`; live `/`. |
| F-1-5 | The service worker retains valid route variants and constructs 404 responses for unknown routes online and offline. | E2E `service-worker controlled unknown routes keep their 404 status online and offline`; `live/live-route-check.json`; live `/polish-four-missing-page` = 404. |
| F-1-6 | The encryption claim still saves and loads through the production vault and rejects plaintext on disk. | `@claim:encrypted-vault`; `clean-clone/claim-run.log`; `live/live-landing-desktop.png`; live `/privacy/`. |
| F-1-7 | The Linux claim gate now checks the shipped checksum-before-launch control flow and required CI wiring without requiring `pwsh`. Real Windows CI executes the shipped installer against matching, mismatching, and missing checksums; only the verified MSI reaches the launcher. | `npm run test:installer-contract`; `npm run test:installer-windows`; [quality run 33577027016](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33577027016); [release run 33577561255](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33577561255); live `/install.ps1`. |
| F-1-8 | Release preparation still runs against fixture bundles and validates the generated manifest and hashes. | `@claim:release-matrix`; `clean-clone/claim-run.log`; `live/release-summary.json`; live release API check. |
| F-1-9 | Reset and exit still preserve byte-identical real storage while deleting only demo state and demo license keys. | `@claim:demo-sandbox`; `clean-clone/claim-run.log`; `live/live-demo-desktop.png`; live `/demo/?demo=1`. |
| F-1-10 | A clean visitor can open and use the sample without an account. | `@claim:no-account`; `clean-clone/claim-run.log`; `live/live-demo-390.png`; live `/demo/?demo=1`. |
| F-1-11 | Compatibility copy remains limited to pasted transcript text and local approved replacements. | `@claim:local-repair`; `.factory/copy-audit.md`; `live/live-landing-desktop.png`; live `/#limits`. |
| F-1-12 | Overlapping approved rules still run longest first. | `@claim:longest-rule-first`; `clean-clone/claim-run.log`; `live/live-demo-desktop.png`; live `/demo/?view=test`. |
| F-1-13 | Native tests still prove fresh vault directories get distinct random 32-byte keys. | `@claim:per-device-key`; `clean-clone/claim-run.log`; `live/live-landing-desktop.png`; live `/privacy/`. |
| F-1-14 | The same production-key test still verifies Unix mode `0600`. | `@claim:per-device-key`; `clean-clone/claim-run.log`; live `/privacy/`. |
| F-1-15 | Privacy wording remains bounded to the OS-user threat boundary. | `.factory/copy-audit.md`; native claim log; `live/live-landing-desktop.png`; live `/privacy/`. |
| F-1-16 | Merchant-of-record and untested free-access assertions remain absent; free rules and exports are claim-backed. | `@claim:free-book`; `@claim:portable-exports`; `live/live-landing-desktop.png`; live `/#price` and `/terms/`. |
| F-1-17 | License verification remains limited to the token, without repair-book text. | `@claim:license-request-privacy`; `clean-clone/claim-run.log`; live `/privacy/`. |
| F-1-18 | Public privacy wording remains limited to tested demo and license-request boundaries. | `@claim:private-demo`; `@claim:website-privacy`; `live/live-recheck.json`; live `/privacy/`. |
| F-1-19 | The unsupported reproducible-build promise remains absent. | `.factory/copy-audit.md`; `clean-clone/full-test.log`; live `/`. |
| F-1-20 | Unsigned builds remain disclosed and inventory-tested. | `@claim:unsigned-build`; `live/live-landing-desktop.png`; live `/#install`. |
| F-1-21 | Install commands promise verification; direct downloads promise a published checksum. | `@claim:checksum-installers`; `@claim:powershell-checksum-installer`; `live/release-check.log`; live `/#install`. |
| F-1-22 | The first-screen h1 remains the exact correction-to-rule job. | E2E `the sample action and its result stay inside the first desktop viewport`; `live/live-landing-390.png`; live `/`. |
| F-1-23 | First-screen privacy text continues to name fields and keystrokes plainly. | `.factory/copy-audit.md`; `live/live-landing-390.png`; live `/`. |
| F-1-24 | Workflow copy describes saved corrections and local replacements without recognizer generalisations. | `@claim:local-repair`; `.factory/copy-audit.md`; `live/live-landing-desktop.png`; live `/#how`. |
| F-1-25 | The privacy heading remains “How the app stores your repair book.” | E2E metadata/outline checks; `live/live-landing-desktop.png`; live `/#privacy`. |
| F-1-26 | The FAQ question explicitly names export and deletion. | `.factory/copy-audit.md`; `live/live-landing-desktop.png`; live `/#limits`. |
| F-1-27 | Download and license controls still name their immediate result. | E2E `landing page is accessible`; `live/live-landing-desktop.png`; live `/#install` and `/#price`. |
| F-1-28 | Visitor and README terminology consistently uses **rule** and **repair book**. | `.factory/copy-audit.md`; `live/live-demo-390.png`; live `/demo/?demo=1`. |
| F-1-29 | Privacy, offline, and price facts remain inside the 390×844 first screen; Try is the sole primary action. | E2E `landing page fits a 390px phone`; `live/live-landing-390.png`; live `/`. |
| F-1-30 | Demo and public routes retain shared navigation/footer, legal links, one visible h1, and route-specific metadata. | E2E `every public route has complete metadata and one semantic page heading`; `live/live-route-check.json`; live `/`, `/demo/`, `/privacy/`, `/terms/`. |
| F-2-1 | Public and checkout prices remain aligned at $12 USD once. | `@claim:checkout-price`; `clean-clone/claim-run.log`; `live/live-landing-desktop.png`; live `/#price`. |
| F-2-2 | The build-output claim still runs production builds and asserts both app and site roots. | `@claim:build-output`; `clean-clone/build.log`; live `/`. |
| F-2-3 | Release tag/source/version refusal remains inventoried and tested. | `@claim:release-source-identity`; `clean-clone/claim-run.log`; `live/release-summary.json`. |
| F-2-4 | Saved entries remain rules; their collection remains the repair book. | `.factory/copy-audit.md`; `live/live-demo-390.png`; live `/demo/?demo=1`. |
| F-2-5 | Sample sources remain the realistic labels Notes and VS Code. | `@claim:portable-exports`; `live/live-demo-desktop.png`; live `/demo/?demo=1`. |
| F-2-6 | Tape and privacy copy remain concrete about local storage, export, and erase boundaries. | `.factory/copy-audit.md`; `live/live-landing-desktop.png`; live `/`. |
| F-2-7 | The FAQ heading remains “Product limits and compatibility.” | E2E heading checks; `live/live-landing-desktop.png`; live `/#limits`. |
| F-2-8 | Internal release-repair wording remains absent from public footers. | `.factory/copy-audit.md`; `live/live-landing-390.png`; live `/`. |
| F-2-9 | README still names the three version files and tag-based release procedure. | `@claim:release-source-identity`; `clean-clone/claim-run.log`; live release check in `live/release-summary.json`. |
| F-2-10 | Demo section navigation remains semantic links with real query URLs. | E2E route-history tests; `live/live-demo-desktop.png`; live `/demo/?demo=1&view=test`. |
| F-2-11 | Privacy copy still states that the app does not record typing, read other fields, or keep audio. | `@claim:explicit-access`; `.factory/copy-audit.md`; `live/live-landing-desktop.png`; live `/#privacy`. |
| F-3-1 | The untestable public artwork-provenance sentence remains absent; source provenance stays in `.factory/design.md`. | E2E/live verifier absence assertion; `.factory/copy-audit.md`; `live/live-landing-desktop.png`; live `/`. |
| C-4-1 | Removed unconditional `pwsh` from `npm test`; added a portable source/CI contract and dedicated Windows job, while keeping the executable PowerShell fixture mandatory in quality and release CI. | Fresh-clone `npm test`; `@claim:powershell-checksum-installer`; Windows output “PowerShell installer checksum match, mismatch, and missing-checksum paths passed” in runs 33577027016 and 33577561255. |

## Final evidence

- All 34 `.factory/claims.json` commands passed separately from a fresh clone at `e3fa407cc2be1bfa4521be618a8130f730c89db0`.
- That clone passed `npm test` (27 Vitest, portable installer contract, four Rust tests, 46 Playwright tests), typecheck, lint, build, Cargo check, and Cargo formatting. The first browser rerun encountered a Chromium process crash; the focused lifecycle test and the complete rerun both passed, and Linux CI passed independently.
- GitHub quality run [33577027016](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33577027016) passed both the Linux product suite and the real Windows PowerShell fixture.
- Release run [33577561255](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33577561255) passed all four platform jobs and published [v0.1.11](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.11) with all required assets.
- Static deployment `4b4d461c-0799-4578-a888-95c49b8d182c` passed the cold verifier. All 36 public build files match `dist/site` byte-for-byte.
- Fresh live evidence: `.factory/qa-evidence/polish-4-retry1/live/`. Lighthouse mobile scores are Performance 100, Accessibility 100, Best Practices 100, and SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms.
- The v0.1.11 Linux DEB passed `sha256sum -c`; `latest.json` and `build-info.json` name the exact release commit. The live detected-platform action resolves to the v0.1.11 AppImage with no console error.
- No finding remains unresolved.
