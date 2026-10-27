---
title: Layout - Material Design 1 Grid, Keylines and Breakpoints for Vue
meta:
- name: description
  content: Material Design 1 layout. dp as px, the 8 dp grid and 4 dp baseline, the 16 and 72 dp keylines, 56 and 64 dp increments, 48 dp touch targets and the breakpoint table.
- name: keywords
  content: md1 layout, material design 1 layout, keylines, 8dp grid, baseline grid, increments, touch target, breakpoints, responsive ui, md1Breakpoints, paper md1
features:
  category: Guide
  label: 'Layout'
  level: 1
  group: style
  order: 5
related:
  - /systems/md1
  - /systems/md1/elevation
  - /systems/md1/motion
  - /composables/plugins/use-breakpoints
---

# Layout

<DocsPageFeatures :frontmatter />

Material Design 1 lays every surface on an 8 dp grid, aligns content to two keylines, and sizes bars and panels in increments, with one switch at 600 px between handset and tablet metrics.

<DocsMd1Reference
  href="https://m1.material.io/layout/metrics-keylines.html"
  title="Metrics and keylines"
/>

> [!NOTE]
> Read with [Units and measurements](https://m1.material.io/layout/units-measurements.html) and [Responsive UI](https://m1.material.io/layout/responsive-ui.html).

## Usage

Layout values are custom properties on `:root`: the spacing scale, the two keylines, the increment and the touch target. The keylines and the increment widen from 600 px by media query, so a rule written once with the tokens follows the handset and tablet metrics on its own.

::: ds-example
/systems/md1/layout/keylines
:::

```css
.my-row {
  padding-inline: var(--md1-keyline-content, 72px) var(--md1-keyline-margin, 16px);
}

.my-bar {
  height: var(--md1-increment, 56px);
}
```

## Units

The guidelines measure in density-independent pixels. One dp is one physical pixel on a 160 dpi screen, so a 48 dp target is about 9 mm on any display; sp is the same unit for type, scaled by the reader's font size setting. The units page settles the web case directly: "When writing CSS, use px wherever dp or sp is stated." Every Material Design 1 value is the spec's dp number written as CSS px, 1 to 1, and the browser's device pixel ratio does the density work that the dp formula does on Android.

## Device classes

The guidelines describe three independent axes, and Material Design 1 maps each exactly once:

| Axis | What changes | Material Design 1 mapping |
|------|--------------|-----------------|
| Handset or tablet layout | 16 or 24 dp margins, 72 or 80 dp content keyline, 56 or 64 dp increment and app bar, 280 or 320 dp drawer | `@media (min-width: 600px)` |
| Desktop input | 15 and 13 sp type, resting elevation 2 dp lower, 150 to 200 ms durations, no touch halo on selection controls | `@media (pointer: fine)` |
| Dense | Condensed buttons, lists, text fields, app bars and menus | the `dense` prop on the components whose page names a dense form |

600 px is the responsive-ui page's own split: layouts under 600 dp show one level of content hierarchy, layouts over it show two. `(pointer: fine)` stands in for the guidelines' "mouse and keyboard are the primary input"[^pointer-fine], so a desktop browser at 400 px wide gets handset keylines with desktop type and durations, and a tablet at 1024 px gets tablet keylines with touch metrics.

## Keylines

| Metric | Handset | From 600 px | Token |
|--------|---------|-------------|-------|
| Screen edge margin | 16 dp | 24 dp | `--md1-keyline-margin` |
| Content keyline (text after an icon or avatar) | 72 dp | 80 dp | `--md1-keyline-content` |
| Increment, app bar height | 56 dp | 64 dp | `--md1-increment` |
| Space between content areas | 8 dp | 8 dp | `--md1-spacing-1` |
| Touch target | 48 dp | 48 dp | `--md1-touch-target` |

The keylines are horizontal positions measured from the leading edge. Icons and avatars align to the margin keyline, text that follows them aligns to the content keyline, and content ends at the margin from the trailing edge. Write them with `inset-inline` and `padding-inline`, as the keylines example does, so under `dir="rtl"` every keyline is measured from the right: the mirrored layout the [Bidirectionality](/systems/md1/bidirectionality) page shows.

## Examples

::: ds-example
/systems/md1/layout/paper

### Seams and steps

Material Design 1 lays an app out as sheets of paper. Two sheets that share a whole edge at the same depth form a seam, and a seam binds them: they move together. Two sheets that overlap at different depths form a step, and they move independently, the upper one casting its shadow on the lower. Turn on the switch: the seamed pair rises as one, while the upper sheet of each step rises alone.

A floating action button is a circular sheet of its own. It can straddle a step when it acts on the content that makes the step, as on the third figure, where it rides with the upper sheet; it can straddle a seam when it acts on both sheets. The guidelines rule out a decorative seam added only to anchor an action. `Md1Fab` with `position="seam"` straddles the bottom edge of its positioned host by half its height, at the end keyline.
:::

::: ds-example
/systems/md1/layout/spacing

### The 8 dp grid

Every component aligns to an 8 dp square baseline grid, on handsets, tablets and desktops alike. Iconography in toolbars and type align to a finer 4 dp grid, which is why type leading values (20, 24, 28, 32 sp) are all multiples of 4. The margins and gutters of the responsive grid follow the 8 dp grid too, and the guidelines allow 8, 16, 24 or 40 dp for them.

Material Design 1 ships the grid as `--md1-spacing-1` to `--md1-spacing-5`: 8, 16, 24, 32 and 40 px, one to five steps. The example draws the 8 dp grid behind the scale so each bar ends on a line. Reach for the tokens for padding, gaps and margins, and use a bare multiple of 8 for anything larger. Values that are not on the grid, such as the 20 dp padding under an app bar title, come from a component page and stay literal in that component.
:::

::: ds-example
/systems/md1/layout/baseline

### Baseline grid

Components sit on the 8 dp grid; type and toolbar icons sit on a finer 4 dp baseline grid. A style stays on the grid when its leading is a multiple of 4 and the space above it is too, as Display 1 at 34 sp on 40 and Headline at 24 sp on 32 are. Every line of a paragraph then lands on a grid line, however many lines it wraps to.

The example draws the 4 dp grid behind a type specimen and reads each style's size and leading back from the shipped type utilities, so the labels follow the desktop sizes under a mouse. The sheet's 24 dp padding and the 16 dp between styles are multiples of 4 as well, so the first line of each style starts on a grid line.[^baseline-padding]
:::

::: ds-example
/systems/md1/layout/increments

### Increments

An increment is the height of a standard app bar, used as a unit for sizing other surfaces: 56 dp on handsets and 64 dp on tablets and desktops. `--md1-increment` holds it and switches at 600 px. The guidelines size by increments mostly on desktop, often on tablet and rarely on handsets.

The example builds the guidelines' own cases from the token: an app bar one increment tall, an extended app bar two increments tall, and a right panel five increments wide, which is also the navigation drawer's width rule (5 x 56 = 280 dp on handsets, 5 x 64 = 320 dp on tablets). A card eight increments wide is 448 dp on a handset.
:::

::: ds-example
/systems/md1/layout/vertical-spacing

### Vertical spacing

The keylines fix horizontal positions; vertical rhythm comes from the heights of the blocks themselves. The metrics page redlines three handset screens. A list: a 24 dp status bar, a 56 dp toolbar, a 48 dp subheader and 72 dp two-line list items. A detail view: the toolbar, 72 dp title and list items, a 48 dp subheader and 8 dp between content areas. A navigation drawer: a 48 dp account row and 48 dp items, 8 dp between groups, and a right margin of one app bar height.

The redlines are measured from the rendered components, not typed in, so they read what Material Design 1 actually draws; from 600 dp the toolbar reads 64. The status bar is the platform's and is drawn only so the stack starts where the figure's does.[^status-strip] The drawer's right margin is one increment while the screen is narrow enough: 64 dp from 600 px. On a handset the drawer's other limit, five increments or 280 dp, wins first on a 360 dp screen, so the margin reads 80 dp rather than the figure's 56.[^drawer-margin]
:::

::: ds-example
/systems/md1/layout/ratios

### Ratio keylines

An aspect ratio, width:height, fixes an element's height from its width: height = width / ratio. The guidelines recommend 16:9, 3:2, 4:3, 1:1, 3:4 and 2:3, and apply them two ways. A ratio keyline on the screen width sizes an element that spans the screen, so a 360 dp wide image at 2:3 is 540 dp tall. A ratio keyline on the element width sizes something inside the margins, such as a card's media at 328 dp wide on the same screen.

The example applies the chosen ratio both ways with CSS `aspect-ratio` and reads back the resulting size. `Md1Card.Media` and `Md1GridList` take a `ratio` of their own for the same purpose.
:::

::: ds-example
/systems/md1/layout/touch-targets

### Touch targets

A touch target is at least 48 x 48 dp, about 9 mm, with 8 dp or more between targets. Painted elements are often smaller than their targets: a 24 dp icon and a 40 dp avatar each sit in a 48 dp square, and a 36 dp button has a 48 dp tall target. The dashed outlines in the example are the targets; the painted shapes are what the reader sees.

`--md1-touch-target` is the 48 px. `Md1Button` extends its hit area to it without taking the space in the layout, so a row of 36 dp buttons still lines up on the 8 dp grid, and icon-only buttons and icon toggles are 48 dp outright. The guidelines state no smaller target for a mouse, so treat 48 dp as the minimum under `(pointer: fine)` too.[^mouse-target]
:::

::: ds-example
/systems/md1/layout/windows

### Desktop windows

Desktop keylines and spacing inherit from the tablet and handset rules by window size, not by device. A full-screen window and a wide horizontal one take the tablet keylines: 24 dp margins, an 80 dp content keyline and a 64 dp increment. A narrow vertical window takes the handset ones, 16, 72 and 56 dp, even on a large monitor.

Material Design 1's keyline tokens switch on the viewport's width, which is the window's width in a browser, so a real window needs nothing more. The example draws three nominal windows in one page, so each one sets the keyline and increment tokens on itself for its own width and is scaled down to fit the column.[^nominal-windows]
:::

::: ds-example
/systems/md1/layout/breakpoints

### Breakpoints

The responsive-ui page lists the widths layouts should adapt at, 480, 600, 840, 960, 1280, 1440 and 1600 dp, inside a 13-row breakpoint system that adds the device names, the window class, the column count and the gutter. Desktop rows, 1024 and up, sit 16 dp below their listed width to leave room for browser chrome, so the 1280 row starts at 1264. The example highlights the row this window falls in.

Breakpoints cannot be custom properties, because media queries do not read them. Material Design 1 ships the table on this page and `md1Breakpoints`, a map from each nominal width to its effective one: 480, 600, 840, 960, 1264 (1280), 1424 (1440), 1584 (1600) and 1904 (1920). Vuetify0's `useBreakpoints` has its own named breakpoints and takes nothing from Material Design 1. When a layout needs the spec's widths, map them onto those names yourself:

```ts main.ts
import { createBreakpointsPlugin } from '@vuetify/v0'
import { md1Breakpoints } from '@paper/md1'

app.use(createBreakpointsPlugin({
  mobileBreakpoint: md1Breakpoints[600],
  breakpoints: {
    xs: 0,
    sm: md1Breakpoints[600],
    md: md1Breakpoints[960],
    lg: md1Breakpoints[1280],
    xl: md1Breakpoints[1440],
    xxl: md1Breakpoints[1920],
  },
}))
```

Which width becomes which name is the app's decision; the guidelines name windows (xsmall to xlarge), not these keys. The gutter column is documented only: 16 dp below 600, 24 dp from 960, and 16 or 24 dp in between depending on whether the device's smallest width is under 600. No component reads it, so it is not a token.
:::

::: ds-example
/systems/md1/layout/devices

### Handset, tablet and desktop

The two media queries from Device classes, read live. Narrow the window past 600 px and the keyline and increment values change; open the page on a phone or a tablet and the pointer row changes. The values listed are the ones the tokens hold in this window.

The split is by viewport, not by the size of the element, so an example on this page shows the keylines of the whole window rather than of its own box. A component that must fit its container rather than the screen, such as a card in a narrow column, keeps its own metrics; the keylines are for screen-level layout.
:::

::: ds-example
/systems/md1/layout/grid

### Column grid

The responsive-ui page lays content on a column grid: 4 columns under 600 dp, 8 from 600 dp and 12 from 840 dp, the Columns column of the breakpoint table. Gutters are 16 dp under 600 dp and 24 dp from 960 dp; between the two they are 16 dp on a device whose smallest width is under 600 dp (a handset turned sideways) and 24 dp otherwise. The example stands the window's shorter side in for the device's.[^shorter-side] Margins and gutters come from the same set, 8, 16, 24 or 40 dp, and need not be equal; the page illustrates 8/8, 16/16, 24/24, 40/40 and 40 dp margins with 24 dp gutters. The example pairs equal margins and gutters, and the caption reads back what the media queries chose.

Content spans whole columns. Here the two cards stack on 4 columns and sit side by side, 5 and 3, then 8 and 4, as the count grows. The page names two kinds of grid. A full-width grid has fluid columns, and the breakpoints decide when the layout changes, as in the example. A centred grid has fixed columns, and the layout reflows when the columns plus a margin no longer fit. The [centred grid list](/systems/md1/grid-list#centred-grid-list) applies it to tiles.

Material Design 1 ships no grid classes or column tokens: no component reads them, and `style.css` ships only the type and elevation utilities. Write the grid with CSS Grid in the app, as the example does: `grid-template-columns: repeat(N, minmax(0, 1fr))` with `column-gap` set to the gutter, under media queries at the spec's widths, or under `useBreakpoints` names mapped from `md1Breakpoints`.
:::

::: ds-example
/systems/md1/layout/divide

### Responsive patterns

Under 600 dp a layout shows one level of hierarchy, a summary or a detail; over 600 dp it shows two, the summary and the detail together. The example divides one sheet into a list and the open message from 600 px. Under that width it shows the list, then the message alone with a back arrow. Over 1600 dp a layout grows to a maximum width, then centres with wider margins, stays aligned to the start while the end margin grows, or keeps growing and shows more content.

The page names six patterns for adapting a layout as the window changes. Each maps onto shipped components:

| Pattern | What changes | With Material Design 1 |
|---------|--------------|------------------------|
| Reveal | Hidden UI appears, such as a side nav, or a simple UI reveals more options | `Md1NavigationDrawer` going from `temporary` to `persistent` or `permanent` at a breakpoint |
| Transform | One element becomes another: side navigation becomes tabs, a list becomes a grid list, menu items become toolbar icons | `Md1NavigationDrawer` and `Md1Tabs`, `Md1List` and `Md1GridList`, `Md1Menu` items and `Md1Toolbar.Actions`, swapped by breakpoint |
| Divide | Stacked views divide to fill one view: side nav, list and detail | List and detail side by side, as in the example |
| Reflow | Elements rearrange: single-column content reflows into the content area, horizontal tabs reflow into a vertical list | The column grid above, with content that spans more or fewer columns |
| Expand | Elements grow into new space: cards fill it, dialogs grow proportionally or in increments | `Md1Card` spanning more columns; an `Md1Dialog` sizes to its content, so growing it in increments is the app's width rule |
| Position | Elements move: a bottom sheet becomes a menu, a FAB moves somewhere more visible | `Md1BottomSheet` on a handset and `Md1Menu` on desktop; `Md1Fab` `position` |

The page also names how surfaces behave. A surface's visibility is permanent (always shown when there is room), persistent (toggled, and left alone by other interaction) or temporary (toggled, and hidden by other interaction), the three `Md1NavigationDrawer` types. Its width is fixed, fluid or sticky (fixed until a panel or a breakpoint changes it). A panel that appears either squeezes the content, pushes it sideways, or overlays it. A permanent panel sits outside the grid and squeezes the content. A persistent panel squeezes both the content and the grid. A temporary panel leaves the grid alone and pushes or overlays the content while it is open.
:::

::: ds-example
/systems/md1/layout/reveal

### Reveal

A simple UI reveals more powerful options as space grows, and content that a handset hides behind a tap is shown by default once there is room for it. Under 600 dp the example keeps its navigation behind the menu icon and its photo details behind a Details button; from 600 dp the side navigation is revealed beside the content and the details show without a tap.

The switch above the frame sets its width. The layout reads the frame's own width with `useElementSize`, not the window's, so the pattern can be tried at any viewport[^frame-width]; on a handset every setting is narrower than 600 dp and the frame stays in its handset form. In an app, read the window with `useBreakpoints` or a media query instead.

The toolbar shows a transform in the same frame: on a handset, Share, Edit and Delete live in the overflow menu, and from 600 dp they become icons in the toolbar.
:::

::: ds-example
/systems/md1/layout/transform

### Transform

One element can become another as the window widens. Here side navigation behind the handset's menu icon becomes tabs across a wider bar, and a two-line list of albums becomes a grid list once the width holds several columns of artwork. The content and the destinations are the same in both forms; only the component that presents them changes.

Swap components on the same width signal rather than restyling one into the other: `Md1List` and `Md1GridList` have different keyboard models and different accessible roles, and each is right for its own form.
:::

::: ds-example
/systems/md1/layout/divide-panels

### Divide into panels

Views that stack on a handset divide to fill one view as space grows. At 360 dp the example shows the list alone; at 720 dp the list and the open message divide the view; at 1280 dp the side navigation, the list, the message and a right panel about the sender all share it. Each pane is a fixed five increments except the message, which takes what is left, and a 1 dp divider stands between neighbours.[^three-panes]

The frame is laid out at the chosen window width and scaled down to fit the column, so the desktop form can be read at any viewport. The scale is a docs device; an app lays the panes out against the real window.[^css-zoom]
:::

::: ds-example
/systems/md1/layout/divide-tabs

### Divide tabbed siblings

Tabs hold sibling content that a handset cannot show at once. When the window can, the siblings divide into columns of the same view and the tabs go away. The trip's flight, hotel and car are tabs under 600 dp and three columns from 600 dp, each column headed by the label its tab carried.
:::

::: ds-example
/systems/md1/layout/reflow

### Reflow

Reflow rearranges elements without replacing them. The handset's horizontal tabs reflow into a vertical list at the start of a wider window, with the content beside it, and inside the card the image stacks above the text on a handset and sits beside it once the ratio leaves room. The selection survives the reflow because both forms bind the same model.
:::

::: ds-example
/systems/md1/layout/expand

### Expand

Elements can grow into new space. Cards expand to fill it, as the cards in the column grid example span more columns as the count grows. Dialogs expand proportionally with their content or in fixed steps; this one steps in whole increments, as many as fit with a 24 dp margin each side, between four and eight.[^dialog-steps] On a handset that is five 56 dp increments, the 280 dp of a simple dialog; on a wider window it steps up 64 dp at a time.

`Md1Dialog` sizes itself to its content and takes no width prop, so an increment rule like this one is the app's: set the width on the dialog's content as a multiple of `--md1-increment`.
:::

::: ds-example
/systems/md1/layout/position

### Position

Elements can move to a better place as the window changes. Under 600 dp the share actions open in a bottom sheet from the screen's lower edge, where a thumb reaches them; from 600 dp the same actions open in a menu beside the button that called them. The FAB moves too: on a handset it floats at the bottom end of the screen, and on a wider window it sits on the seam of the extended bar, beside the title of the place it adds to.[^fab-seam]

Both moves swap components on one width signal, so the actions and their handlers are written once.
:::

::: ds-example
/systems/md1/layout/panels

### Panels and the grid

A panel that appears changes the grid in one of three ways, set by its behaviour. A permanent panel is always shown and sits outside the grid, so the grid is laid out on what is left. A persistent panel is toggled and, while open, squeezes both the content and the grid: the columns re-divide the narrower width, and the count can drop from 12 to 8 or 8 to 4. A temporary panel leaves the grid alone and floats over the content at 16 dp, here over a scrim that closes it.

The column guides are the grid; the caption reads back the count and the width the grid has. The panel is five increments wide, the side nav width rule, and slides on the standard curve over `--md1-duration-standard`. A temporary panel may push the content sideways instead of covering it; either way the grid underneath does not change.
:::

::: ds-example
/systems/md1/layout/regions

### Structure and regions

The structure page divides every screen into the same regions, arranged per device. On mobile a permanent app bar sits over the content area, a FAB floats above it, and an optional bottom bar holds overflow actions; the side nav and the right nav overlay everything and are hidden until called. On a tablet the app bar absorbs the bottom bar's actions and the right nav can be pinned beside the content canvas. On desktop the app bar spans the window, the side nav and the right nav are pinned, and each column gets a toolbar of its own: column-width toolbars at a second level of hierarchy below the app bar.

The example is built from the components, not drawn: `Md1Toolbar` for the app bar, the bottom bar and the column toolbars (`dense` at the second level[^dense-columns]), `Md1List` in the navs, cards in the canvas and `Md1Fab` at the end keyline. Label regions outlines each region with the name the guidelines give it. The frame is laid out at the device's size and scaled to fit the column.[^css-zoom]
:::

::: ds-example
/systems/md1/layout/app-bars

### App bar colour and extended metrics

Every icon in an app bar takes one colour. The title may take a different one when the bar needs more hierarchy, which works on a bar light enough for black glyphs and dark enough for white ones: here a Light Blue 600 bar with a white title and icons in 54% black.[^light-blue] `Md1Toolbar` paints the bar from `--md1-primary` and the icons from `--md1-on-primary`, so both colours are set from the outside on the bar's own element, not through props.

An extended app bar is the default height plus content increments. The structure page's example stacks a 56 dp action area, an 80 dp title area with 8 dp below it, and a 72 dp description area with 16 dp below it, each area holding a field on the content keyline. The redlines mark the five heights. The bar's fields take the dark theme by setting `data-theme="md1-dark"` on the bar, the same way a dark region is themed anywhere in a light page.
:::

::: ds-example
/systems/md1/layout/edges

### Breaking an edge

A region's edge can be broken by a card or a FAB rather than by another divider. Here a flexible app bar two increments tall holds only navigation, and the content card starts one increment down, inside the bar, and runs past its bottom edge. The card carries a toolbar of its own, the card toolbar: its title and the actions that apply to its content, separated from the list by a divider.

Breaking the edge keeps the screen to two regions, the bar and the content, where a third strip of toolbar would have sliced it up. The card's inset is the content keyline on each side from 600 px and 8 dp on a handset.[^card-inset]
:::

## Tokens

| Token | Value | From 600 px |
|-------|-------|-------------|
| `--md1-spacing-1` to `--md1-spacing-5` | 8, 16, 24, 32, 40px | same |
| `--md1-keyline-margin` | 16px | 24px |
| `--md1-keyline-content` | 72px | 80px |
| `--md1-increment` | 56px | 64px |
| `--md1-touch-target` | 48px | same |
| `--md1-radius`, `--md1-radius-box` | 2px, 4px | same |
| `--md1-icon-size`, `--md1-icon-size-dense` | 24px, 20px | same |
| `--md1-avatar-size` | 40px | same |

`spacing`, `layout`, `layoutTablet` and `md1Breakpoints` are exported from `@paper/md1` with the same values for code that lays out outside CSS.

## Accessibility

The 48 dp target is an accessibility rule as much as a layout one: the guidelines recommend 7 to 10 mm for anything a finger presses, and keep 8 dp between targets so a press lands on the intended one. Keep related controls close (a slider beside its value), let focus order follow the visual layout from top to bottom and from most to least important, and lay content out so it survives scaled text and spacious settings. A layout built on the tokens with logical properties mirrors under `dir="rtl"` without a second set of rules.

[^pointer-fine]: Our call: `(pointer: fine)` is the closest CSS test for "mouse and keyboard are the primary input".

[^baseline-padding]: Our call: the figure gives no sheet padding; 24 and 16 dp are the nearest multiples of 4 that read as a specimen.

[^status-strip]: Our call: the strip is drawn in the primary's 700, the colour an Android status bar takes over a primary app bar.

[^drawer-margin]: Our call: the drawer keeps its five-increment cap, so the handset figure's 56 dp margin is not reproduced.

[^mouse-target]: Our call: the page gives no desktop target size, so the touch minimum stands.

[^nominal-windows]: Our call: the 1280 x 800, 960 x 540 and 400 x 640 windows are the example's; the page gives the rule, not sizes.

[^shorter-side]: Our call: a browser cannot read the device's smallest width, so the window's shorter side stands in for it.

[^frame-width]: Our call: the docs viewport is fixed, so the frame's width stands in for the window's.

[^three-panes]: Our call: the page shows side nav, list and detail on desktop without metrics; three panes from 960 dp, five-increment panes and 1 dp dividers are ours.

[^css-zoom]: Our call: the frame is laid out at its nominal size and scaled with CSS `zoom`, an approximation that lets a desktop layout fit the docs column.

[^dialog-steps]: Our call: the page says dialogs may grow in increments; the 24 dp margin and the four-to-eight clamp are ours.

[^fab-seam]: Our call: the page says only that the FAB moves somewhere more visible; the seam of the extended bar is ours.

[^dense-columns]: Our call: the page gives column toolbars no metrics; `dense` marks the lower level of hierarchy.

[^light-blue]: Our call: the figure shows a light blue bar; Light Blue 600 is the swatch we read it as.

[^card-inset]: Our call: the figure shows a centred inset card without metrics; the content keyline is the nearest token.
