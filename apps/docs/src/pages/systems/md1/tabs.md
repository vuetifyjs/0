---
title: Md1Tabs - Material Design 1 Tabs for Vue
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
> Reference: [Tabs, Material Design 1 guidelines](https://m1.material.io/components/tabs.html), the archived page Material Design 1 is pinned to. Types, metrics, colour and behavior. This page is the Vue.

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

The bar measures its tabs with v0's [createOverflow](/composables/semantic/create-overflow), which decides when the desktop pagination arrows show and sets `data-overflow` on the root; under `more` its capacity decides which tabs move into the "More" menu, and the root carries `data-more` while they do. Each arrow is a v0 [Button](/components/actions/button), so a disabled arrow carries `disabled` and `data-disabled` like any other Material Design 1 button. `Tabs.Item` emits the `data-selected` and `data-disabled` attributes the stylesheet hangs off. `data-fixed`, `data-scrollable`, `data-more`, and the item's `data-icon`, `data-lines` and `data-collapsed` are Material Design 1's own.

The first child of every tab is a [Md1Ripple](/systems/md1/ripple), the guidelines' touch target animation: ink from the point of contact across the whole tab cell. Glyphs draw through [Md1Icon](/systems/md1/icon).

## Examples

::: ds-example
/systems/md1/tabs/fixed

### Fixed tabs

Fixed tabs show every tab at once and give them equal widths. The guidelines reserve them for a limited number of tabs, where a consistent position helps muscle memory. This is the default; `scrollable` switches to the other type.

How the width is shared depends on the view. Under 600 dp, the guidelines' smaller views, the bar is full width and each tab takes an equal share, never less than 72 dp. From 600 dp each tab is at least 160 dp, and the bar centres itself: every tab takes the width of the widest one, between 160 dp and 264 dp, and the row sits in the middle of the bar. When that would leave 16 dp or less between the outer tabs and the edge of the view, the guidelines switch back to full width, and so does Material Design 1. There is no `centered` prop: the rule decides.

The indicator is a 2 dp line under the selected tab, in the accent colour (`--md1-accent`, Pink A200 in the default theme). Only the indicator takes the accent: the selected label and icon are 87% black (white on the dark theme), as in Vuetify 1.5.[^active] It slides to the new tab on the standard curve; the page states no duration, so it takes the standard 300 ms, 200 ms with a mouse.[^duration]
:::

::: ds-example
/systems/md1/tabs/app-bars

### Tabs under an app bar

Tabs sit in the app bar's extension, below the title row, and take the bar's colour: the indicator and the selected label read against the primary colour instead of the sheet. The first screen is an extended app bar, the prominent bar with its large title over fixed tabs; the second replaces the title row with an inset search field, so the search and the tabs share one bar. In both the tabs are fixed and fill the bar's width on a phone; from 600 dp they centre, as above.
:::

::: ds-example
/systems/md1/tabs/scrollable

### Scrollable tabs

Scrollable tabs show a subset at a time and suit many tabs, or a number that changes. Each tab is as wide as its label plus padding, at least 72 dp (160 dp from 600 dp) and at most 264 dp or the width of the view less 56 dp, whichever is smaller. The first tab's text lines up with the screen-edge keyline, 16 dp on a phone and 24 dp from 600 dp; with a mouse it starts on the content keyline instead, 80 dp from 600 dp and 72 dp below.

On a touch screen the bar scrolls with a swipe, without changing the selection. With a mouse, an overflowing bar shows the pagination arrows the guidelines name for desktop: one at each end, paging the bar by its visible width and disabled when there is nowhere left to go. They stay out of the tab order, because the arrow keys already move through the tabs and every tab scrolls into view as it is selected.[^arrows] The guidelines also name a "More" dropdown for overflowing desktop tabs; `more` turns it on, below.
:::

::: ds-example
/systems/md1/tabs/more

### More dropdown

`more` on scrollable tabs is the guidelines' other desktop overflow affordance, "Tabs with a More dropdown menu". With a mouse, the tabs that do not fit the bar leave it and are listed in an [Md1Menu](/systems/md1/menu) behind a "More" control at the bar's end, which replaces the pagination arrows. The control is styled as a tab with a trailing `arrow-drop-down` glyph; choosing a tab from its menu selects it, and the control then shows that tab's label and carries the 2 dp indicator, the guidelines' "Tabs with Books selected from a More dropdown menu". The menu opens with the selected tab over the control.

The pages draw the pattern without metrics, so the control's place at the bar's end and the label swap are Material Design 1 decisions.[^more] The collected tabs stay tabs in the tablist, out of the layout, so v0's selection and the panels are unchanged; when the arrow keys select a collected tab, focus moves to the More control. Once every tab fits beside it the tabs return to the bar. On a touch screen the bar keeps its swipe. Fixed tabs share the bar and never collect.
:::

::: ds-example
/systems/md1/tabs/icons

### Icons and text

`icon` with a label is the icon-and-text tab: a 24 dp glyph above the label with 10 dp between them, in a bar 72 dp tall instead of 48 dp. The glyph and the label share one colour, the indicator's when selected.

Use the same form for every tab in a bar. The guidelines show labelled and icon-only tabs in one bar as a "Don't"; Material Design 1 warns in development when a bar mixes them.
:::

::: ds-example
/systems/md1/tabs/icon-only

### Icons only

`icon` without a label is an icon-only tab, still 48 dp tall with the glyph centred. The 2016 guidelines put it plainly: tab labels are either all icons or all text. An icon-only tab has no visible text, so its accessible name comes from `ariaLabel`; the glyph is hidden from assistive technology, and Material Design 1 warns in development when the name is missing.
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

`disabled` on an item takes one tab out of use: the arrow keys skip it, a click does nothing, the ripple draws nothing, and its ink drops to the disabled-button ink (26% black, 30% white on the dark theme and on a coloured bar). `disabled` on the root disables the whole bar. The pinned pages state no disabled tab, so these are Vuetify 1.5's values.[^disabled]
:::

### Colour and motion

A tab bar has no fill of its own: it takes the surface it sits on. On a surface bar the selected ink is the primary text ink, the indicator is the accent, and the inactive ink is the primary text ink at 70% (about 61% black, 70% white on the dark theme): the page gives only the coloured bar's values, so the surface bar takes Vuetify 1.5's.[^inactive] Inside an `Md1Toolbar` with `variant="primary"`, the guidelines' coloured app bar, the selected ink and the indicator turn white, the inactive ink white at 70%, and a disabled tab white at 30%.

Panels change by sliding, the sibling transition of the navigation patterns: the new panel comes in from the end side and the old one leaves to the start side, reversed when you move back and mirrored in right-to-left layouts, over 300 ms on the standard curve. With reduced motion the panels swap at once.

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the Md1Tabs files until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T` | | The selected tab's value. The first enabled tab is selected when it is empty |
| `scrollable` | `boolean` | `false` | Scrollable tabs: each as wide as its label, the bar scrolls and pages. Unset, fixed tabs share the width and centre from 600 dp |
| `more` | `boolean` | `false` | With `scrollable` and a mouse, the tabs that do not fit move into a "More" menu at the bar's end, in place of the pagination arrows |
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

A tab draws no hover or focus overlay, as in Vuetify 1.5;[^focus] keyboard focus shows the browser's focus ring, inset so the bar does not clip it. The outgoing panel is inert while it slides out, so focus cannot land in content that is leaving.

### Disabled

| State | Attributes set | Focusable | Activation |
|-------|----------------|-----------|------------|
| enabled | none | Yes, when selected or reached with the arrow keys | Click, focus |
| `disabled` | `disabled`, `aria-disabled="true"`, `data-disabled` | No | Blocked |

[^active]: Vuetify 1.5.24, stylus/settings/_theme.styl:70-71,173-174 and components/VTabs/VTabsSlider.js:9-11. `tabs.active` is 87% black or white, and only the slider takes the accent.

[^duration]: Our call: the standard duration is the motion page's default for on-screen changes.

[^arrows]: Our call: an extra stop per arrow would add nothing a keyboard user can't already reach.

[^more]: Our call: the bar's end is where the pagination arrows sit, and the label swap shows which collected tab is selected.

[^disabled]: Vuetify 1.5.24, stylus/components/_tabs.styl:11-12. A disabled tab takes `buttons.disabled`.

[^inactive]: Vuetify 1.5.24, stylus/components/_tabs.styl:139-140. An inactive tab is the active ink at opacity .7.

[^focus]: Vuetify 1.5.24, stylus/components/_tabs.styl:112-144. `.v-tabs__div` and `.v-tabs__item` carry no `:hover` or `:focus` rule.
