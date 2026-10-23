# Chips (Material Design 1)

Spec page: Components > Chips. Covers chips with text, chips with text and an icon, deletable and non-deletable chips, and contact chips (closed and open).

## Sources

| Tag | URL | Copy read | Used for |
|---|---|---|---|
| A18 | https://m1.material.io/components/chips.html | 2018-12-25 00:22:55 UTC | primary, authoritative |
| L18 | the 2018 live guidelines page `components/chips` | 2018-02-23 14:04:11 UTC | cross-check; text identical to A18 |
| G16 | the 2016 revision of the guidelines page `components/chips` | 2016-06-04 06:15:21 UTC | cross-check; text identical to A18 apart from punctuation |
| ELEV | https://m1.material.io/material-design/elevation-shadows.html | 2018-12-25 00:22:55 UTC | elevation context (chips are not in the component table) |
| MOTION | https://m1.material.io/motion/duration-easing.html | 2018-12-25 00:22:55 UTC | durations and curves |
| COLOR | https://m1.material.io/style/color.html | 2018-12-25 00:22:55 UTC | text and icon opacities, grey palette |
| KEY | https://m1.material.io/layout/metrics-keylines.html | 2018-12-25 00:22:55 UTC | touch targets |
| V15 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_chips.styl`, `settings/_variables.styl`, `settings/_theme.styl`, `components/VChip/VChip.ts`, `components/Vuetify/mixins/icons.ts` | Vuetify 1.5.24 | cross-check |

Fetch notes: fetched with `curl -sL` over HTTPS; text extracted from static HTML. The chips page is short (about 3.5k characters of text in all three revisions); most visual values live in redline images with no alt text and are recorded as `not found`.

Confidence legend: `high` = read from the spec page text; `moderate` = from Vuetify 1.5 stylus only; `low` = memory.

## 1. Purpose and usage

- Chips represent complex entities in small blocks, such as a contact. A chip may contain entities such as a photo, text, rules, an icon, or a contact; typically a photo, short title, and brief information. (A18, high)
- Chips can be used for free form text, predefined text, rules, or contacts, and may contain icons. (A18, high)
- Contact chips represent contact information compactly. They are invoked and inserted into a text field (usually the "To" field) when the user starts typing a contact's name, sees the contact's addresses, and selects the correct one; they can also be added directly to a text field from a menu of contacts. They confirm that the message goes to the correct person. (A18, high)

## 2. Types and variants

| Type | Definition | Own metrics | Confidence |
|---|---|---|---|
| Chip with text | Text label only | 32dp tall; label 13sp; 12dp side padding | high |
| Chip with text and an icon | Text label with a leading icon | Icon size and padding not found | high (type), high (absence) |
| Deletable chip | Displays a delete (remove) icon | Remove icon 24dp x 24dp, 54% black, 4dp margin; label left padding 12dp | high |
| Non-deletable chip | No delete icon | Label left and right padding 12dp | high |
| Contact chip, closed | Photo plus name inside a text field | 32dp tall; label left 8dp, right 12dp; name 14sp | high |
| Contact chip, open | Expanded to show alternative addresses | Name 16sp; address 14sp; 8dp elevation | high |
| Contact chip, focused and activated | In-field focused state | 40dp tall; top and bottom padding 16dp | high |
| Input chip | Not a named MD1 type. Chips inserted into a text field are the contact chip case above. | n/a | high (absence) |
| Choice, filter, action chips | Not in MD1 (later Material terms) | n/a | high (absence) |
| Small, outline, label (square) chips | Not in MD1 (Vuetify 1.5 additions) | n/a | moderate |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Container | 32dp tall, pill shaped (radius value not stated in text) | high (height), high (absence of radius) |
| Label | 13sp Roboto Regular, 87% black | high |
| Photo or avatar | Contact chips; size not stated in text | high (absence) |
| Icon | Chips with text and an icon; size not stated | high (absence) |
| Remove (delete) icon | 24dp x 24dp, 54% black, 4dp margin; persistent on desktop | high |
| Open contact chip body | Contact name 16sp plus address rows 14sp; the top field is activated and focused by default | high |

## 4. Metrics and keylines

| Metric | Value | Type | Source | Confidence |
|---|---|---|---|---|
| Height | 32dp | All single-line chips, closed contact chip | A18 | high |
| Label | 13sp Roboto Regular | Chips with text | A18 | high |
| Label left and right padding | 12dp | Non-deletable chip | A18 | high |
| Label left padding | 12dp | Deletable chip | A18 | high |
| Remove icon size | 24dp x 24dp | Deletable chip | A18 | high |
| Remove icon margin | 4dp | Deletable chip | A18 | high |
| Remove icon visibility | Persistent on desktop | Deletable chip | A18 | high |
| Contact chip height | 32dp | Closed contact chip | A18 | high |
| Contact chip label left padding | 8dp | Closed contact chip | A18 | high |
| Contact chip label right padding | 12dp | Closed contact chip | A18 | high |
| Contact chip title padding | Top, bottom, and left 8dp; right 12dp | Closed contact chip keyline | A18 | high |
| Contact name text, closed | Roboto Regular 14sp | Closed contact chip | A18 | high |
| Contact name text, open | Roboto Regular 16sp | Open contact chip | A18 | high |
| Address text, open | Roboto Regular 14sp | Open contact chip | A18 | high |
| Focused and activated contact chip height | 40dp | In text field | A18 | high |
| Focused and activated contact chip top and bottom padding | 16dp | In text field | A18 | high |
| Unfocused contact chip top and bottom padding | 20dp | In text field | A18 | high |
| Corner radius | not found in text (pill shape in figures) | All | A18 | high (absence) |
| Corner radius, Vuetify | 28px on a 32px chip, which renders as a full pill (equivalent to a 16px radius) | All | V15 | moderate |
| Avatar size | not found in text | Contact chip | A18 | high (absence) |
| Avatar size, Vuetify | 32px (equal to the chip height), offset 12px into the left padding, 8px gap to the label | Contact chip | V15 | moderate |
| Leading icon size and gap | not found | Chip with icon | A18 | high (absence) |
| Spacing between chips | not found | All | A18 | high (absence) |
| Spacing between chips, Vuetify | 4px margin on every side | All | V15 | moderate |
| Touch target | 48dp minimum (the 32dp chip needs an extended hit area) | All | KEY | high (rule), interpretation |
| Open contact chip width and row height | not found | Open contact chip | A18 | high (absence) |

Type styles: the 13sp label is not a named MD1 style (Caption is 12sp, Body 1 is 14sp); the closed contact name at 14sp maps to Body 1; the open contact name at 16sp maps to Subheading; address rows at 14sp map to Body 1. (values high; style name mapping low, confirm against the Typography note)

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Label | 87% #000000 | not found (COLOR primary text on dark is 100% #FFFFFF) | A18, COLOR | high |
| Remove icon | 54% #000000 | not found (COLOR active icon on dark is 100% #FFFFFF) | A18, COLOR | high |
| Container background | not found in text | not found | A18 | high (absence) |
| Container background, Vuetify | #E0E0E0 (grey lighten-2, grey 300 in the MD palette) | #555555 | V15 | moderate |
| Container background, memory | #E0E0E0 (grey 300) | not found | | low |
| Hover and pressed overlays | not found | not found | A18 | high (absence) |
| Focus and selected, Vuetify | 2dp shadow plus currentColor overlay at 13% | same | V15 | moderate |
| Disabled | not found | not found | A18 | high (absence) |
| Disabled, Vuetify | text rgba(0,0,0,0.38) | rgba(255,255,255,0.5) | V15 | moderate |
| Remove icon hover, Vuetify | opacity 0.5 at rest, 1 on hover | same | V15 | moderate |

## 6. Elevation

| State | Value | Source | Confidence |
|---|---|---|---|
| Resting | not stated; chips are absent from the component elevation table, which implies 0dp (flat, printed on the surface) | A18, ELEV | high (absence); 0dp is interpretation |
| Focused contact chip | 2dp ("Upon focus, the chip rises to an elevation of 2dp") | A18 | high |
| Open contact chip | 8dp | A18 | high |
| Pressed | not found | A18 | high (absence) |
| Hover | not found | A18 | high (absence) |
| Vuetify focus, active, selected | 2dp | V15 | moderate |

## 7. Motion

| Transition | Pattern | Duration | Easing | Source | Confidence |
|---|---|---|---|---|---|
| Focus | Chip rises to 2dp | not found | not found | A18 | high (pattern) |
| Press (contact chip) | Expands to show alternative addresses for the contact (open state at 8dp) | not found | not found | A18 | high |
| Press (open contact chip) | Closes automatically | not found | not found | A18 | high |
| Open (any chip) | Touch opens a full detail view (card or full screen) or a menu of options | not found | not found | A18 | high |
| Delete | Chip removed on delete icon press or keyboard Delete | not found | not found | A18 | high |
| Generic guidance | Mobile 300ms typical; entering 225ms; leaving 195ms; desktop 150ms to 200ms | | Standard curve cubic-bezier(0.4, 0.0, 0.2, 1) | MOTION | high |
| Vuetify 1.5 | all properties | 300ms | cubic-bezier(0.25, 0.8, 0.5, 1) | V15 | moderate |

## 8. States

| State | Chip | Contact chip | Source | Confidence |
|---|---|---|---|---|
| Normal | 32dp, 13sp label 87% black | 32dp in field, 20dp field padding above and below | A18 | high |
| Hover | not found | not found | A18 | high (absence) |
| Focused | not found | Rises to 2dp; in-field chip becomes 40dp tall with 16dp padding above and below | A18 | high |
| Pressed | Opens detail view or menu | Expands to the open state (8dp) showing alternative addresses | A18 | high |
| Activated | not found | Named state ("Normal, Focused, Pressed, and Activated"); rendering shown only as an image | A18 | high (name), absence of rendering |
| Open | n/a | Name 16sp, addresses 14sp, top field activated and focused; press closes | A18 | high |
| Disabled | not found | not found | A18 | high (absence) |
| Selected | not found | not found | A18 | high (absence) |
| Error | not found | not found | A18 | high (absence) |
| Overlay opacities | not found | not found | A18 | high (absence) |
| Vuetify 1.5 | focus, active, selected: 2dp plus 13% currentColor overlay; disabled: text 38% black or 50% white, close icon inert | | V15 | moderate |

## 9. Behavior

- Selecting (touching) a chip opens a full detail view (in a card or full screen) or a menu of options related to that chip. (A18, high)
- Chips can be deletable or non-deletable; display a delete icon only when deletable. Users press the delete icon or use the keyboard Delete key to remove a chip. On desktop the remove icon is persistent. (A18, high)
- Contact chips: inserted into a text field when the user types a name and selects an address, or added from a menu of contacts. On focus the chip rises to 2dp; on press it expands to show alternative addresses; the open chip rests at 8dp with the top field activated and focused by default; pressing it closes it automatically. (A18, high)
- Limits: no limit on chip count, label length, or truncation is stated. not found. (A18, high)
- Scroll behavior: not found. (A18, high)
- Ordering within a field: not found. (A18, high)

## 10. Web notes

- Maps 1:1: 32px height, 13px Regular label, 12px side padding, 8px and 12px contact paddings, 24px remove icon with 4px margin, 2dp and 8dp shadow sets, 40px focused in-field height.
- Background color and corner radius are not in the page text. Working values: #E0E0E0 (grey 300, also Vuetify 1.5's value) and a full pill radius (16px on 32px). Flag both in `SPEC.md` as image-derived. (moderate)
- Dark theme values for chips are not in the spec; derive from COLOR (label 100% white, icon 100% white) and pick a surface tone; Vuetify 1.5 uses #555555. (interpretation)
- The 54% remove icon on a grey chip and the 32px chip height both need an extended 48px touch target. (interpretation)
- Keyboard Delete is the only keyboard rule the spec states; everything else follows the ARIA pattern.
- WAI-ARIA patterns to follow (names only): an action chip is an APG "Button"; a deletable chip is a "Button" (the chip) plus a second "Button" (remove) with an accessible name, or one button handling the Delete key per the spec; a set of chips in a text field is a "Listbox" (selectable, with Delete removing the selected option) or a list of buttons inside the field's labelled group; an open contact chip is an APG "Menu Button" or "Listbox" popup of addresses; a chip that opens a detail view is a "Button" that opens an APG "Dialog (Modal)" or navigates. v0 composition: `Button.Root` for the chip and its remove control; selection via v0 selection primitives. (pattern names: high; v0 mapping: interpretation)

## Vuetify 1.5 cross-check

Files: `_chips.styl`, `settings/_variables.styl`, `settings/_theme.styl`, `VChip.ts`, `components/Vuetify/mixins/icons.ts`.

| Metric | Spec (A18) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Height | 32dp | `$chip-height` 32px | match |
| Label size | 13sp Regular | `$chip-font-size` 13px, inherited weight | match |
| Label color | 87% black | `$material-light.chips.color` rgba(0,0,0,0.87); dark #FFFFFF | match (dark is Vuetify-only) |
| Side padding | 12dp | `$chip-padding` 0 12px | match |
| Deletable right padding | remove icon margin 4dp | `$chip-removable-padding` 0 4px 0 12px plus close margin 0 2px 0 8px | match on the 4px outer gap |
| Remove icon size | 24dp | `.v-chip__close > .v-icon` 20px; `$chip-icon-font-size` 20px | discrepancy |
| Remove icon color | 54% black | inherits chip color at opacity 0.5 (about 44% black on a light chip), opacity 1 on hover | discrepancy (approximation) |
| Remove icon glyph | not found | `$vuetify.icons.delete` = `cancel` (filled circle x) / `mdi-close-circle` | Vuetify value |
| Remove icon persistent on desktop | stated | always shown when `close` is set | match |
| Contact chip label left padding | 8dp | avatar margin-right 8px with margin-left -12px | match |
| Avatar size | not found | 32px, equal to height | Vuetify value |
| Corner radius | not found | 28px (full pill) | Vuetify value |
| Background | not found | #E0E0E0 light, #555555 dark | Vuetify value |
| Focus elevation | 2dp (contact chip) | `:focus`, `--active`, `--selected` `elevation(2)` plus 13% currentColor overlay and a rgba(0,0,0,0.13) border color | match on 2dp; overlay is Vuetify-only |
| Open contact chip | 8dp, expands to addresses | no component | gap |
| Focused in-field height | 40dp | none | gap |
| Keyboard Delete removal | stated | not handled in `VChip` (emits `input` on close click only) | gap |
| Disabled | not found | text 38% black / 50% white, close icon inert | Vuetify-only |
| Small (24px), outline, label (2px radius), select-multi margins | not in MD1 | present | Vuetify-only |
| Chip margin | not found | 4px all sides | Vuetify-only |
| Transition | not found | 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) | Vuetify-only |
