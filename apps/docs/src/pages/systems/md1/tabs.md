---
title: Md1Tabs - MD1 Tabs for Vue
meta:
- name: description
  content: The Material Design 1 tabs, fixed or scrollable, with text, icon or icon-and-text tabs over a 2 dp indicator, desktop pagination arrows and a sibling slide between panels. Built on Vuetify0's Tabs and createOverflow.
- name: keywords
  content: md1 tabs, material design 1 tabs, fixed tabs, scrollable tabs, tab bar, vue tabs, vuetify0 tabs, paper md1
features:
  category: Component
  label: 'C: Md1Tabs'
  level: 2
  renderless: false
  group: disclosure
  order: 4
related:
  - /systems/md1
  - /systems/md1/icon
  - /systems/md1/ripple
  - /components/disclosure/tabs
  - /composables/semantic/create-overflow
---

# Md1Tabs

<DocsPageFeatures :frontmatter />

The Material Design 1 tab bar. Fixed or scrollable tabs over a 2 dp indicator, with text, an icon, or an icon above text, and panels that slide between siblings.

> [!NOTE]
> Reference: [Tabs, Material Design 1 guidelines](http://web.archive.org/web/20181225002217/https://material.io/archive/guidelines/components/tabs.html), the archived page MD1 is pinned to. Types, metrics, colour and behavior. This page is the Vue.

## Usage

`Md1Tabs` is a compound: the root owns `v-model`, the selected tab's value. `Md1Tabs.List` is the bar, one `Md1Tabs.Item` per tab inside it, and one `Md1Tabs.Panel` per tab after it. Panels match items by `value`.

Use tabs to move between a small number of equally important, related views, such as the sections of one screen. Present them as a single row directly above their content. Never nest one set of tabs inside another.

::: ds-example
/systems/md1/tabs/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
</script>

<template>
  <Md1Tabs>
    <Md1Tabs.List>
      <Md1Tabs.Item />
    </Md1Tabs.List>

    <Md1Tabs.Panel />
  </Md1Tabs>
</template>
```

## Composed on Vuetify0

`Md1Tabs` renders v0's [Tabs](/components/disclosure/tabs) compound and adds nothing to its selection or keyboard behavior. `Tabs.Root` owns the selection and the model, `Tabs.List` the `tablist` role and its label, `Tabs.Item` the roving tab stop, the arrow keys, Home and End, and the `aria-selected` and `aria-controls` pair, and `Tabs.Panel` the `tabpanel` role, its `aria-labelledby` and the `hidden` attribute on every panel but the selected one. The first enabled tab is selected when the model is empty, and a tab is selected as soon as it takes focus.

The bar measures its tabs with v0's [createOverflow](/composables/semantic/create-overflow), which decides when the desktop pagination arrows show and sets `data-overflow` on the root. Each arrow is a v0 [Button](/components/actions/button), so a disabled arrow carries `disabled` and `data-disabled` like any other MD1 button. `Tabs.Item` emits the `data-selected` and `data-disabled` attributes the stylesheet hangs off. `data-fixed`, `data-scrollable`, and the item's `data-icon` and `data-lines` are MD1's own.

The first child of every tab is a [Md1Ripple](/systems/md1/ripple), the guidelines' touch target animation: ink from the point of contact across the whole tab cell. Glyphs draw through [Md1Icon](/systems/md1/icon).

## Examples

::: ds-example
/systems/md1/tabs/fixed

### Fixed tabs

Fixed tabs show every tab at once and give them equal widths. The guidelines reserve them for a limited number of tabs, where a consistent position helps muscle memory. This is the default; `scrollable` switches to the other type.

How the width is shared depends on the view. Under 600 dp, the guidelines' smaller views, the bar is full width and each tab takes an equal share, never less than 72 dp. From 600 dp each tab is at least 160 dp, and the bar centres itself: every tab takes the width of the widest one, between 160 dp and 264 dp, and the row sits in the middle of the bar. When that would leave 16 dp or less between the outer tabs and the edge of the view, the guidelines switch back to full width, and so does MD1. There is no `centered` prop: the rule decides.

The indicator is a 2 dp line under the selected tab, in the accent colour (`--md1-accent`, Pink A200 in the default theme), and the selected label and icon take the same colour. It slides to the new tab on the standard curve; the page states no duration, so it takes the standard 300 ms, 200 ms with a mouse.
:::

::: ds-example
/systems/md1/tabs/scrollable

### Scrollable tabs

Scrollable tabs show a subset at a time and suit many tabs, or a number that changes. Each tab is as wide as its label plus padding, at least 72 dp (160 dp from 600 dp) and at most 264 dp or the width of the view less 56 dp, whichever is smaller. The first tab's text lines up with the screen-edge keyline, 16 dp on a phone and 24 dp from 600 dp; with a mouse it starts on the content keyline instead, 80 dp from 600 dp and 72 dp below.

On a touch screen the bar scrolls with a swipe, without changing the selection. With a mouse, an overflowing bar shows the pagination arrows the guidelines name for desktop: one at each end, paging the bar by its visible width and disabled when there is nowhere left to go. They stay out of the tab order, because the arrow keys already move through the tabs and every tab scrolls into view as it is selected. The guidelines also name a "More" dropdown for overflowing desktop tabs; MD1 ships the pagination arrows instead.
:::

::: ds-example
/systems/md1/tabs/icons

### Icons and text

`icon` with a label is the icon-and-text tab: a 24 dp glyph above the label with 10 dp between them, in a bar 72 dp tall instead of 48 dp. The glyph and the label share one colour, the indicator's when selected.

Use the same form for every tab in a bar. The guidelines show labelled and icon-only tabs in one bar as a "Don't"; MD1 warns in development when a bar mixes them.
:::

::: ds-example
/systems/md1/tabs/icon-only

### Icons only

`icon` without a label is an icon-only tab, still 48 dp tall with the glyph centred. The 2016 guidelines put it plainly: tab labels are either all icons or all text. An icon-only tab has no visible text, so its accessible name comes from `ariaLabel`; the glyph is hidden from assistive technology, and MD1 warns in development when the name is missing.
:::

::: ds-example
/systems/md1/tabs/labels

### Long labels

Labels are short titles in the Button style, 14 sp Roboto Medium in capitals (13 sp with a mouse). When a label does not fit its tab, it wraps to a second line at 12 sp and is truncated after that, the guidelines' rule. A label is never shrunk to stay on one line, and wrapping happens only when it must: the tab measures the label at its full size and unwraps it as soon as the tab is wide enough again.

The example is narrower than a page, so the fixed tabs share 520 px and the longer labels wrap. Keep labels short enough that this is the exception; the guidelines warn that truncating early impedes comprehension.
:::

::: ds-example
/systems/md1/tabs/disabled

### Disabled

`disabled` on an item takes one tab out of use: the arrow keys skip it, a click does nothing, the ripple draws nothing, and its ink drops to the disabled text colour (38% black, 50% white on the dark theme). `disabled` on the root disables the whole bar. The 2016 and 2018 pages state no disabled tab; the 60% white for a coloured bar comes from the 2015 page.
:::

### Colour and motion

A tab bar has no fill of its own: it takes the surface it sits on. On a surface bar the selected ink and the indicator are the accent and the inactive ink is the secondary text colour (54% black, 70% white on the dark theme), an MD1 decision where the page gives only the coloured bar's values. Inside an `Md1Toolbar` with `variant="primary"`, the guidelines' coloured app bar, the selected ink and the indicator turn white, the inactive ink white at 70%, and a disabled tab white at 60%.

Panels change by sliding, the sibling transition of the navigation patterns: the new panel comes in from the end side and the old one leaves to the start side, reversed when you move back and mirrored in right-to-left layouts, over 300 ms on the standard curve. With reduced motion the panels swap at once.

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the Md1Tabs files until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T` | | The selected tab's value. The first enabled tab is selected when it is empty |
| `scrollable` | `boolean` | `false` | Scrollable tabs: each as wide as its label, the bar scrolls and pages. Unset, fixed tabs share the width and centre from 600 dp |
| `disabled` | `boolean` | `false` | Disables every tab |
| `namespace` | `string` | | The v0 `Tabs` context key. The parts inherit it, so set it on the root only when a surrounding v0 `Tabs` context must not collide with this one |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Tabs.List` | `label`, `namespace` | The bar: the `tablist`, the indicator and the desktop pagination arrows. `label` is the tablist's accessible name |
| `Md1Tabs.Item` | `value`, `label`, `icon`, `disabled`, `ariaLabel`, `namespace` | One tab. `label` or the default slot is the text; `icon` alone is an icon-only tab that needs `ariaLabel`; both make the 72 dp icon-and-text tab |
| `Md1Tabs.Panel` | `value`, `namespace` | One tab's content, matched to its item by `value` |

Every part has one default slot. There are no named slots.

## Accessibility

`Tabs` implements the WAI-ARIA tabs pattern. The bar is a `tablist` named by `label`, each tab a native `<button role="tab">` with `aria-selected` and `aria-controls`, and each panel a `tabpanel` labelled by its tab. Labels are capitalised by the stylesheet, so assistive technology reads the sentence-case source text.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab | Moves focus into the bar, onto the selected tab, then to the selected panel |
| Arrow Right, Arrow Left | Selects the next or previous enabled tab, wrapping at the ends |
| Home, End | Selects the first or last enabled tab |

Only the selected tab is in the tab order. Selection follows focus, so the panel changes as you move. The pagination arrows are mouse affordances and stay out of the tab order; a focused tab scrolls into view on its own.

### Focus

A focused tab shows the 12% overlay of the buttons page in its own ink, for `:focus-visible` only, and a hovered tab a 6% overlay. Under forced colours, where backgrounds are dropped, a 2 px outline draws in their place. The outgoing panel is inert while it slides out, so focus cannot land in content that is leaving.

### Disabled

| State | Attributes set | Focusable | Activation |
|-------|----------------|-----------|------------|
| enabled | none | Yes, when selected or reached with the arrow keys | Click, focus |
| `disabled` | `disabled`, `aria-disabled="true"`, `data-disabled` | No | Blocked |
