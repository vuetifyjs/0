---
'@paper/md1': minor
---

feat(md1): add the MD1 design system (Material Design 1) with 37 components, theme tokens, plugin and icons

`@paper/md1` is the Material Design 1 (2014 to 2017) design system on Vuetify0: the pinned, archived guidelines rendered on v0's headless compounds. Every component on the guidelines' component pages ships, named and propped in the guidelines' own vocabulary (`dense`, `raised`, `mini`, `shifting`, `prominent`, `inset`, `discrete`, `linear`, `editable`).

- `createMd1Plugin({ theme, icons, reducedMotion })` installs the `md1-light` and `md1-dark` themes through `Md1StyleSheetAdapter`, the icon registry and reduced-motion detection. Each key takes that plugin's own options, or `false` when your app installs it itself.
- `@paper/md1/theme.css` is the prebaked default theme: the 256-value MD1 palette, the type scale, elevation, motion and layout tokens as `--md1-*` custom properties, every color also as an `r g b` `-channels` triplet, and `--v0-*` aliases so Vuetify0 kits inherit the theme. `@paper/md1/style.css` carries the component styles and the `md1-type-*` and `md1-elevation-*` utility classes.
- `md1Colors` and `md1DarkColors` are the two theme maps; `md1HueTheme(primary, accent)` derives the role set for another hue pair from the palette; `md1DesignSystem` and `md1Breakpoints` expose the token dictionary and the responsive-ui widths.
- `Md1Icon` draws 80 Material Icons glyphs under 107 role names, mirrors directional roles under `dir="rtl"`, and resolves overrides and aliases registered through `createMd1IconsPlugin`. The artwork is Apache License 2.0; the notice ships as `LICENSE-ICONS`.
- `Md1Ripple` and `useRipple` provide the ink reaction every interactive component hosts, with reduced motion respected.
- Actions: `Md1Button` (flat, raised, dense, footer), `Md1Chip` (deletable, contact, with an addresses sheet), `Md1Fab` (mini, speed dial through `Md1Fab.Action`), `Md1DropdownButton` (segmented), `Md1IconToggle` and `Md1ToggleButtons`.
- Overlays: `Md1Dialog` (alert, simple, confirmation, full-screen), `Md1Menu` (cascading, check items), `Md1BottomSheet` (modal and persistent, list and grid), `Md1Snackbar` (with a queue and portal), `Md1Tooltip` (with touch press and hold) and `Md1FeatureDiscovery`.
- Disclosure and navigation: `Md1ExpansionPanel`, `Md1Stepper` (horizontal, vertical, mobile text, dots and progress), `Md1Tabs` (fixed and scrollable, with pagination arrows), `Md1Toolbar` (app bar, scroll behaviors, contextual and search modes, extension), `Md1NavigationDrawer` (temporary, persistent, permanent, mini), `Md1BottomNavigation` (fixed and shifting) and `Md1SearchBar`.
- Forms: `Md1TextField` (box, dense, multiline, textarea, full width, solo, dropdown, masks, date and time pickers), `Md1Autocomplete` (strict, multiple, inline), `Md1Checkbox`, `Md1Radio`, `Md1Switch`, `Md1Slider` (discrete, editable, with end icons), `Md1DatePicker` and `Md1TimePicker` (portrait and landscape).
- Content and feedback: `Md1Card`, `Md1DataTable` (sorting, selection, inline and dialog editing, pagination), `Md1List` (single and multiple selection, controls, nested groups), `Md1GridList`, `Md1Divider`, `Md1Subheader`, `Md1ProgressLinear` (determinate, indeterminate, buffer, query) and `Md1ProgressCircular`.
