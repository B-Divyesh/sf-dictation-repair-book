# Review 6 handoff — FAIL

Adversarial review 6 is recorded in `.factory/review-6.md` against commit `a78d4467c8cda12a4c42d0d326d0af28cf46baf7` and the live site on 2026-09-02 UTC. No product code, deployment, billing, or infrastructure was changed.

## What was done

- Captured cold 390×844 and 1440×900 first reads before scrolling.
- Audited every landing and README sentence with word counts and checked headings, terminology, jargon, and action labels.
- Entered the one-click sample, verified realistic data, Reset, Start for real, real-storage isolation, same-origin requests, local repair, offline reload, and route history/focus.
- Ran all 34 commands from `.factory/claims.json` separately in a clean clone.
- Ran the full clean-clone `npm test`, build, typecheck, and lint gates.
- Crawled live links; inspected metadata, headers, 404 behavior, responsive widths, Axe results, reduced motion, and the visual system.
- Rechecked every finding from reviews 1–5, polish records 1–5, and the prior handoff in live behavior and source.

## Result

Verdict: **FAIL** with six findings:

- **Blocking F-1-7:** the declared PowerShell checksum claim command only checks source structure and CI wiring; it does not execute the shipped PowerShell fixture.
- **Minor F-6-1:** live Settings width is 726px at a 640px viewport; the defect spans roughly 621–729px.
- **Minor F-6-2:** the hero uses two supporting sentences instead of the required one-sentence audience/outcome line.
- **Minor F-6-3:** “The app isolates the changed span” uses avoidable implementation jargon.
- **Minor F-6-4:** “AES-256-GCM vault stored on your device” is an algorithm-only first-read privacy line.
- **Minor F-6-5:** one README sentence is 23 words, above the 22-word hard cap.

All declared claim commands exit successfully, but `powershell-checksum-installer` is not adequate evidence for its promise. No unlisted landing/README claim was found.

## Verification commands

```sh
npm ci
npm test
npm run build
npm run typecheck
npm run lint
node scripts/verify-live.mjs https://dictation-repair-book.sociobot.in /tmp/drb-review-6/verify-live
```

The clean clone used for this review was `/tmp/drb-review6-clean-JVwFSS`. Temporary logs and screenshots are under `/tmp/drb-review-6/`; they are not repository changes.

## Next steps

Make the executable PowerShell fixture the declared claim test, repair the Settings breakpoint/minimum columns, and apply the four copy rewrites in the review. Add intermediate-width overflow coverage before rerunning review 7.
