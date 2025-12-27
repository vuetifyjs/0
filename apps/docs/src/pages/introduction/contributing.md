---
title: Contributing to Vuetify0 - Developer Guidelines
meta:
  - name: description
    content: Learn how to contribute to Vuetify0. Setup local development, submit pull requests, write tests, and follow coding conventions for Vue 3 composables.
  - name: keywords
    content: vuetify0, contributing, open source, pull request, development, testing, Vue 3
related:
  - /introduction/getting-started
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
- A minimal reproduction (preferably a link to a repo or CodeSandbox)

### Feature Requests

For new features:

- Check if it's already been requested in [issues](https://github.com/vuetifyjs/0/issues)
- Explain the use case and why it would benefit others
- Consider if it fits the headless/composable philosophy of Vuetify0

## Local Development

### Prerequisites

- Node.js 20.19+ or 22+
- pnpm 10.6+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/vuetifyjs/0.git
cd 0

# Install dependencies
pnpm install

# Start the playground
pnpm dev

# Start the docs site
pnpm dev:docs
```

### Project Structure

```text
├── packages/
│   └── 0/              # @vuetify/v0 - main package
│       ├── src/
│       │   ├── components/    # Vue components
│       │   ├── composables/   # Composable functions
│       │   ├── utilities/     # Helper functions
│       │   └── types/         # TypeScript types
├── apps/
│   ├── docs/           # Documentation site
│   └── storybook/      # Storybook stories
└── playground/         # Development playground
```

### Useful Commands

```bash
# Development
pnpm dev              # Start playground
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
3. Run `pnpm lint:fix` to fix formatting
4. Run `pnpm typecheck` to check types
5. Run `pnpm test:run` to verify tests pass
6. Write tests for new functionality

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

### Examples

```bash
feat(useSelection): add toggle method
fix(ExpansionPanel): correct aria-expanded state
docs(getting-started): update installation instructions
refactor(useRegistry): simplify reindex logic
test(useForm): add validation edge cases
```

### Guidelines

- Use imperative mood ("add" not "added")
- Keep the subject under 60 characters
- Don't end with a period
- Reference issues when applicable: `fix(useForm): validation error (#123)`

## Code Style

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
describe('useSelection', () => {
  it('should select an item', () => {
    // ...
  })

  it('should respect mandatory option', () => {
    // ...
  })
})
```

## Questions?

- [Discord](https://community.vuetifyjs.com) - Real-time chat and questions
- [GitHub Issues](https://github.com/vuetifyjs/0/issues) - Bug reports and feature requests

Thank you for contributing!

<DocsRelated :frontmatter />
