---
title: EmButton - Emerald Button for Vue
meta:
- name: description
  content: Emerald's button — four variants, three sizes, and a loading state that keeps the button's width while it spins. Composed on Vuetify0's headless Button.
- name: keywords
  content: emerald button, vue button, design system button, loading button, vuetify0 button, paper emerald
features:
  category: Component
  label: 'C: EmButton'
  level: 2
  renderless: false
  order: 1
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/actions/button
---

# EmButton

<DocsPageFeatures :frontmatter />

The primary action control — four variants, three sizes, and a loading state that spins in place without the button changing size.

## Usage

`EmButton` is a shell component: fixed anatomy, so everything is a prop and the default slot is the label. `variant` picks the role the button plays in a layout, and `size` picks the type scale it sits on.

The four variants are a hierarchy, not a palette. Use exactly one `primary` per view — it is the thing you want the reader to do. `secondary` is the outlined alternative for a second, equally valid action; `tertiary` is text-only, for actions that should stay out of the way; `destructive` is for the ones that delete something.

::: ds-example
/systems/emerald/button/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmButton } from '@paper/emerald'
</script>

<template>
  <EmButton />
</template>
```

## Composed on v0

`EmButton` renders v0's [Button](/components/actions/button) compound — `Button.Root`, `Button.Content` and `Button.Loading` — and adds nothing to its behavior.

The division is worth knowing because it explains the loading state. `Button.Loading` is a slot-only shell that renders no element of its own, so Emerald owns the absolutely-positioned wrapper inside it and the spinner within that. `Button.Content` stays in the flow the whole time. The result is that a loading button keeps the exact width its label gave it — the label is still laid out, just covered — so a toolbar does not reflow the moment someone clicks Save.

`Button.Root` is also what emits the `data-disabled` and `data-loading` attributes that every rule in Emerald's stylesheet hangs off. Emerald never writes a state class; it styles the attributes v0 already publishes.

## Examples

::: ds-example
/systems/emerald/button/sizes

### Sizes

`size` moves the button across Emerald's body-text scale: `sm` sits on `b3`, `md` on `b2`, and `lg` on `b1`, each with the padding and weight that belong to that step. It is a token lookup, not a multiplier, so the three sizes stay aligned with the text they sit beside instead of drifting at large values.

Pick by density rather than by importance. `md` is the default and the right answer for most forms and page-level actions. Reach for `sm` inside a dense surface — a table row, a toolbar, a card footer — where a full-size control would dominate. `lg` is for a single, deliberate call to action, typically the one button on an empty state or a marketing panel. Importance is what `variant` expresses; size only says how much room the control gets.
:::

::: ds-example
/systems/emerald/button/loading

### Loading and disabled

Both props make the button unclickable, and they mean different things to a screen reader, so they are not interchangeable.

`loading` says the button's action is already running. `Button.Root` puts `data-loading` on the element and swaps the cursor to `progress`, while the label stays laid out underneath the spinner so the control holds its width. This is the state for the gap between a click and its response — a form submitting, a record saving.

`disabled` says the action is not available at all. It sets `data-disabled`, drops the button to Emerald's neutral tokens, and removes it from pointer interaction entirely. Use it when a precondition has not been met, and prefer explaining the precondition nearby: a disabled button with no visible reason is one of the most common accessibility complaints about design systems, and no amount of styling fixes it.

Setting both is not an error, but it is redundant — `loading` already blocks the interaction.
:::

::: ds-example
/systems/emerald/button/icons

### Icons in buttons

The default slot takes any content, so an icon is just an `EmIcon` beside the label. The button's own `gap` is a token, so the spacing is consistent without a wrapper or a margin.

Match the icon to the label's step — `size="s"` next to `sm` and `md` buttons, `m` next to `lg` — and leave the icon decorative. It has no `label` prop here on purpose: the text beside it already names the action, and labelling the icon too would make a screen reader announce the button twice.

The icon-only button is the case that needs care. There is no text to read, so the accessible name has to come from somewhere, and that is what `ariaLabel` is for. An icon-only button without it is an unlabelled control — the single most common way a button fails an audit.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmButton.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive'` | `'primary'` | Visual role in the action hierarchy |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Type and padding step |
| `disabled` | `boolean` | `false` | Action unavailable; sets `data-disabled` and removes pointer interaction |
| `loading` | `boolean` | `false` | Action in flight; sets `data-loading` and covers the label with a spinner |
| `ariaLabel` | `string` | — | Accessible name. Required for icon-only buttons |
| `name` | `string` | — | Form field name; renders a hidden input when set |
| `namespace` | `string` | — | Which v0 `Button` instance to bind to. Only needed when nesting |

The default slot is the label. There are no named slots.

## Accessibility

`Button.Root` renders a native `<button>`, so activation by Enter and Space, focus order, and the implicit `button` role all come from the platform rather than from JavaScript.

### Naming

The accessible name is the default slot's text. When there is no text — an icon-only button — you must pass `ariaLabel`, because the glyph inside is `aria-hidden` and contributes nothing. Never solve it by labelling the icon instead: that names the image, not the control, and leaves the button itself anonymous.

### Disabled and loading

The two states are announced differently and that difference is deliberate:

| State | What assistive tech reports | When to use |
|-------|-----------------------------|-------------|
| `disabled` | Disabled — the control is present but unavailable | A precondition is unmet |
| `loading` | Nothing extra by default — the name and role are unchanged | The action is already running |

`loading` blocks pointer and keyboard activation, but it does not by itself tell a screen reader that anything is happening. If the wait is more than momentary, announce it — put the outcome in an `aria-live` region, or move focus to the result once it arrives. A spinner is a visual signal only.

A disabled button is also unfocusable, which means a keyboard user tabbing through the form never encounters it and gets no explanation for why the action is missing. When the reason matters, prefer leaving the button enabled and reporting the problem on activation.

### Focus

Every variant defines its own `:focus-visible` treatment against its own background — an outline for `primary`, `secondary` and `destructive`, and an inset ring for `tertiary`, which has no fill to outline against. The indicator only appears for keyboard focus, so a mouse click does not leave a ring behind.
