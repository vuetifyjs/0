---
title: EmTabs - Emerald Tabs for Vue
meta:
- name: description
  content: Emerald's segmented tabs — automatic or manual activation, horizontal or vertical orientation, and full APG tablist keyboard support over Vuetify0's headless Tabs.
- name: keywords
  content: emerald tabs, vue tabs, design system tabs, tablist vue, accessible tabs, vuetify0 tabs, paper emerald
features:
  category: Component
  label: 'C: EmTabs'
  level: 2
  renderless: false
  order: 26
related:
  - /systems/emerald
  - /systems/emerald/card
  - /components/disclosure/tabs
---

# EmTabs

<DocsPageFeatures :frontmatter />

Segmented tabs that show one panel at a time — a bordered tab strip with automatic or manual activation, horizontal or vertical orientation, and the full tablist keyboard map.

## Usage

`EmTabs` is a compound: the root owns selection, `EmTabsList` holds the triggers, and each `EmTabsItem` pairs with the `EmTabsPanel` that shares its `value`. Bind `v-model` to the active tab's value and the matching panel shows; the rest stay mounted but hidden, so form state inside an inactive panel survives switching away and back.

You rarely need to seed the model. `mandatory` defaults to `'force'`, which selects the first non-disabled tab when nothing is selected — an empty `shallowRef` works, and the strip never renders with no active tab.

The strip renders as a segmented control: adjacent tabs share their borders, only the end caps are rounded, and the selected tab lifts above its neighbors. When the labels outgrow the container the list scrolls horizontally rather than wrapping, so a crowded toolbar degrades to a swipe instead of a second row.

::: ds-example
/systems/emerald/tabs/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmTabs } from '@paper/emerald'
</script>

<template>
  <EmTabs>
    <EmTabs.List>
      <EmTabs.Item />
    </EmTabs.List>

    <EmTabs.Panel />
  </EmTabs>
</template>
```

## Composed on v0

`EmTabs` wraps v0's [Tabs](/components/disclosure/tabs) compound — `Tabs.Root`, `Tabs.List`, `Tabs.Item` and `Tabs.Panel` — with [createStep](/composables/selection/create-step) doing the selection underneath.

`Tabs.Root` is a pure context provider that renders no element of its own, so `EmTabs` supplies the wrapper `div` and stamps `data-orientation` and `data-disabled` on it — the one place Emerald writes state attributes itself, because there is no v0 element there to carry them. Everything else is v0's: `Tabs.List` renders the `tablist`, `Tabs.Item` renders each trigger as a native `<button>` with the roving tabindex and the keyboard handlers, and `Tabs.Panel` renders the panel with its `hidden` state. Emerald adds a class and token styling to each and changes none of the behavior.

That split is what the stylesheet hangs off. The selected and disabled looks are `[data-selected]` and `[data-disabled]` rules over attributes v0 already publishes, and the vertical layout keys off the `aria-orientation` v0 puts on the list — Emerald styles the semantics rather than duplicating them into classes.

The default slot of `EmTabs` forwards `Tabs.Root`'s slot props, so `first`, `last`, `next`, `prev`, `step` and `select` are available in the template when you want to drive the tabs from outside the strip.

## Examples

::: ds-example
/systems/emerald/tabs/manual

### Manual activation

`activation` decides what the arrow keys commit. The default, `automatic`, selects a tab the moment it receives focus — arrowing across the strip switches panels as you go, which is the recommended behavior when panels are cheap to show.

`manual` separates the two: arrow keys only move focus, and the reader commits with Enter or Space. Reach for it when displaying a panel is expensive — a chart that re-renders, a query that refires — so that a keyboard user traversing the strip on the way to the last tab does not pay for every panel in between.

The trade is one extra keystroke for keyboard users. Pointer behavior is identical in both modes: a click always selects.
:::

::: ds-example
/systems/emerald/tabs/vertical

### Vertical orientation

`orientation="vertical"` turns the list into a column sized to its widest label, moves the rounded caps to its top and bottom, and switches the keyboard axis — Arrow Up and Arrow Down walk the tabs, and the horizontal arrows do nothing. The list also announces the change through `aria-orientation`, so assistive technology tells its user which pair of keys to use.

The root does not lay the column and the panels side by side for you — it renders a plain block wrapper, and the arrangement is your layout. This example wraps the list and panels in a flex row, which is all it takes; the panels already carry an inline-start margin in vertical mode, so the gutter between column and content comes from the system.

Vertical suits settings-style surfaces with many sections and long labels, where a horizontal strip would scroll. Past a dozen or so sections, consider navigation instead of tabs.
:::

::: ds-example
/systems/emerald/tabs/disabled

### Disabled tabs

`disabled` on an `EmTabsItem` takes that tab out of play without removing it from the strip. The trigger is a native `<button>`, so the attribute blocks clicks and focus at the platform level; the tab renders at half opacity and keyboard navigation steps over it — arrowing from Review lands on Published, not on Approval.

Home and End skip disabled tabs too, and `mandatory="force"` respects them when it picks an initial selection: if the first tab is disabled, the first enabled one is selected instead.

A disabled tab still shows its label, which is the point — the reader sees that Approval exists and is not available yet. When the reason is not obvious from context, say why nearby; the tab itself cannot explain. `disabled` on the root disables the whole instance at once, for surfaces that load before their data.
:::

## Props

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T \| T[]` | — | The selected tab's value. With the default `mandatory: 'force'`, the first non-disabled tab is selected when the model is empty |
| `disabled` | `boolean` | `false` | Disables every tab in the instance. Sets `data-disabled` on the wrapper |
| `mandatory` | `boolean \| 'force'` | `'force'` | `'force'` auto-selects the first non-disabled tab; `true` prevents deselecting the last selected tab; `false` enforces nothing |
| `circular` | `boolean` | `true` | Arrow-key navigation wraps from the last tab to the first and back |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction and keyboard axis. Sets `data-orientation` on the wrapper |
| `activation` | `'automatic' \| 'manual'` | `'automatic'` | `automatic` selects on focus; `manual` selects on Enter or Space only |
| `namespace` | `string` | — | Which v0 Tabs context to provide. Only needed when nesting |

### Parts

Every part takes `namespace`, defaulting to v0's `v0:tabs`, so the prop only matters when one tabs instance nests inside another.

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Part | Props | Notes |
|------|-------|-------|
| `EmTabsList` | `label` (`string`) | The `tablist`. `label` becomes `aria-label` — supply it when no visible heading labels the strip |
| `EmTabsItem` | `value` (`string \| number`, required), `disabled` (`boolean`, default `false`) | A trigger, rendered as a native `<button>`. `value` pairs it with the panel that has the same one |
| `EmTabsPanel` | `value` (`string \| number`, required) | The content for one tab. Hidden — not unmounted — while its tab is unselected |

Each part's default slot is its content. There are no named slots, and none of the parts expose a template-ref surface.

## Accessibility

v0's parts implement the WAI-ARIA tabs pattern: `role="tablist"` on the list with `aria-orientation`, `role="tab"` triggers carrying `aria-selected` and `aria-controls`, and `role="tabpanel"` panels linked back through `aria-labelledby`. Each trigger is a native `<button>`, so activation and disabled behavior come from the platform.

Give the list a `label` whenever the strip has no visible heading — it becomes the tablist's `aria-label`, and without it a screen-reader user hears "tab list" with no idea of what the tabs organize.

### Keyboard

The strip is a single tab stop: the selected tab holds `tabindex="0"` and the rest sit at `-1`, so Tab enters the strip once and the arrows take over from there.

| Key | Behavior |
|-----|----------|
| Arrow Right / Left | Next / previous tab when horizontal |
| Arrow Down / Up | Next / previous tab when vertical |
| Home / End | First / last enabled tab |
| Enter, Space | Select the focused tab |
| Tab | Leave the strip — to the active panel, which is focusable |

In `automatic` mode the arrows select as they move, so Enter and Space are only ever confirming what focus already did. In `manual` mode the arrows move focus alone and Enter or Space commits. In both modes, navigation skips disabled tabs and wraps at the ends while `circular` is on; with `circular: false` it stops at the edges instead.

There is no Escape handling and no Delete — tabs are not dismissible, and the strip owns nothing modal.

### Panels

The active panel carries `tabindex="0"`, so a keyboard user can Tab from the strip directly into the panel's content even when its first child is not focusable. Inactive panels are `hidden` but stay mounted — switching tabs does not destroy panel state, and nothing inside a hidden panel is reachable or announced.

### Disabled

A disabled tab sets the native `disabled` attribute plus `aria-disabled` and `data-disabled`. Being a real disabled button, it is unfocusable and unclickable, and arrow navigation steps over it — a keyboard user is never parked on a control that does nothing. The cost is the usual one: the tab cannot explain itself, so put the reason somewhere visible when it is not obvious.

### Focus

The focus indicator is a two-pixel outline in Emerald's primary tone, raised above the neighboring tabs' shared borders so it draws as a complete ring. It uses `:focus-visible`, so it appears for keyboard focus and not for clicks.
