<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
  <img alt="Vuetify One Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
</picture>
</div>

# @vuetify/v0

Core foundational package from providing components and composables for building modern applications. `@vuetify/v0` is the foundational layer of the Vuetify ecosystem, offering lightweight, headless building blocks with TypeScript support and accessibility features built-in that serve as building blocks for higher-order UI libraries and custom design systems.

## 🚀 Installation

```bash
npm install @vuetify/v0
# or
pnpm add @vuetify/v0
# or
yarn add @vuetify/v0
```

## 📦 What's Included

### Components

- **`Atom`** - Base element wrapper with renderless capabilities
- **`Breakpoints`** - Responsive breakpoint utilities
- **`Context`** - Context injection/provision system
- **`Group`** - Selection grouping with multiple/single modes
- **`Hydration`** - Client-side hydration utilities
- **`Popover`** - CSS anchor-positioned popup components
- **`Step`** - Step-based navigation system
- **`Theme`** - Theme management and CSS variable injection

### Composables

- **`useBreakpoints`** - Responsive breakpoint detection
- **`createContext`** - Type-safe context management
- **`useEventListener`** - Event listener utilities
- **`useFilter`** - Collection filtering utilities
- **`useForm`** - Form validation and management
- **`useGroup`** - Selection group management
- **`useHydration`** - SSR hydration helpers
- **`useIntersectionObserver`** - Intersection observer utilities
- **`useKeydown`** - Keyboard event handling
- **`useLayout`** - Layout management utilities
- **`useLocale`** - Internationalization support
- **`useLogger`** - Development logging utilities
- **`useMutationObserver`** - DOM mutation observation
- **`useProxyModel`** - Model proxy utilities
- **`useRegistry`** - Component registration system
- **`useResizeObserver`** - Resize observer utilities
- **`useSelection`** - Selection management
- **`useSingle`** - Single selection utilities
- **`useStep`** - Step navigation logic
- **`useStorage`** - Local/session storage utilities
- **`useTheme`** - Theme switching and CSS variable management
- **`useTokens`** - Design token system

### Factories

- **`createContext`** - Context factory with type safety
- **`createPlugin`** - Vue plugin factory
- **`createRootProvider`** - Root provider factory
- **`createTrinity`** - Trinity pattern factory

### Transformers

- **`toArray`** - Array transformation utilities
- **`toReactive`** - Reactive object conversion

### Utilities

- **Type guards** - `isString`, `isNumber`, `isObject`, etc.
- **Object utilities** - `mergeDeep`, `genId`
- **Performance utilities** - Benchmarking tools


## 📖 Basic Usage

### Theme Setup

```vue
<script setup>
import { createThemePlugin } from '@vuetify/v0'

// Install theme plugin in your main.js
app.use(createThemePlugin({
  default: 'light',
  themes: {
    light: {
      colors: {
        primary: '#1976d2',
        secondary: '#424242',
        background: '#ffffff'
      }
    },
    dark: {
      colors: {
        primary: '#2196f3',
        secondary: '#616161',
        background: '#121212'
      }
    }
  }
}))
</script>
```

### Using Components

```vue
<script setup>
import { Atom, Group, Step } from '@vuetify/v0'
import { ref } from 'vue'

const selectedItems = ref([])
const currentStep = ref(0)
</script>

<template>
  <!-- Base Atom component -->
  <Atom as="section" class="container">
    <h1>My Application</h1>
  </Atom>

  <!-- Group selection -->
  <Group v-model="selectedItems" multiple>
    <template #default="{ select, isSelected }">
      <button 
        v-for="item in items" 
        :key="item.id"
        @click="select(item.id)"
        :class="{ active: isSelected(item.id) }"
      >
        {{ item.name }}
      </button>
    </template>
  </Group>

  <!-- Step navigation -->
  <Step v-model="currentStep" :max="3">
    <template #default="{ step, next, prev, canNext, canPrev }">
      <div class="step-content">
        Step {{ step + 1 }} content
      </div>
      <div class="step-actions">
        <button @click="prev" :disabled="!canPrev">Previous</button>
        <button @click="next" :disabled="!canNext">Next</button>
      </div>
    </template>
  </Step>
</template>
```

### Using Composables

```vue
<script setup>
import { useBreakpoints, useTheme, useForm } from '@vuetify/v0'
import { ref } from 'vue'

// Responsive breakpoints
const { isMobile, mdAndUp } = useBreakpoints()

// Theme management
const { theme, setTheme, colors } = useTheme()

// Form management
const { register, validate, errors } = useForm({
  validateOn: 'change'
})

const email = ref('')
const password = ref('')

// Register form fields
register('email', email, [
  (value) => !!value || 'Email is required',
  (value) => /.+@.+\..+/.test(value) || 'Email must be valid'
])

register('password', password, [
  (value) => !!value || 'Password is required',
  (value) => value.length >= 8 || 'Password must be at least 8 characters'
])

const handleSubmit = async () => {
  const isValid = await validate()
  if (isValid) {
    // Submit form
  }
}
</script>

<template>
  <div :class="{ mobile: isMobile, desktop: mdAndUp }">
    <button @click="setTheme(theme === 'light' ? 'dark' : 'light')">
      Toggle Theme ({{ theme }})
    </button>
    
    <form @submit.prevent="handleSubmit">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Email"
        :style="{ borderColor: colors.primary }"
      />
      <div v-if="errors.email" class="error">{{ errors.email[0] }}</div>
      
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password"
      />
      <div v-if="errors.password" class="error">{{ errors.password[0] }}</div>
      
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
```

## 🏗️ Design Principles

- **Headless First**: Components provide logic and accessibility without imposed styling
- **Slot-Driven**: Maximum flexibility through comprehensive slot APIs
- **CSS Variables**: All styling configurable via CSS custom properties
- **TypeScript Native**: Full type safety with excellent developer experience
- **Minimal Dependencies**: Lightweight with only essential peer dependencies
- **Composable Architecture**: Reusable logic through Vue 3 composables

## 📚 API Reference

For detailed API documentation, type definitions, and examples, visit our [documentation site](https://0.vuetifyjs.com) or explore the TypeScript definitions included in this package.

## 🔗 Related Packages

- **[@vuetify/paper](https://npmjs.com/package/@vuetify/paper)** - Styling and layout primitives
- **[Vuetify 3](https://vuetifyjs.com)** - Full-featured Material Design component library

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass before submitting a pull request.

## 📄 License

MIT License

---

Built with ❤️ for the Vue ecosystem. Part of the Vuetify family.