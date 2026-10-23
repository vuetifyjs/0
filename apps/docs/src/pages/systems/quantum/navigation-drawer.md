---
title: QuNavigationDrawer - Quantum Navigation Drawer for Vue
meta:
- name: description
  content: The Material Design 1 navigation drawer, temporary, persistent, mini and permanent (full height, clipped or floating), with the 16:9 account header and list destinations. Built on Vuetify0's Dialog and Atom.
- name: keywords
  content: quantum navigation drawer, material design 1 navigation drawer, side nav, temporary drawer, persistent drawer, mini variant, permanent drawer, vue navigation drawer, vuetify0 dialog, paper quantum
features:
  category: Component
  label: 'C: QuNavigationDrawer'
  level: 2
  renderless: false
  group: navigation
  order: 2
related:
  - /systems/quantum
  - /systems/quantum/list
  - /systems/quantum/toolbar
  - /systems/quantum/subheader
  - /systems/quantum/divider
  - /components/disclosure/dialog
  - /components/primitives/atom
  - /composables/plugins/use-breakpoints
---

# QuNavigationDrawer

<DocsPageFeatures :frontmatter />

The Material Design 1 navigation drawer. The sheet along the start edge that holds an app's destinations: temporary over a scrim on a handset, persistent beside the content on a tablet, permanent on a desktop.

> [!NOTE]
> Reference: [Navigation drawer, Material Design 1 guidelines](http://web.archive.org/web/20181225002300/https://material.io/archive/guidelines/patterns/navigation-drawer.html), the archived page Quantum is pinned to. Types, widths, keylines, the account header, elevation and ordering. This page is the Vue.

## Usage

`QuNavigationDrawer` is a compound. The root is the drawer and owns `v-model` (open); `Header` is the account area, `Content` holds the destinations as a [QuList](/systems/quantum/list), and `Activator` is an optional trigger rendered beside it. `type` picks one of the pattern page's three drawers; the default is `temporary`, the one the guidelines require on a handset.

::: ds-example
/systems/quantum/navigation-drawer/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuNavigationDrawer } from '@paper/quantum'
</script>

<template>
  <QuNavigationDrawer>
    <QuNavigationDrawer.Activator />

    <QuNavigationDrawer.Header />

    <QuNavigationDrawer.Content />
  </QuNavigationDrawer>
</template>
```

## Composed on Vuetify0

The temporary drawer is v0's [Dialog](/components/disclosure/dialog): `Dialog.Root` owns the open state, `Dialog.Activator` is the trigger, and `Dialog.Content` renders the native `<dialog>` opened with `showModal()`. The browser contains focus, closes on Escape and paints `::backdrop`, which Quantum fills with the scrim. Inside the `<dialog>` the sheet is a `<nav>`. Quantum never mounts v0's `Scrim`: every `Dialog.Content` it renders passes `scrim: false`.

The persistent, mini and permanent drawers are not dialogs, and v0 has no non-modal sheet, so Quantum renders one on v0's [Atom](/components/primitives/atom): a `<nav>` landmark that sits in the layout beside the content. Expanding levels inside the drawer are `QuList.Group`, which is v0's [Collapsible](/components/disclosure/collapsible). Which type a screen size gets is your decision; the [responsive example](#responsive-types) composes v0's [useBreakpoints](/composables/plugins/use-breakpoints) for it.

The root's one slot holds both the trigger and the drawer. Quantum renders the `Activator` children outside the drawer, where a closed `<dialog>` cannot hide them, and everything else inside. That is why `Activator` must be a direct child of the root. When the trigger lives elsewhere, in an app bar, leave `Activator` out and bind `v-model` instead.

## Examples

::: ds-example
/systems/quantum/navigation-drawer/temporary

### Temporary

The temporary drawer opens above all other content at 16 dp, the full height of the screen, with everything behind it darkened by the scrim (`--quantum-scrim`, `#212121` at 46%). The guidelines require it on a handset, recommend it on a tablet and allow it on a desktop. It stays open "until a section is selected": choosing a destination in `Content` closes it after the list has recorded the choice. A `QuList.Group` header only expands its level, so it leaves the drawer open, and a disabled destination does nothing at all. A press on the scrim and Escape dismiss it as well.

The width follows the pattern page's rule: the screen width minus the app bar height, at most five standard increments. That is `min(100vw - 56px, 280px)` under 600 px and `min(100vw - 64px, 320px)` from 600 px, so a 360 px phone gets a 280 dp drawer and a 320 px phone 264 dp, always leaving the app bar's width of scrim to tap. The drawer slides in from its edge in 225 ms on the deceleration curve and leaves in 195 ms on the acceleration curve; where the pointer is a mouse it rests at 14 dp, the elevation page's desktop drop.

Here the trigger is the menu icon of a [QuToolbar](/systems/quantum/toolbar), outside the drawer, so the example binds `v-model` and opens the drawer from the icon's click. The native `<dialog>` hands focus back to the icon when it closes.
:::

::: ds-example
/systems/quantum/navigation-drawer/header

### Account header

`Header` is the account area: a block of the drawer's width at the 16:9 ratio keyline, filled with the primary colour (`--quantum-primary`) or covered by `image`. `avatar` draws a 64 dp circle on the 16 dp keyline, and the 56 dp account row at the bottom carries `name` in Roboto Medium 14 sp and `email` in Roboto Regular 14 sp, both white, as the pattern page sets them. The avatar size is a Quantum decision; the page shows it but gives no number.

The default slot of `Header` lands at the end of the account row, where an account switcher goes. The pictures are decorative (`alt=""`) because the name beside them already identifies the account. On a handset there is no status bar on the web, so the header starts at the top edge without the 24 dp strip the native drawer extends behind.
:::

::: ds-example
/systems/quantum/navigation-drawer/persistent

### Persistent

`type="persistent"` toggles open and closed beside the content, at the same elevation as the content. When it opens it takes its width from the layout, so the content narrows to fit, and when it closes the content takes the room back: 300 ms on the standard curve, the motion page's relative movement. Quantum draws a 1 dp divider seam along its inner edge, a decision where the page states only the elevation. Choosing a destination leaves it open.

A persistent drawer sits in a flex row beside the content and stretches to the row's height, capped at the screen height and kept in view while the page scrolls. Closed, it is `inert`: its destinations leave the tab order with it. The pattern page says the drawer's state is "remembered from action to action and session to session"; that memory is yours, typically v0's [useStorage](/composables/plugins/use-storage) bound to `v-model`. The guidelines advise against a persistent drawer in apps whose hierarchy needs an up arrow.

The menu icon here passes `open` to `QuToolbar.Nav`, which turns the menu glyph into the back arrow while the drawer is open, the creative-customization page's dual-function icon, and sets `aria-expanded`; `aria-controls` names the drawer's `id`, the disclosure wiring `Activator` gives a trigger inside the root.
:::

::: ds-example
/systems/quantum/navigation-drawer/mini

### Mini variant

`mini` is the persistent drawer's alternative rest state: only the icon column shows, and opening expands it to the full drawer. The rail is one standard increment wide, 56 dp under 600 px and 64 dp from 600 px: the 24 dp icon between its 16 dp margins. The pattern page describes the state without a width, so this is a Quantum decision; Vuetify's 80 px was not taken.

At rest the destinations keep their full-width layout and are clipped at the rail's edge rather than reflowed, so nothing jumps when the drawer expands. Subheaders and the account area fade out, and the icons stay focusable and named by their labels. `mini` applies to the persistent drawer only; on another type it warns in development.
:::

::: ds-example
/systems/quantum/navigation-drawer/permanent

### Permanent

`type="permanent"` is always visible, pinned to its edge at the content's elevation, and cannot be closed: `v-model` and `close` are ignored and an `Activator` inside it warns. The guidelines recommend it as the desktop default. This one is the full-height form, for apps focused on information consumption: the drawer spans the screen and the toolbar sits beside it.

The drawer follows the list keylines of the pattern page at every width: icons on the 16 dp keyline at 54% (`--quantum-icon-active`), text on the 72 dp keyline in Roboto Medium 14 sp at 87%, 48 dp rows. The current destination, the item whose `value` matches the list's `v-model`, takes the primary colour for its text and icon, as the pattern page sets it. On the dark theme `QuList` takes the primary's 100 shade instead, a Quantum decision: the page states the selected colour on the light sheet only, and the primary 500 reads at under 2:1 on the dark one, below the 4.5:1 contrast floor. Each list grouping has 8 dp above and below it, which is also the space around a full-bleed `QuDivider` between groupings. Settings and Help go at the bottom of the list, in that order.

`QuList.Group` is the expanding drawer of the navigation page: selecting a collapsed section reveals its level in-line. The whole sheet, header included, scrolls as a view when the destinations outgrow the screen.
:::

::: ds-example
/systems/quantum/navigation-drawer/clipped

### Clipped

`clipped` starts the drawer under the app bar, one increment down (56 dp, 64 dp from 600 px), for productivity apps that need balance across the screen. The app bar spans the full width above both. The drawer's sticky offset and its height cap leave the app bar's height clear; the row it sits in starts below the fixed app bar, as any content under a fixed app bar does.
:::

::: ds-example
/systems/quantum/navigation-drawer/floating

### Floating

`floating` detaches the permanent drawer from the screen edge into a card, for apps that need less hierarchy. It takes the card's sheet: 2 dp corners (`--quantum-radius`), the card's 2 dp resting elevation (0 dp where the pointer is a mouse, the elevation page's desktop rule) and no seam. The 8 dp gap around it is a Quantum decision; the page's figure gives none. `floating` applies to the permanent drawer only.
:::

::: ds-example
/systems/quantum/navigation-drawer/end

### Right nav

`side="end"` puts the drawer on the end edge, the structure page's right nav, whose content is secondary to the page rather than navigation or identity: filters, details, settings for the current view. It mirrors with the start drawer: the temporary one slides in from the end edge, and a persistent or permanent one draws its seam on its start side. Both sides flip under `dir="rtl"`. Name a right nav for what it holds; this one passes `aria-label="Filters"`.
:::

::: ds-example
/systems/quantum/navigation-drawer/responsive

### Responsive types

The pattern page ties each type to a screen size: temporary is required on mobile, persistent is acceptable on anything larger, and permanent is the desktop default. It gives no pixel values, so Quantum ships no automatic switch: `type` is always explicit. This example is the recommended recipe: v0's `useBreakpoints` reports the window width, and the drawer is temporary under 600 px, persistent under 1280 px and permanent above, using the `quantumBreakpoints` table (1280 is 1264 px with the responsive-ui page's 16 px allowance for browser chrome).

Resize the window to watch the drawer change. The example closes the drawer whenever the type changes, so a window narrowed into the handset range never lands on an open drawer over a scrim.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuNavigationDrawer.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Whether the drawer is open (`v-model`). A permanent drawer is always open |
| `type` | `'temporary' \| 'persistent' \| 'permanent'` | `'temporary'` | Temporary: a modal `<dialog>` at 16 dp (14 dp under a fine pointer) over the scrim. Persistent: a `<nav>` beside the content that toggles. Permanent: a `<nav>` that is always open |
| `mini` | `boolean` | `false` | Persistent only. At rest the drawer is a 56 dp (64 dp from 600 px) icon rail that expands on open |
| `clipped` | `boolean` | `false` | Persistent and permanent. Starts one increment down, under the app bar |
| `floating` | `boolean` | `false` | Permanent only. Detaches the drawer into a card: 8 dp clear, 2 dp corners, card elevation, no seam |
| `side` | `'start' \| 'end'` | `'start'` | The edge: `start` is the left nav, `end` the right nav. Both mirror under `dir="rtl"` |
| `ariaLabel` | `string` | | The drawer's accessible name. Defaults to the `Quantum.navigation` locale key, "Navigation" in English |
| `id` | `string` | | The drawer element's id; generated when unset |

The width is the pattern page's: `min(100vw - 56px, 280px)` under 600 px and `min(100vw - 64px, 320px)` from 600 px. Other attributes, such as `class`, land on the drawer element, the `<dialog>` or the `<nav>`. The root's default slot receives `isOpen`, `open`, `close` and `toggle`. The root carries `data-type`, `data-side`, `data-open`, `data-mini`, `data-clipped` and `data-floating`.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `QuNavigationDrawer.Activator` | | Renderless. Spread its `attrs` slot prop onto a `QuButton`. Opens a temporary drawer (`aria-haspopup="dialog"`) or toggles a persistent one (`aria-expanded`, `aria-controls`); inert, with a development warning, on a permanent drawer. Must be a direct child of the root |
| `QuNavigationDrawer.Header` | `name?: string`, `email?: string`, `avatar?: string`, `image?: string` | The 16:9 account area on the primary fill, or on `image`. `avatar` is an image URL for the 64 dp circle. The default slot ends the 56 dp account row |
| `QuNavigationDrawer.Content` | | Holds `QuList`, `QuSubheader` and `QuDivider`. Choosing a destination (a link, or a button that is not a disclosure) closes a temporary drawer |

There are no named slots.

## Accessibility

The temporary drawer is the APG modal dialog pattern on a native `<dialog>`: `role="dialog"`, `aria-modal="true"`, named by `ariaLabel`, with a `<nav>` inside. Focus moves to the first focusable element on open, usually the first destination, and stays in the drawer; the rest of the page is inert while it is open, and focus returns to the trigger on close.

The persistent and permanent drawers are a `navigation` landmark, a `<nav>` named by `ariaLabel`. They move no focus and trap nothing. A closed persistent drawer is `inert`, so its destinations are out of the tab order and the accessibility tree; when it closes with focus inside it, focus returns to the element that held it when the drawer opened, usually the menu icon, rather than dropping to the document. A mini drawer at rest stays operable: its icons are the destinations.

### Naming

Every drawer is named "Navigation" unless you pass `ariaLabel`; give a right nav or a second drawer a name of its own. Destinations are named by their label text, and their icons are `aria-hidden`. The current destination carries `aria-current` from `QuList`. The header pictures are decorative.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | On the activator: opens the temporary drawer, or toggles the persistent one. On a destination: chooses it, which also closes a temporary drawer |
| Tab, Shift+Tab | Moves between the destinations. Focus stays inside a temporary drawer |
| Escape | Closes a temporary drawer. A persistent drawer stays open until it is closed |

### Dismissal

The guidelines open the drawer from the menu icon and by an edge swipe, and close a temporary one when a section is selected. Edge swipes are not shipped. The menu icon, choosing a destination, a press on the scrim and Escape are the paths, and every one of them is reachable without a pointer gesture.
