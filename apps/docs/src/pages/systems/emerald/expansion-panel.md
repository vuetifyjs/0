---
title: EmExpansionPanel - Emerald Expansion Panel for Vue
meta:
- name: description
  content: Emerald's accordion — single or multi-expand panels with mandatory mode and the WAI-ARIA accordion shape, composed on Vuetify0's headless ExpansionPanel.
- name: keywords
  content: emerald expansion panel, vue accordion, expansion panel vue, accessible accordion, vuetify0 expansion panel, paper emerald
features:
  category: Component
  label: 'C: EmExpansionPanel'
  level: 2
  renderless: false
  order: 14
related:
  - /systems/emerald
  - /systems/emerald/icon
  - /components/disclosure/expansion-panel
---

# EmExpansionPanel

<DocsPageFeatures :frontmatter />

An accordion of coordinated panels — one open at a time by default, several at once when asked — with the WAI-ARIA accordion shape built in.

## Usage

A group wraps any number of panels, and each panel is a header, an activator, and a content region. `v-model` on the group holds the open panel's `value` — or `undefined` when everything is closed — and opening one panel collapses the previous one unless `multiple` is set.

Give every panel an explicit `value`. A panel without one falls back to its registration index, which works until a `v-if` or a reorder shifts the indices under the model.

::: ds-example
/systems/emerald/expansion-panel/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
  } from '@paper/emerald'
</script>

<template>
  <EmExpansionPanelGroup>
    <EmExpansionPanel>
      <EmExpansionPanelHeader>
        <EmExpansionPanelActivator>
          <EmExpansionPanelCue />
        </EmExpansionPanelActivator>
      </EmExpansionPanelHeader>

      <EmExpansionPanelContent />
    </EmExpansionPanel>
  </EmExpansionPanelGroup>
</template>
```

## Composed on v0

Each part is a one-to-one wrapper over v0's [ExpansionPanel](/components/disclosure/expansion-panel) compound: `EmExpansionPanelGroup` renders `ExpansionPanel.Group`, `EmExpansionPanel` renders `ExpansionPanel.Root`, and the header, activator, content and cue map the same way. v0 owns all of the behavior — the selection model behind the group, the registration of panels, every ARIA attribute, and the `hidden` toggling of content. Emerald owns only the classes and tokens on top, plus the default chevron: `EmExpansionPanelCue` fills v0's `ExpansionPanel.Cue` with an [EmIcon](/systems/emerald/icon) `chevron-down` glyph that rotates on the `data-state="open"` attribute v0 publishes.

Two details of the split are worth knowing. First, v0's Group emits no disabled attribute on its own element, so `EmExpansionPanelGroup` binds its own `data-disabled` — that attribute is what Emerald's stylesheet dims the panels off when the whole group is disabled. Second, collapsed content is hidden, not removed: v0 sets the native `hidden` attribute and the element stays in the DOM, so anything stateful inside a panel survives closing it.

The wrappers forward v0's slot props selectively. The group's default slot receives `isDisabled` and the `select` / `unselect` / `toggle` functions, the panel's receives `isSelected`, `isDisabled` and its `attrs`, and the cue's receives `isSelected` and `attrs` — useful when replacing the default chevron. `EmExpansionPanelHeader`, `EmExpansionPanelActivator` and `EmExpansionPanelContent` render plain slots with no slot props.

## Examples

::: ds-example
/systems/emerald/expansion-panel/multiple

### Multiple panels open

`multiple` lifts the one-at-a-time rule: every panel toggles independently, and the model becomes an array of the open panels' values instead of a single value. Bind an array — an empty one means everything is closed, and seeding it with values opens those panels on mount.

Reach for it when the sections are short and comparing them matters — a spec sheet, a settings review — and stay with single mode when the sections are long enough that two open at once means scrolling between them. The mode is the group's decision, not the panel's: there is no per-panel override, so a group is either an accordion or a set of independent disclosures.
:::

::: ds-example
/systems/emerald/expansion-panel/mandatory

### Keeping one panel open

`mandatory` prevents the last open panel from collapsing — clicking its header does nothing once it is the only one open, while switching to a sibling still works. Use it when the panels are the page's actual content and an all-closed accordion would leave nothing on screen.

Note what `mandatory` does not do: it does not open anything by itself. A group that mounts with an empty model stays empty until the reader clicks, because there is nothing open yet for the rule to protect. Seed the model with a value, as this example does — or pass `mandatory="force"` instead, which auto-expands the first non-disabled panel on mount and saves you the seed.
:::

::: ds-example
/systems/emerald/expansion-panel/disabled

### Disabled panels

`disabled` on a panel disables just that panel; `disabled` on the group disables every panel at once and dims the whole surface. The two compose — a panel is inert if either flag is set.

A disabled panel's activator is a native disabled button: it cannot be clicked, it is removed from the tab order, and a keyboard user tabbing through the accordion skips it entirely. That silence is the thing to design around. The header text is still visible, so put the reason a section is unavailable into the title itself — as this example does — rather than relying on a tooltip or a hover state a keyboard user will never reach.

A disabled panel that was already open stays open; disabling prevents interaction, it does not collapse state.
:::

## Props

### EmExpansionPanelGroup

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `T \| T[]` | `undefined` | Open panel's value — an array when `multiple` is set |
| `disabled` | `boolean` | `false` | Disables the group and every panel in it |
| `enroll` | `boolean` | `false` | Auto-expands non-disabled panels as they register |
| `mandatory` | `boolean \| 'force'` | `false` | `true` prevents collapsing the last open panel; `'force'` also auto-expands the first non-disabled panel |
| `multiple` | `boolean` | `false` | Lets several panels stay open; changes the model to an array |
| `namespace` | `string` | — | Which v0 ExpansionPanel context to provide. Only needed when nesting |

### EmExpansionPanel

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | auto-generated | Panel id; also seeds the header and content ARIA ids |
| `value` | `unknown` | registration index | Identifies the panel in the group's model. Always set it explicitly |
| `disabled` | `boolean` | `false` | Disables this panel only |
| `namespace` | `string` | — | Which v0 ExpansionPanel context to resolve. Only needed when nesting |

### Parts

<!-- Hand-authored ahead of DocsApi extraction for @paper/emerald -->

| Part | Props | Notes |
|------|-------|-------|
| `EmExpansionPanelHeader` | `namespace` | Renders a heading (`h3`) wrapping the activator |
| `EmExpansionPanelActivator` | `namespace` | Renders a native `button`; label and cue go in its default slot |
| `EmExpansionPanelContent` | `namespace` | The collapsible region; hidden in place, never unmounted |
| `EmExpansionPanelCue` | `namespace` | Rotating chevron; replace it through the default slot |

Every one of the six parts accepts `namespace`, defaulting to v0's `v0:expansion-panel`. Pass a distinct namespace to the group and the same one to every part inside it when nesting one accordion within another's content.

## Accessibility

The compound follows the [WAI-ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/), and all of it comes from v0 rather than from Emerald. `EmExpansionPanelHeader` renders an `h3` wrapping the activator, so screen-reader users can jump between panels by heading; `EmExpansionPanelActivator` renders a native `button type="button"`, so Enter and Space activation, focusability and the implicit role are the platform's.

### ARIA attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| `id` | Header id | Activator |
| `aria-expanded` | `true` / `false` | Activator |
| `aria-controls` | Content region id | Activator |
| `aria-disabled` | `true` / `false` | Activator |
| `disabled` | Present when disabled | Activator |
| `role` | `region` | Content |
| `aria-labelledby` | Activator id | Content |
| `hidden` | Present when collapsed | Content |
| `aria-hidden` | `true` | Cue |

The ids are paired: `aria-controls` on the activator points at the content, and `aria-labelledby` on the content points back at the activator. Both derive from the panel's `id`, so supplying your own gives you stable, inspectable ids. The cue is decorative and invisible to assistive technology — if you replace the default chevron, whatever you put in the slot inherits that, so never make the cue carry meaning the header text does not.

### Keyboard

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Moves between panel headers |
| `Enter`, `Space` | Toggles the focused panel — native, since the activator is a real button |

There is no arrow-key navigation between headers: each activator is an ordinary tab stop, not part of a roving-focus group. A disabled activator carries the native `disabled` attribute and drops out of the tab order entirely, so keyboard users pass over it with no announcement — which is why a disabled panel's reason belongs in its visible title.

### Hidden, not gone

Collapsed content keeps its element in the DOM with the `hidden` attribute set. Screen readers skip it, it is unreachable by keyboard, and form state inside it survives the collapse. If a panel contains focus when it closes — a button inside was clicked and the model changed elsewhere — focus falls back to the document, so avoid collapsing a panel out from under its own controls.
