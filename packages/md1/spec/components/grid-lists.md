# Grid lists (Material Design 1)

Spec note for `Md1GridList` (grid, cell, tile, tile header and footer bars, grid subheaders). Pins the archived MD1 "Grid lists" page so implementers never guess.

Confidence tags: `high` = stated on the spec page or a companion spec page (text or a labelled figure); `moderate` = from Vuetify 1.5 stylus only; `low` = read off an unlabelled figure or from memory. `not found` means the spec does not state it.

## Sources

- Spec page (authoritative): `https://m1.material.io/components/grid-lists.html` (the MD1 guidelines Google hosts as an archive; full text read, and identical line for line to the archive's 2018-12-25 content; read 2026-10-22).
- Earlier revision, read for drift: the 2016 revision of the guidelines page `components/grid-lists` (2016-06-04; identical text apart from a stray "test" heading).
- Figures read from the page: components-grids-specs1 (type 14/14), -specs2 (type 16/12), -specs22 (truncation redline; cropped and enlarged 3x), -specs3, -specs5, -specs7, -specs8, -specs10, -specs13, -specs14, -specs15, -specs16, -specs17 (cropped), -specs18, -specs19, -specs20, -specs21, -content2 (action and text positions).
- Companion spec pages (m1.material.io): `style/typography.html`, `style/color.html`, `layout/metrics-keylines.html` (ratio keylines, icon 24dp, touch target 48dp), `components/subheaders.html` (grid subheaders), `patterns/selection.html`, `components/dividers.html`, `components/lists.html`.
- Vuetify 1.5.24: `src/stylus/components/_grid.styl`, `_subheaders.styl`; `src/stylus/settings/_variables.styl` (`$grid-gutter`, `$grid-gutters`, `$grid-breakpoints`).

## 1. Purpose and usage

- Grid lists are an alternative to standard list views: a repeated pattern of cells arrayed vertically and horizontally. Tiles hold content and can span one or more cells.
- Best suited to homogeneous data, typically images; optimized for visual comprehension and for differentiating between similar data types.
- If tile text must be prominent enough to distinguish primary content, use a list or cards instead. Lists are optimized for reading comprehension across multiple data types; cards suit inconsistent formatting and heterogeneous content.
- Primary content is the main differentiating element, typically an image; provide a default image for tiles that lack one. Secondary content is an action or text.

## 2. Types and variants

| Variant | Description | Own metrics | Confidence |
|---|---|---|---|
| Image-only grid list | tiles with primary content only; tiles may span multiple columns | grid list padding 4dp or 1dp | high |
| Single-line text (text only) | one line of text in a header or footer bar | bar 48dp, text padding 16dp, 16sp | high |
| Single-line text with icon | one line plus a secondary action icon flush right or flush left | bar 48dp, text padding 16dp, 16sp | high |
| Two-line text (text only) | two lines in the bar | bar 68dp, text padding 16dp, 16sp/12sp or 14sp/14sp | high |
| Two-line text with icon | two lines plus an icon flush right or left | bar 68dp | high |
| Header versus footer | the bar sits at the top (header) or bottom (footer) of the tile | same heights | high |
| Full-screen grid list | full-bleed tiles with fluid image ratios between minimum and maximum widths; fixed heights, margins and padding | not found as numbers | high |
| Centered grid list | fluid margins with a minimum width; fixed image widths, heights and padding | not found as numbers | high |
| Multi-column tiles | larger tiles; consider whether secondary text is needed because of empty space | not found | high |
| Horizontally scrolling single-line gallery | the one permitted horizontal grid list | not found | high |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Grid list | the container; vertical scroll | high |
| Cell | the unit of the grid | high |
| Tile | holds content; spans one or more cells | high |
| Primary content | image (or default image); the primary action fills the whole tile | high |
| Secondary content | text (one or two lines) and or an action icon, placed consistently per grid list (corners or edges) | high |
| Header or footer bar | translucent dark band over the image carrying the text and icon (figures) | high; low for the band color |
| Grid subheader | 48dp tile, Roboto Medium 14sp, aligned 16dp from the left edge (subheaders page) | high |
| Gutter | 4dp or 1dp between tiles | high |

## 4. Metrics and keylines

| Element | Value | Confidence | Source and notes |
|---|---|---|---|
| Single-line header or footer height | 48dp | high | text |
| Two-line header or footer height | 68dp, with or without icon | high | text and figures |
| Text padding | 16dp (left of the text; the figure also marks 16dp from the bar's top edge to the text) | high | text; figure specs1 |
| Text to action icon (icon on the right) | 16dp | high | figure specs22 |
| Action icon glyph | 24dp (figures; keylines page icon size) | high | keylines page |
| Action icon touch area | the icon's 48dp container is drawn flush with the tile edge in the figures (specs8, specs10, specs17, specs19), which puts the 24dp glyph 12dp from the edge | low (derived) | figures |
| Icon on the left | the container sits flush left and the text starts at the container's edge; an "8" label is drawn at the right end of the text block (specs22, specs17, specs19); what the 8dp measures is not stated | high (label); low (meaning) | figures |
| Single-line text size | 16sp | high | text |
| Two-line text sizes | 16sp/12sp or 14sp/14sp | high | text |
| Grid list padding (gutter between tiles) | 4dp or 1dp | high | text |
| Tile span | one or more cells horizontally or vertically | high | text |
| Aspect ratios | ratio keylines 16:9, 3:2, 4:3, 1:1, 3:4, 2:3; width = ratio x height (keylines page) | high | keylines page |
| Full-screen grid: image minimum and maximum widths | not found as numbers (derived from the ratio keylines) | | |
| Centered grid: minimum width | not found | | |
| Grid subheader | 48dp tile; 16dp from the left edge | high | subheaders page |
| Text truncation | ellipsis at the end of the line (figure specs22) | high | |
| Tile corner radius | not found; tiles are square-cornered in the figures | low | |

Type styles:

| Text element | Spec | Type style | Confidence |
|---|---|---|---|
| Single-line text | 16sp | Subheading (device size) | high |
| Two-line, 16/12 | 16sp first line, 12sp second line | Subheading and Caption | high |
| Two-line, 14/14 | 14sp both lines; the figure renders the first line heavier than the second (unlabelled) | Body 2 and Body 1 (if the first line is Medium) or Body 1 twice | high (sizes); low (weights) |
| Grid subheader | Roboto Medium 14sp | Body 2 (device size) | high |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Header or footer bar | a translucent dark band over the image with white text in every figure; opacity not found | same | low |
| Bar text | white; primary 100%, secondary 70% white (color page light text on dark backgrounds) | same | low (application) |
| Bar icon | white; active icon 100%, inactive 50% (color page light icons) | same | low (application) |
| Grid subheader | 54% black or the app's primary color (subheaders page) | not found | high |
| Tile background behind missing images | a default image is required; color not found | | |
| Gutter | the page background shows through (figures); color not found | | low |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Tiles and bars | not found; tiles are flat in every figure | not found; low that it is 0dp |

## 7. Motion

| Item | Value | Confidence |
|---|---|---|
| Any transition | not found | |
| Resizing | tiles re-sort as horizontal space becomes available; no duration given | high (behavior) |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Hover, focus, pressed | not found | |
| Selected | selection page: display a check mark and a scrim over the selected item or its avatar; compact check marks hide less content | high (selection page) |
| Disabled, error | not found | |

## 9. Behavior

- Scrolling: vertical only; horizontal grid lists are discouraged except a single-line gallery of images. Cut off tiles at the view's initial scroll position to signal overflow; do not align tiles with the view edge.
- Gestures: per-tile swipe actions are not permitted; pick-up-and-move is discouraged.
- Ordering: the first item is at the top left; order proceeds left to right, then top to bottom. Content may be filtered or sorted programmatically (date, size, alphabetical, other).
- Actions: primary actions fill the entire tile and are not represented by icons or text; they are consistent across a grid list. Secondary actions or content are icons or text, consistent in kind and location within a grid list (corners or edges), and immediate: no submenu or action overflow inside the grid list. Actions may open a subsequent view such as a card.
- Resizing: tiles re-sort as space changes; full-bleed tiles resize to the screen width; a grid list never transforms into a list. Truncate text that is too long for the tile, or enlarge the grid.
- Responsive: full-screen grid lists use fluid image ratios with minimum and maximum widths from the ratio keylines and keep fixed heights, margins and padding; centered grid lists use fluid margins with a minimum width and keep fixed image widths, heights and padding.
- Dividers are not used; white space and subheaders separate sections (dividers page).
- Limits: number of columns, maximum tile span and text length are not found.

## 10. Web notes

- Maps 1:1: 48px and 68px bars, 16px text padding, 24px icons, 4px or 1px gutters, 16px/12px/14px type.
- Needs interpretation: the bar's scrim color and opacity are unspecified (pick a value and record it); the icon's 48px touch container flush with the tile edge is derived from the figures; the left-icon "8" label is ambiguous; column count and tile widths come from the ratio keylines and the container width (`aspect-ratio` plus `grid-template-columns: repeat(auto-fill, minmax(min, 1fr))`); tile spans map to `grid-column: span n` and `grid-row: span n`; text truncation is `text-overflow: ellipsis` with one line per text row; the horizontal gallery is an overflow-x scroll container; "cut off tiles at the initial scroll position" is a layout height choice, not a behavior to script.
- WAI-ARIA: a non-interactive or link-per-tile grid list is a list (`<ul>` with `<li>` tiles, each tile's primary action a single `<a>` or `<button>` filling the tile, the image carrying alt text); a keyboard-navigable interactive collection follows the APG "Grid" pattern, layout grid variant (arrow-key navigation, one tab stop); secondary action icons are buttons with accessible names; grid subheaders are headings for their sections.
- v0 primitives: Button.Root for tile and icon actions; a presentational grid otherwise.

## Vuetify 1.5 cross-check

Vuetify 1.5 has no grid-list tile, header or footer component; consumers compose `v-card`, `v-img` and `v-subheader` inside the flexbox grid. Only the gutter and subheader metrics are comparable.

| Item | Spec | Vuetify 1.5.24 | File | Verdict |
|---|---|---|---|---|
| Gutter | 4dp or 1dp | `.container.grid-list-{size}`: each `.flex` gets `padding: gutter / 2` and each `.layout` a matching negative margin; `$grid-gutter := 8px`; sizes xs 2px, sm 4px, md 8px, lg 16px, xl 24px | `_grid.styl`, `_variables.styl` | 4dp = `grid-list-sm` (match); 1dp has no preset (not implemented) |
| Header and footer bars | 48dp and 68dp | not built in | | not implemented |
| Text padding | 16dp | not built in | | not implemented |
| Action icon | 24dp, flush right or left | not built in (`v-btn--icon` is 36px with a 24px glyph) | `_buttons.styl` | not implemented |
| Grid subheader | 48dp, Medium 14sp, 16dp from the left | `.v-subheader height: 48px; font-size: 14px; font-weight: 500; padding: 0 16px` | `_subheaders.styl` | match |
| Aspect ratios | ratio keylines | `v-img` and `v-responsive` `aspect-ratio` prop (not in stylus) | | n/a |
| Tile spans | one or more cells | 12-column `.flex.{size}{n}` widths (`flex-basis: n / 12`) and `.offset-{size}{n}` | `_grid.styl` | partial (column spans only; no row spans) |
| Breakpoints | not on this page | xs 0, sm 600px, md 960px, lg 1264px, xl 1904px (desktop values reduced by 16px, per the comment citing the responsive UI page) | `_variables.styl` | n/a |
| Container padding | not found | `.container padding: 24px` (`$grid-gutters.xl`); `16px` at sm-and-down | `_grid.styl` | spec silent |
| Scrim bar color | not found | none | | n/a |
