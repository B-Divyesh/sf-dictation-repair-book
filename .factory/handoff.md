# Verification 10 handoff — FAIL

**Candidate:** `3b25f03ad7f011a7132062de9df5e7e00039ab5e`
**Live URL:** https://dictation-repair-book.sociobot.in/
**Result:** **FAIL — release blocked.**

## Release-blocking result

The live static site matches the candidate build byte-for-byte, but its desktop
downloads do not. Release `v0.1.6`, both release manifests, and the running
Linux app identify commit `99fdc51de4a209400cdb7b03a6bd443175aae5f5`.
Candidate `3b25f03ad7f011a7132062de9df5e7e00039ab5e` changes native source and the
release workflow after that tag. No installable candidate artifact is
published.

A second defect appears after **Load sample repair book** in the installed app:
at the default 1180×780 window, the fixed sample banner overlaps the kicker,
the “Approved rules” heading, and the approved-rule count.

## Verification summary

- Confirmed all 33 commands in `.factory/claims.json`; all passed.
- Confirmed `npm test`: 26 unit checks, one portable installer contract, four
  native checks, and 44 browser checks passed.
- Confirmed typecheck, lint, Rust formatting, no-default-feature Rust check,
  and the exact production build.
- Confirmed all 36 live site files match `dist/site/` by SHA-256.
- Confirmed cold first-read wording and the one-click sample action.
- Confirmed live normal, empty, no-match, and invalid-import recovery paths.
- Confirmed same-origin sample traffic, security and cache headers, offline
  reload, service-worker update, 404 handling, 390px layout, keyboard focus,
  reduced motion, and dark appearance.
- Confirmed no serious or critical Axe findings on all public routes at desktop
  and 390px.
- Confirmed Lighthouse mobile: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.2 s, total blocking time 0 ms, CLS 0.
- Confirmed release assets exist for macOS, Windows, and Linux. The downloaded
  Linux DEB matches `SHA256SUMS`, starts, loads its in-memory sample, and applies
  the Kubernetes rule without creating a vault.

Full evidence and exact details are in
[verification-10.md](verification-10.md) and
[`verification-artifacts-10/`](verification-artifacts-10/).

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml --no-default-features
npm run build
```

Compare the requested source with the published build identity:

```sh
git rev-parse HEAD
git rev-parse v0.1.6^{commit}
curl -fsSL https://github.com/B-Divyesh/sf-dictation-repair-book/releases/download/v0.1.6/build-info.json
```

## Required next steps

1. Publish all desktop packages from the candidate commit and update release
   manifests to that exact commit.
2. Move the native sample banner out of the active heading area at the default
   window size.
3. Run independent verification again against the updated candidate.

## Operator action

Current desktop builds are intentionally unsigned. macOS notarization and
Windows Authenticode still require owner-managed signing credentials; none are
stored in this repository.
