# Dictation Repair Book

Turn explicit dictation corrections into private reusable rules. It is for people whose names, medication spellings, code terms, and workplace jargon need careful repair after dictation.

Dictation Repair Book is a Tauri 2 desktop app with a static download site at [dictation-repair-book.sociobot.in](https://dictation-repair-book.sociobot.in). It repairs text you paste; it is not a speech recognizer and does not record audio.

## What it does

- Capture an uncorrected and corrected sentence after you choose a source application.
- Find the changed words, then let you approve or discard a reusable rule.
- Apply approved rules locally to a fresh transcript, with longer matching rules first.
- Search, delete, undo, and export rules as CSV, JSON backup, or a Whisper vocabulary prompt.
- Encrypt the native repair book with AES-256-GCM and a local per-device key.
- Erase the encrypted repair book, temporary vault file, key, and local license data.
- Include 25 approved rules and every export for free; a $12 one-time license allows further approvals.

## Privacy

The desktop app reads clipboard text only after you press **Paste clipboard**. It does not monitor fields, keystrokes, foreground windows, or audio. Native state is encrypted before it is written under the operating-system application-data directory. On Unix, the local key has mode `0600`.

The repair-book file is encrypted at rest; processes running as your OS user may still access the local key. Exports are plaintext so other tools can read them. The sample demo sends no request outside the product origin. License verification sends the license token to `api.sociobot.in`; it does not include repair-book text.

## Try the sample repair book

Open [the demo](https://dictation-repair-book.sociobot.in/demo/?demo=1) or choose **Try it with sample data**. The landing alias `/?demo=1` opens the same demo. It uses the `demo:drb_web_preview_state` browser-storage namespace. **Reset demo** restores the shipped sample. **Start for real** deletes the demo namespace and returns to the download page without changing `drb_web_preview_state`.

In the installed app, the first-run screen has **Load sample repair book**. It runs in memory until you choose **Keep this repair book**; **Start for real** discards it. See [.factory/demo.md](.factory/demo.md).

## Develop

Requirements: Node 22+, Rust stable, and the [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/).

```sh
npm ci
npm run dev
npm run dev:site
npm run tauri dev
```

## Test and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
cargo test --manifest-path src-tauri/Cargo.toml --no-default-features
```

The native privacy tests do not need a graphical interface. They run from a
clean Linux clone without GTK or WebKit development metadata:

```sh
cargo test --manifest-path src-tauri/Cargo.toml --no-default-features
```

`npm test` runs a portable structural check of the PowerShell installer and
its required CI wiring. Run `npm run test:installer-windows` in PowerShell to
execute the shipped script with matching, mismatching, and missing checksums.

`npm run build` creates `dist/app/` for the desktop webview and `dist/site/` for the static site deployment.

## Install and release

Download the detected installer from the website, or use the checksum-verifying install command:

```sh
curl -fsSL https://dictation-repair-book.sociobot.in/install.sh | sh
```

```powershell
irm https://dictation-repair-book.sociobot.in/install.ps1 | iex
```

The install commands compare the downloaded package with `SHA256SUMS`. Direct downloads include that published checksum. Current builds are unsigned, so macOS and Windows may ask you to confirm the first launch.

Set the same version in `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`. Then push its `v*` tag or run the release workflow for that tag. The workflow refuses a tag that does not point at the checked-out source or whose app, Tauri, and Cargo versions disagree. Each packaged desktop webview carries its exact release tag and full source commit. The workflow publishes `SHA256SUMS`, `latest.json`, and `build-info.json` with that commit before attaching all files to the GitHub Release.

## License

MIT. See [LICENSE](LICENSE).
