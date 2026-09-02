# Copy audit — polish round 5

Reviewed 2026-09-02. This is the complete visitor-facing sentence and heading audit for the landing page. Menu labels, button labels, command strings, version text, and the product name are labels rather than sentences; they are included in the final label check below. **Rule** means one saved replacement. **Repair book** means the saved collection. “Whisper vocabulary prompt” is only the name of that export format. Every GitHub and Sociobot checkout link visibly names its off-site destination.

## Landing sentences and headings

| Text | Words | Result |
| --- | ---: | --- |
| Turn dictation corrections into reusable rules. | 6 | Pass |
| For dictation users with names, medications, code terms, or workplace jargon. | 11 | Pass |
| Turn explicit corrections into rules you can inspect and reuse. | 10 | Pass |
| Opens a separate sample repair book. | 6 | Pass |
| Nothing enters your real book. | 5 | Pass |
| No audio or account. | 4 | Pass |
| Demo works offline after one visit. | 7 | Pass |
| 25 approved rules are free; pay $12 once for unlimited rules. | 11 | Pass |
| No background monitoring of fields or keystrokes. | 7 | Pass |
| Explicit edit → inspectable rule | 4 | Pass |
| Before → after → approve → reuse | 4 | Pass |
| Repair-book text stays on this device. | 6 | Pass |
| Export CSV or JSON. | 4 | Pass |
| Erase the vault, key, and license data. | 8 | Pass |
| Save corrections for later clipboard text. | 6 | Pass |
| Save a correction once, then apply the approved rule to later clipboard text. | 13 | Pass |
| Create a reusable rule in three steps. | 8 | Pass |
| Capture your edit | 3 | Pass |
| Copy the original dictation and your corrected sentence. | 8 | Pass |
| Capture happens only when you click. | 6 | Pass |
| Inspect the proposal | 3 | Pass |
| The app isolates the changed span. | 6 | Pass |
| Approve it, or discard it without saving anything. | 8 | Pass |
| Reuse your book | 3 | Pass |
| Repair clipboard text, export portable CSV/JSON, or copy a Whisper vocabulary prompt. | 12 | Pass |
| See the installed repair book at work. | 8 | Pass |
| Paste the original and corrected sentence. | 6 | Pass |
| Inspect approved rules and their sources. | 6 | Pass |
| Run approved rules on later clipboard text. | 7 | Pass |
| Keep a portable copy or remove local data. | 9 | Pass |
| How the app stores your repair book | 8 | Pass |
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
| Unlock unlimited approvals once—no subscription. | 5 | Pass |
| One-time purchase. | 2 | Pass |
| A refunded license no longer permits paid approvals. | 8 | Pass |
| Product limits and compatibility | 4 | Pass |
| Does it record or transcribe audio? | 6 | Pass |
| No. | 1 | Pass |
| It repairs transcript text from dictation tools you already use. | 10 | Pass |
| Audio never enters the app. | 5 | Pass |
| Does it watch everything I type? | 6 | Pass |
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

## First-screen check

The headline names the job, the next sentence names the audience, and **Try it with sample data** is the first action. The primary action’s explanation and all three facts are visible at 390×844. `landing page fits a 390px phone` measures the fact block.

## Terminology and labels

| Concept | One term | Check |
| --- | --- | --- |
| Saved replacement | rule | “Approved rules” is the demo heading. |
| Saved collection | repair book | Never “rule book.” |
| Consent boundary | application | Samples use Notes and VS Code. |
| Sample workspace | sample repair book | Isolated demo only. |
| Whisper format | Whisper vocabulary prompt | Export-format name only. |

Labels are concrete verbs or names: **Try it with sample data**, **Download latest build on GitHub (opens GitHub)**, **Copy command**, **Buy $12 license on Sociobot checkout (opens Sociobot checkout)**, **Enter license token**, and **Verify license**. Footer and legal GitHub links likewise say **(opens GitHub)**. No audited landing sentence exceeds 22 words or uses a banned marketing word. The checkout amount is consistently `$12`; `@claim:checkout-price` checks the live session when available and its recorded read-only response during checkout-service outages.

The catalog description is 85 characters and starts with the verb **Turn**: “Turn dictation corrections into private rules you can review, test, export, or erase.”
