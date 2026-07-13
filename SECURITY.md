# Security policy

`pittiquita` is a development tool that runs inside a consumer's React page. Its main security boundary is the external capture script loaded when capture mode is active.

## Supported versions

The project is pre-1.0 and does not currently maintain an LTS matrix. Security fixes are evaluated against the current `main` branch and latest maintained package line. Older versions may not receive backports.

Check the repository and npm package before reporting to confirm the behavior still exists.

## Report a vulnerability privately

Do not open a public issue with exploit details, sensitive page content, tokens, or identifying information.

Preferred process:

1. Use [GitHub private vulnerability reporting](https://github.com/pedronazarito98/pittiquita/security/advisories/new).
2. Include the affected version/commit, environment, reproduction, impact, and the smallest safe proof of concept.
3. Remove credentials, cookies, real customer data, and private Figma file references.
4. If private reporting is unavailable, use the contact options on the [maintainer's GitHub profile](https://github.com/pedronazarito98) to arrange a private channel. Do not include vulnerability details in a public issue.

The maintainer will acknowledge reports as availability permits, investigate, and coordinate disclosure. No response or remediation SLA is promised today. Please allow time for a fix before public disclosure.

## Security model

### What the package does

- The prebuilt panel checks `window.location.hostname` after mount.
- Only exact `localhost` and `127.0.0.1` hostnames pass that check.
- Script injection also checks the accepted hostname and a hash containing `figmacapture=`.
- Activating capture changes the hash to `#figmacapture=manual` and injects one script element.
- Importing the package does not intentionally send a network request.
- The package has no pittiquita backend, account, authentication, analytics, or telemetry implementation.

### Primary trust boundary

By default, active capture loads:

```text
https://mcp.figma.com/mcp/html-to-design/capture.js
```

That is third-party code executing in the consumer page. It may inspect the rendered DOM and initiate behavior outside pittiquita's control. Review the page state and your organization's third-party-code policy before activation.

`pittiquita` does not guarantee the availability, contents, data handling, or conversion result of that external script or the independent HTML to Design plugin.

### The localhost guard is not authentication

The hostname restriction reduces accidental use on deployed hosts. It is not:

- user authentication or authorization;
- isolation from other code in the page;
- a browser sandbox;
- protection for sensitive data rendered in a local environment;
- proof that package code was removed from a production bundle.

Headless hooks and target helpers also require deliberate consumer integration. In particular, targets emit attributes wherever they are rendered and some hooks default to enabled.

## Privacy and local state

The package itself does not collect or upload analytics. It does interact with browser state:

| Data | Behavior |
| --- | --- |
| Current URL/hash | Capture activation writes the capture hash. The user manually copies the URL. |
| Rendered DOM | The external capture script can inspect it after activation. |
| Figma file URL/key | On the open action, the input is stored in `localStorage` under `figma-file-ref` by default. |
| Stored file reference | Panel reset does not delete it. Clear site storage manually or use a custom storage policy when required. |

Never render or capture:

- access/refresh tokens or API keys;
- real customer or employee personal data;
- production financial/health information;
- private credentials in URLs, DOM text, attributes, logs, or screenshots;
- confidential Figma file URLs when local storage retention is not acceptable.

Prefer fixtures, synthetic accounts, and sanitized development data.

## Content Security Policy and SRI

The panel and `useFigmaCapture()` accept:

- `scriptSrc` for a reviewed mirror or controlled source;
- `nonce` for nonce-based CSP;
- `integrity` for Subresource Integrity;
- `crossOrigin` as `anonymous` or `use-credentials`.

Example shape:

```tsx
<FigmaCapturePanel
  scriptSrc="https://assets.example.test/reviewed-capture.js"
  nonce={cspNonce}
  integrity="sha384-your-reviewed-digest"
  crossOrigin="anonymous"
/>
```

The URL and digest above are placeholders. The package does not ship a pinned digest for the default script. Consumers that override the source own its review, hosting security, CSP directive, integrity lifecycle, and incident response.

Avoid `crossOrigin="use-credentials"` unless the reviewed source explicitly requires credentialed requests and your threat model permits them.

## Scope for security reports

Examples that are in scope:

- bypass of the implemented hostname/hash checks leading to unintended script injection;
- unintended network transmission by package-owned code;
- unsafe URL/file-key handling in package-owned behavior;
- credential leakage caused by the demo automation or repository workflows;
- dependency or build-chain issues with a plausible impact on consumers;
- CSP/SRI options not being applied as documented.

Examples usually outside pittiquita's control:

- vulnerabilities only in Figma or the HTML to Design service/plugin;
- conversion fidelity issues without a security impact;
- a host application intentionally rendering secrets;
- custom `scriptSrc` code operated by a consumer;
- expected browser behavior after a user opens a Figma URL.

Report upstream issues to the responsible project, while including a private pittiquita report if package behavior materially contributes.

## Maintainer response

When a report is accepted, the maintainer will aim to:

1. reproduce and classify the issue;
2. minimize unnecessary access to submitted data;
3. prepare a focused fix and regression coverage;
4. document affected versions and mitigations;
5. coordinate release/disclosure without exposing reporters or users.

Security releases and user-visible mitigations should be recorded in [CHANGELOG.md](./CHANGELOG.md).
