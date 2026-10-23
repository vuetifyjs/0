# Material Design 1 spec: Motion

Material Design 1 (2014 to 2017 "Material Design" guidelines) motion rules for `@paper/md1`. All durations are in milliseconds (ms). The spec text wins over Vuetify 1.5.24 wherever they differ; every disagreement is recorded in the last section.

Confidence legend: `high` = read from the archived spec page; `moderate` = Vuetify 1.5.24 stylus or TypeScript only; `low` = memory; `not found` = the sources do not state it.

## Sources

Archived spec pages (Wayback Machine; the 2018-12-25 00:22:55 request redirects to the nearest capture):

- https://web.archive.org/web/20181225002146/https://material.io/archive/guidelines/motion/material-motion.html
- https://web.archive.org/web/20181225002212/https://material.io/archive/guidelines/motion/duration-easing.html
- https://web.archive.org/web/20181225002141/https://material.io/archive/guidelines/motion/movement.html
- https://web.archive.org/web/20181225002244/https://material.io/archive/guidelines/motion/transforming-material.html
- https://web.archive.org/web/20210805004105/https://material.io/archive/guidelines/motion/choreography.html (2021-08-05 capture of the archive page; the 2018 capture timed out)
- https://web.archive.org/web/20181225002158/https://material.io/archive/guidelines/motion/creative-customization.html (served capture 2018-12-25 00:21:58 of the 2018-12-25 00:22:55 request; read 2026-10-22 for the creative customization section)
- https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html (supplementary: press, focus and disabled overlay values)
- https://web.archive.org/web/20210805020619/https://material.io/archive/guidelines/patterns/navigation-drawer.html (supplementary: ripple on selection)
- https://web.archive.org/web/20160604084504/http://www.google.com/design/spec/usability/accessibility.html (supplementary: motion accessibility limits; 2016 capture)

Vuetify 1.5.24 cross-check files (`/home/john/sites/vuetify1/packages/vuetify/src/`):

- `stylus/settings/_variables.styl` (`$transition` map, `$primary-transition`, `$secondary-transition`, ripple variables)
- `stylus/settings/_theme.styl` (button hover, focus, pressed and disabled colors)
- `stylus/settings/_elevations.styl` (`elevationTransition`)
- `directives/ripple.ts`, `stylus/components/_ripples.styl`
- `stylus/generic/_transitions.styl`, `stylus/trumps/_transition.styl`
- `stylus/components/_buttons.styl`, `_cards.styl`, `_dialogs.styl`, `_menus.styl`, `_snackbars.styl`, `_bottom-sheets.styl`, `_bottom-navs.styl`, `_overlay.styl`

## Principles

| Principle | Statement | Confidence |
|---|---|---|
| Why motion matters | Motion shows how an app is organized and what it can do: guided focus between views, hints about gesture outcomes, hierarchical and spatial relationships, distraction from background work such as loading, and character and polish | high |
| Responsive | Material responds to input precisely where the user triggers it; ink ripples expand outward from the point of touch; a card lifts to show an active state; new surfaces show their connection to the element or action that created them | high |
| Natural | Movement is inspired by real-world forces: starts and stops are not instantaneous; movement follows an arc rather than a straight line; transformations follow an arc of movement | high |
| Aware | Material is aware of its surroundings and the user; elements are choreographed as they enter; material can push other material out of the way; elements can attract and join other elements | high |
| Intentional | Motion guides focus to the right spot at the right time; it can signal that an action is unavailable and draw attention to elements that need it | high |
| Quick | An interaction never keeps the user waiting; staggering and slowing many elements lengthens the duration | high |
| Clear | Transitions are simple and coherent; avoid many items moving in different directions or crossing paths; keep a clear path into the next view even when elements move as a group | high |
| Cohesive | Speed, responsiveness and intention are consistent throughout the app | high |
| Implication | A good transition guides the user to the next view, transforms the surface to communicate hierarchy, and hides loading behind the transition instead of showing a spinner | high |

## Durations

### Common durations

| Context | Duration | Confidence |
|---|---|---|
| Mobile, typical transition | 300 ms, within a margin of variance | high |
| Mobile, large, complex, full-screen transition | 375 ms | high |
| Mobile, element entering the screen | 225 ms | high |
| Mobile, element leaving the screen | 195 ms | high |
| Mobile, element temporarily leaving and returning | 300 ms | high |
| Mobile, relative movement (entering or exiting element that moves other elements) | 300 ms; slightly longer than independent movement | high |
| Mobile, upper bound | Transitions over 400 ms may feel too slow | high |
| Mobile, larger animations | 300 ms to 400 ms | high |
| Mobile, smaller animations | As short as 150 ms to 200 ms; outside these ranges motion feels sluggish or hard to follow | high |
| Tablet | About 30% longer than mobile; 300 ms becomes 390 ms | high |
| Wearables | About 30% shorter than mobile; 300 ms becomes 210 ms | high |
| Desktop | 150 ms to 200 ms; faster and simpler than mobile; immediately responsive because desktop transitions are less noticeable | high |
| Desktop rationale | Complex web transitions drop frames unless GPU accelerated; shorter durations make dropped frames less noticeable | high |

### Dynamic duration rules

| Rule | Statement | Confidence |
|---|---|---|
| No single duration | Adjust each duration for distance travelled, velocity and surface change | high |
| Leaving elements | May use shorter durations because they need less attention | high |
| Large distances or dramatic surface changes | Use longer durations | high |
| Short distances or minor surface changes | Use shorter durations so movement does not appear slow | high |
| Larger screens | Longer distances raise peak velocity; larger screens get longer durations so movement is not too fast | high |
| Symmetric transformations | Slightly shorter durations than asymmetric ones | high |

Vuetify 1.5 durations (moderate): `$primary-transition := 0.3s $transition.swing`; `$secondary-transition := 0.2s $transition.ease-in-out`; `elevationTransition` 280 ms standard curve; `.transition-*` trump classes 0.3 s; `transition-default()` move 0.6 s; dialog 0.3 s and its backdrop container 0.2 s; menu 0.3 s with list tiles delayed 0.1 s; snackbar transform 0.4 s with content opacity 0.3 s after 0.1 s; bottom sheet 0.3 s; overlay 0.3 s after a 150 ms delay; card hover 0.4 s; bottom navigation 0.4 s; expansion panel 0.3 s; footer 0.2 s; dialog "animated" nudge 0.15 s scaling to 1.03. Vuetify uses one 300 ms value for entering and leaving; the spec's 225 ms and 195 ms are not implemented.

## Easing curves

| Curve | CSS | Android | iOS control points | After Effects | Use | Confidence |
|---|---|---|---|---|---|---|
| Standard ("ease in out") | `cubic-bezier(0.4, 0.0, 0.2, 1)` | `FastOutSlowInInterpolator` | 0.4, 0.0, 0.2, 1.0 | outgoing 40%, incoming 80% | The most common curve: quick acceleration, slow deceleration between on-screen locations; growing and shrinking material; all on-screen movement and all on-screen surface transformations; relative movement in and out of the screen | high |
| Deceleration ("ease out") | `cubic-bezier(0.0, 0.0, 0.2, 1)` | `LinearOutSlowInInterpolator` | 0.0, 0.0, 0.2, 1.0 | outgoing 0%, incoming 80% | Elements entering the screen at full velocity and decelerating to rest; they may scale up to 100% size or opacity, or shrink slightly from a larger size when entering at 0% opacity | high |
| Acceleration ("ease in") | `cubic-bezier(0.4, 0.0, 1, 1)` | `FastOutLinearInInterpolator` | 0.4, 0.0, 1.0, 1.0 | outgoing 40%, incoming 0% | Elements permanently leaving the screen at full velocity with no deceleration off-screen; they may scale down to 0% size or opacity | high |
| Sharp ("ease in out", symmetrical) | `cubic-bezier(0.4, 0.0, 0.6, 1)` | none listed | none listed | outgoing 40%, incoming 40% | Elements that leave the screen temporarily and may return at any time; quick acceleration from on-screen, symmetrical quick deceleration to a resting point just off-screen | high |

| Rule | Statement | Confidence |
|---|---|---|
| Properties affected | The curves apply to speed, opacity and scale | high |
| Smoothness | Acceleration and deceleration change smoothly across the duration so movement is not mechanical | high |
| Asymmetry | Motion feels more natural when acceleration and deceleration are asymmetrical | high |

Vuetify 1.5 `$transition` map (moderate): `fast-out-slow-in: cubic-bezier(0.4, 0.0, 0.2, 1)` (standard), `linear-out-slow-in: cubic-bezier(0.0, 0.0, 0.2, 1)` (deceleration), `fast-out-linear-in: cubic-bezier(0.4, 0.0, 1, 1)` (acceleration), `ease-in-out: cubic-bezier(0.4, 0.0, 0.6, 1)` (sharp), plus two non-spec curves `fast-in-fast-out: cubic-bezier(.25, .8, .25, 1)` and `swing: cubic-bezier(.25, .8, .50, 1)`. Vuetify's default `$primary-transition` uses `swing`, not the standard curve.

Token plan for Material Design 1: `--md1-easing-standard`, `--md1-easing-decelerate`, `--md1-easing-accelerate`, `--md1-easing-sharp`; `--md1-duration-enter: 225ms`, `--md1-duration-leave: 195ms`, `--md1-duration-standard: 300ms`, `--md1-duration-complex: 375ms`, with a desktop scale that lands inside 150 ms to 200 ms.

## Movement

### Within screen bounds

| Rule | Statement | Confidence |
|---|---|---|
| Arc | Movement between two on-screen points follows a natural, concave arc; all on-screen movement uses the standard curve | high |
| Arc upward | Rising takes effort: begin with a shallow ascent and end with a steep ascent; never start steep | high |
| Arc downward | Falling is accelerated by gravity: begin with a steep descent and end shallow; never start shallow | high |
| When not to arc | Elements moving along a single axis (horizontal or vertical, not both) move straight and may move slightly faster | high |
| Entering and exiting | Elements entering or exiting the screen move along a single axis in a straight line; arcing an exit complicates the entry point | high |

### In and out of screen bounds

| Case | Curve | Mobile duration | Confidence |
|---|---|---|---|
| Independent element entering (does not move other content) | Deceleration | 225 ms | high |
| Independent element permanently leaving | Acceleration; shorter because it needs less focus | 195 ms | high |
| Independent element temporarily leaving (may return from the same exit point) | Sharp on exit; deceleration on return | 300 ms | high |
| Element leaving to return from a different location | Acceleration on exit; deceleration on return | not stated | high |
| Relative movement (an entering or exiting element moves on-screen elements, for example a card pushing a FAB) | Standard curve for both the mover and the moved; never acceleration or deceleration curves, which start and stop abruptly | 300 ms | high |
| Standard curve for independent elements | Do not use it: entrances need no slow acceleration and exits need no slow deceleration | n/a | high |

## Transforming material

### Rectangular transformation

| Rule | Statement | Confidence |
|---|---|---|
| Curve | All on-screen surface transformations use the standard curve | high |
| Asynchronous width and height | Width and height change asynchronously along a motion curve, choreographed with nearby surfaces | high |
| Asymmetric | Width and height change at different rates; best with multiple elements or position changes; to expand, start the width slightly before the height; to collapse, start the height slightly before the width | high |
| Symmetric | Width and height change at the same rate; best for one element on one axis; slightly shorter durations than asymmetric | high |
| Content | Contained items (text, images) keep a constant aspect ratio while the container transforms, to avoid stretching | high |
| Full-bleed content | Containers with full-bleed content may expand synchronously | high |

### Radial transformation

| Rule | Statement | Confidence |
|---|---|---|
| Definition | Symmetrical, circular transformation originating from the user's point of touch; common on circular surfaces that morph into other shapes | high |
| Use | Circular surfaces morphing into rectangles, or creating a new surface from the point of input | high |
| Do not use | Between two rectangular shapes; do not expand an oval's width and height asynchronously; do not transform complex shapes | high |
| Origin | Either the object's current location or the center of the final surface; a FAB may move in an arc to its destination as it expands into a card, or keep its center in place for a subtler expansion | high |
| Timing | not found (the page states no duration for radial transformations) | not found |

### Joining and dividing

| Rule | Statement | Confidence |
|---|---|---|
| Joining | As two sheets approach, their edges meet and margins overlap before the movement completes | high |
| Dividing | The pieces begin separating at the start of the movement | high |
| Shadows | Shadows from separated material do not appear above sibling elements | high |

## Choreography

### Continuity

| Rule | Statement | Confidence |
|---|---|---|
| Focal point | Keep a clear focal point by choosing the number and type of elements shared across the transition | high |
| All content shared | While a surface expands, a significant number of elements remain visible; complex transitions keep a single element visible; a collapsed card's elements become the expanded card's header | high |
| Few or no elements shared | The single remaining element is the focal point and controls all other elements; with no shared elements, anchor all crossfading elements to the surface's vertical movement and let the surface crop its content | high |
| No shared surfaces | Not recommended; a new surface entering from elsewhere creates a new focal point | high |
| Multiple shared elements | Include only the most important ones; distracting elements may disappear during the transition and reappear afterwards; never let elements cross paths | high |
| Layout awareness | Reserve space for elements that have not loaded when the transition ends so the layout does not shift and touch targets do not jump | high |

### Creation

| Rule | Statement | Confidence |
|---|---|---|
| Association | New surfaces emerge from radial or rectangular expansion at the point of touch; a menu appearing far from its trigger breaks the relationship with the input | high |
| Staggering | When several surfaces are created at once, stagger their appearance quickly along a single, smooth focal path: lists stagger top to bottom, grids populate left to right and top to bottom; never all at once; never in a confusing order | high |
| Stagger offset | Do not wait for one item to finish before starting the next; begin each item's staggered entrance no more than 20 ms apart | high |
| Autonomous creation | Surfaces created without user input or point of origin use an elegant combination of fading, position and scaling, appearing smoothly and quickly; too much animation is distracting | high |

### Hierarchical timing

| Rule | Statement | Confidence |
|---|---|---|
| Near first | Screen reactions near the point of touch occur sooner than reactions farther away | high |
| Named section | The archived 2018 page has no section titled "hierarchical timing"; its rules are the stagger offset above and the radial reaction ordering | high |

### Radial reaction (radial action)

| Rule | Statement | Confidence |
|---|---|---|
| Purpose | Clarify the connection between user input and surface reactions using radial action | high |
| Touch ripple | A touch ripple indicates the point of touch and confirms the input was received; for touch or mouse it occurs at the point of contact | high |
| Origin | Ink ripples immediately expand outward from the point of touch | high |
| Ordering | Reactions near the point of touch occur before reactions farther away | high |
| Examples | An app bar changes color with the new color rippling outward from the touch point; grid images fade out radially around the tap point | high |
| Lift | A card lifts to indicate an active state alongside the ripple | high |
| Ripple duration, radius, opacity | not found on the motion pages | not found |

## Creative customization

The page covers animated icons and illustrations. It states no duration, size or color; its figures are videos. Only the dual-function system icon has a Material Design 1 surface.

| Rule | Statement | Material Design 1 surface | Confidence |
|---|---|---|---|
| Dual-function system icons | "An icon may serve dual functions. For example, a menu icon may smoothly transition to a playback control, and back again. This effect both informs the user of the button's function while adding an element of wonder to the interaction." | `Md1Toolbar.Nav`: the `menu` glyph morphs to `arrow-back` while the navigation drawer is open and back on close, over `--md1-duration-standard` on the standard curve; `data-icon` carries the current glyph | high (rule); the duration is the duration page's standard value, not stated on this page |
| Menu to back arrow | "Transforming the menu icon into the back arrow signifies that the two actions are connected, and that one cannot exist while the other is present. The back button must be pressed in order to return to the top-level view with the menu icon." | `Md1Toolbar.Nav` as above | high |
| Play to pause | "Transforming the play button to a pause button signifies that the two actions are linked, and that pressing one makes the other one visible." | none (MD1 has no media component); a consumer composes `Md1IconToggle` with `icon` and `iconOn` | high (rule); no surface |
| FAB plus to pencil | "When pressing this floating action button, the plus sign transforms into a pencil. This indicates that the pencil is the primary creation method." | none shipped; the `Md1Fab` speed dial swaps glyphs through `icon` without a morph | high (rule); no surface |
| Product icons | "Animated product icons should demonstrate polish and refinement from the moment the app launches." Inbox, Calendar, Photos and Gmail examples play on first open or first data load | out: launch animation is OS and app chrome | high |
| Illustrations | "Subtle animation in imagery and illustrations can add a sense of playfulness to the user experience." Named moments: unexpected errors, waiting while a task finishes, reaching a goal, educating about a new feature | out: no surface; docs guidance only | high |
| Metrics | none on the page | | not found |

## Press feedback overlays

Values from the buttons component page. Percentages are the overlay or text opacity of the named color.

| State | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Flat button, pressed | 40% #999999 | 25% #CCCCCC | high |
| Flat button, focus | 12% opacity | 12% opacity | high |
| Flat button, disabled text | 26% #000000 | 30% #FFFFFF | high |
| Flat button, hover | not found on the archived page | not found | not found |
| Raised button, pressed | lifts to 8 dp and fills with color | pressed color is the palette 700 shade (normal is 500) | high |
| Raised button, focused | 12% #000000 shade over the color | 12% #000000 shade over the color | high |
| Raised button, disabled text | 26% #000000 | 30% #FFFFFF | high |
| Raised button, disabled button | 12% #000000 | 12% #FFFFFF | high |
| Raised button, desktop | 0 dp resting; gains 2 dp on hover | same | high |
| Icon toggles | May show bounded or unbounded ink ripples beyond their touch-target bounds; focus indicator color and opacity follow the icon color | same | high |
| Flat versus raised | Flat buttons do not lift, they fill with color on press; raised buttons lift and fill with color on press | | high |
| Nav drawer selection | The touch ripple highlights the row; the selected item takes the primary color (or 100% #000000); use a darker tint of primary when the ripple contrast is insufficient | | high |

Accessibility limits that bound motion (2016 accessibility page, high): content that moves, scrolls or blinks automatically for more than 5 seconds must be pausable, stoppable or hideable; flashing is limited to 3 times in any 1 second period; avoid flashing large central regions.

## Vuetify 1.5 ripple and state implementation (cross-check)

| Property | Vuetify 1.5 value | Spec | Confidence |
|---|---|---|---|
| Origin | Pointer coordinates relative to the element (`center: true` forces the element center) | Point of touch | moderate |
| Radius | Half the element diagonal, `sqrt(w^2 + h^2) / 2`; circle mode uses half the width plus a quarter of the pointer offset from center | not found | moderate |
| Initial scale | 0.3 (0.15 in circle mode) | not found | moderate |
| Expansion | `transform .25s cubic-bezier(0.4, 0.0, 0.2, 1)` with `opacity .1s` | not found | moderate |
| Peak opacity | 0.25, set inline by the directive (`$ripple-animation-visible-opacity := .15` exists in `_variables.styl` but is unused) | not found | moderate |
| Minimum visible time | 250 ms after activation before fading | not found | moderate |
| Fade out | `opacity .3s cubic-bezier(0.4, 0.0, 0.2, 1)`; the node is removed 300 ms later | not found | moderate |
| Container | `.v-ripple__container` absolutely fills the host with `overflow: hidden`, `border-radius: inherit`, `contain: strict` | bounded ripple | moderate |
| Hover overlay | `.v-btn:before` at opacity .12 of currentColor on hover, focus and active (disabled on touch-only devices via `@media (hover: none)`) | not found | moderate |
| Pressed color | `rgba(#999, .4)` light, `rgba(#ccc, .25)` dark (`_theme.styl buttons.pressed`) | 40% #999999 and 25% #CCCCCC | agrees |
| Focused color | `rgba(0,0,0,.12)` light, `rgba(255,255,255,.12)` dark | 12% | agrees on opacity |
| Disabled | `rgba(0,0,0,.26)` light, `rgba(255,255,255,.3)` dark; disabled raised background `rgba(0,0,0,.12)` | 26% / 30% text, 12% button | agrees |
| Transition classes | `fade`, `scale` (scale(0)), `slide-x` and `slide-y` (15 px offsets), `scroll-x` and `scroll-y`, `expand`, `fab` (scale(0) rotate(-45deg)), `dialog` (scale(0.5) with fade), `dialog-bottom`, `bottom-sheet`, `picker`, `tab`, `carousel`, `message`, all on the 0.3 s `swing` primary transition unless overridden | not found | moderate |

## Disagreements and gaps

| Item | Spec | Vuetify 1.5 | Resolution for Material Design 1 |
|---|---|---|---|
| Default curve | Standard `cubic-bezier(0.4, 0.0, 0.2, 1)` | `swing cubic-bezier(.25, .8, .5, 1)` | Spec wins; `swing` and `fast-in-fast-out` are not Material Design 1 curves |
| Enter and leave durations | 225 ms and 195 ms | one 300 ms value | Spec wins |
| Desktop durations | 150 ms to 200 ms | not implemented | Implement a desktop scale |
| Tablet and wearable scaling | +30% and -30% | not implemented | Implement tablet scale; wearables out of scope for the web |
| Ripple timing and opacity | not found | 250 ms expand, 0.25 opacity, 300 ms fade | Use the Vuetify values tagged moderate |
| Hover overlay | not found | 12% currentColor | Use 12%, tagged moderate; the only spec-stated 12% is the focus overlay |
| Stagger offset | 20 ms maximum between items | not implemented | Implement for list and grid entrances |
| Dual-function icon transition | menu to back arrow, play to pause, plus to pencil (creative customization page) | `v-app-bar-nav-icon` and `v-btn--fab` swap icons without a morph | Implement the menu to back-arrow morph on `Md1Toolbar.Nav`; the others are consumer compositions |
| Arc movement | Concave arc for two-axis on-screen movement | not implemented | Implement for FAB-to-card and shared element transitions |
