# Verification 11 — FAIL

**Candidate:** `1f638251c02478adce753b5786aad3e8984cfd4f` (`docs: record repair 10 release evidence`)
**Live URL:** https://dictation-repair-book.sociobot.in/
**Verified:** 2026-09-01 from a clean checkout
**Decision:** **FAIL**

## First read

Checked a cold 1440×900 live visit. The first screen says “Turn dictation corrections into reusable rules.” It identifies people who use dictation with names, medications, code terms, or workplace jargon. The visible first action is **Try it with sample data**, with the plain result that it opens a separate sample repair book without entering the real book. This first-read gate passes.

## Release-blocking findings

### High — `npm test` does not pass from the clean checkout

Checked `npm test` after `npm ci`. Vitest reported 26 passing tests and one failure: `tests/repair.test.ts` “keeps native privacy claims portable without Linux GUI development packages” exceeded its configured 5-second timeout. The test's child operation ran for about 7 seconds. Because `npm test` stops at that result, the required general quality gate is not green.

### High — no published desktop artifact identifies the requested candidate

Checked the latest GitHub release, its two identity manifests, the downloaded Linux DEB, and the running application footer. The current release is `v0.1.8`; `build-info.json` and `latest.json` both identify `49fd9e80d963157bf0763e041420b5ff748ea3ba`. The extracted application shows `v0.1.8 · 49fd9e80d963`. The requested candidate is `1f638251c02478adce753b5786aad3e8984cfd4f`, which is not tagged or named by a published desktop build. The static deployment matches this candidate's static output, but the desktop-app release identity requirement is not met.

## Claims contract

Checked that `.factory/claims.json` is present, parses, and declares 34 claims. Ran every declared command independently, using the stated demo entry point where applicable. All 34 commands returned exit status 0.

| Check | Result |
| --- | --- |
| Demo, account-free use, rule management, local repair, exports, JSON restore, Whisper output, privacy, offline demo, and native sample isolation | PASS |
| Literal replacement, longest-first matching, explicit-access capability, free limit, erase behavior, encryption, and local key checks | PASS |
| License cache, returned license, revoked license, request privacy, and Retry-After handling | PASS |
| Checksum installers, release matrix, unsigned-build notice, checkout price, build output, and release/artifact identity guards | PASS |

## Local checks

- Confirmed `npm ci`: 168 packages installed; audit reported 0 vulnerabilities.
- Checked `npm run typecheck`, `npm run lint`, and `npm run build`: all passed. The build produced `dist/app/` and `dist/site/`.
- Checked the production bundle budget: largest initial application JavaScript is 10.02 KB gzip; landing JavaScript is 1.88 KB gzip plus a 0.44 KB preload helper; landing CSS is 3.23 KB gzip. The 390px hero image is 47,766 bytes.
- Checked all 28 deployable files in fresh `dist/site/` against the live site by SHA-256: all match byte-for-byte.

## Live product checks

- Checked the sample flow on desktop: “Deploy the cube or net ease service.” became “Deploy the Kubernetes service.” with one rule applied. A no-match transcript returned “No matching approved terms.”
- Checked sample-flow requests: all stayed on `dictation-repair-book.sociobot.in`; there were no page errors or console errors. The cold landing load also made no third-party script, font, or analytics request.
- Checked 390px mobile with reduced motion: document width equalled viewport width, no active animations were reported, and no visible interactive target was below 44px in either dimension.
- Checked keyboard-only operation: Tab reached **Try it with sample data** with a `3px` cobalt visible outline and `4px` offset.
- Checked Axe on the landing and demo at desktop and 390px: zero serious or critical findings. The routes have one `h1`, a `main` landmark, `lang=en`, route-specific titles, and a skip link.
- Checked service-worker behavior: after a first visit, `/demo/?demo=1` loaded while the browser network setting was unavailable.
- Checked response headers: HTTPS, CSP, `nosniff`, strict referrer policy, and camera/microphone/geolocation-denying Permissions-Policy are present. HTML revalidates after 30 seconds; hashed assets are immutable for one year; installer scripts have a five-minute cache policy; an unknown route returns HTTP 404.
- Checked the release allowance from one client using an invalid license value: responses 1–30 were 200 invalid verdicts and response 31 was 429 with `Retry-After: 2`. Observed allowance: 30 requests per client window.

## Desktop package check

Checked the published v0.1.8 Linux DEB against its published SHA-256 checksum; it matched. The package declares version 0.1.8 and the expected GTK, WebKit, and application-indicator dependencies. After installing those declared runtime dependencies in the verifier image, checked that the extracted binary starts in an isolated data directory. Its first screen showed the named-source step; selecting **Load sample repair book** showed the three shipped rules and the persistent separate-sample notice. No encrypted repair-book vault or key was written by that sample step.

## Scope notes and required follow-up

The product has no first-party backend and no sign-in, so backend concurrency, persistence, health identity, and Entra tenant checks do not apply. The optional license call was checked only through the documented product endpoint.

1. Make the native-privacy portability test complete inside its configured timeout on a clean checkout, then rerun `npm test`.
2. Publish a versioned desktop release built from this candidate (or a later approved candidate), with `latest.json`, `build-info.json`, and the desktop application metadata naming that exact source commit.
