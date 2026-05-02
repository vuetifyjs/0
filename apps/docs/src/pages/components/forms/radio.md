---
title: Radio - Accessible Radio Button Controls
meta:
- name: description
  content: Headless radio button component for Vue 3 single-selection groups. Features keyboard navigation, roving tabindex, and complete ARIA compliance.
- name: keywords
  content: radio, radio button, form control, single-select, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Radio'
  level: 2
  github: /components/Radio/
  renderless: false
related:
  - /composables/selection/create-single
  - /components/providers/single
  - /components/forms/checkbox
---

# Radio

A radio button for single-selection groups with roving focus and shared v-model state.

<DocsPageFeatures :frontmatter />

## Usage

::: example
/components/radio/group

### Radio Group

Three size options with shared single-selection state showing the active value.

:::

## Anatomy

```vue Anatomy playground collapse no-filename
<script setup lang="ts">
  import { Radio } from '@vuetify/v0'
</script>

<template>
  <Radio.Group>
    <Radio.Root>
      <Radio.Indicator />
    </Radio.Root>

    <Radio.Root>
      <Radio.Indicator />
    </Radio.Root>
  </Radio.Group>

  <!-- With form submission -->
  <Radio.Group>
    <Radio.Root>
      <Radio.Indicator />

      <Radio.HiddenInput />
    </Radio.Root>

    <Radio.Root>
      <Radio.Indicator />

      <Radio.HiddenInput />
    </Radio.Root>
  </Radio.Group>
</template>
```

## Examples

::: example
/components/radio/mandatory

### Mandatory Selection

Plan options (free, pro, enterprise) with `mandatory="force"` that auto-selects the first non-disabled item on mount.

:::

## Recipes

### Form Integration

Pass the `name` prop on `Radio.Group` and every `Radio.Root` inside it renders a hidden native radio input automatically — the group's `name` cascades to each `Radio.Root` unless the child sets its own. No `Radio.HiddenInput` placement is required:

```vue
<template>
  <Radio.Group v-model="selected" name="size">
    <Radio.Root value="small">
      <Radio.Indicator />
      Small
    </Radio.Root>

    <Radio.Root value="large">
      <Radio.Indicator />
      Large
    </Radio.Root>
  </Radio.Group>
</template>
```

`Radio.HiddenInput` is exported as an internal building block for custom layouts, but auto-rendering via `name` is the only supported form integration path — placing `Radio.HiddenInput` as a child of a `Radio.Root` that already resolves a `name` (from itself or the parent `Radio.Group`) will produce two hidden inputs.

### Styling with Data Attributes

`Radio.Root` exposes data attributes for CSS styling without conditional classes:

| Attribute | Values | Notes |
|-----------|--------|-------|
| `data-state` | `checked`, `unchecked` | Reflects current visual state |
| `data-disabled` | `true` | Present only when disabled |

```vue
<template>
  <Radio.Root class="size-5 rounded-full border data-[state=checked]:border-primary data-[disabled]:opacity-50">
    <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
  </Radio.Root>
</template>
```

## Accessibility

The Radio components handle all ARIA attributes automatically:

- `role="radiogroup"` on the Group
- `role="radio"` on each Root
- `aria-checked` reflects checked state
- `aria-disabled` when radio is disabled
- `aria-required` for form validation (set on Group)
- `aria-label` from the `label` prop
- Roving `tabindex` — only the selected radio (or first non-disabled if none selected) is tabbable
- Space key selects the focused radio
- Arrow keys navigate between radios

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Radio.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom radio visual -->
    </div>
  </Radio.Root>
</template>
```

Arrow keys provide circular navigation within a radio group:

| Key | Action |
|-----|--------|
| `Space` | Select focused radio |
| `ArrowUp` / `ArrowLeft` | Move to previous radio |
| `ArrowDown` / `ArrowRight` | Move to next radio |

Navigation automatically skips disabled items and wraps around.

::: faq

??? How do I make a radio option mandatory?

Clicking an already-selected radio does not deselect it because `Radio.Root` exposes `select`, not `toggle` — the v-model can still be cleared programmatically. Set `mandatory="force"` on `Radio.Group` if you want the first non-disabled item auto-selected on mount. See the Mandatory Selection example above.

??? Why does my form submission miss the selected radio value?

`Radio.Root` only renders its hidden native input when a `name` is resolved from either `Radio.Group` or itself. Set `name="myField"` on `Radio.Group` (preferred) and every radio inside the group will participate in form submission under the shared name with its own `value`.

??? How does Radio.Group differ from Checkbox.Group?

`Radio.Group` is single-selection — its v-model holds exactly one value and selecting a new option replaces the previous one. `Checkbox.Group` is multi-selection — its v-model is an array of selected values, and it supports tri-state indeterminate behavior via `Checkbox.SelectAll`.

??? Can I pre-select a radio option?

Yes. Initialize the `v-model` on `Radio.Group` with the desired `value` — whichever `Radio.Root` has a matching `value` prop will render as checked on mount. You can also use `mandatory="force"` to auto-select the first non-disabled option when no initial value is provided.

:::

<DocsApi />
