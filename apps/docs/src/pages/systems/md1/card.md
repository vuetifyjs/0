---
title: Md1Card - Material Design 1 Card for Vue
meta:
- name: description
  content: The Material Design 1 card, a 2 dp sheet with 2 dp corners built from header, media, title, subtitle, supporting text, actions and an expandable region. Built on Vuetify0's Atom and Collapsible.
- name: keywords
  content: md1 card, material design 1 card, card media, expandable card, card actions, vue card, vuetify0 atom, vuetify0 collapsible, paper md1
features:
  category: Component
  label: 'C: Md1Card'
  level: 2
  renderless: false
  group: content
  order: 1
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/toggle-buttons
  - /components/primitives/atom
  - /components/disclosure/collapsible
---

# Md1Card

<DocsPageFeatures :frontmatter />

The Material Design 1 card. A sheet of material that is the entry point to more detail, assembled from the content blocks the guidelines define: a header, rich media, a primary title, supporting text, actions and an expandable region.

<DocsMd1Reference
  href="https://m1.material.io/components/cards.html"
  title="Cards"
/>

## Usage

`Md1Card` is a presentational compound: the root is the sheet, and each content block is a part you place in anatomy order. Leave out the blocks a card does not need; the spacing between the ones you keep follows the guidelines' combinations on its own.

Use cards for a collection of mixed content: photos with captions of variable length, items with their own actions, content that would sit in a grid list but needs more text. For homogeneous content that is quickly scanned, use a list; for a gallery of images, use a grid list.

::: ds-example
/systems/md1/card/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Card } from '@paper/md1'
</script>

<template>
  <Md1Card>
    <Md1Card.Header />

    <Md1Card.Media />

    <Md1Card.Title />

    <Md1Card.Subtitle />

    <Md1Card.Supporting />

    <Md1Card.Actions />

    <Md1Card.Expanded />
  </Md1Card>
</template>
```

## Composed on Vuetify0

`Md1Card` renders v0's [Atom](/components/primitives/atom) as an `article` and adds a renderless [Collapsible](/components/disclosure/collapsible) root inside it, under its own `md1:card:collapsible` namespace so a card never captures the parts of a consumer's Collapsible. `Md1Card.Expanded` is `Collapsible.Content`: the `region` role, the `hidden` attribute while collapsed and the `data-state` hook all come from v0. The card adds no behavior of its own, because the guidelines describe a sheet, not a control: there is no ripple on the root, no role and no tab stop. The primary action of a card is a link or a button you place inside it.

`data-expanded` and `data-selected` on the root, `data-inset`, `data-ratio` and `data-state` on `Media`, and `data-align` on `Actions` are Material Design 1's own hooks. `Media` tracks its image with v0's [useImage](/composables/system/use-image), which drives the loading-images recipe through `data-state`.

The parts read the card through an optional `md1:card` context. Every part except `Expanded` renders outside a card and warns once in development that its card state is inert; `Expanded` throws there, as the `Collapsible.Content` it wraps does.

## Examples

::: ds-example
/systems/md1/card/header

### Header

`Md1Card.Header` is the avatar, title and subtitle row: 72 dp tall with 16 dp on every side, a 40 dp round avatar at the keyline and the two text lines at the 72 dp content keyline (80 dp from 600 px, where the keyline moves to 24 dp). The title is 14 sp Medium at the primary ink, the subtitle 14 sp Regular at the secondary ink; the guidelines give the sizes and Material Design 1 takes the weights from Body 2 and Body 1.[^header-weight] Both lines use a 20 dp leading so the pair fits the avatar's height and the row stays 72 dp.

The default slot is the end of the row. Put the overflow menu's icon button there: Material Design 1 pulls a 48 dp icon button out by 12 dp so its 24 dp glyph lands on the keyline, the upper-right placement the guidelines give the overflow menu. The avatar image is decorative (`alt=""`), because the title already names the person.

Pair a header with 16:9 media and a short action row, the guidelines' second and third combinations, when the card is about someone or from someone.
:::

::: ds-example
/systems/md1/card/media

### Media ratios

`Md1Card.Media` fills the card's width at one of the two ratios the guidelines recommend: `16:9`, the default, or `1:1`. The image covers the area and is cropped rather than letterboxed. Slot content paints over the bottom of the image in white ink, on top of a text-protection gradient from the imagery page: 40% black at the bottom edge, fading out over 168 dp with its centre three tenths of the way toward the dark end. The gradient appears only when there is content to protect.

While the image loads, the area holds a 12% tone instead of leaving a hole in the sheet, and the image fades in from transparent and desaturated, the loading-images pattern. An image that fails to load keeps the tone and hides the broken glyph. `alt` defaults to empty, the decorative case; give it real text when the image carries information the title does not.

Media is the only part that reaches the card's edges, so place it first when it is the primary content, or after a header when the card is about a person.
:::

::: ds-example
/systems/md1/card/inset

### Inset media

The other four `ratio` values are the inset sizes, squares on the guidelines' 80 dp base: `1x` is 80 dp, `1.5x` 120 dp, `2x` 160 dp and `3x` 240 dp. An inset image floats to the top end corner with 16 dp above it and sits on the content keyline, and the title and subtitle flow beside it, the tenth to thirteenth combinations of the page. The action row clears the image, so the actions always sit below it. `data-inset` marks the inset sizes for styling.

Reach for inset media when the image identifies the content but is not the content itself: an album cover beside its title, a product thumbnail. The `3x` size is wide enough that it usually stands alone with an action row, which is why the last card in the example carries no text.
:::

::: ds-example
/systems/md1/card/text

### Title, subtitle and supporting text

`Md1Card.Title` is the primary title in Headline, 24 sp Regular at the primary ink, with 24 dp above. It renders an `h2` by default; `level` picks another heading level for the document outline without changing the type. `Md1Card.Subtitle` sits 12 dp below it in Body 1, 14 sp at the secondary ink. `Md1Card.Supporting` is the body copy, Body 1 at the secondary ink with 16 dp above.

Each text block closes with 24 dp when it ends the card and 16 dp when more content follows, so the blocks space themselves the way the guidelines' combinations do without any prop: a title alone closes at 24 dp, a title above supporting text closes at 16 dp, and a subtitle takes over the title's bottom padding with its own 12 dp. A collapsed expansion does not count as content below. Text sits on the 16 dp keyline on handsets and on the 24 dp keyline from 600 px.

The first title also names the card: the root's `aria-labelledby` points at it, and it is released if the title goes away.
:::

::: ds-example
/systems/md1/card/actions

### Actions

`Md1Card.Actions` is the supplemental action row: 8 dp of padding all round and 4 dp between actions. The guidelines limit a card to two supplemental actions plus an overflow menu, and position them consistently from card to card. `align="end"` gathers them at the end edge, the usual home for a row of icon actions with the overflow menu last.

The primary action of a card is typically the card itself, not a button in this row. Text actions are flat `Md1Button`s in the accent colour; icon actions are icon-only `Md1Button`s, which need `ariaLabel`. Inline links in the text are discouraged by the guidelines, so keep navigation in the action row or on the card's own link.
:::

::: ds-example
/systems/md1/card/action-areas

### Four action areas

The guidelines number a card's actionable regions. Here the header is the first: the album it names opens from it. The rich media is the second, a grid of photos each of which could open on its own. The two supplemental actions take an area each, full-width rows split by a full-bleed divider, for when two actions are equally important and their labels would crowd one row.

Keep the areas distinct. A card that is itself one big target should not also hold four, and every area needs a label of its own for assistive technology.
:::

::: ds-example
/systems/md1/card/controls

### UI controls

The action row also hosts the controls the guidelines name for modifying a card's primary content: "a slider to choose a day, stars to rate content, or a segmented button to select a date range". Here an `Md1ToggleButtons` group switches the range the title reports. Tabs and a slider go in the same place, as `Md1Tabs` and `Md1Slider`; a star rating is an escape-hatch composition of v0's Rating with Material Design 1 tokens, since Material Design 1 defines no rating component.

The control changes what the card shows; it never navigates away. Keep it to one control per card, and give it an accessible name (`label` on the toggle group) because the row has no visible caption.
:::

::: ds-example
/systems/md1/card/inline-controls

### Slider and tabs in the action area

The guidelines show two more controls in the action block. On the weather card a discrete `Md1Slider` picks the hour, and the reading above it follows; the stops are labelled under the track because the slider's own value pin only appears while it is pressed.[^hour-stops] On the stock card `Md1Tabs` switch the range the quote covers. Tabs span the card rather than sitting inside the 8 dp action padding, so the indicator runs edge to edge as it does in an app bar.[^tabs]

The weather card also shows a full-bleed divider that is not an expansion seam: it separates the slider and the forecast list from the action below, for content that needs more distinct separation than spacing gives.
:::

::: ds-example
/systems/md1/card/booking

### Inset divider and segmented times

Use an inset divider to separate related content inside one card. Here it parts the restaurant's details from the booking section below, held on the card's content keyline at both edges, so it reads as a pause within the card rather than a seam where the material could split. Compare the full-bleed dividers of the weather card and the expandable card.

The booking section puts an `Md1ToggleButtons` group, the guidelines' segmented button, in the action block to choose a time, with the action that commits it in its own row underneath.
:::

::: ds-example
/systems/md1/card/expanded

### Expandable card

Bind `v-model:expanded` and the card can expand in place to reveal `Md1Card.Expanded`, the expanded supporting text: Body 1 at the secondary ink with 16 dp above, 24 dp below and the content keyline at the sides. A full-bleed divider marks the seam, the guidelines' rule for expansion. The region grows and shrinks over the standard duration on the standard curve and lands at once under reduced motion.[^duration] While collapsed it is `hidden`, so its contents leave the tab order.

Without the model there is no expansion: an unset `expanded` leaves the region hidden, and Material Design 1 warns in development that `Md1Card.Expanded` has nothing to reveal it. The toggle is yours to place. The example uses v0's `Collapsible.Activator`, renderless under `MD1_CARD_COLLAPSIBLE`, with an `Md1Button` as the trigger, which gives the button `aria-expanded` and `aria-controls` pointing at the region. A plain button that flips the model works too, without those attributes.

The expanded card may grow past the view's height and then scrolls with the collection; the guidelines keep scrolling out of the card itself on mobile.
:::

::: ds-example
/systems/md1/card/overflow

### Truncated and scrolling content

Card content that exceeds the card's maximum height is truncated, not scrolled. The recipe card cuts its supporting text at three lines with an ellipsis,[^three-lines] and "Read more" expands the card to show all of it along with the expanded region; the card then grows and scrolls with the page, never on its own.

On desktop the guidelines allow the exception the comments card shows: content inside the card can scroll internally under a fixed height, here a comment thread above a field for adding one. Keep it to desktop layouts. On a phone the page already scrolls, and a second scrolling region inside a card puts two scroll bars on one screen. The scrolling region is a focusable, labelled region so a keyboard user can scroll it too.[^region]
:::

::: ds-example
/systems/md1/card/selected

### Selected

`selected` applies the selection pattern: a scrim over the card and a check mark. The scrim is `--md1-selection`, the accent at 30%, and never takes the pointer.[^alpha] Where the card has a header avatar, the check mark replaces it, a 40 dp accent disc, as the selection page asks when there is space; otherwise a compact 24 dp check mark sits 8 dp in from the top end corner. The check mark is named "Selected" for assistive technology, from the `Md1.selected` locale key.

`selected` is a display state, not a selection model: the card does not toggle itself. Hold the selection in your own state and drive a contextual toolbar from it, as the example's buttons do. The guidelines' long press and hover-revealed checkbox are gestures for you to wire to that state.
:::

::: ds-example
/systems/md1/card/collection

### Collection

A card collection is a layout of cards on one plane. The guidelines keep a constant card width within a collection, 8 dp from the screen edge and 8 dp between cards on mobile (8, 16, 24 or 40 dp on larger screens), and scroll the collection vertically only. Layout is yours: the example is a CSS grid with 8 dp gutters.

Cards rest at 2 dp and rise to 8 dp when picked up. Where the pointer is a mouse, the desktop rule applies instead: the card rests seamed at 0 dp and lifts to 8 dp on hover, so a collection on a desktop page reads as flat until the pointer finds a card. Swipe to dismiss and pick-up-and-move are gestures Material Design 1 does not ship; provide buttons for dismissing and reordering.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Card*.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expanded` | `boolean` | | The expansion model, bound with `v-model:expanded`. Unset, the card has no expansion and `Md1Card.Expanded` stays hidden; emits `update:expanded` when a v0 `Collapsible.Activator` under `MD1_CARD_COLLAPSIBLE` toggles it |
| `selected` | `boolean` | `false` | The selection pattern: the 30% accent scrim and a check mark, in place of the header avatar when there is one |

The default slot holds the parts, in anatomy order. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Card.Header` | `avatar?: string`, `title?: string`, `subtitle?: string` | 72 dp row; 40 dp avatar; the default slot is the end of the row, for the overflow menu's icon button |
| `Md1Card.Media` | `src?: string`, `alt = ''`, `ratio: '16:9' \| '1:1' \| '1x' \| '1.5x' \| '2x' \| '3x' = '16:9'` | Full width at `16:9` or `1:1`; inset squares of 80, 120, 160 and 240 dp otherwise (`data-inset`). The default slot overlays the image |
| `Md1Card.Title` | `level: 1 \| 2 \| 3 \| 4 \| 5 \| 6 = 2` | Headline 24 sp; names the card |
| `Md1Card.Subtitle` | | Body 1, 12 dp under the title |
| `Md1Card.Supporting` | | Body 1 at the secondary ink |
| `Md1Card.Actions` | `align: 'start' \| 'end' = 'start'` | 8 dp padding, 4 dp between actions |
| `Md1Card.Expanded` | | `Collapsible.Content`; revealed by the card's `expanded` model behind a full-bleed divider |

`MD1_CARD_COLLAPSIBLE` is the namespace of the card's Collapsible, for a v0 `Collapsible.Activator` you place as the toggle. `useMd1Card()` reads the card context from a custom part.

## Accessibility

The card renders an `article`, a self-contained item in a collection, named by its first `Md1Card.Title` through `aria-labelledby`. Give each card a title, or an `aria-label`, so a screen reader's list of articles is useful. The title is an `h2`; set `level` to fit the page's heading outline.

### Focus

The card itself takes no focus. Tab moves through every focusable element inside a card, in document order, before the next card, the order the guidelines ask for. Keep the primary action a single link or button so a keyboard user meets it first.

### Expansion

| Key | Behavior |
|-----|----------|
| Enter, Space | On a `Collapsible.Activator` toggle, expands or collapses the region |
| Tab | Reaches the expanded region's contents only while it is expanded |

The region has `role="region"` and is labelled by the card's title. A toggle built on `Collapsible.Activator` carries `aria-expanded` and `aria-controls`; the WAI-ARIA disclosure pattern. Give an icon-only toggle an `ariaLabel` that names the content, not the action, since `aria-expanded` already announces the state.

### Images and selection

Media and avatar images are decorative by default (`alt=""`). Pass `alt` on `Md1Card.Media` when the image carries information. The selected check mark is an image named "Selected", so the state is announced with the card's content; the scrim alone conveys nothing to assistive technology.

[^header-weight]: Our call: the page gives only sizes; Body 2 and Body 1 are the 14 sp styles of the type scale.

[^hour-stops]: Our call: the figure labels the hours under the track; the discrete pin alone would hide them at rest.

[^tabs]: Our call: the figure runs the tab bar full width, so the tabs sit outside `Md1Card.Actions`' padding.

[^duration]: Our call: the page gives no expansion timing; the standard duration is the motion page's default for on-screen changes.

[^three-lines]: Our call: the page asks for truncation without a length; three lines keeps the card's height steady.

[^region]: Our call: the page gives no height or focus rule; the example caps the thread at 280 px.

[^alpha]: Our call: the selection page names the accent but no alpha; 30% keeps the card's content readable under it.
