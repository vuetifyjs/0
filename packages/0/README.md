<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
    <img alt="Vuetify One Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
  </picture>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@vuetify/v0">
    <img src="https://img.shields.io/npm/dt/@vuetify/v0.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/@vuetify/v0">
    <img src="https://img.shields.io/npm/dm/@vuetify/v0.svg" alt="Downloads">
  </a>
  <br>
  <a href="https://github.com/vuetifyjs/@vuetify/v0/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@vuetify/v0.svg" alt="License">
  </a>
  <a href="https://community.vuetifyjs.com">
    <img src="https://discordapp.com/api/guilds/340160225338195969/widget.png" alt="Chat">
  </a>
</p>

# @vuetify/v0

Core foundational package from providing components and composables for building modern applications. `@vuetify/v0` is the foundational layer of the Vuetify ecosystem, offering lightweight, headless building blocks with TypeScript support and accessibility features built-in that serve as building blocks for higher-order UI libraries and custom design systems.

## 🚀 Installation

```bash
npm install @vuetify/v0@latest
# or
pnpm add @vuetify/v0
# or
yarn add @vuetify/v0
# or
bun add @vuetify/v0
```

## 📦 What's Included

### Components

- **`Atom`** - Base element wrapper with renderless capabilities
- **`Avatar`** - User avatar component
- **`Popover`** - CSS anchor-positioned popup components

### Composables

#### Factories

- **`createContext`** - Context factory with type safety
- **`createPlugin`** - Vue plugin factory
- **`createTrinity`** - Trinity pattern factory

#### Registration

- **`useRegistry`** - Component registration and retrieval system
- **`useProxyRegistry`** - Make any registry reactive
- **`useQueue`** - Registry for managing ordered items
- **`useTimeline`** - Registry for managing timeline items
- **`useTokens`** - Design token system

#### Selection

- **`useFilter`** - Collection filtering utilities
- **`useSelection`** - Selection management
- **`useGroup`** - Selection group management
- **`useSingle`** - Single selection utilities
- **`useStep`** - Step navigation logic

#### Forms

- **`useForm`** - Form validation and state management
- **`useProxyModel`** - Proxy registry for Vue reactive models

#### System
- **`useEventListener`** - Event listener utilities
- **`useIntersectionObserver`** - Intersection observer utilities
- **`useKeydown`** - Keyboard event handling
- **`useMutationObserver`** - DOM mutation observation
- **`useResizeObserver`** - Resize observer utilities


#### Plugins

- **`useBreakpoints`** - Responsive breakpoint detection
- **`useFeatures`** - Feature detection utilities
- **`useHydration`** - SSR hydration helpers
- **`useLocale`** - Internationalization support
- **`useLogger`** - Development logging utilities
- **`usePermissions`** - User permission management
- **`useStorage`** - Local/session storage utilities
- **`useTheme`** - Theme switching and CSS variable management

### Transformers

- **`toArray`** - Array transformation utilities
- **`toReactive`** - Reactive object conversion

## 🏗️ Design Principles

- **Headless First**: Components provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via CSS custom properties
- **TypeScript Native**: Full type safety with excellent developer experience
- **Minimal Dependencies**: Lightweight with only essential peer dependencies
- **Composable Architecture**: Reusable logic through Vue 3 composables

## 📚 API Reference

For detailed API documentation, type definitions, and examples, visit our [documentation site](https://0.vuetifyjs.com) or explore the TypeScript definitions included in this package.

## 🤝 Contributing

We are not currently accepting contributions to this package, check back later.

## 📄 License

MIT License

---

Built with ❤️ for the Vue ecosystem. Part of the Vuetify family.
