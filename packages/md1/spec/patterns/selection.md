# Selection (pattern)

Pattern page `patterns/selection.html`. Ruling (see `rulings.md`): **item selection** is a selected state (checkmark plus scrim or tint) on `Md1List` items, `Md1GridList` tiles and `Md1Card`, plus a **contextual** mode of `Md1Toolbar` that replaces the app bar while items are selected; **text selection** is browser-native on the web and yields only a theme `::selection` rule (accent color) (not shipped: see SPEC.md, Known limitations, Text selection highlight). The floating text-selection toolbar is out of scope (OS and browser chrome); its metrics are recorded below because the page states them.

## Sources

| Source | Location | Read |
|---|---|---|
| MD1 spec, Selection | `https://m1.material.io/patterns/selection.html` (2018-12-25 00:21:48 capture) | yes, full text |
| MD1 spec, Gestures (data selection rows of the touch activities table) | `https://m1.material.io/patterns/gestures.html` | yes, full text |
| MD1 spec, Navigation (Back button dismisses contextual action bars) | `https://m1.material.io/patterns/navigation.html` | yes, full text |
| MD1 spec, Navigation drawer (selected list item color) | `https://m1.material.io/patterns/navigation-drawer.html` | yes, full text |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_toolbar.styl`, `src/stylus/settings/_theme.styl`, `src/stylus/settings/_variables.styl` | yes |

Confidence legend: `high` = read on the spec page named; `moderate` = Vuetify 1.5 source only; `low` = memory.

## 1. Purpose and usage

| Rule | Text (spec) | Confidence |
|---|---|---|
| Purpose | Selection enables user choices through gestures and visual cues. | high |
| Item selection | Allows users to apply actions to selected items. | high |
| Checkboxes | Indicate completion, such as checking items off a list. Checkboxes, or custom analogs, should only be used to indicate completion. Recommended for desktop. Avoid persistently displaying checkboxes as part of each item. | high |
| Text selection | Indicated by highlighting a contiguous segment of text. | high |
| Do not | Long press is not used to display a contextual menu (gestures page). | high |

## 2. Types and variants

| Type | Trigger | Indicator | Actions surface | Confidence |
|---|---|---|---|---|
| Item selection, touch | Press and hold an item (long press); two-finger touch also triggers selection on touch devices | Check mark and scrim overlapping the item or its avatar | "the toolbar" (contextual action bar; the navigation page names it "contextual action bars") | high |
| Item selection, desktop | Hover reveals a check mark (checkbox) that can be clicked; click and drag across checkboxes selects multiple | Same | Same | high |
| Text selection | Highlight a contiguous segment; mobile adds a selection handle at the beginning and the end | Highlight in the accent color | Dropdown menu (floating toolbar) immediately above, not overlapping, the selection: Cut, Copy, Paste, More | high |

## 3. Anatomy

| Part | Description (spec) | Confidence |
|---|---|---|
| Check mark | Replaces icons or avatars if there is space; otherwise use compact check marks to minimize hiding content | high |
| Scrim | Overlaps the selected item or its associated avatar together with the check mark | high |
| Hover checkbox (desktop) | Single checkbox shown for the hovered item; after one item is selected, checkboxes are shown for all remaining items in that set | high |
| Selection box (multi-select drag) | Reveals a selection box that originates from the point of gesture initiation; height and width follow finger position; final selection is the box's dimensions on lift (gestures page) | high |
| Contextual toolbar | Hosts the actions applied to selected items; exiting selection mode happens by deselecting all items or performing an action using the toolbar; the Back button dismisses it and removes the highlight (navigation page) | high |
| Text selection handles | One at each end of the selection on mobile, 22 x 22 dp | high |
| Text selection dropdown menu | Primary actions Cut, Copy, Paste, More; More collapses and transforms the toolbar into a secondary menu with Share, Search, Translate | high |

## 4. Metrics and keylines

Item selection has no numeric values on the page. The text-selection figure carries the only numbers.

| Metric | Value | Confidence |
|---|---|---|
| Check mark size (item selection) | not found | n/a |
| Scrim opacity (item selection) | not found | n/a |
| Avatar size under the check mark | not found on this page (lists note owns it) | n/a |
| Selected list item color | Item changes color to match the app's primary color, or `#000000` 100%; touch ripple highlights the row; use a darker tint of primary if the ripple does not contrast (navigation-drawer page) | high |
| Text selection dropdown menu height | 44 dp | high |
| Dropdown menu text top padding | 12 dp and, in a second line of the same figure, 14 dp (the page lists "top padding" twice; one is presumably bottom padding; record both, do not choose) | high (verbatim), low (interpretation) |
| Dropdown menu text left padding | 24 dp | high |
| Space between menu text items | 32 dp | high |
| Selected text top padding (gap between selection and menu) | 8 dp | high |
| Expansion (More) icon right padding | 16 dp | high |
| Expansion icon left padding | 22 dp | high |
| Expansion icon top and bottom padding | 10 dp | high |
| Text selection handles | 22 x 22 dp | high |
| Floating toolbar text | Roboto Medium 14 sp, all caps (Button style) | high (value), moderate (style name) |
| Touch target | not found | n/a |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Text selection highlight | Accent color from the palette ("Text selection elements may reflect your color palette by using your accent color") | Same; the page shows light and dark figures without values | high (role), n/a (values) |
| Selected text | Must be legible with noticeable contrast against the background; alternatives: outlines, text treatments, motion, check mark icons | Same | high |
| Selected item scrim | not found | not found | n/a |
| Selected list item text and icon | Primary color, or `#000000` 100% | not found | high (navigation-drawer page) |
| Row highlight under a selected item | Touch ripple / highlight; darker tint of primary if contrast is insufficient | not found | high |
| Vuetify 1.5 table selected row | `table.active` grey lighten-4 `#F5F5F5`; hover grey lighten-3 `#EEEEEE` | `#505050`; hover grey darken-2 `#616161` | moderate |
| Vuetify 1.5 list tile hover | `rgba(0,0,0,.04)` | `rgba(255,255,255,.08)` | moderate |

## 6. Elevation

| Surface | Value | Confidence |
|---|---|---|
| Selected item | not found (selection does not change elevation on the page) | n/a |
| Contextual toolbar | not found on this page (toolbar note owns it; Vuetify 1.5 `elevation(4)`) | moderate |
| Floating text-selection toolbar | not found | n/a |

## 7. Motion

| Transition | Spec text | Duration / easing | Confidence |
|---|---|---|---|
| More in the text toolbar | "the toolbar collapses and transforms into a secondary menu to reveal additional actions"; "the menu begins transitioning to show the overflow items" | not found | high / n/a |
| Entering selection mode | not described | not found | n/a |
| Check mark appearance | "Alternatively, selected text may be indicated by displaying outlines, text treatments, motion, or checkmark icons" | not found | high |

## 8. States

| State | Rendering (spec) | Confidence |
|---|---|---|
| Unselected | Item at rest; no persistent checkbox | high |
| Hover (desktop) | Single checkbox (check mark) revealed for the hovered item | high |
| Selected | Check mark and scrim over the item or its avatar; check mark replaces the icon or avatar when there is space | high |
| Selection mode, other items | Checkboxes displayed for all remaining items in the set (desktop rule) | high |
| Pressed / focus overlays | not found | n/a |
| Disabled | not found | n/a |
| Text selected | Contiguous highlight in accent; handles on mobile; dropdown menu above | high |

## 9. Behavior

| Rule | Text (spec) | Confidence |
|---|---|---|
| Global selection gesture | A long-press, touch, or mousedown that is held in the same position for a moment; a two-finger touch may also trigger selection on touch devices | high |
| Toggle | Once an item is selected, tap the item to toggle its selection | high |
| Multi-select (touch) | Long press and drag the cursor to select multiple items | high |
| Multi-select (desktop) | Click and drag across checkboxes | high |
| Exit selection mode | Deselect all items, or perform an action on selected items using the toolbar | high |
| Back button | Dismisses contextual action bars and removes the highlight from the selected items (navigation page) | high |
| Gesture table (gestures page) | Nothing selected: long press or two-finger touch selects one. Items already selected: touch or two-finger touch adds. Multi-selection drag: two-finger swipe or drag, or long-press drag with no items selected. Pick up and move: two-finger long-press drag, or long-press drag on a selected item | high |
| Text selection adjustment | Drag the initial selection to expand; drag either handle; touch or click repeatedly within the selection to cycle word, paragraph, all text | high |
| Text selection keyboard shortcuts | Shift+Left/Right Arrow: character by character; Shift+Up/Down Arrow: line by line; Ctrl/Command+A: select all | high |
| Text toolbar | Cut, Copy, Paste, More; More reveals Share, Search, Translate | high |
| Limits | not found | n/a |

## 10. Web notes

| Topic | Note |
|---|---|
| Maps 1:1 | Hover-revealed checkbox (desktop rule) is the natural web affordance; tap-to-toggle while in selection mode; check mark replacing the avatar; contextual toolbar replacing the app bar; exit on deselect-all or on action. |
| Needs interpretation | Long press on the web collides with the browser context menu and text selection; implement it with pointer timers only where the consumer opts in, and treat the desktop hover checkbox as the default. Two-finger touch is not reliably detectable through pointer events. Drag-to-select boxes are a composition, not a component. Scrim opacity and check mark size are not in the spec; the implementer must source them from the lists and grid lists notes or record `not found`. |
| Text selection | Browser-native. The design system ships one theme rule: `::selection { background: var(--md1-accent ...) }` with a legible foreground (not shipped: see SPEC.md, Known limitations, Text selection highlight). Handles and the floating Cut/Copy/Paste toolbar are OS chrome; do not build them. |
| Contextual action bar | A `contextual` mode of `Md1Toolbar`: leading close (X) action, selected count as the title, trailing actions; replaces the standard app bar while `selected.length > 0`; Escape and the close action clear the selection. Host color is not on this page (toolbar note). |
| WAI-ARIA pattern | Listbox (multi-select) for lists of selectable items, Grid for grid lists, with `aria-selected`; a checkbox per item when the hover-checkbox rendering is used (`aria-checked`). The contextual toolbar follows the Toolbar pattern. |
| v0 primitives | `createSelection` / `Selection` component for the selected set; `Checkbox` for the hover affordance; `useRovingFocus` for the item set. |

## Vuetify 1.5 cross-check

Vuetify 1.5 ships no selection pattern; selection lives in `v-data-table` (select-all checkbox column), `v-list-tile` active state and `v-item-group`. The files assigned for cross-check overlap only on the contextual toolbar host and theme colors.

| Item | Spec | Vuetify 1.5 | Verdict |
|---|---|---|---|
| Contextual toolbar host | A toolbar replacing the app bar | `_toolbar.styl` is one toolbar; no contextual mode; apps swap content | spec behavior missing |
| Selected row color | Primary color text, or black 100%; ripple highlight | `table.active` `#F5F5F5` light / `#505050` dark; list tile active title `color: inherit` from the active class | discrepancy in mechanism (background tint vs text color); spec gives no background value |
| Hover checkbox | Shown on hover only; persistent checkboxes discouraged | `v-data-table` renders persistent checkboxes in the select column | discrepancy |
| Check mark replacing avatar | Required when space allows | not implemented | spec behavior missing |
| Text selection color | Accent | no `::selection` rule in the read files | spec rule missing |
| Text selection toolbar metrics | 44 dp menu etc. | none (browser) | n/a on the web |
