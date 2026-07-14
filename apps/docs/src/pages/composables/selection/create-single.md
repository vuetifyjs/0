---
title: createSingle - Single-Selection State for Vue 3
meta:
- name: description
  content: Single-item selection with automatic deselection. Extends createSelection for radio buttons, tabs, and exclusive choice patterns. Base for theme/locale.
- name: keywords
  content: createSingle, single selection, radio button, tabs, exclusive, composable, Vue 3, state management
features:
  category: Composable
  label: 'E: createSingle'
  github: /composables/createSingle/
  level: 2
related:
  - /composables/selection/create-selection
  - /composables/selection/create-step
  - /components/providers/single
---

# createSingle

Extends `createSelection` to enforce single-item selection, automatically clearing the previous selection.

<DocsPageFeatures :frontmatter />

## Usage

The `createSingle` composable is used when you have a **collection of items** but want to allow **only one** to be selected at any time.

```ts collapse no-filename
import { createSingle } from '@vuetify/v0'

const single = createSingle()

// Register items first
single.register({ id: 'apple', value: 'Apple' })
single.register({ id: 'banana', value: 'Banana' })

// Select by ID
single.select('apple')
console.log(single.selectedId.value) // 'apple'
console.log(single.selectedValue.value) // 'Apple'

// Selecting a new item automatically clears the previous selection
single.select('banana')
console.log(single.selectedId.value) // 'banana' (replaces apple)
```

## Context / DI

Use `createSingleContext` to share a single-selection instance across a component tree:

```ts
import { createSingleContext } from '@vuetify/v0'

export const [useTabSelection, provideTabSelection, tabSelection] =
  createSingleContext({ namespace: 'my:tabs', mandatory: true })

// In parent component
provideTabSelection()

// In child component
const selection = useTabSelection()
selection.select('tab-home')
```

## Architecture

The `createSingle` composable is comprised of the following hierarchy:

```mermaid "Single Selection Hierarchy"
flowchart TD
  createRegistry --> createModel
  createModel --> createSelection
  createSelection --> createSingle
```

## Reactivity

Single-selection state is **always reactive**. All computed properties update automatically when the selection changes.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `selectedId` | <AppSuccessIcon /> | Computed from `selectedIds` |
| `selectedItem` | <AppSuccessIcon /> | Computed from `selectedId` |
| `selectedValue` | <AppSuccessIcon /> | Computed from `selectedItem` |
| `selectedIndex` | <AppSuccessIcon /> | Computed from `selectedItem` |
| ticket `isSelected` | <AppSuccessIcon /> | Computed from `selectedIds` |

> [!TIP] Perfect for UI controls
> `selectedId`, `selectedValue`, and `selectedIndex` work directly in templates without any extra setup.

> [!NOTE] Prefer the Single component for `v-model`
> For a ready-made `v-model` surface, use [Single](/components/providers/single). This composable is the logic layer underneath — drive it with `select()` / `selectedId` / `selectedValue`, or wrap it in your own component.

## Examples

::: gn-example
/composables/create-single/useThemePicker.ts 1
/composables/create-single/ThemeSwatches.vue 2
/composables/create-single/theme-picker.vue 3

### Theme Picker

A single-selection color theme switcher built entirely from `createSingle`. The composable owns the palette data and registers each theme as a ticket; clicking a swatch selects it exclusively and automatically deselects the previous choice, so the preview panel always reflects exactly one active palette. State lives in `useThemePicker.ts`, the swatch grid renders in `ThemeSwatches.vue`, and the entry file wires them together with a live preview and a state readout.

The example leans on three parts of the API working together. `onboard()` bulk-registers the five themes up front and returns one ticket per item, so the swatch component iterates `tickets` directly — calling `ticket.select()` and reading `ticket.isSelected` without routing back through the parent instance. `mandatory: true` keeps the selection sticky: once a theme is active, clicking it again is a no-op, guaranteeing the preview never renders an empty state. `seek('first')?.select()` preselects the first item on mount so the UI starts valid rather than blank, and the composable re-exports `selectedValue`, `selectedId`, `selectedIndex`, and `size` as flat derived refs so consumers never reach into the underlying instance.

Reach for this whenever a fixed set of mutually exclusive options needs the selected *value* — not just its id — reactively available for rendering: theme pickers, density toggles, segmented controls. The trade-off of `mandatory` is that there is no "nothing selected" state; if you need one, omit it and guard the consumer on `selectedValue` being `undefined`. For ordered next/prev navigation over the same selection, see [createStep](/composables/selection/create-step); for the multi-select parent, see [createSelection](/composables/selection/create-selection).

| File | Role |
|------|------|
| `useThemePicker.ts` | Owns the theme data and the `createSingle` instance; exposes tickets and flat derived selection refs |
| `ThemeSwatches.vue` | Renders the swatch grid, selecting a theme on click via `ticket.select()` |
| `theme-picker.vue` | Entry point — wires the composable to the swatches, live preview, and state readout |

:::

## FAQ

::: faq

??? When should I use createSingle vs createStep?

createSingle is exclusive selection with no inherent order. Reach for [createStep](/composables/selection/create-step) when the items form a sequence you navigate with `next()`/`prev()`/`first()`/`last()` — wizards, carousels, steppers. createStep extends createSingle.

??? How do I prevent an empty "nothing selected" state?

`mandatory` accepts three modes (inherited from [createSelection](/composables/selection/create-selection)):

| Value | Behavior |
| - | - |
| `false` (default) | Empty selection allowed |
| `true` | Blocks deselecting the last item; does **not** auto-select on register |
| `'force'` | Auto-selects the first non-disabled item on register/onboard **and** blocks empty |

With `true`, preselect on mount (`seek('first')?.select()`) so the UI starts valid. With `'force'`, registration itself picks the first item — you usually skip the manual seek.

??? Can I read the selected value directly, not just its id?

Yes. `selectedId`, `selectedValue`, and `selectedIndex` are all reactive and work directly in templates — `selectedValue` gives the registered value, not just the id.

:::

<DocsApi />
