# Search (pattern)

Pattern page `patterns/search.html`. Ruling (see `rulings.md`): **expandable search** is a mode of `QuToolbar`; **persistent search** is the `QuSearchBar` component (SPEC.md ruling; SPEC.md open question 5), composed on `QuTextField solo` (the inset box), `QuList` suggestions and `QuButton icon` for mic, clear and up arrow. The spec page is behavior only. It contains zero numeric metrics, so every number below is derived from a named sibling page or from Vuetify 1.5 and is tagged accordingly.

## Sources

| Source | Location | Read |
|---|---|---|
| MD1 spec, Search | `https://web.archive.org/web/20210805023955/https://material.io/archive/guidelines/patterns/search.html` (requested the 2018-12-25 00:22:55 snapshot; the archive served its 2021-08-05 02:39:55 capture of the same static archive page) | yes, full text |
| MD1 spec, Scrolling techniques (app bar block heights) | `https://web.archive.org/web/20181225002145/https://material.io/archive/guidelines/patterns/scrolling-techniques.html` | yes, full text |
| MD1 spec, Navigation drawer (list keylines reused by suggestion rows) | `https://web.archive.org/web/20181225002300/https://material.io/archive/guidelines/patterns/navigation-drawer.html` | yes, full text |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_toolbar.styl`, `src/stylus/settings/_theme.styl`, `src/stylus/settings/_variables.styl`, `src/components/VToolbar/VToolbar.ts` | yes |

Confidence legend: `high` = read on the spec page named; `moderate` = Vuetify 1.5 source only; `low` = memory.

## 1. Purpose and usage

| Rule | Text (spec) | Confidence |
|---|---|---|
| Purpose | Search allows users to locate app content quickly. When an app supports large amounts of information, users should be able to quickly locate content by searching. | high |
| Basic search | Opening a search text field; entering and submitting a query; displaying a set of search results. | high |
| Enhancements | Voice search; historical search suggestions based on recent user queries, before a query is completed; auto-completed search suggestions matching actual results in your application data. | high |
| Use persistent search | When search is the primary focus of your app. | high |
| Use expandable search | When search is not the primary focus of your app. | high |

## 2. Types and variants

| Type | Entry point | Surface | Suggestions | Results | Confidence |
|---|---|---|---|---|---|
| Persistent search | Search text field presented inside an inset search box, ready to receive focus | Inset box (card-like; results are "formatted as cards to match the inset appearance of the search box") | Field expands when focused to show historical suggestions; shift to auto-completion as the user types | Cards; search box stays visible but unfocused | high |
| Expandable search | Magnifying glass icon in the toolbar instead of a text box | Toolbar transforms: other content cleared, search text field displayed | Shown beneath the toolbar; shift to auto-completion as the user types | Cards in the main body of the page beneath the toolbar; search toolbar stays visible but unfocused | high |

Search options the page names (apply to both types): voice search, search suggestions, autocompletion. All three are optional ("If voice search is supported, the microphone icon also appears"). Confidence high.

## 3. Anatomy

| Part | Persistent | Expandable | Confidence |
|---|---|---|---|
| Search icon (magnifying glass) | not named on the page for the persistent box | Toolbar action that opens search | high |
| Up arrow | Releases focus from search, dismissing suggestions and the on-screen keyboard | Closes search and restores the original presentation of the toolbar | high |
| Search text field | Inside the inset box; ready to receive focus | Replaces toolbar content; automatically receives focus | high |
| Microphone icon | Initiates a voice search | Appears if voice search is supported | high |
| X action (clear) | Clears the query | Clears the query | high |
| Suggestions list | Historical suggestions, then auto-completion, filtered and sorted while typing | Same, positioned beneath the toolbar | high |
| Results | Cards | Cards beneath the toolbar | high |
| On-screen keyboard | Appears when the field is focused "if needed"; dismissed when results are shown | Same | high (OS artifact; no web equivalent to control) |

## 4. Metrics and keylines

The search page states no dimension. Values below come from sibling pages or Vuetify 1.5.

| Metric | Value | Source | Confidence |
|---|---|---|---|
| Expandable search container height (toolbar) | 56 dp mobile, 64 dp larger screens | scrolling-techniques page | high |
| Status bar above the toolbar | 24 dp | scrolling-techniques page | high (no web equivalent; 0 dp on web) |
| Persistent search box height | not found | spec | n/a |
| Persistent search box inset margins | not found | spec | n/a |
| Suggestion row height | 48 dp (single-line list row, the drawer page's "Subtitles and list items: 48dp" value; the lists page is the owner) | navigation-drawer page | high for the row value, moderate that suggestions use it |
| Suggestion text keyline with leading icon | 72 dp | navigation-drawer page | high for the keyline, moderate that suggestions use it |
| Icon keyline | 16 dp from the left and right edges | navigation-drawer page | high |
| Toolbar content side padding | 24 px (`$grid-gutters.xl`), 16 px at `sm-and-down` (< 960 px) | Vuetify 1.5 `_toolbar.styl` | moderate |
| Icon button margin inside toolbar | 6 px; first and last icon buttons pull in by -6 px | Vuetify 1.5 `_toolbar.styl` | moderate |
| Text field inside toolbar | margin 0; helper/error details hidden (`.v-text-field__details { display: none }`) | Vuetify 1.5 `_toolbar.styl` | moderate |
| Type style of the query text | not found on page; Vuetify 1.5 inputs use 16 px (`$list-tile-font-size` = subheading 16 px / 400 for list rows; text field size lives in `_text-fields.styl`, not read) | Vuetify 1.5 `_variables.styl` | moderate |
| Type style of suggestions | not found on page; drawer list item is Roboto Medium 14 sp, Body 2 | navigation-drawer page | moderate (transfer) |
| Touch target | not found on page | spec | n/a |
| Corner radius of the inset box | not found on page; Vuetify 1.5 card/sheet radius 2 px | Vuetify 1.5 `_variables.styl` | moderate |

Type style mapping used in this note: Roboto Medium 14 sp = Body 2, Roboto Regular 14 sp = Body 1, Roboto Regular 16 sp = Subheading, Roboto Medium 20 sp = Title (mirrors Vuetify 1.5 `$headings`; the `style/typography` note is the owner). Confidence moderate.

## 5. Color

| Part | Light theme | Dark theme | Source | Confidence |
|---|---|---|---|---|
| Any color on the search page | not found | not found | spec | n/a |
| Toolbar background (expandable host) | grey lighten-4 `#F5F5F5` (`$material-light.app-bar`); text `rgba(0,0,0,.87)` | grey darken-4 `#212121`; text `#FFFFFF` | Vuetify 1.5 `_theme.styl` | moderate |
| Inverted search field inside a colored toolbar (Vuetify "solo-inverted") | field `rgba(0,0,0,.16)`; focused `grey darken-3 #424242` with `#FFFFFF` text | field `rgba(255,255,255,.16)`; focused `#FFFFFF` with `rgba(0,0,0,.87)` text | Vuetify 1.5 `_theme.styl` `inputs.solo-inverted*` | moderate |
| Icons (search, mic, clear, up) | 54% black active, 38% inactive | 100% white active, 50% inactive | help-feedback page icon table (generic MD1 icon opacities) | high for the table, moderate for applying it here |
| Suggestion text | 87% black (list item value) | 100% white (Vuetify 1.5 `text.primary`) | navigation-drawer page / Vuetify 1.5 | high / moderate |

## 6. Elevation

| Surface | Value | Source | Confidence |
|---|---|---|---|
| Toolbar (expandable host) | not on page; Vuetify 1.5 `elevation(4)` (4 dp) | Vuetify 1.5 `_toolbar.styl` | moderate |
| Persistent search box | not found on page. The page says results "are formatted as cards to match the inset appearance of the search box", so the box is card-like; card resting elevation belongs to the cards note | spec | n/a |
| Suggestions panel | not found | spec | n/a |

## 7. Motion

| Transition | Spec text | Duration / easing | Confidence |
|---|---|---|---|
| Expandable: open | "Touching the search icon causes the toolbar to transform, clearing other content and displaying a search text field." | not found | high (behavior), n/a (timing) |
| Expandable: close | "Touching the up arrow closes search and restores the original presentation of the toolbar." | not found | high / n/a |
| Persistent: focus | "When in focus, the search field expands to show historical search suggestions." | not found | high / n/a |
| Persistent: release | "Touching the up arrow releases the focus from search, dismissing suggestions and the on-screen keyboard." | not found | high / n/a |

Durations and curves are owned by the `motion/duration-easing` note. Vuetify 1.5 uses `$primary-transition` = 0.3 s `cubic-bezier(.25,.8,.5,1)` for toolbar padding changes (moderate), not for a search transform (it ships none).

## 8. States

| State | Persistent | Expandable | Confidence |
|---|---|---|---|
| Resting | Box visible, field unfocused, ready to receive focus | Magnifying glass icon in the toolbar; no field | high |
| Focused, empty | Field expands to show historical suggestions; keyboard appears if needed | Toolbar transformed; field auto-focused; historical suggestions beneath the toolbar | high |
| Typing | Suggestions shift to auto-completion, filtered and sorted as the user types | Same | high |
| Submitted / results | Box remains visible, not focused by default; keyboard dismissed so more results show; results as cards | Search toolbar remains visible, not focused by default; results as cards beneath the toolbar | high |
| Cleared | X clears the query (focus state unchanged by the text) | Same | high |
| Closed | not applicable (persistent) | Up arrow restores the original toolbar | high |
| Hover / pressed / disabled overlays | not found on page | not found | n/a |

## 9. Behavior

| Rule | Text (spec) | Confidence |
|---|---|---|
| Submit | Choosing any suggestion submits the search. Pressing the return key submits the search. | high |
| Clear | The X action in the search box / field clears the query. | high |
| Dismiss focus (persistent) | Up arrow releases focus, dismisses suggestions and the keyboard. | high |
| Close (expandable) | Up arrow closes search and restores the toolbar. | high |
| Voice | Touching the microphone icon initiates a voice search. | high |
| Suggestion order | Historical suggestions before a query is completed; auto-completion matching app data as the user types; filtered and sorted while typing. | high |
| Results | Formatted as cards; search box or search toolbar remains visible but unfocused; keyboard dismissed. | high |
| Limits (number of suggestions, query length) | not found | n/a |
| Empty results | Owned by the empty-states page: show an image plus tagline, or "best match" results under a clear heading. | high (empty-states page) |

## 10. Web notes

| Topic | Note |
|---|---|
| Maps 1:1 | Two modes, up arrow, clear X, suggestion list, submit on Enter or on suggestion choice, results outside the component. |
| Needs interpretation | The on-screen keyboard and the status bar are OS artifacts: no API, nothing to render. Voice search on the web is the Web Speech API; render the mic only when the consumer wires a handler. "Historical" suggestions are consumer data; the component only renders the list. Metrics are absent, so the implementer takes toolbar height (56/64 dp) for the expandable mode and list row metrics (48 dp rows, 72 dp text keyline) for suggestions. |
| Expandable search in `QuToolbar` | A `search` mode (prop or part) that swaps the nav icon for the up arrow, replaces title and actions with a borderless text field, and appends clear and optional mic actions. Open and close are consumer-controlled (`v-model`), matching "touching the search icon" and "touching the up arrow". |
| Persistent search composition | `QuSearchBar` (the inset surface, composing `QuTextField solo`: no helper text, no floating label) with leading up-arrow/search icon and trailing clear and mic as `QuButton icon`; `QuList` for suggestions in an expanding region below the field; results are the consumer's `QuCard` grid. |
| WAI-ARIA pattern | Combobox (editable, with listbox popup) for the field plus suggestion list; the enclosing form takes `role="search"`. The expandable toolbar mode is the same Combobox inside the `<header>` landmark. |
| v0 primitives | `Combobox` component / `createCombobox` for the field and suggestions; `useTypeahead` for filtering; `Overflow` is not needed. |

## Vuetify 1.5 cross-check

Vuetify 1.5 ships no search component. The toolbar and theme files are the only overlap.

| Item | Spec | Vuetify 1.5 | Verdict |
|---|---|---|---|
| Expandable search host height | 56 dp mobile / 64 dp larger screens (scrolling-techniques page) | `VToolbar.ts` heights: mobile 56 px, desktop 64 px, mobileLandscape 48 px, dense 48 px | match; Vuetify adds landscape and dense values the search page does not mention |
| Field inside a toolbar | no metric | `_toolbar.styl`: `.v-text-field--enclosed, .v-text-field--box { margin: 0 }` and details hidden | spec silent; Vuetify's choice is consistent with a search field that never shows helper text |
| Toolbar side padding | not on page | 24 px, 16 px below 960 px | spec silent |
| Inverted field colors | not on page | `inputs.solo-inverted` 16% black / 16% white; focused grey darken-3 / white | spec silent |
| Search transform animation | "toolbar transforms" | none shipped | spec behavior missing in Vuetify 1.5 |
| Results as cards | required | not a toolbar concern | n/a |
| Suggestion rows | 48 dp rows (lists) | `$list-item-single-height` 48 px | match |
