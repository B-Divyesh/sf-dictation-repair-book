# Review 7 — Turn dictation corrections into reusable rules

Reviewed 2026-09-05 UTC against the live product at
<https://dictation-repair-book.sociobot.in>.

## Verdict

**PASS — zero findings at every severity and zero untested claims.**

- Finding count: **0**
- Untested claim count: **0**
- Implementation reviewed: `7d8465476dcb9e28f48a8ae5a4a4fc27dea9c821`
- Nominated post-release candidate: `3c938381fa6d51c821334bbe21a538b78c3c485b`
- Documentation checkout reviewed: `908f423bdcd448e000efa97abcbc3c7c13e1ef97`
- Live release: `v0.1.15`

The nominated candidate and current checkout only change `.factory`
documentation after implementation commit `7d846547…`. Release manifests,
the installed app footer, rebuilt site output, and live bytes all identify that
implementation. No product code was changed in this review.

## First screen before scrolling

Fresh Chromium contexts were used at 1440×900 and with a Pixel 5 mobile user
agent at 390×844. Neither page was scrolled before this check.

| Question | Visible answer |
| --- | --- |
| Job | “Turn dictation corrections into reusable rules.” |
| Audience | Dictation users with uncommon names, medications, code terms, or workplace jargon. |
| First action | **Try it with sample data**. |
| Action result | “Opens a separate sample repair book. Nothing enters your real book.” |

The desktop fact block ended at 733 px in a 900 px viewport. The phone fact
block ended at 607 px in an 844 px viewport. Both views also showed the three
required facts: no audio or account, offline demo use after one visit, and 25
free approved rules with a $12 one-time license for more.

## Sample and product checks

- One click opened `/demo/?demo=1` on the populated Rules view with
  `met a pro lol → metoprolol`, `cube or net ease → Kubernetes`, and
  `Neem → Niamh`.
- The notice **Demo — sample data, nothing is saved** remained visible on
  Rules, Test, and Settings. It included **Reset demo** and **Start for real**.
- The sample repaired “Deploy the cube or net ease service.” to “Deploy the
  Kubernetes service.” Deleting that rule removed it; **Reset demo** restored
  it.
- A real-data marker was written before entering the sample. It was unchanged
  after sample deletion, reset, and exit. **Start for real** removed the demo
  namespace and retained the real-data marker.
- Identical before/after text produced a useful changed-term error. A malformed
  JSON import said the current book was not changed, and the existing source
  remained after reload.
- The 25-rule boundary, cached/revoked license behavior, literal `$&`
  replacement, longest-first matching, delete/undo, JSON round trip, CSV,
  Whisper prompt, and erase paths passed their dedicated tests.
- Back and Forward restored the correct demo URL, h1 focus, and live-region
  announcement.

## Declared claims

Every `.factory/claims.json` entry was run as its own command from a fresh
local clone after `npm ci`. All 34 passed.

| Claim | Result | Observed proof |
| --- | --- | --- |
| `demo-sandbox` | PASS | Separate key, reset, exit cleanup, real key retained |
| `no-account` | PASS | Sample repair without credentials |
| `rule-management` | PASS | Approve, search, delete, undo, and apply |
| `literal-code-replacement` | PASS | Literal `$&` output |
| `longest-rule-first` | PASS | Longer overlapping rule applied first |
| `local-repair` | PASS | Kubernetes sample repaired locally |
| `portable-exports` | PASS | CSV and JSON downloaded; source name retained |
| `json-roundtrip` | PASS | Backup restored with its rule |
| `whisper-export` | PASS | Three unique terms copied |
| `private-demo` | PASS | Sample flow made only same-origin requests |
| `website-privacy` | PASS | No third-party scripts, fonts, or analytics |
| `on-demand-release-lookup` | PASS | GitHub API called only after download intent |
| `explicit-access` | PASS | No audio, global-keyboard, or arbitrary-field permission |
| `clipboard-on-command` | PASS | Zero reads before click; one after click |
| `free-book` | PASS | Rule 26 blocked free and allowed with valid cache |
| `erase-local-book` | PASS | Book, token, and verdict removed |
| `native-erase` | PASS | Vault, temporary file, and key removed |
| `license-backoff` | PASS | `Retry-After` prevented an immediate retry |
| `license-daily-cache` | PASS | Valid cache was not rechecked within one day |
| `license-request-privacy` | PASS | Verification contained the token, not repair text |
| `license-return` | PASS | Returned token stored; query removed |
| `encrypted-vault` | PASS | AES-256-GCM round trip; plaintext absent |
| `per-device-key` | PASS | Distinct 32-byte keys; Unix mode `0600` |
| `revoked-license-locks` | PASS | Revocation stopped approval beyond the free limit |
| `checksum-installers` | PASS | Unix mismatch refused installation |
| `powershell-checksum-installer` | PASS | Portable declared test passed; shipped script also passed under PowerShell 7.6.5 for match, mismatch, and missing checksum |
| `release-matrix` | PASS | Six platform bundles plus manifests and checksums |
| `unsigned-build` | PASS | No signing setup; warning is public |
| `offline-demo` | PASS | Cached sample opened and repaired text offline |
| `native-sample-isolation` | PASS | Sample controls could not touch real native state |
| `checkout-price` | PASS | Live checkout showed one-time USD $12 |
| `build-output` | PASS | `dist/app/` and `dist/site/` produced |
| `release-source-identity` | PASS | Wrong tag, version, and source cases refused |
| `artifact-identity` | PASS | Release tag and full source commit embedded |

Each claim ID has one owning `@claim:<id>` tag. The live landing, legal pages,
demo, README, and copy audit were checked for additional public promises. No
missing, false, incomplete, or untested claim was found.

## Local quality gates

All commands ran from `/tmp/drb-review7-HyJGQ8`, cloned from the clean review
checkout.

```text
npm ci
  PASS — 168 packages, 0 vulnerabilities

CI=true npm test
  PASS — 27 Vitest, portable installer contract, 4 Rust, 51 Playwright

npm run typecheck
npm run lint
npm run build
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
cargo fmt --manifest-path src-tauri/Cargo.toml --check
  PASS
```

`npm run build` produced `dist/app/` and `dist/site/`. Initial landing output
was 1.90 kB gzip JavaScript plus a 0.44 kB preload helper and 3.23 kB gzip CSS.
The 390 px hero source was 47,766 bytes.

## Live browser and accessibility checks

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. A made-up route
  returned the designed page with HTTP 404. Its browser missing-resource line
  is the expected result of requesting a 404, not a defect.
- Every checked route had `lang=en`, one h1, one main landmark, a route title,
  and complete image alternatives. Successful routes had no console or page
  errors.
- Axe reported zero violations, including zero serious or critical findings,
  on all four demo views in light and dark modes at 390×844 and 1280×800. The
  public and legal routes also had zero serious or critical findings.
- The skip link was first in the tab order and moved focus to `main`. Demo
  route changes and history changes focused the new h1 and updated the polite
  announcement. Keyboard focus used a 3 px cobalt outline; no trap appeared.
- Every effective phone target was at least 44×44 px. The file input uses its
  358×46 px label. The repaired application opt-in labels and checkboxes meet
  the same baseline.
- All demo views had no horizontal overflow at 390, 621, 640, 700, and 800 px.
  Reduced-motion mode set scroll behavior to `auto`.
- `/opt/fleet/lib/verify-url.sh` passed in 798 ms with title, language, one h1,
  main, alt text, and zero console errors.
- Fresh mobile Lighthouse scored 100 Performance, 100 Accessibility, 100 Best
  Practices, and 100 SEO. FCP and LCP were 1.10 s, TBT was 17.5 ms, and CLS was
  0.

## Privacy, offline use, links, and response policy

- A cold landing requested only the product origin before download intent. A
  complete sample repair, export, and reset made five requests, all same-origin.
- The service worker was active with no waiting or installing update. After
  the browser went offline, `/demo/?demo=1` returned 200 and repaired
  `met a pro lol` to `metoprolol` without errors.
- CSP permits only self-hosted assets plus the disclosed GitHub metadata and
  Sociobot license endpoints. HSTS, `nosniff`, strict referrer policy,
  `frame-ancestors 'none'`, and camera, microphone, and geolocation denial were
  present. Hashed assets use one-year immutable caching; HTML and the worker
  revalidate after 30 seconds.
- All rendered internal and external links resolved. GitHub asset and latest
  links returned expected redirects. Checkout returned the expected 303 to the
  hosted checkout.
- The product has no first-party backend or tenant model. The scoped license
  verifier returned 200 for invalid requests 1–30, then 429 with
  `Retry-After: 2–3` seconds for requests 31–35.

## Release and installed desktop app

- All 36 public files in rebuilt `dist/site/` matched the live deployment
  byte-for-byte. `staticwebapp.config.json` is deployment configuration and is
  not a public file.
- Release `v0.1.15` contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux
  AppImage/DEB, `SHA256SUMS`, `latest.json`, and `build-info.json`. Both
  manifests name implementation `7d8465476dcb9e28f48a8ae5a4a4fc27dea9c821`.
- A fresh Linux DEB download matched SHA-256
  `427ce76d26c4ed6ea68ff71b61dd203baa591e441ba635a4be7b080d23dda163`.
  It installed as `dictation-repair-book` 0.1.15 amd64 with its declared
  dependencies.
- In a clean XDG profile, the installed app loaded its native sample without
  creating a real vault. In a separate clean profile, it added VS Code,
  approved `cube or net ease → Kubernetes`, restarted with that rule intact,
  and repaired `ship cube or net ease today` to `ship Kubernetes today`.
- The native key was 32 bytes with mode `0600`. The encrypted repair-book file
  did not contain `Kubernetes` in plaintext. The app footer showed
  `v0.1.15 · 7d8465476dcb`.

Headless desktop logs contained only expected container portal, D-Bus, and EGL
warnings. They did not affect the application workflow. Current desktop builds
remain intentionally unsigned, and the site discloses the confirmation users
may see.

## Earlier review findings

Every earlier review finding was reopened against current live or local
evidence. All are closed.

| Finding | Current disposition |
| --- | --- |
| F-1-1 | Closed: the mobile demo banner does not overlap the h1. |
| F-1-2 | Closed: query routes, Back/Forward, h1 focus, and announcements work live. |
| F-1-3 | Closed: the installed app has **Load sample repair book**; four accurate walkthrough frames are public. Sample mode did not create a real vault. |
| F-1-4 | Closed: mobile Axe has zero violations; keyboard focus is visible. |
| F-1-5 | Closed: an unknown live route returns the designed 404 with HTTP 404, including under service-worker control. |
| F-1-6 | Closed: the production native vault passes ciphertext and round-trip tests. |
| F-1-7 | Closed: the declared portable contract passes, and the shipped PowerShell script passed executable match, mismatch, and missing-checksum paths under PowerShell 7.6.5. |
| F-1-8 | Closed: release preparation creates and hashes six bundles; the live release has them all. |
| F-1-9 | Closed: live demo reset and exit retained a seeded real-data marker. |
| F-1-10 | Closed: `no-account` is declared and passed. |
| F-1-11 | Closed: the unsupported “any tool” absolute promise is absent. |
| F-1-12 | Closed: `longest-rule-first` is declared and passed. |
| F-1-13 | Closed: `per-device-key` proves random keys. |
| F-1-14 | Closed: the same claim proves Unix mode `0600`; the installed key also measured `0600`. |
| F-1-15 | Closed: the security overstatement was removed; current text states encryption and its limits. |
| F-1-16 | Closed: export and accessibility are not paywalled; erase is tested; unsupported merchant copy is absent. |
| F-1-17 | Closed: `license-request-privacy` proves repair text is excluded. |
| F-1-18 | Closed: privacy copy is scoped; `private-demo` proves the sample flow is same-origin. |
| F-1-19 | Closed: the unsupported “reproducibly” promise is absent. |
| F-1-20 | Closed: `unsigned-build` is declared, tested, and disclosed. |
| F-1-21 | Closed: copy now distinguishes checksum-verifying commands from direct downloads that include checksums. |
| F-1-22 | Closed: the h1 names the exact correction-to-rule job. |
| F-1-23 | Closed: current copy plainly says the app does not monitor fields or keystrokes. |
| F-1-24 | Closed: broad slogans were removed; the problem section names the task. |
| F-1-25 | Closed: the privacy heading names what the section covers. |
| F-1-26 | Closed: FAQ headings name each product-limit question. |
| F-1-27 | Closed: sample and download controls name their immediate results. |
| F-1-28 | Closed: copy consistently uses **rule**, **repair book**, and **application**. |
| F-1-29 | Closed: privacy, offline, and price facts are above the phone fold; the sample is the clear primary action. |
| F-1-30 | Closed: routes have the required headings, shared header/footer, version, and real URLs. |
| F-2-1 | Closed: site, app, terms, and live one-time checkout agree on $12. |
| F-2-2 | Closed: `build-output` is declared and passed. |
| F-2-3 | Closed: `release-source-identity` is declared and passed. |
| F-2-4 | Closed: the terminology audit uses one term per concept. |
| F-2-5 | Closed: sample sources are the visible names Notes and VS Code, including CSV after source removal. |
| F-2-6 | Closed: ambiguous tape slogans were replaced with tested facts. |
| F-2-7 | Closed: the install heading names its section. |
| F-2-8 | Closed: internal “release repair” copy is absent from the footer. |
| F-2-9 | Closed: README release instructions are direct and complete. |
| F-2-10 | Closed: demo navigation uses real links and stable query URLs. |
| F-2-11 | Closed: first-read privacy copy is plain; AES-256-GCM remains in technical detail. |
| F-3-1 | Closed: unsupported landing provenance copy is absent; generated-art provenance remains in design documentation. |
| F-5-1 | Closed: every GitHub and checkout link names its destination; all resolved. |
| F-6-1 | Closed: Settings and all other views have no overflow at 621, 640, 700, and 800 px. |
| F-6-2 | Closed: the hero uses one 19-word audience-and-outcome sentence. |
| F-6-3 | Closed: “changed span” is replaced by “changed words.” |
| F-6-4 | Closed: the landing explains device encryption in plain words. |
| F-6-5 | Closed: the README sentence was split; the current copy audit has no sentence over 22 words. |

## Earlier verification findings

| Earlier report | Current disposition |
| --- | --- |
| Verification 1 | Closed: claims and demo exist; live rate limiting starts at request 31; CSP, Axe, 404, CSV source names, and release identity pass. |
| Verification 2 | Closed: malformed import recovery, literal `$&`, full erase, demo exit, mobile layout/targets, offline demo, metadata, and the wordmark name all pass. |
| Verification 4 | Closed: the current release is built from the current implementation. |
| Verification 5 | Closed: the sample action and result fit laptop screens, every claim is tagged, and phone targets pass. |
| Verification 6 | Closed: release lookup is declared and Settings uses a sequential h1/h2 outline. |
| Verification 8 | Closed: the safe native sample is published; touch target, Capture frame, and real query-route repairs are live. |
| Verification 9 | Closed: native claims use the GUI-free target; the portable Windows claim command passes, and the shipped PowerShell fixture also passed. |
| Verification 10 | Closed: release identity is current and the native sample banner clears the heading. |
| Verification 11 | Closed: `npm test` passes and the published desktop identity is current. |
| Verification 15 | Closed: the 621–725 px Settings overflow is gone at every retested width. |
| Verification 16 | Closed: the declared portable Windows installer command passes from the clean checkout; direct PowerShell execution also passes when PowerShell is installed. |
| Verification 17 | Closed: both application opt-ins now have effective targets of at least 44×44 px. |
| Verifications 3, 7, 12, 13, 14, and 18 | Inspected; they reported no unresolved product finding. |

## Final decision

**PASS.** There are no critical, high, medium, low, minor, or informational
findings, and no declared or public claim remains untested.
