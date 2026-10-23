---
title: Empty States - Quantum Material Design 1 Empty States Pattern for Vue
meta:
- name: description
  content: The Material Design 1 empty states pattern in Quantum. A neutral image with a tagline, and the starter, educational and best match alternatives built from cards, lists and buttons.
- name: keywords
  content: quantum empty state, material design 1 empty states, empty list, no results, starter content, educational card, best match, vue empty state, paper quantum
features:
  category: Guide
  label: 'Empty states'
  level: 2
  renderless: false
  group: 'patterns'
  order: 6
related:
  - /systems/quantum
  - /systems/quantum/card
  - /systems/quantum/list
  - /systems/quantum/icon
  - /systems/quantum/typography
---

# Empty states

<DocsPageFeatures :frontmatter />

An empty state is what a screen shows when its content cannot be shown: a list with no items, a search with no results. Quantum has no empty state component; the screen is a `QuIcon` and a line of type, or one of the alternatives the guidelines prefer, built from `QuCard`, `QuList` and `QuButton`.

> [!NOTE]
> Reference: [Empty states, Material Design 1 guidelines](http://web.archive.org/web/20181225002248/https://material.io/archive/guidelines/patterns/empty-states.html), the archived page Quantum is pinned to. Image, tagline, and the three alternatives to a truly empty screen. This page is the Vue.

## Usage

The most basic empty state is a non-interactive image and a text tagline, centred in the space the content would fill. Content that is missing because something failed is not an empty state; it belongs to the errors pattern.

::: ds-example
/systems/quantum/empty-states/basic
:::

The image is the inbox glyph at 96 dp in the disabled ink, 38% black on the light theme and 50% white on the dark one, so it reads as part of the background rather than as something to tap. The guidelines give the image no size or colour; 96 dp and the disabled ink are this example's choices. The guidelines ask for an image that is subtle and neutral against the background and conveys the app's purpose, such as the app's own icon. The tagline is the Subheading style, 16 sp on a 24 sp leading (15 sp under a mouse), in the secondary ink, worded as a statement about what the screen is for: "Messages from friends and family gather here", not "Start a conversation". The guidelines' Don't pairs a bright image with a tagline phrased as an instruction, which invites a tap on something that is not a control.

## Building blocks

| Part of the screen | Quantum surface | Guideline |
|--------------------|-----------------|-----------|
| Image | `QuIcon` scaled through `--quantum-icon-size`, in `--quantum-text-disabled` | Subtle and neutral against the background; conveys the app's purpose, such as its icon; not touchable |
| Tagline | The Subheading type tokens in `--quantum-text-secondary` | Positive in tone, on brand, states the purpose without reading as a call to action |
| Starter content | `QuList` or `QuGridList` items the reader can remove | Broad appeal, shows the primary features, deletable and replaceable, personalised where possible |
| Educational content | A dismissible `QuCard` with `QuCard.Actions` | Explains what the screen will hold; brief; can be dismissed or skipped |
| Best match | `QuCard` results under a heading in the `quantum-type-body-2` class | States plainly that the results answer a nearby query, not the one typed |

Quantum ships no `QuEmptyState`. The guidelines define the pattern as content guidance over surfaces that already exist, and a component the spec never names would be a Quantum invention (SPEC.md, exclusivity).

## Examples

::: ds-example
/systems/quantum/empty-states/starter

### Starter content

The most compelling way to learn an app is to use it, so the guidelines prefer content over an empty screen: a reading app hands every new reader a few free books. The starter list is a two-line `QuList` under a `QuSubheader`, and every row carries a remove action in `QuList.Action`, a `QuButton` with the `close` glyph and an `ariaLabel` naming the book.

The guidelines' recommendations shape the content: broad appeal, a showcase of the primary features, personalised where the app knows enough, and always removable and replaceable. Remove all three books and the screen falls back to the basic image and tagline, the empty state the starter content was standing in for. The button under the screen restores the samples; it belongs to this example, not to the pattern.
:::

::: ds-example
/systems/quantum/empty-states/educational

### Educational content

When an image and a tagline cannot explain what a screen is for, show a short piece of education instead. The guidelines' example is a movies app that explains streaming in a dismissible card before the first purchase. Here it is a `QuCard` with a title, supporting text and two flat buttons in `QuCard.Actions`: "Got it", which dismisses the card without consequence, and "Learn more", which leads to more content. Both are labels from the guidelines' writing table.

The guidelines ask for three things: help the reader understand what the screen will hold, keep it brief, and make it possible to dismiss or skip. The card's 8 dp inset from the screen edges is the card collection spacing. Once dismissed, the screen shows the basic empty state; persist the dismissal yourself, so a returning reader is not taught twice.
:::

::: ds-example
/systems/quantum/empty-states/best-match

### Best match

A search that finds nothing exact may still find something for a query spelled slightly differently. Show those results, and say clearly in a heading above them that they answer the nearby query, so they are never mistaken for matches to what was typed. The heading here is "Showing results for “green tea”" in the Body 2 style, 14 sp Medium in the primary text ink, with "No results for “grren tea”" beneath it in Body 1 at the secondary ink.

The wording matters as much as the layout. The guidelines present best matches as a way to handle a misspelled query "without explicitly placing blame on the user", so the copy names both queries and stops there. The results are `QuCard`s with a `QuCard.Header`, the search results form the cards page describes, 8 dp apart.
:::

## Accessibility

An empty state is content, not a control. Keep the image decorative and let the tagline speak: a `QuIcon` without `label` is `aria-hidden`, and the tagline is a plain paragraph read in order with the rest of the screen.

When a list empties because the reader removed its last item, as in the starter example, focus sits on a button that no longer exists. Move it to something that remains, such as the screen's heading or the next control, so keyboard and screen reader users are not dropped to the top of the document. When a search returns best matches, render the heading before the results in the DOM so it is announced first, and keep its text specific enough to be understood on its own.
