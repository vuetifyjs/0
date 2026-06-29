---
title: createContext - Type-Safe Dependency Injection for Vue 3
meta:
- name: description
  content: Type-safe Vue dependency injection wrapper. Create reusable context to share state across components without prop drilling. Foundation for Vuetify0.
- name: keywords
  content: createContext, context, dependency injection, provide inject, composable, Vue 3, state management
features:
  category: Composable
  label: 'E: createContext'
  github: /composables/createContext/
  level: 3
related:
  - /composables/foundation/create-trinity
  - /composables/foundation/create-plugin
  - /guide/fundamentals/core
---

# createContext

Type-safe dependency injection factory built on Vue's provide/inject. Shares state across component trees without prop drilling.

<DocsPageFeatures :frontmatter />

## Usage

`createContext` has two modes depending on whether you pass a key:

### Static Key Mode

For singletons — one instance for the entire app (theme, locale, breakpoints):

```ts collapse
import { shallowRef } from 'vue'
import { createContext } from '@vuetify/v0'
import type { ShallowRef } from 'vue'

interface MyContext {
  isDisabled: ShallowRef<boolean>
  isSelected?: ShallowRef<boolean>
  type: 'primary' | 'secondary' | 'tertiary'
}

const [useContext, provideContext] = createContext<MyContext>('namespace')

provideContext({
  isDisabled: shallowRef(false),
  isSelected: shallowRef(true),
  type: 'primary',
})

export { useContext }
```

### Dynamic Key Mode

For multiple independent instances of the same context type (nested panels, tabs within tabs). Omit the key — both `provide` and `use` accept a runtime key at call time:

```ts
interface PanelContext {
  isOpen: ShallowRef<boolean>
  toggle: () => void
}

const [usePanel, providePanel] = createContext<PanelContext>()

// Provider — runtime key identifies this instance
providePanel('panel-main', mainContext)
providePanel('panel-sidebar', sidebarContext)

// Consumer — same runtime key to inject
const panel = usePanel('panel-main')
```

### Default Values

By default, `useContext` throws if the context isn't found. Pass a `defaultValue` to make injection optional — useful for components that work with or without a parent:

```ts
// Static key — default passed at creation time
const [usePanel, providePanel] = createContext<PanelContext>('v0:panel', fallbackContext)
const panel = usePanel() // returns fallbackContext if not provided

// Dynamic key — default passed at call time
const [usePanel, providePanel] = createContext<PanelContext>()
const panel = usePanel('v0:panel', fallbackContext)
```

### Suffix Pattern

For parent-child context hierarchies where a child needs to know which parent it belongs to:

```ts
// Item context appends ':item' to whatever parent key it's given
const [useItem, provideItem] = createContext<ItemContext>({ suffix: 'item' })

provideItem('v0:panel', itemContext)  // Provides to 'v0:panel:item'
const item = useItem('v0:panel')      // Injects from 'v0:panel:item'
```

## Architecture

`createContext` is the foundation for all dependency injection in Vuetify0:

```mermaid "Context Hierarchy"
flowchart TD
  createContext:::primary --> createTrinity
  createContext --> createPlugin
  createTrinity --> createRegistry
  createTrinity --> createTokens
  createRegistry --> createModel
  createModel --> createSelection
  createModel --> createSlider
  createSelection --> createSingle
  createSelection --> createGroup
```

## Examples

::: gn-example
/composables/create-context/context.ts
/composables/create-context/NotificationProvider.vue
/composables/create-context/NotificationConsumer.vue
/composables/create-context/notifications.vue

### Notification System

A four-file notification system that shows the canonical `createContext` provider/consumer split. `context.ts` is the only file that calls `createContext` — it defines the `NotificationContext` interface (a `ShallowReactive<Notification[]>` array plus `notify`, `dismiss`, and `clear` methods) and exports the `[useNotifications, provideNotifications]` tuple. `NotificationProvider.vue` creates the reactive state and method implementations, passes the assembled object to `provideNotifications()`, then renders only a slot — it is an invisible wrapper with no visual output. `NotificationConsumer.vue` destructures all four members from `useNotifications()` and drives a color-coded notification list: four buttons fire `random(type)` which picks a message at random and calls `notify()`; clicking a notification card calls `dismiss(id)` to splice it out; "Clear" calls `clear()` to empty the array. `notifications.vue` composes the two components.

The key architectural choice is that `NotificationConsumer` imports exclusively from `context.ts`, never from the provider. This means the consumer is reusable: drop it inside any provider that satisfies the `NotificationContext` interface and it works without modification — the same contract that makes testing straightforward, since a test can `provideNotifications()` a stub context without mounting the full provider tree.

`shallowReactive` is used for the notifications array (not `ref`) because the array is mutated in place via `push` and `splice` — Vue's reactivity tracks those mutations without needing to replace the reference. For contexts that wrap composables from the selection or registry layer instead of raw reactive state, the same file-separation pattern applies.

```mermaid "Provider/Consumer Data Flow"
graph LR
  A["context.ts"]:::info -->|"provideNotifications()"| B["NotificationProvider"]:::success
  A -->|"useNotifications()"| C["NotificationConsumer"]:::warning
  B -->|"wraps"| C
```

**File breakdown:**

| File | Role |
|------|------|
| `context.ts` | Defines the `NotificationContext` interface and creates the typed `[useNotifications, provideNotifications]` tuple |
| `NotificationProvider.vue` | Implements the context—creates reactive state and methods, then calls `provideNotifications()` |
| `NotificationConsumer.vue` | Consumes the context via `useNotifications()` to display and interact with notifications |
| `notifications.vue` | Entry point that composes Provider around Consumer |

**Key patterns:**

- Provider components are invisible wrappers that render only `<slot />`
- Consumers import only from `context.ts`, never from the Provider
- `shallowReactive` for arrays that mutate in place

Click the buttons to add notifications. Click a notification to dismiss it.

:::

## FAQ

::: faq

??? When should I use `createContext` directly instead of `createTrinity`?

`createContext` returns just the `[useContext, provideContext]` pair. [createTrinity](/composables/foundation/create-trinity) wraps it to also bundle a default context instance, so `provide` can be called with no arguments and fall back automatically. Reach for the bare pair when you don't need a built-in fallback.

??? Why does `useContext` throw when no provider is found?

Injection is required by default — a missing provider is treated as a bug. Pass a `defaultValue` (at creation for a static key, or at call time for a dynamic key) to make injection optional for components that work with or without a parent.

??? How do I create multiple independent instances of the same context?

Use dynamic key mode: omit the key at creation, then pass a runtime key to both `provide` and `use` (e.g. `providePanel('panel-main', ctx)` / `usePanel('panel-main')`). Each key identifies a separate instance.

:::

<DocsApi />
