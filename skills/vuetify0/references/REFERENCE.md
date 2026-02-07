# Vuetify0 API Reference

Detailed API documentation for `@vuetify/v0` composables, components, utilities, and plugins.

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
selection.selectedIds   // Set<string>
selection.isSelected('a') // boolean
```

#### createGroup — Multi Selection with Tri-State
```ts
import { createGroup } from '@vuetify/v0'

const group = createGroup()

group.selectAll()
group.toggleAll()
group.isMixed  // true when partially selected
group.isAllSelected
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
tree.register({ id: 'child', value: 'Child', parent: 'parent' })

tree.getPath('child')        // ['parent', 'child']
tree.getDescendants('parent') // ['child']
```

### Form Handling

#### createForm — Validation
```ts
import { createForm } from '@vuetify/v0'

const form = createForm()

const email = form.register({
  id: 'email',
  value: '',
  rules: [
    v => !!v || 'Required',
    v => /.+@.+/.test(v) || 'Invalid email',
    async v => await checkAvailable(v) || 'Email taken'
  ]
})

email.isValid   // true | false | null (pending)
email.errors    // string[]
email.validate()

form.submit()   // Validates all fields
```

### Context & State Sharing

#### createContext — Type-Safe Provide/Inject
```ts
import { createContext } from '@vuetify/v0'

interface ThemeContext {
  mode: Ref<string>
  toggle: () => void
}

const [useTheme, provideTheme] = createContext<ThemeContext>('Theme')

// Provider
provideTheme({ mode, toggle })

// Consumer (throws helpful error if not provided)
const { mode, toggle } = useTheme()
```

#### createTrinity — Context with Defaults
```ts
import { createTrinity } from '@vuetify/v0'

const [useConfig, provideConfig, defaultConfig] = createTrinity<Config>('Config', {
  theme: 'light',
  locale: 'en'
})
```

### Collection Management

#### createRegistry — Item Lifecycle
```ts
import { createRegistry } from '@vuetify/v0'

const registry = createRegistry<{ id: string; label: string }>()

registry.register({ id: 'item1', label: 'Item 1' })
registry.unregister('item1')

registry.items  // Map<string, Item>
registry.ids    // string[]
```

### Data Utilities

#### createFilter — Array Filtering
```ts
import { createFilter } from '@vuetify/v0'

const { apply } = createFilter({ keys: ['name', 'email'] })
const query = shallowRef('')
const users = shallowRef([...])

const filtered = apply(query, users)
```

#### createPagination — Page Navigation
```ts
import { createPagination } from '@vuetify/v0'

const pagination = createPagination({
  page: 1,
  itemsPerPage: 10,
  length: 100
})

pagination.next()
pagination.prev()
pagination.first()
pagination.last()
```

#### createVirtual — Virtual Scrolling
```ts
import { createVirtual } from '@vuetify/v0'

const { virtualItems, totalHeight, scrollTo } = createVirtual({
  items: largeList,
  itemHeight: 48
})
```

#### createTimeline — Undo/Redo
```ts
import { createTimeline } from '@vuetify/v0'

const timeline = createTimeline({ maxSize: 50 })

timeline.push(state)
timeline.undo()
timeline.redo()
timeline.canUndo
timeline.canRedo
```

#### createQueue — FIFO with Timeouts
```ts
import { createQueue } from '@vuetify/v0'

const notifications = createQueue({ timeout: 5000 })

notifications.push({ message: 'Saved!' })
// Auto-removes after 5 seconds
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
const { isIntersecting } = useIntersectionObserver(el, { threshold: 0.1 })
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

useClickOutside(menuRef, close, { touchThreshold: 500 })
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
    <Dialog.Trigger>Open</Dialog.Trigger>
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
  <Checkbox.Root v-model="checked">
    <Checkbox.Indicator />
    <Checkbox.Label>Accept terms</Checkbox.Label>
  </Checkbox.Root>
</template>
```

### Radio
```vue
<script setup>
import { Radio } from '@vuetify/v0'
</script>

<template>
  <Radio.Group v-model="selected">
    <Radio.Item value="a">
      <Radio.Indicator />
      <Radio.Label>Option A</Radio.Label>
    </Radio.Item>
    <Radio.Item value="b">
      <Radio.Indicator />
      <Radio.Label>Option B</Radio.Label>
    </Radio.Item>
  </Radio.Group>
</template>
```

### Available Components

| Component | Purpose |
|-----------|---------|
| `Atom` | Polymorphic element (render as any tag) |
| `Avatar` | Image with fallback |
| `Checkbox` | Checkbox control (standalone or group) |
| `Dialog` | Modal overlay with focus trap |
| `ExpansionPanel` | Accordion (single or multi-expand) |
| `Group` | Multi-selection container |
| `Pagination` | Page navigation |
| `Popover` | Toggle overlay (CSS anchor positioning) |
| `Radio` | Radio buttons with roving tabindex |
| `Scrim` | Overlay backdrop |
| `Selection` | Generic selection container |
| `Single` | Single selection container |
| `Step` | Stepper/wizard |
| `Tabs` | Tab navigation |

---

## Utility Functions

```ts
import {
  mergeDeep,
  clamp,
  range,
  debounce,
  useId
} from '@vuetify/v0/utilities'

// Deep merge (prototype pollution safe)
const config = mergeDeep({}, defaults, overrides)

// Clamp number to range
const clamped = clamp(value, 0, 100)

// Create number array
const nums = range(5) // [0, 1, 2, 3, 4]
const nums2 = range(5, 1) // [1, 2, 3, 4, 5]

// Debounce with controls
const search = debounce(query, 300)
search.clear()
search.immediate()

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
  // value is Record<string, unknown>
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
const { current, toggle } = useTheme()
```
