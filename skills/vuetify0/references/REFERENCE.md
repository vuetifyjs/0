# Vuetify0 API Reference

Detailed API documentation for `@vuetify/v0` composables, components, utilities, and plugins.

## Contents

- Composables (selection, forms, foundation, registration, data)
- Browser & Environment (breakpoints, media queries, storage)
- DOM Observation (resize, intersection, mutation observers)
- Event Handling (click outside, hotkeys, event listeners)
- Headless Components (Tabs, Dialog, Checkbox, Radio)
- Utility Functions (mergeDeep, clamp, range, useId)
- Type Guards (isString, isObject, isNullOrUndefined, etc.)
- Plugins (theme, locale, features, permissions, logger, stack, notifications)

---

## Composables

### Selection Patterns

#### createSingle — Single Selection
```ts
import { createSingle } from '@vuetify/v0'

const selector = createSingle({ mandatory: 'force' })

selector.register({ id: 'light', value: 'light' })
selector.register({ id: 'dark', value: 'dark' })

selector.selectedId    // Ref<string | undefined>
selector.selectedValue // Ref<T | undefined>
selector.select('dark')
```

#### createSelection — Multi Selection
```ts
import { createSelection } from '@vuetify/v0'

const selection = createSelection({ multiple: true })

selection.register({ id: 'a', value: 'A' })
selection.register({ id: 'b', value: 'B' })

selection.toggle('a')
selection.selectedIds  // Set<string>
selection.selected('a') // boolean
```

#### createGroup — Multi Selection with Tri-State
```ts
import { createGroup } from '@vuetify/v0'

const group = createGroup()

group.selectAll()
group.toggleAll()
group.isMixed.value       // true when the selection is partial
group.isAllSelected.value // true when every item is selected
```

#### createStep — Sequential Navigation
```ts
import { createStep } from '@vuetify/v0'

const stepper = createStep({ circular: true })

stepper.register({ id: 'step1' })
stepper.register({ id: 'step2' })
stepper.register({ id: 'step3' })

stepper.next()
stepper.prev()
stepper.first()
stepper.last()
```

#### createNested — Hierarchical Selection
```ts
import { createNested } from '@vuetify/v0'

const tree = createNested()

tree.register({ id: 'parent', value: 'Parent' })
tree.register({ id: 'child', value: 'Child', parentId: 'parent' })

tree.getPath('child')        // ['parent', 'child']
tree.getDescendants('parent') // ['child']
```

### Form Handling

#### createForm — Validation
```ts
import { createForm, createValidation } from '@vuetify/v0'
import { shallowRef } from 'vue'

const form = createForm()
const email = shallowRef('')
const validation = createValidation({
  value: email,
  rules: ['required', 'email'],
})

form.register({ value: validation })

validation.isValid.value
await form.submit()
form.reset()
```

#### createOtp — OTP / verification code
```ts
import { createOtp } from '@vuetify/v0'

const otp = createOtp({
  length: 6,
  pattern: 'numeric',
  onComplete: async value => await verify(value),
})

otp.write(0, '4')
otp.distribute('123456') // returns count consumed
otp.value.value     // joined string
otp.isComplete.value
```

### Context & State Sharing

#### createContext — Type-Safe Provide/Inject
```ts
import { createContext } from '@vuetify/v0'

interface ThemeContext {
  mode: Ref<string>
  toggle: () => void
}

const [useTheme, provideTheme] = createContext<ThemeContext>('v0:theme')

// Provider
provideTheme({ mode, toggle })

// Consumer (throws helpful error if not provided)
const { mode, toggle } = useTheme()
```

#### createTrinity — Context with Defaults
```ts
import { createTrinity } from '@vuetify/v0'

const [useConfig, provideConfig, config] = createTrinity('v0:config', {
  theme: 'light',
  locale: 'en',
})
```

### Collection Management

#### createRegistry — Item Lifecycle
```ts
import { createRegistry } from '@vuetify/v0'

const registry = createRegistry()

registry.register({ id: 'item1', value: 'Item 1' })
registry.unregister('item1')

registry.keys()
registry.values()
```

### Data Utilities

#### createFilter — Array Filtering
```ts
import { createFilter } from '@vuetify/v0'

const filter = createFilter({ keys: ['name', 'email'] })
const query = shallowRef('')
const users = shallowRef<Record<string, unknown>[]>([])

const { items } = filter.apply(query, users)
```

#### createPagination — Page Navigation
```ts
import { createPagination } from '@vuetify/v0'

const pagination = createPagination({
  page: 1,
  itemsPerPage: 10,
  size: 100,
})

pagination.next()
pagination.prev()
pagination.first()
pagination.last()
```

#### createVirtual — Virtual Scrolling
```ts
import { createVirtual } from '@vuetify/v0'
import { ref } from 'vue'

const rows = ref<unknown[]>([])
const virtual = createVirtual(rows, { itemHeight: 48 })

virtual.items
virtual.size
virtual.scrollTo(0)
```

#### createTimeline — Undo/Redo
```ts
import { createTimeline } from '@vuetify/v0'

const timeline = createTimeline({ size: 50 })

timeline.register({ value: state })
timeline.undo()
timeline.redo()
```

#### createQueue — FIFO with Timeouts
```ts
import { createQueue } from '@vuetify/v0'

const notifications = createQueue({ timeout: 5000 })

notifications.register({ value: 'Saved!' })
```

---

## Browser & Environment

### Constants
```ts
import {
  IN_BROWSER,
  SUPPORTS_TOUCH,
  SUPPORTS_OBSERVER,
  SUPPORTS_INTERSECTION_OBSERVER
} from '@vuetify/v0/constants'

if (IN_BROWSER && SUPPORTS_OBSERVER) {
  // Safe to use ResizeObserver
}
```

### useBreakpoints
```ts
import { useBreakpoints } from '@vuetify/v0'

const { xs, sm, md, lg, xl, xxl, smAndUp, mdAndDown } = useBreakpoints()
```

Install `createBreakpointsPlugin` first. Without it these stay on the `xs` fallback (width 0) and do not track the viewport.

### useMediaQuery
```ts
import { useMediaQuery } from '@vuetify/v0'

const { matches } = useMediaQuery('(prefers-color-scheme: dark)')
```

---

## DOM Observation

### useResizeObserver
```ts
import { useResizeObserver } from '@vuetify/v0'

const el = shallowRef<HTMLElement>()
const { width, height, pause, resume } = useResizeObserver(el)
```

### useIntersectionObserver
```ts
import { useIntersectionObserver } from '@vuetify/v0'

const el = shallowRef<HTMLElement>()
const { isIntersecting } = useIntersectionObserver(el, () => {}, { threshold: 0.1 })
```

### useMutationObserver
```ts
import { useMutationObserver } from '@vuetify/v0'

useMutationObserver(el, callback, { childList: true, subtree: true })
```

---

## Event Handling

### useEventListener
```ts
import { useEventListener } from '@vuetify/v0'

useEventListener(window, 'resize', onResize)
// Auto-cleanup on unmount
```

### useHotkey
```ts
import { useHotkey } from '@vuetify/v0'

useHotkey('ctrl+k', openCommandPalette)
useHotkey('g-h', navigateHome) // Sequence: g then h
```

### useClickOutside
```ts
import { useClickOutside } from '@vuetify/v0'

useClickOutside(menuRef, close)
```

---

## Headless Components

All components are unstyled, accessible, and follow WAI-ARIA patterns.

### Tabs
```vue
<script setup>
import { Tabs } from '@vuetify/v0'
</script>

<template>
  <Tabs.Root v-model="active">
    <Tabs.List>
      <Tabs.Item value="overview">Overview</Tabs.Item>
      <Tabs.Item value="features">Features</Tabs.Item>
    </Tabs.List>

    <Tabs.Panel value="overview">...</Tabs.Panel>
    <Tabs.Panel value="features">...</Tabs.Panel>
  </Tabs.Root>
</template>
```

### Dialog
```vue
<script setup>
import { Dialog } from '@vuetify/v0'
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Activator>Open</Dialog.Activator>
    <Dialog.Content>
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.Close>Cancel</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

### Checkbox
```vue
<script setup>
import { Checkbox } from '@vuetify/v0'
</script>

<template>
  <label>
    <Checkbox.Root v-model="checked">
      <Checkbox.Indicator />
    </Checkbox.Root>
    Accept terms
  </label>
</template>
```

### Radio
```vue
<script setup>
import { Radio } from '@vuetify/v0'
</script>

<template>
  <Radio.Group v-model="selected">
    <Radio.Root value="a">
      <Radio.Indicator />
      Option A
    </Radio.Root>
    <Radio.Root value="b">
      <Radio.Indicator />
      Option B
    </Radio.Root>
  </Radio.Group>
</template>
```

The skill lists every component. The samples above are calls, not the catalog.

---

## Utility Functions

```ts
import {
  mergeDeep,
  clamp,
  range,
  useId
} from '@vuetify/v0/utilities'

// Deep merge (prototype pollution safe)
const config = mergeDeep({}, defaults, overrides)

// Clamp number to range
const clamped = clamp(value, 0, 100)

// Create number array
const nums = range(5) // [0, 1, 2, 3, 4]
const nums2 = range(5, 1) // [1, 2, 3, 4, 5]

// SSR-safe unique ID
const id = useId()
```

## Type Guards

```ts
import {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isPrimitive,
  isSymbol,
  isNaN
} from '@vuetify/v0/utilities'

if (isObject(value)) {
  // value is a plain object
}
```

---

## Plugins

For app-wide features:

```ts
import {
  createThemePlugin,
  createFeaturesPlugin,
  createLoggerPlugin,
  createLocalePlugin,
  createBreakpointsPlugin,
  createDatePlugin,
  createStoragePlugin
} from '@vuetify/v0'

// In main.ts
app.use(createThemePlugin({
  themes: {
    light: { colors: { primary: '#3b82f6' } },
    dark: { colors: { primary: '#60a5fa' } }
  }
}))

// In components
const theme = useTheme()

theme.selectedId.value
theme.cycle()
```
