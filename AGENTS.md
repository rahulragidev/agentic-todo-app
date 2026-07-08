# AGENTS.md

This file gives coding agents project-specific context. Keep it short and update it when workflows change.

## Project Overview

- Primary app or package: Tauri 2 desktop app — React 19 + Vite 8 (Rolldown) frontend, Rust backend in `src-tauri/`
- Main entry points: `src/main.tsx` (frontend), `src-tauri/src/main.rs` (backend)
- Important directories: `src/` (React UI), `src-tauri/src/` (Rust commands), `src-tauri/capabilities/` (permission grants)

## Architecture Notes

- Module boundaries: frontend calls Rust only through `invoke()` from `@tauri-apps/api/core`; commands are defined with `#[tauri::command]` in Rust
- Generated or vendored code: `src-tauri/gen/`, `src-tauri/target/`, `dist/` — never edit
- Sensitive areas: `src-tauri/capabilities/` and `src-tauri/tauri.conf.json` control the app's OS permissions — change deliberately

## Commands

- Install: `npm install`
- Build: `npm run build`
- Test: `npm run test` (Vitest + Testing Library; Tauri IPC is mocked via `@tauri-apps/api/mocks` — see `src/App.test.tsx`)
- Typecheck: `npm run typecheck`
- Lint: `npm run lint` (oxlint with type-aware rules)
- Format: `npm run format` / `npm run format:check` (oxfmt, Prettier-compatible)
- Everything at once: `npm run check` — run this before declaring work done
- React health: `npm run doctor` (react-doctor; also runs on staged files in the pre-commit hook)
- Rust side: `cargo clippy` / `cargo fmt` / `cargo test` inside `src-tauri/`

Git hooks live in `.githooks/` (activated via `git config core.hooksPath .githooks`). The pre-commit hook runs `npm run check` plus a react-doctor staged scan and blocks on failure.

## Fallow

- Use `fallow audit --format json --quiet` before committing AI-generated changes.
- Use `fallow dead-code --format json --quiet`, `fallow dupes --format json --quiet`, and `fallow health --format json --quiet` for targeted checks.
- Use `fallow list --entry-points --format json --quiet` and `fallow list --boundaries --format json --quiet` to inspect project shape.

<!-- generated:task-matrix:start -->

| When the agent is about to...                                     | Run                                                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| delete an "unused" export or file                                 | `fallow dead-code --trace <file>:<export>`                                           |
| delete an "unused" dependency                                     | `fallow dead-code --trace-dependency <name>`                                         |
| commit or open a PR                                               | `fallow audit --base <ref>`                                                          |
| prioritize refactoring                                            | `fallow health --hotspots --targets`                                                 |
| ask who owns code                                                 | `fallow health --ownership`                                                          |
| check untested-but-reachable code                                 | `fallow health --coverage-gaps`                                                      |
| consolidate duplication                                           | `fallow dupes --trace dup:<fingerprint>`                                             |
| find feature flags                                                | `fallow flags`                                                                       |
| check which architecture rules apply to a file before changing it | `fallow guard <files>`                                                               |
| surface security candidates                                       | `fallow security`                                                                    |
| understand a finding                                              | `fallow explain <issue-type>`                                                        |
| scope a monorepo                                                  | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command) |

<!-- generated:task-matrix:end -->

## Agent Rules

- Do not edit: `src-tauri/gen/`, `src-tauri/target/`, `dist/`, lockfiles by hand
- Always ask before: changing `src-tauri/capabilities/` or `tauri.conf.json` (OS permissions), force-pushing, or removing dependencies
- Preferred style: enforced by oxlint + oxfmt — run `npm run check`, don't argue with the tools

---

<!-- fallow:setup-hooks:start -->

## Fallow local gate

Before any `git commit` or `git push`, run `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before retrying. Treat JSON runtime errors like `{ "error": true, ... }` as non-blocking.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to...                                     | Run                                                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| delete an "unused" export or file                                 | `fallow dead-code --trace <file>:<export>`                                           |
| delete an "unused" dependency                                     | `fallow dead-code --trace-dependency <name>`                                         |
| commit or open a PR                                               | `fallow audit --base <ref>`                                                          |
| prioritize refactoring                                            | `fallow health --hotspots --targets`                                                 |
| ask who owns code                                                 | `fallow health --ownership`                                                          |
| check untested-but-reachable code                                 | `fallow health --coverage-gaps`                                                      |
| consolidate duplication                                           | `fallow dupes --trace dup:<fingerprint>`                                             |
| find feature flags                                                | `fallow flags`                                                                       |
| check which architecture rules apply to a file before changing it | `fallow guard <files>`                                                               |
| surface security candidates                                       | `fallow security`                                                                    |
| understand a finding                                              | `fallow explain <issue-type>`                                                        |
| scope a monorepo                                                  | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command) |

<!-- fallow:setup-hooks:end -->
