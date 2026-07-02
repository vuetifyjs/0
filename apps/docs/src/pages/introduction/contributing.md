---
title: Contributing to Vuetify0 - Developer Guidelines
meta:
  - name: description
    content: Learn how to contribute to Vuetify0. Setup local development, submit pull requests, write tests, and follow coding conventions for Vue 3 composables.
  - name: keywords
    content: vuetify0, contributing, open source, pull request, development, testing, Vue 3
features:
  order: 3.5
  level: 1
related:
  - /introduction/getting-started
  - /introduction/code-of-conduct
---

# Contributing

Thank you for your interest in contributing to Vuetify0! This guide will help you get started.

<DocsPageFeatures :frontmatter />

## Getting Started

Before contributing, please:

1. Read the [Getting Started](/introduction/getting-started) guide to understand the project
2. Review existing [issues](https://github.com/vuetifyjs/0/issues)
3. Join our [Discord community](https://community.vuetifyjs.com) for questions

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- A minimal reproduction (preferably a [Playground](/playground) link or a repo)

### Feature Requests

For new features:

- Check if it's already been requested in [issues](https://github.com/vuetifyjs/0/issues)
- Explain the use case and why it would benefit others
- Consider if it fits the [headless/composable philosophy](https://github.com/vuetifyjs/0/blob/master/packages/0/PHILOSOPHY.md) of Vuetify0

## Local Development

### Prerequisites

- Node 26+ (matches .nvmrc)
- pnpm 10.6+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/vuetifyjs/0.git
cd 0

# Install dependencies
pnpm install

# Start the dev environment
pnpm dev

# Start the docs site
pnpm dev:docs
```

### Project Structure

```text
├── packages/
│   ├── 0/              # @vuetify/v0 - main package
│   │   └── src/
│   │       ├── components/    # Vue components
│   │       ├── composables/   # Composable functions
│   │       ├── utilities/     # Helper functions
│   │       └── types/         # TypeScript types
│   ├── genesis/        # @paper/genesis - design system
│   └── paper/          # @vuetify/paper - styling primitives
├── apps/
│   ├── docs/           # Documentation site
│   └── playground/     # Browser-based code editor
└── dev/               # Development environment
```

### Useful Commands

```bash
# Development
pnpm dev              # Start dev environment
pnpm dev:docs         # Start docs site

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once

# Type checking
pnpm typecheck        # Check all packages

# Linting
pnpm lint             # Lint codebase
pnpm lint:fix         # Auto-fix lint issues

# Building
pnpm build            # Build packages
```

## Pull Requests

### Before Submitting

1. Create a new branch from `master`
2. Make your changes
3. Write tests for new functionality
4. Run `pnpm lint:fix` to fix formatting
5. Run `pnpm typecheck` to check types
6. Run `pnpm test:run` to verify tests pass
7. Run `pnpm repo:check` to catch unused files and dependency issues
8. Run `pnpm changeset` if you changed `packages/*` source (see [Changesets](#changesets))

The pre-push hook runs lint, typecheck, tests, and repo checks automatically — the steps above keep it green.

### Changesets

Releases are managed with [Changesets](https://github.com/changesets/changesets). If your PR changes published source under `packages/*`, add a changeset so the change lands in the next release's version bump and changelog:

```bash
pnpm changeset
```

Pick the affected package(s), a bump type (`patch`/`minor`/`major`), and a short summary, then commit the generated `.changeset/*.md` alongside your code. `@vuetify/v0` and `@vuetify/paper` version in lockstep — selecting `@vuetify/v0` carries `@vuetify/paper` automatically; the `@paper/*` design systems version separately. Docs-only, chore, refactor, or CI PRs don't need one. A bot comments on every PR to remind you.

### PR Guidelines

- Keep PRs focused - one feature or fix per PR
- Write a clear title and description
- Reference any related issues
- Be responsive to feedback

### Branch Naming

Use descriptive branch names:

- `fix/issue-description` - Bug fixes
- `feat/feature-name` - New features
- `docs/what-changed` - Documentation updates
- `refactor/what-changed` - Code refactoring

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```text
type(scope): subject
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

`feat` and `fix` are reserved for changes to `packages/*` source — they drive changelogs and version bumps. Everything else (docs, apps, tooling, CI) uses `docs`, `chore`, `refactor`, or `test`.

### Examples

```bash
feat(createSelection): add toggle method
fix(ExpansionPanel): correct aria-expanded state
docs(getting-started): update installation instructions
refactor(createRegistry): simplify reindex logic
test(useForm): add validation edge cases
```

### Guidelines

- Use imperative mood ("add" not "added")
- Keep the subject under 60 characters
- Don't end with a period
- Reference issues when applicable: `fix(useForm): validation error (#123)`

## Code Style

The sections below are a summary. The design contract behind them — axioms, return-shape conventions, reactivity rules — lives in [PHILOSOPHY.md](https://github.com/vuetifyjs/0/blob/master/packages/0/PHILOSOPHY.md), with detailed per-scope playbooks in [.claude/rules](https://github.com/vuetifyjs/0/tree/master/.claude/rules).

### General

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Prefer `function` declarations over `const` arrow functions
- Use single-word variable names when clear
- Add JSDoc comments for public APIs

### Composables

- Place in `packages/0/src/composables/`
- Each composable in its own directory with `index.ts`
- Include `@module` JSDoc block at the top
- Colocate tests as `index.test.ts`
- Export both standalone and context-creation functions

### Components

- Follow the compound component pattern (Root/Item)
- Extend `AtomProps` for polymorphic components
- Use `useProxyModel` for v-model binding
- Include proper ARIA attributes

## Testing

- Write tests for new composables and components
- Focus on behavior, not implementation details
- Test edge cases and error conditions
- Use `describe` blocks to organize related tests

```ts
describe('createSelection', () => {
  it('should select an item', () => {
    // ...
  })

  it('should respect mandatory option', () => {
    // ...
  })
})
```

## Skillz Feedback

[Vuetify0 Skillz](/skillz) is our interactive tutorial system currently in beta. We're actively developing new content and improving the learning experience.

### How to Give Feedback

- **Content issues**: Typos, unclear instructions, or incorrect examples
- **Technical problems**: Bugs in the interactive editor or validation
- **Suggestions**: New skill ideas or improvements to existing ones

When reporting issues, please include:

- The skill name and step number
- What you expected vs what happened
- Browser and OS information

> [!DISCORD]

Thank you for contributing!
