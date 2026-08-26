---
title: EmSelect - Emerald Select for Vue
meta:
- name: description
  content: Emerald's select — a compound of express parts over Vuetify0's headless Select, with listbox keyboard navigation, virtual focus and popover placement supplied by v0.
- name: keywords
  content: emerald select, vue select, listbox vue, multiple select, design system select, vuetify0 select
features:
  category: Component
  label: 'C: EmSelect'
  level: 2
  renderless: false
  order: 3
related:
  - /systems/emerald
  - /systems/emerald/text-field
  - /components/forms/select
---

# EmSelect

<DocsPageFeatures :frontmatter />

A single- or multi-select listbox, composed from express parts so the trigger and the options are yours to shape.

## Usage

Unlike `EmButton` and `EmTextField`, `EmSelect` has a variable tree — you decide what the trigger shows and what an option looks like — so it ships as a **compound** rather than a shell. Five parts, each a real component:

`EmSelect` owns the value and the open state. `EmSelectActivator` is the trigger. `EmSelectValue` renders the current selection and `EmSelectPlaceholder` renders when there is none. `EmSelectContent` is the popover, and `EmSelectItem` is one option in it.

`label` stays a prop on the root, because a field label has fixed anatomy even when the control does not.

::: ds-example
/systems/emerald/select/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmSelect } from '@paper/emerald'
</script>

<template>
  <EmSelect>
    <EmSelect.Activator>
      <EmSelect.Value />

      <EmSelect.Placeholder />
    </EmSelect.Activator>

    <EmSelect.Content>
      <EmSelect.Item />
    </EmSelect.Content>
  </EmSelect>
</template>
```

## Composed on v0

Every part maps one-to-one onto v0's [Select](/components/forms/select) compound — `Select.Root`, `Select.Activator`, `Select.Value`, `Select.Placeholder`, `Select.Content`, `Select.Item`. Emerald adds CSS and a caret; v0 supplies everything else.

"Everything else" is most of what a select is. `Select.Root` is built on v0's selection primitives, so `multiple` and `mandatory` are `createSelection` behaviors rather than props Emerald implements. The listbox roles, the roving `aria-activedescendant`, and the keyboard map are v0's. `Select.Content` renders through the native popover API, which is why the menu escapes overflow and stacking contexts without a floating library or a z-index to manage.

`Select` is a picker over a fixed set of options — it has no text entry and no type-to-filter. When you need the reader to type, either to filter a long list or to enter a value that is not in it, reach for [Combobox](/components/forms/combobox) instead; that is where v0 puts filtering and typeahead. Emerald does not wrap it yet.

One structural note: `Select.Root` is renderless, so the element you see is a plain `<div class="emerald-select">` that Emerald renders itself, with the `<label>` beside it pointing at the activator. That is why `label` is a prop on the root — there is a real element there to own it.

`EmSelectActivator` also appends the caret itself. It is Emerald's, not yours, which keeps the chevron consistent across every select in an app; it is pinned to 16px by a host rule rather than by a prop, taking advantage of `EmIcon`'s zero-specificity sizing.

## Examples

::: ds-example
/systems/emerald/select/multiple

### Multiple selection

`multiple` turns the model into an array and lets items accumulate. The type follows: `v-model` is `T` for a single select and `T[]` here, so bind a `ref([])`, matching the house rule that arrays and objects get `ref` and primitives get `shallowRef`.

Nothing about the binding forces that choice — each toggle assigns a **fresh array** rather than mutating the one you passed, so a `shallowRef` would track it too. Prefer `ref` for the array you own and read elsewhere, and reach for `shallowRef` only when you have measured a reason to.

The part that needs a decision from you is the trigger. `EmSelectValue`'s default content is the single `selectedValue`, which is not meaningful once there are several, so take its slot props instead. The slot hands out `selectedValue` and `selectedValues`, `selectedItem` and `selectedItems`, and a `hasValue` boolean — enough to render a comma list, a count, or a row of tags without tracking the selection separately.

`EmSelectPlaceholder` still handles the empty case; it renders exactly when nothing is selected, so you do not need a `v-if` on your own summary.

Reach for `mandatory` on the root when the field must never be empty — it stops the last item being deselected, which is a nicer constraint than a rule that rejects an empty array after the fact.
:::

::: ds-example
/systems/emerald/select/rich-items

### Rich options

`EmSelectItem` takes a default slot, so an option can hold anything — an icon, a secondary line, a badge. `value` is what lands in the model, and it is independent of what the option renders, so the display can be as rich as you like while the bound value stays a plain id.

The trade-off to be aware of is the trigger. Because `value` is the model, `EmSelectValue` can only render what you give it; with structured options you generally want to look the selected value back up, as this example does, rather than print the raw id. That lookup is yours — v0 tracks selection, not your data model.

`disabled` on an item keeps it visible and announced but unselectable, which is right when its absence would be confusing — a plan the account has outgrown, a permission the current role cannot grant. When an option is simply irrelevant, filter it out instead; a list of options that cannot be picked is noise a keyboard user has to walk through.

Keep the option's text as its accessible name. Icons inside items should stay decorative — the label beside them already names the choice.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the EmSelect sources until then. -->

`EmSelect` is generic over the option value type, `T`, defaulting to `unknown`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T \| T[]` | — | Selected value, or values when `multiple` |
| `label` | `string` | — | Visible field label, associated with the activator |
| `multiple` | `boolean` | `false` | Accumulate selections into an array |
| `mandatory` | `boolean \| 'force'` | `false` | Prevent emptying the selection |
| `disabled` | `boolean` | `false` | Field unavailable |
| `name` | `string` | — | Form field name |
| `form` | `string` | — | Associate with a form by id |
| `id` | `string` | generated | Field id. Falls back to `useId()` |
| `namespace` | `string` | — | Which v0 `Select` instance to bind to. Only needed when nesting |

### Parts

Every part takes an optional `namespace`; only `EmSelectItem` adds props of its own. Its `value` is v0's `ID` — `string | number` — not the root's generic `T`, so an option keyed by an object needs an id here and the lookup back to the object stays yours.

| Part | Renders | Props | Slot props |
|------|---------|-------|-----------|
| `EmSelectActivator` | The trigger, plus Emerald's caret | — | — |
| `EmSelectValue` | The current selection | — | `selectedItem`, `selectedItems`, `selectedValue`, `selectedValues`, `hasValue`, `attrs` |
| `EmSelectPlaceholder` | Shown while nothing is selected | — | — |
| `EmSelectContent` | The popover listbox | — | — |
| `EmSelectItem` | One option | `value`: `ID` (required), `disabled`: `boolean` | — |

## Accessibility

The listbox semantics, the focus model and the keyboard map all come from v0's `Select`, so they match every other consumer of that compound rather than being Emerald's own interpretation.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | Open the listbox; select the highlighted option when open |
| Arrow Down, Arrow Up | Open the listbox; move the highlight when open |
| Home, End | Jump to the first or last option. Only while open |
| Escape | Close without changing the selection |
| Tab | Close and move on, keeping the current selection |

There is no type-to-select. Typing a letter does nothing — `Select` handles only the keys above, and filtering by text is [Combobox](/components/forms/combobox)'s job.

### Focus model

Focus stays on the activator the whole time. The highlighted option is tracked with `aria-activedescendant` rather than by moving DOM focus into the list — a virtual cursor. That is what keeps Escape and Tab predictable, and it means the reader's focus is never stranded inside a list that has closed underneath them.

### Naming

`label` produces the field's accessible name. Without it the activator has only its own content to fall back on, which is the placeholder text while nothing is selected — a control announced as "Choose a region" that later announces as "Europe" has no stable name. Always pass `label`.

Options are named by their text content. When an option's meaning lives in an icon, give it text too; the icon should stay decorative.

### The popover

`EmSelectContent` renders in the top layer through the native popover API. That is a real accessibility benefit rather than only a layout one — the list is never clipped by an ancestor's `overflow` and never trapped behind an unrelated stacking context, both of which produce menus a reader can hear but not see.
