# Subheaders (Material Design 1)

## Sources

- Spec page: https://m1.material.io/components/subheaders.html (the MD1 guidelines Google hosts as an archive; fetched 2026-10-22).
- Spec sheets read visually and measured in pixels; sheets render at 2 px per dp. Base URL `https://storage.googleapis.com/material-io-design/m1/assets/`:
  - `0B0iWdZjcphyMd2E2RlgwQlVoRjg/components-subheaders1.png` (list subheader specs)
  - `0Bx4BSt6jniD7OWVYZFY4N3lGRGs/components-subheaders3.png` (list subheader aligned with text content next to a FAB)
  - `0Bx4BSt6jniD7OFRBazBRbDdUMEk/components-subheaders5.png` (grid subheader specs)
  - `0Bx4BSt6jniD7SUN5WmF5TkJZWGs/components-subheaders7.png` (menu subheader specs)
  - `0B6Okdz75tqQsQXMyemJSQVhMem8/components-subheaders2.png`, `0B6Okdz75tqQsMEtuWm42b2lSRkk/components-subheaders4.png`, `0B6Okdz75tqQsNTJaelA2bmpUSzQ/components-subheaders8.png` (examples: inbox, files app with primary-colored subheaders, navigation drawer)
- Vuetify 1.5.24: `packages/vuetify/src/stylus/components/_subheaders.styl`, `settings/_variables.styl` (`$list-*`, `$subheader-*`, `$headings.body-2`), `settings/_theme.styl` (`text.secondary`).

Confidence: `high` = page text or sheet callout; `moderate` = measured from a sheet or Vuetify 1.5 stylus; `low` = memory.

## 1. Purpose and usage

| Rule | Confidence |
|---|---|
| Subheaders are list tiles that delineate sections of a list or grid list. | high |
| They may be displayed inline with tiles or associated with content; they are typically related to filtering or sorting criteria. | high |
| Upon scrolling, subheaders remain pinned to the top of the screen until pushed off screen by the next subheader. | high |
| In long lists of complex information, consider colored subheaders to delineate content (Android settings is the example). | high |
| Alignment: left-align the subheader with the avatar or icon in a list, unless a promoted action occupies that space. With a floating action button left-aligned with the avatar or icon, align the subheader with the text content. | high |

## 2. Types and variants

| Type | Tile height | Font | Left keyline | Confidence |
|---|---|---|---|---|
| List subheader | 48 dp | Roboto Medium 14 sp | 16 dp (avatar keyline); 72 dp when a left-aligned FAB occupies the avatar column | high |
| Grid subheader | 48 dp | Roboto Medium 14 sp | 16 dp from the left edge | high |
| Menu subheader | 48 dp | Roboto Medium 14 sp | 16 dp from the left edge | high |
| Dense or compact variant | not found | | | high (absence) |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Tile | 48 dp row, no fill of its own (inherits the list or menu surface) | high |
| Text | one line, Roboto Medium 14 sp (Body 2), vertically centered in the tile (sheet) | high (style), moderate (centering) |
| Divider | not part of the subheader; the files example shows a full-bleed divider between the "Folders" and "Files" sections placed above the second subheader, inset to the 72 dp text keyline | moderate (example only) |

## 4. Metrics and keylines

| Metric | Value | Confidence |
|---|---|---|
| Tile height, list | 48 dp | high |
| Tile height, grid | 48 dp | high |
| Tile height, menu | 48 dp | high |
| Left padding, list | 16 dp | high |
| Left padding, grid | 16 dp | high |
| Left padding, menu | 16 dp | high |
| Inset keyline (with left-aligned FAB) | 72 dp; "Floating action button tile width: 72dp" | high |
| Right padding | not found (Vuetify 1.5 uses 16 px) | moderate |
| Text style | Roboto Medium 14 sp = Body 2 | high |
| Text vertical position | centered in the 48 dp tile (sheets 1, 3, 5, 7) | moderate |
| Text color | 54 % black (#757575 measured on the sheets) or the app primary color | high |
| Pinned subheader height | same 48 dp tile | high |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Text, grey variant | secondary text, 54 % black (#757575 on white) | not found on the page; Vuetify 1.5 uses 70 % white | high (light), moderate (dark) |
| Text, colored variant | the app primary color (files example: Light Blue 500 on #FAFAFA) | not found | high |
| Background | none (list or menu surface) | | high |
| Disabled, hover, pressed | not applicable | | high (absence) |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Resting | 0 dp (sits on the list surface) | moderate (no value stated; sheets show none) |
| Pinned while scrolling | not found (no shadow drawn in the sheets) | high (absence) |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Pin and push | the pinned subheader is pushed off screen by the next subheader while scrolling | high |
| Durations and easing | not applicable (scroll-driven) | high |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Normal | static text tile | high |
| Hover, focus, pressed, disabled, selected | not found; the subheader is not interactive | high (absence) |

## 9. Behavior

| Rule | Confidence |
|---|---|
| Pinned to the top on scroll until the next subheader pushes it off. | high |
| One subheader per section; sections are filtering or sorting groups. | high |
| Dividers with subheaders: rules not on this page (the files example uses a divider between sections). See the lists and dividers notes. | high (absence) |

## 10. Web notes

- Maps 1:1: 48 dp tile, 16 dp and 72 dp keylines, 14 sp Medium, 54 % or primary color.
- Pin and push is `position: sticky; top: 0` on the subheader inside the scroll container; each sticky subheader is pushed by the next one when both share the same scrolling parent.
- The 72 dp inset is a layout decision driven by the presence of a left-aligned FAB; expose it as an `inset` variant rather than detecting the FAB.
- WAI-ARIA: a list subheader is a heading for its group (render as a heading element, or `role="heading"` with `aria-level`, inside the list as a presentational item); a menu subheader labels a `role="group"` of menu items through `aria-labelledby` (WAI-ARIA Menu pattern, grouped items); a listbox section uses the same `role="group"` with `aria-labelledby` (Listbox pattern). The spec says nothing about keyboard; the subheader itself is never focusable.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 | Agree |
|---|---|---|---|
| Tile height | 48 dp | `.v-subheader` height `$list-item-single-height` = 48px | yes |
| Font size | 14 sp | `$headings.body-2.size` = 14px | yes |
| Font weight | Medium | `$headings.body-2.weight` = 500 | yes |
| Left padding | 16 dp | `padding: 0 $list-right-padding 0 $list-left-padding` = 0 16px 0 16px | yes |
| Right padding | not found | 16px | n/a |
| Inset keyline | 72 dp | `--inset` margin-left `$subheader-inset-margin` = `$list-item-right-margin` = 56px, plus 16px padding = 72px | yes |
| Text color, light | 54 % black | `$material-light.text.secondary` = rgba(0,0,0,.54) | yes |
| Text color, dark | not found | `$material-dark.text.secondary` = rgba(255,255,255,.70) | n/a |
| Primary-colored variant | app primary | no built-in; color classes apply | n/a |
| Pinned on scroll | yes | not implemented in stylus | missing |
| Dense | not found | `$list-dense-subheader-height` = 40px (not applied in `_subheaders.styl` itself) | Vuetify extra |
| Unused variables | | `$subheader-height-font-size` (14px) and `$subheader-font-weight` (500) exist but `.v-subheader` reads `$headings.body-2` (same values) | n/a |
