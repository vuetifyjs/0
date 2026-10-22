# Dividers (Material Design 1)

Spec note for `QuDivider` (full-bleed, inset and subheader dividers). Pins the archived MD1 "Dividers" page so implementers never guess.

Confidence tags: `high` = stated on the spec page or a companion spec page (text or a labelled figure); `moderate` = from Vuetify 1.5 stylus only; `low` = read off an unlabelled figure or from memory. `not found` means the spec does not state it.

## Sources

- Spec page (authoritative): `http://web.archive.org/web/20181225002154/https://material.io/archive/guidelines/components/dividers.html` (Wayback snapshot 2018-12-25 00:21:54 of the MD1 archive; full text read).
- Same page on Google's live MD1 mirror: `https://m1.material.io/components/dividers.html` (read 2026-10-22; text identical; figures served from `https://storage.googleapis.com/material-io-design/m1/assets/<id>/<name>.png`).
- Earlier revision, read for drift: `http://web.archive.org/web/20160529220840/http://www.google.com/design/spec/components/dividers.html` (2016-05-29; identical text).
- Figures read from the page: components-dividers-specs ("The divider sits within the baseline of the tile"), -type3 (inset divider in a contacts list), -type5 (divider above a subheader).
- Companion spec pages (m1.material.io): `components/lists.html` (text left padding 72dp), `layout/metrics-keylines.html` (72dp mobile and 80dp tablet content keylines), `components/subheaders.html`, `style/color.html` (12% dividers in both opacity tables).
- Vuetify 1.5.24: `src/stylus/components/_dividers.styl`, `_subheaders.styl`, `_lists.styl`; `src/stylus/settings/_theme.styl`, `_variables.styl`; `src/components/VDivider/VDivider.ts`.

## 1. Purpose and usage

- A divider is a thin, lightweight rule that groups content in lists and page layouts. Dividers organize page content and hierarchy into individual tiles.
- Full-bleed dividers emphasize separate content areas and sections that require distinct visual separation. Alternatives are white space, subheaders and inset dividers.
- Heavy use of dividers creates visual noise and dilutes their meaning. Use full-bleed dividers when lists have no anchoring element (avatar or icon) and spacing alone does not separate tiles. Use inset dividers with anchoring elements; overuse of inset dividers also reduces their meaning.
- Image-based content in grid lists does not need dividers; white space and subheaders separate grid sections.
- Full-bleed dividers can also indicate seams in material where the material will expand when content is expanded.

## 2. Types and variants

| Type | Use | Extent | Confidence |
|---|---|---|---|
| Full-bleed divider | distinct content sections (biographic details from contact information) or distinct content elements (list items) in lists and page layouts | edge to edge of the list or page (figures) | high |
| Inset divider | related content (sections in a contacts list, emails in a conversation); used with anchoring icons or avatars aligned with the Title Key Line | starts at the title keyline and runs to the right edge (figure type3) | high |
| Subheader divider | a divider used with a subheader is placed above the subheader to tie the subheader to the content below it | full-bleed in the figure (type5) | high |
| Vertical divider | not found | | |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Rule | a 1dp line at 12% opacity | high |
| Inset offset | the distance from the left edge to the Title Key Line; the rule starts there | high |
| Placement | along the bottom edge of the content tile; the divider sits within the baseline of the tile and is independent of the grid | high |

## 4. Metrics and keylines

| Element | Value | Confidence | Source and notes |
|---|---|---|---|
| Thickness | 1dp | high | text |
| Placement | along the bottom edge of content tiles, within the tile's baseline, independent of the grid | high | text and figure |
| Margins above and below | none; the rule occupies the bottom 1dp of the tile | high | figure |
| Inset start, mobile | 72dp from the left edge: the Title Key Line, which the lists page gives as "text padding, left: 72dp" and the keylines page as "content associated with an icon or avatar left margin: 72dp"; the dividers page itself names the keyline without the number | high | lists page, keylines page |
| Inset start, tablet | 80dp ("content left margin from screen edge: 80dp", keylines page) | high | keylines page |
| Inset end | right edge of the tile (figure) | high | figure type3 |
| Subheader tile with divider | 48dp subheader tile; divider above it | high | subheaders page; figure type5 |
| Vertical divider length and margins | not found | | |
| Dense list inset | not found (dense lists keep the 72dp text keyline on the lists page) | high | lists page |

Type styles: none (the divider carries no text). A subheader paired with a divider uses Roboto Medium 14sp (subheaders page), which is Body 2 at device size.

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Divider | 12% black | 12% white | high (page text, and the color page tables "Dividers 12%") |
| Subheader text | 54% black or the app's primary color (subheaders page) | not found | high |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Divider | none; it is ink on the surface, not a separate sheet (not stated as a number) | not found; low that it is 0dp |

## 7. Motion

| Item | Value | Confidence |
|---|---|---|
| Any transition | not found | |
| Expansion seam | full-bleed dividers can mark where material expands; the expansion motion itself is not specified here | high (statement); not found (motion) |

## 8. States

| State | Value | Confidence |
|---|---|---|
| Hover, focus, pressed, disabled, selected, error | not found; dividers are static | |

## 9. Behavior

- Static; no interaction.
- Placed within the bottom of the tile, so the tile's stated height includes the rule.
- Place the divider above a subheader, not below it.
- Do not add dividers to image-based grid lists.
- Use inset dividers only alongside anchoring elements; use full-bleed dividers for lists without anchors and for section boundaries.
- Independent of the layout grid: the rule does not follow the grid columns.

## 10. Web notes

- Maps 1:1: 1dp is 1px (do not use hairline 0.5px); 12% opacity as `rgba(0, 0, 0, 0.12)` or `rgba(255, 255, 255, 0.12)`; the inset as `margin-inline-start: 72px` (80px at the tablet breakpoint) so it mirrors in RTL.
- Needs interpretation: "within the baseline of the tile" means the rule is part of the tile's box (a `border-bottom` on the tile, or an element absolutely positioned at the tile's bottom), not a separate 1px element that adds to the list height. A standalone rule between sections is acceptable when no tile owns it.
- Vertical dividers are not in the spec; if shipped, label them an extension.
- WAI-ARIA: the native `<hr>` element (implicit role separator); a vertical rule needs `role="separator"` with `aria-orientation="vertical"`; a purely decorative rule between list items that are already separated semantically should be `aria-hidden="true"` or `role="presentation"`. There is no APG widget pattern for a static separator; the APG "separator" role (focusable variant) applies only to movable splitters, which this component is not.
- v0 primitives: none required; a presentational element (v0 `Atom`) suffices.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 | File | Verdict |
|---|---|---|---|---|
| Thickness | 1dp | `border-width: thin 0 0 0` (1px) | `_dividers.styl` | match |
| Color, light | 12% black | `$material-light.dividers: rgba(#000, .12)` | `_theme.styl` | match |
| Color, dark | 12% white | `$material-dark.dividers: rgba(#fff, .12)` | `_theme.styl` | match |
| Inset start | 72dp (title keyline) | `--inset margin-left: 72px; max-width: calc(100% - 72px)` | `_dividers.styl` | match |
| Tablet inset | 80dp | no breakpoint variant | `_dividers.styl` | not implemented |
| Element | not stated | `<hr class="v-divider">`, `display: block; flex: 1 1 0px; height: 0; max-height: 0` | `VDivider.ts`, `_dividers.styl` | n/a |
| Placement | within the tile's bottom 1dp | separate element rendered between tiles; `v-list__tile` stays 48px and the rule adds 1px | `_lists.styl`, `_dividers.styl` | differs in model |
| Vertical variant | not found | `--vertical`: `border-width: 0 thin 0 0`, `display: inline-flex`, `min-height: 100%`; inset vertical `margin-top: 8px; max-height: calc(100% - 16px)` | `_dividers.styl` | Vuetify addition |
| Subheader inset | subheader aligned with the list text keyline | `.v-subheader--inset margin-left: 56px` (`$subheader-inset-margin` = `$list-item-right-margin` = 56px) | `_subheaders.styl`, `_variables.styl` | differs (56px versus 72dp) |
| Subheader tile | 48dp, Medium 14sp, 54% black | `.v-subheader height: 48px; font-size: 14px; font-weight: 500; color: text.secondary; padding: 0 16px` | `_subheaders.styl` | match |
| Transition | not found | `transition: inherit` | `_dividers.styl` | spec silent |
