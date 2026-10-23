---
title: Md1Ripple - Material Design 1 Ripple for Vue
meta:
- name: description
  content: The Material Design 1 ink reaction. Every interactive Material Design 1 control hosts it, and Md1Ripple adds it to a v0 primitive you compose yourself. Bounded, unbounded and centred.
- name: keywords
  content: md1 ripple, material design 1 ripple, ink ripple, touch ripple, radial reaction, vue ripple, useRipple, vuetify0, paper md1
features:
  category: Component
  label: 'C: Md1Ripple'
  level: 2
  renderless: false
  group: foundation
  order: 2
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/icon-toggle
  - /composables/system/use-event-listener
  - /composables/plugins/use-reduced-motion
---

# Md1Ripple

<DocsPageFeatures :frontmatter />

The ink reaction Material Design 1 draws on every press. It spreads from the point of contact in the pressed overlay colour and fades when the press ends.

> [!NOTE]
> Reference: [Material motion, Material Design 1 guidelines](https://web.archive.org/web/20181225002146/https://material.io/archive/guidelines/motion/material-motion.html) for the responsive principle, [Choreography](https://web.archive.org/web/20210805004105/https://material.io/archive/guidelines/motion/choreography.html) for the radial reaction, and [Buttons](http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html) for the pressed overlay, all from the archived pages Material Design 1 is pinned to. This page is the Vue.

## Usage

Every interactive Material Design 1 control already hosts an `Md1Ripple`, so you place one yourself only inside a composition of your own. Make it the first child of the element that is pressed, give that element `position: relative`, and the ripple binds its own events on that parent.

::: ds-example
/systems/md1/ripple/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Ripple } from '@paper/md1'
</script>

<template>
  <Md1Ripple />
</template>
```

## Composed on Vuetify0

v0 ships no ink primitive, so the ripple is Material Design 1's own, one of the deviations the package's `SPEC.md` declares. The state lives in `useRipple`, a Material Design 1 composable that keeps the list of inks and their lifecycle and never touches the DOM. `Md1Ripple` is the component half: it measures its parent and binds `pointerdown`, `pointerup`, `pointercancel`, `pointerleave`, `keydown`, `keyup` and `blur` on it through v0's [useEventListener](/composables/system/use-event-listener), which removes every listener when the ripple unmounts.

Reduced motion comes from v0's [useReducedMotion](/composables/plugins/use-reduced-motion). `createMd1Plugin` installs the reduced-motion plugin unless you pass `{ reducedMotion: false }`; with no plugin at all, `useRipple` falls back to the operating system's `prefers-reduced-motion` query.

The ripple renders a `span.md1-ripple` marked `aria-hidden`, with one `span.md1-ripple__ink` per press inside it. Each ink carries `data-state`: `in` while it expands, `hold` while the press outlasts the expansion, `out` while it fades. The layer carries `data-unbounded` when `unbounded` is set.

## Examples

::: ds-example
/systems/md1/ripple/controls

### In every Material Design 1 control

Every Material Design 1 component a finger or a pointer can press hosts a ripple as the first child of its interactive root, including buttons, toggle buttons, the FAB and its speed dial actions, icon toggles, checkboxes, radios and switches, sliders, tabs, bottom navigation actions, chips, menu items, steppers, pickers, table headers, grid tiles and expansion panel headers. The guidelines describe this reaction under the responsive principle of the motion pages, and again as the radial reaction of the choreography page: material responds where the user touches it, and the ink expands outward from the point of contact to confirm the input was received.

None of those components has a prop to turn it off. The ripple is the press feedback the spec prescribes for every control, not a decoration, so a Material Design 1 control without one would be a control outside the spec. Vuetify's `ripple` prop belongs to Vuetify: an orchestrator wrapping Material Design 1 translates it on its own side, and a Material Design 1 control never grows that option to make the wrapper simpler.

Disabled controls give no feedback. The ripple checks its host on every press and draws nothing while the host carries `disabled`, `aria-disabled="true"` or `data-disabled`, which covers every v0 root's disabled state without a prop.
:::

::: ds-example
/systems/md1/ripple/compose

### A composition of your own

Material Design 1 has no rating control, so Material Design 1 ships no `Md1Rating`. When a product needs one, the escape hatch applies: take v0's [Rating](/components/forms/rating), style it with the `--md1-*` tokens and the `md1-type-*` and `md1-elevation-*` classes, and add an `Md1Ripple` to each element the reader presses. Here each `Rating.Item` is a 48 dp target holding an unbounded ink and an `Md1Icon` star in the accent colour.

Three rules make the ink land correctly. The ripple is the host's first child, because it binds to its parent element and nothing else. The host is `position: relative`, because the ink layer is absolutely positioned against it. Any child that must stay readable during a press, a glyph or a label, is positioned too, so it paints above the ink layer instead of under it; `Md1Button` does the same for its label and icon.

The ripple only draws the reaction. Activation, keyboard support and the accessible name stay with the v0 primitive, which is why the composition works without Material Design 1 knowing what a rating is. The result is supported as v0 and as Material Design 1 tokens; it is not a Material Design 1 component.
:::

::: ds-example
/systems/md1/ripple/bounded

### Bounded and unbounded

A bounded ripple is clipped to its host. The ink starts at the press point and grows until it covers the farthest corner, so a press in the middle reaches every corner at a radius of half the host's diagonal, and a press near one edge still floods the whole host. The layer inherits the host's `border-radius`, so a rounded host clips a rounded ink. This is the default, and the form of buttons, tiles, tabs and list rows.

`unbounded` draws the one ink the guidelines let escape its host: a 48 dp circle centred on the element and never clipped, whatever the element measures. The buttons page allows it for icon toggles, and Material Design 1's checkboxes, radios and switches use it around their 24 dp glyphs, so the circle is the size of the touch target the control answers to. An unbounded ink always starts at the centre, because the press point means little on a target that small.

Unbounded ink is drawn with `overflow: visible`, so it only escapes if the host lets it: a host or an ancestor with `overflow: hidden` clips it back. The glyph host in this example extends its hit area to 48 dp with a pseudo-element, the same way the selection controls do, so the touch target and the ink agree.
:::

::: ds-example
/systems/md1/ripple/center

### Centred

`center` starts every ink at the middle of the host, wherever the press lands. The ink still grows to fill the host, now at exactly half its diagonal, and stays clipped to it. Use it where the press point carries no meaning, such as a control whose visible mark is centred: Material Design 1 sets it on the slider thumb.

Keyboard presses are always centred. Enter or Space on a focused host draws one ink from the middle, since a key has no position; holding the key holds the ink and releasing it starts the fade. Auto-repeat while the key is held draws nothing more, and a key event that bubbles up from a focused child is ignored, so only the focused host reacts.
:::

::: ds-example
/systems/md1/ripple/reduced-motion

### Reduced motion

When the reader asks for reduced motion, the ink stops moving but the press still shows. The ink appears at full size and full colour the moment the press starts, holds as a static pressed fill, and disappears at release without a fade. The pressed state is information, so it stays; only the expansion and the fade, the parts that move, are removed.

In an app the switch is v0's reduced-motion plugin. Its adapter writes `data-reduced-motion` on `<body>` and `useRipple` reads `isReduced` from the same context. The `mode` option decides: `system` follows the operating system, `always` and `never` override it. The stylesheet also answers the `prefers-reduced-motion` media query directly, unless the plugin has written `no-preference`, so `mode: 'never'` keeps the motion even on a system that asks for less.

The docs install no reduced-motion plugin, so this example provides its own context with v0's `createReducedMotionContext` and mirrors the body attribute on its own wrapper. Turning the switch off returns the context to `system`, which follows your operating system. Both the ripple in the sheet and the one inside the switch follow the setting.
:::

::: ds-example
/systems/md1/ripple/timing

### Pressed ink and timing

The ink is the spec's pressed overlay, `--md1-pressed`: 40% `#999999` on the light theme and 25% `#CCCCCC` on the dark one. It is an absolute grey rather than a tint of the host's colour, so it reads the same on a surface, on the primary colour and on the accent, and it does not change with the host's text colour.

The ink paints in the `color` of the `.md1-ripple` layer, so a host that follows another page's values sets `color` on its own ripple child instead. The selection controls do: the selection controls page draws their pressed halo as a faint grey while off and as about 10% of the accent while on (measured from the page's artwork; it states no number), so Material Design 1 paints them in `--md1-hover` (black 6% on the light theme, white 10% on the dark one) and in 10% of the accent. That is why the checkbox in the controls example above presses lighter than the buttons beside it. A composition of your own can do the same with a `> .md1-ripple` rule on its host class.

The motion pages state no ripple numbers, so Material Design 1 takes them from the duration and easing page rather than from Vuetify's 250 and 300 ms. The ink expands over `--md1-ripple-duration`, an alias of `--md1-duration-standard` (300 ms on handsets, 390 ms on tablets, 200 ms with a mouse), scaling from nothing to full size on the standard curve while its opacity reaches full in the first 30%. It fades over `--md1-duration-leave` (195 ms, 254 ms on tablets, 150 ms with a mouse) on the same curve.

A press shorter than the expansion still draws the whole reaction: the release is remembered and the fade starts when the expansion lands. Because the tokens are custom properties, a declaration on any ancestor retunes every ripple inside it, which is how the second sheet runs five times slower. Override `--md1-ripple-duration` itself to change the expansion; the alias resolves where the theme declares it, so overriding `--md1-duration-standard` on a subtree leaves the ripple where it was.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--md1-pressed` | `#999999` at 40% | `#CCCCCC` at 25% | Ink colour |
| `--md1-ripple-duration` | `var(--md1-duration-standard)` | same | Expansion |
| `--md1-duration-leave` | 195 ms | same | Fade |
| `--md1-easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | same | Both curves |
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Ripple.vue and
     useRipple until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `unbounded` | `boolean` | `false` | A 48 dp circle centred on the host and never clipped: the icon toggle and selection control ink. Sets `data-unbounded` on the layer |
| `center` | `boolean` | `false` | Every ink starts at the host's centre, whatever the press position. Still bounded |

There is no default slot and there are no named slots. The ripple renders the ink layer only.

### useRipple

The composable behind `Md1Ripple`, exported for a composition that needs the ink state without the component. It holds state only; the component that uses it measures the host, binds the events and calls `settle` from each ink's `animationend`.

```ts no-filename
import { useRipple } from '@paper/md1'

const ripple = useRipple({ center: () => props.center })

ripple.start({ width: 88, height: 36 }, { x: 12, y: 18 })
ripple.end()
```

| Option | Type | Description |
|--------|------|-------------|
| `unbounded` | `MaybeRefOrGetter<boolean>` | The 48 px centred circle |
| `center` | `MaybeRefOrGetter<boolean>` | Start every ink at the centre |

| Member | Type | Description |
|--------|------|-------------|
| `inks` | `Readonly<Ref<readonly RippleInk[]>>` | Live inks, oldest first: `id`, origin `x` and `y` and diameter `size` in px, and `state` (`'in' \| 'hold' \| 'out'`) |
| `isReduced` | `Readonly<Ref<boolean>>` | The reduced-motion context's `isReduced`, or the operating system's preference while the mode is `system` |
| `start(bounds, point?)` | `(RippleBounds, RipplePoint?) => RippleInk` | Adds an ink; omit `point` to start at the centre |
| `settle(id)` | `(number) => void` | Advances the ink whose animation landed: an expanded ink holds or fades, a faded ink is removed |
| `end()` | `() => void` | Releases the press: held inks fade, expanding inks fade once they land, and every ink leaves at once under reduced motion |
| `clear(id?)` | `(number?) => void` | Removes one ink, or every ink |

## Accessibility

The ripple is visual confirmation of a press and nothing else. The layer is `aria-hidden` and `pointer-events: none`, so it is never announced, never focused and never takes a hit away from the host. Every name, role and state belongs to the host element.

### Keyboard

| Key | Behavior |
|-----|----------|
| Enter, Space | On a focused host, draws one ink from the centre and holds it while the key is down. Auto-repeat draws nothing more |
| Releasing Enter or Space, or focus leaving the host | Starts the fade |

Keys and buttons other than these, and pointer buttons other than the primary one, draw nothing.

### Motion

Under reduced motion the ink is a static fill for the length of the press; nothing expands or fades. No ripple moves for longer than its press plus one fade, well inside the accessibility page's five-second limit on motion that runs on its own, and a press never flashes.

### Contrast

The ink is an overlay, not a carrier of information: the pressed state lasts only while the reader holds the control. Text and glyphs inside a host are positioned above the layer, so a press never lowers their contrast.
