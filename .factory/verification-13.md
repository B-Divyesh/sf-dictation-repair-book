# Verification 13 — PASS

**Candidate:** `6f4938d734b3d54ddc54a92b24fd41a3127d2faf`  
**Live URL:** https://dictation-repair-book.sociobot.in/  
**Verified:** 2026-09-01  
**Verdict:** **PASS** — no release-blocking defect found.

## Clean checkout, claims, and local gates

I checked out the candidate cleanly, ran `npm ci` (168 packages; zero audit
vulnerabilities), then began with `.factory/claims.json` as required. It exists
and contains 34 claims. Every declared claim test passed:

- `npm run test:e2e -- --grep '@claim:'`: **20/20** demo/browser claims passed.
- `npm run test:unit -- --testNamePattern '@claim:'`: **10/10** unit claims
  passed.
- The three exact native Rust claim commands passed.
- The exact `powershell-checksum-installer` fixture passed under its documented
  PowerShell 7 prerequisite. The base container did not supply `pwsh`; I used an
  isolated PowerShell 7.5.4 runtime and verified both checksum match (mocked MSI
  launch) and checksum mismatch (refusal before launch).

The complete quality gate then passed with that documented runtime on `PATH`:

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Evidence: 27/27 Vitest tests, the Node and executable PowerShell installer
contracts, 4/4 no-GUI native Rust tests, and 45/45 Playwright tests passed.
The production build created `dist/app/` and `dist/site/`.

## Cold live first read

A fresh Chromium navigation returned HTTP 200, no console/page errors, and only
product-origin requests. The first screen plainly answers the required questions:

- **What:** “Turn dictation corrections into reusable rules.”
- **For whom:** people dictating names, medications, code terms, or workplace
  jargon.
- **First action:** a visible **Try it with sample data** control, whose adjacent
  text explains that it opens a separate sample repair book.

Keyboard focus on this control followed by Enter opened `/demo/?demo=1` directly.
The sample view showed “Demo — sample data, nothing is saved” and working rules.

## End-to-end, accessibility, and privacy QA

The independently completed 45-test browser suite exercised normal correction,
search/delete/undo, CSV/JSON/Whisper export, 25-rule licensing boundary,
invalid-import recovery, backoff, reset/erase, keyboard use, deep links,
service-worker update, and 390 px layout. It passed.

Fresh live desktop (1440×900) and mobile (390×844) checks found no horizontal
overflow. The first Tab reaches a visible Skip to content control. Axe reported
zero serious or critical findings at both sizes (zero violations total). A
fresh demo flow made no request outside the product origin; the landing had no
third-party scripts, fonts, or analytics.

After service-worker control, an offline navigation to `/demo/` returned 200,
displayed the working “Approved rules” view, and produced no browser errors.

## Headers, performance, identity, and release

- Production sends HSTS, `X-Content-Type-Options: nosniff`, restrictive
  Permissions Policy, `Referrer-Policy: strict-origin-when-cross-origin`, and
  CSP with `frame-ancestors 'none'`. Hashed JS/CSS are cached for one year as
  immutable; HTML and the worker revalidate after 30 seconds.
- Initial landing code is within budget: 1.88 kB gzip landing JS plus 0.44 kB
  preload helper; CSS is 3.23 kB gzip.
- Candidate `dist/site/index.html` SHA-256 exactly equals the deployed root:
  `1032ac6688de29343e59e219d11f30a1ac3ff21806bbd67f3bd2eb1a532a0634`.
  Referenced static assets also match.
- The product has no product-owned server endpoint, so a product API allowance
  test is not applicable. The shared factory license service is outside this
  product's scoped resources; client-side `Retry-After` handling passed its
  declared claim test.
- Public v0.1.10 includes both macOS DMGs, Windows MSI/EXE, Linux AppImage/DEB,
  `SHA256SUMS`, `latest.json`, and `build-info.json`. Downloaded Linux DEB hash
  `33205a63657b2f6b9a73cf2d570b3fcd4746f503e7a458daceef0b33934d7220`
  matches `SHA256SUMS`. Its built desktop source identity is
  `bf5b55fee35e848d4c4657fd7e54ef73be5e13d4`; the candidate did not change
  desktop runtime source, while the live static deployment exactly matches it.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

No product code, deployment, billing, or infrastructure was modified.
