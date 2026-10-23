# Snackbars and toasts (Material Design 1)

## Sources

- Spec page: https://m1.material.io/components/snackbars-toasts.html (the MD1 guidelines Google hosts as an archive; fetched 2026-10-22). The m1 copy is the frozen archive text (verified on `selection-controls.html` against a 2021-08-05 archive copy: identical text).
- Spec sheets read visually and measured in pixels. Every sheet renders at 2 px per dp (calibrated: the "24" callout bars are 48 px wide, the "48" callout block is 96 px).
  - `components-toasts-mobile4.png` (mobile specs)
  - `components-toasts-tabletdesktop3.png` (tablet and desktop specs)
  - `components-toasts-mobile1.png`, `components-toasts-mobile2.png`, `components-toasts-mobile3.png` (mobile mockups)
  - `components-toasts-tabletdesktop1.png`, `components-toasts-tabletdesktop2.png`, `components-toasts-tabletdesktop1-left.png`, `components-toasts-tabletdesktop2-left.png` (desktop mockups)
  - `components-toasts-usage1..6.png` (do and don't pairs)
- Vuetify 1.5.24: `packages/vuetify/src/stylus/components/_snackbars.styl`, `settings/_variables.styl` (`$snackbar-*`, `$display-breakpoints`), `settings/_elevations.styl`.

Confidence: `high` = stated in the page text or drawn as a callout on a spec sheet; `moderate` = measured from a sheet or taken from Vuetify 1.5 stylus; `low` = memory.

## 1. Purpose and usage

| Rule | Confidence |
|---|---|
| Snackbars provide brief feedback about an operation through a message at the bottom of the screen. | high |
| Contain a single line of text directly related to the operation performed. May contain a text action. Cannot contain icons. | high |
| Only one snackbar may be displayed at a time. Never persistent, never stacked. | high |
| Each snackbar may contain at most one action, and that action may not be "Dismiss" or "Cancel". | high |
| Two or more actions, or an action important enough to block the screen, call for a dialog, not a snackbar. | high |
| A snackbar must not be the only way to reach a core use case (it times out). | high |
| If an action is present, comply with dialog spacing and affordance rules. | high |
| Toasts are Android only: system messaging, bottom of screen, cannot be swiped off. Not a web component; list under "out" in SPEC.md coverage. | high |

## 2. Types and variants

| Variant | Height | Width | Corners | Alignment | Confidence |
|---|---|---|---|---|---|
| Mobile, single line | 48 dp | full screen width, edge to edge | none | bottom edge | high (text; sheets mobile1 and mobile3) |
| Mobile, multi-line (two lines) | 80 dp | full width | none | bottom edge | high |
| Mobile, multi-line with the action on its own line (long action text) | 112 dp | full width | none | bottom edge | high (sheet mobile4 only; the page text does not list it) |
| Tablet and desktop, single line | 48 dp | min 288 dp, max 568 dp | 2 dp | centered, or left-aligned 24 dp from the left and bottom edges | high |
| Tablet and desktop, multi-line | not found (the page gives 48 dp only) | | | | high (absence) |
| Toast (Android) | not found | | | | |

The mobile and desktop split point (which breakpoint switches variants) is not found on the page. Vuetify 1.5 switches at `sm-and-up` (min-width 600 px): moderate.

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Container | #323232 fill, elevated above content | high |
| Message text | one line (mobile and desktop), two lines allowed on mobile | high |
| Action | optional, at most one, text only (no icon), all caps | high |
| Icon | forbidden | high |

## 4. Metrics and keylines

| Metric | Value | Confidence |
|---|---|---|
| Single-line height | 48 dp (96 px on the sheet) | high |
| Multi-line height (two lines) | 80 dp (160 px) | high |
| Multi-line with stacked action | 112 dp (224 px) | high (sheet) |
| Desktop height | 48 dp | high |
| Desktop min width | 288 dp | high |
| Desktop max width | 568 dp | high |
| Desktop corner radius | 2 dp | high |
| Mobile corner radius | none, full width (sheets) | moderate (measured, not stated) |
| Left padding (edge to text) | 24 dp | high |
| Right padding (edge to action, or edge to text without action) | 24 dp | high |
| Vertical padding, single line | 14 dp top and bottom around a 20 dp line box | high |
| Vertical padding, multi-line | 24 dp top and bottom; the two-line text block between them measures 32 dp on the sheet | high |
| Gap between text and action, mobile | 24 dp | high (sheet mobile4) |
| Gap between text and action, desktop | 48 dp ("Snackbar button left padding: 48dp") | high |
| Stacked action variant | 24 dp top padding, 24 dp between text block and action row, 14 dp bottom padding, action right-aligned at 24 dp | high (sheet) |
| Text style | Roboto Regular 14 sp = Body 1 | high |
| Text line pitch | 20 dp (measured baseline to baseline in mobile2; the sheet callouts are consistent with a 20 dp line box on the single-line variant) | moderate |
| Action text style | Roboto Medium 14 sp, all caps = Button | high |
| Action cap height on the sheet | about 9.5 dp (19 px), consistent with 14 sp Medium | moderate |
| Desktop left-aligned offset | 24 dp from the left and bottom edges | high |
| Desktop centered variant | horizontally centered, bottom edge flush with the viewport bottom (sheets tabletdesktop1 and tabletdesktop2) | moderate |
| Placement vs FAB | move the FAB up by the snackbar height; the snackbar never covers it | high |
| Max text length | "very short text strings", one line; a two-line mobile variant exists | high |

Implementer note on the 80 dp variant: 24 + 24 padding leaves 32 dp, which is less than two 20 dp line boxes. The sheet measures the 24 dp to the glyph extent (cap top of line 1 to descender of line 2), not to line boxes. Implement as a fixed 80 dp container with the two-line, 20 dp pitch text vertically centered.

## 5. Color

| Part | Value | Confidence |
|---|---|---|
| Background | #323232, 100 % | high |
| Message text | not stated in the text; sheets and mockups render #FFFFFF at 100 % | moderate |
| Action text | not stated; mockups render the app accent (Lime A200 #EEFF41 in the inbox mockups, green in usage5) | moderate |
| Dark theme | not found (page has no dark variant; the container is dark in both) | high (absence) |
| Disabled | not applicable (no disabled state on the page) | high (absence) |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Resting | equal in elevation to the floating action button; lower than dialogs, bottom sheets and navigation drawers | high |
| Numeric value | 6 dp. The snackbar page gives no number; 6 dp is the FAB resting elevation from the MD1 elevation table (not re-read here) and Vuetify 1.5 uses `elevation(6)` | moderate |
| Pressed or raised | not applicable | high (absence) |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Entrance | animates upward from the bottom edge of the screen | high |
| Exit | swiped off screen, or auto-dismiss after a timeout, or on user interaction elsewhere (summoning a new surface or activity) | high |
| Consecutive snackbars | the first starts its contraction motion downward before the second animates upward | high |
| Durations and easing | not found on the page | high (absence) |
| Auto-dismiss duration | not found on the page (no seconds are given) | high (absence) |
| Vuetify 1.5 values | `transform .4s cubic-bezier(.25,.8,.5,1)` on the container, content `opacity .3s linear .1s`; the enter and leave states translate the bottom snackbar by `100%` | moderate |
| Vuetify 1.5 default timeout | 6000 ms (JS prop default, not in stylus) | low |

## 8. States

| State | Spec | Confidence |
|---|---|---|
| Container hover, focus, pressed | not found; the container is not interactive | high (absence) |
| Action hover, focus, pressed | not found on this page; the action is a flat text button, so the button page's overlays apply | high (absence) |
| Disabled | not found | high (absence) |

## 9. Behavior

| Rule | Confidence |
|---|---|
| Does not block input when shown. | high |
| Dismissal: swipe off screen, timeout, or interaction elsewhere. | high |
| Android: when an unrelated dialog or popup appears while the snackbar is up, the timeout resets when window focus returns, so the user can read it for the full duration. | high |
| Only one snackbar at a time; a second one triggered while the first shows waits for the first to contract downward. | high |
| Snackbars push the FAB upward rather than covering it. | high |
| On scroll: not found. | high (absence) |

## 10. Web notes

- Maps 1:1: fixed bottom container, 48 dp and 80 dp heights, 24 dp side padding, 14 dp and 24 dp vertical padding, desktop 288 to 568 dp width with 2 dp corners and the 24 dp corner offset.
- Needs interpretation: the mobile versus desktop breakpoint (not on the page); swipe dismissal on the web (a pointer gesture, optional); queueing of consecutive snackbars is application state and belongs in the composable, not CSS.
- The 112 dp stacked-action layout should trigger from measured action width, not a prop.
- Stacking order: above content and the FAB, below dialogs, bottom sheets and navigation drawers.
- WAI-ARIA: the message is a live region (WAI-ARIA "Alert" pattern semantics with `role="status"` and `aria-live="polite"` for ordinary feedback; `role="alert"` only for urgent messages); the action is a native button. The spec says nothing about keyboard; follow the pattern, do not invent one.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 | Agree |
|---|---|---|---|
| Single-line height | 48 dp | `.v-snack__content` height 48px, padding 14px 24px | yes |
| Multi-line height | 80 dp | `--multi-line` height 80px, padding 24px | yes |
| Stacked action height | 112 dp, bottom padding 14 dp | `--vertical` height 112px, padding 24px 24px 14px | yes |
| Desktop min and max width | 288 and 568 dp | `min-width: 288px`, `max-width: 568px` at `sm-and-up` (600 px) | yes; breakpoint is Vuetify's choice (spec silent) |
| Desktop corner radius | 2 dp | `border-radius: 2px` | yes |
| Desktop corner offset | 24 dp left and bottom | `$snackbar-corner-offset: 24px` for `--left`, `--right`, `--top`, `--bottom` | yes (Vuetify adds right and top placements the spec does not have) |
| Mobile width | full width | `.v-snack__wrapper` width 100% below 600 px | yes |
| Background | #323232 | `$snackbar-background-color: #323232` | yes |
| Text color | white (sheets) | `$snackbar-color: #fff` | yes |
| Text size | 14 sp | `font-size: 14px` | yes |
| Text to action gap, mobile | 24 dp | `.v-btn` margin `0 0 0 24px` | yes |
| Text to action gap, desktop | 48 dp | `.v-btn:first-of-type` margin-left 42px at `sm-and-up` | no (42 vs 48) |
| Action padding | not stated | `.v-btn` padding 8px, height auto, `::before` hidden (no hover overlay) | n/a |
| Elevation | equal to FAB (6 dp) | `elevation(6)` | yes |
| Entrance motion | upward from bottom edge | translateY(100%) to 0, .4s swing | yes (durations are Vuetify's) |
| Top placement | not in spec | `--top` supported | Vuetify extra |
| z-index | between FAB and dialogs | `z-index: 1000` | n/a |
