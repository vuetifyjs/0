# Toolbars and the app bar (MD1)

Spec page: `components/toolbars.html`. MD1 components: `Md1Toolbar` (generic toolbar) and `Md1AppBar` (the app bar variant). The archived Toolbars page only covers the toolbar as a sheet of material; every app bar metric lives on `layout/structure.html` and the scroll behaviors on `patterns/scrolling-techniques.html`, both read in full below.

## Sources

| Source | URL (snapshot) | Read |
|---|---|---|
| MD1 archived spec, Toolbars | `https://web.archive.org/web/20181225002140/https://material.io/archive/guidelines/components/toolbars.html` (requested `20181225002255`, archive resolved to `20181225002140`) | full text |
| MD1 Layout, Structure (Toolbars, App bar, System bars sections) | `https://web.archive.org/web/20181225002252/https://material.io/archive/guidelines/layout/structure.html` | full text |
| MD1 Layout, Metrics and keylines | `https://web.archive.org/web/20181225002221/https://material.io/archive/guidelines/layout/metrics-keylines.html` | full text |
| MD1 Patterns, Scrolling techniques | `https://web.archive.org/web/20181225002145/https://material.io/archive/guidelines/patterns/scrolling-techniques.html` | full text |
| MD1 Patterns, Search (expandable search in the toolbar) | `https://web.archive.org/web/20210805023955/https://material.io/archive/guidelines/patterns/search.html` (requested `20181225002255`, archive resolved to `20210805023955`) | full text |
| MD1 Patterns, Selection (toolbar in selection mode, text selection toolbar) | `https://web.archive.org/web/20181225002148/https://material.io/archive/guidelines/patterns/selection.html` | full text |
| MD1 Components, Menus (action overflow) | `https://web.archive.org/web/20181225002215/https://material.io/archive/guidelines/components/menus.html` | usage section |
| MD1 Style, Typography | `https://web.archive.org/web/20181225002206/https://material.io/archive/guidelines/style/typography.html` | app bar rule and type scale image |
| MD1 Style, Color (themes, text and icon opacity) | `https://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html` | full text plus theme palette images `style-color-themes-light1.png`, `style-color-themes-dark1.png` |
| MD1 Material design, Elevation and shadows | `https://web.archive.org/web/20181225002223/https://material.io/archive/guidelines/material-design/elevation-shadows.html` | full text |
| MD1 Motion, Duration and easing | `https://web.archive.org/web/20181225002212/https://material.io/archive/guidelines/motion/duration-easing.html` | full text |
| 2016 Google Design spec, Toolbars and Structure (cross-check) | `https://web.archive.org/web/20160604061521/http://www.google.com/design/spec/components/toolbars.html` (resolved to nearest snapshot), `https://web.archive.org/web/20160606152517/http://www.google.com/design/spec/layout/structure.html` | full text; app bar metrics identical to 2018 |
| 2015 Google Design spec, Selection (search for "contextual action bar") | `https://web.archive.org/web/20150226205547/http://www.google.com/design/spec/patterns/selection.html` | term not present |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_toolbar.styl`, `src/components/VToolbar/VToolbar.ts`, `src/stylus/settings/_variables.styl`, `_theme.styl`, `_elevations.styl`, `components/_tabs.styl`, `components/_footer.styl` | cross-check |

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Toolbar actions appear above the view affected by their actions." | high |
| Elevation relationship | "Toolbars appear a step above the content they affect. They may constrain their width to accommodate material passing over them." | high |
| Splitting | "Do not separate a toolbar's actions by another sheet of material, unless it is transient, such as a menu or dialog." | high |
| Scrolling | "Affected content scrolls underneath toolbars." "When sheets scroll underneath toolbars, they are clipped and cannot pass through to the opposite side." | high |
| Dismissed content | "Sheets may temporarily cover the toolbar while moving offscreen." "The toolbar maintains its seam until it moves off of the screen." | high |
| Width | Do: "Constrain width to less than the full length of its material." Don't: "Never allow a sheet of material to be split by another persistent sheet of material." "The actions on the left and right cluster to stay on the same side of a toolbar." | high |
| Waterfall | "Toolbars can share a seam with another sheet. In cases where they share a seam that transforms into a step, it is called a waterfall." | high |
| App bar | "The app bar, formerly known as the action bar in Android, is a special kind of toolbar that's used for branding, navigation, search, and actions." | high |
| Menus | "A menu is a temporary sheet of paper that always overlaps the app bar, rather than behaving as an extension of the app bar." | high |

## 2. Types and variants

| Type | Spec source | Metrics | Confidence |
|---|---|---|---|
| Full-width, default height app bar | Structure, Toolbars captions | section 4, rows "default" | high |
| Full-width, extended height app bar | Structure | "For extended app bars, the height is equal to the default height plus content increment(s)."; prominent example 128dp | high |
| Column-width toolbars at multiple levels of hierarchy | Structure | no metrics | high (named only) |
| Flexible toolbar and card toolbar | Structure | flexible space: Scrolling techniques | high (named only) |
| Floating toolbar | Structure | no metrics | high (named only) |
| Detached toolbar palette | Structure | no metrics | high (named only) |
| Bottom toolbar ("launches to a shelf and clings to the top of the keyboard or other bottom component") and bottom toolbar shelf | Structure; mobile structure says "An optional bottom bar can be added for additional functionality or action overflow." | height: not found | high (named), metrics not found |
| App bar, dense (desktop) | Structure, Density | 48dp | high |
| App bar, dense prominent (desktop) | Structure, Density | 96dp | high |
| App bar, prominent | Structure | 128dp | high |
| App bar with tabs | Scrolling techniques | toolbar 56 / 64dp + tab bar 48dp | high |
| App bar with flexible space (with image, with overlapping content) | Scrolling techniques | see section 7 | high |
| App bar in expandable-search mode | Search pattern | toolbar transforms into a search field | high |
| App bar in selection mode | Selection pattern: "To exit selection mode, deselect all items or perform an action on selected items using the toolbar." The term "contextual action bar" does not appear in the 2018 or 2015 snapshots. | not found | high (behavior), name not found |
| Text selection floating toolbar | Selection pattern | Roboto Medium 14sp all caps; menu height 44dp; text top padding 12dp and 14dp (both listed); left padding 24dp; 32dp between items; expansion icon right 16dp, left 22dp, top and bottom 10dp; handles 22 x 22dp | high |
| Color variants of the app bar | Structure captions: "Light", "Dark", "Colored", "Transparent" | section 5 | high |

## 3. Anatomy

| Part | Spec text | Confidence |
|---|---|---|
| Nav icon (left) | "A control to open a navigation drawer", "An up arrow for navigating upward through your app's hierarchy", "Omitted entirely if no navigation is required from this screen" | high |
| Title | "reflects the current page. It can be an app title, page title, or a page filter." | high |
| Filter icon | listed in the structure caption "On the left: Nav icon, title, and filter icon" | high |
| Action icons (right) | "Icons on the right side of the app bar are app-related actions." | high |
| Menu icon / overflow | "The menu icon opens the overflow menu, which contains secondary actions and menu items like help, settings, and feedback." The Menus page: "The action overflow in the app bar will emit a menu." | high |
| Extended app bar areas | "Action area", "Title area", "Description area" (caption) | high |
| Scrolling blocks | "Status bar", "Tool bar", "Tab bar/search bar", "Flexible space: space to accommodate a desired aspect ratio for images or extended app bars" | high |
| Window controls (desktop) | "Where possible, the window controls are absorbed into the app bar." | high |

## 4. Metrics and keylines

### Heights

| Context | Height | Confidence |
|---|---|---|
| Mobile portrait | 56dp | high |
| Mobile landscape | 48dp | high |
| Tablet / desktop | 64dp | high |
| Extended | default height plus content increment(s) | high |
| Prominent ("significantly increased height") | 128dp | high |
| Dense (desktop, mouse and keyboard primary) | 48dp | high |
| Dense prominent (desktop) | 96dp | high |
| Desktop keyline increment | 64dp ("Incremental keyline is set by the app bar height, with a height of 64dp") | high |
| Tab bar block | 48dp | high |
| Status bar (Android) | 24dp (OS chrome, not implemented) | high |
| Chrome window bar | 32dp (OS chrome, not implemented) | high |
| Bottom toolbar | not found | not found |
| Android navigation bar | 48dp (OS chrome) | high |
| Chrome OS shelf | 56dp (OS chrome) | high |

### Paddings and keylines, by variant

| Variant | Metric | Value | Confidence |
|---|---|---|---|
| Mobile 56dp | left and right padding | 16dp | high |
| Mobile 56dp | icon top, bottom, left padding | 16dp | high |
| Mobile 56dp | title left padding (keyline) | 72dp | high |
| Mobile 56dp | title bottom padding | 20dp | high |
| Extended (caption set 1) | app bar height | 128dp | high |
| Extended (caption set 2) | action area height | 56dp | high |
| Extended (caption set 2) | title area height | 80dp | high |
| Extended (caption set 2) | title area bottom padding | 8dp | high |
| Extended (caption set 2) | description area height | 72dp | high |
| Extended (caption set 2) | description area bottom padding | 16dp | high |
| Desktop 64dp | left and right content padding | 24dp | high |
| Desktop 64dp | icon top and bottom padding | 20dp | high |
| Prominent desktop 128dp | left and right icon padding | 24dp | high |
| Prominent desktop 128dp | left content padding | 80dp | high |
| Dense 48dp | left and right content padding | 24 (unit omitted on the page; dp) | high |
| Dense 48dp | left content padding | 80dp | high |
| Dense 48dp | icon height with touch target | 40dp | high |
| Dense prominent 96dp | left and right content padding | 24dp | high |
| Dense prominent 96dp | left content padding | 80dp | high |
| Any | action icon size | 24dp (Metrics page: "Icon: 24dp", "Touch target on both: 48dp") | high |
| Any | spacing between action icons | not found (the 16dp icon padding rule is the only adjacent value) | not found |
| Any | touch target | 48 x 48dp, 8dp or more between targets | high |
| Any | iconography grid | "Iconography in toolbars align to a 4dp square baseline grid." | high |
| Tablet keylines | screen edge margin 24dp; content left margin 80dp; vertical "Toolbar and list item: 64dp" | high |
| Mobile keylines | screen edge margin 16dp; content left margin 72dp; vertical "Toolbar: 56dp" | high |

Caption set 2 of the extended app bar (56 + 80 + 72) does not sum to the 128dp of caption set 1; they describe different illustrations and the spec does not reconcile them. Record both; do not derive a third number.

### Text

| Element | Type style | Value | Confidence |
|---|---|---|---|
| Title | Title | "Across form factors, text that appears in the app bar should use the Title style, Medium 20sp." | high |
| Collapsed flexible-space title | Title | "The title shrinks to 20sp in the navigation bar." | high |
| Extended title and description text sizes | not found (only area heights are given) | not found | not found |
| Text selection toolbar labels | Button | Roboto Medium 14sp, all caps | high |

## 5. Color

| Part | Light theme | Dark theme | Colored (primary) app bar | Confidence |
|---|---|---|---|---|
| App bar surface | Grey 100 `#F5F5F5` (theme palette image, item 2 "App bar") | Grey 900 `#212121` | primary color; "Large UI areas and elements should be colored with your primary color."; "Google suggests using the 500 colors as the primary colors in your app" | high (palette from image; 500 from prose) |
| Status bar above it | Grey 300 `#E0E0E0`; "By default, the color of the status or window bar is a darker shade of the app bar color." | Black `#000000` | darker shade of the primary (no number on the archived page; 700 is the conventional reading, low) | high / low |
| Title and icon color | primary text 87% black; icons active 54% black, inactive 38% black | primary text 100% white; icons active 100% white, inactive 50% white | white at 100% ("White text appearing on colored backgrounds should do so at an opacity of 100%") | high |
| Icon uniformity | "In an app bar, all icons should be the same color." | same | same | high |
| Distinct title color | "The title can have a distinct color from the icons if increased visual hierarchy is needed. Distinct title colors work best on backgrounds with enough contrast for both white and black glyphs." | same | same | high |
| Secondary color | Don't: "Don't use the secondary color for app bars, larger areas of color" | same | same | high |
| Transparent variant | listed by name; no values | | | high (name only) |
| Translucent status bar | "Translucent status bar, 20% Black #000000"; light variant "Translucent light status bar, 70% White #FFFFFF"; light status bar default fill `#E0E0E0` | | | high |

## 6. Elevation

| State | Value | Confidence |
|---|---|---|
| App bar, resting | 4dp (elevation table and reference shadows) | high |
| App bar, desktop | 2dp by the global rule "Desktop resting elevation is 2dp below the listed values to accommodate mouse and non-touch environments." | high (rule), the page does not restate 2dp for the app bar |
| Waterfall start | seamed with the content (0dp step), "the toolbar starts out as seamed and then lifts to form a step" | high |
| Quick entry / search bar (inset search in the app bar region) | resting 2dp, scrolled 3dp | high |
| Menu emitted by the overflow action | 8dp | high |
| Toolbar generic | "Toolbars appear a step above the sheet of material affected by their actions." No dp given for non-app-bar toolbars. | high / not found |

## 7. Motion

| Behavior | Spec text | Confidence |
|---|---|---|
| Standard app bar scroll options | "The app bar can scroll off-screen with the content and return when the user reverse scrolls"; "The app bar can stay fixed at the top with content scrolling under it" | high |
| App bar with tabs | "The tab bar stays anchored at the top, while the toolbar scrolls off"; "The app bar stays anchored at the top, with the content scrolling underneath"; "Both the toolbar and tab bar scroll off with content. The tab bar returns on reverse-scroll, and the toolbar returns on complete reverse scroll" | high |
| Flexible space | "The flexible space shrinks until only the toolbar remains. The title shrinks to 20sp in the navigation bar. When scrolling to the top of the page, the flexible space and the title grow into place again." or "The whole app bar scrolls off. When the user reverse scrolls, the toolbar returns anchored to the top. When scrolling all the way back, the flexible space and the title grow into place again." | high |
| Flexible space with image | aspect ratio example 4:3; "When scrolling, the content pushes up the image, which shrinks the flexible space. At the end of the transformation, the image gets tinted with the primary color, independent of scrolling." | high |
| Flexible space with overlapping content | "The app bar is initially positioned behind the content. Upon upward scroll, the app bar should scroll faster than the content, until the content no longer overlaps it. Once anchored in place, the app bar lifts up for content to scroll underneath." "In this interaction, the app bar cannot include tabs." | high |
| Waterfall | seam lifts to a step on scroll | high |
| Expandable search | "Touching the search icon causes the toolbar to transform, clearing other content and displaying a search text field." "Touching the up arrow closes search and restores the original presentation of the toolbar." | high |
| Durations and easing | not on these pages. Global defaults: mobile 300ms (entering 225ms, leaving 195ms), desktop 150ms to 200ms, standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`. Scroll-linked transforms are driven by scroll position, not a duration. | high (global values), not found (toolbar-specific) |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Resting / fixed | 4dp above content, content clipped beneath | high |
| Seamed (waterfall start) | no step; content and toolbar share a surface | high |
| Scrolled (waterfall) | lifts to a step | high |
| Scrolled (search bar) | 2dp to 3dp | high |
| Scrolled off-screen | toolbar hidden; returns on reverse scroll (or complete reverse scroll when tabs are present) | high |
| Collapsed flexible space | only the toolbar remains, title at 20sp | high |
| Search mode | toolbar content replaced by a search text field (plus microphone icon if voice search is supported) | high |
| Selection mode | the toolbar carries actions on the selected items; exit by deselecting all or performing an action | high |
| Hover / focus / pressed | not defined at toolbar level; they belong to the contained icon buttons ("Icon toggles in normal, hover, focused, pressed, and inactive states", "The icon toggle focus indicator color and opacity are related to the color of the icon.") | high |
| Disabled | not found | not found |

Overlay opacities for the contained buttons (from the Buttons page, for reference): flat pressed 40% `#999999` (light) / 25% `#CCCCCC` (dark); focus 12%; disabled text 26% black (light) / 30% white (dark). Hover overlay: not found on the 2018 or 2016 pages.

## 9. Behavior

| Rule | Spec text | Confidence |
|---|---|---|
| Actions cluster | left actions stay left, right actions stay right; never split by a persistent sheet | high |
| Width constraint | toolbars shrink their width to let sheets pass over them | high |
| Covering | sheets may cover the toolbar while moving off screen; the toolbar keeps its seam until it leaves the screen | high |
| Overflow | secondary actions (help, settings, feedback) go to the overflow menu; the menu overlaps the app bar, it does not extend it | high |
| Nav icon | drawer control, up arrow, or omitted | high |
| Title | reflects the current page (app title, page title, page filter) | high |
| Desktop window controls | absorbed into the app bar where possible (Chrome apps) | high |
| Tablet / desktop absorption | "The app bar absorbs elements from the tablet and mobile bottom bars." | high |
| Scroll | per section 7; "the app bar cannot include tabs" in the overlapping-content variant | high |
| Search | expandable search when search is not the primary focus; persistent inset search box when it is; the X clears the query; results shown with the toolbar visible but not focused | high |
| Selection | exit selection mode by deselecting all or performing an action from the toolbar | high |
| Full screen | Lean back, Immersive, Lights Out (the app bar fades after a few seconds of inactivity in Lights Out) | high (OS-level; web note below) |

## 10. Web notes

- Maps 1:1: heights 56 / 48 / 64 / 128 / 48 / 96, 16dp and 24dp paddings, 72dp and 80dp title keylines, 24dp icons in 48dp targets, Title 20sp Medium, 4dp elevation, Grey 100 / Grey 900 surfaces, primary-colored variant with 100% white ink.
- Needs interpretation: "mobile landscape 48dp" is an orientation rule; key it on a short viewport (viewport width greater than height and width below the tablet breakpoint of 600dp from Responsive UI), not on width alone. Dense is for "mouse and keyboard" input; on the web pick it by `(pointer: fine)` or by an explicit prop, and record which in `SPEC.md`.
- Status bar and window bar are OS chrome: not implemented. The "status bar is a darker shade" rule has no web counterpart beyond `<meta name="theme-color">`, which is outside the component.
- The desktop elevation rule (2dp below listed) means `Md1AppBar` at desktop sizes rests at 2dp, not 4dp; make it a token so the value is auditable.
- Waterfall and scroll-off behaviors are scroll-linked: implement with `position: sticky` plus an intersection or scroll observer that toggles a `data-scrolled` attribute; the step appears when the sentinel leaves the viewport. Durations do not apply to the scroll-driven parts.
- Flexible space with image: the end-state tint "with the primary color" is a crossfade that completes at the collapse point.
- Bottom toolbar: height not found; defer to the Bottom navigation page owner for the 56dp bottom bar, and label any `Md1Toolbar` placed at the bottom as the same component with no distinct metrics.
- WAI-ARIA patterns: the action cluster follows the **Toolbar** pattern (`role="toolbar"`, one tab stop, arrow keys move between controls); the page-level app bar is a `<header>` **banner** landmark; nav and action icons are **Button** pattern; the overflow trigger is **Menu Button** opening a **Menu**; expandable search renders a **Combobox** when suggestions are offered, otherwise a plain search textbox; a selection-mode toolbar is still Toolbar.
- Compat note for Vuetify wrapping (DESIGN_SYSTEMS.md ruling 8): Vuetify's `prominent` meant "desktop height" in 1.5; MD1's `prominent` must mean the spec's 128dp. The wrapper translates.

## Vuetify 1.5 cross-check

Files: `_toolbar.styl`, `VToolbar.ts`, `_variables.styl`, `_theme.styl`, `_elevations.styl`, `_tabs.styl`, `_footer.styl`.

| Property | Spec | Vuetify 1.5 | Match |
|---|---|---|---|
| Mobile portrait height | 56dp | `heights.mobile: 56` | yes |
| Mobile landscape height | 48dp | `heights.mobileLandscape: 48` (applied when `smAndDown` and viewport width is greater than height) | yes |
| Tablet / desktop height | 64dp | `heights.desktop: 64` at `mdAndUp` (960px); tablet 600 to 959px gets 56 | partial (tablet gets the mobile value) |
| Dense height | 48dp | `heights.dense: 48` | yes |
| Prominent height | 128dp | `prominent` forces `heights.desktop` = 64; 128 only via `extended` (64 + 64 extension on desktop; 56 + 56 = 112 on mobile) | no |
| Dense prominent | 96dp | not modelled | no |
| Extension height | default plus increment | `computedExtensionHeight`: tabs 48, else `extensionHeight` prop, else the content height | yes |
| Tab bar in app bar | 48dp | 48 | yes |
| Content side padding, mobile | 16dp | `padding: 0 $grid-gutters.lg` = 16px at `sm-and-down` (below 960px) | yes |
| Content side padding, tablet / desktop | 24dp | `0 $grid-gutters.xl` = 24px at `md-and-up` (960px); tablet gets 16px | partial |
| Icon size and target | 24dp icon, 48dp target | `.v-btn--icon` 36px with `margin: 6px` = 48px pitch; first child `margin-left: -6px` puts the 24dp glyph at 16px | yes |
| Title keyline | 72dp (mobile) | no 72px constant: content padding 16px, first-child icon button (36px box with `margin-left: -6px`, so the 24dp glyph sits at 16px) ends at 46px, its 6px right margin reaches 52px, then `__title:not(:first-child) margin-left: 20px` lands the title at 72px; the extension title uses an explicit `margin-left: 72px` | yes (by construction when a nav icon precedes the title) |
| Title keyline, desktop | 80dp | no 80px value; still 72 | no |
| Title type | Medium 20sp | `$headings.h6`: 20px, weight 500, letter-spacing .02em, `white-space: nowrap`, ellipsis | yes (letter-spacing is Vuetify's own) |
| Elevation | 4dp (2dp desktop) | `elevation(4)` everywhere; `--card` variant 0 | yes mobile, no desktop |
| Surface color, light | Grey 100 `#F5F5F5` | `$material-light.app-bar: $grey.lighten-4` (`#F5F5F5`) | yes |
| Surface color, dark | Grey 900 `#212121` | `$material-dark.app-bar: $grey.darken-4` (`#212121`) | yes |
| Ink color | 87% black / 100% white | `$material.text.primary` | yes |
| Floating toolbar margin | not found | `--floating`: `inline-flex`, `margin: 16px` | n/a |
| Card toolbar radius | not found | `--card`: `border-radius: 2px 2px 0 0`, elevation 0 | n/a |
| Fixed / absolute | fixed option | `--fixed` (`position: fixed; z-index: 2`), `--absolute`, `--clipped` (`z-index: 3`) | yes |
| Scroll off / waterfall | scroll off with content, return on reverse scroll | `scroll-off-screen` and `scroll-toolbar-off-screen` props translate the bar by `-computedHeight` or `-computedContentHeight` | yes (JS-driven) |
| Bottom toolbar | not found | `$footer-height: 36px` (`v-footer`), `v-bottom-nav` 56px | n/a |
| Overflow menu | 8dp menu | `v-menu` elevation handled by VMenu, not the toolbar | n/a |
