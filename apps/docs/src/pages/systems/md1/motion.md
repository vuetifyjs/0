---
title: Motion - Material Design 1 Durations and Easing for Vue
meta:
- name: description
  content: Material Design 1 motion. The four easing curves and four durations as tokens, with tablet and desktop duration scales, the 20 ms stagger, the ink reaction, and reduced motion.
- name: keywords
  content: md1 motion, material design 1 motion, easing curves, standard curve, deceleration curve, acceleration curve, sharp curve, durations, ripple, reduced motion, paper md1
features:
  category: Guide
  label: 'Motion'
  level: 1
  group: style
  order: 4
related:
  - /systems/md1
  - /systems/md1/elevation
  - /systems/md1/ripple
  - /composables/plugins/use-reduced-motion
---

# Motion

<DocsPageFeatures :frontmatter />

Material Design 1 moves on four easing curves and four durations, scaled for the device, so every surface that enters, leaves or transforms does it at the same speed and in the same way.

> [!NOTE]
> Reference: [Duration and easing, Material Design 1 guidelines](https://m1.material.io/motion/duration-easing.html), the archived page Material Design 1 is pinned to, with [Movement](https://m1.material.io/motion/movement.html) and [Choreography](https://m1.material.io/motion/choreography.html). This page is the Vue.

## Usage

Motion is a set of custom properties on `:root`. A transition takes one duration token and one easing token, picked by what the element is doing: entering, leaving, or moving and changing shape on screen.

::: ds-example
/systems/md1/motion/enter-leave
:::

The example's sheet leaves on `var(--md1-duration-leave) var(--md1-easing-accelerate)` and enters on `var(--md1-duration-enter) var(--md1-easing-decelerate)`. The durations change with the device by media query, so the same rule runs at 225 ms on a phone and 150 ms under a mouse without any script.

## Choosing a curve and a duration

| Movement | Curve | Duration |
|----------|-------|----------|
| Moving or transforming on screen | Standard | `--md1-duration-standard` |
| Entering the screen | Deceleration | `--md1-duration-enter` |
| Leaving the screen for good | Acceleration | `--md1-duration-leave` |
| Leaving the screen temporarily, may return | Sharp on exit, deceleration on return | `--md1-duration-standard` |
| Leaving, to return from a different place | Acceleration on exit, deceleration on return | not stated by the guidelines |
| Entering or leaving while pushing other elements | Standard, for the mover and the moved | `--md1-duration-standard` |
| Large, full-screen transformation | Standard | `--md1-duration-complex` |

Elements that move between two on-screen points along both axes follow an arc rather than a straight line. Elements entering or leaving the screen move straight, along one axis. Never put an independent entering or leaving element on the standard curve: an entrance needs no slow start and an exit no slow finish.

## Examples

::: ds-example
/systems/md1/motion/easing

### Easing curves

The guidelines name four curves and Material Design 1 ships each as a token. The standard curve, `cubic-bezier(0.4, 0, 0.2, 1)`, accelerates quickly and decelerates slowly; it is the most common curve and the one for every on-screen movement and every surface transformation. The deceleration curve, `cubic-bezier(0, 0, 0.2, 1)`, starts at full velocity and eases to rest, for elements entering the screen. The acceleration curve, `cubic-bezier(0.4, 0, 1, 1)`, starts slowly and leaves at full velocity, for elements leaving the screen for good. The sharp curve, `cubic-bezier(0.4, 0, 0.6, 1)`, is the symmetrical one, for elements that step off-screen and may come back at any moment.

Each plot draws the curve and its two control points; Play sends a dot along each track on its curve. The dots run at 1200 ms, a docs-only slow motion so the shapes can be followed by eye. The tokens carry no duration of their own. Pair them with a duration token in the same `transition` declaration.

The curves apply to position, opacity and scale alike. Vuetify 1.5 defaults to its own `swing` curve, and ships a `fast-in-fast-out` one; neither is a Material Design 1 curve, and Material Design 1 ships neither.
:::

::: ds-example
/systems/md1/motion/durations

### Device durations

The guidelines time motion per device. On a phone a typical transition is 300 ms, an element entering 225 ms, an element leaving 195 ms, and a large full-screen transition 375 ms; transitions past 400 ms start to feel slow. Tablets have more distance to cover, so their motion is about 30% longer, the guidelines' 300 ms becoming 390 ms. Desktop motion is shorter and simpler, 150 to 200 ms, because a pointer expects an immediate response and a short web transition hides dropped frames.

Material Design 1 ships the four phone values as `--md1-duration-enter`, `-leave`, `-standard` and `-complex` and redeclares them twice. Under `(min-width: 600px) and (pointer: coarse)` they are the tablet scale, each value times 1.3: 293, 254, 390 and 488 ms. Under `(pointer: fine)` they are the desktop scale: 150, 150, 200 and 200 ms. The highlighted row is the class this window matches, and Play fills each bar over the value the tokens hold right now. Wearables, 30% shorter, have no web surface and no scale.

The scale covers colour and movement. The 280 ms elevation transition on the [Elevation](/systems/md1/elevation) page is a fixed value outside it.
:::

::: ds-example
/systems/md1/motion/stagger

### Stagger

When several surfaces appear at once, the guidelines stagger them along one focal path: lists top to bottom, grids left to right and top to bottom, never all at once and never out of order. One item does not wait for the previous one to finish; each starts no more than 20 ms after the one before it.

`--md1-stagger` is that 20 ms. The example delays each row by its index times the token, and every row enters on the deceleration curve over `--md1-duration-enter`. `Md1Menu` items, `Md1DropdownButton` rows, `Md1GridList` tiles and the `Md1Fab` speed dial actions read the same token, so a composed list and a Material Design 1 one keep the same rhythm.
:::

::: ds-example
/systems/md1/motion/ink

### Ink reaction

Material responds to input exactly where it lands. The guidelines draw that response as a touch ripple: ink that expands outward from the point of contact and confirms the input was received, with reactions near the touch happening before reactions further away. Every interactive Material Design 1 component hosts an `Md1Ripple` as its first child for this; there is no prop to turn it off.

The ink is the pressed overlay, 40% `#999999` on the light theme and 25% `#CCCCCC` on the dark one. It expands over `--md1-ripple-duration`, an alias of `--md1-duration-standard`, on the standard curve, and fades over `--md1-duration-leave`, so it follows the device scale with everything else. A keyboard press starts it at the centre. Inside a bounded host the ink fills the surface and is clipped by it; the `unbounded` form is the 48 dp circle an icon toggle draws past its glyph.

The example composes `Md1Ripple` on v0's `Button.Root`, the escape hatch for a surface Material Design 1 does not ship. The guidelines give no ripple timing of their own; the values are the motion page's durations, and the [Ripple](/systems/md1/ripple) page covers the component in full.
:::

::: ds-example
/systems/md1/motion/reduced-motion

### Reduced motion

A reader who asks the operating system to reduce motion gets surfaces that are placed rather than moved. `createMd1Plugin` installs v0's reduced-motion plugin, which writes `data-reduced-motion="reduce"` on `<body>` when the preference is set. Material Design 1's stylesheets read that attribute and fall back to the `prefers-reduced-motion: reduce` media query before the plugin has run. Under either, the ripple draws its ink as a static pressed fill and components that slide, scale or fade drop the transition and land in their final state.

The attribute wins over the media query in both directions, so `createMd1Plugin({ reducedMotion: { mode: 'never' } })` keeps motion for an app that must animate, and `mode: 'always'` removes it regardless of the system setting. The example provides its own reduced-motion context and writes the attribute on its wrapper instead of `<body>`, so the switch affects only the sheet below it. Follow the same pattern in your own CSS:

```css
body[data-reduced-motion='reduce'] .my-sheet {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  body:not([data-reduced-motion='no-preference']) .my-sheet {
    transition: none;
  }
}
```
:::

## Tokens

| Token | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `--md1-duration-enter` | 225ms | 293ms | 150ms |
| `--md1-duration-leave` | 195ms | 254ms | 150ms |
| `--md1-duration-standard` | 300ms | 390ms | 200ms |
| `--md1-duration-complex` | 375ms | 488ms | 200ms |
| `--md1-ripple-duration` | `var(--md1-duration-standard)` | follows | follows |
| `--md1-stagger` | 20ms | 20ms | 20ms |

Tablet is `(min-width: 600px) and (pointer: coarse)`; desktop is `(pointer: fine)`.

| Token | Value |
|-------|-------|
| `--md1-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--md1-easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--md1-easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--md1-easing-sharp` | `cubic-bezier(0.4, 0, 0.6, 1)` |

The same values are exported from `@paper/md1` as `easing`, `duration`, `durationTablet` and `durationDesktop` for code that animates outside CSS.

## Accessibility

Motion must never be the only signal that something happened: a sheet that slides in is also a focused dialog, and an ink ripple is also a pressed button. The guidelines cap motion in two places. Content that moves, scrolls or blinks on its own for more than 5 seconds needs a way to pause, stop or hide it, and nothing may flash more than 3 times in any one second. Material Design 1's indeterminate progress indicators run until the work ends, so give the region around them an accessible status rather than relying on the animation.
