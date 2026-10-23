# MD1 typography (Material Design 1)

Pinned spec for the `@paper/md1` type system: Roboto and Noto, the MD1 type scale, leading, tracking, script categories, line length, and text opacity. Values are copied from the archived guidelines; Vuetify 1.5.24 is the cross-check and the spec wins where they differ.

Units: the spec writes `sp` for type size and `dp` for leading. On the web both are `px` at 1:1 (family convention). `sp` exists so platforms can scale type for accessibility; whether MD1 expresses sizes in `px` or `rem` is an implementation decision, not a spec value.

## Sources

Fetched 2026-10-22 with `curl` (the WebFetch tool is blocked for web.archive.org). The HTML was stripped to text; every numeric table on the typography page is an image with empty `alt`, so those images were downloaded from the same crawl and read visually.

| Source | URL | Snapshot |
|---|---|---|
| Typography page (text) | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/typography.html | 2018-12-25 00:22:55 |
| Type scale image | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3alhXZ2pPWGk3Zjg/style-typography-styles-scale.png | 2018-12-25 00:22:06 |
| Leading image (English) | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3Q1VaNVBsdFozUTg/style-typography-styles-lineheight1.png | 2018-12-25 00:22:06 |
| Leading pairing images | `style-typography-styles-lineheight2.png`, `style-typography-styles-lineheight3.png` (same asset path pattern) | 2018-12-25 00:22:06 |
| Tracking image | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3LUZGWGdtZmFfUU0/style-typography-styles-tracking.png | 2018-12-25 00:22:06 |
| Dense scale image | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3N3d4REJ0enZqd2M/style-typography-style1.png | 2018-12-25 00:22:06 |
| Tall scale image | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3ek5vUE41WjNOSmM/style-typography-style3.png | 2018-12-25 00:22:06 |
| Leading image (dense and tall) | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3bW9GQUFPTXlTbWc/style-typography-lineheight-tall1.png | 2018-12-25 00:22:06 |
| Line length images | `style-typography-styles-linelengths1.png`, `style-typography-styles-linelengths2.png` | 2018-12-25 00:22:06 |
| Weight images | `style-typography-weights1.png` (Roboto), `style-typography-weight1.png` (Noto Sans CJK), `style-typography-weight2.png` (Noto Sans Thai, Devanagari) | 2018-12-25 00:22:06 |
| Per-style opacity image | https://web.archive.org/web/20181225002206im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3dGx2T1FqM0xXbTA/style-typography-styles-contrast.png | 2018-12-25 00:22:06 |
| Hero image | `style-typography.png` (repeats the scale) | 2018-12-25 00:22:06 |
| Color page, "Text on backgrounds" (cross-reference only) | https://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html | 2018-12-25 00:21:49 |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/settings/_theme.styl`, `settings/_variables.styl`, `elements/_typography.styl`, `elements/_global.styl`, `trumps/_text.styl`, `components/_buttons.styl`, `_toolbar.styl`, `_tabs.styl`, `_lists.styl`, `_subheaders.styl`, `_inputs.styl`, `_labels.styl`, `_chips.styl`, `_snackbars.styl`, `_tooltips.styl`, `_tables.styl`, `_data-table.styl`, `_steppers.styl`, `_bottom-navs.styl`, `_counters.styl`, `_messages.styl`, `_navigation-drawer.styl`, `_breadcrumbs.styl`, `_badges.styl`, `_alerts.styl` | local checkout |

Confidence legend: `high` = read from the spec page or its images; `moderate` = Vuetify 1.5 stylus only; `low` = memory; `derived` = arithmetic on high values.

## Page header quick reference

The page opens with a summary block. Copied verbatim.

| Item | English | Dense | Tall | Confidence |
|---|---|---|---|---|
| App bar | Title style, Medium 20sp | (same statement, no variant given) | (same) | high |
| Buttons | Medium 14sp, all caps | Medium 15sp, all caps | Bold 15sp | high |
| Subheading | Regular 16sp (device), 15sp (desktop) | Regular 17sp (device), 16sp (desktop) | Regular 17sp (device), 16sp (desktop) | high |
| Body 1 | Regular 14sp (device), 13sp (desktop) | Regular 15sp (dense), 14sp (desktop) | Regular 15sp (device), 14sp (desktop) | high |
| Text contrast ratio | Minimum 4.5:1, preferred 7:1 | same | same | high |

"Device" means phones and tablets (touch); "desktop" means mouse and keyboard layouts. The page does not say how a web implementation should pick between the two; Vuetify 1.5 ships the device sizes everywhere (see cross-check). That choice is open for MD1.

## Language categories

| Category | Scripts | Fonts | Confidence |
|---|---|---|---|
| English and English-like | Latin (except Vietnamese), Greek, Cyrillic; the reference table also lists Hebrew, Armenian, Georgian here | Roboto and Noto; Roboto covers all Latin, Greek, and Cyrillic in Unicode 7.0 (about 4000 characters, doubled from about 2000) | high |
| Dense | Chinese, Japanese, Korean | Noto Sans CJK, seven weights | high |
| Tall | South and Southeast Asian and Middle Eastern scripts: Arabic, Hindi, Telugu, Thai, Vietnamese, and others | Noto, two weights (Regular, Bold) | high |

Language code table from the page (for a `lang`-driven switch):

| Category | Codes | Confidence |
|---|---|---|
| Tall | ar, bn, fa, gu, hi, km, kn, lo, ml, mr, my, ne, pa, si, ta, te, th, ur, vi | high |
| Dense | ja, ko, zh-CN, zh-HK, zh-TW | high |
| English-like | af, am, az, bg, ca, cs, cy, da, de, el, en, en-GB, es, es-419, et, eu, fi, fil, fr, fr-CA, gl, hr, hu, hy, id, is, it, iw, ka, kk, ky, lt, lv, mk, mn, ms, nl, no, pl, pt, pt-PT, ro, ru, sk, sl, sq, sr, sr-Latn, sv, sw, tr, uk, uz, zu | high |

## Typeface

| Rule | Value | Confidence |
|---|---|---|
| Standard typeface | Roboto on Android; Noto for all languages Roboto does not cover (Chrome and Android) | high |
| Font stack | Roboto, then Noto, then sans-serif, for both Android and web properties | high |
| Noto metrics | Noto's vertical metrics are compatible with Roboto | high |
| Hinting | Use unhinted Roboto and Noto on Android and Mac OS X; use hinted fonts on Chrome OS, Windows, and Linux. Hinted files are larger | high |
| Vuetify 1.5 `$body-font-family` | `'Roboto', sans-serif` (no Noto) | moderate |

CSS equivalent of the spec stack: `font-family: Roboto, Noto, sans-serif` (derived). Vuetify 1.5 omits Noto; the spec stack wins.

## Font weights

The page names weights; it does not print numeric values. Numeric values come from Vuetify 1.5 `$font-weights` and match the CSS standard mapping.

| Weight name | Numeric | Roboto | Noto Sans CJK | Noto (Thai, Devanagari, other living languages) | Confidence |
|---|---|---|---|---|---|
| Thin | 100 | yes | yes | no | name high; number moderate |
| Light | 300 | yes | yes | no | name high; number moderate |
| DemiLight | not found | no | yes | no | name high; number not found (CSS has no standard keyword; 350 is a common vendor mapping, low) |
| Regular | 400 | yes | yes (same weight as Roboto Regular) | yes | name high; number moderate |
| Medium | 500 | yes | yes | no | name high; number moderate |
| Bold | 700 | yes | yes | yes | name high; number moderate |
| Black | 900 | yes | yes | no | name high; number moderate |

Roboto ships each of its six weights in upright and italic (image `style-typography-weights1.png`). The type scale uses only Light, Regular, and Medium (Bold appears only in the tall-script table).

## Type scale, English and English-like scripts

"The basic set of styles are based on a typographic scale of 12, 14, 16, 20, and 34." Weights and sizes are from `style-typography-styles-scale.png`; leading from `style-typography-styles-lineheight1.png`; tracking from `style-typography-styles-tracking.png`; case from the scale image and the page text.

| Style | Weight | Numeric weight | Size device (sp) | Size desktop (sp) | Leading (dp) | Tracking (raw) | Case | Wraps | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| Display 4 | Light | 300 | 112 | 112 | not found (single line) | -10 | sentence | no | high |
| Display 3 | Regular | 400 | 56 | 56 | not found (single line) | -5 | sentence | no | high |
| Display 2 | Regular | 400 | 45 | 45 | 48 | 0 | sentence | yes | high |
| Display 1 | Regular | 400 | 34 | 34 | 40 | 0 | sentence | yes | high |
| Headline | Regular | 400 | 24 | 24 | 32 | 0 | sentence | yes | high |
| Title | Medium | 500 | 20 | 20 | not found (single line) | 5 | sentence | no | high |
| Subheading | Regular | 400 | 16 | 15 | 24 (Subheading 1) or 28 (Subheading 2) | 10 | sentence | yes | high |
| Body 2 | Medium | 500 | 14 | 13 | 24 | 10 | sentence | yes | high |
| Body 1 | Regular | 400 | 14 | 13 | 20 | 10 | sentence | yes | high |
| Caption | Regular | 400 | 12 | 12 | not found (single line) | 20 | sentence | no | high |
| Button | Medium | 500 | 14 | 14 | not found (single line) | 10 | ALL CAPS | no | high |
| Menu | not found | not found | not found | not found | not found | not found | not found | not found | style exists (listed in the opacity image at Black 87%) but no metrics appear on the archived scale, leading, or tracking images. Memory, low: earlier revisions listed Menu as Medium 14sp (device), 13sp (desktop), single line |

Numeric weights in this table are the name-to-number mapping above (moderate for the number, high for the name).

Notes copied from the page:

- "Line wrapping only applies to Body, Subhead, Headline, and the smaller Display styles. All other styles should exist as single lines." (high)
- Subheading 1 (leading 24dp) is the subheading used under a Display or Headline; Subheading 2 (leading 28dp) is the two-line subheading paired with Body text (pairing image `lineheight2.png`, labels 3A and 3B). (high)
- "Across form factors, text that appears in the app bar should use the Title style, Medium 20sp." (high)
- "In certain scenarios, use the larger subheading style instead of the smaller Body style. Some of those scenarios include when information is presented as small snippets or when titles are paired with lines of Body-styled text." (high)
- "Button style (Medium 14sp, all caps) is used for all buttons. Button text should be all caps in languages that have capitalization. For languages that don't have capitals, consider using color text for flat buttons to make them stand out from normal text." (high)
- Leading is given as an absolute dp value, not a ratio. (high)

Derived line-height ratios for CSS (arithmetic on the high values, device size):

| Style | Leading / size | Ratio | Confidence |
|---|---|---|---|
| Display 2 | 48 / 45 | 1.067 | derived |
| Display 1 | 40 / 34 | 1.176 | derived |
| Headline | 32 / 24 | 1.333 | derived |
| Subheading 1 | 24 / 16 (24 / 15 desktop) | 1.5 (1.6) | derived |
| Subheading 2 | 28 / 16 (28 / 15 desktop) | 1.75 (1.867) | derived |
| Body 2 | 24 / 14 (24 / 13 desktop) | 1.714 (1.846) | derived |
| Body 1 | 20 / 14 (20 / 13 desktop) | 1.429 (1.538) | derived |

Absolute px line-heights are the faithful implementation; the ratios exist only for comparison with Vuetify 1.5.

### Tracking unit

The tracking image prints bare numbers (-10, -5, 0, 5, 10, 20) with no unit. The page text under "Tracking and kerning" is only the image. The unit is therefore `not found` on the page. The conventional reading of bare tracking numbers in Google's spec art is Adobe tracking units, 1/1000 em (low). Under that reading:

| Raw tracking | em | Styles | Confidence |
|---|---|---|---|
| -10 | -0.01em | Display 4 | high raw; low unit |
| -5 | -0.005em | Display 3 | high raw; low unit |
| 0 | 0 | Display 2, Display 1, Headline | high |
| 5 | 0.005em | Title | high raw; low unit |
| 10 | 0.01em | Subheading, Body 2, Body 1, Button | high raw; low unit |
| 20 | 0.02em | Caption | high raw; low unit |

Vuetify 1.5 does not use these values (see cross-check); MD1 should carry the raw numbers as tokens and pick the unit once, in one place.

## Type scale, dense scripts (Chinese, Japanese, Korean)

Rules from the page text: "Weight: Since Noto CJK has seven weights that match Roboto, use the same weight settings as English. Font size: For Title through Caption styles, the font size is 1px larger than that specified for English. For styles larger than Title, the English type size is suitable." Table from `style-typography-style1.png`.

| Style | Weight | Size device (sp) | Size desktop (sp) | Case | Confidence |
|---|---|---|---|---|---|
| Display 4 | Light | 112 | 112 | sentence | high |
| Display 3 | Regular | 56 | 56 | sentence | high |
| Display 2 | Regular | 45 | 45 | sentence | high |
| Display 1 | Regular | 34 | 34 | sentence | high |
| Headline | Regular | 24 | 24 | sentence | high |
| Title | Medium | 21 | 21 | sentence | high |
| Subheading | Regular | 17 | 16 | sentence | high |
| Body 2 | Medium | 15 | 14 | sentence | high |
| Body 1 | Regular | 15 | 14 | sentence | high |
| Caption | Regular | 13 | 13 | sentence | high |
| Button | Medium | 15 | 15 | all caps (page header: "Dense: Medium 15sp, all caps") | high |

## Type scale, tall scripts (South and Southeast Asian, Middle Eastern)

Rules from the page text: "Weight: Use Regular weight, as Medium weight is unavailable in Noto. Google recommends avoiding Bold weight, based on feedback from native speakers that Bold is too heavy. Font size: For Title through Caption styles, font size is 1px larger than that specified for English. For styles larger than Title, the English type size is suitable." Table from `style-typography-style3.png`, copied verbatim including the entries that contradict the text.

| Style | Weight | Size device (sp) | Size desktop (sp) | Confidence |
|---|---|---|---|---|
| Display 4 | Regular | 112 | 112 | high |
| Display 3 | Regular | 56 | 56 | high |
| Display 2 | Regular | 45 | 45 | high |
| Display 1 | Regular | 34 | 34 | high |
| Headline | Regular | 24 | 24 | high |
| Title | Bold | 21 | 21 | high |
| Subheading | Regular | 17 | 16 | high |
| Body 2 | Bold | 15 | 14 | high |
| Body 1 | Regular | 15 | Bold 14 (verbatim; the page text says Regular 14sp desktop) | high (image) |
| Caption | Regular | 13 | 13 | high |
| Button | Bold | 15 | 15 | high |

Internal disagreements on the spec page, recorded, not resolved:

1. The text says avoid Bold; the image uses Bold for Title, Body 2, and Button (Noto for tall scripts has only Regular and Bold, so every Medium style becomes Bold in the image). The page header also says "Tall: Bold 15sp" for buttons.
2. Body 1 desktop is "Bold 14sp" in the image and "14sp" (Regular) in the text and header; the image entry reads as a typo.
3. Display 4 is Regular for tall scripts (Noto has no Light), Light for English and dense.
4. The header does not say "all caps" for tall-script buttons; the body text limits all caps to languages that have capitalization.

## Line height for dense and tall scripts

Page text: "For all styles, line height is 0.1em larger than the English-like languages." CJK ideographs use the whole em box; tall scripts have long ascenders and descenders, so lines need more room to avoid clipping. Table from `style-typography-lineheight-tall1.png` (one image serves both categories).

| Style | Size (sp) | Leading English (dp) | Leading dense and tall (dp) | Confidence |
|---|---|---|---|---|
| Display 2 | 45 | 48 | 63 | high |
| Display 1 | 34 | 40 | 48 | high |
| Headline | 24 | 32 | 34 | high |
| Subheading 2 | 16 and 17 | 28 | 30 | high |
| Subheading 1 | 16 and 17 | 24 | 26 | high |
| Body 2 | 14 and 15 | 24 | 26 | high |
| Body 1 | 14 and 15 | 20 | 23 | high |

The image values are not uniformly "0.1em larger" than English (Display 2 grows 15dp on a 45sp face, Headline grows 2dp on a 24sp face). Both statements are copied verbatim; the table is the more specific one.

## Line length

| Context | Too narrow | Ideal range | Too wide | Confidence |
|---|---|---|---|---|
| Body text | under 40 characters per line | 40 to 60 characters per line | 90 characters per line | high (image `linelengths1.png`) |
| Short lines | under 15 characters per line | 15 to 40 characters per line | 60 characters per line | high (image `linelengths2.png`) |
| Quoted rule | "You should have around 60 characters per line if you want a good reading experience" (Baymard Institute) | | | high |

Line breaking: avoid large gaps and orphans; do not end a line on a very short word such as a preposition; good breaks avoid hyphenation. (high)

## Text color and opacity

Per-style opacity on a light background, from `style-typography-styles-contrast.png` (black text):

| Style | Opacity | Confidence |
|---|---|---|
| Display 4, Display 3, Display 2, Display 1 | Black 54% | high |
| Headline, Title, Subheading, Body 2, Body 1, Menu, Button | Black 87% | high |
| Caption | Black 54% | high |

Text opacity roles, from the color page (the color note owns these; repeated here so the type tokens can reference them):

| Role | Dark text (#000000) on light | Light text (#FFFFFF) on dark | Confidence |
|---|---|---|---|
| Primary text | 87% | 100% | high |
| Secondary text | 54% | 70% | high |
| Disabled text, hint text | 38% | 50% | high |
| Dividers | 12% | 12% | high |

Contrast: minimum 4.5:1 by luminance, preferred 7:1; the color page cites WCAG 2.0 AA at 4.5:1 for normal text and 3:1 for large text. Text that is too high in contrast is also hard to read, especially light text on dark. (high)

Vuetify 1.5 `$material-light.text`: primary .87, secondary .54, disabled .38; `$material-dark.text`: primary 1, secondary .70, disabled .50; dividers .12 both. Matches the spec. (moderate)

See `color.md` for the full usability section and the dark-theme surfaces.

## Large and dynamic type

Prefer dynamic type over truncating large text: pick the size from the typographic scale based on available space and estimated letter count. Large type differentiates layouts and helps users decode content quickly. No numeric values on the page. (high)

## Component text styles named on the page

| Component | Style | Confidence |
|---|---|---|
| App bar title | Title, Medium 20sp | high |
| Buttons (all) | Button, Medium 14sp, all caps (dense Medium 15sp all caps; tall Bold 15sp) | high |
| Small snippets, titles paired with Body | Subheading instead of Body | high |

The typography page lists no other component mappings. Per-component text sizes are on each component page (other researchers' notes).

## Vuetify 1.5.24 cross-check

Root: `$font-size-root` 14px, `$line-height-root` 1.5, `html { font-size: 14px }`, `.application { font-family: 'Roboto', sans-serif; line-height: 1.5 }`. (moderate)

`elements/_typography.styl` classes versus the spec:

| Vuetify class | Vuetify size / weight / line-height / letter-spacing | Spec style | Agreement | Confidence |
|---|---|---|---|---|
| `.display-4` | 112px / 300 / 1 / -.04em | Display 4: 112sp Light, tracking -10 | size and weight match; letter-spacing -.04em is not the spec's -10 (about -0.01em under the 1/1000 em reading) | moderate |
| `.display-3` | 56px / 400 / 1.35 / -.02em | Display 3: 56sp Regular, tracking -5, single line | size and weight match; line-height 1.35 and -.02em are Vuetify's own | moderate |
| `.display-2` | 45px / 400 / 48px / normal | Display 2: 45sp Regular, leading 48dp, tracking 0 | matches | moderate |
| `.display-1` | 34px / 400 / 40px / normal | Display 1: 34sp Regular, leading 40dp, tracking 0 | matches | moderate |
| `.headline` | 24px / 400 / 32px / normal | Headline: 24sp Regular, leading 32dp, tracking 0 | matches | moderate |
| `.title` | 20px / 500 / 1 / .02em | Title: 20sp Medium, tracking 5 | size and weight match; .02em is not the spec's 5 (about 0.005em) | moderate |
| `.subheading` | 16px / 400 / (inherits 1.5) / none | Subheading: 16sp device, 15sp desktop, leading 24dp, tracking 10 | device size matches; inherited 1.5 line-height yields 24px, matching Subheading 1; no desktop size; no tracking | moderate |
| `.body-2` | 14px / 500 / (inherits 1.5) / none | Body 2: 14sp device, 13sp desktop, leading 24dp, tracking 10 | device size matches; inherited line-height gives 21px, not 24dp; no tracking | moderate |
| `.body-1` | 14px / 400 / (inherits 1.5) / none | Body 1: 14sp device, 13sp desktop, leading 20dp, tracking 10 | device size matches; inherited line-height gives 21px, not 20dp; no tracking | moderate |
| `.caption` | 12px / 400 / (inherits) / none | Caption: 12sp Regular, tracking 20 | size and weight match; no tracking | moderate |
| `.v-btn` | 14px / 500 / uppercase (`$button-text-transform`); small 13px, large 15px | Button: 14sp Medium all caps | default matches; small and large sizes are Vuetify's own, not in the spec | moderate |
| `$font-weights` | thin 100, light 300, regular 400, medium 500, bold 700, black 900 (`.font-weight-*` helpers) | Roboto weight names | names match; numbers are the CSS convention | moderate |
| Menu | no class | Menu: not found | not found on either side | not found |

Vuetify 1.5 component text, for the implementers who need a starting point before the component notes land (all moderate; the spec component pages win):

| Vuetify component | Text | Spec style it corresponds to |
|---|---|---|
| Toolbar title (`.v-toolbar__title`) | 20px, 500, letter-spacing .02em (`$headings.h6`) | Title |
| Tabs (`.v-tabs__item`) | 14px, 500, line-height normal, uppercase (`$tab-text-transform := uppercase`) | Button metrics |
| List tile title | 16px, 400 (`$headings.subheading`); subtitle 14px; dense tile 13px | Subheading, Body 1 |
| Subheader | 14px, 500 (`$headings.body-2`) | Body 2 |
| Text field input and label | 16px, line-height 20px (`_inputs.styl`, `_labels.styl`) | Subheading size |
| Messages, counters (hint, error, counter) | 12px | Caption |
| Chip | 13px | no spec style at 13sp in the English scale (desktop Body is 13sp) |
| Snackbar | 14px | Body 1 |
| Tooltip | 12px, `text-transform: initial` | Caption size |
| Table header / cell | 12px 500 / 13px 400 | Caption weight 500 is Vuetify's own |
| Stepper label | inherits the 14px root (`_steppers.styl` sets no font-size on `.v-stepper__label`); sub-label `small` 12px / 300; circle number `.v-stepper__step__step` 12px | Body 1 (label); Caption size (sub-label, circle number) |
| Bottom nav label | 12px inactive, 14px active | Caption, Body |
| Navigation drawer item | 14px, 500 | Body 2 |
| Breadcrumbs | 14px (16px large) | Body 1 |
| Badge | 14px | Body 1 |
| Alert | 14px (`$font-size-root`) | Body 1 |

Vuetify 1.5 does not implement the dense and tall script scales, the desktop sizes, or the tracking table.

## Open decisions for MD1 (not decided here)

1. Device versus desktop sizes on the web: the spec defines both; nothing on the page selects one for browsers.
2. Tracking unit: the page prints unitless numbers.
3. Menu style: present in the opacity image, absent from the scale, leading, and tracking images.
4. Single-line styles (Display 4, Display 3, Title, Caption, Button) carry no leading value; an implementation needs a line-height anyway.
5. The tall-script table's internal contradictions (Bold usage, Body 1 desktop weight).
