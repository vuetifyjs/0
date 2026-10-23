# Sliders (Material Design 1)

## Sources

- Spec page: https://m1.material.io/components/sliders.html (Google-hosted frozen archive of the MD1 guidelines; `https://material.io/archive/guidelines/components/sliders.html` 301-redirects to it; fetched 2026-10-22). The Wayback target `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/sliders.html` refused TCP connections for the whole session (rate limiting).
- The page text gives usage and colors only; it has no dimension callouts. Every dimension below is measured in pixels from the spec sheets, which render at 2 px per dp (calibration: the same artboard family as the snackbar sheets, where the 24 dp and 48 dp callouts measure 48 px and 96 px; the 2 dp track measures 4 px everywhere). Base URL `https://storage.googleapis.com/material-io-design/m1/assets/`:
  - `0Bx4BSt6jniD7QkJlRGNfTGEzQlE/components-sliders-continuous1.png` (light, normal, focused, click, disabled at 0 %, 60 %, 100 %)
  - `0Bx4BSt6jniD7R2s2OGFDcVRkZFE/components-sliders-continuous2.png` (dark, same grid)
  - `0Bx4BSt6jniD7M0Voc2NyM3VheE0/components-sliders-continuous3.png` (phone mockup, icons left of the track)
  - `0Bx4BSt6jniD7cG5vbFVudGNVRms/components-sliders-continuous4.png` (phone sheet: normal, hover, focus, click, disabled with end icons)
  - `0Bx4BSt6jniD7dDFpcFo0V2JLS2c/components-sliders-continuous5.png`, `0B_udO5B8pzrzUEprRVBiRjY3ZHc/components-sliders-continuous6.png` (editable numeric value)
  - `0Bx4BSt6jniD7dEtQQ2s4VUZxZG8/components-sliders-discrete1.png` (light discrete), `0Bx4BSt6jniD7WnY0a3RrcEI0ZXc/components-sliders-discrete2.png` (dark discrete)
- Vuetify 1.5.24: `packages/vuetify/src/stylus/components/_sliders.styl`, `_range-sliders.styl`, `settings/_theme.styl` (`slider`), `settings/_variables.styl` (`$transition`, `$primary-transition`, `$input-top-spacing`).

Confidence: `high` = page text; `moderate` = measured from a sheet (method above) or Vuetify 1.5 stylus; `low` = memory.

## 1. Purpose and usage

| Rule | Confidence |
|---|---|
| Sliders let users select from a range of values by moving the slider thumb. | high |
| Ideal for adjusting settings that reflect intensity levels: volume, brightness, color saturation. | high |
| Sliders may have icons on both ends of the bar that reflect the value intensity. | high |
| Place the smallest value on the left and the largest on the right. | high |
| Continuous sliders: subjective ranges that do not require a specific value to make meaningful adjustments; may offer an editable numeric value. | high |
| Discrete sliders: a specific value from a range; the thumb snaps to evenly spaced tick marks; each tick must change the setting to a level discernible to the user; values are predetermined and not user-editable. | high |
| Discrete slider with a numeric value label: for settings where the user needs to know the exact value. | high |
| Continuous slider with an editable numeric value: for settings where the user must set the exact value; pressing the thumb makes the text box editable, and the value updates automatically with thumb movement. | high |
| Range (two-thumb) slider, vertical slider | not found on the page (not an MD1 component) | high (absence) |

## 2. Types and variants

| Type | Thumb at rest | Focus | Press (click) | Extra parts | Confidence |
|---|---|---|---|---|---|
| Continuous | 12 dp dot | 12 dp dot inside a 32 dp halo | 18 dp dot | optional end icons | moderate |
| Continuous with editable numeric value | as continuous | as continuous, plus the field gets the focused (accent) underline | as continuous | text field right of the track | moderate |
| Discrete with numeric value label | 12 dp dot | thumb replaced by a 26 x 32 dp value pin | pin plus 2 dp tick marks on the track | tick marks, value pin | moderate |
| Discrete without the label | not shown on the page | | | | high (absence) |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Track, active portion (left of the thumb) | 2 dp, accent | high (color), moderate (size) |
| Track, inactive portion (right of the thumb) | 2 dp, grey | high, moderate |
| Thumb | 12 dp circle; hollow 2 dp ring at the 0 % position | moderate |
| Focus halo | 32 dp circle centered on the thumb | moderate |
| Value label (pin) | 26 dp wide, 32 dp tall teardrop with the value in white; replaces the thumb while focused or pressed on a discrete slider | moderate |
| Tick marks | 2 x 2 dp squares on the track at every discrete value, shown while pressed | moderate |
| End icons | 24 dp icons left and right of the track, reflecting intensity | high (presence), moderate (size) |
| Numeric text field | underlined field right of the track, right-aligned value | moderate |

## 4. Metrics and keylines

| Metric | Value | Measured as | Confidence |
|---|---|---|---|
| Track height | 2 dp | 4 px | moderate |
| Thumb diameter, normal and hover | 12 dp | 24 px | moderate |
| Thumb diameter, pressed (click) | 18 dp | 36 px | moderate |
| Thumb at 0 %, normal | hollow ring, 12 dp outer, 2 dp stroke | 24 px outer, 4 px stroke | moderate |
| Thumb at 0 %, pressed | hollow ring, 18 dp outer | 36 px | moderate |
| Focus halo | 32 dp circle around the 12 dp thumb | 64 px | moderate |
| Disabled thumb | 8 dp dot with a 2 dp gap to the track on each side (the 12 dp footprint stays clear) | 16 px dot, 4 px gaps, track resumes where the 12 dp thumb would end | moderate |
| Tick marks | 2 x 2 dp squares, centered on the 2 dp track, one per discrete value, evenly spaced | 4 x 4 px | moderate |
| Value pin | 26 dp wide, 32 dp tall; tip 7 dp above the track's top edge (8 dp above the centerline) | 52 x 64 px, 14 px gap | moderate |
| Value pin text | white digits, cap height 7 dp (about 10 sp); the page gives no size | 14 px glyph height | moderate |
| Thumb when the pin shows | hidden; the active track ends under the pin | sheets discrete1 and discrete2 | moderate |
| End icons | 24 dp, 16 dp between icon box and track; 24 dp from the dialog edge to the icon | 48 px icon box, 32 px gap, 48 px margin (continuous3) | moderate |
| Numeric field | 24 dp wide underline (fits three digits), 16 dp from the track end, 24 dp from the right edge; 1 px underline in the mockup | 48 px, 32 px, 48 px (continuous5) | moderate |
| Track length | fills the available width between its neighbors | mockups | moderate |
| Component height, touch target | not found on the page | | high (absence) |
| Mobile vs desktop | identical geometry on the sheets; the desktop sheet adds a hover row that does not change the thumb | moderate |

## 5. Color

Values from the page text; the measured hex in parentheses corroborates the text unless noted.

| Part and state | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Thumb on (value above 0) | Swatch 500, 100 % | Swatch 200, 100 % (the dark sheet renders Indigo 500 #3F51B5; the text wins) | high |
| Track on (active portion) | Swatch 500, 100 % | Swatch 200, 100 % (same sheet deviation) | high |
| Thumb off (at 0 %) | #000000 at 26 % (measured #B0B0B0 = 26 %) | #FFFFFF at 30 % (sheet renders #5C5C5C, about 20 %; the text wins) | high |
| Track off (inactive portion) | #000000 at 26 % | #FFFFFF at 30 % (sheet about 20 %) | high |
| Focused and click, thumb off | #000000 at 38 % (measured #939393 = 38 %) | not found in the text; the sheet renders #6D6D6D (about 28 % white) | high (light), moderate (dark) |
| Focused and click, track off | #000000 at 38 % | not found in the text (sheet about 28 % white) | high (light), moderate (dark) |
| Disabled (disconnected) thumb and track | #000000 at 26 % | #FFFFFF at 30 % (sheet about 20 %) | high |
| Focus halo, thumb on | not in the text; measured #D0D3E5 = accent 500 at about 16 % | measured #454859, a light accent tint at about 20 % (consistent with an A100 or 200 swatch; exact swatch not found); the halo also lightens the thumb (#4E5EBB) | moderate |
| Focus halo, thumb off | measured #D3D3D3 = black at about 11 % | measured #484848 = white at about 10 % | moderate |
| Tick marks | #000000 at 100 % on both the active and inactive track (measured) | #FFFFFF at 100 % (measured) | moderate |
| Value pin, value above 0 | accent (sheet: Green 500 #0F9D58) | same (#0F9D58) | moderate |
| Value pin at 0 % | grey (measured #BEBEBE, black at about 20 %) | grey (measured #5C5C5C, white at about 20 %) | moderate |
| Value pin text | white 100 % | white 100 % | moderate |
| End icons | 87 % black (measured #4A4A4A on the sheet, dark icon) ; 26 % when disabled | not found | moderate |
| Numeric field underline | grey at rest, accent when focused or pressed, grey and value 26 % when disabled (continuous6) | not found | moderate |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Thumb, track, pin | flat, no shadow in any sheet, 0 dp | moderate |
| Pressed or dragged thumb | no shadow drawn; not found in the text | high (absence) |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Discrete: thumb snaps to tick marks | stated; duration not found | high (rule), high (absence of numbers) |
| Discrete: on focus the thumb turns into the value pin; on press the tick marks appear | sheets and the discrete slider video | moderate |
| Continuous: thumb grows from 12 dp to 18 dp on press; halo appears on focus | sheets | moderate |
| Editable numeric value: field updates live while dragging | text | high |
| Durations and easing | not found | high (absence) |
| Vuetify 1.5 | thumb and track `.3s cubic-bezier(.25,.8,.5,1)`; focus halo `.3s` swing (`$primary-transition`); label `.3s cubic-bezier(.25,.8,.25,1)` | moderate |

## 8. States

| State | Continuous | Discrete | Confidence |
|---|---|---|---|
| Normal | 12 dp thumb; hollow ring at 0 % | 12 dp thumb (black 87 % at 0 % in the light sheet, white in the dark sheet) | moderate |
| Hover | no visible change (phone sheet row "Hover" equals "Normal") | not shown | moderate |
| Focus | 32 dp halo (about 16 % accent on, 11 % black off; dark: 20 % accent tint on, 10 % white off); thumb and track off portions rise to 38 % | value pin replaces the thumb; off track rises to 38 %; no halo | moderate |
| Click (pressed) | thumb 18 dp; off portions at 38 %; no halo drawn | pin stays; 2 dp tick marks appear along the whole track | moderate |
| Disabled | 8 dp thumb, 2 dp gaps, everything 26 % black (30 % white dark) | same, no pin, no ticks | high (color), moderate (geometry) |
| Error | not found | not found | high (absence) |
| Selected or active | the on portion is the selected range | | high |

## 9. Behavior

| Rule | Confidence |
|---|---|
| Minimum at the left, maximum at the right. | high |
| Continuous: any value along the range; no exact value needed. | high |
| Discrete: thumb snaps to evenly spaced ticks; each tick is a discernible level; values predetermined and not user-editable. | high |
| Editable numeric field: becomes editable when the thumb is pressed; updates with thumb movement; typing sets the exact value. | high |
| Disabled: thumb disconnected from the track. | high |
| Scroll, keyboard, RTL | not found on the page | high (absence) |

## 10. Web notes

- Maps 1:1: 2 dp track, 12 / 18 dp thumb, 32 dp halo, 8 dp disabled thumb with 2 dp gaps, 2 dp ticks, 26 x 32 dp pin, 24 dp icons with 16 dp gaps, the 26 / 38 % color ladder.
- Needs interpretation: the 0 % hollow-ring thumb is a style keyed on value, not a separate state; the pin's about 10 sp digits are measured, not stated; the halo alpha differs between the slider (11 to 16 %) and the selection-control sheets (6 to 10 %), so keep per-component halo tokens; the RTL mirror ("smallest on the left") must flip in RTL even though the page is silent.
- Hover shows no change on the sheets, so a hover overlay is not part of the spec.
- Range sliders and vertical sliders are not in MD1; exclude them (ruling 7) and record the hole in SPEC.md.
- WAI-ARIA: Slider pattern (`role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` for the discrete labels, `aria-orientation="horizontal"`); the editable numeric field is a separate spinbutton or text input bound to the same value. The spec says nothing about keyboard; follow the pattern, do not write one.

## Vuetify 1.5 cross-check

| Item | Spec (measured) | Vuetify 1.5.24 | Agree |
|---|---|---|---|
| Track height | 2 dp | `__track`, `__track-fill`, `__track__container` 2px | yes |
| Thumb, normal | 12 dp | `__thumb` 24px scaled `.6` = 14.4 px | no |
| Thumb, pressed | 18 dp | active `scale(1)` = 24 px | no |
| Thumb at 0 % | hollow ring, 2 dp stroke, 26 % | not dirty: `border: 3px solid $material.slider.inactive` (26 %), transparent fill | yes (color), stroke 3px vs 2 dp |
| Thumb at 0 %, active | 38 % ring | not dirty and active: `border: 3px solid $material.slider.active` (38 %) | yes |
| Focus halo | 32 dp, 11 to 16 % | `__thumb-container:before` 32px, opacity `.2`, `currentColor` | yes (size), no (opacity) |
| Pressed halo | none drawn | halo only while focused and not showing the label | yes |
| Disabled thumb | 8 dp with 2 dp gaps | `scale(.45)` of 24px = 10.8 px, `border: 5px solid` disabled color; dirty: filled; no track gap | no |
| Disabled color, light | 26 % black | `slider.disabled: rgba(0,0,0,.26)` | yes |
| Disabled color, dark | 30 % white | `rgba(255,255,255,.2)` | no (20 vs 30 %) |
| Inactive track, light | 26 % black | `slider.inactive: rgba(0,0,0,.26)` | yes |
| Inactive track, dark | 30 % white | `rgba(255,255,255,.2)` | no |
| Focused and click inactive track, light | 38 % | `slider.active: rgba(0,0,0,.38)` applied while active | yes |
| Active (filled) track | accent 500 (200 dark) | color prop via JS; `track-fill` | yes (JS) |
| Tick marks | 2 dp, 100 % black or white, shown while pressed | `__ticks` border-color `text.primary` (87 %), size from the JS `tickSize` prop (default 1 px), shown while active or always with `ticks="always"` | no (color 87 % vs 100 %; size) |
| Tick labels | not in spec | `ticks-labels` with 16px bottom margin | Vuetify extra |
| Value pin | 26 x 32 dp teardrop, white about 10 sp digits | `__thumb-label` 32 x 32 px square rotated 45 deg with `border-radius: 50% 50% 0`, `font-size: 12px`, white text | no (shape and size) |
| Pin color at 0 % | grey, about 20 % | not dirty: background `slider.inactive` (26 %) | close |
| Thumb hidden under the pin | yes | `--show-label` thumb `scale(0)` | yes |
| End icon spacing | 16 dp | `.v-input__slot > *:first-child` margin-right 16px; label margin 16px | yes |
| Slider box height | not found | `.v-slider` height 32px | n/a |
| Range slider | not in MD1 | `_range-sliders.styl` | Vuetify extra, exclude |
| Transitions | not found | `.3s` swing and fast-in-fast-out | n/a |
