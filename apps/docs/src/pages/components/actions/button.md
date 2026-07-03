---
title: Button - Accessible Button Controls
meta:
- name: description
  content: Headless button component with disabled, readonly, passive, and loading states. Toggle groups, icon accessibility, loading grace period, and form submission support.
- name: keywords
  content: button, toggle, loading, icon button, button group, form submit, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'C: Button'
  level: 2
  github: /components/Button/
  renderless: false
related:
  - /composables/selection/create-selection
  - /components/providers/single
  - /components/primitives/atom
---

# Button

Headless button with loading state, toggle group support, and icon accessibility.

<DocsPageFeatures :frontmatter />

## Usage

The Button component renders as a native `<button>` by default (or an anchor, router-link, etc. via the `as` prop). It provides four distinct interaction states for controlling click behavior and visual feedback.

::: gn-example
/components/button/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Button } from '@vuetify/v0'
</script>

<template>
  <Button.Root>
    <Button.Icon />
    <Button.Content />
    <Button.Loading />
  </Button.Root>

  <Button.Group>
    <Button.Root>
      <Button.HiddenInput />
    </Button.Root>
  </Button.Group>
</template>
```

## Recipes

### Loading with Grace Period

The loading state has a built-in 1-second grace period before showing loading UI. This prevents flicker for fast operations — if the async work completes within 1 second, the loading indicator never appears.

Use `Button.Loading` and `Button.Content` to swap between loading and default content:

::: gn-example
/components/button/loading
:::

`Button.Loading` and `Button.Content` conditionally render based on the loading state. Only one is visible at a time — `Content` by default, `Loading` after the grace period elapses.

### Toggle Groups

Wrap buttons in `Button.Group` for toggle behavior with v-model support. Each `Button.Root` needs a `value` prop to participate in selection.

::: gn-example
/components/button/group
:::

`Button.Group` supports `multiple` for multi-select and `mandatory` to prevent deselecting the last item:

```vue
<template>
  <!-- Multi-select -->
  <Button.Group v-model="formatting" multiple>
    <Button.Root value="bold">B</Button.Root>
    <Button.Root value="italic">I</Button.Root>
    <Button.Root value="underline">U</Button.Root>
  </Button.Group>

  <!-- Mandatory single-select -->
  <Button.Group v-model="view" mandatory>
    <Button.Root value="grid">Grid</Button.Root>
    <Button.Root value="list">List</Button.Root>
  </Button.Group>
</template>
```

### Icon Buttons

Use `Button.Icon` to wrap icon content. It sets `aria-hidden="true"` on itself and detects icon-only buttons — warning in dev when `aria-label` is missing on Root.

::: gn-example
/components/button/icon
:::

### Form Submission

Use `Button.HiddenInput` inside a group to submit toggle state with forms. It renders a visually hidden checkbox that reflects the button's selected state.

```vue
<script setup lang="ts">
  import { Button, Form } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const answer = shallowRef<string>()

  function onSubmit () {
    console.log('Answer:', answer.value)
  }
</script>

<template>
  <Form @submit="onSubmit">
    <Button.Group v-model="answer">
      <Button.Root value="yes">
        Yes
        <Button.HiddenInput name="answer" value="yes" />
      </Button.Root>

      <Button.Root value="no">
        No
        <Button.HiddenInput name="answer" value="no" />
      </Button.Root>
    </Button.Group>

    <button type="submit">Submit</button>
  </Form>
</template>
```

### Interaction States

Button supports four states that block click events. Each state has a distinct semantic meaning:

| State | Click blocked | Focusable | Hoverable | Tab order | Use case |
|-------|:---:|:---:|:---:|:---:|---|
| **disabled** | Yes | No | No | Removed | Button is not applicable |
| **readonly** | Yes | Yes | Yes | Kept | Display-only, no action needed |
| **passive** | Yes | Yes | Yes | Kept | Temporarily unavailable |
| **loading** | Yes | Yes | Yes | Kept | Waiting for async operation |

::: gn-example
/components/button/states
:::

#### Data Attributes

Each state sets a corresponding `data-*` attribute on the element for CSS styling:

| Attribute | When set |
|-----------|----------|
| `data-disabled` | `disabled` prop is true |
| `data-readonly` | `readonly` prop is true |
| `data-passive` | `passive` prop is true |
| `data-loading` | Loading grace period has elapsed |
| `data-selected` | Button is selected in a group |

> [!TIP]
> `disabled` uses native `disabled` attribute and removes the button from tab order. `passive` uses `aria-disabled="true"` instead — the button stays focusable and screen readers announce it as disabled.

## Accessibility

Button.Root handles ARIA attributes automatically:

- `role="button"` for proper semantics
- `type="button"` when rendered as a `<button>` (prevents implicit form submission)
- `aria-pressed` reflects selection state when inside a group
- `aria-disabled="true"` for passive state (not native disabled)
- `aria-label` from the `ariaLabel` prop
- `tabindex="0"` for keyboard focus (`-1` when disabled)
- Native `disabled` attribute when disabled (removes from tab order)

For custom implementations, use `renderless` mode and bind the `attrs` slot prop:

```vue
<template>
  <Button.Root v-slot="{ attrs }" renderless>
    <div v-bind="attrs">
      <!-- Custom button visual -->
    </div>
  </Button.Root>
</template>
```

## FAQ

::: faq

??? What's the difference between the `disabled` and `passive` states?

Both block clicks, but `disabled` applies the native `disabled` attribute and drops the button from tab order, while `passive` uses `aria-disabled="true"` so the button stays focusable and screen readers announce it as disabled. Reach for `passive` when a control is only temporarily unavailable.

??? Why doesn't the loading indicator appear right away?

`Button.Loading` has a built-in 1-second grace period. If the async work finishes within that window the indicator never shows, preventing flicker on fast operations.

??? How do I submit a toggle group's value with a native form?

Put a `Button.HiddenInput` inside each `Button.Root`. It renders a visually hidden checkbox that reflects the button's selected state, so the group's value posts with the form.

:::

<DocsApi />
