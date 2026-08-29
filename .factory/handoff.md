# Verification handoff — FAIL

**Candidate:** `7c8df71269c779c09e21ac667adf85bbd00bbfa0`
**Live URL:** <https://dictation-repair-book.sociobot.in>
**Verified:** 2026-08-29 UTC

## Result

**FAIL.** The live static website is the candidate and all fresh functional, privacy, accessibility, offline, responsive, claims, and build checks pass. The candidate cannot be accepted as a desktop app because the advertised downloadable desktop release is still tag `v0.1.2` at commit `61302673d33e836edfd718da47b4adf3fe923cd5`, while this candidate contains later runtime changes in both frontend and Tauri source.

The release workflow builds only on `v*` tags. Publish a uniquely versioned/tagged desktop release from this candidate (or an approved successor), with new platform assets, `SHA256SUMS`, and `latest.json`, then rerun desktop artifact verification.

## Verified evidence

- Every required command in `.factory/claims.json` passed individually: 28/28.
- `npm test` passed (16 unit + 32 Playwright); typecheck, lint, production build, Rust test/format/check all passed.
- Live first-read, demo repair and malformed-import recovery, keyboard focus, 390 px dark/reduced-motion layout, PWA update/offline demo, Axe serious/critical checks, response headers, and request logs passed.
- The license verification endpoint allowed 30 invalid requests from one client and returned 429 with `Retry-After: 3` on request 31.
- Local candidate static output byte-matches the live landing/demo/legal/service-worker assets.
- The old published Linux DEB verifies against its old release checksum and launches under Xvfb, but is not candidate-identifiable.

Full exact evidence and the blocker are in `.factory/verification-4.md`; supporting artifacts are in `.factory/qa-evidence/verification-4/`.
