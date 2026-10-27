---
title: Bidirectionality - Material Design 1 RTL Mirroring for Vue
meta:
- name: description
  content: Material Design 1 bidirectionality. Left-to-right and right-to-left screens side by side, what mirrors and what does not, media controls, slashes and RTL islands.
- name: keywords
  content: md1 rtl, material design 1 bidirectionality, rtl mirroring, right to left, dir rtl, useRtl, mirrored icons, paper md1
features:
  category: Guide
  label: 'Bidirectionality'
  level: 2
  group: style
  order: 6
related:
  - /systems/md1
  - /systems/md1/icon
  - /systems/md1/layout
  - /composables/plugins/use-rtl
---

# Bidirectionality

<DocsPageFeatures :frontmatter />

A right-to-left layout is the mirror image of a left-to-right one: layout, text and the icons that point all flip, while numbers, untranslated text, clocks and media controls keep their direction.

<DocsMd1Reference
  href="https://m1.material.io/usability/bidirectionality.html"
  title="Bidirectionality"
/>

## Usage

Material Design 1 reads direction from two places. Layout, keylines and icons follow the `dir` attribute through logical CSS properties and `[dir="rtl"]` selectors, so a `dir="rtl"` on any ancestor mirrors them. Components whose geometry is computed in script, such as `Md1Slider`, read v0's `useRtl`, so install the plugin and let it write `dir` on `<html>`:

```ts
import { createRtlPlugin } from '@vuetify/v0'

app.use(createRtlPlugin({ default: true }))
```

`useRtl().isRtl` is writable, so a language switcher flips the whole app by setting it. A subtree that needs the other direction provides its own context with `createRtlContext` and sets `dir` on its root, which is how the examples on this page show both directions at once.

::: ds-example
/systems/md1/bidirectionality/screen
:::

The same screen in English and Arabic.[^arabic-copy] Under RTL the title, icons and controls flow from right to left: the back arrow points right, text is right-aligned, the tabs start from the right, the checkbox sits to the right of its label, Save moves to the left end of the actions, and the progress bar fills from the right, the direction the content is read. The search and overflow icons do not point anywhere, so they keep their shape and only change sides.

The keylines mirror with the layout: the toolbar's 16 dp icon margin and 72 dp title keyline, and the list's 16 dp avatar margin and 72 dp text keyline, are measured from the right edge. Numbers do not mirror. The times keep their digit order, and the phone number sits in its own `dir="ltr"` element, because a run of digits with `+` and `-` would otherwise be reordered by the bidi algorithm. The Wi-Fi label shows the same rule for untranslated text: the English word keeps its LTR order inside the Arabic sentence.

## Examples

::: ds-example
/systems/md1/bidirectionality/drawer

### Navigation drawer and text fields

A permanent navigation drawer sits at the start edge, so under RTL it moves to the right and the content to its left; a temporary drawer slides in from the right for the same reason. Inside it, the 16 dp icon margin and 72 dp text keyline are measured from the right, and the `send` and `label` icons mirror because they point.

Text field icons swap sides with the rest of the layout: in RTL the envelope and the person sit to the right of their fields, and the label and the typed text start from the right. The email address keeps its own LTR order, as untranslated text does, without any markup: the browser lays out a run of Latin characters left to right inside the RTL field.
:::

::: ds-example
/systems/md1/bidirectionality/icons

### When to mirror

The test is whether the icon communicates direction. Back and forward are the most important ones: under RTL, back points right and forward points left, because forward is toward the end of the line. Icons that show movement forward, such as `send`, mirror too, and so does a speaker beside a slider: the slider runs right to left, so the sound waves leave toward the left. Undo and redo carry both a horizontal and a circular direction; the guidelines let either win in RTL, and the example keeps the horizontal one, so each arrow mirrors.[^undo-redo] An icon that represents text mirrors when its lines are ragged, indented or unfinished at one end, as the chat bubble's lines are.

Circular time does not mirror. Clocks turn clockwise for RTL readers too, so `refresh`, `history` and `schedule` stay as drawn. Physical objects such as a keyboard or a headset look the same everywhere, the search handle sits bottom right because most readers are right-handed in RTL countries too, and slashes on off-state icons keep their LTR angle. Media playback icons keep their direction as well; the next example covers them.

The 11 shipped directional roles flip on their own under `dir="rtl"`, through the rule on the [Md1Icon](/systems/md1/icon) page. A glyph you register yourself with `createMd1IconsPlugin({ icons })` joins that table through the `mirrors` option, so the example's own undo, redo, chat and speaker glyphs flip by the same rule: `mirrors: { 'volume-up': true }`.
:::

::: ds-example
/systems/md1/bidirectionality/media

### Media and volume

Media playback buttons and the media progress bar never mirror. Their direction is the direction of the tape, not the direction of time, so play points right and the elapsed time grows from the left in every language. The example wraps the progress bar, the timestamps and the transport buttons in `dir="ltr"` inside the RTL player.

The volume slider is a quantity, not the tape, so it mirrors with the rest of the layout: in RTL its minimum sits on the right, the fill grows leftward, and the speaker glyph turns to face it. `Md1Slider` reads the direction from `useRtl`, which is why each player provides its own RTL context as well as its own `dir`.
:::

::: ds-example
/systems/md1/bidirectionality/editor

### RTL text in an LTR document

Content can need mirroring when the UI does not. The page is an English, LTR document; its second paragraph is Hebrew and carries `dir="rtl"`.[^hebrew-copy] Move into it and the formatting toolbar takes the paragraph's direction: alignment, list and indent buttons describe the start and end of a line of text, so they flip and run right to left, while bold and italic do not. Move back into the English paragraph and the toolbar turns back.

The toolbar's own `dir` follows the focused paragraph, a one-line `toRef`. The same rule covers a text editing menu in a fully RTL UI: icons tied to the start and end of a line mirror, the rest stay put.
:::

## What mirrors

| Mirrors | Does not mirror |
|---------|-----------------|
| Layout, keylines and padding: the 16 dp icon margin and 72 dp content keyline are measured from the right | Numbers, clocks and phone numbers |
| Text alignment, for text in an RTL language | Untranslated text, such as a URL or a brand name, which keeps its own direction |
| Navigation buttons and their order: back points right, the drawer opens from the right | Icons with no direction, such as a camera or a search handle |
| Text field icons and checkbox labels, which swap sides | Charts and graphs |
| Progress bars, which fill from right to left, and calendar days | Media playback buttons and the media progress bar |
| Icons that point or represent a line of text | Circular time: refresh, history, clocks |
| Volume sliders and their speaker | Slashes on off-state icons |

Material Design 1 builds every keyline and padding with logical properties (`padding-inline`, `inset-inline`, `margin-inline`), so a component needs no RTL rule of its own for layout. The few that move with script, the slider's thumb and the indeterminate progress sweep, read the direction once and invert their geometry.

## Accessibility

Set `lang` alongside `dir`, so a screen reader switches voice and the conditional `help` glyph can tell Hebrew, where it stays put, from Arabic and Farsi, where it mirrors. On an RTL slider the arrow keys follow the picture: Left raises the value, because the fill grows leftward. Tabs and toolbar actions move focus in reading order, so Right moves to the next item in the source, which sits to its left under RTL.[^rtl-arrows] Numbers inside RTL text need no markup in most cases, but a sequence that mixes digits with `+` or `-`, such as a phone number, should sit in its own `dir="ltr"` element so the bidi algorithm cannot reorder it.

[^arabic-copy]: Our call: the Arabic titles, names and times are illustrative copy written for the example. Digits stay Western, as in the guidelines' figure.

[^undo-redo]: Our call: the guidelines allow either reading; the horizontal one matches where the arrows point.

[^hebrew-copy]: Our call: the Hebrew paragraph is illustrative copy written for the example.

[^rtl-arrows]: Our call: documented as shipped. v0's roving focus has no RTL handling, so arrow keys in tabs and toolbars are not mirrored.
