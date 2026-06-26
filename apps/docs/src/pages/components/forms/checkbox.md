---
title: Checkbox - Accessible Checkbox Controls
meta:
- name: description
  content: Headless checkbox component with dual-mode support. Standalone boolean v-model or group multi-selection with tri-state, batch operations, and full ARIA compliance.
- name: keywords
  content: checkbox, toggle, form control, multi-select, tri-state, indeterminate, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Checkbox'
  level: 2
  github: /components/Checkbox/
  renderless: false
related:
  - /composables/selection/create-group
  - /components/providers/group
---

# Checkbox

A checkbox for boolean state or multi-selection groups with tri-state support.

<DocsPageFeatures :frontmatter />

## Usage

::: gn-example
/components/checkbox/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'
</script>

<template>
  <Checkbox.Group>
    <Checkbox.SelectAll>
      <Checkbox.Indicator />
    </Checkbox.SelectAll>

    <Checkbox.Root>
      <Checkbox.Indicator />
    </Checkbox.Root>

    <Checkbox.HiddenInput />
  </Checkbox.Group>
</template>
```

## Examples

::: gn-example
/components/checkbox/useInboxSelection.ts 1
/components/checkbox/InboxList.vue 2
/components/checkbox/inbox-selection.vue 3

### Inbox Bulk-Select with Action Bar

An email-style triage list that shows the full multi-select surface working together: `Checkbox.Group` holds an array v-model of selected message ids, each row is a `Checkbox.Root` bound to `:value="email.id"`, and a `Checkbox.SelectAll` header drives the whole list. Selecting a few rows puts the header into its tri-state — checked when every row is selected, empty when none are, and indeterminate when the selection is partial. The `Checkbox.Indicator` inside `SelectAll` reads the `isMixed` slot prop to swap a dash for the checkmark, and the same primary fill is applied to both `data-[state=checked]` and `data-[state=indeterminate]` so the header always reads as "active" against unchecked siblings.

The interesting detail is how little wiring the group needs. `Checkbox.Root` items auto-register with the nearest `Checkbox.Group`, so the v-model array is the single source of truth — the live count, the conditional action bar, and the `archive` / `remove` handlers all derive from that one array. The action bar operates on the selected ids and then clears the selection. Row backgrounds light up through the `has-[[data-state=checked]]` selector rather than a JS-driven class, keeping the styling declarative. For per-item form submission, add a `name` to each `Checkbox.Root` (which auto-renders its hidden input) — see the Form Integration recipe below.

Reach for this whenever a list needs a header "select all" plus per-row toggles and batch actions — mail clients, file managers, data-grid row selection. For the underlying multi-select logic, see [createGroup](/composables/selection/create-group); for the provider primitive the group is built on, see [Group](/components/providers/group); for single-choice variants, see [Radio](/components/forms/radio).

| File | Role |
|------|------|
| `useInboxSelection.ts` | Composable — email data, selection array, count, and archive/delete/reset behavior |
| `InboxList.vue` | Reusable component — renders the `Checkbox.Group` with a tri-state `SelectAll`, per-row `Checkbox.Root` items, and the bulk action bar |
| `inbox-selection.vue` | Entry — wires the composable to the list and adds the status line + reset chrome |
:::

## Recipes

### Form Integration

Pass the `name` prop on `Checkbox.Root` and a hidden native checkbox is rendered automatically. No `Checkbox.HiddenInput` placement is required:

```vue
<template>
  <Checkbox.Root name="agree" value="yes">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
  </Checkbox.Root>
</template>
```

`Checkbox.HiddenInput` is exported as an internal building block for custom layouts, but auto-rendering via `name` is the only supported form integration path — placing `Checkbox.HiddenInput` as a child of a `Checkbox.Root` that already has a `name` will produce two hidden inputs.

### Styling with Data Attributes

`Checkbox.Root` exposes data attributes for CSS styling without conditional classes:

| Attribute | Values | Notes |
|-----------|--------|-------|
| `data-state` | `checked`, `unchecked`, `indeterminate` | Reflects current visual state |
| `data-disabled` | `true` | Present only when disabled |

```vue
<template>
  <Checkbox.Root class="size-5 rounded border data-[state=checked]:bg-primary data-[disabled]:opacity-50">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
  </Checkbox.Root>
</template>
```

## Accessibility

The Checkbox.Root component renders as a button and handles all ARIA attributes automatically:

- `role="checkbox"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when checkbox is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space key toggles the checkbox (Enter works when rendered as button)

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Checkbox.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom checkbox visual -->
    </div>
  </Checkbox.Root>
</template>
```

::: faq

??? How do I disable a checkbox?

Pass the `disabled` prop on `Checkbox.Root`. The component sets `aria-disabled`, removes `tabindex`, ignores click and Space key events, and exposes `data-disabled="true"` for styling.

??? Why does my form submission miss the checkbox value?

`Checkbox.Root` only renders the hidden native input when a `name` prop is set. Without `name`, the checkbox is purely visual and won't appear in `FormData`. Add `name="myField"` (and optionally `value`) to participate in form submission.

??? How does Checkbox.Group differ from a RadioGroup?

`Checkbox.Group` is a multi-selection container — its v-model is an array of selected values, individual checkboxes support an `indeterminate` prop, and `Checkbox.SelectAll` reflects the group's aggregate mixed state. A radio group is single-selection — exactly one option is active and v-model holds a single value.

??? Can I use Checkbox.Root without the Indicator subcomponent?

Yes. `Checkbox.Indicator` is purely cosmetic — it reads checkbox state from context to render a checkmark. You can omit it entirely and render your own visual using the `attrs` slot prop on `Checkbox.Root`, or use `renderless` mode for full control over the rendered element.

:::

<DocsApi />
