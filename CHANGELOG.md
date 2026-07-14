# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Open-source contribution, security, conduct, issue, and pull request guidance.
- Architecture, React, Vite, Next.js, target, and headless-hook guides.
- An evidence-labeled compatibility matrix and explicit product limitations.
- `PittiquitaNextPanel`, a route-aware Client Component for Next.js App Router.
- Dedicated unit coverage for the Next.js wrapper and Vite virtual module.

### Changed

- Made English the canonical repository README and preserved a complete Portuguese version.
- Reframed the first-visit documentation around the product problem, audience, workflow, trust boundary, and verifiable quality evidence.
- Declared Next.js and Vite as optional peer dependencies for their dedicated entry points.
- Made the Vite automatic mount idempotent and cleaned it up during hot-module replacement.

### Deprecated

- `withPittiquita()` is now an explicit compatibility identity wrapper. Use `PittiquitaNextPanel` instead; the previous helper never mounted the panel.

## Historical releases

The repository's current package manifest is `0.1.7`, but the local Git history only contains release tags for `v0.1.0` and `v0.1.1`. Changes for untagged versions `0.1.2` through `0.1.7` are intentionally not reconstructed here.

## [0.1.1] - 2026-04-18

### Added

- Project logo asset and expanded package documentation.

### Changed

- Updated the README logo URL to an absolute GitHub path for npm compatibility.
- Updated the package manifest version to `0.1.1`.

## [0.1.0] - 2026-04-18

### Added

- Initial npm package metadata for `pittiquita` version `0.1.0`.

[Unreleased]: https://github.com/pedronazarito98/pittiquita/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/pedronazarito98/pittiquita/tree/v0.1.1
[0.1.0]: https://github.com/pedronazarito98/pittiquita/tree/v0.1.0
