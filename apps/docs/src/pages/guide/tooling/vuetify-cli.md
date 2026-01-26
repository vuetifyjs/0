---
title: Vuetify CLI - Project Scaffolding & Management
features:
  label: Vuetify CLI
  order: 1
  level: 1
meta:
  - name: description
    content: Scaffold and manage v0 projects with the official CLI. Create new projects, update dependencies, and analyze usage.
  - name: keywords
    content: vuetify cli, create-vuetify0, scaffolding, project generator, vuetify update, v0
related:
  - /guide/tooling/ai-tools
  - /guide/tooling/vuetify-mcp
  - /guide/integration/nuxt
logo: vcli
---

# Vuetify CLI

The Vuetify CLI is a tooling ecosystem for scaffolding and managing Vuetify projects. It provides interactive project generation, intelligent dependency updates, and codebase analysis.

<DocsPageFeatures :frontmatter />

## Packages

| Package | Binary | Purpose |
| - | - | - |
| [@vuetify/cli](https://www.npmjs.com/package/@vuetify/cli) | `vuetify` | Full CLI with all commands |
| [create-vuetify0](https://www.npmjs.com/package/create-vuetify0) | `create-vuetify0` | Scaffold [v0](/introduction/getting-started) projects |

## Quick Start

Create a new v0 project with the interactive wizard:

::: code-group no-filename

```bash pnpm
pnpm create vuetify0
```

```bash npm
npm create vuetify0
```

```bash yarn
yarn create vuetify0
```

```bash bun
bun create vuetify0
```

:::

## Commands

| Command | Description |
| - | - |
| `vuetify init` | Initialize a new project |
| `vuetify add eslint` | Add ESLint with Vuetify config |
| `vuetify add mcp` | Add MCP server configuration |
| `vuetify update` | Update Vuetify packages |
| `vuetify docs` | Open version-specific documentation |
| `vuetify analyze` | Scan codebase for usage patterns |
| `vuetify upgrade` | Self-upgrade the CLI |

### init

Initialize a new project (wrapper around `create-vuetify0`):

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/cli init my-app
```

```bash npm
npx @vuetify/cli init my-app
```

```bash yarn
yarn dlx @vuetify/cli init my-app
```

```bash bun
bunx @vuetify/cli init my-app
```

:::

### add

Add integrations to existing projects:

::: code-group no-filename

```bash pnpm
# Add ESLint with Vuetify config
pnpm dlx @vuetify/cli add eslint

# Add MCP server configuration
pnpm dlx @vuetify/cli add mcp
```

```bash npm
# Add ESLint with Vuetify config
npx @vuetify/cli add eslint

# Add MCP server configuration
npx @vuetify/cli add mcp
```

```bash yarn
# Add ESLint with Vuetify config
yarn dlx @vuetify/cli add eslint

# Add MCP server configuration
yarn dlx @vuetify/cli add mcp
```

```bash bun
# Add ESLint with Vuetify config
bunx @vuetify/cli add eslint

# Add MCP server configuration
bunx @vuetify/cli add mcp
```

:::

> [!TIP]
> The `add mcp` command configures [Vuetify MCP](/guide/tooling/vuetify-mcp) for your IDE automatically.

### update

Update all Vuetify packages to their latest versions:

::: code-group no-filename

```bash pnpm
# Update to latest stable
pnpm dlx @vuetify/cli update

# Update to nightly builds
pnpm dlx @vuetify/cli update --nightly
```

```bash npm
npx @vuetify/cli update
npx @vuetify/cli update --nightly
```

```bash yarn
yarn dlx @vuetify/cli update
yarn dlx @vuetify/cli update --nightly
```

```bash bun
bunx @vuetify/cli update
bunx @vuetify/cli update --nightly
```

:::

The update command auto-detects and updates:

- `vuetify`
- `@vuetify/*` packages
- `vuetify-nuxt-module`
- `vite-plugin-vuetify`
- `eslint-plugin-vuetify`

### docs

Open version-specific Vuetify documentation:

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/cli docs
```

```bash npm
npx @vuetify/cli docs
```

```bash yarn
yarn dlx @vuetify/cli docs
```

```bash bun
bunx @vuetify/cli docs
```

:::

> [!INFO]
> The CLI auto-detects your installed Vuetify version and opens the correct documentation site.

### analyze

Scan your codebase for Vuetify usage patterns:

::: code-group no-filename

```bash pnpm
# Console output
pnpm dlx @vuetify/cli analyze

# JSON output for tooling
pnpm dlx @vuetify/cli analyze --reporter json
```

```bash npm
npx @vuetify/cli analyze
npx @vuetify/cli analyze --reporter json
```

```bash yarn
yarn dlx @vuetify/cli analyze
yarn dlx @vuetify/cli analyze --reporter json
```

```bash bun
bunx @vuetify/cli analyze
bunx @vuetify/cli analyze --reporter json
```

:::

The analyzer detects imports of:

- Components (`VBtn`, `VCard`, etc.)
- Composables (`useDisplay`, `useTheme`, etc.)
- Types and utilities

> [!ASKAI] How can I use the analyze command to plan a Vuetify migration?

### upgrade

Self-upgrade the CLI to the latest version:

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/cli upgrade
```

```bash npm
npx @vuetify/cli upgrade
```

```bash yarn
yarn dlx @vuetify/cli upgrade
```

```bash bun
bunx @vuetify/cli upgrade
```

:::

## Scaffolding Options

The interactive wizard guides you through project configuration:

| Step | Options |
| - | - |
| Project Name | Your project directory name |
| Platform | [Vue](https://vuejs.org) + [Vite](https://vite.dev), [Nuxt](https://nuxt.com) |
| CSS Framework | [UnoCSS](https://unocss.dev), [Tailwind](https://tailwindcss.com), None |
| TypeScript | Yes, No |
| Router (Vue only) | [Vue Router](https://router.vuejs.org), File-based, None |
| Features | ESLint, [Pinia](https://pinia.vuejs.org), [i18n](https://vue-i18n.intlify.dev), MCP, Nuxt Module |

### Platforms

| Platform | Description |
| - | - |
| Vue + Vite | Standard Vue 3 SPA with [Vite](https://vite.dev) |
| Nuxt | [Nuxt 3/4](https://nuxt.com) with SSR/SSG support |

### CSS Frameworks

| Framework | Description |
| - | - |
| [UnoCSS](https://unocss.dev) | Instant atomic CSS engine |
| [Tailwind](https://tailwindcss.com) | Utility-first CSS |
| None | No CSS framework |

### Router Options (Vue only)

| Option | Description |
| - | - |
| [Vue Router](https://router.vuejs.org) | Standard routing |
| File-based | Auto-generated routes from file structure |
| None | No routing |

### Features

| Feature | Description |
| - | - |
| ESLint | [Vuetify ESLint config](https://github.com/vuetifyjs/eslint-config-vuetify) |
| [Pinia](https://pinia.vuejs.org) | State management |
| [i18n](https://vue-i18n.intlify.dev) | Internationalization |
| MCP | [Vuetify MCP](/guide/tooling/vuetify-mcp) server config |
| Nuxt Module | [vuetify-nuxt-module](https://github.com/userquin/vuetify-nuxt-module) (Nuxt only) |

## Non-Interactive Mode

For CI/CD pipelines and automation, pass arguments directly:

::: code-group no-filename

```bash pnpm
pnpm create vuetify0 my-app \
  --platform vue \
  --css unocss \
  --typescript \
  --router router \
  --features eslint,pinia \
  --package-manager pnpm \
  --install
```

```bash npm
npm create vuetify0 my-app -- \
  --platform vue \
  --css unocss \
  --typescript \
  --router router \
  --features eslint,pinia \
  --package-manager npm \
  --install
```

```bash yarn
yarn create vuetify0 my-app \
  --platform vue \
  --css unocss \
  --typescript \
  --router router \
  --features eslint,pinia \
  --package-manager yarn \
  --install
```

```bash bun
bun create vuetify0 my-app \
  --platform vue \
  --css unocss \
  --typescript \
  --router router \
  --features eslint,pinia \
  --package-manager bun \
  --install
```

:::

### All Arguments

| Argument | Values | Description |
| - | - | - |
| `--platform` | `vue`, `nuxt` | Target platform |
| `--css` | `unocss`, `tailwindcss`, `none` | CSS framework |
| `--typescript` | flag | Enable TypeScript |
| `--router` | `router`, `file-router`, `none` | Router type (Vue only) |
| `--features` | comma-separated | Features to include |
| `--package-manager` | `pnpm`, `npm`, `yarn`, `bun` | Package manager |
| `--install` | flag | Auto-install dependencies |
| `--force` | flag | Overwrite existing directory |

> [!WARNING]
> The `--force` flag will overwrite existing files without confirmation.
