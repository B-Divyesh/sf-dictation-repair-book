# Adversarial first-read review 4 — FAIL

Reviewed 2026-09-02 UTC against commit `ca95b128a4c6a3bd8f40f654f578d9cdde1836d3` and <https://dictation-repair-book.sociobot.in> in fresh Chromium contexts at 390×844 and 1440×900. No product code, deployment, billing, or infrastructure was changed.

**Verdict: FAIL.** One blocking regression remains. The cold landing is clear, the sample is realistic and isolated, all 34 declared claim commands pass from a clean clone, and the remaining structure/accessibility checks pass. A default demo visit does not restore the visible page when the user presses Back, so the displayed state disagrees with the address bar.

## 1. Cold first screen

No scrolling was performed before this assessment.

| Viewport | What it does | For whom | First click | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Turns explicit dictation corrections into reusable rules. | Dictation users with names, medications, code terms, or workplace jargon. | **Try it with sample data**. | Pass |
| 1440×900 | The same correction-to-rule job. | The same named audience. | **Try it with sample data**. | Pass |

The exact useful text is “Turn dictation corrections into reusable rules.”, “For dictation users with names, medications, code terms, or workplace jargon.”, and “Try it with sample data.” The action says “Opens a separate sample repair book. Nothing enters your real book.” At 390×844, the three fact lines end at y=607, inside the first viewport. No first-read blocking finding.

## 2. Findings

### Blocking

#### F-1-2 — Reopened: Back does not restore the default demo screen

- **Location/quote:** live `/demo/?demo=1`; product navigation links including **Test**; `src/main.ts`, `restoreRouteFromLocation()`.
- **Observed result:** a fresh visit opens **Approved rules** at `/demo/?demo=1`. Selecting **Test** changes the URL to `/demo/?demo=1&view=test`, focuses the `Test your repair book` h1, and announces it. Pressing browser Back changes the URL back to `/demo/?demo=1`, but the displayed h1 remains `Test your repair book`; focus and the live announcement also remain on Test.
- **Why this fails:** the URL now describes the default Rules screen while the visitor still sees Test. Back does not restore state, violating the routing requirement and reopening the earlier F-1-2 rather than merely marking it fixed. A first-time visitor who uses Back cannot trust a copied or displayed link.
- **Concrete fix:** make the no-`view` demo URL restore the default Rules page in `restoreRouteFromLocation()` (or canonicalize the initial demo visit to `?view=rules`). Add a browser test starting at `/demo/?demo=1`, navigating to Test, pressing Back, then asserting URL, `Approved rules` h1, focus, and `#route-announcement` all restore Rules. Also assert Forward restores Test.

No additional finding was found.

## 3. Copy audit

Counts treat hyphenated words, versions, and code-format names as one word. All landing and README sentences are at or below 22 words. No banned marketing word, vague heading, inconsistent core term, or non-result action label was found. The prior unlisted artwork-provenance sentence is absent.

### Landing page sentences

| Sentence | Words |
| --- | ---: |
| Turn dictation corrections into reusable rules. | 6 |
| For dictation users with names, medications, code terms, or workplace jargon. | 11 |
| Turn explicit corrections into rules you can inspect and reuse. | 10 |
| Opens a separate sample repair book. | 6 |
| Nothing enters your real book. | 5 |
| No audio or account. | 4 |
| Demo works offline after one visit. | 7 |
| 25 approved rules are free; pay $12 once for unlimited rules. | 11 |
| Checks the latest build when you choose a download. | 9 |
| No background monitoring of fields or keystrokes. | 7 |
| Explicit edit → inspectable rule. | 4 |
| Before → after → approve → reuse. | 4 |
| Repair-book text stays on this device. | 6 |
| Export CSV or JSON. | 4 |
| Erase the vault, key, and license data. | 8 |
| Save corrections for later clipboard text. | 6 |
| Save a correction once, then apply the approved rule to later clipboard text. | 13 |
| Create a reusable rule in three steps. | 7 |
| Capture your edit. | 3 |
| Copy the original dictation and your corrected sentence. | 8 |
| Capture happens only when you click. | 6 |
| Inspect the proposal. | 3 |
| The app isolates the changed span. | 6 |
| Approve it, or discard it without saving anything. | 8 |
| Reuse your book. | 3 |
| Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 |
| See the installed repair book at work. | 8 |
| Capture — paste the original and corrected sentence. | 7 |
| Review — inspect approved rules and their sources. | 7 |
| Test — run approved rules on later clipboard text. | 8 |
| Export or erase — keep a portable copy or remove local data. | 11 |
| How the app stores your repair book. | 8 |
| The desktop app encrypts the repair book on your device. | 10 |
| AES-256-GCM vault stored on your device. | 6 |
| Name and enable each application yourself. | 6 |
| The app does not record typing, read other fields, or keep audio. | 13 |
| Export anytime. | 2 |
| Erase the vault and key in one action. | 9 |
| Install the desktop app. | 4 |
| The install commands verify SHA-256 checksums. | 6 |
| Direct downloads include a published checksum. | 6 |
| Builds are unsigned, so your operating system may ask you to confirm the first launch. | 15 |
| Pay once for more approved rules. | 7 |
| Start with 25 approved rules, testing, and every export for free. | 11 |
| Unlock unlimited approvals once—no subscription. | 5 |
| One-time purchase. | 2 |
| A refunded license no longer permits paid approvals. | 8 |
| Product limits and compatibility. | 4 |
| Does it record or transcribe audio? | 6 |
| No. | 1 |
| It repairs transcript text from dictation tools you already use. | 10 |
| Audio never enters the app. | 5 |
| Does it watch everything I type? | 6 |
| No. | 1 |
| You opt in to named source applications and click “Paste clipboard” for each capture. | 15 |
| v0.1 does not monitor fields or keystrokes. | 7 |
| Which engines does it support? | 5 |
| Paste text from your dictation tool, then run approved replacements locally. | 11 |
| Exports include CSV, JSON backup, and a vocabulary prompt for Whisper-compatible workflows. | 12 |
| Can I export and delete my data? | 8 |
| Yes. | 1 |
| Exports are never paywalled. | 4 |
| You can erase the encrypted vault and its local key at any time. | 14 |
| Private rules for repaired dictation text. | 6 |
| Built by Param Factory. | 4 |

Headings name their sections. Actions name their result: **Try it with sample data**, **Choose a download**, **Copy command**, **Buy once — $12**, **Enter license token**, and **Verify license**. The terminology remains **rule** for an entry and **repair book** for the collection.

### README sentences

| Sentence | Words |
| --- | ---: |
| Turn explicit dictation corrections into private reusable rules. | 8 |
| It is for people whose names, medication spellings, code terms, and workplace jargon need careful repair after dictation. | 18 |
| Dictation Repair Book is a Tauri 2 desktop app with a static download site. | 14 |
| It repairs text you paste; it is not a speech recognizer and does not record audio. | 16 |
| Capture an uncorrected and corrected sentence after you choose a source application. | 11 |
| Find the changed words, then let you approve or discard a reusable rule. | 12 |
| Apply approved rules locally to a fresh transcript, with longer matching rules first. | 13 |
| Search, delete, undo, and export rules as CSV, JSON backup, or a Whisper vocabulary prompt. | 15 |
| Encrypt the native repair book with AES-256-GCM and a local per-device key. | 12 |
| Erase the encrypted repair book, temporary vault file, key, and local license data. | 13 |
| Include 25 approved rules and every export for free; a $12 one-time license allows further approvals. | 17 |
| The desktop app reads clipboard text only after you press Paste clipboard. | 12 |
| It does not monitor fields, keystrokes, foreground windows, or audio. | 10 |
| Native state is encrypted before it is written under the operating-system application-data directory. | 13 |
| On Unix, the local key has mode 0600. | 9 |
| The repair-book file is encrypted at rest; processes running as your OS user may still access the local key. | 19 |
| Exports are plaintext so other tools can read them. | 9 |
| The sample demo sends no request outside the product origin. | 10 |
| License verification sends the license token to api.sociobot.in; it does not include repair-book text. | 13 |
| Open the demo or choose Try it with sample data. | 10 |
| The landing alias `/?demo=1` opens the same demo. | 8 |
| It uses the `demo:drb_web_preview_state` browser-storage namespace. | 5 |
| Reset demo restores the shipped sample. | 6 |
| Start for real deletes the demo namespace and returns to the download page without changing `drb_web_preview_state`. | 15 |
| In the installed app, the first-run screen has Load sample repair book. | 12 |
| It runs in memory until you choose Keep this repair book; Start for real discards it. | 17 |
| The native privacy test target is intentionally GUI-free, so it also runs from a clean Linux clone without GTK or WebKit development metadata. | 22 |
| The PowerShell installer claim runs the shipped `install.ps1` through matching and mismatching checksum fixtures. | 14 |
| Install PowerShell 7 before running the full installer test on Linux; the release workflow runs the same fixture on its Windows runner. | 21 |
| `npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment. | 14 |
| Download the detected installer from the website, or use the checksum-verifying install command. | 13 |
| The install commands compare the downloaded package with `SHA256SUMS`. | 9 |
| Direct downloads include that published checksum. | 6 |
| Current builds are unsigned, so macOS and Windows may ask you to confirm the first launch. | 15 |
| Set the same version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`. | 9 |
| Then push its `v*` tag or run the release workflow for that tag. | 13 |
| The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree. | 21 |
| Each packaged desktop webview carries its exact release tag and full source commit. | 13 |
| The workflow publishes `SHA256SUMS`, `latest.json`, and `build-info.json` with that commit before attaching all files to the GitHub Release. | 15 |
| MIT. | 1 |
| See LICENSE. | 2 |

## 4. Demo and sandbox

- The one-click action opens `/demo/?demo=1`, immediately showing three realistic rules: metoprolol, Kubernetes, and Niamh.
- The visible banner says “Demo — sample data, nothing is saved,” has **Reset demo** and **Start for real**, and does not intersect the h1 at 390px.
- With an injected real-book sentinel, reset preserved the real key; Start for real removed `demo:drb_web_preview_state` and preserved the real key.
- The live demo test flow made only product-origin requests. The demo did not call GitHub or billing. After a first visit, `/demo`, `/privacy`, and `/terms` work offline with HTTP 200, while unknown paths retain HTTP 404.

## 5. Claims and local verification

A fresh clone at the reviewed commit ran `npm ci --ignore-scripts`, then every command in `.factory/claims.json` separately. All 34 commands passed: 20 browser/demo claims, 10 Vitest claims, three native Rust claims, and the shipped PowerShell installer fixture. PowerShell 7.5.4 was supplied only as an isolated verifier runtime because it is not preinstalled in this container.

The complete clean-clone gate passed: `npm test` (27 Vitest, installer contract, four native tests, 45 Playwright tests), `npm run typecheck`, `npm run lint`, and `npm run build`. The build created `dist/app/index.html` and `dist/site/index.html`; landing JavaScript is 1.88 KB gzip.

## 6. Earlier findings rechecked

Every earlier report and polish record was read. “Fixed” below means verified in both current source and live behavior.

| Earlier id(s) | Current result |
| --- | --- |
| F-1-1 | Fixed: the mobile demo banner is in normal flow and does not cover its active heading. |
| F-1-2 | **Reopened — blocking:** default Rules → Test → Back leaves Test displayed; see the finding above. Explicit `?view=test` → Settings → Back still works. |
| F-1-3 | Fixed: native first run provides the isolated sample and the landing has four captioned app captures. |
| F-1-4 | Fixed: command code regions are focusable/labelled; 390px Axe reports no serious or critical violation. |
| F-1-5 | Fixed: live controlled-worker slash and slashless public routes return 200 online/offline; unknown routes return 404. |
| F-1-6 | Fixed: the production vault round-trip test rejects plaintext. |
| F-1-7 | Fixed: the declared PowerShell command runs `tests/installers.ps1`; its real match and mismatch paths passed. |
| F-1-8 | Fixed: fixture release preparation checks output assets and manifest hashes. |
| F-1-9 | Fixed: demo reset/exit preserves the real storage sentinel and deletes the demo namespace. |
| F-1-10 | Fixed: clean-context sample use succeeds without an account. |
| F-1-11 | Fixed: copy promises local pasted-text repair, not universal tool support. |
| F-1-12 | Fixed: tagged fixture checks longest matching approved rule first. |
| F-1-13, F-1-14 | Fixed: native tests check separate random 32-byte keys and Unix mode 0600. |
| F-1-15 | Fixed: privacy copy names the OS-user boundary instead of overclaiming backup protection. |
| F-1-16 | Fixed: merchant-of-record wording is absent and free/export language is claimed. |
| F-1-17, F-1-18 | Fixed: request capture limits license data to its token, and public privacy wording stays within tested boundaries. |
| F-1-19 | Fixed: README does not claim reproducible builds. |
| F-1-20, F-1-21 | Fixed: unsigned status is claimed/tested; direct-file checksum wording differs from command verification. |
| F-1-22 through F-1-28 | Fixed: the task headline, concrete privacy wording, workflow copy, headings, controls, terminology, and FAQ are present as repaired. |
| F-1-29 | Fixed: all three first-screen facts remain above the 390×844 fold and Try is the sole primary action. |
| F-1-30 | Fixed subject to F-1-2: shared demo header/footer and one visible h1 are present; the remaining failure is Back restoration. |
| F-2-1 | Fixed: public and checkout price are $12 USD; `@claim:checkout-price` passes. |
| F-2-2, F-2-3 | Fixed: build-output and release-source identity are inventoried and pass. |
| F-2-4 through F-2-11 | Fixed: current copy uses rules/repair book and realistic app names, concrete tape/privacy language, contextual heading, no internal footer jargon, clear release steps, and real navigation links. |
| F-3-1 | Fixed: the unlisted public hero-art provenance sentence is absent; provenance remains in `.factory/design.md`. |

## 7. Structure, accessibility, links, identity, and leverage

- `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 have route-appropriate titles, descriptions, canonical/OG/Twitter metadata, favicon, one h1, main, headers, and footers. The sole routing exception is F-1-2.
- The live link crawl returned 200 for every internal route and GitHub link. Checkout was not followed because it begins a billing session.
- The live request log had no console errors. The paper-ledger art, acid/ink/cobalt palette, mono labels, and hard-edged controls match `.factory/design.md` and are distinct from a generic SaaS template.
- No additional AI feature is expected: the core job is deterministic private replacement. CSV/JSON import/export, Whisper prompt export, clipboard repair, and local deletion provide the obvious supporting value.

## What would make this perfect

Restore the default Rules screen, focus, and route announcement when Back reaches `/demo/?demo=1`; add the regression test described in F-1-2. Then repeat this full review. With that route-state repair, this evidence supports a PASS.
