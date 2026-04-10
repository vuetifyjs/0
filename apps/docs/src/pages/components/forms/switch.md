---
title: Switch - Accessible Toggle Controls
meta:
- name: description
  content: Headless switch component with dual-mode support. Standalone boolean v-model or group multi-selection with tri-state, batch operations, and full ARIA compliance.
- name: keywords
  content: switch, toggle, form control, multi-select, tri-state, indeterminate, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Switch'
  level: 2
  github: /components/Switch/
  renderless: false
related:
  - /composables/selection/create-group
  - /components/providers/group
---

# Switch

A switch for on/off state or multi-selection groups with tri-state support.

<DocsPageFeatures :frontmatter />

## Usage

::: example
/components/switch/basic

### Basic Switch

A standalone boolean switch with label and slide animation.

:::

## Anatomy

```vue Anatomy playground collapse no-filename
<script setup lang="ts">
  import { Switch } from '@vuetify/v0'
</script>

<template>
  <!-- Standalone -->
  <Switch.Root>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Root>

  <!-- Group -->
  <Switch.Group>
    <Switch.Root>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>

    <Switch.Root>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>
  </Switch.Group>

  <!-- Group with Select All -->
  <Switch.Group>
    <Switch.SelectAll>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.SelectAll>

    <Switch.Root>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>
  </Switch.Group>

  <!-- With form submission -->
  <Switch.Root>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>

    <Switch.HiddenInput />
  </Switch.Root>
</template>
```

## Examples

::: example
/components/switch/group

### Switch Group

Multi-select switch group managing an array of connectivity options (WiFi, Bluetooth, Location).

:::

::: example
/components/switch/indeterminate

### Select-All Switch

A "select all" switch with indeterminate state over nested permission toggles.

:::

The `SelectAll` component:
- Binds to the group's `isAllSelected` and `isMixed` state
- Calls `toggleAll` on click
- Does NOT register as a group item
- Sets `aria-checked="mixed"` and `data-state="indeterminate"` when partially selected

## Recipes

### Form Integration

Pass the `name` prop on `Switch.Root` and a hidden native `<input type="checkbox">` is rendered automatically — no `Switch.HiddenInput` placement is required. The input is visually hidden, `inert`, and `tabindex="-1"`, so it only participates in `FormData` submission:

```vue
<template>
  <Switch.Root name="notifications" value="on">
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Root>
</template>
```

Place `Switch.HiddenInput` explicitly only when you need to override the auto-rendered name, value, or form association:

```vue
<template>
  <Switch.Root name="notifications">
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>

    <Switch.HiddenInput name="notifications_override" value="custom" />
  </Switch.Root>
</template>
```

### Styling with Data Attributes

Switch subcomponents expose data attributes for CSS styling without conditional classes. `Switch.Root` and `Switch.SelectAll` emit both `data-state` and `data-disabled`, while `Switch.Track` and `Switch.Thumb` emit only `data-state` (they inherit disabled styling from the Root ancestor):

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-state` | `checked`, `unchecked`, `indeterminate` | `Root`, `SelectAll`, `Track`, `Thumb` |
| `data-disabled` | `true` | `Root`, `SelectAll` |

```vue
<template>
  <Switch.Root class="data-[disabled]:opacity-50">
    <Switch.Track class="bg-gray-300 data-[state=checked]:bg-primary">
      <Switch.Thumb class="translate-x-0.5 data-[state=checked]:translate-x-5.5" />
    </Switch.Track>
  </Switch.Root>
</template>
```

## Accessibility

The Switch.Root component renders as a button and handles all ARIA attributes automatically:

- `role="switch"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when switch is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space key toggles the switch

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<template>
  <Switch.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom switch visual -->
    </div>
  </Switch.Root>
</template>
```

::: faq

??? When should I use Switch vs Checkbox?

Use `Switch` for settings that take immediate effect, like toggling a feature on or off (WiFi, notifications, dark mode). Use `Checkbox` for selections that are committed later — form submissions, multi-select lists, and "I agree" confirmations. The ARIA roles (`switch` vs `checkbox`) communicate this intent to assistive technology.

??? Why does my form submission miss the switch value?

`Switch.Root` only renders the hidden native input when a `name` prop is set. Without `name`, the switch is purely visual and won't appear in `FormData`. Add `name="myField"` (and optionally `value`) to participate in form submission.

??? How do I animate the thumb sliding?

Apply a CSS `transition` to `Switch.Thumb` (or `Switch.Track`) and use the `data-[state=checked]:` variant to change its transform. For example, `class="transition-transform data-[state=checked]:translate-x-5"` slides the thumb when toggled. No JavaScript event handling is needed — the data attribute flip drives the animation.

??? Can I use Switch.Root without the Track and Thumb subcomponents?

Yes. `Switch.Track` and `Switch.Thumb` are purely cosmetic — they read switch state from context to render the rail and knob. You can omit them entirely and render your own visual using the `attrs` slot prop on `Switch.Root`, or use `renderless` mode for full control over the rendered element.

:::

<DocsApi />
