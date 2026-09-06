---
title: EmDivider - Emerald Divider for Vue
meta:
- name: description
  content: Emerald's divider — a horizontal rule, a vertical separator, or a labeled break, choosing the right element and ARIA for each shape. Composed on Vuetify0's Atom.
- name: keywords
  content: emerald divider, vue divider, separator vue, labeled divider, horizontal rule, design system divider
features:
  category: Component
  label: 'C: EmDivider'
  level: 1
  renderless: false
  order: 13
related:
  - /systems/emerald
  - /systems/emerald/button
  - /components/primitives/atom
---

# EmDivider

<DocsPageFeatures :frontmatter />

A rule between things — horizontal or vertical, with an optional center label. The component picks the element and the ARIA for each shape so you never have to.

## Usage

`EmDivider` has one prop and one slot. `orientation` turns the line vertical; the default slot, when you fill it, becomes a small centered label with the line running out to both sides of it.

An empty horizontal divider renders a native `hr`, so the common case is the semantic one for free. The vertical and labeled shapes swap to `div`-based rendering because the platform element cannot express them — the details are under Composed on Vuetify0.

::: ds-example
/systems/emerald/divider/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { EmDivider } from '@paper/emerald'
</script>

<template>
  <EmDivider />
</template>
```

## Composed on Vuetify0

`EmDivider` renders a single [Atom](/components/primitives/atom) — Vuetify0's polymorphic foundation element — and the whole component is really a decision about what to ask that Atom to be:

- **No label, horizontal** — the Atom renders as `hr`. The platform supplies the separator semantics; Emerald supplies only the stroke.
- **No label, vertical** — `hr` is unavoidably horizontal, so the Atom renders as a `div` carrying `role="separator"` and `aria-orientation="vertical"`, restating by hand what the native element would have said.
- **Labeled** — the Atom renders as a `div` with **no separator role at all**. That is deliberate: `role="separator"` treats its children as presentational, so putting it on the wrapper would strip the label's text from the accessibility tree. Instead the two flanking line spans are `aria-hidden` and the label reads as ordinary content.

The anatomy is fixed — `as` and `renderless` are not part of the prop surface, because the element choice above *is* the component's job. Styling hangs entirely off the attributes the template writes: `data-orientation` for direction and `data-labeled` for the labeled shape; there are no state classes.

## Examples

::: ds-example
/systems/emerald/divider/label

### Labeled

Fill the default slot and the divider becomes a break with words in it — the classic "or" between two ways of doing the same thing. The label is centered, set on Emerald's small b3 body step in the muted on-surface-variant color, and the lines flex to fill whatever width remains on either side.

Keep the label short and non-interactive. It is a `span` inside a rule, not a heading and not a control — nothing about it is focusable, and its type step is deliberately too small for content you expect people to read as prose. If the text is a section title, use a real heading above the content and an unlabeled divider, or no divider at all; a labeled divider that restates the heading gives a screen reader the same words twice.

A labeled divider can also be `orientation="vertical"`, where the lines run above and below the label instead — it needs a parent tall enough to stretch into, and it is rare enough in practice that the horizontal form should be your default assumption.
:::

::: ds-example
/systems/emerald/divider/vertical

### Vertical

`orientation="vertical"` turns the rule on end for separating items that sit in a row — metadata strips, toolbar clusters, breadcrumb-adjacent chrome.

The divider has no height of its own: it is `align-self: stretch` with a one-line minimum, so it takes its extent from the row it sits in. Put it in a flex row and it spans the row's height; the `1em` floor keeps it visible even between short inline items. What it does not do is create the row — layout belongs to the parent, and the divider only draws the line.

Prefer a gap over a divider when whitespace alone already separates the items. A vertical rule earns its place when the items read as one run of text without it — as the metadata fields here would.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with EmDivider.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the rule. Also decides the rendered element and ARIA — see Composed on Vuetify0 |

The default slot is the optional label; filling it switches the component to its labeled shape. There are no named slots and no events.

## Accessibility

Each of the three shapes says something different to assistive technology, and each is the correct statement for that shape:

| Shape | Rendered as | Semantics |
|-------|-------------|-----------|
| Horizontal, no label | `hr` | Implicit `separator` role from the platform |
| Vertical, no label | `div` | Explicit `role="separator"` with `aria-orientation="vertical"` |
| Labeled | `div` | No role. Lines are `aria-hidden`; the label reads as plain text |

The labeled shape carrying no role is the part worth understanding rather than "fixing". A `separator` is children-presentational — assistive technology discards everything inside it — so a labeled divider marked as a separator would announce as an anonymous rule and swallow its own words. Emerald keeps the words and gives up the role, which is the better half of that trade: the lines are decoration, the label is content.

The divider is never focusable and has no keyboard behavior in any shape. ARIA's focusable-separator variant is a window splitter — a control that moves — and a divider that only draws a line must not take a tab stop. If you need a draggable divider between panes, that is [Splitter](/components/semantic/splitter), not this component.
