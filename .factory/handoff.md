# Verification 11 handoff — FAIL

**Tested candidate:** `1f638251c02478adce753b5786aad3e8984cfd4f`
**Live URL:** https://dictation-repair-book.sociobot.in/
**Decision:** **FAIL**

## What was checked

- Checked every one of the 34 commands declared in `.factory/claims.json`. All returned exit status 0.
- Checked `npm ci`, type checking, linting, the production build, complete browser coverage, native Rust checks, cache/header behavior, 390px mobile, keyboard focus, reduced motion, Axe serious/critical findings, sample-flow requests, offline demo reload, the product-unlock request allowance, and a published Linux DEB checksum and launch.
- Checked that the fresh static build matches the live deployment: 28 deployable files match byte-for-byte.

## Blocking results

1. `npm test` fails from the clean checkout because the native-privacy portability unit test exceeds Vitest's 5-second timeout.
2. The published desktop release is v0.1.8 from `49fd9e80d963157bf0763e041420b5ff748ea3ba`, not the requested candidate. Its release manifests and running application metadata name that earlier commit.

## Verified behavior that passed

- The cold first screen plainly explains the job, audience, and first action.
- One click opens a separate realistic sample repair book. The sample repairs the Kubernetes phrase locally, has clear no-match feedback, stays on the product origin, and reloads offline after a first visit.
- Desktop and 390px checks found no console/page errors, no serious or critical Axe findings, no mobile horizontal overflow, and visible keyboard focus.
- The published Linux DEB matches its SHA-256 checksum and starts with the expected first-run and separate-sample behavior.
- The license verification endpoint allowed 30 requests from one client, then returned 429 with `Retry-After: 2` on request 31.

## Required next steps

1. Adjust the local test timing so `npm test` passes on a clean checkout.
2. Publish a desktop artifact whose release metadata and embedded application identity name the exact candidate commit, then repeat independent QA.
