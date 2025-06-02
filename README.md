# vuetify0

A rewrite of the baseline Vuetify components.

## Components

Tentative components include:

- Avatar
- Button
- Chip
- Divider
- Field
- Grid
- Group
- Icon
- Input
- Layout
- List
- Overlay (Popup)
- Progress
- Sheet
- Skeleton
- Slider
- TextInput
- Typography

### What type of component belongs in vuetify0?

vuetify0 is meant to be the baseline building blocks used to build higher order components, including those in the Vuetify library. It is not meant to be a complete set of components, but rather a set of foundational components that can be used to create more complex UI elements.

Some things to consider when determining if a piece of functionality should be included in vuetify0:

- Is not composed by more than one layer. e.g. a button is composed of a sheet, typography, and icon;
- Does not contain any complex logic such as filtering, provide / inject, or multiple child components;
- Does not require any global singleton state such as useDisplay or useTheme from Vuetify;
- All SCSS files for components should have variables that reference CSS variables. e.g. $v0-button-color: var(--v0-button-color);
- Does not utilize any CSS utility classes from Vuetify or other libraries. e.g. v-btn, v-sheet, v-icon, etc.
- Does not require the global instantiation of anything beyond what's absolutely necessary
- (Maybe?) CAN have external dependencies but only through an interface that is not coupled to the component itself. e.g. a markdown component that has an interface that allows you to pass the content to your markdown renderer of your choice.
- Is primarily expected to be configured using props or CSS variables
- A heavy focus on slots to maximize flexibility and customization
- TODO...

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
