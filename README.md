# Vuetify 0

**Vuetify 0** is an unstyled, baseline component library that recreates the foundational elements of Vuetify without imposing any design opinions. It provides raw building blocks that you can style or compose into higher‑level components.

## The Idea

Vuetify 0 decouples Vuetify from design systems, providing lightweight, unopinionated building blocks that work with any design system:

- **Unstyled components** like VVirtualScroll and VHover that provide functionality without design opinions
- **Composables and utilities** including useLink, convertToUnit, and use*Observables that work independently of styling might be useful for any project. Some of them are hidden so it's time to expose them
- **Animations-friendly** user can easily pick any animation library to use, no matter it will be our own or a third-party one

## Components

### Roadmap

Vuetify 0 focuses on components that provide complex behavior, state management, and accessibility patterns.

* **Dialog** — Complex focus management, backdrop handling, escape key behavior
* **Menu** — Keyboard navigation, positioning, nested menus
* **Select** — Dropdown behavior, search filtering, multi-select, keyboard navigation (includes Combobox/Autocomplete functionality)
* **Tooltip** — Positioning, hover/focus states, delay management
* **Field** — Form validation, error states, accessibility labeling
* **Input** — Checkbox, Radio, and other grouped inputs with keyboard navigation
* **Slider** — Range handling, keyboard controls, accessibility announcements
* **Accordion** — Expand/collapse state, keyboard navigation
* **Tabs** — Tab panel management, keyboard navigation, focus handling
* **Scroller** — (optionally) Virtual scrolling, keyboard navigation
* **Hover** — Hover state management, keyboard navigation
* **Progress** — Linear and circular progress indicators

### Currently Implemented

* **Avatar** — `<VAvatar>` (basic display component)
* **Divider** — `<VDivider>` (basic styling component)

> Components are being developed incrementally, prioritizing those with complex interaction patterns and accessibility requirements.

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

### Storybook

```sh
pnpm storybook
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
