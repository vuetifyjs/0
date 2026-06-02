---
title: Tooltip - Headless Description Tooltip with Hover and Focus Triggers
meta:
- name: description
  content: Headless tooltip component with hover and focus activation, region-scoped delay coordination, configurable interactive-content mode, and WAI-ARIA compliant aria-describedby semantics.
- name: keywords
  content: tooltip, hover, focus, popover, ARIA, accessibility, v-bind, slots, Vue 3, headless
features:
  category: Component
  label: 'C: Tooltip'
  github: /components/Tooltip/
  renderless: true
  level: 2
related:
  - /composables/plugins/use-tooltip
  - /composables/system/use-popover
  - /components/disclosure/popover
---

# Tooltip

Headless description tooltip with hover and focus triggers, configurable open/close delays, region-scoped skip-window coordination, and optional interactive-content mode.

<DocsPageFeatures :frontmatter />

## Usage

::: example
/components/tooltip/basic
:::

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Activator />
    <Tooltip.Content />
  </Tooltip.Root>
</template>
```

## Architecture

```mermaid "Tooltip lifecycle"
flowchart LR
  Closed -- "pointerenter (mouse) / focus (keyboard)" --> OpenScheduled
  OpenScheduled -- "openDelay elapses" --> Open
  OpenScheduled -- "skip window active" --> Open
  Open -- "pointerleave / blur / click / Escape" --> CloseScheduled
  CloseScheduled -- "closeDelay elapses" --> Closed
  CloseScheduled -- "pointerenter (interactive content)" --> Open
```

## Examples

::: example
/components/tooltip/interactive

### Interactive content

Set `interactive` on `<Tooltip.Root>` to let the user move the cursor from the activator into the content without dismissing the tooltip. Useful for tooltips that surface secondary actions or links.

The strict WAI-ARIA APG tooltip pattern forbids interactive content; if you need a richer hover surface with focusable controls, consider whether a future `HoverCard` component is a better fit.

| File | Role |
|------|------|
| `interactive.vue` | Demonstrates the `interactive` flag with two action buttons inside the content |

:::

## Accessibility

| Concern | Behavior |
|---------|----------|
| Role | Content renders `role="tooltip"` |
| Linkage | Activator always carries `aria-describedby={contentId}` so screen readers announce the description on focus |
| Keyboard | Focus opens instantly (no delay), Escape closes; Enter / Space activate the underlying control, which closes via click |
| Touch | Tooltips are not shown on touch interactions per the WAI-ARIA APG |
| Hoverable content | Off by default; opt-in with `interactive` on `<Tooltip.Root>` |

## FAQ

::: faq

??? Why don't tooltips show on touch?

Touch devices have no hover state, and showing a tooltip on tap competes with whatever action the underlying control performs. Both React Aria and the WAI-ARIA Authoring Practices Guide recommend skipping tooltips on touch and ensuring the UI is usable without them. v0 follows this guidance.

??? How do I set default open and close delays?

Two layers, and the narrower one wins. App-wide: install the plugin — `app.use(createTooltipPlugin({ openDelay: 500, closeDelay: 150 }))`. One tooltip: set props on its Root — `<Tooltip.Root :open-delay="0">`. Warmup coordination stays shared across every tooltip through the plugin registry. With no plugin installed it still works, falling back to the documented defaults.

??? Why doesn't Tooltip.Activator open when I focus it via mouse click?

The activator gates focus-driven opens on `:focus-visible`. A pointer click that incidentally moves focus into the activator does not match `:focus-visible`, so it doesn't open the tooltip. Keyboard-driven focus (Tab) sets `:focus-visible` and opens the tooltip instantly.

??? How do I render a non-button activator?

The activator defaults to `as="button"`; pass `as="a"`, `as="div"`, etc. to render a different element. Always ensure the activator is keyboard-focusable (`tabindex="0"` on a non-button if needed).

:::

<DocsApi />
