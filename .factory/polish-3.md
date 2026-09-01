# Polish round 3

Repair base: `68dff62068353eddcffb3a8c2f44852cd224df77` (review record `4aacb4324bcf7a7b15600a5c887ba2555427255f`). This round rechecks every finding from reviews 1–3. Evidence paths below are produced by the final clean-clone and cold-live checks in `.factory/qa-evidence/polish-3/`.

| Finding | Change made or retained repair | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the demo banner in normal document flow on phones, below shared chrome and above the active heading. | E2E `demo banner does not cover the active heading on a 390px phone`; `live-demo-390.png`; `/demo/?demo=1` |
| F-1-2 | Kept real demo view URLs, history restoration, heading focus, title updates, and route announcement. | E2E `demo sections deep-link, restore with history, announce, and focus their h1`; `live-demo-390.png`; `/demo/?view=test` |
| F-1-3 | Kept the in-memory native sample guards and four captioned desktop walkthrough frames. | `@claim:native-sample-isolation`; `live-landing-desktop.png`; `/` |
| F-1-4 | Kept labelled, keyboard-focusable installer command regions with visible focus. | E2E `landing page is accessible`; `live-a11y.json`; `/` at 390 px |
| F-1-5 | Kept valid route normalization and constructed 404 responses in the service worker. | E2E `service-worker controlled route variants keep valid pages online and offline`; `live-route-check.json`; `/not-a-real-page` |
| F-1-6 | Kept production vault round-trip coverage that rejects plaintext on disk. | `@claim:encrypted-vault`; `claim-run.log`; native vault fixture |
| F-1-7 | Moved the exact claim tag to the executable PowerShell fixture; claims and the full gate now run `pwsh -NoLogo -NoProfile -File tests/installers.ps1`. The Node file is only an explicitly non-claim static smoke check. | `@claim:powershell-checksum-installer`; `claim-run.log`; shipped `/install.ps1` |
| F-1-8 | Kept fixture-based release preparation and hash-manifest assertions. | `@claim:release-matrix`; `claim-run.log`; GitHub release workflow |
| F-1-9 | Kept byte-for-byte real-storage isolation through demo reset and exit. | `@claim:demo-sandbox`; `live-demo-390.png`; `/demo/?demo=1` |
| F-1-10 | Kept account-free sample entry and repair flow. | `@claim:no-account`; `live-demo-390.png`; `/demo/?demo=1` |
| F-1-11 | Kept the narrow, accurate pasted-text repair promise. | `@claim:local-repair`; `live-landing-desktop.png`; `/` |
| F-1-12 | Kept longest-approved-rule-first matching. | `@claim:longest-rule-first`; `claim-run.log`; local fixture |
| F-1-13 | Kept production random 32-byte local-key coverage. | `@claim:per-device-key`; `claim-run.log`; native fixture |
| F-1-14 | Kept Unix mode-0600 local-key coverage. | `@claim:per-device-key`; `claim-run.log`; native fixture |
| F-1-15 | Kept the OS-user-boundary wording instead of a broad backup-security promise. | README privacy audit; `claim-run.log`; `/privacy/` |
| F-1-16 | Kept merchant-of-record wording absent and free/export wording claim-backed. | `@claim:free-book`; `live-landing-desktop.png`; `/terms/` |
| F-1-17 | Kept request capture limited to the license token. | `@claim:license-request-privacy`; `claim-run.log`; `/privacy/` |
| F-1-18 | Kept tested demo and license-request privacy wording. | `@claim:private-demo`, `@claim:website-privacy`; `live-route-check.json`; `/privacy/` |
| F-1-19 | Kept the unsupported reproducibility promise removed. | README copy audit; `claim-run.log`; repository README |
| F-1-20 | Kept unsigned-build disclosure and its inventory-backed regression. | `@claim:unsigned-build`; `live-landing-desktop.png`; `/` |
| F-1-21 | Kept distinct wording for checksum-verifying commands versus checksums published beside downloads. | `@claim:checksum-installers`, `@claim:powershell-checksum-installer`; `live-landing-desktop.png`; `/` |
| F-1-22 | Kept the task-focused repair-to-rule first-screen headline. | E2E `landing page fits a 390px phone`; `live-landing-390.png`; `/` |
| F-1-23 | Kept plain, concrete wording about fields and keystrokes. | copy audit; `live-landing-390.png`; `/` |
| F-1-24 | Kept saved-correction workflow copy without recognizer generalizations. | `@claim:local-repair`; `live-landing-desktop.png`; `/` |
| F-1-25 | Kept the storage-boundary privacy section heading. | E2E `every public route has complete metadata and one semantic page heading`; `live-landing-desktop.png`; `/privacy/` |
| F-1-26 | Kept the FAQ heading and export/deletion question specific. | copy audit; `live-landing-desktop.png`; `/#limits` |
| F-1-27 | Kept download and license controls named for their immediate result. | E2E `landing page is accessible`; `live-landing-desktop.png`; `/` |
| F-1-28 | Kept **rule** and **repair book** terminology consistent. | copy audit; `live-demo-390.png`; `/demo/?demo=1` |
| F-1-29 | Kept privacy, offline, and price facts above the 390×844 fold with one primary action. | E2E `landing page fits a 390px phone`; `live-landing-390.png`; `/` |
| F-1-30 | Kept shared header/footer, one visible h1, and legal links on demo and public routes. | E2E `every public route has complete metadata and one semantic page heading`; `live-route-check.json`; `/demo/?demo=1` |
| F-2-1 | Kept the public and checkout price aligned at $12 USD. | `@claim:checkout-price`; `live-landing-desktop.png`; checkout intent from `/` |
| F-2-2 | Kept build-output inventory and assertion for both app and static roots. | `@claim:build-output`; `claim-run.log`; local build |
| F-2-3 | Kept release tag/source/version refusal coverage. | `@claim:release-source-identity`; `claim-run.log`; release workflow |
| F-2-4 | Kept approved entries named rules and their collection named a repair book. | copy audit; `live-demo-390.png`; `/demo/?demo=1` |
| F-2-5 | Kept realistic sample source labels, Notes and VS Code. | `@claim:portable-exports`; `live-demo-390.png`; `/demo/?demo=1` |
| F-2-6 | Kept concrete local/export/erase language in place of absolute slogans. | copy audit; `live-landing-desktop.png`; `/` |
| F-2-7 | Kept the contextual heading “Product limits and compatibility.” | copy audit; `live-landing-desktop.png`; `/#limits` |
| F-2-8 | Kept internal release-repair jargon out of public footers. | public-footer source check; `live-landing-desktop.png`; `/` |
| F-2-9 | Kept explicit version-file and release-workflow instructions in README. | README release section; `claim-run.log`; repository README |
| F-2-10 | Kept semantic anchors for demo section navigation. | E2E `demo sections deep-link, restore with history, announce, and focus their h1`; `live-demo-390.png`; `/demo/?view=rules` |
| F-2-11 | Kept concrete privacy text covering typing, fields, and audio. | copy audit; `live-landing-desktop.png`; `/privacy/` |
| F-3-1 | Removed the untestable public hero-art provenance sentence. Required asset provenance remains in `.factory/design.md`. | `copy-audit.md`; `live-landing-desktop.png`; `/` |

No finding remains open. The final claim run, full suite, deployment check, cold route check, accessibility check, and screenshots are recorded in the handoff.
