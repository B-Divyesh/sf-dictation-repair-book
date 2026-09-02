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

## Pending publication evidence

The next steps are to push this source commit, deploy `dist/site` to the scoped `sf-dictation-repair-book` Static Web App, create the `v0.1.15` Tauri release through the repository workflow, verify the published production site and release artifact, then append the exact live evidence here. No user data migration, analytics, third-party script, or privacy-boundary change is part of this repair.
