# Adversarial first-read review 5 — FAIL

Reviewed 2026-09-02 UTC against `b67ff87c66543a934b59032fb6d10650dec429a8` and the live site at <https://dictation-repair-book.sociobot.in>. This was a fresh-browser review at 390×844 and 1440×900, followed by a clean-clone claim run. The review found one minor structural defect. Per the work order, a minor defect means the verdict is **FAIL**.

## Verdict

**FAIL — one finding remains.** No blocking finding was found. All 34 declared claim commands passed individually, the full local gate passed, and the product is clear and tryable. The landing page has external destinations whose visible labels do not say that they leave the product site.

## 1. Cold first screen

No scrolling was performed before this assessment.

| Viewport | What it does | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Turns manual dictation corrections into reusable rules that can repair later pasted text. | Dictation users whose names, medications, code terms, or workplace jargon are misheard. | **Try it with sample data**. | Pass |
| 1440×900 | Same; the correction-ledger art reinforces the explicit before → after → rule workflow. | Same named audience. | **Try it with sample data**. | Pass |

The first screen states: “Turn dictation corrections into reusable rules.” It names the audience in the next two short sentences and explains the sample action: “Opens a separate sample repair book. Nothing enters your real book.” At 390px, all three facts (privacy/account, offline, and price) were visible before the fold.

## 2. Finding

### Minor

#### F-5-1 — Landing links that leave the site do not identify their destination

- **Location/quote:** landing hero, “Download for your computer” links to `github.com/B-Divyesh/sf-dictation-repair-book/releases/latest`; landing price card, “Buy once — $12” links to `api.sociobot.in`; landing footer, “Source” links to `github.com/B-Divyesh/sf-dictation-repair-book`.
- **Why this fails:** the visible labels name an action or object but not the fact that the visitor leaves `dictation-repair-book.sociobot.in`. The site-structure requirement says external links say so. This is especially relevant for a cold mobile visitor who has no visible status bar before activation.
- **Concrete fix:** retain result-naming verbs while adding the destination visibly, for example **“Download latest build on GitHub (opens GitHub)”**, **“Buy $12 license on Sociobot checkout”**, and **“Source on GitHub (opens GitHub)”**. Keep the same accessible names if the visible text is shortened with an external-link icon.

## 3. Copy audit

Counts use whitespace-separated words; hyphenated words, version labels, acronyms, and code-format names count as one word. Labels such as navigation names, dates, command strings, screenshots, and prices are not sentences; they were separately checked below. No audited sentence exceeds 22 words. The only copy/structure flag is F-5-1.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Turn dictation corrections into reusable rules. | 6 | Pass |
| For dictation users with names, medications, code terms, or workplace jargon. | 11 | Pass |
| Turn explicit corrections into rules you can inspect and reuse. | 10 | Pass |
| Opens a separate sample repair book. | 6 | Pass |
| Nothing enters your real book. | 5 | Pass |
| No audio or account. | 4 | Pass |
| Demo works offline after one visit. | 7 | Pass |
| 25 approved rules are free; pay $12 once for unlimited rules. | 11 | Pass |
| Checks the latest build when you choose a download. | 9 | Pass |
| No background monitoring of fields or keystrokes. | 7 | Pass |
| Explicit edit → inspectable rule. | 4 | Pass |
| Before → after → approve → reuse. | 4 | Pass |
| Repair-book text stays on this device. | 6 | Pass; bounded by the local/egress claims. |
| Export CSV or JSON. | 4 | Pass |
| Erase the vault, key, and license data. | 8 | Pass |
| Save corrections for later clipboard text. | 6 | Pass |
| Save a correction once, then apply the approved rule to later clipboard text. | 13 | Pass |
| Create a reusable rule in three steps. | 7 | Pass |
| Capture your edit. | 3 | Pass |
| Copy the original dictation and your corrected sentence. | 8 | Pass |
| Capture happens only when you click. | 6 | Pass |
| Inspect the proposal. | 3 | Pass |
| The app isolates the changed span. | 6 | Pass |
| Approve it, or discard it without saving anything. | 8 | Pass |
| Reuse your book. | 3 | Pass |
| Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 | Pass |
| See the installed repair book at work. | 8 | Pass |
| Capture — paste the original and corrected sentence. | 7 | Pass |
| Review — inspect approved rules and their sources. | 7 | Pass |
| Test — run approved rules on later clipboard text. | 8 | Pass |
| Export or erase — keep a portable copy or remove local data. | 11 | Pass |
| How the app stores your repair book. | 7 | Pass |
| The desktop app encrypts the repair book on your device. | 10 | Pass |
| AES-256-GCM vault stored on your device. | 6 | Pass |
| Name and enable each application yourself. | 6 | Pass |
| The app does not record typing, read other fields, or keep audio. | 13 | Pass |
| Export anytime. | 2 | Pass |
| Erase the vault and key in one action. | 9 | Pass |
| Install the desktop app. | 4 | Pass |
| The install commands verify SHA-256 checksums. | 6 | Pass |
| Direct downloads include a published checksum. | 6 | Pass |
| Builds are unsigned, so your operating system may ask you to confirm the first launch. | 15 | Pass |
| Pay once for more approved rules. | 7 | Pass |
| Start with 25 approved rules, testing, and every export for free. | 11 | Pass |
| Unlock unlimited approvals once—no subscription. | 5 | Pass; literal license use. |
| One-time purchase. | 2 | Pass |
| A refunded license no longer permits paid approvals. | 8 | Pass |
| Product limits and compatibility. | 4 | Pass |
| Does it record or transcribe audio? | 6 | Pass |
| No. | 1 | Pass |
| It repairs transcript text from dictation tools you already use. | 10 | Pass |
| Audio never enters the app. | 5 | Pass |
| Does it watch everything I type? | 6 | Pass |
| No. | 1 | Pass |
| You opt in to named source applications and click “Paste clipboard” for each capture. | 15 | Pass |
| v0.1 does not monitor fields or keystrokes. | 7 | Pass |
| Which engines does it support? | 5 | Pass |
| Paste text from your dictation tool, then run approved replacements locally. | 11 | Pass |
| Exports include CSV, JSON backup, and a vocabulary prompt for Whisper-compatible workflows. | 12 | Pass |
| Can I export and delete my data? | 8 | Pass |
| Yes. | 1 | Pass |
| Exports are never paywalled. | 4 | Pass |
| You can erase the encrypted vault and its local key at any time. | 14 | Pass |
| Private rules for repaired dictation text. | 6 | Pass |
| Built by Param Factory. | 4 | Pass |

Headings name their sections: **How it works**, **Desktop app walkthrough**, **Privacy**, **Install**, **Price**, and **Product limits**. Core terminology is consistent: a saved replacement is a **rule** and the collection is a **repair book**. Result-naming controls are **Try it with sample data**, **Choose a download**, **Copy command**, **Enter license token**, and **Verify license**. The three external-link labels are F-5-1.

### README sentences and sentence-like list items

| Sentence | Words | Result |
| --- | ---: | --- |
| Turn explicit dictation corrections into private reusable rules. | 8 | Pass |
| It is for people whose names, medication spellings, code terms, and workplace jargon need careful repair after dictation. | 18 | Pass |
| Dictation Repair Book is a Tauri 2 desktop app with a static download site. | 14 | Pass |
| It repairs text you paste; it is not a speech recognizer and does not record audio. | 16 | Pass |
| Capture an uncorrected and corrected sentence after you choose a source application. | 11 | Pass |
| Find the changed words, then let you approve or discard a reusable rule. | 12 | Pass |
| Apply approved rules locally to a fresh transcript, with longer matching rules first. | 13 | Pass |
| Search, delete, undo, and export rules as CSV, JSON backup, or a Whisper vocabulary prompt. | 15 | Pass |
| Encrypt the native repair book with AES-256-GCM and a local per-device key. | 12 | Pass |
| Erase the encrypted repair book, temporary vault file, key, and local license data. | 13 | Pass |
| Include 25 approved rules and every export for free; a $12 one-time license allows further approvals. | 17 | Pass |
| The desktop app reads clipboard text only after you press Paste clipboard. | 12 | Pass |
| It does not monitor fields, keystrokes, foreground windows, or audio. | 10 | Pass |
| Native state is encrypted before it is written under the operating-system application-data directory. | 13 | Pass |
| On Unix, the local key has mode `0600`. | 9 | Pass |
| The repair-book file is encrypted at rest; processes running as your OS user may still access the local key. | 19 | Pass |
| Exports are plaintext so other tools can read them. | 9 | Pass |
| The sample demo sends no request outside the product origin. | 10 | Pass |
| License verification sends the license token to `api.sociobot.in`; it does not include repair-book text. | 13 | Pass |
| Open the demo or choose Try it with sample data. | 10 | Pass |
| The landing alias `/?demo=1` opens the same demo. | 8 | Pass |
| It uses the `demo:drb_web_preview_state` browser-storage namespace. | 5 | Pass |
| Reset demo restores the shipped sample. | 6 | Pass |
| Start for real deletes the demo namespace and returns to the download page without changing `drb_web_preview_state`. | 15 | Pass |
| In the installed app, the first-run screen has Load sample repair book. | 12 | Pass |
| It runs in memory until you choose Keep this repair book; Start for real discards it. | 17 | Pass |
| See `.factory/demo.md`. | 2 | Pass |
| Requirements: Node 22+, Rust stable, and the Tauri 2 system prerequisites. | 9 | Pass |
| The native privacy test target is intentionally GUI-free, so it also runs from a clean Linux clone without GTK or WebKit development metadata. | 22 | Pass |
| `npm test` runs a portable structural check of the PowerShell installer and its required CI wiring. | 13 | Pass |
| Windows CI runs `npm run test:installer-windows` against the shipped script with matching, mismatching, and missing checksums. | 15 | Pass |
| `npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment. | 14 | Pass |
| Download the detected installer from the website, or use the checksum-verifying install command. | 13 | Pass |
| The install commands compare the downloaded package with `SHA256SUMS`. | 9 | Pass |
| Direct downloads include that published checksum. | 6 | Pass |
| Current builds are unsigned, so macOS and Windows may ask you to confirm the first launch. | 15 | Pass |
| Set the same version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`. | 9 | Pass |
| Then push its `v*` tag or run the release workflow for that tag. | 13 | Pass |
| The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree. | 21 | Pass |
| Each packaged desktop webview carries its exact release tag and full source commit. | 13 | Pass |
| The workflow publishes `SHA256SUMS`, `latest.json`, and `build-info.json` with that commit before attaching all files to the GitHub Release. | 15 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

## 4. Demo, privacy, and sandbox checks

- **One click and useful first view:** `/demo/?demo=1` immediately showed the populated **Approved rules** screen, including realistic metoprolol, Kubernetes, and Niamh corrections. It was not an empty workspace.
- **Banner and controls:** “Demo — sample data, nothing is saved.” remained visible at 390px with **Reset demo** and **Start for real**. The banner did not overlap the h1.
- **Isolation:** with `drb_web_preview_state=REAL-SENTINEL` seeded before entry, Reset preserved that key and created only `demo:drb_web_preview_state`; Start for real removed the demo key and left the sentinel byte-for-byte unchanged.
- **Privacy/offline:** demo request logging showed only the product origin. After service-worker control and `context.setOffline(true)`, `/demo/?demo=1` returned HTTP 200 and the populated Rules screen; an unknown route returned the designed 404 with HTTP 404.
- **Navigation:** Rules → Test → Back restored `/demo/?demo=1`, the **Approved rules** h1, h1 focus, and the polite route announcement. Direct `?view=test` also opened Test.

## 5. Claims and clean-clone verification

A clean clone of the reviewed commit was made at `/tmp/dictation-repair-book-review5-clean-20260902`. `npm ci` completed, then every command named in `.factory/claims.json` was run separately. All passed.

| Claim id | Result |
| --- | --- |
| demo-sandbox | Pass |
| no-account | Pass |
| rule-management | Pass |
| literal-code-replacement | Pass |
| longest-rule-first | Pass |
| local-repair | Pass |
| portable-exports | Pass |
| json-roundtrip | Pass |
| whisper-export | Pass |
| private-demo | Pass |
| website-privacy | Pass |
| on-demand-release-lookup | Pass |
| explicit-access | Pass |
| clipboard-on-command | Pass |
| free-book | Pass |
| erase-local-book | Pass |
| native-erase | Pass |
| license-backoff | Pass |
| license-daily-cache | Pass |
| license-request-privacy | Pass |
| license-return | Pass |
| encrypted-vault | Pass |
| per-device-key | Pass |
| revoked-license-locks | Pass |
| checksum-installers | Pass |
| powershell-checksum-installer | Pass |
| release-matrix | Pass |
| unsigned-build | Pass |
| offline-demo | Pass |
| native-sample-isolation | Pass |
| checkout-price | Pass |
| build-output | Pass |
| release-source-identity | Pass |
| artifact-identity | Pass |

The separate full gate also passed: `npm test` (27 Vitest tests, portable installer contract, four native Rust tests, and 46 Playwright tests), `npm run typecheck`, `npm run lint`, and `npm run build`. The build created both `dist/app/` and `dist/site/`. No claim test failed, and no live claim-like sentence was found without a relevant manifest entry.

## 6. Earlier findings rechecked

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the prior handoff was read. The table records a current code-and-live confirmation for each earlier finding, rather than relying on its prior “fixed” label.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: mobile banner is in normal flow and does not intersect the active h1. |
| F-1-2 | Fixed: direct view URLs, Back/Forward, h1 focus, and announcement were re-exercised live. |
| F-1-3 | Fixed: source retains in-memory native sample guards; landing shows four captioned installed-app frames; native-sample-isolation passes. |
| F-1-4 | Fixed: command regions are focusable and labelled; mobile Axe returned no violations. |
| F-1-5 | Fixed: service-worker-controlled valid routes stay 200 online/offline and controlled unknown routes stay 404. |
| F-1-6 | Fixed: encrypted-vault runs the production vault round trip and rejects plaintext. |
| F-1-7 | Fixed: PowerShell installer fixture remains separately declared and passes its portable contract. |
| F-1-8 | Fixed: release-matrix executes fixture output and manifest-hash assertions. |
| F-1-9 | Fixed: the seeded real-key reset/exit check passed live. |
| F-1-10 | Fixed: no-account clean-context sample claim passed. |
| F-1-11 | Fixed: current compatibility text promises pasted-text repair, not support for every tool. |
| F-1-12 | Fixed: longest-rule-first fixture passed. |
| F-1-13 | Fixed: per-device-key test creates distinct 32-byte keys. |
| F-1-14 | Fixed: per-device-key test checks Unix `0600`. |
| F-1-15 | Fixed: privacy text states the OS-user boundary instead of claiming backup protection. |
| F-1-16 | Fixed: merchant-of-record wording is absent; free/export wording is covered. |
| F-1-17 | Fixed: license-request-privacy limits the request to the token. |
| F-1-18 | Fixed: public privacy wording is limited to local storage, the isolated demo, and the tested license request boundary. |
| F-1-19 | Fixed: README does not claim reproducible builds. |
| F-1-20 | Fixed: unsigned-build claim and displayed warning pass. |
| F-1-21 | Fixed: direct-download checksum publication is distinct from installer verification. |
| F-1-22 | Fixed: h1 states the correction-to-rule job. |
| F-1-23 | Fixed: monitoring language names fields and keystrokes plainly. |
| F-1-24 | Fixed: unsupported recognizer generalisations and slogan copy are absent. |
| F-1-25 | Fixed: privacy heading names the storage subject. |
| F-1-26 | Fixed: export/deletion FAQ is named directly. |
| F-1-27 | Fixed: current controls name their immediate result, subject only to the destination disclosure in F-5-1. |
| F-1-28 | Fixed: current copy consistently uses rule and repair book. |
| F-1-29 | Fixed: three first-screen facts and one visually primary sample action fit at 390px. |
| F-1-30 | Fixed: public/demo/legal routes have shared header/footer and one visible route h1. |
| F-2-1 | Fixed: landing and tested checkout price are both $12 USD. |
| F-2-2 | Fixed: build-output is inventoried and passed. |
| F-2-3 | Fixed: release-source-identity is inventoried and passed. |
| F-2-4 | Fixed: collection and entry terminology remains repair book/rule. |
| F-2-5 | Fixed: realistic sample applications are Notes and VS Code. |
| F-2-6 | Fixed: storage/export/erase statements are concrete rather than absolute slogans. |
| F-2-7 | Fixed: Product limits and compatibility names its section. |
| F-2-8 | Fixed: public footer has a release version, not internal repair jargon. |
| F-2-9 | Fixed: README explains version-file alignment and tag release steps. |
| F-2-10 | Fixed: demo navigation is real query URLs in anchors. |
| F-2-11 | Fixed: privacy wording explicitly covers typing, fields, and audio. |
| F-3-1 | Fixed: public hero-art provenance claim remains removed; provenance is in design documentation. |

## 7. Structure, accessibility, and link checks

- `/`, `/demo/?demo=1`, `/privacy/`, `/terms/`, and the deliberate missing URL returned route-specific titles, descriptions, canonical URLs, Open Graph/Twitter metadata, SVG favicon/apple icon, one h1, `main`, and shared header/footer. The missing URL returned the designed **Page not found** page with HTTP 404.
- The live 390px landing returned no Axe violations and no console errors. The first screen, demo, and reduced-motion layout were visually checked; the ledger workbench identity is distinct from a generic SaaS template.
- `robots.txt` and `sitemap.xml` include the public routes. The service worker keeps valid pages available offline and preserves the status of a controlled unknown route.
- Product-origin links, GitHub release/source/issues links, and installer URLs returned HTTP 200. The checkout endpoint was not activated because it creates a purchase session; its destination is nevertheless visible in the landing href and is included in F-5-1.

## 8. Missed leverage

No additional AI feature is expected here. The brief's central job is an explicit, inspectable local before/after rule; a model-generated correction would add privacy and error risk. The useful implied additions—sample project, CSV/JSON export/import, local test screen, Whisper prompt, and delete/reset paths—are present. No provider key is embedded.

## What would make this perfect

Fix F-5-1 by visibly identifying external GitHub and checkout destinations, then repeat the link-label and cold-phone checks. With no remaining finding, this review can pass.
