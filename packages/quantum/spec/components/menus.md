# Menus

Material Design 1 spec page `components/menus.html`, pinned for `@paper/quantum` (`QuMenu`, `QuMenuItem`, `QuMenuDivider`, `QuMenuSubheader`).

## Sources

Primary (fetched and read by this note's author):

| URL | Note |
|---|---|
| http://web.archive.org/web/20181225002215/https://material.io/archive/guidelines/components/menus.html | Requested `20181225002255`; served the 2018-12-25 02:22:15 capture. |
| http://web.archive.org/web/20180119205827/https://material.io/guidelines/components/menus.html | Requested `20180223140411`; served 2018-01-19. Same text. |
| http://web.archive.org/web/20160731070725/https://material.google.com/components/menus.html | Requested `20160604061521`; served 2016-07-31. Same numbers; the single-line display section additionally says "15pt Roboto font". |
| http://web.archive.org/web/20181225002215im_/https://material.io/archive/guidelines/assets/0Bzhp5Z4wHba3aEFjbTF1T1FjQTQ/components-menus-specs1.png | Mobile redline. Same host and timestamp for `components-menus-specs1-desktop.png`, `components-menus-specs1-desktop-dense.png`, `components-menus-specs2.png` (widths), `components-menus-specs3.png` (the unlabelled "Cascading menu on desktop" illustration, no callouts), `components-menus-specs4.png` (the labelled "Cascading redlines" / "Default Cascading menu" redline, asset `0Bzhp5Z4wHba3aHdodkt4Z0tvblE`), `components-menus-items1.png`, `components-menus-items2.png`, `components-menus-usage4a.png`, `components-menus-usage4b.png`, `components-dialogs-simplemenus1.png` to `simplemenus4.png`. Redlines are 2 px per dp. |
| `components-menus-menus-cascading-dropdown-spec-large-xhdpi.mp4` | 404 on the 2018 and 2016 hosts; not seen. The app-bar and text-field dropdown videos were not fetched. |

Supporting pages, read via the shared scratchpad extractions `m1-*.txt` of the same archive (canonical path `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/<path>`): `material-design/elevation-shadows.html`, `components/lists-controls.html` (fetched, see `lists-controls.md`), `components/subheaders.html`, `components/dividers.html`, `style/typography.html`, `style/color.html`, `motion/duration-easing.html`, `components/buttons.html` (overlay opacities).

Vuetify 1.5.24 cross-check files: `stylus/components/_menus.styl`, `_lists.styl`, `stylus/settings/_variables.styl`, `_elevations.styl`, `_theme.styl`, `components/VMenu/VMenu.js`, `components/VMenu/mixins/menu-keyable.js`, `mixins/menuable.js`, `mixins/delayable.ts`.

Confidence legend: `high` = stated in the page text or printed in a redline; `moderate` = Vuetify 1.5 only, or measured from a spec image; `low` = memory.

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Menus display a list of choices on a transient sheet of material." A menu appears upon interaction with a button, action, pointer or other control and contains at least two menu items. | high |
| Item | Each item is a discrete option or action affecting the app, the view or selected elements; one choice per line, a single word or short phrase. | high |
| Not navigation | Menus should not be used as a primary method for navigation. | high |
| Labels | The label of the emitting button or control must concisely and accurately reflect the items (menu bars use single words such as "file", "format", "edit"). "View" is a good title, "Stuff" is not. | high |
| Disabled versus removed | Show items as disabled rather than removing them when they exist under the right conditions (Redo with nothing to redo; Cut and Copy without a selection). Contextual menus may remove items irrelevant to the current context and disable items that need conditions (Copy enabled once text is selected). | high |
| Single item | Some app states produce a contextual menu with a single item (Android shows only Copy when highlighting web text). | high |
| Scrollable | If the menu height prevents all items from being displayed, the menu scrolls internally (phone in landscape is the example). | high |
| Simple versus dialog | Simple menus are preferred over simple dialogs because they are less disruptive; use a simple dialog when any item text would wrap to a second line, or when additional detail or orthogonal actions are needed. | high |
| Types named | Simple menus (mobile and tablet); cascading menus (desktop); also dropdown menu and action overflow menu examples. | high |
| Ordering | Static menus put the most frequently used items at the top; dynamic menus may reorder (previously used fonts first). | high |
| Nesting | Items can reveal nested submenus; limit nesting to one level. | high |
| Alternatives named | Simple dialogs. | high |

## 2. Types and variants

| Type | Platform | Item height | Text left padding | Top and bottom padding | Type size | Width | Confidence |
|---|---|---|---|---|---|---|---|
| Simple menu, default | Mobile and tablet (touch) | 48 dp | 16 dp | 8 dp each | 16 sp | multiples of 56 dp; min 112 dp; max 280 dp | high |
| Simple menu, dense | Mobile and tablet | not found (page gives only dense type 14 sp) | 16 dp | not found | 14 sp | as above | high (type), not found (height) |
| Desktop menu, default | Desktop | 32 px | 24 px | 8 px each | 15 px | unit 64 px ("desktop x= 64", redline); min width 2x = 128 px | high |
| Desktop menu, dense | Desktop | 24 px | 24 px | 4 px each | 13 px | unit 64 px; min 2x | high |
| Cascading menu | Desktop only | 32 px | 24 px | 16 px top (bottom 16 px in the redline) | 15 px (dense 13 px) | 5x = 320 px in the redline | high |
| Dropdown menu | Emitted by a text field | as simple menu | | | | | high (named), not found (metrics) |
| Action overflow menu | Emitted by the app bar overflow action | as simple menu; five items in the example | | | | | high |
| Contextual menu | Any | as simple menu; dynamic item set | | | | | high |

## 3. Anatomy

| Part | Description | Confidence |
|---|---|---|
| Sheet | Transient sheet of material at 8 dp elevation above all in-app elements. | high |
| Item | Single line of text; the row is the target. | high |
| Leading icon | Optional ("Menu items may also contain icons"); with a leading icon or check the text sits at a 72 dp keyline on mobile (measured in `components_listcontrols_menu1.png` and `menu2.png`: glyph 16 dp from the edge, text at 72 dp of a 360 dp menu). Desktop cascading: text at 64 px ("Menu sub-item left padding: 64px"). | moderate (mobile measurement), high (desktop) |
| Helper text, inline information | Keyboard shortcuts or similar, right aligned, never truncated (lists-controls page); 16 dp from the right edge in `menu2.png`; keyboard shortcuts drawn with glyphs in `items1.png`. | high |
| Check | Selection state glyph in the leading slot (multi-select menus); selection is made by another control. | high |
| Nested menu indicator | Right pointing triangle at the trailing edge; the sub menu flies out on hover, focus and/or selection. | high |
| Divider | 1 dp, 12% black or 12% white, full width of the menu, separating groups (`specs2.png`, `items1.png`, `items2.png`). Divider block height about 16 dp (8 dp above and below the line), measured in `specs4.png`. | high (divider), moderate (block height) |
| Subheader | Menu subheader tile 48 dp, Roboto Medium 14 sp, 16 dp from the left edge (subheaders page). | high |
| Scrollbar | Persistent when the content scrolls. | high |
| Selected item highlight | The currently selected item is highlighted when the menu opens over a list item (`simplemenus1.png` shows a grey row). | high |

## 4. Metrics and keylines

### 4.1 Mobile (simple menus)

| Metric | Value | Confidence |
|---|---|---|
| Item height | 48 dp | high |
| Text left padding | 16 dp | high |
| Text bottom padding | 20 dp (baseline to item bottom) | high |
| Menu top and bottom padding | 8 dp each | high |
| Typography | 16 sp default; 14 sp dense | high |
| Width unit (x) | 56 dp | high |
| Minimum width | 2 x 56 dp = 112 dp | high |
| Maximum width | 5 x 56 dp = 280 dp, portrait and landscape | high |
| Margin to screen edges | 16 dp phone; 24 dp tablet | high |
| Width rule | Varies with string length; defined as a multiple of 56 dp on mobile; text never wraps or truncates (use a simple dialog instead). | high |
| Maximum height | One or more rows less than the view height, so an outside tap area remains. | high |
| Contradiction | `specs2.png` is captioned "Menus of various widths: min width 1.5 x, 3x, 6x and 7x" (desktop examples drawn at the 64 px unit, 7x = 448 px); the text rule for mobile is min 2x and max 5x. Record both; implement 2x minimum on mobile. | high |

### 4.2 Desktop

| Metric | Default | Dense | Confidence |
|---|---|---|---|
| Item height | 32 px | 24 px | high |
| Text left padding | 24 px | 24 px | high |
| Top and bottom padding | 8 px | 4 px | high |
| Typography | 15 px | 13 px | high |
| Width unit | 64 px (`specs1-desktop.png`, `specs1-desktop-dense.png`: "desktop x= 64", "min-width = 2x", "width = 3x") | same | high |
| Desktop resting elevation | 2 dp below the listed value ("Desktop resting elevation is 2dp below the listed values", elevation page) | same | high |

### 4.3 Cascading menus (desktop only)

| Metric | Value | Confidence |
|---|---|---|
| Top padding | 16 px (bottom padding also 16 px in `specs4.png`) | high |
| Left padding | 24 px | high |
| Item height | 32 px | high |
| Menu item icon right padding | 32 px in the text; the `specs4.png` label at the trailing shortcut reads 24. Text wins; record the disagreement. | high (text), moderate (image) |
| Sub-item left padding | 64 px (text keyline inside a sub menu that has a check column) | high |
| Typography | 15 px; dense cascading menus may use 13 px | high |
| Width | 5x = 320 px in the redline (`specs4.png`: "tablet/desktop x= 64, width = 5x") | high |
| Sub menu placement | Flush with the parent menu's trailing edge; the sub menu's top edge aligns with the top of its parent item and its first item is pushed down by the 16 px top padding (`specs4.png`, `items1.png`). Position vertically and horizontally based on proximity to screen edges (text). | high (text rule), moderate (image reading) |
| Open trigger and delay | Opens on hover, focus and/or selection of the parent item (lists-controls page). Delay: not found. | high, not found |
| Nesting | Ideally one level. | high |

### 4.4 Type styles

| Element | Style | Size | Confidence |
|---|---|---|---|
| Menu item, mobile | Subheading (Regular 16 sp device) | 16 sp; dense 14 sp (Body 1 size) | high (sizes), moderate (style name) |
| Menu item, desktop | Subheading desktop (Regular 15 sp) | 15 px; dense 13 px (Body 1 desktop) | high |
| Inline information | Same style as the item, secondary color | | moderate |
| Subheader | Body 2 (Medium 14 sp) | 14 sp | high |
| 2016 wording | "15pt Roboto font" for single-line display | | high (older capture) |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Sheet | White surface (menu images); role not named | Dark surface | moderate |
| Item text | 87% black | 100% white | high (color page) |
| Disabled item text | 38% black (`items2.png` shows grey Redo, Cut, Copy, Forward) | 50% white | high |
| Inline information, helper text | 54% black | 70% white | moderate (observed; opacities from the color page) |
| Icons and nested indicator | 54% black active, 38% inactive | 100% / 50% white | high |
| Divider | 12% black | 12% white | high |
| Subheader | 54% black or primary color | not found | high (subheaders page) |
| Selected item | Grey highlight over the row (`simplemenus1.png`); the page gives no opacity. Buttons page: "Focused: 12% #000000 shade over the color" (both themes). | | moderate |
| Hover (desktop) | Grey row (`items1.png`, `specs3.png`); opacity not stated on this page or in the buttons page text. Memory of the 2014 spec: hover 20% #999999 (light), 15% #CCCCCC (dark). | | not found (spec), low (memory values) |

## 6. Elevation

| Part | Value | Confidence |
|---|---|---|
| Menu | 8 dp | high (elevation page) |
| Sub menu | 9 dp, plus 1 dp for each further sub menu | high |
| Desktop | Resting elevations are 2 dp below the listed values | high |
| Relative order | "Menus appear above all other in-app UI elements." | high |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Page | No durations, curves or transition pattern are given on the menus page. | high |
| Defaults (motion page) | Entering 225 ms, leaving 195 ms (mobile); desktop 150 to 200 ms; deceleration curve `cubic-bezier(0.0, 0.0, 0.2, 1)` for entering, acceleration curve `cubic-bezier(0.4, 0.0, 1, 1)` for leaving. | high |
| Pattern | Menu material expands from its origin at the emitting element (top start corner for a dropdown), items fade in as the sheet grows. | low |
| Sub menu | Flies out from the parent item on hover, focus or selection. | high |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Enabled | 87% black text on the sheet. | high |
| Disabled | Item kept in place at disabled text opacity (38% black, 50% white); not removed. | high |
| Hover (desktop) | Grey overlay on the row (`items1.png`). | high (shown), not found (opacity) |
| Focus | Not shown; keyboard focus highlight follows the hover rendering in Vuetify 1.5 (`--highlighted`). | not found |
| Pressed | Not shown on this page; ink ripple per the buttons page (40% #999999 light, 25% #CCCCCC dark). | moderate |
| Selected | Highlighted row when the menu opens over the current value; check glyph in multi-select menus. | high |
| Parent of an open sub menu | Row stays highlighted while its sub menu is open (`specs3.png`). | high |
| Error | not found | not found |

## 9. Behavior

| Rule | Spec | Confidence |
|---|---|---|
| Location | Appears above all other in-app elements. Positioned over the emitting element so that the currently selected item sits on top of it; never below the emitting element (simple menus). Never display a duplicate of the selected item. | high |
| Vertical realignment | Near a screen edge the whole menu is repositioned vertically so that all items are completely visible; the menu never clips. | high |
| Horizontal alignment | Always left aligned with the start of the list item text; never repositioned on the touch location. | high |
| Scrolling | Scrolls internally when taller than the available height; shows a persistent scroll bar; keep at least one row of the view free for the dismiss tap. | high |
| Dismissal | Tap outside the menu; tap the emitting button if visible; select an item (except multi-select menus with checkmarks); system Back cancels. | high |
| Selection | Choosing an option immediately commits the option and closes the menu. | high |
| Width | Multiple of 56 dp on mobile; 16 dp (phone) or 24 dp (tablet) screen margins; text never wraps. | high |
| Ordering | Most frequent first for static menus; dynamic ordering allowed. | high |
| Contextual | Items change with app state; irrelevant items removed, conditional ones disabled; single-item menus allowed. | high |
| Cascading | Desktop only; sub menus positioned by proximity to screen edges; one level ideally. | high |
| Platform note | "Implementations of this component may vary by platform. By using standard platform implementations, you will receive any related future improvements." | high |

## 10. Web notes

| Topic | Note |
|---|---|
| Units | dp and sp are px; the desktop values are already px. |
| Pattern, action menus | WAI-ARIA Menu and Menu Button patterns: the emitting control carries `aria-haspopup="menu"` and `aria-expanded`; the sheet is `role="menu"` with `menuitem`, `menuitemcheckbox` or `menuitemradio` children; sub menus are nested `role="menu"` opened from items with `aria-haspopup="menu"`. |
| Pattern, value pickers | A dropdown menu emitted by a text field is a select, not a menu: WAI-ARIA Select-Only Combobox pattern with a `listbox` popup; the "selected item over the field" positioning rule still applies. |
| Keyboard | The spec is silent; follow the pattern's keyboard section. The spec's "system Back" maps to Escape. |
| Positioning | Position against the viewport (fixed or top layer, popover API where available); compute the vertical offset so the selected item overlaps the emitter; when the menu would overflow, shift the entire menu vertically; never clip; keep 16 px (phone) or 24 px (tablet) margins. |
| Scrolling | `overflow-y: auto` on the sheet with an always visible scrollbar (`scrollbar-gutter: stable` plus visible track styling); max height is the viewport minus the margins and at least one item row. |
| Density | Select mobile (48 px) versus desktop (32 px, 24 px dense) metrics by an explicit density prop, not by viewport width. |
| Widths | Snap the sheet width up to the next multiple of 56 px (mobile) or 64 px (desktop); clamp to 112 px minimum and 280 px maximum on mobile. |
| Corner radius | Not stated on the page; Vuetify 1.5 uses 2 px, consistent with 2 dp card radius. Low confidence. |
| Cascading | Sub menu at the parent's trailing edge, flipped to the leading edge near the viewport edge, 9 dp shadow; open on hover with a short delay, on focus or on activation. |

## Vuetify 1.5 cross-check

Files: `_menus.styl`, `_lists.styl`, `_variables.styl`, `_elevations.styl`, `_theme.styl`, `VMenu.js`, `menu-keyable.js`, `menuable.js`, `delayable.ts`.

| Metric | Spec | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Elevation | 8 dp | `.v-menu__content { elevation(8) }` | match |
| Sub menu elevation | 9 dp (+1 per level) | no cascading menus | Vuetify gap |
| Item height, mobile | 48 dp | `VList` tile 48px | match |
| Item height, desktop and dense desktop | 32 px, 24 px | dense list tile 40px; no 32px or 24px variant | discrepancy |
| Text left padding | 16 dp mobile; 24 px desktop | tile `padding: 0 16px` | match (mobile), discrepancy (desktop) |
| Menu top and bottom padding | 8 dp; 4 px dense desktop | list `padding: 8px 0`; dense 4px | match |
| Type size | 16 sp mobile; 14 sp dense mobile; 15 px / 13 px desktop | 16px; dense 13px | match (mobile default), discrepancy (dense mobile 14 sp, desktop 15 px) |
| Minimum width | 112 dp mobile; 128 px desktop | `calculatedMinWidth`: `minWidth` prop, else the activator width plus `nudgeWidth` (plus 16 in `auto` mode), capped at page width minus 24 | discrepancy (activator-based) |
| Width unit | multiples of 56 dp | none | Vuetify gap |
| Maximum width | 280 dp mobile | `.v-menu__content { max-width: 80% }`; `maxWidth` prop default `auto` | discrepancy |
| Screen margins | 16 dp phone, 24 dp tablet | overflow correction `top = pageYOffset + 12` (12 px) | discrepancy |
| Maximum height | at least one row less than the view | `maxHeight` default `auto`; `auto` mode forces 200px | discrepancy |
| Selected item over the emitter | required for simple menus | `auto` prop aligns the active tile over the activator (`calcTopAuto`); default placement overlaps the activator top unless `offsetY` | match (with `auto`) |
| Never clip, vertical realign | required | `menuable` flips above when `activator.top > contentHeight`, otherwise shifts to `pageYOffset + 12`; `allowOverflow` disables | match |
| Dismissal | outside tap, emitter tap, selection, Back | `closeOnClick` and `closeOnContentClick` default true; Escape and Tab close (`menu-keyable`) | match |
| Keyboard | not in spec | Up and Down move `listIndex`, Enter activates | Vuetify-only (consistent with the WAI-ARIA Menu pattern) |
| Open and close delay | not found | `openDelay`, `closeDelay` default 0 | not verified |
| Corner radius | not found | `border-radius: 2px` | Vuetify-only value |
| Transition | not found (defaults 225 ms in, 195 ms out) | `v-menu-transition`: opacity, `all .3s cubic-bezier(.25,.8,.25,1)`, tiles get a `.1s` delay; `auto` mode slides tiles from `translateY(-15px)`; `origin` default `top left` | discrepancy (300 ms both ways, non-spec curve) |
| Scrollbar | persistent | `overflow-y: auto` (browser default scrollbar) | approximation |
| Hover | grey row (opacity not stated) | `.v-list__tile--link:hover`, `--highlighted`: `rgba(0,0,0,.04)` light, `rgba(255,255,255,.08)` dark | Vuetify-only value |
| Disabled item | 38% black text | `.v-list--disabled`, `$material.text.disabled: rgba(0,0,0,.38)` | match |
| Divider | 1 dp, 12% | `.v-divider` 1px, `$material.dividers: rgba(0,0,0,.12)` | match |
| Subheader in menu | 48 dp, Medium 14 sp, 16 dp | `.v-subheader` 48px, 14px/500, `padding: 0 16px` | match |
| Inline information | item size, secondary color | `.v-list__tile__action-text` 12px grey | discrepancy |
