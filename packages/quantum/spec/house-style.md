# Quantum house style: the implementer playbook

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
| npm name | `@paper/quantum` | assignment | high |
| Component prefix | `Qu*` | assignment | high |
| Token namespace | `--quantum-*` | assignment | high |
| Class prefix | `quantum-` (`quantum-button`, `quantum-button__content`) | Emerald `emerald-*` | high |
| Theme ids | `quantum-light` (default), `quantum-dark` (`dark: true`) | assignment; Emerald `emerald-light` / `emerald-dark` | high |
| Plugin | `createQuantumPlugin`, options type `QuantumPluginOptions` | Emerald `createEmeraldPlugin` | high |
| Adapter | `QuantumStyleSheetAdapter`, options `QuantumAdapterOptions`, `stylesheetId: 'quantum-theme-stylesheet'`, `prefix: 'quantum'` | Emerald adapter | high |
| Color maps | `quantumColors`, `quantumDarkColors` | assignment | high |
| Token dictionary export | `quantumDesignSystem` plus the named families | Emerald `emeraldDesignSystem` | moderate |
| Icons | `createQuantumIconsPlugin`, `createQuantumIconsContext`, `useQuIcons`, `createQuIcons`, `quantumIcons`, `quantumIconAliases`, `QU_ICONS_NAMESPACE = 'quantum:icons'`, component `QuIcon`, types `QuIconGlyph`, `QuIconName`, `QuIconCollection`, `QuIconsContext`, `QuantumIconsOptions`, `QuantumIconsContextOptions`, `QuantumIconsPluginOptions` | Emerald icons | high |
| Stylesheet exports | `@paper/quantum/style.css`, `@paper/quantum/theme.css` | assignment; Emerald `package.json` | high |
| Context namespaces | `quantum:<thing>` (must contain `:`) | testing.md namespace rule; Bootstrap `bootstrap:dialog` | high |
| Docs palette id | `quantum` | Emerald `emerald` in `useThemeToggle.ts` | high |
| Docs icon role | `theme-quantum` | Emerald `theme-emerald` | high |
| Docs pages folder | `apps/docs/src/pages/systems/quantum/` | Emerald | high |
| Docs examples folder | `apps/docs/src/examples/systems/quantum/<component>/<example>.vue` | Emerald | high |
| Base branch for the PR | `dev` (new public API = minor) | root `CLAUDE.md` branch model | high |
| First changeset | `.changeset/quantum-initial.md` with `'@paper/quantum': minor` | Emerald `changesets-parked/emerald-wave1.md` | moderate |

## 1. Package skeleton

### 1.1 File checklist

Create `packages/quantum/` from Emerald, file by file. "Copy" means copy the Emerald file and apply the rename column; nothing else changes.

| Path under `packages/quantum/` | Copy from (`packages/emerald/` unless noted) | What changes | Confidence |
|---|---|---|---|
| `package.json` | `package.json` | see 1.2; adds `test:browser` script and browser dev deps from Bootstrap | high |
| `tsconfig.json` | `tsconfig.json` | `#emerald` -> `#quantum` (two path entries) | high |
| `tsdown.config.mts` | `tsdown.config.mts` | `emerald` const -> `quantum`; `name: 'paper/quantum'`; alias `#quantum`; keep `customExports` | high |
| `vitest.browser.config.ts` | `packages/bulma/vitest.browser.config.ts` (the committed precedent on `feat/quantum`, listed in the root `vitest.config.ts`; Bootstrap's copy is the same file but lives uncommitted on another worktree) | `@paper/bulma` -> `@paper/quantum`; `#bulma` -> `#quantum`; `name: 'quantum:browser'`; drop the Bulma-only header comment | high |
| `scripts/bake-theme.ts` | `scripts/bake-theme.ts` | identifiers and strings, see 1.6 | high |
| `src/index.ts` | `src/index.ts` | none (six `export *` lines) | high |
| `src/vite-env.d.ts` | `src/vite-env.d.ts` | none | high |
| `src/plugin.ts` | `src/plugin.ts` | see 1.8 | high |
| `src/adapter.ts` | `src/adapter.ts` | see 1.7 | high |
| `src/design-system.ts` | `src/design-system.ts` | token families are Quantum's (the other spec notes own the values); keep the `*Dark satisfies Record<keyof typeof *, string>` pattern | high |
| `src/colors.ts` | `src/colors.ts` | `emeraldColors` -> `quantumColors`, `emeraldDarkColors` -> `quantumDarkColors`; keep `scale()` and both `satisfies` | high |
| `src/icons/glyphs.ts` | `src/icons/glyphs.ts` | `emeraldIcons` -> `quantumIcons`, `emeraldIconAliases` -> `quantumIconAliases`, `EmIcon*` types -> `QuIcon*`; artwork is Quantum's own (ruling 6: no shared artwork) | high |
| `src/icons/index.ts` | `src/icons/index.ts` | names per section 0; `EM_ICONS_NAMESPACE` -> `QU_ICONS_NAMESPACE = 'quantum:icons'` | high |
| `src/components/index.ts` | `src/components/index.ts` | one `export * from './QuX'` per component, alphabetical | high |
| `src/components/QuIcon/{QuIcon.vue,index.ts,QuIcon.browser.test.ts}` | `src/components/EmIcon/*` | `emerald-icon` -> `quantum-icon`; `--emerald-icon-*` -> `--quantum-icon-*`; test moves to the browser runner | high |
| `SPEC.md` | `SPEC.md` (shape) | class, pinned spec, coverage, inventory, deviations; see 1.10 | high |
| `README.md` | `README.md` | install snippet with the Quantum names | high |
| `LICENSE-ICONS` | new | Apache 2.0 text plus the attribution notice for `google/material-design-icons` at commit `49d4db35df873165d6bd6ba09b063c7dafbac2f4` (`spec/icons.md` carries the text; upstream ships no NOTICE file, so section 4(d) adds nothing); shipped in the tarball through `files` | high |
| `CHANGELOG.md` | generated by changesets on release; do not author | high |
| `harness/` | do not create | Bootstrap-only (compat conformance fixtures) | high |

Do not create `vitest.config.ts` (happy-dom) unless a DS-owned headless core like `EmCalendar/calendar.ts` appears; Emerald runs every test on happy-dom and has zero `*.browser.test.ts` files, which is the exception, not the rule (`testing.md`: components use `*.browser.test.ts`).

### 1.2 package.json

Copy-pasteable. Every devDependency must be `catalog:` (`pnpm/json-enforce-catalog` in `eslint.config.js`).

```json
{
  "name": "@paper/quantum",
  "version": "0.0.0",
  "description": "Quantum design system. Material Design 1 (2014 to 2017), composed on Vuetify0",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/vuetifyjs/0.git",
    "directory": "packages/quantum"
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
  "#quantum/*": ["./src/*"],
  "#quantum": ["./src"],
  "#v0": ["../0/src"],
  "#v0/*": ["../0/src/*"]
}
```

`include` stays `["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]`, `exclude` stays `["src/**/__tests__/*", "scripts/**"]` (so `scripts/bake-theme.ts` is never typechecked, which is why the bake script re-asserts key parity at runtime). Package source imports `@vuetify/v0`, never `#v0` (`#v0`-as-source breaks the TS program, memory `emerald-feedback-from-onyx` item 4; Bootstrap `CANON.md` states the same rule). The `#quantum` alias is config-only parity for tooling. Confidence: high.

### 1.4 tsdown.config.mts

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'
import Vue from 'unplugin-vue/rolldown'

import pkg from './package.json' with { type: 'json' }

const v0 = fileURLToPath(new URL('../0/src', import.meta.url))
const quantum = fileURLToPath(new URL('src', import.meta.url))
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
  name: 'paper/quantum',
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
    '#quantum': quantum,
  },
})
```

Confidence: high (Emerald's file with two renames).

### 1.5 vitest.browser.config.ts

Copy `packages/bulma/vitest.browser.config.ts` verbatim except three strings (`@paper/bulma` -> `@paper/quantum`, `#bulma` -> `#quantum`, `name: 'quantum:browser'`) and drop its Bulma-only header comment; Bootstrap's copy is the same file but is uncommitted on another worktree, so the recipe cites the committed one. The file matters for correctness, not only for names: `optimizeDeps.include: ['vue']` and `resolve.dedupe` keep one Vue copy so Atom's `useTemplateRef` does not throw; `define` evaluates `__DEV__` and `__VITE_LOGGER_ENABLED__` at config time because the browser has no `process`; `'process.env': '{}'` stubs Node-flavored deps; Playwright runs with `reducedMotion: 'reduce'`, `viewport 1280x800`, `actionTimeout 5000`, `testTimeout 20_000`, `headless: !process.env.TEST_BAIL`, `benchmark.include: []`.

```ts
alias: {
  '@paper/quantum': fileURLToPath(new URL('src', import.meta.url)),
  '@vuetify/v0': fileURLToPath(new URL('../0/src', import.meta.url)),
  // internal
  '#quantum': fileURLToPath(new URL('src', import.meta.url)),
  '#v0': fileURLToPath(new URL('../0/src', import.meta.url)),
},
// ...
test: {
  name: 'quantum:browser',
  include: ['**/*.browser.test.{ts,tsx}'],
```

Confidence: high.

### 1.6 scripts/bake-theme.ts

Copy Emerald's and apply these substitutions (all `high`):

| Emerald | Quantum |
|---|---|
| `import { emeraldColors, emeraldDarkColors } from '../src/colors'` | `import { quantumColors, quantumDarkColors } from '../src/colors'` |
| the `foundations()` import list from `../src/design-system` | whatever families Quantum's `design-system.ts` exports (the spacing/elevation/type/motion notes define them) |
| every `--emerald-` string | `--quantum-` |
| `satisfies readonly (keyof typeof emeraldColors)[]` and `Record<string, keyof typeof emeraldColors>` | `quantumColors` |
| `colorBlock('[data-theme="emerald-light"]', emeraldColors)` | `colorBlock('[data-theme="quantum-light"]', quantumColors)` |
| `colorBlock(':root', emeraldColors)` | `colorBlock(':root', quantumColors)` |
| `colorBlock('[data-theme="emerald-dark"]', emeraldDarkColors)` | `colorBlock('[data-theme="quantum-dark"]', quantumDarkColors)` |
| `'[data-theme="emerald-dark"] {\n  color-scheme: dark;\n}\n'` | `quantum-dark` |
| banner `/* @paper/emerald ... */` | `/* @paper/quantum ... */` |
| `[bake-theme] emeraldColors/emeraldDarkColors key drift` | rename the message |

Output contract (high): `dist/theme.css` = foundations on `:root`, the light color block twice (`[data-theme="quantum-light"]` and `:root`), the dark block on `[data-theme="quantum-dark"]` only, then `:root { color-scheme: light }` and `[data-theme="quantum-dark"] { color-scheme: dark }`. Every color key also emits `--quantum-<key>-channels: r g b`. The bake throws on `SAFE_IDENT` / `UNSAFE_CSS` hits, on an empty block, on alias sources missing from the map, and on light/dark key drift. The `V0_ALIAS_KEYS` / `V0_REMAP_KEYS` tables must be rebuilt against Quantum's color keys (MD1 ships `primary`, `secondary`, `accent`, `error`, `info`, `success`, `warning` in Vuetify 1.5's theme vocabulary, so most kit roles alias directly and the remap table shrinks; the color note owns the final list). SPEC.md "The v0 bridge" fixes the emitted set, which includes `accent`, `on-accent`, `on-info`, `on-success`, `on-warning` and `border` (Genesis `GnDocsCallout` reads `--v0-accent`). Onyx replaced the "keep in lockstep" duplication with one dependency-free `src/css.ts` imported by both `adapter.ts` and the bake script (memory `emerald-feedback-from-onyx` item 2, `moderate`); either shape is acceptable, the Emerald shape is the one on disk.

### 1.7 src/adapter.ts

Emerald's class with renames. Shape (high):

```ts
export interface QuantumAdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  /** When true (default), also emit `--v0-*` aliases for the color roles kits (Genesis) consume. */
  v0Aliases?: boolean
}

export class QuantumStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  readonly v0Aliases: boolean

  constructor (options: QuantumAdapterOptions = {}) {
    // `stylesheetId` precedes the spread so callers can override it; `prefix` follows so they cannot.
    super({ stylesheetId: 'quantum-theme-stylesheet', ...options, prefix: 'quantum' })
    this.v0Aliases = options.v0Aliases !== false
  }

  override generate (colors: Record<string, Colors>, isDark?: boolean): string { /* Emerald body, --quantum- */ }
}
```

Rules kept from Emerald: no `prefix` option (every stylesheet hardcodes `var(--quantum-*)`); colors land on `[data-theme="<id>"]` only, foundations on `:root`; the runtime adapter skips sanitizer hits silently (user input), the bake throws (first-party input); `:root { color-scheme }` is emitted from the selected theme's `dark` flag; `V0_ALIAS_KEYS` is `as const satisfies readonly (keyof typeof quantumColors)[]` so a renamed token is a compile error. Validate color keys with `SAFE_IDENT` as well as values (Onyx hardening, memory item 5, `moderate`); Emerald already does both in `generate`.

### 1.8 src/plugin.ts

Emerald's file with renames (high):

```ts
export interface QuantumPluginOptions {
  theme?: ThemePluginOptions | false
  icons?: QuantumIconsPluginOptions | false
  /** `false` when the host installs `createReducedMotionPlugin` itself. */
  reducedMotion?: ReducedMotionPluginOptions | false
}

function quantumThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'quantum-light',
    system: { light: 'quantum-light', dark: 'quantum-dark' },
    adapter: new QuantumStyleSheetAdapter(),
    themes: {
      'quantum-light': { colors: quantumColors },
      'quantum-dark': { colors: quantumDarkColors, dark: true },
    },
  }
}

export function createQuantumPlugin (options: QuantumPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.reducedMotion !== false) app.use(createReducedMotionPlugin(options.reducedMotion))
      if (options.icons !== false) app.use(createQuantumIconsPlugin(options.icons))
      if (options.theme === false) return
      // mergeThemes(defaults.themes, options.theme.themes) exactly as Emerald
      app.use(createThemePlugin(theme))
    },
  }
}
```

Keep Emerald's `mergeThemes` (per-id shallow merge with `colors` merged one level deeper) and the JSDoc that `{ icons: false }` skips install but does not shrink the bundle (ruling 6: the glyph map survives tree-shaking). Reduced motion is composed here, unlike Emerald, because `QuRipple` reads `useReducedMotion().isReduced`, which falls back to `false` when no plugin is installed (`packages/0/src/composables/useReducedMotion/index.ts`, `createReducedMotionFallback`); `{ reducedMotion: false }` is the escape for hosts that install the plugin themselves.

### 1.9 src/colors.ts and src/design-system.ts

| Rule | Source | Confidence |
|---|---|---|
| `quantumColors` is built with `scale(name, family)` where `DEFAULT` collapses to the family name and other keys become `<family>-<key>`; declared with `satisfies Record<string, string>` so `keyof typeof quantumColors` stays a literal union | Emerald `colors.ts` | high |
| `quantumDarkColors` is `satisfies Record<keyof typeof quantumColors, string>` | Emerald `colors.ts` | high |
| Each dark family in `design-system.ts` is `as const satisfies Record<keyof typeof <lightFamily>, string>` | Emerald `design-system.ts` | high |
| Shadows (elevations) ride the per-theme color map, not only `:root` foundations, so the dark theme can override them | Emerald `colors.ts` comment | high |
| Foundations (spacing, radius, stroke, icon, shadow, motion, control, font, text scale) are emitted on `:root` by `foundations()` in both adapter and bake | Emerald adapter | high |
| v0 already ships the 2014 Material color palette as `@vuetify/v0/palettes/md1` (`TokenCollection`, families `red`, `pink`, `purple`, ... with keys `50`..`900` and `A100`..`A700`) | `packages/0/src/palettes/md1/index.ts` | high |

The md1 palette is the obvious source for Quantum's color ladders; whether `design-system.ts` re-exports it or copies the hex values is a decision for the color note. Do not hand-type a second copy without saying why.

### 1.10 Icons

`src/icons/glyphs.ts` is a leaf module (no imports) holding `quantumIcons` (24x24 path data per role) and `quantumIconAliases` (`{ mail: '{envelope}' }` brace references). `src/icons/index.ts` builds the registry with `createTokens`, wraps each glyph as `{ $value: glyph }`, exposes `createQuIcons`, and the trinity:

```ts
export const QU_ICONS_NAMESPACE = 'quantum:icons'

export const [
  createQuantumIconsContext,
  createQuantumIconsPlugin,
  useQuIcons,
] = /* @__PURE__ */ createPluginContext<QuantumIconsPluginOptions, QuIconsContext>(
  QU_ICONS_NAMESPACE,
  options => createQuIcons(options),
  { fallback: () => (fallback ??= createQuIcons()) },
)
```

MD1 glyphs are the Material Icons set of the period (filled, 24x24 grid), which differs from Emerald's stroke grid; `QuIcon` therefore renders `fill="currentColor"` paths rather than Emerald's `fill="none" stroke="currentColor"` (`moderate`: the icon note owns the drawing contract). Everything else in `EmIcon.vue` carries over: `name`, `label`, `size`, `namespace` props; `aria-hidden="true"` unless `label`; `role="img"` + `aria-label` when labelled; dev `logger.warn` and render nothing for an unknown role; `:where()` size steps so a host class wins without `!important`.

### 1.11 Root repo registration for the package

| File | Exact change | Confidence |
|---|---|---|
| `/home/john/sites/0/.claude/worktrees/quantum/tsconfig.json` | add `{ "path": "./packages/quantum" }` to `references` after `./packages/emerald` | high (Bootstrap diff) |
| `/home/john/sites/0/.claude/worktrees/quantum/vitest.config.ts` | add `'packages/quantum/vitest.browser.config.ts',` to `test.projects` after `'packages/paper',` | high (Bootstrap diff) |
| `/home/john/sites/0/.claude/worktrees/quantum/knip.json` | under `workspaces["apps/docs"].paths` add `"@paper/quantum": ["../../packages/quantum/src"]` and `"#quantum": ["../../packages/quantum/src"]` | high (Bootstrap diff) |
| `/home/john/sites/0/.claude/worktrees/quantum/.github/workflows/docs-deploy.yml` | add `- 'packages/quantum/**'` to `on.push.paths` after `packages/genesis/**` | high |
| `/home/john/sites/0/.claude/worktrees/quantum/README.md` and `packages/0/README.md` (line 47 area) | add `\| [`@paper/quantum`](./packages/quantum) \| Quantum design system (Material Design 1) \|` to the package table; keep both files identical | high |
| `pnpm-workspace.yaml` | nothing: `packages/*` already matches | high |
| `.github/workflows/pr-checks.yml` | nothing: `pnpm build`, `pnpm typecheck` and `vitest run --project '*:browser'` pick the package up once it is in the root configs | high |
| `.size-limit.json` | nothing (packages/0 entries only) | high |
| `eslint.config.js` | nothing unless a conformance-style assertion-less test helper is introduced (Bootstrap added its path to the `vitest/expect-expect` override) | high |
| `dev/vite.config.ts` | optional: `'@paper/quantum'` and `'#quantum'` aliases plus `'../packages/quantum/src/components/'` in `Components.dirs`, only if a dev showcase route is built | high |
| `.changeset/quantum-initial.md` | required by `scripts/changeset-required.js` for any PR touching `packages/*/src/`: frontmatter `'@paper/quantum': minor`, first line `feat(quantum): ...` written for the consumer | high |

### 1.12 SPEC.md contract

`DESIGN_SYSTEMS.md` "Per-package SPEC.md" requires: (1) class `design system` and purpose; (2) the pinned spec, named with a date (here: the archived MD1 guidelines, snapshot timestamp, plus the Vuetify 1.5.24 cross-reference); (3) a coverage statement listing what ships and what is deliberately out (a v0 primitive existing is not a reason to ship; ruling 7); (4) the component inventory and every intentional deviation from the family contract with a reason. Emerald's `SPEC.md` sections to mirror: Identity, Purpose, Token source, Dark theme, Pipeline, Consumer contract, Compound access, per-wave surface tables (`Component | v0 primitive`), Non-goals. Confidence: high.

## 2. Component recipe

### 2.1 Folder and barrel

```
packages/quantum/src/components/QuX/
├── QuX.vue                   # shell, or the compound root
├── QuXPart.vue               # one file per compound region (QuDialogTitle.vue)
├── index.ts                  # named exports, types, and the Object.assign compound
└── QuX.browser.test.ts       # real Chromium
```

Emerald keeps every part of a compound inside the root's folder (`EmDialog/EmDialogTitle.vue`); Bootstrap gives each part its own folder (`BDialogTitle/BDialogTitle.vue`) and imports across folders in the root barrel. Use Emerald's layout. Confidence: high.

`src/components/index.ts` gets one line per folder, alphabetical:

```ts
export * from './QuButton'
export * from './QuDialog'
export * from './QuIcon'
```

The folder barrel never `export *`s from a `.vue` file (breaks Volar slot inference). Shell barrel:

```ts
export type { QuButtonProps, QuButtonSize, QuButtonVariant } from './QuButton.vue'

/**
 * Primary action button. Composes v0 `Button.Root` / `Button.Content` (and `Button.Icon` when `icon` is set).
 *
 * @example
 * ```vue
 * <QuButton variant="raised">Save</QuButton>
 * ```
 */
export { default as QuButton } from './QuButton.vue'
```

Compound barrel (Emerald and Bootstrap both use `Object.assign(Root, { Part })`; the `packages/0` rule forbidding `Object.assign` is scoped to `packages/0/src/components/**` and does not apply to `@paper/*`):

```ts
export type { QuDialogActionsProps } from './QuDialogActions.vue'
export { default as QuDialogActions } from './QuDialogActions.vue'
export type { QuDialogActivatorProps } from './QuDialogActivator.vue'
export { default as QuDialogActivator } from './QuDialogActivator.vue'
export type { QuDialogContentProps } from './QuDialogContent.vue'
export { default as QuDialogContent } from './QuDialogContent.vue'
export type { QuDialogProps, QuDialogVariant } from './QuDialog.vue'
export type { QuDialogTextProps } from './QuDialogText.vue'
export { default as QuDialogText } from './QuDialogText.vue'
export type { QuDialogTitleProps } from './QuDialogTitle.vue'
export { default as QuDialogTitle } from './QuDialogTitle.vue'

// Context
import Root from './QuDialog.vue'
import Actions from './QuDialogActions.vue'
import Activator from './QuDialogActivator.vue'
import Content from './QuDialogContent.vue'
import Text from './QuDialogText.vue'
import Title from './QuDialogTitle.vue'

/**
 * Modal dialog. Owns the open state its parts render against.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuDialogTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuDialog>
 *   <QuDialog.Activator />
 *
 *   <QuDialog.Content>
 *     <QuDialog.Title />
 *
 *     <QuDialog.Text />
 *
 *     <QuDialog.Actions />
 *   </QuDialog.Content>
 * </QuDialog>
 * ```
 */
export const QuDialog = Object.assign(Root, {
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

The dot key drops the parent prefix (`QuDialogTitle` is `QuDialog.Title`, `QuListAction` is `QuList.Action`); the root is the compound (no `.Root` key); each member carries a one-line JSDoc; member order is anatomy order. The parts are SPEC.md's (`Activator`, `Content`, `Title`, `Text`, `Actions`, plus `Cancel` and `Confirm`, which follow the `QuDialogActions` shape and are omitted from the sample): MD1 dialogs have no close X, so there is no `QuDialog.Close` (a full-screen dialog closes through `QuToolbar.Nav icon="close"`). `perfectionist/sort-exports` is off, but the lint hook sorts the import block. Confidence: high.

### 2.2 SFC rules

| Rule | Shape | Source | Confidence |
|---|---|---|---|
| Dual script | `<script lang="ts">` holds all imports, exported prop/type interfaces, and any `createContext` trinity; `<script setup lang="ts">` holds zero imports | components.md; every Em* file | high |
| Generic roots | `<script lang="ts" setup generic="T">` (lang before setup only when `generic` is present) | `EmSelect.vue`, `EmTabs.vue` | high |
| Name | `defineOptions({ name: 'QuX' })` first line of setup; add `inheritAttrs: false` + `useAttrs()` + `mergeProps` only when attrs must land on an inner element (`BDialog.vue`) | high |
| Props | destructure with defaults from `defineProps<QuXProps>()`; never `withDefaults` (ESLint `no-restricted-syntax`); defaults live in the destructure, never in the interface | high |
| Prop surface | `Pick<...>` or `Omit<..., 'as' \| 'renderless'>` of the v0 props type with literal key unions; never `keyof`-computed sets (the SFC compiler fails to resolve them while `vue-tsc` passes) | memory `emerald-prop-type-gates` | moderate |
| Spec-only API | no `density`, `ripple` prop that is Vuetify-shaped, `to`, named slots, or `#prepend`; MD1 features are props or parts | DESIGN_SYSTEMS.md rulings 7 and 8 | high |
| Slots | default slot only; `defineSlots<{ default?: () => any }>()` (the `=> any` is the one sanctioned `any`); parts replace named slots | Bootstrap `BButton.vue`; components.md | high |
| Models | `defineModel<boolean>()`; add the explicit `defineEmits<{ 'update:model-value': [value: boolean] }>()` when devtools event tracking matters (Bootstrap does, Emerald does not) | high |
| Data hooks | booleans are `true \| undefined`: `:data-disabled="toValue(disabled) \|\| undefined"`; enums are strings: `:data-variant="variant"`, `:data-size="size"` | EmButton, EmCard, EmTextField | high |
| Reactive props | wrap `MaybeRefOrGetter` props in `toValue()` at every truthy use site (refs are always truthy); pass-throughs to v0 components resolve internally | EmTextField, EmCheckbox, EmSlider | high |
| Class prefix | root `quantum-<component>`, parts `quantum-<component>__<part>`, state via `[data-*]` selectors, never computed class lists | ruling 3 | high |
| Styles | one unscoped `<style>` per SFC; never `scoped` (#359); every design value is `var(--quantum-<token>, <literal>)`; literals appear only as fallbacks. Token names are SPEC.md "Theme and tokens" (`--quantum-font-family`, `--quantum-type-<style>-size/-weight/-leading/-tracking/-transform`, `--quantum-duration-*`, `--quantum-easing-*`, `--quantum-text-*`, `--quantum-radius`, `--quantum-spacing-1..5`, `--quantum-elevation-0..24`); there are no component-scoped tokens (`--quantum-button-*` does not exist), so a value with no token (button height 36px) is a bare literal | ruling 1 and 3; SPEC.md | high |
| No utilities | no UnoCSS or Tailwind classes in package source; structural inline `:style` only when layout cannot work otherwise | ruling 3; memory `feedback_headless_no_utility_classes` | high |
| Glyphs | every glyph draws through `QuIcon`; no inline glyph `<svg>` in a `Qu*` component. The only inline SVG is non-glyph geometry parameterised at runtime (the `QuProgressCircular` arc, the `QuTimePicker` clock), a deviation SPEC.md declares | ruling 6; `EmDialogClose.vue`; SPEC.md Deviations | high |
| Native controls | never compose native form controls (`<select>`, `<input type=checkbox>`); compose v0 (`Checkbox.Root`, `Select.Root`, `Input.Root`) | ruling 2; memory `feedback_v0_components_no_native_html` | high |
| Layout-only parts | plain element + `<slot />` with no v0 wrapper (`EmDialogFooter.vue`, `EmCardHeader.vue`) | high |
| Type guards | `isString`, `isUndefined`, `isNullOrUndefined` from `@vuetify/v0`; the raw comparison lint selectors are scoped to `packages/0`, the house rule applies everywhere | `~/.claude/rules/style.md` | high |
| Naming | single-word locals, `index` not `idx`, `on<Action>` handlers, `_name` prefix on the raw prop when a resolved value supersedes it (`id: _id` then `const id = _id ?? fallbackId`) | EmTextField, implementation.md | high |
| Reactivity | `shallowRef` for primitives, `toRef(() => ...)` for derived values, `computed` only when caching is worth it, `useTemplateRef` for refs | style.md | high |
| Element refs between parts | registry registration (`context.register({ id, value, el })`), never a `watchEffect` push into a parent ref | memory `feedback_registry_element_refs`; `BTabsItem.vue` | high |
| Optional parent context | `createContext<QuXContext \| null>('quantum:x', null)`; a part reads it with `useQuX()` and calls `orphan(part, parent, context)`, a Quantum utility (`src/utilities/context.ts`) that calls `useLogger().warn(`[${part}] rendered outside <${parent}>; its state is inert`)` once in dev (Emerald's `EmIcon` logging precedent, not Bootstrap's `console.warn`); parts backed by a v0 context throw instead | Bootstrap `src/utilities/context.ts` (shape), `EmIcon.vue` (channel) | high |
| Cleanup | `onBeforeUnmount`, never `onUnmounted` | components.md | high |
| Locale copy | `locale.ti('Dialog.close') ?? 'Close'` always with the inline English fallback | `BDialogClose.vue`; eslint rule on packages/0 | high |
| Comments | explain why, never what; JSDoc on exported API | implementation.md | high |

### 2.3 Complete minimal shell: QuButton

Adapted from `EmButton.vue` and cut to the SPEC.md surface: no `loading` (MD1 buttons have no loading state; progress is a `QuProgressCircular` beside the button, ruling 7), and the spec's own forms as props (`dense`, `footer`, `icon`). Literals in the stylesheet are listed in the table under the sample with their source.

```vue
<script lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'

  // Types
  import type { ButtonRootProps } from '@vuetify/v0'

  export type QuButtonVariant = 'flat' | 'raised'

  /**
   * Quantum withholds `loading`, `readonly`, `passive`, `grace`, `value`,
   * `groupNamespace` and `form` from v0's button props: MD1 buttons have no
   * loading state (SPEC.md, ruling 7), and group composition and form
   * association are not part of the MD1 button surface.
   */
  export interface QuButtonProps extends Pick<
    ButtonRootProps,
    'disabled' | 'ariaLabel' | 'name' | 'namespace'
  > {
    variant?: QuButtonVariant
    /** 32 dp, 13 sp: the desktop dense button. */
    dense?: boolean
    /** The persistent footer button: 48 dp flat, full width, no radius. */
    footer?: boolean
    /** A glyph role drawn through QuIcon before the label; icon-only without slot content. */
    icon?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuButton' })

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
  } = defineProps<QuButtonProps>()
</script>

<template>
  <Button.Root
    :aria-label
    class="quantum-button"
    :data-dense="dense || undefined"
    :data-footer="footer || undefined"
    :data-variant="variant"
    :disabled
    :name
    :namespace
  >
    <Button.Icon v-if="icon" class="quantum-button__icon" :namespace>
      <QuIcon :name="icon" />
    </Button.Icon>

    <Button.Content class="quantum-button__content" :namespace>
      <slot />
    </Button.Content>
  </Button.Root>
</template>

<!-- Unscoped: Button.Root is multi-root; a scoped data-v never lands on the <button>. -->
<style>
  .quantum-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 36px;
    min-width: 88px;
    padding: 0 16px;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-button-size, 14px);
    font-weight: var(--quantum-type-button-weight, 500);
    letter-spacing: var(--quantum-type-button-tracking, 0.01em);
    text-transform: var(--quantum-type-button-transform, uppercase);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-button[data-variant='flat'] {
    background: transparent;
    color: var(--quantum-accent, #FF4081);
  }

  .quantum-button[data-variant='raised'] {
    background: var(--quantum-primary, #3F51B5);
    color: var(--quantum-on-primary, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-button:focus-visible {
    outline: none;
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  .quantum-button[data-disabled] {
    color: var(--quantum-button-disabled-text, rgba(0, 0, 0, 0.26));
    cursor: not-allowed;
    pointer-events: none;
  }

  .quantum-button[data-variant='raised'][data-disabled] {
    background: var(--quantum-button-disabled, rgba(0, 0, 0, 0.12));
    box-shadow: none;
  }

  .quantum-button[data-dense] {
    height: 32px;
    font-size: 13px;
  }

  .quantum-button[data-footer] {
    width: 100%;
    height: 48px;
    border-radius: 0;
  }

  /* Icon-only: Button.Root sets data-solo when Button.Icon is the only child. */
  .quantum-button[data-solo] {
    width: 48px;
    min-width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
  }

  .quantum-button__icon {
    display: inline-flex;
    margin-inline-end: var(--quantum-spacing-1, 8px);
  }

  .quantum-button[data-solo] .quantum-button__icon {
    margin: 0;
  }

  .quantum-button__content {
    display: inline-flex;
    align-items: center;
  }
</style>
```

Literals used above (the token notes and SPEC.md are the authority; replace on conflict):

| Literal | Unit | Source | Confidence |
|---|---|---|---|
| height `36px`, min-width `88px`, padding `0 16px`, radius `2px` | px | buttons page (36 dp tall, 88 dp minimum width, 2 dp radius, 16 dp padding), `spec/components/buttons.md`; SPEC.md QuButton. No height, width or padding token exists, so these are bare literals; the radius is `--quantum-radius` | high |
| dense `32px` / `13px`; footer `48px`; solo `48px` | px | buttons page (dense button, persistent footer button, 48 dp icon target), SPEC.md QuButton | high |
| font-size `14px`, weight `500`, `uppercase`, tracking `0.01em` | px / weight / em | typography page Button style (14 sp Medium, all caps, tracking 10), `spec/typography.md`; the tracking unit (1/1000 em) is `low` | high (size, weight, case); low (tracking unit) |
| transition `300ms`, `cubic-bezier(0.4, 0, 0.2, 1)` | ms | motion page standard duration and curve, `spec/motion.md` | high |
| `#FF4081` accent, `#3F51B5` primary, `#FFFFFF` on-primary | hex | SPEC.md Roles (Pink A200, Indigo 500, white), `spec/color.md` | high |
| focus `rgba(0, 0, 0, 0.12)`; disabled text `0.26`; disabled raised fill `0.12` | alpha | buttons page, SPEC.md Ink and state | high |
| elevation-2 triplet | px | `spec/elevation.md` (Vuetify 1.5 `_elevations.styl` recipe; the spec gives dp only) | moderate |
| icon gap `8px` | px | `--quantum-spacing-1`; the icon-to-label gap is not stated on the buttons page | low |
| variant names `flat` / `raised` | none | buttons page (flat and raised; the floating action button is `QuFab`), SPEC.md | high |

### 2.4 Complete compound: QuDialog

Adapted from `EmDialog/*` and cut to SPEC.md's parts (`Activator`, `Content`, `Title`, `Text`, `Actions`; `Cancel` and `Confirm` follow the `Actions` shape and are omitted here). MD1 dialogs have no close X, so there is no `QuDialogClose.vue`. Six files plus the barrel in 2.1. The sample shows the `Dialog.*` path; `variant="alert"` swaps in `AlertDialog.*` with the same parts.

`QuDialog.vue` (renderless root; owns `v-model` and the `quantum:dialog` context):

```vue
<script lang="ts">
  // Framework
  import { createContext, Dialog } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogRootProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export type QuDialogVariant = 'alert' | 'simple' | 'confirmation' | 'full-screen'

  export interface QuDialogContext {
    variant: Readonly<Ref<QuDialogVariant>>
    dismissible: Readonly<Ref<boolean>>
  }

  export interface QuDialogProps extends Omit<DialogRootProps, 'as' | 'renderless'> {
    variant?: QuDialogVariant
    /** `false` disables outside click and Escape so an action must be chosen (dialogs page). */
    dismissible?: boolean
  }

  export const [useQuDialog, provideQuDialog] = createContext<QuDialogContext | null>('quantum:dialog', null)
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialog' })

  defineSlots<{
    /** Activator, content, and the parts inside it. */
    default?: () => any
  }>()

  const { id, namespace, variant = 'alert', dismissible = true } = defineProps<QuDialogProps>()

  const model = defineModel<boolean>()

  provideQuDialog({
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

`QuDialogActivator.vue` (slot host; `renderless` lets a `QuButton` be the trigger without nesting buttons):

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogActivatorProps } from '@vuetify/v0'

  export interface QuDialogActivatorProps extends Omit<DialogActivatorProps, 'as'> {
    /** When true, bind the slot `attrs` onto your own trigger (a QuButton). */
    renderless?: DialogActivatorProps['renderless']
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogActivator' })

  const { renderless = false, namespace } = defineProps<QuDialogActivatorProps>()
</script>

<template>
  <Dialog.Activator v-slot="slotProps" class="quantum-dialog__activator" :namespace :renderless>
    <slot v-bind="slotProps" />
  </Dialog.Activator>
</template>
```

`QuDialogContent.vue` (the native `<dialog>`; `Dialog.Content` renders it, the browser traps focus and paints `::backdrop`; `scrim: false` on every `Dialog.Content` Quantum renders, #910; Escape is the native `cancel` event, prevented while not dismissible because `Dialog.Content` has no `closeOnEscape` prop):

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Context
  import { useQuDialog } from './QuDialog.vue'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Types
  import type { DialogContentProps } from '@vuetify/v0'

  export interface QuDialogContentProps extends Pick<DialogContentProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogContent' })

  defineSlots<{
    /** Title, text, actions. */
    default?: () => any
  }>()

  const { namespace } = defineProps<QuDialogContentProps>()

  const context = useQuDialog()

  orphan('QuDialogContent', 'QuDialog', context)

  const dismissible = toRef(() => context?.dismissible.value ?? true)

  function onCancel (e: Event) {
    if (!dismissible.value) e.preventDefault()
  }
</script>

<template>
  <Dialog.Content
    class="quantum-dialog"
    :close-on-click-outside="dismissible"
    :data-dismissible="dismissible || undefined"
    :data-variant="context?.variant.value"
    :namespace
    :scrim="false"
    @cancel="onCancel"
  >
    <div class="quantum-dialog__sheet">
      <slot />
    </div>
  </Dialog.Content>
</template>

<style>
  .quantum-dialog {
    padding: 0;
    margin: auto;
    border: none;
    background: transparent;
    max-width: calc(100vw - 80px);
    max-height: calc(100vh - 48px);
    overflow: visible;
  }

  /* Native backdrop: Quantum never mounts v0 Scrim (#910). */
  .quantum-dialog::backdrop {
    background: var(--quantum-scrim, rgba(33, 33, 33, 0.46));
  }

  .quantum-dialog__sheet {
    display: flex;
    flex-direction: column;
    width: fit-content;
    min-width: 280px;
    max-width: 560px;
    padding: var(--quantum-spacing-3, 24px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-24, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
    overflow-x: clip;
    overflow-y: auto;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
```

`QuDialogTitle.vue`:

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogTitleProps } from '@vuetify/v0'

  export interface QuDialogTitleProps extends Omit<DialogTitleProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogTitle' })

  const { namespace } = defineProps<QuDialogTitleProps>()
</script>

<template>
  <Dialog.Title class="quantum-dialog__title" :namespace>
    <slot />
  </Dialog.Title>
</template>

<style>
  .quantum-dialog__title {
    margin: 0 0 20px;
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    line-height: 28px;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
```

`QuDialogText.vue` (on `Dialog.Description`, which supplies `aria-describedby`):

```vue
<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogDescriptionProps } from '@vuetify/v0'

  export interface QuDialogTextProps extends Omit<DialogDescriptionProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogText' })

  const { namespace } = defineProps<QuDialogTextProps>()
</script>

<template>
  <Dialog.Description class="quantum-dialog__text" :namespace>
    <slot />
  </Dialog.Description>
</template>

<style>
  .quantum-dialog__text {
    margin: 0;
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
```

`QuDialogActions.vue` (layout-only part; the full implementation sets `stacked` from the measured label widths, SPEC.md, and the sample takes it as a prop):

```vue
<script lang="ts">
  export interface QuDialogActionsProps {
    /** Full-width buttons stacked affirmative above dismissive. */
    stacked?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogActions' })

  defineSlots<{
    /** The consumer's QuButtons, dismissive before affirmative. */
    default?: () => any
  }>()

  const { stacked = false } = defineProps<QuDialogActionsProps>()
</script>

<template>
  <div class="quantum-dialog__actions" :data-stacked="stacked || undefined">
    <slot />
  </div>
</template>

<style>
  .quantum-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--quantum-spacing-1, 8px);
    box-sizing: border-box;
    min-height: 52px;
    padding: var(--quantum-spacing-1, 8px);
    margin: var(--quantum-spacing-3, 24px) calc(-1 * var(--quantum-spacing-3, 24px)) calc(-1 * var(--quantum-spacing-3, 24px));
  }

  .quantum-dialog__actions[data-stacked] {
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
| scrim `rgba(33, 33, 33, 0.46)` | alpha | SPEC.md `--quantum-scrim`, Lead decision 2 (Vuetify 1.5 `_overlay.styl`; the bottom-sheets page's black 20% is `--quantum-scrim-sheet`) | moderate |
| text `rgba(0, 0, 0, 0.87)`, secondary `0.54` | alpha | colour page | high |
| title `20px / 500`, line-height `28px`, `20px` below | px | dialogs page (Medium 20 sp, 28 dp line height, 20 dp to the text) | high |
| body `14px / 400 / 20px` | px | typography page Body 1; Body 1 as the dialog body style is a SPEC.md decision | high (metrics) / low (choice) |
| padding `24px`; actions `52px`, `8px` | px | dialogs page | high |
| radius `2px` | px | `--quantum-radius`; cards and dialogs say "rounded corners" only (Vuetify 2 px) | moderate |
| elevation-24 triplet | px | `spec/elevation.md` (Vuetify 1.5 `_elevations.styl` recipe) | moderate |

Composition facts the sample relies on (all `high`, from `EmDialog*` and v0 rules): `Dialog.Root` is renderless and owns the model; `Dialog.Content` renders the `<dialog>` and calls `showModal()`, takes `closeOnClickOutside`, `blocking` and `scrim` (no `closeOnEscape`: Escape is the native `cancel` event) and emits `cancel` and `close`; `Dialog.Title` and `Dialog.Description` supply `aria-labelledby` / `aria-describedby`; `Dialog.Close` always sets `aria-label` from the locale, so slot text does not rename it (SPEC.md renders `QuDialog.Cancel` on it outside the `alert` variant); `Dialog.Activator` with `renderless` exposes `attrs` (`type`, `role`, `tabindex`, `aria-haspopup`, `aria-expanded`, `data-open`, `onClick`, `onKeydown`) to spread on a `QuButton`; `v-bind="attrs"` is legal only on that renderless path (double-fire hazard otherwise); a dialog needs `createStackPlugin()` installed in tests.

### 2.5 Presentational parts

`EmCard.vue` is the model: `<Atom as="div" class="quantum-card" :data-variant="variant" :data-hoverable="hoverable || undefined">` with a single unscoped stylesheet on the root file that also styles the part classes (`.quantum-card__title`), while `QuCardTitle.vue` is three lines (`defineOptions`, a `<div class="quantum-card__title"><slot /></div>`). Confidence: high.

### 2.6 DS-owned context (when v0 has no primitive)

`EmCalendar/context.ts` shows the shape: `export const [useQuXContext, provideQuXContext] = createContext<QuXContext>()`, a `QU_X_NAMESPACE = 'quantum:x'` constant, parts that default `namespace = QU_X_NAMESPACE` and read `const context = useQuXContext(namespace)`, readonly refs on the context (`Readonly<Ref<T>>`), and functions (`select`, `prev`, `next`) that the parts call from their own event handlers (composables never bind DOM events). Confidence: high.

### 2.7 Import groups the lint hook enforces

`perfectionist/sort-imports` with `commentAbove` headers; the PostToolUse hook (`~/.claude/hooks/lint-fix.sh`, runs `npx eslint --fix` from the nearest `eslint.config.js`) inserts them, so author in this order to avoid churn:

```
// Framework      @vuetify/v0 value imports
// Components     ../QuIcon/QuIcon.vue and anything under /components/
// Context        ./QuX.vue sibling imports
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
| Warnings | `using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})` then `expect(warn).toHaveBeenCalledTimes(1)` and `toHaveBeenCalledWith(expect.stringContaining('nope'))` | same `using spy` form for orphan parts: `using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})` then `expect(spy).toHaveBeenCalledTimes(1)` and `toHaveBeenCalledWith(expect.stringContaining('QuXPart'))` (Quantum's `orphan()` logs one string through `useLogger().warn`, so no `expect.anything()` padding) | high |
| Fake time | `vi.useFakeTimers()` + `vi.setSystemTime(new Date(2026, 7, 4))` for calendar geometry | none | high |

`vitest/browser` also exports `page` (locators, `page.getByRole`); none of the Bootstrap tests use it, and `userEvent` plus DOM queries cover the surface. The `conform()` harness is compat-only (markup diff against upstream fixtures) and does not transfer to Quantum.

### 3.2 Template: QuButton.browser.test.ts

```ts
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { QuButton } from './index'

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

describe('quButton', () => {
  it('should render a native button with the variant hook', async () => {
    const host = mount(() => h(QuButton, { variant: 'raised' }, () => 'Save'))
    await settle()

    const button = host.querySelector('button')!

    expect(button.classList.contains('quantum-button')).toBe(true)
    expect(button.dataset.variant).toBe('raised')
    expect(button.textContent?.trim()).toBe('Save')
  })

  it('should disable natively and expose data-disabled', async () => {
    const host = mount(() => h(QuButton, { disabled: true }, () => 'Stop'))
    await settle()

    const button = host.querySelector('button')!

    expect(button.disabled).toBe(true)
    expect(Object.hasOwn(button.dataset, 'disabled')).toBe(true)
    expect(button.getAttribute('aria-disabled')).toBe('true')
  })

  it('should expose data-dense and data-footer', async () => {
    let clicks = 0
    const host = mount(() => h(QuButton, { dense: true, footer: true, onClick: () => clicks++ }, () => 'Save'))
    await settle()

    const button = host.querySelector('button')!

    expect(Object.hasOwn(button.dataset, 'dense')).toBe(true)
    expect(Object.hasOwn(button.dataset, 'footer')).toBe(true)
    expect(Object.hasOwn(button.dataset, 'loading')).toBe(false)

    await userEvent.click(button)

    expect(clicks).toBe(1)
  })

  it('should name an icon-only button from ariaLabel', async () => {
    const host = mount(() => h(QuButton, { ariaLabel: 'Close' }))
    await settle()

    expect(host.querySelector('button')!.getAttribute('aria-label')).toBe('Close')
  })
})
```

The `data-loading` assertion is negative on purpose: `QuButton` withholds `loading` (SPEC.md QuButton, ruling 7), so the hook must never appear. Confidence for the template shape: high.

Compound tests add `app.use(createStackPlugin())` for dialogs, drive `open` through the model object, and assert `dialog.open`, `aria-labelledby === title.id`, Escape closes, focus returns to the trigger (`BDialog.browser.test.ts` does all four). Keyboard flows in tabs: click the first tab, `{ArrowRight}`, then assert the model and `aria-selected`.

### 3.3 What to assert, by component kind

| Kind | Assert | Confidence |
|---|---|---|
| Shell | root tag, `quantum-*` class, every `data-*` hook for every prop value, native `disabled` plus `aria-disabled="true"` and `tabindex="-1"` (v0 `Button.Root` emits all three; `aria-disabled` is a boolean string in both states), `aria-label` passthrough | high |
| Compound | the root context reaches every part (no orphan warning when nested, one warning when not), `aria-*` relationships (`aria-labelledby`, `aria-controls`, `aria-selected`), roving tabindex (`tabindex` 0 on exactly one item), keyboard map, model round trip | high |
| Overlay | `element.open`, `::backdrop` click behavior, Escape, focus return, `createStackPlugin` installed | high |
| Icon | path data equals the registry glyph, alias resolution, override through the plugin, `aria-hidden` default, `role="img"` with `label`, warn once and render nothing for an unknown role (copy `EmIcon.test.ts`) | high |

### 3.4 Running tests

| Goal | Command (absolute paths, cwd-immune) | Confidence |
|---|---|---|
| One file | `pnpm --dir=/home/john/sites/0/.claude/worktrees/quantum/packages/quantum exec vitest run --config vitest.browser.config.ts src/components/QuButton/QuButton.browser.test.ts` | high (verified `pnpm --dir=... exec vitest --version` on pnpm 11.16.0) |
| Same, the `-C` spelling the assignment quotes | `pnpm -C /home/john/sites/0/.claude/worktrees/quantum/packages/quantum vitest run --config vitest.browser.config.ts <file>` works on pnpm 11.16.0 too (`pnpm -C <dir> exec vitest --version` returned 4.1.11); memory `enterworktree-moves-subagent-shells` reports `-C` failing under pnpm 10/11 in some shells, so prefer `--dir=` | high / low |
| Whole package | `pnpm --filter @paper/quantum test:browser` from the worktree root | high |
| Through the root project list | `pnpm exec vitest run --project quantum:browser` from `/home/john/sites/0/.claude/worktrees/quantum` once `vitest.config.ts` lists the config | high |
| Headed, bail on first | `TEST_BAIL=1 pnpm --filter @paper/quantum test:browser` (`headless: !process.env.TEST_BAIL`) | high |
| Browser binary | `pnpm exec playwright install chromium` (CI also runs `install-deps chromium`); Playwright 1.62.1 is already installed on this machine | high |

Vitest prints `RUN v4.1.11 <root>` first; confirm the root is the quantum worktree before trusting a green (memory `enterworktree-moves-subagent-shells`).

### 3.5 Lint rules on test files (`**/*.test.ts` matches `*.browser.test.ts`)

`it('should ...')` only (`vitest/consistent-test-it`), lowercase first letter in `describe` titles (`describe('quButton')`, the rule autofixes `QuButton` to `quButton`), hooks on top and in order, at most three nested `describe`s, `toHaveBeenCalledTimes(1)` never `toHaveBeenCalledOnce()`, `any` allowed in tests. Zero stderr output: capture expected warnings with `using spy = vi.spyOn(console, 'warn')` and assert on them. Confidence: high.

## 4. Docs recipe

### 4.1 Page frontmatter

Fields the build reads (`apps/docs/build/frontmatter.ts`): `title`, `meta[description]`, `features.{category,label,order,hidden,level,emphasized,devmode}`, `related`. `DocsPageFeatures.vue` reads `features.{github,label,level,renderless}`. `generate-nav.ts` sorts pages by `features.order` (default 999) then name, strips the `C: ` prefix from `label` for the sidebar, and lists `systems` subfolders in `SUBCATEGORY_ORDER.systems`. Confidence: high.

```yaml
---
title: QuButton - Quantum Button for Vue
meta:
- name: description
  content: The Material Design 1 button in flat and raised variants, with dense and persistent-footer forms. Built on Vuetify0's Button.
- name: keywords
  content: quantum button, material design 1 button, vue button, vuetify0 button, paper quantum
features:
  category: Component
  label: 'C: QuButton'
  level: 2
  renderless: false
  order: 1
related:
  - /systems/quantum
  - /systems/quantum/icon
  - /components/actions/button
---
```

| Field | Value | Source | Confidence |
|---|---|---|---|
| `title` | `QuX - Quantum <Name> for Vue` | Emerald `EmButton - Emerald Button for Vue` | high |
| `meta` list indent | column 0 (`- name:`), as every Emerald and Bootstrap page is written and as `docs.md` states; the memory note `feedback_docs_formatting` says two spaces, which contradicts the files on disk | high for the files; contradiction flagged |
| `features.category` | `Component` (pages), `Guide` (index) | Emerald, Bootstrap | high |
| `features.label` | `'C: QuX'`; index `'Quantum'` | high |
| `features.level` | `2` on every systems page read | high |
| `features.renderless` | `false` for shells and for compounds whose root renders an element; `true` only when the root renders nothing (`BTabs`); `EmTabs` says `false` because its root renders a wrapper `div` | high |
| `features.order` | Emerald numbers pages 0 (index), 1 button, 2 text-field, 3 select, 4 dialog ... 29 tooltip; Bootstrap uses `group:` (`overlay`, `disclosure`, `forms`, `content`, `layout`) instead | high |
| `features.group` | parsed only on the `bootstrap-v6` branch (uncommitted `frontmatter.ts` + `generate-nav.ts` + `stores/app.ts` + `utilities/nav.ts` + `useNavNested.ts` + `AppNav.vue` + `AppNavLink.vue` changes); the quantum worktree does not have it, so use `order:` unless that nav work is ported first | high |
| `features.github` | not set on any systems page (the badge links into `packages/0/src/`) | high |
| `related` | the system index first, sibling pages, then the v0 page the component composes | high |

### 4.2 Page body skeleton

Section order for `pages/systems/**` (docs.md "Systems pages use their own section skeleton"): H1, `<DocsPageFeatures :frontmatter />`, lead, Usage, Anatomy, Composed on Vuetify0, Examples, Props, Accessibility. Emerald writes the lead after `<DocsPageFeatures>`; Bootstrap writes it before and adds a `> [!NOTE]` with the upstream reference link. Use the Emerald order plus the Bootstrap reference note (the pinned MD1 page for the component is the equivalent of Bootstrap's upstream link). Headings: Emerald titles the composition section `## Composed on Vuetify0`, Bootstrap `## Composed on v0`; use `Composed on Vuetify0`.

```markdown
# QuButton

<DocsPageFeatures :frontmatter />

Flat and raised variants, a dense form for desktop, and the persistent footer button.

> [!NOTE]
> Reference: [Buttons, Material Design 1 guidelines](<archived spec URL for this component>). Specification and visuals. This page is Vue.

## Usage

`QuButton` is a shell component: fixed anatomy, props for everything, and the default slot is the label.

::: ds-example
/systems/quantum/button/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
</script>

<template>
  <QuButton />
</template>
```

## Composed on Vuetify0

`QuButton` renders v0's [Button](/components/actions/button) compound, `Button.Root` and `Button.Content` (`Button.Icon` when `icon` is set), and adds nothing to its behavior. `Button.Root` emits the `data-disabled` and `data-solo` attributes Quantum's stylesheet hangs off; `data-dense` and `data-footer` are Quantum's own.

## Examples

::: ds-example
/systems/quantum/button/variants

### Flat, raised and footer

Multi-paragraph prose: what the example demonstrates, when to reach for it, the tradeoffs, related parts.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with QuButton.vue until then. -->

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
/systems/quantum/dialog/basic
:::
```

| Rule | Detail | Confidence |
|---|---|---|
| Path to file | `/systems/quantum/<component>/<example>` resolves to `apps/docs/src/examples/systems/quantum/<component>/<example>.vue`; `useExamples` globs `@/examples/**/*.vue` eagerly and matches the key by suffix, so the path has no extension | high |
| One file only | the sandbox entry mounts one component, so systems blocks never list two files (docs.md "Systems exception") | high |
| Heading and prose | lines after the path, starting with `### Title`, become the description slot; Bootstrap puts the title and prose inside the block under `## Examples`, Emerald does the same | high |
| Props produced | `filePath`, `title`, `collapse`, `peek` (no inline description = peek), `disableResize` (`no-resize`, used by the Bootstrap index overview) | high |
| Rendering path | `DocsSystemExample.vue` decides by the second path segment: `emerald` renders inline inside `DocsGenesisExample` with `:theme="emerald-light \| emerald-dark"`; every other system is an `<iframe src="/sandbox/<system>.html?e=<component>/<example>&theme=light\|dark">` | high |
| Inline theme | `GnDocsExamplePreview` applies `data-theme="<name>"` to the preview panel, which is what scopes the DS color block to the example | high |

### 4.4 Example file conventions

| Rule | Detail | Confidence |
|---|---|---|
| Script | `<script setup lang="ts">` first; import components from `@paper/quantum` (never `@vuetify/v0` unless a utility the DS does not re-export); `shallowRef` for primitives | high |
| Layout wrapper | a dedicated class per layout: Emerald uses `emerald-docs-row` (56 uses), `emerald-docs-stack` (83), `emerald-docs-note`, `emerald-docs-caption`, `emerald-docs-card`; Quantum uses `quantum-docs-row` / `quantum-docs-stack` / `quantum-docs-note` | high |
| Example CSS | one unscoped `<style>` per example repeating the wrapper rule (every Emerald example redeclares `.emerald-docs-row`); gap and type come from `var(--quantum-*, literal)`; no element-descendant selectors under a shared class because example CSS is document-global (`.quantum-docs-row span` would paint every span on every page) | high |
| Utility classes | none in systems examples (docs.md "No UnoCSS"); the v0 feature pages do use UnoCSS, so the answer to "allowed in examples?" is: allowed under `examples/components/**` and `examples/composables/**`, not under `examples/systems/**`. Bootstrap examples use `d-flex gap-2` because those are upstream classes loaded in its frame, which is not a precedent for a design system | high |
| Slot props | `v-slot="{ attrs }"` shorthand; `v-bind="attrs"` only on the renderless path | high |
| Icons | `<QuIcon name="..." />` through the DS, never inline SVG (the Bootstrap button example inlines an SVG; compat convention, not DS) | high |
| Status text | `<span v-if="sent" class="quantum-docs-note" role="status">` for feedback after an action | high |
| One concept per file | `basic`, `variants`, `dense`, `icons` for the button; `basic`, `confirm`, `form` for the dialog | high |
| Naming | kebab-case folders and files (`text-field/validation.vue`); no `index.vue` | high |
| knip | every example must be referenced by a page or `pnpm repo:check` fails | high |

Template (adapted from `emerald/button/basic.vue`):

```vue
<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuButton variant="raised">Save changes</QuButton>

    <QuButton>Cancel</QuButton>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
```

(`8px` is `--quantum-spacing-1`, the buttons page's 8 dp between buttons. Confidence for the value: high.)

### 4.5 Index page shape

`apps/docs/src/pages/systems/quantum/index.md`, modeled on Emerald's index (high):

1. Frontmatter: `title: Quantum - Material Design 1 for Vue on Vuetify0`, meta, `features: { category: Guide, label: 'Quantum', level: 2, order: 0 }`, `related:` the component pages.
2. `# Quantum`, `<DocsPageFeatures :frontmatter />`, a two-sentence lead ("Quantum is a design system for Vue, built on Vuetify0. It ships tokens, CSS, and `Qu*` components. v0 handles behavior and accessibility. Quantum handles appearance.").
3. `<DocsSystemActivator palette="quantum" />` (the prop exists; the component reads `PALETTE_ICONS` / `PALETTE_LABELS`).
4. Optional overview example: `::: ds-example no-resize` with `/systems/quantum/overview` (Bootstrap index).
5. `## What Quantum is`, the pinned spec sentence (MD1 as archived, snapshot date), and the escape-hatch sentence.
6. `## Installation`: `::: code-group no-filename` with `bash pnpm` / `npm` / `yarn` / `bun` fences, then a `ts main.ts` fence with `createQuantumPlugin()` and the two CSS imports, then the options table (`{ theme: false }`, `{ icons: false }` with the bundle footnote), then `### Without the plugin`.
7. `## Tokens`: the families table and the `-channels` sentence; `### The v0 bridge`.
8. `## Icons`: role naming, `label` rule, link to the icon page.
9. `## Components`: `| Component | What it wraps | Page |` for every `Qu*`, then the two rules (no named slots; most parts take `namespace`), then the preview `> [!NOTE]`.

### 4.6 Every docs-app file a new system touches

Two rendering paths exist. Pick one before editing.

| Path | Who uses it | Edits needed | Tradeoff | Confidence |
|---|---|---|---|---|
| Inline (Emerald) | a design system with its own tokens and no page reset | `App.vue` token sheet + `DocsSystemExample.vue` system map + `plugins/zero.ts` icons | examples are first-class in the page; CSS is document-global so class discipline matters | high |
| Iframe (Bulma, Bootstrap) | systems that reset `button` / `input`, or whose CSS must not share the docs document | `sandbox/quantum.html` + `src/sandbox/quantum.ts`; nothing in `DocsSystemExample.vue` (anything not `emerald` is framed already) | overlay promotion machinery, lazy frames, no page CSS leakage | high |

MD1 styles components, not the page, so Quantum belongs on the inline path like Emerald. The table below is the inline path; the two iframe files are listed last as the alternative.

Viewport-fixed components (`QuToolbar appBar`, `QuToolbar position="bottom"`, `QuFab position`, `QuBottomNavigation`, `QuSnackbar.Portal`, persistent `QuBottomSheet`) would paint over the docs shell when rendered inline, and `DocsSystemExample.vue` has no per-system opt-in to the iframe path (`SandboxRoot.vue` only promotes fixed elements as overlays on the framed path). Decision, made once before the first example: their examples render inside a `quantum-docs-screen` wrapper (`position: relative; overflow: clip; height: 360px; contain: layout paint`). `contain: layout paint` makes the wrapper the containing block of its `position: fixed` descendants, so no docs-only attribute is added to any component; a `QuSnackbar.Portal` in such an example passes `:teleport="false"` so the portal stays inside the wrapper. The iframe path is not used for Quantum.

| # | File (under `/home/john/sites/0/.claude/worktrees/quantum/`) | Exact change | Confidence |
|---|---|---|---|
| 1 | `apps/docs/package.json` | `"@paper/quantum": "workspace:*",` in `dependencies` after `@paper/genesis` | high (Bootstrap diff) |
| 2 | `apps/docs/vite.config.ts` | in `resolve.alias`: `'@paper/quantum': fileURLToPath(new URL('../../packages/quantum/src', import.meta.url)),` after the emerald alias, and `'#quantum': fileURLToPath(new URL('../../packages/quantum/src', import.meta.url)),` after `#emerald` | high |
| 3 | `apps/docs/tsconfig.examples.json` | `paths`: `"@paper/quantum": ["../../packages/quantum/src"]`, `"@paper/quantum/*": ["../../packages/quantum/src/*"]`; `include`: `"../../packages/quantum/src/**/*.ts"`, `"../../packages/quantum/src/**/*.vue"`; `exclude`: `"../../packages/quantum/src/**/__tests__/*"` | high |
| 4 | `knip.json` | see 1.11 | high |
| 5 | `apps/docs/build/generate-nav.ts` | `systems: ['bulma', 'emerald']` becomes `systems: ['bulma', 'emerald', 'quantum']` (Bootstrap inserted itself first; the list is the sidebar order, pick deliberately) | high |
| 6 | `apps/docs/src/composables/useThemeToggle.ts` | `Palette` union gains `\| 'quantum'`; `PALETTE_THEMES` gains `'quantum': { dark: 'quantum-dark', light: 'quantum-light' },`; `PALETTE_ICONS` gains `'quantum': 'theme-quantum',`; `PALETTE_LABELS` gains `'quantum': 'Quantum',` | high |
| 7 | `apps/docs/src/themes/index.ts` | two `ThemeDefinition` entries, `'quantum-dark'` and `'quantum-light'`, with `id`, `label: 'Quantum'`, `icon: 'theme-quantum'`, `dark`, and the full docs role set (`primary`, `secondary`, `accent`, `error`, `info`, `success`, `warning`, `background`, `surface`, `surface-tint`, `surface-variant`, `divider`, `pre`, every `on-*`, `glass-surface`, `scrollbar-thumb`, `discord`, `vue`, `mastered`, `github`); values mirror the token sheet from step 10 so both stylesheets agree; the entry is required because `PALETTE_THEMES` values are typed `ThemeId = keyof typeof themes` | high |
| 8 | `apps/docs/src/plugins/icons.ts` | `'theme-quantum': '<24x24 path or { $value: [[path, opacity], ...] }>',` next to `theme-emerald` (Emerald uses a three-path object with per-path opacity; Bulma a single path string) | high |
| 9 | `apps/docs/src/components/app/theme/palette/AppPaletteQuantumButton.vue` (new) | copy `AppPaletteEmeraldButton.vue`, replace `emerald` with `quantum`, `theme-emerald` with `theme-quantum`, label `Quantum` | high |
| 9a | `apps/docs/src/components/app/AppThemeMenu.vue` | `<AppPaletteQuantumButton />` after `<AppPaletteBulmaButton />` | high |
| 9b | `apps/docs/src/components/app/settings/AppSettingsTheme.vue` | same line in the palette grid | high |
| 9c | `apps/docs/src/components.d.ts` | regenerated by `unplugin-vue-components` on the next dev/build; commit the added `AppPaletteQuantumButton` line | high |
| 10 | `apps/docs/src/App.vue` | import `{ QuantumStyleSheetAdapter, quantumColors, quantumDarkColors } from '@paper/quantum'` beside the Emerald import; `const quantumAdapter = new QuantumStyleSheetAdapter({ v0Aliases: true, stylesheetId: 'quantum-docs-tokens' })`; in `useHead({ style: [...] })` add `{ key: 'quantum-docs-tokens', id: 'quantum-docs-tokens', innerHTML: quantumAdapter.generate({ 'quantum-light': quantumColors, 'quantum-dark': quantumDarkColors }) }`; append `:not([data-theme="quantum-light"])` to the dot-grid selector chain. Never import `theme.css` or `style.css` here (they paint `--v0-*` on `:root`) and never `app.use(createQuantumPlugin())` (its adapter writes `data-theme` on `<html>` and fights `V0UnheadThemeAdapter`) | high |
| 11 | `apps/docs/src/components/docs/DocsSystemExample.vue` | replace the two hardcoded lines `const framed = toRef(() => segments.value[1] !== 'emerald')` and `const inlineTheme = toRef(() => local.isDark.value ? 'emerald-dark' : 'emerald-light')` with a map: `const INLINE: Record<string, { light: string, dark: string }> = { emerald: { light: 'emerald-light', dark: 'emerald-dark' }, quantum: { light: 'quantum-light', dark: 'quantum-dark' } }`, `const system = toRef(() => segments.value[1] ?? '')`, `const framed = toRef(() => !(system.value in INLINE))`, `const inlineTheme = toRef(() => INLINE[system.value]?.[local.isDark.value ? 'dark' : 'light'] ?? 'light')`. The `INLINE` map carries no per-example flag: fixed components are contained by the `quantum-docs-screen` wrapper described above | moderate (new code; the current file is hardcoded to Emerald) |
| 12 | `apps/docs/src/plugins/zero.ts` | `app.use(createQuantumIconsPlugin())` after `createEmeraldIconsPlugin()` with the matching import; optional because `useQuIcons` falls back to the built-in set, present for parity with Emerald | high |
| 13 | `apps/docs/src/pages/systems/quantum/index.md` and one `.md` per component | section 4.2 and 4.5 | high |
| 14 | `apps/docs/src/examples/systems/quantum/<component>/<example>.vue` | section 4.4 | high |
| 15 | `apps/docs/src/typed-router.d.ts` | regenerated by the router plugin; commit it | high |
| 16 | `apps/docs/src/composables/usePlayground.ts` | `PAPER_CDN` gains `'@paper/quantum'`, `'@paper/quantum/style.css'`, `'@paper/quantum/theme.css'` jsDelivr URLs and `paperImportsFromCode` gains a `@paper/quantum` branch; the URLs 404 until the package is on npm, so "Open in Playground" on Quantum examples cannot resolve before the first publish either way | high (shape), the timing is a decision |
| 17 | `apps/docs/src/components/docs/DocsPaletteBrowse.vue` | optional: add a `quantum` entry to the palette explorer; `md1` is already imported there from `@vuetify/v0/palettes/md1`, so the explorer may already cover the ladders | high |
| 18 | `.github/workflows/docs-deploy.yml` | see 1.11 | high |
| alt-1 | `apps/docs/sandbox/quantum.html` (iframe path only) | copy `sandbox/emerald.html`: blocking script translating `?theme=dark` to `data-theme="quantum-dark"`, `:where(html[data-theme="quantum-light"])` / `quantum-dark` critical colors, the border-box and `body { margin: 0 }` reset, `html { overflow: clip }`, `<script type="module" src="/src/sandbox/quantum.ts">`; `vite.config.ts` reads `sandbox/*.html` from disk so no input list edit | high |
| alt-2 | `apps/docs/src/sandbox/quantum.ts` (iframe path only) | copy `src/sandbox/emerald.ts`: glob `../examples/systems/quantum/**/*.vue`, `new QuantumStyleSheetAdapter().upsert(adapter.generate({ 'quantum-light': quantumColors, 'quantum-dark': quantumDarkColors }))`, `createApp(SandboxRoot, { is, name, themes: { light: 'quantum-light', dark: 'quantum-dark' } }).use(createQuantumIconsPlugin()).mount('#sandbox')`; never install the theme plugin in the frame | high |

Docs pages reference the package by its source alias, so the docs build compiles `packages/quantum/src` directly; no package build is needed to run the docs, but the docs cannot describe an API the package on the same branch lacks (memory `emerald-docs-branch-sequencing`). On this worktree the `systems` tree exists (`bulma`, `emerald`), so pages and package land in the same PR.

## 5. Verification commands

Run from the worktree root unless stated. The quantum worktree already has `node_modules` at the root and in `apps/docs`; after adding `packages/quantum` run `pnpm install` once so the workspace link exists.

| Step | Command | Notes | Confidence |
|---|---|---|---|
| Package typecheck | `pnpm --filter @paper/quantum typecheck` | `vue-tsc --noEmit --incremental`; delete `packages/quantum/node_modules/.tmp/*.tsbuildinfo` when the output quotes a type you already changed | high |
| Package build | `pnpm --filter @paper/quantum build` | tsdown then the bake; check `dist/index.mjs`, `dist/style.css`, `dist/theme.css`, `dist/index.d.mts`; the build is the only gate that catches an unresolvable `defineProps` type | high |
| Tarball contents | `pnpm --filter @paper/quantum pack --pack-destination /tmp/quantum-pack` then `tar -tzf /tmp/quantum-pack/paper-quantum-<version>.tgz` | lists what ships: `dist/**`, `LICENSE-ICONS`, plus the `package.json` and `README.md` every tarball carries, and nothing else; read the listing from the written tarball rather than from the `--dry-run` summary | high |
| Browser tests | section 3.4 | | high |
| Lint | none to run; the PostToolUse hook runs `eslint --fix` on every written `.ts` / `.vue`; run `pnpm lint:fix` once before committing because the pre-push hook fixes the working tree, not the commit | high |
| Docs typecheck | `pnpm --filter docs typecheck` | `vue-tsc --noEmit -p tsconfig.examples.json`: covers `src/examples/**` and the packages listed in `include`, nothing under `apps/docs/src/components` (memory `docs-app-typecheck-gap`; use the `tsconfig.app.json` before/after differential for shell edits) | high |
| Docs build | `pnpm --filter docs build` (SSG only) or `pnpm build:docs` (also builds the `dev` demo) | the `docs-check` CI job runs `pnpm run build:docs` with `SKIP_OG_IMAGES=1` and then lychee offline link check over `apps/docs/dist` | high |
| Docs dev server | `pnpm dev:docs` (port 8000) or `pnpm --filter docs exec vite --port 8010 --strictPort` to dodge the PWA service worker cache of a previous origin | then open `http://localhost:8010/systems/quantum` | high |
| Repo integrity | `pnpm repo:check` (knip + sherif) | knip needs `apps/docs/build/generated/api-whitelist.ts`, which `postinstall` generates | high |
| Full gate | `pnpm validate` (`lint`, `typecheck`, `test:run`) then `pnpm build` | `test:run` includes browser projects, so Chromium must be installed | high |
| Browser check | drive the page with Playwright (global install at `/home/john/.local/share/pnpm/global/5/.pnpm/playwright@1.58.2/node_modules/playwright` or the repo's 1.62.1) and take a screenshot before claiming a page renders | memory `docs-browser-verification` | low |

## 6. Commit and PR conventions

| Rule | Detail | Source | Confidence |
|---|---|---|---|
| Types | `feat(quantum): ...` and `fix(quantum): ...` only for `packages/quantum/src` (they drive changelog and version bumps); `docs(quantum): ...` or `docs: ...` for `apps/docs`; `chore: ...` for root config (`tsconfig.json`, `vitest.config.ts`, `knip.json`, workflows); `test(quantum): ...` for test-only commits | `~/.claude/CLAUDE.md`; `apps/docs/CLAUDE.md` | high |
| Scope spelling | package scope lowercase `quantum`; component scope when specific: `feat(QuButton): ...`, `fix(QuDialog): ...` (Emerald changelog uses `fix(EmCalendar)`) | Emerald `CHANGELOG.md` | high |
| Atomic | one logical unit per commit: package scaffold, each component, root registration, docs registration, each docs page group | memory `feedback_atomic_commits` | high |
| Changeset | one `.changeset/<slug>.md` per change touching `packages/quantum/src`; frontmatter `'@paper/quantum': minor` for new surface, `patch` for fixes; first line is the consumer-facing summary, body only when a consumer must act; CI fails without it | `scripts/changeset-required.js`; releasing skill | high |
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
| 14 | installing `createQuantumPlugin()` (or any `createThemePlugin`) inside the docs app or a sandbox frame makes two writers fight over `data-theme` | docs: adapter `generate()` through `useHead`; sandbox: `adapter.upsert(adapter.generate(...))`; only the icons plugin is installed | `docs.md`; `src/sandbox/emerald.ts` | high |
| 15 | importing `@paper/quantum/theme.css` or `style.css` in the docs shell paints `--v0-*` on `:root` and recolors Genesis chrome | never import `dist/` CSS in `apps/docs`; the docs resolve the package to its source | `App.vue` comment; `docs.md` | high |
| 16 | inline example CSS is document-global (`useExamples` eager-globs every example) | dedicated `quantum-docs-*` classes, no element descendants | `docs.md` | high |
| 17 | `::: ds-example` with two files has no second file to mount | one path per block | `docs.md` | high |
| 18 | `features.group` in frontmatter does nothing on this branch | `order:` until the Bootstrap nav patch is ported (seven docs files) | section 4.1 | high |
| 19 | stale `.tsbuildinfo` reports errors against old source, and CI typechecks the branch merged into master | delete the buildinfo; check `git log HEAD..origin/master` before diagnosing CI failures in untouched files | memory `typecheck-local-vs-ci-divergence` | high |
| 20 | nothing typechecks `apps/docs/src` itself | the `tsconfig.app.json` differential for shell edits (`App.vue`, `DocsSystemExample.vue`) | memory `docs-app-typecheck-gap` | high |
| 21 | a worktree without a full install fails vitest, typecheck and knip in confusing ways | `pnpm install` in the worktree (frozen is fine until the lockfile changes; adding the package changes it) | memory `worktree-node-modules-symlink` | high |
| 22 | `EnterWorktree` from the lead moves subagent shells mid-task | absolute paths everywhere; `pnpm --dir=<worktree>` for gates; read the root vitest prints | memory `enterworktree-moves-subagent-shells` | high |
| 23 | `vitest` swallows `console.*` from inside component source | `process.stderr.write` for temporary instrumentation | memory `vitest-console-intercept` | moderate |
| 24 | `isVisible()` from test-utils is unreliable for `v-show` under happy-dom | assert on `style` containing `display: none`, after two `nextTick`s; moot under the browser runner | memory `vitest-isvisible-vshow-unreliable` | moderate |
| 25 | Vite dev in a worktree serves stale scoped `<style>` after edits | restart the dev server; unscoped styles in package source are unaffected | memory `docs-vite-scoped-style-hmr-stale` | low |
| 26 | `createContext` keys without `:` trigger the `[v0:context]` namespace warning (zero-stderr policy) | `quantum:dialog`, `quantum:tabs`, tests use `quantum:test` | `testing.md` | high |
| 27 | `vitest/prefer-lowercase-title` rewrites `describe('QuButton')` to `describe('quButton')`, which breaks a case-sensitive `-t` filter | name tests `should ...` and filter on a mid-string substring | `eslint.config.js`; memory note in `vitest-isvisible-vshow-unreliable` | high |
| 28 | `__DEV__` and `process.env` are undefined in the browser runner unless defined at config time | copy Bootstrap's `define` block verbatim | `vitest.browser.config.ts` | high |
| 29 | `pnpm -C <dir>` is reported to fail on some pnpm 10/11 builds | `pnpm --dir=<dir> exec ...` worked and `-C` also worked here (pnpm 11.16.0) | section 3.4 | high |
| 30 | `data-bs-theme`-style attribute differences: Quantum keys on `data-theme` like Emerald, so `SandboxRoot`'s `themeAttribute` default is correct and only `themes` needs the name map | | `SandboxRoot.vue` (Bootstrap diff) | high |
| 31 | `locale.ti()` without an inline English fallback leaves an unconfigured app with no accessible name | `?? 'Close'` always (the ESLint rule is scoped to `packages/0`, the contract is not) | `eslint.config.js`; `BDialogClose.vue` | high |
| 32 | the `Object.assign` compound root makes `<QuDialog>` renderable, unlike v0's plain-object namespaces where `<Dialog>` is invalid | document the dot path as an access path, not a nesting claim (Emerald SPEC "Compound access") | Emerald `SPEC.md` | high |
| 33 | hand-rolling a registry, version signal, roving focus or popover positioning that v0 ships | grep `packages/0/src/composables` first; invoke the `vuetify0` skill before writing Vue | memory `feedback_no_handrolled_primitives`; `paper-component` skill | high |
| 34 | `defineProps` interfaces that extend `AtomProps` must not re-declare `as` / `renderless`; DS wrappers `Omit` them instead | `Omit<DialogContentProps, 'as' \| 'renderless'>` | components.md; `EmDialogContent.vue` | high |
| 35 | the root nav list `systems` order and the `order:` numbers are the only sidebar ordering levers on this branch | decide the component order once, in the index page table and the frontmatter together | `generate-nav.ts` | high |

## Also found

- `docs.md` says `meta` items sit at column 0 and every systems page on disk does that; the memory note `feedback_docs_formatting` demands two spaces. Follow the files and `docs.md`.
- `testing.md` names component tests `index.browser.test.ts` for `packages/0`; Emerald names them `EmX.test.ts` on happy-dom and Bootstrap names them `BX.browser.test.ts`. Quantum follows Bootstrap's naming on the browser runner, as the assignment states.
- The `paper-component` skill lists only `pnpm typecheck` as the gate; `emerald-prop-type-gates` shows the build is the stronger gate for SFC prop types.
- `v0` already ships the 2014 Material palette (`@vuetify/v0/palettes/md1`, `TokenCollection` with `50`..`900` and `A100`..`A700` per hue). The color note should decide whether `design-system.ts` imports it or copies it.
- `features.group`, the `NavItemSubheader` nav shape and `PAGE_GROUP_ORDER` exist only as uncommitted work on `bootstrap-v6`; the quantum worktree's `generate-nav.ts` is the pre-patch version with `systems: ['bulma', 'emerald']`.
- `DocsSystemExample.vue` on this branch hardcodes `emerald` as the only inline system; Bootstrap's branch kept that and added dialog-aware overlay classification to `SandboxRoot.vue` for its iframe path. The inline map in 4.6 item 11 is new code.
- `apps/docs/src/plugins/zero.ts` installs `createEmeraldIconsPlugin()` app-wide; this is a registration point the assignment's file list did not name.
- Both `pnpm -C` and `pnpm --dir=` resolve and run `vitest` on pnpm 11.16.0; the memory note claiming `-C` dies with `EACCES` did not reproduce here.
- Vuetify 1.5's `$transition` map (easing curves) and the ambient column of `_elevations.styl` were not read in this session; the two sample fallbacks that depend on them are marked `not found` above.
