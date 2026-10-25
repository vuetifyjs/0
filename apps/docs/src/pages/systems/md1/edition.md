---
title: Anniversary Edition - Material Design 1, the Vuetify 10th Anniversary Edition
meta:
- name: description
  content: Why Material Design 1 is the Vuetify 10th Anniversary Edition. The authority order behind every value, figure-level coverage, and what no framework shipped.
- name: keywords
  content: md1, material design 1, vuetify 10th anniversary edition, vuetify anniversary, material design 2014, complete material design, vuetify 1.5, vuetify0, paper md1
features:
  category: Guide
  label: 'Anniversary Edition'
  level: 2
  order: 1
related:
  - /systems/md1
  - /systems/md1/fab
  - /systems/md1/tabs
  - /systems/md1/motion
---

# Vuetify 10th Anniversary Edition

<DocsPageFeatures :frontmatter />

The guidelines Vuetify began with, finished: Material Design 1 in full, on Vuetify0, for the framework's tenth anniversary on December 14, 2026.

## Why

The Material Design guidelines arrived in 2014. Vuetify went into alpha on December 14, 2016, and its commits that day read "updated cards for md spec" and "updates to cards and buttons for md spec". From that alpha on, Vuetify 1.x was built on Material Design 1.

No framework ever implemented all of it, Vuetify included. Parts of the spec, from the floating action button's surface transforms to the tab bar's More menu, were written down, drawn, and never built anywhere. The archive's changelog ends in September 2017, so what was missing stayed missing.

This edition completes it. `@paper/md1` takes the archived guidelines at [m1.material.io](https://m1.material.io/) as a fixed spec and renders them on Vuetify0, where v0 supplies behavior and accessibility and Material Design 1 supplies everything you see. Vuetify is the brand and Material Design 1 the subject: Material Design is Google's design language, and this is Vuetify's implementation of its 2014 to 2017 guidelines. It is not a Google product and carries no Google marks.

## The authority order

Every value in the package comes from one of three places, in this order:

1. **m1.material.io**, wherever it is explicit. A value the guidelines state, or draw at a measurable size, is never overridden.
2. **Vuetify 1.5.24's styling**, where the guidelines are silent. Vuetify 1.5 is the Vuetify line built on Material Design 1, so its hover overlays, radii and delays are the closest thing to a ruling the spec never made. Only its styling is taken, never its API: every prop name is the guidelines' own word.
3. **Our own call**, where neither says anything.

The footnotes across these pages mark the second and third tiers. A footnote that begins "Vuetify 1.5.24" names the stylesheet and lines the value comes from, relative to `packages/vuetify/src`; one that begins "Our call" gives the reason for a decision. A value with no footnote is the guidelines' own.

## Coverage

As of October 25, 2026.

### Pages

The archive has 82 pages. Six are Resources (downloads) and two are Platforms (Android guidance), which leaves 74 pages of guidelines. 64 of them have a home in this edition: a component, a token set, or a docs page with live examples. The other 10 are introductions, the archive's changelog, or surfaces a browser does not have: the Material design introduction, environment and What's new pages, the Growth introduction and gesture education, split screen, widgets, gestures, notifications and fingerprint.

### Figures

Every figure on those pages, image or video, was listed and sorted as an example, a Do, a Don't, a spec diagram, motion, a platform surface or a photograph.

| Figures | Count |
|---|---|
| Shipped: a docs example renders it | 1,304 |
| Partial: an example exists and misses a named part | 28 |
| Not built yet | 11 |
| Not representable on the web | 358 |
| Don't figures, never built | 228 |
| **Total** | **1,929** |

That is 1,304 of the 1,343 figures a browser can show, about 97%. The 39 open figures fall into three groups:

- **Swipe gestures (7):** dismissing a sheet or a card by swiping, list leave-behinds, and pulling to refresh. Each has a button, keyboard or scrim path instead, and the browser owns the pull.
- **Package decisions still open (7):** the text field's 80 and 88 dp tile heights, staggered image-loading phases, the tablet edge rule for feature discovery, and the focused chip inside a field.
- **Compositions not drawn yet (25):** among them the six whiteframe apps on the structure page, column and card toolbars, tabs in landscape, magnetic joining, and the offline principle illustrations.

The 358 that cannot be shown are platform surfaces such as the Android and iOS system UI, browser chrome and home-screen widgets (146); product icons, illustration and artwork (104); glyph-drawing guidance for a glyph set fixed upstream (42); touch gestures the browser or the OS owns (29); photo art direction (16); information-architecture diagrams (13); and eight others, such as screen-density hardware and simulated vision.

Method: the figure lists were taken from the live archive on October 25, 2026. A figure counts as shipped when an example renders it. Every figure marked partial or missing in the first pass was checked again against the example files by name and by search, after the day's work; none was judged by rendering. Treat the counts as accurate to within a few figures.

## Never shipped before

What this edition implements that Vuetify 1.x never had, checked against the Vuetify 1.5.24 source:

- **Surface transforms.** `useMorph` turns the floating action button into a sheet, a toolbar or a full-screen dialog with the guidelines' radial and rectangular clips, and expands a card into its detail with a shared image. Vuetify 1.5 had fade, scale, slide and expand transitions, and no surface ever changed shape.
- **The tab bar's More menu.** Desktop tabs that do not fit collect into a More dropdown; Vuetify 1.5's tabs scroll behind arrows.
- **List reorder.** A drag handle that also moves rows with the arrow keys and announces each move.
- **Feature discovery.** The circular prompt that introduces a new action.
- **Mobile steppers.** The dots, progress bar and text forms; Vuetify 1.5 hides the step labels on small screens instead.
- **The contextual header** that replaces a data table's header while rows are selected.
- **Speed-dial labels**, and **touch tooltips** shown by press and hold.
- **The error icon** before a text field's error message.
- **A mirror table for directional glyphs** in right-to-left layouts, open to your own glyphs. Vuetify 1.5 swaps only the chevrons of its pagination and date picker.
- **The guidelines' other chapters.** Writing, imagery, bidirectionality, accessibility and data formats each have their own page, with their figures drawn in live components. Vuetify 1.x documented its components and its framework features; these chapters never had a home.

::: ds-example
/systems/md1/fab/sheet

### The FAB becomes a sheet

A surface transform from the motion pages: the button's circle travels on an arc to the card's centre and opens into it, and closes back into the button.
:::

::: ds-example
/systems/md1/tabs/more

### Tabs with a More menu

With a mouse, the tabs that do not fit the bar leave it and are listed in a More dropdown at its end; choosing one moves the indicator under the control.
:::

## Known limits

What the edition does not do, and why, is listed in one place: the [known limitations](https://github.com/vuetifyjs/0/blob/master/packages/md1/SPEC.md#known-limitations) and open rulings in the package's `SPEC.md`.
