# Navigation drawer (pattern)

Pattern page `patterns/navigation-drawer.html`. Ruling (see `rulings.md`): **component `QuNavigationDrawer`** with types temporary, persistent, permanent (full-height, clipped, floating) and the mini variant, plus a header (account) part, a scrim, and list content built from `QuList`, `QuSubheader` and `QuDivider`.

## Sources

| Source | Location | Read |
|---|---|---|
| MD1 spec, Navigation drawer | `https://web.archive.org/web/20181225002300/https://material.io/archive/guidelines/patterns/navigation-drawer.html` (requested 2018-12-25 00:22:55; served capture 2018-12-25 00:23:00) | yes, full text; a raw sweep of the HTML for every `dp`, `sp` and `%` token found nothing beyond the text below |
| MD1 spec, Navigation (when to use, nested / expanding / cascading drawers) | `https://web.archive.org/web/20181225002243/https://material.io/archive/guidelines/patterns/navigation.html` | yes, full text |
| MD1 spec, Settings (placement of "Settings" in the drawer) | `https://web.archive.org/web/20181225002157/https://material.io/archive/guidelines/patterns/settings.html` | yes, full text |
| MD1 spec, Help and feedback (placement of "Help", "Send feedback", "Sign out") | `https://web.archive.org/web/20181225002233/https://material.io/archive/guidelines/patterns/help-feedback.html` | yes, full text |
| MD1 spec, Swipe to refresh (drawers excluded) | `https://web.archive.org/web/20181225002224/https://material.io/archive/guidelines/patterns/swipe-to-refresh.html` | yes, full text |
| MD1 spec, Gestures (edge swipe) | `https://web.archive.org/web/20181225002235/https://material.io/archive/guidelines/patterns/gestures.html` | yes, full text |
| MD1 spec, Scrolling techniques (app bar heights for the clipped variant and the width formula) | `https://web.archive.org/web/20181225002145/https://material.io/archive/guidelines/patterns/scrolling-techniques.html` | yes, full text |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_navigation-drawer.styl`, `_overlay.styl`, `_system-bars.styl`, `_lists.styl` (heights only), `_subheaders.styl` (color only), `src/stylus/settings/_variables.styl`, `_theme.styl`, `_elevations.styl`, `src/stylus/tools/_bootable.styl`, `src/components/VNavigationDrawer/VNavigationDrawer.ts`, `src/components/VList/VListTile.ts` (activeClass), `src/components/VSystemBar/VSystemBar.ts`, `src/mixins/overlayable.ts` | yes |

Confidence legend: `high` = read on the spec page named; `moderate` = Vuetify 1.5 source only; `low` = memory.

## 1. Purpose and usage

| Rule | Text (spec) | Page | Confidence |
|---|---|---|---|
| Definition | The navigation drawer slides in from the left and contains the navigation destinations for your app. | navigation-drawer | high |
| Extent | The nav drawer spans the height of the screen, with everything behind it visible but darkened by a scrim. | navigation-drawer | high |
| Metrics inheritance | The navigation drawer follows the keylines and metrics for lists. | navigation-drawer | high |
| When to use | When there is insufficient space to support tabs, side navigation is a good alternative. Side navigation can display many navigation targets at once. A drawer remains hidden until invoked by the user. | navigation | high |
| Hierarchies | Lateral navigation; parents with siblings or peers. | navigation | high |
| Recommended for | Apps with many top-level views; enabling quick navigation between unrelated views; deep navigation structures; reducing visibility of infrequent destinations. | navigation | high |
| Ordering | Apps with a single "home" should list the most frequently accessed destinations at the top of side navigation. | navigation | high |
| Bottom items | Settings and support are located at the bottom of the scrolling list, inline with the rest of the list content. They refer to Help, Feedback, or Help & feedback. | navigation-drawer | high |
| "Settings" placement | Include "Settings" below all other items (except Help & Feedback). Do not use synonyms such as "Options" or "Preferences". | settings | high |
| "Help" placement | Place "Help" as the last item in the navigation drawer, with "Send feedback" directly above it. If "Sign out" appears in the navigation drawer, it should be the last item in the list. | help-feedback | high |
| Do not | Swipe to refresh is not used in navigation drawers: they contain navigation destinations, not dynamic content. | swipe-to-refresh | high |
| Do not | Persistent navigation drawers are not recommended for apps with multiple levels of hierarchy that require using an up arrow for navigation. | navigation-drawer | high |

## 2. Types and variants

| Type | Visibility | Elevation relation to content | Default state | Opens by | Closes by | Recommended / required | Confidence |
|---|---|---|---|---|---|---|---|
| Permanent | Always visible, pinned to the left edge | Same elevation as the content or background | open | n/a | Cannot be closed | Recommended default for desktop | high |
| Permanent, full-height | Full screen height | same as above | open | n/a | n/a | Apps focused on information consumption that use a left-to-right hierarchy | high |
| Permanent, clipped under the app bar | Starts below the app bar | same as above | open | n/a | n/a | Apps focused on productivity that require balance across the screen | high |
| Permanent, floating | Detached from the screen edge (figures show it inside a card) | same as above | open | n/a | n/a | Apps that require less hierarchy | high |
| Persistent | Toggles open or closed; when open it sits beside the content | Same surface elevation as the content | closed | Selecting the menu icon | The user closes it; stays open until then | Acceptable for all sizes larger than mobile | high |
| Mini variant (of persistent) | Always visible at reduced width; expands to the standard persistent drawer | Same elevation as the content; clipped by the app bar | mini | Expanding | Collapsing back to mini | App sections that need quick selection access alongside content; also an acceptable closed state for a temporary drawer | high |
| Temporary | Toggles open or closed; opens above all other content | 16 dp above the content, with a scrim | closed | Toggle (menu icon) | Selecting a section | Recommended for tablet; required for mobile; shown on desktop too | high |

Pinning rule for the permanent drawer (high): "The threshold for pinning is calculated using these minimum values: 1. Side nav width 2. Content width 3. Content padding."

Persistent drawer layout rule (high): "When the drawer is outside of the page grid and opens, the drawer forces other content to change size and adapt to the smaller viewport." State rule (high): "The state of the drawer is remembered from action to action and session to session."

Nested forms from the navigation page (high):

| Form | Text (spec) |
|---|---|
| Nested navigation | When you have multiple levels of navigation, sibling views should be nested underneath their parent. On desktop, a secondary level of navigation may be nested within the navigation drawer. |
| Expanding navigation drawer | Upon selecting a level, the level of navigation below is revealed. Selecting a collapsed section expands that level in-line, hiding all levels outside of it. |
| Cascading navigation drawer (desktop only) | Cascading menus expand navigation drawer content horizontally. Each collection of views is presented in its own panel, and a level closes when a subsection is selected. |

## 3. Anatomy

| Part | Description (spec) | Confidence |
|---|---|---|
| Scrim | Darkens everything behind the drawer; content stays visible | high |
| Drawer surface | Full screen height, including behind the status bar (temporary) | high |
| Header (account area) | Carries the "Name" and "Email address" text (typography figure) on a colored or image background; height of the subtitle row 56 dp (vertical spacing figure) | high (text and 56 dp), low (what the background is; the figure is an image) |
| Subheader ("subtitle") | Roboto Medium 14 sp, 54% black, aligned to the 16 dp keyline; rows 48 dp; subheaders contain their own padding | high |
| List item | Roboto Medium 14 sp, 87% black; 48 dp rows; icon at 16 dp, text at 72 dp | high |
| Icon or avatar | Aligned at the 16 dp left margin; icon color 54% black | high |
| Divider | Full-bleed within the drawer, 8 dp padding above and below | high |
| List grouping | 8 dp padding at top and bottom of every grouping (except the top of a list that starts with a subheader) | high |
| Settings and support items | Bottom of the scrolling list, inline | high |
| Selected item | Primary color (or 100% black) text and icon; ripple highlights the row | high |

## 4. Metrics and keylines

| Metric | Mobile | Tablet / desktop | Type style | Source | Confidence |
|---|---|---|---|---|---|
| Resting elevation (temporary) | 16 dp | 16 dp | | navigation-drawer | high |
| Width | Screen width minus the app bar height (56 dp gap on the right in the example) | Screen width minus the app bar height | | navigation-drawer | high |
| Maximum width | 280 dp (5 x 56 dp standard increment) | 320 dp (5 x 64 dp standard increment) | | navigation-drawer | high |
| App bar height used by the width formula and the clipped variant | 56 dp | 64 dp | | scrolling-techniques | high |
| Status bar (drawer extends behind it) | 24 dp | 24 dp | | navigation-drawer, scrolling-techniques | high |
| Horizontal margins | 16 dp | 24 dp (tablet) | | navigation-drawer | high |
| Icon keyline (left and right) | 16 dp | 16 dp | | navigation-drawer | high |
| Text keyline next to an icon or avatar | 72 dp | 72 dp | | navigation-drawer | high |
| Subtitle (header account row) | 56 dp | 56 dp | | navigation-drawer | high |
| Subheader and list item row | 48 dp | 48 dp | | navigation-drawer | high |
| Space between content areas | 8 dp | 8 dp | | navigation-drawer | high |
| List grouping padding | 8 dp top and bottom | same | | navigation-drawer | high |
| Divider spacing | 8 dp above and below, full-bleed | same | | navigation-drawer | high |
| Name (header) | Roboto Medium 14 sp, `#FFFFFF` | same | Body 2 | navigation-drawer | high (value), moderate (style name) |
| Email address (header) | Roboto Regular 14 sp, `#FFFFFF` | same | Body 1 | navigation-drawer | high / moderate |
| List item text | Roboto Medium 14 sp, 87% `#000000` | same | Body 2 | navigation-drawer | high / moderate |
| Subheader text | Roboto Medium 14 sp, 54% `#000000` | same | Body 2 at secondary opacity | navigation-drawer | high / moderate |
| Mini variant width | not found | not found | | spec | n/a; Vuetify 1.5 uses 80 px (moderate) |
| Icon size | not found on this page (24 dp system icon size is stated on the fingerprint page as "the standard system icon size, 24dp") | | | fingerprint | high for the system icon size, moderate for applying it here |
| Avatar size | not found on this page | | | spec | n/a |
| Touch target | 48 dp rows (the only touch metric on the page) | | | navigation-drawer | high |
| Corner radius | not found (full-height sheet); floating-in-card example inherits the card radius (Vuetify 1.5 `$card-border-radius` 2 px) | | | spec / Vuetify 1.5 | n/a / moderate |
| Two-line and avatar rows (if used in the drawer) | not on this page; Vuetify 1.5 list rows: avatar 56 px, two-line 72 px, three-line 88 px | | | Vuetify 1.5 `_variables.styl` | moderate |

Type style mapping used in this note: Roboto Medium 14 sp = Body 2, Roboto Regular 14 sp = Body 1 (mirrors Vuetify 1.5 `$headings`: body-2 14 px / 500, body-1 14 px / 400). The `style/typography` note is the owner. Confidence moderate.

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Drawer surface | not stated on the page; Vuetify 1.5 `$material-light.cards` = `#FFFFFF` | Vuetify 1.5 `$material-dark.cards` = grey darken-3 `#424242` | Vuetify 1.5 `_theme.styl` | moderate |
| Scrim | not found (the page says "darkened by a scrim" with no value) | not found | spec | n/a; Vuetify 1.5 `rgba(33,33,33,.46)` (moderate) |
| Header name and email | `#FFFFFF` 100% | `#FFFFFF` 100% | navigation-drawer | high |
| Header background | not found (figure shows an image or a primary fill) | not found | spec | n/a |
| List item text | 87% `#000000` | not found; Vuetify 1.5 text.primary `#FFFFFF` 100% | navigation-drawer / Vuetify 1.5 | high / moderate |
| Subheader text | 54% `#000000` | not found; Vuetify 1.5 text.secondary `rgba(255,255,255,.70)` | navigation-drawer / Vuetify 1.5 | high / moderate |
| Icons | 54% `#000000` | not found; Vuetify 1.5 icons.active `#FFFFFF`, inactive 50% | navigation-drawer / Vuetify 1.5 | high / moderate |
| Selected item text and icon | App primary color, or `#000000` 100% | not found | navigation-drawer | high |
| Selected row highlight | Touch ripple / highlight; use a darker tint of primary when the ripple does not contrast enough with primary | not found | navigation-drawer | high |
| Row hover | not found | not found | spec | n/a; Vuetify 1.5 list tile hover `rgba(0,0,0,.04)` light / `rgba(255,255,255,.08)` dark (moderate) |
| Divider | not found | not found | spec | n/a; Vuetify 1.5 `rgba(0,0,0,.12)` light / `rgba(255,255,255,.12)` dark (moderate) |
| Border of a non-floating persistent or permanent drawer | not found | not found | spec | n/a; Vuetify 1.5 draws a 1 px edge in the dividers color (moderate) |

## 6. Elevation

| Type / state | Value | Source | Confidence |
|---|---|---|---|
| Temporary, open | 16 dp resting ("spans the full height of the screen, including behind the status bar, at a resting elevation of 16dp") | navigation-drawer | high |
| Permanent (all three forms) | Same elevation as the content or background (0 dp relative) | navigation-drawer | high |
| Persistent | Same surface elevation as the content | navigation-drawer | high |
| Mini variant | Same elevation as the content | navigation-drawer | high |
| Floating permanent in a card | Card elevation; value not on this page (cards note) | navigation-drawer | n/a |
| Pressed / raised / focused | not found | spec | n/a |
| Vuetify 1.5 16 dp shadow | `0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12)` (`elevation(16)` applied to `--temporary` and `--is-mobile` when not closed) | Vuetify 1.5 `_elevations.styl`, `_navigation-drawer.styl` | moderate |

## 7. Motion

| Transition | Spec text | Duration / easing | Confidence |
|---|---|---|---|
| Open (temporary) | "slides in from the left" | not found | high (direction), n/a (timing) |
| Close (temporary) | not described beyond "opens temporarily above all other content until a section is selected" | not found | n/a |
| Persistent open | "opens by selecting the menu icon"; content resizes to the smaller viewport | not found | high / n/a |
| Mini expand / collapse | "changes its width" | not found | high / n/a |
| Scrim fade | not described | not found | n/a |
| Vuetify 1.5 | `transform, width` transition 0.2 s `cubic-bezier(0.4, 0, 0.2, 1)` (fast-out-slow-in) once booted; overlay 0.3 s `cubic-bezier(.25,.8,.5,1)` with a 150 ms delay; removal timer 650 ms | Vuetify 1.5 `_bootable.styl`, `_overlay.styl`, `overlayable.ts` | moderate |

Durations and curves belong to the `motion/duration-easing` note; the drawer page states none.

## 8. States

| State | Rendering (spec) | Confidence |
|---|---|---|
| Closed (temporary, persistent) | Off-screen; menu icon in the app bar opens it | high |
| Mini (mini variant) | Reduced width at content elevation, clipped by the app bar | high |
| Open | Full list; temporary adds the 16 dp elevation and the scrim | high |
| Item normal | 87% black text, 54% black icon | high |
| Item hover | not found | n/a |
| Item focus | not found | n/a |
| Item pressed | Touch ripple highlights the row | high |
| Item selected / active | Text and icon in primary (or 100% black); ripple / highlight on the row, darker tint of primary if needed | high |
| Item disabled | not found | n/a |
| Overlay opacities for hover / focus / pressed | not found on this page (states note owner: `style/color` or `components/lists`) | n/a |

## 9. Behavior

| Rule | Text (spec) | Page | Confidence |
|---|---|---|---|
| Dismissal (temporary) | Opens temporarily above all other content until a section is selected | navigation-drawer | high |
| Dismissal by scrim tap or back | Not stated on the drawer page. The navigation page says the Back button "dismisses floating windows (such as dialogs or popups)"; the drawer is not named | navigation | high (that it is unstated) |
| Persistence of state | Remembered from action to action and session to session (persistent) | navigation-drawer | high |
| Scrolling | The navigation drawer scrolls in the same way a view scrolls | navigation-drawer | high |
| Content resize | Persistent drawer outside the page grid forces other content to resize | navigation-drawer | high |
| Permanent | Cannot be closed; pinned by the width / content width / content padding threshold | navigation-drawer | high |
| Ordering | Most frequent destinations at the top; Settings below everything except Help & feedback; Send feedback then Help last; Sign out last if present | navigation, settings, help-feedback | high |
| Grouping | 8 dp padding around each grouping; full-bleed dividers with 8 dp above and below | navigation-drawer | high |
| Nested levels | Expanding: selecting a collapsed section expands it in-line and hides all levels outside it. Cascading (desktop only): horizontal panels; a level closes when a subsection is selected | navigation | high |
| Opening gesture | Edge swipe originates outside the screen to reveal off-screen content and is committed on crossing a threshold (gestures page); the drawer page itself does not name the gesture | gestures | high |
| Limits | not found (number of items, levels) | spec | n/a |

## 10. Web notes

| Topic | Note |
|---|---|
| Maps 1:1 | Four types, 280 / 320 dp maximum widths, 16 dp elevation with scrim for temporary, list keylines (16 / 72 dp), 48 dp rows, selected item in primary, ordering rules, 8 dp grouping and divider spacing. |
| Needs interpretation | "Screen width minus the app bar height" becomes `min(100vw - 56px, 280px)` on phones and `min(100vw - 64px, 320px)` on tablets; the breakpoints come from the `layout/responsive-ui` note (Vuetify 1.5 used 1264 px as its mobile cut, moderate). The status bar does not exist on the web, so the drawer starts at the viewport top and the header is 56 dp without the 24 dp strip, unless a system bar component is used. "Remembered from session to session" is the consumer's storage (v0 `useStorage`). The mini variant width is not in the spec: record the chosen value in `SPEC.md` as a deviation. |
| Scrim | Opacity is not in the spec. Pick one value for the whole system (dialogs and bottom sheets share it) and record it in `SPEC.md` as a deviation; Vuetify 1.5 used `#212121` at 46%. |
| Types as API | `type: 'temporary' \| 'persistent' \| 'permanent'`, `clipped`, `floating`, `mini` (persistent and temporary), `v-model` open state, `width` capped by the spec maxima. |
| WAI-ARIA pattern | Temporary: Dialog (Modal) with a focus trap and Escape; persistent and permanent: a `<nav aria-label>` landmark, no dialog semantics; the item list is a list of links with `aria-current="page"` on the selected item; expanding groups follow the Disclosure pattern (APG "Disclosure Navigation Menu"); cascading panels are nested disclosures, not application menus. |
| v0 primitives | `Dialog.Root` or `Scrim` plus `useFocusTrap` for the temporary type; `useStack` for layering; `Collapsible` / `createNested` for expanding groups; `useBreakpoints` for the type switch. |

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5 | Verdict |
|---|---|---|---|
| Default width | max 280 dp mobile / 320 dp tablet; computed from screen width minus app bar height | `VNavigationDrawer.ts` `width` default 300 px, fixed | discrepancy: 300 px exceeds the mobile maximum and ignores the formula |
| Mini variant width | not found | `miniVariantWidth` default 80 px | spec silent |
| Mobile switch | temporary required on mobile; persistent for larger than mobile; permanent default on desktop | `mobileBreakPoint` 1264 px: below it the drawer becomes temporary (`--is-mobile`) | spec gives words, not a pixel value; 1264 px is the Vuetify desktop breakpoint minus 16 px |
| Temporary elevation | 16 dp | `elevation(16)` on `--temporary` and `--is-mobile` when not `--close` | match |
| Persistent / permanent elevation | same as content | no shadow; 1 px `__border` in dividers color unless `--floating` | match (border is an addition the spec does not mention) |
| Scrim | not found | `.v-overlay:before` `rgba(33,33,33,1)` at opacity 0.46, 0.3 s swing, 150 ms delay | spec silent |
| Status bar | 24 dp | `VSystemBar` 24 px (`status`), 32 px (`window`) | match |
| Item text | Roboto Medium 14 sp, 87% black | `$navigation-drawer-item-font-size` 14 px, weight 500 (`medium`); color via list tile text.primary `rgba(0,0,0,.87)` | match |
| Group child items | not found | weight 400 (`$navigation-drawer-group-item-font-weight`) | spec silent |
| Subheader | Roboto Medium 14 sp, 54% black, 48 dp row | `_subheaders.styl`: height 48 px, body-2 14 px / 500, color text.secondary (54%), padding 0 16 px | match |
| Row height | 48 dp | `$list-item-single-height` 48 px; avatar row 56 px; dense 40 px | match for 48; the 40 px dense row has no spec basis |
| Text keyline | 72 dp | `$list-item-left-padding` 72 px | match |
| Side margins | 16 dp mobile, 24 dp tablet | list tile padding 0 16 px at every width | discrepancy: no 24 px tablet margin |
| Icon color | 54% black | `icons.active` `rgba(0,0,0,.54)` | match |
| Selected item | primary color text and icon, or 100% black | `VListTile` `activeClass` default `primary--text`; stylus `.v-list__tile--active .v-list__tile__title { color: inherit }` | match |
| Selected row highlight | ripple / darker primary tint | ripple directive only; no persistent row tint | partial: the darker-tint rule is not implemented |
| Grouping padding | 8 dp top and bottom | `$list-top-padding` / `$list-bottom-padding` 8 px | match |
| Divider spacing | 8 dp above and below, full-bleed | not set in the drawer stylus | spec rule missing |
| Mini variant content | not found | hides tile content (`opacity: 0`), subheaders, dividers and groups; actions and avatars centered at `min-width: 48px` | spec silent |
| Open / close transition | not found | 0.2 s fast-out-slow-in on `transform, width` | spec silent |
| z-index | not found | 3; temporary / mobile 6; overlay 5 (set dynamically to the active z-index minus 1) | spec silent |
| Surface color | not found | `$material.cards`: `#FFFFFF` light, `#424242` dark | spec silent |
| Expanding groups | in-line expansion hiding other levels | `v-list-group` expands in-line; does not collapse siblings | partial |
| Cascading (desktop) | horizontal panels | none | spec behavior missing |
