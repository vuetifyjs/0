---
title: Tour - Guided Tour Component for Vue 3
meta:
- name: description
  content: Build guided product tours for Vue 3. Highlight targets, step through overlays, and navigate with keyboard — headless chrome for onboarding walkthroughs.
- name: keywords
  content: tour, guided tour, onboarding, walkthrough, highlight, Vue 3, headless
features:
  category: Component
  label: 'C: Tour'
  github: /components/Tour/
  renderless: false
  level: 2
related:
  - /composables/semantic/create-tour
  - /components/disclosure/dialog
  - /components/disclosure/popover
---

# Tour

Walk users through your UI with a highlight, a portaled overlay, and keyboard bindings. Each Root is one step; the tour instance is provided above the tree.

<DocsPageFeatures :frontmatter />

<DocsBrowserSupport
  feature="CSS Anchor Positioning"
  :versions="{ chrome: '125+', edge: '125+', firefox: '147+', safari: '26+' }"
  anchor="css-anchor-positioning"
>

Tour.Content positions against the activator with CSS Anchor Positioning. In browsers without `position-area` support it falls back to a viewport-edge `position: fixed` placement.

</DocsBrowserSupport>

## Usage

Provide a tour instance above the tree with [createTourContext](/composables/semantic/create-tour), wrap real elements with `Tour.Activator`, and render one `Tour.Root` per step. Root does not create the tour.

::: gn-example
/components/tour/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Tour } from '@vuetify/v0'
</script>

<template>
  <Tour.Keyboard />

  <Tour.Highlight />

  <Tour.Root step="intro">
    <Tour.Activator step="intro" />

    <Tour.Content>
      <Tour.Title />

      <Tour.Description />

      <Tour.Progress />

      <Tour.Prev />

      <Tour.Next />

      <Tour.Skip />
    </Tour.Content>
  </Tour.Root>
</template>
```

## Examples

::: gn-example
/components/tour/useOnboarding.ts 1
/components/tour/OnboardingTour.vue 2
/components/tour/product-tour.vue 3

### Product walkthrough

A three-step walkthrough of a fake chrome bar — search, settings, and the avatar — driven by the Tour compound rather than hand-rolled overlay math. The instance is created once with [createTourContext](/composables/semantic/create-tour), provided above the tree, and onboarded with three tickets. `Tour.Root` is per-step: it does not own the sequencer, it only exposes that step's `isActive` / `next` / `prev` / `stop` / `complete` to its children. Activators wrap the real controls; a single `Tour.Highlight blocking` paints the scrim, and `Tour.Keyboard` binds arrows, Enter, and Escape for the active tour.

Content portals to the body and waits up to two seconds for its activator before showing anyway, then anchors with CSS `position-area` (or a viewport-edge fallback). `placement` and `placementMobile` live on `Tour.Content`; a ticket `placement` of `top` / `bottom` / `left` / `right` / `center` overrides Content's `placement`. The avatar step sets `placement: 'left'` on the ticket so that step sits beside the control while the others keep Content's `bottom` default. Next on the last step calls `complete()` instead of a no-op `next()`; Skip emits `skip` and then `stop()`, so the tour ends without `isComplete`. `blocking` swallows backdrop clicks and does not dismiss — Escape or Skip does.

Reach for this shape when the walkthrough targets elements that already exist in the page. Prefer [createTour](/composables/semantic/create-tour) without the compound when you only need the sequencer and will paint chrome yourself. Filter the onboard list before `start()` if a step should not run on a given viewport; do not expect the factory to drop steps for you.

| File | Role |
|------|------|
| `useOnboarding.ts` | Creates the tour context, provides it, and onboards the three step tickets |
| `OnboardingTour.vue` | Chrome bar, activators, highlight, keyboard, and per-step Root / Content |
| `product-tour.vue` | Entry — provides the instance, Start control, and complete status |

:::

## Accessibility

`Tour.Content` renders a non-modal dialog (`role="dialog"`, no `aria-modal`) labelled by `Tour.Title` and described by `Tour.Description`. The spotlight target stays in the page, so Tab is allowed to leave the card. `Tour.Progress` is a live region (`role="status"`) announcing the localized step count. `Tour.Highlight` is `aria-hidden`. When the overlay is ready, focus moves to Content unless a field already has it. When the tour stops or completes, focus returns to the element that was focused before `start()`. `blocking` also marks the rest of the page `inert` (the card, the scrim, and — unless `blockActivator` — the active target stay operable).

### ARIA Attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| `role` | `dialog` | Content |
| `aria-labelledby` | Title element ID | Content |
| `aria-describedby` | Description element ID | Content |
| `role` | `status` | Progress |
| `aria-label` | Localized previous / next / complete / skip string | Prev, Next, Skip |
| `aria-disabled` | boolean on a non-button host; omitted on `<button>` | Prev, Next |
| `aria-hidden` | `true` | Highlight |

`Tour.Title` and `Tour.Description` generate the IDs referenced by Content. Render them inside `Tour.Content` so the dialog has an accessible name and description. Prev is disabled on the first step; Next is disabled while the tour is unready.

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Advances; completes on the last step |
| `ArrowLeft` | Moves to the previous step |
| `Enter` | Advances unless a control is focused; completes on the last step |
| `Escape` | Stops the tour without completing |
| `Tab` | Moves focus. It is not trapped; the target stays reachable |
| `Escape` | Stops the tour even when `Tour.Keyboard` is omitted. Content listens on its own |

`Tour.Keyboard` is renderless and only binds arrows and Enter while `isActive`. Arrows do nothing when focus is inside a slider, tablist, listbox, radiogroup, menu, or `<select>`. Escape is also bound by Content, so a card still dismisses without Keyboard. Space on a focused Prev / Next / Skip activates that control natively.

## FAQ

::: faq

??? Does Tour.Root create the tour instance?

No. Root is per-step context — `isActive`, title/description ids, and navigation delegates. Create the instance with [createTour](/composables/semantic/create-tour) or [createTourContext](/composables/semantic/create-tour) and provide it above the tree before any Root, Activator, Highlight, or Keyboard mounts.

??? Does clicking the highlight dismiss the tour?

No. `blocking` swallows clicks on the backdrop and `blockActivator` swallows clicks on the cutout. Neither calls `stop()` or `complete()`. Dismiss with Skip, Escape, or `tour.stop()`.

??? What if the activator is not mounted yet?

Content polls for the step's activator and waits up to two seconds, then shows anyway (centered, with a warning). The last step, and any step with `noActivator`, skips that wait and centers immediately. Highlight paints a full scrim for those steps instead of a cutout. `Tour.Highlight` and `Tour.Content` promote themselves above overlays that open later, so a step that opens search or settings does not cover the card.

??? How do placement and placementMobile interact with the ticket?

`placement` on Content is the default (bottom). `placementMobile` wins when `smAndDown` is true. A ticket `placement` of `top`, `bottom`, `left`, `right`, or `center` overrides Content's `placement` (mobile still wins when set). Missing activators and oversized mobile targets force `center`.

??? What is the difference between Next on the last step and Skip?

Next on the last step calls `complete()` — the tour ends with `isComplete` true. Skip emits `skip` and then `stop()` — the tour ends without completing. Escape calls `stop()` without emitting `skip`.

:::

<DocsApi />
