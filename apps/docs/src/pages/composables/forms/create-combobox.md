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

// Select an item — in single mode this updates display and closes
combobox.select('banana')
// combobox.display.value === 'Banana'
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
| `close()` | `() => void` | Closes and resets query/pristine (always discards uncommitted text; does not commit) |
| `toggle()` | `() => void` | Opens or closes |
| `commit()` | `() => void` | Commits typed text (exact browse match, or mint when `!strict`); empty, pristine, or strict-unmatched just close |
| `select(id)` | `(id: ID) => void` | Selects an item by ID |
| `clear()` | `() => void` | Resets query and deselects all |
| `id` | `string` | Base ID used for ARIA relationships |
| `inputId` | `string` | `${id}-input` |
| `listboxId` | `string` | `${id}-listbox` |
| `multiple` | `Readonly<Ref<boolean>>` | Multiple-select flag |
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

The `context` exposes `{ query, items }`, where `items` is the registered ticket list (ad-hoc free-text tickets excluded). Return the three refs above and the combobox wires them to the dropdown state automatically.

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

Dropdown placement is a separate seam: pass `positionAdapter` (a `PopoverAdapter`) rather than reusing `adapter`. Default is CSS anchor positioning; swap in `FloatingUIPopoverAdapter` from `@vuetify/v0/popover/adapters/floating-ui` the same way as [usePopover](/composables/system/use-popover#adapters).

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
  strict?: MaybeRefOrGetter<boolean>     // Constrain accepted values to registered options; unmatched text is discarded on confirm (Enter/Tab/click-outside)
  adapter?: ComboboxAdapter              // Filtering strategy (default: ClientComboboxAdapter)
  positionAdapter?: PopoverAdapter       // Dropdown positioning engine (default: V0PopoverAdapter)
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

State and view are split deliberately. `useCountrySearch` owns the data and the coordinated state — it creates a `createComboboxContext({ namespace: 'v0:country-combobox' })` trinity, registers countries, and returns the context plus a `selected` getter derived from `selection.selectedIds`. The parent calls `provideCountryCombobox`; `CountryAutocomplete` injects via `useCountryCombobox`. The composable never touches events; the component wires `onInput`, `onKeydown`, and `@focus` to drive the context. Arrow keys call `cursor.next()` / `cursor.prev()`. Enter reads `cursor.highlightedId` and routes to `select(id)`, or to `commit()` when nothing is highlighted. Tab does the same accept path — selecting a highlighted unselected option, otherwise `commit()` — then `close()` so the listbox doesn't linger; it does not preventDefault, so focus can move on. Pointer dismiss uses [useClickOutside](/composables/system/use-click-outside) to `commit()` then `close()` (query only, ignoring leftover virtual focus). Escape and any other `close()` discard uncommitted text. Closing without commit still reverts the input via `pristine` + `display` falling back to the last selected ticket.

ARIA wiring is manual but mechanical: `role="combobox"`, `aria-controls`, `aria-expanded`, `aria-autocomplete="list"`, and `aria-activedescendant` are set on the input from the IDs the context vends (`inputId`, `listboxId`, `id`), and each option row carries `role="option"`, `aria-selected`, and a stable per-option id so screen readers can correlate the highlighted row. Reach for this approach when you need full control over the markup; prefer the [Combobox component](/components/forms/combobox) when the defaults suffice, and see [createSelection](/composables/selection/create-selection) for the selection layer underneath.

| File | Role |
|------|------|
| `useCountrySearch.ts` | Creates the combobox, registers countries, derives the selected country |
| `CountryAutocomplete.vue` | Renders the input and listbox; owns the keyboard and input events |
| `country-autocomplete.vue` | Wires the composable to the component and shows the selected-value panel |
:::

## Recipes

### Strict Mode

`strict` constrains accepted values to registered options. Confirming with Enter, Tab, or click-outside:

- Non-strict (default): `commit()` mints a ticket for unmatched text, selects it, and emits it.
- Strict: unmatched text is discarded; the dropdown closes.

`close()` and Escape always discard uncommitted text — they never commit. After close, `pristine` is true so `display` falls back to the selected ticket's label (or `''` if nothing is selected).

### Pristine Flag

`pristine` tracks whether the query reflects the current selection or is a live filter:

- Starts as `true` (no user input yet).
- Becomes `false` when the user types — the adapter receives the raw query.
- Resets to `true` after `select(id)` or `commit()`, and `query` is cleared, so the adapter sees an empty query and unfilters. Reopening the dropdown always shows all items.

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

With `strict: true`, confirming unmatched text (Enter, Tab, or click-outside) discards it and closes; only registered options can be chosen. Non-strict (the default) commits the typed value as a new selection. `close()` and Escape always discard uncommitted text. `aria-autocomplete` is set by `Combobox.Control`, not this composable.

??? How does `select(id)` behave in multiple mode?

It toggles the item, clears the query so the user can search for the next one, keeps the dropdown open, highlights the clicked item via `cursor.highlight(id)`, and refocuses the input — so keyboard navigation continues from that position.

??? What is `cursor` and why isn't it real DOM focus?

`cursor` is the [useVirtualFocus](/composables/system/use-virtual-focus) surface — it tracks the keyboard-highlighted option through `aria-activedescendant` while real focus stays in the input. Arrow keys call `cursor.next()` / `cursor.prev()`, and Enter reads `cursor.highlightedId` to route to `select(id)`.

:::

<DocsApi />
