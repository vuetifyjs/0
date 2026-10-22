# Tooltips (MD1)

Spec page: `components/tooltips.html`. Quantum component: `QuTooltip`.

## Sources

| Source | URL (snapshot) | Read |
|---|---|---|
| MD1 archived spec, Tooltips | `https://web.archive.org/web/20181225002230/https://material.io/archive/guidelines/components/tooltips.html` (requested `20181225002255`, archive resolved to `20181225002230`) | full text, plus the two keyline images `components-tooltips-cursor-keyline.png` and `components-tooltips-touch-keyline.png` |
| 2016 Google Design spec, Tooltips (cross-check) | `https://web.archive.org/web/20160604084349/http://www.google.com/design/spec/components/tooltips.html` | full text; identical numbers, lacks the Interaction section |
| MD1 Motion, Duration and easing | `https://web.archive.org/web/20181225002212/https://material.io/archive/guidelines/motion/duration-easing.html` | curve definitions |
| MD1 Style, Typography | `https://web.archive.org/web/20181225002206/https://material.io/archive/guidelines/style/typography.html` | type scale image `style-typography-styles-scale.png` |
| MD1 Style, Color | `https://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html` | Grey palette hex values |
| MD1 Material design, Elevation and shadows | `https://web.archive.org/web/20181225002223/https://material.io/archive/guidelines/material-design/elevation-shadows.html` | component elevation table (no tooltip row) |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_tooltips.styl`, `src/components/VTooltip/VTooltip.js`, `src/mixins/delayable.ts`, `src/stylus/settings/_variables.styl` | cross-check |

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| What it is | "Tooltips are text labels that appear when the user hovers over, focuses on, or touches an element." | high |
| Job | "Tooltips identify an element when they are activated. They may contain brief helper text about its function. For example, they may contain text information about actionable icons." | high |
| Focus | "Tooltip labels do not receive input focus." | high |
| Use for | "Use tooltips for interactive imagery." | high |
| Do not | "Tooltips don't display rich information including images and formatted text." | high |
| Not ALT text | "Tooltips are different than ALT-attributes, which are intended primarily for static images." | high |
| No arrows | "Tooltips don't have directional arrows; instead, they rely on motion emanating from the source to convey direction." | high |

## 2. Types and variants

The page defines two variants by input modality, not by appearance.

| Variant | Spec name | Trigger | Confidence |
|---|---|---|---|
| Desktop | "Tooltips (desktop)", "Cursor/keyboard tooltips" | cursor hover, keyboard focus | high |
| Mobile | "Tooltips (mobile)", "Touch UI tooltips" | touch (tap and hold) | high |

Per-variant metrics are in section 4.

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Tile | The rectangular container ("Tile height" is the spec's term). No arrow, no pointer. | high |
| Text | Single line of plain text. Rich content is forbidden. | high |
| Target | The element the tooltip describes; the tooltip sits below it, horizontally centered on it in both keyline images. | high (centering read from the keyline images, not from prose) |

## 4. Metrics and keylines

| Metric | Desktop (cursor/keyboard) | Mobile (touch) | Confidence |
|---|---|---|---|
| Tile height | 22dp | 32dp | high |
| Left and right text padding | 8dp | 16dp | high |
| Top margin (gap from target bottom edge to tile top) | 14dp | 24dp | high |
| Text | Roboto Medium 10sp | Roboto Medium 14sp | high |
| Type style name | none on the scale (10sp Medium is below Caption 12sp) | Body 2 (Medium 14sp on device) without caps; same metrics as Button style but not capitalized | high for sizes; mapping to scale names is interpretation |
| Corner radius | not found | not found | not found |
| Maximum width | not found | not found | not found |
| Minimum width | not found | not found | not found |
| Text transform | not stated; keyline images show sentence case ("Tooltip text") | same | moderate (image only) |
| Horizontal placement | centered under the target (keyline image) | centered under the target (keyline image) | moderate (image only) |
| Touch target of the trigger | not on this page; the general rule is 48 x 48dp (Metrics and keylines page) | 48 x 48dp | high (other page) |

Desktop and mobile each get exactly one size; the spec has no dense or multi-line variant.

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Tile background | Grey 700 (`#616161`) at 90% opacity | spec gives a single value, no dark-theme variant | high (color and opacity from prose; hex from the Color page palette) |
| Text | white; prose does not state it, both keyline images render white text on the grey tile | same | moderate (image only) |
| Theme role | none of primary / accent / surface; the tile is a fixed grey | same | high |

## 6. Elevation

| State | Value | Confidence |
|---|---|---|
| Resting | not found (the component elevation table on the Elevation and shadows page has no tooltip row; the tooltip page never mentions a shadow) | not found |

Vuetify 1.5 draws elevation 2dp; see the cross-check.

## 7. Motion

| Transition | Duration | Easing | Confidence |
|---|---|---|---|
| Entrance | 150ms | Deceleration curve, CSS `cubic-bezier(0.0, 0.0, 0.2, 1)` | high |
| Exit | 150ms | Acceleration curve, CSS `cubic-bezier(0.4, 0.0, 1, 1)` | high |
| Pattern | "they rely on motion emanating from the source to convey direction": the tile grows or fades outward from the target rather than pointing at it | high (pattern), the exact property animated (scale vs opacity) is not found |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Hidden | default | high |
| Shown (desktop) | on hover or keyboard focus of the target | high |
| Shown (mobile, "press and hold") | while the finger holds the element; the spec shows "normal state" and "press and hold state" illustrations | high |
| Hover / focus / pressed overlays on the tile | none; the tile is not interactive and never receives focus | high |
| Disabled | not found | not found |

## 9. Behavior

| Rule | Spec text | Confidence |
|---|---|---|
| Summoned by | "Hovering over an element with a cursor", "Focusing on an element with a keyboard (usually the tab key)", "Upon touch" | high |
| Touch trigger | "A tooltip is triggered by tapping and holding an item. Keep the tooltip displayed as long as the user continues to hold the element." | high |
| Touch release timing | "On lift, display the tooltip for 1.5 seconds." | high |
| Early dismissal | "If the user takes another action before that time ends, the tooltip will disappear." | high |
| Delay before showing | not found (no open delay is specified for hover or touch) | not found |
| Hide on leave (desktop) | not stated explicitly; implied by "appear when the user hovers over, focuses on" | low |
| One at a time | not found | not found |
| Placement | below the target with the top margin in section 4; the spec gives no rule for flipping when there is no room below | high / not found |

## 10. Web notes

- Maps 1:1: tile height, side padding, top margin, 10sp / 14sp Medium text, Grey 700 at 90%, 150ms in / 150ms out with the deceleration and acceleration curves.
- Needs interpretation: desktop vs mobile is a modality split; on the web choose by pointer type (`(hover: hover)` and `(pointer: fine)` media queries give the desktop set, coarse pointers the touch set) rather than by viewport width. Corner radius, max width, elevation, and open delay are not in the spec and must be declared as Quantum decisions in `SPEC.md`.
- Touch: "press and hold shows, lift keeps it 1.5s" is a long-press interaction; the web has no native long-press, so the implementer must use pointer events with a hold timer. Record the hold threshold as a Quantum decision (not found in the spec).
- WAI-ARIA pattern: **Tooltip** (`role="tooltip"`, trigger carries `aria-describedby`; the spec is silent on keyboard beyond "focusing on an element with a keyboard (usually the tab key)" so follow the pattern for Escape dismissal).
- Keyboard focus is a first-class trigger in this spec; the implementation must show the tooltip on `:focus-visible`, not only on hover.

## Vuetify 1.5 cross-check

Files: `_tooltips.styl`, `VTooltip.js`, `mixins/delayable.ts`, `_variables.styl` (`$transition.swing`).

| Property | Spec | Vuetify 1.5 | Match |
|---|---|---|---|
| Background color | Grey 700 `#616161` | `$grey.darken-2` (= Grey 700, `#616161`) | yes |
| Background opacity | 90% | 100% (no alpha) | no |
| Text color | white (image) | `#FFFFFF` | yes |
| Font size | 10sp desktop, 14sp mobile | 12px at all sizes | no |
| Font weight | Medium | not set (inherits regular) | no |
| Side padding | 8dp desktop, 16dp mobile | 8px desktop (`padding: 5px 8px`), 16px at `sm-and-down` (`padding: 10px 16px`) | yes |
| Tile height | 22dp desktop, 32dp mobile | not fixed; 12px text with 5px / 10px vertical padding | no (not pinned) |
| Gap from target | 14dp desktop, 24dp mobile | 10px in every direction (`(this.bottom ? 10 : -10)` in `calculatedTop`, same for left/right) | no |
| Corner radius | not found | 2px | n/a (Vuetify value, moderate) |
| Elevation | not found | `elevation(2)` | n/a (Vuetify value, moderate) |
| Entrance / exit | 150ms deceleration / 150ms acceleration | `.15s $transition.swing` = `cubic-bezier(.25,.8,.50,1)` for both | duration yes, curve no |
| Open delay | not found | `openDelay` default 200ms (VTooltip overrides delayable's 0) | n/a |
| Close delay | 1.5s after lift (touch) | `closeDelay` default 200ms | no |
| Placement | below target | prop-driven (`top`, `bottom`, `left`, `right`); default when none set: computes a top position with no offset | partial |
| Text transform | sentence case (image) | `text-transform: initial` | yes |
| Pointer events | tile not interactive | `pointer-events: none` while active | yes |
