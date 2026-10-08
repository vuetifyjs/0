---
title: EmPopover - Emerald Popover for Vue
meta:
- name: description
  content: Emerald's popover — an anchored, light-dismissed panel over the native popover API, with CSS anchor positioning and a skinned surface, composed on Vuetify0's headless Popover.
- name: keywords
  content: emerald popover, vue popover, anchored panel, css anchor positioning, native popover api, vuetify0 popover
features:
  category: Component
  label: 'C: EmPopover'
  level: 2
  renderless: false
  order: 18
related:
  - /systems/emerald
  - /systems/emerald/select
  - /components/disclosure/popover
---

# EmPopover

<DocsPageFeatures :frontmatter />

An anchored panel over the native popover API — the browser owns placement, stacking and dismissal; Emerald owns the surface.

## Usage

Three parts. `EmPopover` owns the open state and provides the anchor id; `EmPopoverActivator` is the trigger — a native `<button>` by default; `EmPopoverContent` is the panel, rendered in the top layer through the native `popover` attribute and pinned to the trigger by CSS anchor positioning.

There is nothing to position in JavaScript and nothing to teleport. The panel escapes `overflow: hidden` ancestors and stacking contexts because the top layer is above all of them, and clicking outside or pressing Escape closes it because that is what light dismiss does. `v-model` is optional — the parts coordinate through context, so an uncontrolled popover is just the three tags.

::: ds-example
/systems/emerald/popover/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmPopover } from '@paper/emerald'
</script>

<template>
  <EmPopover>
    <EmPopover.Activator />

    <EmPopover.Content />
  </EmPopover>
</template>
```

## Composed on Vuetify0

Each part maps one-to-one onto v0's [Popover](/components/disclosure/popover) compound — `Popover.Root`, `Popover.Activator`, `Popover.Content`. v0 supplies the state, the `popovertarget` and `popover` wiring, the ARIA attributes and the anchor plumbing; Emerald supplies the panel's skin — the bordered, elevated `.emerald-popover` surface on its spacing and radius tokens — and an open transition (a fade and 4px drop into place) built on `@starting-style` and discrete transitions so the native display toggle animates.

The split is why `v-model` survives light dismiss. The browser closes the popover on outside click or Escape without asking anyone; v0 listens for the native toggle event and writes the new state back into the model, so your `ref` reads `false` after a dismissal it never initiated. State flows both ways — write `true` to open, and the browser's own closes flow back.

> [!NOTE]
> Open, close and light dismiss work in every browser with the popover API; automatic placement additionally needs CSS Anchor Positioning. The [v0 Popover page](/components/disclosure/popover) lists the supported versions.

## Examples

::: ds-example
/systems/emerald/popover/trigger

### Bring your own trigger

By default `EmPopoverActivator` renders its own native `<button>`, which is correct but unstyled. The moment you want an `EmButton` as the trigger you must not nest it inside that default — a button inside a button is invalid HTML and a control screen readers announce twice. `renderless` is the escape hatch: the activator renders no element of its own and instead hands you an `attrs` object through its slot to bind onto exactly one element.

`attrs` is the whole trigger contract in one bag — `popovertarget` pointing at the panel, `aria-expanded` and `aria-controls`, a `data-open` styling hook, and the `anchor-name` style that pins the panel to whatever you bind it to. Bind it once and the element you chose becomes the anchor; forget it and the trigger does nothing, because the wiring lives entirely in those attributes.

Only spread `attrs` in `renderless` mode. In the default mode the activator has already applied them to its own element, and binding them again onto a child duplicates the wiring.
:::

::: ds-example
/systems/emerald/popover/placement

### Placement

`positionArea` on `EmPopoverContent` takes any CSS position-area value — `top`, `bottom`, `inline-end span-block-end` — and places the panel relative to its anchor without a pixel of JavaScript. The default is `bottom`, centered under the trigger.

`positionTry` is the fallback list for when the preferred side does not fit the viewport; it takes any position-try-fallbacks value, defaulting to `most-width bottom`. `flip-block`, as here, mirrors the panel to the opposite side when its own side runs out of room — the value to reach for when a popover near a viewport edge should flip rather than shrink.

Both are plain strings passed through to CSS, so the [MDN position-area reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area) is the authoritative list of what they accept. Logical values like `inline-end` follow the writing direction, so a panel that sits to the right in LTR sits to the left in RTL without a prop changing.
:::

::: ds-example
/systems/emerald/popover/controlled

### Controlling the state

`v-model` on the root makes the open state yours. Write `true` and the panel shows; write `false` and it hides; and when the browser light-dismisses — an outside click, an Escape — the model is written back, so the binding never drifts from what is actually on screen.

That two-way sync is what makes the outside toggle in this example safe. A control that only wrote into the popover would go stale the first time the reader clicked elsewhere; here the model is the single source of truth no matter which side closed it.

Reach for the model when something other than the trigger needs to close the panel — a Done button inside it, a route change, a form submit. For a popover that only ever opens from its trigger and closes by dismissal, skip the model entirely; the uncontrolled default already does all of that.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the EmPopover sources until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state. Optional — the compound is fully functional uncontrolled |
| `id` | `string` | generated | Shared anchor id for the trigger and panel. Falls back to `useId()` |

### Parts

None of the parts take a `namespace` — they bind to the nearest `EmPopover` above them through context, so nesting one popover inside another's panel resolves by proximity.

| Part | Renders | Props | Slot props |
|------|---------|-------|-----------|
| `EmPopoverActivator` | The trigger — a native button unless `as` or `renderless` says otherwise | `as`: `DOMElement \| null` (default `'button'`), `renderless`: `boolean` (default `false`) | `isOpen`, `attrs` |
| `EmPopoverContent` | The panel, via the native popover attribute | `positionArea`: `string` (default `'bottom'`), `positionTry`: `string` (default `'most-width bottom'`) | — |

The activator's `attrs` bundle carries `popovertarget`, `aria-expanded`, `aria-controls`, `data-open` (`true` while open, absent otherwise — a CSS hook), `tabindex="0"`, the `anchor-name` style, and one host-specific extra: `type="button"` when the host is a native button, or `role="button"` plus an Enter/Space keydown polyfill when it is not. Bind it onto exactly one element, and only in `renderless` mode.

`EmPopoverContent` styles the panel through the `.emerald-popover` class; its default slot is plain content with no slot props.

## Accessibility

The popover is native. `EmPopoverContent` carries the `popover` attribute and `EmPopoverActivator` points at it with `popovertarget`, so opening, closing, light dismiss and Escape are the browser's behavior rather than script — the same machinery a plain HTML popover gets.

### ARIA attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| `popovertarget` | Panel id | Activator |
| `aria-expanded` | `true` / `false` | Activator |
| `aria-controls` | Panel id | Activator |
| `popover` | `''` (auto) | Content |

The panel carries no `role` of its own, deliberately — a popover can hold a menu, a listbox or plain prose, and only you know which. Give `EmPopoverContent` the role that matches what you put in it, or none when it is ordinary content.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | Toggle the panel — native button activation of `popovertarget` |
| Escape | Close — native light dismiss |

When `as` renders something other than a native button, v0 adds `role="button"` and an Enter/Space keydown handler to the `attrs` bundle so the trigger stays operable; on the default native button neither is added, because the platform already provides both.

### Trigger naming

The trigger's accessible name is its content. With the default activator that is your slot text; with `renderless` it is whatever element you bound `attrs` to — an icon-only `EmButton` trigger still needs its `ariaLabel`, exactly as it would anywhere else.

### Focus

Nothing traps or moves focus — the panel is not modal, and no focus management is scripted. Focus stays on the trigger when the panel opens, and `aria-expanded` flipping to `true` is what tells a screen reader something appeared. Keep that in mind when deciding what belongs in a popover: a quick, glanceable panel is the fit; a task that deserves captured focus and an explicit dismissal is [EmDialog](/systems/emerald/dialog)'s job.
