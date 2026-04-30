---
paths: packages/0/src/components/**
---

# Components Architecture

Scope-specific mechanics for `packages/0/src/components/**`. Covers compound pattern, SFC script ordering, context provision, props/slots/data-attrs, ARIA, disabled pattern, hidden inputs, focus management, keyboard navigation, v-model bridging, barrel exports, and the double-fire hazard. Cross-cutting philosophy lives in `PHILOSOPHY.md`.

## Cited PHILOSOPHY sections

- §2.1 Headless contract
- §2.5 Composables never touch DOM events (components bind them)
- §3.3 Naming conventions (including `_option` mirror, single-word preference)
- §3.4 `withDefaults` prohibition
- §3.5 Slot conventions
- §3.6 Boolean data attributes
- §3.7 No superfluous comments
- §4.1 Reactive primitive selection (`shallowRef` / `ref` / `shallowReactive` / `reactive`)
- §4.2 `Readonly<Ref<T>>` return contract
- §4.3 `MaybeRefOrGetter<T>` for composable inputs
- §4.5 Scope cleanup, including `useToggleScope`
- §5.3 Components (headless contract)
- §5.4 Hidden inputs
- §5.5 Locale-first strings
- §6.5 Never raw `inject`/`provide` — always `createContext`
- §6.6 `useProxyModel` — bidirectional v-model bridging
- §6.7 `useProxyRegistry` — reactive registry view
- §6.8 Register / unregister lifecycle contract
- §6.9 `mergeProps` at compound boundaries
- §7 Events & lifecycle
- §7.5 Conditional scopes with `useToggleScope`
- §8.8 Slot type guardrails

## Directory Structure (92% compound)

```
ComponentName/
├── ComponentNameRoot.vue        # Required — creates and provides context
├── ComponentNameItem.vue        # Sub-component consuming context
├── ComponentNameActivator.vue   # Sub-component (optional)
├── ComponentNameContent.vue     # Sub-component (optional)
├── index.ts                     # Barrel exports (required)
├── index.test.ts                # Tests (required — see testing.md)
└── types.ts                     # Shared types (only if needed across sub-components)
```

[intent:152, intent:153]

**Exceptions (single-file components).** `Form`, `Portal`, `Presence`, `Scrim`. [intent:154] These have no compound structure because they are pure wrappers or context-only.

## Script Structure (92% dual-script)

Standard: dual-script with imports and type exports in regular script; runtime logic in `<script setup>`. [intent:155]

```vue
<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables'

  // Utilities
  import { useId } from '#v0/utilities'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComponentRootProps extends AtomProps {
    namespace?: string
    disabled?: boolean
  }

  export interface ComponentRootSlotProps {
    isDisabled: boolean
    attrs: {
      'role': string
      'aria-disabled': true | undefined
      'data-disabled': true | undefined
    }
  }

  export const [useComponentRoot, provideComponentRoot] = createContext<ComponentContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComponentRoot' })

  const {
    as = 'div',
    namespace = 'v0:component',
    disabled = false,
  } = defineProps<ComponentRootProps>()

  // composition logic here
</script>

<template>
  <Atom :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**Enforced rules.**
- `defineOptions({ name: '...' })` — always required (100%). [intent:156]
- **All imports go in `<script lang="ts">`**, never in `<script setup>`. Vue imports, composable imports, utility imports — all in regular. `<script setup>` must contain zero import statements. [intent:36, intent:157, intent:158]
- Props interface and slot props interface exported from regular script. [intent:159]
- Context `[useX, provideX]` exported from regular script. [intent:160]
- Cleanup uses `onBeforeUnmount`, not `onUnmounted`. [intent:161, PHILOSOPHY §7.3]
- With generics: `<script lang="ts" setup generic="T">` — `lang` before `setup` when using `generic`. [intent:77]

## Context Provision Pattern

```ts
// Root creates and provides
export const [useComponentRoot, provideComponentRoot] = createContext<Type>()

// Sub-component consumes
const context = useComponentRoot(namespace)
```

Naming convention: `useComponentRoot` / `provideComponentRoot` for Root-level context. [intent:162]

**Dual context.** `Button`, `Radio`, `Toggle` provide both Root and Group contexts, so they support standalone *and* grouped usage with the same component tree. [intent:163] Toggle.Root detects Toggle.Group via optional injection. [intent:315]

**Reactive context fields — inline `toRef(() => prop)` at the provide call.** When the context surface exposes a reactive field derived from a destructured prop, write it inline in the `provideX(...)` call instead of binding to a named `_prop` const first. Don't pre-bind unless the local is reused.

```ts
// Right — TabsRoot, BreadcrumbsRoot, ImageRoot, OverflowRoot, …
provideTabsRoot(namespace, {
  disabled: toRef(() => disabled),
  orientation: toRef(() => orientation),
  activation: toRef(() => activation),
})

// Wrong — `_disabled` is used exactly once
const _disabled = toRef(() => disabled)
provideTabsRoot(namespace, { disabled: _disabled })
```

The named local is justified only when the resulting Ref is referenced from multiple places in the SFC (e.g., a `_disabled` read by both the provide call and a local watch). Otherwise, inline.

## Props Pattern (100% enforced)

```ts
export interface ComponentRootProps extends AtomProps {
  namespace?: string    // Always present on Root and sub-components
  disabled?: boolean    // Always present on interactive Root
  id?: string           // Auto-generated via useId() if not provided
}

// Defaults in destructuring, never in the interface.
const {
  as = 'div',
  namespace = 'v0:component',
  disabled = false,
} = defineProps<ComponentRootProps>()
```

[intent:164, intent:165]

**Never re-declare inherited `AtomProps`** (`as`, `renderless`). [intent:166]

## Slot Props Pattern (100% enforced)

```ts
export interface ComponentRootSlotProps {
  // Boolean state — always `is<State>`
  isDisabled: boolean
  isSelected: boolean
  isOpen: boolean

  // attrs object — ARIA + data + handlers
  attrs: {
    'role': string
    'aria-disabled': true | undefined
    'aria-selected': boolean
    'data-disabled': true | undefined
    'data-state': 'checked' | 'unchecked' | undefined
    'onClick': () => void
    'onKeydown': (e: KeyboardEvent) => void
  }
}

// Always computed via toRef
const slotProps = toRef((): ComponentRootSlotProps => ({
  isDisabled: isDisabled.value,
  attrs: { /* ... */ },
}))
```

- Boolean state named `is<State>` (isDisabled, isSelected, isOpen). [intent:167]
- `attrs` object includes ARIA + data + handlers. [intent:168]
- Always computed via `toRef`. [intent:169]
- Template always uses `<slot v-bind="slotProps" />`. [intent:170]

## Data Attribute Pattern (100% enforced)

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-state` | Visual state for CSS | Semantic strings: `checked`, `unchecked`, `indeterminate`, `open`, `closed`, `valid`, `invalid`, `dragging`, `idle` [intent:171] |
| `data-disabled` | Disabled styling | `true \| undefined` |
| `data-selected` | Selected styling | `true \| undefined` |
| `data-open` | Open/expanded | `true \| undefined` |
| `data-orientation` | Layout direction | `'horizontal' \| 'vertical'` [intent:173] |

**Rule.** Boolean data attributes are always `true | undefined`, not `true | false`. Undefined removes the attribute from DOM so CSS `[data-disabled]` selectors don't match when the value is false. [intent:172, PHILOSOPHY §3.6]

## ARIA Pattern (WAI-ARIA compliant)

Every interactive component: [intent:174]

1. Correct `role` attribute
2. Relevant `aria-*` state attributes
3. `aria-disabled` when disabled — always `boolean`, not `true | undefined` [intent:175]
4. Keyboard event handlers
5. All user-facing strings (`aria-label`, error messages) via `useLocale()` and `locale.t(key)` — never hardcode English [intent:176]

Tests assert `toBeDefined()` for locale strings, not exact values. [intent:177]

## Disabled Pattern (three-pronged, 100% enforced)

```ts
attrs: {
  'aria-disabled': isDisabled.value,              // Assistive tech (boolean)
  'data-disabled': isDisabled.value || undefined, // CSS hook (true | undefined)
  'tabindex': isDisabled.value ? -1 : 0,          // Focus management
}
```

[intent:178]

## Hidden Input Pattern (PHILOSOPHY §5.4)

Components with a `name` prop render `<ComponentHiddenInput>`:

- Always `inert` and `tabindex="-1"`
- Synced with parent state
- JSON-serialized for complex values
- Used by `Checkbox`, `Switch`, `Radio`, `Button`, `Progress`, `Slider`, `Rating`

[intent:179]

Conditionally rendered: `<ComponentHiddenInput v-if="name" />`. [intent:187]

## Focus Management (3 strategies)

| Strategy | When | Components |
|----------|------|-----------|
| Static tabindex | Single focusable element | Most components [intent:180] |
| Roving tabindex (`useRovingFocus`) | Group keyboard navigation | Radio, Tabs, Treeview, Splitter |
| Virtual focus (`useVirtualFocus`) | Large lists, aria-activedescendant | Combobox, Select |

## Keyboard Navigation Pattern (100% enforced)

```ts
function onKeydown (event: KeyboardEvent) {
  if (isDisabled.value) return           // Check disabled first
  if (event.key === 'Enter') {
    event.preventDefault()                // Then prevent default
    action()                              // Then perform the action
  }
}
```

[intent:181]

## Model Bridging Pattern

```ts
// In Root component
const model = defineModel<T | T[]>()
const [, , context] = createFooContext(options)
useProxyModel(context, model, { multiple })
```

[intent:182]

`defineEmits('update:model-value')` is redundant alongside `defineModel`, but **include it anyway** — vue-devtools requires the explicit emit declaration for event tracking. [intent:183]

When a composable uses `useProxyModel`, its underlying registry/model must have `events: true`. [intent:309]

## Barrel Export Pattern (100% enforced, PHILOSOPHY §8.8)

Never `export *` from `.vue` files — breaks Volar slot type inference. [intent:184, intent:338]

```ts
// Named exports for tree-shaking
export type { ComponentRootProps, ComponentRootSlotProps } from './ComponentRoot.vue'
export { default as ComponentRoot } from './ComponentRoot.vue'
export { useComponentRoot, provideComponentRoot } from './ComponentRoot.vue'

// Object compound export for dot notation
import ComponentRoot from './ComponentRoot.vue'
import ComponentItem from './ComponentItem.vue'
export const Component = { Root: ComponentRoot, Item: ComponentItem }
```

[intent:185]

## Template Pattern (100% enforced)

- Root element is always `<Atom :as :renderless>`. [intent:186, intent:336]
- Slot props via `<slot v-bind="slotProps" />`.
- Hidden inputs conditionally rendered: `<ComponentHiddenInput v-if="name" />`. [intent:187]
- `v-if` for structural conditionals; `v-show` only when the element must stay mounted to preserve state. [intent:188]
  - **Registry-driven visibility** — child registered with a Root for measurement or selection (Breadcrumbs item/divider/ellipsis, Overflow item).
  - **Load-state preservation** — image load, scroll position, etc. (Avatar image).
  - **Virtualization** — load-bearing for filtered lists (Combobox item).
  - Never hand-roll `:style="{ display: isHidden ? 'none' : null }"` — `v-show` does the same and is the canonical form. See PHILOSOPHY §10.11.

## Slot `attrs` Double-Fire Hazard

Slot `attrs` objects include `onClick` and other event handlers. These are already bound to the outer `<Atom>` wrapper via `mergeProps`. Consumers must **only** spread slot `attrs` onto their own element when using `renderless` mode. In non-renderless mode, spreading `attrs` onto a child element causes handlers to fire twice — once on the child, then again on the Atom wrapper via event bubbling.

When writing examples for new components, never `v-bind="attrs"` on children inside a non-renderless component. [intent:189]

In examples: prefer `v-slot="{ attrs }"` shorthand over `<template #default="{ attrs }">`. The long form is reserved for when the default slot contains sibling children or when multiple named slots need props. [intent:272, intent:273]

## Data-attribute Styling in Examples

Examples in docs and `dev/` prefer `data-*` attribute CSS selectors over JS-driven conditional classes. [intent:259] Components already emit the data attributes; styling hooks into them.

```css
/* Right */
[data-state="open"] { transform: scale(1); }

/* Wrong (in examples) */
:class="{ 'is-open': isOpen }"
```

## Element Refs Between Sub-components

Shared element refs propagate via registry registration, never `watchEffect` push. [intent:270, PHILOSOPHY §6.3]

```ts
// In the sub-component
const el = useTemplateRef('root')
const ticket = parentContext.register({ el })
onBeforeUnmount(() => parentContext.unregister(ticket.id))
```

## Tour & similar plugin-required components

Components provided by a plugin must throw without the plugin installed. `Tour` is an example: every `Tour.*` component renders through `<Atom>`, extends `AtomProps`, and types its slot via `defineSlots<{ default: (props: ...) => any }>()`. [intent:334, intent:336, intent:337]

`Tour.Content` applies `attrs` to its `Atom` element and exposes them via slot props (same pattern as `DialogContent`). [intent:339]

## WCAG Accessibility — how we apply the patterns

PHILOSOPHY §5.5 mandates that every interactive component ships correct `role`, `aria-*`, keyboard handlers, and locale-driven strings. This section covers the *how* — the specific WCAG success criteria each component pattern maps to, and where in source to find the worked examples. [intent:174]

### ARIA attribute vocabulary

| Attribute | Purpose | Value shape | Example |
|-----------|---------|-------------|---------|
| `role` | Semantic role | WAI-ARIA 1.2 role name | `role="combobox"`, `role="alertdialog"` |
| `aria-disabled` | Announce disabled state | `boolean` (always concrete) | `'aria-disabled': isDisabled.value` [intent:175] |
| `aria-selected` | Announce selection | `boolean` | Item in a listbox/tablist |
| `aria-expanded` | Announce disclosure | `boolean` | Activator toggles content |
| `aria-controls` | Activator → content linkage | Content element ID | `aria-controls="popover-123"` |
| `aria-labelledby` | Labelling via another element | Label element ID | `aria-labelledby="field-42-label"` |
| `aria-describedby` | Help/error text association | Description element ID | `aria-describedby="field-42-error"` |
| `aria-activedescendant` | Virtual focus within a list | Focused child ID | Combobox, Select |
| `aria-multiselectable` | Listbox multi-select | `boolean` | `role="listbox" aria-multiselectable="true"` |
| `aria-orientation` | Layout direction | `'horizontal' \| 'vertical'` | Tabs, Splitter, Slider |
| `aria-valuemin` / `aria-valuemax` / `aria-valuenow` | Numeric slider state | number | Slider, Progress |

### WCAG success criterion → component mapping

| WCAG SC | Requirement | v0 pattern | Worked example |
|---------|-------------|-----------|----------------|
| **1.3.1 Info and Relationships** | State is programmatically determinable | `data-state`, `aria-*`, `role` | `packages/0/src/components/Checkbox/CheckboxRoot.vue` — `data-state="checked"/"unchecked"/"indeterminate"` + matching `aria-checked` |
| **1.4.13 Content on Hover** | Hoverable/dismissable/persistent popovers | `usePopover()` with `triggerMode: 'hover'`, dismiss via click-outside / Escape | `packages/0/src/composables/usePopover/` |
| **2.1.1 Keyboard** | All functionality via keyboard | Every component ships keydown handlers | `packages/0/src/components/Tabs/TabsItem.vue` — Arrow/Home/End/Enter/Space |
| **2.1.2 No Keyboard Trap** | Focus can leave modals | Dialog `role="dialog"` + focus return via `useRovingFocus` | `packages/0/src/composables/useRovingFocus/` |
| **2.4.3 Focus Order** | Predictable focus order | Roving tabindex + `useVirtualFocus` for lists | Radio, Tabs, Combobox |
| **2.4.7 Focus Visible** | Focused element visible | v0 emits `:focus-visible` data, consumer styles | `data-focused` (when applicable), CSS `:focus-visible` selector |
| **3.3.1 Error Identification** | Errors linked to inputs | `createInput()` surfaces `errors` ref; component binds `aria-describedby` to error node | `packages/0/src/composables/createInput/`, `packages/0/src/components/TextField/` |
| **4.1.2 Name, Role, Value** | Accessible name, role, and value | `useLocale()` for names, explicit `role`, state via `aria-*` / `data-*` | All interactive components |
| **4.1.3 Status Messages** | Live region announcements | `CarouselLiveRegion` pattern; `role="status"` or `aria-live` | `packages/0/src/components/Carousel/CarouselLiveRegion.vue` |

### Worked examples (consult these when building a new interactive component)

- **`createCombobox` / Combobox components** — `role="combobox"`, `aria-expanded`, `aria-activedescendant` for virtual focus, `aria-autocomplete="list"`. Demonstrates WCAG 2.1.1 (keyboard), 4.1.2 (name/role/value), 1.3.1 (relationships).
- **`createTabs` / Tabs components** — `role="tablist"` on Root, `role="tab"` + `aria-selected` + `aria-controls` on Item, `role="tabpanel"` + `aria-labelledby` on Content. Demonstrates WCAG 2.1.1, 2.4.3 (focus order), 1.3.1.
- **`createSlider` / Slider components** — `role="slider"`, `aria-valuemin` / `aria-valuemax` / `aria-valuenow`, `aria-orientation`, `aria-valuetext` for formatted announcements. Demonstrates WCAG 4.1.2, 1.3.1.
- **`createInput` / TextField** — `<label>` linkage via `for`/`id`, `aria-describedby` for help/error, `aria-invalid` when validation fails, hidden input pattern for native form submission. Demonstrates WCAG 3.3.1, 3.3.3, 1.3.1.

### Cross-reference with WCAG success criteria when building

When designing a new component, run this checklist:

1. What *role* does this have? Look up the WAI-ARIA 1.2 role and match required states/properties for that role.
2. What *keyboard interactions* are expected for that role? (WAI-ARIA Authoring Practices is the reference — Arrow keys for tablists/listboxes, Escape for modals, Enter/Space for buttons.)
3. What *state* must be announced? Map to `aria-*` (assistive tech) and `data-*` (styling hooks).
4. What *relationships* exist between subcomponents? Use `aria-controls`, `aria-labelledby`, `aria-describedby`.
5. What *error/status* announcements? Use `aria-live`, `role="status"`, or `role="alert"`.
6. Run tests that assert `aria-*` attributes are emitted (values via `toBeDefined()`, not exact strings — locale-independent). [intent:177]

## AtomExpose — exposing internals from compound components

Compound-component sub-components expose their underlying DOM element via `defineExpose<AtomExpose>`. The `Atom` primitive itself defines the `AtomExpose` interface, and every sub-component that wraps an `Atom` propagates it upward so parent components can read `.element` when they need the real DOM node.

### The `AtomExpose` interface

```ts
// packages/0/src/components/Atom/Atom.vue:66
export interface AtomExpose {
  /** Template ref to the rendered HTML element (null in renderless mode) */
  element: TemplateRef<HTMLElement | null>
}
```

`Atom` calls `defineExpose<AtomExpose>({ element })` at the component level. Vue auto-unwraps refs surfaced via `defineExpose`, so consumers access the element directly — *not* through a `.value` chain:

```ts
// packages/0/src/components/Splitter/SplitterRoot.vue:112
const rootAtom = useTemplateRef<AtomExpose>('root')
// rootAtom.value?.element gives the HTMLElement | null directly
```

### Consuming AtomExpose in the same SFC

When the SFC that wraps an `Atom` needs that Atom's element for measurement, observers, focus management, or popover anchoring, follow the canonical form:

```ts
// packages/0/src/components/Overflow/OverflowIndicator.vue
const atomRef = useTemplateRef<AtomExpose>('atom')
const el = toRef(() => toElement(atomRef.value?.element) ?? null)
```

- **Name the `useTemplateRef` holder** `atomRef` (single Atom) or `{role}Ref` / `{role}Atom` (multiple). It holds an `AtomExpose` wrapper, not an `HTMLElement` — never suffix it with `El`. Precedents: `Image/ImageRoot.vue:93` (`atomRef`), `Splitter/SplitterRoot.vue:112` (`rootAtom`), `Tabs/TabsItem.vue:88` (`rootRef`), `Snackbar/SnackbarQueue.vue:80` (`container`). **Anti-precedent**: `Carousel/CarouselNext.vue:57`, `CarouselItem.vue:79`, `CarouselLiveRegion.vue:64` use `rootEl` for the AtomExpose holder — that name belongs to the toRef-derived element, not the ref-of-wrapper.
- **Always** route the access through `toElement` (`#v0/composables/toElement`). The raw `as HTMLElement | null | undefined` cast bypasses the normalization layer that handles ref-vs-direct-element variants and is the bug-family flagged in the saved-memory `toElement-template-refs.md`. Tabs, Treeview, and similar components carry the legacy raw-cast form pending a sweep.
- **Wrap in `toRef(() => ...)`** so downstream consumers (`watch`, `useResizeObserver`, `useIntersectionObserver`, popover attach) get a reactive ref instead of a snapshot.
- **`?? null` only — no `as HTMLElement | null` cast on the ref.** `toElement` returns `Element | undefined`. The historical pattern `as HTMLElement | null ?? null` (Image / Carousel × 4) papers over both transitions with a single misleading cast — TS thinks it's `HTMLElement | null` but the runtime value is `Element | null` after the coalesce. Drop the cast: write `toElement(...) ?? null` and let the ref be `Ref<Element | null>`. If a consumer needs HTMLElement-specific properties (`offsetWidth`, `offsetHeight`), cast at the use site (`(el.value as HTMLElement).offsetWidth`) — the boundary cast is honest about what's happening.
- **Name the resulting element ref `el`** when the SFC has only one Atom, or `{position}El` (`rootEl`, `triggerEl`) when there are multiple. Never `elementRef` or `atomElement` — single-word `el` is the precedent across Image, Carousel × 4, Overflow.

Worked precedents (current form):

- `packages/0/src/components/Overflow/OverflowIndicator.vue` — `el`, used for ResizeObserver and own-width measurement; HTMLElement cast at the `offsetWidth` use site only.

Legacy precedents (still carrying the `as HTMLElement | null ?? null` chain pending sweep):

- `packages/0/src/components/Image/ImageRoot.vue:94`
- `packages/0/src/components/Carousel/CarouselNext.vue:72`, `CarouselPrevious.vue:72`, `CarouselProgress.vue:75`, `CarouselLiveRegion.vue:79`

### Naming conventions for exposed methods

When a sub-component exposes imperative methods alongside `AtomExpose`, follow these conventions:

- **Interface name.** `{Component}Expose` (e.g., `SplitterRootExpose`, `SplitterPanelExpose`). Exported from the SFC's regular script so the parent can import and type its template ref.
- **Method names.** Imperative verbs: `collapse()`, `expand()`, `distribute()`. Never `onCollapse()` — `on*` is for props that accept callbacks, not for methods you call on a ref.
- **Property names.** Same `is<State>` convention as slot props: `isCollapsed`, `dragging`, `size`. Read-only from the outside; types should reflect that with `Readonly<Ref<T>>` (PHILOSOPHY §4.2).

```ts
// packages/0/src/components/Splitter/SplitterPanel.vue:144
export interface SplitterPanelExpose {
  collapse: () => void
  expand: () => void
  size: Readonly<Ref<number>>
  isCollapsed: Readonly<Ref<boolean>>
}

defineExpose<SplitterPanelExpose>({ collapse, expand, size, isCollapsed })
```

### When to expose

- **Always** expose `AtomExpose` when the sub-component wraps an `Atom` and an outer parent might need the underlying element (focus management, roving tabindex, pointer tracking, `useResizeObserver`).
- **Add** imperative methods only when they cannot reasonably be driven by a prop or a slot — e.g., trigger an animation in response to an external event, move focus programmatically, imperatively distribute percentages across Splitter panels.
- **Never** expose the raw reactive state directly. Always wrap consumer-visible state in `Readonly<Ref<T>>` so mutating it from outside does not corrupt the component's internal contract.

## Sub-component registry tracking

Compound components with multiple child instances (Tabs, Pagination, Combobox, Splitter, Treeview) register each child with a Root-owned registry so the Root can iterate, seek, focus, and re-index them. The pattern is uniform; the Root exposes `register(input)` and `unregister(id)` as public API, and sub-components call both during their own lifecycle. Cross-linked to PHILOSOPHY §6.3 (element refs), §6.8 (register/unregister lifecycle).

### Parent API contract

The Root component provides a context with a registry-shaped API:

```ts
// Simplified TabsRoot context
interface TabsRootContext {
  register: (input: TabsItemTicketInput) => TabsItemTicket
  unregister: (id: ID) => void
  values: () => TabsItemTicket[]
  get: (id: ID) => TabsItemTicket | undefined
  seek: (direction: 'first' | 'last' | 'next' | 'prev') => TabsItemTicket | undefined
  // ... plus model/selection methods from the spread parent
}
```

`register` returns the full ticket (typed per the `TabsItemTicketInput` → `TabsItemTicket` pair — PHILOSOPHY §6.2). The child holds onto `ticket.id` for its unregister call and `ticket.disabled`/`ticket.isSelected`/etc. for its own render.

### Child lifecycle

```ts
// packages/0/src/components/Tabs/TabsItem.vue (abridged)
const tabs = useTabsRoot(namespace)

// Setup phase — register synchronously, before DOM paint
const ticket = tabs.register({ id, value, disabled, el })

// Component reads its own ticket state for rendering
const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(tabs.disabled))

// Unregister on unmount (use onBeforeUnmount, not onUnmounted — PHILOSOPHY §7.3)
onBeforeUnmount(() => {
  tabs.unregister(ticket.id)
})
```

### Worked examples in source

- **`packages/0/src/components/Tabs/`** — `TabsItem` registers with `TabsRoot`; Root exposes `seek()` and `selectedItem` so keyboard navigation can move across siblings. Element `el` is passed in the ticket for direct focus.
- **`packages/0/src/components/Pagination/`** — `PaginationItem` registers with `PaginationRoot`; Root owns the current page and drives disabled state into each item.
- **`packages/0/src/components/Combobox/`** — `ComboboxItem` registers with `ComboboxRoot`; Root owns virtual focus via `useVirtualFocus(registry)` and filtering via `createFilter(registry)`.
- **`packages/0/src/components/Splitter/`** — `SplitterPanel` registers with `SplitterRoot`; Root owns the size distribution across siblings and redistributes when panels mount/unmount.
- **`packages/0/src/components/Treeview/`** — `TreeviewItem` registers with `TreeviewRoot`; Root exposes the nested-selection API (createNested) for tree traversal.

When building a new compound, pick the closest analog above and mirror its register/unregister shape.

## Global plugin hook-up — decision tree

Not every component needs to reach for a global plugin. Integrate a plugin only when the component's behavior depends on app-level state that must be shared across siblings or survive across routes. Over-integration creates unnecessary installation friction; under-integration forces consumers to re-implement cross-cutting concerns.

### Decision tree

```
Does the component need cross-cutting state or adapter-based config?
├─ No  → don't hook up any plugin. The component is self-contained.
├─ Yes → which plugin?
│   ├─ Needs user-facing strings (labels, errors, formatted dates) → useLocale()
│   │   Example: every interactive component
│   ├─ Needs theme tokens / dark mode awareness → useTheme()
│   │   Example: usually none — v0 is headless, theming is a Paper concern
│   ├─ Needs feature-flag gating → useFeatures()
│   │   Example: components gated behind experimental flags in docs/dev
│   ├─ Needs permission gating → usePermissions()
│   │   Example: admin-only actions, role-restricted UI
│   ├─ Needs layered z-index coordination → useStack()
│   │   Example: Dialog, Popover, Snackbar, Tour (anything that floats)
│   ├─ Needs structured logging → useLogger()
│   │   Example: warnings on duplicate registration, invalid config (PHILOSOPHY §9.2)
│   ├─ Needs user notifications → useNotifications()
│   │   Example: Snackbar, toast-like components
│   ├─ Needs date/number adapters → useDate(), useLocale()
│   │   Example: DatePicker, NumberField
│   └─ Needs RTL direction awareness → useRtl()
│       Example: Splitter, anything with horizontal layout
```

### Real examples in source

- **`useLocale()`** — called in `Dialog`, `Combobox`, `Select`, `Pagination`, every component that ships user-facing strings. Required for WCAG 4.1.2 (accessible name).
- **`useStack()`** — called in `Dialog`, `Popover`, `Scrim`, `Tour`. Without it, floating layers fight over z-index.
- **`useLogger()`** — called inside `createRegistry`, `createSelection`, etc., for warnings. Not usually called directly in components.
- **`useNotifications()`** — called in `Snackbar` and any component that pushes runtime notifications.

### When *not* to hook up a plugin

- The component is pure-logic and has no user-facing string (`Atom`, `Portal`, `Presence`).
- The component has strings but they're all consumer-supplied via slots (`DataTable` headers, `Pagination` labels if the consumer overrides).
- The component is a primitive meant to compose into others (`useRovingFocus`, `useClickOutside`).

When uncertain, don't hook up. Adding a plugin later is a non-breaking change; removing one is a breaking change. [intent:109]

## Checklist

- [ ] Directory follows compound pattern (Root + sub-components + `index.ts` + `index.test.ts`) unless in the exceptions list
- [ ] All imports in `<script lang="ts">`, zero in `<script setup>`
- [ ] `defineOptions({ name: '...' })` present
- [ ] Props interface extends `AtomProps` and does not re-declare `as` / `renderless`
- [ ] Defaults in destructuring, never in interface
- [ ] Slot props typed as `ComponentRootSlotProps` with `is<State>` booleans and `attrs` object
- [ ] `slotProps` computed via `toRef`
- [ ] Data attributes use `true | undefined`, not `true | false`
- [ ] `aria-disabled` always boolean; `data-disabled` always `true | undefined`
- [ ] All user-facing strings through `useLocale()`
- [ ] Three-pronged disabled (`aria-disabled`, `data-disabled`, tabindex)
- [ ] Hidden input conditionally rendered with `v-if="name"`
- [ ] Barrel: no `export *` from `.vue`, named exports plus compound object
- [ ] Template root is `<Atom :as :renderless>` and uses `<slot v-bind="slotProps" />`
- [ ] `v-if` for structural conditionals; `v-show` only when the element must stay mounted (registry-driven visibility, load-state preservation, virtualization)
- [ ] `onBeforeUnmount` for deregistration, not `onUnmounted`
- [ ] Zero utility classes; all `:style` bindings structural
- [ ] `register()` called in setup; `unregister()` called in `onBeforeUnmount`
- [ ] Compound sub-components propagate `AtomExpose` and add their own `{Component}Expose` interface when exposing imperative methods
- [ ] Same-SFC Atom element access uses `toRef(() => toElement(atomRef.value?.element) as HTMLElement | null ?? null)` named `el` / `rootEl`, never a raw cast or `elementRef` name
- [ ] ARIA roles, keyboard handlers, and WCAG success criteria mapped for every interactive component
- [ ] No raw `inject` / `provide` — context always via `createContext`
- [ ] Global plugins hooked up only when the component genuinely depends on app-level state
- [ ] Multi-source `attrs` forwarding uses `mergeProps`, not spread
- [ ] Props destructured directly (never `withDefaults`)
- [ ] Local mirrors of props named `_option`, not `optionProp`
- [ ] No comments that restate the next line
