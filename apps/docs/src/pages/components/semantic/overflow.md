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

`Overflow` is built on the [createOverflow](/composables/semantic/create-overflow) composable. It solves a layout problem CSS alone cannot: when a horizontal list outgrows its container you want to *hide* the overflow rather than scroll, *tell the user how much was hidden*, and ideally let them get to it. `text-overflow: ellipsis` only works for single-line text and surfaces no count. `overflow: scroll` introduces a scrollbar nobody enjoys. Container queries can hide-or-show but cannot decide which children fit.

Wrap any horizontal list with `Overflow.Root`, register each item with `Overflow.Item`, and add `Overflow.Indicator` to render the `+N more` affordance. The Root tracks the container's width via `ResizeObserver`, each Item self-measures, and the Indicator only mounts when overflow occurs — so the trigger appears and disappears with the available space.

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

```vue Anatomy playground
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

::: example
/components/overflow/avatar-group/users.ts 1
/components/overflow/avatar-group/avatar-group.vue 2

### Avatar group

The classic "user roster" use case — a stack of overlapping avatars that collapse into a `+N` chip when the row gets tight. Renders as a semantic `<ul>`/`<li>` with `aria-label` on the list and a hidden full name per avatar (`sr-only`) so screen-reader users get the same context sighted users get from `title` tooltips. The `+N` indicator carries its own `aria-label` so it announces *what* the count refers to.

The visual overlap is just `marginInlineStart: -8px` on each item — `createOverflow` picks that up automatically through `getComputedStyle().marginLeft`, so each avatar's measured width is `32 - 8 = 24px`. There's no CSS `gap` on the container and no `gap` prop on `Overflow.Root`; setting `gap` would *subtract the overlap a second time* and inflate the apparent capacity. When you have no CSS gap, leave the prop alone.

Because every avatar has the same width, items drop in predictable order from the trailing edge. The indicator inherits the same circular shape and ring so it visually slots into the stack rather than calling attention to itself.

| File | Role |
|------|------|
| `users.ts` | Sample user data (id, name, initials, hue) |
| `avatar-group.vue` | Overlapping avatar stack with `+N` indicator and full a11y |
:::

::: example
/components/overflow/popover

### Popover of hidden items

`Overflow.Indicator` exposes the array of currently-hidden tickets via the `hidden` slot prop. Wrap the indicator content in a `Popover.Activator` and render the hidden values inside `Popover.Content` to give users access to truncated content without losing the compact display. This is the pattern GitHub uses for the repo language list, Linear for project tags, and most modern dashboards for filter chips.

The indicator only mounts when overflow occurs, so the popover trigger naturally appears and disappears with the available space — no manual `v-if` gymnastics. The activator carries `:aria-label="`Show ${count} more topics`"` so screen-reader users hear *why* the button exists, not just `+5 more`. The popover content is `max-h-64 overflow-y-auto` for the edge case where many items are hidden — common for filter chip rows that compress hard at narrow widths.

The list is rendered as a semantic `<ul>` with `<li>` items so the popover trigger sits inside the list naturally and the topic chips announce as a list to assistive tech.

| File | Role |
|------|------|
| `popover.vue` | Tag row with overflow chips collapsed into a Popover, semantic list, full a11y |
:::

## Recipes

### Trailing-priority lists with priority="end"

When the latest items matter most — chat reactions, recent activity, message lists — `priority="end"` flips the behavior: leading items hide first and the indicator naturally renders at the start. Visual order is preserved (DOM order = display order); only visibility flips.

::: example collapse
/components/overflow/priority-end
:::

Place `Overflow.Indicator` first in source order so it renders to the left of the visible items. One tradeoff to keep in mind: the indicator's `aria-live="polite"` region announces before the items it summarizes, so screen-reader users hear "+3 earlier" *before* the most recent entries. That's usually correct for the "show me what's new, but tell me how much I missed" reading model — but if your use case needs the items announced first, prefer `priority="start"` and place the indicator at the end. For breadcrumb-style "first + last, hide middle" bisecting, reach for [Breadcrumbs](/components/semantic/breadcrumbs) instead — `Overflow` is deliberately one-sided.

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
