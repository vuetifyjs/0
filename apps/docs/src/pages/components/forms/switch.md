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

::: gn-example
/components/switch/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Switch } from '@vuetify/v0'
</script>

<template>
  <Switch.Root>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>

    <Switch.HiddenInput />
  </Switch.Root>

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
</template>
```

## Examples

::: gn-example
/components/switch/group

### Switch Group

A `Switch.Group` wrapping three `Switch.Root` items for WiFi, Bluetooth, and Location Services — the group's `v-model` is an array of string values, each item contributing its `value` prop when toggled on. Toggling a switch adds or removes its value from the array; the current selection is displayed as a comma-separated list below.

`Switch.Group` uses the same multi-selection logic as [Group](/components/providers/group) under the hood: the array v-model and tri-state batch operations are all inherited from `createGroup`. Reach for this pattern for settings panels, feature flags, or any list of independent on/off controls that need to share a single model.

:::

::: gn-example
/components/switch/indeterminate

### Select-All Switch

Combines a `Switch.SelectAll` with three nested `Switch.Root` items to demonstrate tri-state group management. `Switch.SelectAll` is not a group item — it doesn't register with the selection context and doesn't contribute a value to the array. Instead, it reads the group's `isAllSelected` and `isMixed` states and calls `toggleAll` on click, making it a pure control lever over the group.

When all permissions are enabled, `SelectAll` renders as checked. When none are enabled, it renders as unchecked. When some are enabled, it renders as indeterminate — exposing `aria-checked="mixed"` and `data-state="indeterminate"` so screen readers announce the partial state and CSS can apply a distinct visual (here, an intermediate thumb position at `translate-x-3.5`).

The individual permission items (Camera, Microphone, Notifications) are indented under the SelectAll to signal their parent/child relationship visually.

:::

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

`Switch.HiddenInput` is exported as an internal building block for custom layouts, but auto-rendering via `name` is the only supported form integration path — placing `Switch.HiddenInput` as a child of a `Switch.Root` that already has a `name` will produce two hidden inputs.

### Styling with Data Attributes

Switch subcomponents expose data attributes for CSS styling without conditional classes. `Switch.Root` and `Switch.SelectAll` emit both `data-state` and `data-disabled`, while `Switch.Track` and `Switch.Thumb` emit only `data-state` (they inherit disabled styling from the Root ancestor):

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-state` | `checked`, `unchecked`, `indeterminate` | `Root`, `SelectAll`, `Track`, `Thumb` |
| `data-disabled` | `true` | `Root`, `SelectAll` |

```vue
<template>
  <Switch.Root class="data-[disabled]:opacity-50">
    <Switch.Track class="bg-gray-300 transition-colors data-[state=checked]:bg-primary">
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Root>
</template>
```

`Switch.Thumb` applies an inline `visibility: hidden` when unchecked, so the thumb is not visible until the switch is on. This means a sliding transform on `Switch.Thumb` cannot animate *from* the "off" position. Animate the `Switch.Track` background color instead, as shown above.

## Accessibility

The Switch.Root component renders as a button and handles all ARIA attributes automatically:

- `role="switch"` for proper semantics
- `aria-checked` reflects state (`true`, `false`, or `"mixed"`)
- `aria-disabled` when switch is disabled
- `aria-label` from the `label` prop
- `tabindex="0"` for keyboard focus (removed when disabled)
- Space key toggles the switch (Enter works when rendered as button)

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

??? How do I animate the switch state change?

`Switch.Thumb` applies an inline `visibility: hidden` when unchecked, so transforms on the thumb cannot animate from the "off" position. Apply a CSS `transition` to `Switch.Track` and use the `data-[state=checked]:` variant to change its background — for example, `class="transition-colors bg-gray-300 data-[state=checked]:bg-primary"`. No JavaScript event handling is needed — the data attribute flip drives the animation.

??? Can I use Switch.Root without the Track and Thumb subcomponents?

Yes. `Switch.Track` and `Switch.Thumb` are purely cosmetic — they read switch state from context to render the rail and knob. You can omit them entirely and render your own visual using the `attrs` slot prop on `Switch.Root`, or use `renderless` mode for full control over the rendered element.

:::

<DocsApi />
