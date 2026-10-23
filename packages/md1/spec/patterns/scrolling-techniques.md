# Scrolling techniques (pattern)

Pattern page `patterns/scrolling-techniques.html`. Ruling (see `rulings.md`): **variants and props of `Md1Toolbar`** (the app bar): a scroll behavior per block (toolbar, tab bar, flexible space), a flexible-space extension part with an optional image, and the "lifts when anchored" elevation change. No new component.

## Sources

| Source | Location | Read |
|---|---|---|
| MD1 spec, Scrolling techniques | `https://web.archive.org/web/20181225002145/https://material.io/archive/guidelines/patterns/scrolling-techniques.html` (2018-12-25 00:21:45 capture) | yes, full text; a raw sweep of the HTML for every `dp` and `sp` token found nothing beyond the text below |
| MD1 spec, Gestures (reveal upon scroll) | `https://web.archive.org/web/20181225002235/https://material.io/archive/guidelines/patterns/gestures.html` | yes, full text |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_toolbar.styl`, `_system-bars.styl`, `_tabs.styl` (heights only), `src/stylus/settings/_variables.styl`, `_theme.styl`, `src/components/VToolbar/VToolbar.ts`, `src/components/VSystemBar/VSystemBar.ts` | yes |

Confidence legend: `high` = read on the spec page named; `moderate` = Vuetify 1.5 source only; `low` = memory.

## 1. Purpose and usage

| Rule | Text (spec) | Confidence |
|---|---|---|
| Purpose | Scrolling techniques affect how content scrolls in relation to the app bar. These patterns describe the elevations at which content should scroll, how to size flexible space, and when to anchor specific elements. | high |
| Blocks | App bars contain four main regions (blocks) that comprise the scrolling structure: status bar, toolbar, tab bar or search bar, flexible space (space to accommodate a desired aspect ratio for images or extended app bars). | high |
| Flexible space purpose | Because the app bar is flexible, it can be extended to accommodate larger typography or images. | high |
| Related gesture | Reveal upon scroll: reversing the scroll direction in a content area reveals hidden in-app elements; resuming the original scroll direction dismisses them (gestures page). | high |

## 2. Types and variants

Each row is one behavior the page names. "Reverse scroll" is a scroll toward the top; "complete reverse scroll" is reaching the top of the page.

| Variant | Behavior options (spec) | Blocks involved | Confidence |
|---|---|---|---|
| Standard app bar | (a) The app bar scrolls off-screen with the content and returns when the user reverse scrolls. (b) The app bar stays fixed at the top with content scrolling under it. | status bar, toolbar | high |
| App bar with tabs | (a) The tab bar stays anchored at the top while the toolbar scrolls off. (b) The app bar stays anchored at the top with the content scrolling underneath. (c) Both the toolbar and tab bar scroll off with content; the tab bar returns on reverse scroll, the toolbar returns on complete reverse scroll. | status bar, toolbar, tab bar | high |
| Flexible space | (a) The flexible space shrinks until only the toolbar remains; the title shrinks to 20 sp in the navigation bar; when scrolling to the top of the page, the flexible space and the title grow into place again. (b) The whole app bar scrolls off; on reverse scroll the toolbar returns anchored to the top; when scrolling all the way back, the flexible space and the title grow into place again. | status bar, toolbar, flexible space | high |
| Flexible space with image | Use flexible space to accommodate images with the desired aspect ratio (example 4:3). When scrolling, the content pushes up the image, which shrinks the flexible space. At the end of the transformation the image gets tinted with the primary color, independent of scrolling. | status bar, toolbar, flexible space (image) | high |
| Flexible space with overlapping content | (a) The app bar is initially positioned behind the content. Upon upward scroll the app bar scrolls faster than the content until the content no longer overlaps it. Once anchored in place, the app bar lifts up for content to scroll underneath. (b) The app bar scrolls off-screen with the content and returns when the user reverse scrolls. In this interaction the app bar cannot include tabs. | status bar, toolbar, flexible space | high |

## 3. Anatomy

| Part (block) | Description | Confidence |
|---|---|---|
| Status bar | 24 dp strip above the toolbar (OS; absent on the web) | high |
| Toolbar (navigation bar) | 56 dp mobile / 64 dp larger screens; holds the title that shrinks to 20 sp when a flexible space collapses | high |
| Tab bar or search bar | 48 dp (tab bar); search bar height not on this page | high (tab bar) |
| Flexible space | Variable-height block sized to an aspect ratio or to extended typography; may hold an image | high |
| Title | Grows into place in the flexible space; shrinks to 20 sp in the toolbar | high |
| Image | Pushed up and shrunk by content; tinted with the primary color at the end of the transformation | high |

## 4. Metrics and keylines

| Metric | Mobile | Larger screens | Type style | Source | Confidence |
|---|---|---|---|---|---|
| Standard app bar (toolbar) height | 56 dp | 64 dp | | scrolling-techniques | high |
| Status bar height | 24 dp | 24 dp | | scrolling-techniques | high |
| Tab bar height | 48 dp | 48 dp | | scrolling-techniques | high |
| Collapsed title size | 20 sp | 20 sp | Title (Roboto Medium 20 sp) | scrolling-techniques | high (value), moderate (style name) |
| Expanded title size | not found | not found | | spec | n/a |
| Flexible space height | not found as a number; sized by the desired aspect ratio (4:3 in the example) or by the larger typography | | | scrolling-techniques | high (rule), n/a (value) |
| Search bar height | not found on this page | | | spec | n/a |
| Scroll threshold before the bar hides or returns | not found | | | spec | n/a; Vuetify 1.5 300 px (moderate) |
| Parallax ratio ("scroll faster than the content") | not found | | | spec | n/a |
| Vuetify 1.5 toolbar heights | mobile 56 px, mobile landscape 48 px, dense 48 px | desktop 64 px (also `prominent`) | | `VToolbar.ts` | moderate |
| Vuetify 1.5 extension height | defaults to the content height (56 / 64 px); `extensionHeight` prop | | | `VToolbar.ts` | moderate |
| Vuetify 1.5 tab bar | 48 px; 72 px with icons and text; tab min-width 72 px, max-width 264 px; slider 2 px | | | `_tabs.styl` | moderate |
| Vuetify 1.5 toolbar side padding | 24 px; 16 px below 960 px | | | `_toolbar.styl` | moderate |
| Vuetify 1.5 extension title keyline | `margin-left: 72px` for a title inside the extension | | | `_toolbar.styl` | moderate |

Type style mapping used in this note: Roboto Medium 20 sp = Title (mirrors Vuetify 1.5 `$headings.h6` 20 px / 500 / 0.02 em). Confidence moderate.

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Image at the end of the collapse | Tinted with the primary color | same | scrolling-techniques | high (role), n/a (tint opacity: not found) |
| App bar background | not on this page (toolbars note); Vuetify 1.5 `app-bar` grey lighten-4 `#F5F5F5`, text `rgba(0,0,0,.87)` | grey darken-4 `#212121`, text `#FFFFFF` | Vuetify 1.5 `_theme.styl` | moderate |
| Status bar | not on this page; Vuetify 1.5 `status-bar.regular` grey lighten-2 `#E0E0E0`, lights-out `rgba(255,255,255,.7)` | `#000000`, lights-out `rgba(0,0,0,.2)` | Vuetify 1.5 `_theme.styl` | moderate |
| Tab bar | not on this page; Vuetify 1.5 tabs bar `$material.cards`, active tab `rgba(0,0,0,.87)` light / `#FFFFFF` dark | | Vuetify 1.5 `_tabs.styl`, `_theme.styl` | moderate |

## 6. Elevation

| State | Value | Source | Confidence |
|---|---|---|---|
| App bar resting | not on this page (toolbars note); Vuetify 1.5 `elevation(4)` | Vuetify 1.5 `_toolbar.styl` | moderate |
| App bar behind overlapping content | Lower than the content ("initially positioned behind the content"); value not found | scrolling-techniques | high (relation), n/a (value) |
| App bar once anchored | "the app bar lifts up for content to scroll underneath"; value not found | scrolling-techniques | high / n/a |
| App bar scrolled off | not found | spec | n/a; Vuetify 1.5 removes the shadow (`elevation-0`) when `flat` or when scrolled off with `scrollOffScreen` (moderate) |
| Z-space diagram | The page shows a side-view z-space diagram for the overlapping case; no numbers in the text | scrolling-techniques | high |

## 7. Motion

| Transition | Spec text | Duration / easing | Confidence |
|---|---|---|---|
| Scroll-off and return | "scroll off-screen with the content and return when the user reverse scrolls" | tied to scroll position; no duration | high |
| Tab bar return | "returns on reverse-scroll" while the toolbar "returns on complete reverse scroll" | tied to scroll position | high |
| Flexible space collapse | "shrinks until only the toolbar remains"; title shrinks to 20 sp; both grow back at the top | tied to scroll position | high |
| Image tint | "At the end of the transformation, the image gets tinted with the primary color, independent of scrolling" | not found (a timed transition, not scroll-linked) | high / n/a |
| Overlap catch-up | "the app bar should scroll faster than the content, until the content no longer overlaps it" | ratio not found | high / n/a |
| Lift when anchored | elevation change on anchoring | not found | high / n/a |

## 8. States

| State | Description | Confidence |
|---|---|---|
| Expanded | Flexible space at full height; title large; image unshaded | high |
| Collapsing | Flexible space shrinking with scroll; image pushed up | high |
| Collapsed / anchored | Only the toolbar (plus anchored tab bar) remains; title 20 sp; image tinted primary; bar lifted for content to pass under | high |
| Scrolled off | Toolbar (and optionally tab bar) off-screen | high |
| Returning | Bar re-enters on reverse scroll; tab bar first, toolbar at the top (option c) | high |
| Hover / focus / pressed / disabled | not applicable to this page | n/a |

## 9. Behavior

| Rule | Text (spec) | Confidence |
|---|---|---|
| Fixed | Content scrolls under a fixed app bar | high |
| Hide on scroll | The bar scrolls off with content and returns on reverse scroll | high |
| Tabs anchored | Tab bar stays at the top while the toolbar scrolls off | high |
| Staggered return | Tab bar returns on reverse scroll; toolbar returns only on complete reverse scroll | high |
| Flexible space | Shrinks to the toolbar, title to 20 sp; grows back at the top | high |
| Image | Pushed up by content; primary tint at the end of the transformation | high |
| Overlapping content | Bar scrolls faster than content until no overlap, then anchors and lifts; cannot include tabs | high |
| Limits | not found (scroll thresholds, maximum flexible height) | n/a |

## 10. Web notes

| Topic | Note |
|---|---|
| Maps 1:1 | Fixed bar; hide-on-scroll with return on reverse scroll; tabs anchored while the toolbar hides; collapsing flexible space with the 20 sp title; image tint at the end; lift when content scrolls under. |
| Needs interpretation | The status bar does not exist on the web: every height above loses the 24 dp strip. Scroll-linked collapse needs a scroll listener (`useEventListener` + `useRaf`) or `animation-timeline: scroll()` where supported; the spec gives no threshold or parallax ratio, so `SPEC.md` must record chosen values as deviations. The image tint "independent of scrolling" is a timed opacity transition on a primary-colored overlay once the collapsed state is reached. `prefers-reduced-motion` should disable the collapse animation but keep the final states. |
| `Md1Toolbar` API shape | `scrollBehavior: 'fixed' \| 'hide' \| 'collapse' \| 'elevate'` (hide = option a; collapse = flexible space shrinking; elevate = lift when anchored), `tabsBehavior: 'anchored' \| 'hide' \| 'staggered'` only when a tab bar part is present, an `extension` part for the flexible space with `image` and `aspectRatio`, and a `collapsed` state exposed for the title. The overlapping-content case rejects tabs at the API level. |
| WAI-ARIA pattern | None specific; the app bar is the `<header>` (banner) landmark and the tab bar follows the Tabs pattern. Hiding the bar must not remove focusable content from the tab order while it is off-screen without also making it reachable again on focus (reveal on focus). |
| v0 primitives | `useEventListener`, `useRaf`, `useResizeObserver`, `useIntersectionObserver` for the anchoring, `Tabs` for the tab bar, `useReducedMotion`. |

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5 | Verdict |
|---|---|---|---|
| Toolbar height | 56 dp mobile / 64 dp larger screens | 56 px mobile, 64 px desktop (`heights` in `VToolbar.ts`); 48 px mobile landscape and `dense` | match; landscape and dense come from the toolbars component page, not this one |
| Status bar | 24 dp | `VSystemBar` 24 px status, 32 px window | match |
| Tab bar | 48 dp | `.v-tabs__bar` 48 px; 72 px with icons and text | match for the text-only bar |
| Fixed bar | content scrolls under | `fixed` / `app` positioning, z-index 2 | match |
| Hide on scroll | scrolls off with content; returns on reverse scroll | `scrollOffScreen`: hides after `scrollThreshold` 300 px of downward scroll, returns on upward scroll past the threshold; `invertedScroll` shows the bar only after the threshold | discrepancy: Vuetify hides after a 300 px threshold instead of moving with the content, and the inverted mode has no spec basis |
| Tabs anchored while toolbar hides | option (a) | `computedTransform` translates by the content height only when `scrollOffScreen`, so the extension (tabs) stays anchored | match |
| Staggered return (tab bar first, toolbar at the top) | option (c) | not implemented | spec behavior missing |
| Flexible space | shrinks to the toolbar; title to 20 sp | `extended` / `extensionHeight` adds a fixed extension; no collapse, title always 20 px (`$headings.h6`) | discrepancy: no collapsing flexible space |
| Image in flexible space with primary tint | required | none | spec behavior missing |
| Overlapping content catch-up | bar scrolls faster than content, then lifts | none | spec behavior missing |
| Lift when anchored | elevation change | `elevation(4)` always, `elevation-0` only when `flat` or scrolled off | partial |
| Scroll threshold | not found | 300 px | spec silent |
| Extension title keyline | not on this page | 72 px | spec silent |
| Card toolbar | not on this page | `--card`: radius 2 px 2 px 0 0, elevation 0 | spec silent |
