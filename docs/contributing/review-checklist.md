# Maintainer review checklist

Use this checklist for focused human or independent-agent review. Record concrete findings; a bare “looks good” is not evidence.

## Scope and repository safety

- [ ] The diff matches the issue/PR scope and ownership boundaries.
- [ ] No credential, `.env`, private URL, customer data, or unexpected generated file is present.
- [ ] No destructive command, permission change, unrelated deletion, package publication, or surprise version bump is included.
- [ ] Dependency changes are necessary, explained, and represented in the lockfile.

## Product and API

- [ ] The user problem and resulting behavior are understandable before implementation details.
- [ ] Public exports remain compatible or the change is explicitly reviewed as an API change.
- [ ] The four current entry points remain accurate in `package.json`, `tsup.config.ts`, docs, and package output.
- [ ] Vite behavior distinguishes serve-only injection from manual React usage.
- [ ] Next.js documentation does not claim that `withPittiquita()` mounts UI.
- [ ] No text implies an official Figma partnership or that pittiquita performs the final conversion.

## Runtime boundaries

- [ ] Browser APIs are behind a client/effect guard where required.
- [ ] Local-origin claims list only `localhost` and `127.0.0.1` unless code/tests changed.
- [ ] Production claims distinguish hidden runtime UI from bundle-byte exclusion.
- [ ] Headless hooks and target markup document the consumer-owned guard.
- [ ] Hash-router behavior and any URL mutation are considered.

## Security and privacy

- [ ] External-script loading conditions and source are accurate.
- [ ] Sensitive-data guidance is present near capture instructions.
- [ ] CSP/SRI/custom-script claims match the actual props/utilities.
- [ ] `localStorage` retention and file-reference behavior are not misrepresented.
- [ ] Vulnerability details are not placed in public issues or fixtures.

## Tests and builds

- [ ] New behavior has focused tests at the right level.
- [ ] Existing assertions were not weakened to hide a regression.
- [ ] `pnpm lint`, `pnpm test:run`, `pnpm typecheck`, and `pnpm build` passed.
- [ ] `pnpm pack:check` passed for exports/package changes.
- [ ] `pnpm --dir playground build` and a manual check passed for playground/visual behavior.
- [ ] Reported test counts and package metrics come from command output, not estimates.

## Documentation and demo

- [ ] English canonical and Portuguese product overviews agree on user-facing behavior.
- [ ] Compatibility claims are labeled tested, implemented, or documented.
- [ ] Code examples use real public exports and correct client boundaries.
- [ ] Relative links and internal anchors resolve.
- [ ] Generated screenshots/video/GIF were reproduced through documented automation.
- [ ] The final Figma step remains clearly labeled as an illustrative local mock unless a real, auditable import was performed.
- [ ] Media is readable, contains no private data, and stays within documented budgets.

## Review outcome

Record:

- blocking findings;
- non-blocking follow-ups;
- commands/evidence inspected;
- explicit `GO` or `NO-GO` with rationale.
