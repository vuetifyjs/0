---
title: Color - Material Design 1 Color for Vue
meta:
- name: description
  content: The Material Design 1 color system. The 2014 palette as tokens, the light and dark theme roles, ink and state opacities, and overriding a role.
- name: keywords
  content: md1 color, material design 1 palette, material color palette, primary accent, light theme, dark theme, text opacity, vue design tokens, paper md1
features:
  category: Guide
  label: 'Color'
  level: 1
  group: 'style'
  order: 1
related:
  - /systems/md1
  - /systems/md1/typography
  - /systems/md1/button
  - /components/providers/theme
---

# Color

<DocsPageFeatures :frontmatter />

The Material Design 1 color system: a 256-swatch palette, a primary and an accent hue picked from it, and black or white ink at fixed opacities over light and dark surfaces.

> [!NOTE]
> Reference: [Color, Material Design 1 guidelines](https://m1.material.io/style/color.html), the archived page Material Design 1 is pinned to, with the 2016 revision of the color page for the original 2014 wording. Palette, theme figures and opacity tables. This page is the Vue.

## Usage

Every color Material Design 1 paints is a CSS custom property. Components read the role tokens (`--md1-primary`, `--md1-accent`, `--md1-surface`, `--md1-text-primary`); the raw palette is there for your own surfaces. Reference a token with the spec value as its fallback, the way Material Design 1's own stylesheets do:

```css
.app-banner {
  color: var(--md1-on-primary, #FFFFFF);
  background: var(--md1-primary, #3F51B5);
}
```

The role tokens sit on the theme attribute (`[data-theme="md1-light"]` and `[data-theme="md1-dark"]`); the palette sits on `:root`, so it is the same in both themes.

::: ds-example
/systems/md1/color/roles
:::

## Palette

The 2014 palette is nineteen hues. Each has ten shades from 50 to 900, and the sixteen hues that are not neutral add four accents, A100 to A700; Brown, Grey and Blue Grey stop at 900. With black and white that makes 256 values, every one published as `--md1-<hue>-<shade>` (`--md1-indigo-500`, `--md1-pink-a200`, `--md1-blue-grey-900`, `--md1-black`). Hue names are kebab-case and accent shades are lowercase.

The same values are exported from the package as `md1Palette`, keyed the same way without the prefix (`md1Palette['indigo-500']`), and the swatch ink the guidelines recommend for each one as `md1PaletteInk`, `#000000` or `#FFFFFF`. All 256 values were checked against the 2018 page, the 2016 page and Vuetify 1.5, and agree in every source.

## Theme roles

A Material Design 1 theme is three shades of one primary hue and one accent from a second hue. Material Design 1's default theme is the guidelines' own worked example, Indigo and Pink.

| Token | Rule | Light | Dark |
|-------|------|-------|------|
| `--md1-primary` | The primary hue's 500: app bars and other large areas | Indigo 500 `#3F51B5` | same |
| `--md1-primary-dark` | 700: the status bar, a pressed raised button | Indigo 700 `#303F9F` | same |
| `--md1-primary-light` | 100: related information under a primary region | Indigo 100 `#C5CAE9` | same |
| `--md1-primary-ink` | Primary-coloured text and icons: the 500 on light, the first lighter tone that reaches 4.5:1 on dark | Indigo 500 `#3F51B5` | Indigo 100 `#C5CAE9` |
| `--md1-accent` | The accent hue's A200: the FAB, action buttons, text fields, selection, links | Pink A200 `#FF4081` | same |
| `--md1-accent-light` | 50, the data tables page's contextual header | Pink 50 `#FCE4EC` | same |
| `--md1-accent-control` | Selection controls, sliders and pickers | Pink A200 `#FF4081` | Pink 200 `#F48FB1` |
| `--md1-on-primary`, `--md1-on-accent` | Ink on the 500 and the A200: white at 100%, or black on the swatches the palette marks dark | `#FFFFFF` | same |
| `--md1-error` | Red A400: the text field error line, the stepper error step | `#FF1744` | same |
| `--md1-on-error` | Ink on the error red, the palette's recommendation for Red A400 | `#FFFFFF` | same |

The guidelines spend the accent sparingly and never on an app bar or another large area. Accent control is the only role that changes between themes: the selection controls and pickers pages lighten the accent to its hue's 200 on dark surfaces. The darker accent fallback, A400, is not a role token because no component reads it; it stays reachable as `--md1-<hue>-a400`. The color page states no error value; Red A400 comes from the text fields page.

## System colors

The theme figures on the color page give four surfaces per theme. Three are tokens; the status bar is not, because a browser has no status bar to paint. Set `<meta name="theme-color">` yourself if you want the browser chrome to follow it.

| Surface | Token | Light | Dark |
|---------|-------|-------|------|
| 1. Status bar | none (palette value) | Grey 300 `#E0E0E0` | Black `#000000` |
| 2. App bar | `--md1-app-bar` | Grey 100 `#F5F5F5` | Grey 900 `#212121` |
| 3. Background | `--md1-background` | Grey 50 `#FAFAFA` | `#303030` |
| 4. Cards and dialogs | `--md1-surface` | White `#FFFFFF` | Grey 800 `#424242` |

The dark background, `#303030`, is not a palette value; the guidelines print it without a name.

## Ink and state

Text, icons and dividers are never a grey from the palette. They are black on light surfaces and white on dark ones, at an opacity that sets their rank, so they keep their contrast on any background color. Material Design 1 publishes each tier as a translucent token.

| Token | Light (black) | Dark (white) |
|-------|---------------|--------------|
| `--md1-text-primary` | 87% | 100% |
| `--md1-text-secondary` | 54% | 70% |
| `--md1-text-disabled`, `--md1-text-hint` | 38% | 50% |
| `--md1-placeholder` | 42% | 50% |
| `--md1-divider` | 12% | 12% |
| `--md1-icon-active` | 54% | 100% |
| `--md1-icon-inactive` | 38% | 50% |
| `--md1-icon-focused` | 87% | 100% |

The state overlays come from the component pages rather than the color page, and each is a translucent layer over whatever surface it lands on.

| Token | Light | Dark | Source |
|-------|-------|------|--------|
| `--md1-hover` | black 6% | white 10% | the text-fields page's box fill and the selection controls' measured halo |
| `--md1-list-hover` | black 4% | white 8% | Vuetify 1.5's list hover: lists, menus and their rows[^list-hover] |
| `--md1-list-selected` | black 7% | white 7% | The selected list item's band, from the navigation drawer page's figures; dark is our call |
| `--md1-focus` | black 12% | white 12% | buttons page |
| `--md1-pressed` | `#999999` 40% | `#CCCCCC` 25% | buttons page |
| `--md1-button-disabled` | black 12% | white 12% | buttons page, the disabled raised container |
| `--md1-button-disabled-text` | black 26% | white 30% | buttons page |
| `--md1-selection` | accent 30% | accent 30% | the accent is the selection page's; the alpha is a decision[^selection-alpha] |
| `--md1-scrim-sheet` | black 20% | black 20% | bottom sheets page |
| `--md1-scrim` | Grey 900 46% | Grey 900 46% | Vuetify 1.5, a lead decision for dialogs and the temporary drawer[^scrim] |

Every theme token in the tables above is also published as `--md1-<role>-channels`, the space-separated RGB triplet with any alpha dropped, so you pick the opacity yourself: `rgb(var(--md1-primary-channels) / 0.12)`. The palette tokens have no triplet.

## Overriding a role

`createMd1Plugin` takes v0's theme options under `theme`. Each theme's `colors` merge over Material Design 1's own map one level deep, so you pass only the roles you change:

```ts main.ts
import { createApp } from 'vue'
import { createMd1Plugin } from '@paper/md1'
import App from './App.vue'

createApp(App)
  .use(createMd1Plugin({
    theme: {
      themes: {
        'md1-light': {
          colors: { 'primary': '#009688', 'primary-dark': '#00796B' },
        },
        'md1-dark': {
          colors: { 'primary': '#009688', 'primary-dark': '#00796B' },
        },
      },
    },
  }))
  .mount('#app')
```

To move to another hue pair, derive the whole role set from the palette with `md1HueTheme(primary, accent)`. It returns the light and dark maps for any primary hue and any of the sixteen accent-bearing hues, with the ink the palette recommends on each swatch. The dark map's `primary-ink` is computed from the hue: the first tone from the 500 toward the 50 that reaches 4.5:1 on the dark sheet under the selected band, so primary-coloured text stays readable on dark (the colour page's "lighter or darker tones of your primary color"). A theme written by hand instead of derived must set `--md1-primary-ink` itself; a derived one goes straight into the plugin:

```ts main.ts
import { createMd1Plugin, md1HueTheme } from '@paper/md1'

const teal = md1HueTheme('teal', 'red')

app.use(createMd1Plugin({
  theme: {
    themes: {
      'md1-light': { colors: teal.light },
      'md1-dark': { colors: teal.dark, dark: true },
    },
  },
}))
```

## Examples

::: ds-example
/systems/md1/color/palette

### The 2014 palette

Every hue of the palette, each swatch painted from its own `--md1-<hue>-<shade>` token and labelled in the ink the color page recommends for it, black or white. Hover a swatch for its token and hex value. Read across a row and the ink flips from black to white where the shade gets dark enough, at a different shade for every hue: Indigo turns at 300, Green at 600, Yellow and Amber never turn.

The guidelines suggest the 500 shades as primary colors and the other shades as their tones, with the A-series as accents. The palette is optional. A brand color from outside it works the same way, with a lighter and a darker tone of its own, but a theme built from the palette gets its ink for free from `md1PaletteInk`.
:::

::: ds-example
/systems/md1/color/ink

### Contested ink

Two revisions of the color page disagree about the ink on six swatches. The 2016 revision, carrying the original 2014 wording, prints white text on Pink 300, Blue 500, Light Blue 600, Light Green 700, Orange 800 and Deep Orange 500; the archived page prints black. Material Design 1 pins the archived page, so `md1PaletteInk` returns `#000000` for all six, and a theme derived from Blue or Deep Orange puts black ink on its primary.

Each tile shows both readings side by side. If your brand follows the older page, override `on-primary` (or `on-accent`) for that theme; the role is a single token and nothing else derives from it.
:::

::: ds-example
/systems/md1/color/themes

### Light and dark themes

The two theme figures from the color page, rebuilt from tokens: a status bar, an app bar, the background and a card. Each panel carries its own `data-theme`, which is all a subtree needs to switch: `md1-light` gives Grey 100 bars on a Grey 50 background under white cards, `md1-dark` gives Grey 900 bars on `#303030` under Grey 800 cards. The hue roles stay the same in both, apart from accent control; a Material Design 1 dark theme changes surfaces and ink, not hues.

Set the attribute on `<html>` for the whole app or on any element for a dark region inside a light page, such as a drawer or a media viewer. With `createMd1Plugin` installed, `useTheme().select('md1-dark')` writes it on `<html>` for you, and v0's `Theme` component scopes it to a subtree. Shadows are the same in both themes.
:::

::: ds-example
/systems/md1/color/text

### Text and icon opacity

The opacity tables of the color page: primary text at 87% black on light surfaces and 100% white on dark ones, secondary text at 54% and 70%, disabled and hint text at 38% and 50%, dividers at 12% in both. The same tables rank icons: active at 54% and 100%, inactive at 38% and 50%.

The guidelines prefer opacity to grey because an opacity keeps its contrast over any colored background, where a fixed grey such as `#727272` turns unreadable on magenta. White text on a colored background is always 100%. The type classes on the [Typography](/systems/md1/typography) page carry these tiers already: display styles and the caption read secondary, everything else primary.
:::

::: ds-example
/systems/md1/color/states

### State overlays

The overlays interactive components lay over their own surface, in both themes. Hover has no single value. The pages that state one win; elsewhere each component takes Vuetify 1.5's: 12% of the ink on buttons, bottom navigation and picker days, 4% black (8% white on dark) on lists and menus, 6% of the ink on steppers, and none on chips and tabs.[^v15-hover] Two of them are shared tokens: `--md1-list-hover` for the list rows and `--md1-hover`, the 6% black (10% white) that the text-fields page gives the box fill and the selection controls' halo reads at. Focus is a 12% overlay, pressed is `#999999` at 40% (`#CCCCCC` at 25% on dark), both from the buttons page.

Selection is the accent at 30%: the selection page names the accent and Material Design 1 chose the alpha. A disabled raised button is a 12% fill with its label at 26% black (30% white on dark). The two scrims sit outside this grid: 20% black under a bottom sheet, the only value the guidelines state, and Grey 900 at 46% under dialogs and the temporary drawer.
:::

::: ds-example
/systems/md1/color/override

### Another hue pair

Three themes from `md1HueTheme`, side by side: Indigo and Pink (the default), Teal and Red, Amber and Indigo. Each panel applies the derived role set as custom properties on its own element, so the `Md1Button` inside repaints without a second plugin: the raised button takes the primary, the flat one the accent. In an app the same maps go through `createMd1Plugin({ theme })` as shown above.

Amber is one of the hues whose 500 carries black ink, so the derived `on-primary` is `#000000` and the bar title turns black on its own. Choose an accent with enough contrast against your surfaces: the guidelines tell you to fall back to a darker or lighter tone of the accent hue when the A200 is too pale or too dark, and a pale accent such as Lime or Yellow A200 does not read as flat-button text on white.
:::

::: ds-example
/systems/md1/color/accents

### Primary and accent in use

Four screens that put the roles where the color page puts them. Bold color: the primary on the app bar under a status bar in its 700 tone, the 100 tone on the related information beneath, the accent on the floating action button, and the primary again as the accent of the phone icons. The settings screen reverses the pairing, the system bar in the primary and the app bar a darker tone, with the switch in the accent and the checkboxes taking the primary as their accent; on the very dark strip the switch picks a lighter tone of the accent by itself, because the dark theme's `accent-control` is the 200.

Text takes accents too. A headline can be set in the primary, linked text in the accent or the primary[^dark-primary-ink], and important text on a primary region in a tone of the accent that contrasts with it.[^accent-tone] The primary action button can take the accent, and a button resting on a primary region a lighter tone of the primary instead of the accent. The last screen does the opposite of the first: colorless bars and a white accent let a photograph carry the color, and a card in the primary's 100 tone with 700 ink is accented without leaving the hue.

Each variation is a role retuned on a subtree, as in the override example above: `--md1-accent` set to the primary for the checkboxes, `--md1-primary` set to the accent around the raised button. Components keep reading the same tokens.
:::

## Accessibility

The color page cites WCAG 2.0 AA: 4.5:1 for normal text and 3:1 for large text. The typography page sets 4.5:1 as its minimum and prefers 7:1. Primary text at 87% black on white measures about 16:1 and secondary text at 54% about 4.6:1; disabled text at 38% falls below 4.5:1 by design, because it marks a control that cannot be used.

Color is never the only signal. The guidelines ask for a state change shown in more than one way, an icon or a moved element beside the new color, and Material Design 1's components follow that: an error text field adds helper text under the red line, a selected checkbox draws a check mark as well as the accent. When you override a role, check the new `on-primary` and `on-accent` pairs against those ratios; `md1HueTheme` takes them from the palette's own recommendations, which assume large swatches, not small text.

[^list-hover]: Vuetify 1.5.24, stylus/settings/_theme.styl:52, 146. The `list-tile` hover, black 4% on light and white 8% on dark.

[^selection-alpha]: Our call: the selection page names the accent and states no opacity.

[^scrim]: Vuetify 1.5.24, stylus/components/_overlay.styl:22, 44. The overlay's `rgba(33, 33, 33)` fill at 0.46 opacity.

[^v15-hover]: Vuetify 1.5.24, stylus/components/_buttons.styl:54 (12% on buttons), stylus/settings/_theme.styl:52, 146 (lists and menus) and stylus/components/_steppers.styl:28 (steppers).

[^dark-primary-ink]: Our call: on the dark theme the example sets primary-coloured text and icons in the primary's 100, because Indigo 500 measures under 3:1 on `#303030`. Components keep the 500 on dark.

[^accent-tone]: Our call: the example mixes 35% accent into 65% white, because Pink A200 on Indigo 500 measures under 3:1.
