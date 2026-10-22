# Expansion panels (Material Design 1)

Spec note for `QuExpansionPanel` (collapsed and expanded panels, stand-alone or stacked in a card). Pins the archived MD1 "Expansion panels" page so implementers never guess.

Confidence tags: `high` = stated on the spec page or a companion spec page (text or a labelled figure); `moderate` = from Vuetify 1.5 stylus only; `low` = read off an unlabelled figure or from memory. `not found` means the spec does not state it.

## Sources

- Spec page (authoritative): `http://web.archive.org/web/20181225002242/https://material.io/archive/guidelines/components/expansion-panels.html` (Wayback snapshot 2018-12-25 00:22:42 of the MD1 archive; full text read).
- Google's live MD1 mirror serves a stub for this page (`https://m1.material.io/components/expansion-panels.html`, 8KB without the guideline text, read 2026-10-22); the page's figures are still served from `https://storage.googleapis.com/material-io-design/m1/assets/<id>/<name>.png` and were read from there.
- Earlier revisions, read for drift: `http://web.archive.org/web/20160530205643/http://www.google.com/design/spec/components/expansion-panels.html` (2016-05-30; one difference: the Specs label font is "Roboto Regular 16sp" there and "Roboto Regular 15sp" in the 2018 archive) and `http://web.archive.org/web/20180124115325/https://material.io/guidelines/components/expansion-panels.html` (2018-01-24; identical to the archive). The Wayback availability API reports no snapshot of this page before 2016-05-16, so no earlier revision exists.
- Figures read from the page: components-expansionpanels-usage (five panels), components-material-expansionpanels-collapse, -expand, -state, -spec2 (redline; cropped and enlarged 2x and 3x to read the labels).
- Companion spec pages (m1.material.io): `style/typography.html`, `style/color.html`, `material-design/elevation-shadows.html`, `motion/duration-easing.html`, `layout/metrics-keylines.html`, `components/buttons.html` (Flat buttons specs), `components/dividers.html`.
- Vuetify 1.5.24: `src/stylus/components/_expansion-panel.styl`, `_cards.styl`, `src/stylus/generic/_transitions.styl`, `src/stylus/settings/_theme.styl`, `_variables.styl`, `_elevations.styl`; behavior from `src/components/VExpansionPanel/VExpansionPanel.ts`, `VExpansionPanelContent.ts`, `src/components/transitions/expand-transition.js`, `src/components/Vuetify/mixins/icons.ts`.

## 1. Purpose and usage

- Expansion panels contain creation flows and allow lightweight editing of an element.
- An expansion panel is a lightweight container that may either stand alone or be connected to a larger surface, such as a card.
- Editing: best for lightweight editing of an element, such as selecting a value for a setting; an app with tables may use expansion panels to adjust settings on table elements.
- Creation flows: panels displayed in a sequence form a creation flow; a tool for creating ad campaigns may display a series of panels to collect campaign details.
- Not stated: use for navigation, FAQ accordions or large content; the page scopes the component to editing and creation flows.

## 2. Types and variants

| Variant | Description | Own metrics | Confidence |
|---|---|---|---|
| Collapsed panel | displays summary information; selecting it expands the panel | 48dp row | high |
| Expanded panel | allows the user to add or edit information; helper text may be added | 64dp header row; detaches from its neighbours by 16dp (figure) | high |
| Stand-alone panel | a single panel on its own surface | not found beyond the shared metrics | high (existence) |
| Panels connected to a card | a stack of panels on one card surface, separated by dividers | 1dp 12% dividers between panels | high |
| Content layouts shown in the usage figure | (a) label with a single value ("Trip name: Caribbean cruise"); (b) label with two labelled values side by side ("Start date: Feb 29, 2016", "End date: Not set"); (c) label with a secondary line ("Meal preferences", "Optional"); (d) expanded panel with a chip input, helper text with a "Learn more" link, and CANCEL and SAVE actions | no per-layout metrics on the page beyond the redline; not found | high (layouts exist); not found (metrics) |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Label (list content) | left column; Roboto Regular 15sp, 87% black | high |
| Secondary content | second line under the label; 12sp Regular, 54% black | high |
| Summary or value content | middle column in the collapsed row (figure: 54% grey values) | low (color) |
| Expand icon | 24dp x 24dp chevron; 38% black at rest; rotates when expanded (figure) | high |
| Divider | 1dp border, 12% black, between stacked panels | high |
| Expanded body | editing controls, helper text, an optional "Learn more" link (figure) | high |
| Actions | CANCEL and SAVE flat buttons at the bottom right of the expanded panel, above a divider (figure) | high |
| Focus background | Grey 200 on the focused list item | high |

## 4. Metrics and keylines

| Element | Value | Confidence | Source and notes |
|---|---|---|---|
| Collapsed panel height | 48dp | high | figure spec2 |
| Expanded panel header height | 64dp | high | figure spec2 |
| Top and bottom padding | 16dp | high | text |
| Left and right padding | 24dp | high | text; figure spec2 |
| Label column to value column | 16dp | high | figure spec2 |
| Value column to expand icon | 16dp | high | figure spec2 |
| Expand icon | 24dp x 24dp | high | text |
| Expand icon to panel right edge | 24dp (the icon sits just inside the right padding) | high | figure spec2 |
| Expanded panel separation from the panels above and below | 16dp | high | figure spec2 |
| Expanded body bottom padding (above the actions divider) | 16dp | high | figure spec2 |
| Actions row | 16dp above the buttons, 36dp buttons, 16dp below | high | figure spec2 |
| Spacing marks beside the SAVE button | 8dp on each side of the button (figure labels "8"); the 8dp are the flat button's own padding | high (labels); low (reading) |
| Action buttons | flat buttons, 36dp high, minimum width 88dp, 2dp corner radius (buttons page) | high | buttons page |
| Divider between panels | 1dp | high | text |
| Touch target of the collapsed row | 48dp | high | figure; keylines page minimum 48dp |
| Panel width | fills the container in every figure; not stated | low | |
| Minimum or maximum width, mobile layout | not found | | |

Type styles:

| Text element | Spec | Type style | Confidence |
|---|---|---|---|
| Label | Roboto Regular 15sp (2018 archive); Roboto Regular 16sp in the 2016-05 revision | Subheading (desktop 15sp; device 16sp) | high |
| List content | 15sp Roboto Regular, 87% black | Subheading (desktop size) | high |
| Secondary content | 12sp Roboto Regular, 54% black | Caption | high |
| Helper text, values | not found; figures render them in secondary grey at about the label size | low |
| Actions | Button (Medium 14sp all caps, buttons page) | Button | high |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Panel surface | White #FFFFFF when on a card ("Cards/Dialogs", color page) | Grey 800 #424242 | high |
| Label | 87% black | not found; 100% white (color page primary) | high; low |
| Secondary content | 54% black | not found; 70% white | high; low |
| Divider | 12% black | 12% white (dividers page) | high |
| Expand icon, resting | 38% black | not found; 50% white (color page inactive icon) | high; low |
| Expand icon, hover and pressed | 54% black | not found; 100% white (color page active icon) | high; low |
| Focus background | Grey 200 #EEEEEE | not found | high |
| Values and helper text | secondary grey in the figures | not found | low |
| Actions | SAVE in the accent color, CANCEL in grey (figure, unlabelled) | not found | low |

## 6. Elevation

| Item | Value | Confidence | Source and notes |
|---|---|---|---|
| Panel or panel stack, resting | not found on the page. Panels "connected to a larger surface, such as a card" inherit the card's 2dp resting elevation (elevation page) | low (derived) | |
| Expanded panel | not found as a number. The redline detaches the expanded panel by 16dp above and below, which reads as a raised sheet | low | figure spec2 |
| Vuetify 1.5 | panel group 1dp; popout or inset active panel 3dp | moderate | `_expansion-panel.styl` |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Expand and collapse | not found on the page | |
| Expand icon rotation | the icon points down when collapsed and up when expanded (figures); duration not found | high (end states) |
| Companion defaults | standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`; mobile 300ms; desktop 150ms to 200ms (duration page) | high |
| Vuetify 1.5 | body height animated over `.3s cubic-bezier(.25, .8, .5, 1)` (`expand-transition`); icon `transform: rotate(-180deg)` on the same curve; container `.3s` | moderate |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Collapsed | 48dp row with label and summary | high |
| Expanded | 64dp header, body with controls and helper text, actions | high |
| Focus | Grey 200 background on the focused list item; keyboard users traverse items with Tab | high |
| Hover and pressed (icon) | expand icon 54% black | high |
| Hover and pressed (row background) | not found | |
| Disabled | not found | |
| Selected | not applicable; not found | |
| Error | not found | |

## 9. Behavior

- Selecting a collapsed panel expands it to display the full panel; the expanded panel allows the user to add or edit information.
- Helper text may be added to an expanded panel.
- Keyboard: users traverse list items with the Tab key; the focused item shows the grey background.
- Creation flows display panels in a sequence.
- Not found: whether more than one panel may be open at once; whether expanding one collapses the others; whether CANCEL reverts and SAVE commits (the figure shows both buttons but the text does not describe them); dismissal on outside click.

## 10. Web notes

- Maps 1:1: 48px collapsed row, 64px expanded header, 16px and 24px paddings, 24px icon, 1px divider, 15px label.
- Needs interpretation: the 16dp detachment of the expanded panel is a margin change plus an elevation change (the spec gives no number; Vuetify uses 3dp); the header grows from 48px to 64px on expansion, which is a layout transition and should be animated with the body; the focus background should be paired with `:focus-visible` styling; the icon rotation is a CSS transform; the actions row follows the flat-button metrics from the buttons page; single-open versus multi-open is an implementer decision that must be documented because the spec is silent.
- WAI-ARIA: APG "Accordion" pattern for stacked panels (each header is a `<button>` inside a heading, `aria-expanded`, `aria-controls` pointing at the body region, Enter and Space toggle); APG "Disclosure" pattern for a stand-alone panel. The body contents (chips, text fields, buttons) keep their own patterns.
- v0 primitives: Disclosure or Accordion compound for behavior; Button.Root for actions; Chip and TextField for body content.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 | File | Verdict |
|---|---|---|---|---|
| Collapsed height | 48dp | `.v-expansion-panel__header min-height: 48px` (`$expansion-panel-collapse-height := 48px` is defined but unused) | `_expansion-panel.styl`, `_variables.styl` | match |
| Header padding | 16dp top and bottom, 24dp sides | `padding: 12px 24px` | `_expansion-panel.styl` | differs (12px versus 16dp vertical) |
| Expanded header height | 64dp | unchanged 48px minimum when active | `_expansion-panel.styl` | differs |
| Expanded panel separation | 16dp above and below | `--popout` and `--inset`: active container `margin: 16px` (`$spacers.three.x`) | `_expansion-panel.styl` | match (popout and inset modes only) |
| Label type | Regular 15sp | no explicit size; inherits the 14px root | `_expansion-panel.styl`, `_theme.styl` | differs |
| Secondary content | 12sp 54% | not built in | | not implemented |
| Expand icon size | 24dp | `v-icon` default 24px (`keyboard_arrow_down`, `mdi-chevron-down`) | `icons.ts` | match |
| Expand icon color, resting | 38% black | `$material.icons.active` (54%) always | `_expansion-panel.styl`, `_theme.styl` | differs |
| Expand icon color, hover and pressed | 54% black | 54% (no state change) | `_expansion-panel.styl` | match by coincidence |
| Icon rotation | down collapsed, up expanded | `--active .v-icon transform: rotate(-180deg)` | `_expansion-panel.styl` | match |
| Divider | 1dp 12% | `__container border-top: 1px solid rgba(fg, .12)`; first child none | `_expansion-panel.styl` | match |
| Focus background | Grey 200 #EEEEEE | `--focusable .v-expansion-panel__container:focus background: grey lighten-3 (#eeeeee)`; dark `#494949` | `_expansion-panel.styl`, `_theme.styl` | match (opt-in via `focusable`) |
| Surface | white; dark #424242 | `$material.cards` | `_theme.styl` | match |
| Elevation | not found | group `elevation(1)`; popout and inset active `elevation(3)`; body card `elevation(0)` | `_expansion-panel.styl` | spec silent |
| Popout and inset widths | not found | inactive containers `max-width: 95%`; inset active `85%`; popout active `100%` | `_expansion-panel.styl` | Vuetify addition |
| Motion | not found | `.3s cubic-bezier(.25, .8, .5, 1)` height and icon | `_transitions.styl`, `_expansion-panel.styl` | spec silent |
| Disabled | not found | text 38% (`text.disabled`); header `pointer-events: none`; icon hidden | `_expansion-panel.styl`, `VExpansionPanelContent.ts` | spec silent |
| Keyboard | Tab traverses; focus background | `<li tabindex="0">` with `aria-expanded`; Enter toggles; Space does not; no `<button>` | `VExpansionPanelContent.ts` | differs from the Accordion pattern |
| Single or multiple open | not found | accordion by default; `expand` prop allows multiple | `VExpansionPanel.ts` | spec silent |
| Actions row | CANCEL and SAVE in the figure | not built in (consumer composes `v-card-actions`) | | not implemented |
