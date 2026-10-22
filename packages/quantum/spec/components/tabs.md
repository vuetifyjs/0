# Tabs (MD1)

Spec page: `components/tabs.html`. Quantum component: `QuTabs` (bar) with `QuTab` (item) and the content panels. Composes v0 `Tabs.Root` per DESIGN_SYSTEMS.md ruling 2.

## Sources

| Source | URL (snapshot) | Read |
|---|---|---|
| MD1 archived spec, Tabs | `https://web.archive.org/web/20181225002217/https://material.io/archive/guidelines/components/tabs.html` (requested `20181225002255`, archive resolved to `20181225002217`) | full text |
| 2016 Google Design spec, Tabs (cross-check) | `https://web.archive.org/web/20160530205717/http://www.google.com/design/spec/components/tabs.html` | full text; specs identical to 2018; differs only in "Tab labels may be either all icons or all text" |
| 2015 Google Design spec, Tabs (cross-check, rules later dropped) | `https://web.archive.org/web/20150302181952/http://www.google.com/design/spec/components/tabs.html` | full text |
| MD1 Patterns, Scrolling techniques (tab bar in the app bar) | `https://web.archive.org/web/20181225002145/https://material.io/archive/guidelines/patterns/scrolling-techniques.html` | full text |
| MD1 Patterns, Navigation (when to use tabs) | `https://web.archive.org/web/20181225002243/https://material.io/archive/guidelines/patterns/navigation.html` | Tabs and combinations sections |
| MD1 Layout, Metrics and keylines (keylines, touch target) | `https://web.archive.org/web/20181225002221/https://material.io/archive/guidelines/layout/metrics-keylines.html` | full text |
| MD1 Layout, Responsive UI (breakpoints for "larger / smaller views") | `https://web.archive.org/web/20181225002227/https://material.io/archive/guidelines/layout/responsive-ui.html` | breakpoint section |
| MD1 Style, Typography | `https://web.archive.org/web/20181225002206/https://material.io/archive/guidelines/style/typography.html` | type scale image, Button style rule |
| MD1 Style, Color (text opacity on colored backgrounds) | `https://web.archive.org/web/20181225002149/https://material.io/archive/guidelines/style/color.html` | usability section |
| MD1 Components, Buttons (overlay opacities for reference) | `https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html` | specs sections |
| MD1 Material design, Elevation and shadows | `https://web.archive.org/web/20181225002223/https://material.io/archive/guidelines/material-design/elevation-shadows.html` | component table |
| MD1 Motion, Duration and easing | `https://web.archive.org/web/20181225002212/https://material.io/archive/guidelines/motion/duration-easing.html` | full text |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_tabs.styl`, `src/stylus/settings/_variables.styl`, `_theme.styl`, `src/components/VTabs/VTabs.js`, `src/components/VTabs/mixins/tabs-props.js`, `tabs-computed.js`, `src/components/VTabs/VTab.js` | cross-check |

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Definition | "Tabs make it easy to explore and switch between different views." "Tabs enable content organization at a high level, such as switching between views, data sets, or functional aspects of an app." | high |
| Placement | "Present tabs as a single row above their associated content. Tab labels should succinctly describe the content within." | high |
| Swipe conflict | "Because swipe gestures are used for navigating between tabs, don't pair tabs with content that also supports swiping." Examples: pannable maps, lists with swipe-to-dismiss. | high |
| When to use | "Use tabs to organize content at a high level, for example, to present different sections of a newspaper. Don't use tabs for carousels or pagination of content." | high |
| Navigation pattern | "Tabs allow users to quickly move between a small number of equally important views." Appropriate for "Parents with embedded child views", "A group of sibling views". Recommended for "Frequent switching between views", "Apps with few top-level views", "Promoting awareness of alternate views". | high |
| Fixed vs scrollable | "Fixed tabs should be used with a limited number of tabs and when consistent placement will aid muscle memory. Scrollable tabs should be used when there are many or a variable number of tabs." | high |
| Equal importance | Do: "The tabs switch between equally important facets of store content." Don't: "The tabs switch between destinations of varied importance within the store." | high |
| Content | "All content within a set of tabs should be related under a larger organizing principle (for example, Settings or Directions), with each tab's content mutually exclusive of the others'." "Avoid the need for cross-tab comparison of content." | high |
| Labels | "use short titles"; "Wrap tab labels to a second line if needed, and then truncate."; Don't: "Don't resize single-line labels."; Don't: "Truncating labels too early can impede comprehension." | high |
| Icons and text | 2018 banner: "Tab labels may include icons and text." 2018 Don't caption: "Do not combine text labels with icons. Use either all text labels or all icon labels." 2016: "Tab labels may be either all icons or all text." The 2018 page contradicts itself; the spec section "Tabs with icons and text" (72dp) exists in both revisions, so a stacked icon-plus-text tab is a specified variant while mixing labeled and unlabeled tabs in one bar is the forbidden case. | high (texts), ruling is interpretation |
| Count (2015) | "A set of tabs contains at minimum a pair of tabs and no more than six tabs." Dropped from 2016 and 2018; keep as guidance, not a hard limit. | high (2015 only) |
| Nesting | "Do not include a set of tabbed content within a tab"; "Tabs should not be nested." | high |
| Highlight | "Highlight the tab corresponding to the visible content" | high |
| Adjacency | "Keep tabs adjacent to their content to maintain the relationship between the two" | high |

## 2. Types and variants

| Type | Definition | Width rule | Alignment | Confidence |
|---|---|---|---|---|
| Fixed tabs | "display all tabs concurrently"; "Fixed tabs have equal width, calculated either as the view width divided by the number of tabs, or based on the widest tab label." | min 160dp larger views / 72dp smaller views; max 264dp (inclusive of padding) | "Full-width for smaller views", "Centered for larger views"; "If the margin between the tab edge and view edge is 16dp or less, use full-width tabs instead of centered tabs." | high |
| Scrollable tabs | "display a subset of tabs at any given moment. They can contain longer tab labels and a larger number of tabs than fixed tabs." "The width of each tab is independently calculated." | min 160dp / 72dp; max "whichever fits and is smaller: 264dp or (the value of view size minus 56dp)" | "The left-most tab content aligns with the keyline. Alignment varies between landscape and portrait to match the different keylines." | high |
| Centered tabs | desktop caption "Tab bar centered"; fixed tabs "Centered for larger views" | as fixed | centered | high |
| Desktop tabs | same width rules | text 13sp; padding 24dp; first tab text left padding 80dp | "Centered or aligned with left keyline" | high |
| Tabs with text only | 48dp | | | high |
| Tabs with icons and text | 72dp, icon above text | | | high |
| Tabs with icons only | 48dp | | | high |
| Tabs with a "More" dropdown (desktop) | captions: "Tabs with a More dropdown menu", "Tabs with an expanded More dropdown menu", "Tabs with Books selected from a More dropdown menu" | overflow tabs collected into a menu | | high (named only, no metrics) |
| Tabs with overflow pagination (desktop) | captions: "Tabs with overflow pagination", "Tabs with overflow pagination scrolled" | paging arrows scroll the bar | | high (named only, no metrics) |
| Tab bar placement in the app bar | Scrolling techniques: tab bar block 48dp below the 56 / 64dp toolbar; app bar combinations "Default app bar and fixed tab bar", "Extended app bar and fixed tab bar", "Fixed tab bar pinned to top with scrolled content", "Inset search, app bar, and fixed tab bar", "Default app bar and scrollable tab bar" | | | high |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Tab bar | single row; sits in the app bar block structure or directly above its content | high |
| Tab (touch target) | the full 48dp or 72dp cell; the "Tab touch target animation" illustrates the ink reaction on touch | high |
| Label text | all caps, centered, wraps to at most two lines then truncates | high |
| Icon | 24 x 24dp, centered; above the text in the icon-plus-text variant | high |
| Indicator | 2dp line under the active tab, "#fff or accent color"; "The text color is the same as the tab indicator."; "The icon color is the same as the tab indicator." | high |
| Content area | swipeable region whose swipes change tabs | high |
| More dropdown / pagination arrows (desktop) | overflow affordances, named only | high (named) |

## 4. Metrics and keylines

### Fixed tabs

| Metric | Value | Confidence |
|---|---|---|
| Height, text only | 48dp | high |
| Height, icons and text | 72dp | high |
| Height, icons only | 48dp | high |
| Width minimum (inclusive of padding) | 160dp for larger views, 72dp for smaller views | high |
| Width maximum (inclusive of padding) | 264dp | high |
| Width calculation | view width divided by the number of tabs, or the width of the largest tab | high |
| 2015 fixed width | "1/3 of screen" (three-tab assumption) | high (2015 only) |
| Padding, text | 12dp left and right of text | high |
| Padding, bottom (text) | 20dp from bottom for a single line, 12dp for two lines | high |
| Icon size | 24 x 24dp | high |
| Padding, icon and text variant | 10dp between icon and text; 16dp under text | high |
| Padding, icon-only variant | 12dp under icon | high |
| Content alignment | text and icon centered horizontally and vertically in the tab | high |
| Indicator height | 2dp | high |
| Full-width vs centered threshold | margin between tab edge and view edge of 16dp or less: use full-width | high |

### Scrollable tabs

| Metric | Value | Confidence |
|---|---|---|
| Height | 48dp | high |
| Width minimum | 160dp larger views, 72dp smaller views | high |
| Width maximum | the smaller of 264dp and (view size minus 56dp) | high |
| Padding | 12dp left and right of text; 20dp (one line) / 12dp (two lines) from bottom | high |
| 2015 width formula | "12dp + word length + 12dp" | high (2015 only) |
| Leading offset | "The left-most tab content aligns with the keyline" (16dp screen-edge keyline on mobile; 72dp content keyline when aligned with the app bar title). The brief's "56dp offset" is not in the spec text; 56dp appears only in the max-width formula (view minus 56dp). | high (keyline rule), offset value not found |
| Indicator | 2dp | high |

### Desktop

| Metric | Value | Confidence |
|---|---|---|
| Height | 48dp | high |
| Width min / max | 160dp / 72dp; smaller of 264dp and view minus 56dp | high |
| Text | 13sp Roboto Medium, all caps, wraps across a maximum of two lines | high |
| Padding | 24dp left and right of text; 20dp / 12dp from bottom | high |
| First tab text left padding | 80dp (matches the tablet / desktop content keyline of 80dp) | high |
| 2015 tablet text | 14sp tablet, 13sp desktop | high (2015 only) |
| 2015 desktop width formula | "24dp + word length + 24dp" | high (2015 only) |

### Text

| Element | Type style | Value | Confidence |
|---|---|---|---|
| Label, mobile and tablet | Button (Medium 14sp, all caps) | "14sp Roboto Medium", "All caps", "Horizontally and vertically centered" | high |
| Label, wrapped | 12sp Medium (no scale name; Caption size at Medium weight) | "12sp when wrapped across a maximum of two lines" | high |
| Label, desktop | 13sp Medium (Body 2 desktop size at Button weight) | "13sp Roboto Medium" | high |

### "Larger views" and "smaller views"

The tabs page does not define the terms. Responsive UI lists breakpoints at 480, 600, 840, 960, 1280, 1440, 1600dp, and the handset / tablet split sits at 600dp ("Layouts under 600dp wide may fill the screen with a single level of content hierarchy"). Reading "smaller views" as below 600dp is an interpretation; Vuetify 1.5 used exactly that (`sm-and-up` = 600px). Confidence of the mapping: moderate.

### Touch target

48 x 48dp minimum with 8dp between targets (Metrics page). A 48dp tab satisfies it by height; a 72dp minimum width satisfies it by width. Confidence: high.

## 5. Color

| Part | On a colored (primary 500) bar | On a light surface | On a dark surface | Confidence |
|---|---|---|---|---|
| Active label and icon | "#fff or accent color" | accent color (the spec's second option); white is not an option on a light surface | white | high (colored bar); interpretation (surfaces) |
| Inactive ("Unfocused tab color") | "#fff 70%" | not found; the Color page's secondary-text rule (54% black) or 70% of the active color are the candidate readings | 70% white (Color page secondary text on dark) | high (colored bar); not found (light surface) |
| Disabled (2015) | "#fff 60%" | not found | not found | high (2015 only) |
| Indicator | "#fff or accent color"; same color as the active text / icon | accent | white or accent | high |
| Bar background | the app bar surface: primary color; light theme app bar Grey 100 `#F5F5F5`; dark theme Grey 900 `#212121` | | | high (from toolbars.md sources) |
| Active-color link | "The text color is the same as the tab indicator." "The icon color is the same as the tab indicator." | | | high |
| 2015 wording | "Active text color: #fff or secondary color" | | | high (2015) |

## 6. Elevation

| State | Value | Confidence |
|---|---|---|
| Tab bar | no elevation of its own; it is a block of the app bar (4dp) or sits on the content sheet (0dp). Scrolling techniques: "The tab bar stays anchored at the top, while the toolbar scrolls off" keeps the app bar's step. | high (rule), no dp value stated for a standalone tab bar |
| Pressed / focused | no elevation change (tabs are printed on the surface; the reaction is ink) | high (interpretation of the touch target animation) |

## 7. Motion

| Transition | Spec text | Duration / easing | Confidence |
|---|---|---|---|
| Touch target reaction | "Tab touch target animation" (animation only): an ink ripple fills the tab cell from the touch point | not found; ripple timing is not on this page | high (pattern), not found (timing) |
| Indicator movement | implied by "Highlight the tab corresponding to the visible content"; the indicator slides to the newly selected tab | not found; global standard curve `cubic-bezier(0.4, 0.0, 0.2, 1)`, 300ms mobile, 150ms to 200ms desktop | not found (tab-specific) |
| Content swipe | content area follows the finger; release settles on the neighboring tab | not found | high (behavior), not found (timing) |
| Scrollable bar scroll | "To scroll the tabs without navigating, swipe the tabs left or right." | not found | high |
| Tab bar in scrolling app bar | anchored, or scrolls off and "returns on reverse-scroll" | scroll-linked | high |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Active (selected) | label and icon at 100% (white or accent); 2dp indicator beneath | high |
| Inactive ("unfocused") | 70% white on a colored bar | high |
| Pressed | ink ripple over the tab cell (touch target animation) | high (pattern) |
| Hover | not found on the tabs page. Reference overlays from the Buttons page: flat pressed 40% `#999999` (light) / 25% `#CCCCCC` (dark); focus 12%; hover: not found | not found |
| Focus (keyboard) | not found | not found |
| Disabled | 2015: "#fff 60%"; 2016 and 2018: not found | high (2015), not found (current) |
| Overflow (desktop) | More dropdown or pagination arrows | high (named) |

## 9. Behavior

| Rule | Spec text | Confidence |
|---|---|---|
| Navigation between fixed tabs | "touch the tab or swipe the content area left or right" | high |
| Navigation between scrollable tabs | "touch the tab or swipe the content area left or right. To scroll the tabs without navigating, swipe the tabs left or right." | high |
| Label overflow | wrap to a second line, then truncate; never shrink single-line labels; 12sp when wrapped | high |
| Count | 2 to 6 (2015); current pages: fixed tabs "limited number", scrollable "many or a variable number" | high (2015) / high |
| Nesting | forbidden | high |
| Adjacency | tabs stay adjacent to their content | high |
| Scroll (in app bar) | tab bar anchored while toolbar scrolls off; or whole app bar anchored; or both scroll off, tab bar returns on reverse scroll, toolbar on complete reverse scroll | high |
| Overlapping flexible space | "In this interaction, the app bar cannot include tabs." | high |
| Two-level navigation | "Products with two levels of navigation may pair a left navigation drawer with tabs." Three levels (desktop only): nested navigation drawer plus tabs. | high |
| Alignment | fixed: full-width on small views, centered on large; scrollable: leading tab on the keyline; desktop: centered or left keyline | high |

## 10. Web notes

- Maps 1:1: 48dp / 72dp heights, 72dp / 160dp / 264dp widths, 12dp / 24dp text padding, 20dp / 12dp bottom padding, 14sp / 13sp / 12sp Medium all-caps labels, 2dp indicator, 70% inactive opacity on colored bars, 24dp icons, 80dp desktop leading keyline.
- Needs interpretation: "larger / smaller views" (600dp is the defensible cut, moderate); inactive color on light surfaces (not found: declare the Quantum value in `SPEC.md`, either 54% black secondary text or the accent at 70%); hover and keyboard-focus rendering (not found: reuse the Buttons page overlays, 12% focus, and record the hover value as a Quantum decision); indicator slide timing (not found: global standard curve).
- Swipe between tabs is a touch gesture; on the web it needs pointer tracking on the content panel and must not be wired to a panel that itself scrolls horizontally (the spec's own prohibition).
- Scrollable tabs on desktop need the "More" dropdown or pagination arrows the spec names without metrics; pick one and record it.
- Text wrapping to two lines at 12sp changes the bottom padding (20dp to 12dp); the implementation needs a line-count-aware layout or a fixed two-line box.
- WAI-ARIA pattern: **Tabs** (`role="tablist"`, `role="tab"` with `aria-selected`, `role="tabpanel"` with `aria-labelledby`; roving tabindex with arrow keys; automatic vs manual activation is the implementer's choice, the spec is silent). v0 `Tabs.Root` owns this.
- The all-caps rule is a CSS `text-transform`, keep the source text in sentence case for screen readers.

## Vuetify 1.5 cross-check

Files: `_tabs.styl`, `_variables.styl` (`$tab-text-transform`, `$primary-transition`), `_theme.styl` (`tabs.active`, `buttons.disabled`), `VTabs.js`, `mixins/tabs-props.js`, `mixins/tabs-computed.js`, `VTab.js`.

| Property | Spec | Vuetify 1.5 | Match |
|---|---|---|---|
| Height, text | 48dp | `.v-tabs__container height: 48px` | yes |
| Height, icons and text | 72dp | `--icons-and-text height: 72px` | yes |
| Height, icons only | 48dp | 48px (no separate class) | yes |
| Min width, fixed | 72dp small / 160dp large | `--fixed-tabs, --icons-and-text .v-tabs__div min-width: 72px`; `sm-and-up` (600px): 160px | yes |
| Min width, scrollable | 72dp / 160dp | no min-width on non-fixed tabs (`flex: 0 1 auto`) | no |
| Max width | 264dp (and view minus 56dp for scrollable) | `.v-tabs__div max-width: 264px`; `--grow` removes it; no "view minus 56dp" rule | partial |
| Fixed width calculation | view width / count, or widest label | `--fixed-tabs` on `xs-only`: `flex: 1 0 auto` (equal share); `--grow`: `flex: 1 0 auto` at all sizes | yes (small views) |
| Side padding | 12dp mobile, 24dp desktop | `.v-tabs__item padding: 6px 12px` at all sizes | mobile yes, desktop no |
| Bottom padding | 20dp one line, 12dp two lines | vertical centering with 6px padding; no line-count rule | no |
| Icon and text gap | 10dp | `--icons-and-text .v-icon margin-bottom: 6px`, `flex-direction: column-reverse` | no (6 vs 10) |
| Text | 14sp Medium all caps; 13sp desktop; 12sp wrapped | `.v-tabs__div font-size: 14px; font-weight: 500; text-transform: uppercase`; no 13px desktop, no 12px wrapped | mobile yes, desktop and wrapped no |
| Text wrapping | wrap to two lines then truncate | `.v-tabs__item white-space: normal` (wraps without a line cap) | partial |
| Inactive color | 70% white (colored bar) | `.v-tabs__item:not(--active) opacity: .7` | yes (as opacity, theme-independent) |
| Active color | #fff or accent | `.v-tabs__div color: $material.tabs.active` = 87% black (light) / white (dark); `color` prop overrides | partial (light-surface default is Vuetify's own) |
| Disabled | 60% white (2015) | `--disabled color: $material.buttons.disabled` = 26% black (light) / 30% white (dark); `pointer-events: none` | no |
| Indicator | 2dp, #fff or accent | `.v-tabs__slider height: 2px`, `sliderColor` prop (default accent) | yes |
| Indicator motion | not found | `.v-tabs__slider-wrapper transition: $primary-transition` = `.3s cubic-bezier(.25,.8,.50,1)` | n/a |
| Bar scroll | swipe the tabs | `transition: transform 0.6s cubic-bezier(0.86, 0, 0.07, 1)`; touch handlers in `tabs-touch.js` | yes (values are Vuetify's) |
| Overflow affordance | More dropdown or pagination (desktop) | prev / next arrow icons (`.v-tabs__icon` 32px wide, 4px inset; `--show-arrows` margins 40px) shown when overflowing and above `mobileBreakPoint: 1264` or `showArrows` | pagination yes, More dropdown no |
| Leading keyline | scrollable: content on the keyline; desktop first tab text at 80dp | `--align-with-title padding-left: 56px`; with arrows the wrapper gets `margin-left: 40px` and the container padding drops to 16px (24px at `xs-only`), so the keyline stays at 56px (64px at `xs-only`); no 80px | partial |
| Centered | centered on large views | `--centered` margins auto | yes |
| Right-aligned | not found | `--right` | n/a |
| Bar background | app bar surface | `v-tabs__bar background-color: $material.cards` (white / `#424242`) | no (Vuetify defaults to the card surface, not the app bar) |
| Ripple | touch target animation | `VTab ripple` default true | yes |
| Tab count limit | 2 to 6 (2015) | none | n/a |
