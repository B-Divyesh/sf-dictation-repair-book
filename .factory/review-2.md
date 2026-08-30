# Adversarial first-read review 2 — FAIL

Reviewed 2026-08-30 UTC against repository commit `d42a8955110f00de2c742e18e70e3decffa99794` and <https://dictation-repair-book.sociobot.in> in fresh Chromium contexts at 390×844 and 1440×900.

**Verdict: FAIL.** There are 16 findings: six blocking and ten minor. The cold value proposition and browser demo are clear, but the live checkout charges a different price from every public `$24` promise, the installed-app sample can erase real storage while its banner says nothing is saved, service-worker-controlled valid URLs become 404s, required facts fall below the first mobile viewport, the demo still lacks the shared site chrome required by the earlier review, and a previously removed merchant-of-record claim remains in the live demo. A PASS requires zero findings and no untested claim.

## 1. Cold first screen

No scrolling was performed before this assessment.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Turns dictation corrections into reusable replacement rules. | People whose dictation misses names, medications, code terms, or workplace jargon. | **Try it with sample data**. | Pass |
| 1440×900 | Same answer, reinforced by the correction-ledger illustration. | Same named audience. | **Try it with sample data**. | Pass |

The exact useful copy is “Turn dictation corrections into reusable rules,” “For dictation users with names, medications, code terms, or workplace jargon,” and “Try it with sample data.” All three answers are visible on both screens, so the mandatory first-read question passes.

The first-screen fact requirement does not pass on the phone. At 390×844, `.hero-actions` ends at y=835.8 and `.trust-line` starts at y=859.8. The privacy, offline, and price facts therefore require scrolling. This reopens F-1-29 below.

## 2. Findings

### Blocking

#### F-2-1 — The advertised $24 price contradicts the live $12 checkout

- **Exact quote/location:** landing first screen, “25 approved rules are free; pay $24 once for unlimited rules”; pricing action, “Buy once — $24”; README, Terms, and app Settings repeat `$24`.
- **Observed result:** two fresh requests through `https://api.sociobot.in/api/v1/products/dictation-repair-book/checkout` produced Dodo one-time sessions whose product data says `"price":1200,"currency":"USD"`; the checkout renders **$12.00**.
- **Why this fails:** a buyer is given two prices for the same license. The `free-book` command passes only because it asserts the page’s `$24` text and injects a fake cached license. It never verifies the checkout amount, so the listed claim is not actually tested.
- **Concrete fix:** choose one authoritative price. If the Sociobot catalog is authoritative, change every `$24` reference to `$12`; otherwise have the billing owner change the catalog to `$24`. Add a read-only claim test that follows the checkout response and asserts `one_time`, `USD`, and the exact amount before release.

#### F-1-3 — The native sample mode can delete real data while claiming isolation

- **Exact quote/location:** native banner in `src/main.ts`, “Demo — sample data, nothing is saved”; README, “It runs in memory until you choose Keep this repair book.”
- **Observed result:** with the production native code path and a mocked Tauri IPC boundary, **Load sample repair book → Settings → Erase all local data** invoked `erase_vault` and deleted the existing real license and verdict. **Remove from device** also deleted the real license while the demo banner remained visible.
- **Why this fails:** native sample mode guards repair-book saves, but `erase`, `remove-license`, and license submission still use the real vault or unprefixed license keys. Demo mode therefore mutates real storage. This is a regression/half-fix of the earlier desktop-demo finding and violates the demo sandbox contract.
- **Concrete fix:** give native sample mode an isolated state and license namespace. While `nativeSampleMode` is true, never call `erase_vault`, `save_state`, `storeLicense`, or `clearLicense` against real data. Make erase reset only the sample. Add a `native-sample-isolation` claim and an IPC-spy test that seeds a real vault/license, exercises every Settings action, exits the sample, and byte-compares the real state.

#### F-1-5 — The service worker turns valid route variants into 404s

- **Exact location:** `public/sw.js`; `PAGES` contains only `/demo/`, `/privacy/`, and `/terms/`, while every other navigation path is forced to cached `/404.html`.
- **Observed result:** after the service worker controlled the page, `/demo`, `/privacy`, and `/terms` each returned HTTP 404 and “Page not found.” Cold network requests to the same URLs return the real pages. The sitemap itself publishes `/privacy` and `/terms` without trailing slashes.
- **Why this fails:** valid deep links work for a first visit and break for a returning visitor. This is a routing regression in the area covered by the earlier F-1-5 repair.
- **Concrete fix:** normalize known route variants before the missing-route branch, or fetch navigations and use the cached 404 only after a real 404/network failure. Publish canonical trailing-slash URLs in the sitemap. Add controlled online and offline tests for both slash forms of `/demo`, `/privacy`, and `/terms`, plus a truly unknown route.

#### F-1-29 — Required privacy, offline, and price facts remain below the first phone screen

- **Exact location:** landing `.trust-line` at 390×844.
- **Observed result:** the line starts at y=859.8, 15.8 px below the viewport. The visible first screen ends with the secondary download action and its note.
- **Why this fails:** the previous finding required the privacy/offline/price facts in the first screen. They exist in the document but still are not visible without scrolling on the target phone.
- **Concrete fix:** move three short fact lines directly below the primary sample action and before the secondary download, or reduce the mobile hero height. Add a 390×844 assertion that the complete fact block ends at or above `window.innerHeight`.

#### F-1-30 — The shared header/footer repair remains incomplete

- **Exact location:** `/demo/` has no site `<header>` or `<footer>`; landing navigation is Demo/How it works/Privacy/Price, while legal navigation is Demo/Privacy/Terms.
- **Why this fails:** the earlier finding explicitly required consistent global chrome on every route. The demo still strands the visitor inside app chrome, and the legal/landing route lists differ. This is a half-fix of F-1-30.
- **Concrete fix:** use one compact site header and footer on `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404. Keep the demo’s Capture/Rules/Test/Settings navigation as secondary product navigation. Preserve one visible page h1.

#### F-1-16 — The unlisted merchant-of-record claim was moved, not removed

- **Exact quote/location:** live `/demo/#settings`, “Sociobot/Dodo is merchant of record.”
- **Why this fails:** the earlier finding required this assertion to be tested or removed. It disappeared from the landing and legal pages but remains in the product UI, and `claims.json` still has no merchant-of-record entry. The slash phrasing also does not identify which legal entity contracts with the buyer.
- **Concrete fix:** remove the sentence, or name the exact merchant shown by hosted checkout and add a read-only billing claim that verifies the merchant identity from the checkout contract.

### Minor

#### F-2-2 — The README build-output claim is absent from `claims.json`

- **Exact quote/location:** README, “`npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment.”
- **Why this fails:** this is a concrete, testable claim a contributor relies on, but it has no inventory entry or uniquely tagged assertion.
- **Concrete fix:** add a `build-output` claim whose clean-slate test runs the build and asserts both output roots and their entry documents.

#### F-2-3 — The release-refusal claim is tested but not inventoried

- **Exact quote/location:** README, “The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree.”
- **Why this fails:** `tests/repair.test.ts` has an untagged test for the behavior, but `claims.json` has no matching claim. The inventory is therefore incomplete.
- **Concrete fix:** add a `release-source-identity` entry and tag the existing test `@claim:release-source-identity`.

#### F-2-4 — The same saved entries are called rules, a rule book, and vocabulary

- **Exact quotes/locations:** landing headline, “reusable rules”; pricing, “unlimited rule book”; demo h1, “Approved vocabulary”; demo navigation, “Rules.”
- **Why this fails:** a first-time visitor must infer whether vocabulary and rules are different objects. “Rule book” also conflicts with the established collection name “repair book.”
- **Concrete fix:** use **rule** for an entry and **repair book** for the collection. Rewrite pricing as “Unlock unlimited approvals once—no subscription” and the demo h1 as “Approved rules.” Reserve “Whisper vocabulary prompt” for that export format.

#### F-2-5 — Sample source names do not match the promised “source application” model

- **Exact quotes/locations:** landing, “Name and enable each application yourself”; README, “choose a source application”; demo sources, “Clinical notes” and “Engineering notes.”
- **Why this fails:** the samples are categories of notes, not application names. The demo makes “source” look like a document category while the product and privacy copy describe an application-level consent boundary.
- **Concrete fix:** seed actual application-style labels such as “Notes” and “VS Code,” or rename the product concept everywhere to “source label” and stop describing it as application access.

#### F-2-6 — The tape uses ambiguous absolute slogans

- **Exact quote/location:** landing tape, “LOCAL ONLY / EXPORT ANYTIME / DELETE COMPLETELY.”
- **Why this fails:** “local” does not identify which data stays local, and “delete completely” does not identify what is deleted. The first phrase is broader than the listed request tests because license verification does use a network service.
- **Concrete fix:** “Repair-book text stays on this device / Export CSV or JSON / Erase the vault, key, and license data.” Add an egress claim for the first sentence if it remains.

#### F-2-7 — “Before you install” does not name its section out of context

- **Exact quote/location:** landing h2, “Before you install.”
- **Why this fails:** in a screen-reader heading list, it does not say that the section covers product limits and compatibility.
- **Concrete fix:** “Product limits and compatibility.”

#### F-2-8 — “release repair” is internal jargon in the public footer

- **Exact quote/location:** landing, Privacy, Terms, and 404 footers, “v0.1.5 · release repair.”
- **Why this fails:** a visitor cannot use or interpret “release repair,” and it is not a build identifier.
- **Concrete fix:** remove it or replace it with the actual short source commit, for example “v0.1.5 · build 2f2e706.”

#### F-2-9 — The README release instruction uses compressed workflow jargon

- **Exact quote/location:** “Push a version-synchronised `v*` tag, or dispatch `.github/workflows/release.yml` with an existing tag…”
- **Why this fails:** “version-synchronised” and “dispatch” do not tell a new maintainer which versions to align or what action to take.
- **Concrete fix:** “Set the same version in `package.json`, `Cargo.toml`, and `tauri.conf.json`. Then push its `v*` tag or run the release workflow for that tag.”

#### F-2-10 — Demo route navigation uses noun-labelled buttons

- **Exact location:** `/demo/` renders `<button>` controls named “Capture,” “Rules,” “Test,” and “Settings” while changing the URL/history.
- **Why this fails:** Rules and Settings are not result-naming verbs, and route navigation is link behavior. The controls work by keyboard, but their semantics do not match their outcome.
- **Concrete fix:** render anchors such as `<a href="#rules">Rules</a>` for route navigation. If buttons are retained, label them “Open rules” and “Open settings.”

#### F-2-11 — The privacy list reintroduces security jargon

- **Exact quote/location:** landing privacy list, “No keylogging, no arbitrary field access, no audio retention.”
- **Why this fails:** “keylogging” and “arbitrary field access” are implementation/security terms. The first-screen version already explains the same boundary more plainly.
- **Concrete fix:** “The app does not record typing, read other fields, or keep audio.”

## 3. Copy audit

Counts treat hyphenated terms, code identifiers, versions, and URLs as one word. No landing or README sentence exceeds 22 words, and no banned marketing adjective appears. “Unlock” is literal license behavior. Flags below map to findings above.

### Landing page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn dictation corrections into reusable rules. | 6 | Pass |
| 2 | For dictation users with names, medications, code terms, or workplace jargon. | 11 | Pass |
| 3 | Turn explicit corrections into rules you can inspect and reuse. | 10 | Pass |
| 4 | Opens a separate sample repair book. | 6 | Pass |
| 5 | Nothing enters your real book. | 5 | Pass |
| 6 | Checks the latest build when you choose a download. | 9 | Pass |
| 7 | No audio or account. | 4 | Pass |
| 8 | No background monitoring of fields or keystrokes. | 7 | Pass |
| 9 | Demo works offline after one visit. | 7 | F-1-29: below first mobile viewport |
| 10 | 25 approved rules are free; pay $24 once for unlimited rules. | 11 | F-2-1 |
| 11 | Explicit edit → inspectable rule. | 4 | Pass |
| 12 | Save corrections for later clipboard text. | 6 | Pass |
| 13 | Save a correction once, then apply the approved rule to later clipboard text. | 13 | Pass |
| 14 | Create a reusable rule in three steps. | 7 | Pass |
| 15 | Capture your edit. | 3 | Pass |
| 16 | Copy the original dictation and your corrected sentence. | 8 | Pass |
| 17 | Capture happens only when you click. | 6 | Pass |
| 18 | Inspect the proposal. | 3 | Pass |
| 19 | The app isolates the changed span. | 6 | Pass |
| 20 | Approve it, or discard it without saving anything. | 8 | Pass |
| 21 | Reuse your book. | 3 | Pass |
| 22 | Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 | Pass |
| 23 | See the installed repair book at work. | 7 | Pass |
| 24 | Capture — paste the original and corrected sentence. | 7 | Pass |
| 25 | Review — inspect approved rules and their sources. | 7 | Pass |
| 26 | Test — run approved rules on later clipboard text. | 8 | Pass |
| 27 | Export or erase — keep a portable copy or remove local data. | 11 | Pass |
| 28 | How the app stores your vocabulary. | 6 | Pass |
| 29 | The desktop app encrypts the repair book on your device. | 10 | Pass |
| 30 | AES-256-GCM vault stored on your device. | 6 | Pass |
| 31 | Name and enable each application yourself. | 6 | F-2-5 |
| 32 | No keylogging, no arbitrary field access, no audio retention. | 9 | F-2-11 |
| 33 | Export anytime. | 2 | Pass |
| 34 | Erase the vault and key in one action. | 8 | Pass |
| 35 | Install the desktop app. | 4 | Pass |
| 36 | The install commands verify SHA-256 checksums. | 6 | Pass |
| 37 | Direct downloads include a published checksum. | 6 | Pass |
| 38 | Builds are unsigned, so your operating system may ask you to confirm the first launch. | 15 | Pass |
| 39 | Pay once for more approved rules. | 6 | Pass |
| 40 | Start with 25 approved rules, testing, and every export for free. | 11 | Pass |
| 41 | Unlock an unlimited rule book once—no subscription. | 8 | F-2-4 |
| 42 | Unlimited approved rules. | 3 | Pass |
| 43 | Local retests and every export. | 5 | Pass |
| 44 | One-time purchase. | 2 | Pass |
| 45 | A refunded license no longer permits paid approvals. | 8 | Pass |
| 46 | Before you install. | 3 | F-2-7 |
| 47 | Does it record or transcribe audio? | 6 | Pass |
| 48 | No. | 1 | Pass |
| 49 | It repairs transcript text from dictation tools you already use. | 10 | Pass |
| 50 | Audio never enters the app. | 5 | Pass |
| 51 | Does it watch everything I type? | 6 | Pass |
| 52 | No. | 1 | Pass |
| 53 | You opt in to named source applications and click “Paste clipboard” for each capture. | 14 | F-2-5 |
| 54 | v0.1 does not monitor fields or keystrokes. | 7 | Pass |
| 55 | Which engines does it support? | 5 | Pass |
| 56 | Paste text from your dictation tool, then run approved replacements locally. | 11 | Pass |
| 57 | Exports include CSV, JSON backup, and a vocabulary prompt for Whisper-compatible workflows. | 12 | Pass |
| 58 | Can I export and delete my data? | 7 | Pass |
| 59 | Yes. | 1 | Pass |
| 60 | Exports are never paywalled. | 4 | Pass |
| 61 | You can erase the encrypted vault and its local key at any time. | 13 | Pass |
| 62 | Private rules for repaired dictation text. | 6 | Pass |
| 63 | Built by Param Factory. | 4 | Pass |
| 64 | v0.1.5 · release repair. | 3 | F-2-8 |
| 65 | Hero artwork is original AI-generated imagery; provenance is documented in the source repository. | 13 | Pass; provenance confirmed in `.factory/design.md` and `assets/src/` |

### Dynamic landing sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Downloads are being published. | 4 | Pass |
| No published installer was found. | 5 | Pass |
| Check the releases page shortly. | 5 | Pass |
| You appear offline. | 3 | Pass |
| The sample repair book remains available after its first visit. | 10 | Pass |
| Select and copy the command. | 5 | Pass |
| License saved. | 2 | Pass |
| Open the desktop app to use unlimited rules. | 8 | Pass |
| That license is not active for this product. | 8 | Pass |
| Could not verify while offline. | 5 | Pass |
| The token is saved for the app to check later. | 10 | Pass |
| You are offline. | 3 | Pass |

The non-sentence statuses “Checking available download…,” “Copied,” and “Checking license…” are concise and actionable.

### Landing headings, labels, and actions

| Text | Words | Result |
| --- | ---: | --- |
| PRIVATE DESKTOP APP / v0.1.5 | 4 | Pass: format and version |
| WHY CORRECTIONS REPEAT | 3 | Pass |
| HOW IT WORKS | 3 | Pass |
| DESKTOP APP WALKTHROUGH | 3 | Pass |
| PRIVACY | 1 | Pass |
| INSTALL | 1 | Pass |
| PRICE | 1 | Pass |
| PRODUCT LIMITS | 2 | Pass |
| BEFORE → AFTER → APPROVE → REUSE | 4 | Pass: process summary |
| LOCAL ONLY / EXPORT ANYTIME / DELETE COMPLETELY | 6 | F-2-6 |
| Save corrections for later clipboard text | 6 | Pass |
| Create a reusable rule in three steps | 7 | Pass |
| Capture your edit | 3 | Pass |
| Inspect the proposal | 3 | Pass |
| Reuse your book | 3 | Pass |
| See the installed repair book at work | 7 | Pass |
| How the app stores your vocabulary | 6 | Pass |
| Encrypted at rest | 3 | Pass |
| Explicit sources | 2 | F-2-5 |
| Clipboard on command | 3 | Pass |
| Portable and erasable | 3 | Pass |
| Install the desktop app | 4 | Pass |
| Pay once for more approved rules | 6 | Pass |
| One-time license | 2 | Pass |
| Before you install | 3 | F-2-7 |
| Choose a download | 3 | Pass |
| Try it with sample data | 5 | Pass |
| Download for your computer | 4 | Pass |
| Copy command | 2 | Pass |
| Buy once — $24 | 3 | F-2-1 |
| Enter license token | 3 | Pass |
| Verify license | 2 | Pass |
| Checking available download… | 3 | Pass: status |
| Download for Linux AppImage / Windows / macOS | 7 | Pass: platform-dependent result |
| Open the releases page | 4 | Pass |
| v0.1.5 · checksum published · unsigned build | 6 | Pass: dynamic release facts |

### Landing image alternatives

| Alternative text | Words | Result |
| --- | ---: | --- |
| Paper correction ledger with abstract waveforms, a before-to-after arrow, clipboard, and padlock | 12 | Pass |
| Desktop Capture screen with original and corrected dictation fields | 9 | Pass |
| Desktop Rules screen showing approved metoprolol, Kubernetes, and Niamh rules | 10 | Pass |
| Desktop Test screen showing Kubernetes applied to a fresh transcript | 10 | Pass |
| Desktop Settings screen with exports, theme controls, license, and erase action | 11 | Pass |

### README sentences and sentence-like list items

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn explicit dictation corrections into private reusable rules. | 8 | Pass |
| 2 | It is for people whose names, medication spellings, code terms, and workplace jargon need careful repair after dictation. | 18 | Pass |
| 3 | Dictation Repair Book is a Tauri 2 desktop app with a static download site at dictation-repair-book.sociobot.in. | 16 | Pass |
| 4 | It repairs text you paste; it is not a speech recognizer and does not record audio. | 16 | Pass |
| 5 | Capture an uncorrected and corrected sentence after you choose a source application. | 12 | F-2-5 |
| 6 | Find the changed words, then let you approve or discard a reusable rule. | 13 | Pass |
| 7 | Apply approved rules locally to a fresh transcript, with longer matching rules first. | 13 | Pass |
| 8 | Search, delete, undo, and export rules as CSV, JSON backup, or a Whisper vocabulary prompt. | 15 | Pass |
| 9 | Encrypt the native repair book with AES-256-GCM and a local per-device key. | 12 | Pass |
| 10 | Erase the encrypted repair book, temporary vault file, key, and local license data. | 13 | Pass |
| 11 | Include 25 approved rules and every export for free; a $24 one-time license allows further approvals. | 16 | F-2-1 |
| 12 | The desktop app reads clipboard text only after you press Paste clipboard. | 12 | Pass |
| 13 | It does not monitor fields, keystrokes, foreground windows, or audio. | 10 | Pass |
| 14 | Native state is encrypted before it is written under the operating-system application-data directory. | 13 | Pass |
| 15 | On Unix, the local key has mode 0600. | 8 | Pass |
| 16 | The repair-book file is encrypted at rest; processes running as your OS user may still access the local key. | 19 | Pass |
| 17 | Exports are plaintext so other tools can read them. | 9 | Pass |
| 18 | The sample demo sends no request outside the product origin. | 10 | Pass |
| 19 | License verification sends the license token to api.sociobot.in; it does not include repair-book text. | 14 | Pass |
| 20 | Open the demo or choose Try it with sample data. | 10 | Pass |
| 21 | The landing alias `/?demo=1` opens the same demo. | 8 | Pass |
| 22 | It uses the `demo:drb_web_preview_state` browser-storage namespace. | 6 | Pass |
| 23 | Reset demo restores the shipped sample. | 6 | Pass |
| 24 | Start for real deletes the demo namespace and returns to the download page without changing `drb_web_preview_state`. | 16 | Pass for browser demo |
| 25 | In the installed app, the first-run screen has Load sample repair book. | 12 | F-1-3: unlisted native-demo claim |
| 26 | It runs in memory until you choose Keep this repair book; Start for real discards it. | 16 | F-1-3: incomplete isolation |
| 27 | See `.factory/demo.md`. | 2 | Pass |
| 28 | Requirements: Node 22+, Rust stable, and the Tauri 2 system prerequisites. | 11 | Pass |
| 29 | `npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment. | 16 | F-2-2 |
| 30 | Download the detected installer from the website, or use the checksum-verifying install command. | 13 | Pass |
| 31 | The install commands compare the downloaded package with `SHA256SUMS`. | 9 | Pass |
| 32 | Direct downloads include that published checksum. | 6 | Pass |
| 33 | Current builds are unsigned, so macOS and Windows may ask you to confirm the first launch. | 16 | Pass |
| 34 | Push a version-synchronised `v*` tag, or dispatch `.github/workflows/release.yml` with an existing tag, to build macOS DMGs, Windows MSI/EXE, and Linux AppImage/DEB files. | 22 | F-2-9 |
| 35 | The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree. | 21 | F-2-3 |
| 36 | It publishes `SHA256SUMS`, `latest.json`, and `build-info.json` with the exact source commit before attaching all files to the GitHub Release. | 19 | Pass |
| 37 | MIT. | 1 | Pass |
| 38 | See LICENSE. | 2 | Pass |

README headings — “What it does,” “Privacy,” “Try the sample repair book,” “Develop,” “Test and build,” “Install and release,” and “License” — name their sections in repository context.

### Terminology table

| Concept | Observed terms | Result |
| --- | --- | --- |
| Before/after record | correction | Consistent |
| Reusable replacement | rule; approved vocabulary | F-2-4 |
| Saved collection | repair book; rule book | F-2-4 |
| Origin label | source application; source; “Clinical notes”; “Engineering notes” | F-2-5 |
| Isolated example | demo; sample repair book | Consistent |
| Paid state | license | Consistent |

## 4. Demo and sandbox

The browser demo passes its required flow:

- One click opens `/demo/?demo=1` directly on three realistic rules: `met a pro lol` → `metoprolol`, `cube or net ease` → `Kubernetes`, and `Neem` → `Niamh`.
- The first screen already shows the product in use. The banner says “Demo — sample data, nothing is saved” and offers Reset demo and Start for real.
- A fresh repair changed “Deploy the cube or net ease service.” to “Deploy the Kubernetes service.”
- Reset restored the shipped rules. Start for real removed `demo:drb_web_preview_state` and preserved a byte-identical `drb_web_preview_state` sentinel.
- Every browser request during entry and repair stayed on `https://dictation-repair-book.sociobot.in`.
- After one online visit, the complete demo reopened offline under service-worker control with no page or console errors.

The installed-app sample fails isolation for the Settings actions described in F-1-3. That makes the overall desktop demo contract blocking even though the web demo is sound.

## 5. Claim execution

The repository was cloned with `git clone --no-local` into `/tmp/drb-review2-claims.oH7YOV/repo`, and `npm ci` installed 168 packages with zero reported vulnerabilities. The first native attempts stopped before testing because the base container lacked the README-listed Tauri libraries, and PowerShell was absent. After installing `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev`, `patchelf`, and PowerShell 7.6.5, the exact commands were rerun and passed. Those prerequisite stops are not product failures.

| Claim id | Exact command result | Independent result |
| --- | --- | --- |
| `demo-sandbox` | Pass | Browser sandbox pass; native sample gap is F-1-3 |
| `no-account` | Pass | Pass |
| `rule-management` | Pass | Pass |
| `literal-code-replacement` | Pass | Pass |
| `longest-rule-first` | Pass | Pass |
| `local-repair` | Pass | Pass |
| `portable-exports` | Pass | Pass |
| `json-roundtrip` | Pass | Pass |
| `whisper-export` | Pass | Pass |
| `private-demo` | Pass | Same-origin request log confirmed live |
| `website-privacy` | Pass | No third-party script/font/analytics request confirmed live |
| `on-demand-release-lookup` | Pass | Cold landing made no GitHub API request |
| `explicit-access` | Pass | Pass |
| `clipboard-on-command` | Pass | Pass |
| `free-book` | Command passes | **Claim fails live:** checkout is $12, not $24; F-2-1 |
| `erase-local-book` | Pass | Pass outside native sample mode |
| `native-erase` | Pass after prerequisites | Pass outside native sample mode |
| `license-backoff` | Pass | Pass |
| `license-daily-cache` | Pass | Pass |
| `license-request-privacy` | Pass | Pass |
| `license-return` | Pass | Pass |
| `encrypted-vault` | Pass after prerequisites | Production save/load path and plaintext rejection pass |
| `per-device-key` | Pass after prerequisites | Pass |
| `revoked-license-locks` | Pass | Pass |
| `checksum-installers` | Pass | Pass |
| `powershell-checksum-installer` | Pass after PowerShell install | Match and mismatch paths pass |
| `release-matrix` | Pass | Live v0.1.5 release contains all promised assets |
| `unsigned-build` | Pass | Pass |
| `offline-demo` | Pass | Live controlled offline load also passes |

Unlisted claims remain in F-1-3, F-1-16, F-2-2, F-2-3, and F-2-6. The manifest also cannot rescue F-2-1 because its current tagged test does not inspect the checkout.

The complete repository gates passed separately: 21/21 Vitest tests, 42/42 Playwright tests, `npm run typecheck`, `npm run lint`, and `npm run build`. The build emitted `dist/app/` and `dist/site/`; landing JavaScript is 1.88 KB gzip and demo JavaScript is 9.35 KB gzip.

## 6. Earlier finding verification

Every finding from `.factory/review-1.md` and every repair assertion in `.factory/polish-1.md` and the prior handoff was checked against the live site and source.

| Earlier id | Result in round 2 | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Mobile banner bottom y=102; active h1 top y=147.4; no overlap. |
| F-1-2 | Fixed | `#test` deep link, Settings push, Back/Forward, h1 focus, and live announcement work. |
| F-1-3 | **Regressed/half-fixed — BLOCKING** | Native sample exists and walkthroughs load, but sample Settings can erase the real vault/license. |
| F-1-4 | Fixed | Axe reports zero serious/critical findings on landing at 390 px. |
| F-1-5 | **Regressed — BLOCKING** | Unknown routes retain 404, but valid extensionless routes become 404 under service-worker control. |
| F-1-6 | Fixed | Native claim saves and loads a complete state through production vault functions and rejects plaintext. |
| F-1-7 | Fixed | Executable PowerShell checksum match/mismatch fixture passes. |
| F-1-8 | Fixed | Fixture preparation passes; live v0.1.5 has both DMGs, MSI, EXE, AppImage, DEB, checksums, and manifests. |
| F-1-9 | Fixed for web demo | Real browser storage remained byte-identical through Reset and Start for real. Native isolation is separately reopened under F-1-3. |
| F-1-10 | Fixed | `no-account` clean-context demo test passes. |
| F-1-11 | Fixed | Unsupported “any tool” wording is gone. |
| F-1-12 | Fixed | `longest-rule-first` is inventoried and passes. |
| F-1-13 | Fixed | Two fresh native vault directories receive distinct 32-byte keys. |
| F-1-14 | Fixed | Unix key mode assertion passes. |
| F-1-15 | Fixed | README now states the OS-user boundary instead of claiming backup protection. |
| F-1-16 | **Half-fixed — BLOCKING** | The assertion left landing/legal copy but remains live in demo Settings without a claim entry. |
| F-1-17 | Fixed | Request capture proves the license token is the only query data and repair text is absent. |
| F-1-18 | Fixed | Broad “vocabulary never leaves” copy was narrowed to tested request behavior. |
| F-1-19 | Fixed | “Reproducibly” was removed. |
| F-1-20 | Fixed | Unsigned-build claim and configuration test pass. |
| F-1-21 | Fixed | Copy distinguishes installer verification from a published checksum for direct files. |
| F-1-22 | Fixed | Headline states the actual correction-to-rule job. |
| F-1-23 | Fixed | First-screen monitoring copy is plain and specific. |
| F-1-24 | Fixed | Unsupported recognizer generalizations and slogan are gone. |
| F-1-25 | Fixed | Privacy heading names storage behavior. |
| F-1-26 | Fixed | FAQ heading names export and deletion. |
| F-1-27 | Fixed | Download and license controls name their immediate result. |
| F-1-28 | Fixed with new drift | README uses repair book/rule consistently; new landing/demo drift is F-2-4. |
| F-1-29 | **Half-fixed — BLOCKING** | Facts were added and primary styling was corrected, but facts remain below 390×844. |
| F-1-30 | **Half-fixed — BLOCKING** | Plain legal h1s and demo h1 routing work; shared header/footer remains inconsistent and absent from demo. |

## 7. Structure, accessibility, links, and identity

- **Pass:** `/`, `/demo/`, `/privacy/`, `/terms/`, and unknown-route 404 have `lang=en`, one h1, one main, route-specific titles, descriptions, canonicals, OG/Twitter metadata, favicon, Apple touch icon, and no horizontal overflow at 390 px.
- **Pass:** the social image is 1200×630, the Apple icon is 180×180, and all meaningful images have alt text.
- **Pass:** fresh unknown routes return HTTP 404 with the designed page and a way home. F-1-5 covers valid routes broken only after service-worker control.
- **Pass:** all landing links were crawled. Same-origin routes returned 200, GitHub source returned 200, latest release redirected to v0.1.5, and checkout returned the expected hosted-payment 303. No dead link was found.
- **Pass:** Axe found zero serious or critical violations on landing, demo, Privacy, Terms, and 404 at both 390×844 and 1440×900. The factory URL verifier found one h1/main, complete alt/button names, and no landing console errors.
- **Pass:** skip-link focus, demo keyboard navigation, hash deep links, route announcements, and delayed Back focus work. Reduced-motion and touch-size regressions are covered by the passing suite.
- **Pass:** the marked-up ledger, hard rules/shadows, acid/cobalt/coral palette, paper collage, and mono annotations are recognizably product-specific rather than a generic SaaS template.
- **Fail:** F-1-30 covers inconsistent global chrome; F-1-5 covers controlled routing and the sitemap/canonical mismatch.

## 8. Missed leverage

No AI feature is justified. The core operation is a deterministic, inspectable replacement inferred from an explicit before/after edit. Sending private vocabulary to a model would add cost and disclosure without improving this job. No provider key is embedded.

The expected portability features are present: CSV export, complete JSON backup/import, Whisper prompt copy, clipboard repair, and full deletion. Sync would conflict with the local-first brief unless introduced as an explicit opt-in. No separate missed-leverage finding is warranted beyond fixing native sample isolation.

## What would make this perfect

Align the public and checkout prices and test the real billing contract; make every native sample action incapable of reading, writing, or deleting real vault/license state; preserve all valid route variants under service-worker control; keep the three required facts inside 390×844; use shared site chrome on every route; inventory the remaining README claims; and apply every concrete copy/terminology rewrite above. Then rerun the full review from fresh browser contexts and a fresh clone. The acceptance target remains zero findings and zero untested claims.
