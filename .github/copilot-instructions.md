
# Copilot Instructions for AI Agents

## Project Overview
- **Monorepo** for Vue 3 headless UI primitives and composables.
- Main package: `@vuetify/v0` (unstyled, logic-focused components and composables in `packages/0/`)
- **Playground** (`playground/`): Interactive testbed for components.
- **Docs** (`apps/docs/`): Documentation site source.
- **Storybook** (`apps/storybook/`): Component stories and visual tests.

## Architecture & Patterns
- **Headless First**: Components provide logic and accessibility, not styles.
- **Slot-Driven**: Components maximize flexibility via slots.
- **CSS Variables**: All styling is via `--v0-*` custom properties.
- **TypeScript Native**: All code is fully typed.
- **Minimal Dependencies**: Only essential packages used.
- **No global state**: All state is local or context-based.
- **Composable logic**: Use composables for reusable logic (see `src/composables/`).
- **Prop-driven**: Components are configured via props and CSS vars, not hardcoded logic.

## Developer Workflows
- **Install**: `pnpm install`
- **Dev playground**: `pnpm dev`
- **Dev docs**: `pnpm dev:docs`
- **Storybook**: `pnpm storybook`
- **Build all**: `pnpm build`
- **Build docs**: `pnpm build:docs`
- **Test**: `pnpm test` or `pnpm test:ui`
- **Coverage**: `pnpm coverage`
- **Lint**: `pnpm lint`
- **Type check**: `pnpm type-check`

## Project Conventions
- **Component files**: One component per file, named in PascalCase.
- **Composables**: Named `useX` and live in `composables/`.
- **No direct DOM manipulation**: Use Vue refs and composables.
- **All styling via CSS variables**: Never hardcode colors, spacing, etc.
- **Tests**: Use Vitest, colocated in `__tests__` or `*.spec.ts` files.
- **Docs**: Written in Markdown in `apps/docs/pages/`.

## Integration Points
- **Theme system**: Use `createThemePlugin` and `useTheme` for theming.
- **Context**: Use `createContext`/`useContext` for dependency injection.
- **Playground**: For rapid prototyping, add examples to `playground/src/`.
- **Storybook**: Add stories in `apps/storybook/stories/`.

## Key Files & Directories
- `packages/0/`: Core source code
- `playground/`: Interactive testbed
- `apps/docs/`: Documentation site
- `apps/storybook/`: Storybook stories
- `pnpm-workspace.yaml`: Monorepo package management
- `vitest.config.ts`: Test runner config
- `uno.config.ts`: UnoCSS config (utility-first CSS)

## Examples
- See `README.md` and package README for usage patterns and code samples.
- Example theme setup and component usage in root `README.md`.

---
For new patterns, follow the headless, composable, and CSS variable-driven approach. When in doubt, check existing components and composables for style and structure.
