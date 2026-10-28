---
title: Md1FeatureDiscovery - Material Design 1 Feature Discovery for Vue
meta:
- name: description
  content: The Material Design 1 feature discovery prompt, a circular background at 96% around a tap target over one promoted action, with the edge, offset and surface rules. Built on Vuetify0's Tour.
- name: keywords
  content: md1 feature discovery, material design 1 feature discovery, tap target, onboarding prompt, vue tour, vuetify0 tour, paper md1
features:
  category: Component
  label: 'C: Md1FeatureDiscovery'
  level: 2
  renderless: false
  group: overlay
  order: 6
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/fab
  - /components/disclosure/tour
---

# Md1FeatureDiscovery

<DocsPageFeatures :frontmatter />

The Material Design 1 feature discovery prompt. A large circle in the app's colour draws attention to one action, with a short title and a line of text that say what it does for the user.

<DocsMd1Reference
  href="https://m1.material.io/growth-communications/feature-discovery.html"
  title="Feature discovery"
/>

## Usage

`Md1FeatureDiscovery` is a compound. The root owns `v-model` (open) and emits `complete` when the promoted action is tapped and `dismiss` when the prompt is tapped away. `Activator` wraps the promoted action where it already sits in the layout; `Title` and `Text` are the prompt's copy.

A prompt holds one action and nothing else: no buttons, no "Next". Show it at a moment where the action helps the task in progress, and no more than once per session.

::: ds-example
/systems/md1/feature-discovery/basic

When the promoted action sits within 88 dp of the top or bottom of the screen, as an app bar action does, the tap target sits directly on it and the background centres around it (`data-placement="center"`). Setting the model to `false` yourself closes the prompt without an event.
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1FeatureDiscovery } from '@paper/md1'
</script>

<template>
  <Md1FeatureDiscovery>
    <Md1FeatureDiscovery.Activator />

    <Md1FeatureDiscovery.Title />

    <Md1FeatureDiscovery.Text />
  </Md1FeatureDiscovery>
</template>
```

The background is the primary colour (`--md1-primary`, Indigo 500 in the default theme) at the page's 96% opacity, so a trace of the screen shows through. The tap target is a light disc 88 dp across under the action; the action itself is lifted above it, so it stays visible and tappable, and a flat icon button takes the prompt colour on the disc so its glyph reads. The page gives no circle sizes; the 88 dp disc, its own edge threshold, and a background at least 2.5 times as wide are Material Design 1 decisions,[^size] and the background grows further when the text needs the room.

## Composed on Vuetify0

`Md1FeatureDiscovery` runs a one-step v0 [Tour](/components/disclosure/tour). Each prompt creates its own tour context under a unique namespace, so two prompts on a page never share a step. `Activator` is a `Tour.Activator` rendered as a `span` around the action: it registers the element the tour measures and anchors to, and it never scrolls the page. The text is a `Tour.Content`, the tour's non-modal dialog, with `Tour.Title` and `Tour.Description` inside it supplying `aria-labelledby` and `aria-describedby`. `Tour.Content` also binds Escape and moves focus into the prompt; when the tour stops or completes, the tour returns focus to the element that had it when the prompt opened.

The circles are Material Design 1's own. `Tour.Highlight` paints a rectangular cutout scrim with a stroke around the activator and takes no class, so the root draws the background and the target disc in a v0 [Portal](/components/primitives/portal) rendered in place, at the stack layer v0 gives a tour highlight, and lifts the action one layer above them. A tap outside the background stops the tour; that is the dismissal `Tour.Skip` performs, without its button. `Tour.Next`, `Tour.Prev`, `Tour.Progress` and `Tour.Keyboard` are not rendered: a prompt has one step, and the keyboard part's Enter and arrow keys would complete it without the action.

The layer carries `data-open`, `data-color`, `data-contained`, `data-placement`, `data-exit` and the v0 presence `data-state` (`mounted`, `present`, `leaving`), which the stylesheet uses for the enter, complete and dismiss motion.

## Examples

::: ds-example
/systems/md1/feature-discovery/offset

### Offset toward the centre

Away from the top and bottom bands, the guidelines move the background 20 dp off the target, toward the middle of the screen: left for a target right of centre, right for a target left of centre, and by writing direction for a centred one. The bookmark at the end of this row is right of centre, so the background shifts left and `data-placement` reads `start`. Under `dir="rtl"` the same rule mirrors.

`placement="start"` or `placement="end"` forces the side when the computed one would cover something the user needs; the edge rules that centre the background still win. The title and text sit below a target in the upper half of the screen and above one in the lower half, clear of the target disc, and are kept inside the screen; the background always grows to hold them, because white text off the background cannot be read.
:::

::: ds-example
/systems/md1/feature-discovery/accent

### Accent colour

The page says the tap target may use the app's primary colour or the toolbar's, and its colour figures show both the primary and the accent version. `color="accent"` paints the background in `--md1-accent` (Pink A200) at 96% with white ink.

The promoted action here is an `Md1Fab` with `position="static"`, placed by its container at the handset FAB inset. Wrap the FAB in `Activator` exactly like an icon button: the target disc sits under it, the FAB keeps its own colour and shadow, and its click still runs. A FAB in the bottom band takes the edge rule, so the background is centred on it.
:::

::: ds-example
/systems/md1/feature-discovery/contained

### Limited to a surface

On desktop and tablet the guidelines keep a prompt on the surface the target rests on, such as a card. From 600 px up, a target inside an `Md1Card` gets that treatment: the circles are clipped to the card and `data-contained` is set. Targets within 88 dp of the card's edge centre the background on the target, as the share button does here; targets nearer the card's centre take the 20 dp offset. The text is nudged to stay on the card.

The page lists the exceptions too, and Material Design 1 follows them. A surface smaller than 280 dp tall and 360 dp wide lets the prompt extend past its edges, unconfined. A target within the top or bottom 144 dp, or the left or right 200 dp, of the screen centres the background over everything else. `contained` overrides the automatic choice: `true` limits the prompt at any width, to the card or else to the Activator's parent element, and `false` never limits it.
:::

::: ds-example
/systems/md1/feature-discovery/hint

### Hint text

For a small prompt that asks for input, hint text replaces the tap target. It is a single line under the element it explains, joined to it by a short connector and marked with a help glyph in a 40 dp circle of the disabled ink. It does not cover the screen or hold focus, and it leaves with the card once the reader answers.

The guidelines' hint asks the reader to swipe the card away; Material Design 1 ships no swipe gesture, so the hint names the button that does the same.
:::

::: ds-example
/systems/md1/feature-discovery/guided

### Guided flow

A task that takes more than one tap gets a guided flow of up to three parts. A tap target introduces the task and its benefit: start the flow and the menu icon is promoted. Ripples lead through the following steps, in the tap target's colour: once the drawer opens, Settings pulses; on the settings screen, the backup switch pulses. A completion toast confirms the task when the switch turns on, with an action that returns to where the tap target appeared.

Each ripple is a circle that grows from the next control and fades, repeating until the reader takes the step, and never blocks the tap. Under reduced motion it holds still as a tinted circle.[^reduced-motion] The flow is a composition of `Md1FeatureDiscovery`, a ripple drawn by the app and `Md1Snackbar`; nothing advances on its own, so the reader can leave it at any step.
:::

::: ds-example
/systems/md1/feature-discovery/contextual

### Contextual trigger

The page asks for prompts at moments when they help the user finish what they are doing, and gives this case: let a user know they can crop an image only after they have added one. Nothing here opens the prompt directly. Add a photo, and once the card with its Crop action has rendered the app sets the model to `true`; the prompt is the consequence of the user's own action, not of opening the screen.

The page also caps how often a prompt appears: no more than one per session, and if the user dismisses a message, don't show it or a similar one again for a substantial period. Both `dismiss` and `complete` record the tip as seen, the first because the reader declined it and the second because they no longer need it. The flag lives in session storage through v0's `createStorage`, so removing the photo and adding another, or leaving the page and coming back, does not bring the prompt back. Reset tips clears the flag for the demo. A real app would keep it longer, in local storage or on the account.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1FeatureDiscovery.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Whether the prompt shows. Bound with `v-model`; the prompt writes `false` when it completes or is dismissed |
| `color` | `'primary' \| 'accent'` | `'primary'` | The background colour, at 96% opacity, with white ink |
| `contained` | `boolean` | | Limit the prompt to its surface: the closest `Md1Card`, else the Activator's parent. Unset, it applies from 600 px up when the target is on a card |
| `placement` | `'start' \| 'end'` | | Force the side the background moves 20 dp toward. Unset, it is computed from the target's position and the writing direction. The edge rules still centre it |

| Event | Payload | Description |
|-------|---------|-------------|
| `complete` | | The promoted action was tapped (or its target disc) |
| `dismiss` | | A tap outside the background, or Escape |
| `update:modelValue` | `boolean` | `false` when the prompt closes itself |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1FeatureDiscovery.Activator` | | A `span` around the promoted action: one icon-only `Md1Button` or an `Md1Fab`. Lifts the action above the circles, pulses it while idle, and completes the prompt on a tap. Outside the root it renders its content inert and warns in development |
| `Md1FeatureDiscovery.Title` | | The headline, Title 20 sp in the prompt's ink;[^type] the dialog's accessible name. Renders into the prompt while it shows and nothing in place |
| `Md1FeatureDiscovery.Text` | | The supporting line, Subheading 16 sp at 70%; the dialog's accessible description. Always below the title |

Each part has one default slot. There are no named slots.

## Accessibility

The text is a non-modal `role="dialog"` named by the title and described by the text. The promoted action stays where it is in the document, keeps its own name and role, and stays operable: nothing on the page is made inert. The circles are `aria-hidden`.

### Keyboard

| Key | Behavior |
|-----|----------|
| Escape | Dismisses the prompt and emits `dismiss` |
| Enter, Space | On the promoted action: runs it and completes the prompt |
| Tab, Shift+Tab | Leave the prompt's text for the page; the prompt stays open until it is completed or dismissed |

### Focus

When the prompt opens, focus moves to its dialog so a screen reader announces the title and text; it does not move when a text field already has focus. When the prompt closes, by any path, focus returns to the element that had it when the prompt opened.

### Motion

The prompt grows out of the promoted icon on the standard curve over the enter duration.[^duration] While idle the action grows by 10% over one second and shrinks back, and a ripple leaves the target disc as it peaks. A tap on the action expands the prompt and fades it; a tap outside shrinks and fades it, both on the decelerate curve the page calls ease out. Under reduced motion, from the operating system or v0's reduced-motion plugin, the pulse and the ripple stop and the prompt only fades in and out.

### Not shipped

Swipe to dismiss is a gesture and is not shipped; a tap outside and Escape cover it. The guided flow the page describes for multi-step features (the prompt, then ripples on the following controls, then a completion message with an action back to the origin) is a composition of `Md1FeatureDiscovery`, `Md1Ripple` and `Md1Snackbar`. Hint text for simple input prompts is an `Md1TextField` placeholder. Who sees a prompt and how often is the app's decision.

[^size]: Our call: the page's 88 dp edge threshold doubles as the disc; 2.5 times leaves room for a two-line prompt. Vuetify 1.5 has no equivalent, and confidence is low.

[^reduced-motion]: Our call: the spec has no reduced-motion rule; a still circle keeps the cue without the motion.

[^type]: Our call: the page names no type styles; Title and Subheading are the scale's headline and supporting pair.

[^duration]: Our call: the page gives the curves but no durations, so appear takes `--md1-duration-enter` and the tap and dismiss take `--md1-duration-leave`.
