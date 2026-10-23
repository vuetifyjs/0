# Text fields (MD1)

Spec page: `components/text-fields.html`. MD1 components: `Md1TextField` (single-line, multi-line, full-width, box, dense), `Md1TextArea` (text area). The archived page is the 2017 revision (it includes "Text field boxes" and the full light/dark state tables); the 2016 revision is read as a cross-check because it carries tile heights (72dp, 48dp, 60dp, 40dp) and icon sizes the 2017 page dropped.

## Sources

| Source | URL (snapshot) | Read |
|---|---|---|
| MD1 archived spec, Text fields | `https://web.archive.org/web/20200502053713/https://material.io/archive/guidelines/components/text-fields.html` (requested `20181225002255`; the archive redirected to its `20200502053713` capture of the same archived page) | full text |
| 2016 Google Design spec, Text fields (cross-check, older metrics) | `https://web.archive.org/web/20160602210413/http://www.google.com/design/spec/components/text-fields.html` | full text |
| MD1 Patterns, Errors (user input errors, form rules, counters) | `https://web.archive.org/web/20181225002155/https://material.io/archive/guidelines/patterns/errors.html` | full text |
| MD1 Patterns, Search (search field variants) | `https://web.archive.org/web/20210805023955/https://material.io/archive/guidelines/patterns/search.html` (requested `20181225002255`, archive resolved to `20210805023955`) | full text |
| MD1 Style, Color (text opacity tables, secondary color usage, palette hexes) | `https://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html` | full text |
| MD1 Style, Typography | `https://web.archive.org/web/20181225002206/https://material.io/archive/guidelines/style/typography.html` | type scale image |
| MD1 Layout, Metrics and keylines (touch targets) | `https://web.archive.org/web/20181225002221/https://material.io/archive/guidelines/layout/metrics-keylines.html` | full text |
| MD1 Material design, Elevation and shadows | `https://web.archive.org/web/20181225002223/https://material.io/archive/guidelines/material-design/elevation-shadows.html` | component table |
| MD1 Motion, Duration and easing | `https://web.archive.org/web/20181225002212/https://material.io/archive/guidelines/motion/duration-easing.html` | full text |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_text-fields.styl`, `_inputs.styl`, `_textarea.styl`, `_counters.styl`, `_labels.styl`, `_messages.styl`, `src/stylus/settings/_theme.styl`, `_variables.styl`, `src/components/VTextField/VTextField.js`, `src/components/VInput/VInput.js` | cross-check |

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Text fields allow users to input, edit, and select text." | high |
| Where | "Text fields typically reside in forms but can appear in other places, like dialog boxes and search." | high |
| Job | "Text fields validate input, help users fix errors, autocomplete words, and provide suggestions." | high |
| Principles | Identifiable: "Using a tappable touch target, text fields should indicate that users can enter information." Findable: "It should be easy to find a text field among other elements." Legible: "Text fields should indicate their state - whether enabled or disabled, empty or filled, valid or invalid - with clear label, input, and assistive text." | high |
| Label required | "Every text field should have a label." | high |
| Boxes | "Text field boxes increase text field identifiability and scannability by using a transparent rectangular fill to enclose the label and input text." | high |
| Dense | "In forms with many or crowded fields, text fields may be made shorter." | high |

## 2. Types and variants

| Variant | Spec definition | Key metrics (details in section 4) | Confidence |
|---|---|---|---|
| Single-line field | "When the text entered is longer than the input line, it automatically scrolls left as the cursor reaches the right edge of the field." | 2017: label 16 above / 8 below, input 8 / 8. 2016 tiles: 48dp without label, 72dp with floating label | high |
| Multi-line field | "wrap text onto a new line by expanding the bottom of the field, shifting screen elements downward." "allow users to see everything they input at once." | same paddings as single-line; grows | high |
| Text area | "taller than text fields and wrap overflow text onto a new line. They scroll vertically when the cursor reaches the bottom of the field." "Text areas should have a visible border, using the same color and thickness as the input line." | border = input line (1dp, 42% black light / 70% white dark) | high |
| Full-width field | "useful for in-depth tasks or entering complex information." | normal: height 56dp, top and bottom padding 20dp; dense: 48dp, 16dp | high |
| Text field box (filled) | rectangular fill encloses label and input; masks the ends of the input line | fill 56dp, radius 4dp, 6% black / 10% white; dense box 44dp | high |
| Dense field | "Input text: 13sp"; "Reduce space between the label and input text"; "Reduce space between the input line and help text by 50%" | label 8 above / 4 below; line 8 above / 4 below | high |
| Labels as headings | "When a text field is the primary action on a screen, its label can be removed or become a heading." | placeholder shown in idle state | high |
| Solo field (raised) | "When a text field is used for a single action such as search, the text field may be elevated, with associated icons placed within it. An input line is not required." "On desktop, a raised search button should appear to the right of the search field." | elevation: quick entry / search bar 2dp resting, 3dp scrolled | high |
| Search field in the app bar | "The app bar acts as a text input field"; "The app bar has a nested text input field"; Search pattern: persistent (inset box) and expandable (toolbar transforms) | see toolbars.md | high |
| Formatted input: grouped characters | "special characters added in appropriate places, such as hyphens added to a phone number. Once the first special character is reached, the cursor automatically jumps to the next group." | | high |
| Formatted input: prefix and suffix | "Prefixes are left justified in the text field; suffixes are right justified. Text fields can have both prefixes and suffixes." | | high |
| Formatted input: password | "Password input is disguised by default. Midline ellipses are displayed to represent each character". Visibility icon toggles. 2016: icon 54% opacity when visible, 38% when hidden | | high |
| Nested menus and pickers | "dropdown menus and pickers can be nested in text fields to make input easier." | dropdown arrow 24 x 24dp | high |
| Auto-complete | "Suggest input as it's typed (refreshing suggestions with each keystroke)", "Fill a field with default input text"; "Pressing the return button accepts the current autocomplete suggestion."; "Reduce the opacity of suggested text, while keeping typed text at full opacity." 2016 names inset, full-width inline, and in-line auto-complete. | suggestion text uses placeholder size and color | high |

## 3. Anatomy

| Part | Spec text | Confidence |
|---|---|---|
| Label | "display the type of input a field requires." "aligned with the input line and always visible. They can be resting (when a field is inactive and empty) or floating." | high |
| Input line (bottom line) | "indicates where to enter text, displayed below the label. When a field is active or contains an error, the line's color and thickness vary." | high |
| Cursor | "indicates the user's current input position." "The cursor is inset with the label until the user enters input." | high |
| Input text | "Text entered into a text field is called input text." Capitalize first letter where appropriate (names, phrases). | high |
| Placeholder (hint) text | "rests in the input field until the user starts entering text. It may contain an action or an example, such as a phone number or email address." | high |
| Helper text | "gives context about a field's input, such as how the input will be used. It should be visible either persistently or only on focus." Left justified; single line if possible, else wraps. | high |
| Error message | "When input isn't accepted, text fields can display an error message below the input line, with instructions on how to fix the error. Until the error is fixed, the error replaces the helper text." Single line if possible. Preceded by "Error:" (with colon) or an error icon. | high |
| Required indicator | asterisk (*) next to the label; footnote at the bottom of the form | high |
| Optional indicator | "(optional)" next to the label | high |
| Character or word counter | right justified; "characters used / character limit" | high |
| Icon signifier | left of the field; "Icons can also be touch targets for nested components." (calendar icon opens a date picker) | high |
| Voice input icon | microphone, right justified, always enabled | high |
| Dropdown icon | arrow indicating nested selections | high |
| Clear button | right justified; "enabled when there are characters entered in the field" | high |
| Prefix / suffix | units or pre-filled input (currency, weight, email domain, time zone) | high |
| Visibility icon | password visibility toggle | high |
| Rectangular fill (box) | "A text field box uses a rectangular fill as a primary affordance, masking the ends of the input line." | high |
| Autocomplete suggestion text | "Autocompleted text is displayed to the right of the cursor, using the same font size and color as placeholder text." | high |

## 4. Metrics and keylines

### Type styles

| Element | Size and weight | Type scale name | Confidence |
|---|---|---|---|
| Input text | Roboto Regular 16sp | Subheading (Regular 16sp device) | high |
| Resting label | Roboto 16sp ("Label text is the same size as input text") | Subheading | high |
| Floating label | Roboto 12sp | Caption | high |
| Placeholder | Roboto 16sp | Subheading | high |
| Helper text | Roboto 12sp | Caption | high |
| Error text | Roboto 12sp (Errors page: Roboto Regular 12sp) | Caption | high |
| Counter | Roboto Regular 12sp | Caption | high |
| Dense input text | 13sp (2016: label and input 13sp) | Body 1 desktop size; no scale name | high |
| Prefix / suffix | not found (rendered at input size in illustrations) | not found | not found |

### Standard field spacing (2017 page, "Layout" and "Normal spacing")

| Metric | Normal | Dense | Confidence |
|---|---|---|---|
| Padding above label (resting or floating) | 16dp | 8dp | high |
| Padding below label | 8dp | 4dp | high |
| Padding above input text | 8dp | 8dp | high |
| Padding below input text (to the line) | 8dp | not restated | high |
| Padding above text input line | 8dp | 8dp | high |
| Padding below text input line (to helper / counter) | 8dp | 4dp | high |
| Padding above placeholder text | 8dp (16dp above the label) | | high |
| Padding below placeholder text | 8dp | | high |
| Padding above helper text | 8dp | 4dp (50% reduction) | high |
| Padding above error message | 8dp | | high |
| Padding below the line to the counter | 8dp | | high |
| Input text (dense) | 13sp | | high |
| Helper text left padding | 16dp ("Spacing: 16dp left padding, 8dp top padding" in the state tables) | | high |
| Error-state input text left padding | 16dp (state table) | | high |

### Tile heights (Errors page and 2016 page; the 2017 page gives paddings only)

| Composition | Height | Breakdown | Confidence |
|---|---|---|---|
| Input + error text | 64dp | 16 above input, 8 below input, 4 above and below error text | high (Errors page) |
| Floating label + input + error | 80dp | 8 above label, 8 above and below input, 4 above and below error | high (Errors page) |
| Label + input + counter ("entire input area") | 88dp | label top 16, input 8 / 8, 8 above counter; "Counter fields have 16dp of additional bottom padding" | high (Errors page) |
| Vertical space between text fields and below error text | 16dp | | high (Errors page) |
| Single-line, no label (2016) | 48dp | 16 above and below text, 8 below divider | high (2016) |
| Single-line with floating label (2016) | 72dp | 16 above label, 8 between label and input, 16 below input including divider, 8 below divider | high (2016) |
| Dense single-line (2016) | 40dp | 13sp, 12 above and below, 4 below divider | high (2016) |
| Dense with floating label (2016) | 60dp | 13sp, 12 label top, 4 between, 12 input bottom, 4 below divider | high (2016) |
| Full-width, normal | 56dp | 20 above and below text | high (both revisions) |
| Full-width, dense | 48dp | 16 above and below; 13sp | high (both revisions) |

### Text field boxes

| Metric | Normal | Dense | Confidence |
|---|---|---|---|
| Fill height | 56dp | 44dp | high |
| Corner radius | 4dp | 4dp | high |
| Fill color, light | 6% black | | high |
| Fill color, dark | 10% white | | high |
| Bottom line thickness | 2dp, "Masked by rounded corners of rectangle" | | high |
| Idle and empty | left 16dp, right 16dp, 8dp above label | | high |
| Hover | left 16dp, 20dp above label, 20dp below label | | high |
| Press | 8dp above label, 8dp below label, 8dp below placeholder | | high |
| Focus, idle and filled, error, disabled | "the same as the press state" | | high |
| Dense layout paddings | above label 8, below label 8, below field 8, above helper 8 | above label 8, below label 4, below field 8, above helper 4 | high |

### Icons and targets

| Element | Size | Spacing | Confidence |
|---|---|---|---|
| Icon signifier | 24dp wide | 16dp between icon and label | high |
| Voice input icon | 24dp wide | 8dp below icon | high |
| Dropdown arrow container | 24 x 24dp | 8dp below | high |
| Clear icon | 24 x 24dp | 8dp below | high |
| Dense field icon (2016) | 20dp | | high (2016) |
| Touch target | 48 x 48dp minimum (Metrics page) | 8dp between targets | high |
| Field width | not found (full-width spans the view) | | not found |

## 5. Color

Values are the spec's state tables (2017 page). "Primary color (Dark A700)" and "(Light A200)" are the spec's own parenthetical labels for the accent variant used in each theme; record them as written.

### Light theme

| Part | Enabled idle | Hover | Press | Focus | Idle and filled | Error | Disabled | Confidence |
|---|---|---|---|---|---|---|---|---|
| Bottom line | 1dp, 42% black (3:1) | 2dp, 87% black (15:1) | 2dp, 100% primary color (Dark A700), "Motion: Ripple & wash" | 2dp, 100% primary (Dark A700) | 1dp, 42% black | 2dp, 100% red (A400) `#FF1744` | 1dp, 42% black, dotted | high |
| Label | 16sp, 54% black (4.5:1) | 16sp, 54% black | 12sp, 87% primary (Dark A700) | 12sp, 87% primary (Dark A700) | 12sp, 54% black | 12sp, 100% red (A400) | 12sp, 38% black (2.21:1) | high |
| Input text | | | | 16sp, 87% black (15:1) | 16sp, 87% black | 16sp, 87% black | 16sp, 38% black | high |
| Placeholder | | | 16sp, 42% black (3:1) | | | | | high |
| Helper text | 12sp, 54% black | 12sp, 54% black | 12sp, 54% black | 12sp, 54% black | 12sp, 54% black | replaced by error text | | high |
| Error text | | | | | | 12sp, 87% red (A400) | | high |
| Box fill | 6% black | ripple | ripple | | | | | high |

### Dark theme

| Part | Enabled idle | Hover | Press | Focus | Idle and filled | Error | Disabled | Confidence |
|---|---|---|---|---|---|---|---|---|
| Bottom line | 1dp, 70% white (7:1) | 2dp, 100% white (13:1) | 2dp, 100% primary (Light A200), ripple and wash | 2dp, 100% primary (Light A200) | 1dp, 70% white | 2dp, 100% red (A400) | 1dp, 70% white, dotted | high |
| Label | 16sp, 70% white | 16sp, 70% white | 12sp, 100% primary (Light A200) | 12sp, 100% primary (Light A200) | 12sp, 70% white | 12sp, 100% red (A400) | 12sp, 50% white (4.5:1) | high |
| Input text | | | | 16sp, 100% white (13:1) | 16sp, 100% white | 16sp, 100% white | 16sp, 50% white | high |
| Placeholder | | | 16sp, 50% white (4.5:1) | | | | | high |
| Helper text | 12sp, 70% white | 12sp, 70% white | 12sp, 70% white | 12sp, 70% white | 12sp, 70% white | replaced | | high |
| Error text | | | | | | 12sp, 100% red (A400) | | high |
| Box fill | 10% white | ripple | ripple | | | | | high |

### Other color rules

| Rule | Spec text | Confidence |
|---|---|---|
| Accent usage | Color page: secondary colors are best used for "Text fields, cursors, and text selection"; "Text fields and switches can use your secondary color as an accent." Tabs page banner: "Apply your app's accent color, or a contrasting color, to text fields and the text field cursor." | high |
| Active color | "To signal that the field is active, the primary color of the UI is applied to the input line, label text, and cursor." | high |
| Error hue | "the input line and label use a color with a warmer hue, such as red or orange." Errors page: "use a contrasting color for error states, such as a warmer hue like red or orange." | high |
| Older hint / helper opacity (Errors page) | "Hint and helper text: #000000 with 38% opacity" (light), "#FFFFFF with 50% opacity" (dark). This conflicts with the 2017 state tables (54% / 70% for helper, 42% / 50% for placeholder). The component page is newer; implement the state tables and record the Errors page values as superseded. | high (both values); ruling is interpretation |
| Line contrast | "The line should have a 3:1 contrast ratio to improve identifiability, the same AA accessibility standard as large text." | high |
| Password icon opacity (2016) | visible: 54%; hidden: 38% | high (2016) |
| Cursor color | primary / accent (same as the active line) | high |
| Red A400 hex | `#FF1744` (Color page palette) | high |

## 6. Elevation

| Variant | Value | Confidence |
|---|---|---|
| Standard field (printed on the sheet) | no shadow; not stated numerically, implied by "the text field may be elevated" being the exception for solo fields | high (rule), 0dp is interpretation |
| Solo / search field, resting | 2dp ("Quick entry / Search bar (resting elevation)") | high |
| Solo / search field, scrolled | 3dp | high |
| Text field box | none; the fill is a tint, not a raised surface | high (interpretation of "transparent rectangular fill") |

## 7. Motion

| Transition | Spec text | Duration / easing | Confidence |
|---|---|---|---|
| Label float | "Upon press, the text field label shrinks and floats above the field, revealing the cursor and any placeholder text." Label goes from 16sp to 12sp and from resting to floating position. | not found; global mobile 300ms (desktop 150ms to 200ms), standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)` | high (behavior), global values only |
| Line activation | "Motion: Ripple & wash" on press: the 2dp primary line ripples out from the touch point and washes across | not found | high (name), not found (timing) |
| Box hover and press | "A ripple motion occurs in the hover and press states." | not found | high |
| Multi-line growth | "expanding the bottom of the field, shifting screen elements downward" | not found | high |
| Error appearance | shown "when the user shifts focus to another element" | not found | high |
| Single-line scroll | "automatically scrolls left as the cursor reaches the right edge" | native | high |

## 8. States

| State | Trigger | Rendering (see section 5 for values) | Confidence |
|---|---|---|---|
| Enabled, idle, empty | default | resting label at input size, 1dp line, optional helper | high |
| Hover | pointer over | line thickens to 2dp and darkens (87% black / 100% white); "Hover states give the input line more opacity, helping make text fields more noticeable on desktop." Box: ripple | high |
| Pressed | pointer down | label floats and shrinks, primary line 2dp with ripple and wash, placeholder revealed | high |
| Focused | after press | primary line 2dp, floating label in primary, input text full opacity; autocomplete text to the right of the cursor at placeholder color | high |
| Idle and filled | blur with content | 1dp line at idle opacity, floating label at secondary opacity, input text at primary opacity | high |
| Error (invalid) | validation on blur ("when the user shifts focus to another element") | 2dp red A400 line, red label, error text replaces helper | high |
| Disabled | prop | dotted 1dp line, label and input at disabled opacity, "less opacity so that they appear less tappable" | high |
| Empty vs filled, valid vs invalid | input conditions listed by the spec as orthogonal axes | | high |
| Hover / focus / pressed overlay opacities | not defined for text fields (the field changes its line and label rather than drawing an overlay); box variant uses a ripple with no opacity value given | not found | not found |

## 9. Behavior

| Rule | Spec text | Confidence |
|---|---|---|
| Error timing | Errors page: "Show error text only after user interaction with a field." Component page: error shown when focus leaves. "Remove the error once fixed by the user" | high |
| Error content | "Briefly state the reason for the error and how to fix it"; "Place the word 'Error' (or an error icon) before the error message"; "Display an error message below the text field, replacing any helper text" | high |
| Helper visibility | persistently or only on focus | high |
| Required / optional | asterisk plus footnote; "(optional)"; "In forms with some required fields, indicate all of the required ones. However, if there are fewer optional fields, indicate those instead." | high |
| Counter | ratio "used / limit"; "Consider not displaying the counter until the user approaches the character limit."; Errors page shows a red line when the limit is exceeded (2016 captions: green line under limit, red line over) | high |
| Clear | clear button empties the field; enabled only when the field has characters | high |
| Voice | microphone icon always enabled | high |
| Autocomplete | suggestions refresh each keystroke; return accepts; suggested text at reduced opacity | high |
| Grouped characters | cursor jumps to the next group at the first special character | high |
| Formatting visibility | "Text formatting should be displayed only when the field is pressed, focused, or filled." | high |
| Password | disguised by default with midline ellipses; visibility toggled by the icon | high |
| Single-line overflow | scrolls left | high |
| Multi-line overflow | grows downward | high |
| Text area overflow | scrolls vertically | high |
| Capitalization | first letter of input and of each sentence where appropriate (names, phrases) | high |
| Form submission | "The Submit button should be enabled by default."; may be disabled during inline validation when the erroring field is clearly marked | high |
| Incompatible values | error below each field plus a summary at the top of the form | high |
| Errors on submission | "Reload the form with consolidated error messages and scroll position at the top." | high |
| Incomplete form | empty required fields get both the field error state and a message; shown after the user advances past the field, or on submit when progress cannot be detected | high |
| Keyboard (2016) | "Touching a text field places the cursor and displays the keyboard."; "The virtual keyboard layout may be optimized for frequently used characters." Input types: Number (phone, credit card, PIN), Text (name, username, URL), Mixed (email, street address, search query) | high (2016) |
| Search field | persistent search: inset box, focus expands suggestions, X clears, results as cards, box stays visible unfocused; expandable search: icon in toolbar, toolbar transforms, up arrow closes | high |
| Dense | reserved for "forms with many or crowded fields" and "when the mouse and keyboard are the primary input methods" (2016) | high |

## 10. Web notes

- Maps 1:1: all paddings, 16sp / 12sp / 13sp sizes, line thicknesses 1dp and 2dp with the opacity table, box fill 56dp / 44dp with 4dp radius and 6% / 10% tint, full-width 56dp / 48dp, icon 24dp in a 48dp target, error red A400.
- Needs interpretation: the 2017 page gives paddings but no total heights; use the Errors page tiles (64 / 80 / 88dp) and the 2016 tiles (48 / 72 / 40 / 60dp) as the audit numbers and state in `SPEC.md` which one each variant targets. "Dotted" disabled line: draw with a repeating gradient or `border-style: dotted` at 1dp; the dot pitch is not found. "Ripple & wash" on the line and the box ripple have no timing in the spec; reuse the global durations and record the choice.
- Dense is tied to pointer type by the 2016 text; prefer an explicit prop and document that `(pointer: fine)` is a consumer-side choice.
- Keyboard and IME: the spec's "keyboard layout optimized for the input type" maps to `type` plus `inputmode` (`numeric`, `tel`, `email`, `url`, `search`); autocomplete maps to the `autocomplete` attribute for browser suggestions and to a listbox for app suggestions; "return accepts the suggestion" needs Enter handling that does not submit the surrounding form while a suggestion is active. Composition events (`compositionstart` / `compositionend`) must not trigger validation or counter errors mid-IME.
- Grouped characters are an input mask; the cursor-jump rule needs selection management on `input` events.
- Password visibility toggle changes `type` between `password` and `text`; the midline ellipsis rendering is the browser's.
- Per DESIGN_SYSTEMS.md ruling 2, compose v0's text-input primitive rather than a bare native control; the primitive still renders a real editable element so the native textbox semantics stay intact.
- WAI-ARIA: a text field is a native **textbox** (no composite pattern); error text is linked with `aria-describedby` and the field carries `aria-invalid="true"`; required uses `required` / `aria-required`; the counter and error message are a polite live region; helper text is `aria-describedby`. Autocomplete with suggestions follows the **Combobox** pattern (`aria-autocomplete="list"` or `"inline"`); the clear and visibility icons are **Button** pattern; nested pickers reopen as **Dialog** (picker) or **Listbox** / **Menu** (dropdown).
- Text area: the spec's "visible border, same color and thickness as the input line" is a 1dp 42% black box, not Vuetify's 2px outline.

## Vuetify 1.5 cross-check

Files: `_text-fields.styl`, `_inputs.styl`, `_textarea.styl`, `_counters.styl`, `_labels.styl`, `_messages.styl`, `_theme.styl`, `_variables.styl`, `VTextField.js`, `VInput.js`.

| Property | Spec | Vuetify 1.5 | Match |
|---|---|---|---|
| Input text size | 16sp | `.v-input font-size: 16px` | yes |
| Resting label | 16sp | `.v-label font-size: 16px` | yes |
| Floating label | 12sp | `transform: scale(.75)` of 16px = 12px, `translateY(-18px)` | yes |
| Helper / error / counter size | 12sp | `.v-messages 12px`, `.v-counter 12px` | yes |
| Input line thickness, idle | 1dp | `:before border-width: thin 0 0 0` (1px) | yes |
| Input line color, idle | 42% black / 70% white | `input-bottom-line: rgba(0,0,0,.42)` / `rgba(255,255,255,.7)` | yes |
| Hover line | 2dp, 87% black / 100% white | color `$material.text.primary` (87% / 100%); thickness stays 1px | color yes, thickness no |
| Focus line | 2dp primary | `:after border-width: thin 0 thin 0` scaled in = 2px, `currentColor`, `color` prop default `primary` | yes |
| Error line | 2dp red A400 `#FF1744` | `currentColor` = Vuetify `error` theme color `#FF5252` (Red A200) | thickness yes, hue no |
| Error text color | 87% red A400 (light), 100% (dark) | `error--text` at 100% `#FF5252` | no |
| Error motion | not found | label `shake .6s swing` animation | n/a |
| Disabled line | dotted, 42% black / 70% white | `repeating-linear-gradient` 2px dash / 2px gap in `text.disabled` (38% black / 50% white) | pattern approximates, color no |
| Label color | 54% black / 70% white; disabled 38% / 50% | `v-label: text.secondary`; `--is-disabled: text.disabled` | yes |
| Input text color | 87% black / 100% white; disabled 38% / 50% | `text.primary`; disabled `text.disabled` | yes |
| Placeholder color | 42% black (press, light) / 50% white (dark) | `::placeholder: text.disabled` = 38% black / 50% white | light no, dark yes |
| Helper color | 54% black / 70% white | `.v-messages: text.secondary` | yes |
| Counter color and placement | right justified, 12sp | `.v-counter` 12px, `margin-left: 8px`, flex end; color `text.secondary` | yes |
| Field vertical rhythm (floating label) | 72dp tile (2016) | `padding-top: 12px` + input `line-height: 20px` with `padding: 8px 0` + slot `margin-bottom: 8px` + messages `min-height: 12px` + `margin-top: 4px` = 72px | yes |
| Helper left padding | 16dp | 0 (messages start at the field's left edge) | no |
| Icon size | 24dp | `.v-input__icon: 24px` | yes |
| Icon to label gap | 16dp | `prepend-inner padding-right: 4px`; `prepend-outer margin-right: 9px` | no |
| Box fill height | 56dp | `--box ... min-height: 56px` | yes |
| Box radius | 4dp | `border-top-left-radius / border-top-right-radius: 4px` (top corners only) | partial |
| Box fill, light | 6% black | `text-fields.box: rgba(0,0,0,.06)` | yes |
| Box fill, dark | 10% white | `rgba($shades.black, .1)` = 10% black | no |
| Box hover fill | ripple (no value) | light `rgba(0,0,0,.12)`, dark `rgba(0,0,0,.2)` | n/a |
| Box side padding | 16dp | `--enclosed ... padding: 0 12px` | no |
| Box line | 2dp masked | `--box :before border-width: thin 0 thin 0` = 2px | yes |
| Dense box | 44dp | no dense text field in 1.5 | no (missing) |
| Dense field | 13sp, reduced paddings | not implemented | no (missing) |
| Full-width height | 56dp | `--full-width ... min-height: 56px` | yes |
| Full-width padding | 20dp top and bottom | `input margin-top: 22px` (12px single-line) | approximate |
| Text area border | same as input line (1dp, 42% black) | `--outline: 2px solid text.secondary` (54%), radius 4px; focused 2px `currentColor` | no |
| Text area text | 16sp | `textarea line-height: 18px; min-height: 32px; padding: 7px 0 8px` | size yes |
| Solo elevation | 2dp resting, 3dp scrolled | `elevation(2)`, `min-height: 48px`, radius 2px; no scrolled state | resting yes |
| Solo height | not found | 48px | n/a |
| Clear icon | 24dp, right | `clearIcon` 24px, `border-radius: 50%` | yes |
| Prefix / suffix | left / right justified | `__prefix` right-aligned text with `padding-right: 4px`; `__suffix padding-left: 4px`; color `text.secondary` | yes |
| Required asterisk, "Error:" prefix, counter ratio text | spec rules | not implemented; counter renders `value / max` | ratio yes, others n/a |
| Transitions | not found | label and line `.3s $transition.swing` = `cubic-bezier(.25,.8,.50,1)` | n/a |
