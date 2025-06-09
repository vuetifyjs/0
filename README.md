# Vuetify 0

**Vuetify 0** is an unstyled, baseline component library that recreates the foundational elements of Vuetify without imposing any design opinions. It provides raw building blocks that you can style or compose into higher‑level components.

## The Idea

Vuetify 0 decouples Vuetify from design systems, providing lightweight, unopinionated building blocks that work with any design system:

- **Unstyled components** like VVirtualScroll and VHover that provide functionality without design opinions
- **Composables and utilities** including useLink, convertToUnit, and use*Observables that work independently of styling might be useful for any project. Some of them are hidden so it's time to expose them
- **Animations-friendly** user can easily pick any animation library to use, no matter it will be our own or a third-party one

## Components

Currently implemented:

* **Avatar** — `<VAvatar>`
* **Divider** — `<VDivider>`

> Additional components will be added incrementally as they are extracted from the core Vuetify library.

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
