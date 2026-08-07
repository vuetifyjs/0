---
title: Vuetify CLI - Project Scaffolding & Management
features:
  label: Vuetify CLI
  order: 2
  level: 1
meta:
  - name: description
    content: Scaffold v0 projects, seed components from the docs registry with vuetify add, and manage local component libraries.
  - name: keywords
    content: vuetify cli, create-vuetify0, vuetify add, registry, vuetify.json, scaffolding, component library, v0
related:
  - /guide/tooling/ai-tools
  - /guide/tooling/vuetify-mcp
  - /guide/fundamentals/building-frameworks
  - /guide/integration/nuxt
logo: vcli
---

# Vuetify CLI

The Vuetify CLI scaffolds Vuetify and v0 projects, seeds working examples from the official docs registry (`vuetify add`), and helps you track a local component library over time.

<DocsPageFeatures :frontmatter />

## Packages

| Package | Binary | Purpose |
| - | - | - |
| [@vuetify/cli](https://www.npmjs.com/package/@vuetify/cli) | `vuetify` | Full CLI with all commands |
| [create-vuetify0](https://www.npmjs.com/package/create-vuetify0) | `create-vuetify0` | Scaffold [v0](/introduction/getting-started) projects |

> [!NOTE]
> Registry commands (`add <feature>`, `list`, `generate`, `diff`, `refresh`, `registry build`) require a recent `@vuetify/cli` that includes the docs registry consumer. The seed itself is live at [0.vuetifyjs.com/registry](https://0.vuetifyjs.com/registry/index.json).

## Installation

Install the CLI globally to access all commands:

::: code-group no-filename

```bash pnpm
pnpm add -g @vuetify/cli
```

```bash npm
npm install -g @vuetify/cli
```

```bash yarn
yarn global add @vuetify/cli
```

```bash bun
bun add -g @vuetify/cli
```

:::

Or run commands without installing using `dlx`/`npx`:

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/cli <command>
```

```bash npm
npx @vuetify/cli <command>
```

```bash yarn
yarn dlx @vuetify/cli <command>
```

```bash bun
bunx @vuetify/cli <command>
```

:::

## Quick Start

Create a new v0 project with the interactive wizard:

```bash
vuetify init
```

Or use the standalone scaffolding package without installing the CLI:

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
| `vuetify add <name>` | Seed a component, composable, or plugin from the docs registry |
| `vuetify add eslint` | Add ESLint with Vuetify config |
| `vuetify list` | List components tracked in `vuetify.json` |
| `vuetify status` | Check tracked files still exist on disk |
| `vuetify generate <name>` | Scaffold a local component (no registry origin) |
| `vuetify diff <name>` | Compare a tracked component to its registry origin |
| `vuetify refresh <name>` | Re-fetch a tracked component from its origin |
| `vuetify registry build` | Emit a static registry from your inventory |
| `vuetify mcp` | Configure [Vuetify MCP](/guide/tooling/vuetify-mcp) for your IDE |
| `vuetify update` | Update Vuetify packages |
| `vuetify docs` | Open version-specific documentation |
| `vuetify release-notes` | Print release notes for a package |
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

v0 is headless: installing `@vuetify/v0` and importing a primitive does not yield a rendered UI. `vuetify add` seeds a **working, styled example** from the official docs registry into your project so you own a real file you can edit, theme, and ship.

The registry is published at [0.vuetifyjs.com/registry](https://0.vuetifyjs.com/registry/index.json) — the same curated examples that appear on component and composable docs pages.

#### Seed a feature

::: code-group no-filename

```bash pnpm
# Interactive picker when you omit the name
pnpm dlx @vuetify/cli add

# Component example (writes under src/components/…)
pnpm dlx @vuetify/cli add dialog

# Plugin (install-first — wires createThemePlugin into the app)
pnpm dlx @vuetify/cli add use-theme

# Pick a specific example when a feature ships more than one
pnpm dlx @vuetify/cli add data-table --example gallery

# Non-interactive (CI / scripts)
pnpm dlx @vuetify/cli add dialog --yes
```

```bash npm
npx @vuetify/cli add
npx @vuetify/cli add dialog
npx @vuetify/cli add use-theme
npx @vuetify/cli add data-table --example gallery
npx @vuetify/cli add dialog --yes
```

```bash yarn
yarn dlx @vuetify/cli add
yarn dlx @vuetify/cli add dialog
yarn dlx @vuetify/cli add use-theme
yarn dlx @vuetify/cli add data-table --example gallery
yarn dlx @vuetify/cli add dialog --yes
```

```bash bun
bunx @vuetify/cli add
bunx @vuetify/cli add dialog
bunx @vuetify/cli add use-theme
bunx @vuetify/cli add data-table --example gallery
bunx @vuetify/cli add dialog --yes
```

:::

| Option | Description |
| - | - |
| `--example <id>` | Example within the feature (`basic`, `gallery`, …) |
| `--dir <path>` | Write destination (defaults to `vuetify.json` aliases or `src/components`) |
| `--registry <url\|alias>` | Registry origin (default `https://0.vuetifyjs.com`) |
| `--overwrite` | Replace existing files without prompting |
| `--yes` | Accept prompts with defaults (skips optional plugin demos) |

What it does:

1. Resolves the name against the registry index (fuzzy match when needed).
2. Installs missing npm dependencies declared by the example (with confirm, or immediately with `--yes`).
3. Writes example files into your project and maps semantic colors if UnoCSS/Tailwind is present.
4. Records the install in **`vuetify.json`** (path, files, and upstream origin for later diff/refresh).

#### Plugins

Plugin pages (for example [useTheme](/composables/plugins/use-theme)) are **install-first**: the CLI wires `createThemePlugin` (or the matching factory) into `src/plugins/` and your app entry. A usage example is optional — confirm interactively, or pass `--example` to force one. With `--yes`, only the plugin module is installed.

```bash
vuetify add use-theme
vuetify add use-locale --yes
```

#### Integrations

`add` still installs project tooling integrations:

```bash
vuetify add eslint
```

Configure the MCP server with [`vuetify mcp install`](/guide/tooling/vuetify-mcp) (not `add mcp` — that path is deprecated).

### list and status

Track what `add` (and `generate`) put on disk:

```bash
# Inventory from vuetify.json
vuetify list
vuetify list --json

# Healthy vs missing files
vuetify status
```

### generate

Scaffold a **local** component with no registry origin — useful when you are building your own library and only need a tracked file:

```bash
vuetify generate MyCard
vuetify generate my-button --dir src/components/ui
```

### diff and refresh

When a feature came from the registry, compare or re-pull it:

```bash
# Show which files match, changed, or only exist locally / upstream
vuetify diff dialog

# Re-fetch from the recorded origin (overwrites local files)
vuetify refresh dialog
vuetify refresh use-theme
```

Git remains the source of truth for your edits. Diff/refresh only compare against the registry seed you originally installed.

### registry build

Publish **your** inventory as a static registry in the same shape as the official seed, so other projects can point `vuetify add --registry` at it:

```bash
vuetify registry build
# → ./registry/index.json, tokens.json, {type}/{name}.json
```

Host the **parent** of the output directory so URLs resolve as `{origin}/registry/index.json` (the CLI always fetches under `/registry/`).

```bash
# After hosting at https://design.example.com/registry/…
vuetify add dialog --registry https://design.example.com
```

### Multi-registry

`vuetify.json` can map short aliases to origins:

```json
{
  "version": 1,
  "aliases": { "components": "src/components" },
  "registries": {
    "@vuetify": "https://0.vuetifyjs.com",
    "@acme": "https://design.example.com"
  },
  "components": {}
}
```

```bash
vuetify add @acme/button
vuetify add dialog --registry @acme
```

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
- `@nuxtjs/vuetify`
- `vite-plugin-vuetify`
- `eslint-plugin-vuetify`
- `eslint-config-vuetify`

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

> [!NOTE]
> The CLI auto-detects your installed Vuetify version and opens the correct documentation site.

### release-notes

Print the release notes for a Vuetify package without leaving the terminal:

::: code-group no-filename

```bash pnpm
# Latest v0 release
pnpm dlx @vuetify/cli release-notes v0

# A specific version
pnpm dlx @vuetify/cli release-notes v0 --version 1.0.0
```

```bash npm
npx @vuetify/cli release-notes v0
npx @vuetify/cli release-notes v0 --version 1.0.0
```

```bash yarn
yarn dlx @vuetify/cli release-notes v0
yarn dlx @vuetify/cli release-notes v0 --version 1.0.0
```

```bash bun
bunx @vuetify/cli release-notes v0
bunx @vuetify/cli release-notes v0 --version 1.0.0
```

:::

The command prints the release name, tag, publish date, and full notes, along with links to the documentation and the GitHub release.

| Argument | Default | Description |
| - | - | - |
| `package` | `vuetify` | Package to fetch — `vuetify` or `v0` (aliases: `vuetify0`, `0`) |
| `--version`, `-v` | `latest` | Release version; `latest` resolves to the newest core release |

> [!TIP]
> Pass `v0` to read the [Vuetify0 release notes](/releases). Omitting `--version` shows the latest release.

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

The analyzer scans your project and detects all imports from `@vuetify/v0`:

- **Components** — `Dialog`, `Tabs`, `Avatar`, etc.
- **Composables** — `useBreakpoints`, `useTheme`, `createFilter`, etc.
- **Plugins** — `createThemePlugin`, `createBreakpointsPlugin`, etc.
- **Utilities and constants**

#### Custom Documentation URL

After analyzing your project, the CLI generates a **personalized documentation URL**:

```text
https://0.vuetifyjs.com/?features=Dialog,Avatar,useBreakpoints,...
```

This URL filters the v0 documentation to show **only the features you're actually using**, giving you a focused, clutter-free reference tailored to your project. Share this URL with your team to onboard developers faster.

#### JSON Output

Use `--reporter json` to integrate with CI/CD pipelines or custom tooling:

```bash
vuetify analyze --reporter json --output report.json
```

> [!ASKAI] What does the analyze command output and how do I share the report with my team?

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
| Features | ESLint, [Pinia](https://pinia.vuejs.org), [i18n](https://vue-i18n.intlify.dev), MCP |

### Platforms

| Platform | Description |
| - | - |
| Vue + Vite | Standard Vue 3 SPA with [Vite](https://vite.dev) |
| Nuxt | [Nuxt](https://nuxt.com) with SSR/SSG support |

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

## Non-Interactive Mode

For CI/CD pipelines and automation, pass arguments directly:

::: code-group no-filename

```bash pnpm
pnpm create vuetify0 my-app \
  --platform=vue \
  --css=unocss \
  --router=router \
  --features=eslint,pinia \
  --install
```

```bash npm
npm create vuetify0 my-app -- \
  --platform=vue \
  --css=unocss \
  --router=router \
  --features=eslint,pinia \
  --install
```

```bash yarn
yarn create vuetify0 my-app \
  --platform=vue \
  --css=unocss \
  --router=router \
  --features=eslint,pinia \
  --install
```

```bash bun
bun create vuetify0 my-app \
  --platform=vue \
  --css=unocss \
  --router=router \
  --features=eslint,pinia \
  --install
```

:::

### All Arguments

| Argument | Values | Description |
| - | - | - |
| `--platform` | `vue`, `nuxt` | Target platform |
| `--css` | `unocss`, `tailwindcss`, `none` | CSS framework |
| `--no-typescript` | flag | Use JavaScript instead of TypeScript |
| `--router` | `router`, `file-router`, `none` | Router type (Vue only) |
| `--features` | `eslint`, `pinia`, `i18n`, `mcp` | Features to include (comma-separated) |
| `--install` | flag | Auto-install dependencies |
| `--force` | flag | Overwrite existing directory |

> [!WARNING]
> The `--force` flag will overwrite existing files without confirmation.
