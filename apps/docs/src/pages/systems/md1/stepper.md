---
title: Md1Stepper - MD1 Stepper for Vue
meta:
- name: description
  content: The Material Design 1 stepper. Numbered steps on a 72 dp bar or stacked vertically, linear or non-linear, with alternative labels, editable, optional and error steps, transient feedback and the three mobile forms. Built on Vuetify0's Step and Collapsible.
- name: keywords
  content: md1 stepper, material design 1 stepper, wizard, steps, vertical stepper, mobile stepper, vue stepper, vuetify0 step, paper md1
features:
  category: Component
  label: 'C: Md1Stepper'
  level: 2
  renderless: false
  group: disclosure
  order: 3
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/expansion-panel
  - /components/providers/step
  - /components/disclosure/collapsible
  - /components/actions/button
  - /components/semantic/progress
---

# Md1Stepper

<DocsPageFeatures :frontmatter />

The Material Design 1 stepper. Progress through a sequence of numbered steps, on a horizontal bar or stacked down the page, with the bottom-bar forms for mobile.

> [!NOTE]
> Reference: [Steppers, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/steppers.html), the archived page MD1 is pinned to. Metrics, colour, states and the mobile forms. This page is the Vue.

## Usage

`Md1Stepper` is a compound. The root owns the active step through `v-model`; each `Step` is one numbered step and holds its `Content`, and `Actions` is the CONTINUE and CANCEL row at the end of a step's body. The stepper is linear by default: each step is completed before the next opens.

::: ds-example
/systems/md1/stepper/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
</script>

<template>
  <Md1Stepper>
    <Md1Stepper.Step>
      <Md1Stepper.Content>
        <Md1Stepper.Actions />
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Bar />
  </Md1Stepper>
</template>
```

The parts are also exported under their flat names: `Md1StepperStep`, `Md1StepperContent`, `Md1StepperActions` and `Md1StepperBar`.

## Composed on Vuetify0

`Md1Stepper` is built on v0's [Step](/components/providers/step). Each `Md1Stepper.Step` registers through `Step.Item`, so `v-model`, the single active step and the bounded `next` and `prev` that CONTINUE, BACK and NEXT call are v0's. The root builds the step context `Step.Root` would provide, with v0's `createStep` and `provideStepRoot`, but reactive: a step reads its number and the root its count as later siblings register, which `Step.Root`'s own context does not track. The context is created with `mandatory: 'force'`, so one step is always active.

Each step's `Content` is a v0 [Collapsible](/components/disclosure/collapsible) region, open while its step is active and `hidden` otherwise, so a step's form keeps its state while the user is elsewhere. The region is named by the step's label. In a horizontal stepper the content is teleported under the whole header; in a vertical one it stays inside its step. `Actions` renders two [Md1Button](/systems/md1/button)s, and the mobile `Bar` renders the dots or the bar through v0's [Progress](/components/semantic/progress) with a "Step N of M" text alternative.

MD1 styles the attributes it publishes: `data-vertical`, `data-linear`, `data-alternative`, `data-mobile` and `data-feedback` on the root, and `data-state` (`active`, `complete`, `inactive`), `data-editable`, `data-optional` and `data-error` on each step. Every step header the user can go to is a v0 [Button](/components/actions/button) `Button.Root`, a native button, with a [Md1Ripple](/systems/md1/ripple) as its first child, and the check, pencil, warning and chevron glyphs draw through [Md1Icon](/systems/md1/icon).

## Examples

::: ds-example
/systems/md1/stepper/vertical

### Vertical

Vertical steppers stack the steps and open the active step's content under its label. The guidelines design them for narrow screens and call them ideal for mobile, so keep each step's content responsive.

The label row starts 24 dp from the top, with 12 dp from the circle to the label, and the content is indented to the label's keyline, 60 dp from the edge. The 1 dp connector runs down from each circle, 8 dp clear of it, to the next circle. The CONTINUE and CANCEL row sits 16 dp under the content with 8 dp between the buttons, and the next step's label starts 48 dp below that row. The guidelines state no motion for the content; MD1 opens it as a height change over the standard 300 ms.
:::

::: ds-example
/systems/md1/stepper/non-linear

### Non-linear

A non-linear stepper lets the user enter the flow at any point and complete the steps in any order. Set `:linear="false"`. Every step not reached yet is a button, its label at 54% rather than the linear stepper's 38%, and it takes the 6% hover overlay over the whole step cell and a 6% ripple from the press point.

A non-linear stepper cannot infer which steps are done, so mark them with `complete`: the circle turns to the primary colour with a white check, and a completed step is locked unless it is also `editable`. In a linear stepper `complete` is optional, because every step before the active one is completed.
:::

::: ds-example
/systems/md1/stepper/alternative

### Alternative labels

`alternative-labels` centres each label 16 dp under its circle and divides the bar into equal parts. The bar grows to 104 dp, with 24 dp above the circle and below the label and 16 dp at the sides, and each connector runs between two circles, 8 dp clear of each.

The guidelines give this placement for horizontal steppers only; on a vertical stepper the prop has no effect. Use it when the labels are long enough to crowd a 72 dp bar, although the guidelines prefer short step names in any horizontal stepper.
:::

::: ds-example
/systems/md1/stepper/editable

### Editable steps

An editable step can be returned to and edited within the session. Once completed, it shows a pencil in its circle instead of the check, and its header stays a button, so a linear stepper lets the user go back to it.

A step without `editable` is locked once completed. Use that when editing a step after the fact would invalidate later ones, or would distract from finishing the flow. Here the campaign settings stay editable and the billing account does not.
:::

::: ds-example
/systems/md1/stepper/optional

### Optional steps

Optional steps within a linear flow must be marked as optional. `optional` adds the 12 sp "Optional" sub-label under the step name at 54%; the step still counts as completed once the user continues past it.

The sub-label is translatable through the `Md1.optional` locale key. A `summary` takes the same place, the vertical stepper's "Summary if needed" line, and wins over the "Optional" mark when both are set.
:::

::: ds-example
/systems/md1/stepper/error

### Errors

`error` takes the message to show. The red warning glyph replaces the circle, the step name turns red Medium, and the message sits under it in 12 sp red, taking the sub-label's place. The step grows to two lines inside the 72 dp bar.

The red is `--md1-error`, Red A400, the colour the text field uses for its error line. Clear `error` once the user fixes the step; the step then returns to whatever state its position gives it.
:::

::: ds-example
/systems/md1/stepper/feedback

### Transient feedback

The guidelines let a stepper show a transient feedback message after a step is saved, and only when there is long latency between steps. While `feedback` holds a message, the active step's content is replaced by an indeterminate circular indicator and the message in Body 1 at 54%; clear it and the content returns.

The guidelines show the feedback in video only, so the layout here, the circle beside the message, is an MD1 decision. The content stays mounted underneath, so nothing the user typed is lost.
:::

::: ds-example
/systems/md1/stepper/mobile-text

### Mobile: text

`mobile` swaps the header for the mobile stepper. Place an `Md1Stepper.Bar` among the steps; it renders the 56 dp bottom bar with BACK and NEXT, 16 dp from the edges. The text form is the plain one: the bar holds nothing between the buttons, and "Step N of M" sits in a 48 dp bar above the content, in Body 1 on the 16 dp keyline.

BACK is disabled on the first step and NEXT on the last. Both are flat buttons with chevrons, and the copy comes from the `Md1.back`, `Md1.next` and `Md1.stepCount` locale keys.
:::

::: ds-example
/systems/md1/stepper/mobile-dots

### Mobile: dots

Dots suit a flow without many steps. Each step is an 8 dp dot at a 16 dp pitch, centred between BACK and NEXT; the current step's dot is the primary colour and the rest are 38%.

The dots are one progressbar to assistive technology, with "Step N of M" as its value text, so a screen reader hears the position rather than eight separate shapes.
:::

::: ds-example
/systems/md1/stepper/mobile-progress

### Mobile: progress bar

A progress bar suits flows with many steps, or ones where steps may be inserted along the way based on earlier answers. The bar is 3 dp tall and 112 dp wide, filled in the primary colour over its 30% tint to the current step's share of the flow.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the Md1Stepper*.vue files until then. -->

### Md1Stepper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T` | | The active step's `value`. Bind with `v-model`. When unset, the first step is active |
| `vertical` | `boolean` | `false` | Stacks the steps and opens each step's content under its label |
| `linear` | `boolean` | `true` | Each step must be completed before the next; future steps are 38% and locked. `false` is the non-linear stepper: inactive steps at 54%, every step reachable |
| `alternativeLabels` | `boolean` | `false` | Horizontal only: labels centred under their circles in a 104 dp bar, the steps in equal parts |
| `mobile` | `'text' \| 'dots' \| 'progress'` | | The mobile stepper: the header is replaced by `Md1Stepper.Bar`. `text` adds the "Step N of M" bar on top |
| `feedback` | `string` | | A transient message; while set, the active step's content is replaced by an indeterminate indicator and the message |
| `namespace` | `string` | `'v0:step'` | The v0 `Step` context key. Leave it unset unless a surrounding v0 `Step` must not collide with this one |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Stepper.Step` | `label` (`string`, required), `value`, `optional`, `editable`, `complete` (`boolean`), `error`, `summary` (`string`), `id` | One `li` with `aria-current="step"` while active, `data-state`, `data-editable`, `data-optional` and `data-error`. Its header is a `button` only when the user can go to it. `complete` unset follows the position in a linear stepper and is false in a non-linear one |
| `Md1Stepper.Content` | none | The step's region, shown while the step is active and `hidden` otherwise. Placed inside its `Step` |
| `Md1Stepper.Actions` | none | CONTINUE (raised, moves to the next step and emits `continue`) and CANCEL (flat, emits `cancel`). The default slot replaces both buttons |
| `Md1Stepper.Bar` | none | The mobile bottom bar: BACK and NEXT (emitting `back` and `next` after moving) around the dots or the progress bar `mobile` picks |

There are no named slots.

## Accessibility

The guidelines name no keyboard model and WAI-ARIA has no stepper pattern, so MD1 uses the platform's. The steps are an ordered list; the active one carries `aria-current="step"`. A step header the user can go to is a native `<button>`, and one they cannot (the active step, a future step of a linear stepper, a completed step that is not editable) is plain text, so the tab order only holds places the user can actually go.

### Naming

Each step's content is a region named by its step label, so moving into it announces which step it belongs to. The number, check, pencil and warning glyphs are `aria-hidden`; an error step's message is text under the label and is read with it. The mobile dots and bar are one `progressbar` named "Steps" with "Step N of M" as its value text.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves through the reachable step headers, then into the active step's content and its actions |
| Enter, Space | On a step header, opens that step. On CONTINUE, NEXT or BACK, moves one step |

### Feedback

The feedback message renders in a `role="status"` container beside the indeterminate indicator, which is itself a `progressbar`. The step's content stays mounted but hidden while the message shows, so focus that was inside it is lost; move focus to the next step's content when the feedback clears.
