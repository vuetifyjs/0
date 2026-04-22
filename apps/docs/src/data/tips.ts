export interface Tip {
  id: string
  body: string
  link?: {
    to: string
    text: string
  }
}

export const tips: Tip[] = [
  {
    id: 'create-selection',
    body: 'Use `createSelection` to build your own multi-select or single-select primitives without rewriting state logic from scratch.',
    link: { to: '/composables/selection/create-selection', text: 'Explore createSelection' },
  },
  {
    id: 'use-breakpoints-ssr',
    body: '`useBreakpoints` is SSR-safe — it returns sensible defaults on the server and hydrates to real viewport values on mount.',
    link: { to: '/composables/plugins/use-breakpoints', text: 'useBreakpoints' },
  },
  {
    id: 'create-context',
    body: '`createContext` wraps provide/inject with type safety and optional injection, so consumers can opt into a parent without try/catch.',
    link: { to: '/composables/foundation/create-context', text: 'createContext' },
  },
  {
    id: 'use-hotkey',
    body: 'Register keyboard shortcuts with `useHotkey` — it handles modifier keys, scope, and cleanup for you.',
    link: { to: '/composables/system/use-hotkey', text: 'useHotkey' },
  },
  {
    id: 'use-storage',
    body: '`useStorage` syncs a ref to localStorage or sessionStorage with full SSR safety and cross-tab updates.',
    link: { to: '/composables/plugins/use-storage', text: 'useStorage' },
  },
  {
    id: 'create-pagination',
    body: 'Build any pagination UI on top of `createPagination` — a page input, a previous/next button, or a sliding window are all one composable away.',
    link: { to: '/composables/data/create-pagination', text: 'createPagination' },
  },
  {
    id: 'use-theme',
    body: 'The `useTheme` plugin gives you reactive color tokens and light/dark switching that work with CSS variables out of the box.',
    link: { to: '/composables/plugins/use-theme', text: 'useTheme' },
  },
  {
    id: 'use-popover',
    body: '`usePopover` returns `attrs` and `styles` for you to spread onto your own element — positioning, collision, and ARIA wiring without a wrapper component.',
    link: { to: '/composables/system/use-popover', text: 'usePopover' },
  },
  {
    id: 'create-form',
    body: 'Compose `createForm` with `createValidation` for reactive form state — per-field rules, async validation, and dirty tracking without a schema library.',
    link: { to: '/composables/forms/create-form', text: 'createForm' },
  },
  {
    id: 'use-proxy-model',
    body: 'Reach for `useProxyModel` whenever you need a local `v-model` that also syncs to a prop — no more awkward `emit("update:modelValue")` boilerplate.',
    link: { to: '/composables/reactivity/use-proxy-model', text: 'useProxyModel' },
  },
  {
    id: 'in-browser-constant',
    body: 'Import `IN_BROWSER` from `#v0/constants/globals` instead of writing `typeof window !== "undefined"` — it tree-shakes cleanly and reads better.',
    link: { to: '/guide/features/utilities', text: 'Built-in utilities' },
  },
  {
    id: 'create-trinity',
    body: '`createTrinity` is the readonly tuple pattern behind most v0 registries — a compact way to expose a typed API alongside its provider.',
    link: { to: '/composables/foundation/create-trinity', text: 'createTrinity' },
  },
  {
    id: 'use-proxy-registry',
    body: 'Wrap any array-backed resource in `useProxyRegistry` to get registry semantics (ticket lookup, reactive membership) without rewriting your data layer.',
    link: { to: '/composables/reactivity/use-proxy-registry', text: 'useProxyRegistry' },
  },
  {
    id: 'headless-composition',
    body: 'Every component in v0 is assembled from composables — that is the whole point. If a component feels limiting, drop to its underlying composable and build what you need.',
    link: { to: '/introduction/why-vuetify0', text: 'Why v0?' },
  },
  {
    id: 'paper-companion',
    body: '`@vuetify/paper` adds styling primitives on top of v0 without taking away the headless escape hatch. Use them together when you want opinions, independently when you want control.',
    link: { to: '/guide/fundamentals/plugins', text: 'Plugins guide' },
  },
  {
    id: 'logger-adapters',
    body: '`useLogger` ships with Pino and Consola adapters — wire your v0 logs into your existing observability stack in one line.',
    link: { to: '/composables/plugins/use-logger', text: 'useLogger' },
  },
  {
    id: 'ask-ai-callout',
    body: 'Stuck on a concept? Most docs pages have an `> [!ASKAI]` callout that opens the AI assistant pre-seeded with the question — click it instead of switching tabs.',
    link: { to: '/guide/essentials/using-the-docs', text: 'Using the docs' },
  },
  {
    id: 'tours-in-docs',
    body: 'Look for the `> [!TOUR]` callout on feature-heavy pages — it walks you through the UI interactively instead of making you read.',
    link: { to: '/guide/essentials/using-the-docs', text: 'Using the docs' },
  },
]
