---
title: createCombobox - Orchestrator Composable for Combobox Components
meta:
- name: description
  content: Orchestrator composable that coordinates selection, popover, virtual focus, and adapter-based filtering for building combobox and autocomplete components.
- name: keywords
  content: createCombobox, combobox, autocomplete, composable, filtering, virtual focus, Vue 3, headless
features:
  category: Composable
  label: 'E: createCombobox'
  github: /composables/createCombobox/
  level: 2
related:
  - /composables/selection/create-selection
  - /composables/system/use-virtual-focus
  - /components/forms/combobox
---

# createCombobox

Low-level combobox coordinator for custom implementations. Most users should use the `Combobox` component instead.

<DocsPageFeatures :frontmatter />

## Usage

```ts collapse
import { createCombobox } from '@vuetify/v0'

const combobox = createCombobox({ strict: true })

// Register items with the underlying selection
combobox.selection.register({ id: 'apple', value: 'Apple' })
combobox.selection.register({ id: 'banana', value: 'Banana' })
combobox.selection.register({ id: 'cherry', value: 'Cherry' })

// Open the dropdown
combobox.open()

// Select an item — in single mode this updates the query and closes
combobox.select('banana')
// combobox.query.value === 'Banana'
// combobox.isOpen.value === false

// Filter is pristine after selection — all items still visible
// combobox.pristine.value === true

// Once user types, the filter activates
combobox.query.value = 'ch'
// combobox.pristine.value === false
// combobox.filtered.value === Set { 'cherry' }
```

## Context / DI

### Context Object

`createCombobox` returns a `ComboboxContext` with the following API surface:

| Member | Type | Description |
| - | - | - |
| `open()` | `() => void` | Opens the dropdown |
| `close()` | `() => void` | Closes; applies strict revert if needed |
| `toggle()` | `() => void` | Opens or closes |
| `select(id)` | `(id: ID) => void` | Selects an item by ID |
| `clear()` | `() => void` | Resets query and deselects all |
| `id` | `string` | Base ID used for ARIA relationships |
| `inputId` | `string` | `${id}-input` |
| `listboxId` | `string` | `${id}-listbox` |
| `multiple` | `boolean` | Resolved multiple flag |
| `strict` | `MaybeRefOrGetter<boolean>` | Strict option ref |
| `disabled` | `MaybeRefOrGetter<boolean>` | Disabled option ref |
| `name` | `string \| undefined` | Form field name |
| `form` | `string \| undefined` | Associated form ID |

### Dependency Injection

Use `createComboboxContext` to get a DI-aware trinity for component-based setups:

```ts
import { createComboboxContext, useCombobox } from '@vuetify/v0'

// In a Root component
const [useMyCombobox, provideMyCombobox, context] = createComboboxContext({
  namespace: 'my-combobox',
  strict: true,
})
provideMyCombobox(context)

// In any child component
const combobox = useCombobox('my-combobox')
```

`useCombobox(namespace?)` injects the nearest combobox context (default namespace: `'v0:combobox'`).

## Adapters

Adapters extend `ComboboxAdapter` and translate a reactive query into a filtered ID set.

```ts
abstract class ComboboxAdapter {
  abstract setup (context: ComboboxAdapterContext): ComboboxAdapterResult
}

interface ComboboxAdapterResult {
  filtered: Ref<Set<ID>>          // IDs that should be visible
  isLoading: ShallowRef<boolean>  // shows loading state in the UI
  isEmpty: Ref<boolean>           // true when no items match the query
}
```

The `context` exposes `query` (the current search string), `selection` (the underlying selection context), and `items` (all registered IDs). Return the three refs above and the combobox wires them to the dropdown state automatically.

### ClientComboboxAdapter

The default. Filters registered items locally using substring matching (case-insensitive). Pass custom `filter` options to override the matching logic:

```ts
import { ClientComboboxAdapter, createCombobox } from '@vuetify/v0'

const combobox = createCombobox({
  adapter: new ClientComboboxAdapter({
    filter: (query, value) => String(value).toLowerCase().startsWith(query.toLowerCase()),
  }),
})
```

### ServerComboboxAdapter

A pass-through adapter that shows all registered items and sets `isLoading` to `false`. Use this when filtering is performed server-side — watch `combobox.query` to drive your own fetch:

```ts
import { ServerComboboxAdapter, createCombobox, useCombobox } from '@vuetify/v0'
import { watch } from 'vue'

const combobox = createCombobox({ adapter: new ServerComboboxAdapter() })

// In a component that injects the context:
const { query } = useCombobox()

watch(query, async q => {
  const results = await fetch(`/api/search?q=${q}`).then(r => r.json())
  // Update items via combobox.selection.register / unregister
})
```

> [!TIP]
> See the [Combobox server example](/components/forms/combobox#server-side-filtering) for a complete integration.

## Architecture

`createCombobox` orchestrates four independent primitives without extending their chains — it composes them. The adapter translates queries into a filtered set; virtual focus uses that set to skip hidden items.

```mermaid "createCombobox Architecture"
flowchart TD
  createSelection["createSelection"]
  useVirtualFocus["useVirtualFocus"]
  usePopover["usePopover"]
  Adapter["ClientComboboxAdapter / ServerComboboxAdapter"]
  createCombobox["createCombobox"]:::primary
  query["query (ShallowRef)"]
  pristine["pristine (ShallowRef)"]
  filtered["filtered (Ref<Set>)"]

  createSelection --> createCombobox
  useVirtualFocus --> createCombobox
  usePopover --> createCombobox
  Adapter --> createCombobox
  createCombobox --> query
  createCombobox --> pristine
  createCombobox --> filtered
```

## Options

```ts
interface ComboboxOptions {
  multiple?: MaybeRefOrGetter<boolean>   // Enable multi-select
  mandatory?: MaybeRefOrGetter<boolean>  // Prevent deselecting last item
  disabled?: MaybeRefOrGetter<boolean>   // Disable all interaction
  strict?: MaybeRefOrGetter<boolean>     // Revert query on close if no match
  adapter?: ComboboxAdapter              // Filtering strategy (default: ClientComboboxAdapter)
  displayValue?: (value: unknown) => string  // Format selected value for display in input
  id?: string                            // Base ID for ARIA attributes
  name?: string                          // Hidden input name for form submission
  form?: string                          // Associated form ID
}
```

## Reactivity

| Property | Type | Reactive | Notes |
| - | - | :-: | - |
| `query` | `ShallowRef<string>` | <AppSuccessIcon /> | Current input text |
| `pristine` | `ShallowRef<boolean>` | <AppSuccessIcon /> | `true` after selection; `false` once user types |
| `filtered` | `Ref<Set<ID>>` | <AppSuccessIcon /> | IDs that pass the current filter |
| `isEmpty` | `Ref<boolean>` | <AppSuccessIcon /> | `true` when filtered set is empty |
| `isLoading` | `ShallowRef<boolean>` | <AppSuccessIcon /> | Forwarded from adapter |
| `isOpen` | `ShallowRef<boolean>` | <AppSuccessIcon /> | Popover open state |
| `selection` | `SelectionContext` | — | Full selection API |
| `popover` | `PopoverReturn` | — | Popover positioning API |
| `cursor` | `VirtualFocusReturn` | — | Keyboard focus API |
| `inputEl` | `ShallowRef<HTMLElement \| null>` | <AppSuccessIcon /> | Reference to the `<input>` element |

## Examples

::: gn-example
/composables/create-combobox/useCountrySearch.ts 1
/composables/create-combobox/CountryAutocomplete.vue 2
/composables/create-combobox/country-autocomplete.vue 3

### Country Autocomplete

A fully custom country picker built directly on `createCombobox` with the default [ClientComboboxAdapter](/composables/forms/create-combobox). The composable registers a dozen countries into the underlying `selection` registry; the adapter filters the visible set on every keystroke, and `cursor` (the [useVirtualFocus](/composables/system/use-virtual-focus) surface) tracks the keyboard-highlighted row independently of real DOM focus. A separate panel mirrors the confirmed selection, so the example shows both halves of an autocomplete: the typeahead input and the value display it feeds.

State and view are split deliberately. `useCountrySearch` owns the data and the coordinated state — it returns the `combobox` context plus a `selected` getter derived from `selection.selectedIds` — while `CountryAutocomplete` owns the markup and the DOM events. The composable never touches events; the component wires `onInput`, `onKeydown`, and `@focus` to drive the context, exactly mirroring how `createCombobox` expects a host to feed it. Arrow keys call `cursor.next()` / `cursor.prev()`, Enter reads `cursor.highlightedId` and routes to `select(id)`, and Escape calls `close()`. Closing resets `query` and `pristine`, so the `display` getter falls back to the last selected ticket — the input reverts to the confirmed selection without any extra option.

ARIA wiring is manual but mechanical: `role="combobox"`, `aria-controls`, `aria-expanded`, `aria-autocomplete`, and `aria-activedescendant` are set on the input from the IDs the context vends (`inputId`, `listboxId`, `id`), and each option row carries `role="option"`, `aria-selected`, and a stable per-option id so screen readers can correlate the highlighted row. Reach for this approach when you need full control over the markup; prefer the [Combobox component](/components/forms/combobox) when the defaults suffice, and see [createSelection](/composables/selection/create-selection) for the selection layer underneath.

| File | Role |
|------|------|
| `useCountrySearch.ts` | Creates the combobox, registers countries, derives the selected country |
| `CountryAutocomplete.vue` | Renders the input and listbox; owns the keyboard and input events |
| `country-autocomplete.vue` | Wires the composable to the component and shows the selected-value panel |
:::

## Recipes

### Strict Mode

When `strict: true`, closing the dropdown without an active selection reverts the query:

- If an item is selected, `query` resets to that item's label.
- If nothing is selected, `query` resets to `''`.

Non-strict mode (default) leaves whatever text the user typed in place.

> [!TIP]
> `aria-autocomplete="both"` is set automatically on the input when `strict` is enabled, per the WAI-ARIA combobox pattern.

### Pristine Flag

`pristine` tracks whether the query reflects the current selection or is a live filter:

- Starts as `true` (no user input yet).
- Becomes `false` when the user types — the adapter receives the raw query.
- Resets to `true` after a selection (`select(id)`), so reopening the dropdown always shows all items instead of the previous typed query.

```ts
// The adapter receives `search`, not `query` directly
const search = toRef(() => pristine.value ? '' : query.value)
const { filtered } = adapter.setup({ query: search, items })
```

### Multi-Select Behavior

In `multiple` mode, `select(id)` differs from single mode:

- Toggles the item (select → deselect on second click) via `selection.toggle()`.
- Clears the query so the user can search for the next item.
- Keeps the dropdown open.
- Highlights the clicked item via `cursor.highlight(id)` so ArrowDown continues from that position.
- Refocuses the input so keyboard navigation continues immediately.

## FAQ

::: faq

??? When should I use createCombobox vs the Combobox component?

createCombobox is the low-level coordinator for fully custom markup and ARIA wiring. Most apps should use the [Combobox component](/components/forms/combobox), which wraps it with sensible defaults — only drop to the composable when you need full control over the rendered structure.

??? What does the `pristine` flag do?

`pristine` is `true` when the query reflects the current selection and `false` once the user types. It resets to `true` after `select(id)`, so reopening the dropdown shows all items instead of the previous typed query.

??? How do I filter options against a server instead of locally?

Pass `new ServerComboboxAdapter()` and watch `combobox.query` to drive your own fetch, registering or unregistering items through `combobox.selection`. The default `ClientComboboxAdapter` does case-insensitive substring matching in memory.

??? What does `strict` mode do?

With `strict: true`, closing the dropdown without a live match reverts `query` — to the selected item's label if one is selected, otherwise to `''`. Non-strict (the default) leaves whatever the user typed. It also sets `aria-autocomplete="both"` per the WAI-ARIA pattern.

??? How does `select(id)` behave in multiple mode?

It toggles the item, clears the query so the user can search for the next one, keeps the dropdown open, highlights the clicked item via `cursor.highlight(id)`, and refocuses the input — so keyboard navigation continues from that position.

??? What is `cursor` and why isn't it real DOM focus?

`cursor` is the [useVirtualFocus](/composables/system/use-virtual-focus) surface — it tracks the keyboard-highlighted option through `aria-activedescendant` while real focus stays in the input. Arrow keys call `cursor.next()` / `cursor.prev()`, and Enter reads `cursor.highlightedId` to route to `select(id)`.

:::

<DocsApi />
