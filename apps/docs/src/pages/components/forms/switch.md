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
/components/switch/useSettings.ts 1
/components/switch/SettingsPanel.vue 2
/components/switch/settings-panel.vue 3

### App Settings Panel

A notification preferences panel that groups four independent switches under a master "Enable all" lever and submits the result through a `Form`. Each `Switch.Root` carries a `name` prop, so v0 auto-renders a hidden native input and the toggled values participate in `FormData` — there is no `Switch.HiddenInput` to place by hand. The panel pairs each switch with a label and a line of helper text, and a summary line below echoes the saved selection.

The interesting piece is the master toggle. `Switch.SelectAll` is not a group item — it never registers a value into the array v-model. Instead it reads the group's aggregate `isAllSelected` / `isMixed` state and calls `toggleAll`, so it renders checked when every setting is on, unchecked when all are off, and indeterminate (`aria-checked="mixed"`, `data-state="indeterminate"`) when only some are on. The tri-state and batch operations come straight from [createGroup](/composables/selection/create-group) — the same multi-selection logic that powers [Group](/components/providers/group). The thumb slides between the off and on positions via `data-[state=...]` transform variants on `Switch.Thumb`, which stays visible in every state.

Reach for this pattern for any settings surface — notification preferences, feature flags, privacy controls — where a list of independent on/off toggles needs a single shared model, a select-all lever, and form submission. Because `Form`'s `@submit` is pass-through (it fires on every native submit regardless of validity), the handler guards on `payload.valid` before committing the saved state. See [Form](/components/forms/form) for the validation surface and [Checkbox](/components/forms/checkbox) for the equivalent committed-selection control.

| File | Role |
|------|------|
| `useSettings.ts` | Composable — setting definitions, the enabled-array model, and the guarded save/reset logic |
| `SettingsPanel.vue` | Reusable component — renders the `Form`, the `Switch.Group` with a `SelectAll` master and per-row label + helper text, owns the UnoCSS classes |
| `settings-panel.vue` | Entry — wires the composable to the panel and renders the saved-state summary line |
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

`Switch.Thumb` stays visible in every state and emits `data-state` (`checked` / `unchecked` / `indeterminate`), so a sliding transform can animate directly between the off and on positions — for example `translate-x-1 data-[state=checked]:translate-x-6`. Pair it with a `transition-transform` on the thumb and a `transition-colors` on the `Switch.Track` for the rail.

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

## FAQ

::: faq

??? When should I use Switch vs Checkbox?

Use `Switch` for settings that take immediate effect, like toggling a feature on or off (WiFi, notifications, dark mode). Use `Checkbox` for selections that are committed later — form submissions, multi-select lists, and "I agree" confirmations. The ARIA roles (`switch` vs `checkbox`) communicate this intent to assistive technology.

??? Why does my form submission miss the switch value?

`Switch.Root` only renders the hidden native input when a `name` prop is set. Without `name`, the switch is purely visual and won't appear in `FormData`. Add `name="myField"` (and optionally `value`) to participate in form submission.

??? How do I animate the switch state change?

Drive it off the `data-state` attribute — no JavaScript event handling needed. Apply a `transition-transform` to `Switch.Thumb` and slide it with the `data-[state=checked]:` variant (`class="transition-transform translate-x-1 data-[state=checked]:translate-x-6"`), and add a `transition-colors` to `Switch.Track` to shift the rail background (`class="transition-colors bg-gray-300 data-[state=checked]:bg-primary"`). The data attribute flip drives both.

??? Can I use Switch.Root without the Track and Thumb subcomponents?

Yes. `Switch.Track` and `Switch.Thumb` are purely cosmetic — they read switch state from context to render the rail and knob. You can omit them entirely and render your own visual using the `attrs` slot prop on `Switch.Root`, or use `renderless` mode for full control over the rendered element.

:::

<DocsApi />
