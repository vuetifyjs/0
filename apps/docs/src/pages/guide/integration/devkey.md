---
title: Devkey - Example Vuetify0 Starter Project
logo: devkey
meta:
  - name: description
    content: Devkey is the reference Vuetify0 starter project. Vue 3, Vite, TypeScript, UnoCSS, and @vuetify/v0 scaffolded with the Vuetify CLI as the canonical Alpha example.
  - name: keywords
    content: vuetify0, devkey, starter, example project, vue 3, vite, typescript, unocss, scaffold, alpha
features:
  order: 0
  label: 'Devkey'
  level: 1
related:
  - /introduction/getting-started
  - /guide/tooling/vuetify-cli
  - /guide/fundamentals/building-frameworks
---

# Devkey

Devkey ([live](https://devkey.vuetifyjs.com), [source](https://github.com/vuetifyjs/devkey)) is the reference starter project for Vuetify0. Scaffolded with the [Vuetify CLI](/guide/tooling/vuetify-cli), it shows how the pieces fit together in a real Vue 3 app — and is the canonical example shipped with the v0 Alpha.

<DocsPageFeatures :frontmatter />

> [!TIP]
> Looking for the fastest way to start? Run `pnpm create vuetify0` to scaffold a fresh Devkey-shaped project locally.

> [!INFO]
> Want a guided walkthrough? The [Vuetify0 alpha announcement](https://vuetifyjs.com/blog/announcing-vuetify0-alpha) builds Devkey step-by-step as a reusable UI library — landing page, auth flow, dashboard, and command palette.

## Preview

The Devkey home page. Navigation, hero layout, feature grid, and pricing cards are all built from v0 components.

![Devkey home page](https://cdn.vuetifyjs.com/docs/images/devkey/home.png "The Devkey landing page, rendered with v0 components")

## Overview

Devkey pairs `@vuetify/v0` with a minimal but production-shaped toolchain so you can see v0 in context — not as an isolated snippet, but as part of a real app layout.

| Layer | Choice |
| - | - |
| Framework | [Vue 3.5+](https://vuejs.org) |
| Build tool | [Vite 8](https://vitejs.dev) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| UI primitives | [@vuetify/v0](https://www.npmjs.com/package/@vuetify/v0) |
| Styling | [UnoCSS](https://unocss.dev) |
| Routing | [vue-router 5](https://router.vuejs.org) |
| Fonts | [@fontsource/inter](https://fontsource.org/fonts/inter) via `unplugin-fonts` |
| Icons | [@mdi/js](https://pictogrammers.com/library/mdi/) |
| Package manager | [pnpm](https://pnpm.io) |

## Get the Code

The project lives on GitHub at [vuetifyjs/devkey](https://github.com/vuetifyjs/devkey).

### Scaffold a fresh copy

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

### Clone the repository

```bash no-filename
git clone https://github.com/vuetifyjs/devkey.git
cd devkey
```

Then install dependencies with your preferred package manager:

::: code-group no-filename

```bash pnpm
pnpm install
```

```bash npm
npm install
```

```bash yarn
yarn install
```

```bash bun
bun install
```

:::

> [!INFO]
> `create vuetify0` produces the same layout as the Devkey repository. Cloning directly is useful if you want to track upstream changes.

## Scripts

Devkey exposes a small, focused set of scripts:

| Script | Purpose |
| - | - |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and produce a production build |
| `pnpm build-only` | Skip type-checking during build |
| `pnpm preview` | Preview the production build |
| `pnpm type-check` | Run `vue-tsc` across the project |

## Project Structure

```text
devkey/
├── public/                # Static assets served as-is
├── src/
│   ├── components/        # Reusable Vue components
│   ├── plugins/           # v0 plugin registration (theme, locale, etc.)
│   ├── styles/            # Global styles and theme tokens
│   ├── App.vue            # Root component
│   └── main.ts            # App entry — registers v0 plugins
├── index.html
├── vite.config.mts        # Vite + UnoCSS + fonts
├── tsconfig.json          # Project references
├── tsconfig.app.json      # App TS config
├── tsconfig.node.json     # Build tooling TS config
└── package.json
```

## What It Demonstrates

Devkey is intentionally small — the goal is to show the wiring, not fill it with features. Use it as a starting point for your own app or as a reference when integrating v0 into an existing project.

- **Plugin registration** — where and how `createThemePlugin` and friends get installed on the Vue `app`
- **UnoCSS + theme tokens** — mapping v0's CSS variables to UnoCSS theme colors for utility-class styling
- **Font loading** — `@fontsource/inter` wired through `unplugin-fonts` for zero-flash webfonts
- **Routing** — `vue-router` 5's built-in file-based routing alongside v0 components
- **TypeScript** — `vue-tsc` configured with project references for fast, strict type checks

## Next Steps

Once Devkey is running locally, explore the pieces it relies on:

| Goal | Start Here |
| - | - |
| Understand how v0 plugins are wired | [Getting Started](/introduction/getting-started) |
| Build your own components on top of v0 | [Building Frameworks](/guide/fundamentals/building-frameworks) |
| Customize the theme | [Theming](/guide/features/theming) |
| Add SSR | [Nuxt](/guide/integration/nuxt) |

> [!ASKAI] How do I add a new page to Devkey with vue-router?
