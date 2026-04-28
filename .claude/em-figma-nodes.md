# Emerald Figma Node IDs

Source: `mcp-claude_ai_Figma-get_metadata-1776913584281.txt`
Figma file: `4rbKLw4wOC8DO1gZDmNARE`
Page node: `161:691` ("Work")

Mapping of Emerald components to top-level Figma frame IDs (parent frame of any component set / variants).

## Mapping

EmAccordion: 698:508
EmAlert: 698:296
EmAutocomplete: 458:370
EmAvatar: 656:1866
EmBadge: 667:1921
EmBreadcrumb: 458:362
EmCarousel: 644:1532
EmCheckbox: 374:138
EmDatePicker: 742:2295
EmDialog: 423:164
EmFlex: NOT FOUND
EmForm: 403:784
EmGrid: NOT FOUND
EmList: 721:660
EmLoading: NOT FOUND
EmMenu: 448:132
EmPagination: 520:1332
EmProgress: 681:211
EmRadio: 373:181
EmSelect: 341:3062
EmSlider: 675:2165
EmStepper: 652:1857
EmSwitch: 376:165
EmTable: 626:3626
EmTabs: 446:188
EmTag: 698:509
EmTextField: 338:3016
EmTextarea: 668:1940
EmToast: 505:313
EmTooltip: 509:386
EmUpload: 709:95

## Summary

- Found: 28 / 31 target components
- Not found: EmFlex, EmGrid, EmLoading (only referenced in the Group 32 "roadmap" text notes at `639:1047`, no dedicated frames exist on this page)

## Oddities

- **EmTextField**: no frame literally named "TextField" / "Text Field". The input control is named `Input` (`338:3016`) — mapped as EmTextField. A second `Form` frame (`398:74`) is a variant set of bare inputs.
- **EmForm**: two candidates — `403:784` (Default / Active / Error form groups with label + input + helper text, the richer one) chosen; `398:74` is input-only variants.
- **EmTag**: no frame literally named "Tag" or "Chip" (singular). Mapped to `Chips` parent (`698:509`), which contains three Chips subgroups (`689:693/694/695`).
- **EmPagination**: no standalone "Pagination" frame. There is a `symbol id="640:1411" name="Pagination"` (standalone node) and a `Tale pagination` frame (`520:1332`, likely typo for "Table pagination") inside the Data table set. Chose `520:1332` as the parent frame; consider `640:1411` if a pure symbol is preferred.
- **EmProgress**: two `ProgressBar` frames exist (`681:211` and `681:223`) — picked the first. Both have identical variant=Default/Content/variant3 symbols.
- **EmSlider**: `675:2165` is the canonical variant set (Default/Fill/Range/Ticks/TicksFill). A secondary `Group 36` wrapper (`678:102`) contains it plus loose state instances.
- **EmBadge**: frame name is lowercase `badge` — matched case-insensitively.
- **EmDialog**: `423:164` contains two screenshot-based layout groups showing Card over Overlay; no isolated dialog-card component set.
- **EmTable**: `626:3626` is the "Data table" umbrella containing 7 child Table variants (without border, with border, Selected, pagination, Sort Default/Hover/Active/Expanded/filter).
- **EmUpload**: two `upload` frames (`709:95` small, `712:115` large). Picked `709:95`.
- **EmAccordion / EmAlert**: plural parent frames chosen (`Accordions` / `Alerts`) over individual option frames.
