# Dictation Repair Book

Dictation Repair Book turns the explicit text corrections a dictation user already makes into a private, inspectable vocabulary glossary. It is for people whose daily words—names, medications, project codenames, libraries, and commands—are too specific for a general speech recognizer.

The product is a Tauri 2 desktop tray app plus a static download site at [dictation-repair-book.sociobot.in](https://dictation-repair-book.sociobot.in). It is not a speech recognizer and never records audio.

## What works in v0.1

- Name and enable approved source applications.
- Explicitly capture an uncorrected and corrected clipboard transcript.
- Infer the changed whole-term span and approve or discard the proposed rule.
- Apply approved rules locally to a fresh transcript, longest rule first.
- Search and delete individual rules, with immediate undo.
- Export CSV, JSON backup, or a Whisper vocabulary prompt; import JSON.
- Encrypt the native glossary at rest with AES-256-GCM and a random per-device key.
- Erase the encrypted vault and key from inside the app.
- Use 25 approved rules for free; a $24 one-time Sociobot license unlocks unlimited approved rules. Export, deletion, and accessibility are never gated.

## Privacy and security model

The desktop app reads clipboard text only after the user presses a paste button. It does not monitor fields, keystrokes, foreground windows, or audio. Native state is encrypted before it is written under the operating system application-data directory. The separate key is created locally and receives mode `0600` on Unix systems.

This protects casual at-rest exposure, backups, and accidental inspection. It is not protection from malware or another process already running as the same OS user. Exported files are plaintext by design so they remain interoperable; handle them accordingly.

License verification sends only the license token to `api.sociobot.in` at most once per day. Vocabulary never leaves the app. The website loads no third-party fonts, analytics, or runtime scripts.

## Develop

Requirements: Node 22+, Rust stable, and the [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/) for your platform.

```sh
npm ci
npm run dev          # web preview of the app at 127.0.0.1:1420
npm run dev:site     # landing site at 127.0.0.1:4173
npm run tauri dev    # native desktop window and tray
```

The browser app preview intentionally uses local storage and labels itself as a preview. Release builds use the encrypted Rust vault.

## Try the sample repair book

Open [the demo](https://dictation-repair-book.sociobot.in/demo/) or choose **Try it with sample data** on the landing page. It starts with three shipped correction rules and stores only under a separate demo browser-storage key. **Reset demo** restores those samples; **Start for real** returns to the download page. See [.factory/demo.md](.factory/demo.md) for the sample and storage boundary.

## Test and build

```sh
npm test             # unit + Playwright end-to-end + axe checks
npm run typecheck
npm run build
```

`npm run build` reproducibly creates:

- `dist/app/` — the Tauri webview bundle.
- `dist/site/` — the exact static deployment root, with `index.html`, `/privacy`, `/terms`, and installer scripts.

The initial site bundle is about 3.5 KB JavaScript and 10.7 KB CSS before gzip. No native platform bundle is built in the factory workspace; `.github/workflows/release.yml` builds each target on GitHub's matching public runner.

## Install

Download the detected installer from the website, or use a checksum-verifying command:

```sh
curl -fsSL https://dictation-repair-book.sociobot.in/install.sh | sh
```

```powershell
irm https://dictation-repair-book.sociobot.in/install.ps1 | iex
```

Linux installs the AppImage to `~/.local/bin/dictation-repair-book`. macOS downloads and opens the correct Intel/Apple-silicon DMG. Windows verifies and launches the MSI. Version 0.1 builds are unsigned: on macOS, right-click the app and choose **Open** the first time; Windows may show an unknown-publisher warning.

## Release

Push a `v*` tag (for example `v0.1.0`) or dispatch the release workflow. GitHub Actions builds:

- macOS Apple silicon and Intel DMGs
- Windows MSI and NSIS EXE
- Linux AppImage and DEB

The publish job assigns stable filenames, generates `SHA256SUMS` and `latest.json`, and attaches everything to a GitHub Release. The landing page resolves its primary button from that manifest.

## Repository map

- `src/` — desktop interface, rule inference, exports, and license handling.
- `src-tauri/` — encrypted vault, explicit clipboard commands, and tray lifecycle.
- `site/` — static landing and legal pages.
- `site/demo/` — isolated browser demo using shipped sample rules.
- `public/install.*` — checksum-verifying installers.
- `scripts/prepare-release.mjs` — release asset normalization and manifest generation.
- `.factory/design.md` — product-specific visual tokens, motion, and generated-asset provenance.

## License

MIT. See [LICENSE](LICENSE).
