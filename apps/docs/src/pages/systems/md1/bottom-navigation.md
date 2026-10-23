---
title: Md1BottomNavigation - Material Design 1 Bottom Navigation for Vue
meta:
- name: description
  content: The Material Design 1 bottom navigation bar for three to five top-level destinations, fixed or shifting, on the surface or the primary colour, with hide on scroll. Built on Vuetify0's createSingle and Button.
- name: keywords
  content: md1 bottom navigation, material design 1 bottom navigation, bottom nav, shifting bottom navigation, tab bar, vue bottom navigation, vuetify0 createSingle, paper md1
features:
  category: Component
  label: 'C: Md1BottomNavigation'
  level: 2
  renderless: false
  group: navigation
  order: 3
related:
  - /systems/md1
  - /systems/md1/icon
  - /systems/md1/ripple
  - /systems/md1/tabs
  - /composables/selection/create-single
  - /components/actions/button
---

# Md1BottomNavigation

<DocsPageFeatures :frontmatter />

The Material Design 1 bottom navigation bar. Three to five top-level destinations in a 56 dp bar along the bottom of the screen, fixed or shifting, that one tap switches between.

> [!NOTE]
> Reference: [Bottom navigation, Material Design 1 guidelines](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-navigation.html), the archived page Material Design 1 is pinned to. Types, metrics, colour, elevation and behavior. This page is the Vue.

## Usage

`Md1BottomNavigation` is a compound: the root is the bar and owns `v-model`, the value of the active destination. Each `Md1BottomNavigation.Action` is one destination, an icon and a short label. One action is always active; with no model bound, the first enabled action is.

Use bottom navigation for three to five top-level destinations of similar importance that must be reachable from anywhere in the app. With fewer than three, use tabs; with more than five, use a navigation drawer.

::: ds-example
/systems/md1/bottom-navigation/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1BottomNavigation } from '@paper/md1'
</script>

<template>
  <Md1BottomNavigation>
    <Md1BottomNavigation.Action />
  </Md1BottomNavigation>
</template>
```

## Composed on Vuetify0

The bar holds a v0 [createSingle](/composables/selection/create-single) selection with `mandatory: 'force'`, bound to `v-model` through [useProxyModel](/composables/reactivity/use-proxy-model). Each action registers its `value` with that selection and selects it on click; tapping the active action keeps it active, because the guidelines send the user to the top of the current view instead, and that scroll is the app's. There is no `Tabs` underneath: destinations are views, not panels in the same document, so there is no `tablist` semantics to borrow.

Each action is a v0 [Button](/components/actions/button) `Button.Root`, rendered renderless so Material Design 1 can put the selection state on the native `<button>`: `Button.Root` emits `data-selected` only inside a v0 `Button.Group`. With `href` the action is a plain link instead, because `Button.Root` would give it `role="button"`. Native activation, the `disabled` attribute and the tab order come from `Button.Root`; `data-shifting`, `data-variant`, `data-hidden` and the actions' `data-selected` are Material Design 1's own.

Every action hosts a [Md1Ripple](/systems/md1/ripple) as its first child and draws its glyph through [Md1Icon](/systems/md1/icon). Hide on scroll listens to scroll events through v0's `useEventListener`.

## Examples

::: ds-example
/systems/md1/bottom-navigation/fixed

### Fixed, four destinations

In the fixed bar every action takes the same width: the width of the view divided by the number of actions, between 80 dp and 168 dp. When the cap binds, on a wide screen, the group centres in the bar. With three actions every action shows its icon and label. With four or five, as here, only the active action keeps its label and the inactive ones show their icon alone, centred with 16 dp above and below.

The active action tints its icon and label with the primary colour (`--md1-primary`, Indigo 500), raises its icon from 8 dp to 6 dp below the top edge and grows its label from 12 sp to 14 sp Roboto Regular. On the dark theme Indigo 500 reads at under 2:1 on the Grey 800 bar, so the active action takes the primary's 100 instead (`--md1-primary-light`, Indigo 100), the rule a list's current item and a primary subheader follow. Inactive actions take the secondary text colour, 54% black on the light theme and 70% white on the dark one. The label sits 10 dp above the bottom edge with 12 dp on each side; it never wraps or truncates, so keep it to a word or two.

The hidden labels are hidden from sight only. They stay in the accessibility tree as each action's name, so an icon-only inactive action still announces "Alerts" rather than nothing.
:::

::: ds-example
/systems/md1/bottom-navigation/shifting

### Shifting

`shifting` is the second form the guidelines define for four or five destinations: the active action is wider and shows its label, the inactive ones narrow to their icon. Active actions measure 96 dp to 168 dp and inactive ones 56 dp to 96 dp. Selecting a destination moves the wide slot and the label to it, on the standard curve over the standard duration.

The guidelines give only those bounds, not how the bar divides its width. Material Design 1 gives the active action one and a half shares of the bar against one share for each inactive action, which lands inside the stated bounds at every count on a 360 dp handset (120 dp and 80 dp with four actions, about 98 dp and 65 dp with five). That ratio is a Material Design 1 decision.

Prefer the fixed bar for three destinations; the shifting bar is for when four or five crowd it.
:::

::: ds-example
/systems/md1/bottom-navigation/primary

### Coloured bar

`variant="primary"` fills the bar with the primary colour instead of the surface. The guidelines then make the active icon and label black or white, whichever reads against the bar; Material Design 1 uses `--md1-on-primary`, the palette's ink for the primary swatch, white for Indigo 500 and black for a light primary such as Amber. Inactive actions take that ink at 70%, the secondary text opacity for white ink; the page shows the coloured bar only as an image, so the 70% is a Material Design 1 decision.

Do not mix colours inside the bar: the guidelines advise against differently coloured icons and labels, and against coloured icons on a coloured bar. The default `surface` variant paints the bar in `--md1-surface`, white on the light theme and Grey 800 on the dark one.
:::

::: ds-example
/systems/md1/bottom-navigation/hide-on-scroll

### Hide on scroll

The guidelines let the bar step aside for content: scrolling downward hides it, scrolling upward reveals it. `hideOnScroll` does exactly that, sliding the bar off the bottom edge on the sharp curve at the standard duration, the curve the duration and easing page gives elements that leave temporarily and may return. The bar's shadow goes with it.

The bar listens to any scroller inside its own parent, the app shell's content region, and to the document while the bar is pinned to the viewport. Scrollers elsewhere on the page are ignored, and so is the document once a container holds the fixed bar (a transformed or `contain` ancestor, like the frame of this example), because the page scrolling then moves the bar with its container. A hidden bar stays in the tab order: moving focus into it brings it back, so a keyboard user never tabs onto an off-screen control.

The bar itself is `position: fixed` to the bottom of the viewport with an 8 dp shadow (6 dp under a mouse, the elevation page's desktop rule), and adds the device's bottom safe-area inset below its 56 dp so its actions clear a home indicator. Give the content beneath it 56 dp of bottom padding so the last line is not covered. Snackbars sit behind the bar; sheets, drawers and dialogs open in front of it.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1BottomNavigation.vue and
     Md1BottomNavigationAction.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T` | | The value of the active destination; bind it with `v-model`. Unbound, the first enabled action is active |
| `shifting` | `boolean` | `false` | The shifting bar: the active action widens to 96 to 168 dp and shows its label, the inactive ones narrow to 56 to 96 dp and show their icon |
| `variant` | `'surface' \| 'primary'` | `'surface'` | The bar colour: the theme surface, or the primary colour with black or white ink |
| `hideOnScroll` | `boolean` | `false` | Hide the bar on a downward scroll and reveal it on an upward scroll or when focus moves into it |
| `namespace` | `string` | `'md1:bottom-navigation'` | The context key the actions read. Set the same key on the actions, and only to nest two bars |

The default slot holds the actions, three to five; outside that range Material Design 1 warns in development. Pass `aria-label` to name the navigation landmark. There are no named slots.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1BottomNavigation.Action` | `value`, `icon`, `label`, `href`, `disabled`, `ariaLabel`, `namespace` | One destination: a native `<button>`, or an `<a>` when `href` is set, with `aria-current="page"` while active. `icon` is an `Md1Icon` role and is required; `label` (or the default slot) is the text under it. Without a label, `ariaLabel` is required. `value` defaults to a generated id. Outside a bar it warns in development and selects nothing. Also exported flat as `Md1BottomNavigationAction` |

## Accessibility

The root is a native `<nav>` landmark. Name it with `aria-label` ("Main") when the page has more than one navigation region. Each action is a native `<button type="button">`, or a link when it has an `href`, and the active one carries `aria-current="page"`: destinations are views, so the bar follows the navigation-landmark pattern of links with a current page rather than the tabs pattern.

### Naming

Each action's name is its label. Labels hidden by the fixed bar with four or five actions, or by the shifting bar, are hidden visually only and still name the action. The icon is `aria-hidden`. An action with no label must pass `ariaLabel`; without it Material Design 1 warns in development.

### Keyboard

Every enabled action is its own tab stop, in source order.

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves focus between the actions and out of the bar. Disabled actions are skipped. Focus entering a hidden bar reveals it |
| Enter | Activates the focused action: a button selects its destination, a link selects it and follows its `href` |
| Space | Selects the focused button action. While held, the ink draws from the centre of the action |

### Focus

The bottom navigation page gives no focus or hover value. Keyboard focus draws the buttons page's 12% overlay in the action's own ink, and a mouse hover draws Material Design 1's 6% overlay; a mouse click leaves nothing behind. Under forced colours a 2 px outline draws in place of the focus overlay.

### States

| State | Attributes set | Focusable | Activation | Announced as |
|-------|----------------|-----------|------------|--------------|
| inactive | none | Yes | Enter, Space, click | The label, as a button or link |
| active | `aria-current="page"`, `data-selected` | Yes | Enter, Space, click (stays active) | The label, current page |
| `disabled` (button) | `disabled`, `aria-disabled="true"`, `data-disabled` | No | Blocked | Disabled |
| `disabled` (link) | `aria-disabled="true"`, `tabindex="-1"`, `data-disabled`, no `href` | No | Blocked | Disabled |

### Touch target

Every action is 56 dp tall and at least 56 dp wide, above the 48 dp minimum touch target of the metrics page, so no hit area is added around it.
