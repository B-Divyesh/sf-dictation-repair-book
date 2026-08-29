# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-29 UTC against commit `3741e9cb2fd0268988f8693a9db9d2407020c3df` and <https://dictation-repair-book.sociobot.in> in fresh Chromium contexts at 390×844 and 1440×900.

**Verdict: FAIL.** The landing first read is clear and the web demo contains useful sample data, but there are 30 findings. Five are blocking: the mobile demo banner obscures the demo heading, demo navigation has no working deep links/back/focus handling, the required desktop-app sample project and screenshot walkthrough are absent, mobile Axe reports a serious keyboard-access failure, and service-worker-controlled unknown routes return HTTP 200. There are also unlisted or inadequately tested claims and plain-language defects. A PASS requires zero findings and no untested claim.

## 1. Cold first screen

No scrolling was performed before this assessment.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | It turns explicit dictation corrections into reusable rules. | People whose dictation misses names, medications, code terms, or workplace jargon. | **Try it with sample data**. | Pass |
| 1440×900 | Same answer. The illustration reinforces correction → rule. | Same named audience. | **Try it with sample data** is first in reading and visual order. | Pass |

The exact useful copy is “For dictation users with names, medications, code terms, or workplace jargon. Turn explicit corrections into rules you can inspect and reuse.” The sample action is visible without scrolling in both viewports. This part is not blocking.

## 2. Findings

### Blocking

#### F-1-1 — The demo banner obscures the product heading on a phone

- **Location/quote:** `/demo/` at 390×844; “Demo — sample data, nothing is saved.”
- **Evidence:** the fixed banner occupies y=8–98. The visible “Approved vocabulary” heading occupies y=45–105, so most of it is covered.
- **Why this fails:** the required persistent banner is not unobtrusive. It hides the context that tells a first-time visitor what screen they entered.
- **Fix:** reserve mobile block space for the banner or make it part of normal flow. Add a 390px assertion that the banner and `.work-header` rectangles do not intersect.

#### F-1-2 — Demo sections do not support deep links, Back, focus, or announcements

- **Location/quote:** `/demo/#test`, and the Capture/Rules/Test/Settings controls.
- **Evidence:** loading `/demo/#test` shows “Approved vocabulary,” not Test. Selecting Settings leaves the URL at `/demo/#test`; Back then exits to `about:blank` instead of restoring Rules. After the section change, `document.activeElement` is `BODY`, and there is no `aria-live` route announcement.
- **Why this fails:** a copied URL does not reopen the selected screen, browser history cannot restore app state, and keyboard/screen-reader users receive no routed-screen focus or announcement. This is broken routing.
- **Fix:** give each section a real URL or correctly implement hash routes with `pushState`/`popstate`; initialize from the URL; focus the visible page heading; announce its name; test direct load, reload, Back, and Forward.

#### F-1-3 — The desktop-app demo contract is incomplete

- **Location:** native first-run UI in `src/main.ts`; landing walkthrough in `site/index.html`.
- **Evidence:** the non-demo first run only asks the user to add an application. There is no “Load sample project” action. The landing page has an original hero collage and schematic steps, but no 3–5 captioned screenshots of the real desktop app.
- **Why this fails:** the browser demo is useful, but the artifact is a desktop app. A person installing it cannot load the same sample from first run, and the landing page does not show the installed experience before download.
- **Fix:** ship the sample state in the desktop binary, add **Load sample repair book** on first run, keep it isolated until explicitly retained, and add three to five captioned screenshots covering capture, proposal, rules, and test output.

#### F-1-4 — Mobile landing has a serious keyboard-access violation

- **Location/quote:** the two install command `<code>` regions at 390px.
- **Evidence:** live Axe 4.13 reports `scrollable-region-focusable` with serious impact for both `curl … | sh` and `irm … | iex` code blocks. They can scroll horizontally but contain no focusable content and are not focusable.
- **Why this fails:** keyboard users, notably in Safari, cannot reach and scroll the full commands. The accessibility baseline prohibits serious violations.
- **Fix:** make each scrollable code region keyboard-focusable with an accessible name and designed focus ring, or wrap/reflow it. Add a 390px Axe run to the landing test.

#### F-1-5 — A service-worker-controlled missing route reports HTTP 200

- **Location:** `public/sw.js`, navigation fallback after the service worker controls the page.
- **Evidence:** a direct request to `/review-one-missing-page` returns the designed page with HTTP 404. After service-worker control, Playwright navigation to the same URL returns cached `/404.html` with HTTP 200.
- **Why this fails:** the visible 404 is designed, but its status regresses in a normal returning-user session.
- **Fix:** when falling back to cached 404 HTML, construct a response with status 404. Add online and offline service-worker-controlled unknown-route tests for content and status.

### Claims and copy

#### F-1-6 — The encryption claim test does not exercise the app vault

- **Claim:** “Native repair books use AES-256-GCM encryption at rest.”
- **Test behavior:** `claim_encrypted_vault_uses_aes_256_gcm` directly constructs `Aes256Gcm`, encrypts a byte string, and decrypts it. It never calls the app save/load path or inspects `repair-book.enc`.
- **Why this fails:** the test proves the dependency works, not that a repair book is written through that cipher.
- **Fix:** save a complete fixture through the production vault function, assert plaintext terms do not appear on disk, then load and compare the full state.

#### F-1-7 — The PowerShell checksum behavior is only string-matched

- **Claim:** “The one-line installers verify the downloaded package against the published SHA-256 checksum and refuse a mismatch.”
- **Test behavior:** the shell mismatch path is executed. The PowerShell half only checks that two strings occur in `install.ps1`.
- **Why this fails:** the Windows behavior remains unexecuted even though the claim covers both installers.
- **Fix:** run `install.ps1` under PowerShell with isolated fake downloads for match and mismatch paths; assert the MSI launcher is not invoked on mismatch.

#### F-1-8 — The release-matrix claim test inspects text instead of release output

- **Claim:** “The release workflow publishes macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, SHA256SUMS, and latest.json.”
- **Test behavior:** it checks that format names occur in workflow and preparation source files.
- **Why this fails:** those strings do not prove that the workflow emits a valid matrix or manifest. The current live release does contain all eight promised assets, but the repeatable test does not establish that outcome.
- **Fix:** execute the preparation step against fixture bundles and assert the full output set and manifest hashes. Keep a separate published-release smoke check.

#### F-1-9 — The demo-sandbox claim test does not assert real storage survives exit

- **Claim:** “Try it with sample data opens a separate repair book that resets and is discarded on exit.”
- **Evidence:** the test seeds `drb_web_preview_state` and confirms its content is absent from the demo UI, but after Reset and Start for real it only asserts that `demo:drb_web_preview_state` is deleted.
- **Why this fails:** a regression that deletes real data on demo exit would pass. Independent live review confirmed the sentinel survived, but the claim remains incompletely guarded.
- **Fix:** assert byte-for-byte equality of the real key before entry, after Reset, and after Start for real; also assert demo-prefixed license keys are removed.

#### F-1-10 — “No account.” is an unlisted claim

- **Location/quote:** landing first-screen trust line, “No account.”
- **Why this fails:** no `claims.json` entry tests that the free workflow and demo require no account.
- **Fix:** add a `no-account` claim and a clean-context test that reaches and uses the sample without auth, or remove the sentence.

#### F-1-11 — Compatibility with “any tool” is an unlisted absolute claim

- **Location/quote:** landing FAQ, “The clipboard repair works with any tool that produces text.”
- **Why this fails:** “any” promises universal compatibility. The sandbox tests one browser text fixture and no external tools.
- **Fix:** “Paste text from your dictation tool, then run approved replacements locally.”

#### F-1-12 — Longest-rule ordering is missing from the claim inventory

- **Location/quote:** README, “Apply approved rules locally to a fresh transcript, longest rule first.”
- **Why this fails:** an untagged unit test covers the order, but `.factory/claims.json` does not list the sentence.
- **Fix:** add a `longest-rule-first` claim whose tagged test uses overlapping rules, or remove “longest rule first.”

#### F-1-13 — Random per-device key generation is an unlisted claim

- **Location/quote:** README, “Encrypt the native glossary at rest with AES-256-GCM and a random per-device key.”
- **Why this fails:** `encrypted-vault` mentions AES-256-GCM only; it does not claim or test randomness or per-device separation.
- **Fix:** add a tagged test that creates two fresh vault directories and proves distinct 32-byte keys.

#### F-1-14 — Unix mode `0600` is an unlisted claim

- **Location/quote:** README, “The separate key is created locally and receives mode `0600` on Unix systems.”
- **Why this fails:** no claim entry or test checks the resulting file mode.
- **Fix:** add a Unix-only tagged test that creates the production key and asserts permission bits `0600`, or remove the guarantee.

#### F-1-15 — The security-effect sentence is untestable and overstates protection

- **Location/quote:** README, “This protects casual at-rest exposure, backups, and accidental inspection.”
- **Why this fails:** “protects backups” is ambiguous because the key and vault can be backed up together; no test establishes this broad effect.
- **Fix:** “The repair-book file is encrypted at rest; processes running as your OS user may still access the local key.”

#### F-1-16 — Free deletion/accessibility and merchant status are unlisted

- **Locations/quotes:** README, “Export, deletion, and accessibility are never gated.” Landing and legal copy: “Sociobot/Dodo is merchant of record.”
- **Why this fails:** `portable-exports` covers exports, but no claim explicitly covers ungated deletion/accessibility or merchant-of-record status.
- **Fix:** rewrite the first sentence to “Exports remain available without a license,” or add tagged gating tests. Add a billing-routing claim that verifies the hosted checkout identifies Dodo/Sociobot as merchant of record, or remove that assertion.

#### F-1-17 — “Only the license token” is an unlisted privacy claim

- **Location/quote:** README, “License verification sends only the license token to `api.sociobot.in` at most once per day.”
- **Why this fails:** daily frequency is listed, but request payload/query exclusivity is not.
- **Fix:** add a request-capture claim asserting destination, query/body keys, headers, and absence of vocabulary data.

#### F-1-18 — “Vocabulary never leaves the app” is an unlisted privacy claim

- **Location/quote:** README, “Vocabulary never leaves the app.”
- **Why this fails:** `private-demo` covers the browser demo flow only. It does not exercise native license verification, checkout, or all export/clipboard paths.
- **Fix:** add a tagged egress test around every network-capable app action, or narrow the sentence to the tested demo flow.

#### F-1-19 — “Reproducibly” is an unlisted build claim

- **Location/quote:** README, “`npm run build` reproducibly creates:”
- **Why this fails:** one successful build does not prove reproducibility.
- **Fix:** say “`npm run build` creates:” or add a controlled clean double-build hash comparison.

#### F-1-20 — Unsigned-build status is not in the claim inventory

- **Location/quote:** landing, “Builds are currently unsigned; your operating system may ask you to confirm the first launch.” README repeats the unsigned status and platform warnings.
- **Why this fails:** this is important installation guidance, but no claim checks signing state or displayed warnings against release artifacts.
- **Fix:** add a release-metadata/signature check and list the claim, or phrase it as versioned release notes with evidence.

#### F-1-21 — “Release downloads are checksum-verified” overstates what happens

- **Location/quote:** landing install section, “Release downloads are checksum-verified.”
- **Why this fails:** the one-line install scripts verify checksums, but the primary platform button is a direct GitHub asset download. The page publishes a checksum; it does not verify that direct download.
- **Fix:** “The install commands verify SHA-256 checksums. Direct downloads include a published checksum.”

#### F-1-22 — The hero headline describes training, not the exact job

- **Location/quote:** “Teach dictation your words.”
- **Why this fails:** the app usually post-processes clipboard text; it does not train a dictation engine. The metaphor requires the next sentence to correct the impression.
- **Fix:** “Turn dictation corrections into reusable rules.”

#### F-1-23 — “Background field watching” is unclear jargon

- **Location/quote:** “No background field watching.”
- **Why this fails:** “field watching” is not a normal user term and does not say whether the app monitors typing, windows, or clipboard changes.
- **Fix:** “No background monitoring of fields or keystrokes.”

#### F-1-24 — The problem section uses broad claims and a slogan

- **Locations/quotes:** “General speech recognition knows common language.” “It does not know your colleague Niamh, your `kubectl` command, or a medication spelling.” “Repeating yourself is not learning.”
- **Why this fails:** the first two generalize about all recognizers without a test; the third is a slogan rather than usable product information.
- **Fix:** replace all three with “Save a correction once, then apply the approved rule to later clipboard text.”

#### F-1-25 — The privacy heading is a mood line and vague claim

- **Location/quote:** “Your vocabulary can be sensitive. It stays yours.”
- **Why this fails:** “stays yours” does not name the section or identify the storage boundary.
- **Fix:** heading: “How the app stores your vocabulary”; supporting line: “The desktop app encrypts the repair book on your device.”

#### F-1-26 — “Can I leave?” does not name the FAQ topic

- **Location/quote:** landing FAQ summary, “Can I leave?”
- **Why this fails:** out of context it could mean closing the app, cancelling payment, or exporting data.
- **Fix:** “Can I export and delete my data?”

#### F-1-27 — Two landing controls do not name their immediate result

- **Locations/quotes:** header link “Get the app” only scrolls to downloads; “Have a license? Restore it” only reveals a form. The form then says “Save & verify.”
- **Why this fails:** the labels imply completed results rather than the next UI state.
- **Fix:** “Choose a download,” “Enter license token,” and “Verify license.”

#### F-1-28 — README terminology is inconsistent and unnecessarily technical

- **Locations/quotes:** “private, inspectable vocabulary glossary,” “Encrypt the native glossary,” “Infer the changed whole-term span,” and “remain interoperable.” The product otherwise calls the collection a “repair book” and entries “rules.”
- **Why this fails:** three collection terms compete; “inspectable,” “whole-term span,” and “interoperable” slow a first read.
- **Fixes:** “turns corrections into private rules you can review”; “Encrypt the native repair book”; “Find the changed words and let you approve or discard the rule”; “remain readable by other tools.”

#### F-1-29 — The first screen omits required offline and price facts and has two primary actions

- **Location/quote:** the facts are “No audio. No account. No background field watching.” Both Try and Download use the same primary acid treatment.
- **Why this fails:** the required fact set is privacy/offline/price, and two equal primary actions weaken the first-click hierarchy.
- **Fix:** show “No audio or account.” “Demo works offline after one visit.” “25 approved rules free; $24 once for unlimited.” Keep Try as the sole primary style.

#### F-1-30 — Route headings and global chrome do not follow the standard skeleton

- **Locations/quotes:** `/privacy/` h1 “Private means local.”; `/terms/` h1 “Plain terms for a plain tool.”; `/demo/` h1 is the hidden brand “Dictation Repair Book.” The demo has no site header/footer, and legal headers replace normal navigation with “Back to home.”
- **Why this fails:** legal h1s are slogans, the demo h1 does not name the active page and is hidden at mobile, and global navigation/footer are inconsistent.
- **Fix:** use “Privacy policy” and “Terms of use”; make the active demo view the visible h1; add compact consistent web chrome with Home, Demo, Privacy, and Terms.

## 3. Copy audit

Word counts treat hyphenated terms as one word. No prose sentence exceeds 22 words. “Unlock” is used only for literal license behavior; no other banned marketing adjective appears. Finding ids point to the required rewrite.

### Landing page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Teach dictation your words. | 4 | F-1-22 |
| 2 | For dictation users with names, medications, code terms, or workplace jargon. | 10 | Pass |
| 3 | Turn explicit corrections into rules you can inspect and reuse. | 10 | Pass |
| 4 | Opens a separate sample repair book. | 6 | Pass |
| 5 | Nothing enters your real book. | 5 | Pass |
| 6 | No audio. | 2 | Pass |
| 7 | No account. | 2 | F-1-10 |
| 8 | No background field watching. | 4 | F-1-23 |
| 9 | Dictation forgets the word you fixed yesterday. | 7 | F-1-24 |
| 10 | General speech recognition knows common language. | 6 | F-1-24 |
| 11 | It does not know your colleague Niamh, your kubectl command, or a medication spelling. | 14 | F-1-24 |
| 12 | Repeating yourself is not learning. | 5 | F-1-24 |
| 13 | Create a reusable rule in three steps. | 7 | Pass |
| 14 | Copy the original dictation and your corrected sentence. | 8 | Pass |
| 15 | Capture happens only when you click. | 6 | Pass |
| 16 | The app isolates the changed span. | 6 | Pass |
| 17 | Approve it, or discard it without saving anything. | 9 | Pass |
| 18 | Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 | Pass |
| 19 | Your vocabulary can be sensitive. | 5 | F-1-25 |
| 20 | It stays yours. | 3 | F-1-25 |
| 21 | AES-256-GCM vault stored on your device. | 6 | F-1-6 |
| 22 | Name and enable each application yourself. | 6 | Pass |
| 23 | No keylogging, no arbitrary field access, no audio retention. | 9 | Pass |
| 24 | Export anytime. | 2 | Pass |
| 25 | Erase the vault and key in one action. | 9 | Pass |
| 26 | Install the desktop app. | 4 | Pass |
| 27 | Release downloads are checksum-verified. | 4 | F-1-21 |
| 28 | Builds are currently unsigned; your operating system may ask you to confirm the first launch. | 15 | F-1-20 |
| 29 | Pay once for more approved rules. | 6 | Pass |
| 30 | Start with 25 approved rules, testing, and every export for free. | 11 | Pass |
| 31 | Unlock an unlimited rule book once—no subscription. | 8 | Pass; literal action |
| 32 | Sociobot/Dodo is merchant of record. | 5 | F-1-16 |
| 33 | Refunds revoke the license automatically. | 5 | Pass |
| 34 | Does it record or transcribe audio? | 6 | Pass |
| 35 | No. | 1 | Pass |
| 36 | It repairs transcript text from dictation tools you already use. | 10 | Pass |
| 37 | Audio never enters the app. | 5 | Pass |
| 38 | Does it watch everything I type? | 6 | Pass |
| 39 | You opt in to named source applications and click “Paste clipboard” for each capture. | 14 | Pass |
| 40 | v0.1 does not monitor fields or keystrokes. | 7 | Pass |
| 41 | Which engines does it support? | 5 | Pass |
| 42 | The clipboard repair works with any tool that produces text. | 10 | F-1-11 |
| 43 | Exports include CSV, JSON backup, and a vocabulary prompt for Whisper-compatible workflows. | 12 | Pass |
| 44 | Can I leave? | 3 | F-1-26 |
| 45 | Yes. | 1 | Pass |
| 46 | Exports are never paywalled. | 4 | Pass |
| 47 | You can erase the encrypted vault and its local key at any time. | 12 | Pass |
| 48 | Private vocabulary repair. | 3 | Pass |
| 49 | Built by Param Factory. | 4 | Pass |
| 50 | Hero artwork is original AI-generated imagery; provenance is documented in the source repository. | 12 | Pass |

Dynamic landing sentences:

| Sentence | Words | Result |
| --- | ---: | --- |
| Release lookup is unavailable. | 4 | Pass |
| Open the releases page to choose an installer. | 8 | Pass |
| We could not detect the latest build. | 7 | Pass |
| You appear offline. | 3 | Pass |
| You are offline. | 3 | Pass |
| The sample repair book remains available after its first visit. | 10 | Pass |
| License saved. | 2 | Pass |
| Open the desktop app to use unlimited rules. | 8 | Pass |
| That license is not active for this product. | 8 | Pass |
| Could not verify while offline. | 5 | Pass |
| The token is saved for the app to check later. | 10 | Pass |

Control labels were reviewed separately. **Try it with sample data**, **Download for Linux AppImage**, **Copy command**, and **Buy once — $24** name actions/results. The three failures are in F-1-27.

Non-sentence headings and labels were also checked. “How it works,” “Capture your edit,” “Inspect the proposal,” “Reuse your book,” “Encrypted at rest,” “Explicit sources,” “Clipboard on command,” “Portable and erasable,” “Install,” “Price,” “Product limits,” and “Before you install” name their sections. The heading failures are F-1-24 through F-1-26 and F-1-30.

### README sentences and sentence-like list items

| # | Sentence or list item | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Dictation Repair Book turns the explicit text corrections a dictation user already makes into a private, inspectable vocabulary glossary. | 19 | F-1-28 |
| 2 | It is for people whose daily words—names, medications, project codenames, libraries, and commands—are too specific for a general speech recognizer. | 22 | Pass |
| 3 | The product is a Tauri 2 desktop tray app plus a static download site at dictation-repair-book.sociobot.in. | 16 | Pass; developer context |
| 4 | It is not a speech recognizer and never records audio. | 10 | Pass |
| 5 | Name and enable approved source applications. | 6 | Pass |
| 6 | Explicitly capture an uncorrected and corrected clipboard transcript. | 8 | Pass |
| 7 | Infer the changed whole-term span and approve or discard the proposed rule. | 12 | F-1-28 |
| 8 | Apply approved rules locally to a fresh transcript, longest rule first. | 11 | F-1-12 |
| 9 | Search and delete individual rules, with immediate undo. | 8 | Pass |
| 10 | Export CSV, JSON backup, or a Whisper vocabulary prompt; import JSON. | 11 | Pass |
| 11 | Encrypt the native glossary at rest with AES-256-GCM and a random per-device key. | 13 | F-1-13, F-1-28 |
| 12 | Erase the encrypted vault and key from inside the app. | 10 | Pass |
| 13 | Use 25 approved rules for free; a $24 one-time Sociobot license unlocks unlimited approved rules. | 15 | Pass; literal action |
| 14 | Export, deletion, and accessibility are never gated. | 7 | F-1-16 |
| 15 | The desktop app reads clipboard text only after the user presses a paste button. | 14 | Pass |
| 16 | It does not monitor fields, keystrokes, foreground windows, or audio. | 10 | Pass |
| 17 | Native state is encrypted before it is written under the operating system application-data directory. | 14 | F-1-6 |
| 18 | The separate key is created locally and receives mode 0600 on Unix systems. | 13 | F-1-14 |
| 19 | This protects casual at-rest exposure, backups, and accidental inspection. | 9 | F-1-15 |
| 20 | It is not protection from malware or another process already running as the same OS user. | 16 | Pass |
| 21 | Exported files are plaintext by design so they remain interoperable; handle them accordingly. | 13 | F-1-28 |
| 22 | License verification sends only the license token to api.sociobot.in at most once per day. | 14 | F-1-17 |
| 23 | Vocabulary never leaves the app. | 5 | F-1-18 |
| 24 | The website loads no third-party fonts, analytics, or runtime scripts. | 10 | Pass |
| 25 | Requirements: Node 22+, Rust stable, and the Tauri 2 system prerequisites for your platform. | 14 | Pass |
| 26 | The browser app preview intentionally uses local storage and labels itself as a preview. | 14 | Pass |
| 27 | Release builds use the encrypted Rust vault. | 7 | F-1-6 |
| 28 | Open the demo or choose Try it with sample data on the landing page. | 14 | Pass |
| 29 | It starts with three shipped correction rules and stores only under a separate demo browser-storage key. | 16 | Pass |
| 30 | Reset demo restores those samples; Start for real discards demo changes and returns to the download page. | 17 | Pass |
| 31 | See .factory/demo.md for the sample and storage boundary. | 8 | Pass |
| 32 | npm run build reproducibly creates: | 5 | F-1-19 |
| 33 | dist/app/ — the Tauri webview bundle. | 5 | Pass |
| 34 | dist/site/ — the exact static deployment root, with index.html, /privacy, /terms, and installer scripts. | 13 | Pass |
| 35 | No native platform bundle is built in the factory workspace; .github/workflows/release.yml builds each target on GitHub's matching public runner. | 19 | Pass |
| 36 | Download the detected installer from the website, or use a checksum-verifying command: | 12 | Pass |
| 37 | Linux installs the AppImage to ~/.local/bin/dictation-repair-book. | 6 | Pass |
| 38 | macOS downloads and opens the correct Intel/Apple-silicon DMG. | 8 | Pass |
| 39 | Windows verifies and launches the MSI. | 6 | F-1-7 |
| 40 | Version 0.1 builds are unsigned: on macOS, right-click the app and choose Open the first time; Windows may show an unknown-publisher warning. | 22 | F-1-20 |
| 41 | Push a v* tag (for example v0.1.0) or dispatch the release workflow. | 12 | Pass |
| 42 | macOS Apple silicon and Intel DMGs. | 6 | Pass |
| 43 | Windows MSI and NSIS EXE. | 5 | Pass |
| 44 | Linux AppImage and DEB. | 4 | Pass |
| 45 | The publish job assigns stable filenames, generates SHA256SUMS and latest.json, and attaches everything to a GitHub Release. | 17 | F-1-8 |
| 46 | The landing page resolves its primary button from GitHub's CORS-enabled release API. | 12 | Pass; developer note |
| 47 | src/ — desktop interface, rule inference, exports, and license handling. | 9 | Pass |
| 48 | src-tauri/ — encrypted vault, explicit clipboard commands, and tray lifecycle. | 9 | Pass |
| 49 | site/ — static landing and legal pages. | 6 | Pass |
| 50 | site/demo/ — isolated browser demo using shipped sample rules. | 8 | Pass |
| 51 | public/install.* — checksum-verifying installers. | 3 | Pass |
| 52 | scripts/prepare-release.mjs — release asset normalization and manifest generation. | 7 | Pass |
| 53 | .factory/design.md — product-specific visual tokens, motion, and generated-asset provenance. | 8 | Pass |
| 54 | MIT. | 1 | Pass |
| 55 | See LICENSE. | 2 | Pass |

README headings are concrete in repository context. No sentence exceeds the 22-word cap.

## 4. Demo and sandbox evidence

- One click opens `/demo/` on three approved rules: `met a pro lol` → `metoprolol`, `cube or net ease` → `Kubernetes`, and `Neem` → `Niamh`.
- The persistent banner contains the required message, Reset demo, and Start for real.
- A real-storage sentinel remained byte-identical after entry and Reset. Start for real deleted the demo key and preserved the real sentinel.
- Reset restored Kubernetes after an empty demo state was injected.
- A direct sample repair changed “Deploy cube or net ease.” to “Deploy Kubernetes.”
- During direct demo entry and repair, every request stayed on the product origin. The landing separately contacted only the documented GitHub release API plus same-origin assets.
- After one online landing visit, `/demo/` reopened offline with sample data and no console/page errors.
- The sandbox works subject to F-1-1, F-1-2, F-1-3, and F-1-9.

## 5. Claim execution

The repository was cloned to a fresh temporary directory and installed with `npm ci`. The two Rust commands initially stopped before tests because the base container lacked the README-listed Tauri Linux packages (`glib-2.0` was first missing). After installing `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev`, and `patchelf`, both exact commands passed. That prerequisite stop is not counted as a product failure.

| Claim id | Exact command result |
| --- | --- |
| `demo-sandbox` | Pass |
| `rule-management` | Pass |
| `literal-code-replacement` | Pass |
| `local-repair` | Pass |
| `portable-exports` | Pass |
| `json-roundtrip` | Pass |
| `whisper-export` | Pass |
| `private-demo` | Pass |
| `website-privacy` | Pass |
| `explicit-access` | Pass |
| `clipboard-on-command` | Pass |
| `free-book` | Pass |
| `erase-local-book` | Pass |
| `native-erase` | Pass after documented system prerequisites |
| `license-backoff` | Pass |
| `license-daily-cache` | Pass |
| `license-return` | Pass |
| `encrypted-vault` | Command passes; inadequate assertion in F-1-6 |
| `revoked-license-locks` | Pass |
| `checksum-installers` | Command passes; incomplete Windows assertion in F-1-7 |
| `release-matrix` | Command passes; source-text assertion in F-1-8 |
| `offline-demo` | Pass |

Every claim id has exactly one marker. The current GitHub `v0.1.2` release independently contains both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, and `latest.json`.

The first full `npm test` invocation passed 25 browser tests before Chromium segfaulted while creating the last context; the exact rerun passed 14/14 Vitest and 26/26 Playwright tests. `npm run build`, `npm run typecheck`, and `npm run lint` passed. `dist/app/` and `dist/site/` were produced. This is runner evidence, not a product finding.

## 6. Earlier history

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The earlier handoff describes nine repair groups:

| Earlier handoff item | Independent result |
| --- | --- |
| 1. Malformed import/corrupt state recovery | Confirmed by full tests and strict parsing. |
| 2. Literal replacement characters | Confirmed by tagged unit test. |
| 3. Complete erasure | Confirmed for browser and native files. |
| 4. Demo lifecycle | Confirmed live; claim-test gap remains F-1-9. |
| 5. Removed-source portability | Confirmed by export test and `sourceName`. |
| 6. 390px layout/touch | Cards and controls fit, but F-1-1 and F-1-4 regress the mobile result. Partially fixed. |
| 7. Offline demo | Confirmed live. |
| 8. Metadata/route inventory | Metadata and direct 404 pass; F-1-2 and F-1-5 remain. Partially fixed. |
| 9. Claim integrity | Commands pass and markers are unique, but F-1-6 through F-1-21 remain. Partially fixed. |

The rebuilt landing, demo, Privacy, Terms, 404, and service worker match the live bytes, so source observations apply to the deployment.

## 7. Structure, links, and visual identity

- Pass: all public documents have `lang=en`, one DOM h1, one main, descriptions, canonicals, OG/Twitter images, favicon, and Apple touch icon. Titles follow the required pattern and stay under 60 characters.
- Pass: a cold unknown URL returns HTTP 404 and the designed 404 page; F-1-5 covers the controlled-session regression.
- Pass: same-origin links returned 200; GitHub source/issues returned 200; the release asset returned 302 to storage; checkout returned the expected 303 to hosted Dodo checkout. No dead link was found.
- Pass: no console or page errors occurred on live route loads.
- Pass: the marked-up ledger, paper collage, squared rules, hard shadows, acid/cobalt/coral palette, and mono annotations are product-specific, not a generic SaaS template.
- Fail: h1/global chrome are in F-1-30; Back/focus/deep links are in F-1-2.

## 8. Missed leverage

No additional AI feature is justified. Rule inference is deterministic, inspectable, and private; model-generated replacements would add cost and privacy risk without improving the explicit-correction job. CSV/JSON export, JSON restore, clipboard repair, and a Whisper prompt already exist. No provider key is embedded. The missing try-out leverage is the native sample project and real-app walkthrough in F-1-3.

## What would make this perfect

Resolve every finding, then rerun from a fresh browser and clone. Make the mobile demo unobstructed; give demo screens real history, deep links, focus, and announcements; ship the native sample; remove the serious Axe issue; preserve 404 status through the service worker; turn every public claim into a complete observable test; rewrite every flagged phrase; and make the header/footer/h1 skeleton consistent. The target is zero remaining findings.
