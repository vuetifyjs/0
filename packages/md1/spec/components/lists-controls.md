# Lists: Controls

Material Design 1 spec page `components/lists-controls.html`, pinned for `@paper/md1` (list tile control slots of `Md1ListTile`; menu controls of `Md1MenuItem`).

## Sources

Primary (fetched and read by this note's author):

| URL | Note |
|---|---|
| http://web.archive.org/web/20210805003730/https://material.io/archive/guidelines/components/lists-controls.html | Requested `20181225002255`; the archive served the 2021-08-05 capture. Text identical to the 2018-01-19 capture. |
| http://web.archive.org/web/20180119205826/https://material.io/guidelines/components/lists-controls.html | Requested `20180223140411`; served 2018-01-19. |
| http://web.archive.org/web/20160604212921/http://www.google.com/design/spec/components/lists-controls.html | Requested `20160604061521`; served 2016-06-04. Same text. |
| http://web.archive.org/web/20160604212921im_/http://material-design.storage.googleapis.com/publish/material_v_8/material_ext_publish/0Bx4BSt6jniD7TWlQcWJZRE1NQ1U/components_listcontrols_usage.png | Images read at the same host and timestamp: `components_listcontrols_checkbox1.png`, `checkbox2.png`, `switch.png`, `reorder.png`, `expand1.png`, `expand3.png`, `expand4.png`, `leave1.png`, `menu1.png`, `menu2.png`, `menu3.png`. `leave2.png` and `expand2.png` could not be fetched (connection reset, 404 on the 2021 host). Images are xhdpi (2 px per dp). |

The page contains no numeric specification; every number below comes from the lists page (`lists.md`), from the supporting pages read via the shared scratchpad extractions `m1-*.txt` of the same archive (canonical path `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/<path>`): `components/selection-controls.html` (sibling extraction `md1/group-d/txt/selection-controls.txt`), `style/color.html`, `material-design/elevation-shadows.html`, `motion/duration-easing.html`, `layout/metrics-keylines.html`, `components/dividers.html`, or from measurement of the images listed above.

Vuetify 1.5.24 cross-check files: `stylus/components/_lists.styl`, `_selection-controls.styl`, `_dividers.styl`, `stylus/settings/_variables.styl`, `_theme.styl`, `components/VList/VListGroup.ts`.

Confidence legend: `high` = stated on a spec page or printed in a spec redline; `moderate` = Vuetify 1.5 only, or measured from a spec image; `low` = memory.

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "List controls display information and actions for list items." They provide information, indicate a state, or present actions, and appear as icons to the left or right of list text. | high |
| Four categories | State; primary action (including text strings); secondary action; secondary info. | high |
| Placement | States and primary actions on the left of the tile (for left-to-right interfaces; mirrored for right-to-left). Secondary actions and secondary info on the right. | high |
| Primary target | Text within a list item is part of the primary action target. | high |
| No adjacent controls | Do not place two icons or actions next to one another (for example a checkbox next to an avatar). | high |
| Navigation | If the primary action is navigational, do not use an icon; the item and its context communicate the destination. | high |
| Secondary targets | Secondary actions are always a separate target from the primary action, "as users increasingly expect every icon to trigger an action." | high |
| Menus | A menu is a special type of list; menu controls (check, inline information, nested menu indicator) are for dropdown and overflow menus only and must not be used in regular lists; regular list controls must not be used in menus. | high |

## 2. Types and variants

| Control | Category | Separate target | Spec rules | Confidence |
|---|---|---|---|---|
| Checkbox (left) | Primary action and state | No (it is the primary action and the state indicator) | Desktop checkboxes appear only on hover and focus. | high |
| Checkbox (right) | Secondary action | Yes | When controlling a family of variables, consider switches instead. | high |
| Switch | Secondary action | Yes | Right side. | high |
| Reorder | Secondary action | Usually, depending on the list mode | Allows dragging the item to other locations within the list; usually appears in list editing mode. Drag handle glyph (three horizontal bars) at the right in `reorder.png`. | high |
| Expand and collapse | Secondary action | Yes | Expands and collapses a list view vertically to show and hide details of existing list items. Chevron (expand_more) at the right; rotated when expanded. | high |
| Leave-behind | Other | not applicable | An informative hint of what swiping a list item away will do to it; can transform into an action. Swiping from either direction reveals an icon indicating the action; after the swipe a follow-up action can appear as a text button within the space of the list item. | high |
| Check (menu) | State | No | Menus only. Indicates the item is selected; the selection is made through a different control. | high |
| Inline information (menu) | Secondary info | No | Menus only. Small text snippet related to the line title (for example a keyboard shortcut); cannot be truncated. | high |
| Nested menu indicator (menu) | Primary action | No | Menus only. Glyph (triangle pointing right in `menu3.png`) indicating that a secondary menu flies out on hover, focus and/or selection. | high |

## 3. Anatomy

| Part | Position | Description | Confidence |
|---|---|---|---|
| Left control slot | 16 dp from the left edge, 24 dp wide for a checkbox or icon, 40 dp for an avatar; text keyline 72 dp | Holds the state or primary action control, or an avatar. `usage.png`: avatar left, icon right. | high (keylines, lists page) |
| Right control slot | Right edge 16 dp from the screen edge; 56 dp column | Holds the secondary action (checkbox, switch, reorder handle, chevron) or secondary info. | high |
| Checkbox | 24 dp box in the redlines (measured 48 px at 2x in `checkbox1.png`) | Filled with the accent color when on; outlined grey when off. | moderate (size), high (color, selection-controls page) |
| Switch | Track with a round thumb; thumb overhangs the track | `switch.png`: on state thumb and track in the accent color (track at reduced opacity), off state light thumb on a grey track. Dimensions are not in the page text (see the selection-controls note). | high (colors), not found (sizes) |
| Reorder handle | 24 dp glyph (measured 40 px wide at 2x) | Three horizontal bars, grey (inactive icon color). | moderate |
| Expand chevron | 24 dp glyph | expand_more; rotates 180 degrees to expand_less when open (`expand4.png`). | moderate |
| Revealed detail | Indented to the 72 dp keyline below the parent tile; the expanded group is separated from neighbours by full-bleed dividers above and below (`expand4.png`). | high (image) |
| Leave-behind panel | Under the tile, revealed by the swipe; `leave1.png` shows a grey panel 56 dp wide (measured 110 px at 2x) with a 24 dp delete icon centered, tile shifted right by the same amount. | moderate |
| Menu check | Check glyph in the left slot of a menu item, 16 dp from the left menu edge; text at the 56 dp keyline inside a mobile menu (`menu1.png`, measured). | moderate |
| Menu inline information | Right aligned text in the item, 16 dp from the right edge (`menu2.png`); keyboard shortcut rendered in the secondary text color. | moderate |
| Nested menu indicator | Right aligned triangle glyph, 16 dp from the right edge (`menu3.png`). | moderate |

## 4. Metrics and keylines

The lists-controls page states no numbers. Values below are the governing values from the lists page and the metrics-keylines page.

| Metric | Value | Confidence |
|---|---|---|
| Tile heights | Single-line 48 dp (56 dp with avatar), two-line 72 dp, three-line 88 dp; dense 40, 48, 60, 76 dp | high (lists page) |
| Left control edge | 16 dp from the screen edge | high |
| Text keyline | 72 dp (mobile), 80 dp (tablet) | high |
| Right control edge | 16 dp from the right edge; 56 dp control column | high |
| Touch target | At least 48 x 48 dp; 8 dp or more between targets | high (metrics-keylines page) |
| Icon glyph | 24 dp (measured from the redlines) | moderate |
| Checkbox box | 24 dp measured in `checkbox1.png`; the selection-controls page text gives no size | moderate |
| Switch track and thumb | not found in the page texts available (Vuetify 1.5: track 14 px tall, thumb 20 px) | not found (moderate for the Vuetify values) |
| Reorder handle | 24 dp glyph (measured) | moderate |
| Expand chevron | 24 dp glyph (measured) | moderate |
| Leave-behind reveal width | 56 dp (measured in `leave1.png`) | moderate |
| Inline information text | Same type size as the menu item (16 sp mobile, 15 px desktop; menus page), secondary color | moderate |

Type styles: list text per `lists.md` (Subheading 16 sp primary, Body 1 14 sp secondary); menu item text per `menus.md`; inline information uses the menu item style at the secondary text color (observed in `menu2.png`).

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Checkbox and radio, on | Swatch 500 (accent), 100% | Swatch 500, 100% | high (selection-controls page) |
| Checkbox and radio, off | #000000 at 54% | #FFFFFF at 70% | high (selection-controls page) |
| Checkbox and radio, disabled | #000000 at 26% | #FFFFFF at 30% | high (selection-controls page) |
| Switch thumb, on | Swatch 500, 100% | Swatch 200, 100% | high (selection-controls page) |
| Switch track, on | Swatch 500 at 50% | Swatch 200 at 50% | high |
| Switch thumb, off | Grey 50 #FAFAFA, 100% | Grey 400 #BDBDBD, 100% | high |
| Switch track, off | #000000 at 38% | #FFFFFF at 30% | high |
| Switch thumb, disabled | Grey 400 #BDBDBD, 100% | Grey 800 #424242, 100% | high |
| Switch track, disabled | #000000 at 12% | #FFFFFF at 10% | high |
| Reorder handle, chevron, menu check, nested indicator (inactive and active icons) | 54% black active, 38% black inactive | 100% white active, 50% white inactive | high (color page) |
| Expanded tile title | Primary color (`expand4.png`) | not found | high (light), not found (dark) |
| Inline information text | 54% black (secondary) | 70% white | moderate (observed in `menu2.png`; opacities from the color page) |
| Leave-behind panel | Grey panel with a 54% black icon in `leave1.png`; no role stated | not found | moderate |

## 6. Elevation

| Part | Value | Confidence |
|---|---|---|
| Switch | 1 dp (elevation page component table) | high |
| Other controls | 0 dp; no entry on the elevation page | moderate |
| Tile during swipe | not found | not found |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Expand and collapse | Vertical expansion of the list to show details; chevron rotates. No duration on the page; motion page defaults apply: 300 ms mobile, 150 to 200 ms desktop, standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`. | high (behavior), high (defaults) |
| Leave-behind | Tile translates with the swipe and reveals the icon beneath; the leave-behind can transform into an action (text button) after the swipe. No duration given. | high |
| Checkbox, switch, radio | Animation not described on this page. | not found |
| Nested menu | Submenu flies out on hover, focus and/or selection. Delay not given. | high (trigger), not found (delay) |

## 8. States

| State | Spec rendering | Confidence |
|---|---|---|
| Checkbox checked and unchecked | Filled accent box with white check; outlined 54% black box. | high |
| Switch on and off | Colors of section 5. | high |
| Disabled | Opacities of section 5 (26% black, 30% white; switch track 12% and 10%). | high |
| Desktop hover and focus | Primary-action checkboxes are shown only on hover and focus on desktop; otherwise hidden. | high |
| Selected (menu) | Check glyph in the left slot; the text itself is unchanged in `menu1.png`. | high |
| Expanded | Title in the primary color, chevron rotated, dividers above and below the group. | high |
| Swiped | Tile offset, leave-behind icon visible; follow-up text button may appear. | high |
| Hover, focus, pressed overlays | Not on this page; see `lists.md` section 8 for the buttons page values. | not found |

## 9. Behavior

| Rule | Spec | Confidence |
|---|---|---|
| Separate targets | Every secondary control is its own target; the primary checkbox is not (it shares the tile target). | high |
| Reorder | Only within the list; typically available in list editing mode. | high |
| Expand and collapse | Toggles detail rows of the same item; single-line collapsed item becomes a multi-row expanded block. | high |
| Leave-behind | Swipe from either direction reveals the action icon; the icon may turn into a text button for a follow-up action within the item space. | high |
| Menu check | Selection is made by another control; the check only displays state. | high |
| Inline information | Never truncated; it is informational only. | high |
| Nested menu | Opens a secondary menu on hover, focus and/or selection; ideally one level deep (menus page). | high |
| Family of booleans | Prefer switches to several checkboxes when the options are independent settings; checkboxes save space in lists (selection-controls page). | high |

## 10. Web notes

| Topic | Note |
|---|---|
| Checkbox | WAI-ARIA Checkbox pattern (`input type=checkbox` is not allowed by the Paper composition rule; use `role="checkbox"` with `aria-checked`). A primary-action checkbox shares the tile as its label; a secondary checkbox gets its own accessible name. |
| Switch | WAI-ARIA Switch pattern (`role="switch"`, `aria-checked`). |
| Radio in lists | WAI-ARIA Radio Group pattern (`role="radiogroup"`, `role="radio"`). |
| Reorder | No WAI-ARIA pattern. Pointer drag plus keyboard move-up and move-down actions on the handle, with a live region announcing the new position. |
| Expand and collapse | WAI-ARIA Disclosure pattern; the chevron is a `button` with `aria-expanded` and `aria-controls`; if the whole tile toggles, the tile is the button. |
| Leave-behind | Swipe is touch-only; expose the same action through a visible control (overflow or secondary action) for keyboard and pointer users. |
| Menu check | WAI-ARIA Menu pattern with `role="menuitemcheckbox"` or `role="menuitemradio"` and `aria-checked`. |
| Inline information | Render as text inside the menu item; add `aria-keyshortcuts` on the item when it is a keyboard shortcut. |
| Nested menu indicator | WAI-ARIA Menu pattern submenu: parent item `aria-haspopup="menu"` and `aria-expanded`. |
| Hover-only checkbox | Must stay focusable; reveal on `:focus-visible` as well as `:hover`. |
| Mirroring | Swap left and right slots under `dir="rtl"`. |

## Vuetify 1.5 cross-check

Files: `_lists.styl`, `_selection-controls.styl`, `_dividers.styl`, `_variables.styl`, `_theme.styl`.

| Metric | Spec | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Right control column | 56 dp, 16 dp right padding | `.v-list__tile__action { min-width: 56px }`; tile `padding: 0 16px` | match |
| Left control column | 16 dp edge, text at 72 dp | `.v-list__tile__avatar`, `.v-list__group__header__prepend-icon { min-width: 56px }` after 16px padding | match |
| Icon button inside action slot | 24 dp glyph in a 48 dp target | `.v-list__tile__action .v-btn--icon { margin: -6px }` (36px button centered on a 24px glyph) | approximation (36 px target, below the 48 dp touch target) |
| Selection controls in action slot | 24 dp checkbox (measured) | `.v-input--selection-controls__input { height: 24px; width: 24px }`, ripple 34px, padding and margin reset inside `.v-list__tile__action` | match (box size) |
| Checkbox and radio colors | on Swatch 500; off 54% black; disabled 26% black | `color` prop default `accent` for selection controls; `$material-light.buttons.disabled: rgba(0,0,0,.26)` | match |
| Switch colors | thumb off #FAFAFA, track off 38% black, disabled track 12% | `selection-controls.thumb.inactive: grey lighten-5`, `track.inactive: rgba(0,0,0,.38)`, `track.disabled: rgba(0,0,0,.12)`, dark `rgba(255,255,255,.3)` and `.1` | match |
| Switch elevation | 1 dp | `_switch.styl`: thumb 20px round with `elevation(4)`; track 14px tall with `border-radius: 8px`; input box 38px wide; ripple 34px (`.v-input--selection-controls__ripple` in `_selection-controls.styl`, repositioned to `left: -14px`) | discrepancy (4 dp thumb shadow versus 1 dp) |
| Expand and collapse | chevron rotates, detail indented to 72 dp, dividers above and below | `.v-list__group__header--active .v-list__group__header__append-icon .v-icon { transform: rotate(-180deg) }`; `.v-list__group:before, :after` 1px lines colored `$material.dividers`; `__items--no-action .v-list__tile { padding-left: 72px }` | match |
| Expanded title color | primary | `.v-list__group__header--active .v-list__group__header__prepend-icon .v-icon { color: inherit }`; `VListGroup` applies `activeClass` `primary--text` | match |
| Expand duration | 300 ms standard curve | `$primary-transition: 0.3s cubic-bezier(.25,.8,.5,1)` plus `VExpandTransition` | discrepancy in easing curve |
| Reorder handle | drag handle glyph, edit mode | not found in Vuetify 1.5 | Vuetify gap |
| Leave-behinds | swipe reveal, 56 dp panel (measured) | not found in Vuetify 1.5 | Vuetify gap |
| Desktop hover-only checkbox | shown on hover and focus only | not found | Vuetify gap |
| Menu check | check glyph, left slot | `VSelect` menu items use `VListTileAction` with a `VCheckbox` for multiple selection | approximation (checkbox instead of a bare check glyph) |
| Inline information | right-aligned secondary text | `.v-list__tile__action-text { color: grey; font-size: 12px }` | discrepancy: Vuetify shrinks it to 12px, the spec image uses the item size |
| Nested menu indicator | triangle glyph, submenu on hover or focus | not found (no cascading menus in Vuetify 1.5) | Vuetify gap |
