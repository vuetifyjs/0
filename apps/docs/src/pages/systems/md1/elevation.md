---
title: Elevation - Material Design 1 Elevation and Shadows for Vue
meta:
- name: description
  content: Material Design 1 elevation. The 0 to 24 dp shadow scale as tokens and utility classes, the component elevation table, the three-layer shadow recipe, and dark theme shadows.
- name: keywords
  content: md1 elevation, material design 1 elevation, material shadows, box-shadow, dp elevation, resting elevation, paper md1, vuetify0
features:
  category: Guide
  label: 'Elevation'
  level: 1
  group: style
  order: 3
related:
  - /systems/md1
  - /systems/md1/motion
  - /systems/md1/layout
  - /systems/md1/card
  - /systems/md1/button
---

# Elevation

<DocsPageFeatures :frontmatter />

Every Material Design 1 surface sits at a depth measured in dp, and the shadow it casts is the only cue that says how far it floats above the sheet beneath it.

> [!NOTE]
> Reference: [Elevation and shadows, Material Design 1 guidelines](https://m1.material.io/material-design/elevation-shadows.html), the archived page Material Design 1 is pinned to. The component elevation table, resting and dynamic elevation, and the rules for shadows. This page is the Vue.

## Usage

Elevation ships twice: as the `--md1-elevation-0` to `--md1-elevation-24` custom properties, and as the matching `md1-elevation-0` to `md1-elevation-24` classes in `style.css`. Each holds the full three-layer `box-shadow` for that dp. `Md1*` components already apply the elevation the guidelines give them; reach for the classes and tokens when you compose your own surface on a v0 primitive.

::: ds-example
/systems/md1/elevation/levels
:::

```vue
<template>
  <div class="md1-elevation-8">A sheet at 8 dp</div>

  <div class="my-panel">A sheet at 2 dp</div>
</template>

<style>
  .my-panel {
    box-shadow: var(--md1-elevation-2);
  }
</style>
```

The class also carries the elevation transition, so swapping `md1-elevation-2` for `md1-elevation-8` animates the shadow rather than snapping it. The token is the bare value: use it when the element already declares its own `transition`.

## The elevation model

Material is 1 dp thick and every sheet occupies one position on the z axis. Elevation is the distance between the top of one surface and the top of another, so a child's elevation is relative to its parent's. The web has no real z axis, so the guidelines emulate depth with shadows offset on the y axis: two light sources, a key light that casts a directional shadow and an ambient light that casts a soft one all around.

Three rules follow from the model, and every Material Design 1 component keeps them:

- **Resting elevation** is where a component sits when nothing is happening. It never drifts on its own, and a component that moves returns to rest as soon as the input ends.
- **Dynamic elevation** is the goal a component lifts toward in response to input. Every component that lifts on press uses the same offset, +6 dp: the FAB goes from 6 to 12 dp, the raised button and the picked-up card from 2 to 8 dp.
- **Material never passes through material.** Sheets stack and join, but one cannot move through another, so a component with dynamic elevation must not lift into a neighbour. The FAB moves aside, or leaves the screen, before a card is picked up.

## Desktop elevation

The guidelines lower every resting elevation by 2 dp where mouse and keyboard are the primary input, because a desktop needs less depth than a hand-held screen. Material Design 1 maps "mouse and keyboard" to `(pointer: fine)`, the same query that switches the desktop type sizes and durations.[^pointer-fine] The raised button is the case the buttons page spells out: it rests seamed at 0 dp and gains its 2 dp on hover and on press. The query reads the primary pointer only: a laptop with a touch screen gets the desktop values while its trackpad or mouse is the primary pointer, and the device values when the browser reports touch as primary, as a 2-in-1 in tablet mode does.

## Examples

::: ds-example
/systems/md1/elevation/components

### Component elevations

The elevation page fixes a resting elevation for every component, and the values hold across apps: a FAB is 6 dp in every product, a dialog is 24. Read top to bottom, the table is the z order of a Material screen. Dialogs and pickers (24 dp) sit above drawers and modal bottom sheets (16 dp), which sit above a pressed FAB (12 dp), sub menus (9 dp, plus 1 dp for each further level), menus and the bottom navigation bar (8 dp), the resting FAB and snackbars (6 dp), the app bar (4 dp), the refresh indicator (3 dp), cards, raised buttons and the search bar (2 dp), and the switch thumb (1 dp). Flat content is 0 dp.

Press Lift to move the four components that change elevation to their goal: the FAB to 12 dp and the raised button to 8 dp on press, a card to 8 dp when it is picked up, and the search bar to 3 dp once the content under it scrolls. The other rows have no dynamic elevation. A snackbar at 6 dp passes behind a bottom navigation bar at 8 dp, which is why the two are drawn in that order and not the other way round.

The change animates over 280 ms on the standard curve, the transition the `md1-elevation-*` classes carry. It is a fixed value, Vuetify 1.5's `elevationTransition`[^elevation-transition], and it does not follow the desktop duration scale on the [Motion](/systems/md1/motion) page, which covers colour and movement. Where the guidelines and Vuetify 1.5 disagree, the guidelines win: the modal bottom sheet is 16 dp (Vuetify paints 24), the switch thumb is 1 dp (Vuetify paints 4), the bottom navigation bar casts the full three-layer 8 dp shadow (Vuetify draws only its ambient layer), and sub menus step up by 1 dp per level.
:::

::: ds-example
/systems/md1/elevation/recipe

### The shadow recipe

The guidelines give elevation in dp and never in pixels, so Material Design 1 takes its shadows from Vuetify 1.5's `_elevations.styl`, the reference implementation of the Material paper shadows.[^shadow-recipe] Every level is three stacked `box-shadow` layers. The umbra is the dark core of the key light's shadow at black 20%, the penumbra its soft edge at 14%, and the ambient layer the all-round shadow at 12%. The first two together are the key shadow the environment page draws; the third is its ambient shadow.

The example pulls the 6 dp and 24 dp levels apart, one layer per sheet, and then stacks them. At 6 dp the umbra is `0px 3px 5px -1px`, the penumbra `0px 6px 10px 0px` and the ambient layer `0px 1px 18px 0px`; by 24 dp the same three layers have grown to `0px 11px 15px -7px`, `0px 24px 38px 3px` and `0px 9px 46px 8px`. That growth is the guidelines' rule made literal: the higher the surface, the softer and larger its shadow.

The three opacities are tokens of their own, `--md1-shadow-umbra`, `--md1-shadow-penumbra` and `--md1-shadow-ambient`, and every `--md1-elevation-*` value reads them. Custom properties resolve where they are declared, so retune the shadows in the same theme block as the elevation tokens. An override on a descendant does not reach a level already computed above it.
:::

::: ds-example
/systems/md1/elevation/dark

### Dark theme shadows

The dark theme changes surfaces and ink, not lights. `md1-dark` keeps every shadow layer at the same black opacities and the same offsets, so a 24 dp dialog casts the same shadow on Grey 800 (`#424242`) sheets over the `#303030` background as it does on white over Grey 50.

The result is that depth reads less strongly on the dark theme, because a black shadow has less to contrast with on a dark background. That is the guidelines' choice, not an oversight: the colour page builds the dark theme from darker surfaces and lighter ink and states no separate dark shadow. If your app needs heavier dark shadows, raise the three `--md1-shadow-*` opacities in the `md1-dark` block. Every level follows.
:::

::: ds-example
/systems/md1/elevation/layout

### A screen in cross-section

A screen and its side view. The background is 0 dp, the cards rest at 2 dp, the app bar at 4 dp and the floating action button at 6 dp, and the cross-section lays them out on the z axis, which the web can only suggest with shadows. Every sheet is 1 dp thick and holds one position on the axis.

Reading a screen this way is how the guidelines decide what may overlap what: the FAB can pass over the cards because it sits higher, and nothing at 2 dp may slide over the app bar.
:::

::: ds-example
/systems/md1/elevation/scroll

### Parents and children

Elevation is relative to the parent. Each raised button rests 2 dp above the card it sits on, so when the cards scroll, their buttons scroll with them. The floating action button's parent is the screen, not the card collection, so it stays where it is while the collection scrolls under it.

Build the relationship with the DOM, not the shadow: put the child inside the element that scrolls if it belongs to that sheet, and outside it if it belongs to the screen.
:::

::: ds-example
/systems/md1/elevation/material

### Material properties

The physical properties of material, on plain sheets. Material can take any height and width, any shape and any colour. Its content behaves independently of it: the list scrolls inside a sheet that does not move. Input reaches only the foreground: the front sheet covers part of the back sheet's button, and a tap there lands on the front sheet. Material moves on every axis, along x and y in the plane of the screen and along z, where moving means a change of elevation and so of shadow.

A tap, a hover and a scroll all go to the topmost sheet under the pointer, which is how the DOM behaves already, as long as the stacking order matches the elevation order. Keep `z-index` and elevation in step, and a sheet that looks higher will also be the one that receives input.
:::

::: ds-example
/systems/md1/elevation/join

### Joining and splitting

Sheets at the same elevation can join into one and split apart again. Joining closes the seam, squares off the corners that meet and hands the two shadows over to one around the whole; splitting reverses it. Material never joins across elevations, and it never passes through another sheet on the way.

Material Design 1 ships no surface for this; the example animates the gap and the corner radii on the standard curve over `--md1-duration-standard`, and swaps the elevation classes so the shadow transitions with them.[^join-timing]
:::

## Tokens

| Token | Value | Notes |
|-------|-------|-------|
| `--md1-elevation-0` to `--md1-elevation-24` | The three-layer `box-shadow` for that dp | On both theme blocks; the classes read them with the light value as fallback |
| `--md1-shadow-umbra` | `rgba(0, 0, 0, 0.2)` | Key light, dark core |
| `--md1-shadow-penumbra` | `rgba(0, 0, 0, 0.14)` | Key light, soft edge |
| `--md1-shadow-ambient` | `rgba(0, 0, 0, 0.12)` | Ambient light |

| Class | Sets |
|-------|------|
| `md1-elevation-0` to `md1-elevation-24` | `box-shadow: var(--md1-elevation-<n>)` and `transition: box-shadow 280ms` on `--md1-easing-standard`[^elevation-transition] |

The classes are a declared deviation from the no-utilities rule for design systems: together with the `md1-type-*` classes they are the only utilities Material Design 1 ships, so a composition outside the component set can still render at the system's depth without copying 25 shadow values.

## Accessibility

A shadow is a visual cue only. Depth tells a sighted reader what floats above what, but nothing in the accessibility tree, so never let elevation carry meaning on its own. A dialog at 24 dp is also a modal `<dialog>` that holds focus and makes the page behind it inert; the shadow only shows what the semantics already say. Under forced colours the browser drops `box-shadow` altogether, so a surface that relies on its shadow to separate it from the page needs a border or a background change there as well.

[^pointer-fine]: Our call: `(pointer: fine)` is the closest CSS test for "mouse and keyboard are the primary input".

[^elevation-transition]: Vuetify 1.5.24, stylus/settings/_elevations.styl:89-90. The 280 ms `box-shadow` transition on `cubic-bezier(.4, 0, .2, 1)`.

[^shadow-recipe]: Vuetify 1.5.24, stylus/settings/_elevations.styl:1-81. The umbra, penumbra and ambient opacities and the 25 offsets per layer.

[^join-timing]: Our call: the page shows joining as motion with no values, so the example uses the standard duration and curve.
