# Guides

These guides expand the canonical [product README](../../README.md) without changing the package's compatibility claims.

## Start here

| Guide | Use it when |
| --- | --- |
| [Getting started](./getting-started.md) | You want the shortest verified path from installation to a URL ready for HTML to Design. |
| [React](./react.md) | You want manual mounting, labels, theme tokens, callbacks, or capture-script options. |
| [Vite](./vite.md) | You want serve-only automatic panel mounting. |
| [Next.js App Router](./nextjs.md) | You want the explicit Client Component integration and its current limitations. |
| [Targets and headless hooks](./targets-and-hooks.md) | You want named regions or a custom capture UI. |

## Before using capture

Read [SECURITY.md](../../SECURITY.md). Enabling capture loads a third-party script into the local page by default. Use sanitized development data and confirm that your Content Security Policy allows only the source you intend.

## Evidence labels

- **Tested baseline** means the behavior is covered by this repository's suite/build.
- **Implemented** means the behavior exists in source but lacks a dedicated framework integration test.
- **Documented path** means the public API supports the example, but the framework flow does not yet have end-to-end coverage here.

The compatibility matrix in the [main README](../../README.md#compatibility-and-evidence) is the source of truth.
