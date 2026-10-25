---
title: Scrolling Techniques - Material Design 1 Scrolling Techniques Pattern for Vue
meta:
- name: description
  content: The Material Design 1 scrolling techniques pattern. The app bar's scrollable regions, the toolbar that scrolls off, anchored tabs, the flexible space and the flexible space with overlapping content.
- name: keywords
  content: md1 scrolling techniques, material design 1 app bar scroll, flexible space, collapsing toolbar, overlapping content, vue scrolling app bar, paper md1
features:
  category: Guide
  label: 'Scrolling techniques'
  level: 2
  renderless: false
  group: 'patterns'
  order: 10
related:
  - /systems/md1
  - /systems/md1/toolbar
  - /systems/md1/tabs
  - /systems/md1/card
---

# Scrolling techniques

<DocsPageFeatures :frontmatter />

The app bar is built from regions that react to scrolling on their own terms: the toolbar row, a tab or search bar, and a flexible space. `Md1Toolbar` ships the behaviors through its `scroll` and `tabBar` props; this page shows the regions and the techniques the guidelines name.

> [!NOTE]
> Reference: [Scrolling techniques, Material Design 1 guidelines](https://m1.material.io/patterns/scrolling-techniques.html), the archived page Material Design 1 is pinned to. App bar scrollable regions and behavior. This page is the Vue.

## Usage

::: ds-example
/systems/md1/scrolling-techniques/regions
:::

An app bar can include a status bar, a toolbar (the navigation bar), a tab or search bar, and a flexible space. On the web the status bar is the browser's or the operating system's, so Material Design 1 renders the other three. Turn the switch off to see them assembled into one surface with one shadow.

| Region | Height | Material Design 1 |
|--------|--------|-------------------|
| Status bar | 24 dp | Not rendered: browser or operating system chrome |
| Toolbar | 56 dp, 64 dp from 600 px | The `Md1Toolbar` row: `Nav`, `Title`, `Actions` |
| Tab or search bar | 48 dp | `Md1Tabs` in `Md1Toolbar.Extension`, or `Md1Toolbar.Search` |
| Flexible space | Variable | `Md1Toolbar.Extension` with a large `Title`, or with an `image` |

| Technique | Material Design 1 |
|-----------|-------------------|
| The toolbar scrolls off and returns on reverse scroll | `scroll="hide"` |
| The toolbar scrolls off and the tab bar stays | `tabBar="anchored"` with `Md1Tabs` in the extension |
| The flexible space shrinks into the toolbar | `scroll="collapse"` |
| The flexible space holds an image | `Md1Toolbar.Extension image` with `scroll="collapse"` |
| Content overlaps the flexible space | A composition, below |

## Examples

::: ds-example
/systems/md1/toolbar/hide

### Toolbar off-screen

The standard app bar scrolls off with the content and returns as soon as the reader scrolls back toward the top. `scroll="hide"` moves it 1:1 with the content, with no threshold.
:::

::: ds-example
/systems/md1/toolbar/tabs

### Toolbar with tabs

With a tab bar, the toolbar row scrolls off and the tab bar stays, so the reader can still switch views mid-scroll. `tabBar` chooses between the page's three behaviors: `anchored` keeps the tabs, `hide` scrolls both off, and `staggered`, shown here, returns the tabs first on reverse scroll and the row only at the top.
:::

::: ds-example
/systems/md1/toolbar/collapse

### Flexible space

The flexible space starts tall, with a large title, and shrinks as the content scrolls until only the toolbar row remains; the title shrinks with it to the row's 20 sp. Scrolling back to the top grows both again.
:::

::: ds-example
/systems/md1/toolbar/image

### Flexible space with an image

An image can fill the flexible space and run under the toolbar row. As the content scrolls up the image is pushed out, and once the space has collapsed the row takes the primary colour.
:::

::: ds-example
/systems/md1/scrolling-techniques/overlap

### Flexible space with overlapping content

Content can start inside the flexible space instead of below it. Here the cards begin one increment above the bottom of a two-increment flexible space in the primary colour, a step higher in z than the space itself. Scrolling moves the cards up over the flexible space, which scrolls away beneath them, while the toolbar row stays in place and the cards pass under it.

At the top the row and the flexible space read as one sheet, so the row casts no shadow; it takes its elevation once content passes under it. The guidelines keep tabs out of this technique, because the overlapping content would cover them. The composition is a sticky `Md1Toolbar` over a coloured block and a negative margin on the content; Material Design 1 ships no prop for it.
:::

## Accessibility

A toolbar that scrolls away keeps its controls in the tab order: `Md1Toolbar` brings a hidden bar back when focus moves into it, so a keyboard user never lands on a control that is off-screen. The large title in a flexible space is the same heading as the collapsed one; keep a single heading for the screen rather than one per state.
