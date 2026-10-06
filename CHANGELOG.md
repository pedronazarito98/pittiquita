# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-06

### Added

- A bundled Pittiquita skill with focused React/Vite, Next.js, Storybook, capture-target, and troubleshooting references for agents working in consumer projects.
- An opt-in `pittiquita agents init` CLI with dry-run support, idempotent installation, and preservation of existing project instructions and customized skills.
- `pittiquita/storybook`: a React preview decorator with automatic story regions, per-story options, localhost/development guards, and a panel portal outside the story layout.
- A Storybook playground with Controls, light/dark stories, opt-out examples, and typecheck/static-build CI steps.
- A Storybook guide covering iframe capture URLs, Docs, production gating, and avoiding duplicate Vite mounts.
- Open-source contribution, security, conduct, issue, and pull request guidance.
- Architecture, React, Vite, Next.js, target, and headless-hook guides.
- An evidence-labeled compatibility matrix and explicit product limitations.
- `PittiquitaNextPanel`, a route-aware Client Component for Next.js App Router.
- Dedicated unit coverage for the Next.js wrapper and Vite virtual module.

### Changed

- Next.js examples now establish the client boundary in a small consumer component, because the current package build does not preserve the source directive.
- Aligned the canonical Portuguese README, detailed Portuguese overview, and English framework guides with the current package APIs and release workflow.
- Reframed the first-visit documentation around the product problem, audience, workflow, trust boundary, and verifiable quality evidence.
- Made the Vite automatic mount idempotent and cleaned it up during hot-module replacement.

### Deprecated

- `withPittiquita()` is now an explicit compatibility identity wrapper. Use `PittiquitaNextPanel` instead; the previous helper never mounted the panel.

## Historical releases

Before `0.2.0`, npm contained versions `0.1.0` through `0.1.7`, while the repository only had release tags for `v0.1.0` and `v0.1.1`. Changes for untagged versions `0.1.2` through `0.1.7` are intentionally not reconstructed here. The `0.2.0` notes include the previously unreleased repository changes.

## [0.1.1] - 2026-04-18

### Added

- Project logo asset and expanded package documentation.

### Changed

- Updated the README logo URL to an absolute GitHub path for npm compatibility.
- Updated the package manifest version to `0.1.1`.

## [0.1.0] - 2026-04-18

### Added

- Initial npm package metadata for `pittiquita` version `0.1.0`.

[Unreleased]: https://github.com/pedronazarito98/pittiquita/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/pedronazarito98/pittiquita/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/pedronazarito98/pittiquita/tree/v0.1.1
[0.1.0]: https://github.com/pedronazarito98/pittiquita/tree/v0.1.0
