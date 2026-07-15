---
title: Overflow - Responsive Truncation Primitive for Vue 3
meta:
- name: description
  content: Headless responsive truncation primitive that hides children when they no longer fit in the container and surfaces a count of hidden items via an indicator.
- name: keywords
  content: Overflow, truncation, responsive, capacity, ResizeObserver, headless, Vue 3
features:
  category: Component
  label: 'C: Overflow'
  github: /components/Overflow/
  level: 2
related:
  - /composables/semantic/create-overflow
  - /components/semantic/breadcrumbs
  - /components/semantic/pagination
---

# Overflow

Headless responsive truncation primitive. Children render until the container runs out of width, then overflowing items are hidden and an indicator surfaces the hidden count.

<DocsPageFeatures :frontmatter />

## Usage

`Overflow` is built on the [createOverflow](/composables/semantic/create-overflow) composable. Wrap any horizontal list of items with `Overflow.Root`, register each item via `Overflow.Item`, and add an `Overflow.Indicator` to render the `+N more` affordance when truncation kicks in.

```vue collapse no-filename
<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'

  const tags = ['Vue', 'React', 'Svelte', 'Solid', 'Qwik']
</script>

<template>
  <Overflow.Root class="flex gap-2 overflow-hidden">
    <Overflow.Item v-for="tag in tags" :key="tag" :value="tag">
      {{ tag }}
    </Overflow.Item>

    <Overflow.Indicator v-slot="{ count }">
      +{{ count }} more
    </Overflow.Indicator>
  </Overflow.Root>
</template>
```

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'
</script>

<template>
  <Overflow.Root>
    <Overflow.Item />

    <Overflow.Indicator />
  </Overflow.Root>
</template>
```

## Examples

::: gn-example
/components/overflow/useToolbarItems.ts 1
/components/overflow/OverflowToolbar.vue 2
/components/overflow/overflow-toolbar.vue 3

### Responsive toolbar

A horizontal action bar is the textbook case for measured truncation: there are more buttons than the row can hold on a narrow screen, and stacking or wrapping them looks broken. `Overflow.Root` measures the available width, keeps as many leading actions visible as fit, and surfaces the rest through a single `Overflow.Indicator`. Because measurement runs through a `ResizeObserver`, the split between visible and collapsed actions recomputes live as the container resizes — no breakpoints, no manual width math.

The interesting detail is what lives inside the indicator. Its slot exposes `count` and the array of currently `hidden` tickets, so the overflow affordance here is a real menu rather than a dead label: the indicator wraps a [Popover](/components/disclosure/popover), the hidden tickets are mapped back to their actions, and each renders as a menu button. Selecting one runs the same handler a visible button would, then calls the popover's `toggle` to dismiss the menu. Each `Overflow.Item` carries its action id as its `value`, which is the key the indicator reads back out of `hidden`.

Reach for this whenever a command surface must stay on one line across viewports — document toolbars, table row actions, editor controls. Keep `priority="start"` (the default) so the most-used leading actions never collapse; flip to `priority="end"` only when the newest items matter most. For first-plus-last "show the ends, hide the middle" trails, use [Breadcrumbs](/components/semantic/breadcrumbs) instead — `Overflow` is deliberately one-sided.

| File | Role |
|------|------|
| `useToolbarItems.ts` | Action data plus the run handler that records the last invocation |
| `OverflowToolbar.vue` | Overflow row, the +N more indicator, and the popover menu of hidden actions |
| `overflow-toolbar.vue` | Wires the composable to the toolbar and shows the last action |
:::

::: gn-example
/components/overflow/avatar-group/users.ts 1
/components/overflow/avatar-group/avatar-group.vue 2

### Avatar group

The classic "user roster" use case — a stack of overlapping avatars that collapse into a `+N` chip when the row gets tight. The data lives in a separate `users.ts` module to keep the markup focused on the visual composition. The overlap comes from per-avatar `marginInlineStart: -8px`, which `createOverflow` picks up automatically through `getComputedStyle().marginLeft` — the `Overflow.Root` doesn't need to set the `gap` prop because the container has no CSS gap and the visual overlap is already in each item's measured width.

Because each avatar has the same width, the trailing avatars drop in predictable order — no special configuration needed beyond the default `priority="start"`. The indicator inherits the same circular shape and ring so it visually slots into the stack rather than calling attention to itself.

| File | Role |
|------|------|
| `users.ts` | Sample user data (id, name, initials, hue) |
| `avatar-group.vue` | Overlapping avatar stack with `+N` indicator |
:::

## Recipes

### Disable truncation conditionally

```vue
<template>
  <Overflow.Root :disabled="showAll">
    <Overflow.Item v-for="t in tags" :key="t" :value="t">
      {{ t }}
    </Overflow.Item>
  </Overflow.Root>

  <button @click="showAll = !showAll">
    {{ showAll ? 'Collapse' : 'Show all' }}
  </button>
</template>
```

### Pin specific items so they always render

```vue
<template>
  <Overflow.Root>
    <Overflow.Item v-for="item in items" :key="item.id" :disabled="item.pinned">
      {{ item.label }}
    </Overflow.Item>
  </Overflow.Root>
</template>
```

A `disabled` Item is exempt from capacity math and always renders.

## Accessibility

| Concern | Mechanism |
|---------|-----------|
| Hidden items announced to AT | Items receive `aria-hidden="true"` when off-capacity |
| Indicator announcements | `aria-live="polite"` on the indicator's element |
| Container semantics | `Overflow.Root` defaults to `<div>`; pass `as="ul"` and `as="li"` on Items for list semantics |

## FAQ

::: faq
??? Why does the indicator briefly appear when the container is exactly at the threshold?

The indicator's reserved width isn't known until the indicator has rendered at least once. On the first overflow event, capacity is computed without the reservation, the indicator renders, its width is measured, and capacity recomputes one tick later. The indicator measures itself with a `ResizeObserver` so changes to its content (e.g., `+1` → `+99`) keep the reservation accurate without manual intervention. This is the same two-tick settle that `Breadcrumbs` already accepts.

??? Can I bisect (keep first + last, hide middle, ellipsis in the center)?

No — `Overflow` is one-sided by design. Bisect logic lives in the specialized [Breadcrumbs](/components/semantic/breadcrumbs) component.

??? Why is `gap` a prop instead of read from CSS?

Reading `getComputedStyle().gap` adds a layout pass on every measurement. The component takes the value as a number to keep capacity computation cheap. Mirror it in your CSS or utility class.
:::

<DocsApi />
