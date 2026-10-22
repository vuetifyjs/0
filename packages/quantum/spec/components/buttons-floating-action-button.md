# Buttons: Floating Action Button (Material Design 1)

Spec page: Components > Buttons: Floating Action Button. Covers the default and mini FAB, placement, qualities, transitions (trigger, toolbar, speed dial, morph, full screen), and large-screen attachment.

## Sources

| Tag | URL | Snapshot | Used for |
|---|---|---|---|
| A18 | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons-floating-action-button.html | 2018-12-25 00:22:55 UTC | primary, authoritative |
| G16 | https://web.archive.org/web/20160604061521/http://www.google.com/design/spec/components/buttons-floating-action-button.html | 2016-06-04 06:15:21 UTC | version cross-check only |
| ELEV | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/material-design/elevation-shadows.html | 2018-12-25 00:22:55 UTC | resting and pressed elevation, interference rules |
| MOTION | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/motion/duration-easing.html | 2018-12-25 00:22:55 UTC | durations and curves |
| COLOR | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/color.html | 2018-12-25 00:22:55 UTC | secondary color rules for the FAB |
| KEY | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/layout/metrics-keylines.html | 2018-12-25 00:22:55 UTC | FAB in layout templates, touch targets |
| BSHEET | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-sheets.html | 2018-12-25 00:22:55 UTC | persistent bottom sheet moving the FAB |
| V15 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_buttons.styl` (`.v-btn--floating`), `_speed-dial.styl`, `settings/_variables.styl`, `components/VSpeedDial/VSpeedDial.js`, `components/VBtn/VBtn.ts` | Vuetify 1.5.24 | cross-check |

Fetch notes: fetched with `curl -sL` over HTTPS; text extracted from static HTML. Redline images carry no alt text; image-only values are recorded as `not found`.

Confidence legend: `high` = read from the spec page text; `moderate` = from Vuetify 1.5 stylus only; `low` = memory.

## 1. Purpose and usage

- A floating action button represents the primary action in an application and is used for a promoted action. It is shaped like a circled icon floating above the UI, changes color upon focus, and lifts upon selection. When pressed it may contain more related actions. (A18, high)
- Only one FAB is recommended per screen, representing the most common action. Not every screen needs a FAB (a gallery whose primary action is touching images needs none). (A18, high)
- Qualities: use for positive actions such as Create, Favorite, Share, Navigate, Explore. Avoid for minor and destructive actions: Archive or Trash, nonspecific actions, alerts or errors, limited tasks like cutting text, controls that belong in a toolbar (volume, font color). (A18, high)
- FABs do not contain app bar icons or status bar notifications; do not layer badges or other elements over a FAB. Use the circle shape consistently; do not give the FAB extra dimension. (A18, high)
- Color guidance: use the secondary (accent) color for the primary action button; do not use the secondary color for the FAB if it rests on a background of that color; a different tone of the primary color may be used for a FAB resting on a primary-colored region; a monochromatic (black) FAB is allowed when imagery should take prominence. (COLOR, high)

## 2. Types and variants

| Variant | Size | When | Confidence |
|---|---|---|---|
| Default | 56dp x 56dp | Most use cases | high |
| Mini | 40dp x 40dp | Only to create visual continuity with other screen elements; also the required size when the screen width is 460dp or less | high |
| Extended FAB | Does not exist in MD1. The page lists exactly two sizes and no text label variant. The extended FAB is a later (2018 Material) addition. | n/a | high (absence on page); classification low |
| Mini (2016 text) | "30 x 40dp" in the G16 summary block (typo); the G16 body says 40dp | n/a | high (superseded) |

Transition families (each is a behavior of the same component, not a separate size): Trigger, Toolbar, Speed dial, Morph, Full screen. The list is explicitly non-exhaustive. (A18, high)

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Circle container | 56dp or 40dp, resting at 6dp | high |
| Interior icon | 24dp x 24dp in both sizes; may be animated | high |
| Shadow | 6dp resting, 12dp pressed | high (ELEV) |
| Ink ripple | Expands outward on trigger "as the force that causes changes to the UI" | high |
| Speed dial items | Related actions flung out on press; count 3 to 6 including the original target; item size and labels: not found | high (rule), high (absence of metrics) |
| Sheet (speed dial variant) | FAB can transform into a single sheet of material containing all the actions | high |
| Toolbar (transform target) | Contains related actions, text and search fields, or other items useful at hand | high |

## 4. Metrics and keylines

| Metric | Value | Mobile | Tablet / desktop | Source | Confidence |
|---|---|---|---|---|---|
| Default size | 56dp x 56dp | same | same | A18 | high |
| Mini size | 40dp x 40dp | same | same | A18 | high |
| Interior icon | 24dp x 24dp | same | same | A18 | high |
| Minimum distance from screen edge | 16dp | 16dp | 24dp | A18 | high |
| Mini threshold | Screen width 460dp or less uses mini | | | A18 | high |
| Touch target | At least 48dp x 48dp (mini FAB is 40dp, so its hit area must be extended) | | | KEY | high (rule); extension is interpretation |
| Speed dial option count | At least 3 and at most 6, including the original FAB target; with only 2 options pick the most important | | | A18 | high |
| Depth from initial screen to destination | At most two taps | | | A18 | high |
| Spacing between speed dial items | not found | | | A18 | high (absence) |
| Speed dial item size | not found (Vuetify uses mini 40dp buttons; moderate) | | | A18, V15 | high (absence) |
| List padding beneath a FAB | "enough padding" so content is not blocked; value not found | | | A18 | high |
| Right-side icon keyline coordinated with the FAB | Right-side icons align 32dp from the right edge to coordinate with the FAB (mobile detail view) | 32dp | | KEY | high |
| Overlap when attached to an app bar or sheet edge | not found (image only) | | | A18 | high (absence) |
| Vuetify large FAB | 72dp with 30px icon; mini icon 18px | | | V15 | moderate (Vuetify-only) |

Type styles: the FAB carries no text in MD1. Speed dial labels have no stated type style: not found.

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Container | Secondary (accent) color recommended; primary color tone variant when resting on a primary region; black allowed as a monochrome accent | same rules | COLOR | high |
| Icon | not found on the FAB page; COLOR gives white icons on colored backgrounds at 100% | same | A18, COLOR | high (rule), interpretation for the FAB |
| Focus | "Changes color upon focus" (2018 text); "ink wash upon focus" (2016 text); value not found | same | A18, G16 | high (behavior), absence of value |
| Disabled | not found | not found | A18 | high (absence) |
| Speed dial items | not found | not found | A18 | high (absence) |

## 6. Elevation

| State | Value | Source | Confidence |
|---|---|---|---|
| Resting | 6dp | ELEV ("Floating action button (FAB - resting elevation)") | high |
| Pressed | 12dp | ELEV ("Floating action button (FAB - pressed)") | high |
| Hover | not found | ELEV, A18 | high (absence) |
| Focused | not found (color change only) | A18 | high (absence) |
| Desktop | The general rule says desktop resting elevation is 2dp below the listed values; the FAB is not listed separately for desktop | ELEV | high (rule); derived value not stated |
| Relative to others | Above cards (2dp), raised buttons (2dp), app bar (4dp), snackbar (6dp, equal), bottom navigation (8dp, higher than a resting FAB); the FAB disappears or moves before a card is picked up (card raised 8dp) and moves if a snackbar appears | ELEV | high |

## 7. Motion

| Transition | Pattern | Duration | Easing | Source | Confidence |
|---|---|---|---|---|---|
| Entrance | Animates onto the screen as an expanding piece of material (scale from the center) by default; the icon within may be animated | not found | not found | A18 | high (pattern) |
| Trigger | Touch ripple expands outwards as the force that causes UI changes | not found | not found | A18 | high |
| Toolbar | FAB transforms into a toolbar on press, or a toolbar transforms into a FAB on scroll; the toolbar contains related actions | not found | not found | A18 | high |
| Speed dial | FAB flings out related actions on press; FAB remains on screen; tapping the same spot activates the most common action or closes the menu; FAB may instead transform into a single sheet containing all actions | not found | not found | A18 | high |
| Morph | FAB transforms into a sheet of material that is part of the app structure; path between start and end positions must be logical and must not pass through other sheets; the morph is reversible and transforms the sheet back into the FAB | not found | not found | A18 | high |
| Full screen | FAB transforms into a sheet spanning the entire screen; typically associated with creating content; usually not reversible | not found | not found | A18 | high |
| Lateral screens | A FAB spanning tabbed screens briefly disappears then reappears if its action changes; it stays on screen and translates if the action is unchanged; it must not exit in the same direction as tabbed content | not found | not found | A18 | high |
| Generic guidance | Mobile 300ms typical; entering 225ms; leaving 195ms; large full-screen transitions up to 375ms; desktop 150ms to 200ms; tablet about 30% longer | | Standard curve cubic-bezier(0.4, 0.0, 0.2, 1); deceleration cubic-bezier(0.0, 0.0, 0.2, 1) for entering; acceleration cubic-bezier(0.4, 0.0, 1, 1) for leaving | MOTION | high |
| Vuetify 1.5 speed dial | `scale-transition` on each item with a stagger of 0.05s per item; direction top, bottom, left, right; optional open on hover | 0.05s stagger | Vue transition defaults | V15 | moderate |
| Vuetify 1.5 FAB icon swap | Two icons cross-fade and rotate 45deg between inactive and active | 300ms | cubic-bezier(0.25, 0.8, 0.5, 1) | V15 | moderate |

## 8. States

| State | Rendering | Source | Confidence |
|---|---|---|---|
| Normal | Circle at 6dp with 24dp icon | A18, ELEV | high |
| Hover | not found | A18 | high (absence) |
| Focus | Changes color (2018) / ink wash (2016); opacity not found | A18, G16 | high |
| Pressed | Lifts to 12dp with ripple | A18, ELEV | high |
| Disabled | not found | A18 | high (absence) |
| Open (speed dial) | FAB remains on screen with actions flung out; tapping again closes or fires the most common action | A18 | high |
| Transformed (toolbar, sheet, full screen) | FAB is replaced by the target surface; reversible except full screen | A18 | high |
| Hidden | FAB disappears before conflicting interactions (card pick-up) and when its action changes across lateral screens | ELEV, A18 | high |
| Error | not found | A18 | high (absence) |

## 9. Behavior

- One FAB per screen; do not associate FABs with every element on a screen. Two FABs are shown in one example only because they perform equally important yet distinct actions (map recenter). (A18, high)
- Placement: 16dp minimum from the edge on mobile, 24dp on tablet and desktop. Large screens: a FAB can attach to an extended app bar, to a toolbar or structural element within a sheet (as long as it is not blocking other elements), or to the edge of a sheet. (A18, high)
- Lists under a FAB need enough bottom padding so content is not blocked. (A18, high)
- Speed dial limits: at least 3 and at most 6 options including the original target; no overflow menus inside FAB actions; at most two taps from the initial screen to the destination; options are specific destinations; overflow actions belong in toolbar overflow menus. (A18, high)
- Related actions only: a FAB may transform into related actions (media type to add) or a list of contacts; unrelated actions belong in an overflow menu. (A18, high)
- Interference: the FAB moves if a snackbar appears and disappears or moves off-screen before a card pick-up; a persistent bottom sheet entering the layout may move the FAB vertically. (ELEV, BSHEET, high)
- Scroll: a toolbar that the FAB morphed from may disappear on scroll and return to the FAB form; the FAB itself does not scroll with content because its parent is the root, not the scrolling sheet. (A18, ELEV, high)
- Mini size is required at screen widths of 460dp or less. (A18, high)

## 10. Web notes

- Maps 1:1: 56px and 40px circles, 24px icon, fixed positioning with 16px (mobile) or 24px (tablet and desktop) insets, shadow sets for 6dp and 12dp.
- The 460dp mini rule maps to a `max-width: 460px` media query; the 16dp versus 24dp inset maps to the tablet breakpoint (600dp in the MD1 responsive grid; Vuetify 1.5 uses 600px for `sm`). (interpretation; breakpoint value from V15, moderate)
- The 40px mini FAB needs an extended 48px hit area to satisfy the touch target rule. (interpretation)
- Morph and full-screen transforms are shared-element transitions; on the web implement them as a scale/clip transition into a sheet, honoring `prefers-reduced-motion`. The spec gives no numbers, so use the MOTION defaults (225ms enter, 195ms exit, standard curve for in-screen moves). (interpretation)
- WAI-ARIA patterns to follow (names only): FAB: APG "Button". Speed dial: APG "Menu Button" (the FAB is the menu button, flung-out actions are menu items) when the actions are commands; a "Disclosure" plus toolbar of buttons is an acceptable alternative when actions must stay in the tab order. Morph into a sheet or full screen: APG "Dialog (Modal)" for the resulting sheet. v0 composition: `Button.Root` for the FAB; `Dialog.Root` for morph targets. (pattern names: high; v0 mapping: interpretation)

## Vuetify 1.5 cross-check

Files: `_buttons.styl` (`.v-btn--floating`), `_speed-dial.styl`, `settings/_variables.styl`, `VSpeedDial.js`, `VBtn.ts`.

| Metric | Spec (A18 / ELEV) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Default size | 56dp | `$button-floating-width` 56px | match |
| Mini size | 40dp | `$button-floating-small-width` 40px (`small`) | match |
| Icon size, default | 24dp | `$button-floating-icon-width` 24px | match |
| Icon size, mini | 24dp | `$button-floating-small-icon-width` 18px | discrepancy |
| Large FAB | not in MD1 | 72px with 30px icon (`large`) | Vuetify-only |
| Resting elevation | 6dp | `elevation(6)` | match |
| Pressed elevation | 12dp | `:active` `elevation(12)` | match |
| Edge inset | 16dp mobile, 24dp tablet and desktop | `$grid-gutters.lg` 16px for top, bottom, left, right at all sizes | discrepancy: no 24px tablet or desktop inset |
| Mini at 460dp or less | required | not implemented | gap |
| Entrance | expanding piece of material | no default entrance transition on `v-btn`; `v-speed-dial` uses `scale-transition` for items | partial |
| Speed dial count | 3 to 6 | unconstrained | gap (behavioral) |
| Speed dial stagger | not found | 0.05s per item | Vuetify-only |
| Speed dial direction | not found | top, bottom, left, right | Vuetify-only |
| Open on hover | not in MD1 | `openOnHover` prop | Vuetify-only |
| Focus color change | stated, value not found | 12% currentColor overlay on hover, focus, active | Vuetify-only value |
| Morph, toolbar, full screen | described | no component support | gap |
| z-index when fixed or absolute | not found | 4 | Vuetify-only |
| Icon rotate swap | not found | 45deg rotate cross-fade between two child icons when active | Vuetify-only |
