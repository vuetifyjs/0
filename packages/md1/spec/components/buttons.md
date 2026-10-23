# Buttons (Material Design 1)

Spec page: Components > Buttons. Covers flat, raised, persistent footer, dropdown, toggle, and icon toggle buttons plus the dense variant. The floating action button has its own note: `buttons-floating-action-button.md`.

## Sources

| Tag | URL | Snapshot | Used for |
|---|---|---|---|
| A18 | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html | 2018-12-25 00:22:55 UTC | primary, authoritative |
| G16 | https://web.archive.org/web/20160604061521/http://www.google.com/design/spec/components/buttons.html | 2016-06-04 06:15:21 UTC | version cross-check only |
| ELEV | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/material-design/elevation-shadows.html | 2018-12-25 00:22:55 UTC | component elevation table |
| MOTION | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/motion/duration-easing.html | 2018-12-25 00:22:55 UTC | durations and curves |
| COLOR | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/style/color.html | 2018-12-25 00:22:55 UTC | text and icon opacities |
| KEY | https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/layout/metrics-keylines.html | 2018-12-25 00:22:55 UTC | touch targets, baseline grid |
| V15 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_buttons.styl`, `_button-toggle.styl`, `_ripples.styl`, `settings/_variables.styl`, `settings/_theme.styl`, `settings/_elevations.styl`, `components/VBtn/VBtn.ts`, `components/VBtnToggle/VBtnToggle.ts` | Vuetify 1.5.24 | cross-check |

Fetch notes: pages were fetched with `curl -sL` over HTTPS (the `http://` form of the archive URL was refused by the sandbox network after the first request) and text was extracted from the static HTML. Redline images on the page carry no alt text, so any value that exists only inside an image is recorded as `not found`.

Confidence legend: `high` = read from the spec page text; `moderate` = from Vuetify 1.5 stylus only; `low` = memory.

## 1. Purpose and usage

- Buttons communicate the action that will occur when the user touches them. They trigger an ink reaction on press and may display text, imagery, or both. Flat and raised buttons are the most commonly used types. (A18, high)
- Context rules (A18, high):

| Context | Button type |
|---|---|
| Dialogs | Flat buttons |
| Inline | Raised or flat buttons |
| Always available | Floating action button or persistent footer buttons |

- Choosing a style depends on primacy, number of containers on screen, and layout. Function: is it important and ubiquitous enough to be a FAB. Dimension: raised or flat depending on the container and how many z-space layers are on screen; there should not be many layers. Layout: use primarily one type of button per container; mix types only with a good reason such as emphasizing an important function. (A18, high)
- Flat buttons: use on toolbars, in dialogs (to unify the action with dialog content), and inline with padding so the user can find them. Flat buttons minimize distraction from content. Do not use flat buttons in UIs where they would be difficult to see. (A18, high)
- Raised buttons: add dimension to mostly flat layouts; emphasize functions on busy or wide spaces; give prominence to actions in layouts with a lot of varying content; help delineate sections of content. Raised buttons appear too prominently inside dialogs. (A18, high)
- Do not use raised buttons within persistent button areas. (A18, high)
- Recommended placement (A18, high):

| Container | Alignment | Order |
|---|---|---|
| Standard dialogs | Right | Affirmative on the right, dismissive on the left |
| Forms | Left | Affirmative on the left, dismissive on the right |
| Cards | Left side preferred for visibility | Flexible, but consistent within the product |
| Non-standard dialogs and modal windows, simple content | Right | Affirmative to the right of dismissive |
| Non-standard dialogs and modal windows, lengthy or complex forms | Left | Affirmative to the left of dismissive |

- Typography: button text is capitalized in languages that have capitalization. For other languages, colored text on flat buttons distinguishes them from normal text. (A18, high)
- Density: when mouse and keyboard are the primary input methods, button measurements can be slightly reduced to accommodate dense UIs. (A18, high)

## 2. Types and variants

| Type | Definition (A18) | Own metrics | Confidence |
|---|---|---|---|
| Flat button | Text-only button made of ink; displays ink reactions on press but does not lift; fills with color on press | Section 4, row "Flat" | high |
| Raised button | Typically rectangular material button that lifts and displays ink reactions on press; behaves like a piece of material resting on another sheet | Section 4, row "Raised" | high |
| Floating action button | Circular material button that lifts and displays an ink reaction on press | See `buttons-floating-action-button.md` | high |
| Dense button | Reduced flat or raised button for mouse and keyboard UIs | 32dp height, 13pt text | high |
| Persistent footer button | Flat button in a screen footer or dialog footer; persistent and readily available | 48dp tall | high |
| Dropdown button | Displays the current state and a down arrow; menu covers the button on interaction; states shown as strings, palette, or icons | Desktop dropdown paddings only | high |
| Generic overflow dropdown button | Displays an arrow or menu button by default; pressing an option navigates to further settings | not found | high (definition) |
| Segmented dropdown button | Two sections: current state (fires the action) and arrow (opens the options) | not found | high (definition) |
| Editable segmented dropdown button | Segmented dropdown whose displayed state is text editable (font size picker) | not found | high (definition) |
| Toggle buttons | Group related options; exclusive selection (one at a time) or multiple selection | Group of at least 3; per-button metrics not found | high |
| Icon toggles | Single choice selected or deselected (star), in app bars, toolbars, action buttons, or toggles; bounded or unbounded ripple | Icon metrics not on page | high |
| Button groups | The page defines no "button group" beyond toggle buttons. A toggle button group is the only grouped button construct in MD1. | n/a | high |
| Outline, block, pill, large | Not in MD1 (Vuetify 1.5 additions) | n/a | moderate |

Three standard types are named explicitly: floating action button, raised button, flat button. (A18, high)

## 3. Anatomy

| Part | Applies to | Notes | Confidence |
|---|---|---|---|
| Container | Raised, dense, persistent footer | Rectangular sheet of material, 2dp corner radius | high |
| Ink surface (no container) | Flat | "Printed on material"; fills with color on press | high |
| Label text | All text buttons | Button type style, capitalized | high |
| Icon | Icon toggles, icon-in-button | Icon-in-button sizing is not on the page: not found | high (absence) |
| Ink ripple | All | Ink reaction on press; icon toggles may use bounded or unbounded ripples | high |
| Focus overlay | Flat, raised | 12% opacity overlay on focus | high |
| Dropdown arrow | Dropdown buttons | Down arrow next to the current state | high |
| Segment | Segmented dropdown | Current-state segment plus arrow segment | high |
| Editable field | Editable segmented dropdown | Displayed state becomes text editable | high |
| Divider | Persistent footer in scrollable dialogs | A divider is added above the persistent footer button | high |

## 4. Metrics and keylines

Mobile and desktop share the same values unless a row says otherwise.

| Metric | Value | Type / theme | Source | Confidence |
|---|---|---|---|---|
| Height | 36dp | Flat, raised | A18 | high |
| Touchable target height | 48dp | All | A18, KEY | high |
| Touch target minimum size | 48dp x 48dp, with 8dp or more between targets | All | KEY | high |
| Minimum width | 88dp | Flat, raised | A18 | high |
| Minimum width (2016 text) | 64dp | Flat, raised | G16 | high (superseded; A18 wins) |
| Corner radius | 2dp | Flat, raised, dense | A18 | high |
| Text left and right padding | 16dp | Default and dense | A18 | high |
| Horizontal margin between buttons | 8dp | Flat buttons in dialogs | A18 | high |
| Horizontal padding | 8dp | Flat buttons in dialogs (keyline figure) | A18 | high |
| Button text | 14pt Roboto Medium (14sp on web); type style Button; capitalized | Default | A18 | high |
| Dense height | 32dp | Dense | A18 | high |
| Dense text | 13pt Roboto Medium (13sp); padding 16dp; radius 2dp | Dense | A18 | high |
| Persistent footer button height | 48dp | Persistent footer | A18 | high |
| Dialog text padding | 24dp | Flat buttons in dialogs | A18 | high |
| Dialog button container height | 52dp | Flat buttons in dialogs | A18 | high |
| Dialog buttons padding from container edges | 8dp, aligned right for LTR scripts | Flat buttons in dialogs | A18 | high |
| Dialog button top margin | 24dp | Flat buttons in dialogs | A18 | high |
| Dialog button width | Varies with text length | Flat buttons in dialogs | A18 | high |
| Desktop dropdown top and bottom padding | 16dp | Desktop dropdown (app bar) | A18 | high |
| Desktop dropdown left padding | 24dp | Desktop dropdown | A18 | high |
| Desktop dropdown right margin | 16dp | Desktop dropdown | A18 | high |
| Desktop dropdown horizontal space between font styles | 24dp | Desktop dropdown | A18 | high |
| Toggle button group size | At least 3 buttons | Toggle buttons | A18 | high |
| Toggle button height, width, radius, divider | not found | Toggle buttons | A18 | high (absence) |
| Icon toggle icon size | not found on page; KEY gives icon 24dp inside a 48dp touch target | Icon toggles | A18, KEY | high |
| Icon-in-button sizing and icon-to-text gap | not found | Flat, raised | A18 | high (absence) |
| Vertical spacing between stacked buttons | not found | All | A18 | high (absence) |
| Baseline grid | 8dp square grid for components; 4dp for toolbar iconography and type | All | KEY | high |

Type styles: label text uses the Button style (14sp Medium, all caps). Dense uses 13sp Medium, which is not a named style in the MD1 scale. (A18 values high; style name mapping low, confirm against the Typography note.)

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Flat text, normal | Colored text (accent or primary) distinguishes flat buttons from normal text; exact role not fixed by the page | same | A18, COLOR | high |
| Flat, pressed overlay | 40% #999999 | 25% #CCCCCC | A18 | high |
| Flat, disabled text | 26% #000000 | 30% #FFFFFF | A18 | high |
| Flat, focus overlay | 12% opacity (of the button's ink color) | 12% | A18 | high |
| Raised container, normal | Theme color 500 (page states "Normal color: 500" in the dark theme block; the light block omits it) | 500 | A18 | high |
| Raised container, pressed | not found in light block | 700 | A18 | high |
| Raised, focused | 12% #000000 shade over the color | 12% #000000 shade over the color | A18 | high |
| Raised, disabled container | 12% #000000 | 12% #FFFFFF | A18 | high |
| Raised, disabled text | 26% #000000 | 30% #FFFFFF | A18 | high |
| Raised, desktop 0dp variant | Disabled text 30% #FFFFFF, disabled button 12% #FFFFFF (page labels this block "Dark/Light theme") | same | A18 | high |
| Text on a colored raised container | White text on colored backgrounds at 100% | same | COLOR | high |
| Icon toggle icon | Active icon 54% #000000, inactive icon 38% #000000 | Active 100% #FFFFFF, inactive 50% #FFFFFF | COLOR | high |
| Icon toggle focus indicator | Color and opacity are related to the color of the icon; value not found | same | A18 | high |
| Secondary color usage | Secondary (accent) color is recommended for buttons, floating action buttons, and button text; primary color accents selected buttons | same | COLOR | high |
| Raised default (uncolored) container | not found in spec text | not found | A18 | high (absence) |
| Raised default container, Vuetify | #F5F5F5 (grey lighten-4, `$material-light.app-bar`) | #212121 (grey darken-4) | V15 | moderate |
| Default text, Vuetify | rgba(0,0,0,0.87) | #FFFFFF | V15 | moderate |

## 6. Elevation

| State | Flat | Raised (mobile) | Raised (desktop only) | Source | Confidence |
|---|---|---|---|---|---|
| Resting | 0dp | 2dp | 0dp | A18, ELEV | high |
| Hover | 0dp | not found | gains 2dp on hover ("On desktop, raised buttons can gain this elevation on hover") | A18 | high |
| Pressed | 0dp | 8dp | 2dp | ELEV | high |
| Focused | 0dp | not found (overlay only) | not found | A18 | high (absence) |
| Disabled | 0dp | not found | not found | A18 | high (absence) |
| Dropdown menu surface | 8dp (menu) | | | ELEV | high |
| Persistent footer | not found | | | A18 | high (absence) |

Desktop resting elevation is 2dp below the listed mobile values as a general rule. (ELEV, high)

## 7. Motion

| Transition | Pattern | Duration | Easing | Source | Confidence |
|---|---|---|---|---|---|
| Press (all) | Ink reaction (ripple) from the touch point | not found on page | not found on page | A18 | high (pattern) |
| Flat press | Fills with color on press; no lift | not found | not found | A18 | high |
| Raised press | Lifts (2dp to 8dp) and fills with color | not found | not found | A18, ELEV | high |
| Dropdown open | Menu covers the button and displays the possible states; pressing a state dismisses the menu and updates the button; scrolling behaves like a menu | not found | not found | A18 | high |
| Generic guidance | Mobile transitions typically 300ms; entering 225ms; leaving 195ms; above 400ms feels slow; desktop 150ms to 200ms; tablet about 30% longer than mobile | | Standard curve cubic-bezier(0.4, 0.0, 0.2, 1); deceleration cubic-bezier(0.0, 0.0, 0.2, 1) for entering; acceleration cubic-bezier(0.4, 0.0, 1, 1) for leaving; sharp cubic-bezier(0.4, 0.0, 0.6, 1) | MOTION | high |
| Vuetify 1.5 button transition | box-shadow, background, color | 300ms | cubic-bezier(0.25, 0.8, 0.5, 1) ("swing", not a spec curve) | V15 | moderate |
| Vuetify 1.5 ripple | transform in 250ms fast-out-slow-in plus opacity in 100ms; opacity out 300ms; peak opacity 0.25 (set inline by `directives/ripple.ts`; the `$ripple-animation-visible-opacity := .15` stylus variable is never consumed) | | cubic-bezier(0.4, 0.0, 0.2, 1) | V15 | moderate |
| Vuetify 1.5 elevation mixin | `elevationTransition` 280ms cubic-bezier(0.4, 0, 0.2, 1) (defined, not applied to buttons) | | | V15 | moderate |

## 8. States

Overlay opacities as the page states them. "not found" means the page shows the state only as an image.

| State | Flat, light | Flat, dark | Raised, light | Raised, dark | Icon toggle | Toggle group | Dropdown | Confidence |
|---|---|---|---|---|---|---|---|---|
| Normal | Transparent container, colored text | same | Theme color 500, 2dp | 500, 2dp | Active icon 54% black / inactive 38% black (light); 100% / 50% white (dark) | Image only: values not found | Image only | high |
| Hover | not found | not found | Desktop: elevation 0dp to 2dp; overlay not found | same | Image only: not found | not found | Image only | high (absence) |
| Focus | 12% overlay | 12% overlay | 12% #000000 shade over the color | 12% #000000 shade over the color | Indicator color and opacity related to the icon color | Focus may display on the whole segment group simultaneously | Image only | high |
| Pressed | 40% #999999 | 25% #CCCCCC | Ripple plus 8dp | Color 700 plus ripple plus 8dp | Ripple, bounded or unbounded beyond the touch target | Pressed may display on the whole segment group | Image only | high |
| Disabled | Text 26% #000000 | Text 30% #FFFFFF | Container 12% #000000, text 26% #000000, no shadow | Container 12% #FFFFFF, text 30% #FFFFFF | "Inactive" state shown as image: not found | not found | not found | high |
| Selected / active | n/a | n/a | n/a | n/a | Selected (star added) vs deselected | Exclusive: one selected deselects the rest; multiple: several selected | Displays the selected state as its label | high |
| Error | not found | not found | not found | not found | not found | not found | not found | high (absence) |
| Vuetify 1.5 | hover, focus, active: currentColor overlay at 12%; hover overlay disabled under `(hover: none)`; pressed: ripple at 25% currentColor (inline `opacity 0.25` in `directives/ripple.ts`; the `.15` stylus variable is unused); disabled text rgba(0,0,0,0.26), disabled raised container rgba(0,0,0,0.12) | hover, focus, active: 12% currentColor; disabled text rgba(255,255,255,0.3), container rgba(255,255,255,0.12) | | | icon buttons: 36px circle, no shadow, same 12% overlay | toggle: inactive opacity 0.4, active opacity 1, group elevation 2dp when any selected | no dedicated component | moderate |

## 9. Behavior

- Dialogs: affirmative on the right and dismissive on the left; buttons right-aligned 8dp from the container edges (LTR); container 52dp tall. Forms: affirmative on the left. (A18, high)
- Persistent footer buttons are 48dp tall flat buttons; raised buttons are not allowed in persistent button areas; a persistent footer button may be used for scrollable dialogs when a divider is added. (A18, high)
- Dropdown button: shows the current state and a down arrow; on interaction a menu covers the button; pressing a state dismisses the menu and updates the button; dropdown scrolling behaves like a menu. Generic overflow dropdown: shows an arrow or menu icon; pressing an option navigates to further settings. Segmented: pressing the current state fires that state's action; pressing the arrow shows all options; selecting one changes the displayed state. Editable segmented: pressing the current state fires the action and makes the state editable; pressing the arrow shows all options. (A18, high)
- Toggle buttons: at least three per group; labeled with text, an icon, or both; recommended combinations are multiple and unselected, exclusive and unselected, exclusive only; exclusive selection deselects any other option; multiple selection allows several (Bold, Italic, Underline). Layout and spacing should convey grouping; focus and pressed states may reinforce the group. (A18, high)
- Icon toggles: allow a single choice to be selected or deselected; best located in app bars, toolbars, action buttons, or toggles. (A18, high)
- Limits: the page sets no limit on the number of buttons per dialog or card; card actions are limited elsewhere (see `cards.md`). (A18, high)
- Scrolling: no scroll behavior is defined for buttons on this page. (A18, high)

## 10. Web notes

- Maps 1:1: height 36px, dense 32px, min-width 88px, radius 2px, side padding 16px, 8px horizontal gap, uppercase 14px/500 label, overlays as a positioned pseudo-element with the stated opacity, elevation as the shadow set for 2dp and 8dp.
- Touch target: the 48px target around a 36px button must be implemented as a transparent hit area (vertical margin or pseudo-element of 6px top and bottom). Vuetify 1.5 does this with `margin: 6px 8px`. (interpretation)
- "Normal color 500 / pressed color 700" maps to the primary (500) and dark primary (700) theme roles; a FAB or accent button uses the accent role instead. Token names are the implementer's choice inside `--md1-*`. (interpretation)
- Hover overlay for flat and raised buttons is not stated in the MD1 page; the 12% focus overlay is the only stated overlay besides pressed. Reusing 12% for hover is a Vuetify convention, not a spec value. (interpretation)
- Dropdown buttons need interpretation: the spec describes behavior, not metrics. Build them from a button plus a menu surface at 8dp.
- Dense mode is a desktop concern (mouse and keyboard primary). Switching on pointer type is an implementation choice; the spec only says "can be slightly reduced".
- WAI-ARIA patterns to follow (names only): flat, raised, dense, persistent footer: APG "Button". Icon toggle and multiple-selection toggle buttons: APG "Button" with `aria-pressed` (toggle button). Exclusive-selection toggle group: APG "Radio Group" semantics (one selected) or a toolbar of toggle buttons with single-select enforcement. Dropdown and generic overflow dropdown: APG "Menu Button". Segmented dropdown: a "Button" plus an adjacent "Menu Button". Editable segmented dropdown: APG "Combobox" (editable, list popup). v0 composition: `Button.Root` for the button itself; selection groups via v0 selection primitives rather than hand-rolled state. (pattern names: high; v0 mapping: interpretation)

## Vuetify 1.5 cross-check

Files: `_buttons.styl`, `_button-toggle.styl`, `settings/_variables.styl`, `settings/_theme.styl`, `_ripples.styl`, `VBtn.ts`, `VBtnToggle.ts`. Only rows with a difference or a Vuetify-only value are listed; matching rows are marked for completeness where the spec value is load-bearing.

| Metric | Spec (A18) | Vuetify 1.5.24 | Verdict |
|---|---|---|---|
| Height | 36dp | `$button-height` 36px | match |
| Minimum width | 88dp | `$button-min-width` 88px | match (G16 said 64dp) |
| Corner radius | 2dp | `$button-border-radius` 2px | match |
| Side padding | 16dp | `$button-padding` 0 16px; small 0 8px; large 0 32px | match; small and large paddings are Vuetify-only |
| Horizontal spacing | 8dp | `$button-margin` 6px 8px | match horizontally; the 6px vertical margin is Vuetify-only (it yields the 48px touch target) |
| Label | 14sp Medium, caps | 14px, weight 500, uppercase | match |
| Dense variant | 32dp, 13sp | `small`: 28px, 13px; `large`: 44px, 15px | discrepancy: Vuetify small is 28px, spec dense is 32dp; large has no spec equivalent |
| Raised elevation | resting 2dp, pressed 8dp | `elevation(2)`, `:active` `elevation(8)` | match |
| Desktop raised | resting 0dp, hover 2dp | no hover elevation; `depressed` gives 0dp permanently | discrepancy |
| Focus overlay | 12% | `:before` currentColor at opacity 0.12 on hover, focus, active | match for focus; hover and active at 12% are Vuetify-only |
| Flat pressed overlay | 40% #999999 light, 25% #CCCCCC dark | theme defines `buttons.pressed` rgba(#999, 0.4) and rgba(#ccc, 0.25) but no stylus rule consumes it; the ripple at 0.25 currentColor (set inline by `directives/ripple.ts`) is used instead | discrepancy (values present, unused) |
| Disabled text | 26% #000000 light, 30% #FFFFFF dark | `buttons.disabled` rgba(0,0,0,0.26) and rgba(255,255,255,0.3) | match |
| Disabled raised container | 12% #000000 light, 12% #FFFFFF dark | `buttons.focused` rgba(0,0,0,0.12) and rgba(255,255,255,0.12) | match |
| Raised default container | not found | `$material.app-bar`: #F5F5F5 light, #212121 dark | Vuetify-only |
| Icon button | not found (icon toggle metrics are image-only) | 36px circle, small 28px, large 44px, no shadow, 50% radius | Vuetify-only |
| Toggle group | at least 3; metrics not found | `.v-btn-toggle`: radius 2px, buttons padding 0 8px, inactive opacity 0.4, 1px right border, `elevation(2)` when any selected | Vuetify-only values |
| Outline, block, round (28px radius) | not in MD1 | present | Vuetify-only |
| Transition | standard curve expected | 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) | discrepancy: not a spec curve |
| Persistent footer button | 48dp flat | no component | gap |
| Dropdown buttons | described | no dedicated component (`v-menu` plus `v-btn`; `v-overflow-btn` is a select) | gap |
| Touch target | 48dp | 36px plus 6px vertical margins | match by construction |
