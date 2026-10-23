---
title: Layout - Quantum Material Design 1 Grid, Keylines and Breakpoints for Vue
meta:
- name: description
  content: Material Design 1 layout in Quantum. dp as px, the 8 dp grid and 4 dp baseline, the 16 and 72 dp keylines, 56 and 64 dp increments, 48 dp touch targets and the breakpoint table.
- name: keywords
  content: quantum layout, material design 1 layout, keylines, 8dp grid, baseline grid, increments, touch target, breakpoints, responsive ui, quantumBreakpoints, paper quantum
features:
  category: Guide
  label: 'Layout'
  level: 1
  group: style
  order: 5
related:
  - /systems/quantum
  - /systems/quantum/elevation
  - /systems/quantum/motion
  - /composables/plugins/use-breakpoints
---

# Layout

<DocsPageFeatures :frontmatter />

Quantum lays every surface on an 8 dp grid, aligns content to two keylines, and sizes bars and panels in increments, with one switch at 600 px between handset and tablet metrics.

> [!NOTE]
> Reference: [Metrics and keylines, Material Design 1 guidelines](http://web.archive.org/web/20181225002221/https://material.io/archive/guidelines/layout/metrics-keylines.html), the archived page Quantum is pinned to, with [Units and measurements](https://web.archive.org/web/20210308145521/https://material.io/archive/guidelines/layout/units-measurements.html) and [Responsive UI](http://web.archive.org/web/20181225002227/https://material.io/archive/guidelines/layout/responsive-ui.html). This page is the Vue.

## Usage

Layout values are custom properties on `:root`: the spacing scale, the two keylines, the increment and the touch target. The keylines and the increment widen from 600 px by media query, so a rule written once with the tokens follows the handset and tablet metrics on its own.

::: ds-example
/systems/quantum/layout/keylines
:::

```css
.my-row {
  padding-inline: var(--quantum-keyline-content, 72px) var(--quantum-keyline-margin, 16px);
}

.my-bar {
  height: var(--quantum-increment, 56px);
}
```

## Units

The guidelines measure in density-independent pixels. One dp is one physical pixel on a 160 dpi screen, so a 48 dp target is about 9 mm on any display; sp is the same unit for type, scaled by the reader's font size setting. The units page settles the web case directly: "When writing CSS, use px wherever dp or sp is stated." Every Quantum value is the spec's dp number written as CSS px, 1 to 1, and the browser's device pixel ratio does the density work that the dp formula does on Android.

## Device classes

The guidelines describe three independent axes, and Quantum maps each exactly once:

| Axis | What changes | Quantum mapping |
|------|--------------|-----------------|
| Handset or tablet layout | 16 or 24 dp margins, 72 or 80 dp content keyline, 56 or 64 dp increment and app bar, 280 or 320 dp drawer | `@media (min-width: 600px)` |
| Desktop input | 15 and 13 sp type, resting elevation 2 dp lower, 150 to 200 ms durations, no touch halo on selection controls | `@media (pointer: fine)` |
| Dense | Condensed buttons, lists, text fields, app bars and menus | the `dense` prop on the components whose page names a dense form |

600 px is the responsive-ui page's own split: layouts under 600 dp show one level of content hierarchy, layouts over it show two. `(pointer: fine)` stands in for the guidelines' "mouse and keyboard are the primary input", so a desktop browser at 400 px wide gets handset keylines with desktop type and durations, and a tablet at 1024 px gets tablet keylines with touch metrics.

## Keylines

| Metric | Handset | From 600 px | Token |
|--------|---------|-------------|-------|
| Screen edge margin | 16 dp | 24 dp | `--quantum-keyline-margin` |
| Content keyline (text after an icon or avatar) | 72 dp | 80 dp | `--quantum-keyline-content` |
| Increment, app bar height | 56 dp | 64 dp | `--quantum-increment` |
| Space between content areas | 8 dp | 8 dp | `--quantum-spacing-1` |
| Touch target | 48 dp | 48 dp | `--quantum-touch-target` |

The keylines are horizontal positions measured from the leading edge. Icons and avatars align to the margin keyline, text that follows them aligns to the content keyline, and content ends at the margin from the trailing edge. Write them with `inset-inline` and `padding-inline`, as the keylines example does, so under `dir="rtl"` every keyline is measured from the right: the mirrored layout the bidirectionality page requires.

## Examples

::: ds-example
/systems/quantum/layout/spacing

### The 8 dp grid

Every component aligns to an 8 dp square baseline grid, on handsets, tablets and desktops alike. Iconography in toolbars and type align to a finer 4 dp grid, which is why type leading values (20, 24, 28, 32 sp) are all multiples of 4. The margins and gutters of the responsive grid follow the 8 dp grid too, and the guidelines allow 8, 16, 24 or 40 dp for them.

Quantum ships the grid as `--quantum-spacing-1` to `--quantum-spacing-5`: 8, 16, 24, 32 and 40 px, one to five steps. The example draws the 8 dp grid behind the scale so each bar ends on a line. Reach for the tokens for padding, gaps and margins, and use a bare multiple of 8 for anything larger. Values that are not on the grid, such as the 20 dp padding under an app bar title, come from a component page and stay literal in that component.
:::

::: ds-example
/systems/quantum/layout/increments

### Increments

An increment is the height of a standard app bar, used as a unit for sizing other surfaces: 56 dp on handsets and 64 dp on tablets and desktops. `--quantum-increment` holds it and switches at 600 px. The guidelines size by increments mostly on desktop, often on tablet and rarely on handsets.

The example builds the guidelines' own cases from the token: an app bar one increment tall, an extended app bar two increments tall, and a right panel five increments wide, which is also the navigation drawer's width rule (5 x 56 = 280 dp on handsets, 5 x 64 = 320 dp on tablets). A card eight increments wide is 448 dp on a handset.
:::

::: ds-example
/systems/quantum/layout/touch-targets

### Touch targets

A touch target is at least 48 x 48 dp, about 9 mm, with 8 dp or more between targets. Painted elements are often smaller than their targets: a 24 dp icon and a 40 dp avatar each sit in a 48 dp square, and a 36 dp button has a 48 dp tall target. The dashed outlines in the example are the targets; the painted shapes are what the reader sees.

`--quantum-touch-target` is the 48 px. `QuButton` extends its hit area to it without taking the space in the layout, so a row of 36 dp buttons still lines up on the 8 dp grid, and icon-only buttons and icon toggles are 48 dp outright. The guidelines state no smaller target for a mouse, so treat 48 dp as the minimum under `(pointer: fine)` too.
:::

::: ds-example
/systems/quantum/layout/breakpoints

### Breakpoints

The responsive-ui page lists the widths layouts should adapt at, 480, 600, 840, 960, 1280, 1440 and 1600 dp, inside a 13-row breakpoint system that adds the device names, the window class, the column count and the gutter. Desktop rows, 1024 and up, sit 16 dp below their listed width to leave room for browser chrome, so the 1280 row starts at 1264. The example highlights the row this window falls in.

Breakpoints cannot be custom properties, because media queries do not read them. Quantum ships the table on this page and `quantumBreakpoints`, a map from each nominal width to its effective one: 480, 600, 840, 960, 1264 (1280), 1424 (1440), 1584 (1600) and 1904 (1920). Vuetify0's `useBreakpoints` has its own named breakpoints and takes nothing from Quantum. When a layout needs the spec's widths, map them onto those names yourself:

```ts main.ts
import { createBreakpointsPlugin } from '@vuetify/v0'
import { quantumBreakpoints } from '@paper/quantum'

app.use(createBreakpointsPlugin({
  mobileBreakpoint: quantumBreakpoints[600],
  breakpoints: {
    xs: 0,
    sm: quantumBreakpoints[600],
    md: quantumBreakpoints[960],
    lg: quantumBreakpoints[1280],
    xl: quantumBreakpoints[1440],
    xxl: quantumBreakpoints[1920],
  },
}))
```

Which width becomes which name is the app's decision; the guidelines name windows (xsmall to xlarge), not these keys. The gutter column is documented only: 16 dp below 600, 24 dp from 960, and 16 or 24 dp in between depending on whether the device's smallest width is under 600. No component reads it, so it is not a token.
:::

::: ds-example
/systems/quantum/layout/devices

### Handset, tablet and desktop

The two media queries from Device classes, read live. Narrow the window past 600 px and the keyline and increment values change; open the page on a phone or a tablet and the pointer row changes. The values listed are the ones the tokens hold in this window.

The split is by viewport, not by the size of the element, so an example on this page shows the keylines of the whole window rather than of its own box. A component that must fit its container rather than the screen, such as a card in a narrow column, keeps its own metrics; the keylines are for screen-level layout.
:::

## Tokens

| Token | Value | From 600 px |
|-------|-------|-------------|
| `--quantum-spacing-1` to `--quantum-spacing-5` | 8, 16, 24, 32, 40px | same |
| `--quantum-keyline-margin` | 16px | 24px |
| `--quantum-keyline-content` | 72px | 80px |
| `--quantum-increment` | 56px | 64px |
| `--quantum-touch-target` | 48px | same |
| `--quantum-radius`, `--quantum-radius-box` | 2px, 4px | same |
| `--quantum-icon-size`, `--quantum-icon-size-dense` | 24px, 20px | same |
| `--quantum-avatar-size` | 40px | same |

`spacing`, `layout`, `layoutTablet` and `quantumBreakpoints` are exported from `@paper/quantum` with the same values for code that lays out outside CSS.

## Accessibility

The 48 dp target is an accessibility rule as much as a layout one: the guidelines recommend 7 to 10 mm for anything a finger presses, and keep 8 dp between targets so a press lands on the intended one. Keep related controls close (a slider beside its value), let focus order follow the visual layout from top to bottom and from most to least important, and lay content out so it survives scaled text and spacious settings. A layout built on the tokens with logical properties mirrors under `dir="rtl"` without a second set of rules.
