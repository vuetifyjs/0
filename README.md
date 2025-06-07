# Vuetify 0

**Vuetify 0** is an unstyled, baseline component library that recreates the foundational elements of Vuetify without imposing any design opinions. It provides raw building blocks that you can style or compose into higher‑level components.

## Components

Currently implemented:

* **Avatar** — `<VAvatar>`

> Additional components will be added incrementally as they are extracted from the core Vuetify library.

### What belongs in Vuetify 0?

Vuetify 0 is limited to single‑layer primitives that act as the substrate for more complex UI. A feature should reside here only if it:

* Contains no complex logic (no filtering, `provide/inject` patterns, or multiple child components).
* Requires no global singleton state (e.g., `useDisplay`, `useTheme`). However, utilities and composables from Vuetify may be re‑exported as building blocks for downstream components.
* Can be used without global setup beyond what is strictly necessary.
* Relies on external dependencies only through a decoupled interface.
* Can be styled in multiple ways—plain CSS, Sass, or any other approach—without assumptions.

## Getting Started

### Project setup

```sh
pnpm install

pnpm dev:prepare
```

### Compile and hot‑reload for development

```sh
pnpm dev
```

### Type‑check, compile for production

> [!WARNING]
> Will stuck, waiting for https://github.com/unjs/obuild/pull/34 to be merged

```sh
pnpm build
```

### Lint with ESLint

```sh
pnpm lint
```

## License

MIT
