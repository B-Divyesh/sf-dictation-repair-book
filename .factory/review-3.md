# Adversarial first-read review 3 — FAIL

Reviewed 2026-09-01 UTC against commit `68dff62068353eddcffb3a8c2f44852cd224df77` and <https://dictation-repair-book.sociobot.in> in clean Chromium contexts at 390×844 and 1440×900. No product source was changed.

**Verdict: FAIL.** The cold first read, live demo, routing, accessibility, and all declared commands are otherwise in good condition. Two findings remain: one blocking, reopened earlier claim-test finding, and one minor unlisted landing claim. A PASS requires zero findings and no untested claim.

## 1. Cold first screen

No scrolling was performed before this assessment.

| Viewport | What it does | For whom | First action | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Turns explicit dictation corrections into reusable rules. | Dictation users whose names, medications, code terms, or workplace jargon are misheard. | **Try it with sample data**. | Pass |
| 1440×900 | The same repair-and-reuse job, supported by the correction-ledger art. | The same named audience. | **Try it with sample data**. | Pass |

The exact first-screen text is “Turn dictation corrections into reusable rules.”, “For dictation users with names, medications, code terms, or workplace jargon.”, and “Try it with sample data”. The adjacent result text, “Opens a separate sample repair book. Nothing enters your real book.”, makes the click consequence clear. At 390 px the three facts end at y=607 of an 844 px viewport, so they are visible before scrolling.

## 2. Findings

### Blocking

#### F-1-7 — The declared PowerShell installer claim still does not execute PowerShell

- **Location/quote:** `.factory/claims.json`, `powershell-checksum-installer`: `"test": "node tests/installers.mjs"`; `tests/installers.mjs`, `assertPowerShellControlFlow()`.
- **Observed result:** the declared command passes from a clean clone, but it reads `public/install.ps1` as text and checks six substrings plus their order. Its matching/mismatching download exercise is a separate JavaScript reimplementation (`verifyBeforeLaunch`), not the shipped PowerShell script. `tests/installers.ps1` does invoke the shipped installer with mocked commands, but that executable fixture is not the declared claim test and cannot be run by the listed command.
- **Why this fails:** the claim is “The PowerShell install command verifies SHA-256 and refuses a mismatch before launching MSI installation.” The required claim test must observe that command's behavior. A string/order check and parallel reimplementation can both pass while PowerShell syntax, variable expansion, command invocation, or error handling in `install.ps1` is broken. This is the same defect identified in review 1, so it remains blocking rather than merely marked fixed.
- **Concrete fix:** make the declared claim test execute `tests/installers.ps1` on a Windows/PowerShell sandbox (for example `pwsh -NoLogo -NoProfile -File tests/installers.ps1`), and have the clean test harness fail when that platform-specific verification is not run. Keep the Node parser only as an optional fast static check; do not represent it as proof of the PowerShell behavior.

### Minor

#### F-3-1 — The landing footer has an unlisted provenance claim

- **Location/quote:** landing footer: “Hero artwork is original AI-generated imagery; provenance is documented in the source repository.”
- **Observed result:** `.factory/design.md` does document image provenance, but the 34-entry `.factory/claims.json` has no entry or sandbox test for either assertion.
- **Why this fails:** this is a factual statement presented to visitors. The claims contract requires claim-like landing copy to have a listed observable test, or to be removed when it cannot be tested. The source-design record is useful, but it is not a declared claim test.
- **Concrete fix:** remove this visitor-facing sentence (the required provenance remains in `.factory/design.md`), or add an `art-provenance` claim with a reproducible source-asset/provenance check.

## 3. Copy audit

Counts treat hyphenated terms, version strings, and code-format names as one word. Button and navigation labels are audited after the sentence tables. No audited sentence exceeds 22 words. The only copy finding is F-3-1; “AI-generated” is factual provenance rather than a marketing adjective.

### Landing page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn dictation corrections into reusable rules. | 6 | Pass |
| 2 | For dictation users with names, medications, code terms, or workplace jargon. | 11 | Pass |
| 3 | Turn explicit corrections into rules you can inspect and reuse. | 10 | Pass |
| 4 | Opens a separate sample repair book. | 6 | Pass |
| 5 | Nothing enters your real book. | 5 | Pass |
| 6 | No audio or account. | 4 | Pass |
| 7 | Demo works offline after one visit. | 7 | Pass |
| 8 | 25 approved rules are free; pay $12 once for unlimited rules. | 11 | Pass |
| 9 | Checks the latest build when you choose a download. | 9 | Pass |
| 10 | No background monitoring of fields or keystrokes. | 7 | Pass |
| 11 | Explicit edit → inspectable rule. | 4 | Pass |
| 12 | Save corrections for later clipboard text. | 6 | Pass |
| 13 | Save a correction once, then apply the approved rule to later clipboard text. | 13 | Pass |
| 14 | Create a reusable rule in three steps. | 7 | Pass |
| 15 | Copy the original dictation and your corrected sentence. | 8 | Pass |
| 16 | Capture happens only when you click. | 6 | Pass |
| 17 | The app isolates the changed span. | 6 | Pass |
| 18 | Approve it, or discard it without saving anything. | 8 | Pass |
| 19 | Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 | Pass |
| 20 | See the installed repair book at work. | 8 | Pass |
| 21 | Capture — paste the original and corrected sentence. | 7 | Pass |
| 22 | Review — inspect approved rules and their sources. | 7 | Pass |
| 23 | Test — run approved rules on later clipboard text. | 8 | Pass |
| 24 | Export or erase — keep a portable copy or remove local data. | 11 | Pass |
| 25 | How the app stores your repair book. | 8 | Pass |
| 26 | The desktop app encrypts the repair book on your device. | 10 | Pass |
| 27 | AES-256-GCM vault stored on your device. | 6 | Pass |
| 28 | Name and enable each application yourself. | 6 | Pass |
| 29 | The app does not record typing, read other fields, or keep audio. | 13 | Pass |
| 30 | Export anytime. | 2 | Pass |
| 31 | Erase the vault and key in one action. | 9 | Pass |
| 32 | Install the desktop app. | 4 | Pass |
| 33 | The install commands verify SHA-256 checksums. | 6 | F-1-7 coverage is insufficient |
| 34 | Direct downloads include a published checksum. | 6 | Pass |
| 35 | Builds are unsigned, so your operating system may ask you to confirm the first launch. | 15 | Pass |
| 36 | Pay once for more approved rules. | 7 | Pass |
| 37 | Start with 25 approved rules, testing, and every export for free. | 11 | Pass |
| 38 | Unlock unlimited approvals once—no subscription. | 5 | Pass |
| 39 | One-time purchase. | 2 | Pass |
| 40 | A refunded license no longer permits paid approvals. | 8 | Pass |
| 41 | Does it record or transcribe audio? | 6 | Pass |
| 42 | No. | 1 | Pass |
| 43 | It repairs transcript text from dictation tools you already use. | 10 | Pass |
| 44 | Audio never enters the app. | 5 | Pass |
| 45 | Does it watch everything I type? | 6 | Pass |
| 46 | No. | 1 | Pass |
| 47 | You opt in to named source applications and click “Paste clipboard” for each capture. | 15 | Pass |
| 48 | v0.1 does not monitor fields or keystrokes. | 7 | Pass |
| 49 | Which engines does it support? | 5 | Pass |
| 50 | Paste text from your dictation tool, then run approved replacements locally. | 11 | Pass |
| 51 | Exports include CSV, JSON backup, and a vocabulary prompt for Whisper-compatible workflows. | 12 | Pass |
| 52 | Can I export and delete my data? | 8 | Pass |
| 53 | Yes. | 1 | Pass |
| 54 | Exports are never paywalled. | 4 | Pass |
| 55 | You can erase the encrypted vault and its local key at any time. | 14 | Pass |
| 56 | Private rules for repaired dictation text. | 6 | Pass |
| 57 | Built by Param Factory. | 4 | Pass |
| 58 | Hero artwork is original AI-generated imagery; provenance is documented in the source repository. | 13 | F-3-1 |

Headings all name their sections: “Save corrections for later clipboard text”, “Create a reusable rule in three steps”, “Desktop app walkthrough”, “How the app stores your repair book”, “Install the desktop app”, “Pay once for more approved rules”, and “Product limits and compatibility”. The visible action labels name results: **Try it with sample data**, **Choose a download**, **Copy command**, **Buy once — $12**, **Enter license token**, and **Verify license**. No vague/mood heading or non-result button finding remains.

### README sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn explicit dictation corrections into private reusable rules. | 8 | Pass |
| 2 | It is for people whose names, medication spellings, code terms, and workplace jargon need careful repair after dictation. | 18 | Pass |
| 3 | Dictation Repair Book is a Tauri 2 desktop app with a static download site. | 14 | Pass |
| 4 | It repairs text you paste; it is not a speech recognizer and does not record audio. | 16 | Pass |
| 5 | Capture an uncorrected and corrected sentence after you choose a source application. | 11 | Pass |
| 6 | Find the changed words, then let you approve or discard a reusable rule. | 12 | Pass |
| 7 | Apply approved rules locally to a fresh transcript, with longer matching rules first. | 13 | Pass |
| 8 | Search, delete, undo, and export rules as CSV, JSON backup, or a Whisper vocabulary prompt. | 15 | Pass |
| 9 | Encrypt the native repair book with AES-256-GCM and a local per-device key. | 12 | Pass |
| 10 | Erase the encrypted repair book, temporary vault file, key, and local license data. | 13 | Pass |
| 11 | Include 25 approved rules and every export for free; a $12 one-time license allows further approvals. | 17 | Pass |
| 12 | The desktop app reads clipboard text only after you press Paste clipboard. | 12 | Pass |
| 13 | It does not monitor fields, keystrokes, foreground windows, or audio. | 10 | Pass |
| 14 | Native state is encrypted before it is written under the operating-system application-data directory. | 13 | Pass |
| 15 | On Unix, the local key has mode 0600. | 9 | Pass |
| 16 | The repair-book file is encrypted at rest; processes running as your OS user may still access the local key. | 19 | Pass |
| 17 | Exports are plaintext so other tools can read them. | 9 | Pass |
| 18 | The sample demo sends no request outside the product origin. | 10 | Pass |
| 19 | License verification sends the license token to api.sociobot.in; it does not include repair-book text. | 13 | Pass |
| 20 | Open the demo or choose Try it with sample data. | 10 | Pass |
| 21 | The landing alias `/?demo=1` opens the same demo. | 8 | Pass |
| 22 | It uses the `demo:drb_web_preview_state` browser-storage namespace. | 5 | Pass |
| 23 | Reset demo restores the shipped sample. | 6 | Pass |
| 24 | Start for real deletes the demo namespace and returns to the download page without changing `drb_web_preview_state`. | 15 | Pass |
| 25 | In the installed app, the first-run screen has Load sample repair book. | 12 | Pass |
| 26 | It runs in memory until you choose Keep this repair book; Start for real discards it. | 17 | Pass |
| 27 | The native privacy test target is intentionally GUI-free, so it also runs from a clean Linux clone without GTK or WebKit development metadata. | 22 | Pass |
| 28 | The portable Node installer test checks the same checksum refusal contract on Linux. | 12 | Pass |
| 29 | The release workflow additionally runs `tests/installers.ps1` on its real Windows runner. | 11 | Pass, but does not cure F-1-7 |
| 30 | `npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment. | 14 | Pass |
| 31 | Download the detected installer from the website, or use the checksum-verifying install command. | 13 | Pass |
| 32 | The install commands compare the downloaded package with `SHA256SUMS`. | 9 | F-1-7 coverage is insufficient for PowerShell |
| 33 | Direct downloads include that published checksum. | 6 | Pass |
| 34 | Current builds are unsigned, so macOS and Windows may ask you to confirm the first launch. | 15 | Pass |
| 35 | Set the same version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`. | 9 | Pass |
| 36 | Then push its `v*` tag or run the release workflow for that tag. | 13 | Pass |
| 37 | The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree. | 21 | Pass |
| 38 | Each packaged desktop webview carries its exact release tag and full source commit. | 13 | Pass |
| 39 | The workflow publishes `SHA256SUMS`, `latest.json`, and `build-info.json` with that commit before attaching all files to the GitHub Release. | 15 | Pass |
| 40 | MIT. | 1 | Pass |
| 41 | See LICENSE. | 2 | Pass |

Terminology is consistent: **rule** is a saved replacement, **repair book** is the saved collection, **application** is the explicit consent boundary, and **Whisper vocabulary prompt** is only an export format.

## 4. Demo and privacy sandbox

- The first click enters `/demo/?demo=1`, where the first visible product state already contains three realistic approved rules: metoprolol, Kubernetes, and Niamh.
- The persistent banner reads “Demo — sample data, nothing is saved” and exposes **Reset demo** and **Start for real**. At 390 px it does not overlap the page heading.
- I seeded `drb_web_preview_state` with a real-book sentinel, reset the demo, repaired “Deploy the cube or net ease service.” to “Deploy the Kubernetes service.”, and exited. The real sentinel was byte-for-byte unchanged; `demo:drb_web_preview_state` was removed on exit.
- The entire live landing and demo flow made only product-origin requests. The demo did not touch the GitHub or billing endpoints. After one online visit, all slash and slashless public routes opened offline under service-worker control; an unknown route remained a styled HTTP 404.

## 5. Claims and clean-clone test evidence

I cloned the supplied repository into a fresh temporary directory, ran `npm ci --ignore-scripts`, and executed every one of the 34 test commands in `.factory/claims.json` separately. All commands exited successfully. That includes the demo, privacy, offline, export/import, license, checkout, encryption, release, and installer claim commands.

The full quality gate also passed from that clone:

- `npm test`: 27 Vitest tests, installer contract, 4 no-GUI Rust tests, and 45 Playwright tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- The build produced `dist/app/index.html` and `dist/site/index.html`; production landing JavaScript is 1.88 KB gzip and desktop-webview JavaScript is 10.02 KB gzip.

The passing `powershell-checksum-installer` command is not counted as adequate proof of its particular claim for the reason in F-1-7. Thus the claim test command passes, but the asserted PowerShell behavior remains untested by the claim's declared sandbox.

## 6. Earlier finding verification

Every earlier finding was rechecked on the current live site and current source. “Fixed” below means independently observed, not accepted from the prior report.

| Earlier id | Current result and evidence |
| --- | --- |
| F-1-1 | Fixed: 390 px demo banner is in normal flow and does not intersect the active heading. |
| F-1-2 | Fixed: `/demo/?view=test` direct-loads Test; Settings, Back, focus, title, and live announcement all restore correctly. |
| F-1-3 | Fixed: native Capture source has **Load sample repair book**; landing has four captioned desktop captures; `@claim:native-sample-isolation` passes. |
| F-1-4 | Fixed: command regions are labelled focusable code; live 390 px Axe has no serious/critical findings. |
| F-1-5 | Fixed: controlled worker serves `/demo`, `/privacy`, and `/terms`, with or without slash, as 200 offline; unknown route is 404. |
| F-1-6 | Fixed: `claim_encrypted_vault_uses_aes_256_gcm` uses the production vault round trip and rejects plaintext. |
| F-1-7 | **Unfixed — BLOCKING:** see current finding F-1-7. |
| F-1-8 | Fixed: release preparation is run against fixture bundles and checks generated manifest hashes. |
| F-1-9 | Fixed: demo test and live sentinel check preserve real storage across reset and exit. |
| F-1-10 | Fixed: clean demo works with no account; `@claim:no-account` passes. |
| F-1-11 | Fixed: landing promises pasted-text repair rather than universal compatibility. |
| F-1-12 | Fixed: tagged overlap fixture verifies longest approved rule first. |
| F-1-13 | Fixed: tagged native test creates and compares fresh random 32-byte keys. |
| F-1-14 | Fixed: the same native test verifies Unix mode 0600. |
| F-1-15 | Fixed: README now states the OS-user boundary rather than an overbroad backup promise. |
| F-1-16 | Fixed: merchant-of-record wording is absent; export/free wording is claim-backed. |
| F-1-17 | Fixed: tagged request capture limits license verification to token data. |
| F-1-18 | Fixed: privacy copy is narrowed to demo and license-request behavior that is tested. |
| F-1-19 | Fixed: README no longer claims reproducible builds. |
| F-1-20 | Fixed: unsigned-build claim and configuration/copy test are present. |
| F-1-21 | Fixed: direct-download and checksum-command wording is distinct. |
| F-1-22 | Fixed: the h1 states the actual correction-to-rule job. |
| F-1-23 | Fixed: the first screen says fields and keystrokes, not “field watching”. |
| F-1-24 | Fixed: problem copy describes the saved-correction workflow, without recognizer generalisations. |
| F-1-25 | Fixed: privacy heading names repair-book storage. |
| F-1-26 | Fixed: FAQ names export and deletion. |
| F-1-27 | Fixed: download and license actions name their immediate result. |
| F-1-28 | Fixed: source and live copy consistently use rule and repair book. |
| F-1-29 | Fixed: privacy, offline, and price facts are all above the 390×844 fold; Try is the sole primary action. |
| F-1-30 | Fixed: demo now has public header/footer, one routed visible h1, and Privacy/Terms footer links. |
| F-2-1 | Fixed: public price and live checkout are $12; `@claim:checkout-price` passes. |
| F-2-2 | Fixed: `build-output` is inventoried and tests both output roots. |
| F-2-3 | Fixed: `release-source-identity` is inventoried and tagged. |
| F-2-4 | Fixed: approved entries are rules and the collection is the repair book. |
| F-2-5 | Fixed: sample source labels are Notes and VS Code. |
| F-2-6 | Fixed: tape states concrete local/export/erase boundaries. |
| F-2-7 | Fixed: FAQ heading is “Product limits and compatibility”. |
| F-2-8 | Fixed: public footer contains release version, not “release repair”. |
| F-2-9 | Fixed: README tells maintainers which three version files to align. |
| F-2-10 | Fixed: demo section navigation is real links with routes. |
| F-2-11 | Fixed: privacy language says typing, fields, and audio in plain words. |

## 7. Structure, links, identity, and missed leverage

- `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 each have route-specific title, description, canonical, OG/Twitter metadata, favicon, one h1, main, header, footer, and no mobile horizontal overflow. The title pattern is correct on each route.
- Live Axe scans at 390 px reported zero serious/critical issues on landing, demo, Privacy, Terms, and 404. Reduced-motion mode had no running animations. Skip navigation and visible focus work.
- I crawled all unique live anchors. Product routes, demo view URLs, GitHub repository/issues/release, checkout, and 404 asset page completed successfully; no dead links were found.
- The paper-ledger collage, ink rules, acid/cobalt/coral palette, mono data treatment, and squared controls match `.factory/design.md` and are visually distinct from a generic SaaS template.
- No AI feature is warranted: explicit before/after replacement needs deterministic local behavior, and sending private terms to a model would weaken the product's privacy model. The implied portability features—CSV, JSON backup/import, Whisper prompt, clipboard repair, and deletion—are present.

## What would make this perfect

Execute the actual shipped PowerShell installer in the claim's declared sandbox and inventory or remove the footer provenance assertion. Then repeat the clean-clone claim run and this cold live review. With those two changes, the evidence supports a PASS.
