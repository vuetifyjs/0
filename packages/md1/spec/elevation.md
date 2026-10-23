# Material Design 1 spec: Elevation and shadows

Material Design 1 (2014 to 2017 "Material Design" guidelines) elevation model for `@paper/md1`. dp maps 1:1 to CSS px. The spec text wins over Vuetify 1.5.24 wherever they differ; every disagreement is recorded in the last section.

Confidence legend: `high` = read from the archived spec page; `moderate` = Vuetify 1.5.24 stylus or TypeScript only; `low` = memory; `not found` = the sources do not state it.

## Sources

Spec pages (m1.material.io, the MD1 guidelines Google hosts as an archive; where the archive copy read was dated later than 2018-12-25, the date is noted):

- https://m1.material.io/material-design/elevation-shadows.html (primary)
- https://m1.material.io/material-design/environment.html (supplementary: key light and ambient light model; 2021-08-05 capture of the archive page, the 2018 capture answered HTTP 503)
- https://m1.material.io/motion/transforming-material.html (supplementary: shadows of divided material)
- https://m1.material.io/components/buttons.html (supplementary: button elevations, desktop hover)
- https://m1.material.io/patterns/navigation-drawer.html (supplementary: drawer type elevations, scrim)
- https://m1.material.io/components/bottom-navigation.html (supplementary: bottom navigation versus snackbar order)
- https://m1.material.io/components/toolbars.html (supplementary: toolbar step and waterfall)

Vuetify 1.5.24 cross-check files (`/home/john/sites/vuetify1/packages/vuetify/src/stylus/`):

- `settings/_elevations.styl` (the three shadow layer lists and the `elevation()` and `elevationTransition()` mixins; copied verbatim below)
- `components/*.styl` files that call `elevation()`: `_buttons`, `_cards`, `_dialogs`, `_menus`, `_navigation-drawer`, `_snackbars`, `_switch`, `_toolbar`, `_text-fields`, `_expansion-panel`, `_chips`, `_tooltips`, `_pagination`, `_button-toggle`, `_steppers`, `_carousel`, `_timeline`, `_overflow-buttons`
- `components/_bottom-navs.styl` (hand-written shadow), `components/_overlay.styl` (scrim)

## Environment and light model

| Rule | Statement | Confidence |
|---|---|---|
| 3D space | Every object has x, y and z dimensions; the z axis is perpendicular to the display with positive z toward the viewer | high |
| Material thickness | 1 dp, equal to one pixel at 160 dpi; every sheet occupies a single z position | high |
| Light sources | Virtual lights illuminate the scene: key lights create directional shadows; ambient light creates soft shadows from all angles | high |
| Shadow origin | Shadows are cast by both light sources and are created by the elevation difference between overlapping material | high |
| Web rendering | On the web the z axis is used for layering, not perspective; the 3D world is emulated by manipulating the y axis only, so shadows are drawn as y offsets | high |
| Reference illustration | The environment page illustrates a card at 6 dp with its key shadow, its ambient shadow and the combined shadow | high |
| Vuetify naming | `_elevations.styl` names the layers umbra (opacity .2), penumbra (opacity .14) and ambient (opacity .12); umbra and penumbra together are the key shadow, ambient is the ambient shadow | moderate |

## Elevation definitions

| Term | Definition | Confidence |
|---|---|---|
| Elevation | Relative depth, or distance, between two surfaces along the z axis; measured in dp from the top of one surface to the top of another because all material is 1 dp thick | high |
| Child elevation | A child object's elevation is relative to its parent's elevation | high |
| Resting elevation | The default elevation of an object; it does not change on its own; an object that changes elevation returns to its resting elevation as soon as possible | high |
| Consistency | Components keep consistent resting elevations across apps (a FAB is 6 dp in every app) but may differ across platforms and devices because TV has more depth than desktop, and both have more than mobile | high |
| Desktop resting elevation | 2 dp below the listed values, to accommodate mouse and non-touch environments | high |
| Responsive elevation | Some components change elevation in response to input (normal, focused, pressed) or system events | high |
| Dynamic elevation offset | The goal elevation a component moves toward relative to its resting state; all components that lift on press use the same offset; after the input completes or cancels the component returns to rest | high |
| Elevation interference | Material cannot pass through material; components with responsive elevation must not collide with other components; a FAB may disappear or move off-screen before a card is picked up, or move when a snackbar appears; layouts should place the FAB to one side of a card stream | high |

## Component elevation table

Verbatim from the elevation page. The asterisk marks the rows whose desktop variant is given separately.

| Elevation (dp) | Component | Confidence |
|---|---|---|
| 24 | Dialog | high |
| 24 | Picker | high |
| 16 | Nav drawer | high |
| 16 | Right drawer | high |
| 16 | Modal bottom sheet | high |
| 12 | Floating action button (FAB, pressed) | high |
| 9 | Sub menu (+1 dp for each sub menu) | high |
| 8 | Bottom navigation bar | high |
| 8 | Menu | high |
| 8 | Card (when picked up) | high |
| 8 | Raised button (pressed state) | high |
| 6 | Floating action button (FAB, resting elevation) | high |
| 6 | Snackbar | high |
| 4 | App bar | high |
| 3 | Refresh indicator | high |
| 3 | Quick entry / Search bar (scrolled state) | high |
| 2 | Card (resting elevation) * | high |
| 2 | Raised button (resting elevation) * | high |
| 2 | Quick entry / Search bar (resting elevation) | high |
| 1 | Switch | high |

## Per-component resting and dynamic elevation

| Component | Resting | Raised, pressed or dragged | Desktop | Confidence |
|---|---|---|---|---|
| Dialog | 24 dp | none | 22 dp by the general desktop rule; no explicit value | high (rule) |
| Picker | 24 dp | none | not found | high |
| Nav drawer (temporary, left) | 16 dp, spanning the full screen height including behind the status bar, with a scrim behind | none | not found | high |
| Right drawer | 16 dp | none | not found | high |
| Permanent nav drawer | Same elevation as the content or background (0 dp relative) | none | recommended default on desktop | high |
| Persistent nav drawer | Same surface elevation as the content (0 dp relative) | none | | high |
| Mini variant drawer | Same elevation as the content, clipped by the app bar | expands to the persistent drawer | | high |
| Modal bottom sheet | 16 dp | none | not found | high |
| Standard (persistent) bottom sheet | not found on the fetched pages | | | not found |
| Standard side sheet | not found (not an MD1 component) | | | not found |
| Floating action button | 6 dp | 12 dp pressed | not found | high |
| Sub menu | 9 dp, plus 1 dp for each further sub menu level | none | | high |
| Menu | 8 dp; a menu is a temporary sheet that always overlaps the app bar | none | | high |
| Card | 2 dp | 8 dp when picked up (dragged) | "see Content blocks" (page not fetched); 0 dp by the general rule | high |
| Raised button | 2 dp | 8 dp pressed | 0 dp resting, 2 dp pressed; on desktop raised buttons can gain the 2 dp on hover | high |
| Flat button | 0 dp; flat buttons do not lift, they fill with color on press | none | | high |
| Snackbar | 6 dp; passes behind a bottom navigation bar | none | not found | high |
| Bottom navigation bar | 8 dp | none | not found | high |
| App bar | 4 dp | none | not found | high |
| Toolbar | A step above the sheet its actions affect; a seamed toolbar that lifts to a step on scroll is a waterfall | none | | high |
| Refresh indicator | 3 dp | none | not found | high |
| Quick entry / Search bar | 2 dp | 3 dp scrolled | not found | high |
| Text field | not found (only the search bar row exists) | | | not found |
| Switch | 1 dp | none | not found | high |
| Tooltip | not found | | | not found |
| Chip | not found | | | not found |
| Expansion panel | not found | | | not found |

## Dynamic elevation offsets

The spec states that all components lifting on press share one offset but prints the offsets only as diagrams. The offsets below are the differences between the table rows above.

| Component | Resting | Goal | Offset | Confidence |
|---|---|---|---|---|
| Floating action button, press | 6 dp | 12 dp | +6 dp | high (rows), derived (offset) |
| Raised button, press | 2 dp | 8 dp | +6 dp | high (rows), derived (offset) |
| Card, pick up | 2 dp | 8 dp | +6 dp | high (rows), derived (offset) |
| Raised button, press, desktop | 0 dp | 2 dp | +2 dp | high (rows), derived (offset) |
| Quick entry / Search bar, scroll | 2 dp | 3 dp | +1 dp | high (rows), derived (offset) |
| Sub menu nesting | 9 dp | 9 dp + n | +1 dp per level | high |

## Elevation rules

| Rule | Statement | Confidence |
|---|---|---|
| No passing through | Objects can be stacked or affixed but cannot pass through each other | high |
| Return to rest | An object that changes elevation returns to its resting elevation as soon as possible | high |
| Parent and child | Each object has one parent and any number of children; children inherit position, rotation, scale and elevation from the parent; siblings share a hierarchy level | high |
| Minimal separation | Children have minimal z separation from their parent; nothing is inserted between a parent and its child | high |
| Root-parented objects | Primary UI elements parented to the root move independently of other objects: the FAB (does not scroll with content), the side nav drawer, the action bar, dialogs | high |
| Sibling movement | Cards in a scrolling collection are siblings and move together as children of the collection | high |
| Scrolling | A raised button that is a child of a scrolling sheet scrolls off-screen with it; a FAB whose parent is not scrolled stays in place | high |
| Choosing elevation | Elevation expresses the content hierarchy and whether an object must move independently of others | high |
| Z order from the table | Dialog and picker (24) above drawers and modal bottom sheets (16) above the pressed FAB (12) above sub menus (9) above menus, bottom navigation, picked-up cards and pressed raised buttons (8) above the resting FAB and snackbar (6) above the app bar (4) above the refresh indicator and scrolled search bar (3) above cards, raised buttons and the resting search bar (2) above the switch (1) above flat content (0) | high |
| Divided material | Shadows from separated material do not appear above sibling elements | high |

## Shadows

| Rule | Statement | Confidence |
|---|---|---|
| Purpose | Shadows are the only visual cue indicating the amount of separation between surfaces and show depth and direction of movement | high |
| Shape | The shadow grows softer and larger as elevation increases and crisper and smaller as it decreases | high |
| Distinguishing elevations | Two elements with identical crisp shadows read as the same elevation; the higher element needs the softer, larger shadow | high |
| Motion | A changing shadow signals a change of elevation; a constant shadow signals a change of shape or size at constant elevation | high |
| Reference shadows | The elevation page's component reference shadows are canonical; where another page disagrees, the reference shadows win | high |

Component reference shadows (verbatim list): app bar 4 dp; raised button resting 2 dp, pressed 8 dp (desktop only: resting 0 dp, pressed 2 dp); FAB resting 6 dp, pressed 12 dp; card resting 2 dp, raised 8 dp; menus 8 dp; sub menus 9 dp (+1 dp per sub menu); dialogs 24 dp; nav drawer and right drawer 16 dp; modal bottom sheet 16 dp; refresh indicator 3 dp; quick entry / search bar resting 2 dp, scrolled 3 dp; snackbar 6 dp; switch 1 dp (high).

The spec gives no pixel recipe for any shadow (not found). The recipe below is the Vuetify 1.5 implementation of the Material "paper" shadows and is the canonical recipe for Material Design 1.

## Shadow recipe per dp (Vuetify 1.5.24 `_elevations.styl`, verbatim)

Three layers per level, listed in `box-shadow` order: umbra, penumbra, ambient. Each cell is `offset-x offset-y blur spread`.

| dp | Umbra layer (rgba(0,0,0,.2)) | Penumbra layer (rgba(0,0,0,.14)) | Ambient layer (rgba(0,0,0,.12)) | Full `box-shadow` value | Confidence |
|---|---|---|---|---|---|
| 0 | `0px 0px 0px 0px` | `0px 0px 0px 0px` | `0px 0px 0px 0px` | `0px 0px 0px 0px rgba(0,0,0,.2), 0px 0px 0px 0px rgba(0,0,0,.14), 0px 0px 0px 0px rgba(0,0,0,.12)` | moderate |
| 1 | `0px 2px 1px -1px` | `0px 1px 1px 0px` | `0px 1px 3px 0px` | `0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)` | moderate |
| 2 | `0px 3px 1px -2px` | `0px 2px 2px 0px` | `0px 1px 5px 0px` | `0px 3px 1px -2px rgba(0,0,0,.2), 0px 2px 2px 0px rgba(0,0,0,.14), 0px 1px 5px 0px rgba(0,0,0,.12)` | moderate |
| 3 | `0px 3px 3px -2px` | `0px 3px 4px 0px` | `0px 1px 8px 0px` | `0px 3px 3px -2px rgba(0,0,0,.2), 0px 3px 4px 0px rgba(0,0,0,.14), 0px 1px 8px 0px rgba(0,0,0,.12)` | moderate |
| 4 | `0px 2px 4px -1px` | `0px 4px 5px 0px` | `0px 1px 10px 0px` | `0px 2px 4px -1px rgba(0,0,0,.2), 0px 4px 5px 0px rgba(0,0,0,.14), 0px 1px 10px 0px rgba(0,0,0,.12)` | moderate |
| 5 | `0px 3px 5px -1px` | `0px 5px 8px 0px` | `0px 1px 14px 0px` | `0px 3px 5px -1px rgba(0,0,0,.2), 0px 5px 8px 0px rgba(0,0,0,.14), 0px 1px 14px 0px rgba(0,0,0,.12)` | moderate |
| 6 | `0px 3px 5px -1px` | `0px 6px 10px 0px` | `0px 1px 18px 0px` | `0px 3px 5px -1px rgba(0,0,0,.2), 0px 6px 10px 0px rgba(0,0,0,.14), 0px 1px 18px 0px rgba(0,0,0,.12)` | moderate |
| 7 | `0px 4px 5px -2px` | `0px 7px 10px 1px` | `0px 2px 16px 1px` | `0px 4px 5px -2px rgba(0,0,0,.2), 0px 7px 10px 1px rgba(0,0,0,.14), 0px 2px 16px 1px rgba(0,0,0,.12)` | moderate |
| 8 | `0px 5px 5px -3px` | `0px 8px 10px 1px` | `0px 3px 14px 2px` | `0px 5px 5px -3px rgba(0,0,0,.2), 0px 8px 10px 1px rgba(0,0,0,.14), 0px 3px 14px 2px rgba(0,0,0,.12)` | moderate |
| 9 | `0px 5px 6px -3px` | `0px 9px 12px 1px` | `0px 3px 16px 2px` | `0px 5px 6px -3px rgba(0,0,0,.2), 0px 9px 12px 1px rgba(0,0,0,.14), 0px 3px 16px 2px rgba(0,0,0,.12)` | moderate |
| 10 | `0px 6px 6px -3px` | `0px 10px 14px 1px` | `0px 4px 18px 3px` | `0px 6px 6px -3px rgba(0,0,0,.2), 0px 10px 14px 1px rgba(0,0,0,.14), 0px 4px 18px 3px rgba(0,0,0,.12)` | moderate |
| 11 | `0px 6px 7px -4px` | `0px 11px 15px 1px` | `0px 4px 20px 3px` | `0px 6px 7px -4px rgba(0,0,0,.2), 0px 11px 15px 1px rgba(0,0,0,.14), 0px 4px 20px 3px rgba(0,0,0,.12)` | moderate |
| 12 | `0px 7px 8px -4px` | `0px 12px 17px 2px` | `0px 5px 22px 4px` | `0px 7px 8px -4px rgba(0,0,0,.2), 0px 12px 17px 2px rgba(0,0,0,.14), 0px 5px 22px 4px rgba(0,0,0,.12)` | moderate |
| 13 | `0px 7px 8px -4px` | `0px 13px 19px 2px` | `0px 5px 24px 4px` | `0px 7px 8px -4px rgba(0,0,0,.2), 0px 13px 19px 2px rgba(0,0,0,.14), 0px 5px 24px 4px rgba(0,0,0,.12)` | moderate |
| 14 | `0px 7px 9px -4px` | `0px 14px 21px 2px` | `0px 5px 26px 4px` | `0px 7px 9px -4px rgba(0,0,0,.2), 0px 14px 21px 2px rgba(0,0,0,.14), 0px 5px 26px 4px rgba(0,0,0,.12)` | moderate |
| 15 | `0px 8px 9px -5px` | `0px 15px 22px 2px` | `0px 6px 28px 5px` | `0px 8px 9px -5px rgba(0,0,0,.2), 0px 15px 22px 2px rgba(0,0,0,.14), 0px 6px 28px 5px rgba(0,0,0,.12)` | moderate |
| 16 | `0px 8px 10px -5px` | `0px 16px 24px 2px` | `0px 6px 30px 5px` | `0px 8px 10px -5px rgba(0,0,0,.2), 0px 16px 24px 2px rgba(0,0,0,.14), 0px 6px 30px 5px rgba(0,0,0,.12)` | moderate |
| 17 | `0px 8px 11px -5px` | `0px 17px 26px 2px` | `0px 6px 32px 5px` | `0px 8px 11px -5px rgba(0,0,0,.2), 0px 17px 26px 2px rgba(0,0,0,.14), 0px 6px 32px 5px rgba(0,0,0,.12)` | moderate |
| 18 | `0px 9px 11px -5px` | `0px 18px 28px 2px` | `0px 7px 34px 6px` | `0px 9px 11px -5px rgba(0,0,0,.2), 0px 18px 28px 2px rgba(0,0,0,.14), 0px 7px 34px 6px rgba(0,0,0,.12)` | moderate |
| 19 | `0px 9px 12px -6px` | `0px 19px 29px 2px` | `0px 7px 36px 6px` | `0px 9px 12px -6px rgba(0,0,0,.2), 0px 19px 29px 2px rgba(0,0,0,.14), 0px 7px 36px 6px rgba(0,0,0,.12)` | moderate |
| 20 | `0px 10px 13px -6px` | `0px 20px 31px 3px` | `0px 8px 38px 7px` | `0px 10px 13px -6px rgba(0,0,0,.2), 0px 20px 31px 3px rgba(0,0,0,.14), 0px 8px 38px 7px rgba(0,0,0,.12)` | moderate |
| 21 | `0px 10px 13px -6px` | `0px 21px 33px 3px` | `0px 8px 40px 7px` | `0px 10px 13px -6px rgba(0,0,0,.2), 0px 21px 33px 3px rgba(0,0,0,.14), 0px 8px 40px 7px rgba(0,0,0,.12)` | moderate |
| 22 | `0px 10px 14px -6px` | `0px 22px 35px 3px` | `0px 8px 42px 7px` | `0px 10px 14px -6px rgba(0,0,0,.2), 0px 22px 35px 3px rgba(0,0,0,.14), 0px 8px 42px 7px rgba(0,0,0,.12)` | moderate |
| 23 | `0px 11px 14px -7px` | `0px 23px 36px 3px` | `0px 9px 44px 8px` | `0px 11px 14px -7px rgba(0,0,0,.2), 0px 23px 36px 3px rgba(0,0,0,.14), 0px 9px 44px 8px rgba(0,0,0,.12)` | moderate |
| 24 | `0px 11px 15px -7px` | `0px 24px 38px 3px` | `0px 9px 46px 8px` | `0px 11px 15px -7px rgba(0,0,0,.2), 0px 24px 38px 3px rgba(0,0,0,.14), 0px 9px 46px 8px rgba(0,0,0,.12)` | moderate |

Mixins (verbatim):

```stylus
elevation($z, important = false)
  box-shadow: $shadow-key-umbra[$z],
              $shadow-key-penumbra[$z],
              $shadow-key-ambient[$z] (important ? !important : )

elevationTransition($duration = 280ms, $easing = cubic-bezier(.4, 0, .2, 1))
  transition: box-shadow $duration $easing
  will-change: box-shadow
```

| Recipe property | Value | Confidence |
|---|---|---|
| Umbra opacity | rgba(0,0,0,.2) | moderate |
| Penumbra opacity | rgba(0,0,0,.14) | moderate |
| Ambient opacity | rgba(0,0,0,.12) | moderate |
| Elevation transition | box-shadow 280 ms cubic-bezier(.4, 0, .2, 1) (the standard curve) | moderate |
| Levels | 0 to 24 inclusive, matching the spec's 24 dp maximum | moderate |

Token plan for Material Design 1: expose `--md1-elevation-0` to `--md1-elevation-24` holding the full three-layer value, and `--md1-shadow-umbra`, `--md1-shadow-penumbra`, `--md1-shadow-ambient` for the three opacities so dark themes can retune them.

## Vuetify 1.5.24 component elevations (cross-check)

| Vuetify selector | elevation() | Spec value | Agreement |
|---|---|---|---|
| `.v-dialog` | 24 | Dialog 24 dp | agrees |
| `.v-navigation-drawer--temporary`, `--is-mobile` (open) | 16 | Nav drawer 16 dp | agrees; permanent and persistent drawers get no shadow, which matches "same elevation as content" |
| `.v-bottom-sheet` | none of its own (it is a `.v-dialog`, 24) | Modal bottom sheet 16 dp | disagrees: Vuetify paints 24 dp |
| `.v-btn--floating` | 6, `:active` 12 | FAB 6 dp, pressed 12 dp | agrees |
| `.v-menu__content` | 8 | Menu 8 dp, sub menu 9 dp | agrees for menus; no +1 dp nesting rule in Vuetify |
| `.v-item-group.v-bottom-nav` | hand-written `0 3px 14px 2px rgba(0,0,0,.12)` | Bottom navigation 8 dp | disagrees: only the ambient layer of level 8 |
| `.v-card` | 2, `.v-card--hover:hover` 8, `.v-card--flat` 0 | Card 2 dp resting, 8 dp picked up | agrees on values; Vuetify raises on hover, the spec on pick up |
| `.v-btn` raised (not depressed, not flat) | 2, `:active` 8 | Raised button 2 dp, pressed 8 dp | agrees; no desktop 0 dp or hover lift in Vuetify |
| `.v-btn--depressed`, `.v-btn--flat`, `.v-btn--outline` | 0 | Flat button 0 dp | agrees |
| `.v-snack__wrapper` | 6 | Snackbar 6 dp | agrees |
| `.v-toolbar` | 4, `.v-toolbar--card` 0 | App bar 4 dp | agrees |
| `.v-text-field--solo` slot | 2 | Search bar 2 dp resting | agrees for solo fields; no 3 dp scrolled state |
| `.v-input--switch__thumb` | 4 | Switch 1 dp | disagrees |
| `.v-picker` | no elevation() call in `_pickers.styl` | Picker 24 dp | the dialog supplies 24 dp only when the picker is inside `v-dialog` |
| `.v-tooltip__content` | 2 | not found | n/a |
| `.v-chip` focused, active, selected | 2 | not found | n/a |
| `.v-expansion-panel` | 1; popout or inset active container 3 | not found | n/a |
| `.v-pagination__item` | 2, active 4 | not found | n/a |
| `.v-btn-toggle--selected` | 2 | not found | n/a |
| `.v-stepper`, `.v-stepper__header` | 2 | not found | n/a |
| `.v-carousel` | 2 | not found | n/a |
| `.v-timeline__dot` | 1 | not found | n/a |
| `.v-overflow-btn` focused | 2 | not found | n/a |
| Refresh indicator | no component in Vuetify 1.5 | 3 dp | n/a |

## Scrim

| Property | Spec | Vuetify 1.5 (`_overlay.styl`) | Confidence |
|---|---|---|---|
| Presence | Everything behind an open nav drawer is visible but darkened by a scrim | `.v-overlay:before` covers the viewport | high (spec), moderate (Vuetify) |
| Color and opacity | not found on the fetched pages | rgba(33,33,33) at opacity .46 when active | not found / moderate |
| Transition | not found | .3 s cubic-bezier(.25,.8,.5,1) with a 150 ms delay on the before pseudo element | not found / moderate |
| Z order | not found | overlay z-index 5; drawer z-index 6 when temporary or mobile, 3 otherwise; dialog content z-index 6 | moderate |

## Disagreements and gaps

| Item | Spec | Vuetify 1.5 | Resolution for Material Design 1 |
|---|---|---|---|
| Switch thumb | 1 dp | 4 dp | Spec wins: 1 dp |
| Bottom navigation | 8 dp three-layer | single ambient layer | Spec wins: level 8 recipe |
| Modal bottom sheet | 16 dp | 24 dp via `.v-dialog` | Spec wins: 16 dp |
| Sub menu | 9 dp, +1 dp per level | 8 dp flat | Spec wins |
| Desktop resting elevation | 2 dp below mobile | not implemented | Implement as a theme-level offset; raised button desktop 0 dp resting, 2 dp hover and pressed |
| Card raise trigger | picked up (drag) | hover | Spec wins for drag; hover raise is a desktop affordance the spec gives only for raised buttons |
| Search bar scrolled state | 3 dp | not implemented | Implement |
| Scrim opacity | not found | .46 of rgba(33,33,33) | Use the Vuetify value, tagged moderate, until the drawer or dialog page is pinned |
| Shadow pixel recipe | not found | 25 levels | Vuetify recipe is canonical |
| Standard bottom sheet, side sheet, text field, tooltip, chip elevations | not found | various | Leave to the component notes; not in the elevation table |
