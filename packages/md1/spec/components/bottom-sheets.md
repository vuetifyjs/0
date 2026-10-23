# Bottom sheets (Material Design 1)

Spec page: Components > Bottom sheets. Covers modal and persistent bottom sheets, list-style and grid-style layouts with and without headers, deep-linked sheets, mobile and tablet or desktop widths, dismissal, and the 16:9 height keyline.

## Sources

| Tag | URL | Snapshot | Used for |
|---|---|---|---|
| A18 | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-sheets.html | 2018-12-25 00:22:55 UTC | primary, authoritative |
| G16 | https://web.archive.org/web/20160604061521/http://www.google.com/design/spec/components/bottom-sheets.html | 2016-06-04 06:15:21 UTC | version cross-check; grid-style metrics changed between versions |
| ELEV | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/material-design/elevation-shadows.html | 2018-12-25 00:22:55 UTC | 16dp modal bottom sheet elevation |
| MOTION | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/motion/duration-easing.html | 2018-12-25 00:22:55 UTC | durations and curves |
| COLOR | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/color.html | 2018-12-25 00:22:55 UTC | text opacities |
| KEY | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/layout/metrics-keylines.html | 2018-12-25 00:22:55 UTC | ratio keyline formula, increments, list keylines |
| BNAV | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/bottom-navigation.html | 2018-12-25 00:22:55 UTC | bottom sheets cover the bottom navigation bar |
| V15 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_bottom-sheets.styl`, `_dialogs.styl`, `_overlay.styl`, `settings/_variables.styl`, `components/VBottomSheet/VBottomSheet.js` | Vuetify 1.5.24 | cross-check |

Fetch notes: fetched with `curl -sL` over HTTPS; text extracted from static HTML. Redline images carry no alt text; image-only values are recorded as `not found`.

Confidence legend: `high` = read from the spec page text; `moderate` = from Vuetify 1.5 stylus only; `low` = memory.

## 1. Purpose and usage

- Bottom sheets slide up from the bottom of the screen to reveal more content. They are displayed only as a result of a user-initiated action. (A18, high)
- Modal bottom sheets are alternatives to menus or simple dialogs, can present deep-linked content from other apps, and are primarily for mobile. Persistent bottom sheets present in-app content that supplements the main view. (A18, high)
- Elevation distinguishes the two: modal sheets rest higher than the app's content; persistent sheets rest at the app's elevation and integrate with its content. (A18, high)
- On larger screens, alternative surfaces (simple dialogs, menus) may be more appropriate. (A18, high)
- Persistent sheet usage: to introduce new content on a unique surface; to display content equal in value to the primary content (place details while a map pans; playback controls that stay visible). (A18, high)
- Modal sheet usage: present actions in a list or grid as an alternative to menus or simple dialogs; display a contextual menu when there is no obvious entry point; prioritize the visibility of the elements they contain; show long menu item names, items with subtext, and icons. (A18, high)
- Tablet and desktop alternatives to modal sheets (A18, high):

| Alternative | Benefit |
|---|---|
| Menu | Keeps action choices close to the point of interaction |
| Simple dialogs | Strongly interrupts the user's current context |
| Inline expansion within the same view | Not as interruptive as a menu or dialog |
| Showing all options as a persistently accessible element | Does not require a button press to access them |
| Opening a new browser window | Flexible sizing and layout independence |

## 2. Types and variants

| Type | Definition | Metrics | Confidence |
|---|---|---|---|
| Modal bottom sheet | Appears above other UI, dims the rest of the screen, must be dismissed to interact with content | 16dp elevation; full width on mobile | high |
| Persistent bottom sheet | Integral part of the layout, remains visible when not in use | Same elevation as the app; full width on mobile; full width or inset on tablet and desktop | high |
| List-style modal sheet | Actions as a list, 48dp rows, 24dp icons | Section 4 | high |
| List-style sheet with header | List with a 56dp title row and a 1dp divider | Section 4 | high |
| Grid-style sheet with icons | Actions as a grid of 48dp icons with 16dp labels | Section 4 | high |
| Grid-style sheet with header | Grid with a 56dp title row and divider | Section 4 | high |
| Deep-linked modal sheet | Content or controls from another app; spans the full screen width | | high |
| Fully expanded modal sheet | Swiped up to fill the screen; content scrolls internally; keeps 8dp from the app bar's bottom when showing menu items; shows an X in the app bar | | high |
| Inset persistent sheet (tablet and desktop) | Narrower than the screen, width set by content and layout | Increment table in section 4 | high |
| Desktop transformed persistent sheet | Content moves to another sheet of material, for instance on the left side of the interface | | high |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Sheet surface | Background #FFFFFF; square corners in all figures (radius not stated) | high (color), high (absence of radius) |
| Scrim (transparent overlay) | #000000 at 20% behind a modal sheet | high |
| Title (optional) | Roboto Regular 16sp, #000000 54%; title row 56dp | high |
| List item | 48dp tall; text Roboto Regular 16sp, #000000 87% | high |
| List icon | 24dp x 24dp, vertically centered; 32dp horizontal padding between icon and text | high |
| Grid item | 48dp x 48dp icon with a 16dp tall label centered below; 8dp between icon and label | high |
| Divider | 1dp | high |
| App bar with X | Present when the sheet is fully expanded (deep-linked content) | high |
| Drag handle | not found (not an MD1 element) | high (absence) |

## 4. Metrics and keylines

Font and color (mobile specs):

| Item | Value | Source | Confidence |
|---|---|---|---|
| Text | Roboto Regular 16sp, #000000 87% | A18 | high |
| Title (optional) | Roboto Regular 16sp, #000000 54% | A18 | high |
| Default background fill | #FFFFFF | A18 | high |
| Transparent overlay fill | #000000 20% | A18 | high |

List-style bottom sheet:

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Screen edge left and right margins (content keyline) | 16dp | A18 | high |
| Top and bottom margins | 8dp | A18 | high |
| List item height | 48dp | A18 | high |
| List icons | 24dp x 24dp, middle vertical alignment | A18 | high |
| Text associated with an icon | 32dp horizontal padding (icon to text) | A18 | high |

List-style sheet with header:

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Screen edge left and right margins | 16dp | A18 | high |
| Space below the top list item | 7dp | A18 | high |
| Divider line | 1dp | A18 | high |
| Space above the second bottom sheet (section) | 8dp | A18 | high |
| List item height | 48dp | A18 | high |
| List icons | 24dp x 24dp, middle vertical alignment | A18 | high |
| Text associated with an icon | 32dp horizontal padding | A18 | high |
| List title height | 56dp | A18 | high |

Grid-style bottom sheet with icons:

| Metric | Value (A18) | Value (G16) | Confidence |
|---|---|---|---|
| Margin on all sides of grid | 24dp | Screen edge left and right margins 24dp; padding below grid 24dp | high (A18 wins) |
| Space between grid list rows | 24dp | Vertical space between grid lists 16dp | high (A18 wins; record the change) |
| Grid list icons | 48dp x 48dp, equally spaced across each row | 48dp x 48dp, middle vertical alignment, equally distributed across the grid | high |
| Grid list label | 16dp tall, center-aligned below each icon | same | high |
| Margin below icon | 8dp | not stated | high |

Grid-style bottom sheet with header (A18 only; absent from G16):

| Metric | Value | Confidence |
|---|---|---|
| Screen edge left and right margins | 24dp | high |
| Space below list row | 8dp | high |
| Divider line | 1dp | high |
| Space above and below divider line | 8dp | high |
| List icons | 48dp x 48dp, middle vertical alignment | high |
| Grid list label | 16dp tall, center-aligned below each icon | high |
| List title height | 56dp | high |

Height rules:

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Initial height | Relative to the height of the list items or grid rows it contains; dictated by the amount of content | A18 | high |
| Initial maximum height | Must not extend beyond the 16:9 ratio keyline (height = width divided by 16/9, per the KEY formula) | A18, KEY | high (rule); formula application is interpretation |
| Minimum height | Relative to the height of the list items it contains | A18 | high |
| Expanded height | May be swiped up to fill the screen with internal scrolling; a long list may scroll internally and expand past the 16:9 keyline | A18 | high |
| Distance from app bar when fully expanded with menu items | Minimum 8dp below the bottom of the app bar | A18 | high |
| Initial overlap with app bar | Never; retain an area above the sheet to tap outside and dismiss | A18 | high |

Width rules:

| Context | Value | Source | Confidence |
|---|---|---|---|
| Mobile, modal | Full screen width in portrait and landscape | A18 | high |
| Mobile, persistent | Full width in portrait and landscape | A18 | high |
| Tablet and desktop, persistent | Full width or inset, as determined by content width, overall UI, underlying content, and stylistic choices | A18 | high |
| Tablet and desktop, modal and inset persistent | Width based on layout increments; the increment is typically the app bar height (64dp); a 960dp screen is fifteen increments wide | A18 | high |

| Screen width | Minimum distance from screen edge | Minimum sheet width | Source | Confidence |
|---|---|---|---|---|
| 960dp | 1 increment (64dp) | 6 increments (384dp) | A18 | high (increment arithmetic is interpretation) |
| 1280dp | 2 increments (128dp) | 8 increments (512dp) | A18 | high |
| 1440dp | 3 increments (192dp) | 9 increments (576dp) | A18 | high |

Type styles: list text and title at 16sp Regular map to Subheading; grid labels (16dp tall row) have no stated size: not found. (values high; style name mapping low, confirm against the Typography note)

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Sheet background | #FFFFFF | not found | A18 | high |
| Scrim | #000000 20% | not found | A18 | high |
| Item text | #000000 87% | not found (COLOR primary text 100% #FFFFFF) | A18, COLOR | high |
| Title text | #000000 54% | not found (COLOR secondary text 70% #FFFFFF) | A18, COLOR | high |
| Icons | not found (COLOR active icon 54% #000000) | not found (COLOR 100% #FFFFFF) | COLOR | high (rule) |
| Divider | not found (COLOR dividers 12%) | 12% | COLOR | high (rule) |
| Persistent sheet | Same surface as the app content; no scrim | | A18 | high |
| Vuetify 1.5 scrim | rgba(33, 33, 33, 0.46) | same | V15 | moderate |
| Vuetify 1.5 sheet | dialog surface (`$material.cards`) #FFFFFF / #424242 | | V15 | moderate |

## 6. Elevation

| Type or state | Value | Source | Confidence |
|---|---|---|---|
| Modal bottom sheet | 16dp (same tier as the navigation drawer and right drawer) | ELEV, A18 ("higher than the app") | high |
| Persistent bottom sheet | Same elevation as the app content (no offset) | A18 | high |
| Relative order | Above the bottom navigation bar (8dp) and snackbar (6dp); below dialogs and pickers (24dp) | ELEV, BNAV | high |
| Pressed, focused, hover | not found | A18 | high (absence) |
| Desktop | General rule: 2dp below the listed values | ELEV | high (rule) |

## 7. Motion

| Transition | Pattern | Duration | Easing | Source | Confidence |
|---|---|---|---|---|---|
| Enter | Slides up from the bottom of the screen and initially covers a portion of the screen; a modal sheet dims the rest of the screen | not found | not found | A18 | high (pattern) |
| Expand | Swipe up to fill the height of the screen; content then scrolls internally | not found | not found | A18 | high |
| Exit | Swipe down, tap outside (modal), tap X, or system back | not found | not found | A18 | high |
| FAB interaction | Introducing a persistent sheet may move the FAB vertically | not found | not found | A18 | high |
| Generic guidance | Mobile entering 225ms, leaving 195ms, large full-screen transitions 375ms; tablet about 30% longer; desktop 150ms to 200ms | | Deceleration curve cubic-bezier(0.0, 0.0, 0.2, 1) for entering; acceleration cubic-bezier(0.4, 0.0, 1, 1) for leaving; standard curve for the expand-in-place growth | MOTION | high |
| Vuetify 1.5 | `bottom-sheet-transition` (slide), overlay fade with a 150ms delay | 300ms sheet, 300ms overlay | cubic-bezier(0.25, 0.8, 0.25, 1) sheet; cubic-bezier(0.25, 0.8, 0.5, 1) overlay | V15 | moderate |

## 8. States

| State | Modal | Persistent | Source | Confidence |
|---|---|---|---|---|
| Closed | Off-screen; no scrim | Off-screen or collapsed (collapsed height not found) | A18 | high |
| Partially expanded (initial) | Height from content, at most the 16:9 keyline; scrim at 20% black; app bar not overlapped | Visible at its content height | A18 | high |
| Fully expanded | Fills the screen; internal scrolling; X in the app bar; 8dp below the app bar for menu items | Fills the available space; may transform into another surface on desktop | A18 | high |
| Dismissing | Swipe down, tap outside, X, or back | Swipe down, X, or back | A18 | high |
| Item hover, focus, pressed | not found (list items follow the Lists spec) | not found | A18 | high (absence) |
| Disabled | not found | not found | A18 | high (absence) |
| Error | not found | not found | A18 | high (absence) |
| Overlay opacities | Scrim 20% black only | none | A18 | high |

## 9. Behavior

- Display only as a result of a user-initiated action. (A18, high)
- Dismissal: swipe the sheet down; touch an explicit control such as an X in the app bar; touch the system back button (Android). Modal sheets can also be dismissed by touching outside the sheet. (A18, high)
- Modal sheets must be dismissed before interacting with the underlying content; the rest of the screen dims. (A18, high)
- Do not initially overlap the app bar; retain an area above the sheet for tap-to-dismiss. Height is dictated by content; the initial height does not exceed the 16:9 keyline; long lists scroll internally and may expand past the keyline when swiped up. (A18, high)
- Fully expanded modal sheets provide an X in the app bar; an Up arrow is appropriate only when navigating downward into the content hierarchy. (A18, high)
- Deep links: a deep-linked sheet can travel multiple levels deep within another app and return to the starting level, but cannot navigate upward past the initial level; links may instead navigate away from the sheet into another view; an explicit "open the application" link in an overflow menu enables upward navigation; actions such as "add contact" may open the parent application. (A18, high)
- Persistent sheets remain visible when not actively in use and integrate with app content; introducing one may move the FAB vertically; on desktop the content may move onto another sheet of material. (A18, high)
- Layering: bottom sheets appear in front of the bottom navigation bar, temporarily covering it. (BNAV, high)
- Limits: no maximum item count; grid sheets use rows of equally spaced 48dp icons; large screens should use layouts appropriate to the extra space (grid list or long list). (A18, high)
- Ordering: not found. (A18, high)
- Scrolling: internal scrolling only after expansion; the underlying content does not scroll while a modal sheet is open (implied by the modal requirement). (A18, high; the implied part is interpretation)

## 10. Web notes

- Maps 1:1: 48px rows, 56px title row, 24px list icons with a 32px icon-to-text gap, 16px and 24px keylines, 48px grid icons with 16px labels and 8px spacing, 1dp dividers, #FFFFFF surface, 20% black scrim, 16dp shadow set.
- The 16:9 keyline is a maximum initial height of `width * 9 / 16` (a 360px wide phone gives 202.5px); implement as `max-height` on the initial state, lifted when the sheet is expanded. (interpretation from the KEY formula)
- The tablet and desktop width table is expressed in increments of the app bar height (64dp on tablet and desktop); implement as a width calculation on the breakpoint, not as a fixed percentage. (interpretation)
- Swipe-to-dismiss and swipe-to-expand are pointer gestures; the X control and Escape (via the dialog pattern) are the required non-gesture paths. (interpretation)
- Persistent sheets are not modal: no scrim, no focus trap, and content behind them stays interactive. The Vuetify 1.5 `persistent` prop means "no outside-click dismissal" and is not the MD1 persistent sheet; do not reuse that naming. (V15, moderate)
- Modal sheets stack above bottom navigation (8dp) and below dialogs (24dp); the stacking order needs a z-index scale mirroring the elevation table.
- WAI-ARIA patterns to follow (names only): modal bottom sheet: APG "Dialog (Modal)" (focus trap, Escape closes, scrim); its list-style content as an APG "Menu" when the items are commands, or a list of links or buttons otherwise; grid-style content as a "Menu" or a "Grid" of buttons. Persistent bottom sheet: a `complementary` or `region` landmark (non-modal); if it carries focus management, APG "Dialog (Non-Modal)". Deep-linked sheets with an app bar: the same "Dialog (Modal)" with the X as the close button. v0 composition: `Dialog.Root` for the modal sheet per DESIGN_SYSTEMS.md ruling 2. (pattern names: high; v0 mapping: interpretation)

## Vuetify 1.5 cross-check

Files: `_bottom-sheets.styl`, `_dialogs.styl`, `_overlay.styl`, `settings/_variables.styl`, `VBottomSheet.js`. Vuetify 1.5 implements the bottom sheet as a `v-dialog` with `contentClass` `v-bottom-sheet` and the `bottom-sheet-transition`.

| Metric | Spec (A18 / ELEV) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Modal elevation | 16dp | `.v-dialog` `elevation(24)` (dialog value) | discrepancy |
| Scrim | #000000 20% | `.v-overlay--active:before` rgba(33, 33, 33, 0.46) | discrepancy |
| Sheet background | #FFFFFF | dialog surface `$material.cards` #FFFFFF light / #424242 dark | match (light); dark is Vuetify-only |
| Corner radius | not stated (square in figures) | `.v-bottom-sheet.v-dialog` border-radius 0 | consistent |
| Mobile width | full width | `min-width: 100%`, `flex: 1 0 100%`, margin 0; `--inset` falls back to `max-width: none` below 600px | match |
| Tablet and desktop inset width | increment table (1 to 3 increments from the edge, 6 to 9 increments wide) | `--inset` `max-width: 70%` | discrepancy |
| Initial height and 16:9 keyline | stated | none; height is the content height | gap |
| Expand to full screen with internal scroll | stated | none (`v-dialog` `fullscreen` is a different mode) | gap |
| Swipe to dismiss | stated | none (`v-dialog` closes on outside click or Escape) | gap |
| Tap outside to dismiss | modal only | default for `v-dialog`; `persistent` prop disables it | match (naming collision, see section 10) |
| X in app bar when fully expanded | stated | author supplied | gap |
| Persistent (non-modal) sheet | stated | no component (`hideOverlay` keeps the dialog modal) | gap |
| List item height | 48dp | `v-list` single-line tile 48px (`$list-item-single-height`) when composed | match (moderate) |
| Title row | 56dp | `v-subheader` 48px when composed | discrepancy |
| Icon to text padding | 32dp | `v-list` content left padding 72px minus 16px keyline minus 24px icon gives 32px | match by construction (moderate) |
| Grid-style layout | 48dp icons, 16dp labels, 24dp margins and row spacing | none | gap |
| Enter and exit transition | slide up; durations not found | `bottom-sheet-transition` 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); overlay 0.3s with 150ms delay | Vuetify-only |
| Desktop alternatives | menus, dialogs, inline expansion | n/a | n/a |
