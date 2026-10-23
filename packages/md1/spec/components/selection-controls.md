# Selection controls (Material Design 1): checkbox, radio button, switch

## Sources

- Spec page: https://m1.material.io/components/selection-controls.html (the MD1 guidelines Google hosts as an archive; fetched 2026-10-22). A 2021-08-05 third-party archive copy of the same page, read once, has identical text.
- The page text carries only usage rules and colors. It contains no dimension callouts, in text or in the sheets. Every dimension below is measured in pixels from the spec sheets, which render at 2 px per dp (the same artboard family as the snackbar sheets whose 24 dp and 48 dp callouts measure 48 px and 96 px, and the 720 px wide sheets are 360 dp phone artboards). Base URL `https://storage.googleapis.com/material-io-design/m1/assets/`:
  - `0Bx4BSt6jniD7T2xGbGo0cUlPVG8/components-switches-check1.png` (light), `0Bzhp5Z4wHba3T0dETW14SXB6SEk/components-switches-check2.png` (dark), `0Bzhp5Z4wHba3cFp4WHdDaWZESmM/components-switches-check3.png` (light states), `0Bzhp5Z4wHba3U3cyZ2d5c0lJOVU/components-switches-check4.png` (dark states)
  - `0Bx4BSt6jniD7Z1NaaXh2ZkpDRkE/components-switches-radio1.png`, `0Bzhp5Z4wHba3VVZLVHFPMDFLR00/components-switches-radio2.png`, `0Bzhp5Z4wHba3VkFMQmhUM08xTnM/components-switches-radio3.png`, `0Bzhp5Z4wHba3aktnWkpYUUFKaDA/components-switches-radio4.png`
  - `0Bx4BSt6jniD7NDg4aGIzVXYxVEE/components-switches-switch1.png`, `0Bx4BSt6jniD7V0R4UVJ3Y21obkU/components-switches-switch2.png`, `0Bzhp5Z4wHba3Mk55RHlTUi1YaVE/components-switches-switch3.png`, `0B6Okdz75tqQsTDJPbG5DUjJOYkk/components-switches-switch4.png`, `0Bx4BSt6jniD7ajdnOGFPY21xRHM/components-switches-switch5.png` (mobile radial reaction), `0Bx4BSt6jniD7aU9raG5tSDl5b2c/components-switches-switch6.png` (desktop, no radial reaction)
- Vuetify 1.5.24: `packages/vuetify/src/stylus/components/_selection-controls.styl`, `_radios.styl`, `_radio-group.styl`, `_switch.styl`, `settings/_theme.styl` (`selection-controls`, `buttons.disabled`, `icons`), `settings/_variables.styl` (`$input-top-spacing`, `$ripple-*`).

Confidence: `high` = page text; `moderate` = measured from a sheet (method above) or Vuetify 1.5 stylus; `low` = memory.

## 1. Purpose and usage

| Rule | Confidence |
|---|---|
| Selection controls allow the user to select options. Checkboxes select multiple options from a set; radio buttons select a single option from a set; switches turn a selection on or off. | high |
| Selection controls use the app's accent color. Available in light and dark themes. | high |
| Checkbox: with multiple options in a list, checkboxes preserve space compared with switches. With a single option, avoid a checkbox and use a switch. | high |
| Radio: use for exclusive selection when the user needs to see all options side by side; otherwise consider a dropdown, which uses less space. | high |
| Switch: toggles the state of a single settings option. The option it controls and its current state must be clear from the corresponding inline label. Switches take on the same visual properties as the radio button. | high |
| The slide toggle with the words "on" and "off" inside the asset is deprecated; use the switch. | high |
| Use the outer radial reaction only on form factors that favor finger touch, where interaction may obstruct the element completely. Desktop with a mouse does not need it. | high |
| Indeterminate (mixed) checkbox | not found on the page | high (absence) |

## 2. Types and variants

| Control | Resting geometry | On | Off | Confidence |
|---|---|---|---|---|
| Checkbox | 18 x 18 dp box, 2 dp border, 2 dp corner radius | filled box in accent 500 with a white check glyph | outlined box, 54 % black (light) or 70 % white (dark) | moderate (geometry), high (colors) |
| Radio button | 20 dp outer ring, 2 dp stroke, 10 dp inner dot | ring and dot in accent 500 | ring only, 54 % black or 70 % white | moderate (geometry), high (colors) |
| Switch | 36 x 14 dp pill track, 20 dp round thumb, 16 dp thumb travel | thumb accent 500, track accent 500 at 50 % (light); thumb and track accent 200 (dark) | thumb Grey 50, track 38 % black (light); thumb Grey 400, track 30 % white (dark) | moderate (geometry), high (colors) |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Checkbox box and check glyph | box 18 dp; the check is a white stroke glyph inside the filled box; glyph stroke width not found | moderate |
| Radio ring and dot | ring 20 dp outer, dot 10 dp, concentric | moderate |
| Switch track and thumb | thumb overhangs the track by 3 dp above and below; the thumb is flush with the track end in both positions | moderate |
| Radial reaction (halo) | 48 dp circle centered on the control, shown for focus, pressed and disabled-focused; touch form factors only | moderate (size), high (when to show) |
| Inline label | required for switches; placement and spacing not found on this page (see the lists-controls note for list keylines) | high (absence) |

## 4. Metrics and keylines

| Metric | Value | Measured as | Confidence |
|---|---|---|---|
| Checkbox box | 18 x 18 dp | 36 x 36 px in check1 and check3 | moderate |
| Checkbox border (unchecked) | 2 dp | 4 px runs on both sides of the box | moderate |
| Checkbox corner radius | 2 dp | first-row coverage 32 px, second 34 px, fourth 36 px, consistent with a 4 px radius | moderate |
| Checkbox glyph | white check, drawn inside the box | not measured | moderate |
| Radio outer diameter | 20 dp | 40 x 40 px | moderate |
| Radio ring stroke | 2 dp | 4 px | moderate |
| Radio dot diameter | 10 dp | 20 x 20 px | moderate |
| Switch thumb | 20 dp | 40 px | moderate |
| Switch track | 36 x 14 dp, fully rounded ends | 72 x 28 px (left end of the on-state track to right end of the off-state track) | moderate |
| Switch thumb travel | 16 dp | thumb x 328 to 360 px | moderate |
| Switch thumb vertical overhang | 3 dp above and below the track | thumb 40 px tall centered on a 28 px track | moderate |
| Radial reaction diameter | 48 dp | 96 px halo in check3, switch3, switch5; 134 px in the 2111 px wide radio3 (same 48 dp at that sheet's 2.78 px per dp) | moderate |
| Touch target | not stated on this page; the 48 dp halo implies a 48 dp target | moderate |
| Icon bounding box | not found (Vuetify 1.5 places the 18 dp glyph in a 24 px icon box) | moderate |
| Label type style | not found on this page | high (absence) |
| Spacing control to label | not found on this page (Vuetify 1.5: 8 px) | moderate |
| Spacing between stacked controls | not found (Vuetify 1.5 radio group: 8 px column gap, 16 px row margin) | moderate |
| Mobile vs desktop | identical geometry; only the radial reaction differs (mobile yes, desktop no) | high |

## 5. Color

Values are from the page text; the measured hex in parentheses is the sheet rendering over the sheet background (#EEEEEE light, #333333 dark) and corroborates the text unless noted.

| Control and state | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Checkbox on | Swatch 500, 100 % (#009688 in the sheets) | Swatch 500, 100 % | high |
| Checkbox off | #000000 at 54 % (measured #6D6D6D = 54 %) | #FFFFFF at 70 % (measured #C1C1C1 = 70 %) | high |
| Checkbox disabled | #000000 at 26 % (measured #B0B0B0 = 26 %) | #FFFFFF at 30 % (measured #717171 = 30 %) | high |
| Radio on | Swatch 500, 100 % | Swatch 500, 100 % | high |
| Radio off | #000000 at 54 % | #FFFFFF at 70 % | high |
| Radio disabled | #000000 at 26 % | #FFFFFF at 30 % | high |
| Switch thumb on | Swatch 500, 100 % | Swatch 200, 100 % (measured #82CAC3 = Teal 200) | high |
| Switch track on | Swatch 500 at 50 % (measured #77C2BB = exactly 50 %) | Swatch 200 at 50 % (measured #5A7F7C = 50 %) | high |
| Switch thumb off | Grey 50, #FAFAFA, 100 % | Grey 400, #BDBDBD, 100 % | high |
| Switch track off | #000000 at 38 % (sheet renders #A6A5A5, about 30 %; the text wins) | #FFFFFF at 30 % (measured #6C6C6C = 28 %) | high |
| Switch thumb disabled | Grey 400, #BDBDBD, 100 % | Grey 800, #424242, 100 % | high |
| Switch track disabled | #000000 at 12 % | #FFFFFF at 10 % | high |
| Check glyph on a disabled checkbox | drawn in the surface color (the sheet cuts the glyph out of the 26 % box) | same | moderate |
| Label text | not found on this page (Body 1 and 87 % primary text per the typography and color pages) | | high (absence) |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Checkbox and radio | flat, 0 dp (no shadow in any sheet) | moderate |
| Switch thumb | not found on the page; every sheet draws a soft shadow under the thumb reaching about 5 dp below it | high (absence), moderate (sheet) |
| Switch thumb when pressed | not found | high (absence) |
| Vuetify 1.5 | `elevation(4)` on `.v-input--switch__thumb` | moderate |
| Material Design Lite | elevation 2 shadow on the thumb | low |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Check mark draw, radio dot, switch slide | not found on the page | high (absence) |
| Radial reaction | grows from the control center (sheets show the full 48 dp halo only) | moderate |
| Vuetify 1.5 | `.3s cubic-bezier(.25,.8,.25,1)` on `color` and `transform` of the input box; switch thumb `translate(16px, 0)` when dirty; ripple scale `.2` to `.8` on focus | moderate |

## 8. States

The sheets show, for each control, On and Off rows across hover, focused, pressed, disabled and disabled focused. The halo is the 48 dp radial reaction. Alpha values are computed from the measured hex over the sheet background.

| State | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Normal | control colors from section 5, no halo | same | high |
| Hover | identical to normal; no overlay drawn (check3, radio3, switch3) | identical to normal | moderate |
| Focused, on | 48 dp halo in accent 500 at about 6 % (#DFE8E8 checkbox); switch 48 dp halo in accent 500 at about 6 % | 48 dp halo: checkbox accent 500 at about 10 % (#2E3D3C), radio accent 200 at about 10 % (#3B4242), switch accent 500 at about 4 % (#313737) | moderate |
| Focused, off | 48 dp halo in black at about 7 % (#DDDDDD) | 48 dp halo in white at about 10 % (#474747) | moderate |
| Pressed, on | 48 dp halo in accent 500 at about 10 % (#D6E5E4) | as focused (sheets draw the same halo) | moderate |
| Pressed, off | 48 dp halo in black at about 7 % (#DDDDDD) | white at about 10 % | moderate |
| Disabled | control in the disabled color, no halo | same | high |
| Disabled focused | disabled color plus the grey halo | same | moderate |
| Error | not found | not found | high (absence) |
| Selected or active | this is the "on" state | | high |
| Radial reaction on desktop | not shown; focus and pressed carry no halo with a mouse | | high |

The page itself gives no overlay percentages; the measured halos (6 to 10 %) are lighter than the 12 % focus and 26 % pressed overlays other MD1 pages use for buttons. Record the measured values and let the states note decide the family-wide overlay table.

## 9. Behavior

| Rule | Confidence |
|---|---|
| Checkbox: zero to many of a set may be on. | high |
| Radio: exactly one of a set is on; selection is exclusive. | high |
| Switch: one setting, on or off, with an inline label naming the option and its state. | high |
| Indeterminate checkbox, tri-state, disabled-checked rules, group ordering, keyboard behavior | not found on the page | high (absence) |

## 10. Web notes

- Maps 1:1: the three geometries (18 dp box, 20 dp ring, 36 x 14 dp track with a 20 dp thumb), the color table, the 48 dp halo.
- Needs interpretation: the halo is touch-only, so gate it on `(pointer: coarse)` or `(hover: none)` rather than on viewport width; label placement and the 48 dp touch target come from other pages; the page shows no indeterminate checkbox, so a mixed state is an extra-spec addition that SPEC.md must declare if shipped.
- The dark-theme switch uses accent 200 where the checkbox and radio stay on accent 500; keep separate tokens.
- WAI-ARIA: Checkbox pattern (two-state; the Checkbox pattern's mixed state only if indeterminate is added), Radio Group pattern, Switch pattern (`role="switch"`). The spec says nothing about keyboard; follow the patterns, do not write one.

## Vuetify 1.5 cross-check

| Item | Spec (text or measured) | Vuetify 1.5.24 | Agree |
|---|---|---|---|
| Checkbox box | 18 dp, 2 dp border, 2 dp radius | 24 px `v-icon` drawing the `check_box` glyph (18 dp box inside a 24 dp icon) | yes (glyph), extra 24 px box |
| Radio | 20 dp ring, 10 dp dot | 24 px `radio_button_checked` glyph (20 dp ring, 10 dp dot) | yes |
| Switch track | 36 x 14 dp | input box 38px, track `left: 2px; right: 2px` = 34 px wide, 14px tall, radius 8px | no (34 vs 36 dp) |
| Switch thumb | 20 dp | 20px | yes |
| Switch thumb travel | 16 dp | `translate(16px, 0)` | yes |
| Switch track opacity, on | 50 % of accent | `opacity: .6` on `currentColor` | no (.6 vs .5) |
| Switch thumb off, light | Grey 50 | `selection-controls.thumb.inactive: $grey.lighten-5` (#FAFAFA) | yes |
| Switch thumb disabled, light | Grey 400 | `thumb.disabled: $grey.lighten-1` (#BDBDBD) | yes |
| Switch track off, light | 38 % black | `track.inactive: rgba(0,0,0,.38)` | yes |
| Switch track disabled, light | 12 % black | `track.disabled: rgba(0,0,0,.12)` | yes |
| Switch thumb off, dark | Grey 400 | `$grey.lighten-1` | yes |
| Switch thumb disabled, dark | Grey 800 | `$grey.darken-3` (#424242) | yes |
| Switch track off, dark | 30 % white | `rgba(255,255,255,.3)` | yes |
| Switch track disabled, dark | 10 % white | `rgba(255,255,255,.1)` | yes |
| Switch thumb elevation | not found | `elevation(4)` | n/a |
| Checkbox and radio off, light | 54 % black | icon color from `icons.active: rgba(0,0,0,.54)` | yes |
| Checkbox and radio off, dark | 70 % white | `icons.active: $shades.white` (100 %) | no |
| Disabled, light | 26 % black | `buttons.disabled: rgba(0,0,0,.26)` | yes |
| Disabled, dark | 30 % white | `buttons.disabled: rgba(255,255,255,.3)` | yes |
| Disabled label, radio | not found | `label` color `text.disabled` (.38 light, .5 dark) | n/a |
| Halo size | 48 dp | `__ripple` 34px, focus `:before` scale(.8) = 27 px; pressed ripple container scale(1.4) = 48 px | pressed yes, focus no |
| Halo opacity | 6 to 10 % (measured) | focus `:before` opacity .2; ripple `$ripple-animation-visible-opacity: .15` | no |
| Halo on desktop | none | always rendered | no |
| Control to label gap | not found | `margin-right: 8px` (RTL: left) | n/a |
| Radio spacing | not found | `.v-radio` margin-right 16px; column group 8px between radios | n/a |
| Transitions | not found | `.3s cubic-bezier(.25,.8,.25,1)` | n/a |
