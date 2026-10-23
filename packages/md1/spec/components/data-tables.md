# Data tables (Material Design 1)

Spec note for `Md1DataTable` and its parts (table card header, column header row, rows, footer with pagination, contextual header, inline edit dialogs, inline menus). Pins the archived MD1 "Data tables" page so implementers never guess.

Confidence tags: `high` = stated on the spec page or a companion spec page (text or a labelled figure); `moderate` = from Vuetify 1.5 stylus only; `low` = read off an unlabelled figure or from memory. `not found` means the spec does not state it.

## Sources

- Spec page (authoritative): `http://web.archive.org/web/20181225002253/https://material.io/archive/guidelines/components/data-tables.html` (Wayback snapshot 2018-12-25 00:22:53 of the MD1 archive; full text read).
- Same page on Google's live MD1 mirror: `https://m1.material.io/components/data-tables.html` (read 2026-10-22; text identical to the snapshot line for line; figures served from `https://storage.googleapis.com/material-io-design/m1/assets/<id>/<name>.png`).
- Earlier revisions, read for drift: `http://web.archive.org/web/20160923084954/https://material.google.com/components/data-tables.html` (2016-09-23, identical text) and `http://web.archive.org/web/20180119194022/https://material.io/guidelines/components/data-tables.html` (2018-01-19, identical text).
- Figures read from the page: components-datatables-structure-basictable, interaction-rowhover, interaction-selectedrow, interaction-sortedcolumn, interaction-tooltip, interaction-editing2, interaction-editing3, interaction-editing4, interaction-inlinemenus2, cards-tablecard, cards-altheaders, specs-verticalspacing, specs-01-horizontalspacing, specs-02-horizontalspacing (the column-gap region was cropped and enlarged 2x to read the labels).
- Companion spec pages (m1.material.io, text identical to the 2018-12-25 archive): `style/typography.html` (type scale figure), `style/color.html` (text and icon opacity tables, theme palette figures), `material-design/elevation-shadows.html`, `motion/duration-easing.html`, `layout/metrics-keylines.html`, `components/menus.html` (Specs), `components/buttons.html` (Flat buttons specs), `patterns/selection.html`, `components/lists.html`, `components/dividers.html`.
- Vuetify 1.5.24: `src/stylus/components/_tables.styl`, `_data-table.styl`, `_data-iterator.styl`, `_small-dialog.styl`, `_cards.styl`, `_buttons.styl`; `src/stylus/settings/_theme.styl`, `_variables.styl`, `_colors.styl`, `_elevations.styl`; behavior from `src/components/VDataTable/VDataTable.js`, `mixins/head.js`, `mixins/body.js`, `mixins/foot.js`, `VEditDialog.js`, `src/mixins/data-iterable.js`, `src/locale/en.ts`, `src/components/Vuetify/mixins/icons.ts`.

## 1. Purpose and usage

- Data tables display sets of raw data. They usually appear in desktop enterprise products.
- They may be embedded on a surface such as a card. They can include a corresponding visualization and the ability to query and manipulate data.
- Tables on cards may display navigation and data manipulation tools at the top and bottom of the card.
- Structure: a header row at the top lists column names, followed by rows for data. Checkboxes accompany each row if the user needs to select or manipulate data. Tables may include three or more columns of data.
- Supported interactions named by the page: row hover (desktop), row selection, column sorting, column hover (desktop), long header titles, text editing, menus.
- Related component: Cards.
- Not stated: phone layouts. The page says "usually desktop"; horizontal scrolling of the table container is the only overflow strategy it gives.

## 2. Types and variants

| Variant | Description | Own metrics | Confidence |
|---|---|---|---|
| Basic data table | Header row plus data rows, optional checkbox column | header row 56dp, data rows 48dp, 24dp edge padding, 56dp minimum between columns | high |
| Table within a card | Card with a title header and a footer carrying navigation and manipulation tools | card header 64dp, footer row 56dp, 24dp perimeter padding | high |
| Alternative header: persistent actions | Borderless (flat) action buttons replace the title; enabled upon item selection | buttons follow the Button style | high |
| Alternative header: contextual | Colored header that activates when items are selected; shows the number of items selected and contextual icons | background is the 50-value of the secondary app color | high |
| Editable cell | Editable field denoted by placeholder text; edited in a small edit dialog or a large edit dialog | placeholder 13sp 38% black; small dialog 24dp left and right padding | high |
| Inline menu cell | A menu component embedded directly in the table for predefined options | 13sp 87% black; spacing and sizing per the menus page | high |
| Long header titles | Full name with horizontal scrolling, or shortened name shown in full on hover | 56dp recommended padding between columns | high |

## 3. Anatomy

| Part | Content | Confidence |
|---|---|---|
| Card header | Card title (20sp Regular) at the left; card action icons at the right (figure shows a filter icon and an overflow icon) | high |
| Column header row | Checkbox column (select-all checkbox shown in every figure, behavior not described), column names, sort icon beside the sorted or hovered column name, tooltip on hover | high |
| Data rows | Row checkbox; text cells (left-aligned); numeric cells (right-aligned); editable cells with placeholder; optional inline edit icon at the cell edge opposite the content; inline menu cells | high |
| Row dividers | 1dp lines between rows (dividers page) | high |
| Footer | "Rows per page:" label, rows-per-page selector with dropdown arrow, range label "1-10 of 100", previous and next icons | high (figure) |
| Contextual header | "1 item selected" count label at the left; contextual icons at the right (figure shows delete and overflow) | high |
| Small edit dialog | Raised sheet over the cell containing one text field (figure also shows a character counter "11/140") | high |
| Large edit dialog | Dialog with title ("Add a comment"), text field, counter, CANCEL and SAVE actions (figure) | high |

## 4. Metrics and keylines

Vertical:

| Element | Value | Confidence | Source and notes |
|---|---|---|---|
| Card header height | 64dp | high | text; figure specs-verticalspacing label 1 |
| Column header row height | 56dp | high | figure label 2 marks both the column header row and the footer row; the text calls it "56dp height for last row" |
| Footer (pagination) row height | 56dp | high | figure label 2 |
| Data row height | 48dp | high | text and figure label 3 |

Horizontal:

| Element | Value | Confidence | Source and notes |
|---|---|---|---|
| Padding around the perimeter of a table card | 24dp | high | text |
| Checkbox glyph | 18dp wide and high inside a 24dp icon container | high | text |
| Card left edge to checkbox container | 24dp | high | figure specs-02 |
| Checkbox container to first column text | 24dp | high | figure specs-02 |
| Padding between columns | minimum 56dp; the widest item in the column (data or column name) delineates the column border | high | text |
| Gap drawn between the first (text) column and the first numeric column | 24dp | high | figure specs-02 label; contradicts the 56dp sentence; see Web notes |
| Gap between numeric columns | 56dp | high | figure specs-02 |
| Last column to card right edge | 24dp | high | figure specs-02 |
| Header action icons | 24dp container; 24dp between icons; 14dp from the last icon to the card edge | high | figure specs-01 |
| Footer: "Rows per page:" label to its value | 40dp | high | text ("40dp in between the footer row count and its label") and figure |
| Footer: width marked over the selector value and arrow | 24dp | high | figure specs-01 label; what the 24dp covers is not stated |
| Footer: between control sets (selector to range text, range text to previous icon) | 32dp | high | text and figure |
| Footer: previous and next icons | 24dp each; 24dp between them; 14dp from the next icon to the card edge | high | figure specs-01 |
| Sort icon | 16dp container | high | text |
| Inline edit icon | 18dp container at the cell edge opposite the content | high | text |
| Small edit dialog | edges aligned with the nearest divider lines or table edges; 24dp left and right padding; a single text field | high | text |
| Large edit dialog | follows the dialogs note (24dp content padding, 36dp buttons, 8dp button spacing) | high | text ("follow the dialog guidelines") |
| Inline menu | desktop menu: item 32px, text left padding 24px, 8px top and bottom padding, 15px type; dense desktop: item 24px, 13px type, 4px padding; mobile: item 48dp, 16sp, 16dp left padding | high | menus page |
| Touch target for footer and header icons | 48dp minimum | high | keylines page |
| Column widths, table minimum or maximum width | not found | | |
| Phone layout | not found | | |
| Card corner radius | not found on this page (see the cards note) | | |

Type styles (scale from the typography page: Title Medium 20sp; Subheading Regular 16sp device, 15sp desktop; Body 2 Medium 14sp device, 13sp desktop; Body 1 Regular 14sp device, 13sp desktop; Caption Regular 12sp; Button Medium 14sp all caps):

| Text element | Spec | Type style | Confidence |
|---|---|---|---|
| Table content | 13sp Roboto Regular | Body 1 (desktop size) | high |
| Column headers | 12sp Roboto Medium | Caption size at Medium weight; not a scale style | high |
| Sorted column name | 12sp Roboto Medium | same as column headers | high |
| Card title | 20sp Roboto Regular | Title size; the scale's Title is Medium, the page says Regular | high |
| Footer pagination labels | 12sp Roboto Regular | Caption | high |
| Placeholder text in editable cells | 13sp Roboto Regular | Body 1 (desktop size) | high |
| Inline menu items | 13sp Roboto Regular | Body 1 (desktop size); equals the dense desktop menu type | high |
| Persistent header action buttons | borderless buttons | Button (buttons page) | high |
| Contextual header count label | not found; figure shows roughly Subheading size in the secondary color | low |
| Tooltip text | per the tooltips page (not read here) | | |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Table card surface | White #FFFFFF ("Cards/Dialogs", color page theme figure) | Grey 800 #424242 | high |
| Table content | 87% black | not found; color page primary light text is 100% white | high (light); low (dark) |
| Column headers | 54% black | not found; color page secondary light text is 70% white | high (light); low (dark) |
| Sorted column name | 87% black | not found | high |
| Sort icon, sorted column | 87% black | not found | high |
| Sort icon, hover affordance | 38% black | not found | high |
| Row hover background | Grey 200 #EEEEEE | not found | high |
| Selected row background | Grey 100 #F5F5F5 | not found | high |
| Row checkbox | secondary app color | same | high |
| Placeholder text | 38% black | not found; color page hint text on dark is 50% white | high (light); low (dark) |
| Inline edit icon | 54% black | not found | high |
| Card action icons (header and footer) | 54% black | not found | high |
| Footer pagination labels | 54% black | not found | high |
| Contextual header background | 50-value of the secondary app color (figure: Blue 50 #E3F2FD under a blue secondary) | not found | high |
| Contextual header count label | secondary color in the figure | not found | low |
| Persistent header action buttons | flat buttons; color not stated; figure uses the secondary color | not found | low |
| Row dividers | 12% black (dividers page) | 12% white | high |
| Edit dialog surface | white in the figures | not found | low |

## 6. Elevation

| Surface | Value | Confidence | Source |
|---|---|---|---|
| Table card | 2dp resting (Card resting elevation); desktop resting elevations are 2dp below the listed values | high | elevation page |
| Plain table on another surface | none of its own; not found | | |
| Inline menu | 8dp (Menu) | high | elevation page |
| Small edit dialog | not found; the figure shows a raised sheet | low | |
| Large edit dialog | 24dp (Dialog) | high | dialogs page, elevation page |
| Contextual header | not found (same surface as the card) | | |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Sort direction change | "reverse the sort order and rotate the sort icon"; duration and easing not found | high (pattern only) |
| Row hover and selection background | not found | |
| Edit dialog open and close | not found; the large edit dialog follows the dialogs note | |
| Companion defaults | standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`; desktop transitions 150ms to 200ms; mobile 300ms (duration page) | high |
| Vuetify 1.5 | sort icon opacity and rotation `.3s cubic-bezier(.25, .8, .5, 1)`; row background `.3s`; expanded-row height `.3s` | moderate |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Normal row | surface color; content 87% black; 12% dividers | high |
| Row hover (desktop) | Grey 200 #EEEEEE background on the whole row; if a cell has its own hover state, show the cell hover and the row hover at the same time | high |
| Row selected | Grey 100 #F5F5F5 background; checkbox checked in the secondary color | high |
| Column name hover (desktop) | tooltip with the definition when needed; a light sort icon (16dp, 38% black) appears when sorting is enabled; the figure also renders the hovered name at 87% black (unlabelled) | high; low for the 87% |
| Sorted column | column name 87% black; sort icon 16dp at 87% black; the figure shows an upward arrow for ascending; the icon rotates when the order is reversed | high |
| Header keyboard focus | not found | |
| Disabled row or cell | not found | |
| Editable cell, empty | placeholder 13sp 38% black; no divider line under the text | high |
| Editable cell, editing | small edit dialog over the cell (figure shows an accent-colored underline and a character counter) | high; low for counter and underline |
| Contextual header active | header background becomes the 50-value of the secondary color; shows the number of items selected and contextual icons; selected rows Grey 100 | high |
| Persistent action buttons | enabled upon item selection (disabled before) | high |
| Header action buttons, pressed and focused | flat button pressed 40% #999999 (light), 25% #CCCCCC (dark); focused 12% (buttons page) | high |
| Error | not found | |

## 9. Behavior

- Sorting: sort the most important data by default and display the sorted state in the column header. Clicking a column that is already sorted reverses the order and rotates the icon. A single sorted column is shown; multi-column sorting is not found.
- Column name hover: tooltip for definitions; the sort affordance icon at 38% indicates a sortable column.
- Long header titles: either display the full column name and enable horizontal scrolling in the table container, or shorten the name (figure: ellipsis) and display it in full on hover.
- Selection (patterns/selection page): on touch devices select an item by pressing and holding; on desktop hover over an item to reveal a check mark and click it; after an item is selected, display checkboxes for all remaining items in the set; click and drag across checkboxes to select multiple; tap a selected item to toggle it; exit selection mode by deselecting all items or performing a toolbar action. The selection page says to avoid persistently displaying checkboxes as part of each item; the data-table figures nevertheless show the checkbox column permanently. The contextual header activates when items are selected and displays the count.
- Inline text editing: editable fields are denoted by placeholder text; a small edit dialog with one text field is confirmed with Enter; a large edit dialog is confirmed with the Save button; an optional edit icon sits at the far edge of the cell.
- Inline menus: embed a menu component directly in the table when users select from predefined options.
- Tables within cards: navigation and data manipulation tools at the top (card header) and bottom (footer). The footer carries the rows-per-page selector, the range text "1-10 of 100" and previous and next controls (figure).
- Scrolling: horizontal scrolling inside the table container when columns do not fit. Vertical scrolling and pinned headers: not found.
- Alignment: numeric columns right-aligned; text columns left-aligned.
- Limits and defaults: three or more columns of data; rows-per-page options and defaults not found; the figure shows "Rows per page: 10".

## 10. Web notes

- Maps 1:1 (dp and sp to px): all row heights, paddings, icon sizes, type sizes and opacities above.
- Column padding needs interpretation: the text says a minimum of 56dp between columns, the redline shows 24dp between the first text column and the first numeric column and 56dp between numeric columns. Recommended reading: 24dp is the edge keyline (card edge to checkbox, checkbox to text) and 56dp is the inter-column minimum. Implement as 24px padding at the table edges and a 56px gap between adjacent columns (28px per side), and record the figure's 24dp as a known inconsistency.
- Footer: 56px tall; the 24px glyphs sit in 48px touch targets; the rows-per-page control is a v0 Select; the range text is a polite live region.
- Hover states exist only under `@media (hover: hover)`.
- Selection: long-press is touch-only (pointer events plus a hold timer); desktop reveals the checkbox on hover. The page's figures keep the checkbox column visible; treat always-visible checkboxes as the table default and hover-reveal as the selection pattern's desktop refinement, and document which one the implementation picks.
- Dark theme values are not on this page; derive them from the color page (text 100%, 70%, 50% white; dividers 12% white) and tag them derived.
- Small edit dialog: a non-modal dialog anchored to the cell, edges aligned with the cell's divider lines; large edit dialog: a modal dialog.
- WAI-ARIA: native `<table>` with `<th scope="col">`, `aria-sort` on sortable headers whose contents are buttons (APG Table pattern, "Sortable Table" example); keyboard-navigable or editable cells follow the APG "Grid" pattern; inline menus follow the APG "Menu Button" pattern; the large edit dialog follows the APG "Dialog (Modal)" pattern; the contextual header is an APG "Toolbar"; previous and next are buttons with accessible names.
- v0 primitives: Checkbox for row and select-all selection, Select for rows per page, Button.Root for pagination and header actions, Dialog.Root for the large edit dialog, Popover for the small edit dialog, Menu for inline menus, Tooltip for column definitions.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 | File | Verdict |
|---|---|---|---|---|
| Column header row height | 56dp | `thead tr height: 56px` | `_tables.styl` | match |
| Data row height | 48dp | `tbody td, th height: 48px` | `_tables.styl` | match |
| Footer row height | 56dp | `tfoot tr height: 48px`; actions bar `__range-controls min-height: 48px` plus `.v-select margin: 13px 0` (about 58px) | `_tables.styl`, `_data-table.styl` | differs |
| Card header | 64dp title header | no table-card header part; `.v-card__title padding: 16px` | `_cards.styl` | not implemented |
| Cell padding | 24dp at the edges; minimum 56dp between columns | `td, th padding: 0 24px` (48px between adjacent cell contents, 24px at the edges) | `_tables.styl` | differs (48px versus 56dp) |
| Column header type and color | 12sp Medium, 54% black | `th font-size: 12px; font-weight: 500; color: rgba(fg, .54)` | `_tables.styl` | match |
| Sorted column name | 87% black | `th.active color: rgba(fg, .87)` | `_data-table.styl` | match |
| Body cell type and color | 13sp Regular, 87% black | `td font-size: 13px; font-weight: 400`; text primary `rgba(0,0,0,.87)` | `_tables.styl`, `_theme.styl` | match |
| Sort icon size | 16dp | `.v-icon font-size: 16px` | `_data-table.styl` | match |
| Sort icon hover affordance | 38% black | icon `color: rgba(fg, .38)` at `opacity: .6` on hover and focus (effective about 23%), `opacity: 0` at rest | `_data-table.styl` | differs |
| Sort icon, sorted | 87% black | `opacity: 1`, color 87% | `_data-table.styl` | match |
| Sort glyph and reversal | icon rotates on reverse | `arrow_upward`; `.desc .v-icon transform: rotate(-180deg)` | `icons.ts`, `_data-table.styl` | match |
| Row hover | Grey 200 #EEEEEE | `tr:hover background: grey lighten-3 (#eeeeee)`; dark theme `#616161` | `_tables.styl`, `_theme.styl` | match (light); spec silent (dark) |
| Selected row | Grey 100 #F5F5F5 | `tr[active] background: grey lighten-4 (#f5f5f5)`; dark theme `#505050` | `_tables.styl`, `_theme.styl` | match (light); spec silent (dark) |
| Row dividers | 1dp, 12% | `border-top: 1px solid rgba(fg, .12)` | `_tables.styl` | match |
| Surface | white; dark #424242 | `$material.cards`: white; dark grey darken-3 `#424242` | `_theme.styl` | match |
| Footer type and color | 12sp Regular, 54% black | `__actions font-size: 12px; color: rgba(fg, .54); border-top: 1px solid rgba(fg, .12)` | `_data-table.styl` | match |
| Footer spacing | 40dp label to value; 32dp between control sets; 24dp icons 24dp apart; 14dp to the edge | `.v-select margin: 13px 0 13px 34px`; `__pagination margin: 0 32px 0 24px`; `.v-btn:last-of-type margin-left: 14px`; `__select margin-right: 14px`; icon buttons 36px wide with 24px glyphs and `margin: 6px 8px` | `_data-table.styl`, `_buttons.styl` | differs (34px versus 40dp; 24px versus 32dp left of the range text; 22px versus 24dp between icon buttons) |
| Range text | "1-10 of 100" | `pageText: '{0}-{1} of {2}'` | `locale/en.ts` | match |
| Rows-per-page label | "Rows per page:" | `dataTable.rowsPerPageText: 'Rows per page:'` | `locale/en.ts` | match |
| Rows-per-page options | not found | `[5, 10, 25, All]`, default 5 | `data-iterable.js` | spec silent |
| Previous and next icons | 24dp chevrons (figure) | `chevron_left`, `chevron_right`, swapped in RTL, with `aria-label` | `icons.ts`, `data-iterable.js` | match |
| Checkbox | 18dp glyph in a 24dp container, secondary color | `v-checkbox` 24px icon, centered in the cell (`left: 50%; translateX(-50%)`), color prop | `_tables.styl`, `head.js` | match (size); color configurable |
| Select-all checkbox | not found | header checkbox with indeterminate state | `head.js` | spec silent |
| Long-press selection | press and hold (selection page) | none; checkbox column always visible | | not implemented |
| Contextual header | 50-value of the secondary color | not built in | | not implemented |
| Column tooltip | per tooltips page | not built in (`v-tooltip` is separate) | | not implemented |
| Long header titles | ellipsis plus hover reveal, or horizontal scroll | `th white-space: nowrap`; `.v-table__overflow overflow-x: auto` | `_tables.styl` | partial (scroll yes, truncation no) |
| Small edit dialog | 24dp side padding; Enter confirms | `.v-small-dialog__content padding: 0 24px`; Enter saves, Esc cancels; `large` adds CANCEL and SAVE flat buttons; input focused on open; rendered through `VMenu` | `_small-dialog.styl`, `VEditDialog.js` | match (padding, Enter); Esc and menu elevation are additions |
| Table card elevation | 2dp | `.v-card elevation(2)` | `_cards.styl` | match |
| Table corner radius | not found | `table.v-table border-radius: 2px` | `_tables.styl` | spec silent |
| Keyboard sorting | not found | `th tabindex="0"`, Space sorts, `role="columnheader"`, `aria-sort` | `head.js` | spec silent |
| Motion | not found | `.3s cubic-bezier(.25, .8, .5, 1)` on icon, background and expand | `_data-table.styl`, `_tables.styl` | spec silent |
| Expandable rows, progress row | not found | `expand` prop with row-expand transition; `__progress` linear progress row | `body.js`, `_data-table.styl` | Vuetify additions |
