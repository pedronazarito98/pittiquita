# Repository Guidelines

## Project Structure & Module Organization
This directory is a Vite + React playground for the local `pittiquita` package linked from `..`.

- `src/App.tsx`: main demo surface for `FigmaTarget`, `figmaTarget()`, and `FigmaCapturePanel`.
- `src/main.tsx`: React bootstrap entrypoint.
- `vite.config.ts`: Vite setup with `@vitejs/plugin-react` and `pittiquita/vite`.
- `dist/`: generated build output. Do not edit by hand.

If a change depends on library internals, inspect the parent package in `../src` and its tests in `../tests`.

## Build, Test, and Development Commands
- `pnpm install`: install playground dependencies.
- `pnpm dev`: start the playground locally with Vite for manual verification.
- `pnpm build`: create a production bundle in `dist/`; use this as the main pre-PR check.
- `pnpm --dir .. dev`: rebuild the linked `pittiquita` package in watch mode while iterating on the parent library.
- `pnpm --dir .. test:run`: run the parent package test suite when playground changes depend on library behavior.

## Coding Style & Naming Conventions
Use TypeScript function components and keep the existing file style consistent: 2-space indentation, single quotes, and no semicolons.

- Use `PascalCase` for React components and exported types.
- Use `camelCase` for variables, helpers, and event handlers.
- Use descriptive kebab-case strings for Figma target IDs, for example `hero-section` or `dynamic-section`.
- Prefer small, readable demo sections instead of deeply nested JSX blocks.

## Testing Guidelines
This playground has no dedicated automated test suite today. Minimum validation is:

- Run `pnpm build` successfully.
- Smoke-test the relevant UI flow in `pnpm dev`.
- If you changed the linked library contract, also run `pnpm --dir .. test:run`.

If tests are added later, prefer Vitest-style names such as `ComponentName.test.tsx`.

## Commit & Pull Request Guidelines
No useful commit history is available yet in this package, so follow standard conventional hygiene: short imperative subjects with clear scope, such as `playground: add nested target example`.

- Describe the scenario the playground demonstrates or fixes.
- Link related issues when applicable.
- Include screenshots or a short recording for visible UI changes.
- Call out any required changes in the parent `pittiquita` package.

## Security & Configuration Tips
Do not commit secrets, `.env` files, or machine-specific paths. Keep the local dependency as `pittiquita: "link:.."` unless the repository structure is intentionally changing.
