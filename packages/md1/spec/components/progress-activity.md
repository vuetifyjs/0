# Progress and activity

Material Design 1 spec page `components/progress-activity.html`, pinned for `@paper/md1` (`Md1ProgressLinear`, `Md1ProgressCircular`).

## Sources

Primary (fetched and read by this note's author):

| URL | Note |
|---|---|
| http://web.archive.org/web/20181225002143/https://material.io/archive/guidelines/components/progress-activity.html | Requested `20181225002255`; served the 2018-12-25 02:21:43 capture. |
| http://web.archive.org/web/20170712071800/https://material.io/guidelines/components/progress-activity.html | Requested `20180223140411`; served 2017-07-12. Same text. |
| http://web.archive.org/web/20160923031834/https://material.google.com/components/progress-activity.html | Requested `20160604061521`; served 2016-09-23. Same text. |
| http://web.archive.org/web/20181225002143im_/https://material.io/archive/guidelines/assets/0B7WCemMG6e0VWkJiRjRLbzRNS3M/components-progress-and-activity.png | Hero illustration (stylized; no redlines). |
| http://web.archive.org/web/20181225002143im_/https://material.io/archive/guidelines/assets/0B0NGgBg38lWWVXBBVF9qR3E4a2s/components-progressactivity-typesofindicators-061101-linear-sheet-xhdpi-003.mp4 | Linear indicator sheet (1520 x 1160 px, 7.6 s); frames extracted with ffmpeg and measured at 2 px per dp. |
| http://web.archive.org/web/20160923031834im_/https://material-design.storage.googleapis.com/publish/material_v_9/0B14F_FSUCc01dkwzSzlwa3ZvbUU/061101_Circular_Sheet_xhdpi_005.mp4 | Circular indicator sheet (1520 x 316 px, 6.7 s); the 2018 host copy returns 404. |
| http://web.archive.org/web/20160923031834im_/https://material-design.storage.googleapis.com/publish/material_v_9/0B6Okdz75tqQsdk1oMG9KY2pCcms/components-progressactivity-typesofindicators-Circular_wFab_xhdpi_003.mp4 | Circular loader integrated with a floating action button (720 x 1250 px, 5.9 s). |

The page text contains no numeric values. Thickness, size and track opacity below are pixel measurements of the spec's own videos and are tagged `moderate`. The remaining behavior videos (loading in phases, card expansion, scroll up, swipe down) were not fetched.

Supporting pages, read via the shared scratchpad extractions `m1-*.txt` of the same archive (canonical path `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/<path>`): `material-design/elevation-shadows.html` (refresh indicator), `style/color.html`, `motion/duration-easing.html`, `layout/metrics-keylines.html` (56 dp floating action button).

Vuetify 1.5.24 cross-check files: `stylus/components/_progress-linear.styl`, `_progress-circular.styl`, `stylus/settings/_variables.styl`, `components/VProgressLinear/VProgressLinear.ts`, `components/VProgressCircular/VProgressCircular.ts`.

Confidence legend: `high` = stated in the page text; `moderate` = Vuetify 1.5 only, or measured from a spec video frame; `low` = memory.

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Progress and activity indicators are visual indications of an app loading content." | high |
| One indicator per operation | "A single visual indicator should be used to represent each type of operation. For example, a refresh operation should display either a refresh bar or an activity circle, but not both." | high |
| Determinate | Indicates how long an operation will take, used when the percentage complete is detectable. | high |
| Indeterminate | Requests that the user wait while something finishes, used when it is not necessary or possible to indicate how long it will take. | high |
| Both forms | Both linear and circular indicators may be either determinate or indeterminate. | high |
| Sequences | For multiple operations happening in sequence, use the indicator to represent the progress as a whole, not each individual operation. | high |
| Types named | Linear; Circular. Behaviors named: loading content in phases; loading additional content. | high |

## 2. Types and variants

| Type | Variant | Description (page text and video frames) | Confidence |
|---|---|---|---|
| Linear | Determinate | Fills from 0% to 100% and never decreases in value. | high |
| Linear | Indeterminate | Two segments sweep repeatedly along the track (video). | high (type), moderate (rendering) |
| Linear | Buffer | A solid determinate segment leads; a lighter buffered segment follows; the unbuffered remainder is drawn as a dotted trail (video). Example: "Buffering progress indicator on a video". | high (type), moderate (rendering) |
| Linear | Query | Labeled "Query Indeterminate and Determinate": an indeterminate sweep that runs in the reverse direction while the request is pending, then switches to determinate progress. Example: "Query indicator on a webpage". | high (type), moderate (rendering) |
| Circular | Determinate | An arc grows clockwise from the top until the ring closes (video). | high (type), moderate (rendering) |
| Circular | Indeterminate | A rotating arc whose sweep length grows and shrinks (video). | high (type), moderate (rendering) |
| Circular with integration | Around a floating action button | "A circular loader may be integrated with a floating action button." The ring draws around the FAB's perimeter in the accent color; on completion the FAB fills with the accent color and shows a check glyph (video). | high (rule), moderate (rendering) |

Behavior variants named on the page:

| Behavior | Spec text | Confidence |
|---|---|---|
| One-phased load | Ink (copy and images) loads within an existing, unchanging container. | high |
| Two-phased load | The paper container is generated, then the ink (copy and images) loads within it. | high |
| Loading content for the first time | Load and display all content at once. | high |
| Card expansion | An indeterminate linear indicator is recommended for a card expanding on larger surfaces such as desktop. | high |
| Scroll up to load more | An indeterminate circular indicator with an initial radial ink reaction is recommended when loading a list from below. | high |
| Swipe down to refresh | An indeterminate circular indicator with a radial ink reaction is recommended when refreshing a list from above. | high |

## 3. Anatomy

| Part | Description | Confidence |
|---|---|---|
| Linear track | Full width of its container, drawn at the edge of a header or sheet; lighter tint of the indicator color. | high (placement), moderate (color) |
| Linear indicator | Solid bar in the indicator color; grows from the start edge. | high |
| Buffer segment | Lighter segment ahead of the indicator; dotted trail for the unbuffered remainder. | moderate |
| Circular ring | Stroked arc on a circle; no visible track in the video frames. | moderate |
| FAB ring | Stroke drawn just outside the 56 dp FAB; check glyph replaces the FAB icon on completion. | moderate |
| Radial ink reaction | Ink ripple that precedes the circular indicator for scroll-up and swipe-down loading. | high |

## 4. Metrics and keylines

| Metric | Value | Confidence |
|---|---|---|
| Linear thickness | 4 dp (measured 8 px at 2x in the linear sheet video; page text: not found) | moderate |
| Linear width | Full width of the header or sheet edge it belongs to | high |
| Linear placement | "bars on the edge of a header or sheet that appear and disappear" | high |
| Circular outer diameter | about 40 dp (measured 76 px at 2x, antialiased) | moderate |
| Circular stroke | about 4 dp (measured 7 px at 2x) | moderate |
| Circular size table | not found | not found |
| FAB integration | FAB 56 dp (metrics-keylines page); ring thickness and gap not found (video suggests about 4 dp outside the FAB edge) | high (FAB), low (ring) |
| Corner radius | Linear bar ends are square in the video; not stated | moderate |
| Type styles | None; the indicator has no text. Labels in the videos are illustrative. | high |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Indicator (linear and circular) | Primary color (blue 500-range in the videos; the hero shows an accent pink bar on a primary teal header) | not found | moderate |
| Linear track | Indicator color at about 30% opacity (measured 0.33 over #EDEDED) | not found | moderate |
| Buffer segment | Same tint as the track; dotted trail in the same tint | not found | moderate |
| Circular track | None visible | not found | moderate |
| FAB ring | Accent color of the FAB's completed state (orange in the video); FAB fills with the same color on completion | not found | moderate |
| Role naming | The page does not name a color role; the family convention (color page) is primary for large UI areas and the secondary color for accents such as the floating action button. | high (color page) |

## 6. Elevation

| Part | Value | Confidence |
|---|---|---|
| Linear and circular indicators | 0 dp; ink on the surface they load | moderate |
| Refresh indicator (swipe to refresh circle) | 3 dp (elevation page component table) | high |
| FAB ring | Follows the FAB: 6 dp resting, 12 dp pressed (elevation page) | high |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Determinate fill | From 0% to 100%, never decreasing. | high |
| Linear indeterminate cycle | Two sweeping segments; cycle duration not found. | moderate |
| Query | Reverse sweep while pending, then determinate. | moderate |
| Circular indeterminate | Rotating arc with varying sweep; cycle duration not found. | moderate |
| Appear and disappear | Linear bars "appear and disappear" at the sheet edge; no durations. Motion page defaults: entering 225 ms, leaving 195 ms, standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`. | high |
| Radial ink reaction | Precedes the circular indicator for scroll-up and swipe-down loading. | high |
| FAB integration | Ring draws around the FAB during the operation; FAB flips to the completed color and glyph. | moderate |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Determinate | Bar or arc proportional to progress. | high |
| Indeterminate | Continuous animation without a value. | high |
| Buffer | Determinate bar plus buffered extent plus dotted remainder. | moderate |
| Query | Reverse indeterminate sweep, then determinate. | moderate |
| Hidden | Bars appear for the operation and disappear afterwards. | high |
| Complete (FAB integration) | FAB filled in the accent color with a check glyph. | moderate |
| Hover, focus, pressed, disabled, error | not applicable; not on the page | not found |

## 9. Behavior

| Rule | Spec | Confidence |
|---|---|---|
| One indicator per operation | Refresh bar or activity circle, never both. | high |
| Monotonic | A linear indicator always fills 0% to 100% and never decreases. | high |
| Whole sequence | One indicator for a sequence of operations. | high |
| Placement | Linear bars at the edge of a header or sheet; they appear and disappear with the operation. | high |
| Loading in phases | One-phased: ink loads in an existing container. Two-phased: container first, then ink. | high |
| First load | All content at once. | high |
| Additional content | Card expansion on large surfaces: indeterminate linear. Scroll up to load more: indeterminate circular after a radial ink reaction. Swipe down to refresh: indeterminate circular with a radial ink reaction. | high |
| FAB integration | A circular loader may wrap the FAB. | high |

## 10. Web notes

| Topic | Note |
|---|---|
| Units | dp is px: 4 px bar; about 40 px ring with a 4 px stroke. |
| ARIA | `role="progressbar"` on the indicator. Determinate: `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`. Indeterminate and query-pending: omit `aria-valuenow`. Buffer: expose the buffered extent through `aria-valuetext` or a second progressbar. Mark the loading region `aria-busy="true"` while the indicator is shown. There is no separate WAI-ARIA pattern beyond the `progressbar` role (the Meter pattern is for static measurements, not progress). |
| Linear rendering | A 4 px block with the track at 30% of the indicator color; indicator width in percent; buffer segment as a second layer; dotted remainder as a repeating radial gradient or dots. |
| Query | Mirror the indeterminate animation (`animation-direction: reverse`) until a value is known, then switch to determinate. |
| Circular rendering | SVG circle with `stroke-dasharray` and `stroke-dashoffset` for determinate progress; rotation plus dash animation for indeterminate. |
| FAB integration | Draw the ring as an SVG stroke outside the FAB's 56 px circle; complete by swapping the FAB color and glyph. Sizes are interpretation (low confidence). |
| Reduced motion | Under `prefers-reduced-motion`, slow or freeze the indeterminate animation; keep the determinate value visible. |
| Dark theme | Not specified; keep the indicator in the theme's primary or accent color and derive the track from it at 30%. |

## Vuetify 1.5 cross-check

Files: `_progress-linear.styl`, `_progress-circular.styl`, `_variables.styl`, `VProgressLinear.ts`, `VProgressCircular.ts`.

| Metric | Spec (measured) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Linear thickness | 4 dp | `VProgressLinear` `height` default 7 | discrepancy |
| Track color | indicator at about 30% | `backgroundOpacity` default 0.3 of `color` (`primary`) when no `backgroundColor` is set | match |
| Indicator color | primary | `color` default `primary` | match |
| Buffer | determinate plus buffered extent plus dotted remainder | `bufferValue` prop (default 100) sizes the `__background` layer; no dotted remainder | approximation |
| Query | reverse sweep then determinate | `query` prop switches to the `query` and `query-short` keyframes (2 s, reversed direction) | match |
| Indeterminate cycle | not found | `indeterminate` and `indeterminate-short` keyframes, 2.2 s infinite | Vuetify-only value |
| Appear and disappear | at the sheet edge | `active` prop collapses height to 0; `VFadeTransition` and `VSlideXTransition` on the bars; `.v-progress-linear { margin: 1rem 0 }` | approximation (default margin is not spec) |
| Determinate transition | monotonic fill | `__bar__determinate { transition: .2s cubic-bezier(0.4, 0.0, 0.6, 1) }` | match |
| Circular diameter | about 40 dp | `size` default 32 (`button` prop adds 8) | discrepancy |
| Circular stroke | about 4 dp | `width` default 4 | match |
| Circular track | none visible | `__underlay { stroke: rgba(0,0,0,.1) }` drawn for determinate | Vuetify-only value |
| Circular indeterminate | rotating arc, varying sweep | `progress-circular-rotate 1.4s linear infinite` plus `progress-circular-dash 1.4s ease-in-out infinite` (`stroke-dasharray: 80,200`) | match (pattern), Vuetify-only (duration) |
| Determinate arc transition | not found | `__overlay { transition: all .6s ease-in-out }` | Vuetify-only value |
| Rotation origin | top of the circle | `rotate` prop default 0 | match |
| FAB integration | ring around the FAB | not found | Vuetify gap |
| Radial ink reaction | precedes circular loaders | not found in the component (ripple directive exists separately) | Vuetify gap |
| ARIA | progressbar | `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` omitted when indeterminate | match |
