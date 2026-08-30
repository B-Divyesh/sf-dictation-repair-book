# Polish round 2

Repair base: `1d6f385e50380874ac418bfca9d2fe5547b488c6`. This table closes every finding in `.factory/review-1.md` and `.factory/review-2.md`; the commands and captures named below are rerun from the committed repair and clean clone before handoff.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the demo banner in normal mobile flow, now below compact shared chrome. | `demo banner does not cover the active heading on a 390px phone`; `qa-evidence/polish-2/local-demo-mobile.png` |
| F-1-2 | Demo section controls are real hash links; direct load, history, focus, titles, and announcements remain guarded. | `demo sections deep-link, restore with history, announce, and focus their h1` |
| F-1-3 | Native sample now blocks every real vault/license path; its Settings erase resets sample data only and purchase controls are unavailable. | `@claim:native-sample-isolation` IPC-spy browser test |
| F-1-4 | Scrollable installer commands remain focusable and labelled. | `landing page is accessible` Axe check |
| F-1-5 | Worker normalizes slashless valid routes before cache lookup while preserving constructed 404 responses for unknown routes. | `service-worker controlled route variants keep valid pages online and offline`; unknown-route test |
| F-1-6 | Production-vault round-trip encryption test remains in place. | `cargo test … claim_encrypted_vault_uses_aes_256_gcm` |
| F-1-7 | PowerShell installer executes matching and mismatch paths. | `pwsh -NoLogo -NoProfile -File tests/installers.ps1` |
| F-1-8 | Fixture bundles exercise actual release preparation and manifest hashes. | `@claim:release-matrix` |
| F-1-9 | Browser demo compares the real-state sentinel before reset and exit. | `@claim:demo-sandbox` |
| F-1-10 | Clean-context demo use without sign-in remains tested. | `@claim:no-account` |
| F-1-11 | Public copy promises pasted-text repair rather than universal tool compatibility. | copy audit; `@claim:local-repair` |
| F-1-12 | Longest whole-term rule wins before shorter overlap. | `@claim:longest-rule-first` |
| F-1-13 | Native key is tested as random and 32 bytes. | `@claim:per-device-key` |
| F-1-14 | Unix native-key permission remains tested as 0600. | `@claim:per-device-key` |
| F-1-15 | Privacy text states the OS-user boundary, not an overbroad backup promise. | README privacy audit |
| F-1-16 | Removed the remaining “Sociobot/Dodo is merchant of record” assertion from Settings. | `@claim:checkout-price`; Settings browser capture |
| F-1-17 | License-request capture remains limited to the token. | `@claim:license-request-privacy` |
| F-1-18 | Demo and website egress boundaries remain independently tested. | `@claim:private-demo`, `@claim:website-privacy` |
| F-1-19 | README has no reproducibility promise. | copy audit |
| F-1-20 | Unsigned-build disclosure remains inventory-backed. | `@claim:unsigned-build` |
| F-1-21 | Command checksum and direct-download checksum copy remain distinct. | installer claim tests |
| F-1-22 | First-screen heading remains the explicit repair job. | first-screen 390/desktop checks |
| F-1-23 | First-screen privacy fact uses fields and keystrokes language. | copy audit |
| F-1-24 | Workflow language describes saved corrections and local replacements. | `@claim:local-repair` |
| F-1-25 | Storage-boundary privacy heading is retained. | landing metadata/accessibility test |
| F-1-26 | Export/deletion FAQ is named plainly. | copy audit |
| F-1-27 | Download and license actions name their immediate result. | landing interaction checks |
| F-1-28 | README terminology remains correction, rule, and repair book. | copy audit |
| F-1-29 | Three required facts sit directly after Try sample; mobile CSS reserves them above the fold. | `landing page fits a 390px phone` rectangle assertion |
| F-1-30 | Demo now has the same compact global header/footer and four primary links as every public route. | `every public route has complete metadata and one semantic page heading`; local/live captures |
| F-2-1 | Aligned every public and app price to the live $12 USD checkout; added read-only checkout assertion and outage-safe recorded session evidence. | `@claim:checkout-price`; `tests/fixtures/checkout-session-12.json` |
| F-2-2 | Added a build-output claim that runs the build and asserts both entry documents. | `@claim:build-output` |
| F-2-3 | Inventoried and tagged release source/version refusal. | `@claim:release-source-identity` |
| F-2-4 | Replaced “vocabulary” and “rule book” UI labels with Approved rules and repair book. | copy audit; demo title test |
| F-2-5 | Sample application labels are Notes and VS Code. | `@claim:portable-exports`; demo fixture |
| F-2-6 | Replaced absolute tape slogans with specific repair-book, export, and erase boundaries. | landing copy audit |
| F-2-7 | FAQ heading is Product limits and compatibility. | landing heading outline |
| F-2-8 | Removed the internal “release repair” label; public footers now show only the release version. | public-footer source check |
| F-2-9 | README now says which three versions to align and how to run the release workflow. | README copy audit |
| F-2-10 | Demo route navigation is semantic anchors, not buttons. | deep-link/history test |
| F-2-11 | Privacy list says the app does not record typing, read other fields, or keep audio. | landing copy audit |

Live evidence is appended in `.factory/handoff.md` after the deployment check.
