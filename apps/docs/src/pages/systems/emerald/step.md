---
title: EmStep - Emerald Stepper for Vue
meta:
- name: description
  content: Emerald's stepper — numbered markers, one active step, and sequential navigation that skips disabled steps. Composed on Vuetify0's headless Step compound.
- name: keywords
  content: emerald step, vue stepper, wizard steps, multi-step form vue, vuetify0 step, paper emerald
features:
  category: Component
  label: 'C: EmStep'
  level: 2
  renderless: false
  order: 24
related:
  - /systems/emerald
  - /components/providers/step
  - /composables/selection/create-step
---

# EmStep

<DocsPageFeatures :frontmatter />

The progress header for a multi-step flow — numbered markers, one active step, and navigation methods that walk the sequence and skip disabled steps.

## Usage

`EmStep` is the container and `EmStepItem` the steps. Each item carries a `value`; `v-model` on the root holds the active one, and clicking a step selects it. The numbers in the markers come from document order — there is no index prop to manage, so inserting a step renumbers the rest automatically.

By default `mandatory` is `'force'`: the first enabled step selects itself when nothing is chosen, and the active step cannot be clicked off. A stepper always points somewhere.

::: ds-example
/systems/emerald/step/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmStep } from '@paper/emerald'
</script>

<template>
  <EmStep>
    <EmStep.Item />
  </EmStep>
</template>
```

## Composed on Vuetify0

`EmStep` wraps v0's [Step](/components/providers/step) compound — `Step.Root` and `Step.Item` — which is the renderless single-selection provider with sequential navigation, built on [createStep](/composables/selection/create-step).

Both v0 parts render no element of their own, so Emerald owns every element you see. The root is a wrapping flex `div` (`.emerald-step`) that hosts `Step.Root` inside it; each item is a native `<button>` that takes `Step.Item`'s slot `attrs` — the click and Enter/Space handlers, `aria-selected`, `aria-disabled` and the `data-selected` / `data-disabled` attributes every rule in the stylesheet hangs off. v0 owns the state: registration, which step is active, the mandatory rule, and the `first` / `last` / `next` / `prev` / `step` navigation methods.

The numbered marker is the one part neither layer computes. It is a CSS counter — the root `counter-reset`s it and each item `counter-increment`s — so the number reflects pure document order and never consults the selection state. That is also why there is no `step` index prop to keep in sync.

`EmStep`'s default slot passes `Step.Root`'s slot props straight through, so the navigation methods are one `v-slot` away — that is what the wizard example below builds on. Navigation is bounded, not circular: `next` on the last step and `prev` on the first do nothing.

## Examples

::: ds-example
/systems/emerald/step/wizard

### Navigation methods

The default slot receives `Step.Root`'s slot props, so `prev` and `next` — plus `first`, `last` and `step(count)` — are available to anything rendered inside the root. Here they drive a Back / Continue pair, which is the shape almost every wizard reduces to: the stepper announces where you are, the buttons move you.

Because the root is a wrapping flex container, the panel simply sits inside it at `width: 100%` and falls onto its own row. Nothing about the compound requires the extra content — steps, panel and buttons are all just default-slot children.

Navigation is bounded. `next` on the last step is a no-op rather than a wrap back to the start, so the edge buttons here are disabled purely as a visual courtesy — the behavior would be identical without it. If you need to jump more than one step, `step(2)` advances two and `step(-1)` goes back one.
:::

::: ds-example
/systems/emerald/step/disabled

### Disabled steps

A disabled `EmStepItem` stays visible but leaves the flow: it cannot be clicked, it drops out of the tab order, and — the part that makes it useful — `next`, `prev` and `step` skip over it. Toggle the checkbox and watch Continue jump straight from Cart to Confirm while Shipping is off.

That makes `disabled` the tool for conditional steps. Keep the step rendered so the sequence reads the same shape every time, and disable it when the flow does not need it — rather than `v-if`-ing it away and having the numbers shuffle underneath the reader.

Disabling a step does not deselect it. If the reader is standing on a step when it becomes disabled, the selection stays put until something else is chosen — so flip the condition before the reader can reach the step, not while they are on it.

There is also a `disabled` prop on the root, which is a different thing: it freezes the entire group, dims it, and reports every step as disabled.
:::

## Props

### EmStep

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T \| T[]` | — | Value of the active step. With the default `mandatory: 'force'`, an empty model self-corrects to the first enabled step |
| `disabled` | `boolean` | `false` | Freezes the whole group — the root gets `data-disabled` and dims, and every step reports disabled |
| `enroll` | `boolean` | `false` | Select steps as they register. Single-selection, so the last enabled step to register ends up active |
| `mandatory` | `boolean \| 'force'` | `'force'` | `true` prevents deselecting the active step; `'force'` additionally auto-selects the first enabled step on registration. `false` allows an empty selection — clicking the active step toggles it off |
| `namespace` | `string` | — | Which v0 `Step` instance the items bind to; falls through to v0's default when unset. Only needed when nesting |

The default slot receives `Step.Root`'s slot props: `isDisabled`, the navigation methods `first()`, `last()`, `next()`, `prev()` and `step(count)`, `select(id)`, `unselect(id)` and `toggle(id)`, plus v0's root `attrs` (`aria-multiselectable="false"`), which Emerald's own wrapper does not consume.

> [!NOTE]
> `select`, `unselect` and `toggle` take registration **ids**, not step values — and ids are auto-generated unless you pass `id` to each `EmStepItem`. To activate a step by value, write the value to `v-model`; the id-based methods are for the rare case where two steps share a value.

### EmStepItem

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | auto-generated | Registration id, only needed for the id-based slot methods |
| `label` | `string` | — | Fallback label, rendered when the default slot is empty |
| `value` | `unknown` | — | Written to the root's `v-model` when this step is active |
| `disabled` | `boolean` | `false` | Step cannot be activated, leaves the tab order, and is skipped by the navigation methods |
| `namespace` | `string` | — | Must match the root's `namespace` when one is set |

The default slot is the step's label and falls back to the `label` prop. The numbered marker is not a slot — it is a CSS counter and always renders.

## Accessibility

Each step is a native `<button type="button">`, so focusability and Enter / Space activation rest on the platform. v0's `Step.Item` binds `role="tab"`, `aria-selected` and `aria-disabled` onto it, plus a keydown handler that keeps keyboard activation in sync with the click guard.

### Naming

The accessible name is the label text — the default slot or the `label` prop. The numbered marker is `aria-hidden`, so a step announces as "Payment", not "2 Payment"; the number is a visual affordance only. A step with neither slot content nor `label` has no accessible name — always provide one.

### Focus and keyboard

Every enabled step has `tabindex="0"` — each is its own tab stop, in document order. There is no roving focus and no arrow-key navigation: the navigation methods exist on the slot for you to wire to your own controls, but the steps themselves respond only to Tab, Enter, Space and click. Disabled steps carry `tabindex="-1"` and are never encountered by a keyboard user.

The focus ring draws on the marker via `:focus-visible`, so it appears for keyboard focus and not after a mouse click.

### States

| State | Attributes on the step | Focusable | Activation |
|-------|------------------------|-----------|------------|
| Active | `aria-selected="true"`, `data-selected` | Yes | With default `mandatory`, clicking again is a no-op; with `:mandatory="false"` it deselects |
| Disabled (item or group) | `aria-disabled="true"`, `data-disabled`, `tabindex="-1"` | No | Blocked |

### What it is not

The wrapper `div` carries no role, so the `role="tab"` steps are not inside a `role="tablist"`, and `EmStep` renders no `role="tabpanel"` — it is a navigation header over state, not a complete tabs widget. If the surface you are building is tabs — panels swapped in place, arrow-key traversal — reach for [EmTabs](/systems/emerald/tabs) instead; `EmStep` is for flows where the steps mark progress and the content below is yours.
