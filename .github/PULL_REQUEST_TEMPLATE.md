<!--
  Base branch by change type (see CONTRIBUTING → Branch Model):
    master → fixes, docs, chores, refactors, tests (patch / no version bump)
    dev    → new features that add public API            (minor)
    next   → breaking changes (BREAKING CHANGE: footer)  (major)
  Only master publishes; dev/next merge into master at the next minor/major cut.
-->

## Description

<!-- What does this change and why? Reference related issues (e.g. Closes #123). -->

## Base branch

- [ ] This PR targets the correct base for its change type:
  - [ ] `master` — fix / docs / chore / refactor / test (patch or no bump)
  - [ ] `dev` — new feature adding public API (minor)
  - [ ] `next` — breaking change (major)

## Checklist

- [ ] `pnpm changeset` added if this changes `packages/*` source
- [ ] `pnpm lint:fix`, `pnpm typecheck`, and `pnpm test:run` pass
- [ ] Docs/examples updated if public API changed
