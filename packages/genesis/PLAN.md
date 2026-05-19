# Genesis Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land `@paper/genesis` Phase 1 — a self-contained `GnDocsExample` suite + theme/adapter/plugin scaffolding, on the rebased `worktree-paper-genesis` branch.

**Architecture:** Genesis is a paper DS in the categorical sense (built on `@vuetify/v0`, no `@vuetify/paper` runtime dependency). It installs as a Vue plugin via `createGenesisPlugin`, generates `--gn-*` CSS variables under `[data-theme="genesis"]` through a `GenesisStyleSheetAdapter` extending v0's `V0StyleSheetThemeAdapter`. Components use scoped CSS that references `--gn-*` directly, with no per-component indirection layer.

**Tech Stack:** Vue 3.5+, TypeScript, `@vuetify/v0` (`V0StyleSheetThemeAdapter`, `Splitter`, `Tabs`, `createOverflow`, `useElementSize`), tsdown for builds, pnpm workspaces.

**Working directory:** `/home/john/sites/0/.claude/worktrees/paper-genesis/`

**No tests:** Per user preference, this plan ships no `*.test.ts` files. Verification is via `pnpm build`, `pnpm typecheck`, and `pnpm lint:fix`.

---

## File structure

### Create
- `packages/genesis/src/theme.ts` — token definitions (single `genesis` light theme)
- `packages/genesis/src/adapter.ts` — `GenesisStyleSheetAdapter`
- `packages/genesis/src/plugin.ts` — `createGenesisPlugin` + options interface

### Modify
- `packages/genesis/package.json` — drop `@vuetify/paper` from `dependencies`
- `packages/genesis/src/index.ts` — re-export adapter / plugin / theme alongside components
- `packages/genesis/src/components/index.ts` — drop `GnDocsIcon` export
- `packages/genesis/src/components/GnDocsExample/GnDocsExample.vue` — replace `GnDocsIcon` usage with `#reset-icon` slot, retool CSS to `--gn-*`, drop indirection layer
- `packages/genesis/src/components/GnDocsExampleDescription/GnDocsExampleDescription.vue` — retool CSS, drop indirection
- `packages/genesis/src/components/GnDocsExamplePreview/GnDocsExamplePreview.vue` — retool CSS, drop indirection
- `packages/genesis/src/components/GnDocsExampleCode/GnDocsExampleCode.vue` — retool CSS, drop indirection
- `packages/genesis/src/components/GnDocsExampleTabs/GnDocsExampleTabs.vue` — replace 3× `GnDocsIcon` with `#reset-icon` / `#combine-icon` / `#split-icon` slots, retool CSS, drop indirection
- `packages/genesis/src/components/GnDocsExamplePeek/GnDocsExamplePeek.vue` — retool CSS, drop indirection
- `packages/genesis/src/components/GnDocsExampleActions/GnDocsExampleActions.vue` — retool CSS
- `dev/src/Playground.vue` — install `createGenesisPlugin()`, drop `GnDocsIcon` import, wire `DevShikiBlock` to the code slot

### Delete
- `packages/genesis/src/components/GnDocsIcon/` (entire directory)

---

## CSS variable substitution map

Applied across every component's `<style scoped>` block. Every reference to the old token gets replaced with the new one. The per-component indirection layer (the block that defined `--genesis-docs-example-*: var(--v0-*, fallback)`) is **deleted**; downstream references go to `--gn-*` directly.

| Old reference | New reference |
|---|---|
| `var(--v0-surface, ...)` | `var(--gn-surface)` |
| `var(--v0-surface-tint, ...)` | `var(--gn-surface-tint)` |
| `var(--v0-surface-variant, ...)` | `var(--gn-surface-tint)` |
| `var(--v0-on-surface, ...)` | `var(--gn-on-surface)` |
| `var(--v0-on-surface-variant, ...)` | `var(--gn-on-surface-variant)` |
| `var(--v0-on-surface-tint, var(--v0-on-surface, ...))` | `var(--gn-on-surface)` |
| `var(--v0-primary, ...)` | `var(--gn-accent)` |
| `var(--v0-on-primary, ...)` | `var(--gn-on-accent)` |
| `var(--v0-pre, var(--v0-surface, ...))` | `var(--gn-code-bg)` |
| `color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent)` | `var(--gn-divider)` |
| `color-mix(in srgb, var(--v0-on-surface, currentcolor) 18%, transparent)` | `var(--gn-divider)` |
| `color-mix(in srgb, var(--v0-on-surface, currentcolor) 28%, transparent)` | `var(--gn-divider)` |

Hover-state `color-mix` (e.g., `color-mix(in srgb, var(--genesis-docs-example-tabs-tab-bg), currentcolor 8%)`) stays, but the inner var changes to its `--gn-*` equivalent.

---

## Task 1: Rebase the branch onto master

**Files:** none (git state only)

- [ ] **Step 1:** Inspect current branch state

```bash
cd /home/john/sites/0/.claude/worktrees/paper-genesis
git status
git log --oneline -5
```

Expected: on `worktree-paper-genesis`, two genesis commits, uncommitted changes in `dev/`, `packages/genesis/`, untracked dirs `GnDocsExampleActions/`, `GnDocsExamplePanel/`, `GnDocsIcon/`, untracked `dev/src/DevShikiBlock.vue`.

- [ ] **Step 2:** Stash uncommitted + untracked changes

```bash
git stash push -u -m "WIP genesis phase 1 retool"
git status
```

Expected: working tree clean.

- [ ] **Step 3:** Fetch and rebase onto master

```bash
git fetch origin master
git rebase origin/master
```

Expected: clean rebase (no conflicts — genesis files don't overlap with the 6 master commits, which only touch `apps/docs` and `packages/0`).

If a conflict appears, abort with `git rebase --abort` and stop. Do not force-resolve.

- [ ] **Step 4:** Restore the stash

```bash
git stash pop
git status
```

Expected: stashed changes back in working tree.

- [ ] **Step 5:** Reinstall workspace dependencies (master may have moved them)

```bash
pnpm install --frozen-lockfile=false
```

Expected: success. The lockfile may update.

---

## Task 2: Drop `@vuetify/paper` from genesis dependencies

**Files:**
- Modify: `packages/genesis/package.json`

- [ ] **Step 1:** Edit `packages/genesis/package.json`. Replace the `dependencies` block:

Old:
```json
  "dependencies": {
    "@vuetify/paper": "workspace:*",
    "@vuetify/v0": "workspace:*"
  },
```

New:
```json
  "dependencies": {
    "@vuetify/v0": "workspace:*"
  },
```

- [ ] **Step 2:** Resync the workspace lockfile

```bash
pnpm install
```

Expected: lockfile updates, no errors. Genesis no longer has `@vuetify/paper` in its dependency tree.

---

## Task 3: Add `theme.ts`

**Files:**
- Create: `packages/genesis/src/theme.ts`

- [ ] **Step 1:** Create `packages/genesis/src/theme.ts` with the genesis token palette:

```ts
/**
 * Genesis Design System — Token Definitions
 *
 * Docs-tuned palette. Single light theme. Consumers extend `themes` on
 * plugin install to add dark or alternate variants.
 */

export const genesis = {
  'surface': '#FFFFFF',
  'surface-tint': '#F5F5F8',
  'on-surface': '#1A1C1E',
  'on-surface-variant': '#5F6266',
  'divider': '#E0E2E6',
  'accent': '#5F3AED',
  'on-accent': '#FFFFFF',
  'code-bg': '#F8F8FA',
  'code-fg': '#1A1C1E',
} as const

export type GenesisColors = typeof genesis
```

---

## Task 4: Add `adapter.ts`

**Files:**
- Create: `packages/genesis/src/adapter.ts`

- [ ] **Step 1:** Create `packages/genesis/src/adapter.ts`:

```ts
// Framework
import { V0StyleSheetThemeAdapter } from '@vuetify/v0'

export interface GenesisAdapterOptions {
  cspNonce?: string
  stylesheetId?: string
  prefix?: string
}

export class GenesisStyleSheetAdapter extends V0StyleSheetThemeAdapter {
  constructor (options: GenesisAdapterOptions = {}) {
    super({ prefix: 'gn', stylesheetId: 'genesis-theme-stylesheet', ...options })
  }
}
```

- [ ] **Step 2:** Verify v0 exports `V0StyleSheetThemeAdapter`:

```bash
grep -n "V0StyleSheetThemeAdapter" packages/0/src/composables/useTheme/index.ts
```

Expected: at least one `export { V0StyleSheetThemeAdapter ... }` line (currently at line 51).

If the export is missing or renamed, stop and reconcile — do not invent the import path.

---

## Task 5: Add `plugin.ts`

**Files:**
- Create: `packages/genesis/src/plugin.ts`

- [ ] **Step 1:** Create `packages/genesis/src/plugin.ts`. This mirrors `createEmeraldPlugin` shape for sibling consistency:

```ts
// Framework
import {
  createHydrationPlugin,
  createLocalePlugin,
  createLoggerPlugin,
  createStoragePlugin,
  createThemePlugin,
} from '@vuetify/v0'

// Adapters
import { GenesisStyleSheetAdapter } from './adapter'
import { genesis } from './theme'

// Types
import type {
  LocalePluginOptions,
  LoggerPluginOptions,
  StoragePluginOptions,
  ThemePluginOptions,
} from '@vuetify/v0'
import type { App, Plugin } from 'vue'

export interface GenesisPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

function genesisThemeDefaults (): ThemePluginOptions {
  return {
    target: 'html',
    default: 'genesis',
    adapter: new GenesisStyleSheetAdapter(),
    themes: {
      genesis: { colors: genesis },
    },
  }
}

export function createGenesisPlugin (options: GenesisPluginOptions = {}): Plugin {
  return {
    install (app: App) {
      if (options.hydration !== false) {
        app.use(createHydrationPlugin())
      }

      if (options.logger !== false) {
        app.use(createLoggerPlugin(options.logger || {}))
      }

      if (options.storage !== false) {
        app.use(createStoragePlugin(options.storage || {}))
      }

      if (options.locale !== false) {
        app.use(createLocalePlugin(options.locale || { default: 'en' }))
      }

      if (options.theme !== false) {
        const defaults = genesisThemeDefaults()
        const theme = options.theme
          ? { ...defaults, ...options.theme, themes: { ...defaults.themes, ...options.theme.themes } }
          : defaults

        app.use(createThemePlugin(theme))
      }
    },
  }
}
```

- [ ] **Step 2:** Confirm each `create*Plugin` is re-exported from `@vuetify/v0`:

```bash
grep -nE "createHydrationPlugin|createLocalePlugin|createLoggerPlugin|createStoragePlugin|createThemePlugin" packages/0/src/index.ts
```

Expected: each named export present. If any are missing, stop and reconcile.

---

## Task 6: Update `src/index.ts`

**Files:**
- Modify: `packages/genesis/src/index.ts`

- [ ] **Step 1:** Replace contents of `packages/genesis/src/index.ts`:

Old:
```ts
export * from './components'
```

New:
```ts
export * from './adapter'
export * from './components'
export * from './plugin'
export * from './theme'
```

---

## Task 7: Retool `GnDocsExample.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExample/GnDocsExample.vue`

This is the biggest single-file change: drop `GnDocsIcon` import + the `iconRefresh` constant, replace the single-file reset button with a slot-based icon, apply the CSS substitution map, delete the indirection block.

- [ ] **Step 1:** Remove the `GnDocsIcon` import (line 45) and the `iconRefresh` SVG path constant (line 50). After this edit, the script block's imports are: components (`GnDocsExampleActions`, `GnDocsExampleCode`, `GnDocsExampleDescription`, `GnDocsExamplePeek`, `GnDocsExamplePreview`, `GnDocsExampleTabs`) — `GnDocsIcon` removed.

- [ ] **Step 2:** Replace the single-file reset button (inside the `<template v-else-if="code">` block, ~line 162):

Old:
```vue
<button
  aria-label="Reset example"
  title="Reset example"
  type="button"
  @click="onReset"
>
  <GnDocsIcon :icon="iconRefresh" :size="16" />
</button>
```

New:
```vue
<button
  aria-label="Reset example"
  title="Reset example"
  type="button"
  @click="onReset"
>
  <slot name="reset-icon">
    <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
    </svg>
  </slot>
</button>
```

- [ ] **Step 3:** Replace the `<style scoped>` block. The whole block (lines 188–279) becomes:

```css
<style scoped>
  .genesis-docs-example {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--gn-divider);
    border-radius: 0.5rem;
    background: var(--gn-surface);
    color: var(--gn-on-surface);
  }

  .genesis-docs-example__toggle-bar {
    border-top: 1px solid var(--gn-divider);
    background: var(--gn-surface-tint);
  }

  .genesis-docs-example > *:first-child:not(.genesis-docs-example-peek) {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .genesis-docs-example > *:nth-last-child(1 of :not(.genesis-docs-example-peek)) {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .genesis-docs-example > *:nth-last-child(1 of :not(.genesis-docs-example-peek)) .genesis-docs-example__toggle {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .genesis-docs-example__toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.12s;
  }

  .genesis-docs-example__toggle:hover {
    background: var(--gn-surface);
  }

  .genesis-docs-example__meta {
    margin-inline-start: auto;
    color: var(--gn-on-surface-variant);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
  }

  .genesis-docs-example__code {
    overflow: hidden;
    border-top: 1px solid var(--gn-divider);
  }

  .genesis-docs-example__code-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--gn-surface);
    border-bottom: 1px solid var(--gn-divider);
    min-height: 3rem;
  }

  .genesis-docs-example__code-filename {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding-inline: 0.5rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gn-on-accent);
    background: var(--gn-accent);
    border-radius: 0.25rem;
    white-space: nowrap;
  }
</style>
```

- [ ] **Step 4:** Run a per-package typecheck to catch breakage early:

```bash
pnpm --filter @paper/genesis typecheck
```

Expected: success (other files still reference `--v0-*` but those compile fine; this only checks types).

---

## Task 8: Retool `GnDocsExampleDescription.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExampleDescription/GnDocsExampleDescription.vue`

- [ ] **Step 1:** Replace the `<style scoped>` block (lines 85–152) with:

```css
<style scoped>
  .genesis-docs-example-description {
    position: relative;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--gn-divider);
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface-variant);
  }

  .genesis-docs-example-description__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gn-on-surface);
  }

  .genesis-docs-example-description__anchor {
    color: inherit;
    text-decoration: none;
  }

  .genesis-docs-example-description__anchor:hover {
    text-decoration: underline;
  }

  .genesis-docs-example-description__body {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.5;
    transition: max-height 0.3s ease-out;
  }

  .genesis-docs-example-description__fade {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--gn-surface-tint));
  }

  .genesis-docs-example-description__toggle {
    position: absolute;
    inset-inline-end: 0.75rem;
    top: 0.75rem;
    z-index: 1;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--gn-divider);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--gn-on-surface-variant);
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .genesis-docs-example-description__toggle:hover {
    background: color-mix(in srgb, var(--gn-on-surface-variant) 6%, transparent);
    border-color: var(--gn-divider);
  }
</style>
```

---

## Task 9: Retool `GnDocsExamplePreview.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExamplePreview/GnDocsExamplePreview.vue`

- [ ] **Step 1:** Replace the `<style scoped>` block (lines 100–204) with:

```css
<style scoped>
  .genesis-docs-example-preview {
    position: relative;
    padding: 0.5rem;
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface);
  }

  .genesis-docs-example-preview__splitter {
    position: relative;
    width: 100%;
  }

  .genesis-docs-example-preview__panel {
    position: relative;
    min-width: 0;
    padding: 1.5rem;
    background: var(--gn-surface);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .genesis-docs-example-preview__handle {
    position: relative;
    flex-shrink: 0;
    width: 0.25rem;
    margin-inline: 0.25rem;
    border-radius: 9999px;
    background: var(--gn-divider);
    transition: background-color 0.15s;
    cursor: col-resize;
  }

  .genesis-docs-example-preview__handle[data-collapsed] {
    background: transparent;
  }

  .genesis-docs-example-preview__handle:hover,
  .genesis-docs-example-preview__handle[data-state='drag'] {
    background: var(--gn-accent);
  }

  .genesis-docs-example-preview__handle[data-state='drag'] {
    cursor: grabbing;
  }

  .genesis-docs-example-preview__handle-grip {
    position: absolute;
    inset-inline-start: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 1rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface);
    border: 1px solid var(--gn-divider);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
  }

  .genesis-docs-example-preview__handle-grip[data-state='drag'] {
    cursor: grabbing;
  }

  .genesis-docs-example-preview__handle-grip svg {
    fill: currentcolor;
  }

  .genesis-docs-example-preview__indicator {
    position: absolute;
    top: 0.5rem;
    inset-inline-end: 0.5rem;
    z-index: 2;
    padding: 0.125rem 0.375rem;
    background: var(--gn-on-surface);
    color: var(--gn-surface);
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    line-height: 1;
    pointer-events: none;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
  }

  .genesis-docs-example-preview__indicator-enter-active,
  .genesis-docs-example-preview__indicator-leave-active {
    transition: opacity 0.15s;
  }

  .genesis-docs-example-preview__indicator-enter-from,
  .genesis-docs-example-preview__indicator-leave-to {
    opacity: 0;
  }
</style>
```

---

## Task 10: Retool `GnDocsExampleCode.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExampleCode/GnDocsExampleCode.vue`

- [ ] **Step 1:** Replace the `<style scoped>` block (lines 84–159) with:

```css
<style scoped>
  .genesis-docs-example-code {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--gn-code-bg);
    color: var(--gn-code-fg);
  }

  .genesis-docs-example-code__filename {
    position: absolute;
    top: 0.75rem;
    inset-inline-start: 0.75rem;
    z-index: 10;
    padding: 0.125rem 0.375rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    color: var(--gn-on-surface-variant);
    pointer-events: none;
  }

  .genesis-docs-example-code__content {
    overflow-x: auto;
    transition: max-height 0.3s ease-out;
  }

  .genesis-docs-example-code__content :deep(pre),
  .genesis-docs-example-code__fallback {
    margin: 0;
    padding: 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre;
  }

  .genesis-docs-example-code[data-has-filename]:not([data-hide-filename]) .genesis-docs-example-code__content :deep(pre),
  .genesis-docs-example-code[data-has-filename]:not([data-hide-filename]) .genesis-docs-example-code__fallback {
    padding-top: 2.25rem;
  }

  .genesis-docs-example-code__fallback {
    color: var(--gn-on-surface-variant);
  }

  .genesis-docs-example-code__fade {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--gn-code-bg));
  }

  .genesis-docs-example-code__peek-toggle {
    align-self: center;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: var(--gn-accent);
    font: inherit;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .genesis-docs-example-code__peek-toggle:hover {
    opacity: 0.8;
  }
</style>
```

---

## Task 11: Retool `GnDocsExampleTabs.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExampleTabs/GnDocsExampleTabs.vue`

- [ ] **Step 1:** Drop the `GnDocsIcon` import (line 34) and the three icon constants (lines 51–53: `iconRefresh`, `iconCombine`, `iconSplit`).

- [ ] **Step 2:** Replace the action buttons (~lines 145–166) with slot-based icons:

Old:
```vue
<GnDocsExampleActions label="Example actions">
  <button
    v-if="showReset"
    :aria-label="`Reset example`"
    title="Reset example"
    type="button"
    @click="onReset"
  >
    <GnDocsIcon :icon="iconRefresh" :size="16" />
  </button>

  <button
    v-if="showCombine"
    :aria-label="combined ? 'Split files' : 'Combine files'"
    :title="combined ? 'Split files' : 'Combine files'"
    type="button"
    @click="onCombine"
  >
    <GnDocsIcon :icon="combined ? iconSplit : iconCombine" :size="16" />
  </button>
</GnDocsExampleActions>
```

New:
```vue
<GnDocsExampleActions label="Example actions">
  <button
    v-if="showReset"
    aria-label="Reset example"
    title="Reset example"
    type="button"
    @click="onReset"
  >
    <slot name="reset-icon">
      <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
      </svg>
    </slot>
  </button>

  <button
    v-if="showCombine"
    :aria-label="combined ? 'Split files' : 'Combine files'"
    :title="combined ? 'Split files' : 'Combine files'"
    type="button"
    @click="onCombine"
  >
    <slot v-if="combined" name="split-icon">
      <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
      </svg>
    </slot>
    <slot v-else name="combine-icon">
      <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.59,5.41L15.17,4L12,7.17L8.83,4L7.41,5.41L12,10M7.41,18.59L8.83,20L12,16.83L15.17,20L16.58,18.59L12,14L7.41,18.59Z" />
      </svg>
    </slot>
  </button>
</GnDocsExampleActions>
```

- [ ] **Step 3:** Replace the `<style scoped>` block (lines 204–284) with:

```css
<style scoped>
  .genesis-docs-example-tabs {
    display: flex;
    flex-direction: column;
  }

  .genesis-docs-example-tabs__bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--gn-surface);
    border-top: 1px solid var(--gn-divider);
    min-height: 3rem;
  }

  .genesis-docs-example-tabs__list {
    display: contents;
  }

  .genesis-docs-example-tabs__tab {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    white-space: nowrap;
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface);
    border: 1px solid var(--gn-divider);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-docs-example-tabs__tab:hover {
    background: color-mix(in srgb, var(--gn-surface-tint), currentcolor 8%);
  }

  .genesis-docs-example-tabs__tab[data-selected] {
    background: var(--gn-accent);
    color: var(--gn-on-accent);
    border-color: transparent;
  }

  .genesis-docs-example-tabs__tab[data-hidden] {
    visibility: hidden;
    position: absolute;
  }

  .genesis-docs-example-tabs__overflow {
    margin-inline-start: 0.25rem;
    height: 30px;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface);
    border: 1px solid var(--gn-divider);
    cursor: pointer;
  }

  .genesis-docs-example-tabs__all {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gn-on-surface-variant);
    border: 1px solid transparent;
  }
</style>
```

---

## Task 12: Retool `GnDocsExamplePeek.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExamplePeek/GnDocsExamplePeek.vue`

- [ ] **Step 1:** Replace the `<style scoped>` block (lines 39–71) with:

```css
<style scoped>
  .genesis-docs-example-peek {
    position: absolute;
    inset-inline-start: 50%;
    bottom: -0.75rem;
    transform: translateX(-50%);
    z-index: 10;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 0.25rem;
    background: var(--gn-accent);
    color: var(--gn-on-accent);
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: opacity 0.15s, bottom 0.15s;
    touch-action: manipulation;
  }

  .genesis-docs-example-peek:hover {
    opacity: 0.85;
  }

  .genesis-docs-example-peek[data-expanded] {
    bottom: -1.5rem;
  }
</style>
```

---

## Task 13: Retool `GnDocsExampleActions.vue`

**Files:**
- Modify: `packages/genesis/src/components/GnDocsExampleActions/GnDocsExampleActions.vue`

- [ ] **Step 1:** Replace the `<style scoped>` block (lines 24–53) with:

```css
<style scoped>
  .genesis-docs-example-actions {
    margin-inline-start: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .genesis-docs-example-actions :deep(button) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 0.5rem;
    background: transparent;
    color: var(--gn-on-surface-variant);
    border: none;
    border-radius: 0.25rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-docs-example-actions :deep(button:hover) {
    background: color-mix(in srgb, var(--gn-on-surface) 8%, transparent);
    color: var(--gn-on-surface);
  }
</style>
```

---

## Task 14: Delete `GnDocsIcon/` and update `components/index.ts`

**Files:**
- Delete: `packages/genesis/src/components/GnDocsIcon/` (entire directory)
- Modify: `packages/genesis/src/components/index.ts`

- [ ] **Step 1:** Delete the directory:

```bash
rm -rf packages/genesis/src/components/GnDocsIcon
```

- [ ] **Step 2:** Edit `packages/genesis/src/components/index.ts`. Remove the line `export * from './GnDocsIcon'`. Final file:

```ts
export * from './GnDocsExample'
export * from './GnDocsExampleActions'
export * from './GnDocsExampleCode'
export * from './GnDocsExampleDescription'
export * from './GnDocsExamplePanel'
export * from './GnDocsExamplePeek'
export * from './GnDocsExamplePreview'
export * from './GnDocsExampleTabs'
```

- [ ] **Step 3:** Search for any remaining references to `GnDocsIcon` across the workspace:

```bash
grep -rn "GnDocsIcon" --include="*.ts" --include="*.vue" --include="*.json" --exclude-dir=node_modules --exclude-dir=dist .
```

Expected: only matches in `dev/src/Playground.vue` (handled in Task 15) and in this PLAN.md / SPEC.md docs. Zero in `packages/genesis/src/`.

---

## Task 15: Update `dev/src/Playground.vue`

**Files:**
- Modify: `dev/src/Playground.vue`

- [ ] **Step 1:** Drop `GnDocsIcon` from the genesis imports. The named-import block becomes:

```ts
import {
  GnDocsExample,
  GnDocsExampleActions,
  GnDocsExampleCode,
  GnDocsExampleDescription,
  GnDocsExamplePanel,
  GnDocsExamplePeek,
  GnDocsExamplePreview,
  GnDocsExampleTabs,
} from '@paper/genesis'
```

- [ ] **Step 2:** Remove the `useTheme().select('dark')` line (or comment it out). The genesis plugin will manage theming once installed at the app level. If the playground still wants a dark surface for visual contrast against the v0 dev shell, add a hand-rolled dark override in step 3 instead.

- [ ] **Step 3:** Search for any `<GnDocsIcon …>` usages in the template and replace each with the equivalent inline SVG or pass through a custom icon slot. If no template usages remain after step 1's import edit, this step is a no-op — confirm via:

```bash
grep -n "GnDocsIcon" dev/src/Playground.vue
```

Expected: zero matches.

- [ ] **Step 4:** Wire `createGenesisPlugin()` at the app level. Open `dev/src/main.ts` and add the install after `registerPlugins(app)`:

```ts
import { createGenesisPlugin } from '@paper/genesis'
// ...
async ({ app }) => {
  registerPlugins(app)
  app.use(createGenesisPlugin())
}
```

- [ ] **Step 5:** Wire `DevShikiBlock` to the code slot in `Playground.vue` for at least one `GnDocsExampleCode` usage so the Shiki integration is exercised:

```vue
<GnDocsExampleCode v-slot="{ code, language }" :code :language>
  <DevShikiBlock :code :language="language ?? 'text'" />
</GnDocsExampleCode>
```

(Exact placement depends on the existing Playground content — keep the change minimal.)

---

## Task 16: Verification

**Files:** none (verification only)

- [ ] **Step 1:** Build the genesis package

```bash
pnpm --filter @paper/genesis build
```

Expected: tsdown produces `packages/genesis/dist/index.mjs` + `dist/style.css`. No errors.

- [ ] **Step 2:** Typecheck the whole workspace

```bash
pnpm typecheck
```

Expected: success. If failures appear in `apps/docs` related to master commits, investigate but do not assume they're our responsibility — bisect against `origin/master` if unsure.

- [ ] **Step 3:** Lint fix

```bash
pnpm lint:fix
```

Expected: success with no remaining errors. Auto-applied fixes (e.g., reordered imports) should be committed in the next step.

- [ ] **Step 4:** Knip + sherif

```bash
pnpm repo:check
```

Expected: clean. If knip flags Genesis exports as unused, the `dev` workspace's `ignoreDependencies: ["@paper/genesis"]` is already in place; new flags likely come from missing `dev/` imports. Fix the imports rather than padding knip ignores.

- [ ] **Step 5:** Visual smoke test in the dev workspace

```bash
pnpm dev
```

Expected: dev server starts, navigate to the playground route, see `GnDocsExample` rendering with the new `--gn-*` palette (white surface, slate text, purple accent). Resize the splitter, toggle peek mode, click reset, toggle combine. No console errors.

- [ ] **Step 6:** Commit the full Phase 1 work

```bash
git status
git add packages/genesis dev/src/Playground.vue dev/src/main.ts dev/src/DevShikiBlock.vue
git status  # double-check no untracked surprises
git commit -m "feat(genesis): retool to self-contained paper DS with --gn-* tokens

- Drop @vuetify/paper dependency
- Add createGenesisPlugin, GenesisStyleSheetAdapter, theme.ts
- Retool every component to reference --gn-* directly (no --v0-* refs, no per-component indirection layer)
- Replace GnDocsIcon with slot-based icons (with inline SVG defaults)
- Wire dev Playground to createGenesisPlugin and DevShikiBlock"
```

---

## Self-review notes

Spec coverage check applied after writing:

- ✓ Phase 1 work order (SPEC §"Phase 1 work order") maps to Tasks 1–16
- ✓ Token list (SPEC §"Tokens") covered in Task 3
- ✓ Plugin API shape (SPEC §"Plugin API") covered in Task 5
- ✓ Icon slot table (SPEC §"Icon strategy") covered in Tasks 7 (1 slot in `GnDocsExample`) and 11 (3 slots in `GnDocsExampleTabs`)
- ✓ CSS scope rule (SPEC §"Styling") covered by the substitution map and Tasks 7–13
- ✓ Dev workspace integration (SPEC §"Phase 1 work order" #10) covered in Task 15
- ✓ Verification (SPEC §"Phase 1 work order" #11) covered in Task 16

Deferred to Phase 2 / future PRs:
- `GnDocsCallout`, `GnDocsCodeGroup`, `GnDocsKbd`, `GnDocsBadge`, `GnDocsCard`, `GnDocsApi`
- Formal Paper category definition

No placeholders; every step shows the code or command to run.
