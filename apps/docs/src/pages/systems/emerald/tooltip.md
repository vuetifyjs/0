---
title: EmTooltip - Emerald Tooltip for Vue
meta:
- name: description
  content: Emerald's tooltip — a hover and focus description bubble with delay warmup, CSS anchor positioning, and an interactive mode, composed on Vuetify0's headless Tooltip.
- name: keywords
  content: emerald tooltip, vue tooltip, hover tooltip, accessible tooltip, anchor positioning tooltip, vuetify0 tooltip
features:
  category: Component
  label: 'C: EmTooltip'
  level: 2
  renderless: false
  order: 29
related:
  - /systems/emerald
  - /systems/emerald/popover
  - /components/disclosure/tooltip
---

# EmTooltip

<DocsPageFeatures :frontmatter />

A description bubble that opens on hover or keyboard focus — delays, warmup and dismissal come from Vuetify0; Emerald supplies the dark, compact surface.

## Usage

Three parts. `EmTooltip` owns the open state, the delays and the placement; `EmTooltipActivator` is the trigger — a native `<button>` by default; `EmTooltipContent` is the bubble, rendered in the top layer through the native popover attribute and pinned to the trigger by CSS anchor positioning.

Hovering the trigger opens the bubble after an open delay — 700ms by default — and leaving it closes after a short close delay. Keyboard focus skips the wait entirely and opens on the spot. `v-model` is optional: the parts coordinate through context, so an uncontrolled tooltip is just the three tags, and the model is only for the rare case where something else needs to read or drive the state.

::: ds-example
/systems/emerald/tooltip/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmTooltip } from '@paper/emerald'
</script>

<template>
  <EmTooltip>
    <EmTooltip.Activator />

    <EmTooltip.Content />
  </EmTooltip>
</template>
```

## Composed on Vuetify0

Each part maps one-to-one onto v0's [Tooltip](/components/disclosure/tooltip) compound — `Tooltip.Root`, `Tooltip.Activator`, `Tooltip.Content`. v0 owns everything that behaves: the open and close timers, the pointer and focus wiring, the `aria-describedby` link, the native popover rendering and the anchor plumbing. Emerald owns only the skin — the `.emerald-tooltip__content` bubble, a 240px-max dark surface on the system's smallest body step — and an unstyled `.emerald-tooltip__activator` class hook on the trigger. The root renders no element at all.

The timing model is the part worth understanding. Delays resolve against a region: `openDelay` and `closeDelay` fall back to region defaults of 700ms and 150ms, and after any tooltip closes there is a 300ms skip window during which the next one opens instantly — the warmup pattern that makes sweeping across a toolbar feel immediate instead of stuttering through a delay per button. Install v0's [useTooltip](/composables/plugins/use-tooltip) plugin (`createTooltipPlugin`) to share that region app-wide; without it each `EmTooltip` falls back to its own private region, so the defaults still apply and re-hovering the same trigger inside the window is instant, but separate tooltips do not warm each other up.

The open state also distinguishes *how* it opened: the content and activator carry `data-state` as `closed`, `delayed-open` or `instant-open`, so CSS can animate a patient hover reveal differently from an instant warmup or focus one. Emerald's skin does not animate either today; the attributes are there to hang your own transitions on.

## Examples

::: ds-example
/systems/emerald/tooltip/trigger

### Bring your own trigger

By default `EmTooltipActivator` renders its own native `<button>`, which is correct but unstyled. To use an `EmButton` as the trigger you must not nest one inside that default — a button inside a button is invalid HTML. `renderless` is the escape hatch: the activator renders no element of its own and instead hands you the wiring through its slot to bind onto exactly one element.

Two slot props matter, and you need both. `attrs` is the behavior — `aria-describedby` pointing at the bubble, the pointer, focus, blur, click and Escape handlers, and the `data-state` / `data-disabled` styling hooks. `styles` carries the `anchor-name` declaration that the bubble's CSS positioning resolves against; forget it and the tooltip still opens, but it no longer knows where its trigger is.

This pairing is also the accessibility story for icon-only buttons. The tooltip is a *description*, not a name — `aria-describedby` supplements the accessible name, it does not create one — so the icon-only trigger here still needs its own `aria-label`, exactly as it would without a tooltip.

Only spread `attrs` in `renderless` mode. In the default mode the activator has already applied them to its own element, and binding them again onto a child duplicates the handlers.
:::

::: ds-example
/systems/emerald/tooltip/placement

### Placement

`positionArea` on `EmTooltip` takes any CSS position-area value and places the bubble relative to its trigger without a pixel of JavaScript. The default is `top`, centered above the trigger — the conventional side for a tooltip, where it does not cover what the pointer is about to interact with.

`positionTry` is the fallback list for when the preferred side does not fit the viewport, defaulting to `most-height top`. When you move the bubble to another side, move the fallback with it — as the `bottom` tooltip here does — or a cramped viewport will flip the bubble back to the side you moved it away from.

Both are plain strings passed through to CSS, so the [MDN position-area reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area) is the authoritative list of what they accept. Logical values like `inline-end` follow the writing direction, so a bubble that sits to the right in LTR sits to the left in RTL without a prop changing.

Note the props live on the root, not the content — the root owns the anchor plumbing, and `EmTooltipContent` takes nothing but a `namespace`.
:::

::: ds-example
/systems/emerald/tooltip/interactive

### Interactive content

By default the bubble is inert: moving the pointer off the trigger starts the close timer, and the bubble is gone 150ms later. `interactive` changes that — entering the content cancels the pending close, and leaving it starts the timer again, so the reader can travel from trigger to bubble and hover a link inside it. The close delay is what bridges the gap between the two elements; the pointer has 150ms of dead air to cross.

Use it sparingly. Blur still closes the tooltip, so a keyboard user's focus never dwells in the content — the link in this example is reachable by pointer only. That makes interactive tooltips a convenience layer, never a home for anything essential: if an action or link must be reachable by everyone, it belongs in an [EmPopover](/systems/emerald/popover), which the reader deliberately opens and which holds its ground until dismissed.

The content advertises the mode with a `data-interactive` attribute while it is on, in case your styling wants to signal hoverability — a pointer cursor, a stronger border.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the EmTooltip sources until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Optional — the compound is fully functional uncontrolled |
| `openDelay` | `number` | region default (`700`) | ms of hover before opening. Keyboard focus and the warmup skip window bypass it |
| `closeDelay` | `number` | region default (`150`) | ms before closing after the pointer leaves |
| `disabled` | `boolean` | `false` | Disables the tooltip. On the default activator this also sets the native `disabled` attribute on the trigger button itself |
| `interactive` | `boolean` | `false` | Content stays open while the pointer is over it |
| `positionArea` | `string` | `'top'` | CSS `position-area` for the bubble |
| `positionTry` | `string` | `'most-height top'` | CSS `position-try` fallbacks |
| `namespace` | `string` | `'v0:tooltip'` | Which v0 Tooltip context the parts bind to. Only needed when nesting |

### Parts

Every part takes `namespace`, defaulting to `'v0:tooltip'`.

| Part | Renders | Props | Slot props |
|------|---------|-------|-----------|
| `EmTooltipActivator` | The trigger — a native button unless `as` or `renderless` says otherwise | `as` (default `'button'`), `renderless`: `boolean` (default `false`) | `isOpen`, `isDisabled`, `attrs`, `styles` |
| `EmTooltipContent` | The bubble — a `role="tooltip"` div in the top layer via the native popover attribute | — | — |

The activator's `attrs` bundle carries `aria-describedby` pointing at the bubble, `data-state` (`closed` / `delayed-open` / `instant-open`), `data-disabled`, the native `disabled` and `type="button"` attributes when `as` is `'button'` — the default, renderless included — and `aria-disabled` when it is not, plus the pointer, focus, blur, click and Escape handlers. `styles` is the `anchor-name` declaration. In `renderless` mode bind both onto exactly one element.

`EmTooltipContent` styles the bubble through the `.emerald-tooltip__content` class; its default slot is plain content with no slot props. Neither part — nor the root — exposes anything through a template ref.

## Accessibility

The bubble is a description, wired the way WAI-ARIA expects: the content carries `role="tooltip"`, and the trigger carries `aria-describedby` pointing at it, so a screen reader announces the tooltip text after the trigger's own name. That order matters for what you put where — the tooltip supplements the trigger's name, it never provides one. An icon-only trigger still needs its own label; a tooltip that just repeats the visible label adds noise and should be dropped.

### Triggers and dismissal

| Interaction | Behavior |
|-------------|----------|
| Pointer enters trigger (mouse, pen) | Opens after `openDelay` — or instantly inside the warmup skip window |
| Pointer leaves trigger | Closes after `closeDelay` |
| Keyboard focus | Opens instantly, no delay — gated on `:focus-visible`, so a mouse click that incidentally moves focus does not open it |
| Blur | Closes |
| Click / activation | Closes — activating the trigger dismisses its tooltip |
| Escape | Closes, from the trigger or from inside interactive content |
| Touch | Never opens — touch pointers are suppressed entirely, per the WAI-ARIA APG |

The touch row is a design constraint to plan around, not a bug: a tooltip has no hover to hang off on a touch screen. Anything a touch user must be able to read cannot live only in a tooltip.

### Disabled

`disabled` prevents the tooltip from opening, and on the default activator it goes further: the underlying v0 activator sets the native `disabled` attribute on its button, taking the trigger itself out of the tab order and out of pointer interaction. Which attribute you get is decided by the `as` prop, not by `renderless` — any non-`'button'` `as` receives `aria-disabled` instead and stays focusable, while a `renderless` trigger with the default `as` still finds the native `disabled` attribute in its `attrs` bundle. If you want a disabled *tooltip* on a still-working *trigger*, don't reach for `disabled` at all: in `renderless` mode the tooltip only touches your element through the `attrs` you spread, so leaving them unbound leaves the trigger fully functional with no tooltip wiring.

### Interactive mode

`interactive` is a pointer affordance only. Focus leaving the trigger closes the tooltip, so keyboard focus cannot travel into the content — links or buttons inside an interactive tooltip are unreachable for keyboard and switch users. Keep the content supplementary, and give any essential action a surface with real focus semantics, like [EmPopover](/systems/emerald/popover) or [EmDialog](/systems/emerald/dialog).
