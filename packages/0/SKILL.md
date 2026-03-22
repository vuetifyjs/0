---
name: vuetify0
description: Build with @vuetify/v0 headless composables and components for Vue 3. Use when creating selection state (single, multi, grouped, stepped), form validation, tab/dialog/popover UI, provide/inject context, registries, virtual scrolling, pagination, keyboard shortcuts, resize observers, theming, breakpoints, or SSR-safe browser detection. Triggers on v0, vuetify0, headless components, or WAI-ARIA patterns.
---

# Vuetify0 - Headless Composables & Components

Transform Vue 3 apps with unstyled, logic-focused building blocks for design systems.

## Quick Start

```bash
pnpm install @vuetify/v0
```

No global plugin required. Import only what you need:

```ts
import { createSelection } from '@vuetify/v0/composables'
import { Tabs } from '@vuetify/v0/components'
```

## Core Decision Tree

**Before writing custom logic**, check if v0 already provides it:

| Need | Use |
|------|-----|
| Single item selection | `createSingle` |
| Multi-item selection | `createSelection` |
| Selection with "select all" | `createGroup` |
| Step wizard / carousel | `createStep` |
| Form validation | `createForm` |
| Shared state (provide/inject) | `createContext` |
| Browser utilities | `IN_BROWSER`, `useBreakpoints`, `useMediaQuery` |

## Component Architecture

All components are **headless** (unstyled) and follow WAI-ARIA patterns:

```vue
<script setup>
import { Tabs } from '@vuetify/v0/components'
</script>

<template>
  <Tabs.Root v-model="active">
    <Tabs.List>
      <Tabs.Item value="overview">Overview</Tabs.Item>
    </Tabs.List>
    <Tabs.Panel value="overview">Content</Tabs.Panel>
  </Tabs.Root>
</template>
```

**Available components**: Dialog, Tabs, ExpansionPanel, Checkbox, Radio, Popover, Pagination, Select, Slider, Splitter, Switch, Avatar, Breadcrumbs, Form, Input, Scrim

## Essential Patterns

### Selection State
```ts
// Single selection (tabs, theme picker)
const single = createSingle({ mandatory: 'force' })

// Multi-selection (tags, filters)
const selection = createSelection({ multiple: true })

// Group with "select all" (data tables)
const group = createGroup()
```

### Context Sharing
```ts
// Type-safe provide/inject
const [useTheme, provideTheme] = createContext<Theme>('Theme')
```

### Form Validation
```ts
const form = createForm()
form.register({ id: 'email', rules: [required, email] })
```

## Anti-Patterns

**Don't reinvent these wheels:**

- **Custom selection logic** → Use `createSelection`
- **Manual provide/inject** → Use `createContext`
- **SSR checks** → Use `IN_BROWSER` constant

## Resources

- **Vuetify MCP** for structured API access: `claude mcp add vuetify-mcp https://mcp.vuetifyjs.com/mcp`
- **Live docs**: https://0.vuetifyjs.com
