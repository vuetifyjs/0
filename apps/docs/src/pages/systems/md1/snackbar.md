---
title: Md1Snackbar - Material Design 1 Snackbar for Vue
meta:
- name: description
  content: The Material Design 1 snackbar. One short message at the bottom edge with at most one text action, single or two lines, queued one at a time and gone on its own. Built on Vuetify0's Snackbar.
- name: keywords
  content: md1 snackbar, material design 1 snackbar, toast, notification, undo action, vue snackbar, vuetify0 snackbar, paper md1
features:
  category: Component
  label: 'C: Md1Snackbar'
  level: 2
  renderless: false
  group: overlay
  order: 4
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/fab
  - /components/semantic/snackbar
  - /composables/plugins/use-notifications
---

# Md1Snackbar

<DocsPageFeatures :frontmatter />

The Material Design 1 snackbar. A short message about an operation at the bottom of the screen, with at most one text action, that leaves on its own.

<DocsMd1Reference
  href="https://m1.material.io/components/snackbars-toasts.html"
  title="Snackbars and toasts"
/>

## Usage

`Md1Snackbar` is a compound. The root is one snackbar: the default slot is the message and `action` is the label of its one button. Put it inside `Md1Snackbar.Portal`, the fixed bottom container. Drive a single snackbar with `v-model`, or let `Md1Snackbar.Queue` show notifications one at a time.

::: ds-example
/systems/md1/snackbar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Snackbar } from '@paper/md1'
</script>

<template>
  <Md1Snackbar.Portal>
    <Md1Snackbar.Queue>
      <Md1Snackbar />
    </Md1Snackbar.Queue>
  </Md1Snackbar.Portal>
</template>
```

## Composed on Vuetify0

`Md1Snackbar` renders v0's [Snackbar](/components/semantic/snackbar) compound. `Md1Snackbar.Portal` is `Snackbar.Portal`: it teleports to the body (or into the topmost open modal dialog), takes a z-index from the overlay stack and renders the pair of live regions that announce each message. `Md1Snackbar.Queue` is `Snackbar.Queue`, which reads [useNotifications](/composables/plugins/use-notifications) and pauses the timer while the pointer or focus is inside. The root is `Snackbar.Root` with `Snackbar.Content` as the message span.

Entrance and exit run through [usePresence](/components/primitives/presence): the root stays mounted until its exit animation ends, which is what lets the queue hold the next snackbar back until the first has left. The action is a flat [Md1Button](/systems/md1/button), with its ripple, in the accent colour.

v0's portal applies the stack z-index inline and only nudges a static wrapper to `position: relative`, so the `md1-snackbar-portal` class positions itself: fixed, the full width of the bottom edge, and transparent to the pointer outside the bar. `data-state` comes from the presence state; `data-align`, `data-multiline` and `data-stacked` are Material Design 1's own.

## Examples

::: ds-example
/systems/md1/snackbar/queue

### Queue

`Md1Snackbar.Queue` shows the notifications sent through `useNotifications().send()`, and only one at a time. The guidelines never stack snackbars: when a second one is sent while the first is up, the first contracts downward and the second animates upward once it has gone. The queue renders the newest notification through its slot as `item`; older ones leave the display queue but stay in the notifications inbox.

The guidelines give no duration. Material Design 1's default is 6000 ms (Vuetify 1.5's value),[^timeout] set by the queue's `timeout` prop for every notification sent without its own; a `timeout` passed to `send()` still wins. Hovering or focusing the snackbar pauses the timer, so a reader who reaches for the action is never cut off.[^pause]

An app installs `createNotificationsPlugin()` once and sends from anywhere. This example provides its own notifications context instead because the docs install none. A snackbar inside a queue takes the shown notification's id, so its action dismisses that notification without any wiring.
:::

::: ds-example
/systems/md1/snackbar/multiline

### Two lines

`multiline` is the handset form for a message that needs a second line: 80 dp tall with 24 dp above and below the text, the 20 dp line pitch centred between them. The message is cut after two lines; the guidelines ask for very short text, so a longer one belongs in a dialog.

A single-line snackbar is 48 dp, with 14 dp above and below a 20 dp line, and cuts an overflowing message with an ellipsis rather than growing. Both forms keep the text in Body 1 white on `#323232` (`--md1-snackbar`), the same in the light and dark themes.
:::

::: ds-example
/systems/md1/snackbar/stacked

### Long action

When a two-line snackbar's action is wider than 128 dp, the action moves to its own row: the 112 dp form of the handset specs, the label at the end and 14 dp off the bottom edge. Material Design 1 measures the rendered action and sets `data-stacked`; there is no prop, because the layout follows the label, which a translation can lengthen.[^measure]

Otherwise the action sits on the message's line with 24 dp between the two (48 dp from 600 px) and its label 24 dp from the end edge. It is a flat button in the accent colour, uppercased by the stylesheet. Choosing it emits `action` and dismisses the snackbar. "Dismiss" and "Cancel" are not snackbar actions, because a snackbar leaves on its own; Material Design 1 warns in development when the label is either one.
:::

::: ds-example
/systems/md1/snackbar/align

### Placement

Under 600 px the snackbar runs the full width of the screen, square and flush with the bottom edge. From 600 px it becomes a bar between 288 and 568 dp wide with 2 dp corners. `align` places that bar: `center` (the default) centres it on the bottom edge, `start` sets it 24 dp in from the start and bottom edges, which is the left in a left-to-right page.

The entrance is upward from the bottom edge on the decelerate curve (225 ms on a handset, 150 ms with a mouse) and the exit downward on the accelerate curve (195 ms, 150 ms with a mouse). Under reduced motion the slide is dropped; the snackbar still appears and leaves in order.
:::

::: ds-example
/systems/md1/snackbar/fab

### With a floating action button

A snackbar never covers the floating action button: the button moves up by the snackbar's height and comes back down when it leaves. While shown, the root publishes its height as `--md1-snackbar-height` on the element that holds the portal, the body in an app, and `Md1Fab` adds it to its bottom inset.

The snackbar rests at 6 dp, the floating action button's own elevation, and 2 dp lower under a mouse, following the elevation page's desktop rule. Dialogs, bottom sheets and navigation drawers sit above both.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Snackbar.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `true` | Shown or not, outside a queue. An unbound snackbar shows once when mounted and leaves after `timeout` |
| `action` | `string` | | The label of the one text action. Choosing it emits `action` and dismisses the snackbar; "Dismiss" and "Cancel" warn in development |
| `multiline` | `boolean` | `false` | The two-line form: 80 dp. With an action wider than 128 dp, the 112 dp form with the action on its own row |
| `align` | `'center' \| 'start'` | `'center'` | Placement from 600 px: centred on the bottom edge, or 24 dp in from the start and bottom edges |
| `timeout` | `number` | `6000` | Auto-dismiss in ms for a `v-model` snackbar; must be positive. Inside a queue, the queue's `timeout` applies |
| `id` | `ID` | | The notification the snackbar dismisses. Inside a queue it defaults to the shown notification |
| `namespace` | `string` | | The notifications key; defaults to the portal's |

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | | The action was chosen; the snackbar is on its way out |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Snackbar.Portal` | `teleport`, `namespace` | `div.md1-snackbar-portal`, fixed along the bottom edge. `teleport` is `'top-layer'` by default, a selector, or `false` to render inline; `namespace` (`'v0:notifications'`) is inherited by the queue and the snackbars inside |
| `Md1Snackbar.Queue` | `timeout`, `namespace` | Renders the newest notification through its slot as `item`, one at a time. `timeout` (6000 ms) applies to notifications sent without their own |

The root's default slot is the message; the queue's default slot receives `item`. There are no named slots, and no icons: the guidelines forbid them in a snackbar.

## Accessibility

The snackbar is `role="status"`, a polite live region. Freshly inserted live regions are not reliably announced, so the portal keeps a persistent pair of visually hidden regions and the snackbar mirrors its text into them when it appears: the message, then the action label. The guidelines name no urgent level, and critical errors do not belong in a snackbar; there is no `role="alert"` form.[^role]

A snackbar does not take focus and does not block the page. Its action is a native button in the tab order. Hovering the snackbar or moving focus into it pauses the timer, and leaving resumes it, so the action stays reachable for as long as a reader needs (WCAG 2.2.1).

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus to and from the action |
| Enter, Space | Chooses the action, which dismisses the snackbar |

A snackbar times out, so it must never be the only route to something. Put the same action somewhere permanent: an undo in the toolbar, a retry in the list. Swipe to dismiss is not shipped; the timeout and the action cover dismissal.

[^timeout]: Vuetify 1.5.24, components/VSnackbar/VSnackbar.ts:22-24. `timeout` defaults to 6000.

[^pause]: Our call: the page is silent on pausing; WCAG 2.2.1 asks for it.

[^measure]: Our call: the page draws the 112 dp form but gives no trigger, so the 128 dp threshold is ours.

[^role]: Our call: the errors pattern keeps critical errors out of snackbars, so the polite role always fits.
