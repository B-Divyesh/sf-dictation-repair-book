# Visual system: the marked-up repair ledger

## Direction and rationale

Dictation Repair Book uses a **neo-brutalist utility** direction: a workbench, not a lifestyle dashboard. Thick ink rules, squared paper, correction marks, and blunt controls make every inferred rule feel inspectable. The visual metaphor is a private repair ledger: the product never pretends that automatic learning is magic, and a user can see, approve, test, export, or delete every entry.

The landing page carries this language into a cropped editorial still life of paper slips, a waveform strip, a padlock, and a fluorescent correction tab. It explains the before → after → reusable rule loop instead of decorating a generic hero.

## Tokens

- `--paper #F3EFDF`: warm ledger background.
- `--paper-deep #E3DBC1`: secondary paper and disabled regions.
- `--ink #171714`: primary text and 3 px rules (contrast 15.5:1 on paper).
- `--muted #56544B`: secondary copy (contrast 6.3:1 on paper).
- `--acid #D9F23F`: approval/action highlighter with ink text.
- `--cobalt #3157D5`: focus, link, and selection signal; white text is used only at large/bold sizes, otherwise ink or paper is used after contrast checks.
- `--coral #E66345`: correction/warning marker with ink text.
- `--success #246B45`, `--danger #9F2936`: semantic text/icons, always paired with words.
- Dark treatment: `--paper #1C1D1A`, `--paper-deep #292A25`, `--ink #F4F0E2`, `--muted #BDB9AA`, with acid/coral retained as physical highlighter colors. User preference follows the OS and can be overridden in the app.

## Type and spacing

- Interface/display: system grotesk (`Inter`-like platform stack: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`) to avoid third-party font requests and keep binaries lean.
- Ledger/data: system monospace (`ui-monospace, "SFMono-Regular", Consolas, monospace`) for before/after snippets, counts, and rule spellings.
- Scale: 14 / 16 / 20 / 28 / clamp(42–72) px. Body never below 16 px. Tables use tabular figures.
- 4 px base rhythm; core gaps 8, 12, 16, 24, 32, 48, 72 px. Content measures 62–72 characters. Rules are 2–3 px, corners 0–8 px—never default pill cards.

## Layout and interaction grammar

- The desktop app is a two-rail ledger: task navigation on the left, the active work surface on the right. At narrow widths the rail becomes a labeled bottom bar and secondary panels stack.
- Primary actions are acid rectangles with a hard 4 px ink offset shadow. Pressing moves the control into its shadow. Secondary actions are paper with a 2 px outline.
- States use stamped words (`DRAFT`, `APPROVED`, `LOCAL ONLY`) as well as color. Focus is a 3 px cobalt outline with 3 px clearance.
- Before/after text sits on ruled-paper fields. The inferred changed span is marked with coral and acid underlines. Destructive actions require a named confirmation or offer undo.

## Motion

- 160 ms press and selection transitions; 220 ms panel entrances translating no more than 8 px from their physical origin.
- A newly approved rule briefly receives one non-looping highlighter sweep using a scale transform.
- With `prefers-reduced-motion: reduce`, all translation and sweep effects become instant opacity changes; smooth scrolling is disabled. Nothing loops or flashes.

## Original asset plan and provenance

Hero asset: an editorial, tactile still life of a private correction ledger with a waveform slip, crossed-out phonetic fragments, a rewritten blank label, a small brass lock, cobalt clipboard, and acid-yellow correction tab. The image contains no readable/generated text; live HTML supplies all claims and labels.

Prompt sheet:

> Use case: stylized-concept. Asset type: desktop utility landing-page hero. Scene/backdrop: top-down tactile paper workbench on warm recycled ledger paper. Subject: an open squared notebook with abstract waveform marks and correction strokes, loose before-and-after transcript strips connected by a bold arrow, a compact cobalt clipboard, small brass padlock, acid-yellow page marker. Style/medium: neo-brutalist editorial still life, hand-cut paper collage mixed with precise screenprint, slight ink misregistration, hard black outlines, crisp tactile paper fibers. Composition: landscape 3:2, objects concentrated in center and right with quiet paper margin, no device mockup. Lighting/mood: honest soft overhead studio light, utilitarian and private. Palette: warm paper, near-black ink, electric acid yellow, workwear cobalt, restrained correction coral. Avoid: readable text, letters, logos, brands, UI screenshots, people, hands, microphones, glossy 3D, gradients, watermark, illegible pseudo-writing, excessive clutter.

- Generator: Factory Azure image deployment via `/opt/fleet/lib/gen-image.sh`.
- Generated: 2026-08-28.
- License/provenance: original AI-generated project asset; prompt and source candidate are stored in `assets/src/`. No brands, real people, or copyrighted characters.
- Social preview: `public/assets/social-card.jpg` is a 1200×630 center crop of the approved hero asset, created locally with ImageMagick on 2026-08-29; no new generated content was introduced.
- Apple touch icon: `public/apple-touch-icon.png` is a 180×180 derivative of the hand-authored native app icon, created locally with ImageMagick on 2026-08-29.
- Hand-authored SVG icons use simple geometric paths created for this project and are covered by the repository MIT license.
- Desktop walkthrough images: `public/assets/walkthrough-{capture,rules,test,settings}.png` are Playwright captures of the shipped local UI at 1440×960. The Capture frame was recaptured from the repaired before/after form on 2026-08-30; the other frames remain product screenshots, not stock or generated imagery.

## Image review checklist

Candidates are rejected for pseudo-text, logo-like marks, malformed objects, visual seams, unrelated microphones/people, or palette drift. The selected candidate must remain legible when cropped at 390 px and export to WebP below 300 KB with explicit intrinsic dimensions.
