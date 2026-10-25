# Material Design 1 house style: the implementer playbook

Repo worktree for all paths below: `/home/john/sites/0/.claude/worktrees/quantum` (branch `feat/quantum`, forked from `dev` at `db6745f80`; `master` merge-base is `bcc509c90`). The sibling compat exemplar is `/home/john/sites/0/.claude/worktrees/bootstrap-v6` (branch `feat/bootstrap-v6`, partly uncommitted). Every file this note cites was read in full unless a line range is given.

Confidence vocabulary: `high` = read from the cited file; `moderate` = adapted from a sibling package's pattern, or from Vuetify 1.5 stylus; `low` = memory only.

## Sources

No web pages were fetched for this note. Everything below comes from these local files.

| Group | Files read |
|---|---|
| Family contract | `/home/john/sites/0/.claude/worktrees/quantum/DESIGN_SYSTEMS.md`; `/home/john/.claude/skills/paper-component/SKILL.md` |
| Repo rules | `/home/john/sites/0/.claude/worktrees/quantum/.claude/rules/{components,implementation,testing,docs,new-feature-checklist}.md`; `/home/john/sites/0/.claude/worktrees/quantum/.claude/skills/releasing/SKILL.md`; `/home/john/sites/0/.claude/worktrees/quantum/apps/docs/CLAUDE.md` (head). `packages/0/.claude` does not exist |
| Emerald package | `/home/john/sites/0/.claude/worktrees/quantum/packages/emerald/{SPEC.md,README.md,package.json,tsdown.config.mts,tsconfig.json,vitest.config.ts,CHANGELOG.md}`; `scripts/bake-theme.ts`; `src/{index,plugin,adapter,design-system,colors,vite-env.d}.ts`; `src/icons/{index,glyphs}.ts`; `src/components/index.ts`; every file under `src/components/{EmButton,EmIcon,EmDialog,EmCard,EmTextField,EmSelect,EmTabs,EmSnackbar,EmCheckbox,EmSlider,EmCalendar}/` (EmCalendar test and core files read as heads); `changesets-parked/*` |
| Bootstrap package | `/home/john/sites/0/.claude/worktrees/bootstrap-v6/packages/bootstrap/{SPEC.md,README.md,CANON.md,package.json,tsconfig.json,tsdown.config.mts,vitest.browser.config.ts}`; `harness/{CANON.md,PIN.md,conform.ts,conform.browser.test.ts}`; `src/{index.ts,utilities/context.ts}`; `src/components/index.ts`; `src/components/{BDialog,BButton,BTabs,BMenu}/*` including `*.browser.test.ts`; `src/components/{BDialogClose,BDialogTitle,BTabsItem}/*.vue` |
| Bootstrap docs | `/home/john/sites/0/.claude/worktrees/bootstrap-v6/apps/docs/src/pages/systems/bootstrap/{index,dialog,button,tabs,menu}.md` (`text.md` does not exist); `src/examples/systems/bootstrap/{dialog/basic,button/basic,button/states,tabs/basic}.vue`; `src/examples/systems/bootstrap/overview.vue` (head); `src/sandbox/bootstrap.ts`; `sandbox/bootstrap.html`; `src/components/app/theme/palette/AppPaletteBootstrapButton.vue`; `git diff master` of every docs and root file the branch touched |
| Emerald docs | `/home/john/sites/0/.claude/worktrees/quantum/apps/docs/src/pages/systems/emerald/{index,button,dialog,text-field,tabs}.md`; `src/examples/systems/emerald/{button/*,dialog/*}.vue` |
| Docs wiring | `/home/john/sites/0/.claude/worktrees/quantum/apps/docs/{vite.config.ts,tsconfig.examples.json,tsconfig.app.json,tsconfig.json,package.json}`; `build/{generate-nav,frontmatter,markdown}.ts` (markdown.ts grepped for the container registration); `src/sandbox/{emerald.ts,SandboxRoot.vue}`; `sandbox/emerald.html`; `src/components/docs/{DocsSystemExample,DocsSystemActivator}.vue`; `src/components/docs/meta/DocsPageFeatures.vue` (props); `src/composables/{useThemeToggle,usePlayground,useExamples}.ts`; `src/themes/index.ts`; `src/plugins/{icons,zero}.ts`; `src/App.vue`; `src/components/app/theme/palette/AppPaletteEmeraldButton.vue`; `src/components.d.ts` (grep) |
| Root config | `/home/john/sites/0/.claude/worktrees/quantum/{knip.json,eslint.config.js,tsconfig.json,vitest.config.ts,pnpm-workspace.yaml,package.json,.size-limit.json}`; `dev/vite.config.ts`; `.changeset/config.json`; `scripts/changeset-required.js`; `.github/actions/setup/action.yml`; `.github/workflows/{docs-deploy,pr-checks}.yml`; `README.md` and `packages/0/README.md` (package table) |
| v0 palettes | `/home/john/sites/0/.claude/worktrees/quantum/packages/0/src/palettes/md1/index.ts` (head); `packages/0/package.json` (`./palettes/md1` export) |
| Vuetify 1.5 cross-check | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/settings/{_variables,_elevations}.styl`; `components/{_buttons,_dialogs}.styl` (heads). Used only for the literals in the two code samples |
| Memory notes | `/home/john/.claude/projects/-home-john-sites-0/memory/{scoped-css-multiroot-child,vue-template-dotvalue-topref-drop,lint-hook-destructive-rewrite,popover-display-autohide-footgun,snackbar-portal-zindex-static-footgun,feedback_registry_element_refs,emerald-prop-type-gates,docs-app-typecheck-gap,worktree-node-modules-symlink,docs-browser-verification,emerald-feedback-from-onyx,onyx-design-system,emerald-docs-branch-sequencing,typecheck-local-vs-ci-divergence,vitest-isvisible-vshow-unreliable,vitest-console-intercept,docs-vite-scoped-style-hmr-stale,enterworktree-moves-subagent-shells,feedback_*}.md` |
| Tooling | `/home/john/.claude/hooks/lint-fix.sh`; `/home/john/.claude/settings.json` (hooks block). pnpm `11.16.0`, vitest `4.1.11`, Playwright `1.62.1` verified on this machine |

## 0. Names and ids this note assumes

| Item | Value | Derived from | Confidence |
|---|---|---|---|
| npm name | `@paper/md1` | assignment | high |
| Component prefix | `Md1*` | assignment | high |
| Token namespace | `--md1-*` | assignment | high |
| Class prefix | `md1-` (`md1-button`, `md1-button__content`) | Emerald `emerald-*` | high |
| Theme ids | `md1-light` (default), `md1-dark` (`dark: true`) | assignment; Emerald `emerald-light` / `emerald-dark` | high |
| Plugin | `createMd1Plugin`, options type `Md1PluginOptions` | Emerald `createEmeraldPlugin` | high |
| Adapter | `Md1StyleSheetAdapter`, options `Md1AdapterOptions`, `stylesheetId: 'md1-theme-stylesheet'`, `prefix: 'md1'` | Emerald adapter | high |
| Color maps | `md1Colors`, `md1DarkColors` | assignment | high |
| Token dictionary export | `md1DesignSystem` plus the named families | Emerald `emeraldDesignSystem` | moderate |
| Icons | `createMd1IconsPlugin`, `createMd1IconsContext`, `useMd1Icons`, `createMd1Icons`, `md1Icons`, `md1IconAliases`, `MD1_ICONS_NAMESPACE = 'md1:icons'`, component `Md1Icon`, types `Md1IconGlyph`, `Md1IconName`, `Md1IconCollection`, `Md1IconsContext`, `Md1IconsOptions`, `Md1IconsContextOptions`, `Md1IconsPluginOptions` | Emerald icons | high |
| Stylesheet exports | `@paper/md1/style.css`, `@paper/md1/theme.css` | assignment; Emerald `package.json` | high |
| Context namespaces | `md1:<thing>` (must contain `:`) | testing.md namespace rule; Bootstrap `bootstrap:dialog` | high |
| Docs palette id | `md1` | Emerald `emerald` in `useThemeToggle.ts` | high |
| Docs icon role | `theme-md1` | Emerald `theme-emerald` | high |
| Docs pages folder | `apps/docs/src/pages/systems/md1/` | Emerald | high |
| Docs examples folder | `apps/docs/src/examples/systems/md1/<component>/<example>.vue` | Emerald | high |
| Base branch for the PR | `dev` (new public API = minor) | root `CLAUDE.md` branch model | high |
| First changeset | `.changeset/md1-initial.md` with `'@paper/md1': minor` | Emerald `changesets-parked/emerald-wave1.md` | moderate |

## 1. Package skeleton

### 1.1 File checklist

Create `packages/md1/` from Emerald, file by file. "Copy" means copy the Emerald file and apply the rename column; nothing else changes.

| Path under `packages/md1/` | Copy from (`packages/emerald/` unless noted) | What changes | Confidence |
|---|---|---|---|
| `package.json` | `package.json` | see 1.2; adds `test:browser` script and browser dev deps from Bootstrap | high |
| `tsconfig.json` | `tsconfig.json` | `#emerald` -> `#md1` (two path entries) | high |
| `tsdown.config.mts` | `tsdown.config.mts` | `emerald` const -> `md1`; `name: 'paper/md1'`; alias `#md1`; keep `customExports` | high |
| `vitest.browser.config.ts` | `packages/bulma/vitest.browser.config.ts` (the committed precedent on `feat/quantum`, listed in the root `vitest.config.ts`; Bootstrap's copy is the same file but lives uncommitted on another worktree) | `@paper/bulma` -> `@paper/md1`; `#bulma` -> `#md1`; `name: 'md1:browser'`; drop the Bulma-only header comment | high |
| `scripts/bake-theme.ts` | `scripts/bake-theme.ts` | identifiers and strings, see 1.6 | high |
| `src/index.ts` | `src/index.ts` | none (six `export *` lines) | high |
| `src/vite-env.d.ts` | `src/vite-env.d.ts` | none | high |
| `src/plugin.ts` | `src/plugin.ts` | see 1.8 | high |
| `src/adapter.ts` | `src/adapter.ts` | see 1.7 | high |
| `src/design-system.ts` | `src/design-system.ts` | token families are Material Design 1's (the other spec notes own the values); keep the `*Dark satisfies Record<keyof typeof *, string>` pattern | high |
| `src/colors.ts` | `src/colors.ts` | `emeraldColors` -> `md1Colors`, `emeraldDarkColors` -> `md1DarkColors`; keep `scale()` and both `satisfies` | high |
| `src/icons/glyphs.ts` | `src/icons/glyphs.ts` | `emeraldIcons` -> `md1Icons`, `emeraldIconAliases` -> `md1IconAliases`, `EmIcon*` types -> `Md1Icon*`; artwork is Material Design 1's own (ruling 6: no shared artwork) | high |
| `src/icons/index.ts` | `src/icons/index.ts` | names per section 0; `EM_ICONS_NAMESPACE` -> `MD1_ICONS_NAMESPACE = 'md1:icons'` | high |
| `src/components/index.ts` | `src/components/index.ts` | one `export * from './Md1X'` per component, alphabetical | high |
| `src/components/Md1Icon/{Md1Icon.vue,index.ts,Md1Icon.browser.test.ts}` | `src/components/EmIcon/*` | `emerald-icon` -> `md1-icon`; `--emerald-icon-*` -> `--md1-icon-*`; test moves to the browser runner | high |
| `SPEC.md` | `SPEC.md` (shape) | class, pinned spec, coverage, inventory, deviations; see 1.10 | high |
| `README.md` | `README.md` | install snippet with the Material Design 1 names | high |
| `LICENSE-ICONS` | new | Apache 2.0 text plus the attribution notice for `google/material-design-icons` at commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4` (`spec/icons.md` carries the text; upstream ships no NOTICE file, so section 4(d) adds nothing); shipped in the tarball through `files` | high |
| `CHANGELOG.md` | generated by changesets on release; do not author | high |
| `harness/` | do not create | Bootstrap-only (compat conformance fixtures) | high |

Do not create `vitest.config.ts` (happy-dom) unless a DS-owned headless core like `EmCalendar/calendar.ts` appears; Emerald runs every test on happy-dom and has zero `*.browser.test.ts` files, which is the exception, not the rule (`testing.md`: components use `*.browser.test.ts`).

### 1.2 package.json

Copy-pasteable. Every devDependency must be `catalog:` (`pnpm/json-enforce-catalog` in `eslint.config.js`).

```json
{
  "name": "@paper/md1",
  "version": "0.0.0",
  "description": "Material Design 1 (2014 to 2017) design system, composed on Vuetify0",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuetifyjs/0.git",
    "directory": "packages/md1"
  },
  "types": "./dist/index.d.mts",
  "type": "module",
  "files": [
    "dist",
    "LICENSE-ICONS"
  ],
  "scripts": {
    "build": "tsdown && pnpm bake:theme",
    "bake:theme": "tsx -C development scripts/bake-theme.ts",
    "typecheck": "vue-tsc --noEmit --incremental",
    "test:browser": "vitest run --config vitest.browser.config.ts"
  },
  "peerDependencies": {
    "vue": ">=3.5.0"
  },
  "exports": {
    ".": {
      "development": "./src/index.ts",
      "default": "./dist/index.mjs"
    },
    "./package.json": "./package.json",
    "./style.css": "./dist/style.css",
    "./theme.css": "./dist/theme.css"
  },
  "publishConfig": {
    "access": "public",
    "exports": {
      ".": "./dist/index.mjs",
      "./package.json": "./package.json",
      "./style.css": "./dist/style.css",
      "./theme.css": "./dist/theme.css"
    }
  },
  "dependencies": {
    "@vuetify/v0": "workspace:^"
  },
  "devDependencies": {
    "@vitest/browser-playwright": "catalog:",
    "tsdown": "catalog:",
    "tsx": "catalog:",
    "typescript": "catalog:",
    "unplugin-vue": "catalog:",
    "vitest": "catalog:",
    "vue": "catalog:"
  }
}
```

Facts behind it (all `high`): Emerald's `exports` has the same four keys; `dist/style.css` is written by tsdown from the SFC `<style>` blocks (`exports.devExports: 'development'` regenerates the map on every build); `dist/theme.css` is written after tsdown by the bake script, so it survives only through `customExports` in `tsdown.config.mts` (memory `emerald-feedback-from-onyx` item 1, confirmed by the comment in Emerald's `tsdown.config.mts`). Bootstrap's `package.json` is the source of the `test:browser` script and the two browser dev deps.

`bake:theme` runs under the `development` export condition (`tsx -C development scripts/bake-theme.ts`), so the script's import graph (`src/design-system.ts` reaching `@vuetify/v0/palettes/md1` and `@vuetify/v0/utilities`) resolves to `packages/0/src` and the bake needs no `packages/0/dist`. Without the flag Node takes the `default` condition and the import fails with `ERR_MODULE_NOT_FOUND` on `dist/palettes/md1` until `pnpm build:0` has run. Verified on 2026-10-22 with `packages/0/dist` renamed: `tsdown` (whose dts build follows the tsconfig `customConditions`) and the `-C development` bake both pass, the plain `tsx scripts/bake-theme.ts` fails.

After creating the package run `pnpm install` once from the worktree root (not `--frozen-lockfile`: the lockfile gains a workspace project).

### 1.3 tsconfig.json

Copy Emerald's verbatim and change only the `paths` block:

```json
"paths": {
  "#md1/*": ["./src/*"],
  "#md1": ["./src"],
  "#v0": ["../0/src"],
  "#v0/*": ["../0/src/*"]
}
```

`include` stays `["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]`, `exclude` stays `["src/**/__tests__/*", "scripts/**"]` (so `scripts/bake-theme.ts` is never typechecked, which is why the bake script re-asserts key parity at runtime). Package source imports `@vuetify/v0`, never `#v0` (`#v0`-as-source breaks the TS program, memory `emerald-feedback-from-onyx` item 4; Bootstrap `CANON.md` states the same rule). The `#md1` alias is config-only parity for tooling. Confidence: high.

### 1.4 tsdown.config.mts

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'
import Vue from 'unplugin-vue/rolldown'

import pkg from './package.json' with { type: 'json' }

const v0 = fileURLToPath(new URL('../0/src', import.meta.url))
const md1 = fileURLToPath(new URL('src', import.meta.url))
const __VERSION__ = JSON.stringify(pkg.version)

export default defineConfig({
  plugins: [
    Vue({ isProduction: true }),
  ],
  dts: {
    vue: true,
  },
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VITE_LOGGER_ENABLED__: 'process.env.VITE_LOGGER_ENABLED',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    __VERSION__,
  },
  name: 'paper/md1',
  exports: {
    devExports: 'development',
    // scripts/bake-theme.ts writes dist/theme.css after tsdown runs, so tsdown
    // cannot discover it and prunes the entry from the regenerated exports map.
    customExports: {
      './theme.css': './dist/theme.css',
    },
  },
  alias: {
    '#v0': v0,
    '#md1': md1,
  },
})
```

Confidence: high (Emerald's file with two renames).

### 1.5 vitest.browser.config.ts

Copy `packages/bulma/vitest.browser.config.ts` verbatim except three strings (`@paper/bulma` -> `@paper/md1`, `#bulma` -> `#md1`, `name: 'md1:browser'`) and drop its Bulma-only header comment; Bootstrap's copy is the same file but is uncommitted on another worktree, so the recipe cites the committed one. The file matters for correctness, not only for names: `optimizeDeps.include: ['vue']` and `resolve.dedupe` keep one Vue copy so Atom's `useTemplateRef` does not throw; `define` evaluates `__DEV__` and `__VITE_LOGGER_ENABLED__` at config time because the browser has no `process`; `'process.env': '{}'` stubs Node-flavored deps; Playwright runs with `reducedMotion: 'reduce'`, `viewport 1280x800`, `actionTimeout 5000`, `testTimeout 20_000`, `headless: !process.env.TEST_BAIL`, `benchmark.include: []`.

```ts
alias: {
  '@paper/md1': fileURLToPath(new URL('src', import.meta.url)),
  '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
  // internal
  '#md1': fileURLToPath(new URL('src', import.meta.url)),
  '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
},
// ...
test: {
  name: 'md1:browser',
  include: ['**/*.browser.test.{ts,tsx}'],
```

Confidence: high.

### 1.6 scripts/bake-theme.ts

Copy Emerald's and apply these substitutions (all `high`):

| Emerald | Material Design 1 |
|---|---|
| `import { emeraldColors, emeraldDarkColors } from '../src/colors'` | `import { md1Colors, md1DarkColors } from '../src/colors'` |
| the `foundations()` import list from `../src/design-system` | whatever families Material Design 1's `design-system.ts` exports (the spacing/elevation/type/motion notes define them) |
| every `--emerald-` string | `--md1-` |
| `satisfies readonly (keyof typeof emeraldColors)[]` and `Record<string, keyof typeof emeraldColors>` | `md1Colors` |
| `colorBlock('[data-theme="emerald-light"]', emeraldColors)` | `colorBlock('[data-theme="md1-light"]', md1Colors)` |
| `colorBlock(':root', emeraldColors)` | `colorBlock(':root', md1Colors)` |
| `colorBlock('[data-theme="emerald-dark"]', emeraldDarkColors)` | `colorBlock('[data-theme="md1-dark"]', md1DarkColors)` |
| `'[data-theme="emerald-dark"] {\n  color-scheme: dark;\n}\n'` | `md1-dark` |
| banner `/* @paper/emerald ... */` | `/* @paper/md1 ... */` |
| `[bake-theme] emeraldColors/emeraldDarkColors key drift` | rename the message |

Output contract (high): `dist/theme.css` = foundations on `:root`, the light color block twice (`[data-theme="md1-light"]` and `:root`), the dark block on `[data-theme="md1-dark"]` only, then `:root { color-scheme: light }` and `[data-theme="md1-dark"] { color-scheme: dark }`. Every color key also emits `--md1-<key>-channels: r g b`. The bake throws on `SAFE_IDENT` / `UNSAFE_CSS` hits, on an empty block, on alias sources missing from the map, and on light/dark key drift. The `V0_ALIAS_KEYS` / `V0_REMAP_KEYS` tables must be rebuilt against Material Design 1's color keys (MD1 ships `primary`, `secondary`, `accent`, `error`, `info`, `success`, `warning` in Vuetify 1.5's theme vocabulary, so most kit roles alias directly and the remap table shrinks; the color note owns the final list). SPEC.md "The v0 bridge" fixes the emitted set, which includes `accent`, `on-accent`, `on-info`, `on-success`, `on-warning` and `border` (Genesis `GnDocsCallout` reads `--v0-accent`). Onyx replaced the "keep in lockstep" duplication with one dependency-free `src/css.ts` imported by both `adapter.ts` and the bake script (memory `emerald-feedback-from-onyx` item 2, `moderate`); either shape is acceptable, the Emerald shape is the one on disk.

### 1.7 src/adapter.ts

Emerald's class with renames. Shape (high):

```ts
export interface Md1AdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  /** When true (default), also emit `--v0-*` aliases for the color roles kits (Genesis) consume. */
  v0Aliases?: boolean
}

export class Md1StyleSheetAdapter extends V0StyleSheetThemeAdapter {
  readonly v0Aliases: boolean

  constructor (options: Md1AdapterOptions = {}) {
    // `stylesheetId` precedes the spread so callers can override it; `prefix` follows so they cannot.
    super({ stylesheetId: 'md1-theme-stylesheet', ...options, prefix: 'md1' })
    this.v0Aliases = options.v0Aliases !== false
  }

  override generate (colors: Record<string, Colors>, isDark?: boolean): string { /* Emerald body, --md1- */ }
}
```

Rules kept from Emerald: no `prefix` option (every stylesheet hardcodes `var(--md1-*)`); colors land on `[data-theme="<id>"]` only, foundations on `:root`; the runtime adapter skips sanitizer hits silently (user input), the bake throws (first-party input); `:root { color-scheme }` is emitted from the selected theme's `dark` flag; `V0_ALIAS_KEYS` is `as const satisfies readonly (keyof typeof md1Colors)[]` so a renamed token is a compile error. Validate color keys with `SAFE_IDENT` as well as values (Onyx hardening, memory item 5, `moderate`); Emerald already does both in `generate`.

### 1.8 src/plugin.ts

Emerald's file with renames (high):

```ts
export interface Md1PluginOptions {
  theme?: ThemePluginOptions | false
  icons?: Md1IconsPluginOptions | false
  /** `false` when the host installs `createReducedMotionPlugin` itself. */
  reducedMotion?: ReducedMotionPluginOptions | false
}

function md1ThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'md1-light',
    system: { light: 'md1-light', dark: 'md1-dark' },
    adapter: new Md1StyleSheetAdapter(),
    themes: {
      'md1-light': { colors: md1Colors },
      'md1-dark': { colors: md1DarkColors, dark: true },
    },
  }
}

export function createMd1Plugin (options: Md1PluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.reducedMotion !== false) app.use(createReducedMotionPlugin(options.reducedMotion))
      if (options.icons !== false) app.use(createMd1IconsPlugin(options.icons))
      if (options.theme === false) return
      // mergeThemes(defaults.themes, options.theme.themes) exactly as Emerald
      app.use(createThemePlugin(theme))
    },
  }
}
```

Keep Emerald's `mergeThemes` (per-id shallow merge with `colors` merged one level deeper) and the JSDoc that `{ icons: false }` skips install but does not shrink the bundle (ruling 6: the glyph map survives tree-shaking). Reduced motion is composed here, unlike Emerald, because `Md1Ripple` reads `useReducedMotion().isReduced`, which falls back to `false` when no plugin is installed (`packages/0/src/composables/useReducedMotion/index.ts`, `createReducedMotionFallback`); `{ reducedMotion: false }` is the escape for hosts that install the plugin themselves.

### 1.9 src/colors.ts and src/design-system.ts

| Rule | Source | Confidence |
|---|---|---|
| `md1Colors` is built with `scale(name, family)` where `DEFAULT` collapses to the family name and other keys become `<family>-<key>`; declared with `satisfies Record<string, string>` so `keyof typeof md1Colors` stays a literal union | Emerald `colors.ts` | high |
| `md1DarkColors` is `satisfies Record<keyof typeof md1Colors, string>` | Emerald `colors.ts` | high |
| Each dark family in `design-system.ts` is `as const satisfies Record<keyof typeof <lightFamily>, string>` | Emerald `design-system.ts` | high |
| Shadows (elevations) ride the per-theme color map, not only `:root` foundations, so the dark theme can override them | Emerald `colors.ts` comment | high |
| Foundations (spacing, radius, stroke, icon, shadow, motion, control, font, text scale) are emitted on `:root` by `foundations()` in both adapter and bake | Emerald adapter | high |
| v0 already ships the 2014 Material color palette as `@vuetify/v0/palettes/md1` (`TokenCollection`, families `red`, `pink`, `purple`, ... with keys `50`..`900` and `A100`..`A700`) | `packages/0/src/palettes/md1/index.ts` | high |

The md1 palette is the obvious source for Material Design 1's color ladders; whether `design-system.ts` re-exports it or copies the hex values is a decision for the color note. Do not hand-type a second copy without saying why.

### 1.10 Icons

`src/icons/glyphs.ts` is a leaf module (no imports) holding `md1Icons` (24x24 path data per role) and `md1IconAliases` (`{ mail: '{envelope}' }` brace references). `src/icons/index.ts` builds the registry with `createTokens`, wraps each glyph as `{ $value: glyph }`, exposes `createMd1Icons`, and the trinity:

```ts
export const MD1_ICONS_NAMESPACE = 'md1:icons'

export const [
  createMd1IconsContext,
  createMd1IconsPlugin,
  useMd1Icons,
] = /* @__PURE__ */ createPluginContext<Md1IconsPluginOptions, Md1IconsContext>(
  MD1_ICONS_NAMESPACE,
  options => createMd1Icons(options),
  { fallback: () => (fallback ??= createMd1Icons()) },
)
```

MD1 glyphs are the Material Icons set of the period (filled, 24x24 grid), which differs from Emerald's stroke grid; `Md1Icon` therefore renders `fill="currentColor"` paths rather than Emerald's `fill="none" stroke="currentColor"` (`moderate`: the icon note owns the drawing contract). Everything else in `EmIcon.vue` carries over: `name`, `label`, `size`, `namespace` props; `aria-hidden="true"` unless `label`; `role="img"` + `aria-label` when labelled; dev `logger.warn` and render nothing for an unknown role; `:where()` size steps so a host class wins without `!important`.

### 1.11 Root repo registration for the package

| File | Exact change | Confidence |
|---|---|---|
| `/home/john/sites/0/.claude/worktrees/quantum/tsconfig.json` | add `{ "path": "./packages/md1" }` to `references` after `./packages/emerald` | high (Bootstrap diff) |
| `/home/john/sites/0/.claude/worktrees/quantum/vitest.config.ts` | add `'packages/md1/vitest.browser.config.ts',` to `test.projects` after `'packages/paper',` | high (Bootstrap diff) |
| `/home/john/sites/0/.claude/worktrees/quantum/knip.json` | under `workspaces["apps/docs"].paths` add `"@paper/md1": ["../../packages/md1/src"]` and `"#md1": ["../../packages/md1/src"]` | high (Bootstrap diff) |
| `/home/john/sites/0/.claude/worktrees/quantum/.github/workflows/docs-deploy.yml` | add `- 'packages/md1/**'` to `on.push.paths` after `packages/genesis/**` | high |
| `/home/john/sites/0/.claude/worktrees/quantum/README.md` and `packages/0/README.md` (line 47 area) | add `\| [`@paper/md1`](./packages/md1) \| Material Design 1 design system \|` to the package table; keep both files identical | high |
| `pnpm-workspace.yaml` | nothing: `packages/*` already matches | high |
| `.github/workflows/pr-checks.yml` | nothing: `pnpm build`, `pnpm typecheck` and `vitest run --project '*:browser'` pick the package up once it is in the root configs | high |
| `.size-limit.json` | nothing (packages/0 entries only) | high |
| `eslint.config.js` | nothing unless a conformance-style assertion-less test helper is introduced (Bootstrap added its path to the `vitest/expect-expect` override) | high |
| `dev/vite.config.ts` | optional: `'@paper/md1'` and `'#md1'` aliases plus `'../packages/md1/src/components/'` in `Components.dirs`, only if a dev showcase route is built | high |
| `.changeset/md1-initial.md` | required by `scripts/changeset-required.js` for any PR touching `packages/*/src/`: frontmatter `'@paper/md1': minor`, first line `feat(md1): ...` written for the consumer | high |

### 1.12 SPEC.md contract

`DESIGN_SYSTEMS.md` "Per-package SPEC.md" requires: (1) class `design system` and purpose; (2) the pinned spec, named with a date (here: the MD1 guidelines Google hosts as an archive at m1.material.io, with the 2018-12-25 date their content was verified against, plus the Vuetify 1.5.24 cross-reference); (3) a coverage statement listing what ships and what is deliberately out (a v0 primitive existing is not a reason to ship; ruling 7); (4) the component inventory and every intentional deviation from the family contract with a reason. Emerald's `SPEC.md` sections to mirror: Identity, Purpose, Token source, Dark theme, Pipeline, Consumer contract, Compound access, per-wave surface tables (`Component | v0 primitive`), Non-goals. Confidence: high.

## 2. Component recipe

### 2.1 Folder and barrel

```
packages/md1/src/components/Md1X/
├── Md1X.vue                   # shell, or the compound root
├── Md1XPart.vue               # one file per compound region (Md1DialogTitle.vue)
├── index.ts                  # named exports, types, and the Object.assign compound
└── Md1X.browser.test.ts       # real Chromium
```

Emerald keeps every part of a compound inside the root's folder (`EmDialog/EmDialogTitle.vue`); Bootstrap gives each part its own folder (`BDialogTitle/BDialogTitle.vue`) and imports across folders in the root barrel. Use Emerald's layout. Confidence: high.

`src/components/index.ts` gets one line per folder, alphabetical:

```ts
export * from './Md1Button'
export * from './Md1Dialog'
export * from './Md1Icon'
```

The folder barrel never `export *`s from a `.vue` file (breaks Volar slot inference). Shell barrel:

```ts
export type { Md1ButtonProps, Md1ButtonSize, Md1ButtonVariant } from './Md1Button.vue'

/**
 * Primary action button. Composes v0 `Button.Root` / `Button.Content` (and `Button.Icon` when `icon` is set).
 *
 * @example
 * ```vue
 * <Md1Button variant="raised">Save</Md1Button>
 * ```
 */
export { default as Md1Button } from './Md1Button.vue'
```

Compound barrel (Emerald and Bootstrap both use `Object.assign(Root, { Part })`; the `packages/0` rule forbidding `Object.assign` is scoped to `packages/0/src/components/**` and does not apply to `@paper/*`):

```ts
export type { Md1DialogActionsProps } from './Md1DialogActions.vue'
export { default as Md1DialogActions } from './Md1DialogActions.vue'
export type { Md1DialogActivatorProps } from './Md1DialogActivator.vue'
export { default as Md1DialogActivator } from './Md1DialogActivator.vue'
export type { Md1DialogContentProps } from './Md1DialogContent.vue'
export { default as Md1DialogContent } from './Md1DialogContent.vue'
export type { Md1DialogProps, Md1DialogVariant } from './Md1Dialog.vue'
export type { Md1DialogTextProps } from './Md1DialogText.vue'
export { default as Md1DialogText } from './Md1DialogText.vue'
export type { Md1DialogTitleProps } from './Md1DialogTitle.vue'
export { default as Md1DialogTitle } from './Md1DialogTitle.vue'

// Context
import Root from './Md1Dialog.vue'
import Actions from './Md1DialogActions.vue'
import Activator from './Md1DialogActivator.vue'
import Content from './Md1DialogContent.vue'
import Text from './Md1DialogText.vue'
import Title from './Md1DialogTitle.vue'

/**
 * Modal dialog. Owns the open state its parts render against.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1DialogTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Dialog>
 *   <Md1Dialog.Activator />
 *
 *   <Md1Dialog.Content>
 *     <Md1Dialog.Title />
 *
 *     <Md1Dialog.Text />
 *
 *     <Md1Dialog.Actions />
 *   </Md1Dialog.Content>
 * </Md1Dialog>
 * ```
 */
export const Md1Dialog = Object.assign(Root, {
  /** Renderless trigger host. */
  Activator,
  /** The dialog surface itself. */
  Content,
  /** Accessible name for the dialog. */
  Title,
  /** Body copy (`Dialog.Description`). */
  Text,
  /** The action row; `Cancel` and `Confirm` (SPEC.md) go inside it. */
  Actions,
})
```

The dot key drops the parent prefix (`Md1DialogTitle` is `Md1Dialog.Title`, `Md1ListAction` is `Md1List.Action`); the root is the compound (no `.Root` key); each member carries a one-line JSDoc; member order is anatomy order. The parts are SPEC.md's (`Activator`, `Content`, `Title`, `Text`, `Actions`, plus `Cancel` and `Confirm`, which follow the `Md1DialogActions` shape and are omitted from the sample): MD1 dialogs have no close X, so there is no `Md1Dialog.Close` (a full-screen dialog closes through `Md1Toolbar.Nav icon="close"`). `perfectionist/sort-exports` is off, but the lint hook sorts the import block. Confidence: high.

### 2.2 SFC rules

| Rule | Shape | Source | Confidence |
|---|---|---|---|
| Dual script | `<script lang="ts">` holds all imports, exported prop/type interfaces, and any `createContext` trinity; `<script setup lang="ts">` holds zero imports | components.md; every Em* file | high |
| Generic roots | `<script lang="ts" setup generic="T">` (lang before setup only when `generic` is present) | `EmSelect.vue`, `EmTabs.vue` | high |
| Name | `defineOptions({ name: 'Md1X' })` first line of setup; add `inheritAttrs: false` + `useAttrs()` + `mergeProps` only when attrs must land on an inner element (`BDialog.vue`) | high |
| Props | destructure with defaults from `defineProps<Md1XProps>()`; never `withDefaults` (ESLint `no-restricted-syntax`); defaults live in the destructure, never in the interface | high |
| Prop surface | `Pick<...>` or `Omit<..., 'as' \| 'renderless'>` of the v0 props type with literal key unions; never `keyof`-computed sets (the SFC compiler fails to resolve them while `vue-tsc` passes) | memory `emerald-prop-type-gates` | moderate |
| Spec-only API | no `density`, `ripple` prop that is Vuetify-shaped, `to`, named slots, or `#prepend`; MD1 features are props or parts | DESIGN_SYSTEMS.md rulings 7 and 8 | high |
| Slots | default slot only; `defineSlots<{ default?: () => any }>()` (the `=> any` is the one sanctioned `any`); parts replace named slots | Bootstrap `BButton.vue`; components.md | high |
| Models | `defineModel<boolean>()`; add the explicit `defineEmits<{ 'update:model-value': [value: boolean] }>()` when devtools event tracking matters (Bootstrap does, Emerald does not) | high |
| Data hooks | booleans are `true \| undefined`: `:data-disabled="toValue(disabled) \|\| undefined"`; enums are strings: `:data-variant="variant"`, `:data-size="size"` | EmButton, EmCard, EmTextField | high |
| Reactive props | wrap `MaybeRefOrGetter` props in `toValue()` at every truthy use site (refs are always truthy); pass-throughs to v0 components resolve internally | EmTextField, EmCheckbox, EmSlider | high |
| Class prefix | root `md1-<component>`, parts `md1-<component>__<part>`, state via `[data-*]` selectors, never computed class lists | ruling 3 | high |
| Styles | one unscoped `<style>` per SFC; never `scoped` (#359); every design value is `var(--md1-<token>, <literal>)`; literals appear only as fallbacks. Token names are SPEC.md "Theme and tokens" (`--md1-font-family`, `--md1-type-<style>-size/-weight/-leading/-tracking/-transform`, `--md1-duration-*`, `--md1-easing-*`, `--md1-text-*`, `--md1-radius`, `--md1-spacing-1..5`, `--md1-elevation-0..24`); there are no component-scoped tokens (`--md1-button-*` does not exist), so a value with no token (button height 36px) is a bare literal | ruling 1 and 3; SPEC.md | high |
| No utilities | no UnoCSS or Tailwind classes in package source; structural inline `:style` only when layout cannot work otherwise | ruling 3; memory `feedback_headless_no_utility_classes` | high |
| Glyphs | every glyph draws through `Md1Icon`; no inline glyph `<svg>` in an `Md1*` component. The only inline SVG is non-glyph geometry parameterised at runtime (the `Md1ProgressCircular` arc, the `Md1TimePicker` clock), a deviation SPEC.md declares | ruling 6; `EmDialogClose.vue`; SPEC.md Deviations | high |
| Native controls | never compose native form controls (`<select>`, `<input type=checkbox>`); compose v0 (`Checkbox.Root`, `Select.Root`, `Input.Root`) | ruling 2; memory `feedback_v0_components_no_native_html` | high |
| Layout-only parts | plain element + `<slot />` with no v0 wrapper (`EmDialogFooter.vue`, `EmCardHeader.vue`) | high |
| Type guards | `isString`, `isUndefined`, `isNullOrUndefined` from `@vuetify/v0`; the raw comparison lint selectors are scoped to `packages/0`, the house rule applies everywhere | `~/.claude/rules/style.md` | high |
| Naming | single-word locals, `index` not `idx`, `on<Action>` handlers, `_name` prefix on the raw prop when a resolved value supersedes it (`id: _id` then `const id = _id ?? fallbackId`) | EmTextField, implementation.md | high |
| Reactivity | `shallowRef` for primitives, `toRef(() => ...)` for derived values, `computed` only when caching is worth it, `useTemplateRef` for refs | style.md | high |
| Element refs between parts | registry registration (`context.register({ id, value, el })`), never a `watchEffect` push into a parent ref | memory `feedback_registry_element_refs`; `BTabsItem.vue` | high |
| Optional parent context | `createContext<Md1XContext \| null>('md1:x', null)`; a part reads it with `useMd1X()` and calls `orphan(part, parent, context)`, a Material Design 1 utility (`src/utilities/context.ts`) that calls `useLogger().warn(`[${part}] rendered outside <${parent}>; its state is inert`)` once in dev (Emerald's `EmIcon` logging precedent, not Bootstrap's `console.warn`); parts backed by a v0 context throw instead | Bootstrap `src/utilities/context.ts` (shape), `EmIcon.vue` (channel) | high |
| Cleanup | `onBeforeUnmount`, never `onUnmounted` | components.md | high |
| Locale copy | `locale.ti('Dialog.close') ?? 'Close'` always with the inline English fallback | `BDialogClose.vue`; eslint rule on packages/0 | high |
| Comments | explain why, never what; JSDoc on exported API | implementation.md | high |

### 2.3 Complete minimal shell: Md1Button

Adapted from `EmButton.vue` and cut to the SPEC.md surface: no `loading` (MD1 buttons have no loading state; progress is an `Md1ProgressCircular` beside the button, ruling 7), and the spec's own forms as props (`dense`, `footer`, `icon`). Literals in the stylesheet are listed in the table under the sample with their source.

```vue
<script lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'

  // Types
  import type { ButtonRootProps } from '@vuetify/v0'

  export type Md1ButtonVariant = 'flat' | 'raised'

  /**
   * Material Design 1 withholds `loading`, `readonly`, `passive`, `grace`, `value`,
   * `groupNamespace` and `form` from v0's button props: MD1 buttons have no
   * loading state (SPEC.md, ruling 7), and group composition and form
   * association are not part of the MD1 button surface.
   */
  export interface Md1ButtonProps extends Pick<
    ButtonRootProps,
    'disabled' | 'ariaLabel' | 'name' | 'namespace'
  > {
    variant?: Md1ButtonVariant
    /** 32 dp, 13 sp: the desktop dense button. */
    dense?: boolean
    /** The persistent footer button: 48 dp flat, full width, no radius. */
    footer?: boolean
    /** A glyph role drawn through Md1Icon before the label; icon-only without slot content. */
    icon?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Button' })

  defineSlots<{
    /** The label. */
    default?: () => any
  }>()

  const {
    disabled = false,
    variant = 'flat',
    dense = false,
    footer = false,
    icon,
    ariaLabel,
    name,
    namespace,
  } = defineProps<Md1ButtonProps>()
</script>

<template>
  <Button.Root
    :aria-label
    class="md1-button"
    :data-dense="dense || undefined"
    :data-footer="footer || undefined"
    :data-variant="variant"
    :disabled
    :name
    :namespace
  >
    <Button.Icon v-if="icon" class="md1-button__icon" :namespace>
      <Md1Icon :name="icon" />
    </Button.Icon>

    <Button.Content class="md1-button__content" :namespace>
      <slot />
    </Button.Content>
  </Button.Root>
</template>

<!-- Unscoped: Button.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  .md1-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 36px;
    min-width: 88px;
    padding: 0 16px;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-button-size, 14px);
    font-weight: var(--md1-type-button-weight, 500);
    letter-spacing: var(--md1-type-button-tracking, 0.01em);
    text-transform: var(--md1-type-button-transform, uppercase);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-button[data-variant='flat'] {
    background: transparent;
    color: var(--md1-accent, #FF4081);
  }

  .md1-button[data-variant='raised'] {
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-button:focus-visible {
    outline: none;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-button[data-disabled] {
    color: var(--md1-button-disabled-text, rgba(0, 0, 0, 0.26));
    cursor: not-allowed;
    pointer-events: none;
  }

  .md1-button[data-variant='raised'][data-disabled] {
    background: var(--md1-button-disabled, rgba(0, 0, 0, 0.12));
    box-shadow: none;
  }

  .md1-button[data-dense] {
    height: 32px;
    font-size: 13px;
  }

  .md1-button[data-footer] {
    width: 100%;
    height: 48px;
    border-radius: 0;
  }

  /* Icon-only: Button.Root sets data-solo when Button.Icon is the only child. */
  .md1-button[data-solo] {
    width: 48px;
    min-width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
  }

  .md1-button__icon {
    display: inline-flex;
    margin-inline-end: var(--md1-spacing-1, 8px);
  }

  .md1-button[data-solo] .md1-button__icon {
    margin: 0;
  }

  .md1-button__content {
    display: inline-flex;
    align-items: center;
  }
</style>
```

Literals used above (the token notes and SPEC.md are the authority; replace on conflict):

| Literal | Unit | Source | Confidence |
|---|---|---|---|
| height `36px`, min-width `88px`, padding `0 16px`, radius `2px` | px | buttons page (36 dp tall, 88 dp minimum width, 2 dp radius, 16 dp padding), `spec/components/buttons.md`; SPEC.md Md1Button. No height, width or padding token exists, so these are bare literals; the radius is `--md1-radius` | high |
| dense `32px` / `13px`; footer `48px`; solo `48px` | px | buttons page (dense button, persistent footer button, 48 dp icon target), SPEC.md Md1Button | high |
| font-size `14px`, weight `500`, `uppercase`, tracking `0.01em` | px / weight / em | typography page Button style (14 sp Medium, all caps, tracking 10), `spec/typography.md`; the tracking unit (1/1000 em) is `low` | high (size, weight, case); low (tracking unit) |
| transition `300ms`, `cubic-bezier(0.4, 0, 0.2, 1)` | ms | motion page standard duration and curve, `spec/motion.md` | high |
| `#FF4081` accent, `#3F51B5` primary, `#FFFFFF` on-primary | hex | SPEC.md Roles (Pink A200, Indigo 500, white), `spec/color.md` | high |
| focus `rgba(0, 0, 0, 0.12)`; disabled text `0.26`; disabled raised fill `0.12` | alpha | buttons page, SPEC.md Ink and state | high |
| elevation-2 triplet | px | `spec/elevation.md` (Vuetify 1.5 `_elevations.styl` recipe; the spec gives dp only) | moderate |
| icon gap `8px` | px | `--md1-spacing-1`; the icon-to-label gap is not stated on the buttons page | low |
| variant names `flat` / `raised` | none | buttons page (flat and raised; the floating action button is `Md1Fab`), SPEC.md | high |

### 2.4 Complete compound: Md1Dialog

Adapted from `EmDialog/*` and cut to SPEC.md's parts (`Activator`, `Content`, `Title`, `Text`, `Actions`; `Cancel` and `Confirm` follow the `Actions` shape and are omitted here). MD1 dialogs have no close X, so there is no `Md1DialogClose.vue`. Six files plus the barrel in 2.1. The sample shows the `Dialog.*` path; `variant="alert"` swaps in `AlertDialog.*` with the same parts.

`Md1Dialog.vue` (renderless root; owns `v-model` and the `md1:dialog` context):

```vue
<script lang="ts">
  // Framework
  import { createContext, Dialog } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogRootProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export type Md1DialogVariant = 'alert' | 'simple' | 'confirmation' | 'full-screen'

  export interface Md1DialogContext {
    variant: Readonly<Ref<Md1DialogVariant>>
    dismissible: Readonly<Ref<boolean>>
  }

  export interface Md1DialogProps extends Omit<DialogRootProps, 'as' | 'renderless'> {
    variant?: Md1DialogVariant
    /** `false` disables outside click and Escape so an action must be chosen (dialogs page). */
    dismissible?: boolean
  }

  export const [useMd1Dialog, provideMd1Dialog] = createContext<Md1DialogContext | null>('md1:dialog', null)
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Dialog' })

  defineSlots<{
    /** Activator, content, and the parts inside it. */
    default?: () => any
  }>()

  const { id, namespace, variant = 'alert', dismissible = true } = defineProps<Md1DialogProps>()

  const model = defineModel<boolean>()

  provideMd1Dialog({
    variant: toRef(() => variant),
    dismissible: toRef(() => dismissible),
  })
</script>

<template>
  <Dialog.Root :id v-model="model" :namespace>
    <slot />
  </Dialog.Root>
</template>
```

`Md1DialogActivator.vue` (slot host; `renderless` lets an `Md1Button` be the trigger without nesting buttons):

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogActivatorProps } from '@vuetify/v0'

  export interface Md1DialogActivatorProps extends Omit<DialogActivatorProps, 'as'> {
    /** When true, bind the slot `attrs` onto your own trigger (an Md1Button). */
    renderless?: DialogActivatorProps['renderless']
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogActivator' })

  const { renderless = false, namespace } = defineProps<Md1DialogActivatorProps>()
</script>

<template>
  <Dialog.Activator v-slot="slotProps" class="md1-dialog__activator" :namespace :renderless>
    <slot v-bind="slotProps" />
  </Dialog.Activator>
</template>
```

`Md1DialogContent.vue` (the native `<dialog>`; `Dialog.Content` renders it, the browser traps focus and paints `::backdrop`; `scrim: false` on every `Dialog.Content` Material Design 1 renders, #910; Escape is the native `cancel` event, prevented while not dismissible because `Dialog.Content` has no `closeOnEscape` prop):

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Context
  import { useMd1Dialog } from './Md1Dialog.vue'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Types
  import type { DialogContentProps } from '@vuetify/v0'

  export interface Md1DialogContentProps extends Pick<DialogContentProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogContent' })

  defineSlots<{
    /** Title, text, actions. */
    default?: () => any
  }>()

  const { namespace } = defineProps<Md1DialogContentProps>()

  const context = useMd1Dialog()

  orphan('Md1DialogContent', 'Md1Dialog', context)

  const dismissible = toRef(() => context?.dismissible.value ?? true)

  function onCancel (e: Event) {
    if (!dismissible.value) e.preventDefault()
  }
</script>

<template>
  <Dialog.Content
    class="md1-dialog"
    :close-on-click-outside="dismissible"
    :data-dismissible="dismissible || undefined"
    :data-variant="context?.variant.value"
    :namespace
    :scrim="false"
    @cancel="onCancel"
  >
    <div class="md1-dialog__sheet">
      <slot />
    </div>
  </Dialog.Content>
</template>

<style>
  .md1-dialog {
    padding: 0;
    margin: auto;
    border: none;
    background: transparent;
    max-width: calc(100vw - 80px);
    max-height: calc(100vh - 48px);
    overflow: visible;
  }

  /* Native backdrop: Material Design 1 never mounts v0 Scrim (#910). */
  .md1-dialog::backdrop {
    background: var(--md1-scrim, rgba(33, 33, 33, 0.46));
  }

  .md1-dialog__sheet {
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: 280px;
    max-width: 560px;
    padding: var(--md1-spacing-3, 24px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-24, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
    overflow-x: clip;
    overflow-y: auto;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
```

`Md1DialogTitle.vue`:

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogTitleProps } from '@vuetify/v0'

  export interface Md1DialogTitleProps extends Omit<DialogTitleProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogTitle' })

  const { namespace } = defineProps<Md1DialogTitleProps>()
</script>

<template>
  <Dialog.Title class="md1-dialog__title" :namespace>
    <slot />
  </Dialog.Title>
</template>

<style>
  .md1-dialog__title {
    margin: 0 0 20px;
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: 28px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
```

`Md1DialogText.vue` (on `Dialog.Description`, which supplies `aria-describedby`):

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogDescriptionProps } from '@vuetify/v0'

  export interface Md1DialogTextProps extends Omit<DialogDescriptionProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogText' })

  const { namespace } = defineProps<Md1DialogTextProps>()
</script>

<template>
  <Dialog.Description class="md1-dialog__text" :namespace>
    <slot />
  </Dialog.Description>
</template>

<style>
  .md1-dialog__text {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    font-weight: var(--md1-type-body-1-weight, 400);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
```

`Md1DialogActions.vue` (layout-only part; the full implementation sets `stacked` from the measured label widths, SPEC.md, and the sample takes it as a prop):

```vue
<script lang="ts">
  export interface Md1DialogActionsProps {
    /** Full-width buttons stacked affirmative above dismissive. */
    stacked?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogActions' })

  defineSlots<{
    /** The consumer's Md1Buttons, dismissive before affirmative. */
    default?: () => any
  }>()

  const { stacked = false } = defineProps<Md1DialogActionsProps>()
</script>

<template>
  <div class="md1-dialog__actions" :data-stacked="stacked || undefined">
    <slot />
  </div>
</template>

<style>
  .md1-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    min-height: 52px;
    padding: var(--md1-spacing-1, 8px);
    margin: var(--md1-spacing-3, 24px) calc(-1 * var(--md1-spacing-3, 24px)) calc(-1 * var(--md1-spacing-3, 24px));
  }

  .md1-dialog__actions[data-stacked] {
    flex-direction: column;
    align-items: stretch;
  }
</style>
```

Literals in the dialog sample:

| Literal | Unit | Source | Confidence |
|---|---|---|---|
| `calc(100vw - 80px)`, `calc(100vh - 48px)` | px | dialogs page: at least 40 dp from the side edges and 24 dp top and bottom | high |
| min-width `280px`; max-width `560px` | px | dialogs page minimum 280 dp (5 units of 56); the desktop maximum (10 units) is a SPEC.md decision | high / low |
| scrim `rgba(33, 33, 33, 0.46)` | alpha | SPEC.md `--md1-scrim`, Lead decision 2 (Vuetify 1.5 `_overlay.styl`; the bottom-sheets page's black 20% is `--md1-scrim-sheet`) | moderate |
| text `rgba(0, 0, 0, 0.87)`, secondary `0.54` | alpha | colour page | high |
| title `20px / 500`, line-height `28px`, `20px` below | px | dialogs page (Medium 20 sp, 28 dp line height, 20 dp to the text) | high |
| body `14px / 400 / 20px` | px | typography page Body 1; Body 1 as the dialog body style is a SPEC.md decision | high (metrics) / low (choice) |
| padding `24px`; actions `52px`, `8px` | px | dialogs page | high |
| radius `2px` | px | `--md1-radius`; cards and dialogs say "rounded corners" only (Vuetify 2 px) | moderate |
| elevation-24 triplet | px | `spec/elevation.md` (Vuetify 1.5 `_elevations.styl` recipe) | moderate |

Composition facts the sample relies on (all `high`, from `EmDialog*` and v0 rules): `Dialog.Root` is renderless and owns the model; `Dialog.Content` renders the `<dialog>` and calls `showModal()`, takes `closeOnClickOutside`, `blocking` and `scrim` (no `closeOnEscape`: Escape is the native `cancel` event) and emits `cancel` and `close`; `Dialog.Title` and `Dialog.Description` supply `aria-labelledby` / `aria-describedby`; `Dialog.Close` always sets `aria-label` from the locale, so slot text does not rename it (SPEC.md renders `Md1Dialog.Cancel` on it outside the `alert` variant); `Dialog.Activator` with `renderless` exposes `attrs` (`type`, `role`, `tabindex`, `aria-haspopup`, `aria-expanded`, `data-open`, `onClick`, `onKeydown`) to spread on an `Md1Button`; `v-bind="attrs"` is legal only on that renderless path (double-fire hazard otherwise); a dialog needs `createStackPlugin()` installed in tests.

### 2.5 Presentational parts

`EmCard.vue` is the model: `<Atom as="div" class="md1-card" :data-variant="variant" :data-hoverable="hoverable || undefined">` with a single unscoped stylesheet on the root file that also styles the part classes (`.md1-card__title`), while `Md1CardTitle.vue` is three lines (`defineOptions`, a `<div class="md1-card__title"><slot /></div>`). Confidence: high.

### 2.6 DS-owned context (when v0 has no primitive)

`EmCalendar/context.ts` shows the shape: `export const [useMd1XContext, provideMd1XContext] = createContext<Md1XContext>()`, a `MD1_X_NAMESPACE = 'md1:x'` constant, parts that default `namespace = MD1_X_NAMESPACE` and read `const context = useMd1XContext(namespace)`, readonly refs on the context (`Readonly<Ref<T>>`), and functions (`select`, `prev`, `next`) that the parts call from their own event handlers (composables never bind DOM events). Confidence: high.

### 2.7 Import groups the lint hook enforces

`perfectionist/sort-imports` with `commentAbove` headers; the PostToolUse hook (`~/.claude/hooks/lint-fix.sh`, runs `npx eslint --fix` from the nearest `eslint.config.js`) inserts them, so author in this order to avoid churn:

```
// Framework      @vuetify/v0 value imports
// Components     ../Md1Icon/Md1Icon.vue and anything under /components/
// Context        ./Md1X.vue sibling imports
// Composables    /composables/ or /useX
// Adapters       /adapters
// Transformers   /toX
// Utilities      vue, @vue/*, /utilities, /helpers
// Types          import type ...
```

Type imports go last under `// Types` regardless of source. `vue/block-order` is `script, template, style`. `vue/v-bind-style` is shorthand with `sameNameShorthand: 'always'`: write `:disabled`, not `:disabled="disabled"`. `func-style: declaration` and `one-var: never` apply to package code. Confidence: high (`eslint.config.js`).

## 3. Test recipe

### 3.1 How the exemplars test

| Aspect | Emerald (`EmIcon.test.ts`, `EmSnackbar.test.ts`, `EmCalendar.test.ts`) | Bootstrap (`BDialog.browser.test.ts`, `BButton`, `BTabs`, `BMenu`) | Confidence |
|---|---|---|---|
| Runner | happy-dom, `vitest.config.ts`, project `emerald`, files `*.test.ts` named after the component | real Chromium, `vitest.browser.config.ts`, project `bootstrap:browser`, files `*.browser.test.ts` | high |
| Imports | `import { afterEach, describe, expect, it, vi } from 'vitest'`; `createApp, h` from `vue`; the SFC default import for props typing | same plus `import { userEvent } from 'vitest/browser'`; components through `./index` (the compound) | high |
| Mount | `function mount (props) { const host = document.createElement('div'); document.body.append(host); const app = createApp({ render: () => h(EmX, props, { default: () => 'Message' }) }); apps.push(app); app.mount(host); return host }` | same shape with a `teardowns` array of `() => { app.unmount(); host.remove() }`; `app.use(createStackPlugin())` for the dialog | high |
| Teardown | `afterEach`: unmount every app, `document.body.innerHTML = ''`, `vi.restoreAllMocks()` | `afterEach`: pop and run every teardown; the dialog test also strips `dialog-open` from `<html>` | high |
| Settling | `await nextTick()` | `async function settle () { await nextTick(); await nextTick() }` after every mount and interaction | high |
| Plugins | `app.use(createEmeraldPlugin({ theme: false, ...options }))` to exercise icon overrides; `createEmeraldIconsPlugin` and `createEmeraldIconsContext` directly | `createStackPlugin()` only | high |
| v-model | not exercised | `shallowRef` + `'modelValue': open.value` + `'onUpdate:modelValue': value => { open.value = value }` in the render function | high |
| Interaction | none (attribute reads) | `await userEvent.click(el)`, `await userEvent.keyboard('{Escape}')`, `'{ArrowRight}'`, `'{ArrowDown}'`; `element.dispatchEvent(new MouseEvent('click', { bubbles: true }))` for a backdrop hit; `trigger.focus()` then assert `document.activeElement` | high |
| Assertions | `getAttribute('role')`, `dataset.size`, `[...querySelectorAll('path')].map(p => p.getAttribute('d'))`, `hasAttribute('aria-hidden')`, 42 `.emerald-calendar__cell`s, `aria-current="date"` | `classList.contains('active')`, `getAttribute('aria-selected')`, `element.open`, `element.disabled`, `hasAttribute('aria-disabled')`, `getAttribute('tabindex')`, `document.activeElement`, `Object.hasOwn(el.dataset, 'bsToggle') === false`, `conform(el, 'dialog:basic', { ignoreAttrs: ['open', 'style'] })` | high |
| Warnings | `using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})` then `expect(warn).toHaveBeenCalledTimes(1)` and `toHaveBeenCalledWith(expect.stringContaining('nope'))` | same `using spy` form for orphan parts: `using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})` then `expect(spy).toHaveBeenCalledTimes(1)` and `toHaveBeenCalledWith(expect.stringContaining('Md1XPart'))` (Material Design 1's `orphan()` logs one string through `useLogger().warn`, so no `expect.anything()` padding) | high |
| Fake time | `vi.useFakeTimers()` + `vi.setSystemTime(new Date(2026, 7, 4))` for calendar geometry | none | high |

`vitest/browser` also exports `page` (locators, `page.getByRole`); none of the Bootstrap tests use it, and `userEvent` plus DOM queries cover the surface. The `conform()` harness is compat-only (markup diff against upstream fixtures) and does not transfer to Material Design 1.

### 3.2 Template: Md1Button.browser.test.ts

```ts
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { Md1Button } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('md1Button', () => {
  it('should render a native button with the variant hook', async () => {
    const host = mount(() => h(Md1Button, { variant: 'raised' }, () => 'Save'))
    await settle()

    const button = host.querySelector('button')!

    expect(button.classList.contains('md1-button')).toBe(true)
    expect(button.dataset.variant).toBe('raised')
    expect(button.textContent?.trim()).toBe('Save')
  })

  it('should disable natively and expose data-disabled', async () => {
    const host = mount(() => h(Md1Button, { disabled: true }, () => 'Stop'))
    await settle()

    const button = host.querySelector('button')!

    expect(button.disabled).toBe(true)
    expect(Object.hasOwn(button.dataset, 'disabled')).toBe(true)
    expect(button.getAttribute('aria-disabled')).toBe('true')
  })

  it('should expose data-dense and data-footer', async () => {
    let clicks = 0
    const host = mount(() => h(Md1Button, { dense: true, footer: true, onClick: () => clicks++ }, () => 'Save'))
    await settle()

    const button = host.querySelector('button')!

    expect(Object.hasOwn(button.dataset, 'dense')).toBe(true)
    expect(Object.hasOwn(button.dataset, 'footer')).toBe(true)
    expect(Object.hasOwn(button.dataset, 'loading')).toBe(false)

    await userEvent.click(button)

    expect(clicks).toBe(1)
  })

  it('should name an icon-only button from ariaLabel', async () => {
    const host = mount(() => h(Md1Button, { ariaLabel: 'Close' }))
    await settle()

    expect(host.querySelector('button')!.getAttribute('aria-label')).toBe('Close')
  })
})
```

The `data-loading` assertion is negative on purpose: `Md1Button` withholds `loading` (SPEC.md Md1Button, ruling 7), so the hook must never appear. Confidence for the template shape: high.

Compound tests add `app.use(createStackPlugin())` for dialogs, drive `open` through the model object, and assert `dialog.open`, `aria-labelledby === title.id`, Escape closes, focus returns to the trigger (`BDialog.browser.test.ts` does all four). Keyboard flows in tabs: click the first tab, `{ArrowRight}`, then assert the model and `aria-selected`.

### 3.3 What to assert, by component kind

| Kind | Assert | Confidence |
|---|---|---|
| Shell | root tag, `md1-*` class, every `data-*` hook for every prop value, native `disabled` plus `aria-disabled="true"` and `tabindex="-1"` (v0 `Button.Root` emits all three; `aria-disabled` is a boolean string in both states), `aria-label` passthrough | high |
| Compound | the root context reaches every part (no orphan warning when nested, one warning when not), `aria-*` relationships (`aria-labelledby`, `aria-controls`, `aria-selected`), roving tabindex (`tabindex` 0 on exactly one item), keyboard map, model round trip | high |
| Overlay | `element.open`, `::backdrop` click behavior, Escape, focus return, `createStackPlugin` installed | high |
| Icon | path data equals the registry glyph, alias resolution, override through the plugin, `aria-hidden` default, `role="img"` with `label`, warn once and render nothing for an unknown role (copy `EmIcon.test.ts`) | high |

### 3.4 Running tests

| Goal | Command (absolute paths, cwd-immune) | Confidence |
|---|---|---|
| One file | `pnpm --dir=/home/john/sites/0/.claude/worktrees/quantum/packages/md1 exec vitest run --config vitest.browser.config.ts src/components/Md1Button/Md1Button.browser.test.ts` | high (verified `pnpm --dir=... exec vitest --version` on pnpm 11.16.0) |
| Same, the `-C` spelling the assignment quotes | `pnpm -C /home/john/sites/0/.claude/worktrees/quantum/packages/md1 vitest run --config vitest.browser.config.ts <file>` works on pnpm 11.16.0 too (`pnpm -C <dir> exec vitest --version` returned 4.1.11); memory `enterworktree-moves-subagent-shells` reports `-C` failing under pnpm 10/11 in some shells, so prefer `--dir=` | high / low |
| Whole package | `pnpm --filter @paper/md1 test:browser` from the worktree root | high |
| Through the root project list | `pnpm exec vitest run --project md1:browser` from `/home/john/sites/0/.claude/worktrees/quantum` once `vitest.config.ts` lists the config | high |
| Headed, bail on first | `TEST_BAIL=1 pnpm --filter @paper/md1 test:browser` (`headless: !process.env.TEST_BAIL`) | high |
| Browser binary | `pnpm exec playwright install chromium` (CI also runs `install-deps chromium`); Playwright 1.62.1 is already installed on this machine | high |

Vitest prints `RUN v4.1.11 <root>` first; confirm the root is the md1 worktree before trusting a green (memory `enterworktree-moves-subagent-shells`).

### 3.5 Lint rules on test files (`**/*.test.ts` matches `*.browser.test.ts`)

`it('should ...')` only (`vitest/consistent-test-it`), lowercase first letter in `describe` titles (`describe('md1Button')`, the rule autofixes `Md1Button` to `md1Button`), hooks on top and in order, at most three nested `describe`s, `toHaveBeenCalledTimes(1)` never `toHaveBeenCalledOnce()`, `any` allowed in tests. Zero stderr output: capture expected warnings with `using spy = vi.spyOn(console, 'warn')` and assert on them. Confidence: high.

## 4. Docs recipe

### 4.1 Page frontmatter

Fields the build reads (`apps/docs/build/frontmatter.ts`): `title`, `meta[description]`, `features.{category,label,order,hidden,level,emphasized,devmode}`, `related`. `DocsPageFeatures.vue` reads `features.{github,label,level,renderless}`. `generate-nav.ts` sorts pages by `features.order` (default 999) then name, strips the `C: ` prefix from `label` for the sidebar, and lists `systems` subfolders in `SUBCATEGORY_ORDER.systems`. Confidence: high.

```yaml
---
title: Md1Button - Material Design 1 Button for Vue
meta:
- name: description
  content: The Material Design 1 button in flat and raised variants, with dense and persistent-footer forms. Built on Vuetify0's Button.
- name: keywords
  content: md1 button, material design 1 button, vue button, vuetify0 button, paper md1
features:
  category: Component
  label: 'C: Md1Button'
  level: 2
  renderless: false
  order: 1
related:
  - /systems/md1
  - /systems/md1/icon
  - /components/actions/button
---
```

| Field | Value | Source | Confidence |
|---|---|---|---|
| `title` | `Md1X - Material Design 1 <Name> for Vue` | Emerald `EmButton - Emerald Button for Vue` | high |
| `meta` list indent | column 0 (`- name:`), as every Emerald and Bootstrap page is written and as `docs.md` states; the memory note `feedback_docs_formatting` says two spaces, which contradicts the files on disk | high for the files; contradiction flagged |
| `features.category` | `Component` (pages), `Guide` (index) | Emerald, Bootstrap | high |
| `features.label` | `'C: Md1X'`; index `'Material Design 1'` | high |
| `features.level` | `2` on every systems page read | high |
| `features.renderless` | `false` for shells and for compounds whose root renders an element; `true` only when the root renders nothing (`BTabs`); `EmTabs` says `false` because its root renders a wrapper `div` | high |
| `features.order` | Emerald numbers pages 0 (index), 1 button, 2 text-field, 3 select, 4 dialog ... 29 tooltip; Bootstrap uses `group:` (`overlay`, `disclosure`, `forms`, `content`, `layout`) instead | high |
| `features.group` | parsed only on the `bootstrap-v6` branch (uncommitted `frontmatter.ts` + `generate-nav.ts` + `stores/app.ts` + `utilities/nav.ts` + `useNavNested.ts` + `AppNav.vue` + `AppNavLink.vue` changes); the md1 worktree does not have it, so use `order:` unless that nav work is ported first | high |
| `features.github` | not set on any systems page (the badge links into `packages/0/src/`) | high |
| `related` | the system index first, sibling pages, then the v0 page the component composes | high |

### 4.2 Page body skeleton

Section order for `pages/systems/**` (docs.md "Systems pages use their own section skeleton"): H1, `<DocsPageFeatures :frontmatter />`, lead, Usage, Anatomy, Composed on Vuetify0, Examples, Props, Accessibility. Emerald writes the lead after `<DocsPageFeatures>`; Bootstrap writes it before and adds a `> [!NOTE]` with the upstream reference link. Use the Emerald order plus the Bootstrap reference note (the pinned MD1 page for the component is the equivalent of Bootstrap's upstream link). Headings: Emerald titles the composition section `## Composed on Vuetify0`, Bootstrap `## Composed on v0`; use `Composed on Vuetify0`.

```markdown
# Md1Button

<DocsPageFeatures :frontmatter />

Flat and raised variants, a dense form for desktop, and the persistent footer button.

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](<https://m1.material.io/ page for this component>). Specification and visuals. This page is Vue.

## Usage

`Md1Button` is a shell component: fixed anatomy, props for everything, and the default slot is the label.

::: ds-example
/systems/md1/button/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <Md1Button />
</template>
```

## Composed on Vuetify0

`Md1Button` renders v0's [Button](/components/actions/button) compound, `Button.Root` and `Button.Content` (`Button.Icon` when `icon` is set), and adds nothing to its behavior. `Button.Root` emits the `data-disabled` and `data-solo` attributes Material Design 1's stylesheet hangs off; `data-dense` and `data-footer` are Material Design 1's own.

## Examples

::: ds-example
/systems/md1/button/variants

### Flat, raised and footer

Multi-paragraph prose: what the example demonstrates, when to reach for it, the tradeoffs, related parts.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Button.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'flat' \| 'raised'` | `'flat'` | ... |
| `dense` | `boolean` | `false` | 32 dp, 13 sp: the desktop dense button |
| `footer` | `boolean` | `false` | The persistent footer button: 48 dp flat, full width, no radius |
| `icon` | `string` | | Glyph role drawn before the label; icon-only without slot content |
| `disabled` | `boolean` | `false` | ... |
| `ariaLabel` | `string` | | Accessible name. Required for icon-only buttons |
| `name` | `string` | | Form field name; renders a hidden input when set |
| `namespace` | `string` | | The context key `Button.Root` provides to its parts; the shell forwards it to `Button.Icon` and `Button.Content`. Leave it unset unless a surrounding v0 `Button` context must not collide with this one |

The default slot is the label. There are no named slots.

## Accessibility

Native `<button>`, Enter and Space, `disabled` removes it from the tab order; icon-only buttons require `ariaLabel`. Keyboard tables use `| Key | Behavior |`.
```

Compound pages add a `### Parts` table under Props (`| Part | Props | Notes |`, Emerald) or `| Part | Renders | Notes |` (Bootstrap), and an Anatomy fence with the bare tree (root plus one of each named child, no props, blank line between siblings). Prose rules that apply here (docs.md): intro is one or two user-facing sentences and never names internal composables; no backticks inside headings or link text; `vue` fences wrap markup in `<template>`; footnotes are `[^kebab-name]`; prose under `## Examples` is multi-paragraph, prose under `## Usage` is terse. Confidence: high.

### 4.3 The ds-example container

Registered in `apps/docs/build/markdown.ts` line 161 as `registerExampleContainer('ds-example', 'DocsSystemExample')`; `gn-example` is the same machinery emitting `DocsGenesisExample`. Syntax (high):

```markdown
::: ds-example            <- modifiers: `collapse`, `no-resize`
/systems/md1/dialog/basic
:::
```

| Rule | Detail | Confidence |
|---|---|---|
| Path to file | `/systems/md1/<component>/<example>` resolves to `apps/docs/src/examples/systems/md1/<component>/<example>.vue`; `useExamples` globs `@/examples/**/*.vue` eagerly and matches the key by suffix, so the path has no extension | high |
| One file only | the sandbox entry mounts one component, so systems blocks never list two files (docs.md "Systems exception") | high |
| Heading and prose | lines after the path, starting with `### Title`, become the description slot; Bootstrap puts the title and prose inside the block under `## Examples`, Emerald does the same | high |
| Props produced | `filePath`, `title`, `collapse`, `peek` (no inline description = peek), `disableResize` (`no-resize`, used by the Bootstrap index overview) | high |
| Rendering path | `DocsSystemExample.vue` decides by the second path segment: `emerald` renders inline inside `DocsGenesisExample` with `:theme="emerald-light \| emerald-dark"`; every other system is an `<iframe src="/sandbox/<system>.html?e=<component>/<example>&theme=light\|dark">` | high |
| Inline theme | `GnDocsExamplePreview` applies `data-theme="<name>"` to the preview panel, which is what scopes the DS color block to the example | high |

### 4.4 Example file conventions

| Rule | Detail | Confidence |
|---|---|---|
| Script | `<script setup lang="ts">` first; import components from `@paper/md1` (never `@vuetify/v0` unless a utility the DS does not re-export); `shallowRef` for primitives | high |
| Layout wrapper | a dedicated class per layout: Emerald uses `emerald-docs-row` (56 uses), `emerald-docs-stack` (83), `emerald-docs-note`, `emerald-docs-caption`, `emerald-docs-card`; Material Design 1 uses `md1-docs-row` / `md1-docs-stack` / `md1-docs-note` | high |
| Example CSS | one unscoped `<style>` per example repeating the wrapper rule (every Emerald example redeclares `.emerald-docs-row`); gap and type come from `var(--md1-*, literal)`; no element-descendant selectors under a shared class because example CSS is document-global (`.md1-docs-row span` would paint every span on every page) | high |
| Utility classes | none in systems examples (docs.md "No UnoCSS"); the v0 feature pages do use UnoCSS, so the answer to "allowed in examples?" is: allowed under `examples/components/**` and `examples/composables/**`, not under `examples/systems/**`. Bootstrap examples use `d-flex gap-2` because those are upstream classes loaded in its frame, which is not a precedent for a design system | high |
| Slot props | `v-slot="{ attrs }"` shorthand; `v-bind="attrs"` only on the renderless path | high |
| Icons | `<Md1Icon name="..." />` through the DS, never inline SVG (the Bootstrap button example inlines an SVG; compat convention, not DS) | high |
| Status text | `<span v-if="sent" class="md1-docs-note" role="status">` for feedback after an action | high |
| One concept per file | `basic`, `variants`, `dense`, `icons` for the button; `basic`, `confirm`, `form` for the dialog | high |
| Naming | kebab-case folders and files (`text-field/validation.vue`); no `index.vue` | high |
| knip | every example must be referenced by a page or `pnpm repo:check` fails | high |

Template (adapted from `emerald/button/basic.vue`):

```vue
<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Button variant="raised">Save changes</Md1Button>

    <Md1Button>Cancel</Md1Button>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
```

(`8px` is `--md1-spacing-1`, the buttons page's 8 dp between buttons. Confidence for the value: high.)

### 4.5 Index page shape

`apps/docs/src/pages/systems/md1/index.md`, modeled on Emerald's index (high):

1. Frontmatter: `title: Material Design 1 - Design System for Vue on Vuetify0`, meta, `features: { category: Guide, label: 'Material Design 1', level: 2, order: 0 }`, `related:` the component pages.
2. `# Material Design 1`, `<DocsPageFeatures :frontmatter />`, a two-sentence lead ("Material Design 1 is a design system for Vue, built on Vuetify0. It ships tokens, CSS, and `Md1*` components. v0 handles behavior and accessibility. Material Design 1 handles appearance.").
3. `<DocsSystemActivator palette="md1" />` (the prop exists; the component reads `PALETTE_ICONS` / `PALETTE_LABELS`).
4. Optional overview example: `::: ds-example no-resize` with `/systems/md1/overview` (Bootstrap index).
5. `## What Material Design 1 is`, the pinned spec sentence (MD1 as Google archives it at m1.material.io), and the escape-hatch sentence.
6. `## Installation`: `::: code-group no-filename` with `bash pnpm` / `npm` / `yarn` / `bun` fences, then a `ts main.ts` fence with `createMd1Plugin()` and the two CSS imports, then the options table (`{ theme: false }`, `{ icons: false }` with the bundle footnote), then `### Without the plugin`.
7. `## Tokens`: the families table and the `-channels` sentence; `### The v0 bridge`.
8. `## Icons`: role naming, `label` rule, link to the icon page.
9. `## Components`: `| Component | What it wraps | Page |` for every `Md1*`, then the two rules (no named slots; most parts take `namespace`), then the preview `> [!NOTE]`.

### 4.6 Every docs-app file a new system touches

Two rendering paths exist. Pick one before editing.

| Path | Who uses it | Edits needed | Tradeoff | Confidence |
|---|---|---|---|---|
| Inline (Emerald) | a design system with its own tokens and no page reset | `App.vue` token sheet + `DocsSystemExample.vue` system map + `plugins/zero.ts` icons | examples are first-class in the page; CSS is document-global so class discipline matters | high |
| Iframe (Bulma, Bootstrap) | systems that reset `button` / `input`, or whose CSS must not share the docs document | `sandbox/md1.html` + `src/sandbox/md1.ts`; nothing in `DocsSystemExample.vue` (anything not `emerald` is framed already) | overlay promotion machinery, lazy frames, no page CSS leakage | high |

MD1 styles components, not the page, so Material Design 1 belongs on the inline path like Emerald. The table below is the inline path; the two iframe files are listed last as the alternative.

Viewport-fixed components (`Md1Toolbar appBar`, `Md1Toolbar position="bottom"`, `Md1Fab position`, `Md1BottomNavigation`, `Md1Snackbar.Portal`, persistent `Md1BottomSheet`) would paint over the docs shell when rendered inline, and `DocsSystemExample.vue` has no per-system opt-in to the iframe path (`SandboxRoot.vue` only promotes fixed elements as overlays on the framed path). Decision, made once before the first example: their examples render inside a `md1-docs-screen` wrapper (`position: relative; overflow: clip; height: 360px; contain: layout paint`). `contain: layout paint` makes the wrapper the containing block of its `position: fixed` descendants, so no docs-only attribute is added to any component; an `Md1Snackbar.Portal` in such an example passes `:teleport="false"` so the portal stays inside the wrapper. The iframe path is not used for Material Design 1.

| # | File (under `/home/john/sites/0/.claude/worktrees/quantum/`) | Exact change | Confidence |
|---|---|---|---|
| 1 | `apps/docs/package.json` | `"@paper/md1": "workspace:*",` in `dependencies` after `@paper/genesis` | high (Bootstrap diff) |
| 2 | `apps/docs/vite.config.ts` | in `resolve.alias`: `'@paper/md1': fileURLToPath(new URL('../../packages/md1/src', import.meta.url)),` after the emerald alias, and `'#md1': fileURLToPath(new URL('../../packages/md1/src', import.meta.url)),` after `#emerald` | high |
| 3 | `apps/docs/tsconfig.examples.json` | `paths`: `"@paper/md1": ["../../packages/md1/src"]`, `"@paper/md1/*": ["../../packages/md1/src/*"]`; `include`: `"../../packages/md1/src/**/*.ts"`, `"../../packages/md1/src/**/*.vue"`; `exclude`: `"../../packages/md1/src/**/__tests__/*"` | high |
| 4 | `knip.json` | see 1.11 | high |
| 5 | `apps/docs/build/generate-nav.ts` | `systems: ['bulma', 'emerald']` becomes `systems: ['bulma', 'emerald', 'md1']` (Bootstrap inserted itself first; the list is the sidebar order, pick deliberately) | high |
| 6 | `apps/docs/src/composables/useThemeToggle.ts` | `Palette` union gains `\| 'md1'`; `PALETTE_THEMES` gains `'md1': { dark: 'md1-dark', light: 'md1-light' },`; `PALETTE_ICONS` gains `'md1': 'theme-md1',`; `PALETTE_LABELS` gains `'md1': 'Material Design 1',` | high |
| 7 | `apps/docs/src/themes/index.ts` | two `ThemeDefinition` entries, `'md1-dark'` and `'md1-light'`, with `id`, `label: 'Material Design 1'`, `icon: 'theme-md1'`, `dark`, and the full docs role set (`primary`, `secondary`, `accent`, `error`, `info`, `success`, `warning`, `background`, `surface`, `surface-tint`, `surface-variant`, `divider`, `pre`, every `on-*`, `glass-surface`, `scrollbar-thumb`, `discord`, `vue`, `mastered`, `github`); values mirror the token sheet from step 10 so both stylesheets agree; the entry is required because `PALETTE_THEMES` values are typed `ThemeId = keyof typeof themes` | high |
| 8 | `apps/docs/src/plugins/icons.ts` | `'theme-md1': '<24x24 path or { $value: [[path, opacity], ...] }>',` next to `theme-emerald` (Emerald uses a three-path object with per-path opacity; Bulma a single path string) | high |
| 9 | `apps/docs/src/components/app/theme/palette/AppPaletteMd1Button.vue` (new) | copy `AppPaletteEmeraldButton.vue`, replace `emerald` with `md1`, `theme-emerald` with `theme-md1`, label `Material Design 1` | high |
| 9a | `apps/docs/src/components/app/AppThemeMenu.vue` | `<AppPaletteMd1Button />` after `<AppPaletteBulmaButton />` | high |
| 9b | `apps/docs/src/components/app/settings/AppSettingsTheme.vue` | same line in the palette grid | high |
| 9c | `apps/docs/src/components.d.ts` | regenerated by `unplugin-vue-components` on the next dev/build; commit the added `AppPaletteMd1Button` line | high |
| 10 | `apps/docs/src/App.vue` | import `{ Md1StyleSheetAdapter, md1Colors, md1DarkColors } from '@paper/md1'` beside the Emerald import; `const md1Adapter = new Md1StyleSheetAdapter({ v0Aliases: true, stylesheetId: 'md1-docs-tokens' })`; in `useHead({ style: [...] })` add `{ key: 'md1-docs-tokens', id: 'md1-docs-tokens', innerHTML: md1Adapter.generate({ 'md1-light': md1Colors, 'md1-dark': md1DarkColors }) }`; append `:not([data-theme="md1-light"])` to the dot-grid selector chain. Never import `theme.css` or `style.css` here (they paint `--v0-*` on `:root`) and never `app.use(createMd1Plugin())` (its adapter writes `data-theme` on `<html>` and fights `V0UnheadThemeAdapter`) | high |
| 11 | `apps/docs/src/components/docs/DocsSystemExample.vue` | replace the two hardcoded lines `const framed = toRef(() => segments.value[1] !== 'emerald')` and `const inlineTheme = toRef(() => local.isDark.value ? 'emerald-dark' : 'emerald-light')` with a map: `const INLINE: Record<string, { light: string, dark: string }> = { emerald: { light: 'emerald-light', dark: 'emerald-dark' }, md1: { light: 'md1-light', dark: 'md1-dark' } }`, `const system = toRef(() => segments.value[1] ?? '')`, `const framed = toRef(() => !(system.value in INLINE))`, `const inlineTheme = toRef(() => INLINE[system.value]?.[local.isDark.value ? 'dark' : 'light'] ?? 'light')`. The `INLINE` map carries no per-example flag: fixed components are contained by the `md1-docs-screen` wrapper described above | moderate (new code; the current file is hardcoded to Emerald) |
| 12 | `apps/docs/src/plugins/zero.ts` | `app.use(createMd1IconsPlugin())` after `createEmeraldIconsPlugin()` with the matching import; optional because `useMd1Icons` falls back to the built-in set, present for parity with Emerald | high |
| 13 | `apps/docs/src/pages/systems/md1/index.md` and one `.md` per component | section 4.2 and 4.5 | high |
| 14 | `apps/docs/src/examples/systems/md1/<component>/<example>.vue` | section 4.4 | high |
| 15 | `apps/docs/src/typed-router.d.ts` | regenerated by the router plugin; commit it | high |
| 16 | `apps/docs/src/composables/usePlayground.ts` | `PAPER_CDN` gains `'@paper/md1'`, `'@paper/md1/style.css'`, `'@paper/md1/theme.css'` jsDelivr URLs and `paperImportsFromCode` gains a `@paper/md1` branch; the URLs 404 until the package is on npm, so "Open in Playground" on Material Design 1 examples cannot resolve before the first publish either way | high (shape), the timing is a decision |
| 17 | `apps/docs/src/components/docs/DocsPaletteBrowse.vue` | optional: add a `md1` entry to the palette explorer; `md1` is already imported there from `@vuetify/v0/palettes/md1`, so the explorer may already cover the ladders | high |
| 18 | `.github/workflows/docs-deploy.yml` | see 1.11 | high |
| alt-1 | `apps/docs/sandbox/md1.html` (iframe path only) | copy `sandbox/emerald.html`: blocking script translating `?theme=dark` to `data-theme="md1-dark"`, `:where(html[data-theme="md1-light"])` / `md1-dark` critical colors, the border-box and `body { margin: 0 }` reset, `html { overflow: clip }`, `<script type="module" src="/src/sandbox/md1.ts">`; `vite.config.ts` reads `sandbox/*.html` from disk so no input list edit | high |
| alt-2 | `apps/docs/src/sandbox/md1.ts` (iframe path only) | copy `src/sandbox/emerald.ts`: glob `../examples/systems/md1/**/*.vue`, `new Md1StyleSheetAdapter().upsert(adapter.generate({ 'md1-light': md1Colors, 'md1-dark': md1DarkColors }))`, `createApp(SandboxRoot, { is, name, themes: { light: 'md1-light', dark: 'md1-dark' } }).use(createMd1IconsPlugin()).mount('#sandbox')`; never install the theme plugin in the frame | high |

Docs pages reference the package by its source alias, so the docs build compiles `packages/md1/src` directly; no package build is needed to run the docs, but the docs cannot describe an API the package on the same branch lacks (memory `emerald-docs-branch-sequencing`). On this worktree the `systems` tree exists (`bulma`, `emerald`), so pages and package land in the same PR.

## 5. Verification commands

Run from the worktree root unless stated. The md1 worktree already has `node_modules` at the root and in `apps/docs`; after adding `packages/md1` run `pnpm install` once so the workspace link exists.

| Step | Command | Notes | Confidence |
|---|---|---|---|
| Package typecheck | `pnpm --filter @paper/md1 typecheck` | `vue-tsc --noEmit --incremental`; delete `packages/md1/node_modules/.tmp/*.tsbuildinfo` when the output quotes a type you already changed | high |
| Package build | `pnpm --filter @paper/md1 build` | tsdown then the bake; check `dist/index.mjs`, `dist/style.css`, `dist/theme.css`, `dist/index.d.mts`; the build is the only gate that catches an unresolvable `defineProps` type | high |
| Tarball contents | `pnpm --filter @paper/md1 pack --pack-destination /tmp/md1-pack` then `tar -tzf /tmp/md1-pack/paper-md1-<version>.tgz` | lists what ships: `dist/**`, `LICENSE-ICONS`, plus the `package.json` and `README.md` every tarball carries, and nothing else; read the listing from the written tarball rather than from the `--dry-run` summary | high |
| Browser tests | section 3.4 | | high |
| Lint | none to run; the PostToolUse hook runs `eslint --fix` on every written `.ts` / `.vue`; run `pnpm lint:fix` once before committing because the pre-push hook fixes the working tree, not the commit | high |
| Docs typecheck | `pnpm --filter docs typecheck` | `vue-tsc --noEmit -p tsconfig.examples.json`: covers `src/examples/**` and the packages listed in `include`, nothing under `apps/docs/src/components` (memory `docs-app-typecheck-gap`; use the `tsconfig.app.json` before/after differential for shell edits) | high |
| Docs build | `pnpm --filter docs build` (SSG only) or `pnpm build:docs` (also builds the `dev` demo) | the `docs-check` CI job runs `pnpm run build:docs` with `SKIP_OG_IMAGES=1` and then lychee offline link check over `apps/docs/dist` | high |
| Docs dev server | `pnpm dev:docs` (port 8000) or `pnpm --filter docs exec vite --port 8010 --strictPort` to dodge the PWA service worker cache of a previous origin | then open `http://localhost:8010/systems/md1` | high |
| Repo integrity | `pnpm repo:check` (knip + sherif) | knip needs `apps/docs/build/generated/api-whitelist.ts`, which `postinstall` generates | high |
| Full gate | `pnpm validate` (`lint`, `typecheck`, `test:run`) then `pnpm build` | `test:run` includes browser projects, so Chromium must be installed | high |
| Browser check | drive the page with Playwright (global install at `/home/john/.local/share/pnpm/global/5/.pnpm/playwright@1.58.2/node_modules/playwright` or the repo's 1.62.1) and take a screenshot before claiming a page renders | memory `docs-browser-verification` | low |

## 6. Commit and PR conventions

| Rule | Detail | Source | Confidence |
|---|---|---|---|
| Types | `feat(md1): ...` and `fix(md1): ...` only for `packages/md1/src` (they drive changelog and version bumps); `docs(md1): ...` or `docs: ...` for `apps/docs`; `chore: ...` for root config (`tsconfig.json`, `vitest.config.ts`, `knip.json`, workflows); `test(md1): ...` for test-only commits | `~/.claude/CLAUDE.md`; `apps/docs/CLAUDE.md` | high |
| Scope spelling | package scope lowercase `md1`; component scope when specific: `feat(Md1Button): ...`, `fix(Md1Dialog): ...` (Emerald changelog uses `fix(EmCalendar)`) | Emerald `CHANGELOG.md` | high |
| Atomic | one logical unit per commit: package scaffold, each component, root registration, docs registration, each docs page group | memory `feedback_atomic_commits` | high |
| Changeset | one `.changeset/<slug>.md` per change touching `packages/md1/src`; frontmatter `'@paper/md1': minor` for new surface, `patch` for fixes; first line is the consumer-facing summary, body only when a consumer must act; CI fails without it | `scripts/changeset-required.js`; releasing skill | high |
| Base branch | `dev` (new public API is a minor); milestone follows the base (`dev` = next minor) | root `CLAUDE.md`; memory `feedback_pr_milestone` | high |
| PR title | conventional (`amannn/action-semantic-pull-request` runs on every PR) | `pr-checks.yml` | high |
| No breaking footers | never `BREAKING CHANGE:` mid-iteration | memory `feedback_no_breaking_in_pr` | low |
| Worktree etiquette | commit and push the branch from the worktree without asking; never push `master`, never force-push, never merge Version Packages | memory `feedback_no_auto_commit` | high |
| Lint before commit | `pnpm lint:fix` then stage | memory `feedback_lint_before_commit` | high |
| First publish | a brand-new scoped package needs one manual `npm publish --access public` before OIDC can publish it; not part of this work | releasing skill | high |

## 7. Pitfalls

| # | Pitfall | What to do | Source | Confidence |
|---|---|---|---|---|
| 1 | `<style scoped>` on a wrapper of a multi-root v0 Root never lands on the rendered element (#359) | unscoped `<style>`, class prefix for isolation | memory `scoped-css-multiroot-child`; ruling 3 | high |
| 2 | `aria-label` declared as a kebab prop is always `undefined` | declare `ariaLabel`; consumers still write `aria-label="..."` | same memory; `EmButton.vue` | high |
| 3 | `.value` on a top-level `<script setup>` ref inside the template compiles to `undefined` and silently drops a binding | bare name for top-level refs; `.value` only through a non-ref object (`context.disabled.value`, `toggle.isDark.value`) | memory `vue-template-dotvalue-topref-drop`; `EmCalendarPrev.vue` | high |
| 4 | v0 composable returns are `Readonly<Ref>` fields on an object and do not auto-unwrap in templates | `context.label.value` | memory `feedback_readonly_refs` | high |
| 5 | the lint hook's autofix can turn a derived computed into `list.value = list.value.filter(...)` | re-read any ref-derived code after the hook runs | memory `lint-hook-destructive-rewrite` | high |
| 6 | `display: flex` set directly on a native-popover content element overrides the UA `display: none` and leaves closed popovers visible | put layout on an inner wrapper; `EmSelectContent` sets `display: flex` only under `:popover-open` | memory `popover-display-autohide-footgun`; `EmSelectContent.vue` | high |
| 7 | `Snackbar.Portal` / `Portal` apply the stack z-index to a `position: static` wrapper, so it is inert | the DS portal class positions itself (`.emerald-snackbar-portal { position: fixed; ... }`) | memory `snackbar-portal-zindex-static-footgun`; `EmSnackbarPortal.vue` | high |
| 8 | sharing an element between parts through a `watchEffect` push | register the element with the parent registry (`register({ id, value, el })`) | memory `feedback_registry_element_refs`; `BTabsItem.vue` | high |
| 9 | Vue casts an absent Boolean prop to `false`, so `urgent ?? derived` never falls through | destructure with `= undefined` (`EmSnackbar.vue`) | high |
| 10 | widening a prop to `MaybeRefOrGetter` makes every truthy check pass | `toValue(prop) \|\| undefined` at each use site | memory `emerald-prop-type-gates` | high |
| 11 | a green `vue-tsc` on a prop-type refactor can still fail the SFC compiler ("Failed to resolve extends base type") | run the package build; keep literal key unions in `Pick` / `Omit` | same memory | moderate |
| 12 | `data-selected` on a standalone `Button.Root` is reserved by its group semantics | use `data-active` for a pressed look | memory `emerald-feedback-from-onyx` item 6 | moderate |
| 13 | `theme.css` disappears from `package.json#exports` after a build | keep `customExports` in `tsdown.config.mts`; never hand-edit the exports map | Emerald `tsdown.config.mts` comment | high |
| 14 | installing `createMd1Plugin()` (or any `createThemePlugin`) inside the docs app or a sandbox frame makes two writers fight over `data-theme` | docs: adapter `generate()` through `useHead`; sandbox: `adapter.upsert(adapter.generate(...))`; only the icons plugin is installed | `docs.md`; `src/sandbox/emerald.ts` | high |
| 15 | importing `@paper/md1/theme.css` or `style.css` in the docs shell paints `--v0-*` on `:root` and recolors Genesis chrome | never import `dist/` CSS in `apps/docs`; the docs resolve the package to its source | `App.vue` comment; `docs.md` | high |
| 16 | inline example CSS is document-global (`useExamples` eager-globs every example) | dedicated `md1-docs-*` classes, no element descendants | `docs.md` | high |
| 17 | `::: ds-example` with two files has no second file to mount | one path per block | `docs.md` | high |
| 18 | `features.group` in frontmatter does nothing on this branch | `order:` until the Bootstrap nav patch is ported (seven docs files) | section 4.1 | high |
| 19 | stale `.tsbuildinfo` reports errors against old source, and CI typechecks the branch merged into master | delete the buildinfo; check `git log HEAD..origin/master` before diagnosing CI failures in untouched files | memory `typecheck-local-vs-ci-divergence` | high |
| 20 | nothing typechecks `apps/docs/src` itself | the `tsconfig.app.json` differential for shell edits (`App.vue`, `DocsSystemExample.vue`) | memory `docs-app-typecheck-gap` | high |
| 21 | a worktree without a full install fails vitest, typecheck and knip in confusing ways | `pnpm install` in the worktree (frozen is fine until the lockfile changes; adding the package changes it) | memory `worktree-node-modules-symlink` | high |
| 22 | `EnterWorktree` from the lead moves subagent shells mid-task | absolute paths everywhere; `pnpm --dir=<worktree>` for gates; read the root vitest prints | memory `enterworktree-moves-subagent-shells` | high |
| 23 | `vitest` swallows `console.*` from inside component source | `process.stderr.write` for temporary instrumentation | memory `vitest-console-intercept` | moderate |
| 24 | `isVisible()` from test-utils is unreliable for `v-show` under happy-dom | assert on `style` containing `display: none`, after two `nextTick`s; moot under the browser runner | memory `vitest-isvisible-vshow-unreliable` | moderate |
| 25 | Vite dev in a worktree serves stale scoped `<style>` after edits | restart the dev server; unscoped styles in package source are unaffected | memory `docs-vite-scoped-style-hmr-stale` | low |
| 26 | `createContext` keys without `:` trigger the `[v0:context]` namespace warning (zero-stderr policy) | `md1:dialog`, `md1:tabs`, tests use `md1:test` | `testing.md` | high |
| 27 | `vitest/prefer-lowercase-title` rewrites `describe('Md1Button')` to `describe('md1Button')`, which breaks a case-sensitive `-t` filter | name tests `should ...` and filter on a mid-string substring | `eslint.config.js`; memory note in `vitest-isvisible-vshow-unreliable` | high |
| 28 | `__DEV__` and `process.env` are undefined in the browser runner unless defined at config time | copy Bootstrap's `define` block verbatim | `vitest.browser.config.ts` | high |
| 29 | `pnpm -C <dir>` is reported to fail on some pnpm 10/11 builds | `pnpm --dir=<dir> exec ...` worked and `-C` also worked here (pnpm 11.16.0) | section 3.4 | high |
| 30 | `data-bs-theme`-style attribute differences: Material Design 1 keys on `data-theme` like Emerald, so `SandboxRoot`'s `themeAttribute` default is correct and only `themes` needs the name map | | `SandboxRoot.vue` (Bootstrap diff) | high |
| 31 | `locale.ti()` without an inline English fallback leaves an unconfigured app with no accessible name | `?? 'Close'` always (the ESLint rule is scoped to `packages/0`, the contract is not) | `eslint.config.js`; `BDialogClose.vue` | high |
| 32 | the `Object.assign` compound root makes `<Md1Dialog>` renderable, unlike v0's plain-object namespaces where `<Dialog>` is invalid | document the dot path as an access path, not a nesting claim (Emerald SPEC "Compound access") | Emerald `SPEC.md` | high |
| 33 | hand-rolling a registry, version signal, roving focus or popover positioning that v0 ships | grep `packages/0/src/composables` first; invoke the `vuetify0` skill before writing Vue | memory `feedback_no_handrolled_primitives`; `paper-component` skill | high |
| 34 | `defineProps` interfaces that extend `AtomProps` must not re-declare `as` / `renderless`; DS wrappers `Omit` them instead | `Omit<DialogContentProps, 'as' \| 'renderless'>` | components.md; `EmDialogContent.vue` | high |
| 35 | the root nav list `systems` order and the `order:` numbers are the only sidebar ordering levers on this branch | decide the component order once, in the index page table and the frontmatter together | `generate-nav.ts` | high |

## Also found

- `docs.md` says `meta` items sit at column 0 and every systems page on disk does that; the memory note `feedback_docs_formatting` demands two spaces. Follow the files and `docs.md`.
- `testing.md` names component tests `index.browser.test.ts` for `packages/0`; Emerald names them `EmX.test.ts` on happy-dom and Bootstrap names them `BX.browser.test.ts`. Material Design 1 follows Bootstrap's naming on the browser runner, as the assignment states.
- The `paper-component` skill lists only `pnpm typecheck` as the gate; `emerald-prop-type-gates` shows the build is the stronger gate for SFC prop types.
- `v0` already ships the 2014 Material palette (`@vuetify/v0/palettes/md1`, `TokenCollection` with `50`..`900` and `A100`..`A700` per hue). The color note should decide whether `design-system.ts` imports it or copies it.
- `features.group`, the `NavItemSubheader` nav shape and `PAGE_GROUP_ORDER` exist only as uncommitted work on `bootstrap-v6`; the md1 worktree's `generate-nav.ts` is the pre-patch version with `systems: ['bulma', 'emerald']`.
- `DocsSystemExample.vue` on this branch hardcodes `emerald` as the only inline system; Bootstrap's branch kept that and added dialog-aware overlay classification to `SandboxRoot.vue` for its iframe path. The inline map in 4.6 item 11 is new code.
- `apps/docs/src/plugins/zero.ts` installs `createEmeraldIconsPlugin()` app-wide; this is a registration point the assignment's file list did not name.
- Both `pnpm -C` and `pnpm --dir=` resolve and run `vitest` on pnpm 11.16.0; the memory note claiming `-C` dies with `EACCES` did not reproduce here.
- Vuetify 1.5's `$transition` map (easing curves) and the ambient column of `_elevations.styl` were not read in this session; the two sample fallbacks that depend on them are marked `not found` above.
