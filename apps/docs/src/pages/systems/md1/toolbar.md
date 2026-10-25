---
title: Md1Toolbar - Material Design 1 Toolbar and App Bar for Vue
meta:
- name: description
  content: The Material Design 1 toolbar and app bar with nav icon, title and actions, dense and prominent heights, tabs, flexible space, scroll behaviors, expandable search and selection mode. Built on Vuetify0.
- name: keywords
  content: md1 toolbar, material design 1 app bar, app bar, toolbar, flexible space, scrolling techniques, expandable search, contextual action bar, vue toolbar, vuetify0, paper md1
features:
  category: Component
  label: 'C: Md1Toolbar'
  level: 2
  renderless: false
  group: navigation
  order: 1
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/tabs
  - /systems/md1/menu
  - /components/primitives/atom
  - /components/forms/combobox
  - /composables/system/use-roving-focus
---

# Md1Toolbar

<DocsPageFeatures :frontmatter />

The Material Design 1 toolbar and app bar. A sheet one step above the content it acts on, with the navigation control, the title and the action icons in one row, and an extension for tabs, a large title or an image.

> [!NOTE]
> Reference: [Toolbars, Material Design 1 guidelines](https://m1.material.io/components/toolbars.html), the archived page Material Design 1 is pinned to, read with [Layout structure](https://m1.material.io/layout/structure.html) for the app bar metrics, [Scrolling techniques](https://m1.material.io/patterns/scrolling-techniques.html), [Search](https://m1.material.io/patterns/search.html) and [Selection](https://m1.material.io/patterns/selection.html). This page is the Vue.

## Usage

`Md1Toolbar` is a compound. The root is the sheet; its parts are the regions the structure page names. Set `appBar` for the app bar: a `header` banner landmark fixed to the top of the viewport, primary by default, with the scroll behaviors switched on. Without it, the toolbar is a plain sheet you place yourself, a column toolbar or a card toolbar.

::: ds-example
/systems/md1/toolbar/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Toolbar } from '@paper/md1'
</script>

<template>
  <Md1Toolbar>
    <Md1Toolbar.Nav />

    <Md1Toolbar.Title />

    <Md1Toolbar.Actions />

    <Md1Toolbar.Search />

    <Md1Toolbar.Contextual />

    <Md1Toolbar.Extension />
  </Md1Toolbar>
</template>
```

## Composed on Vuetify0

The toolbar is presentational: the root renders v0's [Atom](/components/primitives/atom) as a `div`, or a `header` for an app bar, and draws the row and the extension inside it. Whatever order the parts arrive in, the extension renders after the row.

`Md1Toolbar.Nav` is a v0 [Button](/components/actions/button) root with a [Md1Ripple](/systems/md1/ripple) first and its glyph drawn through [Md1Icon](/systems/md1/icon). `Md1Toolbar.Actions` is a `role="toolbar"` that roves focus over its children with [useRovingFocus](/composables/system/use-roving-focus): your `Md1Button`s stay your components, and the toolbar only manages their tab order. `Md1Toolbar.Search` runs on v0's [Combobox](/components/forms/combobox) parts through `useSearch`, the search core Material Design 1 shares with `Md1SearchBar`.

The root publishes `data-variant`, `data-position`, `data-scroll`, `data-app-bar`, `data-dense`, `data-prominent`, `data-floating`, `data-contextual` and `data-search` from its props and parts, and `data-scrolled`, `data-hidden` and `data-collapsed` from the scroll state. `Md1Toolbar.Nav` carries `data-icon`, the glyph it currently shows. The extension marks what it holds with `data-tabs`, `data-title`, `data-image` or `data-related`.

## Examples

::: ds-example
/systems/md1/toolbar/variants

### Surface, primary and transparent

The structure page names four app bar colors: light, dark, colored and transparent. Light and dark are one variant here, `surface`, because the theme decides them:[^surface] the app-bar role is Grey 100 on the light theme and Grey 900 on the dark one, with 87% black or 100% white text and icons at 54% black or 100% white. `primary` is the colored bar, the primary 500 with white text and icons at 100%, the color page's rule for large areas. `transparent` drops the fill and the shadow, for a bar over an image or a sheet that already supplies the color.

An app bar defaults to `primary`, because every app bar figure on the toolbars page is primary and the color page gives large areas the primary color. A plain toolbar defaults to `surface`. Every icon in one bar shares one color, the page's own rule, so `Md1Button` icon children lose their accent ink inside a toolbar and take the bar's.
:::

::: ds-example
/systems/md1/toolbar/heights

### Standard, dense and prominent

The bar is 56 dp on a handset and 64 dp from 600 px, the increment that sets the vertical keylines; a handset in landscape drops to 48 dp. Icons are 24 dp glyphs in 48 dp targets, the first one on the 16 dp keyline (24 dp from 600 px). The title is the Title style, Medium 20 sp, on the 72 dp content keyline (80 dp from 600 px) and on one line, truncated with an ellipsis.

`dense` is the desktop app bar for mouse and keyboard layouts: 48 dp with 40 dp icon targets. `prominent` is the 128 dp bar of the structure page, the icons in the top increment and the title at the bottom, 20 dp above the edge; dense and prominent together give 96 dp. Both are explicit props rather than a pointer media query, because a desktop app can still want the standard bar.[^props]

The bar rests at 4 dp. Under a fine pointer it rests at 2 dp, the elevation page's rule that desktop surfaces sit 2 dp below the listed values.
:::

::: ds-example
/systems/md1/toolbar/nav

### Navigation icon

The nav icon opens a navigation drawer, navigates up the hierarchy, or is left out. `icon="menu"` is the drawer control; bind `open` to the drawer's model and the menu glyph turns into the back arrow while the drawer is open and back on close, over the standard 300 ms and the standard curve.[^morph] That is the creative-customization page's dual-function icon: the two actions are connected, and one cannot exist while the other is present.

`icon="up"` is the up arrow and `icon="close"` the X a full-screen dialog uses to discard. The accessible name follows the glyph, Menu, Back or Close, and the drawer control also reports `aria-expanded`. Pass `ariaLabel` for a more specific name.
:::

::: ds-example
/systems/md1/toolbar/hide

### Hide on scroll

`scroll="hide"` is the standard app bar's first option: the bar scrolls off with the content and returns when the reader scrolls back. It moves 1:1 with the content, with no threshold, because the scrolling-techniques page has it scroll off with the content; Vuetify 1.5's 300 px threshold contradicts that, so it does not apply.

The bar follows any scroller inside its own parent, the app shell's content region, and the document while it is pinned to the viewport. Scrollers elsewhere on the page and inside the bar, a tab bar or the search suggestions, are ignored. A hidden bar stays in the tab order: focus moving into it brings it back, so a keyboard user never lands on an off-screen control.[^focus]
:::

::: ds-example
/systems/md1/toolbar/cover

### A sheet covering the toolbar

A toolbar sits a step above the sheet its actions affect, and a sheet that scrolls under it is clipped at its edge. A sheet can also be the higher one: here the article sits 2 dp above a prominent toolbar that stays put, and as the article scrolls up it covers the bar instead of passing under it. The toolbar keeps its seam until the sheet has covered it. Nothing passes through either surface; only which one is higher changes.
:::

::: ds-example
/systems/md1/toolbar/tabs

### Tabs in the extension

Place an `Md1Tabs` bar in `Md1Toolbar.Extension` and the toolbar gives it the scrolling-techniques page's three behaviors through `tabBar`. `anchored`, the default, keeps the tab bar at the top while the row scrolls off. `hide` scrolls both off and returns both on reverse scroll. `staggered`, shown here, scrolls both off, returns the tab bar on reverse scroll and the row only at the top of the page.

On a primary bar the tabs take white ink: the selected tab and the indicator in white, the others at 70%. The extension keeps the bar's own fill under them.
:::

::: ds-example
/systems/md1/toolbar/waterfall

### Waterfall

A waterfall toolbar shares a seam with the content and lifts into a step when the content scrolls under it. `scroll="waterfall"` rests at 0 dp at the top of the page and takes the bar's elevation from the first scrolled pixel, with the 280 ms elevation transition.[^trans] It reads best when the page and the bar share one fill, so the seam is invisible until the step appears.

The flexible space with overlapping content is this behavior with an image in the extension, and the guidelines forbid tabs in it; a waterfall bar with an image extension and a tab bar warns in development.
:::

::: ds-example
/systems/md1/toolbar/collapse

### Flexible space

`scroll="collapse"` with an `Md1Toolbar.Title` inside the extension is the flexible space. The extended bar is the default height plus one increment, the large title sits on the content keyline at the bottom of it, and as the content scrolls the space shrinks 1:1 until only the row remains. The title shrinks with it to the Title style's 20 sp and lands in the row; scrolling back to the top grows both into place again.

The guidelines give only the collapsed size, and say the title shrinks to it, so the expanded title must be larger. It is Display 1, 34 sp, a Material Design 1 decision: Vuetify 1.5's title is always 20 px and has no larger state to take. The title keeps the Medium weight throughout so it reads as the same object at every size.[^title]
:::

::: ds-example
/systems/md1/toolbar/image

### Flexible space with an image

Give the extension an `image` and the whole bar takes the aspect ratio `ratio` names, 4:3 by default (the scrolling-techniques page's example), here 16:9. The image runs under the row and the bar drops its own fill, with white text and icons over the picture. As the content scrolls it pushes the image up; once the space has collapsed the image takes the primary tint, a timed fade rather than a scroll-linked one, because the page says the tint arrives "independent of scrolling".

The image is decorative and carries an empty `alt`; the title names the screen.
:::

::: ds-example
/systems/md1/toolbar/search

### Expandable search

Expandable search is for apps where search is not the primary focus: a search icon in the actions opens it, and `Md1Toolbar.Search` replaces the row with a search field. `v-model:open` drives the mode, `v-model` holds the query. The field takes focus when it opens; the up arrow, or Escape once the suggestions are closed, closes search and hands focus back to the control that opened it.

`history` lists recent queries, offered with the history glyph before a query is complete; `suggestions` lists completions from your data, offered with the search glyph while the reader types. Both filter as the reader types. Enter submits the query and choosing a suggestion submits it, each through the `submit` event; the field then keeps the query and gives up focus, so the results show with the search bar visible but unfocused, the search page's rule. The X clears the query and emits `clear`; `voice` adds the microphone, which emits `voice` for your speech handler.

The page states no metrics for the field, so the query is set in Subheading 16 sp and the suggestions are 48 dp list rows with the text on the 72 dp keyline.[^search] For persistent search, where search is the point of the app, use `Md1SearchBar`.
:::

::: ds-example
/systems/md1/toolbar/contextual

### Selection mode

While items are selected the app bar carries the actions that apply to them. Set `contextual` and `Md1Toolbar.Contextual` replaces the row: a close action, the count as "N selected" in the title's place and style, and your actions. Exiting selection mode, by the close action or by Escape anywhere in the bar, emits `clear`; clear your selection in the handler, which also turns `contextual` off.

The selection page names no color for this bar, so it keeps the toolbar's own variant.[^contextual]
:::

::: ds-example
/systems/md1/toolbar/related

### Related content

An extension that holds neither tabs, nor a title, nor an image is related information. Under a primary bar it fills with the lighter primary, the primary 100, with dark ink: the color page's "beneath the region using the primary color, related information is colored with a lighter version of the primary color".
:::

::: ds-example
/systems/md1/toolbar/floating

### Floating toolbar

`floating` is the structure page's floating toolbar and detached toolbar palette: a sheet with its own width, not the column's. The page names it and states no metrics, so Material Design 1 gives it the app bar's heights and Vuetify 1.5's floating toolbar:[^float] the bar's own elevation, square corners and 16 dp clear of what surrounds it. A toolbar with only `Md1Toolbar.Actions` is a palette.
:::

::: ds-example
/systems/md1/toolbar/bottom

### Bottom toolbar

`position="bottom"` fixes the toolbar to the bottom edge, where it clings to the top of the on-screen keyboard through `env(keyboard-inset-height)`. The structure page names the bottom toolbar and its shelf and gives no metrics, so the heights follow the app bar.[^bottom] The shelf it launches is an `Md1BottomSheet` with `persistent`. For top-level destinations use `Md1BottomNavigation` instead.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Toolbar.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appBar` | `boolean` | `false` | The app bar: a `header` banner landmark fixed to the top of the viewport, with the scroll behaviors enabled |
| `variant` | `'surface' \| 'primary' \| 'transparent'` | `'primary'` with `appBar`, else `'surface'` | The theme's app-bar grey, the primary 500 with white ink, or no fill and no shadow |
| `prominent` | `boolean` | `false` | 128 dp (96 dp with `dense`), icons at the top and the title at the bottom |
| `dense` | `boolean` | `false` | 48 dp with 40 dp icon targets: the desktop app bar |
| `scroll` | `'fixed' \| 'hide' \| 'waterfall' \| 'collapse'` | `'fixed'` | How the app bar answers the content scrolling under it. Honoured only with `appBar` |
| `tabBar` | `'anchored' \| 'hide' \| 'staggered'` | `'anchored'` | What an Md1Tabs bar in the extension does while the bar hides |
| `contextual` | `boolean` | `false` | Selection mode: the row gives way to `Md1Toolbar.Contextual` |
| `floating` | `boolean` | `false` | A detached sheet with its own width, square, at the bar's elevation, 16 dp clear of its surroundings |
| `position` | `'top' \| 'bottom'` | `'top'` | `bottom` fixes the toolbar to the bottom edge, above the on-screen keyboard |

The default slot holds the parts. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Toolbar.Nav` | `icon` (`'menu' \| 'up' \| 'close'`, default `'menu'`), `open`, `disabled`, `ariaLabel` | A 48 dp button; emits `click`. With `menu`, `open` morphs the glyph to the back arrow. Named Menu, Back or Close by default |
| `Md1Toolbar.Title` | | Title 20 sp Medium, one line. Inside the extension: Display 1, shrinking to 20 sp in a collapsing space |
| `Md1Toolbar.Actions` | `ariaLabel` | `role="toolbar"` with one tab stop over its children; default name Actions |
| `Md1Toolbar.Search` | `v-model`, `v-model:open`, `placeholder`, `history`, `suggestions`, `voice`, `namespace` | Emits `submit`, `clear` and `voice`. The default slot adds rows to the suggestion list as v0 `Combobox.Item`s |
| `Md1Toolbar.Contextual` | `count` | Renders while the root is `contextual`: close, "N selected" and the default slot. Emits `clear` |
| `Md1Toolbar.Extension` | `image`, `ratio` (default `'4:3'`) | The block under the row: a tab bar, a large title, an image or related content |

## Accessibility

An app bar renders a `header`, the page's banner landmark. A plain toolbar renders a `div` and adds no role of its own: the actions carry the toolbar semantics.

### Naming

`Md1Toolbar.Nav` is named by its glyph, Menu, Back or Close, and the drawer control reports `aria-expanded` from `open`. `Md1Toolbar.Actions` is a `role="toolbar"` named Actions; name it after its content when a screen has more than one. Icon-only `Md1Button` children need their own `ariaLabel`. The search form is a `role="search"` landmark named by its placeholder, and the field is a combobox with the suggestion list as its listbox.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves between the nav icon, the actions toolbar (one stop) and the rest of the page |
| Arrow Left, Arrow Right | Moves between the actions, skipping disabled ones; reversed under `dir="rtl"` |
| Home, End | Moves to the first or last action |
| Enter, Space | Activates the focused control |
| Arrow Down, Arrow Up | In the search field: opens the suggestions and moves through them |
| Enter | In the search field: submits the highlighted suggestion or the typed query |
| Escape | In the search field: closes the suggestions, then search. In selection mode: exits it |

### Focus

The actions remember the last one focused, so tabbing back into the toolbar returns to it. Opening search moves focus to the field; closing it returns focus to the control that opened it. A bar hidden by scrolling comes back as soon as focus moves into it.

### Motion

The nav icon's morph and the image tint are the only timed animations. Under reduced motion the morph is instant; the scroll behaviors follow the scroll position and have no duration of their own.

[^surface]: Our call: the light and dark bars are the theme's app-bar role, so a variant per theme would duplicate the theme switch.

[^props]: Our call: the pages name these forms but do not tie them to an input device.

[^morph]: Our call: the creative-customization page shows the morph without a duration; the standard duration is the motion page's default for on-screen changes.

[^focus]: Our call: the scrolling-techniques page covers touch scrolling only.

[^trans]: Vuetify 1.5.24, stylus/settings/_elevations.styl:89. `elevationTransition` is 280 ms on the standard curve; the spec gives no shadow transition.

[^title]: Our call: the page gives only the collapsed 20 sp, so the expanded title takes Display 1 from the type scale and keeps one weight.

[^search]: Our call: the field and rows borrow the text field's 16 sp input and the list's single-line tile.

[^contextual]: Our call: keeping the variant avoids a colour change the page does not ask for.

[^float]: Vuetify 1.5.24, stylus/components/_toolbar.styl:34,153-156. `.v-toolbar` keeps `elevation(4)`, and `--floating` adds a `$grid-gutters.lg` margin and its own width.

[^bottom]: Our call: the app bar table is the only toolbar height the pages state.
