# Independent verification 15 — PASS

**Candidate:** `eb5106cdd9a3012fb90f90127ef1d2ee6182fdc2`  
**URL:** <https://dictation-repair-book.sociobot.in>  
**Verified:** 2026-09-02 UTC

## Release decision

**PASS.** No critical, high, or medium defect was found. One low-severity
responsive-layout defect is recorded below; it does not block the required
desktop or 390 px mobile experience.

The published desktop source is tag `v0.1.12` at
`4a973dcb3345047965240e2494f578cd27aa1f16`. Candidate changes after that tag
are confined to `.factory/` verification documentation and evidence:
`git diff --quiet v0.1.12 HEAD -- . ':(exclude).factory'` returned 0. A fresh
candidate production build was compared with production: all 36 deployable
files matched byte-for-byte. The private `staticwebapp.config.json` is not
expected to be served as content.

## Mandatory first-read gate

Cold page load at 1440 × 900 returned 200 with no console or page error.

- What it does: “Turn dictation corrections into reusable rules.”
- Who it is for: dictation users dealing with names, medications, code terms,
  or workplace jargon.
- What to do first: **Try it with sample data**.
- The adjacent explanation says the click opens a separate sample repair book
  and nothing enters the real book.

All three questions and the one-click sample action are answered above the
fold on desktop and 390 × 844 mobile. This gate passes.

## Claims gate

Every command in `.factory/claims.json` was run separately, in manifest order,
after `npm ci`. Result: **34 passed, 0 failed**. The full `npm test` run then
passed the same coverage again.

| Claim ID | Result | Evidence exercised |
| --- | --- | --- |
| `demo-sandbox` | PASS | Separate demo key, reset, and discard on exit |
| `no-account` | PASS | Sample repair and no credential fields |
| `rule-management` | PASS | Approve, search, delete, undo, and apply |
| `literal-code-replacement` | PASS | Literal `$&` replacement fixture |
| `longest-rule-first` | PASS | Overlapping-rule fixture |
| `local-repair` | PASS | Shipped Kubernetes sample repaired locally |
| `portable-exports` | PASS | CSV/JSON downloads and preserved source name |
| `json-roundtrip` | PASS | Export, reset, import, and restored rule |
| `whisper-export` | PASS | Unique terms copied in expected order |
| `private-demo` | PASS | No request outside product origin |
| `website-privacy` | PASS | No third-party script, font, or analytics request |
| `on-demand-release-lookup` | PASS | Zero GitHub calls before intent, one after |
| `explicit-access` | PASS | Capability manifest excludes sensitive access |
| `clipboard-on-command` | PASS | Zero reads before click, one after |
| `free-book` | PASS | Rule 26 blocked free and allowed with cached license |
| `erase-local-book` | PASS | Book, token, and verdict removed |
| `native-erase` | PASS | Vault, temporary file, and key removed |
| `license-backoff` | PASS | 429 `Retry-After` suppresses immediate retry |
| `license-daily-cache` | PASS | Valid verdict not rechecked within one day |
| `license-request-privacy` | PASS | Only license token sent; no repair text |
| `license-return` | PASS | Token stored and query removed |
| `encrypted-vault` | PASS | Ciphertext-only AES-256-GCM round trip |
| `per-device-key` | PASS | Distinct 32-byte keys and Unix mode 0600 |
| `revoked-license-locks` | PASS | Revocation prevents approval above free limit |
| `checksum-installers` | PASS | Unix mismatch refuses installation |
| `powershell-checksum-installer` | PASS | Contract plus real PowerShell match/mismatch/missing paths |
| `release-matrix` | PASS | Six desktop formats plus checksums/manifests |
| `unsigned-build` | PASS | No signing config and clear public warning |
| `offline-demo` | PASS | Returning visitor opens sample while offline |
| `native-sample-isolation` | PASS | Sample controls cannot touch real vault/license |
| `checkout-price` | PASS | Live checkout is one-time USD 1200 cents |
| `build-output` | PASS | `dist/app/` and `dist/site/` created |
| `release-source-identity` | PASS | Wrong tag/version/source cases refused |
| `artifact-identity` | PASS | Exact release tag and commit embedded |

The live landing page and README were cross-checked against the manifest. No
unlisted material product claim was found.

## Clean-clone quality gates

```text
npm ci                                      PASS; 0 vulnerabilities
npm test                                    PASS; 27 Vitest, installer contract,
                                                  4 Rust, 48 Playwright
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS
cargo check --no-default-features           PASS
cargo fmt --check                           PASS
npm run test:installer-windows               PASS via temporary PowerShell 7.5.2
node scripts/verify-native-portability.mjs   PASS
```

The exact production build created both required roots. Initial landing code
is 1.90 KB gzip JavaScript and 3.23 KB gzip CSS. Desktop-webview code is about
10.36 KB gzip JavaScript and 4.05 KB gzip CSS. The 768 px hero is 48 KB and
the 1536 px hero is 180 KB.

## End-to-end product checks

Fresh live demo checks covered the normal, boundary, invalid, and recovery
paths:

- Rejected unchanged before/after input and explained how to recover.
- Proposed and approved `post grass` → `PostgreSQL`.
- Applied that rule and the shipped Kubernetes rule in one fresh transcript.
- Replaced `Neem` and `NEEM` but correctly left `neemish` unchanged.
- Returned the original text and “No matching approved terms” when no rule fit.
- Rejected malformed JSON without replacing the current repair book.
- Deleted the new rule with the keyboard and restored it with Undo.
- Kept every demo request on the product origin with no failed response,
  console error, or page error.

The actual released Linux DEB was checksum-verified, extracted, and launched
under Xvfb with its declared GTK/WebKit dependencies. It remained running for
the 10-second smoke window. The native first-run screen rendered correctly,
and **Load sample repair book** opened the isolated three-rule native sample.

## Accessibility and responsive QA

- `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 each have
  `lang=en`, one `h1`, one `main`, complete image alt text, and no serious or
  critical Axe findings.
- Desktop keyboard traversal starts at the skip link. Eight consecutive Tab
  stops had a visible 3 px cobalt focus ring; measured contrast is 6.01:1 on
  the landing paper, 5.27:1 in the light app, and 7.28:1 in the dark app.
- Demo route changes, browser Back/Forward, and Alt+number shortcuts move focus
  to and announce the new `h1`.
- At 390 × 844 in dark/reduced-motion mode, all four app views have no page
  overflow, no banner/content overlap, and no serious/critical Axe finding.
  Interactive controls use at least 44 px effective targets; small checkbox
  and radio inputs are wrapped by 44 px-or-larger labels.
- Reduced-motion media changes animation/transition durations to 0.01 ms and
  disables smooth scrolling.

Fresh mobile Lighthouse: Performance **100**, Accessibility **100**, Best
Practices **100**, SEO **100**; FCP 1,096 ms, LCP 1,096 ms, TBT 8 ms, CLS 0.

## Privacy, headers, caching, and PWA

The cold landing requested only ten same-origin documents/assets and created
no local-storage key. The complete live repair flow made no external request.
GitHub release metadata is requested only after download intent. Source audit
found no analytics, telemetry, remote font, or third-party script integration.

Live responses include:

- HSTS: `max-age=10886400; includeSubDomains; preload`
- CSP: `default-src 'self'`, `object-src 'none'`, response-header
  `frame-ancestors 'none'`, and only GitHub release API plus Sociobot API in
  `connect-src`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- HTML/service worker: 30-second revalidation; hashed assets: one-year
  immutable caching; install scripts: five-minute caching

The live service worker updated without errors, controlled the page under
cache `drb-site-v7`, reloaded `/demo/?demo=1` offline with status 200, and
returned the designed 404 for an unknown offline route.

There is no product-owned backend or sign-in. For the in-scope Sociobot
license verification endpoint, one client received 30 successful invalid-token
responses and then request 31 returned **429** with `Retry-After: 4`. Its CORS
response allowed only `https://dictation-repair-book.sociobot.in` for this
request.

## Release and deployment evidence

- Live release lookup made zero GitHub API calls before intent and exactly one
  after intent, resolving to the v0.1.12 Linux AppImage.
- GitHub release v0.1.12 contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux
  AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`.
- A freshly downloaded Linux DEB passed its published SHA-256 checksum. Package
  metadata: `dictation-repair-book`, version `0.1.12`, `amd64`.
- `latest.json` and `build-info.json` name source commit
  `4a973dcb3345047965240e2494f578cd27aa1f16` and exactly the six installers.
- All 36 public build files match the candidate production build byte-for-byte.

## Findings

### Low — DRB-QA-15-01: narrow tablet breakpoint scrolls horizontally

On `/demo/?demo=1&view=settings`, widths 621–725 CSS px use the two-column
Settings layout after the phone breakpoint ends. At 621 px the document is
725 px wide; at 640 px it is 726 px wide. Content and controls remain reachable,
and the required 390 px mobile and desktop layouts do not overflow. Suggested
follow-up: stack `.settings-section` until at least 726 px or make its columns
fully shrinkable.

No critical, high, or medium defects were found.

## Evidence files

- `verification-artifacts-15/live/live-recheck.json`
- `verification-artifacts-15/live/live-route-check.json`
- `verification-artifacts-15/live/live-a11y.json`
- `verification-artifacts-15/live-edge-cases.json`
- `verification-artifacts-15/lighthouse-live-mobile.json`
- `verification-artifacts-15/live-keyboard-focus.png`
- `verification-artifacts-15/released-linux-app.png`
- `verification-artifacts-15/released-linux-sample.png`
- Desktop/mobile landing and demo captures under
  `verification-artifacts-15/live/`

No product code was modified during verification.
