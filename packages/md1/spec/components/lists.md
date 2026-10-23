# Lists

Material Design 1 spec page `components/lists.html`, pinned for `@paper/md1` (`Md1List`, `Md1ListTile`, `Md1Subheader`).

## Sources

Primary (fetched and read by this note's author; Wayback resolved the requested 2018-12-25 timestamp to the captures listed):

| URL | Note |
|---|---|
| http://web.archive.org/web/20210805024943/https://material.io/archive/guidelines/components/lists.html | Requested `20181225002255`; the archive has no 2018-12-25 capture of this path and served 2021-08-05. Text identical to the 2018-01-19 capture. |
| http://web.archive.org/web/20180119205824/https://material.io/guidelines/components/lists.html | Requested `20180223140411`; served 2018-01-19. |
| http://web.archive.org/web/20160530205119/http://www.google.com/design/spec/components/lists.html | Requested `20160604061521`; served 2016-05-30. Adds one line the later captures dropped: "List right margin: 56dp". |
| http://web.archive.org/web/20160530205119im_/http://material-design.storage.googleapis.com/publish/material_v_8/material_ext_publish/0B6Okdz75tqQsYzdVRGozRHVYbms/components_lists_keylines1.png | Keyline redline (16, 72, 16, 56 labels). Same host and timestamp for `components_lists_keylines3/4/5/6.png`, `components_lists_keylines_single2/5/5_dense/8/11.png`, `components_lists_keylines_two5/5_dense.png`, `components_lists_keylines_three2_dense.png`, `components_lists_content1.png`. The 2021 capture of the same images returns 404. All redline images are xhdpi (2 px per dp); measured values below are divided by 2. |

Supporting pages, read from the shared scratchpad text extractions `m1-*.txt` produced by a sibling researcher from the same archive (canonical path `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/<path>`; not fetched by this author): `components/subheaders.html`, `components/dividers.html`, `style/color.html`, `style/typography.html`, `material-design/elevation-shadows.html`, `motion/duration-easing.html`, `layout/metrics-keylines.html`, `components/buttons.html` (state overlay opacities only).

Vuetify 1.5.24 cross-check files: `packages/vuetify/src/stylus/components/_lists.styl`, `_subheaders.styl`, `_dividers.styl`, `stylus/settings/_variables.styl`, `_theme.styl`, `components/VList/VListTileAvatar.ts`, `VList/VListTile.ts`, `VAvatar/VAvatar.ts`, `VIcon/VIcon.ts`.

Confidence legend: `high` = stated in the spec page text or printed as a label in a spec redline image; `moderate` = Vuetify 1.5 stylus only, or measured by pixel count from a spec image without a printed label; `low` = memory.

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Lists present multiple line items vertically as a single continuous element." Lists are a continuous column of rows; each row contains a tile; primary actions fill the tile; supplemental actions are icons and text. | high |
| Fit | Best for homogeneous data types or sets of data types (images and text); optimized for reading comprehension while differentiating between similar data types or qualities within one type. | high |
| Use cards instead | When more than three lines of text are needed in a tile. | high |
| Use a grid list instead | When the primary distinguishing content is images. | high |
| Density | When mouse and keyboard are the primary input methods, measurements may be condensed to accommodate denser layouts (the "dense" values below). | high |
| Scrolling | Lists scroll only vertically. | high |
| Gestures | Swipe action must be consistent within a list. Tiles may be moved between a list and a drop target, and picked up and reordered within a list. | high |
| Sorting and filtering | Tiles can be sorted or filtered by date, file size, alphabetical order or other parameters. Never display information in random order; if the user cannot sort, the app must apply a logical sort order. | high |
| Content hierarchy | Up to three lines of text per tile; text length may vary between tiles in one list. Place the most distinguishing content on the left of the tile (first line in multi-line tiles) and the least distinguishing on the right. | high |
| Primary action | Fills the entire tile; is never represented solely by an individual icon or text button; is consistent for all tiles in a list (for example, play in a music list). Most of the tile area belongs to the primary action. | high |
| Supplemental actions | Represented by icons, secondary text and similar; consistent functionality and consistent location across the list; placed on the right side. May open a subsequent view (such as a card); never have a submenu or an action overflow menu. | high |
| Repeating actions | Avoid a repeated supplemental action in every tile (for example, share). Toggles such as stars or pins are the exception because they carry per-tile information. | high |
| Alternatives named by the page | Cards, Grid lists. | high |

## 2. Types and variants

Every type exists in a default (touch) metric and a dense (mouse and keyboard) metric. The page lists four content variants for each line count. Heights are tile heights.

| Type | Content variant | Height default | Height dense | Confidence |
|---|---|---|---|---|
| Single-line | Text only | 48 dp | 40 dp | high |
| Single-line | Icon with text | 48 dp | 40 dp | high |
| Single-line | Avatar with text | 56 dp | 48 dp | high |
| Single-line | Avatar with text and icon | 56 dp | 48 dp | high |
| Two-line | Text only | 72 dp | 60 dp | high |
| Two-line | Icon with text | 72 dp | 60 dp | high |
| Two-line | Avatar with text | 72 dp | 60 dp | high |
| Two-line | Avatar with text and icon | 72 dp | 60 dp | high |
| Three-line | Text only | 88 dp | 76 dp | high |
| Three-line | Icon with text | 88 dp | 76 dp | high |
| Three-line | Avatar with text | 88 dp | 76 dp | high |
| Three-line | Avatar with text and icon | 88 dp | 76 dp | high |
| Subheader tile (list, grid, menu) | Text | 48 dp | not found | high (subheaders page) |

Tiles may vary in height within one list ("Tiles hold content, and can vary in height within a list").

## 3. Anatomy

| Part | Description | Confidence |
|---|---|---|
| List | Single continuous column of tessellated rows of equal width. 8 dp padding at top and bottom of the list (4 dp dense), except lists that start with a subheader, which carries its own padding. | high |
| Row | Container for one tile. | high |
| Tile | Content container; primary action target. | high |
| Primary text | First line. Roboto Regular 16 sp (13 sp dense). | high |
| Secondary text | Second line (two-line) or second and third lines (three-line). Roboto Regular 14 sp. Dense: the page states only "Font: Roboto Regular 13sp" for dense tiles and gives no separate dense secondary size. | high |
| Avatar | Circle at the left, 40 dp diameter ("Avatar: 40dp" in the metrics-keylines page's touch target section; measured 80 px at 2x in `keylines_single11`, `keylines6`). Left edge 16 dp from the screen edge; right edge at 56 dp, text keyline at 72 dp. | high |
| Icon | 24 dp glyph at the left (measured 48 px in `keylines_single5`, `keylines1`), 16 dp from the screen edge. Centered on the 72 dp keyline region (16 dp + 24 dp + 32 dp gap to text). | moderate (size), high (padding) |
| Secondary action or secondary info | Icon (24 dp, measured 48 px in `keylines_single11`) or text at the right, 16 dp from the right edge, inside a 56 dp column measured from the right edge ("List right margin: 56dp", 2016 capture; "56" label in `keylines1`). | high |
| Subheader | List tile of 48 dp, Roboto Medium 14 sp, 16 dp left padding; left aligned with avatar or icon, or with the text keyline (72 dp) when a floating action button occupies the avatar column. Pins to the top on scroll until pushed off by the next subheader. | high (subheaders page) |
| Divider | 1 dp, 12% black (light) or 12% white (dark). Inset dividers align with the text keyline and are used with anchoring elements such as avatars; full-bleed dividers separate sections. | high (dividers page) |
| Leave-behind, controls | See `lists-controls.md`. | high |

## 4. Metrics and keylines

### 4.1 Keylines and margins

| Metric | Mobile | Tablet | Desktop and dense | Confidence |
|---|---|---|---|---|
| Screen edge left and right margin | 16 dp | 24 dp | not found on the lists page; the lists page uses 16 dp for the dense redlines | high (metrics-keylines page for 16 and 24) |
| Content keyline for text next to an icon or avatar | 72 dp | 80 dp | 72 dp (dense redlines) | high |
| Text-only tile left padding | 16 dp | not found | 16 dp | high |
| Right padding (text or icon to right edge) | 16 dp | not found | 16 dp | high |
| Secondary action column, from right edge | 56 dp | not found | not found | high (2016 text, `keylines1` label) |
| List top and bottom padding | 8 dp | 8 dp | 4 dp (dense) | high |
| Baseline grid | 8 dp component grid; type on a 4 dp baseline grid; "Bottom padding is measured from the baseline." | high |
| Touch target | At least 48 x 48 dp with 8 dp or more between targets | same | same | high (metrics-keylines page) |

### 4.2 Single-line tiles

| Variant | Font | Height | Left paddings | Right padding | List top padding | Confidence |
|---|---|---|---|---|---|---|
| Text only | Roboto Regular 16 sp | 48 dp | text 16 dp | 16 dp | 8 dp | high |
| Text only, dense | Roboto Regular 13 sp | 40 dp | text 16 dp | 16 dp | 4 dp | high |
| Icon with text | Roboto Regular 16 sp | 48 dp | icon 16 dp, text 72 dp | 16 dp | 8 dp | high |
| Icon with text, dense | Roboto Regular 13 sp | 40 dp | icon 16 dp, text 72 dp | 16 dp | 4 dp | high |
| Avatar with text | Roboto Regular 16 sp | 56 dp | avatar 16 dp, text 72 dp | 16 dp | 8 dp | high |
| Avatar with text, dense | Roboto Regular 13 sp | 48 dp | avatar 16 dp, text 72 dp | 16 dp | 4 dp | high |
| Avatar with text and icon | Roboto Regular 16 sp | 56 dp | avatar 16 dp, text 72 dp | right icon 16 dp | 8 dp | high |
| Avatar with text and icon, dense | Roboto Regular 13 sp | 48 dp | avatar 16 dp, text 72 dp | right icon 16 dp | 4 dp | high |

Vertical alignment: text, icon and avatar are vertically centered in single-line tiles (redlines `keylines_single5`, `single11`; icon 24 dp sits at 12 dp from the tile top in a 48 dp tile, measured).

### 4.3 Two-line tiles

| Variant | Primary font | Secondary font | Height | Left paddings | Text top and bottom padding | Right padding | List top padding | Confidence |
|---|---|---|---|---|---|---|---|---|
| Text only | Roboto Regular 16 sp | Roboto Regular 14 sp | 72 dp | text 16 dp | 20 dp (bottom measured from baseline) | 16 dp | 8 dp | high |
| Text only, dense | Roboto Regular 13 sp | not found | 60 dp | text 16 dp | not found | 16 dp | 4 dp | high |
| Icon with text | 16 sp | 14 sp | 72 dp | icon 16 dp, text 72 dp | 20 dp | 16 dp | 8 dp | high |
| Icon with text, dense | 13 sp | not found | 60 dp | icon 16 dp, text 72 dp | not found | 16 dp | 4 dp | high |
| Avatar with text | 16 sp | 14 sp | 72 dp | avatar 16 dp, text 72 dp | 20 dp; "Center-align icon with text area." | 16 dp | 8 dp | high |
| Avatar with text, dense | 13 sp | not found | 60 dp | avatar 16 dp, text 72 dp | not found | 16 dp | 4 dp | high |
| Avatar with text and icon | 16 sp | 14 sp | 72 dp | avatar 16 dp, text 72 dp | 20 dp | right icon 16 dp | 8 dp | high |
| Avatar with text and icon, dense | 13 sp | not found | 60 dp | avatar 16 dp, text 72 dp | not found | right icon 16 dp | 4 dp | high |

### 4.4 Three-line tiles

| Variant | Primary font | Secondary font | Height | Left paddings | Text top padding | Text bottom padding | Right padding | List top padding | Confidence |
|---|---|---|---|---|---|---|---|---|---|
| Text only | Roboto Regular 16 sp | Roboto Regular 14 sp | 88 dp | text 16 dp | 16 dp | 20 dp (from baseline) | 16 dp | 8 dp | high |
| Text only, dense | Roboto Regular 13 sp | not found | 76 dp | text 16 dp | not found | not found | 16 dp | 4 dp | high |
| Icon with text | 16 sp | 14 sp | 88 dp | icon 16 dp, text 72 dp | 16 dp; "Top-align icon with primary text." | 20 dp | 16 dp | 8 dp | high |
| Icon with text, dense | 13 sp | not found | 76 dp | icon 16 dp, text 72 dp | not found | not found | 16 dp | 4 dp | high |
| Avatar with text | 16 sp | 14 sp | 88 dp | avatar 16 dp, text 72 dp | 16 dp; "Top-align avatar with primary text." | 20 dp | 16 dp | 8 dp | high |
| Avatar with text, dense | 13 sp | not found | 76 dp | avatar 16 dp, text 72 dp | not found | not found | 16 dp | 4 dp | high |
| Avatar with text and icon | 16 sp | 14 sp | 88 dp | avatar 16 dp, text 72 dp | 16 dp; "Top-align avatar and icon with primary text." | 20 dp | right and left padding by the icon 16 dp | 8 dp | high |
| Avatar with text and icon, dense | 13 sp | not found | 76 dp | avatar 16 dp, text 72 dp | not found | not found | 16 dp | 4 dp | high |

Three-line tiles hold a maximum of three lines: primary plus two secondary lines (secondary text wraps and truncates after the second line, as drawn in `keylines5` and `keylines_three2_dense`).

### 4.5 Element sizes

| Element | Value | Confidence |
|---|---|---|
| Avatar diameter | 40 dp ("Avatar: 40dp", metrics-keylines page; matches the 80 px measurement at 2x in `keylines_single11`, `keylines6`) | high |
| Left icon | 24 dp (measured; 48 px at 2x in `keylines_single5`, `keylines1`); unchanged in dense redlines (`keylines_single5_dense`) | moderate |
| Right icon (secondary action) | 24 dp (measured; 48 px at 2x in `keylines_single11`), right edge 16 dp from the screen edge | moderate (size), high (padding) |
| Secondary action column | 56 dp from the right edge | high |
| Subheader tile | 48 dp high, 16 dp padding, Roboto Medium 14 sp | high (subheaders page) |
| Divider | 1 dp thick; inset divider starts at the text keyline (72 dp mobile) | high (thickness), moderate (72 dp inset, from the dividers page prose "aligned with the Title Key Line" plus `keylines4`) |
| Primary text line height | 24 dp (4 dp grid; Vuetify 1.5 uses 24 px) | moderate |

### 4.6 Type styles

| Text element | MD1 style | Size and weight | Desktop size (typography page) | Confidence |
|---|---|---|---|---|
| Primary text | Subheading | Roboto Regular 16 sp | 15 sp (desktop Subheading) | high (size), moderate (style name; the lists page names the font, not the style) |
| Primary text, dense | none named | Roboto Regular 13 sp | 13 sp equals desktop Body 1 | high |
| Secondary text | Body 1 | Roboto Regular 14 sp | 13 sp | high (size), moderate (style name) |
| Subheader | Body 2 | Roboto Medium 14 sp | not found | high (subheaders page) |
| Secondary info text (for example a timestamp) | Caption | 12 sp | not found | low (size not stated; `content1` shows a smaller grey label) |
| Button text inside tiles | Button | Roboto Medium 14 sp, all caps | not found | high (typography page) |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| List background | Surface of its container (white sheet or card); the lists page does not name a role | Surface (dark theme sheet) | moderate |
| Primary text | 87% black | 100% white | high (color page) |
| Secondary text | 54% black | 70% white | high (color page) |
| Disabled text and hint text | 38% black | 50% white | high (color page) |
| Active icon | 54% black | 100% white | high (color page) |
| Inactive icon | 38% black | 50% white | high (color page) |
| Divider | 12% black | 12% white | high (dividers and color pages) |
| Subheader text | 54% black (secondary grey) or the app primary color | not found | high (subheaders page) |
| Avatar | Image or a color fill; no role stated | same | moderate |
| Selected or activated tile | not found on the lists page | not found | not found |

## 6. Elevation

| State | Value | Confidence |
|---|---|---|
| Resting | 0 dp relative to the containing surface; the elevation page lists no list entry | moderate |
| Picked up for drag and drop | not found on the lists page (the elevation page gives "Card (when picked up): 8dp" for cards only) | not found |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Lists page | No durations or curves are given. | high |
| Default durations (motion page) | Mobile 300 ms typical; entering 225 ms; leaving 195 ms; large full-screen 375 ms; never above 400 ms. Tablet durations about 30% longer (390 ms); wearables about 30% shorter; desktop 150 ms to 200 ms. | high |
| Default easing (motion page) | Standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`; deceleration `cubic-bezier(0.0, 0.0, 0.2, 1)` for entering; acceleration `cubic-bezier(0.4, 0.0, 1, 1)` for leaving; sharp `cubic-bezier(0.4, 0.0, 0.6, 1)`. | high |
| Expand and collapse | Vertical expansion of the tile (lists-controls page); no duration given. | high |
| Swipe (leave-behind) | Tile follows the finger horizontally and reveals the leave-behind. | high |
| Drag and drop | Tile is picked up and moved between list and drop target; no values. | high |

## 8. States

| State | Spec rendering | Confidence |
|---|---|---|
| Normal | Text and icon opacities of section 5. | high |
| Hover | Not shown on the lists page, and the buttons page text in this archive gives no hover percentage (desktop raised buttons gain elevation on hover). Memory of the 2014 spec: hover 20% #999999 (light), 15% #CCCCCC (dark). | not found (spec), low (memory values) |
| Focus | Not shown on the lists page. Buttons page: raised buttons "Focused: 12% #000000 shade over the color" in both themes; "Flat buttons with 12% opacity on focus". | high (buttons page values), not found (lists) |
| Pressed | Not shown on the lists page. Buttons page: pressed 40% #999999 (light), 25% #CCCCCC (dark); ink ripple from the touch point. | high (buttons page values), not found (lists) |
| Disabled | Text 38% black (light) or 50% white (dark); icons 38% black or 50% white. | high (color page) |
| Selected or activated | not found on the lists page; the lists-controls page uses a checkbox or a check glyph for selection. | not found |
| Expanded | Expanded tile title in the primary color with the chevron rotated (lists-controls image `components_listcontrols_expand4.png`). | high |
| Error | not found | not found |

## 9. Behavior

| Rule | Spec | Confidence |
|---|---|---|
| Scroll | Vertical only. Subheaders pin at the top until the next subheader pushes them off (subheaders page). | high |
| Primary action | Whole tile is the target, including the text; never only an icon or a text button. | high |
| Supplemental action | Separate target on the right; consistent across the list; opens a subsequent view or toggles; never a submenu or overflow menu. | high |
| Swipe | Same swipe action for every tile in a list; see leave-behinds in `lists-controls.md`. | high |
| Reorder and drag | Tiles can be picked up and reordered, or moved between a list and a drop target. | high |
| Sorting | Logical sort order is mandatory; alphabetical sorting makes information easier to find. | high |
| Line limit | Three lines maximum; otherwise use cards. | high |
| Padding | 8 dp above and below the list (4 dp dense) except when the list starts with a subheader. | high |

## 10. Web notes

| Topic | Note |
|---|---|
| Units | dp and sp map 1:1 to CSS px. |
| Markup | Plain lists are `ul` and `li` (implicit `list` and `listitem` roles); a navigation list uses links (`a`) inside list items; a primary action that is not navigation is a `button` filling the tile. |
| WAI-ARIA | Static or navigation list: no widget role. Single-select lists whose tiles are options: WAI-ARIA Listbox pattern. Tiles with checkboxes: WAI-ARIA Checkbox pattern per tile; do not use `listbox` for mixed content. Expand and collapse tiles: WAI-ARIA Disclosure pattern (`aria-expanded` on the control). Reorder: no WAI-ARIA pattern exists; provide keyboard move actions and announce moves with a live region. |
| Dense | Implement "dense" as the desktop metric (40, 48, 60, 76 dp; 13 sp; 4 dp list padding). The spec gives no separate desktop column. |
| Baseline paddings | The 20 dp and 16 dp text paddings are measured to the baseline; in CSS this is approximated by centering a text block whose line heights are 24 dp (16 sp) and 20 dp (14 sp) inside the fixed tile height. |
| Three-line truncation | Secondary text is clamped to two lines (`-webkit-line-clamp: 2`); the spec truncates with an ellipsis (`keylines6`). |
| Hover-only controls | A desktop checkbox that appears only on hover and focus must still be in the tab order and visible on `:focus-visible` (see `lists-controls.md`). |

## Vuetify 1.5 cross-check

Files: `_lists.styl`, `_subheaders.styl`, `_dividers.styl`, `_variables.styl`, `_theme.styl`, `VListTileAvatar.ts`, `VAvatar.ts`, `VIcon.ts`.

| Metric | Spec | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Single-line height | 48 dp | `$list-item-single-height: 48px` | match |
| Single-line with avatar | 56 dp | `$list-item-avatar-single-height: 56px` (`.v-list__tile--avatar`) | match |
| Two-line | 72 dp | `$list-item-double-height: 72px` | match |
| Three-line | 88 dp | `$list-item-triple-height: 88px` | match |
| Dense single, avatar, two, three | 40, 48, 60, 76 dp | 40px, 48px, 60px, 76px | match |
| List top and bottom padding | 8 dp; 4 dp dense | `padding: 8px 0 8px`; dense 4px | match |
| Tile horizontal padding | 16 dp | `padding: 0 16px` | match |
| Text keyline next to avatar or icon | 72 dp | avatar and action columns `min-width: 56px` after 16px padding; `$list-item-left-padding: 72px` for `__items--no-action` | match |
| Secondary action column | 56 dp from right edge | `.v-list__tile__action { min-width: 56px }`, `$list-item-right-margin: 56px` | match |
| Primary text | Regular 16 sp | `$list-tile-font-size: 16px`, weight 400, `line-height: 24px` | match |
| Secondary text | Regular 14 sp | `$list-sub-title-font-size: 14px` | match |
| Dense text | 13 sp | `$list-item-dense-font-size: 13px` (title and sub-title) | match |
| Avatar | 40 dp (measured) | `VListTileAvatar` default `size: 40` (plain `VAvatar` defaults to 48) | match |
| Icon | 24 dp (measured), also in dense redlines | `VIcon` default 24px; dense list icons `$list-item-dense-icon-font-size: 22px` | discrepancy: dense icons shrink to 22px, spec redlines keep 24 dp |
| Subheader | 48 dp, Medium 14 sp, 16 dp padding | `.v-subheader` height 48px, `body-2` 14px/500, `padding: 0 16px` | match |
| Dense subheader | not found in spec | 40px, 13px | Vuetify-only value |
| Subheader inset | aligned to text keyline when FAB present | `--inset` margin-left 56px plus 16px padding equals 72 dp | match |
| Inset divider | aligned to the text keyline | `.v-divider--inset` margin-left 72px | match |
| Two-line text paddings | 20 dp top and bottom to baseline | flex centering, no baseline padding | approximation |
| Three-line avatar | top aligned with primary text (16 dp text top padding) | `.v-list__tile__avatar { margin-top: -18px }` (dense -14px) inside a centered flex row | approximation |
| Three-line secondary text | two lines then truncate | `-webkit-line-clamp: 2` | match |
| Hover | not found on the lists page or in the buttons page text | `$material.list-tile.hover: rgba(0,0,0,.04)` light, `rgba(255,255,255,.08)` dark | Vuetify-only value (MD2-era 4% and 8% overlays) |
| Text and icon opacities | 87 / 54 / 38% black; 100 / 70 / 50% white; dividers 12% | `_theme.styl` text `.87/.54/.38`, dark `1/.70/.50`, dividers `.12`, icons `.54/.38` and `1/.5` | match |
| Transition | standard curve `cubic-bezier(0.4,0,0.2,1)`, 300 ms mobile, 150 to 200 ms desktop | `$primary-transition: 0.3s cubic-bezier(.25,.8,.50,1)` ("swing") | discrepancy: easing curve differs |
| Active tile | not found | `.v-list__tile--active` applies `primary--text` | Vuetify-only value |
| Stacked action text | not found (Caption 12 sp inferred) | `.v-list__tile__action-text` 12px grey | consistent with Caption |
