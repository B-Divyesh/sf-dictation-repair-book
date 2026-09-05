# Review 7 handoff — PASS

**Implementation:** `7d8465476dcb9e28f48a8ae5a4a4fc27dea9c821`
**Nominated documentation candidate:** `3c938381fa6d51c821334bbe21a538b78c3c485b`
**Review input documentation:** `908f423bdcd448e000efa97abcbc3c7c13e1ef97`
**Live URL:** https://dictation-repair-book.sociobot.in

## Review decision

**PASS — zero findings and zero untested claims.** Review 7 ran all 34 claim
commands separately from a clean clone, then ran the complete test, type,
lint, build, Rust check, and formatting gates. Fresh desktop and phone browser
checks covered the first screen, sample isolation/reset/exit, valid and invalid
paths, history and focus, all public routes, offline use, dark/light Axe scans,
touch targets, reduced motion, links, headers, and the expected designed 404.

All 36 public site files matched the live deployment byte-for-byte. Mobile
Lighthouse scored 100 in Performance, Accessibility, Best Practices, and SEO.
The scoped license verifier allowed 30 invalid requests, then returned 429 with
`Retry-After`.

A fresh v0.1.15 Linux DEB matched its published checksum and was installed with
its declared dependencies. In clean native profiles, its sample did not create
a real vault. A real source/rule survived restart and repaired fresh text. The
local key was mode `0600`, and the encrypted file contained no plaintext term.

See `.factory/review-7.md` for the claim table, earlier-finding disposition,
measurements, and exact decision record. No product code or deployment changed.

## Known limitation / operator action

Desktop builds are intentionally unsigned, as disclosed on the site and in the
README. Signing and notarization still require owner certificates. This is not
a product finding.

---

# Verification 18 handoff — PASS

**Candidate:** `3c938381fa6d51c821334bbe21a538b78c3c485b`
**Live URL:** https://dictation-repair-book.sociobot.in

## Decision

**PASS — ready to release.** Independent verification found no
release-blocking defect. The previous 390 px application-opt-in touch-target
failure is fixed live: both labels are 314×51 px and both native checkboxes
are 44×44 px.

## Verification summary

- Ran every test command in `.factory/claims.json` from the clean checkout:
  all 34 claims passed.
- `CI=true npm test` passed 27 unit, installer-contract, 4 native Rust, and
  51 Playwright tests. Typecheck, lint, exact build, Rust check, and Rust fmt
  check also passed.
- Cold first read clearly communicates the job, audience, and one-click sample
  repair-book action. Live desktop and 390 px mobile flows, keyboard, reduced
  motion, offline demo reload, and serious/critical Axe checks passed.
- Live request logs were same-origin during the sample flow. Response headers
  enforce the documented CSP, HSTS, referrer, permissions, and cache policy.
  License verification is rate-limited after 30 requests with 429 and
  `Retry-After`.
- All 36 public `dist/site` files generated from this candidate match the live
  deployment byte-for-byte. Release v0.1.15 has the full cross-platform asset
  set and a freshly checked Linux DEB checksum.

See `.factory/verification-18.md` for exact commands, measurements, evidence,
release identity, and the complete decision record.

## Known limitation / operator action

Desktop builds are intentionally unsigned. macOS and Windows users may need
to confirm first launch. Signing/notarization requires owner certificates;
there are no release-blocking gaps in the product itself.

---

# Repair 13 handoff — v0.1.15

## Scope and repaired blocker

This repair starts from independent verification 17 (`00ce3d70f7da4dc25c3ea98bf2c7dbac32114f3b`). That report found one release-blocking issue: at 390×844 on `/demo/?demo=1&view=settings`, the `Notes` and `VS Code` application opt-ins had 30 px-high labels and 24×24 px checkboxes.

The failure was reproduced before the change against the production app build:

```json
[
  {"name":"Notes","label":[95.40625,30],"checkbox":[24,24]},
  {"name":"VS Code","label":[117.515625,30],"checkbox":[24,24]}
]
```

The root cause was that `.app-list li` was 52 px high but its wrapped native checkbox label sized only to its content. The repair stretches the native `<label>` across its available list-row area and makes the native `<input type="checkbox">` 44×44 px. It preserves the existing native checkbox and wrapped-label semantics, so its accessible name, checked state, focus, Space activation, and label activation are unchanged.

`tests/e2e/site.spec.ts` now includes `Settings opt-in labels and native checkboxes keep 44px mobile hit areas`. It targets the precise two sample controls at 390×844, asserts each label and checkbox is at least 44×44 px, then verifies Space and a label click both toggle `Notes`.

The repaired production build measured:

```json
[
  {"name":"Notes","label":[314,51],"checkbox":[44,44]},
  {"name":"VS Code","label":[314,51],"checkbox":[44,44]}
]
```

The desktop app and site are versioned as `0.1.15` / `v0.1.15` together so the downloadable Tauri application contains the same repair.

## Local verification

Run from a clean checkout:

```sh
npm ci
CI=true npm test
npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
```

All commands passed on 2026-09-02 UTC. `npm test` passed 27 Vitest checks, the installer checksum contract, four native Rust tests, and 51 Playwright tests. The browser suite includes desktop and 390px mobile layouts, keyboard, Axe serious/critical checks, privacy request checks, service-worker update behavior, and a separate-context offline demo reload.

`VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 <temp-dir>` also passed against the production site build: title, `lang=en`, one `h1`, `main`, image alternatives, and zero console errors (619 ms local load). The Vite preview does not emulate Static Web Apps' configured 404 override; live response-policy verification follows deployment.

## Production deployment and release evidence

The rebuilt `dist/site` was deployed to the scoped `sf-dictation-repair-book` Azure Static Web App on 2026-09-02 UTC. The custom production origin is https://dictation-repair-book.sociobot.in. Its `/` response is byte-for-byte identical to `dist/site/index.html` (`61fa1e036031538daa5ee26e9abeab9cdec775d7fc3cf28d1354ddf743e61028`) and shows `v0.1.15`.

Live checks passed:

- `node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in /tmp/dictation-repair-book-repair-13-live` passed all public route shells, desktop and 390px flows, no-overflow widths 621/640/700/800, keyboard focus/history, privacy request checks, Axe serious/critical checks, service-worker update, and a fresh offline demo reload with a 404 missing route.
- `/opt/fleet/lib/verify-url.sh` passed against the custom origin: 200, title, `lang=en`, one `h1`, `main`, image alternatives, and no browser errors (675 ms).
- The production response includes the expected `nosniff`, strict referrer policy, camera/microphone/geolocation denial, and CSP with `frame-ancestors 'none'` response header.
- Live 390×844 Settings geometry is `Notes` 314×51 px label / 44×44 px checkbox and `VS Code` 314×51 px label / 44×44 px checkbox. The visual route has no horizontal overflow.

The tagged [`v0.1.15`](https://github.com/B-Divyesh/sf-dictation-repair-book/releases/tag/v0.1.15) release was built from commit `7d8465476dcb9e28f48a8ae5a4a4fc27dea9c821` by successful workflow [33599746011](https://github.com/B-Divyesh/sf-dictation-repair-book/actions/runs/33599746011). It includes macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`. Both manifests identify v0.1.15 and that exact source commit.

The published Linux DEB (`dictation-repair-book` 0.1.15 amd64) was downloaded and passed `SHA256SUMS` (`427ce76d26c4ed6ea68ff71b61dd203baa591e441ba635a4be7b080d23dda163`). Its declared GTK/WebKit/AppIndicator runtime dependencies were installed in the verification container; an isolated extracted app stayed open for 12 seconds under Xvfb.

## Known gaps and operator action

There are no known release-blocking gaps. Desktop artifacts remain intentionally unsigned, as disclosed on the site and in the README. macOS and Windows signing/notarization require the owner’s certificates; no signing secret is configured in this repository, so users may need to confirm the first launch with their operating system.
