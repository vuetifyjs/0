---
title: EmList - Emerald List for Vue
meta:
- name: description
  content: Emerald's selectable list — media, content and meta parts on a native-button row, single selection through v-model, composed on Vuetify0's headless Single provider.
- name: keywords
  content: emerald list, vue list, selectable list, master detail list, list item vue, vuetify0 single, paper emerald
features:
  category: Component
  label: 'C: EmList'
  level: 2
  renderless: false
  order: 16
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/providers/single
---

# EmList

<DocsPageFeatures :frontmatter />

A single-select list of structured rows — media, content and meta parts on a real button, with the selection flowing through `v-model`.

## Usage

`EmList` renders a `<ul>` and owns the selection; each `EmListItem` is an `<li>` wrapping a row host — a native `<button>` by default — registered under its `value`. Clicking a row selects it and writes its `value` to `v-model`; clicking the selected row again deselects it, unless `mandatory` says otherwise.

The parts inside a row are free-form. `EmListItemMedia`, `EmListItemContent` with its `EmListItemTitle` and `EmListItemSubtitle`, and `EmListItemMeta` are presentational spans that give a row the classic leading-graphic / text-block / trailing-detail shape, and any of them can be omitted or reordered.

::: ds-example
/systems/emerald/list/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmList } from '@paper/emerald'
</script>

<template>
  <EmList>
    <EmList.Item>
      <EmList.ItemMedia />

      <EmList.ItemContent>
        <EmList.ItemTitle />

        <EmList.ItemSubtitle />
      </EmList.ItemContent>

      <EmList.ItemMeta />
    </EmList.Item>
  </EmList>
</template>
```

## Composed on v0

`EmList` renders v0's [Single](/components/providers/single) compound. `Single.Root` and `Single.Item` are both renderless, so the elements are all Emerald's: the root provides the selection context around a real `<ul>`, and each item resolves its state inside an `<li>` and binds it onto the row host. The split is clean — v0 owns registration, the exclusive-selection rule, `mandatory` enforcement and the disabled resolution (a row is disabled when either it or the list is); Emerald owns the markup, the data attributes and every pixel.

One deliberate deviation is worth knowing. `Single.Item` offers listbox-flavored `attrs` — `role="option"`, `aria-selected`, a tabindex — and `EmListItem` binds only the click handler and the state attributes, not the role. The list is not a listbox: there is no roving focus and no typeahead, and a bare `option` outside a `listbox` misleads assistive technology worse than an honest button. Each row is a plain button that marks its selection with `aria-current` instead.

The underlying logic, if you want it without the styling, is [createSingle](/composables/selection/create-single).

## Examples

::: ds-example
/systems/emerald/list/parts

### Row anatomy

The full shape: an avatar in `EmListItemMedia`, a title and subtitle stacked inside `EmListItemContent`, and a timestamp in `EmListItemMeta`. Media and meta are fixed-width; content takes the remaining space and is the part that gives its children permission to shrink — `EmListItemTitle` and `EmListItemSubtitle` clip to one line with an ellipsis rather than wrapping, so a long subject makes the row longer to read, never taller.

`EmListItem` forwards its attributes to the row host rather than the `<li>`, which is what makes the unread treatment here work: binding `data-unread` on the item lands the attribute on the button, and the list's stylesheet bolds the title underneath it. It is a styling hook the stylesheet ships and the row's data decides — the component itself has no unread prop.
:::

::: ds-example
/systems/emerald/list/mandatory

### Master-detail with mandatory

A detail pane driven by the list is the surface `mandatory` exists for. The default toggle behavior — click the selected row and it deselects — is right for optional choices, but a master-detail layout with nothing selected is a blank pane.

`mandatory="force"` closes both gaps: it auto-selects the first non-disabled row as the items register, so the pane is never empty on arrival, and it refuses to deselect the last selected row, so clicking the active row leaves it active. Plain `mandatory` (boolean) gives only the second guarantee — no deselection once something is chosen, but nothing selected until the reader acts.

Selection state is all the wiring the pane needs: derive the open record from `v-model` and render it. Paging, filtering and everything else stay on your side of the model.
:::

::: ds-example
/systems/emerald/list/rows

### Rows that carry their own controls

The default row host is a `<button>`, and a button cannot contain interactive children — nesting a star toggle inside it is invalid HTML with unpredictable focus behavior. `as` swaps the host for these rows: pass a non-interactive element and the row becomes a layout surface whose controls are its children.

The trade is explicit and total. With a non-button host, `EmListItem` wires no click handler, sets no `type`, and writes no native `disabled` attribute — the row itself no longer selects anything, and whatever interaction the row offers comes from the controls you place inside it. The state attributes still apply, so a row selected programmatically still shows its selected treatment.

Reach for this when the row is a container of actions rather than a choice — a repository row with a star, a contact card with an overflow menu. When the row itself is the choice *and* it needs a secondary action, prefer keeping the button row and placing the action outside it, as the mail layouts in larger apps do.
:::

## Props

### EmList

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmList.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T` | — | The selected row's `value`; `undefined` when nothing is selected |
| `mandatory` | `boolean \| 'force'` | `false` | `true` keeps the last selection from being toggled off; `'force'` additionally auto-selects the first non-disabled row |
| `disabled` | `boolean` | `false` | Disables the whole list. Every row resolves as disabled, and the `<ul>` gets `data-disabled` |
| `id` | `string` | — | Forwarded to the `<ul>` |
| `namespace` | `string` | — | Which v0 `Single` instance to provide. Only needed when nesting lists |

The default slot is the rows. There are no named slots.

### EmListItem

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmListItem.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `ID` | required | Registration value; what `v-model` becomes when the row is selected |
| `disabled` | `boolean` | `false` | Disables this row. A button host also gets the native `disabled` attribute |
| `as` | `string` | `'button'` | Row host element. Anything other than `button` renders a non-interactive row — no click wiring, no native disabled |
| `namespace` | `string` | — | Which v0 `Single` instance to bind to. Only needed when nesting |

Attributes bind to the row host, not the `<li>` — `class`, `data-unread` and friends land on the element the stylesheet targets. The host publishes `data-selected` and `data-disabled` for styling, plus `aria-current` when selected.

### Parts

`EmListItemMedia`, `EmListItemContent`, `EmListItemTitle`, `EmListItemSubtitle` and `EmListItemMeta` take no props — each renders a styled `<span>` around its default slot. Title and subtitle truncate to a single line; media and meta refuse to shrink; content flexes and stacks its children.

## Accessibility

The default row is a native `<button type="button">`, so focusability, the implicit `button` role, and activation by Enter and Space all come from the platform.

### Not a listbox

`EmList` deliberately ships no `role="listbox"` and no `role="option"`: there is no roving focus and no typeahead, and option semantics without a managed listbox around them promise keyboard behavior that does not exist. The honest shape is a `<ul>` of buttons — which is what this is.

The practical consequence is that every row is its own tab stop and there is no arrow-key navigation; Tab and Shift+Tab walk the rows. That is fine for the short-to-moderate lists this component is for. A very long list is better paired with a filter above it than navigated by key, and a true keyboard-operated selection surface (a combobox's panel, a select menu) belongs to components that implement the full pattern, like [EmSelect](/systems/emerald/select).

### Selection state

The selected row carries `aria-current="true"` — "the current item within a set" — alongside the `data-selected` styling hook. `aria-selected` is not used, because it belongs to the listbox/tab/grid roles this list intentionally does not claim.

### Disabled rows

A disabled button row gets the native `disabled` attribute: activation is blocked and the row leaves the tab order, so a keyboard user tabbing the list never encounters it. Disabling the whole list cascades — every button row is disabled natively, not just dimmed. Non-button hosts get only the `data-disabled` styling attribute; whatever controls you place inside them are yours to disable.

### Naming

A row's accessible name is the concatenated text of everything inside it — title, subtitle and meta together, in order. That is usually right for a structured row ("Sponsorship renewal, The invoice for the next quarter…, 09:41" reads like the row looks), but it means the meta part is part of the name: keep it short and meaningful, and keep purely decorative content inside the media part, where an icon or avatar contributes nothing to the name unless you label it.
