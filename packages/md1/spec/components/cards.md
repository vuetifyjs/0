# Cards (Material Design 1)

Spec page: Components > Cards. Covers the card, card collections, content blocks (header, primary title, rich media, supporting text, actions), content block combinations, expansion, dividers, elevation, and gestures.

## Sources

| Tag | URL | Copy read | Used for |
|---|---|---|---|
| A18 | https://m1.material.io/components/cards.html | 2018-12-25 00:22:55 UTC | primary, authoritative |
| G16 | the 2016 revision of the guidelines page `components/cards` | 2016-06-04 06:15:21 UTC | version cross-check only |
| ELEV | https://m1.material.io/material-design/elevation-shadows.html | 2018-12-25 00:22:55 UTC | resting and raised elevation |
| MOTION | https://m1.material.io/motion/duration-easing.html | 2018-12-25 00:22:55 UTC | durations and curves |
| COLOR | https://m1.material.io/style/color.html | 2018-12-25 00:22:55 UTC | text opacities, theme surfaces |
| KEY | https://m1.material.io/layout/metrics-keylines.html | 2018-12-25 00:22:55 UTC | 24dp tablet keyline, card paddings in templates, aspect ratios |
| V15 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_cards.styl`, `_sheet.styl`, `settings/_variables.styl`, `settings/_theme.styl`, `settings/_elevations.styl`, `components/VCard/VCard.ts`, `VCardTitle.ts`, `VCardMedia.ts` | Vuetify 1.5.24 | cross-check |

Fetch notes: fetched with `curl -sL` over HTTPS; text extracted from static HTML. Redline images carry no alt text; image-only values are recorded as `not found`.

Confidence legend: `high` = read from the spec page text; `moderate` = from Vuetify 1.5 stylus only; `low` = memory.

## 1. Purpose and usage

- A card is a sheet of material that serves as an entry point to more detailed information. Cards may contain a photo, text, and a link about a single subject and may display content of varying size (photos with captions of variable length). A card collection is a layout of cards on the same plane (coplanar). (A18, high)
- Use a card layout when the content, as a collection, comprises multiple data types (images, movies, text); does not require direct comparison; supports highly variable length (comments); contains interactive content (+1 buttons, comments); or would otherwise be in a grid list but needs more content to supplement the image. (A18, high)
- Do not use cards for homogeneous content that is quickly scannable (use a list), for a gallery of images (use grid tiles), or for list items that are not dismissible. (A18, high)
- Card versus tile: cards have rounded corners, can have multiple actions, and can be dismissible and rearranged. Tiles have square corners and no more than two actions. (A18, high)
- Cards are entry points: do not overload them with extraneous information or actions; inline links within text content are strongly discouraged. (A18, high)
- Content hierarchy: place primary content at the top or emphasize it with typography. Image size and placement depend on whether images are primary or supplemental. Text on image backgrounds must preserve legibility; a solid background with sufficient contrast is preferred. (A18, high)

## 2. Types and variants

| Variant | Definition | Confidence |
|---|---|---|
| Card | Single sheet, constant width, variable height | high |
| Card collection | Coplanar layout of cards; sorted or filtered programmatically; scrolls vertically only | high |
| Expandable card | Card that expands in place to reveal more content without scrolling; may exceed the view's maximum height after expansion and then scrolls with the collection | high |
| Desktop card | Resting elevation 0dp, 8dp on hover; may expand and scroll internally | high |
| Card with UI controls | Slider, stars, segmented buttons, or tabs placed inline in the action area block modify the primary content | high |
| Card with overflow menu | Overflow menu in the upper-right corner (or lower-right when it improves layout) | high |
| Card with dividers | Full-bleed dividers denote expansion seams or distinct separation; inset dividers separate related content | high |
| Content block combinations | Thirteen illustrated combinations with their metrics (section 4) | high |

## 3. Anatomy

| Part | Spec name | Notes | Confidence |
|---|---|---|---|
| Container | Card | Rounded corners (value not stated in text), 2dp resting | high (shape), high (absence of radius value) |
| Optional header | Avatar, Title, and Subtitle area | 72dp tall | high |
| Primary title | Primary title / primary text | 24sp or 14sp title; 14sp subtitle | high |
| Rich media | Media area | 16:9 or 1:1 recommended; inset media in 80dp increments | high |
| Supporting text | Supporting text | 14sp | high |
| Actions | Action button row | Supplemental actions as icons, text, and UI controls, typically at the bottom; limit two plus an overflow menu | high |
| Overflow menu | Overflow menu (optional) | Upper-right, or lower-right | high |
| UI controls | Action area block | Slider, stars, segmented button, tabs | high |
| Expanded supporting text | Expanded supporting text | Revealed on expansion | high |
| Dividers | Full-bleed or inset | Seams and separation | high |
| Subtitle | Subtitle | Top padding 12dp in one combination | high |

## 4. Metrics and keylines

General metrics:

| Metric | Value | Mobile | Tablet / desktop | Source | Confidence |
|---|---|---|---|---|---|
| Width | Constant per collection | | | A18 | high |
| Height | Variable; maximum limited to the available space on the platform; may temporarily expand | | | A18 | high |
| Corner radius | Rounded corners; value not stated in page text | | | A18 | high (absence of value) |
| Corner radius, Vuetify | 2px (`$card-border-radius`, applied through `.v-sheet` `$sheet-border-radius`) | | | V15 | moderate |
| Corner radius, memory | 2dp | | | | low |
| Horizontal keyline for content | 16dp left and right | 16dp | 24dp keyline | A18 | high |
| Primary title top padding | 24dp | | | A18 | high |
| Primary title bottom padding | 16dp | | | A18 | high |
| Title/text block top padding | 16dp, or 24dp when a large primary title is present | | | A18 | high |
| Title/text block bottom padding | 16dp if there are additional actions or supporting text, else 24dp | | | A18 | high |
| Title | 24sp or 14sp | | | A18 | high |
| Subtitle | 14sp | | | A18 | high |
| Subtitle top padding | 12dp (combination with primary text, subtitle, subtext) | | | A18 | high |
| Supporting text | 14sp | | | A18 | high |
| Supporting text top padding | 16dp | | | A18 | high |
| Supporting text bottom padding | 24dp, or 16dp if there are additional actions or text below | | | A18 | high |
| Expanded supporting text | 14sp; top padding 16dp; bottom padding 24dp; left and right 16dp | | | A18 | high |
| Action button row padding | 8dp | | | A18 | high |
| Padding between actions | 4dp (header plus media plus actions combination) | | | A18 | high |
| Actions all-around padding with 3x media | 8dp + 16dp | | | A18 | high |
| Rich media aspect ratio | 16:9 or 1:1 recommended | | | A18 | high |
| Inset media area base | 80dp (1x) with 16dp top padding | | | A18 | high |
| Inset media increments | 1x, 1.5x, 2x, 3x of the 80dp base; 3x has 16dp padding on all sides | | | A18 | high |
| Inset media increments (2016 text) | 3/8x, 1x, 2x, 3x (no 80dp base stated) | | | G16 | high (superseded) |
| Header (avatar, title, subtitle) height | 72dp; left and right padding 16dp; top and bottom padding 16dp | | | A18 | high |
| Avatar size in header | not found (72dp row with 16dp paddings implies 40dp; KEY lists avatar 40dp with a 48dp touch target) | | | A18, KEY | high (absence), interpretation |
| Elements allowed outside the 16dp padding | Bullet points (not their text), images, and buttons | | | A18 | high |
| Collection: screen edge to card | 8dp | 8dp | 8dp, 16dp, 24dp, or 40dp | A18 | high |
| Collection: space between cards | 8dp | 8dp | 8dp, 16dp, 24dp, or 40dp; margins and gutters need not be equal (40dp margins with 24dp gutters) | A18 | high |
| Grid | Margins and gutters follow the 8dp grid | | | A18, KEY | high |
| Tablet template: card left and right padding | | | 24dp (list with detail view); 32dp in the second template | KEY | high |
| Tablet template: card content left padding | | | 104dp (list with detail view) | KEY | high |
| Supplemental action limit | Two actions plus an overflow menu | | | A18 | high |

Content block combinations as listed on the page (values in dp or sp):

| Combination | Blocks and metrics | Confidence |
|---|---|---|
| 1 | Media 16:9; supporting text 14sp, left and right 16, top 16 or 24 (with primary title), bottom 16 (with actions or text below) or 24 | high |
| 2 | Header 72 tall (16 all sides); media 16:9; supporting text 14sp, 16 all sides; actions padding 8 | high |
| 3 | Header 72 tall (16 all sides); media 16:9; actions padding 8, padding between actions 4 | high |
| 4 | Media 16:9; primary text 24sp top 24 bottom 16 sides 16; subtext 14sp bottom 16 sides 16; actions 8 | high |
| 5 | Combination 4 plus expanded supporting text 14sp top 16 bottom 24 sides 16 | high |
| 6 | Primary text 24sp top 24 bottom 16 sides 16; subtitle top 12 sides 16; subtext 14sp bottom 16 sides 16; supporting text 14sp top 16 bottom 16 sides 16; actions 8 | high |
| 7 | Media 16:9; actions 8 | high |
| 8 | Media 1:1; primary text 24sp top 24 sides 16; subtext 14sp bottom 16 sides 16; actions 8 | high |
| 9 | Media 1:1; primary text 24sp; actions 8 | high |
| 10 | Media 80 (1x) top padding 16; primary text 24sp top 24 sides 16; subtext 14sp sides 16; actions 8 | high |
| 11 | Media 1.5x (increment on the 80 base) top padding 16; same text and actions as 10 | high |
| 12 | Media 2x top padding 16; same text and actions as 10 | high |
| 13 | Media 3x padding 16; actions all-around 8 + 16 | high |

Type styles: 24sp title maps to Headline; 14sp title, subtitle, subtext, and supporting text map to Body 1 (14sp Regular); supporting text and actions follow the Button style for text buttons. (values high from A18; style name mapping low, confirm against the Typography note)

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Card surface | "Cards/Dialogs" theme surface; hex not in page text | "Cards/Dialogs" theme surface; hex not in page text | COLOR | high (role), absence of hex |
| Card surface, Vuetify | #FFFFFF (`$material-light.cards`) | #424242 (grey darken-3, `$material-dark.cards`) | V15 | moderate |
| Primary text | 87% #000000 | 100% #FFFFFF | COLOR | high |
| Secondary text (subtitle, supporting) | 54% #000000 | 70% #FFFFFF | COLOR | high |
| Disabled or hint text | 38% #000000 | 50% #FFFFFF | COLOR | high |
| Dividers | 12% #000000 | 12% #FFFFFF | COLOR | high |
| Icons (overflow, action icons) | Active 54% #000000, inactive 38% #000000 | Active 100% #FFFFFF, inactive 50% #FFFFFF | COLOR | high |
| Action text buttons | Accent or primary colored text (flat buttons; see `buttons.md`) | same | COLOR | high |
| Text on image backgrounds | Must preserve legibility; prefer a solid background with sufficient contrast | same | A18 | high |

## 6. Elevation

| State | Mobile | Desktop | Source | Confidence |
|---|---|---|---|---|
| Resting | 2dp | 0dp | A18, ELEV | high |
| Raised (picked up) | 8dp | 8dp | A18, ELEV | high |
| Hover | not applicable | 8dp | A18 | high |
| Pressed | not found | not found | A18 | high (absence) |
| Focused | not found | not found | A18 | high (absence) |
| Expanded | not found (expansion is a height change, not an elevation change) | not found | A18 | high (absence) |

## 7. Motion

| Transition | Pattern | Duration | Easing | Source | Confidence |
|---|---|---|---|---|---|
| Expand | Card expands in place to reveal more content; full-width dividers mark the seam; no internal scrolling on mobile | not found | not found | A18 | high (pattern) |
| Pick up and move | Card lifts to 8dp and moves with the pointer; used for sorting within a collection | not found | not found | A18, ELEV | high |
| Swipe | Per-card dismissal or action; only one swipe surface per card | not found | not found | A18 | high |
| Hover (desktop) | Elevation 0dp to 8dp | not found | not found | A18 | high |
| Generic guidance | Mobile 300ms typical; entering 225ms; leaving 195ms; desktop 150ms to 200ms | | Standard curve cubic-bezier(0.4, 0.0, 0.2, 1) for growing and shrinking material | MOTION | high |
| Vuetify 1.5 hover | box-shadow transition | 400ms | cubic-bezier(0.25, 0.8, 0.25, 1) | V15 | moderate |
| Vuetify 1.5 sheet | all properties | 300ms | cubic-bezier(0.25, 0.8, 0.5, 1) | V15 | moderate |

## 8. States

| State | Rendering | Source | Confidence |
|---|---|---|---|
| Resting | 2dp (mobile), 0dp (desktop) | A18 | high |
| Hover (desktop) | 8dp | A18 | high |
| Picked up | 8dp | ELEV | high |
| Focus | Focus traverses every focusable element inside a card before moving to the next card; a card used with D-pad or keyboard navigation has either a primary action or opens a new view with primary and supplemental actions; focus ring rendering not found | A18 | high (behavior), absence of visual |
| Pressed | not found (ripple on the primary action is implied by the button spec) | A18 | high (absence) |
| Expanded | Taller card; may exceed the view's maximum height and then scrolls with the collection | A18 | high |
| Truncated | Content exceeding the maximum card height is truncated and does not scroll | A18 | high |
| Disabled, selected, error | not found | A18 | high (absence) |
| Overlay opacities | not found on this page; card actions follow `buttons.md` | A18 | high (absence) |

## 9. Behavior

- Constant width, variable height; maximum height is the available space but it can temporarily expand (to show a comment field). Cards do not flip over to reveal information on the back. (A18, high)
- Gestures must be consistent within a collection. Swipe may be used per card; limit swipe gestures so they do not overlap (a swipeable card must not contain a swipeable image carousel). Pick-up-and-move may be used when sorting matters; consider filtering or sorting instead. (A18, high)
- Sorting and filtering are programmatic (date, file size, alphabetical, other parameters). The first item is at the top left; order proceeds left to right, then top to bottom. (A18, high)
- Scrolling: card collections scroll vertically only. Overflowing card content is truncated, not scrolled; the card can be expanded. On mobile, avoid scrollable space within a card (two scroll bars). On desktop, card content can expand and scroll internally. (A18, high)
- Actions: the primary action is typically the card itself. Supplemental actions vary per card but are positioned consistently; limit them to two plus an overflow menu; UI controls inline with primary content may modify the view (slider for a day, stars for rating, segmented button for a date range, tabs). (A18, high)
- Overflow menu: upper-right by default, lower-right when it improves layout; do not overload it. (A18, high)
- Dividers: full-width dividers for expandable areas and for distinct visual separation; inset dividers to separate related content. (A18, high)
- Dismissal: cards can be dismissible (swipe); list items that are not dismissible should not be cards. (A18, high)
- Elevation interference: the FAB disappears or moves before a card is picked up; the FAB should sit to one side of a stream of cards. (ELEV, high)

## 10. Web notes

- Maps 1:1: paddings (16, 24, 8, 4), the 72px header, 8px collection gutters, elevation shadows for 2dp and 8dp, 16:9 and 1:1 media via CSS `aspect-ratio`, the 24px tablet keyline via a breakpoint.
- Corner radius is not stated in the page text (only "rounded corners"); 2px is the Vuetify 1.5 value and the remembered spec value. Treat 2px as the working value and flag it in `SPEC.md`. (moderate)
- Desktop rule (0dp resting, 8dp hover) is a pointer-type concern; implement as a variant or a hover-capable media query rather than a user-agent sniff. (interpretation)
- Expand: height animation with the standard curve; truncation via `overflow: hidden` on the content block; collapsed content must remain reachable by keyboard after expansion (focus moves to the revealed supplemental action per the spec figure). (interpretation)
- Swipe and pick-up-and-move are pointer gestures with no ARIA equivalent; provide button alternatives (dismiss, move up, move down). (interpretation)
- WAI-ARIA patterns to follow (names only): the card itself has no APG pattern; render it as a sectioning element (`article` for independent items, `section` with a heading otherwise) whose primary action is a link or an APG "Button". Action row: APG "Button" and "Toolbar" when actions are grouped. Overflow menu: APG "Menu Button". Expandable section: APG "Disclosure". Inline UI controls: their own patterns (Slider, Tabs, Radio Group for segmented selection). Card is purely presentational in v0 terms: render semantic elements or v0's `Atom`; do not invent a behavioral primitive. (pattern names: high; v0 mapping per DESIGN_SYSTEMS.md ruling 2)

## Vuetify 1.5 cross-check

Files: `_cards.styl`, `_sheet.styl`, `settings/_variables.styl`, `settings/_theme.styl`, `VCard.ts`, `VCardTitle.ts`, `VCardMedia.ts`.

| Metric | Spec (A18 / ELEV / COLOR) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Resting elevation | 2dp | `elevation(2)` | match |
| Raised or hover elevation | 8dp | `.v-card--hover:hover` `elevation(8)` (opt-in prop) | match when `hover` is set |
| Desktop resting | 0dp | `.v-card--flat` `elevation(0)` (opt-in prop), not tied to desktop | partial |
| Corner radius | rounded, value not found | 2px via `.v-sheet` | Vuetify value |
| Title padding | 16dp sides; top 24dp for a large primary title; bottom 16dp | `.v-card__title` padding 16px; `--primary` padding-top 24px | match |
| Text padding | top 16dp; bottom 24dp when last, else 16dp; sides 16dp | `.v-card__text` padding 16px all sides | discrepancy: bottom 24px when nothing follows is missing |
| Tablet keyline | 24dp | none | gap |
| Actions padding | 8dp | `.v-card__actions` padding 8px | match |
| Gap between actions | 4dp (one combination) | `.v-btn + .v-btn` margin-left 8px | discrepancy |
| Header (avatar, title, subtitle) | 72dp | no component (`v-card-title` with `v-avatar` composed by the author) | gap |
| Media aspect ratio | 16:9 or 1:1 | `v-card-media` deprecated in favor of `v-img` with `aspect-ratio` prop; no default | partial |
| Inset media increments | 80dp base, 1x to 3x | none | gap |
| Expandable card | expand in place | none (`v-expand-transition` composed by the author) | gap |
| Hover transition | not found | 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) box-shadow | Vuetify-only |
| Surface color | role only (Cards/Dialogs) | #FFFFFF light, #424242 dark | Vuetify value |
| Text color | 87% black / 100% white | `$material.text.primary` rgba(0,0,0,0.87) / #FFFFFF | match |
| Child corner clipping | not found | first and last child inherit the card radius unless they are `.v-btn` or `.v-chip` | Vuetify-only |
| Collection gutters | 8dp mobile | none (grid system composed by the author) | gap |
| Swipe, pick-up-and-move | described | none | gap |
