# Quantum spec: Layout

Material Design 1 (2014 to 2017 "Material Design" guidelines) layout rules for `@paper/quantum`. Every value below is pinned to the archived spec text unless the Confidence column says otherwise. dp and sp map 1:1 to CSS px.

Confidence legend: `high` = read from the archived spec page; `moderate` = Vuetify 1.5.24 stylus or TypeScript only; `low` = memory; `not found` = the sources do not state it.

## Sources

Archived spec pages (Wayback Machine, snapshot timestamp in the URL; the 2018-12-25 00:22:55 request redirects to the nearest capture of each page):

- https://web.archive.org/web/20210805024222/https://material.io/archive/guidelines/layout/principles.html (2021-08-05 capture of the archive page; the 2018 capture timed out)
- https://web.archive.org/web/20210308145521/https://material.io/archive/guidelines/layout/units-measurements.html (2021-03-08 capture of the archive page)
- https://web.archive.org/web/20181225002221/https://material.io/archive/guidelines/layout/metrics-keylines.html
- https://web.archive.org/web/20181225002252/https://material.io/archive/guidelines/layout/structure.html
- https://web.archive.org/web/20181225002227/https://material.io/archive/guidelines/layout/responsive-ui.html
- https://web.archive.org/web/20210816114252/https://material.io/archive/guidelines/layout/split-screen.html (2021-08-16 capture of the archive page)
- https://web.archive.org/web/20160604084504/http://www.google.com/design/spec/usability/accessibility.html (2016-06-04 Google Design capture; the 2018, 2021 and 2018-02-23 live-guidelines captures all timed out after three attempts each)
- https://web.archive.org/web/20181225002208/https://material.io/archive/guidelines/usability/bidirectionality.html
- https://web.archive.org/web/20210805020619/https://material.io/archive/guidelines/patterns/navigation-drawer.html (supplementary, for drawer widths and types)
- https://web.archive.org/web/20181225002150/https://material.io/archive/guidelines/components/bottom-navigation.html (supplementary, for bottom bar metrics)
- https://web.archive.org/web/20181225002140/https://material.io/archive/guidelines/components/toolbars.html (supplementary, toolbar layering rules only; the archived page carries no metrics)

Vuetify 1.5.24 cross-check files (`/home/john/sites/vuetify1/packages/vuetify/src/`):

- `stylus/settings/_variables.styl` (grid breakpoints, gutters, container widths, component sizes)
- `stylus/components/_grid.styl`, `stylus/components/_toolbar.styl`, `stylus/components/_navigation-drawer.styl`, `stylus/components/_bottom-navs.styl`, `stylus/components/_system-bars.styl`, `stylus/components/_app.styl`
- `components/Vuetify/mixins/breakpoint.ts`, `components/VToolbar/VToolbar.ts`, `components/VNavigationDrawer/VNavigationDrawer.ts`, `components/VBottomNav/VBottomNav.ts`, `components/VSystemBar/VSystemBar.ts`

## Units and measurements

| Term | Definition | Confidence |
|---|---|---|
| Pixel density | Number of pixels per inch. `screen density = screen width (or height) in pixels / screen width (or height) in inches` | high |
| Screen resolution | Total number of pixels in a display | high |
| dp | Density-independent pixel. 1 dp = 1 physical px on a 160 dpi screen. `dp = (width in pixels * 160) / screen density` | high |
| sp | Scaleable pixel. Same default value as dp, used for fonts; preserves the user's font size setting | high |
| CSS | "When writing CSS, use px wherever dp or sp is stated." dp is only needed when developing for Android | high |
| Worked example | A 32 x 32 px icon on a 320 dpi screen is 16 x 16 dp | high |

Density independence example (three 1.5 inch wide screens, all 240 dp wide):

| Screen density (dpi) | Screen width (px) | Screen width (dp) | Confidence |
|---|---|---|---|
| 120 | 180 px | 240 dp | high |
| 160 | 240 px | 240 dp | high |
| 240 | 360 px | 240 dp | high |

Image scaling ratios:

| Bucket | dpi | Pixel ratio | Image size for a 100 dp asset | Confidence |
|---|---|---|---|---|
| mdpi | 160 | 1.0 | 100 x 100 px | high |
| hdpi | 240 | 1.5 | 150 x 150 px | high |
| xhdpi | 320 | 2.0 | 200 x 200 px | high |
| xxhdpi | 480 | 3.0 | 300 x 300 px | high |
| xxxhdpi | 640 | 4.0 | 400 x 400 px | high |

iOS points: not found on the archived page.

## Baseline grids

| Grid | Applies to | Confidence |
|---|---|---|
| 8 dp square baseline grid | All components, on mobile, tablet and desktop | high |
| 4 dp square baseline grid | Iconography in toolbars | high |
| 4 dp baseline grid | Type | high |
| 8 dp | Margins and columns of the responsive grid also follow the 8 dp square baseline grid | high |

Vuetify 1.5: `$grid-gutter := 8px`, `$spacer := 16px` (moderate).

## Keylines and spacing

### Mobile

| Metric | Value | Confidence |
|---|---|---|
| Screen edge left and right margins | 16 dp | high |
| Horizontal margins on mobile | 16 dp | high |
| Content associated with an icon or avatar, left margin (content keyline) | 72 dp | high |
| Content left margin from screen edge | 72 dp | high |
| Right-side icons in a detail view (align with the FAB) | 32 dp from the right edge | high |
| Floating action button in list and detail templates | 56 dp | high |
| Status bar | 24 dp | high |
| Toolbar | 56 dp | high |
| Subtitle | 48 dp | high |
| Title and list items | 72 dp | high |
| List item | 72 dp | high |
| Space between content areas | 8 dp | high |
| Navigation drawer: side nav width | Screen width minus the height of the action bar (56 dp from the right screen edge in the template) | high |
| Navigation drawer: account menu and list items | 48 dp | high |
| Navigation drawer: navigation right margin | 56 dp | high |

### Tablet

| Metric | Value | Confidence |
|---|---|---|
| Screen edge left and right margins (padding) | 24 dp | high |
| Content left margin from screen edge | 80 dp | high |
| Card left and right padding (list with detail, right FAB template) | 24 dp | high |
| Card content left padding | 104 dp | high |
| Card left and right padding (list with detail, left FAB template) | 32 dp | high |
| Card nav item left padding | 96 dp | high |
| Nav item left padding from screen edge | 104 dp | high |
| Icons' vertical center distance from screen edge | 52 dp | high |
| Status bar, and space above list | 24 dp | high |
| Toolbar and list item | 64 dp | high |
| List item | 64 dp and 72 dp (both printed in the first tablet "List with detail view" template without qualification; the page does not use the word dense) | high |
| Subtitle, list item, and slider | 48 dp | high |
| Title | 80 dp | high |
| Space between content areas | 8 dp | high |

### Desktop

Keylines and spacing blocks for desktop inherit grid rules from tablet and mobile, depending on window size (high). The 24 dp desktop margin appears as the app bar content padding (see App bar) and as the 24 dp gutter of the breakpoint table (high). A separate desktop keyline table does not exist on the page (not found).

### Ratio keylines

| Rule | Value | Confidence |
|---|---|---|
| Recommended aspect ratios (width:height) | 16:9, 3:2, 4:3, 1:1, 3:4, 2:3 | high |
| Width formula | `Width = Aspect ratio * Height` | high |
| Height formula | `Height = Width / Aspect ratio` | high |
| Worked example | A 360 dp wide image at 2:3 is 540 dp tall | high |

### Sizing by increments

| Rule | Value | Confidence |
|---|---|---|
| Increment | The height of a standard element, for example the 56 dp action bar, so one increment = 56 x 56 dp | high |
| Worked example | 8 increments of 56 dp = 448 dp | high |
| Where increments apply | Mostly desktop, often tablet, infrequently mobile | high |
| Example card width | 8 increments wide | high |
| Example extended app bar height | 2 increments | high |
| Example right panel width | 5 increments | high |
| Standard increment per device (navigation drawer page) | 56 dp mobile, 64 dp tablet | high |

### Touch targets

| Rule | Value | Confidence |
|---|---|---|
| Minimum touch target | 48 x 48 dp | high |
| Space between targets | 8 dp or more, in most cases | high |
| Physical size of 48 dp | About 9 mm regardless of screen size | high |
| Recommended physical target size | 7 mm to 10 mm | high |
| Avatar | 40 dp, with a 48 dp touch target | high |
| Icon | 24 dp, with a 48 dp touch target | high |
| Button height | 36 dp, with a 48 dp touch target height | high |
| Desktop pointer target size | not found | not found |

Vuetify 1.5 cross-check (moderate): `$button-height := 36px`, `$button-min-width := 88px`, button margin `6px 8px` (36 + 2 x 6 = 48 px tall hit area), icon buttons in toolbars get `margin: 6px`, `$list-item-single-height := 48px`, double `72px`, triple `88px`, avatar single `56px`, `$list-item-left-padding := 72px`, `$list-item-right-margin := 56px`, list left and right padding `16px`, list top and bottom padding `8px`, FAB `56px` (small `40px`, large `72px`). All agree with the keylines above.

## Responsive UI

### Named breakpoint widths

"Material design user interfaces should adapt layouts for the following breakpoint widths: 480, 600, 840, 960, 1280, 1440, and 1600dp." (high)

| Rule | Value | Confidence |
|---|---|---|
| Layouts under 600 dp wide | One level of content hierarchy (summary or detail, not both) | high |
| Layouts over 600 dp wide | Two levels of content hierarchy (summary and detail) | high |
| Layouts over 1600 dp wide | Grow until a max width, then either center with increased margins, stay left aligned while the right margin grows, or keep growing and reveal more content | high |
| Defining width | The smallest width in either orientation is the defining value | high |

### Breakpoint system

Verbatim table. Columns are the number of grid columns; Gutter is in dp.

| Breakpoint (dp) | Handset / Tablet portrait | Handset / Tablet landscape | Window | Columns | Gutter (dp) | Confidence |
|---|---|---|---|---|---|---|
| 0 | small handset | | xsmall | 4 | 16 | high |
| 360 | medium handset | | xsmall | 4 | 16 | high |
| 400 | large handset | | xsmall | 4 | 16 | high |
| 480 | large handset | small handset | xsmall | 4 | 16 | high |
| 600 | small tablet | medium handset | small | 8 | 16/24 (*) | high |
| 720 | large tablet | large handset | small | 8 | 16/24 (*) | high |
| 840 | large tablet | large handset | small | 12 | 16/24 (*) | high |
| 960 | | small tablet | small | 12 | 24 | high |
| 1024 (**) | | large tablet | medium | 12 | 24 | high |
| 1280 (**) | | large tablet | medium | 12 | 24 | high |
| 1440 (**) | | | large | 12 | 24 | high |
| 1600 (**) | | | large | 12 | 24 | high |
| 1920 (**) | | | xlarge | 12 | 24 | high |

(*) 16 dp when the smallest width of the device is under 600 dp, otherwise 24 dp (high).
(**) Desktop breakpoints are 16 dp below the listed values to accommodate variations in browser chrome, so the effective desktop values are 1008, 1264, 1424, 1584 and 1904 dp (the subtraction is high; the computed effective values are arithmetic on the spec text).

Per-row margins: the table has no margin column. Margins come from the rule below (not found per row).

### Margins and gutters

| Rule | Value | Confidence |
|---|---|---|
| Grid | 12-column grid; the column count varies by breakpoint (4, 8, 12) | high |
| Allowed margin and gutter widths | 8, 16, 24 or 40 dp | high |
| Margins and gutters | Need not be equal (for example 40 dp margins with 24 dp gutters) | high |
| Illustrated combinations | 8/8, 16/16, 24/24, 40/40, and 40 dp margins with 24 dp gutters | high |

### Grid behaviour

| Behaviour | Definition | Confidence |
|---|---|---|
| Full-width grid | Fluid columns; breakpoints decide when the layout changes | high |
| Centered grid | Fixed columns; the layout reflows when all columns plus a defined margin no longer fit | high |

### Panel influence on the grid

| Panel | Effect on the grid | Confidence |
|---|---|---|
| Permanent | Exists outside the responsive grid; appears at a defined breakpoint and squeezes content; no show or hide control | high |
| Persistent | Appears and squeezes both content and the grid; content stays accessible; hides on toggle | high |
| Temporary | Does not affect the grid or content when off-screen; pushes grid content off-screen or overlays it when visible; hidden by touching outside the panel or an item inside it | high |

### Surface behaviors

Visibility:

| Behavior | Definition | Confidence |
|---|---|---|
| Permanent | Always visible when screen space is available | high |
| Persistent | Toggles between visible and hidden; interacting with other elements does not change visibility | high |
| Temporary | Toggles between visible and hidden; interacting with other elements hides or minimizes it | high |

Width:

| Behavior | Definition | Confidence |
|---|---|---|
| Fixed | Width stays the same when screen size changes | high |
| Fluid | Width grows as screen size changes | high |
| Sticky | Width is fixed until influenced by another element or breakpoint | high |
| Squeeze | Width contracts as a panel is revealed | high |
| Push | Width stays the same; position shifts horizontally as a panel appears; may be partially occluded by the screen edge | high |
| Overlay | Width and position stay the same as a panel appears over content | high |

Descriptors:

| Descriptor | Definition | Confidence |
|---|---|---|
| Above, Below | y position | high |
| Over, Under | z position of an element in motion | high |
| In Front, Behind | static z position | high |
| Left, Right, Centered | x position | high |
| Top, Bottom | y position relative to a screen edge | high |
| Flat, Raised | z position and shadow; a flat element has no shadow | high |
| Inset, Full Bleed | padding of an image or element | high |
| Summary, Detail | a content summary and its full expansion | high |

### Responsive patterns

| Pattern | Examples from the spec | Confidence |
|---|---|---|
| Reveal | Hidden UI such as a side nav becomes visible; a simple UI reveals more options; tap-to-reveal content shows by default | high |
| Transform | Side navigation becomes tabs; a list becomes a grid list; menu items become toolbar icons | high |
| Divide | Side nav, list and detail divide to fill one view; left panel, list and right panel divide; tabbed siblings divide | high |
| Reflow | Single-column elements reflow into the content area; horizontal tabs reflow into a vertical list; elements reflow on orientation change | high |
| Expand | Cards expand to fill new space; dialogs expand proportionally or in increments | high |
| Position | A bottom sheet repositions as a menu; a FAB moves to a more visible location | high |

### Vuetify 1.5 cross-check: breakpoints

| Vuetify name | CSS (`_variables.styl`) | JS threshold (`breakpoint.ts`) | Spec row | Agreement |
|---|---|---|---|---|
| xs | 0 | width < 600 | 0 to 599 dp | agrees (spec xsmall ends at 600) |
| sm | 600px | 600 <= width < 960 | 600 small | agrees |
| md | 960px | 960 <= width < 1280 - 16 | 960 small, 1024 medium | Vuetify has no 1024 breakpoint; its md spans two spec windows |
| lg | 1280px - 16px = 1264px | 1264 <= width < 1920 - 16 | 1280 medium, 1440 large, 1600 large | agrees on the 16 dp reduction; Vuetify applies it to 1280 and 1920 only, the spec applies it to 1024, 1280, 1440, 1600 and 1920 |
| xl | 1920px - 16px = 1904px | width >= 1904 | 1920 xlarge | agrees |

Other Vuetify 1.5 grid values (moderate): `$grid-columns := 12`; `$grid-gutters` xs 2px, sm 4px, md 8px, lg 16px, xl 24px (these are the `grid-list-*` item gutters, not the spec's 16/24 dp column gutters); `.container` padding 24px, 16px at sm-and-down, `max-width` = breakpoint x 0.9375 at md (900px), lg (1185px) and xl (1785px); `scrollbarWidth: 16`. The spec text wins where they differ: Quantum should expose the full 13-row spec table, not Vuetify's five names.

## Structure

### UI regions

| Device | Regions | Confidence |
|---|---|---|
| Mobile | Side nav, app bar / primary toolbar, content area below the app bar, right nav; optional bottom bar; permanent app bar and FAB; side nav menus overlay all other structural elements | high |
| Tablet | Same regions; the app bar absorbs elements from the mobile bottom bar; right nav can be temporary or pinned | high |
| Desktop | App bar / primary toolbar; a row of toolbar, secondary toolbar, toolbar; side nav, content canvas, right nav; FAB at the bottom; side nav may take the full screen height including under the app bar; window controls absorbed into the app bar where possible | high |
| Dividers | Define one primary horizontal or vertical divider; avoid slicing into too many regions (L shapes); use whitespace for secondary areas; break edges with cards and FABs | high |

### App bar

Default heights:

| Context | Height | Confidence |
|---|---|---|
| Mobile landscape | 48 dp | high |
| Mobile portrait | 56 dp | high |
| Tablet and desktop | 64 dp | high |
| Extended app bar | Default height plus content increment(s) | high |
| Mobile prominent (extended) app bar | 128 dp | high |
| Desktop prominent app bar | 128 dp | high |
| Desktop dense app bar | 48 dp | high |
| Desktop dense prominent app bar | 96 dp | high |

Mobile app bar metrics (56 dp bar):

| Metric | Value | Confidence |
|---|---|---|
| App bar height | 56 dp | high |
| Left and right padding | 16 dp | high |
| Icon top, bottom and left padding | 16 dp | high |
| Title left padding | 72 dp | high |
| Title bottom padding | 20 dp | high |

Mobile prominent app bar (128 dp):

| Metric | Value | Confidence |
|---|---|---|
| App bar height | 128 dp | high |
| Action area height | 56 dp | high |
| Title area height | 80 dp | high |
| Title area bottom padding | 8 dp | high |
| Description area height | 72 dp | high |
| Description area bottom padding | 16 dp | high |

Desktop app bar (64 dp increment):

| Metric | Value | Confidence |
|---|---|---|
| App bar height (sets the keyline increment) | 64 dp | high |
| Left and right content padding | 24 dp | high |
| Icon top and bottom padding | 20 dp | high |
| Prominent app bar height | 128 dp | high |
| Prominent: left and right icon padding | 24 dp | high |
| Prominent: left content padding | 80 dp | high |

Desktop dense app bar:

| Metric | Value | Confidence |
|---|---|---|
| Dense app bar height | 48 dp | high |
| Left and right content padding | 24 dp | high |
| Left content padding | 80 dp | high |
| Icon height with touch target | 40 dp | high |
| Dense prominent app bar height | 96 dp | high |

Other app bar rules (high): the nav icon at the left can open a navigation drawer, be an up arrow, or be omitted; the title reflects the current page; right-side icons are app actions and the menu icon opens the overflow menu; all icons in an app bar share one color; the title may have a distinct color on backgrounds with enough contrast for both black and white glyphs; variants are light, dark, colored and transparent; a menu is a temporary sheet that always overlaps the app bar rather than extending it.

Toolbar layering (toolbars page, high): toolbars sit a step above the sheet their actions affect; affected content scrolls underneath and is clipped; sheets may temporarily cover a toolbar while moving off-screen; a toolbar's left and right actions are never split by another persistent sheet (menus and dialogs excepted); toolbars may constrain their width to make room for sheets; a toolbar sharing a seam that lifts into a step on scroll is called a waterfall.

Vuetify 1.5 cross-check (`VToolbar.ts`, `_toolbar.styl`, moderate): heights `mobileLandscape: 48`, `mobile: 56`, `desktop: 64`, `dense: 48`; desktop height applies when `prominent` or the breakpoint is `mdAndUp` (width >= 960 px); landscape height applies at `smAndDown` when width > height; `tabs` extension is 48 px; `extended` adds an extension equal to the content height unless `extensionHeight` is set; content padding `0 24px` (`0 16px` at sm-and-down); extension title `margin-left: 72px`; icon buttons `margin: 6px`; floating toolbar margin 16px. Disagreement: Vuetify's `prominent` only forces the 64 dp desktop height; the spec's prominent app bar is 128 dp (96 dp dense). Vuetify also switches to 64 dp at 960 px, whereas the spec ties 64 dp to tablet and desktop devices, not to a width.

### System bars

| Bar | Height | Confidence |
|---|---|---|
| Android status bar | 24 dp | high |
| Chrome window bar | 32 dp | high |
| Android navigation bar (Back, Home, Overview) | 48 dp | high |
| Chrome OS shelf | 56 dp | high |

| Rule | Value | Confidence |
|---|---|---|
| Default status bar color | A darker shade of the app bar color; may also sample another element or be translucent | high |
| Translucent dark status bar | 20% black #000000 | high |
| Translucent light status bar | 70% white #FFFFFF | high |
| Light status bar default fill | #E0E0E0 | high |
| Navigation bar color variants | Opaque, translucent, transparent | high |
| Full-screen modes | Lean back (touch anywhere to restore bars), Immersive (swipe from any edge; explained on first use; edge-swipe apps also show bars semi-transparently for a few seconds), Lights Out (action bar and status bar fade after a few seconds of inactivity; navigation bar stays available but dimmed) | high |
| System bars are not material | Elements outside applications, such as system bars, are separate from app content and are not treated as material (principles page) | high |

Vuetify 1.5 cross-check (`VSystemBar.ts`, `_system-bars.styl`, moderate): 24 px default, 32 px with `window`; padding `0 8px`; status variant icon margin-right 4px, window variant icon margin-right 8px; `lights-out` background `rgba(255,255,255,.7)` light theme. Agrees.

### Side nav (navigation drawer)

Widths:

| Context | Value | Source page | Confidence |
|---|---|---|---|
| Mobile width | Screen width minus 56 dp | structure | high |
| Mobile maximum width | 320 dp (applies to a left nav only; a right nav may cover the full screen width) | structure | high |
| Mobile maximum width | 280 dp (5 x the 56 dp mobile increment) | navigation-drawer pattern | high |
| Tablet maximum width | 320 dp (5 x the 64 dp tablet increment) | navigation-drawer pattern | high |
| Desktop maximum width, left nav | 400 dp | structure | high |
| Desktop right nav width | Varies with content | structure | high |
| Desktop or tablet fixed width (256 dp) | not found on any fetched page | | not found |
| Mini variant width | not found (the pattern page describes the state, not a width) | | not found |
| Side sheet width | not found (side sheets are not an MD1 component; MD1 has a right nav only) | | not found |

Disagreement inside the spec: the structure page caps the mobile drawer at 320 dp, the navigation-drawer pattern page at 280 dp (320 dp on tablet). Both are archived 2018 text. Quantum should implement the pattern page's increment rule (5 x 56 = 280 dp mobile, 5 x 64 = 320 dp tablet) and document the structure page's 320 dp as the mobile ceiling it must never exceed.

Drawer keylines (navigation-drawer pattern page):

| Metric | Value | Confidence |
|---|---|---|
| Icons align at screen left and right margins | 16 dp | high |
| Horizontal margins | 16 dp mobile, 24 dp tablet | high |
| Content associated with an icon or avatar, left margin | 72 dp | high |
| Status bar | 24 dp | high |
| Subtitle (header) | 56 dp | high |
| Subtitles and list items | 48 dp | high |
| Space between content areas | 8 dp | high |
| Padding at the top and bottom of every list grouping | 8 dp (except at the top of a list with a subheader) | high |
| Dividers | Full-bleed within the drawer, 8 dp padding above and below | high |
| Resting elevation | 16 dp, spanning the full screen height including behind the status bar, with a scrim over everything behind it | high |
| Name text | Roboto Medium, 14 sp, #FFFFFF | high |
| Email text | Roboto Regular, 14 sp, #FFFFFF | high |
| List item text | Roboto Medium, 14 sp, 87% #000000 | high |
| Subheader text | Roboto Medium, 14 sp, 54% #000000, aligned to the 16 dp keyline | high |
| Icon color | 54% #000000 | high |
| Selected item | Changes color to the app's primary color (or 100% #000000); the touch ripple highlights the row; use a darker tint of primary if the ripple contrast is insufficient | high |

Drawer types:

| Type | Behaviour | Confidence |
|---|---|---|
| Permanent | Always visible, pinned to the left edge, at the same elevation as the content or background; cannot be closed; recommended default for desktop; sub-types: full-height, clipped under the app bar, floating (also floating in a card); pinning threshold is computed from side nav width, content width and content padding | high |
| Persistent | Toggles open and closed; same surface elevation as the content; closed by default; opens from the menu icon and stays open until closed; state remembered across actions and sessions; when outside the page grid it forces content to resize; acceptable for all sizes larger than mobile; not recommended with up-arrow hierarchies | high |
| Mini variant | A persistent drawer that changes width; its resting state is a mini drawer at the same elevation as the content, clipped by the app bar; expands to the standard persistent drawer; also an acceptable closed state for a temporary drawer | high |
| Temporary | Toggles open and closed; closed by default; opens above all other content until a section is selected; required on mobile; recommended on tablet | high |
| Placement | Left nav content is navigation or identity; right nav content is secondary to the page; screen size decides pinned versus overlay | high |

Vuetify 1.5 cross-check (`VNavigationDrawer.ts`, `_navigation-drawer.styl`, moderate): `width` default 300 px (the spec gives no fixed width; 300 is Vuetify's choice), `miniVariantWidth` 80 px, `mobileBreakPoint` 1264 px, `height` 100%, `z-index: 3` (6 when temporary or mobile), elevation 16 when temporary or mobile and open, 0 otherwise (matches the spec's "same elevation as content"); mini variant centers list tile actions and avatars at `min-width: 48px` and hides subheaders, dividers and groups.

### Bottom bars

The structure page names an optional bottom bar on mobile and tablet without metrics (high). Metrics come from the bottom navigation component page:

| Metric | Fixed bottom navigation | Shifting bottom navigation | Confidence |
|---|---|---|---|
| Height | 56 dp | 56 dp | high |
| Action width | View width / number of actions | Same rule | high |
| Action minimum width (includes padding) | 80 dp | 56 dp inactive, 96 dp active | high |
| Action maximum width (includes padding) | 168 dp | 96 dp inactive, 168 dp active | high |
| Icon | 24 x 24 dp | 24 x 24 dp | high |
| Padding above icon | 6 dp active, 8 dp inactive | 6 dp active; 16 dp above and below the icon inactive | high |
| Padding under text | 10 dp | 10 dp | high |
| Padding left and right of text | 12 dp | 12 dp (text labels may use the full width on the active view) | high |
| Padding below icon with no title | not stated | 16 dp | high |
| Elevation | 8 dp (snackbars at 6 dp pass behind it) | 8 dp | high |

Vuetify 1.5 cross-check (`VBottomNav.ts`, `_bottom-navs.styl`, moderate): height 56 default; buttons `min-width: 80px`, `max-width: 168px`, padding `8px 12px 10px`, active `padding-top: 6px`, label 12 px inactive and 14 px active, icon `margin-bottom: 4px`; shift variant `min-width: 56px`, `max-width: 96px`, active `96px` to `168px`. Agrees. Vuetify paints the bar with the single-layer `box-shadow: 0 3px 14px 2px rgba(0,0,0,.12)` instead of the three-layer 8 dp recipe (see elevation.md).

### Whiteframes

Named layout structures on the structure page (high): carded content that expands and collapses; overlaid content details with a focused app bar on mobile; left side nav and one-up stream on mobile; source list; full-screen background image with an inset search field and carded search results; expandable footer drawer. Their downloadable files are on the Resources page (not fetched).

## Layout principles

| Rule | Statement | Confidence |
|---|---|---|
| Paper | The app background resembles a flat, opaque sheet of paper; app behaviour mimics paper being resized, shuffled and bound into multiple sheets; surfaces are called material or sheets of material | high |
| Seam | Two sheets sharing an entire common edge; while joined they move together | high |
| Step | Two overlapping sheets with different z positions; they move independently | high |
| System bars | Not material; separate from app content beneath them | high |
| Floating action button | A circular sheet separate from a toolbar representing one promoted action; may straddle a step if it relates to the content creating the step; may straddle a seam if it relates to both sheets; never add a decorative seam just to anchor an action | high |
| Print heritage | Baseline grids, structural templates, repeated visual elements and spacing across platforms and screen sizes | high |

## Split screen

Android only (high).

| Rule | Value | Confidence |
|---|---|---|
| Activation | Only the user may activate split-screen mode; apps may not invoke it | high |
| New activities | Launch in the same portion of the screen by default; apps resize to fit; may launch in the opposite portion only when the activities are related and usable together, the task warrants two visible activities, and the UI makes the split explicit (for example an "Open in new window" button) | high |
| Lifetime | Stays active until the user cancels it or switches to an incompatible app | high |
| Resizing | Users drag the divider between the two screens to move and resize them | high |
| Edge swipes | Likely to conflict with the resize gesture; every edge-swipe action needs an alternative (the nav drawer is also opened by the menu icon) | high |
| Minimum design size | Design a layout that works at 220 dp wide or tall by condensing or removing non-essential elements, then scale up | high |
| Aspect ratio, portrait, mobile | 16:9 | high |
| Aspect ratio, portrait, tablet | "34.15%" (verbatim; the page expresses the tablet ratio as a percentage) | high |
| Orientation | Rotating must not change the UI unexpectedly (no auto full-screen video on rotate) | high |
| Layouts | Apps with similar mobile and tablet layouts may switch between them on resize; apps with different layouts should adapt the tablet UI rather than show the mobile UI on tablet | high |
| Controls | Scale content to an appropriate size and density; collapse primary controls such as tabs into a menu | high |
| Split ratio, drag handle size, FAB rules | not found on the archived page | not found |

## Accessibility

Source: the 2016 Google Design capture (see Sources). The archived 2018 page was unreachable, so wording may differ from the 2018 revision; the numbers below are the W3C and touch-target values the spec cites.

| Rule | Value | Confidence |
|---|---|---|
| Principles | Clear (visible elements, sufficient contrast and size, clear hierarchy, key information at a glance); Robust (navigate, understand important tasks, access with text-only screen readers); Specific (support platform assistive technology such as TalkBack) | high |
| Contrast ratio range | 1:1 to 21:1 (W3C luminance based) | high |
| Small text contrast | At least 4.5:1 against its background | high |
| Large text contrast | At least 3:1; large text is 14 pt bold or 18 pt regular and up | high |
| Icons and critical elements | Same ratios as text | high |
| Logos and decorative elements | Exempt from contrast ratios, but must be distinguishable if they carry functionality; do not distort a logo to meet ratios | high |
| Color blindness | Communicate states with strokes, indicators, patterns, texture or text in addition to color (red-green, blue-yellow and monochromatic forms) | high |
| Sound | Provide captions, transcripts or visual alternatives; avoid sounds that play over a screen reader and extra sounds on native elements | high |
| Motion: auto-moving content | Must be pausable, stoppable or hideable if it lasts more than 5 seconds | high |
| Motion: flashing | At most 3 flashes in any 1 second period; avoid flashing large central regions | high |
| Touch targets | At least 48 x 48 dp with 8 dp or more between them; 48 dp is about 9 mm; recommended 7 mm to 10 mm; a 24 dp icon or 40 dp avatar sits in a 48 dp target; a 36 dp button has a 48 dp target height | high |
| Grouping | Keep related items close together (slider and its value) | high |
| Accessibility text | Succinct; do not include control type or state (screen readers announce it); use action verbs for what an element does, not what it looks like; keep descriptions consistent; do not name the gesture ("tap"); confirm destructive actions with dialogs, toasts or snackbars; use hint speech sparingly | high |
| Roles | Every element needs an accessibility role (ARIA on web); extend native controls to inherit the right role | high |
| Focus order | Follows the visual layout from top to bottom and from most to least important; define how elements group and where focus moves when the focused element disappears; indicate focus with visuals and accessibility text; restore focus to the previously focused element after an interruption | high |
| Hierarchy | Important actions at the top or bottom of the screen; related items adjacent; group similar items under headings | high |
| Implementation | Prefer standard platform controls; support scalable text and spacious layouts; make every task and all hover information reachable by keyboard only; test with assistive settings on and with users of assistive technology | high |
| Minimum text size, 200% scaling, desktop pointer target | not found | not found |

## Bidirectionality

### Mirroring rules

| Rule | Statement | Confidence |
|---|---|---|
| Direction | LTR displays content left to right; RTL displays content right to left; time passes left to right in LTR and right to left in RTL | high |
| Mirroring | An RTL layout is the mirror image of the LTR layout and affects layout, text and graphics | high |
| Text | Always in the correct direction for its own language; LTR words such as URLs stay LTR inside an RTL UI; never display LTR text in reverse order | high |
| Mirrored on direction change | Text field icons move to the opposite side; navigation buttons reverse order; icons that communicate direction (arrows) mirror; translated RTL text aligns right; primary and secondary buttons mirror; checkboxes sit to the right of text; the back button points right; progress bars fill in reading direction (0% on the right, 100% on the left); tabs align right and users swipe right for more; next page on the left and previous page on the right; calendar days run right to left; timelines progress right to left | high |
| Not mirrored | Numbers (clocks, phone numbers); untranslated text; icons that do not communicate direction (camera); charts and graphs; placement of units may vary by language | high |

### Icons that mirror

| Icon | Rule | Confidence |
|---|---|---|
| Back and forward arrows | The most important icons to mirror; back and forward navigation buttons are reversed | high |
| Icons showing forward movement (bicycle) | Mirror so forward points left in RTL | high |
| Volume with slider | Mirror; the slider progresses RTL and the sound waves emerge from the right | high |
| Redo and undo | Carry both a horizontal and a circular direction; in RTL choose whether to show circular or horizontal direction | high |
| Icons containing text representations (chat, paragraph with indent or ragged edge) | Mirror so the indent, unfinished line or ragged side matches right alignment | high |
| Person walking forward | Faces left in RTL | high |
| Indent and list toolbar buttons | Follow the direction of the paragraph being edited, even inside an unmirrored LTR document | high |

### Icons that do not mirror

| Icon | Rule | Confidence |
|---|---|---|
| Clock | Clocks turn clockwise in every locale | high |
| Refresh (clockwise arrow), circular progress | Circular time is not mirrored | high |
| History (counterclockwise arrow) | Not mirrored | high |
| Keyboard, headset, media players | Physical objects look the same everywhere | high |
| Search (magnifier handle bottom right), local cafe | Depict holding an object in the right hand; RTL users are also mostly right-handed | high |
| Slashes (off states) | Most RTL countries do not mirror slashes; leave the LTR slash | high |
| Media playback buttons and media progress indicator | Always LTR; they show the direction of the tape, not of time | high |
| Camera | Does not communicate direction | high |
| Charts and graphs | Not mirrored | high |

### RTL metrics (identical in both directions, sides swapped)

| Metric | Value | Confidence |
|---|---|---|
| Tab touch target height | 48 dp | high |
| Screen edge margin before the first tab | 72 dp | high |
| Tab label bottom padding | 20 dp | high |
| Tab label left and right padding | 12 dp | high |
| App bar icon padding from the screen edge | 16 dp | high |
| App bar title distance from the screen edge | 72 dp | high |
| Padding below the app bar title | 20 dp | high |
| App bar (navigation bar) height | 56 dp | high |
| Overflow menu padding | 16 dp | high |
| List item height | 72 dp | high |
| List icon margin from the leading screen edge | 16 dp | high |
| List item distance from the leading screen edge | 72 dp | high |

### Localization

| Rule | Statement | Confidence |
|---|---|---|
| Text in graphics | Usually requires localization | high |
| Numerals | Localize numbers, including numbers inside icons, for locales with their own numerals (Bengali, Marathi, Nepali, some Arabic-speaking locales) | high |
| Mirrored content in an unmirrored UI | An RTL paragraph inside an LTR document gets RTL editing buttons (indent, lists) while the primary UI stays LTR | high |

Vuetify 1.5 cross-check (`_app.styl`, `settings/_rtl.styl`, moderate): RTL is `.application--is-rtl { direction: rtl }` plus per-component `rtl()` mixins that swap margins (toolbar title, chips, switch, snackbar). Vuetify 1.5 ships no icon mirroring list; the table above is the only source.

## Disagreements and gaps

| Item | Spec | Vuetify 1.5 | Resolution |
|---|---|---|---|
| Breakpoint set | 13 rows, 0 to 1920 dp, desktop rows minus 16 dp | 5 names: 0, 600, 960, 1264, 1904 | Spec wins; expose all rows, keep 16 dp desktop reduction |
| Prominent app bar | 128 dp (96 dp dense) | `prominent` forces 64 dp | Spec wins |
| 64 dp app bar trigger | Tablet and desktop devices | width >= 960 px | Spec gives no px width; Quantum must document its own mapping (recommend the 600 dp "small" window, since the spec's 64 dp list items also start at tablet) |
| Mobile drawer max width | 320 dp (structure) versus 280 dp (pattern page) | 300 px default | Pattern page increment rule (280 mobile, 320 tablet), 320 dp as the hard ceiling |
| Mini variant width | not found | 80 px | Vuetify value, moderate |
| Bottom navigation shadow | 8 dp elevation | single-layer 12% shadow | Spec wins; use the 8 dp recipe |
| Side sheets, standard bottom sheet widths | not found in MD1 | n/a | Out of scope for Quantum |
| Desktop pointer target, minimum text size | not found | n/a | Leave unspecified |
