# Adversarial first-read review 6 — FAIL

Reviewed 2026-09-02 UTC against commit `a78d4467c8cda12a4c42d0d326d0af28cf46baf7` and <https://dictation-repair-book.sociobot.in>. The cold review used fresh Chromium contexts at 390×844 and 1440×900 before scrolling. No product code, deployment, billing, or infrastructure was changed.

## Verdict

**FAIL — one blocking and five minor findings remain.** The product is clear on first read, and its realistic one-click demo is isolated and useful. All 34 declared claim commands exit successfully from a clean clone. The verdict remains FAIL because the declared PowerShell claim test does not execute the shipped PowerShell installer, one previously reported responsive overflow remains, three landing-copy details do not meet the attached plain-words contract, and one README sentence exceeds the hard cap.

## 1. Cold first screen

No scrolling occurred before this assessment.

| Viewport | What it does | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Turns explicit dictation corrections into reusable replacement rules. | Dictation users whose names, medications, code terms, or workplace jargon are misheard. | **Try it with sample data**. | Pass |
| 1440×900 | The same correction-to-rule job, reinforced by the marked-up ledger art. | The same named audience. | **Try it with sample data**. | Pass |

The exact useful text is “Turn dictation corrections into reusable rules.”, “For dictation users with names, medications, code terms, or workplace jargon.”, and “Try it with sample data”. The action explains its result: “Opens a separate sample repair book. Nothing enters your real book.” At 390×844, the three privacy/offline/price facts end at y=607, before the fold. This section has no blocking first-read finding.

## 2. Findings

### Blocking

#### F-1-7 — Reopened: the declared PowerShell claim test does not execute PowerShell

- **Exact quote/location:** `.factory/claims.json`, `powershell-checksum-installer`: `"test": "npm run test:installer-contract"`; `tests/installers.mjs`: `// @claim:powershell-checksum-installer`.
- **Observed result:** the declared command passes, but it reads `public/install.ps1` as text, checks required substrings and their order, and confirms that two workflow files mention `npm run test:installer-windows`. It never invokes `public/install.ps1`. The executable fixture exists in `tests/installers.ps1`, but the declared claim command does not run it.
- **Why this fails:** the claim promises that the PowerShell installer verifies SHA-256 and refuses a mismatch before launching MSI installation. A source-order check cannot observe PowerShell parsing, variable expansion, mocked download behavior, mismatch deletion, or whether `Start-Process` is withheld. Review 3 identified this exact defect; review 4 verified it only after the claim command actually ran PowerShell. The later portable-contract change therefore half-fixed and regressed F-1-7. The history rule makes it blocking under the same id.
- **Concrete fix:** make the `powershell-checksum-installer` entry run the shipped executable fixture, such as `pwsh -NoLogo -NoProfile -File tests/installers.ps1`, in a declared Windows/PowerShell sandbox. Keep `tests/installers.mjs` as an additional portable source check, not the observable claim test. Ensure the clean claim harness fails when the executable fixture is skipped.

### Minor

#### F-6-1 — The demo Settings page overflows horizontally at intermediate widths

- **Exact location:** live `/demo/?demo=1&view=settings`; `src/style.css:135` and the phone breakpoint at `src/style.css:170`.
- **Observed result:** at 620px the document width is 620px. At 621px it becomes 725px; at 640px it is 726px; at 700px it is 728px. The two-column `.settings-section` resumes above 620px with minimum columns of 240px and 300px plus a 48px gap, while the 88px rail still consumes horizontal space. Content is clipped until the visitor scrolls sideways. This independently confirms handoff defect `DRB-QA-15-01`.
- **Why this fails:** a narrow tablet, split-screen window, or zoomed desktop cannot read Settings in its viewport. Mobile support is not limited to one 390px test width.
- **Concrete fix:** keep Settings in one column until the available work-surface width can contain both minimum columns, or remove the fixed minimums. Add assertions at 621px, 640px, 700px, and the repaired breakpoint that `scrollWidth === clientWidth` on every demo route.

#### F-6-2 — The hero uses two supporting sentences instead of the required single sentence

- **Exact quote/location:** landing hero: “For dictation users with names, medications, code terms, or workplace jargon. Turn explicit corrections into rules you can inspect and reuse.”
- **Why this fails:** both sentences are individually clear, but the attached first-screen contract requires one sentence that states who the product is for and what changes. A cold visitor has to join two fragments to get the complete proposition.
- **Concrete rewrite:** “For dictation users with uncommon names, medications, code terms, or workplace jargon, this turns explicit corrections into reusable rules.” (19 words)

#### F-6-3 — “Changed span” is avoidable text-processing jargon

- **Exact quote/location:** landing How it works, Inspect the proposal: “The app isolates the changed span.”
- **Why this fails:** “span” is an implementation term, not the user’s description of edited words. It slows the scan and does not explain the visible outcome.
- **Concrete rewrite:** “The app finds the changed words.”

#### F-6-4 — The landing privacy fact is only cryptography jargon

- **Exact quote/location:** landing privacy list: “AES-256-GCM vault stored on your device.”
- **Why this fails:** the sentence contains an unexplained algorithm name and the metaphor “vault”. The surrounding section already says the repair book is encrypted, so this line adds terminology rather than a first-read fact.
- **Concrete rewrite:** “The native app encrypts the repair-book file before saving it on your device.” Keep the exact AES-256-GCM detail on the Privacy page and in the technical README.

#### F-6-5 — A README sentence exceeds the 22-word hard cap

- **Exact quote/location:** README, Test and build: “The native privacy test target is intentionally GUI-free, so it also runs from a clean Linux clone without GTK or WebKit development metadata.” (23 words)
- **Why this fails:** the sentence combines the test architecture, platform, clean-clone behavior, and missing system packages. It cannot be absorbed in one quick read and exceeds the attached hard cap.
- **Concrete rewrite:** “The native privacy tests do not need a graphical interface. They run from a clean Linux clone without GTK or WebKit development metadata.”

## 3. Copy audit

Counts use whitespace-separated words; hyphenated terms, acronyms, version strings, and code-format names count as one word. Navigation labels, dates, commands, and prices are labels rather than sentences and are checked after the tables. One README sentence exceeds 22 words (F-6-5); no landing sentence does. The landing flags are F-6-2 through F-6-4; the PowerShell claim sentences are affected by F-1-7.

### Landing-page sentences and sentence-like headings

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn dictation corrections into reusable rules. | 6 | Pass |
| 2 | For dictation users with names, medications, code terms, or workplace jargon. | 11 | F-6-2 |
| 3 | Turn explicit corrections into rules you can inspect and reuse. | 10 | F-6-2 |
| 4 | Opens a separate sample repair book. | 6 | Pass |
| 5 | Nothing enters your real book. | 5 | Pass |
| 6 | No audio or account. | 4 | Pass |
| 7 | Demo works offline after one visit. | 6 | Pass |
| 8 | 25 approved rules are free; pay $12 once for unlimited rules. | 11 | Pass |
| 9 | Checks the latest build when you choose a download. | 9 | Pass |
| 10 | No background monitoring of fields or keystrokes. | 7 | Pass |
| 11 | Explicit edit → inspectable rule. | 5 | Pass |
| 12 | Before → after → approve → reuse. | 7 | Pass |
| 13 | Repair-book text stays on this device. | 6 | Pass |
| 14 | Export CSV or JSON. | 4 | Pass |
| 15 | Erase the vault, key, and license data. | 7 | Pass |
| 16 | Save corrections for later clipboard text. | 6 | Pass |
| 17 | Save a correction once, then apply the approved rule to later clipboard text. | 13 | Pass |
| 18 | Create a reusable rule in three steps. | 7 | Pass |
| 19 | Capture your edit. | 3 | Pass |
| 20 | Copy the original dictation and your corrected sentence. | 8 | Pass |
| 21 | Capture happens only when you click. | 6 | Pass |
| 22 | Inspect the proposal. | 3 | Pass |
| 23 | The app isolates the changed span. | 6 | F-6-3 |
| 24 | Approve it, or discard it without saving anything. | 8 | Pass |
| 25 | Reuse your book. | 3 | Pass |
| 26 | Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 | Pass |
| 27 | See the installed repair book at work. | 7 | Pass |
| 28 | Paste the original and corrected sentence. | 6 | Pass |
| 29 | Inspect approved rules and their sources. | 6 | Pass |
| 30 | Run approved rules on later clipboard text. | 7 | Pass |
| 31 | Keep a portable copy or remove local data. | 8 | Pass |
| 32 | How the app stores your repair book. | 7 | Pass |
| 33 | The desktop app encrypts the repair book on your device. | 10 | Pass |
| 34 | AES-256-GCM vault stored on your device. | 6 | F-6-4 |
| 35 | Name and enable each application yourself. | 6 | Pass |
| 36 | The app does not record typing, read other fields, or keep audio. | 12 | Pass |
| 37 | Export anytime. | 2 | Pass |
| 38 | Erase the vault and key in one action. | 8 | Pass |
| 39 | Install the desktop app. | 4 | Pass |
| 40 | The install commands verify SHA-256 checksums. | 6 | F-1-7 for PowerShell coverage |
| 41 | Direct downloads include a published checksum. | 6 | Pass |
| 42 | Builds are unsigned, so your operating system may ask you to confirm the first launch. | 15 | Pass |
| 43 | Pay once for more approved rules. | 6 | Pass |
| 44 | Start with 25 approved rules, testing, and every export for free. | 11 | Pass |
| 45 | Unlock unlimited approvals once—no subscription. | 5 | Pass; “unlock” is literal license behavior |
| 46 | One-time purchase. | 2 | Pass |
| 47 | A refunded license no longer permits paid approvals. | 8 | Pass |
| 48 | Product limits and compatibility. | 4 | Pass |
| 49 | Does it record or transcribe audio? | 6 | Pass |
| 50 | No. | 1 | Pass |
| 51 | It repairs transcript text from dictation tools you already use. | 10 | Pass |
| 52 | Audio never enters the app. | 5 | Pass |
| 53 | Does it watch everything I type? | 6 | Pass |
| 54 | No. | 1 | Pass |
| 55 | You opt in to named source applications and click “Paste clipboard” for each capture. | 14 | Pass |
| 56 | v0.1 does not monitor fields or keystrokes. | 7 | Pass |
| 57 | Which engines does it support? | 5 | Pass |
| 58 | Paste text from your dictation tool, then run approved replacements locally. | 11 | Pass |
| 59 | Exports include CSV, JSON backup, and a vocabulary prompt for Whisper-compatible workflows. | 12 | Pass |
| 60 | Can I export and delete my data? | 7 | Pass |
| 61 | Yes. | 1 | Pass |
| 62 | Exports are never paywalled. | 4 | Pass |
| 63 | You can erase the encrypted vault and its local key at any time. | 13 | Pass |
| 64 | Private rules for repaired dictation text. | 6 | Pass |
| 65 | Built by Param Factory. | 4 | Pass |

Dynamic landing states were also audited:

| Sentence or status | Words | Result |
| --- | ---: | --- |
| Downloads are being published. | 4 | Pass |
| No published installer was found. | 5 | Pass |
| Check the releases page shortly. | 5 | Pass |
| You appear offline. | 3 | Pass |
| You are offline. | 3 | Pass |
| The sample repair book remains available after its first visit. | 10 | Pass |
| License saved. | 2 | Pass |
| Open the desktop app to use unlimited rules. | 8 | Pass |
| That license is not active for this product. | 8 | Pass |
| Could not verify while offline. | 5 | Pass |
| The token is saved for the app to check later. | 10 | Pass |

### README sentences and sentence-like list items

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn explicit dictation corrections into private reusable rules. | 8 | Pass |
| 2 | It is for people whose names, medication spellings, code terms, and workplace jargon need careful repair after dictation. | 18 | Pass |
| 3 | Dictation Repair Book is a Tauri 2 desktop app with a static download site at dictation-repair-book.sociobot.in. | 16 | Pass; named implementation technology |
| 4 | It repairs text you paste; it is not a speech recognizer and does not record audio. | 16 | Pass |
| 5 | Capture an uncorrected and corrected sentence after you choose a source application. | 12 | Pass |
| 6 | Find the changed words, then let you approve or discard a reusable rule. | 13 | Pass |
| 7 | Apply approved rules locally to a fresh transcript, with longer matching rules first. | 13 | Pass |
| 8 | Search, delete, undo, and export rules as CSV, JSON backup, or a Whisper vocabulary prompt. | 15 | Pass |
| 9 | Encrypt the native repair book with AES-256-GCM and a local per-device key. | 12 | Pass; technical README context |
| 10 | Erase the encrypted repair book, temporary vault file, key, and local license data. | 13 | Pass |
| 11 | Include 25 approved rules and every export for free; a $12 one-time license allows further approvals. | 16 | Pass |
| 12 | The desktop app reads clipboard text only after you press Paste clipboard. | 12 | Pass |
| 13 | It does not monitor fields, keystrokes, foreground windows, or audio. | 10 | Pass |
| 14 | Native state is encrypted before it is written under the operating-system application-data directory. | 13 | Pass; technical README context |
| 15 | On Unix, the local key has mode `0600`. | 8 | Pass; technical README context |
| 16 | The repair-book file is encrypted at rest; processes running as your OS user may still access the local key. | 19 | Pass |
| 17 | Exports are plaintext so other tools can read them. | 9 | Pass |
| 18 | The sample demo sends no request outside the product origin. | 10 | Pass |
| 19 | License verification sends the license token to `api.sociobot.in`; it does not include repair-book text. | 14 | Pass |
| 20 | Open the demo or choose Try it with sample data. | 10 | Pass |
| 21 | The landing alias `/?demo=1` opens the same demo. | 8 | Pass |
| 22 | It uses the `demo:drb_web_preview_state` browser-storage namespace. | 6 | Pass; exact verifier detail |
| 23 | Reset demo restores the shipped sample. | 6 | Pass |
| 24 | Start for real deletes the demo namespace and returns to the download page without changing `drb_web_preview_state`. | 16 | Pass |
| 25 | In the installed app, the first-run screen has Load sample repair book. | 12 | Pass |
| 26 | It runs in memory until you choose Keep this repair book; Start for real discards it. | 16 | Pass |
| 27 | See `.factory/demo.md`. | 2 | Pass |
| 28 | Requirements: Node 22+, Rust stable, and the Tauri 2 system prerequisites. | 11 | Pass |
| 29 | The native privacy test target is intentionally GUI-free, so it also runs from a clean Linux clone without GTK or WebKit development metadata. | 23 | F-6-5 |
| 30 | `npm test` runs a portable structural check of the PowerShell installer and its required CI wiring. | 16 | Accurate limitation; see F-1-7 |
| 31 | Windows CI runs `npm run test:installer-windows` against the shipped script with matching, mismatching, and missing checksums. | 16 | Pass, but not the declared claim command |
| 32 | `npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment. | 16 | Pass |
| 33 | Download the detected installer from the website, or use the checksum-verifying install command. | 13 | Pass |
| 34 | The install commands compare the downloaded package with `SHA256SUMS`. | 9 | F-1-7 for PowerShell coverage |
| 35 | Direct downloads include that published checksum. | 6 | Pass |
| 36 | Current builds are unsigned, so macOS and Windows may ask you to confirm the first launch. | 16 | Pass |
| 37 | Set the same version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`. | 9 | Pass |
| 38 | Then push its `v*` tag or run the release workflow for that tag. | 13 | Pass |
| 39 | The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree. | 21 | Pass |
| 40 | Each packaged desktop webview carries its exact release tag and full source commit. | 13 | Pass |
| 41 | The workflow publishes `SHA256SUMS`, `latest.json`, and `build-info.json` with that commit before attaching all files to the GitHub Release. | 18 | Pass |
| 42 | MIT. | 1 | Pass |
| 43 | See LICENSE. | 2 | Pass |

Landing controls otherwise name their result: **Try it with sample data**, **Choose a download**, **Download latest build on GitHub (opens GitHub)**, **Copy command**, **Buy $12 license on Sociobot checkout (opens Sociobot checkout)**, **Enter license token**, and **Verify license**. Core terms are consistent: an entry is a **rule**, the collection is a **repair book**, and an **application** is the consent boundary. The exact algorithm, file formats, storage key, and build-tool names are retained only where they identify a real technical interface.

Dynamic status labels—**Checking GitHub downloads…**, **Copied**, **Select and copy the command**, and **Checking license…**—state the current action or recovery step. Hero and walkthrough alt text describes the pictured repair ledger or named app screen without embedding claims or required instructions.

## 4. Demo and sandbox behavior

- One click from the landing page opens `/demo/?demo=1` directly on **Approved rules**, populated with metoprolol, Kubernetes, and Niamh corrections from Notes and VS Code.
- The persistent banner reads “Demo — sample data, nothing is saved” and exposes **Reset demo** and **Start for real**. At 390px it does not overlap the active heading.
- A seeded `drb_web_preview_state` real-book sentinel stayed byte-for-byte unchanged through demo entry, Reset, mutation, and Start for real. Start for real removed `demo:drb_web_preview_state` and the demo-scoped license keys.
- Running “Deploy the cube or net ease service.” produced “Deploy the Kubernetes service.” without an account.
- The live demo request log contained no request outside `https://dictation-repair-book.sociobot.in`. The landing made no third-party request before download intent.
- After a first online visit and service-worker control, `/demo` reopened with its sample while offline. Unknown routes retained the designed page and HTTP 404 online and offline.
- The installed-app source retains **Load sample repair book**, an in-memory sample policy, and guarded vault/license operations. `@claim:native-sample-isolation` passed.

The demo contract therefore passes apart from the intermediate-width layout in F-6-1.

## 5. Claims and local verification

A fresh clone was created at `/tmp/drb-review6-clean-JVwFSS`. `npm ci` completed, then every `.factory/claims.json` command was run separately.

| Claim ids | Result |
| --- | --- |
| `demo-sandbox`, `no-account`, `rule-management`, `literal-code-replacement`, `longest-rule-first`, `local-repair` | Pass |
| `portable-exports`, `json-roundtrip`, `whisper-export`, `private-demo`, `website-privacy`, `on-demand-release-lookup` | Pass |
| `explicit-access`, `clipboard-on-command`, `free-book`, `erase-local-book`, `native-erase`, `license-backoff` | Pass |
| `license-daily-cache`, `license-request-privacy`, `license-return`, `encrypted-vault`, `per-device-key`, `revoked-license-locks` | Pass |
| `checksum-installers`, `release-matrix`, `unsigned-build`, `offline-demo`, `native-sample-isolation`, `checkout-price` | Pass |
| `build-output`, `release-source-identity`, `artifact-identity` | Pass |
| `powershell-checksum-installer` | Command exits 0, but its assertion is inadequate; F-1-7 |

Every id has one claim marker. No landing or README claim-like sentence lacks an inventory entry after mapping descriptions, privacy boundaries, download behavior, demo behavior, exports, local repair, licensing, and release facts to the 34 entries. F-1-7 is an inadequate observable test, not an unlisted claim.

The full clean-clone gate also passed: `npm test` (27 Vitest tests, the portable installer contract, four Rust tests, and 48 Playwright tests), `npm run build`, `npm run typecheck`, and `npm run lint`. The build produced `dist/app/` and `dist/site/`. Landing JavaScript is about 1.9 KB gzip; the demo bundle is about 9.8 KB gzip.

## 6. Earlier findings rechecked

“Fixed” means confirmed in current source and live behavior, not accepted from a prior status label.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: the 390px demo banner is in normal flow and does not cover the active heading. |
| F-1-2 | Fixed: direct view URLs, Rules → Test → Back/Forward, routed h1 focus, title, and polite announcement all restore correctly. |
| F-1-3 | Fixed: native first run retains **Load sample repair book**, isolation guards, and four captioned desktop-app frames. |
| F-1-4 | Fixed: installer command regions are labelled and focusable; live mobile Axe has no serious or critical finding. |
| F-1-5 | Fixed: valid route variants stay 200 and unknown routes stay 404 online and under service-worker control. |
| F-1-6 | Fixed: the native encryption test saves and loads through production vault code and rejects plaintext on disk. |
| F-1-7 | **Reopened — BLOCKING:** the declared claim command again checks source structure rather than executing shipped PowerShell behavior. |
| F-1-8 | Fixed: release preparation runs against fixture bundles and verifies the generated matrix and hashes. |
| F-1-9 | Fixed: live and test sentinels prove Reset/exit preserve real storage and delete demo storage. |
| F-1-10 | Fixed: a clean visitor uses the demo without an account. |
| F-1-11 | Fixed: compatibility copy promises pasted-text replacement, not every tool. |
| F-1-12 | Fixed: a tagged overlap fixture applies the longest matching rule first. |
| F-1-13 | Fixed: the production-key test creates distinct random 32-byte keys. |
| F-1-14 | Fixed: that test verifies Unix mode `0600`. |
| F-1-15 | Fixed: README states the OS-user boundary instead of claiming backup protection. |
| F-1-16 | Fixed: merchant-of-record text is absent; free rules and exports are claim-backed. |
| F-1-17 | Fixed: tagged request capture proves license verification excludes repair-book text. |
| F-1-18 | Fixed: public privacy wording is limited to tested demo and license-request boundaries. |
| F-1-19 | Fixed: the unsupported reproducible-build promise is absent. |
| F-1-20 | Fixed: unsigned status is inventoried and configuration/copy tested. |
| F-1-21 | Fixed: direct downloads promise a published checksum; install commands promise verification. |
| F-1-22 | Fixed: the h1 states the actual correction-to-rule job. |
| F-1-23 | Fixed: first-screen privacy names fields and keystrokes plainly. |
| F-1-24 | Fixed: workflow copy describes saved corrections and local replacements without recognizer generalisations. |
| F-1-25 | Fixed: the privacy heading names repair-book storage. |
| F-1-26 | Fixed: the FAQ names export and deletion. |
| F-1-27 | Fixed: landing download and license controls name their immediate results. |
| F-1-28 | Fixed: visitor and README terminology consistently uses **rule** and **repair book**. |
| F-1-29 | Fixed: privacy, offline, and price facts fit above the 390×844 fold; Try is the sole primary action. |
| F-1-30 | Fixed: public routes have shared chrome, legal links, one visible h1, and route metadata. |
| F-2-1 | Fixed: public copy and the live checkout both say $12 USD once. |
| F-2-2 | Fixed: build output is inventoried and both roots are asserted. |
| F-2-3 | Fixed: release source/version refusal is inventoried and tagged. |
| F-2-4 | Fixed: approved entries are rules; their collection is the repair book. |
| F-2-5 | Fixed: sample sources are realistic Notes and VS Code labels. |
| F-2-6 | Fixed: tape copy names local storage, export, and erase boundaries. |
| F-2-7 | Fixed: the FAQ heading is “Product limits and compatibility”. |
| F-2-8 | Fixed: internal “release repair” jargon is absent from public footers. |
| F-2-9 | Fixed: README names the three version files and tag-based release procedure. |
| F-2-10 | Fixed: demo section navigation uses real query URLs and history. |
| F-2-11 | Fixed: privacy copy says the app does not record typing, read fields, or keep audio. |
| F-3-1 | Fixed: public artwork-provenance copy is absent; provenance remains in `.factory/design.md`. |
| F-5-1 | Fixed: every GitHub and checkout link visibly names its external destination. |
| C-4-1 (polish 4) | The portability change remains, but making its static contract the claim test regressed F-1-7. Windows CI wiring does not replace the declared sandbox test. |
| DRB-QA-15-01 (handoff) | **Open:** independently reproduced and recorded as F-6-1. |

## 7. Structure, accessibility, links, and identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 have route-specific titles, descriptions, canonicals, Open Graph/Twitter metadata, favicon, one h1, one main, header, and footer. The social image is 1200×630 and the Apple icon is 180×180.
- The live server sends CSP, `frame-ancestors`, `X-Content-Type-Options`, Referrer Policy, and Permissions Policy as response headers. Valid routes logged no console or page errors.
- A live crawl found no dead link. Internal routes and fragments resolved; GitHub repository, issues, and release links returned 200; the product checkout returned its expected 303. The demo skip target is created by the routed app and works after render.
- Deep links, reload, Back, Forward, h1 focus, and the polite announcement pass. Unknown URLs return the designed 404 with status 404 online and offline.
- Fresh live Axe checks found no serious or critical issue on landing, demo, Privacy, Terms, or 404. Focus, keyboard use, dark mode, reduced motion, and 390px layout pass. F-6-1 is the remaining responsive failure.
- The paper-ledger collage, acid/ink/cobalt/coral palette, squared controls, hard shadows, and mono annotations follow `.factory/design.md` and are recognisably product-specific rather than a generic SaaS template.

## 8. Missed leverage

No missing AI feature is justified. The core job is an explicit, deterministic, inspectable replacement; sending sensitive terms to a model would add cost and weaken the local privacy boundary. The app already includes the useful adjacent features implied by the brief: clipboard capture on command, a blind-retest screen, CSV and JSON export, JSON import, a Whisper prompt, source controls, usage counts, undo, and complete local erasure. No provider key is embedded.

## What would make this perfect

Run the shipped PowerShell installer fixture as the declared claim test, remove the Settings overflow across 621–729px, combine the hero’s two supporting sentences, replace “changed span” and the landing’s algorithm-only privacy line, and split the 23-word README sentence. Then repeat every claim command and the live checks at 390px, 640px, and desktop. Those changes would leave no identified finding.
