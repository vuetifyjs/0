# @paper/genesis — Design Spec

## Identity

A focused **docs-primitives library**: Vue 3 components that documentation sites need (live examples, callouts, code groups, API tables, atomic primitives). Headless on the parts that vary across consumers — code highlighting and icons are slot-injected.

A *paper design system* in the **categorical** sense: built on `@vuetify/v0`. Not a runtime contract — Genesis does **not** depend on `@vuetify/paper`. If patterns prove shared with Emerald or future paper DSs, they can graduate into `@vuetify/paper` later; until then, Paper's runtime stays optional.

## Package shape

```
packages/genesis/
├── package.json          # name: @paper/genesis ; deps: @vuetify/v0 only
├── SPEC.md               # this document
├── src/
│   ├── adapter.ts        # GenesisStyleSheetAdapter extends V0StyleSheetThemeAdapter
│   ├── plugin.ts         # createGenesisPlugin(options)
│   ├── theme.ts          # token definitions (light + dark)
│   ├── index.ts          # re-exports adapter, plugin, theme, components
│   └── components/
│       ├── index.ts
│       ├── GnDocsExample/
│       ├── GnDocsExampleDescription/
│       ├── GnDocsExamplePreview/
│       ├── GnDocsExampleCode/
│       ├── GnDocsExampleTabs/
│       ├── GnDocsExamplePanel/
│       ├── GnDocsExamplePeek/
│       └── GnDocsExampleActions/
```

`GnDocsIcon` is **removed** in this phase; icon slots replace it.

## Tokens

Generated under `[data-theme="genesis"]` as `--gn-*` CSS custom properties. Genesis ships a single light theme; consumers add dark by extending `themes` on plugin install (matches Emerald's pattern).

| Token | Purpose |
|---|---|
| `surface` | Outer example background |
| `surface-tint` | Preview wrap background (the tinted area around the inner preview panel) |
| `on-surface` | Text on `surface` |
| `on-surface-variant` | Muted text (filenames, file counters, peek toggle label) |
| `divider` | All borders, splitter handle line |
| `accent` | Active tab background, filename badge background |
| `on-accent` | Text on `accent` |
| `code-bg` | Code pane background |
| `code-fg` | Code pane text |

Default values shipped in `theme.ts`. Consumer override:

```ts
app.use(createGenesisPlugin({
  theme: {
    themes: {
      genesis: { colors: { surface: '#FFFFFF', accent: '#5F3AED' } },
    },
  },
}))
```

## Plugin API

```ts
export function createGenesisPlugin (options?: GenesisPluginOptions): Plugin

interface GenesisPluginOptions {
  theme?: ThemePluginOptions | false
  locale?: LocalePluginOptions | false
  logger?: LoggerPluginOptions | false
  storage?: StoragePluginOptions | false
  hydration?: boolean
}

export const [createGenesisThemeContext, createGenesisThemePlugin, useGenesisTheme]
```

Shape matches `createEmeraldPlugin` deliberately — each sub-plugin can be disabled with `false`. This is not a contract Paper enforces; it's a convention emerging from sibling DSs.

**Genesis owns its own theme context** via `createPluginContext('genesis:theme', …)`. This is structurally necessary: v0's `createPluginContext` install gate is keyed by namespace and silently no-ops on the second install for the same key, so if a paper DS reuses v0's `createThemePlugin` (namespace `v0:theme`), it collides with v0's own theme plugin and never injects its stylesheet. Genesis's dedicated `'genesis:theme'` namespace lets it coexist with v0's theme system — both plugins install, both adapters write to `adoptedStyleSheets`, both cascades resolve on overlapping subtrees.

Consumers can reach the Genesis theme registry via `useGenesisTheme()` (separate from v0's `useTheme()`).

Default `target` is `'body'` (so `data-theme="genesis"` lands on body and Genesis tokens cascade to descendants without colliding with whatever v0 set on `html` or `#app`).

## Components

### `GnDocsExample` — root orchestrator

```ts
interface GnDocsExampleProps {
  id?: string                  // anchor id for deep linking
  code?: string                // single-file source
  language?: string            // single-file language (default: 'vue')
  fileName?: string            // single-file filename
  files?: GnDocsExampleFile[]  // multi-file (overrides code/language/fileName)
  fileOrders?: (number | undefined)[]
  title?: string               // description heading
  collapse?: boolean           // collapsible description
  peek?: boolean               // truncated code with expand button
  peekLines?: number           // default 6
  disableResize?: boolean      // skip splitter affordance
  hideWidthIndicator?: boolean // hide drag-width indicator
}
```

### Sub-components

| Component | Responsibility |
|---|---|
| `GnDocsExampleDescription` | Heading + optional collapsible body; emits anchor-click |
| `GnDocsExamplePreview` | Wraps preview slot in `Splitter.Root` unless `disableResize`; exposes `reset()`; surfaces drag width on the consumer slot |
| `GnDocsExampleCode` | Single code pane; peek truncation; `<slot :code :language :file-name>` for highlighter (default: `<pre>` fallback) |
| `GnDocsExampleTabs` | Tab list + overflow dropdown for hidden tabs; reset and combine action buttons; `<slot name="reset-icon">` and `<slot name="combine-icon">` with inline-SVG defaults |
| `GnDocsExamplePanel` | Wraps one file's code pane content; provides the structural row inside a tab |
| `GnDocsExamplePeek` | Bottom-anchored expand toggle for peek mode |
| `GnDocsExampleActions` | Toolbar host; renders an `aria-label`-ed group around action buttons |

## Icon strategy

No `GnDocsIcon` component. Action buttons expose icon slots with inline `<svg>` defaults using MDI paths. Slot names:

| Component | Slots | Default icon |
|---|---|---|
| `GnDocsExample` | `reset-icon` (single-file mode reset button) | refresh |
| `GnDocsExampleTabs` | `reset-icon`, `combine-icon`, `split-icon` | refresh / unfold-less / unfold-more |

`GnDocsExamplePeek` is text-only and does not need an icon slot in this phase.

```vue
<GnDocsExampleTabs>
  <template #reset-icon><MyIcon name="refresh" /></template>
  <template #combine-icon><MyIcon name="merge" /></template>
</GnDocsExampleTabs>
```

Zero-config works (defaults render); consumer can override per slot.

## Code highlighting

Consumer-injected via the default slot on `GnDocsExampleCode`:

```vue
<GnDocsExampleCode v-slot="{ code, language }" :code :language>
  <ShikiBlock :code :language />
</GnDocsExampleCode>
```

Genesis ships a `<pre>` fallback only. The dev workspace's `DevShikiBlock.vue` demonstrates Shiki integration as the reference.

## Styling

Each component has a scoped `<style>` block. All color/border references go through `var(--gn-*)`. No `var(--v0-*)`. The current per-component `--genesis-docs-example-*` indirection layer is **removed** — components reference `--gn-*` directly.

## Non-goals

- Playground / Bin / "open in" actions — docs-site concern
- Bundled Shiki — slot consumption only
- Icon library — slot defaults with inline SVG
- Paper composables / V0Paper — deliberately not used
- Buttons / forms / dialogs — out of scope; pair Genesis with another DS for app chrome
- Tests — only when explicitly requested
- `apps/docs/` pages — `dev/src/Playground.vue` is the demo surface

## Phase 1 work order

1. Stash uncommitted changes → rebase `worktree-paper-genesis` onto `master` → restore stash
2. Drop `@vuetify/paper` from `packages/genesis/package.json` dependencies
3. Add `src/adapter.ts` (`GenesisStyleSheetAdapter` extends `V0StyleSheetThemeAdapter` from `@vuetify/v0`)
4. Add `src/theme.ts` (single light theme `genesis`; dark is consumer-extended)
5. Add `src/plugin.ts` (`createGenesisPlugin`)
6. Update `src/index.ts` to re-export adapter / plugin / theme alongside components
7. Retool every component's scoped CSS: `var(--v0-*)` → `var(--gn-*)`; remove the `--genesis-docs-example-*` indirection layer
8. Delete `src/components/GnDocsIcon/`; replace inline-icon usages with slots + inline-SVG defaults on `GnDocsExampleActions`, `GnDocsExampleTabs`, `GnDocsExample` itself
9. Finish `GnDocsExampleActions` and `GnDocsExamplePanel` (currently untracked)
10. Update `dev/src/Playground.vue`: install `createGenesisPlugin()`, wire `DevShikiBlock` to the code slot, drop the `GnDocsIcon` import
11. Verify: `pnpm build` (genesis package), `pnpm typecheck`, `pnpm lint:fix`

## Phase 2 roadmap

In priority order:

1. `GnDocsCallout` (TIP / WARNING / ERROR / INFO admonitions)
2. `GnDocsCodeGroup` (tabbed code blocks)
3. `GnDocsKbd`, `GnDocsBadge`, `GnDocsCard` (atomic primitives)
4. `GnDocsApi` (API reference tables with prop / event / slot sections + hover popovers)

## Deferred / parked questions

- **What is Paper, formally?** Concept vs. foundation — parked as "category for now." Revisit once Emerald and Genesis have shipped real users and we can see which patterns naturally converge.
- **Should `@vuetify/paper`'s runtime (V0Paper, the 7 style composables) survive in its current form?** Defer until at least three paper DSs exist and the usage tells us.
