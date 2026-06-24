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
/components/checkbox/group

### Checkbox Group

`Checkbox.Group` wraps `Checkbox.Root` items and manages multi-selection state via an array-based v-model. Each `Checkbox.Root` registers automatically with the nearest parent group — no wiring required. The group's v-model collects the `value` prop of every checked item.

Reach for this pattern whenever you need a list of independent boolean choices — tag pickers, feature toggles, permission sets — and want the aggregate selection as an array. The group handles enrollment and deselection; individual checkboxes still respond to their own `disabled` prop.

:::

::: gn-example
/components/checkbox/indeterminate

### Select All Pattern

`Checkbox.SelectAll` is a purpose-built sub-component that binds to the group's aggregate tri-state — checked when all items are selected, unchecked when none are, and indeterminate when some are. It calls `toggleAll` internally, so it does not register as a group item and does not appear in the v-model array.

The `Checkbox.Indicator` inside `SelectAll` receives an `isMixed` slot prop you can use to swap between a checkmark and a dash (or any other visual). Use `data-[state=indeterminate]` on the outer element to drive CSS — the example shows how to apply the same primary color to both fully-checked and indeterminate states so the control always stands out against unchecked siblings.

Use this whenever you need a "select all / deselect all" header checkbox above a list of independently toggleable items.

:::

The `SelectAll` component:
- Binds to the group's `isAllSelected` and `isMixed` state
- Calls `toggleAll` on click
- Does NOT register as a group item
- Sets `aria-checked="mixed"` and `data-state="indeterminate"` when partially selected

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
