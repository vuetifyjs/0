---
title: Md1ExpansionPanel - Material Design 1 Expansion Panel for Vue
meta:
- name: description
  content: The Material Design 1 expansion panel. 48 dp rows stacked on one card that open into a 64 dp header and an editing body, detached 16 dp from their neighbours and lifted to 3 dp, with a CANCEL and SAVE row. Built on Vuetify0's ExpansionPanel.
- name: keywords
  content: md1 expansion panel, material design 1 expansion panel, accordion, disclosure, creation flow, vue expansion panel, vuetify0 expansion panel, paper md1
features:
  category: Component
  label: 'C: Md1ExpansionPanel'
  level: 2
  renderless: false
  group: disclosure
  order: 1
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/toggle-buttons
  - /components/disclosure/expansion-panel
---

# Md1ExpansionPanel

<DocsPageFeatures :frontmatter />

The Material Design 1 expansion panel. A stack of 48 dp summary rows on one card; selecting a row opens it into a 64 dp header and a body for editing, lifted off the card so the open panel reads as the sheet being worked on.

> [!NOTE]
> Reference: [Expansion panels, Material Design 1 guidelines](https://m1.material.io/components/expansion-panels.html), the archived page Material Design 1 is pinned to. Metrics, type, colour and the redline of the expanded panel. This page is the Vue.

## Usage

`Md1ExpansionPanel` is a compound. The root owns which panels are open, through `v-model`; each `Item` is one panel with a `Header` row and a `Content` body. The guidelines scope expansion panels to lightweight editing and to creation flows, so the body is where a setting is changed, and `Actions` is the CANCEL and SAVE row at the foot of that body.

One panel is open at a time by default.[^single] The guidelines leave that choice to the implementer; `multiple` lets several stay open.

::: ds-example
/systems/md1/expansion-panel/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1ExpansionPanel } from '@paper/md1'
</script>

<template>
  <Md1ExpansionPanel>
    <Md1ExpansionPanel.Item>
      <Md1ExpansionPanel.Header />

      <Md1ExpansionPanel.Content>
        <Md1ExpansionPanel.Actions />
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>
  </Md1ExpansionPanel>
</template>
```

The parts are also exported under their flat names: `Md1ExpansionPanelItem`, `Md1ExpansionPanelHeader`, `Md1ExpansionPanelContent` and `Md1ExpansionPanelActions`.

## Composed on Vuetify0

`Md1ExpansionPanel` renders v0's [ExpansionPanel](/components/disclosure/expansion-panel) compound part for part: the root is `ExpansionPanel.Group`, `Item` is `ExpansionPanel.Root`, `Header` is `ExpansionPanel.Header` (the `h3`) around `ExpansionPanel.Activator` (the `button`) and `ExpansionPanel.Cue` (the expand glyph), and `Content` is `ExpansionPanel.Content` (the region). Selection, the accordion rule, `v-model`, the ids that tie the header to its region, `aria-expanded`, `aria-controls` and the native `disabled` attribute all come from v0. `Actions` is a layout-only part with no v0 counterpart.

v0 publishes `data-selected` on the item, `data-selected` and `data-disabled` on the header button, and `data-state` on the cue; Material Design 1 adds `data-state` on the header button and `data-disabled` on the item, folding the root's `disabled` in so the whole sheet dims as one. The first child of every header is a [Md1Ripple](/systems/md1/ripple), and the glyph draws through [Md1Icon](/systems/md1/icon) as the `expand-more` role, so a consumer who overrides that role restyles every panel.

## Examples

::: ds-example
/systems/md1/expansion-panel/standalone

### Stand-alone panel

The guidelines name two forms: a panel that stands alone and panels connected to a larger surface. A stand-alone panel is a one-item compound. It paints its own sheet with the card's 2 dp corners[^corner] and the white card surface (`--md1-surface`, Grey 800 on the dark theme), and opens into the 64 dp header in place, because there are no neighbours to detach from.

The surface rests at 1 dp on touch devices, Vuetify 1.5's panel elevation, because the page states none.[^rest] Where the pointer is a mouse the elevation page lowers every resting value by 2 dp, so the panel rests seamed against the background and only its expanded state casts a shadow. Use a stand-alone panel for one setting on a page that otherwise reads, such as a notification preference under an article.
:::

::: ds-example
/systems/md1/expansion-panel/layouts

### Header content

The collapsed row is the panel's summary, laid out on the guidelines' redline: 24 dp of side padding, the label column, the value column 16 dp after it, and the 24 dp expand icon 16 dp after that, 24 dp from the right edge. `label` is the list content in Roboto Regular, 15 sp on desktop and 16 sp on handsets (the 2016 revision's size), at 87% ink. `summary` is the value column in the secondary ink at the label's size.

The usage figure shows three layouts and all three are props or the default slot. A single value is `summary`. Two labelled values side by side, a start and an end date, are markup in the default slot, which replaces `summary`. A second line under the label, such as "Optional", is `secondary`: Caption, 12 sp at 54%, which grows the row to the 64 dp two-line height. Under 600 px the value column drops below the label, a Material Design 1 decision where the page draws no handset layout.[^stack]
:::

::: ds-example
/systems/md1/expansion-panel/editing

### Editing and actions

An expanded panel is where the user adds or edits information. The body takes 24 dp of side padding and 16 dp below its content, and holds whatever control the setting needs: here a radio group picks the cabin class, stacked so it fits the narrowest panel, with helper text under it in the secondary ink.

`Actions` is the CANCEL and SAVE row of the guidelines' figure. It draws a 1 dp divider at 12% across the full width of the sheet, then 16 dp above and below the 36 dp flat buttons, which sit at the end of the row 8 dp apart. It emits nothing: the buttons are yours, so you decide what SAVE commits and that CANCEL reverts and closes the panel, which the page shows but does not describe. Dismissive comes before affirmative, as on the buttons page.
:::

::: ds-example
/systems/md1/expansion-panel/multiple

### Several open panels

`multiple` lets more than one panel stay open, and `v-model` becomes an array of the open values. Panels shown in sequence form a creation flow, the second use the guidelines name: a tool for creating an ad campaign can keep the finished steps open for review while the next one is filled in.

Every expanded panel detaches 16 dp from the panels above and below it, the gap the expansion-panels page draws, and lifts to 3 dp, the elevation of Vuetify 1.5's detached panels, because the page states no number.[^lift] Two open panels next to each other share one 16 dp gap rather than two, and an open panel at either end of the stack stays flush with the card's edge.
:::

::: ds-example
/systems/md1/expansion-panel/disabled

### Disabled

The guidelines give no disabled state. `disabled` on an item, or on the root for every item, sets the native `disabled` attribute on the header button: the panel leaves the tab order, does not toggle, and draws no ink. The label, summary and expand icon drop to the disabled ink, 38% black on the light theme and 50% white on the dark one.[^disabled]

Prefer leaving a panel enabled and explaining inside it why its value cannot change. A disabled header cannot take focus, so a keyboard user never reaches it.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with the Md1ExpansionPanel*.vue files until then. -->

### Md1ExpansionPanel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T \| T[]` | | The open panel's `value`, or an array of open values under `multiple`. Bind with `v-model` |
| `multiple` | `boolean` | `false` | Lets several panels stay open. When false, opening a panel closes the others |
| `disabled` | `boolean` | `false` | Disables every item |
| `namespace` | `string` | | The context key the parts read. Set the same key on every part only when nesting one expansion panel inside another |

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1ExpansionPanel.Item` | `value`, `disabled` (`boolean`), `id`, `namespace` | One panel. Renders `div.md1-expansion-panel__item` with `data-selected` while open and `data-disabled` when it or the root is disabled |
| `Md1ExpansionPanel.Header` | `label` (`string`, required), `summary` (`string`), `secondary` (`string`), `namespace` | The `h3` and its `button`, with `data-state="open" \| "closed"`. 48 dp collapsed, 64 dp expanded. The default slot replaces `summary` |
| `Md1ExpansionPanel.Content` | `namespace` | The region the header controls; `hidden` while collapsed. The default slot is the body |
| `Md1ExpansionPanel.Actions` | none | The CANCEL and SAVE row under a full-width divider, placed last inside `Content`. Emits nothing |

There are no named slots.

## Accessibility

Stacked panels follow the WAI-ARIA Accordion pattern. Each header is a native `<button type="button">` inside an `h3`, with `aria-expanded` and `aria-controls` pointing at its region; the region has `role="region"` and `aria-labelledby` pointing back at the button. The expand icon is `aria-hidden`.

### Naming

The button's accessible name is its text: the label, then the secondary line and the summary. Keep the label short and specific, because it also names the region. The heading is always an `h3`, so place the panels under an `h2` to keep the document outline in order.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus between headers and into an open body. Disabled headers are skipped |
| Enter, Space | Opens or closes the focused panel. With `multiple` off, opening it closes the panel that was open |

### Focus

The guidelines give the focused item a Grey 200 background. Material Design 1 paints it for `:focus-visible` only, so keyboard focus shows it and a click does not leave it behind:[^focus-visible] exactly `#EEEEEE` on the light sheet, and Vuetify 1.5's `#494949` on the dark one, where the page states no value.[^dark] Under forced colours, where backgrounds are dropped, a 2 px outline draws instead.

### Disabled

| State | Attributes set | Focusable | Activation |
|-------|----------------|-----------|------------|
| enabled | `aria-expanded`, `aria-controls` | Yes | Enter, Space, click |
| `disabled` | `disabled`, `aria-disabled="true"`, `data-disabled` | No | Blocked |

[^single]: Our call: the page leaves it open; an accordion keeps a settings stack short.

[^corner]: Our call: a lone panel reads as a card, so it takes the card's corner radius.

[^rest]: Vuetify 1.5.24, stylus/components/_expansion-panel.styl:34. `.v-expansion-panel` rests at `elevation(1)`.

[^stack]: Our call: two columns do not fit a phone-width row beside the label.

[^lift]: Vuetify 1.5.24, stylus/components/_expansion-panel.styl:75-80. Popout and inset panels raise the active container to `elevation(3)`.

[^disabled]: Vuetify 1.5.24, stylus/components/_expansion-panel.styl:16-17. A disabled panel takes `text.disabled`.

[^focus-visible]: Our call: the page states the fill, not when it shows; the forced-colours outline is ours too.

[^dark]: Vuetify 1.5.24, stylus/settings/_theme.styl:154-155. The dark theme's `expansion-panels.focus`.
