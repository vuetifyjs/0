---
title: Tree-Shaking - Bundle Size Optimization
features:
  order: 7
  level: 2
meta:
  - name: description
    content: Understand how Vuetify0 tree-shakes. Learn import strategies, bundle size costs, and optimization techniques for production Vue 3 applications.
  - name: keywords
    content: vuetify0, tree-shaking, bundle size, optimization, imports, subpath exports, dead code elimination, Vue 3
related:
  - /guide/fundamentals/building-frameworks
  - /guide/fundamentals/composables
  - /guide/fundamentals/components
  - /introduction/getting-started
---

# Tree-Shaking

v0 is fully tree-shakeable. Import what you need — unused code is eliminated during bundling. No configuration required.

<DocsPageFeatures :frontmatter />

> [!TIP]
> v0 has no side effects that prevent tree-shaking. Modern bundlers (Vite, Rollup, webpack 5) handle this automatically.

## Import Strategies

v0 provides two ways to import: root imports and subpath imports. Both tree-shake correctly.

### Root Imports

```ts
import { createSelection, useTheme, Atom } from '@vuetify/v0'
```

The simplest approach. Your bundler eliminates everything you don't use. This is the **recommended default** for most applications.

### Subpath Imports

```ts
import { createSelection } from '@vuetify/v0/composables'
import { Atom } from '@vuetify/v0/components'
import { isObject } from '@vuetify/v0/utilities'
import { IN_BROWSER } from '@vuetify/v0/constants'
import type { ID } from '@vuetify/v0/types'
```

Subpath imports narrow the module scope, giving bundlers less work to analyze. The size difference is minimal (~0.4 KB) but subpaths can improve build speed on large projects.

### Adapter Subpaths

Composables with optional adapters have dedicated subpaths that isolate their dependencies:

```ts
import { useDate } from '@vuetify/v0/date'
import { useFeatures } from '@vuetify/v0/features'
import { useStorage } from '@vuetify/v0/storage'
import { useTheme } from '@vuetify/v0/theme'
import { useLocale } from '@vuetify/v0/locale'
import { useLogger } from '@vuetify/v0/logger'
import { usePermissions } from '@vuetify/v0/permissions'
import { createDataTable } from '@vuetify/v0/data-table'
```

These are primarily useful for **framework authors** who want to guarantee that adapter peer dependencies (like `date-fns` or `flagsmith`) don't leak into consumer bundles.

## Bundle Size

All sizes measured with Vue externalized (v0 code only), minified with esbuild.

### What Things Cost

| Import | Raw | Gzip |
| - | - | - |
| Constants (`IN_BROWSER`, `SUPPORTS_TOUCH`) | <span class="whitespace-nowrap">0.2 KB</span> | <span class="whitespace-nowrap">0.1 KB</span> |
| Utilities (`isObject`, `mergeDeep`, `clamp`) | <span class="whitespace-nowrap">1.0 KB</span> | <span class="whitespace-nowrap">0.5 KB</span> |
| Single composable (`createSelection`) | <span class="whitespace-nowrap">10.7 KB</span> | <span class="whitespace-nowrap">4.2 KB</span> |
| Single composable + component (`SelectionRoot`, `SelectionItem`) | <span class="whitespace-nowrap">13.6 KB</span> | <span class="whitespace-nowrap">5.2 KB</span> |
| Deep chain (`createStep` → `createSingle` → `createSelection` → `createRegistry`) | <span class="whitespace-nowrap">11.9 KB</span> | <span class="whitespace-nowrap">4.6 KB</span> |
| 6 composables (`createSelection`, `createSingle`, `createGroup`, `createStep`, `createRegistry`, `useStorage`) | <span class="whitespace-nowrap">16.5 KB</span> | <span class="whitespace-nowrap">6.2 KB</span> |
| 4 component families (Selection, Dialog, Checkbox, Tabs) | <span class="whitespace-nowrap">29.6 KB</span> | <span class="whitespace-nowrap">10.1 KB</span> |
| Everything (`import *`) | <span class="whitespace-nowrap">147.4 KB</span> | <span class="whitespace-nowrap">42.4 KB</span> |

> [!TIP]
> A single composable is **7%** of the full library. Most apps use a fraction of v0.

### Composable Sharing

Composables share internal code. Adding more composables doesn't multiply cost linearly — they reuse the same foundation layer (registry, context, utilities).

| Composables | v0 Cost (gzip) | Per-Composable |
|-------------|----------------|----------------|
| 1           | 4.2 KB         | 4.2 KB         |
| 6           | 6.2 KB         | 1.0 KB         |

### Root vs Subpath

| Scenario          | Root   | Subpath | Difference |
|-------------------|--------|---------|------------|
| Single composable | 4.4 KB | 4.2 KB  | 0.2 KB     |
| 6 composables     | 6.4 KB | 6.2 KB  | 0.2 KB     |

The difference is negligible. Use whichever import style you prefer.

### Dead Code Elimination

Unused imports are eliminated even without subpaths:

```ts
// Only createSelection is used — the rest is removed
import {
  createSelection,
  createGroup,     // dead code
  createStep,      // dead code
  useStorage,      // dead code
  createTokens,    // dead code
} from '@vuetify/v0'

const [use, provide, ctx] = createSelection()
```

This produces the same bundle size as importing only `createSelection`.

## How It Works

v0's tree-shaking relies on three mechanisms:

### 1. ESM Exports

v0 ships ES modules with individual exports. Bundlers can statically analyze which exports are used and eliminate the rest.

### 2. Side-Effect-Free Annotations

Utility functions are annotated with `/*#__NO_SIDE_EFFECTS__*/` so bundlers know they're safe to remove when unused:

```ts
/*#__NO_SIDE_EFFECTS__*/
function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object'
}
```

### 3. Subpath Exports

The `package.json` defines [subpath exports](https://nodejs.org/api/packages.html#subpath-exports) that map to individual entry points:

```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./components": "./dist/components/index.mjs",
    "./composables": "./dist/composables/index.mjs",
    "./utilities": "./dist/utilities/index.mjs",
    "./constants": "./dist/constants/index.mjs",
    "./types": "./dist/types/index.mjs",
    "./date": "./dist/date/index.mjs",
    "./theme": "./dist/theme/index.mjs"
  }
}
```

## Verifying Your Bundle

Use [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) to inspect what v0 code ends up in your bundle:

```ts vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true }),
  ],
})
```

Run `vite build` and a treemap opens in your browser showing exactly which v0 modules are included.

::: faq

??? Do I need to configure anything for tree-shaking?

No. v0 tree-shakes out of the box with Vite, Rollup, and webpack 5. No plugins, no babel transforms, no special configuration.

??? Should I use root imports or subpath imports?

Either works. Root imports (`from '@vuetify/v0'`) are simpler and recommended for most apps. Subpath imports save ~0.2 KB gzip and can marginally improve build speed. Use subpaths when authoring a library that depends on v0.

??? Does `sideEffects: false` matter?

v0 functions are already annotated as side-effect-free. Adding `sideEffects: false` to your own `package.json` won't change v0's bundle contribution — the improvement is negligible (~0 KB in our testing).

??? What's the base cost of using v0?

A single composable adds ~4.2 KB gzip. Constants and utilities are even lighter (0.1–0.5 KB gzip). The full library is 42.4 KB gzip, but no app should import everything.

??? Why is my bundle larger than expected?

Check for: (1) `import *` which pulls in everything, (2) dynamic imports that prevent static analysis, (3) older bundlers that don't support ESM tree-shaking. Use the visualizer plugin above to diagnose.

:::
