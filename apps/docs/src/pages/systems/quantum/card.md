---
title: QuCard - Quantum Card for Vue
meta:
- name: description
  content: The Material Design 1 card, a 2 dp sheet with 2 dp corners built from header, media, title, subtitle, supporting text, actions and an expandable region. Built on Vuetify0's Atom and Collapsible.
- name: keywords
  content: quantum card, material design 1 card, card media, expandable card, card actions, vue card, vuetify0 atom, vuetify0 collapsible, paper quantum
features:
  category: Component
  label: 'C: QuCard'
  level: 2
  renderless: false
  group: content
  order: 1
related:
  - /systems/quantum
  - /systems/quantum/button
  - /systems/quantum/toggle-buttons
  - /components/primitives/atom
  - /components/disclosure/collapsible
---

# QuCard

<DocsPageFeatures :frontmatter />

The Material Design 1 card. A sheet of material that is the entry point to more detail, assembled from the content blocks the guidelines define: a header, rich media, a primary title, supporting text, actions and an expandable region.

> [!NOTE]
> Reference: [Cards, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/cards.html), the archived page Quantum is pinned to. Content blocks, metrics, elevation and behavior. This page is the Vue.

## Usage

`QuCard` is a presentational compound: the root is the sheet, and each content block is a part you place in anatomy order. Leave out the blocks a card does not need; the spacing between the ones you keep follows the guidelines' combinations on its own.

Use cards for a collection of mixed content: photos with captions of variable length, items with their own actions, content that would sit in a grid list but needs more text. For homogeneous content that is quickly scanned, use a list; for a gallery of images, use a grid list.

::: ds-example
/systems/quantum/card/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuCard } from '@paper/quantum'
</script>

<template>
  <QuCard>
    <QuCard.Header />

    <QuCard.Media />

    <QuCard.Title />

    <QuCard.Subtitle />

    <QuCard.Supporting />

    <QuCard.Actions />

    <QuCard.Expanded />
  </QuCard>
</template>
```

## Composed on Vuetify0

`QuCard` renders v0's [Atom](/components/primitives/atom) as an `article` and adds a renderless [Collapsible](/components/disclosure/collapsible) root inside it, under its own `quantum:card:collapsible` namespace so a card never captures the parts of a consumer's Collapsible. `QuCard.Expanded` is `Collapsible.Content`: the `region` role, the `hidden` attribute while collapsed and the `data-state` hook all come from v0. The card adds no behavior of its own, because the guidelines describe a sheet, not a control: there is no ripple on the root, no role and no tab stop. The primary action of a card is a link or a button you place inside it.

`data-expanded` and `data-selected` on the root, `data-inset`, `data-ratio` and `data-state` on `Media`, and `data-align` on `Actions` are Quantum's own hooks. `Media` tracks its image with v0's [useImage](/composables/system/use-image), which drives the loading-images recipe through `data-state`.

The parts read the card through an optional `quantum:card` context. Every part except `Expanded` renders outside a card and warns once in development that its card state is inert; `Expanded` throws there, as the `Collapsible.Content` it wraps does.

## Examples

::: ds-example
/systems/quantum/card/header

### Header

`QuCard.Header` is the avatar, title and subtitle row: 72 dp tall with 16 dp on every side, a 40 dp round avatar at the keyline and the two text lines at the 72 dp content keyline (80 dp from 600 px, where the keyline moves to 24 dp). The title is 14 sp Medium at the primary ink, the subtitle 14 sp Regular at the secondary ink; the guidelines give the sizes and Quantum takes the weights from Body 2 and Body 1. Both lines use a 20 dp leading so the pair fits the avatar's height and the row stays 72 dp.

The default slot is the end of the row. Put the overflow menu's icon button there: Quantum pulls a 48 dp icon button out by 12 dp so its 24 dp glyph lands on the keyline, the upper-right placement the guidelines give the overflow menu. The avatar image is decorative (`alt=""`), because the title already names the person.

Pair a header with 16:9 media and a short action row, the guidelines' second and third combinations, when the card is about someone or from someone.
:::

::: ds-example
/systems/quantum/card/media

### Media ratios

`QuCard.Media` fills the card's width at one of the two ratios the guidelines recommend: `16:9`, the default, or `1:1`. The image covers the area and is cropped rather than letterboxed. Slot content paints over the bottom of the image in white ink, on top of a text-protection gradient from the imagery page: 40% black at the bottom edge, fading out over 168 dp with its centre three tenths of the way toward the dark end. The gradient appears only when there is content to protect.

While the image loads, the area holds a 12% tone instead of leaving a hole in the sheet, and the image fades in from transparent and desaturated, the loading-images pattern. An image that fails to load keeps the tone and hides the broken glyph. `alt` defaults to empty, the decorative case; give it real text when the image carries information the title does not.

Media is the only part that reaches the card's edges, so place it first when it is the primary content, or after a header when the card is about a person.
:::

::: ds-example
/systems/quantum/card/inset

### Inset media

The other four `ratio` values are the inset sizes, squares on the guidelines' 80 dp base: `1x` is 80 dp, `1.5x` 120 dp, `2x` 160 dp and `3x` 240 dp. An inset image floats to the top end corner with 16 dp above it and sits on the content keyline, and the title and subtitle flow beside it, the tenth to thirteenth combinations of the page. The action row clears the image, so the actions always sit below it. `data-inset` marks the inset sizes for styling.

Reach for inset media when the image identifies the content but is not the content itself: an album cover beside its title, a product thumbnail. The `3x` size is wide enough that it usually stands alone with an action row, which is why the last card in the example carries no text.
:::

::: ds-example
/systems/quantum/card/text

### Title, subtitle and supporting text

`QuCard.Title` is the primary title in Headline, 24 sp Regular at the primary ink, with 24 dp above. It renders an `h2` by default; `level` picks another heading level for the document outline without changing the type. `QuCard.Subtitle` sits 12 dp below it in Body 1, 14 sp at the secondary ink. `QuCard.Supporting` is the body copy, Body 1 at the secondary ink with 16 dp above.

Each text block closes with 24 dp when it ends the card and 16 dp when more content follows, so the blocks space themselves the way the guidelines' combinations do without any prop: a title alone closes at 24 dp, a title above supporting text closes at 16 dp, and a subtitle takes over the title's bottom padding with its own 12 dp. A collapsed expansion does not count as content below. Text sits on the 16 dp keyline on handsets and on the 24 dp keyline from 600 px.

The first title also names the card: the root's `aria-labelledby` points at it, and it is released if the title goes away.
:::

::: ds-example
/systems/quantum/card/actions

### Actions

`QuCard.Actions` is the supplemental action row: 8 dp of padding all round and 4 dp between actions. The guidelines limit a card to two supplemental actions plus an overflow menu, and position them consistently from card to card. `align="end"` gathers them at the end edge, the usual home for a row of icon actions with the overflow menu last.

The primary action of a card is typically the card itself, not a button in this row. Text actions are flat `QuButton`s in the accent colour; icon actions are icon-only `QuButton`s, which need `ariaLabel`. Inline links in the text are discouraged by the guidelines, so keep navigation in the action row or on the card's own link.
:::

::: ds-example
/systems/quantum/card/controls

### UI controls

The action row also hosts the controls the guidelines name for modifying a card's primary content: "a slider to choose a day, stars to rate content, or a segmented button to select a date range". Here a `QuToggleButtons` group switches the range the title reports. Tabs and a slider go in the same place, as `QuTabs` and `QuSlider`; a star rating is an escape-hatch composition of v0's Rating with Quantum tokens, since Material Design 1 defines no rating component.

The control changes what the card shows; it never navigates away. Keep it to one control per card, and give it an accessible name (`label` on the toggle group) because the row has no visible caption.
:::

::: ds-example
/systems/quantum/card/expanded

### Expandable card

Bind `v-model:expanded` and the card can expand in place to reveal `QuCard.Expanded`, the expanded supporting text: Body 1 at the secondary ink with 16 dp above, 24 dp below and the content keyline at the sides. A full-bleed divider marks the seam, the guidelines' rule for expansion. The region grows and shrinks over the standard duration on the standard curve and lands at once under reduced motion. While collapsed it is `hidden`, so its contents leave the tab order.

Without the model there is no expansion: an unset `expanded` leaves the region hidden, and Quantum warns in development that `QuCard.Expanded` has nothing to reveal it. The toggle is yours to place. The example uses v0's `Collapsible.Activator`, renderless under `QU_CARD_COLLAPSIBLE`, with a `QuButton` as the trigger, which gives the button `aria-expanded` and `aria-controls` pointing at the region. A plain button that flips the model works too, without those attributes.

The expanded card may grow past the view's height and then scrolls with the collection; the guidelines keep scrolling out of the card itself on mobile.
:::

::: ds-example
/systems/quantum/card/selected

### Selected

`selected` applies the selection pattern: a scrim over the card and a check mark. The scrim is `--quantum-selection`, the accent at 30%, and never takes the pointer. Where the card has a header avatar, the check mark replaces it, a 40 dp accent disc, as the selection page asks when there is space; otherwise a compact 24 dp check mark sits 8 dp in from the top end corner. The check mark is named "Selected" for assistive technology, from the `Quantum.selected` locale key.

`selected` is a display state, not a selection model: the card does not toggle itself. Hold the selection in your own state and drive a contextual toolbar from it, as the example's buttons do. The guidelines' long press and hover-revealed checkbox are gestures for you to wire to that state.
:::

::: ds-example
/systems/quantum/card/collection

### Collection

A card collection is a layout of cards on one plane. The guidelines keep a constant card width within a collection, 8 dp from the screen edge and 8 dp between cards on mobile (8, 16, 24 or 40 dp on larger screens), and scroll the collection vertically only. Layout is yours: the example is a CSS grid with 8 dp gutters.

Cards rest at 2 dp and rise to 8 dp when picked up. Where the pointer is a mouse, the desktop rule applies instead: the card rests seamed at 0 dp and lifts to 8 dp on hover, so a collection on a desktop page reads as flat until the pointer finds a card. Swipe to dismiss and pick-up-and-move are gestures Quantum does not ship; provide buttons for dismissing and reordering.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuCard*.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expanded` | `boolean` | | The expansion model, bound with `v-model:expanded`. Unset, the card has no expansion and `QuCard.Expanded` stays hidden; emits `update:expanded` when a v0 `Collapsible.Activator` under `QU_CARD_COLLAPSIBLE` toggles it |
| `selected` | `boolean` | `false` | The selection pattern: the 30% accent scrim and a check mark, in place of the header avatar when there is one |

The default slot holds the parts, in anatomy order. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `QuCard.Header` | `avatar?: string`, `title?: string`, `subtitle?: string` | 72 dp row; 40 dp avatar; the default slot is the end of the row, for the overflow menu's icon button |
| `QuCard.Media` | `src?: string`, `alt = ''`, `ratio: '16:9' \| '1:1' \| '1x' \| '1.5x' \| '2x' \| '3x' = '16:9'` | Full width at `16:9` or `1:1`; inset squares of 80, 120, 160 and 240 dp otherwise (`data-inset`). The default slot overlays the image |
| `QuCard.Title` | `level: 1 \| 2 \| 3 \| 4 \| 5 \| 6 = 2` | Headline 24 sp; names the card |
| `QuCard.Subtitle` | | Body 1, 12 dp under the title |
| `QuCard.Supporting` | | Body 1 at the secondary ink |
| `QuCard.Actions` | `align: 'start' \| 'end' = 'start'` | 8 dp padding, 4 dp between actions |
| `QuCard.Expanded` | | `Collapsible.Content`; revealed by the card's `expanded` model behind a full-bleed divider |

`QU_CARD_COLLAPSIBLE` is the namespace of the card's Collapsible, for a v0 `Collapsible.Activator` you place as the toggle. `useQuCard()` reads the card context from a custom part.

## Accessibility

The card renders an `article`, a self-contained item in a collection, named by its first `QuCard.Title` through `aria-labelledby`. Give each card a title, or an `aria-label`, so a screen reader's list of articles is useful. The title is an `h2`; set `level` to fit the page's heading outline.

### Focus

The card itself takes no focus. Tab moves through every focusable element inside a card, in document order, before the next card, the order the guidelines ask for. Keep the primary action a single link or button so a keyboard user meets it first.

### Expansion

| Key | Behavior |
|-----|----------|
| Enter, Space | On a `Collapsible.Activator` toggle, expands or collapses the region |
| Tab | Reaches the expanded region's contents only while it is expanded |

The region has `role="region"` and is labelled by the card's title. A toggle built on `Collapsible.Activator` carries `aria-expanded` and `aria-controls`; the WAI-ARIA disclosure pattern. Give an icon-only toggle an `ariaLabel` that names the content, not the action, since `aria-expanded` already announces the state.

### Images and selection

Media and avatar images are decorative by default (`alt=""`). Pass `alt` on `QuCard.Media` when the image carries information. The selected check mark is an image named "Selected", so the state is announced with the card's content; the scrim alone conveys nothing to assistive technology.
