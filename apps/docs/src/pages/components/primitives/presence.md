---
title: Presence - Animation-Agnostic Mount Lifecycle
meta:
- name: description
  content: Renderless mount lifecycle primitive that manages lazy mounting, exit animation delay, and unmounting for Vue 3 headless components.
- name: keywords
  content: presence, mount, unmount, animation, transition, lazy, lifecycle, renderless, Vue 3, headless
features:
  category: Component
  label: 'C: Presence'
  github: /components/Presence/
  renderless: true
  level: 2
related:
  - /composables/system/use-presence
  - /components/primitives/portal
---

# Presence

Animation-agnostic mount lifecycle for conditional content.

<DocsPageFeatures :frontmatter />

## Usage

The Presence component and `usePresence` composable manage the mount lifecycle of conditional content. They provide a four-state machine that handles lazy mounting, exit animation delay, and unmounting.

::: gn-example
/components/presence/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Presence } from '@vuetify/v0'
</script>

<template>
  <Presence />
</template>
```

## Architecture

Presence wraps the `usePresence` composable, which implements a four-state machine:

```mermaid "Presence State Machine"
stateDiagram-v2
  [*] --> unmounted
  unmounted --> mounted: present = true
  mounted --> present: next tick
  present --> leaving: present = false
  leaving --> unmounted: done()
  leaving --> present: present = true (re-entry)
```

| State | `data-state` | In DOM? | Purpose |
|-------|-------------|---------|---------|
| `unmounted` | — | No | Content removed |
| `mounted` | `mounted` | Yes | Just entered DOM — target for enter animations |
| `present` | `present` | Yes | Active and visible |
| `leaving` | `leaving` | Yes | Exit animation running, waiting for `done()` |

The `mounted` state lasts one tick, giving the browser a frame to apply initial styles before transitioning to `present`. This is the same principle behind `requestAnimationFrame`-based enter animations.

## Examples

::: gn-example
/components/presence/useToastDemo.ts 1
/components/presence/AnimatedToast.vue 2
/components/presence/animated-toast.vue 3

### Animated Toast That Exits Cleanly

This toast mounts when you press Show, plays a CSS enter animation, and on dismiss plays an exit animation while staying in the DOM until `animationend` fires `done()` — only then does it unmount. Driving it is a single `v-model` boolean plus `:immediate="false"`, which tells Presence to hold the `leaving` state until you signal the animation is over. The keyframes are selected entirely by the `data-state` attribute Presence writes through its slot `attrs`, so the markup carries no animation logic — CSS owns the motion, Presence owns the lifecycle.

The Lazy mount toggle flips the mount strategy. In eager mode every dismiss unmounts the toast and every show mounts a fresh instance, so the mount counter climbs on each open; in lazy mode the content mounts once on first show and hides via state on subsequent dismisses, so the counter stays at 1. Re-entry is the other behavior worth provoking: dismiss the toast and press Show again before the exit finishes, and Presence cancels the leave and returns to `present` without an unmount and remount cycle — the in-DOM element continues from wherever it was visually.

Reach for this pattern whenever conditional content needs an exit animation that `v-if` would cut short, or when expensive content should pay its setup cost once. The tradeoff of `:immediate="false"` is that you must call `done()` — forget it and the element is stranded in the `leaving` state forever; the safety valve is the default immediate mode, which auto-unmounts on the next tick when you do not need an exit animation. Presence is renderless and adds no DOM of its own, so accessibility lives in the content you render. For the composable form used inside custom setup functions, see [usePresence](/composables/system/use-presence); to render the toast in a top-level layer, wrap it with [Portal](/components/primitives/portal).

| File | Role |
|------|------|
| `useToastDemo.ts` | Owns demo state — visibility, lazy mode, the mount counter — and restarts the demo when the strategy changes |
| `AnimatedToast.vue` | Wraps Presence, binds the `data-state` attrs to the toast element, and owns the enter and exit keyframes |
| `animated-toast.vue` | Wires the composable to the component and adds the Show button, Lazy toggle, and mount counter |
:::

## Accessibility

Presence is transparent — it adds no DOM elements, ARIA attributes, or keyboard behavior. Accessibility is the responsibility of the content you render inside.

> [!TIP]
> Ensure animated content respects `prefers-reduced-motion`. Presence doesn't enforce motion preferences — your CSS should handle `@media (prefers-reduced-motion: reduce)`.

## FAQ

::: faq
??? Why not use Vue's Transition component?

`<Transition>` works well for simple CSS transitions but has limitations in headless component libraries: it requires a single root element, it's coupled to CSS class naming conventions, and it doesn't compose cleanly when a parent component needs to control mount lifecycle independently of animation. Presence separates the "when to unmount" concern from the "how to animate" concern.

??? How is this different from v-if?

`v-if` removes content immediately. Presence adds a `leaving` state between "logically hidden" and "removed from DOM" — your exit animation runs, then content is removed when you call `done()`.

??? When should I use immediate vs manual mode?

Use `immediate: true` (default) when you don't need exit animations — content unmounts on the next tick. Use `immediate: false` when you have animations and need to call `done()` to control when unmounting happens.

??? Can I use Presence with GSAP or Web Animations API?

Yes. Set `immediate` to `false`, start your animation when `isLeaving` becomes true, and call `done()` in the animation's completion callback. Presence doesn't care how the animation runs.

??? What happens if present becomes true during a leave animation?

Presence cancels the leave and transitions back to `present`. The content stays mounted — no unmount/remount cycle.

??? Should I use the composable or the component?

Use `<Presence>` for template-driven conditional rendering. Use `usePresence` when building custom components that need mount lifecycle control in their setup function.
:::

<DocsApi />
