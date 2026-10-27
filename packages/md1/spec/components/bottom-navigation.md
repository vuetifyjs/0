# Bottom navigation (Material Design 1)

Spec page: Components > Bottom navigation. Covers the fixed and shifting bottom navigation bars, icon and label rules, color, scrolling behavior, and elevation.

## Sources

| Tag | URL | Copy read | Used for |
|---|---|---|---|
| A18 | https://m1.material.io/components/bottom-navigation.html | 2018-12-25 00:22:55 UTC | primary, authoritative |
| G16 | the 2016 revision of the guidelines page `components/bottom-navigation` | 2016-06-04 06:15:21 UTC | version cross-check only |
| ELEV | https://m1.material.io/material-design/elevation-shadows.html | 2018-12-25 00:22:55 UTC | 8dp bar elevation, snackbar 6dp |
| MOTION | https://m1.material.io/motion/duration-easing.html | 2018-12-25 00:22:55 UTC | durations and curves |
| COLOR | https://m1.material.io/style/color.html | 2018-12-25 00:22:55 UTC | icon and text opacities |
| KEY | https://m1.material.io/layout/metrics-keylines.html | 2018-12-25 00:22:55 UTC | touch targets |
| V15 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_bottom-navs.styl`, `settings/_theme.styl`, `settings/_elevations.styl`, `settings/_variables.styl`, `components/VBottomNav/VBottomNav.ts` | Vuetify 1.5.24 | cross-check |

Fetch notes: fetched with `curl -sL` over HTTPS; text extracted from static HTML. Redline images carry no alt text; image-only values are recorded as `not found`.

Confidence legend: `high` = read from the spec page text; `moderate` = from Vuetify 1.5 stylus only; `low` = memory.

## 1. Purpose and usage

- Bottom navigation bars make it easy to explore and switch between top-level views in a single tap. Tapping an icon goes directly to the associated view or refreshes the currently active view. (A18, high)
- Primarily for mobile. Larger displays (tablet, desktop) achieve a similar effect with side navigation, for instance the compact "rail" treatment that shows navigational icons by default. (A18, high)
- Use for three to five top-level destinations of similar importance (alternative: a persistent navigation drawer) and for destinations requiring direct access from anywhere in the app (alternative: tabs for only one or two destinations). (A18, high)
- Fewer than three destinations: use tabs. More than five: avoid, tap targets get too close. More than six top-level destinations: provide access to the rest through a navigation drawer. (A18, high)
- Views are fixed in the bar; avoid scrollable content in the bar. (A18, high)
- Do not use for views focused on a single task (an email Compose screen) or for user preferences or settings. (A18, high)
- Be cautious combining bottom navigation with tabs; tapping across both could mix different transitions over the same content. (A18, high)

## 2. Types and variants

| Variant | Definition | Metrics | Confidence |
|---|---|---|---|
| Fixed bottom navigation bar | Every action keeps the same width: view width divided by the number of actions; with three actions, icons and labels always show; with four or five actions, inactive views show icons only | Width 80dp min, 168dp max per action; 56dp tall | high |
| Shifting bottom navigation bar | The active action is wider and shows its label; inactive actions are narrower and show only the icon | Active 96dp to 168dp; inactive 56dp to 96dp; 56dp tall | high |
| Desktop and larger views | Alternatively make all actions the width of the largest action | | high |
| Colored bar | Bar filled with a theme color; the active icon and label become black or white | | high |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Bar | 56dp tall, full width, 8dp elevation | high |
| Action (destination) | Icon plus optional text label, centered horizontally | high |
| Icon | 24dp x 24dp | high |
| Text label | Roboto Regular 14sp active, 12sp inactive; short; never truncates or wraps | high |
| Active indicator | Tint of the active icon and label with the primary color (no separate indicator element) | high |
| Badge | not found on the page | high (absence) |

## 4. Metrics and keylines

Fixed bar:

| Metric | Value | Mobile | Landscape mobile | Tablet | Source | Confidence |
|---|---|---|---|---|---|---|
| Height | 56dp | 56dp | 56dp | 56dp | A18 | high |
| Action width | View width divided by number of actions (360dp wide with three actions gives 120dp each) | | | Alternative: all actions as wide as the largest | A18 | high |
| Action minimum width (includes padding) | 80dp | | | | A18 | high |
| Action maximum width (includes padding) | 168dp | | | | A18 | high |
| Icon | 24dp x 24dp | same | same | same | A18 | high |
| Padding above icon, active | 6dp | same | same | same | A18 | high |
| Padding above icon, inactive | 8dp | same | same | same | A18 | high |
| Padding under text | 10dp | same | same | same | A18 | high |
| Padding left and right of text | 12dp | same | | | A18 | high |
| Text label, active | Roboto Regular 14sp | | | | A18 | high |
| Text label, inactive | Roboto Regular 12sp | | | | A18 | high |
| Content alignment | Text and icon centered horizontally within the action | | | | A18 | high |
| Gap between icon and label | not found (derivable: 56 minus 6 minus 24 minus 10 leaves 16dp for the label line including its leading, active) | | | | A18 | high (absence) |
| Touch target | At least 48dp x 48dp; the 56dp action satisfies it | | | | KEY | high |

Shifting bar:

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Height | 56dp | A18 | high |
| Active action width | 96dp minimum, 168dp maximum (includes padding) | A18 | high |
| Inactive action width | 56dp minimum, 96dp maximum (includes padding) | A18 | high |
| Icon | 24dp x 24dp | A18 | high |
| Padding above icon, active | 6dp | A18 | high |
| Padding above and below icon, inactive | 16dp (icon vertically centered, no label) | A18 | high |
| Padding under text, active | 10dp | A18 | high |
| Padding below icon, active (figure) | 6dp | A18 | high |
| Padding below icon with no title (figure) | 16dp | A18 | high |
| Text label, active | Roboto Regular 14sp; may use the maximum width of the active action | A18 | high |
| Text label, inactive | Not shown | A18 | high |
| Content alignment | Centered horizontally within the action | A18 | high |

Type styles: active label 14sp Regular maps to Body 1; inactive label 12sp Regular maps to Caption. (values high; style name mapping low, confirm against the Typography note)

## 5. Color

| Part | Light theme | Dark theme | Colored bar | Source | Confidence |
|---|---|---|---|---|---|
| Active icon and label | App primary color tint | App primary color tint | Black or white | A18 | high |
| Inactive icon | not stated in text; figures (style1-5, usage1-3) draw `#757575`, black 54%, same as the label | not found (no dark-bar figure); COLOR inactive icon 50% #FFFFFF | figures (style7, usage5-8): white 70% (`#B2D7D2` on `#00796B`, `#DDD3D0` on `#8D6E63`) | A18 figures, COLOR | high (figures, sampled) |
| Inactive label (fixed bar, three actions) | not found; COLOR secondary text 54% #000000 or inactive 38% | not found | not found | A18, COLOR | high (absence) |
| Bar background | not found in text (figures show white) | not found | Any theme color; icons then black or white | A18 | high (absence) |
| Bar background, Vuetify | #FFFFFF (`$material-light.cards`) | #424242 | `color` prop | V15 | moderate |
| Inactive actions, Vuetify | `$material.text.secondary` rgba(0,0,0,0.54) | rgba(255,255,255,0.7) | | V15 | moderate |
| Mixed colors | Avoid different colored icons and labels; avoid colored icons on a colored bar | | | A18 | high |

## 6. Elevation

| Item | Value | Source | Confidence |
|---|---|---|---|
| Bottom navigation bar | 8dp | A18, ELEV | high |
| Snackbar | 6dp, appears behind the bar | A18, ELEV | high |
| Bottom sheets, navigation drawers, keyboards | Appear in front of the bar, temporarily covering it (modal bottom sheet 16dp, drawers 16dp) | A18, ELEV | high |
| Pressed, focused, hover | not found | A18 | high (absence) |
| Desktop | General rule: 2dp below mobile values (the bar is a mobile component) | ELEV | high (rule) |

## 7. Motion

| Transition | Pattern | Duration | Easing | Source | Confidence |
|---|---|---|---|---|---|
| Switching views | Cross-fade between active and inactive views; no lateral motion | not found | not found | A18 | high (pattern) |
| Hide and reveal on scroll | Scrolling downward hides the bar; scrolling upward reveals it; the bar can disappear and reappear for immersive content | not found | not found | A18 | high |
| Shifting | Active action widens and its label appears; inactive actions narrow to icon only | not found | not found | A18 | high (pattern) |
| Label grow (fixed) | Active label 14sp, inactive 12sp; padding above icon 8dp to 6dp | not found | not found | A18 | high |
| Generic guidance | Mobile 300ms typical; entering 225ms; leaving 195ms | | Standard curve cubic-bezier(0.4, 0.0, 0.2, 1); deceleration for entering; acceleration for leaving; sharp curve cubic-bezier(0.4, 0.0, 0.6, 1) for elements that may return (hide on scroll) | MOTION | high |
| Vuetify 1.5 bar show and hide | translateY 60px to 0 | 400ms | cubic-bezier(0.25, 0.8, 0.5, 1) | V15 | moderate |
| Vuetify 1.5 shifting | width and icon transform | 300ms (buttons), 400ms icons | all / cubic-bezier(0.25, 0.8, 0.5, 1) | V15 | moderate |

## 8. States

| State | Fixed bar | Shifting bar | Source | Confidence |
|---|---|---|---|---|
| Active (in focus view) | Icon plus label shown, tinted primary; label 14sp; 6dp above icon | Wider action (96dp to 168dp) with label 14sp | A18 | high |
| Inactive | Three actions: icon plus 12sp label, 8dp above icon; four or five actions: icon only | Icon only, 56dp to 96dp, 16dp above and below icon | A18 | high |
| Hover | not found | not found | A18 | high (absence) |
| Focus | not found | not found | A18 | high (absence) |
| Pressed | not found (ink ripple implied by the button spec) | not found | A18 | high (absence) |
| Disabled | not found | not found | A18 | high (absence) |
| Hidden (scrolled) | Bar off-screen after downward scroll | same | A18 | high |
| Error | not found | not found | A18 | high (absence) |
| Overlay opacities | not found | not found | A18 | high (absence) |
| Vuetify 1.5 | active: `v-btn--active` with no overlay; inactive: 54% black text; buttons without shadow, square corners, no uppercase | shift: inactive label color transparent, icon translated 8px down | V15 | moderate |

## 9. Behavior

- Tapping an icon goes directly to the associated view or refreshes the currently active view. Each icon must lead to a destination and may not open menus or dialogs. (A18, high)
- Tapping the active action navigates the user to the top of the view. Navigation through the bar should reset the task. (A18, high)
- The bar stays available as the user descends the hierarchy, either shown persistently or concealed and revealed on scroll; it remains in view when navigating through the app's hierarchy. (A18, high)
- Scrolling: downward hides the bar, upward reveals it. (A18, high)
- Swipe gestures on the content area do not navigate between views. On Android, the Back button does not navigate between bottom navigation views. (A18, high)
- Labels: short, meaningful; never truncate, wrap, or shrink to fit. (A18, high)
- Limits: three to five destinations; four or five destinations hide inactive labels in the fixed bar. (A18, high)
- Ordering: not found. (A18, high)

## 10. Web notes

- Maps 1:1: 56px bar, 24px icons, 12px and 14px labels, 80px to 168px action widths (fixed) and 56px to 168px (shifting), 12px label side padding, 8dp shadow set.
- Position the bar with `position: fixed; bottom: 0` and add the safe-area inset on notched devices (`env(safe-area-inset-bottom)`); the spec predates safe areas. (interpretation)
- Action width is a flex calculation (`flex: 1 1 0` with `min-width` and `max-width`), with the bar centering the group when the maximum width caps it. (interpretation)
- Hide-on-scroll is a scroll-direction observer plus a translateY transition using the sharp curve; keep the bar reachable by keyboard while hidden or restore it on focus. (interpretation)
- Switching views is a cross-fade, so the content region must not slide laterally; this is the view transition, not the bar's own motion.
- "Colored bar" is a variant that sets the surface to a theme color and forces the active icon and label to black or white; compute the choice from contrast against the bar color (v0 contrast utilities). (interpretation)
- WAI-ARIA patterns to follow (names only): a navigation landmark (`nav`) containing a list of links with `aria-current="page"` on the active destination is the primary mapping, because destinations are views, not panels in the same document. Use the APG "Tabs" pattern only when the destinations render as in-page panels. Each action is otherwise an APG "Button" or link. v0 composition: `Button.Root` or anchor per action plus v0 selection primitives for the active item. (pattern names: high; v0 mapping: interpretation)

## Vuetify 1.5 cross-check

Files: `_bottom-navs.styl`, `settings/_theme.styl`, `settings/_elevations.styl`, `VBottomNav.ts`.

| Metric | Spec (A18 / ELEV) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Height | 56dp | `height` prop default 56 | match |
| Action width, fixed | 80dp to 168dp | `.v-btn` min-width 80px, max-width 168px, width 100%, flex-shrink 1 | match |
| Action width, shifting | active 96dp to 168dp; inactive 56dp to 96dp | `--shift` buttons min 56px max 96px; active min 96px max 168px | match |
| Padding | 8dp above icon inactive, 6dp active; 12dp sides; 10dp below text | padding 8px 12px 10px; active padding-top 6px | match |
| Icon | 24dp | `v-icon` default 24px | match (default icon size, moderate) |
| Icon to label gap | not found | icon margin-bottom 4px | Vuetify-only |
| Label size | 14sp active, 12sp inactive | 14px active, 12px inactive; `--shift` always 14px with inactive label color transparent | match |
| Label weight and case | Regular, sentence case | font-weight 400, text-transform none | match |
| Inactive color | not found | `$material.text.secondary` 54% black / 70% white | Vuetify value |
| Active color | primary tint | `color` prop on the active button (author supplied) | match by convention |
| Bar background | not found | `$material.cards` #FFFFFF / #424242 | Vuetify value |
| Elevation | 8dp | box-shadow 0 3px 14px 2px rgba(0,0,0,0.12), which is only the ambient layer of the 8dp set (umbra and penumbra omitted) | discrepancy |
| Inactive icon offset, shifting | 16dp above and below | icon translated 8px down from the 8px top padding (16px total above) | match by construction |
| Show and hide | hide on scroll down, reveal on scroll up | `value` prop toggles translateY 60px over 0.4s; no scroll binding | partial |
| Cross-fade between views | stated | none (content transition is the author's) | gap |
| Destination count | 3 to 5 | unconstrained | gap (behavioral) |
| Tap active scrolls to top | stated | none | gap |
| Transition | not found | 0.4s cubic-bezier(0.25, 0.8, 0.5, 1); icons cubic-bezier(0.25, 0.8, 0.5, 1) | Vuetify-only |
| Fixed and absolute positioning | bottom of the view | `fixed` (z-index 4) and `absolute` props | match |
