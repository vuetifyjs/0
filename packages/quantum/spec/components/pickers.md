# Pickers

Material Design 1 spec page `components/pickers.html`, pinned for `@paper/quantum` (`QuDatePicker`, `QuTimePicker`, shared `QuPicker` dialog shell).

## Sources

Primary (fetched and read by this note's author):

| URL | Note |
|---|---|
| http://web.archive.org/web/20181225002218/https://material.io/archive/guidelines/components/pickers.html | Requested `20181225002255`; served the 2018-12-25 02:22:18 capture. |
| http://web.archive.org/web/20171229175953/https://material.io/guidelines/components/pickers.html | Requested `20180223140411`; served 2017-12-29. Same text. |
| http://web.archive.org/web/20160924083422/https://material.google.com/components/pickers.html | Requested `20160604061521`; served 2016-09-24. Same text. |
| http://web.archive.org/web/20181225002219im_/https://material.io/archive/guidelines/assets/0B3321sZLoP_HVWZOVkdRQlJEdDg/components-pickers-date1.png | Date and year picker, light, portrait (1520 x 1280 px). Same host for `components-pickers-date3.png` (light landscape), `date4.png` (dark portrait), `date5.png` (dark landscape), `components-pickers-time1.png` (light portrait), `time2.png` (light landscape), `time3.png` (dark portrait), `time4.png` (dark landscape), `components-pickers.png` (hero), videos `components-pickers-date-navigation-xhdpi-004.mp4` and `components-pickers-time-transition.mp4` (frames extracted with ffmpeg). |

The page text contains no numbers. All metrics below are pixel measurements of the spec's own images, which are xhdpi renders (2 px per dp; verified by the 34 sp title and 40 dp selection target). Measured values are tagged `moderate`.

Supporting pages, read via the shared scratchpad extractions `m1-*.txt` of the same archive (canonical path `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/<path>`): `components/dialogs.html` (dialog metrics), `material-design/elevation-shadows.html`, `style/typography.html`, `style/color.html`, `motion/duration-easing.html`, `components/selection-controls.html` (dark theme accent swatch).

Vuetify 1.5.24 cross-check files: `stylus/components/_pickers.styl`, `_date-picker-title.styl`, `_date-picker-header.styl`, `_date-picker-table.styl`, `_date-picker-years.styl`, `_time-picker-title.styl`, `_time-picker-clock.styl`, `stylus/settings/_variables.styl`, `_theme.styl`, `components/VPicker/VPicker.ts`, `VDatePicker/VDatePicker.ts`, `VDatePicker/mixins/date-picker-table.ts`, `VTimePicker/VTimePicker.ts`, `VTimePicker/VTimePickerClock.ts`.

Confidence legend: `high` = stated in the page text; `moderate` = Vuetify 1.5 only, or measured from a spec image; `low` = memory.

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Pickers provide a simple way to select a single value from a pre-determined set." | high |
| Date picker | Uses a dialog window to select a single date on mobile. | high |
| Time picker | Uses a dialog to select a single time (hours:minutes) on mobile; adjusts to the user's preferred time setting (12-hour or 24-hour). | high |
| Placement | On mobile, pickers are best suited for display in a confirmation dialog. | high |
| Inline forms | For inline display, such as on a form, consider compact controls such as segmented dropdown buttons (the page's named alternative). | high |
| One value | A confirmation dialog can use a date picker layout but remains focused on a single value: pick the date, not date and time (dialogs page). | high |
| Full-screen dialogs | May open pickers because their design accommodates additional layers of material (dialogs page). | high |

## 2. Types and variants

| Type | Variants on the page | Confidence |
|---|---|---|
| Date picker | Portrait and landscape; light and dark theme; date view (calendar grid) and year view (year list). | high |
| Time picker | Portrait and landscape; light and dark theme; hour view and minute view; 12-hour mode with AM/PM, 24-hour mode (named, not drawn). | high |

Measured frame sizes:

| Layout | Dialog size | Header | Confidence |
|---|---|---|---|
| Portrait (date and time) | 328 dp wide, 484 dp tall (date view) | 96 dp tall band at the top | moderate |
| Landscape (date and time) | 512 dp wide, 304 dp tall | 168 dp wide column at the start edge, full height | moderate |

## 3. Anatomy

### Date picker

| Part | Description | Confidence |
|---|---|---|
| Dialog sheet | Picker content inside a dialog; 24 dp elevation. | high (elevation page) |
| Header | Primary 500 band (light theme) with the year label above the selected date. "Touch the year in the title bar to transition to the year view." | high |
| Year label | "2017" in white at 70% opacity, about 14 sp (measured 19 px digit height at 2x), medium weight in the image. | moderate |
| Selected date | "Thu, Apr 13": weekday, month abbreviation, day; white 100%; Display 1 (34 sp; measured 48 px digit height at 2x). Wraps to two lines in landscape ("Thu," / "Apr 13"), line pitch 40 dp. | moderate (size), high (content) |
| Month navigation row | Previous chevron, "April 2017" label (Medium 14 sp, 87% black), next chevron; 48 dp row. | moderate |
| Weekday initials row | S M T W T F S in 12 sp at 38% black; 40 dp row. | moderate |
| Day grid | 7 columns by up to 6 rows; day numbers 12 sp; 44 dp column pitch, 40 dp row pitch (portrait). | moderate |
| Selected day | Filled circle, 40 dp, primary 500 with white number. "The selected day is indicated by a filled circle." | high (rule), moderate (size) |
| Current day | "indicated by a different color and type weight": primary 500 text, heavier weight. | high |
| Actions | CANCEL and OK text buttons at the bottom end of the body, Button style (Medium 14 sp caps), primary 500. | moderate |
| Year view | Vertical list of years centered horizontally, 44 dp row pitch; the selected year is larger (about 24 sp, measured 36 px digit height) and in primary 500; others 16 sp at 87% black. | moderate |

### Time picker

| Part | Description | Confidence |
|---|---|---|
| Header | Primary 500 band with the time "3:30" and stacked AM and PM labels at the end (12-hour mode). "Tap between the hour and minute label in the title bar to switch between the hour or minute view. Additionally, tap on the AM/PM label in the title bar to switch between AM or PM (in 12-hour clock mode)." | high |
| Time digits | About 60 sp (measured 86 px digit height at 2x); the active segment (hour or minute) is white 100%, the inactive segment white 70%. | moderate |
| AM and PM | Uppercase, about 14 sp (measured 21 px cap height at 2x), stacked, 8 dp after the digits; the selected period white 100%, the other 70%. Landscape: stacked under the time, centered. | moderate |
| Clock face | Grey disc (Grey 200 #EEEEEE light theme; Grey 700 #616161 dark theme): 296 dp in portrait, 224 dp in landscape. | moderate |
| Hour ring | Numbers 12, 1 to 11 at a 124 dp radius (portrait), dark text (87% black). 24-hour inner ring: named by the text, not drawn. | moderate |
| Minute ring | Labels 00, 05, 10 ... 55 at the same radius (video frames). | high (frames) |
| Hand | 2 dp line in primary 500 from a 6 dp center dot to the selected value, ending in a filled 40 dp circle (36 dp in landscape) with the value in white. "The selected time is indicated by the filled circle at the end of the clock hand." | high (rule), moderate (sizes) |
| Actions | CANCEL and OK as in the date picker. | moderate |

## 4. Metrics and keylines

### 4.1 Portrait date picker (measured, 2 px per dp)

| Metric | Value | Confidence |
|---|---|---|
| Dialog width | 328 dp | moderate |
| Dialog height (date view, 6 week rows) | 484 dp | moderate |
| Header height | 96 dp | moderate |
| Header start padding | 24 dp (text starts 24 dp from the dialog edge) | moderate |
| Year label | about 14 sp, 70% white; top of digits 22 dp below the header top | moderate |
| Selected date | 34 sp (Display 1) white; digit top 47 dp below the header top | moderate |
| Month navigation row | 48 dp tall, directly under the header | moderate |
| Navigation chevrons | 24 dp icon boxes, 16 dp from the dialog edges, 54% black | moderate |
| Month label | Medium 14 sp, 87% black, centered | moderate |
| Weekday row | 40 dp tall; initials 12 sp, 38% black | moderate |
| Day rows | 40 dp pitch, 6 rows (240 dp) | moderate |
| Day columns | 44 dp pitch, 7 columns (308 dp), 10 dp side margins | moderate |
| Day numbers | 12 sp, 87% black | moderate |
| Selected day circle | 40 dp, primary 500, white text | moderate |
| Action area | 52 dp (dialogs page: action area height 52 dp, button height 36 dp, 8 dp around buttons) plus 8 dp bottom padding; OK text ends 32 dp from the dialog end edge, CANCEL ends 37 dp before OK starts (measured) | high (dialogs page values), moderate (measured) |

### 4.2 Landscape date picker (measured)

| Metric | Value | Confidence |
|---|---|---|
| Dialog | 512 dp by 304 dp | moderate |
| Header column | 168 dp wide, full height; year and date stacked at the top with 24 dp start padding; date wraps to two lines at 40 dp line pitch | moderate |
| Body | 344 dp wide | moderate |
| Month navigation row | 48 dp | moderate |
| Weekday row | 32 dp (12 sp initials) | moderate |
| Day rows | 32 dp pitch, 6 rows | moderate |
| Day columns | 46 dp pitch, 7 columns | moderate |
| Selected day circle | 32 dp | moderate |
| Actions | Bottom end of the body, same style as portrait | moderate |

### 4.3 Year view (measured)

| Metric | Value | Confidence |
|---|---|---|
| Row pitch | 44 dp | moderate |
| Year text | 16 sp, 87% black, centered | moderate |
| Selected year | about 24 sp, primary 500, medium weight, in a taller row (about 56 dp) | moderate |
| Scrolling | Vertical list with the selected year centered on open (`date1.png` right pane) | moderate |

### 4.4 Portrait time picker (measured)

| Metric | Value | Confidence |
|---|---|---|
| Dialog width | 328 dp | moderate |
| Header height | 96 dp | moderate |
| Time digits | about 60 sp; baseline 72 dp below the header top; the digit block is centered with the AM/PM stack | moderate |
| Inactive segment opacity | 70% white (measured #B2DFDB over teal 500 equals 0.7 white) | moderate |
| AM and PM | about 14 sp uppercase, stacked, 8 dp after the digits; the selected period at 100% white, the other at 70% | moderate |
| Clock face | 296 dp diameter; 16 dp from the dialog sides; 32 dp below the header | moderate |
| Number ring radius | 124 dp from the face center (numbers 16 sp, 87% black) | moderate |
| Value target | 40 dp filled circle, primary 500, white 16 sp number | moderate |
| Hand | 2 dp thick, primary 500, from the center to the target; center dot 6 dp | moderate |
| Face to actions | Face bottom to dialog bottom 60 dp (52 dp action area plus 8 dp) | moderate |

### 4.5 Landscape time picker (measured)

| Metric | Value | Confidence |
|---|---|---|
| Dialog | 512 dp by 304 dp | moderate |
| Header column | 168 dp wide; time about 48 sp (measured 70 px digit height); AM and PM stacked below the time, centered, about 14 sp | moderate |
| Clock face | 224 dp diameter, centered in the 344 dp body (60 dp side margins, 20 dp top margin) | moderate |
| Value target | 36 dp | moderate |
| Actions | Bottom end of the body | moderate |

### 4.6 Type styles

| Element | Style | Confidence |
|---|---|---|
| Selected date | Display 1 (Regular 34 sp) | moderate |
| Year label (header) | Body 2 size (14 sp) at 70% white | moderate |
| Month label | Body 2 (Medium 14 sp) | moderate |
| Weekday initials, day numbers | Caption size (12 sp) | moderate |
| Year list | Subheading (16 sp); selected year Headline size (24 sp) | moderate |
| Time digits | No named MD1 style matches; about 60 sp portrait, 48 sp landscape (Display 3 is 56 sp, Display 2 is 45 sp) | moderate |
| AM and PM | Body 2 size (14 sp) uppercase | moderate |
| Clock numbers | Subheading (16 sp) | moderate |
| CANCEL, OK | Button (Medium 14 sp caps) | high (typography page) |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Header band | Primary 500 (#009688 in the images) | Grey 700 #616161 (measured) | moderate |
| Header text, active | White 100% | White 100% | moderate |
| Header text, inactive (year label, unselected time segment, unselected period) | White 70% | White 70% | moderate |
| Body | White (#FFFFFF behind the grid; Grey 50 #FAFAFA framing in the time picker) | Grey 800 #424242 (measured) | moderate |
| Month label | 87% black | 100% white | moderate |
| Navigation chevrons | 54% black | 100% white | moderate |
| Weekday initials | 38% black | 50% white | moderate |
| Day numbers | 87% black | 100% white | moderate |
| Selected day circle | Primary 500 with white text | Accent 200 swatch (#80CBC4 in `date4.png`) with dark text | moderate |
| Current day | Primary 500 text, heavier weight | Accent 200 text | high (rule), moderate (dark value) |
| Clock face | Grey 200 #EEEEEE | Grey 700 #616161 | moderate |
| Clock numbers | 87% black | 100% white | moderate |
| Hand and target | Primary 500, white number | Accent 200, dark number | moderate |
| CANCEL and OK | Primary 500 | Accent 200 | moderate |
| Dark theme rule | "A dark theme picker can complement apps that have a dark theme." Dark theme accents use the 200 swatch (selection-controls page: "Swatch 200" for dark theme on state). | high |

## 6. Elevation

| Part | Value | Confidence |
|---|---|---|
| Picker dialog | 24 dp ("Dialog, Picker" row of the elevation table) | high |
| Selected day circle, clock target | 0 dp (flat ink) | moderate |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Month navigation | "Swipe left to right to navigate through the months." The video shows the month grid sliding horizontally in the swipe direction while the header stays. | high |
| Year view | Tapping the year in the title bar transitions to the year view; the transition itself is not described. | high (trigger) |
| Hour to minute view | Tapping the minute label swaps the hour ring for the minute ring and the hand retargets (video frames); tapping the hour label returns. Selecting an hour moves to the minute view in the video. | high (frames) |
| Hand | Animates from the previous value to the new one (video frames show intermediate angles). | moderate |
| Orientation | "The picker view adapts to the device's orientation." | high |
| Dialog open and close | Not on this page; dialogs page and motion defaults: entering 225 ms, leaving 195 ms, standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`. | high (defaults) |
| Durations for the internal transitions | not found | not found |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Selected day | Filled 40 dp circle (32 dp landscape), white number. | high (rule), moderate (size) |
| Current day | Colored text and heavier weight. | high |
| Active header segment | White 100%; inactive 70%. | moderate |
| Selected period (AM or PM) | White 100%; other 70%. | moderate |
| Selected hour or minute | Filled target at the hand end. | high |
| Disabled dates or times | not found | not found |
| Hover, focus, pressed | not found on this page | not found |
| Error | not found | not found |
| Range selection | not found; the page defines single-value selection only | high |
| Min and max | not found | not found |

## 9. Behavior

| Rule | Spec | Confidence |
|---|---|---|
| Commit | Dialog with CANCEL and OK; the value is confirmed with OK (confirmation dialog semantics from the dialogs page). | high |
| Navigation | Swipe between months; tap the year to open the year view; tap the hour or minute label to switch views; tap AM or PM to switch the period. | high |
| Format | 12-hour or 24-hour follows the user's preference. | high |
| Scope | One value per picker (a date, or a time); never date and time together. | high |
| Orientation | Portrait and landscape layouts; landscape moves the header to a start-edge column. | high |
| Inline | Not for inline forms on mobile; use compact controls. | high |

## 10. Web notes

| Topic | Note |
|---|---|
| Units | dp and sp are px. Measured sizes: 328 x 484 px portrait, 512 x 304 px landscape. |
| Dialog | WAI-ARIA Dialog (Modal) pattern; the picker is the dialog content; `aria-labelledby` points at the header date or time. |
| Date grid | WAI-ARIA Date Picker Dialog example: `role="grid"` with `columnheader` weekday cells, `gridcell` days, a roving tabindex, `aria-selected` on the selected day, previous and next month buttons with accessible names; swipe is an enhancement, the buttons are the baseline. |
| Year view | `role="listbox"` of years with `aria-selected`, or a grid; keep the selected year centered on open. |
| Clock | No WAI-ARIA pattern for a clock face. Expose hour and minute as `spinbutton` or `radiogroup` values with arrow-key stepping that also moves the hand; the AM/PM toggle is a `radiogroup`. |
| Orientation | Pick the landscape layout from an explicit prop or `(orientation: landscape)` media query inside the dialog; do not infer from viewport width alone. |
| 24-hour mode | Not drawn by the spec; implement a second (inner) ring for 13 to 00 or a single ring with 00 to 23, tagged as interpretation. |
| Header typography | The time digits have no MD1 named style; use a dedicated token (about 60 px portrait, 48 px landscape). |
| Dark theme | Swap primary 500 for the accent 200 swatch on selection ink, buttons and the current day, following the selection-controls page. |

## Vuetify 1.5 cross-check

Files: `_pickers.styl`, `_date-picker-title.styl`, `_date-picker-header.styl`, `_date-picker-table.styl`, `_date-picker-years.styl`, `_time-picker-title.styl`, `_time-picker-clock.styl`, `_variables.styl`, `_theme.styl`, `VPicker.ts`, `VDatePicker.ts`, `date-picker-table.ts`, `VTimePicker.ts`, `VTimePickerClock.ts`.

| Metric | Spec (measured) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Portrait width | 328 dp | `VPicker` `width` default 290 | discrepancy |
| Landscape header column | 168 dp | `.v-picker--landscape .v-picker__title { width: 170px }` | match (2 px) |
| Header padding | 24 dp start | `.v-picker__title { padding: 16px }` | discrepancy |
| Header height | 96 dp | content-driven (year 14px plus 8px margin plus 34px date plus 32px padding, about 96px) | match (approximately) |
| Year label | about 14 sp, 70% white | `.v-date-picker-title__year { font-size: 14px; font-weight: 500; margin-bottom: 8px }`; inactive `.v-picker__title__btn { opacity: .6 }` | match (size), discrepancy (60% versus 70%) |
| Selected date | 34 sp Regular (Display 1) | `.v-date-picker-title__date { font-size: 34px; font-weight: 500 }` | match (size), discrepancy (weight 500) |
| Inactive time segment | 70% white | `opacity: .6` | discrepancy |
| Header colors | primary 500 light; Grey 700 dark | title background `color` prop or `primary` (light); `$material-dark.picker.title: grey darken-2` (#616161) | match |
| Body colors | white light; Grey 800 dark | `picker.body: white` and `grey darken-3` (#424242) | match |
| Month navigation row | 48 dp, chevrons 16 dp from the edges, label Medium 14 sp | `.v-date-picker-header { padding: 4px 16px }`, `VBtn` icon buttons, label `font-weight: bold`, `padding: .5rem` | match (padding), discrepancy (bold versus medium) |
| Weekday initials | 12 sp, 38% black, 40 dp row | `th { font-size: 12px; font-weight: 600; padding: 8px 0 }`, color `$material.text.disabled` | match (size, color), discrepancy (weight) |
| Day cells | 44 dp pitch, 40 dp rows, 40 dp selection circle | `td { width: 45px }`, `.v-btn { height: 32px; width: 32px; font-size: 12px }`, table `height: 242px`, `padding: 0 12px` | discrepancy (32 px circle, 242 px table versus 280 dp of rows) |
| Day numbers | 12 sp | 12px | match |
| Selected day | primary 500 circle, white text | `.v-btn--active { color: #fff }` with the `color` prop background | match |
| Current day | primary text, heavier weight | `showCurrent` renders an outlined button in the picker color | approximation |
| Landscape grid | 46 x 32 dp cells, 32 dp circle | same table as portrait | discrepancy |
| Year list | 44 dp pitch, 16 sp, selected about 24 sp | `.v-date-picker-years { font-size: 16px; height: 286px } li { padding: 8px 0 } .active { font-size: 26px; font-weight: 500; padding: 10px 0 } li:hover { background: rgba(0,0,0,.12) }` | match (16 px), approximation (26 px) |
| Month swipe | horizontal slide | `touch` directive with 15 px threshold and `tab-transition` or `tab-reverse-transition` | match |
| Time digits | about 60 sp portrait, 48 sp landscape | `.v-time-picker-title__time span { font-size: 70px; height: 70px }`; landscape 55px | discrepancy |
| AM and PM | about 14 sp uppercase stacked, 8 dp gap | `.v-time-picker-title__ampm { font-size: 16px; margin: 8px 0 6px 8px; text-transform: uppercase; flex-direction: column }`; landscape `margin: 16px 0 0`, centered | approximation (16 px versus 14 sp) |
| Clock face | 296 dp portrait; Grey 200 light, Grey 700 dark | `.v-time-picker-clock { width: 100%; padding-top: 100% }` inside `__container { padding: 10px }` (270px in a 290px picker); `picker.clock: grey lighten-2` (#EEEEEE) and `grey darken-2` (#616161) | match (colors), discrepancy (size) |
| Value target | 40 dp filled circle | `$time-picker-indicator-size: 40px`; `.v-time-picker-clock__item--active { color: #fff }` with the picker color behind | match |
| Clock numbers | 16 sp | `$time-picker-number-font-size: 16px` | match |
| Hand | 2 dp, 6 dp center dot, solid target | `__hand { width: 2px; height: calc(50% - 4px) }`, `:after` 8px dot, `:before` 10px ring with a 2px border at the tip | match (2 px), approximation (dot 8 px, ring tip) |
| 24-hour inner ring | not drawn | `VTimePickerClock` `double` with `innerRadiusScale: 0.62`, `.v-time-picker-clock__inner { inset: 27px }` | Vuetify-only value |
| Indeterminate time | not found | `picker.indeterminateTime: grey lighten-1` and `grey darken-1` | Vuetify-only value |
| Elevation | 24 dp (dialog) | `VPicker` has no shadow; `VDialog` supplies `elevation(24)` | match |
| Corner radius | not found | `.v-picker { border-radius: 2px }` (`$card-border-radius`) | Vuetify-only value |
| Action buttons | Button style, primary, bottom end | `VPicker` `actions` slot; consumers add `VBtn flat` | match (by convention) |
