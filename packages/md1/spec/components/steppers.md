# Steppers (Material Design 1)

## Sources

- Spec page: https://m1.material.io/components/steppers.html (the MD1 guidelines Google hosts as an archive; fetched 2026-10-22, served gzip-encoded).
- Spec sheets read visually and measured in pixels; all sheets render at 2 px per dp (calibrated on the 24 dp callouts, 48 px). Base URL `https://storage.googleapis.com/material-io-design/m1/assets/`:
  - `0Bzhp5Z4wHba3cGdLMGNvSWltT0k/components-acux-stepper-standard-rl.png` (horizontal step specs)
  - `0Bzhp5Z4wHba3OXNxYnA5eXBsdFU/components-acux-stepper-optstp-rl.png` (optional step specs)
  - `0Bzhp5Z4wHba3ekNTYlFETnNtcEE/components-acux-stepper-multilnerr-rl.png` (multi-line error)
  - `0Bzhp5Z4wHba3ckl6ZHZMQlVDQVk/components-acux-stepper-altlblplace-rl.png`, `0Bzhp5Z4wHba3UDEtWWhiZ2tXaGc/components-acux-stepper-altlblplaceoptstp-rl.png`, `0B7WCemMG6e0VMWxJVzRSTGFfTGc/components-acux-stepper-altlblplerr-rl.png` (alternative label specs)
  - `0Bzhp5Z4wHba3SkhBb3hZUkwwOUk/...-hvrhoriz.png`, `0Bzhp5Z4wHba3MTRpY1FXZTVzRjA/...-hvrvert.png`, `0Bzhp5Z4wHba3V3BOSmFLMUZnSlU/...-prssdhoriz.png`, `0Bzhp5Z4wHba3bG9mUW5aWG55VTA/...-prssdvert.png` (hover and pressed)
  - `0Bzhp5Z4wHba3YlpTYXptWTI5SE0/components-acux-stepper-vertstep-rl.png`, `0Bzhp5Z4wHba3bWxMVGZ6UXluZ3c/...-vertstpsubstp-rl.png` (vertical specs)
  - `0Bzhp5Z4wHba3TmJwZGJ1TldHZ0k/components-acux-stepper-mblinpgstp-rl.png` (mobile vertical specs), `0Bzhp5Z4wHba3UU1OWGpoZEZzY0k/...-mbltypog.png`, `0Bzhp5Z4wHba3RmtucktsTHZjZjQ/...-mbldots.png`, `0Bzhp5Z4wHba3c3B1d3hPclRTYk0/...-mblprgrssbr.png` (mobile steppers)
  - usage images: `vertstep`, `editable`, `noneditable`, `optstps`, `horizstep`, `linear`, `nonlinear`, `altlblplcmnt`, `altlblplcmntoptstp`, `mblvertinpg`, `avoid`
- Vuetify 1.5.24: `packages/vuetify/src/stylus/components/_steppers.styl`, `settings/_theme.styl` (`stepper`, `disabledORhints-text-percent`, `secondary-text-percent`, `divider-percent`), `settings/_variables.styl` (`$transition`).

Confidence: `high` = page text or sheet callout; `moderate` = measured from a sheet or Vuetify 1.5 stylus; `low` = memory.

## 1. Purpose and usage

| Rule | Confidence |
|---|---|
| Steppers convey progress through numbered steps; they display progress through a sequence of logical and numbered steps and may also be used for navigation. | high |
| Use when a field determines a subsequent field. Horizontal steppers are ideal when the contents of one step depend on an earlier step. | high |
| Avoid using steppers to break up sections in a short form, or multiple times on one page. Do not embed steppers within steppers. | high |
| Avoid long step names in horizontal steppers. | high |
| Vertical steppers are designed for narrow screens and are ideal for mobile; keep each step's content responsive. | high |
| Steppers may display a transient feedback message after a step is saved; use feedback only when there is long latency between steps. | high |
| Mobile: use dots when the number of steps is not large; use a progress bar when there are many steps or steps may be inserted during the process based on earlier responses; use text ("Step 4 of 6") as the plain variant. | high |
| Optional steps within a linear flow must be marked as optional. | high |

## 2. Types and variants

| Type | Definition | Visual difference | Confidence |
|---|---|---|---|
| Editable step | may be returned to and edited within a session | completed editable step shows a pencil glyph in the primary circle (sheet `editable.png`) | high (text), moderate (pencil, sheet only) |
| Non-editable step | cannot be edited after completion; also when editing poses a distraction risk | completed step shows a check glyph in the primary circle | high |
| Optional step | marked with an "Optional" sub-label | 12 sp Regular 54 % black under the label | high |
| Error step | step with an error | red warning triangle replaces the circle; label and error message in red; label Medium | high (sheet) |
| Horizontal stepper | names and numbers on a horizontal bar; the bar may be fixed to the top of the page when scrolling | 72 dp bar | high |
| Horizontal, alternative label placement | labels centered below the circles, steps in equal parts | 104 dp bar | high |
| Vertical stepper | steps stacked, content expands under the active step | see metrics | high |
| Linear stepper | each step must be completed before the next | inactive labels 38 % black | high |
| Non-linear stepper | enter the flow at any point, steps in any order | inactive labels 54 % black; hover and pressed states on steps | high |
| Mobile stepper, text | "Step 4 of 6" in a bar under the app bar; BACK and NEXT in a bottom bar | 48 dp text bar, 56 dp bottom bar (measured) | high (type), moderate (metrics) |
| Mobile stepper, dots | dots in the bottom bar | 8 dp dots, 16 dp pitch (measured) | high (type), moderate (metrics) |
| Mobile stepper, progress bar | determinate bar in the bottom bar | 3 dp tall, 112 dp wide (measured) | high (type), moderate (metrics) |
| Stepper feedback | transient message after a step is saved | video only, no metrics | high |

## 3. Anatomy

| Part | Content | Confidence |
|---|---|---|
| Step circle | 24 x 24 dp, 12 sp Roboto Regular number in white; completed: check glyph; completed editable: pencil glyph; error: warning triangle in red, no circle | high |
| Label (step name) | 14 sp Roboto Medium (active) or Regular (others) | high |
| Sub-label | "Optional", a summary ("Summary if needed"), or the error message; 12 sp Roboto Regular | high |
| Connector line | 1 dp line between steps (horizontal: between label and next circle; vertical: below the circle) | high |
| Content area (vertical) | the active step's form content, indented to the label keyline | high |
| Step actions (vertical) | CONTINUE (raised, primary) and CANCEL (flat) under the content | high (sheet) |
| Header bar (horizontal) | 72 dp (standard) or 104 dp (alternative label) container holding the steps | high |
| Mobile bottom bar | BACK (chevron left) and NEXT (chevron right) text buttons with dots, progress bar, or nothing between them | high |
| Feedback message | transient text after save | high |

## 4. Metrics and keylines

### Horizontal, standard

| Metric | Value | Confidence |
|---|---|---|
| Step height (bar height) | 72 dp | high |
| Circle | 24 x 24 dp (48 px measured) | high |
| Circle number | 12 sp Roboto Regular | high |
| Icon top, bottom and left padding | 24 dp | high |
| Icon right padding (circle to label) | 8 dp | high |
| Label | 14 sp Roboto Medium (active), 14 sp Roboto Regular (inactive and completed) | high |
| Label to connector padding | 8 dp | high (optional-step sheet) |
| Connector to next circle padding | 8 dp | high |
| Connector thickness | 1 dp (2 px measured) | moderate |
| Optional sub-label | 12 sp Roboto Regular, directly under the label, same left keyline | high |
| Error step | warning glyph 24 dp replaces the circle (sheet); label 14 sp Medium red; message 12 sp red; the step grows to two lines inside the 72 dp bar | moderate |

### Horizontal, alternative label placement

| Metric | Value | Confidence |
|---|---|---|
| Step height | 104 dp | high |
| Top padding (edge to circle) | 24 dp | high (sheet) |
| Label top padding (circle to label) | 16 dp | high |
| Label bottom padding | 24 dp | high |
| Icon and label padding from edge | 24 dp | high |
| Icon left and right padding (to connector) | 8 dp | high |
| Step left and right padding | 16 dp per the text; the optional-step sheet draws 32 dp around the highlighted step | high (text) with a sheet discrepancy |
| Step widths | equal parts | high (sheet) |
| Label alignment | centered under the circle; sub-label centered under the label | high (sheet) |
| Connector | between circles, 8 dp from each circle | high |

### Vertical

| Metric | Value | Confidence |
|---|---|---|
| Icon left padding (edge to circle) | 24 dp | high |
| Icon to label horizontal gap | 12 dp | high (sheet callout) |
| Icon alignment with label | center vertical | high |
| Label top padding (step top to label) | 24 dp | high |
| Icon top and bottom padding (circle to connector) | 8 dp | high |
| Label bottom padding (label to content) | 16 dp | high |
| Content left keyline | aligned with the label (24 + 24 + 12 = 60 dp) | high (sheet) |
| Content right margin | 24 dp on the mobile sheet; the desktop sheet draws 48 dp without a callout | moderate |
| Button top padding (content to buttons) | 16 dp (desktop text); the mobile sheet draws 8 dp | high / moderate |
| Button height | 48 dp (the sheet draws the button row at 48 dp; the MD1 button itself is 36 dp with a 48 dp touch target, see the buttons note) | high |
| Gap between CONTINUE and CANCEL | 8 dp | high (sheet) |
| Vertical space between steps (below the button row to the next label) | 48 dp | high |
| Connector | 1 dp, vertical, centered under the circle, 8 dp clear of each circle | moderate |
| Sub-steps | a vertical stepper may contain sub-steps (sheet `vertstpsubstp`) | high |

### Mobile vertical (in page)

| Metric | Value | Confidence |
|---|---|---|
| Icon top and bottom padding | 8 dp | high |
| Label top padding | 24 dp | high |
| Label bottom padding (no sub-label) | 16 dp | high |
| Vertical space below an inactive step | 40 dp | high |
| Vertical space below the active step | 48 dp | high |
| Button height | 48 dp | high |
| Content to button row | 8 dp (sheet) | moderate |
| Left keyline | 24 dp to the circle, label at 60 dp | moderate (sheet) |

### Mobile steppers (bottom bar)

| Metric | Value | Confidence |
|---|---|---|
| Bottom bar height | 56 dp (96 px measured) | moderate |
| Bottom bar fill | light grey (#EEEEEE measured) | moderate |
| BACK and NEXT | 14 sp Medium all caps text buttons with chevrons, 16 dp from the edges | moderate |
| Dots | 8 dp diameter, 16 dp center pitch (8 dp gap), centered in the bar | moderate |
| Progress bar | 3 dp tall, 112 dp wide, centered in the bar | moderate |
| Text variant bar | "Step 4 of 6", 14 sp Regular 87 % black (cap height 10 dp measured), in a 48 dp bar directly under the app bar, 16 dp left keyline, with a shadow below | moderate |

## 5. Color

| Part | Light theme | Confidence |
|---|---|---|
| Active circle | primary color; default Google Blue 500 (#4285F4 in the sheets) | high |
| Active circle number | white 100 % | high |
| Active label | 87 % black, Medium | high |
| Completed circle | primary with a white check (or pencil if editable) | high (sheet) |
| Completed label | 87 % black, Regular (sheets); Vuetify uses .87 | moderate |
| Inactive circle | 38 % black (#9E9E9E on white) | high |
| Inactive circle number | 100 % white | high |
| Inactive label, linear | 38 % black | high |
| Inactive label, non-linear | 54 % black | high |
| Optional sub-label | 54 % black | high |
| Connector line | "Grey 400 color value" (#BDBDBD) per the text; the sheets render #E0E0E0 (Grey 300) | high (text), discrepancy noted |
| Error glyph, label and message | red (#F44336 family in the sheets; exact swatch not stated) | moderate |
| Hover and pressed background (non-linear) | 6 % black per the text; the sheets render #F5F5F5 (about 4 % black) | high (text), discrepancy noted |
| Dark theme | not found (no dark sheet on the page) | high (absence) |

## 6. Elevation

| Item | Value | Confidence |
|---|---|---|
| Horizontal header and stepper surface | drawn as a card with a shadow in every sheet; numeric elevation not found | high (absence) |
| Mobile bottom bar | shadow visible in the sheets; value not found | high (absence) |
| Vuetify 1.5 | `elevation(2)` on `.v-stepper` and `.v-stepper__header` | moderate |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Step change, content expand and collapse | not found | high (absence) |
| Feedback message | transient, shown after a step is saved (video only) | high |
| Pressed | ripple circle grows from the touch point over the step (sheets `prssdhoriz`, `prssdvert`) | moderate |
| Vuetify 1.5 | `.3s cubic-bezier(.25,.8,.25,1)` on the circle and label, `.3s cubic-bezier(.25,.8,.5,1)` on content and wrapper once booted | moderate |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Active | primary circle, Medium 87 % label | high |
| Completed | primary circle with check; pencil when editable | high |
| Inactive | 38 % circle, 38 % (linear) or 54 % (non-linear) label | high |
| Optional | "Optional" sub-label 12 sp 54 % | high |
| Error | red warning glyph, red Medium label, red message | high |
| Hover (non-linear or editable steps) | 6 % black background over the whole step cell (horizontal: full bar height, step width; vertical: full row) | high |
| Pressed | 6 % black circular ripple from the press point, same tone | high (text) |
| Focus | not found | high (absence) |
| Disabled | not found (inactive is the only muted state) | high (absence) |
| Overlay opacities on dark surfaces | not found | high (absence) |

## 9. Behavior

| Rule | Confidence |
|---|---|
| Linear: each step must be completed before proceeding to the next. | high |
| Non-linear: steps may be completed in any order; the user may enter at any point. | high |
| Editable: a completed step may be reopened and edited within the session. | high |
| Non-editable: completed steps are locked. | high |
| Optional steps may be skipped and must be labelled "Optional". | high |
| Horizontal bar may be fixed to the top of the page when scrolling down. | high |
| Feedback: a transient message after save, only with long latency. | high |
| Mobile: BACK and NEXT in the bottom bar advance the flow. | high |
| Limits on the number of steps: not found (dots are for "not large" counts, the progress bar for many). | high (absence) |

## 10. Web notes

- Maps 1:1: 72 dp and 104 dp header bars, 24 dp circles, the 24 / 8 / 12 / 16 dp paddings, 1 dp connectors, the three mobile bar variants.
- Needs interpretation: "fixed to the top when scrolling" is `position: sticky`; the mobile stepper is a layout choice (bottom bar) rather than a breakpoint rule, since the page gives no breakpoint; the "button height 48 dp" callout conflicts with the 36 dp MD1 button and should be read as a 48 dp action row.
- The sheets draw hover at #F5F5F5 and the connector at #E0E0E0 while the text says 6 % and Grey 400; follow the text, record the drift in SPEC.md.
- WAI-ARIA: there is no dedicated stepper pattern. Render the steps as an ordered list with `aria-current="step"` on the active step; interactive step headers (non-linear, editable) follow the Button pattern; when the header switches visible panels follow the Tabs pattern; the mobile progress bar and dots use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a "Step N of M" text alternative. The spec says nothing about keyboard; name the pattern, do not write one.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 (`_steppers.styl`) | Agree |
|---|---|---|---|
| Horizontal bar height | 72 dp | `.v-stepper__header` height 72px | yes |
| Step padding | 24 dp top, bottom, left | `.v-stepper__step` padding 24px | yes |
| Circle | 24 dp | `.v-stepper__step__step` 24px, min-width 24px | yes |
| Circle number | 12 sp | font-size 12px | yes |
| Circle to label gap, horizontal | 8 dp | margin-right 8px | yes |
| Circle to label gap, vertical | 12 dp | `--vertical` margin-right 12px | yes |
| Glyph inside circle | not stated | `.v-icon` 18px | n/a |
| Error glyph | 24 dp (sheet) | error `.v-icon` 24px, transparent circle | yes |
| Error label weight | Medium | font-weight 500, color inherit | yes |
| Inactive circle | 38 % | `rgba(fg, .38)` | yes |
| Inactive label, linear | 38 % | `rgba(fg, .38)` | yes |
| Inactive label, non-linear | 54 % | `--non-linear` label `rgba(fg, .54)` | yes |
| Sub-label size and weight | 12 sp Regular | `small` 12px, weight 300 | no (300 vs 400) |
| Sub-label color | 54 % | `small` `rgba(fg, .54)` | yes |
| Completed label | 87 % (sheets) | `$material.stepper.completed` = rgba(0,0,0,.87) | yes |
| Active circle | primary | `$material.stepper.active` (white text), background set by the JS color class | yes |
| Hover | 6 % black | `--editable:hover` `rgba(fg, .06)` | yes |
| Hover on circle | not stated | inactive editable hover circle `rgba(0,0,0,.54)` | Vuetify extra |
| Connector color | Grey 400 | `.v-divider` `rgba(fg, .12)` (= #E0E0E0 on white, the sheet value) | no vs text, yes vs sheet |
| Connector margin | 8 dp from circle and label | `.v-divider` margin `0 -16px` (pulls into the 24px padding, leaving 8px) | yes |
| Alternative label height | 104 dp | `--alt-labels` header height auto, circle margin-bottom 11px, step flex-basis 175px | no (not fixed; 11 vs 16 dp label top padding) |
| Equal parts | yes | flex-basis 175px, not equal flex | no |
| Vertical content indent | 60 dp keyline | content margin-left 36px + padding-left 23px = 59px past the 24px step padding | yes (1 px) |
| Vertical content right margin | 24 dp (mobile sheet) | padding-right 60px, margin-right -36px (24px net) | yes |
| Vertical label bottom padding | 16 dp | `--vertical .v-stepper__step` padding 24px 24px 16px | yes |
| Content to buttons | 16 dp | `.v-stepper__content > .v-btn` margin 24px 8px 8px 0 | no (24 vs 16) |
| Button gap | 8 dp | margin-right 8px | yes |
| Space between steps | 48 dp | `--vertical` padding-bottom 36px, content margin-bottom -16px | no (not 48) |
| Elevation | not found | `elevation(2)` | n/a |
| Mobile dots, text and progress bar variants | three variants | none; `sm-and-down` hides labels only | missing |
| Transitions | not found | `.3s` fast-in-fast-out and swing | n/a |
