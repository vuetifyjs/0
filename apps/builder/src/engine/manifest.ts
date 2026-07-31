// Data
import maturity from '#v0/maturity.json'

// Types
import type { FrameworkManifest } from '@/data/types'
import type { KnownAlias } from '@/plugins/rules/defaults'

export interface PlaygroundInput extends FrameworkManifest {
  /** Saved plugin config, so the preview boots the framework the user configured. */
  pluginConfig?: Record<string, unknown>
}

// Draft-level features are on the roadmap but are NOT exported from @vuetify/v0
// yet, so emitting one breaks the starter build with TS2551. The picker gates
// components via data/components.ts; this is the emission-side gate and also
// covers the draft composables, which that catalogue does not list.
const DRAFT: ReadonlySet<string> = new Set(
  ['components', 'composables'].flatMap(kind => {
    const entries = (maturity as unknown as Record<string, Record<string, { level: string }>>)[kind]
    return Object.entries(entries).filter(([, entry]) => entry.level === 'draft').map(([id]) => id)
  }),
)

// Theme tokens the generated demos style against, with the fallback baked into
// the emitted `var()`. useTheme only writes a variable for a token the user's
// palette actually defines, and an undefined one makes the whole `color-mix()`
// declaration invalid — borders and text silently collapse to black. The
// fallback keeps a partial palette rendering.
const TOKENS: Record<string, string> = {
  'primary': '#3b82f6',
  'secondary': '#64748b',
  'accent': '#6366f1',
  'error': '#ef4444',
  'background': '#ffffff',
  'surface': '#ffffff',
  'surface-variant': '#f5f5f5',
  'divider': '#e0e0e0',
  'on-primary': '#ffffff',
  'on-surface': '#212121',
  'on-surface-variant': '#666666',
}

// Stand-in palette for the playground when the user did not configure theming.
// The preview would otherwise render unstyled, since every demo classname
// resolves through a --v0-* variable that only useTheme writes.
const PREVIEW_THEME = {
  default: 'light',
  themes: {
    light: {
      dark: false,
      colors: {
        'primary': '#3b82f6',
        'secondary': '#64748b',
        'accent': '#6366f1',
        'error': '#ef4444',
        'background': '#ffffff',
        'surface': '#ffffff',
        'surface-variant': '#f5f5f5',
        'divider': '#e0e0e0',
        'on-primary': '#ffffff',
        'on-surface': '#212121',
        'on-surface-variant': '#666666',
      },
    },
  },
}

interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
}

const V0 = '@vuetify/v0'

// Local module the generated date adapter stub is written to.
const DATE_STUB = './adapters/date'

// Plugin id → factory function name. Used by generateMainTs to emit
// `app.use(createXPlugin(...))` calls for the user's selected plugins.
const FACTORY: Record<string, string> = {
  useTheme: 'createThemePlugin',
  useBreakpoints: 'createBreakpointsPlugin',
  useLocale: 'createLocalePlugin',
  useRtl: 'createRtlPlugin',
  useStorage: 'createStoragePlugin',
  useHydration: 'createHydrationPlugin',
  useLogger: 'createLoggerPlugin',
  useStack: 'createStackPlugin',
  useFeatures: 'createFeaturesPlugin',
  usePermissions: 'createPermissionsPlugin',
  useDate: 'createDatePlugin',
  useNotifications: 'createNotificationsPlugin',
  useRules: 'createRulesPlugin',
  useReducedMotion: 'createReducedMotionPlugin',
  useTooltip: 'createTooltipPlugin',
}

// Install order, not declaration order. A plugin that another resolves at
// install time has to be installed first: `persist: true` reads the
// `v0:storage` context inside provide() (createPlugin's getPersistedStorage,
// which throws rather than falling back), and createRules reads locale.
const ORDER = [
  'useHydration',
  'useStorage',
  'useLogger',
  'useBreakpoints',
  'useRtl',
  'useTheme',
  'useLocale',
  'useDate',
  'useRules',
  'usePermissions',
  'useFeatures',
  'useStack',
  'useNotifications',
  'useReducedMotion',
  'useTooltip',
]

// Per-plugin adapter handler. The `adapter` slot in saved config is a STRING
// (e.g. 'V0DateAdapter', 'none', 'KnockNotificationsAdapter'), but the
// generated code must emit a class INSTANCE — JSON-stringifying it would
// produce broken TS (`adapter: "V0DateAdapter"`). Each handler returns:
//   - `raw`: the raw TS expression to inject into the config (or `null` to
//     omit the adapter field entirely)
//   - `imports`: class names that need to be added to the import list
//   - `from`: the module those names resolve from. Only a subset of adapters
//     live on the root barrel; the rest ship on dedicated subpath exports.
//   - `note`: comment lines emitted above the call when the adapter cannot be
//     constructed for the user (see BYOC below)
interface AdapterEmit {
  raw: string | null
  imports: string[]
  from: string
  note: string[]
}

type AdapterHandler = (adapter: string | undefined) => AdapterEmit

// Bring-your-own-client adapters. Every third-party adapter takes a live
// provider instance the builder has no way to construct, so emitting
// `new PostHogFeaturesAdapter()` would not compile — and the logger adapters
// throw on a missing instance at runtime. These emit the plugin without an
// adapter plus the exact lines needed to wire one up.
interface Wiring {
  from: string
  /** What the constructor wants, named for the TODO. */
  needs: string
  /** Import of the provider client, where the package API is unambiguous. */
  client?: string
  /** The argument list to pass, matching `client` when present. */
  arg: string
  deps: Record<string, string>
}

const BYOC: Record<string, Wiring> = {
  ConsolaLoggerAdapter: {
    from: V0,
    needs: 'a consola instance',
    client: `import { consola } from 'consola'`,
    arg: 'consola',
    deps: { consola: '^3.2.3' },
  },
  PinoLoggerAdapter: {
    from: V0,
    needs: 'a pino instance',
    client: `import pino from 'pino'`,
    arg: 'pino()',
    deps: { pino: '^9.5.0' },
  },
  PostHogFeaturesAdapter: {
    from: `${V0}/features/adapters/posthog`,
    needs: 'a PostHog client',
    client: `import posthog from 'posthog-js'`,
    arg: 'posthog',
    deps: { 'posthog-js': '^1.0.0' },
  },
  LaunchDarklyFeaturesAdapter: {
    from: `${V0}/features/adapters/launchdarkly`,
    needs: 'an initialized LDClient',
    arg: 'client',
    deps: { 'launchdarkly-js-client-sdk': '^3.0.0' },
  },
  FlagsmithFeaturesAdapter: {
    from: `${V0}/features/adapters/flagsmith`,
    needs: 'a Flagsmith client and its init config',
    arg: 'client, options',
    deps: { '@flagsmith/flagsmith': '^11.0.0' },
  },
  KnockNotificationsAdapter: {
    from: `${V0}/notifications`,
    needs: 'a Knock feed',
    arg: 'feed',
    deps: {},
  },
  NovuNotificationsAdapter: {
    from: `${V0}/notifications`,
    needs: 'a Novu client',
    arg: 'novu',
    deps: {},
  },
}

// npm packages an adapter drags in as a hard runtime requirement.
const ADAPTER_DEPS: Record<string, Record<string, string>> = {
  // Both the shipped adapter and the generated stub import @vuetify/v0/date,
  // which statically imports the Temporal polyfill.
  V0DateAdapter: { '@js-temporal/polyfill': '^0.5.1' },
  CustomDateAdapter: { '@js-temporal/polyfill': '^0.5.1' },
}

function byoc (adapter: string, factory: string): AdapterEmit {
  const wiring = BYOC[adapter]
  const lines = [
    `// TODO: ${adapter} needs ${wiring.needs}. Wire it up with:`,
    ...(wiring.client ? [`//   ${wiring.client}`] : []),
    `//   import { ${adapter} } from '${wiring.from}'`,
    `//   app.use(${factory}({ adapter: new ${adapter}(${wiring.arg}) }))`,
  ]

  return { raw: null, imports: [], from: wiring.from, note: lines }
}

const ADAPTER_HANDLERS: Record<string, AdapterHandler | undefined> = {
  useDate: adapter => {
    if (adapter === 'custom') {
      return {
        raw: 'new CustomDateAdapter()',
        imports: ['CustomDateAdapter'],
        from: DATE_STUB,
        note: [],
      }
    }
    return { raw: 'new V0DateAdapter()', imports: ['V0DateAdapter'], from: `${V0}/date`, note: [] }
  },
  useLogger: adapter => {
    if (adapter && adapter in BYOC) return byoc(adapter, 'createLoggerPlugin')
    return { raw: 'new V0LoggerAdapter()', imports: ['V0LoggerAdapter'], from: V0, note: [] }
  },
  useNotifications: adapter => {
    if (adapter && adapter in BYOC) return byoc(adapter, 'createNotificationsPlugin')
    return { raw: null, imports: [], from: V0, note: [] }
  },
  useFeatures: adapter => {
    if (adapter && adapter in BYOC) return byoc(adapter, 'createFeaturesPlugin')
    return { raw: null, imports: [], from: V0, note: [] }
  },
}

// Plugins whose saved config is constrained to a known option contract. Any
// other key in the store is dropped rather than emitted as an invalid option.
const KEYS: Record<string, string[]> = {
  useLocale: ['default', 'fallback', 'messages', 'persist'],
  usePermissions: ['permissions'],
  useReducedMotion: ['mode', 'persist'],
  useRules: ['aliases'],
  useTheme: ['default', 'foreground', 'palette', 'persist', 'rgb', 'target', 'themes'],
  useTooltip: ['openDelay', 'closeDelay', 'skipDelay', 'disabled'],
}

// Predicate source for each name in KNOWN_ALIASES. RulesOptions.aliases maps a
// name to a function, so these cannot be JSON-serialized — every selected alias
// is emitted as a real implementation. Keying on KnownAlias makes the rules form
// the source of truth: a name added there without a predicate here fails to
// compile, and a predicate here for a name the form does not offer is rejected.
const ALIASES: Record<KnownAlias, string> = {
  required: `(v: unknown) => (v !== null && v !== undefined && v !== '') || 'This field is required'`,
  email: String.raw`(v: unknown) => /.+@.+\..+/.test(String(v ?? '')) || 'Must be a valid email'`,
  min: `(v: unknown) => String(v ?? '').length >= 3 || 'Must be at least 3 characters'`,
  max: `(v: unknown) => String(v ?? '').length <= 20 || 'Must be at most 20 characters'`,
  pattern: String.raw`(v: unknown) => /^[\w-]+$/.test(String(v ?? '')) || 'Must be letters, numbers, dashes or underscores'`,
  url: `(v: unknown) => URL.canParse(String(v ?? '')) || 'Must be a valid URL'`,
  numeric: `(v: unknown) => (v !== '' && !Number.isNaN(Number(v))) || 'Must be a number'`,
}

// Own-property, not `in` — `'toString' in ALIASES` is true via the prototype
// chain, and a user is free to name an alias that.
function isAlias (name: string): name is KnownAlias {
  return Object.hasOwn(ALIASES, name)
}

function isEmpty (value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value !== 'object') return false
  if (Array.isArray(value)) return value.length === 0
  return Object.keys(value as Record<string, unknown>).length === 0
}

function indent (text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text.replaceAll('\n', `\n${pad}`)
}

// Always a copy: emitPluginCall strips the adapter key, and the store's config
// object is shared across every generator call.
function toRecord (value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return { ...value as Record<string, unknown> }
}

// Restrict a plugin's saved config to its known option keys. Screens have
// changed shape over time; anything not on the contract is stale and would
// emit an option the plugin does not accept.
function prune (pluginId: string, config: Record<string, unknown>): Record<string, unknown> {
  const allowed = KEYS[pluginId]
  if (!allowed) return config

  const next: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in config) next[key] = config[key]
  }
  return next
}

// Format the leftover (non-adapter) config fields as a list of `key: value`
// snippets, each line indented to sit inside an outer `{ … }` two spaces in.
function formatRestFields (rest: Record<string, unknown>): string[] {
  const fields: string[] = []
  for (const [key, value] of Object.entries(rest)) {
    const json = JSON.stringify(value, null, 2)
    fields.push(`${key}: ${indent(json, 2)}`)
  }
  return fields
}

// Emit the `aliases` option of createRulesPlugin. The stored value is a list of
// alias NAMES; each becomes a real predicate so the emitted object satisfies
// RulesOptions['aliases'].
function formatAliases (names: unknown): string | null {
  if (!Array.isArray(names) || names.length === 0) return null

  const lines = names
    .filter((name): name is string => typeof name === 'string')
    .map(name => {
      const body = isAlias(name) ? ALIASES[name] : `(v: unknown) => true /* TODO: implement */`
      return `    ${name}: ${body},`
    })

  if (lines.length === 0) return null

  return `aliases: {\n${lines.join('\n')}\n  } satisfies RulesOptions['aliases']`
}

interface PluginEmit {
  call: string
  imports: Array<{ name: string, from: string }>
  types: Array<{ name: string, from: string }>
  /** Adapter class names the plugin resolved to, imported or not. */
  adapters: string[]
}

function emitPluginCall (pluginId: string, factory: string, config: unknown): PluginEmit {
  const handler = ADAPTER_HANDLERS[pluginId]
  const cfg = prune(pluginId, toRecord(config))

  const imports: Array<{ name: string, from: string }> = []
  const types: Array<{ name: string, from: string }> = []
  const adapters: string[] = []
  const fields: string[] = []

  let note: string[] = []

  if (handler) {
    const adapter = typeof cfg.adapter === 'string' ? cfg.adapter : undefined
    const emit = handler(adapter)

    note = emit.note

    if (emit.raw !== null) fields.push(`adapter: ${emit.raw}`)
    for (const name of emit.imports) imports.push({ name, from: emit.from })

    if (adapter) adapters.push(adapter)
    adapters.push(...emit.imports)
  }

  delete cfg.adapter

  if (pluginId === 'useRules') {
    const aliases = formatAliases(cfg.aliases)
    if (aliases !== null) {
      fields.push(aliases)
      types.push({ name: 'RulesOptions', from: V0 })
    }
  } else if (handler || !isEmpty(cfg)) {
    fields.push(...formatRestFields(cfg))
  }

  const prefix = note.length > 0 ? `${note.join('\n')}\n` : ''

  if (fields.length === 0) {
    return { call: `${prefix}app.use(${factory}())`, imports, types, adapters }
  }

  const body = fields.map(line => `  ${line},`).join('\n')

  return { call: `${prefix}app.use(${factory}({\n${body}\n}))`, imports, types, adapters }
}

function toSet (value: Set<string> | string[]): Set<string> {
  return value instanceof Set ? value : new Set(value)
}

function selectedPluginIds (
  selected: Set<string>,
  pluginConfig: Record<string, unknown> = {},
): string[] {
  const ids = ORDER.filter(id => selected.has(id))

  // Persistence has no fallback storage — without the storage plugin the
  // generated app throws on boot, so opting into `persist` opts into storage.
  const persists = ids.some(id => prune(id, toRecord(pluginConfig[id])).persist === true)

  if (!persists || selected.has('useStorage')) return ids

  return ORDER.filter(id => selected.has(id) || id === 'useStorage')
}

// Group `name` entries by their source module so each module is imported once.
function formatImports (
  entries: Array<{ name: string, from: string }>,
  kind: 'value' | 'type' = 'value',
): string[] {
  const modules = new Map<string, Set<string>>()

  for (const { name, from } of entries) {
    if (!modules.has(from)) modules.set(from, new Set())
    modules.get(from)!.add(name)
  }

  // Root barrel first, then remaining v0 subpaths alphabetically, then local.
  const order = [...modules.keys()].toSorted((a, b) => {
    if (a === b) return 0
    if (a === V0) return -1
    if (b === V0) return 1
    const localA = a.startsWith('.')
    const localB = b.startsWith('.')
    if (localA !== localB) return localA ? 1 : -1
    return a < b ? -1 : 1
  })

  const prefix = kind === 'type' ? 'import type' : 'import'

  return order.map(from => {
    const names = [...modules.get(from)!].toSorted()
    const body = names.map(name => `  ${name},`).join('\n')
    return `${prefix} {\n${body}\n} from '${from}'`
  })
}

// Where the stylesheet comes from. The starter compiles UnoCSS through Vite;
// the playground has no bundler and runs the preset from a `uno.config.ts`
// module it supplies itself.
type Stylesheet = 'virtual:uno.css' | './uno.config.ts'

export function generateMainTs (
  selectedPlugins: Set<string> | string[],
  pluginConfig: Record<string, unknown>,
  css: Stylesheet = 'virtual:uno.css',
): string {
  const selected = toSet(selectedPlugins)
  const ids = selectedPluginIds(selected, pluginConfig)

  const values: Array<{ name: string, from: string }> = []
  const types: Array<{ name: string, from: string }> = []
  const calls: string[] = []

  for (const id of ids) {
    const emit = emitPluginCall(id, FACTORY[id], pluginConfig[id])
    values.push({ name: FACTORY[id], from: V0 }, ...emit.imports)
    types.push(...emit.types)
    calls.push(emit.call)
  }

  const blocks = [
    `import { createApp } from 'vue'`,
    ...formatImports(values),
    ...formatImports(types, 'type'),
  ]

  const body = calls.length > 0 ? `${calls.join('\n')}\n\n` : ''

  return `${blocks.join('\n\n')}

import App from './App.vue'

import '${css}'

const app = createApp(App)

${body}app.mount('#app')
`
}

// Every token the emitted uno config has to map: the ones the demos style
// against, plus anything extra the user defined on their own themes.
export function collectTokens (pluginConfig: Record<string, unknown>): string[] {
  const tokens = new Set(Object.keys(TOKENS))
  const themes = toRecord(toRecord(pluginConfig.useTheme).themes)

  for (const theme of Object.values(themes)) {
    for (const token of Object.keys(toRecord(toRecord(theme).colors))) {
      tokens.add(token)
    }
  }

  return [...tokens].toSorted()
}

// A token the user defined themselves is always written by useTheme, so only
// the standard set needs a fallback.
function reference (token: string): string {
  const fallback = TOKENS[token]
  return fallback ? `var(--v0-${token}, ${fallback})` : `var(--v0-${token})`
}

// Maps each theme token onto the CSS variable useTheme writes. Without this the
// utility classes in the demos resolve to nothing and the app renders unstyled.
export function generateUnoConfig (pluginConfig: Record<string, unknown> = {}): string {
  const colors = collectTokens(pluginConfig)
    .map(token => `      '${token}': '${reference(token)}',`)
    .join('\n')

  return `import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
${colors}
    },
    borderColor: {
      DEFAULT: '${reference('divider')}',
    },
  },
})
`
}

// npm dependencies implied by the adapters the user picked.
export function collectDependencies (
  selectedPlugins: Set<string> | string[],
  pluginConfig: Record<string, unknown>,
): Record<string, string> {
  const selected = toSet(selectedPlugins)
  const deps: Record<string, string> = {}

  for (const id of selectedPluginIds(selected, pluginConfig)) {
    for (const name of emitPluginCall(id, FACTORY[id], pluginConfig[id]).adapters) {
      Object.assign(deps, ADAPTER_DEPS[name] ?? {}, BYOC[name]?.deps ?? {})
    }
  }

  return deps
}

// Whether the user asked for a hand-written date adapter, which is emitted as
// a local stub file rather than imported from the package.
export function needsDateStub (
  selectedPlugins: Set<string> | string[],
  pluginConfig: Record<string, unknown>,
): boolean {
  const selected = toSet(selectedPlugins)
  if (!selected.has('useDate')) return false
  return toRecord(pluginConfig.useDate).adapter === 'custom'
}

// A compilable starting point: V0DateAdapter implements all 70+ members of the
// abstract DateAdapter contract, so extending it leaves the user overriding
// only what they care about.
export function generateDateStub (): string {
  return `import { V0DateAdapter } from '@vuetify/v0/date'

/**
 * Your date adapter. Override any method of the DateAdapter contract to swap
 * in your own date library.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-date
 */
export class CustomDateAdapter extends V0DateAdapter {
  // TODO: override the methods you need.
}
`
}

// Feature → category mapping for demo file generation. Both composable ids and
// component ids are listed: the picker stores components, and the resolver adds
// the composables they depend on.
const CATEGORY_MAP: Record<string, string> = {
  // Selection
  createSelection: 'selection',
  createSingle: 'selection',
  createGroup: 'selection',
  createStep: 'selection',
  Selection: 'selection',
  Single: 'selection',
  Group: 'selection',
  Step: 'selection',
  Tabs: 'selection',
  // Forms
  createForm: 'forms',
  createCombobox: 'forms',
  createSlider: 'forms',
  createRating: 'forms',
  Form: 'forms',
  Input: 'forms',
  Combobox: 'forms',
  Slider: 'forms',
  Rating: 'forms',
  // Data
  createDataTable: 'data',
  createFilter: 'data',
  createPagination: 'data',
  createVirtual: 'data',
  Pagination: 'data',
  // Disclosure / overlay
  useStack: 'disclosure',
  useClickOutside: 'disclosure',
  usePopover: 'disclosure',
  Dialog: 'disclosure',
  Popover: 'disclosure',
  // Observers
  useResizeObserver: 'observers',
  useIntersectionObserver: 'observers',
}

export function generateImports (): Record<string, string> {
  return {
    '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@latest/dist/index.mjs',
    '@vue/devtools-api': 'https://esm.sh/@vue/devtools-api@6',
  }
}

// ---- Demo file generators per category ----
//
// Every demo is written against the compound components rather than raw form
// markup, so a generated starter teaches the v0 pattern it was built from.
// `symbols` lists what the demo pulls out of the user's own `framework.ts`.

interface Demo {
  symbols: string[]
  code: string
}

function generateSelectionDemo (features: Set<string>): Demo | null {
  function has (id: string) {
    return features.has(id)
  }

  if (has('createStep') || has('Step')) {
    return {
      symbols: ['Button', 'Step'],
      code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Button, Step } from './framework'

  const steps = ['Account', 'Profile', 'Review']
  const current = shallowRef(1)
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Stepper</h2>

    <Step.Root v-model="current">
      <template #default="{ next, prev }">
        <Step.Item
          v-for="(label, index) in steps"
          :key="label"
          :value="index + 1"
        >
          <template #default="{ isSelected }">
            <div v-if="isSelected" class="p-4 mb-4 rounded bg-surface-variant">
              <h3 class="font-medium mb-1">{{ label }}</h3>

              <p class="text-sm text-on-surface-variant">
                Step {{ index + 1 }} of {{ steps.length }}
              </p>
            </div>
          </template>
        </Step.Item>

        <div class="flex gap-2">
          <Button.Root
            class="px-4 py-2 rounded bg-surface-variant text-on-surface-variant"
            @click="prev"
          >
            Previous
          </Button.Root>

          <Button.Root
            class="px-4 py-2 rounded bg-primary text-on-primary"
            @click="next"
          >
            Next
          </Button.Root>
        </div>
      </template>
    </Step.Root>
  </section>
</template>`,
    }
  }

  if (has('Tabs')) {
    return {
      symbols: ['Tabs'],
      code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Tabs } from './framework'

  const tabs = ['Overview', 'Features', 'Settings']
  const selected = shallowRef('Overview')
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Tabs</h2>

    <Tabs.Root v-model="selected">
      <Tabs.List class="flex border-b border-divider" label="Sections">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab"
          class="px-4 py-2 -mb-px text-sm border-b-2 border-transparent text-on-surface-variant data-[selected]:border-primary data-[selected]:text-primary transition-colors"
          :value="tab"
        >
          {{ tab }}
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Panel
        v-for="tab in tabs"
        :key="tab"
        class="p-4"
        :value="tab"
      >
        <p class="text-on-surface-variant">Content for {{ tab }}.</p>
      </Tabs.Panel>
    </Tabs.Root>
  </section>
</template>`,
    }
  }

  if (has('createGroup') || has('Group')) {
    return {
      symbols: ['Button', 'Group'],
      code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Button, Group } from './framework'

  const tags = ['Vue', 'React', 'Svelte', 'Angular', 'Solid']
  const selected = shallowRef<string[]>([])
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Multi-Select Tags</h2>

    <Group.Root v-model="selected">
      <div class="flex flex-wrap gap-2 mb-4">
        <Group.Item
          v-for="tag in tags"
          :key="tag"
          v-slot="{ isSelected, attrs }"
          :value="tag"
        >
          <Button.Root
            v-bind="attrs"
            class="px-3 py-1.5 rounded-full text-sm transition-colors"
            :class="isSelected ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
          >
            {{ tag }}
          </Button.Root>
        </Group.Item>
      </div>
    </Group.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </section>
</template>`,
    }
  }

  const multiple = has('createSelection') || has('Selection')
  const namespace = multiple ? 'Selection' : 'Single'

  if (!multiple && !has('createSingle') && !has('Single')) return null

  return {
    symbols: ['Button', namespace],
    code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Button, ${namespace} } from './framework'

  const options = ['Overview', 'Features', 'Settings']
  const selected = shallowRef${multiple ? '<string[]>([])' : `('Overview')`}
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">${multiple ? 'Multi Selection' : 'Single Selection'}</h2>

    <${namespace}.Root v-model="selected"${multiple ? ' multiple' : ''}>
      <div class="flex gap-2 mb-4">
        <${namespace}.Item
          v-for="option in options"
          :key="option"
          v-slot="{ isSelected, attrs }"
          :value="option"
        >
          <Button.Root
            v-bind="attrs"
            class="px-4 py-2 rounded text-sm transition-colors"
            :class="isSelected ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
          >
            {{ option }}
          </Button.Root>
        </${namespace}.Item>
      </div>
    </${namespace}.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ ${multiple ? `selected.length ? selected.join(', ') : 'None'` : 'selected'} }}
    </p>
  </section>
</template>`,
  }
}

function generateFormDemo (features: Set<string>): Demo | null {
  function has (id: string) {
    return features.has(id)
  }

  if (has('createForm') || has('Form') || has('Input')) {
    return {
      symbols: ['Button', 'Form', 'Input'],
      code: String.raw`<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Button, Form, Input } from './framework'

  const valid = shallowRef<boolean | null>(null)
  const email = shallowRef('')
  const submitted = shallowRef(false)

  async function onSubmit (submit: () => Promise<boolean>) {
    submitted.value = await submit()
  }

  function onReset (reset: () => void) {
    email.value = ''
    submitted.value = false
    reset()
  }
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Form Validation</h2>

    <p v-if="submitted" class="p-4 mb-4 rounded bg-primary/10 text-primary">
      Submitted as {{ email }}
    </p>

    <Form v-slot="{ submit, reset }" v-model="valid" class="flex flex-col gap-4">
      <Input.Root
        id="email"
        v-model="email"
        label="Email"
        :rules="[
          (v: unknown) => !!v || 'Email is required',
          (v: unknown) => /.+@.+\..+/.test(String(v ?? '')) || 'Must be a valid email',
        ]"
        type="email"
      >
        <label class="text-sm font-medium" for="email">Email</label>

        <Input.Control
          class="w-full px-3 py-2 rounded border border-divider bg-surface text-on-surface data-[state=invalid]:border-error"
          placeholder="you@example.com"
        />

        <Input.Error v-slot="{ errors }" class="text-xs text-error">
          <span v-for="error in errors" :key="error">{{ error }}</span>
        </Input.Error>
      </Input.Root>

      <div class="flex gap-2">
        <Button.Root
          class="px-4 py-2 rounded bg-primary text-on-primary"
          @click="onSubmit(submit)"
        >
          Submit
        </Button.Root>

        <Button.Root
          class="px-4 py-2 rounded bg-surface-variant text-on-surface-variant"
          @click="onReset(reset)"
        >
          Reset
        </Button.Root>
      </div>
    </Form>
  </section>
</template>`,
    }
  }

  if (has('createSlider') || has('Slider')) {
    return {
      symbols: ['Slider'],
      code: `<script setup lang="ts">
  import { ref } from 'vue'

  import { Slider } from './framework'

  const volume = ref([50])
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Slider</h2>

    <Slider.Root v-model="volume" class="relative flex items-center w-full h-5">
      <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
        <Slider.Range class="absolute h-full rounded-full bg-primary" />
      </Slider.Track>

      <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2" />
    </Slider.Root>

    <p class="mt-2 text-sm text-on-surface-variant">
      Value: {{ volume[0] }}
    </p>
  </section>
</template>`,
    }
  }

  if (has('createRating') || has('Rating')) {
    return {
      symbols: ['Rating'],
      code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Rating } from './framework'

  const rating = shallowRef(0)
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Rating</h2>

    <Rating.Root v-model="rating" class="flex gap-1">
      <Rating.Item
        v-for="i in 5"
        :key="i"
        as="button"
        class="size-8 text-xl [&[data-state=full]]:text-amber-400 [&[data-state=empty]]:text-on-surface-variant/40"
        :index="i"
      >
        <template #default="{ state }">
          {{ state === 'full' ? '&#9733;' : '&#9734;' }}
        </template>
      </Rating.Item>
    </Rating.Root>

    <p class="mt-2 text-sm text-on-surface-variant">
      Rating: {{ rating }} / 5
    </p>
  </section>
</template>`,
    }
  }

  if (has('createCombobox') || has('Combobox')) {
    return {
      symbols: ['Combobox'],
      code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { Combobox } from './framework'

  const selected = shallowRef<string>()

  const fruits = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
    { id: 'date', label: 'Date' },
    { id: 'elderberry', label: 'Elderberry' },
  ]
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Combobox</h2>

    <Combobox.Root v-model="selected">
      <Combobox.Activator class="flex items-center gap-1 w-full px-3 py-2 rounded border border-divider bg-surface text-on-surface text-sm">
        <Combobox.Control
          class="flex-1 bg-transparent outline-none"
          placeholder="Search fruits…"
        />

        <Combobox.Cue class="opacity-50">&#9662;</Combobox.Cue>
      </Combobox.Activator>

      <Combobox.Content
        class="p-1 rounded border border-divider bg-surface shadow-lg"
        :style="{ minWidth: 'anchor-size(width)' }"
      >
        <Combobox.Item
          v-for="item in fruits"
          :id="item.id"
          :key="item.id"
          class="px-3 py-2 rounded text-sm data-[highlighted]:bg-primary data-[highlighted]:text-on-primary"
          :value="item.label"
        >
          {{ item.label }}
        </Combobox.Item>

        <Combobox.Empty v-slot="{ query }" class="px-3 py-2 text-sm text-on-surface-variant">
          No results for "{{ query }}"
        </Combobox.Empty>
      </Combobox.Content>
    </Combobox.Root>

    <p class="mt-2 text-sm text-on-surface-variant">
      Selected: {{ selected ?? 'None' }}
    </p>
  </section>
</template>`,
    }
  }

  return null
}

function generateDataDemo (features: Set<string>): Demo | null {
  function has (id: string) {
    return features.has(id)
  }

  if (has('createDataTable')) {
    return {
      symbols: ['createDataTable'],
      code: String.raw`<script setup lang="ts">
  import { createDataTable } from './framework'

  interface User extends Record<string, unknown> {
    id: number
    name: string
    role: string
  }

  const users: User[] = [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Carol', role: 'Product' },
    { id: 4, name: 'Dave', role: 'Engineer' },
    { id: 5, name: 'Eve', role: 'Designer' },
  ]

  const table = createDataTable<User>({ pagination: { itemsPerPage: 3 } })

  table.columns.onboard([
    { id: 'name', title: 'Name', sortable: true },
    { id: 'role', title: 'Role', sortable: true },
  ])

  table.onboard(users.map(value => ({ id: value.id, value })))

  function arrow (id: string) {
    const direction = table.sort.direction(id)
    if (direction === 'asc') return '\u2191'
    if (direction === 'desc') return '\u2193'
    return ''
  }
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Data Table</h2>

    <table class="w-full border border-divider rounded">
      <thead class="bg-surface-variant">
        <tr>
          <th
            v-for="column in table.columns.values()"
            :key="column.id"
            class="px-4 py-2 text-left text-sm font-medium cursor-pointer"
            @click="table.sort.toggle(column.id)"
          >
            {{ column.title }} {{ arrow(column.id) }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in table.items.value"
          :key="user.id"
          class="border-t border-divider"
        >
          <td class="px-4 py-2 text-sm">{{ user.name }}</td>
          <td class="px-4 py-2 text-sm">{{ user.role }}</td>
        </tr>
      </tbody>
    </table>

    <p class="mt-2 text-sm text-on-surface-variant">
      Page {{ table.pagination.page.value }} of {{ table.pagination.pages }} — {{ table.total.value }} rows
    </p>
  </section>
</template>`,
    }
  }

  if (has('createPagination') || has('Pagination')) {
    return {
      symbols: ['Pagination'],
      code: `<script setup lang="ts">
  import { shallowRef, toRef } from 'vue'

  import { Pagination } from './framework'

  const items = Array.from({ length: 47 }, (_, index) => \`Item \${index + 1}\`)
  const perPage = 6
  const page = shallowRef(1)

  const visible = toRef(() => items.slice((page.value - 1) * perPage, page.value * perPage))
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Pagination</h2>

    <ul class="space-y-1 mb-4">
      <li
        v-for="item in visible"
        :key="item"
        class="px-3 py-2 rounded bg-surface-variant text-on-surface-variant text-sm"
      >
        {{ item }}
      </li>
    </ul>

    <Pagination.Root
      v-slot="{ items: tickets }"
      v-model="page"
      class="flex items-center gap-1"
      :items-per-page="perPage"
      :size="items.length"
    >
      <Pagination.Prev class="size-9 rounded border border-divider flex items-center justify-center data-[disabled]:opacity-40">
        &#8249;
      </Pagination.Prev>

      <template v-for="(ticket, index) in tickets" :key="index">
        <Pagination.Ellipsis
          v-if="ticket.type === 'ellipsis'"
          class="size-9 flex items-center justify-center opacity-60"
        />

        <Pagination.Item
          v-else
          class="size-9 rounded border border-divider flex items-center justify-center data-[selected]:bg-primary data-[selected]:text-on-primary"
          :value="ticket.value as number"
        >
          {{ ticket.value }}
        </Pagination.Item>
      </template>

      <Pagination.Next class="size-9 rounded border border-divider flex items-center justify-center data-[disabled]:opacity-40">
        &#8250;
      </Pagination.Next>
    </Pagination.Root>
  </section>
</template>`,
    }
  }

  if (has('createFilter')) {
    return {
      symbols: ['createFilter', 'Input'],
      code: `<script setup lang="ts">
  import { shallowRef } from 'vue'

  import { createFilter, Input } from './framework'

  const pages = [
    'Dashboard', 'Settings', 'Profile', 'Notifications',
    'Analytics', 'Reports', 'Users', 'Billing',
  ]

  const query = shallowRef('')
  const filter = createFilter()
  const { items } = filter.apply(query, pages)
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Filter</h2>

    <Input.Root id="filter" v-model="query" label="Search">
      <Input.Control
        class="w-full px-3 py-2 mb-4 rounded border border-divider bg-surface text-on-surface"
        placeholder="Search pages…"
      />
    </Input.Root>

    <ul class="space-y-1">
      <li
        v-for="item in items.value"
        :key="String(item)"
        class="px-3 py-2 rounded bg-surface-variant text-on-surface-variant text-sm"
      >
        {{ item }}
      </li>
    </ul>

    <p v-if="!items.value.length" class="text-sm text-on-surface-variant italic">
      No matches found.
    </p>
  </section>
</template>`,
    }
  }

  if (has('createVirtual')) {
    return {
      symbols: ['createVirtual'],
      code: `<script setup lang="ts">
  import { ref } from 'vue'

  import { createVirtual } from './framework'

  const rows = ref(Array.from({ length: 10_000 }, (_, index) => ({
    id: index,
    label: \`Row \${index + 1}\`,
  })))

  const { element, items, offset, size, scroll } = createVirtual(rows, { itemHeight: 36 })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Virtual Scroll (10,000 rows)</h2>

    <div
      ref="element"
      class="h-64 overflow-y-auto border border-divider rounded"
      @scroll="scroll"
    >
      <div :style="{ height: \`\${offset}px\` }" />

      <div
        v-for="item in items"
        :key="item.index"
        class="h-9 px-3 flex items-center text-sm border-b border-divider"
      >
        {{ item.raw.label }}
      </div>

      <div :style="{ height: \`\${size}px\` }" />
    </div>
  </section>
</template>`,
    }
  }

  return null
}

function generateDisclosureDemo (features: Set<string>): Demo | null {
  function has (id: string) {
    return features.has(id)
  }

  if (has('usePopover') || has('Popover')) {
    return {
      symbols: ['Popover'],
      code: `<script setup lang="ts">
  import { Popover } from './framework'
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Popover</h2>

    <Popover.Root>
      <Popover.Activator class="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium">
        Open Popover
      </Popover.Activator>

      <Popover.Content class="p-4 rounded-lg bg-surface border border-divider shadow-lg max-w-xs">
        <p class="text-sm text-on-surface">
          Positioned with the native popover API and CSS anchor positioning.
        </p>
      </Popover.Content>
    </Popover.Root>
  </section>
</template>`,
    }
  }

  if (has('useStack') || has('useClickOutside') || has('Dialog')) {
    return {
      symbols: ['Dialog'],
      code: `<script setup lang="ts">
  import { Dialog } from './framework'
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Dialog</h2>

    <Dialog.Root>
      <Dialog.Activator class="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium">
        Open Dialog
      </Dialog.Activator>

      <Dialog.Content class="m-auto p-6 rounded-xl bg-surface border border-divider max-w-md w-full">
        <Dialog.Title as="h3" class="text-lg font-semibold mb-2">
          Dialog Title
        </Dialog.Title>

        <Dialog.Description class="text-sm text-on-surface-variant mb-4">
          Rendered into the top layer by the native dialog element.
        </Dialog.Description>

        <Dialog.Close class="px-4 py-2 rounded bg-surface-variant text-on-surface-variant text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  </section>
</template>`,
    }
  }

  return null
}

function generateObserverDemo (features: Set<string>): Demo | null {
  function has (id: string) {
    return features.has(id)
  }

  if (has('useResizeObserver')) {
    return {
      symbols: ['useResizeObserver'],
      code: `<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue'

  import { useResizeObserver } from './framework'

  const box = useTemplateRef('box')
  const size = ref({ width: 0, height: 0 })

  useResizeObserver(box, entries => {
    const entry = entries[0]

    size.value = {
      width: Math.round(entry.contentRect.width),
      height: Math.round(entry.contentRect.height),
    }
  })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Resize Observer</h2>

    <div
      ref="box"
      class="p-4 min-h-24 min-w-48 resize overflow-auto rounded border-2 border-dashed border-divider bg-surface-variant"
    >
      <p class="text-sm text-on-surface-variant">
        Drag the corner to resize. Current size: {{ size.width }} &times; {{ size.height }}px
      </p>
    </div>
  </section>
</template>`,
    }
  }

  if (has('useIntersectionObserver')) {
    return {
      symbols: ['useIntersectionObserver'],
      code: `<script setup lang="ts">
  import { shallowRef, useTemplateRef } from 'vue'

  import { useIntersectionObserver } from './framework'

  const target = useTemplateRef('target')
  const visible = shallowRef(false)

  useIntersectionObserver(target, entries => {
    visible.value = entries[0].isIntersecting
  })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Intersection Observer</h2>

    <p class="text-sm text-on-surface-variant mb-4">
      Scroll the panel to reveal the target.
      Status: <strong :class="visible ? 'text-primary' : 'text-error'">{{ visible ? 'Visible' : 'Hidden' }}</strong>
    </p>

    <div class="h-48 overflow-auto rounded border border-divider p-4">
      <div class="h-64 flex items-end">
        <p class="text-sm text-on-surface-variant">Keep scrolling&hellip;</p>
      </div>

      <div ref="target" class="p-4 rounded bg-primary/10 text-primary text-center">
        You found me!
      </div>
    </div>
  </section>
</template>`,
    }
  }

  return null
}

// ---- Category to generator + file name mapping ----

interface DemoConfig {
  category: string
  file: string
  component: string
  generator: (features: Set<string>) => Demo | null
}

const DEMO_CONFIGS: DemoConfig[] = [
  { category: 'selection', file: 'src/SelectionDemo.vue', component: 'SelectionDemo', generator: generateSelectionDemo },
  { category: 'forms', file: 'src/FormDemo.vue', component: 'FormDemo', generator: generateFormDemo },
  { category: 'data', file: 'src/DataDemo.vue', component: 'DataDemo', generator: generateDataDemo },
  { category: 'disclosure', file: 'src/DisclosureDemo.vue', component: 'DisclosureDemo', generator: generateDisclosureDemo },
  { category: 'observers', file: 'src/ObserverDemo.vue', component: 'ObserverDemo', generator: generateObserverDemo },
]

function categorize (features: Set<string>): Set<string> {
  const categories = new Set<string>()

  for (const feature of features) {
    const category = CATEGORY_MAP[feature]
    if (category) categories.add(category)
  }

  return categories
}

// The user's framework: one file re-exporting everything they assembled, so
// application code imports from `./framework` rather than the package.
//
// Bound through a namespace into local consts rather than `export … from`.
// The playground's module transform compiles a re-exported import into a
// getter over a binding it never declares, so the demos die with
// "X is not defined" at render. Locals survive the transform, and bundlers
// still tree-shake namespace member access.
export function generateFramework (symbols: Iterable<string>): string {
  const names = [...new Set(symbols)].toSorted()

  if (names.length === 0) {
    return `// Re-export the pieces of @vuetify/v0 your app uses from here.
export {}
`
  }

  const body = names.map(name => `export const ${name} = v0.${name}`).join('\n')

  return `/**
 * Your framework.
 *
 * Everything you selected in the Builder, re-exported from one module. Import
 * from './framework' throughout your app and add to this list as you grow.
 */
import * as v0 from '@vuetify/v0'

${body}
`
}

function generateAppVue (demos: string[], count: number): string {
  if (demos.length === 0) {
    return `<script setup lang="ts">
  //
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Your v0 Framework</h1>

    <p class="text-on-surface-variant mb-8">
      ${count} features loaded. Open any file to start building.
    </p>

    <div class="p-6 rounded-lg bg-surface-variant text-center">
      <p class="text-on-surface-variant">
        Everything you selected is re-exported from
        <code class="text-primary">src/framework.ts</code> — import from there and start building.
      </p>
    </div>
  </div>
</template>`
  }

  const imports = demos.map(name => `  import ${name} from './${name}.vue'`).join('\n')
  const elements = demos.map(name => `    <${name} />`).join('\n')

  return `<script setup lang="ts">
${imports}
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Your v0 Framework</h1>

    <p class="text-on-surface-variant mb-8">
      ${count} features loaded. Everything you selected is re-exported from
      <code class="text-primary">src/framework.ts</code>.
    </p>

${elements}
  </div>
</template>`
}

export function generateFiles (manifest: FrameworkManifest): Record<string, string> {
  const features = new Set([...manifest.features, ...manifest.resolved])
  const categories = categorize(features)

  const files: Record<string, string> = {}
  const demos: string[] = []
  const symbols = new Set<string>()

  // Whatever the user picked belongs in their framework whether or not a demo
  // happens to exercise it — minus anything v0 has not shipped yet.
  for (const feature of manifest.features) {
    if (/^[A-Z]/.test(feature) && !DRAFT.has(feature)) symbols.add(feature)
  }

  for (const config of DEMO_CONFIGS) {
    if (!categories.has(config.category)) continue

    const demo = config.generator(features)
    if (!demo) continue

    files[config.file] = demo.code
    demos.push(config.component)
    for (const symbol of demo.symbols) symbols.add(symbol)
  }

  files['src/framework.ts'] = generateFramework(symbols)
  // Count what the framework actually re-exports, not what was requested — the
  // two differ once draft picks and resolved dependencies are accounted for.
  files['src/App.vue'] = generateAppVue(demos, symbols.size)

  return files
}

export function toHashData (input: PlaygroundInput): PlaygroundHashData {
  const config = input.pluginConfig ?? {}
  const plugins = input.features.filter(id => id in FACTORY)

  // The playground executes src/main.ts as the sandbox entry, so the preview
  // boots the same plugin set the starter does. Without a theme the demos have
  // no palette to resolve against, so preview-only defaults stand in.
  const themed = plugins.includes('useTheme')
    ? { plugins, config }
    : { plugins: [...plugins, 'useTheme'], config: { ...config, useTheme: PREVIEW_THEME } }

  return {
    files: {
      ...generateFiles(input),
      'src/main.ts': generateMainTs(themed.plugins, themed.config, './uno.config.ts'),
    },
    active: 'src/App.vue',
    imports: generateImports(),
  }
}

async function encodeHash (data: PlaygroundHashData): Promise<string> {
  const { strToU8, strFromU8, zlibSync } = await import('fflate')
  const buffer = strToU8(JSON.stringify(data))
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export async function toPlaygroundUrl (input: PlaygroundInput, baseUrl: string): Promise<string> {
  const hash = await encodeHash(toHashData(input))
  return `${baseUrl}#${hash}`
}
