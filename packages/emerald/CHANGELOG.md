# @paper/emerald

## 0.1.1

### Patch Changes

- [#955](https://github.com/vuetifyjs/0/pull/955) [`0100994`](https://github.com/vuetifyjs/0/commit/0100994eba111e98bdf34ce1eaf3366bace01f16) Thanks [@johnleider](https://github.com/johnleider)! - fix(EmCalendar): fill the parent width instead of shrinking to the header

  A calendar in a full-width column used to size itself to the month label, so the grid sat as a skinny card on mobile. The root is now `width: 100%`.

- Updated dependencies [[`ac90199`](https://github.com/vuetifyjs/0/commit/ac90199f51f30b0b2cc95c46016598278ac18c26), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`897cdcf`](https://github.com/vuetifyjs/0/commit/897cdcf0f5d6683f282261c378d84e1550df191c), [`2e0025c`](https://github.com/vuetifyjs/0/commit/2e0025cde4d5bcda140834628883fa8a8dff42ba), [`6ec1732`](https://github.com/vuetifyjs/0/commit/6ec173270d312591f966e32ede760531a1d18e24), [`c9575fd`](https://github.com/vuetifyjs/0/commit/c9575fd4c5be46333b010e022f6f00de240a3459), [`9f8eb78`](https://github.com/vuetifyjs/0/commit/9f8eb78d500e2a6f064a32422586cc5483b61c0d), [`1b6bb65`](https://github.com/vuetifyjs/0/commit/1b6bb65d01c61bb9e025e1ada9d50b634047b0b7), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`8155332`](https://github.com/vuetifyjs/0/commit/81553324651e93150ad9f61236d465fade96bd5b), [`2bfaf60`](https://github.com/vuetifyjs/0/commit/2bfaf6049a3c9c7504ed12c898f38af67df4d850)]:
  - @vuetify/v0@1.2.1

## 0.1.0

### Minor Changes

- [#800](https://github.com/vuetifyjs/0/pull/800) [`a93fb6d`](https://github.com/vuetifyjs/0/commit/a93fb6dff8b1298697df56fc0b6de901ce4e710a) Thanks [@johnleider](https://github.com/johnleider)! - fix(EmCalendar): correct selection, focus, and announcement behavior; add Title `live` and component `as` support

  The calendar no longer silently selects today on mount without updating your model, and clearing the model now clears the selected paint. The today indicator rolls over at midnight instead of going stale. Keyboard support gains Shift+PageUp/PageDown (±1 year) and RTL-aware arrow navigation; month changes are announced to screen readers via the title's new `live` prop (default on — set `:live="false"` on a second title over the same calendar), and the initial tab stop lands on the selected day when one is visible. `EmCalendarTitle`'s `as` now accepts components as well as tag names. Internally the calendar is rebuilt on a selection-free geometry core slated for graduation to `@vuetify/v0`.

- [#880](https://github.com/vuetifyjs/0/pull/880) [`2d75a31`](https://github.com/vuetifyjs/0/commit/2d75a315f706fc93b370ba2d22cf902cce577802) Thanks [@johnleider](https://github.com/johnleider)! - feat(emerald): reach a compound's sub-components from the root import

  Importing `EmCalendar` now brings its whole tree with it — `<EmCalendar.Grid />`, `<EmCalendar.Header />`, and the rest — so a compound costs one import instead of eight. The sub-key drops the parent prefix (`EmCalendarGrid` is `EmCalendar.Grid`, `EmListItemTitle` is `EmList.ItemTitle`).

  ```vue
  <script setup lang="ts">
  import { EmCalendar } from "@paper/emerald";
  </script>

  <template>
    <EmCalendar>
      <EmCalendar.Header>
        <EmCalendar.Prev />
      </EmCalendar.Header>

      <EmCalendar.Grid />
    </EmCalendar>
  </template>
  ```

  Nothing is removed: every flat name (`EmCalendarGrid`, `EmDialogContent`, …) is still exported and resolves to the same component, so existing imports keep working and the two styles can be mixed.

- [#804](https://github.com/vuetifyjs/0/pull/804) [`d8d9c1b`](https://github.com/vuetifyjs/0/commit/d8d9c1bc6c754d748e03f054670a3880cc2bec23) Thanks [@johnleider](https://github.com/johnleider)! - feat(emerald): add EmIcon and a role-based icon system

  Emerald now ships its own icons. `EmIcon` draws a named role — `<EmIcon name="chevron-down" />` — from a set of 48 glyphs covering objects, people, charts, chrome, direction, and marks. Roles are named for what the glyph draws, so a further 24 aliases carry the product vocabulary — `finance` and `payments` both point at `card`, `dashboard` at `layout` — and either name resolves. Sizes map to the `--emerald-icon-*` scale (`s`/`m`/`l`/`xl`), and icons are hidden from assistive tech unless you give them a `label`, which promotes them to a named image.

  Icons are their own plugin. `createEmeraldPlugin` installs it for you, so the happy path is unchanged, and roles resolve through v0's `createTokens` — the set is yours to reshape from either entry:

  ```ts
  // composed — the usual way
  app.use(
    createEmeraldPlugin({
      icons: {
        icons: { star: ["M12 2 …"] }, // replace a glyph, or add a new role
        aliases: { expand: "chevron-down" }, // point a name at an existing one
      },
    })
  );

  // or on its own, for icons without Emerald theming
  app.use(createEmeraldIconsPlugin({ aliases: { expand: "chevron-down" } }));
  ```

  Overriding a role at registration updates every alias and every component that draws it, so restyling the system's chrome is a one-line change. `EmIcon` also works with no plugin installed — it falls back to the built-in set.

  Pass `{ icons: false }` to skip the install when you provide the registry yourself. It is a registration switch, not a bundle switch: the glyph map ships with the package either way.

  Components that previously drew their own artwork now render it through the icon system, so their glyphs follow your overrides: `EmCheckbox` (check and indeterminate marks), `EmExpansionPanelCue`, `EmDialogClose`, `EmSnackbarClose`, and `EmCalendarPrev` / `EmCalendarNext`. Their slots remain overridable and their markup semantics are unchanged.

  `EmSelectActivator` now renders its own chevron. Previously the caret was left to the consumer while the styling for it shipped unused, which meant the open-state rotation never ran; existing default-slot content is unaffected and still supplies the label. If you were supplying your own caret in the activator slot, remove it: the activator now draws one.

- [#873](https://github.com/vuetifyjs/0/pull/873) [`5aa6a49`](https://github.com/vuetifyjs/0/commit/5aa6a498b7434529a7ad8952bb97457ea156ef75) Thanks [@johnleider](https://github.com/johnleider)! - feat(emerald): register emerald-light / emerald-dark and follow the OS

  `createEmeraldPlugin` defaults `system: { light: 'emerald-light', dark: 'emerald-dark' }`.
  The light theme id is now `emerald-light` (`data-theme="emerald"` is gone).
  Tokens and `--emerald-*` are unchanged.

- [#715](https://github.com/vuetifyjs/0/pull/715) [`083b30d`](https://github.com/vuetifyjs/0/commit/083b30d95e13c0e41bd17935afc7fb529569c87e) Thanks [@johnleider](https://github.com/johnleider)! - feat(emerald): introduce Wave 1–4 design system surface

  Twenty-eight component families composed on v0 primitives (or `Atom` shells where no primitive exists yet):

  - **Wave 1** — `EmButton`, `EmTextField`, `EmCheckbox`, `EmSwitch`, `EmDialog`, `EmSelect`
  - **Wave 2** — `EmAlert`, `EmCard`, `EmTag`, `EmAvatar`, `EmTabs`, `EmPagination`, `EmSlider`
  - **Wave 3** — `EmRadio`, `EmProgress`, `EmSpinner`, `EmBadge`, `EmDivider`, `EmTextarea`, `EmTooltip`, `EmSnackbar`, `EmBreadcrumbs`, `EmExpansionPanel`, `EmStep`
  - **Wave 4** — `EmPopover`, `EmList`, `EmKanban` (real drag-and-drop over `createKanban` + `useDragDrop`), `EmCalendar` (APG grid keyboard pattern, optional `DateAdapter` injection)

  Compound components (`EmDialog`, `EmSelect`, `EmTabs`, `EmSnackbar`, `EmBreadcrumbs`, …) ship one `Em*` export per region so consumers build the tree with default slots.

  Also included: Figma-sourced `--emerald-*` tokens (color scales, spacing, radius, stroke, icon, shadow, type, motion, control geometry), `--v0-*` aliases for kit interop, `createEmeraldPlugin()` for one-line install, and a prebaked `theme.css` for the zero-config CSS-only path.

  A full `emerald-dark` theme ships alongside the light default — inverted-ladder color scales, ink `on-*` foregrounds, dark-tuned shadows — registered by the plugin and baked into `theme.css` under `[data-theme="emerald-dark"]`.

### Patch Changes

- [#843](https://github.com/vuetifyjs/0/pull/843) [`2e92047`](https://github.com/vuetifyjs/0/commit/2e9204786d72db0cf58147289792165f9944ba72) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(createProgress): clear stale segment values when the model becomes indeterminate

  `Progress.Root`'s `apply()` only wrote incoming values to segments at matching
  indices, so `apply([])` — what happens when the bound model value becomes
  `undefined`, e.g. flipping `EmProgress`'s `indeterminate` prop after a value was
  already committed — left previously-registered segments untouched. The bar
  correctly ran Emerald's indeterminate sweep animation via CSS, but `data-state`
  stayed `"determinate"` and `aria-valuenow`/`aria-valuetext` kept reporting the
  stale committed value to assistive tech.

  `apply()` now walks every registered segment rather than only the incoming
  values, resetting any segment without a corresponding entry back to `min`. A
  progress bar transitioning to indeterminate now correctly reports
  `data-state="indeterminate"`, clears `aria-valuenow`/`aria-valuetext`, and sets
  `aria-busy`.

  Also fixes the related pin in `isIndeterminate`: an instance created with an
  initial `value` (`createProgress({ value })`) returned `false` permanently, even
  after segments registered and were cleared back to `min`. The initial value now
  only backs the zero-segment state — mirroring `total`'s fallback — so segments
  become the sole source of truth once registered.

- Updated dependencies [[`bcc509c`](https://github.com/vuetifyjs/0/commit/bcc509c909404443dfff098ef0b0bc73e206da93), [`bac9bdb`](https://github.com/vuetifyjs/0/commit/bac9bdbca5d61582780f6bf143ddc163dc03c117), [`afd8718`](https://github.com/vuetifyjs/0/commit/afd8718bef5cd2d4870d653f63840482acdcdfbf), [`1d3d810`](https://github.com/vuetifyjs/0/commit/1d3d810341d766c5ecad0e4903b8736abcdc6636), [`840d6ea`](https://github.com/vuetifyjs/0/commit/840d6eaa7a578eb895ce8790e45687ac97c341c0), [`be427af`](https://github.com/vuetifyjs/0/commit/be427af15b294fb894f26a426ee1ceb4c5585f51), [`d2fde78`](https://github.com/vuetifyjs/0/commit/d2fde78dddf57fbaaa5f1a04a5efd51f0ef92be6), [`a3d8d1c`](https://github.com/vuetifyjs/0/commit/a3d8d1cb9e2270595054b1fff6bee5db229bc23b), [`04eb489`](https://github.com/vuetifyjs/0/commit/04eb489585f87f95c5d855c6a5d5dd169aaaad60), [`1864803`](https://github.com/vuetifyjs/0/commit/186480383960f364ba90c0236b8a38711c88b899), [`e6c4068`](https://github.com/vuetifyjs/0/commit/e6c406875ae04a6b22ebdf087dd4d5a93e46f410), [`e6c4068`](https://github.com/vuetifyjs/0/commit/e6c406875ae04a6b22ebdf087dd4d5a93e46f410), [`2e92047`](https://github.com/vuetifyjs/0/commit/2e9204786d72db0cf58147289792165f9944ba72), [`d876cf9`](https://github.com/vuetifyjs/0/commit/d876cf98c3ebab23e0cdc59a37f279a3b27bd25d), [`3904c8f`](https://github.com/vuetifyjs/0/commit/3904c8f0082b9e848ef89f67767c41eb2eb444cf), [`e82f95a`](https://github.com/vuetifyjs/0/commit/e82f95aa6b42fb1dbf71e20b9c6bba1af217d12c), [`3cd588a`](https://github.com/vuetifyjs/0/commit/3cd588a85dd593e09a4cb5e3a8f1e16ce775d59b)]:
  - @vuetify/v0@1.2.0
