# Material Design 1 icons

Role vocabulary, alias map, path data, RTL mirroring rules, licensing, and the renderer contract for the `@paper/md1` icon set. The glyphs are Google Material Icons in the 2014 "filled" style, which is the system icon set Material Design 1 specifies. Nothing here is implemented; this note pins what `Md1Icon` and `md1Icons` must contain.

Confidence legend: `high` = read from the archived MD1 spec page or fetched verbatim from the upstream repository at the pinned commit; `moderate` = from Vuetify 1.5 stylus or TypeScript only; `low` = memory.

## Sources

| # | Source | URL | Capture or revision actually served |
|---|---|---|---|
| S1 | MD1 archive, Usability / Bidirectionality | `https://m1.material.io/usability/bidirectionality.html` | capture 2018-12-25 00:22:08 UTC |
| S2 | MD1 archive, Style / Icons | `https://m1.material.io/style/icons.html` | archive copy dated 2021-03-08 14:53:02 UTC; the archive site is the frozen MD1 text |
| S3 | MD1 live guidelines, Style / Icons (cross-check of S2) | the 2018 live guidelines page `style/icons` | capture 2018-01-30 15:48:56 UTC; its text is identical to S2 from the H1 onward (diff empty), so S2 is the MD1 text despite the 2021 capture date |
| S4 | MD1 live guidelines, Bidirectionality (cross-check of S1) | the 2018 live guidelines page `usability/bidirectionality` | capture 2018-08-31 16:00:40 UTC |
| S5 | 2016 Google Design spec, Bidirectionality and Icons | the 2016 revisions of the guidelines pages `usability/bidirectionality` and `style/icons` | captures 2016-07-31 07:08:10 UTC and 2016-06-04 08:43:49 UTC; older wording, used only to record disagreements |
| S6 | MD1 archive index | `https://m1.material.io/` | capture 2018-12-25 00:21:18 UTC |
| S7 | Material Icons guide, "Icons in RTL" (linked from S1) | the December 2018 revision of the Material Icons guide, section "Icons in RTL" (not linked; the live guide has since changed) | read 2026-10-22 from a 2018-12-24 copy |
| S8 | google/material-design-icons, master | `https://raw.githubusercontent.com/google/material-design-icons/master/src/<category>/<name>/materialicons/24px.svg`, `.../android/<category>/<name>/materialicons/black/res/drawable/baseline_<name>_24.xml`, `.../LICENSE`, `.../README.md` | commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4` (2026-10-09T02:25:39Z) |
| S9 | google/material-design-icons, tag `3.0.2` (last release of the pre-2020 repository layout; the artwork of the MD1 era) | `https://raw.githubusercontent.com/google/material-design-icons/3.0.2/<category>/svg/production/ic_<name>_24px.svg` | tag commit `f40051c7a11568a0e51fc693d1b4e5e96dfe218e` (2020-07-21T16:35:00Z); tag `3.0.1` is dated 2016-09-01T23:41:43Z |
| S10 | Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/components/Vuetify/mixins/icons.ts`, `.../components/VIcon/VIcon.ts`, `.../stylus/components/_icons.styl`, `.../stylus/settings/_theme.styl`, `.../stylus/settings/_variables.styl` | local checkout |

Every page above was downloaded with `curl -sL` and reduced to text with a stdlib HTML parser. The numbers quoted below were read from that text.

## Summary

- 84 canonical glyphs, 27 aliases, 111 resolvable names. `help-outline`, `feedback`, `offline-pin` and `cloud-off` were added 2026-10-25 for the help-feedback and offline-states patterns, from the same S8 commit; the 2026-10-22 fetch counts below cover the first 80.
- 11 glyphs mirror in RTL, 2 mirror conditionally (`help`, `help-outline`), the rest never mirror.
- Every glyph is one or more `<path d>` strings on a 24 x 24 grid, filled, no strokes. This differs from Emerald, whose glyphs are stroked; the renderer contract below reflects it.
- Path data is copied from upstream master exactly. Whitespace normalization (runs of whitespace inside a `d` attribute to one space) was applied as a safeguard and altered none of the 109 files, so every string below is byte-equal to its upstream `d` attribute. Background rectangles (`fill="none"` or `M0 0h24v24H0z` variants) are dropped. Six upstream files wrap their path in `<g>` elements with no attributes (`account_circle`, `settings`, `drag_handle`, `indeterminate_check_box`, `download`, `star_half`), and `offline_pin` nests its path three `<g>` deep; the wrappers carry no transform, so the inner path is taken as is.

## License and attribution

| Fact | Value | Source | Confidence |
|---|---|---|---|
| License | Apache License, Version 2.0 (`LICENSE` at the repository root is the unmodified Apache 2.0 text; the `APPENDIX` template line reads `Copyright [yyyy] [name of copyright owner]`, no year or owner filled in) | S8 | high |
| NOTICE file | none; `https://raw.githubusercontent.com/google/material-design-icons/master/NOTICE` returns HTTP 404, so Apache 2.0 section 4(d) imposes no NOTICE text to reproduce | S8 | high |
| README wording | "We have made these icons available for you to incorporate into your products under the Apache License Version 2.0. Feel free to remix and re-share these icons and documentation in your products. We'd love attribution in your app's *about* screen, but it's not required." | S8 | high |
| 2018 guide wording | adds: "The only thing we ask is that you not re-sell the icons themselves." | S7 | high |
| License history | "3.0.0 Update, 2016 Aug 25: License change to Apache 2.0!" (the README does not name the prior license) | S8 README changelog | high |

Apache 2.0 section 4 requires a redistributor to ship a copy of the license, keep upstream copyright and attribution notices, and state prominent changes to modified files. Material Design 1 therefore ships the following in `packages/md1/README.md` (the `## Icons` section) and the same text in `packages/md1/LICENSE-ICONS` with the full Apache 2.0 text appended:

```text
Icons

The glyphs in @paper/md1 are Material Icons, Copyright Google LLC,
https://github.com/google/material-design-icons, used under the
Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0).

Path data was taken from the "materialicons" (filled) 24px SVG sources at
commit 49d4db35df873165d6bd6ba09b063c7dafbac2f4. Modifications: the 24x24 background
rectangle was removed from each file and the remaining <path d> strings were
stored as data; no glyph geometry was changed. Icons are renamed to Material Design 1
role names; the Material Icons source name of every glyph is listed in
packages/md1/spec/icons.md. Google does not endorse this package.
```

The `@paper/md1` package itself stays MIT like the rest of the monorepo; Apache 2.0 is compatible with MIT redistribution as long as the notice above and the license text ship with the package.

## System icon metrics (MD1 spec)

dp and sp are px on the web, 1:1. The values the renderer and host components must honor:

| Metric | Value | Source | Confidence |
|---|---|---|---|
| System icon size | 24 dp (24 px); product icons are 48 dp and are not part of this set | S2 "Sizing", "DP unit grid" | high |
| Dense (mouse and keyboard) icon size | 20 dp (20 px) | S2 "DP unit grid", "Dense layouts" | high |
| Live area, standard | 20 x 20 dp inside the 24 dp trim, 4 dp padding on every side | S2 "Content area" | high |
| Live area, dense | 16 x 16 dp inside the 20 dp trim, 2 dp padding on every side | S2 "Content area" | high |
| Keyline square | 18 x 18 dp | S2 "Keyline shapes" | high |
| Keyline circle | 20 dp diameter | S2 "Keyline shapes" | high |
| Keyline vertical rectangle | 20 dp high, 16 dp wide | S2 "Keyline shapes" | high |
| Keyline horizontal rectangle | 16 dp high, 20 dp wide | S2 "Keyline shapes" | high |
| Stroke width | 2 dp for every stroke; optical corrections may drop to 1.5 dp (paperclip and microphone examples) | S2 "Strokes", "Optical corrections" | high |
| Corner radius | 2 dp on the silhouette; strokes 2 dp or thinner are not rounded; interior corners are square | S2 "Corners" | high |
| Touch target, standard | 48 dp around a 24 dp icon | S2 "Clearance" | high |
| Touch target, dense | 40 dp around a 20 dp icon | S2 "Clearance" | high |
| Placement | integer x and y coordinates ("on pixel"); equal width and height, e.g. 24 x 24 | S2 "Best practices" | high |
| Light background, active and focused | 87% opacity of #000000 | S2 "Icons on light backgrounds" | high |
| Light background, active and unfocused | 54% opacity of #000000 | S2 "Icons on light backgrounds" and "Color" | high |
| Light background, inactive | 38% opacity of #000000 | S2 "Icons on light backgrounds" and "Color" | high |
| Dark background, active and focused | 100% opacity of #FFFFFF | S2 "Icons on dark backgrounds" and "Color" | high |
| Dark background, active and unfocused | 70% opacity of #FFFFFF | S2 "Icons on dark backgrounds" | high |
| Dark background, inactive | 50% opacity of #FFFFFF | S2 "Icons on dark backgrounds" and "Color" | high |

Disagreements recorded:

| Topic | S2 (authoritative) | Other source | Ruling |
|---|---|---|---|
| Icon opacity on light backgrounds | 87% focused, 54% unfocused, 38% inactive | S5 (2016): 54% active, 26% inactive | S2 wins; the 2016 page is the older text |
| Icon opacity on dark backgrounds | 100% focused, 70% unfocused, 50% inactive | S5 (2016): 100% active, 30% inactive | S2 wins |
| Icon opacity, implementation | as above | S10: `active-icon-percent` .54 light / 1 dark, `inactive-icon-percent` .38 light / .50 dark; no focused tier; `.v-icon--disabled` opacity .6 on top of the inactive color | Vuetify 1.5 implements the S2 "Color" paragraph (the unfocused light value and the focused dark value) and skips the focused light tier. Material Design 1 tokens carry all three tiers per theme: `--md1-icon-focused`, `--md1-icon-active`, `--md1-icon-inactive` |
| Icon size scale | 24 dp standard, 20 dp dense | S10 `VIcon` `SIZE_MAP`: small 16 px, default 24 px, medium 28 px, large 36 px, xLarge 40 px; `.v-icon` `font-size: 24px` | The named scale is Vuetify API, not MD1 (ruling 8). Material Design 1 exposes 24 px default and 20 px dense; host components set `--md1-icon-size` for their own slots |
| Per-component icon sizes | not stated on S2 (component pages own them) | S10 `_variables.styl`: chip icon 20 px, floating button icon 24 px (small 18 px, large 30 px), dense list icon 22 px | moderate; the component notes must confirm each against its own spec page |

## Renderer contract (`Md1Icon`)

`Md1Icon` renders one `<svg viewBox="0 0 24 24" fill="currentColor" class="md1-icon">` with one `<path :d>` per entry of the resolved glyph, in order. There are no `stroke`, `stroke-width`, or `stroke-linecap` attributes: the set is filled artwork, so color is the fill and the host sets it through `color`. The root element carries `data-size` (`m` = 24 px default, `s` = 20 px dense; both route through `--md1-icon-size` with those literal fallbacks so a host class can retune the glyph it embeds) and `data-mirror` when the resolved role is in the mirror table, which the stylesheet turns into `transform: scaleX(-1)` under `[dir="rtl"]` (the mechanism Google documents for the web, S7). Icons are decorative by default: with no `label` prop the root gets `aria-hidden="true"` and no `role`; with `label` it gets `role="img"` and `aria-label` with that text and drops `aria-hidden`. Opacity tiers are not baked into the SVG: the renderer draws at full `currentColor` and the host applies `--md1-icon-active`, `--md1-icon-inactive`, or `--md1-icon-focused` by state, so one glyph serves every tier. The glyph map is registered through v0 `createTokens` behind an icons plugin built with `createPluginContext` and a lazy fallback, exactly as Emerald does (`packages/emerald/src/icons/index.ts`); `$value` holds the path array and aliases are `{role}` brace references. A role that resolves to nothing renders nothing and warns in dev. Material Design 1 components never inline SVG; every mark they draw goes through a role in this note (DESIGN_SYSTEMS.md ruling 6).

| Attribute | Decorative (default) | Labelled (`label` set) | Confidence |
|---|---|---|---|
| `viewBox` | `0 0 24 24` | `0 0 24 24` | high (S8 files are all `viewBox="0 0 24 24"`) |
| `fill` | `currentColor` | `currentColor` | high (upstream files set no fill on the glyph path; the SVG default is black) |
| `aria-hidden` | `true` | absent | low (WAI-ARIA practice, not an MD1 rule) |
| `role` | absent | `img` | low (WAI-ARIA practice, not an MD1 rule) |
| `aria-label` | absent | the label text | low (WAI-ARIA practice, not an MD1 rule) |
| `data-size` | `m` (24 px) or `s` (20 px) | same | high (S2 sizes) |
| `data-mirror` | present for roles marked yes or conditional below | same | high (S1, S7) |
| touch target | the host control provides 48 px (40 px dense); the icon itself is 24 px | same | high (S2 "Clearance") |

## Role vocabulary

Canonical glyphs. `Source` is the Material Icons `category/name`; `Paths` is the number of `d` strings; `Chars` is their total length; `Mirror` is the RTL ruling detailed in the mirroring section. `Role`, `Source`, `Paths`, `Chars`, and `Mirror` are `high` confidence (fetched verbatim from S8 at the pinned commit; mirror rulings from S1 and S7). `Used by` is `low`: it is the implementer's starting map, written from memory of the MD1 component pages named in the S6 index and not re-read this session; each component note owns its final icon list.

| Role | Source | Paths | Chars | Mirror | Used by (MD1 components) |
|---|---|---|---|---|---|
| `arrow-back` | `navigation/arrow_back` | 1 | 60 | yes | toolbars (up / back), search (exit), full-screen flows |
| `arrow-forward` | `navigation/arrow_forward` | 1 | 57 | yes | toolbars, navigational transitions |
| `arrow-upward` | `navigation/arrow_upward` | 1 | 59 | no | data tables (sort ascending) |
| `arrow-downward` | `navigation/arrow_downward` | 1 | 62 | no | data tables (sort descending) |
| `arrow-drop-down` | `navigation/arrow_drop_down` | 1 | 14 | no | menus (dropdown button), data tables (rows per page), text fields (select) |
| `arrow-drop-up` | `navigation/arrow_drop_up` | 1 | 14 | no | menus (open dropdown) |
| `arrow-right` | `navigation/arrow_right` | 1 | 18 | yes | menus (submenu indicator) |
| `chevron-left` | `navigation/chevron_left` | 1 | 45 | yes | data tables (previous page), pickers (previous month) |
| `chevron-right` | `navigation/chevron_right` | 1 | 46 | yes | data tables (next page), pickers (next month) |
| `expand-more` | `navigation/expand_more` | 1 | 44 | no | expansion panels, cards (expand), lists controls (expand), text fields (dropdown) |
| `expand-less` | `navigation/expand_less` | 1 | 46 | no | expansion panels (collapse), lists controls |
| `first-page` | `navigation/first_page` | 1 | 58 | yes | data tables (first page) |
| `last-page` | `navigation/last_page` | 1 | 58 | yes | data tables (last page) |
| `menu` | `navigation/menu` | 1 | 45 | no | toolbars (navigation drawer toggle) |
| `more-vert` | `navigation/more_vert` | 1 | 145 | no | toolbars (overflow), cards, lists, data tables |
| `more-horiz` | `navigation/more_horiz` | 1 | 147 | no | demo (overflow, horizontal) |
| `close` | `navigation/close` | 1 | 101 | no | full-screen dialogs, contextual toolbars, snackbars (close), search (clear), text fields (clear) |
| `check` | `navigation/check` | 1 | 49 | no | menus (selected item), steppers (completed step), full-screen dialogs (confirm) |
| `cancel` | `navigation/cancel` | 1 | 175 | no | chips (delete) |
| `refresh` | `navigation/refresh` | 1 | 202 | no | swipe to refresh, toolbars |
| `apps` | `navigation/apps` | 1 | 133 | no | toolbars (app launcher), bottom navigation demo |
| `unfold-more` | `navigation/unfold_more` | 1 | 119 | no | data tables (unsorted column), lists controls demo |
| `add` | `content/add` | 1 | 35 | no | floating action button, buttons demo, text fields (add) |
| `remove` | `content/remove` | 1 | 17 | no | lists controls, demo |
| `inbox` | `content/inbox` | 1 | 145 | no | lists demo, navigation drawer demo |
| `drafts` | `content/drafts` | 1 | 148 | no | lists demo, navigation drawer demo |
| `send` | `content/send` | 1 | 37 | yes | lists demo, navigation drawer demo, text fields (submit) |
| `filter-list` | `content/filter_list` | 1 | 46 | no | data tables (filter), toolbars |
| `sort` | `content/sort` | 1 | 44 | yes | data tables toolbar, lists |
| `link` | `content/link` | 1 | 211 | no | bottom sheets demo (get link) |
| `delete` | `action/delete` | 1 | 77 | no | lists demo, bottom sheets demo, data tables toolbar |
| `info` | `action/info` | 1 | 96 | no | grid lists (tile action), tooltips demo, help and feedback |
| `help` | `action/help` | 1 | 268 | conditional | help and feedback, navigation drawer demo |
| `help-outline` | `action/help_outline` | 1 | 243 | conditional | help and feedback (contextual help tooltip) |
| `feedback` | `action/feedback` | 1 | 104 | no | help and feedback (navigation drawer) |
| `offline-pin` | `action/offline_pin` | 1 | 137 | no | offline states (available offline) |
| `settings` | `action/settings` | 1 | 858 | no | settings pattern, bottom navigation demo, navigation drawer demo |
| `home` | `action/home` | 1 | 35 | no | bottom navigation demo |
| `account-circle` | `action/account_circle` | 1 | 242 | no | chips (contact placeholder), navigation drawer header, toolbars |
| `favorite` | `action/favorite` | 1 | 174 | no | cards, tabs demo, bottom navigation demo, toolbars |
| `favorite-border` | `action/favorite_border` | 1 | 343 | no | cards (toggle off), grid lists |
| `visibility` | `action/visibility` | 1 | 209 | no | text fields (show password) |
| `visibility-off` | `action/visibility_off` | 1 | 505 | no | text fields (hide password) |
| `search` | `action/search` | 1 | 234 | no | toolbars, search pattern, bottom navigation demo |
| `event` | `action/event` | 1 | 136 | no | pickers (date), text fields (date) |
| `schedule` | `action/schedule` | 2 | 183 | no | pickers (time), search pattern (recent) |
| `today` | `action/today` | 1 | 131 | no | pickers (today) |
| `open-in-new` | `action/open_in_new` | 1 | 130 | yes | lists (external link), buttons |
| `lock` | `action/lock` | 1 | 225 | no | text fields (password demo), lists |
| `bookmark` | `action/bookmark` | 1 | 59 | no | cards |
| `check-circle` | `action/check_circle` | 1 | 116 | no | steppers (completed, alternate), confirmation, errors pattern (success) |
| `zoom-in` | `action/zoom_in` | 2 | 267 | no | grid lists, imagery demo |
| `thumb-up` | `action/thumb_up` | 1 | 199 | no | cards demo |
| `language` | `action/language` | 1 | 809 | no | toolbars demo |
| `label` | `action/label` | 1 | 132 | yes | lists demo |
| `history` | `action/history` | 1 | 224 | no | search pattern (recent searches), bottom navigation demo (recents) |
| `reorder` | `action/reorder` | 1 | 59 | no | lists controls (reorder), data tables |
| `warning` | `alert/warning` | 1 | 50 | no | steppers (error step), errors pattern |
| `error` | `alert/error` | 1 | 96 | no | text fields (error), errors pattern, snackbars |
| `person` | `social/person` | 1 | 109 | no | tabs demo, bottom navigation demo |
| `share` | `social/share` | 1 | 359 | no | cards, bottom sheets demo, toolbars |
| `notifications` | `social/notifications` | 1 | 160 | no | toolbars, bottom navigation demo |
| `star` | `toggle/star` | 1 | 88 | no | lists demo, grid lists, navigation drawer demo |
| `star-border` | `toggle/star_border` | 1 | 192 | no | grid lists, lists controls (toggle off) |
| `check-box` | `toggle/check_box` | 1 | 131 | no | lists controls demo, data tables (select all) |
| `check-box-outline-blank` | `toggle/check_box_outline_blank` | 1 | 90 | no | lists controls demo, data tables |
| `indeterminate-check-box` | `toggle/indeterminate_check_box` | 1 | 102 | no | lists controls demo, data tables (partial selection) |
| `radio-button-checked` | `toggle/radio_button_checked` | 1 | 181 | no | lists controls demo |
| `radio-button-unchecked` | `toggle/radio_button_unchecked` | 1 | 124 | no | lists controls demo |
| `phone` | `communication/phone` | 1 | 240 | no | tabs demo, chips (contact) |
| `email` | `communication/email` | 1 | 109 | no | lists demo, navigation drawer demo, text fields (email) |
| `folder` | `file/folder` | 1 | 91 | no | lists demo, navigation drawer demo |
| `cloud-upload` | `file/cloud_upload` | 1 | 180 | no | buttons demo (upload) |
| `cloud-off` | `file/cloud_off` | 1 | 377 | no | offline states (needs a connection) |
| `download` | `file/file_download` | 1 | 41 | no | buttons demo (download), lists |
| `keyboard` | `hardware/keyboard` | 1 | 240 | no | pickers (keyboard input), demo |
| `edit` | `image/edit` | 1 | 149 | no | floating action button, steppers (editable completed step), bottom sheets demo, text fields |
| `photo` | `image/photo` | 1 | 120 | no | grid lists demo, cards |
| `place` | `maps/place` | 1 | 154 | no | bottom navigation demo (nearby), chips |
| `near-me` | `maps/near_me` | 1 | 46 | no | bottom navigation demo (nearby) |
| `mic` | `av/mic` | 1 | 191 | no | search pattern (voice search) |
| `play-arrow` | `av/play_arrow` | 1 | 13 | no | cards (media), demo |
| `pause` | `av/pause` | 1 | 31 | no | cards (media), demo |
| `drag-handle` | `editor/drag_handle` | 1 | 33 | no | lists controls (drag), data tables |

## Path data

One block per role; one `d` string per line, in draw order. Byte-equal to the upstream `d` attribute at S8 commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4`. Where the MD1-era artwork (S9) differs, the drift section below carries the S9 string.

#### `arrow-back` (navigation/arrow_back)

```text
M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z
```

#### `arrow-forward` (navigation/arrow_forward)

```text
M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z
```

#### `arrow-upward` (navigation/arrow_upward)

```text
M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z
```

#### `arrow-downward` (navigation/arrow_downward)

```text
M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z
```

#### `arrow-drop-down` (navigation/arrow_drop_down)

```text
M7 10l5 5 5-5z
```

#### `arrow-drop-up` (navigation/arrow_drop_up)

```text
M7 14l5-5 5 5z
```

#### `arrow-right` (navigation/arrow_right)

```text
M10 17l5-5-5-5v10z
```

#### `chevron-left` (navigation/chevron_left)

```text
M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z
```

#### `chevron-right` (navigation/chevron_right)

```text
M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z
```

#### `expand-more` (navigation/expand_more)

```text
M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z
```

#### `expand-less` (navigation/expand_less)

```text
M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z
```

#### `first-page` (navigation/first_page)

```text
M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z
```

#### `last-page` (navigation/last_page)

```text
M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z
```

#### `menu` (navigation/menu)

```text
M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z
```

#### `more-vert` (navigation/more_vert)

```text
M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z
```

#### `more-horiz` (navigation/more_horiz)

```text
M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z
```

#### `close` (navigation/close)

```text
M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z
```

#### `check` (navigation/check)

```text
M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z
```

#### `cancel` (navigation/cancel)

```text
M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z
```

#### `refresh` (navigation/refresh)

```text
M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z
```

#### `apps` (navigation/apps)

```text
M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z
```

#### `unfold-more` (navigation/unfold_more)

```text
M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z
```

#### `add` (content/add)

```text
M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z
```

#### `remove` (content/remove)

```text
M19 13H5v-2h14v2z
```

#### `inbox` (content/inbox)

```text
M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z
```

#### `drafts` (content/drafts)

```text
M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13L3.74 7.84 12 3l8.26 4.84L12 13z
```

#### `send` (content/send)

```text
M2.01 21L23 12 2.01 3 2 10l15 2-15 2z
```

#### `filter-list` (content/filter_list)

```text
M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z
```

#### `sort` (content/sort)

```text
M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z
```

#### `link` (content/link)

```text
M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z
```

#### `delete` (action/delete)

```text
M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z
```

#### `info` (action/info)

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z
```

#### `help` (action/help)

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z
```

#### `help-outline` (action/help_outline)

```text
M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z
```

#### `feedback` (action/feedback)

```text
M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z
```

#### `offline-pin` (action/offline_pin)

```text
M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,18H7v-2h10V18z M10.3,14L7,10.7l1.4-1.4l1.9,1.9 l5.3-5.3L17,7.3L10.3,14z
```

#### `settings` (action/settings)

```text
M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z
```

#### `home` (action/home)

```text
M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z
```

#### `account-circle` (action/account_circle)

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z
```

#### `favorite` (action/favorite)

```text
M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z
```

#### `favorite-border` (action/favorite_border)

```text
M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z
```

#### `visibility` (action/visibility)

```text
M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z
```

#### `visibility-off` (action/visibility_off)

```text
M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z
```

#### `search` (action/search)

```text
M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z
```

#### `event` (action/event)

```text
M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z
```

#### `schedule` (action/schedule)

```text
M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z
M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z
```

#### `today` (action/today)

```text
M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z
```

#### `open-in-new` (action/open_in_new)

```text
M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z
```

#### `lock` (action/lock)

```text
M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z
```

#### `bookmark` (action/bookmark)

```text
M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z
```

#### `check-circle` (action/check_circle)

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z
```

#### `zoom-in` (action/zoom_in)

```text
M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z
M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z
```

#### `thumb-up` (action/thumb_up)

```text
M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z
```

#### `language` (action/language)

```text
M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z
```

#### `label` (action/label)

```text
M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z
```

#### `history` (action/history)

```text
M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z
```

#### `reorder` (action/reorder)

```text
M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z
```

#### `warning` (alert/warning)

```text
M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z
```

#### `error` (alert/error)

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z
```

#### `person` (social/person)

```text
M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z
```

#### `share` (social/share)

```text
M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z
```

#### `notifications` (social/notifications)

```text
M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z
```

#### `star` (toggle/star)

```text
M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z
```

#### `star-border` (toggle/star_border)

```text
M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z
```

#### `check-box` (toggle/check_box)

```text
M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z
```

#### `check-box-outline-blank` (toggle/check_box_outline_blank)

```text
M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z
```

#### `indeterminate-check-box` (toggle/indeterminate_check_box)

```text
M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M17,13H7v-2h10V13z
```

#### `radio-button-checked` (toggle/radio_button_checked)

```text
M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z
```

#### `radio-button-unchecked` (toggle/radio_button_unchecked)

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z
```

#### `phone` (communication/phone)

```text
M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z
```

#### `email` (communication/email)

```text
M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z
```

#### `folder` (file/folder)

```text
M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z
```

#### `cloud-upload` (file/cloud_upload)

```text
M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z
```

#### `cloud-off` (file/cloud_off)

```text
M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z
```

#### `download` (file/file_download)

```text
M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z
```

#### `keyboard` (hardware/keyboard)

```text
M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z
```

#### `edit` (image/edit)

```text
M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z
```

#### `photo` (image/photo)

```text
M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z
```

#### `place` (maps/place)

```text
M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z
```

#### `near-me` (maps/near_me)

```text
M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z
```

#### `mic` (av/mic)

```text
M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z
```

#### `play-arrow` (av/play_arrow)

```text
M8 5v14l11-7z
```

#### `pause` (av/pause)

```text
M6 19h4V5H6v14zm8-14v14h4V5h-4z
```

#### `drag-handle` (editor/drag_handle)

```text
M20,9H4v2h16V9z M4,15h16v-2H4V15z
```

## Aliases

Aliases are brace references resolved by `createTokens` (`{ clear: '{close}' }`), never copies of path data. Overriding the target restyles every alias at once. All rows `high` confidence; "identical path data upstream" rows were verified by comparing the fetched files byte for byte after whitespace normalization.

| Alias | Target role | Kind | Basis |
|---|---|---|---|
| `clear` | `close` | MD1 vocabulary | content/clear and navigation/close carry identical path data upstream |
| `done` | `check` | MD1 vocabulary | action/done draws the same checkmark with coordinates rounded to one decimal (16.2 against 16.17, 4.8 against 4.83, 1.4 against 1.41); the shipped string is navigation/check |
| `calendar` | `event` | MD1 vocabulary | pickers call the field icon a calendar |
| `clock` | `schedule` | MD1 vocabulary | pickers call the time icon a clock |
| `mail` | `email` | MD1 vocabulary | content/mail and communication/email carry identical path data upstream |
| `account` | `person` | MD1 vocabulary | account menus and avatars |
| `play` | `play-arrow` | MD1 vocabulary | media controls |
| `nearby` | `near-me` | MD1 vocabulary | bottom navigation spec labels the tab Nearby |
| `chevron-down` | `expand-more` | Paper family vocabulary | DESIGN_SYSTEMS.md ruling 6 names chevron-down as a shared role |
| `chevron-up` | `expand-less` | Paper family vocabulary | counterpart of chevron-down |
| `plus` | `add` | Paper family vocabulary | Emerald role name |
| `minus` | `remove` | Paper family vocabulary | Emerald role name |
| `eye` | `visibility` | Paper family vocabulary | Emerald role name |
| `user` | `person` | Paper family vocabulary | Emerald role name |
| `kebab` | `more-vert` | Paper family vocabulary | Emerald role name; Emerald draws its kebab as three horizontal dots, Material Design 1 resolves the name to the vertical Material glyph because the word means vertical |
| `keyboard-arrow-down` | `expand-more` | Material Icons name | same geometry as expand_more on master; the path text differs by encoding only |
| `keyboard-arrow-up` | `expand-less` | Material Icons name | same geometry as expand_less on master; the path text differs by encoding only |
| `keyboard-arrow-left` | `chevron-left` | Material Icons name | same geometry as chevron_left on master; the path text differs by encoding only |
| `keyboard-arrow-right` | `chevron-right` | Material Icons name | same geometry as chevron_right on master; the path text differs by encoding only |
| `launch` | `open-in-new` | Material Icons name | action/launch and action/open_in_new carry identical path data upstream |
| `restore` | `history` | Material Icons name | action/restore and action/history carry identical path data upstream |
| `get-app` | `download` | Material Icons name | action/get_app and file/file_download carry identical path data upstream |
| `file-download` | `download` | Material Icons name | the source glyph name |
| `query-builder` | `schedule` | Material Icons name | action/query_builder and action/schedule carry identical path data upstream |
| `access-time` | `schedule` | Material Icons name | device/access_time and action/schedule carry identical path data upstream |
| `create` | `edit` | Material Icons name | content/create and image/edit carry identical path data upstream |
| `mode-edit` | `edit` | Material Icons name | editor/mode_edit and image/edit carry identical path data upstream |

Identical-path verification results (S8, master):

| Pair | Identical |
|---|---|
| `content/clear` vs `navigation/close` | yes |
| `action/done` vs `navigation/check` | NO |
| `content/mail` vs `communication/email` | yes |
| `action/launch` vs `action/open_in_new` | yes |
| `action/restore` vs `action/history` | yes |
| `action/get_app` vs `file/file_download` | yes |
| `action/query_builder` vs `action/schedule` | yes |
| `device/access_time` vs `action/schedule` | yes |
| `content/create` vs `image/edit` | yes |
| `editor/mode_edit` vs `image/edit` | yes |

Alias notes: `action/done` differs from `navigation/check` by rounding only (`M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z` against the shipped `M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z`), so that alias stands on geometry. `keyboard-arrow-*` and their targets draw the same chevron (same coordinates) but upstream encodes the path text differently, so they are listed as aliases on geometry, not on byte equality. `file/download` on master is the 2020 redraw of `file_download` with a detached tray (`M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z`) and is not used; `download` resolves to `file/file_download`, the MD1-era glyph.

## RTL mirroring

Rules, quoted from S1 (capture 2018-12-25) unless marked otherwise, all `high` confidence:

- "When a UI is mirrored, these changes occur: Text fields icons are displayed on the opposite side of a field. Navigation buttons are displayed in reverse order. Icons that communicate direction, like arrows, are mirrored. Text (if it is translated to an RTL language) is aligned to the right."
- "These items are not mirrored: Icons that do not communicate direction, such as a camera. Numbers, such as the clock and phone numbers. Charts and graphs."
- "The most important icons for mirroring are back and forward buttons. Back and forward navigation buttons are reversed."
- "An icon that shows forward movement should be mirrored."
- "A volume icon with a slider at its right side should be mirrored."
- Undo and redo: "In LTR, these point to the same direction in both circular and horizontal representations of time. In RTL, choose whether to show circular or horizontal direction."
- "Icons that contain representations of text need careful mirroring. Text is right-aligned in RTL. If there is a paragraph indent at the beginning of a paragraph, an unfinished line at the end of the paragraph, or a ragged right side, the icons need to be mirrored."
- "While the linear representation of time is mirrored in RTL, the circular direction of time is not. Clocks still turn clockwise for RTL languages. A clock icon or a circular refresh or progress indicator with an arrow pointing clockwise should not be mirrored." "The refresh icon shows time moving forward; the direction is clockwise. The icon is not mirrored." "The history icon points backwards in time; the direction is counterclockwise. The icon is not mirrored."
- "Some icons refer to physical objects that are not mirrored in the right-to-left world. For example, physical keyboards and media players look the same everywhere in the world, so they should not be mirrored."
- "Certain icons might seem directional but they actually represent holding an object with one's right hand. For example, the search icon typically has its handle at the bottom right side, because the majority of users are right-handed. The majority of users in RTL-writing countries are also right-handed, so such icons should not be mirrored."
- "Most RTL countries do not mirror slashes. Leave images with slashes as-is for RTL locales."
- "Display the \"next page\" on the left and the \"previous page\" on the right." "Days in a calendar appear from right to left."
- "Do not mirror media playback buttons and the media progress indicator as they refer to the direction of the media being played, not the direction of time."
- S7: "Note: Icons that include a question mark need to be mirrored in Arabic and Farsi, but not in Hebrew."
- S7, web mechanism: `html[dir="rtl"] .icon { transform: scaleX(-1); }`.

S7 publishes the list of Material Icons "that can be programmatically mirrored to RTL". The names in that list that Material Design 1 ships: `arrow_back`, `arrow_forward`, `arrow_right`, `chevron_left`, `chevron_right`, `first_page`, `last_page`, `help`, `label`, `open_in_new` (and its twin `launch`), `send`, `sort`. Names in that list that Material Design 1 does not ship but would have to mirror if added: `arrow_left`, `arrow_back_ios`, `arrow_forward_ios`, `backspace`, `keyboard_backspace`, `keyboard_tab`, `forward`, `reply`, `reply_all`, `undo`, `redo`, `event_note`, `star_half`, `help_outline`, `live_help`, `label_outline`, `label_important`, `list`, `view_list`, `toc`, `subject`, `short_text`, `wrap_text`, `format_list_bulleted`, `format_indent_increase`, `format_indent_decrease`, `playlist_add`, `queue_music`, `navigate_before`, `navigate_next`, `trending_up`, `trending_down`, `trending_flat`, `show_chart`, `multiline_chart`, `assignment`, `assignment_return`, `call_made`, `call_received`, `call_merge`, `call_split`, `call_missed`, `call_missed_outgoing`, `flight_takeoff`, `flight_land`, `input`, `functions`, `note`, `next_week`, `chrome_reader_mode`, `dvr`, `featured_play_list`, `featured_video`, `screen_share`, `mobile_screen_share`, `device_unknown`, `battery_unknown`, `view_quilt`.

Per-role ruling. `Basis` cites the spec sentence, the S7 list, and the upstream Android `android:autoMirrored="true"` flag (S8) where each applies:

| Role | Mirror in RTL | Basis | Confidence |
|---|---|---|---|
| `arrow-back` | yes | spec: back and forward buttons are reversed; Google RTL list; autoMirrored | high |
| `arrow-forward` | yes | spec: back and forward buttons are reversed; Google RTL list; autoMirrored | high |
| `arrow-upward` | no | vertical; not in Google RTL list | high |
| `arrow-downward` | no | vertical; not in Google RTL list | high |
| `arrow-drop-down` | no | symmetric; not in Google RTL list | high |
| `arrow-drop-up` | no | symmetric; not in Google RTL list | high |
| `arrow-right` | yes | Google RTL list; autoMirrored | high |
| `chevron-left` | yes | spec: previous page sits on the right in RTL; Google RTL list (autoMirrored absent upstream, see inconsistencies) | high |
| `chevron-right` | yes | spec: next page sits on the left in RTL; Google RTL list (autoMirrored absent upstream, see inconsistencies) | high |
| `expand-more` | no | symmetric; not in Google RTL list | high |
| `expand-less` | no | symmetric; not in Google RTL list | high |
| `first-page` | yes | Google RTL list (autoMirrored absent upstream, see inconsistencies) | high |
| `last-page` | yes | Google RTL list; autoMirrored | high |
| `menu` | no | symmetric; not in Google RTL list | high |
| `more-vert` | no | symmetric; not in Google RTL list | high |
| `more-horiz` | no | symmetric; not in Google RTL list | high |
| `close` | no | symmetric; not in Google RTL list | high |
| `check` | no | not in Google RTL list | high |
| `cancel` | no | symmetric; not in Google RTL list | high |
| `refresh` | no | spec: the refresh icon is clockwise and is not mirrored | high |
| `apps` | no | symmetric; not in Google RTL list | high |
| `unfold-more` | no | symmetric; not in Google RTL list | high |
| `add` | no | symmetric; not in Google RTL list | high |
| `remove` | no | symmetric; not in Google RTL list | high |
| `inbox` | no | not in Google RTL list | high |
| `drafts` | no | not in Google RTL list | high |
| `send` | yes | spec: forward movement is mirrored; Google RTL list; autoMirrored | high |
| `filter-list` | no | symmetric; not in Google RTL list | high |
| `sort` | yes | spec: icons with ragged text lines are mirrored; Google RTL list; autoMirrored | high |
| `link` | no | symmetric; not in Google RTL list | high |
| `delete` | no | symmetric; not in Google RTL list | high |
| `info` | no | symmetric; not in Google RTL list | high |
| `help` | conditional | Google RTL list and autoMirrored; guide: question marks mirror in Arabic and Farsi but not in Hebrew | high |
| `help-outline` | conditional | autoMirrored at S8; same question mark as `help`, same Hebrew exception | high |
| `feedback` | no | not autoMirrored at S8; not in Google RTL list | high |
| `offline-pin` | no | not autoMirrored at S8; symmetric | high |
| `settings` | no | symmetric; not in Google RTL list | high |
| `home` | no | symmetric; not in Google RTL list | high |
| `account-circle` | no | symmetric; not in Google RTL list | high |
| `favorite` | no | symmetric; not in Google RTL list | high |
| `favorite-border` | no | symmetric; not in Google RTL list | high |
| `visibility` | no | symmetric; not in Google RTL list | high |
| `visibility-off` | no | spec: slashes are not mirrored; not in Google RTL list | high |
| `search` | no | spec: handle is held in the right hand and is not mirrored | high |
| `event` | no | not in Google RTL list | high |
| `schedule` | no | spec: clocks turn clockwise and are not mirrored | high |
| `today` | no | not in Google RTL list | high |
| `open-in-new` | yes | Google RTL list; autoMirrored | high |
| `lock` | no | symmetric; not in Google RTL list | high |
| `bookmark` | no | symmetric; not in Google RTL list | high |
| `check-circle` | no | not in Google RTL list | high |
| `zoom-in` | no | handle held in the right hand (same reasoning as search); not in Google RTL list | high |
| `thumb-up` | no | not in Google RTL list | high |
| `language` | no | symmetric; not in Google RTL list | high |
| `label` | yes | Google RTL list; autoMirrored | high |
| `history` | no | spec: the history icon is counterclockwise and is not mirrored | high |
| `reorder` | no | symmetric; not in Google RTL list | high |
| `warning` | no | symmetric; not in Google RTL list | high |
| `error` | no | symmetric; not in Google RTL list | high |
| `person` | no | symmetric; not in Google RTL list | high |
| `share` | no | not in Google RTL list | high |
| `notifications` | no | symmetric; not in Google RTL list | high |
| `star` | no | symmetric; not in Google RTL list | high |
| `star-border` | no | symmetric; not in Google RTL list | high |
| `check-box` | no | not in Google RTL list | high |
| `check-box-outline-blank` | no | symmetric; not in Google RTL list | high |
| `indeterminate-check-box` | no | symmetric; not in Google RTL list | high |
| `radio-button-checked` | no | symmetric; not in Google RTL list | high |
| `radio-button-unchecked` | no | symmetric; not in Google RTL list | high |
| `phone` | no | not in Google RTL list | high |
| `email` | no | symmetric; not in Google RTL list | high |
| `folder` | no | not in Google RTL list | high |
| `cloud-upload` | no | symmetric; not in Google RTL list | high |
| `cloud-off` | no | spec: slashes are not mirrored; not autoMirrored at S8 | high |
| `download` | no | symmetric; not in Google RTL list | high |
| `keyboard` | no | spec: physical keyboards look the same everywhere and are not mirrored | high |
| `edit` | no | not in Google RTL list | high |
| `photo` | no | not in Google RTL list | high |
| `place` | no | symmetric; not in Google RTL list | high |
| `near-me` | no | not in Google RTL list | high |
| `mic` | no | symmetric; not in Google RTL list | high |
| `play-arrow` | no | spec: media playback controls are not mirrored | high |
| `pause` | no | spec: media playback controls are not mirrored | high |
| `drag-handle` | no | symmetric; not in Google RTL list | high |

Upstream inconsistencies recorded (S7 list vs S8 Android drawables), all `high`:

| Icon | S7 list | S8 `autoMirrored` | Ruling |
|---|---|---|---|
| `chevron_left`, `chevron_right` | listed | absent | mirror; S1 says previous and next page swap sides, and the twins `keyboard_arrow_left` and `keyboard_arrow_right` are flagged upstream |
| `first_page` | listed | absent | mirror; `last_page` is flagged and the pair must agree |
| `keyboard_arrow_left`, `keyboard_arrow_right` | not listed | flagged | mirror; they resolve to the chevrons |
| `star_half` | listed | flagged | not shipped (MD1 has no rating component) |
| `event_note` | listed | flagged | not shipped |

`help` and `help-outline` are the conditional cases: mirror under `dir="rtl"` unless the document language is Hebrew (`lang="he"`), per S7. The renderer sets `data-mirror="conditional"` for them and the stylesheet excludes `:lang(he)`.

## Drift since the MD1 era (master vs tag 3.0.2)

All 80 shipped roles were also fetched from S9 (tag `3.0.2`, the pre-2020 layout `ic_<name>_24px.svg`). 89 of the 109 fetched names are byte-identical after whitespace normalization; 17 differ. For the shipped set the differences are:

| Role | Kind of change | Ruling |
|---|---|---|
| `account-circle` | redraw: head radius 3.5 instead of 3, shoulders redrawn | ship master per the task; the S9 string below is the period-correct artwork, swap if fidelity to 2014-2017 rendering is preferred |
| `settings` | redraw: gear re-cut with absolute coordinates, hub radius 3.6 instead of 3.5 | same ruling as `account-circle` |
| `thumb-up` | tail of the path simplified (`v-2z` instead of `v-1.91l-.01-.01L23 10z`); same shape | master |
| `check-circle`, `star`, `drag-handle`, `indeterminate-check-box` | re-encoding only (implicit lineto, absolute vs relative, commas); same geometry | master |
| `schedule`, `zoom-in` | the single path was split into two paths; same geometry | master |
| `arrow-right` | absent at tag 3.0.2 (HTTP 404); the glyph entered Material Icons after the MD1 era | ship master; a consumer pinning 3.0.2 artwork can rotate `arrow-drop-down` by -90 degrees instead |

Fetched for alias verification but not shipped, also drifted: `cached`, `call` (redrawn handset; `phone` on master is byte-identical to the 3.0.2 `call` and `phone`, so the shipped handset is MD1-era), `query_builder`, `access_time`, `keyboard_arrow_down`, `keyboard_arrow_left`, `keyboard_arrow_right` (at 3.0.2 these chevrons sat 0.25 to 0.75 dp higher on the grid than on master: `L10 5.75`, `L14 5.5`, `M7.41 7.84` against `6`, `6`, `8.59`; on master they coincide with `chevron_*` and `expand_more`), `star_half`. `arrow_left` and `download` are absent at 3.0.2.

S9 strings for the two redraws, exact:

#### `account-circle` at tag 3.0.2

```text
M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z
```

#### `settings` at tag 3.0.2

```text
M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z
```

## Vuetify 1.5.24 preset cross-walk

`mixins/icons.ts` `ICONS_MATERIAL` maps Vuetify internal names to Material Icons font ligatures. Informational only: these are Vuetify vocabulary, and ruling 8 keeps orchestrator names off the design system. The right column is what a `VIcon` wrapper would translate each to. Confidence `moderate` (S10 only).

| Vuetify 1.5 key | Material ligature | Material Design 1 role |
|---|---|---|
| `complete` | `check` | `check` |
| `cancel` | `cancel` | `cancel` |
| `close` | `close` | `close` |
| `delete` | `cancel` | `cancel` (chip delete) |
| `clear` | `clear` | `close` (alias `clear`) |
| `success` | `check_circle` | `check-circle` |
| `info` | `info` | `info` |
| `warning` | `priority_high` | not shipped; MD1 has no alert component. `warning` resolves to the triangle `alert/warning` |
| `error` | `warning` | `warning` |
| `prev` | `chevron_left` | `chevron-left` |
| `next` | `chevron_right` | `chevron-right` |
| `checkboxOn` | `check_box` | `check-box` |
| `checkboxOff` | `check_box_outline_blank` | `check-box-outline-blank` |
| `checkboxIndeterminate` | `indeterminate_check_box` | `indeterminate-check-box` |
| `delimiter` | `fiber_manual_record` | not shipped; MD1 has no carousel |
| `sort` | `arrow_upward` | `arrow-upward` (the `sort` role is `content/sort`, a different glyph) |
| `expand` | `keyboard_arrow_down` | `expand-more` (alias `keyboard-arrow-down`) |
| `menu` | `menu` | `menu` |
| `subgroup` | `arrow_drop_down` | `arrow-drop-down` |
| `dropdown` | `arrow_drop_down` | `arrow-drop-down` |
| `radioOn` | `radio_button_checked` | `radio-button-checked` |
| `radioOff` | `radio_button_unchecked` | `radio-button-unchecked` |
| `edit` | `edit` | `edit` |
| `ratingEmpty` | `star_border` | `star-border` |
| `ratingFull` | `star` | `star` |
| `ratingHalf` | `star_half` | not shipped; MD1 has no rating component |
| `loading` | `cached` | not shipped; MD1 progress indicators are drawn, not glyphs |

Vuetify 1.5.24 does not mirror any icon in RTL: `VIcon.ts` and `_icons.styl` contain no `scaleX`, `flip`, or `rtl` rule (`moderate`). Material Design 1 does, per the table above.

## Deliberately not shipped

Fetched for verification only, or named in the task list and rejected: `help_outline`, `error_outline`, `bookmark_border`, `unfold_less`, `arrow_left`, `date_range`, `event_note`, `forward`, `reply`, `undo`, `redo`, `call`, `cached`, `star_half`, `download` (2020 redraw). Not fetched: `priority_high`, `fiber_manual_record`, `location_on`, `volume_up`, `print`, `content_copy`. Reason in every case: no MD1 component page in the S6 index needs the mark (ruling 7, exclusivity), or a shipped glyph already draws it. A consumer adds any of them through `createMd1IconsPlugin({ icons })`.

## Fetch log

| Fetch | Count | Result |
|---|---|---|
| S8 `materialicons/24px.svg` | 109 of 109 | HTTP 200 for every name; the `materialiconsoutlined` fallback was never needed |
| S8 Android `baseline_<name>_24.xml` | 109 of 109 | HTTP 200; 20 carry `android:autoMirrored="true"`: `help`, `help_outline`, `label`, `launch`, `open_in_new`, `forward`, `redo`, `reply`, `send`, `sort`, `undo`, `keyboard_arrow_left`, `keyboard_arrow_right`, `arrow_back`, `arrow_forward`, `arrow_left`, `arrow_right`, `last_page`, `event_note`, `star_half` |
| S9 tag 3.0.2 `ic_<name>_24px.svg` | 106 of 109 | HTTP 404 for `navigation/arrow_left`, `navigation/arrow_right`, `file/download` (added after the MD1 era) |
| S8 `LICENSE`, `README.md` | 2 of 2 | HTTP 200 |
| S8 `NOTICE` | 0 of 1 | HTTP 404 (no NOTICE file exists upstream) |
| Archive pages S1 to S7 | 8 of 8 | HTTP 200 via curl |
| `https://google.github.io/material-design-icons/` live | 1 of 1 | HTTP 200 but a 398-byte redirect stub; the 2018 capture (S7) was used instead |
| the December 2018 revision of the Material Icons guide (S7), first attempt | 0 of 1 | HTTP 000, connection timed out at 90 s; the retry at the 2018-12-24 copy S1 links to succeeded |

