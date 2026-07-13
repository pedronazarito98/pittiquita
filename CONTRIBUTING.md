# Contributing to pittiquita

Thank you for improving `pittiquita`. Contributions should keep the package focused: a small development tool that prepares live local React UI for the independent HTML to Design workflow.

By participating, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md). Report vulnerabilities through [SECURITY.md](./SECURITY.md), not a public issue.

## Before opening code

For a bug or feature, first search [existing issues](https://github.com/pedronazarito98/pittiquita/issues). Open a focused issue when the behavior, API, or scope needs agreement. Small documentation fixes can go directly to a pull request.

Good proposals explain:

- the user problem;
- why it belongs in pittiquita rather than HTML to Design, Figma, or the host application;
- the expected public API and compatibility impact;
- how the behavior will be verified;
- security/privacy implications.

## Requirements

- Git.
- Node.js 20 or newer is recommended for repository development; CI runs Node 20 and publishing runs Node 22.
- pnpm 10, matching the repository workflows.
- Chromium through Playwright only when regenerating the visual demo.

The package manifest declares Node `>=18` for consumers. That consumer range should not be confused with the current repository toolchain used by Vite, Vitest, TypeScript, and CI.

## Set up the repository

```bash
git clone https://github.com/pedronazarito98/pittiquita.git
cd pittiquita
pnpm install --frozen-lockfile
pnpm build
```

Install the playground separately when the change needs a browser or demo check:

```bash
pnpm --dir playground install --frozen-lockfile
pnpm --dir playground build
```

The playground consumes the parent package through `link:..`, so build the package before validating it.

## Repository map

| Path | Responsibility |
| --- | --- |
| `src/core/` | Browser guards, hooks, capture/region/file utilities, and shared types. |
| `src/react/` | Panel, target APIs, UI slots, and inline styling. |
| `src/vite/` | Serve-only Vite plugin. |
| `src/next/` | Next config entry point; it does not mount UI today. |
| `tests/` | Vitest/jsdom tests mirroring `src/`. |
| `playground/` | Linked Vite consumer used for manual/demo checks. |
| `scripts/` | Demo automation. |
| `docs/` | Product, architecture, framework, and demo documentation. |

Read [Architecture and trust boundaries](./docs/architecture/overview.md) before changing a public surface.

## Development scripts

| Command | What it verifies |
| --- | --- |
| `pnpm lint` | ESLint over `src/`. |
| `pnpm test:run` | Full Vitest suite once. |
| `pnpm test` | Vitest watch mode. |
| `pnpm typecheck` | TypeScript without emit. |
| `pnpm build` | ESM, CommonJS, and declaration outputs through `tsup`. |
| `pnpm validate` | lint, tests, typecheck, and build. |
| `pnpm pack:check` | Build plus `npm pack --dry-run`. |
| `pnpm --dir playground dev` | Manual browser validation. |
| `pnpm --dir playground build` | Playground production build. |
| `pnpm demo:capture` | Regenerate the four PNG screenshots only. |
| `pnpm demo:record` | Regenerate PNG, WebM, and GIF artifacts, then validate them. |
| `pnpm demo:check` | Decode/probe all versioned artifacts and enforce dimensions, duration, codec, and size budgets. |

Run the smallest useful checks while iterating and the complete relevant gate before requesting review.

## Make a change

1. Create a focused branch from the current `main`.
2. Map the existing API/tests before editing.
3. Keep core behavior in `src/core/` and prebuilt UI in `src/react/`.
4. Preserve the four public entry points unless a reviewed change explicitly alters the package contract.
5. Keep browser work behind the appropriate client/local/development guard.
6. Add or update tests at the same abstraction level as the behavior.
7. Update English canonical docs and the Portuguese overview when product behavior changes.
8. Run the relevant validation matrix.

Avoid drive-by refactors, dependency additions without a concrete need, and version changes in ordinary feature/fix PRs.

## Tests

The integrated reproducible-demo baseline is 82 tests across 11 files. The verified baseline before the two demo test files was 58 across 9. Treat these counts as an inventory, not a target to game.

- Put utility tests under `tests/core/utils/`.
- Put hook tests under `tests/core/hooks/`.
- Put component tests under `tests/react/`.
- Put demo automation/artifact tests under `tests/demo/`.
- Test observable behavior and cleanup, not implementation trivia.
- Do not weaken assertions or rewrite tests only to hide a regression.
- When a framework claim changes, prefer a focused fixture/integration test over an unverified README promise.

At minimum, code changes normally require:

```bash
pnpm lint
pnpm test:run
pnpm typecheck
pnpm build
```

Changes to exports or package metadata also require:

```bash
pnpm pack:check
```

Visual/playground changes also require:

```bash
pnpm --dir playground build
pnpm demo:check
```

## Regenerate the visual demo

The full media workflow is Playwright/ffmpeg-driven. It requires Chromium plus `ffmpeg` and `ffprobe` 6 or newer on `PATH`:

```bash
pnpm build
pnpm --dir playground install --frozen-lockfile
pnpm exec playwright install chromium
pnpm demo:record
pnpm demo:check
```

To regenerate only the screenshots:

```bash
pnpm demo:capture
```

`demo:record` writes the WebM, converts the same sequence to GIF, regenerates the screenshots, and runs the validator. `demo:check` verifies all six versioned files. Review every generated artifact. The final Figma/HTML to Design screen is intentionally an illustrative local mock and must remain labeled as such. Never include credentials, private files, customer data, or an authenticated Figma session.

The demo-specific [English](./docs/demo/README.en.md) and [Portuguese](./docs/demo/README.md) notes are the source of truth for generated artifact names.

## Documentation rules

- `README.md` is the canonical English overview.
- `docs/README.pt-BR.md` is the complete Portuguese overview.
- `docs/README.en.md` is a stable redirect for historical links.
- Separate **tested**, **implemented**, and **documented** compatibility claims.
- Use examples that compile against public exports.
- Do not imply an official Figma partnership or a real import when evidence is a mock.
- Keep external-script and sensitive-data warnings near capture instructions.
- Check relative files and heading anchors before review.

## Commit convention

Use small, coherent commits with a Conventional Commits-style prefix. Repository work is currently described in Portuguese:

```text
feat(capture): adiciona comportamento focado
fix(regions): corrige atualização após navegação
test(capture): cobre cleanup do listener
docs(pittiquita): esclarece limite de compatibilidade
```

Do not combine generated demo media, runtime changes, and unrelated documentation cleanup in one commit.

## Pull requests

Use the pull request template and include:

- problem and scope;
- solution and important decisions;
- public API/compatibility impact;
- security/privacy analysis;
- validation commands with actual results;
- visual evidence when UI/demo output changed;
- risks and rollback.

Keep the PR reviewable. A reviewer should be able to connect each claim to code, a test, generated evidence, or an explicitly labeled limitation.

## Definition of Done

A contribution is ready for human review when:

- the change is focused and no unrelated files were modified;
- public APIs and framework claims match the implementation;
- tests cover new behavior and all relevant existing tests pass;
- lint, typecheck, build, and pack/playground gates pass where applicable;
- English and Portuguese product docs remain consistent for user-facing behavior;
- security/privacy and external-script boundaries are documented;
- generated media is reproducible, legible, and honestly labeled;
- local links and examples have been checked;
- `git diff --check`, a dangerous-change scan, and `git status --short` are clean/understood;
- no package publication, release tag, credential, or unrelated version bump is included.

Reviewers can use the [maintainer checklist](./docs/contributing/review-checklist.md).
