# Color (Material Design 1, 2014 to 2017 guidelines)

Spec note for `@paper/md1`. Pins the MD1 color palette, theme roles, system colors, and ink opacities so `theme.ts` and component styles never guess. Values are hex or percentages; dp equals px on the web (1:1).

Confidence legend: `high` = read from a spec page (text or a figure on that page); `moderate` = Vuetify 1.5.24 stylus only; `low` = memory. `not found` means no source had the value.

## Sources

The Wayback Machine served these captures. Where the requested timestamp was redirected to a neighbouring capture, the served timestamp is listed.

| Page | URL actually read | Capture served |
|---|---|---|
| Style / Color (2017 revision of the page, archived guidelines) | `http://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html` | 2018-12-25 00:21:49 (requested 20181225002255) |
| Style / Color (original 2014 wording, Google Design) | `http://web.archive.org/web/20160604084405/http://www.google.com/design/spec/style/color.html` | 2016-06-04 08:44:05 (requested 20160604061521) |
| Material design / Material properties | `http://web.archive.org/web/20181225002240/https://material.io/archive/guidelines/material-design/material-properties.html` | 2018-12-25 00:22:40 |
| Material design / Environment | `http://web.archive.org/web/20210805002434/https://material.io/archive/guidelines/material-design/environment.html` | 2021-08-05 00:24:34 (archive redirected from the 2018-12-25 request; same frozen archive page) |
| Material design / Introduction | `http://web.archive.org/web/20210815144307/https://material.io/archive/guidelines/material-design/introduction.html` | 2021-08-15 14:43:07 (archive redirected from the 2018-12-25 request) |
| Vuetify 1.5.24 palette | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/settings/_colors.styl` | local checkout |
| Vuetify 1.5.24 theme | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/settings/_theme.styl` | local checkout |
| Vuetify 1.5.24 JS palette copy | `/home/john/sites/vuetify1/packages/vuetify/src/util/colors.ts` | local checkout |
| Vuetify 1.5.24 JS theme defaults | `/home/john/sites/vuetify1/packages/vuetify/src/components/Vuetify/mixins/theme.ts` | local checkout |

Figures read from those pages (theme values and the 500/700/100/A200 structure exist only inside PNGs; all served through the same captures above):

- 2018 page assets: `style-color-themes-light1.png`, `style-color-themes-light2.png`, `style-color-themes-dark1.png`, `style-color-themes-dark2.png`, `style-color-colorscheme-palette1.png`, `style-color-uiapplication-palette1.png`, `style-color-uiapplication-palette2.png`, `style-color-colorsystem-pesto-palette-161116.png`, `style-color-uiapplication-accent2.png`.
- 2016 page assets: `style_color_colorscheme_palette1.png`, `style_color_colorscheme_palette1_example.png`, `style_color_uiapplication_palette1.png`, `style_color_uiapplication_palette2.png`, `style_color_colorscheme_accentcolor_appbar.png`.

Not read: the 2018-02-23 capture of `material.io/guidelines/style/color.html` (connection refused on every attempt; it was not needed because the 2018-12-25 page did not 404). WebFetch cannot reach web.archive.org; every page above was fetched with curl and parsed locally.

Revision note: the 2018-12-25 archive page is the 2017 revision of the color page (sections Color Tool, Color palette, Color system, Usability, Themes). The 2016 capture carries the original 2014 wording (Color palette, Color schemes, Text and background colors, Themes). The palette hex values, the opacity tables, and the theme figures are identical in both. The guidance prose differs: the 2014 text says "accent color" where the 2017 text says "secondary color". Both wordings are recorded below and labelled by year.

## 1. Palette

19 hues times 10 shades, plus 4 accents (A100, A200, A400, A700) on 16 hues, plus Black and White: 256 values. Brown, Grey, and Blue Grey have no accent series. Every value below was parsed from the 2018 page markup (`span.hex`), re-parsed from the 2016 page, and compared with Vuetify 1.5.24 `_colors.styl`: 256 of 256 values are identical across all three sources (case-insensitive; Vuetify stores most hues in lowercase). The JS copy `util/colors.ts` was diffed the same way: 256 of 256 match. No mismatch exists.

### 1.1 Hex values

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | A100 | A200 | A400 | A700 | V1.5 | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Red | #FFEBEE | #FFCDD2 | #EF9A9A | #E57373 | #EF5350 | #F44336 | #E53935 | #D32F2F | #C62828 | #B71C1C | #FF8A80 | #FF5252 | #FF1744 | #D50000 | match | high |
| Pink | #FCE4EC | #F8BBD0 | #F48FB1 | #F06292 | #EC407A | #E91E63 | #D81B60 | #C2185B | #AD1457 | #880E4F | #FF80AB | #FF4081 | #F50057 | #C51162 | match | high |
| Purple | #F3E5F5 | #E1BEE7 | #CE93D8 | #BA68C8 | #AB47BC | #9C27B0 | #8E24AA | #7B1FA2 | #6A1B9A | #4A148C | #EA80FC | #E040FB | #D500F9 | #AA00FF | match | high |
| Deep Purple | #EDE7F6 | #D1C4E9 | #B39DDB | #9575CD | #7E57C2 | #673AB7 | #5E35B1 | #512DA8 | #4527A0 | #311B92 | #B388FF | #7C4DFF | #651FFF | #6200EA | match | high |
| Indigo | #E8EAF6 | #C5CAE9 | #9FA8DA | #7986CB | #5C6BC0 | #3F51B5 | #3949AB | #303F9F | #283593 | #1A237E | #8C9EFF | #536DFE | #3D5AFE | #304FFE | match | high |
| Blue | #E3F2FD | #BBDEFB | #90CAF9 | #64B5F6 | #42A5F5 | #2196F3 | #1E88E5 | #1976D2 | #1565C0 | #0D47A1 | #82B1FF | #448AFF | #2979FF | #2962FF | match | high |
| Light Blue | #E1F5FE | #B3E5FC | #81D4FA | #4FC3F7 | #29B6F6 | #03A9F4 | #039BE5 | #0288D1 | #0277BD | #01579B | #80D8FF | #40C4FF | #00B0FF | #0091EA | match | high |
| Cyan | #E0F7FA | #B2EBF2 | #80DEEA | #4DD0E1 | #26C6DA | #00BCD4 | #00ACC1 | #0097A7 | #00838F | #006064 | #84FFFF | #18FFFF | #00E5FF | #00B8D4 | match | high |
| Teal | #E0F2F1 | #B2DFDB | #80CBC4 | #4DB6AC | #26A69A | #009688 | #00897B | #00796B | #00695C | #004D40 | #A7FFEB | #64FFDA | #1DE9B6 | #00BFA5 | match | high |
| Green | #E8F5E9 | #C8E6C9 | #A5D6A7 | #81C784 | #66BB6A | #4CAF50 | #43A047 | #388E3C | #2E7D32 | #1B5E20 | #B9F6CA | #69F0AE | #00E676 | #00C853 | match | high |
| Light Green | #F1F8E9 | #DCEDC8 | #C5E1A5 | #AED581 | #9CCC65 | #8BC34A | #7CB342 | #689F38 | #558B2F | #33691E | #CCFF90 | #B2FF59 | #76FF03 | #64DD17 | match | high |
| Lime | #F9FBE7 | #F0F4C3 | #E6EE9C | #DCE775 | #D4E157 | #CDDC39 | #C0CA33 | #AFB42B | #9E9D24 | #827717 | #F4FF81 | #EEFF41 | #C6FF00 | #AEEA00 | match | high |
| Yellow | #FFFDE7 | #FFF9C4 | #FFF59D | #FFF176 | #FFEE58 | #FFEB3B | #FDD835 | #FBC02D | #F9A825 | #F57F17 | #FFFF8D | #FFFF00 | #FFEA00 | #FFD600 | match | high |
| Amber | #FFF8E1 | #FFECB3 | #FFE082 | #FFD54F | #FFCA28 | #FFC107 | #FFB300 | #FFA000 | #FF8F00 | #FF6F00 | #FFE57F | #FFD740 | #FFC400 | #FFAB00 | match | high |
| Orange | #FFF3E0 | #FFE0B2 | #FFCC80 | #FFB74D | #FFA726 | #FF9800 | #FB8C00 | #F57C00 | #EF6C00 | #E65100 | #FFD180 | #FFAB40 | #FF9100 | #FF6D00 | match | high |
| Deep Orange | #FBE9E7 | #FFCCBC | #FFAB91 | #FF8A65 | #FF7043 | #FF5722 | #F4511E | #E64A19 | #D84315 | #BF360C | #FF9E80 | #FF6E40 | #FF3D00 | #DD2C00 | match | high |
| Brown | #EFEBE9 | #D7CCC8 | #BCAAA4 | #A1887F | #8D6E63 | #795548 | #6D4C41 | #5D4037 | #4E342E | #3E2723 | n/a | n/a | n/a | n/a | match | high |
| Grey | #FAFAFA | #F5F5F5 | #EEEEEE | #E0E0E0 | #BDBDBD | #9E9E9E | #757575 | #616161 | #424242 | #212121 | n/a | n/a | n/a | n/a | match | high |
| Blue Grey | #ECEFF1 | #CFD8DC | #B0BEC5 | #90A4AE | #78909C | #607D8B | #546E7A | #455A64 | #37474F | #263238 | n/a | n/a | n/a | n/a | match | high |

| Shade | Hex | V1.5 | Confidence |
|---|---|---|---|
| Black | #000000 | match (`$shades.black`) | high |
| White | #FFFFFF | match (`$shades.white`) | high |

Vuetify 1.5 also defines `$shades.transparent`; the spec has no such entry.

### 1.2 Recommended text color on each swatch

The page does not state text colors in prose. Each swatch carries a class on the 2018 page: `color-tag dark` renders dark (black) text on the swatch and `color-tag light` renders light (white) text. The 2016 page encodes the same thing with `li.color.dark` (black text) and `li.color` (white text). B = black text, W = white text, per the 2018 page. An asterisk marks the six swatches where the 2016 page disagrees (2016 renders white text there).

| Hue | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | A100 | A200 | A400 | A700 | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Red | B | B | B | B | W | W | W | W | W | W | B | W | W | W | high |
| Pink | B | B | B | B* | W | W | W | W | W | W | B | W | W | W | high |
| Purple | B | B | B | W | W | W | W | W | W | W | B | W | W | W | high |
| Deep Purple | B | B | B | W | W | W | W | W | W | W | B | W | W | W | high |
| Indigo | B | B | B | W | W | W | W | W | W | W | B | W | W | W | high |
| Blue | B | B | B | B | B | B* | W | W | W | W | B | W | W | W | high |
| Light Blue | B | B | B | B | B | B | B* | W | W | W | B | B | B | W | high |
| Cyan | B | B | B | B | B | B | B | W | W | W | B | B | B | B | high |
| Teal | B | B | B | B | B | W | W | W | W | W | B | B | B | B | high |
| Green | B | B | B | B | B | B | W | W | W | W | B | B | B | B | high |
| Light Green | B | B | B | B | B | B | B | B* | W | W | B | B | B | B | high |
| Lime | B | B | B | B | B | B | B | B | B | W | B | B | B | B | high |
| Yellow | B | B | B | B | B | B | B | B | B | B | B | B | B | B | high |
| Amber | B | B | B | B | B | B | B | B | B | B | B | B | B | B | high |
| Orange | B | B | B | B | B | B | B | B | B* | W | B | B | B | B | high |
| Deep Orange | B | B | B | B | B | B* | W | W | W | W | B | B | W | W | high |
| Brown | B | B | B | W | W | W | W | W | W | W | n/a | n/a | n/a | n/a | high |
| Grey | B | B | B | B | B | B | W | W | W | W | n/a | n/a | n/a | n/a | high |
| Blue Grey | B | B | B | B | W | W | W | W | W | W | n/a | n/a | n/a | n/a | high |

| Shade | Text | Confidence |
|---|---|---|
| Black | W | high |
| White | B | high |

2016 versus 2018 disagreements (2018 black text, 2016 white text): Pink 300, Blue 500, Light Blue 600, Light Green 700, Orange 800, Deep Orange 500. The 2016 page additionally tags the large Orange 500 and Grey 500 header swatches `dark-when-small`, meaning black text only at small swatch sizes. Treat the 2018 column as the pinned value and the six cells as contested.

### 1.3 Figure versus table disagreement

The "color scheme" illustration on both pages (`style-color-colorscheme-palette1.png`, 2016 `style_color_colorscheme_palette1.png`) prints Purple 500 as #9B26AF, Purple 700 as #7A1EA1, Purple 800 as #691A99, and Green A200 as #68EFAD. The palette table prints #9C27B0, #7B1FA2, #6A1B9A, and #69F0AE. Every channel in the figure is one unit low. The table wins; the figure values are not palette entries.

### 1.4 Vuetify 1.5 naming map

| Spec shade | Vuetify 1.5 key | Confidence |
|---|---|---|
| 50 | `lighten-5` | moderate |
| 100 | `lighten-4` | moderate |
| 200 | `lighten-3` | moderate |
| 300 | `lighten-2` | moderate |
| 400 | `lighten-1` | moderate |
| 500 | `base` | moderate |
| 600 | `darken-1` | moderate |
| 700 | `darken-2` | moderate |
| 800 | `darken-3` | moderate |
| 900 | `darken-4` | moderate |
| A100 | `accent-1` | moderate |
| A200 | `accent-2` | moderate |
| A400 | `accent-3` | moderate |
| A700 | `accent-4` | moderate |

Vuetify hue keys: `red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `blue-grey`, `grey`, `shades`. Moderate.

## 2. Theme roles

### 2.1 How a theme is built

| Role | Rule | Example from the spec figures | Source | Confidence |
|---|---|---|---|---|
| Primary | The 500 shade of one hue. "Google suggests using the 500 colors as the primary colors in your app and the other colors as accents colors." Applied to large UI areas: toolbar, status bar, app bar. | Indigo 500 #3F51B5 | 2016 and 2018 text, `uiapplication-palette1.png` | high |
| Dark primary | The 700 shade of the primary hue. "In this example, the toolbar uses the 500 version of indigo, while the status bar uses the 700 version." 2018 wording: "The system bar uses the primary color, while the toolbar uses a darker variation of the primary color." | Indigo 700 #303F9F | 2016 text, `uiapplication-palette1.png`, `uiapplication-accent2.png` | high |
| Light primary | The 100 shade of the primary hue. "Beneath the region using the primary color, related information is colored with a lighter version of the primary color." | Indigo 100 #C5CAE9 | `uiapplication-palette1.png`, 2018 caption | high |
| Primary tones in general | "To create contrast between elements, you can use lighter or darker tones of your primary color", for example between the status bar and a toolbar. A brand color outside the palette gets a Lighter and a Darker tone the same way. | Pesto Green #00AA8D, lighter #00BF9A, darker #008975 | 2018 text, `colorsystem-pesto-palette-161116.png` | high |
| Accent (2014 name) / Secondary (2017 name) | The A200 shade of a second hue. "Limit your selection of colors to three hues from the primary palette and one accent color from the secondary palette." (2016). The secondary color "should not simply be a light or dark variation of your primary color" and is "applied sparingly as an accent" (2018). Optional in 2018: "It's not necessary if you use variations of your primary color to accent elements." | Pink A200 #FF4081 | 2016 text, 2018 text, `uiapplication-palette2.png` | high |
| Accent fallbacks | A100 and A400 of the accent hue. "If your accent color is too light or dark to sufficiently contrast with the background color, use a darker shade or lighter tint of the accent color instead." | Pink A100 #FF80AB, Pink A400 #F50057 | `uiapplication-palette2.png` (labelled "Fallback"), 2016 and 2018 text | high |
| Alternative accent on white | "Another alternative accent color is the 500 version of your primary color on white backgrounds." | Primary 500 | 2016 text | high |
| Accent on a primary 500 surface | "If your background color is already the 500 version of your primary color, make your accent color either white 100% or black 54%." | White 100% or Black 54% | 2016 text | high |
| Text and icons on primary | "White text appearing on colored backgrounds should do so at an opacity of 100%." The swatch text-color classes in 1.2 say which 500 shades take black text instead. | White 100% | 2016 and 2018 text | high |
| Dividers | Black 12% on light, White 12% on dark. Icons and dividers use "a hex value of black or white (rather than a specific color) at 38% opacity so that they work on backgrounds of any color" (2016; 2018 says the same for icons only). | rgba(0,0,0,.12) / rgba(255,255,255,.12) | opacity tables | high |
| Hue budget | Three hues from the primary palette plus one accent hue (2016). 2018 drops the count and says primary plus optional secondary. | 3 + 1 | 2016 text | high |

Vuetify 1.5 cross-check: `_theme.styl` has no primary/accent roles; they live in `components/Vuetify/mixins/theme.ts` (`THEME_DEFAULTS`): `primary: #1976D2` (Blue 700), `secondary: #424242` (Grey 800), `accent: #82B1FF` (Blue A100), `error: #FF5252` (Red A200), `info: #2196F3` (Blue 500), `success: #4CAF50` (Green 500), `warning: #FB8C00` (Orange 600). Moderate. Vuetify therefore does not follow the spec rule above (primary is a 700 shade, accent an A100), and it adds `secondary`, `error`, `info`, `success`, `warning` roles that the color page never defines. The stylus file only sets `text.theme: white`, which matches "white text on colored backgrounds at 100%".

### 2.2 Derived default theme set per hue

Mechanically derived from table 1.1 with the 500 / 700 / 100 / A200 rule above; text-on-500 comes from table 1.2. Values are spec values (high); the composition rule is spec guidance (high); the pairing of a given hue with a given accent hue is the implementer's choice and not in the spec.

| Hue | Primary 500 | Dark primary 700 | Light primary 100 | Own A200 (accent if this hue is the accent hue) | Text on 500 | Confidence |
|---|---|---|---|---|---|---|
| Red | #F44336 | #D32F2F | #FFCDD2 | #FF5252 | W | high |
| Pink | #E91E63 | #C2185B | #F8BBD0 | #FF4081 | W | high |
| Purple | #9C27B0 | #7B1FA2 | #E1BEE7 | #E040FB | W | high |
| Deep Purple | #673AB7 | #512DA8 | #D1C4E9 | #7C4DFF | W | high |
| Indigo | #3F51B5 | #303F9F | #C5CAE9 | #536DFE | W | high |
| Blue | #2196F3 | #1976D2 | #BBDEFB | #448AFF | B* | high |
| Light Blue | #03A9F4 | #0288D1 | #B3E5FC | #40C4FF | B | high |
| Cyan | #00BCD4 | #0097A7 | #B2EBF2 | #18FFFF | B | high |
| Teal | #009688 | #00796B | #B2DFDB | #64FFDA | W | high |
| Green | #4CAF50 | #388E3C | #C8E6C9 | #69F0AE | B | high |
| Light Green | #8BC34A | #689F38 | #DCEDC8 | #B2FF59 | B | high |
| Lime | #CDDC39 | #AFB42B | #F0F4C3 | #EEFF41 | B | high |
| Yellow | #FFEB3B | #FBC02D | #FFF9C4 | #FFFF00 | B | high |
| Amber | #FFC107 | #FFA000 | #FFECB3 | #FFD740 | B | high |
| Orange | #FF9800 | #F57C00 | #FFE0B2 | #FFAB40 | B | high |
| Deep Orange | #FF5722 | #E64A19 | #FFCCBC | #FF6E40 | B* | high |
| Brown | #795548 | #5D4037 | #D7CCC8 | n/a (no accent series) | W | high |
| Grey | #9E9E9E | #616161 | #F5F5F5 | n/a (no accent series) | B | high |
| Blue Grey | #607D8B | #455A64 | #CFD8DC | n/a (no accent series) | W | high |

Asterisk: contested between the 2016 and 2018 pages (see 1.2).

## 3. System colors (light and dark themes)

"Themes let you apply a consistent tone to an app. The theme specifies the darkness of the surfaces, level of shadow, and appropriate opacity of ink elements. To promote greater consistency between apps, light and dark themes are available to choose from." Both pages list four surfaces (1. Status bar, 2. App bar, 3. Background, 4. Cards/Dialogs); the hex values are printed only in the figures `style-color-themes-light1.png` and `style-color-themes-dark1.png`, read directly.

| Surface | Light theme | Dark theme | Vuetify 1.5 `_theme.styl` | Confidence |
|---|---|---|---|---|
| 1. Status bar | Grey 300 #E0E0E0 | Black 100% #000000 | light `status-bar.regular: $grey.lighten-2` (#E0E0E0), dark `$shades.black`: match | high |
| 2. App bar | Grey 100 #F5F5F5 | Grey 900 #212121 | light `app-bar: $grey.lighten-4` (#F5F5F5), dark `$grey.darken-4` (#212121): match | high |
| 3. Background | Grey 50 #FAFAFA | #303030 (no palette name; not a palette value) | light `background: $grey.lighten-5` (#FAFAFA), dark `#303030`: match | high |
| 4. Cards/Dialogs | White #FFFFFF | Grey 800 #424242 | light `cards: $shades.white`, dark `$grey.darken-3` (#424242): match | high |

No other surface is listed on the color page. Snackbars, bottom sheets, menus, and navigation drawers take their surface colors from their own component pages, not from this page (not found here).

### 3.1 Vuetify 1.5 theme values with no counterpart on the color page

Recorded for implementers because `_theme.styl` is the reference implementation; none of these is on the spec color page, so all are moderate.

| Vuetify key | Light | Dark | Confidence |
|---|---|---|---|
| `status-bar.lights-out` | rgba(255,255,255,.7) | rgba(0,0,0,.2) | moderate |
| `text.link` | Blue 700 #1976D2 | Blue A100 #82B1FF | moderate |
| `text.link-hover` | Grey 800 #424242 | Grey 200 #EEEEEE | moderate |
| `chips.background` / `chips.color` | Grey 300 #E0E0E0 / rgba(0,0,0,.87) | #555555 / #FFFFFF | moderate |
| `input-bottom-line` | rgba(0,0,0,.42) | rgba(255,255,255,.7) | moderate |
| `inputs.box` | rgba(0,0,0,.04) | #FFFFFF | moderate |
| `inputs.solo-inverted` / `-focused` / `-focused-text` | rgba(0,0,0,.16) / Grey 800 #424242 / #FFFFFF | rgba(255,255,255,.16) / #FFFFFF / rgba(0,0,0,.87) | moderate |
| `text-fields.box` / `box-hover` / `box-focus` | rgba(0,0,0,.06) / rgba(0,0,0,.12) / not defined | rgba(0,0,0,.1) / rgba(0,0,0,.2) / rgba(0,0,0,.3) | moderate |
| `buttons.disabled` | rgba(0,0,0,.26) | rgba(255,255,255,.3) | moderate |
| `buttons.focused` / `focused-alt` | rgba(0,0,0,.12) / rgba(255,255,255,.6) | rgba(255,255,255,.12) / rgba(255,255,255,.1) | moderate |
| `buttons.pressed` | rgba(153,153,153,.4) | rgba(204,204,204,.25) | moderate |
| `list-tile.hover` | rgba(0,0,0,.04) | rgba(255,255,255,.08) | moderate |
| `expansion-panels.focus` | Grey 200 #EEEEEE | #494949 | moderate |
| `selection-controls.thumb.inactive` / `disabled` | Grey 50 #FAFAFA / Grey 400 #BDBDBD | Grey 400 #BDBDBD / Grey 800 #424242 | moderate |
| `selection-controls.track.inactive` / `disabled` | rgba(0,0,0,.38) / rgba(0,0,0,.12) | rgba(255,255,255,.3) / rgba(255,255,255,.1) | moderate |
| `slider.active` / `inactive` / `disabled` / `discrete` | rgba(0,0,0,.38) / rgba(0,0,0,.26) / rgba(0,0,0,.26) / #000000 | rgba(255,255,255,.3) / rgba(255,255,255,.2) / rgba(255,255,255,.2) / #FFFFFF | moderate |
| `tabs.active` | rgba(0,0,0,.87) | #FFFFFF | moderate |
| `stepper.active` / `completed` / `hover` | #FFFFFF / rgba(0,0,0,.87) / rgba(0,0,0,.54) | #FFFFFF / rgba(255,255,255,.87) / rgba(255,255,255,.75) | moderate |
| `table.active` / `hover` / `border` | Grey 100 #F5F5F5 / Grey 200 #EEEEEE / Grey 300 #E0E0E0 | #505050 / Grey 700 #616161 / Grey 700 #616161 | moderate |
| `picker.body` / `clock` / `indeterminateTime` / `title` | #FFFFFF / Grey 300 #E0E0E0 / Grey 400 #BDBDBD / Grey 300 #E0E0E0 | Grey 800 #424242 / Grey 700 #616161 / Grey 600 #757575 / Grey 700 #616161 | moderate |
| `calendar.background-color` / `outside-background-color` / `line-color` / `past-color` | #FFFFFF / #F7F7F7 / #E0E0E0 / rgba(0,0,0,.38) | #303030 / #202020 / Grey 500 #9E9E9E / rgba(255,255,255,.5) | moderate |
| `bg-color` / `fg-color` / `text-color` | #FFFFFF / #000000 / #000000 | #303030 / #FFFFFF / #FFFFFF | moderate |

## 4. Text, icon, and divider opacity

Both pages print the same four tables. Row labels differ slightly: the 2016 table reads "Disabled text, hint text, and icons" where the 2018 table reads "Disabled text, hint text".

| Ink role | Dark ink (#000000) on light backgrounds | Light ink (#FFFFFF) on dark backgrounds | Vuetify 1.5 (`primary-text-percent` etc.) | Confidence |
|---|---|---|---|---|
| Primary text | 87% | 100% | .87 / 1: match | high |
| Secondary text | 54% | 70% | .54 / .70: match | high |
| Disabled text, hint text | 38% | 50% | .38 / .50 (`disabledORhints-text-percent`): match | high |
| Dividers | 12% | 12% | .12 / .12: match | high |
| Active icon | 54% | 100% | .54 / 1: match | high |
| Inactive icon | 38% | 50% | .38 / .50: match | high |

Rules attached to the tables:

- "White text appearing on colored backgrounds should do so at an opacity of 100%."
- Icons (2016: icons and dividers) "benefit from having a hex value of black or white (rather than a specific color) at 38% opacity so that they work on backgrounds of any color."
- "Using opacity instead of shifting colors often creates better contrast and relative luminance." Grey text #727272 is the spec's negative example: it "becomes hard to read if the background color changes to magenta"; black at 0.54 opacity is the positive example. #727272 is therefore not a palette or role value.
- "The Web Content Accessibility Guidelines (WCAG 2.0) level AA requires a contrast ratio of 4.5:1 for normal text and a 3:1 ratio for large text." (2018)
- "Dark gray text is used on light backgrounds. Light gray text is used on dark backgrounds. If your app has both light and dark themes, the text should be available in a contrasting color against each theme." (2018)

## 5. Usage guidance that shapes the API

Quoted or closely paraphrased; year marks the page revision. All high.

Primary color

- "A primary color is the color displayed most frequently across your app's screens and components. It can also be used to accent elements, if you don't have a secondary color." (2018)
- "Large UI areas and elements should be colored with your primary color." (2018) "The App bar, toolbar and system status bar can be customized using your palette" (2016).
- "Use the primary color to accent elements, such as buttons or checkboxes." "To indicate that buttons and checkboxes are selected, use the primary color as an accent." (2018)
- "You can use your primary color in a different tone on elements that rest on top of a primary color region (like this floating action button)." (2018)
- "You can use your primary color as a link accent." (2018)
- "Elements that appear rarely, such as alerts, should be distinct from other elements and not use your primary color." (2018)

Accent / secondary color

- Where it goes (2016 list): the floating action button and interactive elements: "Text fields and cursors; Text selection; Progress bars; Selection controls, buttons, and sliders; Links". The 2018 list adds "Buttons, floating action buttons, and button text" and "Headlines".
- "Use the accent color for your primary action button and components like switches or sliders." (2016) "Use your secondary color for your primary action button." (2018)
- Limits: "Don't use the accent color for app bars or larger areas of color. Avoid using the same color for the floating action button and the background." (2016) "Don't use the secondary color for app bars, larger areas of color, or the floating action button if it rests on a background of that color." (2018)
- Body text: "Only use the accent color for body text to accent a web link." "Don't use the accent color for body text color." (2016) "Don't use bright colors for body text, even if your primary or secondary colors are bright." (2018)
- "Secondary colors, and anything used to accent parts of the UI, should be used sparingly." (2018)
- "Use a monochromatic color as an accent to let imagery and other colorful elements take prominence." "Secondary color schemes do not have to be colorful." (2018)
- Contrast fallback: use a lighter or darker tone of the accent against very light or very dark backgrounds; never place the accent on a background without enough contrast (2016 and 2018).
- "The secondary color may be a darker or lighter variation of the primary color." (2016) The 2018 text reverses this: "it should not simply be a light or dark variation of your primary color." Record both; the 2018 text is the pinned one.

Colored text

- "Use colored text on colored backgrounds sparingly, limiting usage to important text elements." "Avoid placing a large amount of colored text on colored backgrounds." (2018)
- "Use your primary or secondary color to emphasize select shorter text, such as headlines." (2018)
- "You can use a darker or lighter tone of color to create a monochrome, yet accentuated, look." "Don't place low-contrast tones of the same color against each other." (2018)

Hierarchy, meaning, state (2018 Usability section)

- "A brightly colored button on a colorless background makes that button stand out. Alternatively, colorless bars and buttons allow bright content to take prominence in a UI."
- "Color can provide information about an element's current state, such as if a button is enabled or disabled" and about "an app or element's change of state."
- "Color that indicates a change of state should be noticeable, as subtle differences in color may be missed. It's best to indicate a change of state in more than one way, such as displaying an icon or moving the location of an element."
- Error example: "The red color in the label and helper text indicate error messages." "The color changes from blue to red to indicate different states." No error hex is given on this page (not found; the Text fields page owns it).
- "Additional affordances, beyond color, should be used to convey information." "To accommodate all users, offer enlarged text settings."

Palette use

- "Using colors from the Material Design palette is optional." (2018) "Your app's color palette may be defined by using a custom palette suited to your brand, such as monochromatic, black and white, full color, or neutral." (2016)
- "All color palettes should include sufficient contrast between different UI elements." (2016)

## 6. Physical model (Environment, Material properties)

This section only informs elevation and shadow work; the Elevation note owns the dp table.

| Fact | Value | Confidence |
|---|---|---|
| Space | "Material design is a three-dimensional environment containing light, material, and cast shadows." Objects have x, y, and z dimensions; the z-axis is perpendicular to the display with positive z toward the viewer. | high |
| Material thickness | 1dp, uniform; "equivalent to one pixel of thickness on screens with a pixel density of 160". Height and width vary; thickness never does. | high |
| z position | "Every sheet of material occupies a single position along the z-axis." | high |
| Light sources | Two: "Key lights create directional shadows, while ambient light creates soft shadows from all angles." Shadows are cast by these two sources and "result naturally from the relative elevation (z-position) between material elements." | high |
| Web rendering | "On the web, the z-axis is used for layering and not for perspective. The 3D world is emulated by manipulating the y-axis." "On the web, shadows are depicted by manipulating the y-axis only." The page example card sits at 6dp. | high |
| Shadow rule | "Shadows are never approximated by coloring material." | high |
| Content | "Content is displayed on material, in any shape and color. Content does not add thickness to material." Content may behave independently but stays within the bounds of its material. | high |
| Solidity | "Input events cannot pass through material"; they "only affect the foreground material". "Multiple material elements cannot occupy the same point in space simultaneously"; elevation is the stated way to separate them. "Material cannot pass through other material" when changing elevation. | high |
| Shape | Material "grows and shrinks only along its plane" and "never bends or folds". Sheets can join into one sheet, split, and heal. | high |
| Motion | Material "can be spontaneously generated or destroyed anywhere in the environment" and "can move along any axis". "Z-axis motion is typically a result of user interaction with material." | high |

Material characteristics list, verbatim from the page header: Solid; Occupies unique points in space; Impenetrable; Mutable shape; Changes in size only along its plane; Unbendable; Can join to other material; Can separate, split, and heal; Can be created or destroyed; Moves along any axis.

## 7. Introduction (context only)

- Goal: "Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science." and "Develop a single underlying system that allows for a unified experience across platforms and device sizes. Mobile precepts are fundamental, but touch, voice, mouse, and keyboard are all first-class input methods." High.
- Principles: "Material is the metaphor" (surfaces and edges grounded in paper and ink; realistic lighting shows seams, divides space, indicates moving parts); "Bold, graphic, intentional" (typography, grids, space, scale, color, imagery create hierarchy, meaning, focus; "Deliberate color choices, edge-to-edge imagery, large-scale typography, and intentional white space"); "Motion provides meaning" (motion initiated by primary user actions, in a single environment, continuity preserved). High.
- The page carries no numeric values.

## 8. Not found

- A palette name for the dark theme background #303030: none on the page (it is not a Grey shade).
- Status bar "lights out" or translucent variants: not on the color page (Vuetify-only, see 3.1).
- Hex values for the error red, link colors, ripple, hover, pressed, or focus overlays: not on the color page. Vuetify 1.5 values for those are in 3.1 as moderate.
- A text-color recommendation for the custom Pesto Green example: the figure shows white labels but no stated rule.
