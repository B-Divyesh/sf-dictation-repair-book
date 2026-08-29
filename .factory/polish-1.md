# Polish round 1

Candidate reviewed: `d476b4dd900130ff1748712af6db90c754c1c9cd`. Repair base: `cf32753`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Mobile demo banner is in normal flow, leaving the active header unobscured. | `demo banner does not cover the active heading on a 390px phone` |
| F-1-2 | Demo sections use `#capture`, `#rules`, `#test`, and `#settings`; direct load, history, h1 focus, title, and live announcement now work. | `demo sections deep-link, restore with history, announce, and focus their h1` |
| F-1-3 | Native first run now has **Load sample repair book**, in-memory isolation, Keep/Reset/Start-for-real controls; landing ships four real UI captures. | `src/main.ts`; `public/assets/walkthrough-*.png` |
| F-1-4 | Scrollable installer commands have keyboard focus and accessible names; mobile Axe runs in browser tests. | `landing page is accessible`; `landing page fits a 390px phone` |
| F-1-5 | Service worker returns a constructed 404 response for known-missing navigation online and offline. | `service-worker controlled unknown routes keep their 404 status online and offline` |
| F-1-6 | Vault claim now saves/loads a complete production-shaped state and rejects plaintext on disk. | `claim_encrypted_vault_uses_aes_256_gcm` |
| F-1-7 | Added executable PowerShell match/mismatch fixture; mismatch never launches MSI. | `tests/installers.ps1` |
| F-1-8 | Release test executes manifest preparation against six fixture bundles and checks hashes/output. | `@claim:release-matrix` |
| F-1-9 | Demo claim now byte-compares real storage before reset and exit and checks demo license-key deletion. | `@claim:demo-sandbox` |
| F-1-10 | Added no-account claim and clean demo workflow test. | `@claim:no-account` |
| F-1-11 | Replaced unsupported “any tool” promise with local pasted-text behavior. | landing FAQ; copy audit |
| F-1-12 | Added longest-rule-first claim over overlapping phrases. | `@claim:longest-rule-first` |
| F-1-13 | Added production random per-device 32-byte key test. | `claim_per_device_key_is_random_and_private_on_unix` |
| F-1-14 | The same native test verifies Unix `0600` key permission. | `claim_per_device_key_is_random_and_private_on_unix` |
| F-1-15 | Replaced the overbroad backup-protection sentence with the actual OS-user boundary. | README privacy section |
| F-1-16 | Removed merchant-of-record assertion; narrowed free statement to tested export behavior. | landing/terms/README; `@claim:portable-exports` |
| F-1-17 | Added request-capture claim proving only the license token is sent. | `@claim:license-request-privacy` |
| F-1-18 | Narrowed privacy copy to tested license-request and demo-egress behavior. | README/privacy; `@claim:private-demo` |
| F-1-19 | Removed unsupported reproducibility promise. | README build section |
| F-1-20 | Added unsigned-build inventory and configuration/copy assertion. | `@claim:unsigned-build` |
| F-1-21 | Split installer wording: commands verify; direct files publish a checksum. | landing install section; installer claims |
| F-1-22 | Rewrote the hero as the actual repair job. | landing h1; `copy-audit.md` |
| F-1-23 | Replaced “field watching” with fields/keystrokes language. | landing first-screen facts |
| F-1-24 | Replaced recognizer generalizations and slogan with the saved-correction workflow. | landing problem section |
| F-1-25 | Replaced the privacy mood line with a storage-boundary heading. | landing privacy section |
| F-1-26 | Renamed the FAQ item to name export/deletion. | landing FAQ |
| F-1-27 | Renamed download and license controls for their immediate result. | landing header/pricing form |
| F-1-28 | Normalized README to repair book, correction, and rule. | README; `copy-audit.md` |
| F-1-29 | First screen now shows privacy, offline, and price facts; only Try uses primary styling. | landing first screen; 390px browser test |
| F-1-30 | Legal pages use plain h1s and shared navigation; demo renders its visible active view as the only h1. | metadata/route browser test; demo routing test |

Additional controller requirement: `/?demo=1` redirects in one navigation to `/demo/?demo=1`, which keeps the persistent banner and isolated namespace. Evidence: `the landing ?demo=1 alias opens the isolated sample path in one navigation`.

Local evidence: `npm test` passed (16 Vitest, 32 Playwright); every one of the 28 `claims.json` commands passed individually; `npm run typecheck`, `npm run lint`, `npm run build`, `cargo test`, `cargo check`, and `cargo fmt --check` passed. The four walkthrough captures are `public/assets/walkthrough-{capture,rules,test,settings}.png`.
