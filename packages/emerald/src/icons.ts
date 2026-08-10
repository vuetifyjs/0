/**
 * Emerald's icon set — a role vocabulary, not an icon library.
 *
 * Every glyph is one or more `<path d>` strings drawn on a 24x24 stroke grid.
 * Only the geometry lives here: `fill`, `stroke`, width, and linecaps are the
 * renderer's job (`EmIcon`), so the whole set restrokes from one place.
 *
 * Three conventions the data depends on:
 * - **Dots are zero-length strokes.** `M5 12h.01` paints a round cap, not a
 *   circle — that is how the set draws every dot (kebab, ellipses, i-dots).
 * - **Circles are arcs.** SVG `<circle>` has no place in a `d`-only map, so
 *   round shapes are written as two half-arcs (see `search`, `users`, `eye`).
 * - **Aliases are brace references**, resolved by `createTokens` — `envelope`
 *   is not a copy of `mail`, it points at it. Consumers add their own the same
 *   way through `createEmeraldPlugin({ icons: { aliases: … } })`.
 *
 * @see https://github.com/vuetifyjs/0/issues/107
 */

// Framework
import { createContext, createTokens } from '@vuetify/v0'
import { isString } from '@vuetify/v0/utilities'

// Types
import type { TokenCollection, TokenContext, TokenTicket } from '@vuetify/v0'
import type { App } from 'vue'

/** A glyph is the ordered `d` strings that draw it. */
export type EmIconGlyph = readonly string[]

/** Role name to glyph, or to a `{role}` reference to another entry. */
export type EmIconCollection = Record<string, EmIconGlyph | string>

/**
 * Canonical roles. Anything an Em* component draws for itself is in here, so a
 * consumer can restyle the whole system's chrome by overriding a single role.
 */
export const emeraldIcons = {
  // ── Navigation and wayfinding ──────────────────────────
  'dashboard': ['M4 4h7v9H4V4Zm9 0h7v5h-7V4ZM4 15h7v5H4v-5Zm9-4h7v9h-7v-9Z'],
  'features': ['M12 3l2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z'],
  'pricing': [
    'M12.6 3.6A2 2 0 0 0 11.2 3H5a2 2 0 0 0-2 2v6.2a2 2 0 0 0 .6 1.4l7.8 7.8a2 2 0 0 0 2.8 0l5.8-5.8a2 2 0 0 0 0-2.8l-7.4-7.2Z',
    'M7.5 7.5h.01',
  ],
  'faqs': [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'M9.7 9.3a2.4 2.4 0 0 1 4.6.8c0 1.6-2.3 2.4-2.3 2.4',
    'M12 17h.01',
  ],
  'settings': [
    'M20 7h-9',
    'M14 17H5',
    'M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    'M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  ],
  'modals': [
    'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
    'M3 9.5h18',
    'M6.5 7.2h.01M9 7.2h.01',
  ],
  'about': [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'M12 11v5',
    'M12 8h.01',
  ],
  'signin': [
    'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3',
    'M14 12l-4-4M14 12l-4 4',
    'M14 12H4',
  ],

  // ── Domains ────────────────────────────────────────────
  'sales': ['M4 20h16', 'M7 20v-5l4-4 3 3 5-6', 'M15 8h4v4'],
  'finance': ['M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z', 'M16 12h2', 'M3 9h18'],
  'logistics': ['M3 7h11v9H3V7Z', 'M14 10h4l3 3v3h-7v-6Z', 'M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z', 'M18 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'],
  'activity': ['M22 12h-4l-3 8-6-16-3 8H2'],
  'campaign': ['M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z', 'M15 8a3 3 0 0 1 0 8', 'M18 5a7 7 0 0 1 0 14'],
  'analytics': ['M4 20h16', 'M8 20v-6M13 20V9M18 20v-11'],
  'payments': ['M3 7h18v10H3V7Z', 'M3 10h18'],
  'ecommerce': ['M4 5h2l2.2 11.2A2 2 0 0 0 10.2 18h7.1a2 2 0 0 0 2-1.6L21 9H6'],
  'mail': ['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z', 'M3 6l9 7 9-7'],
  'chat': ['M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z'],
  'kanban': ['M4 4h4v16H4V4Zm6 0h4v10h-4V4Zm6 0h4v13h-4V4Z'],
  'calendar': ['M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z', 'M3 10h18', 'M8 3v4M16 3v4'],
  'contacts': ['M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M5 20a7 7 0 0 1 14 0'],
  'datatable': ['M3 5h18v14H3V5Z', 'M3 10h18', 'M9 5v14'],
  'forms': ['M6 3h9l5 5v13H6V3Z', 'M15 3v5h5', 'M9 13h6M9 17h6'],
  'components': [
    'M12 3l8 4.5-8 4.5-8-4.5L12 3Z',
    'M4 12l8 4.5 8-4.5',
    'M4 16.5 12 21l8-4.5',
  ],
  'book': [
    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20',
    'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z',
  ],

  // ── Theme and chrome ───────────────────────────────────
  'moon': ['M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z'],
  'sun': [
    'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
    'M12 2v2M12 20v2M2 12h2M20 12h2',
    'M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  ],
  'palette': [
    'M12 3a9 9 0 1 0 0 18 1.8 1.8 0 0 0 1.4-2.9 1.8 1.8 0 0 1 1.4-2.9H17a4 4 0 0 0 4-4c0-4.4-4-8.2-9-8.2Z',
    'M7.5 12.5h.01M9.8 8.6h.01M14.2 8.6h.01M16.6 11.5h.01',
  ],
  'menu': ['M4 6h16M4 12h16M4 18h16'],
  /** Rail toggle — the short middle bar is what distinguishes it from `menu`. */
  'sidebar': ['M4 6h16M4 12h10M4 18h16'],
  'bell': [
    'M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z',
    'M10 19a2 2 0 0 0 4 0',
  ],
  'search': ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M21 21l-4.35-4.35'],

  // ── Direction ──────────────────────────────────────────
  'chevron-up': ['M6 15l6-6 6 6'],
  'chevron-down': ['M6 9l6 6 6-6'],
  'chevron-left': ['M15 18l-6-6 6-6'],
  'chevron-right': ['M9 6l6 6-6 6'],
  /** Paired carets for an unsorted column; sorted state flips it in CSS. */
  'sort': ['M6 9 12 3 18 9', 'M6 15 12 21 18 15'],
  'trend-up': ['M5 16 12 7l7 9', 'M14 7h5v5'],
  'trend-down': ['M5 8 12 17l7-9', 'M14 17h5v-5'],

  // ── Controls ───────────────────────────────────────────
  'check': ['M5 12.5 9.5 17 19 7'],
  /** Doubles as the checkbox's indeterminate bar and pricing's "not included". */
  'minus': ['M5 12h14'],
  'close': ['M6 6 18 18', 'M18 6 6 18'],
  'plus': ['M12 5v14M5 12h14'],
  'kebab': ['M5 12h.01M12 12h.01M19 12h.01'],
  'eye': ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  'star': ['m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3Z'],
  'currency': [
    'M12 3v18',
    'M17 8c0-2-2-3.5-5-3.5S7 6 7 8s2 3 5 3.5 5 1.5 5 3.5-2 3.5-5 3.5S7 16 7 14',
  ],
  'users': [
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M3 19c0-3 2.5-5 6-5s6 2 6 5',
    'M17 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  ],
  'receipt': ['M5 6h14v12H5V6Z', 'M9 10h6M9 14h4'],
} as const satisfies EmIconCollection

/**
 * Roles that are a second name for a glyph rather than a glyph of their own.
 * Kept separate from `emeraldIcons` so the canonical set stays a census of
 * distinct artwork — override an alias and every name pointing at it follows.
 */
export const emeraldIconAliases = {
  /** Nav "Contact" and the FAQ contact channel both read as a speech bubble. */
  contact: '{chat}',
  /** Nav "Orders" reuses the layered-stack mark. */
  orders: '{components}',
  /** The productivity dashboard is titled by the pulse line it draws. */
  productivity: '{activity}',
  envelope: '{mail}',
} as const satisfies EmIconCollection

export type EmIconsContext = TokenContext<TokenTicket>

export interface EmeraldIconsOptions {
  /**
   * Roles merged over the built-in set. A key that already exists replaces it;
   * a new key extends the vocabulary.
   */
  icons?: EmIconCollection
  /**
   * Extra `role -> '{target}'` references. Bare role names are accepted and
   * wrapped, so `{ expand: 'chevron-down' }` and `{ expand: '{chevron-down}' }`
   * mean the same thing.
   */
  aliases?: Record<string, string>
}

/**
 * `createTokens` stores each glyph behind `$value` rather than as a bare array:
 * `TokenValue` admits primitives, and an array is neither that nor a nested
 * collection. Wrapping keeps the map assignable without a cast, and `resolve`
 * unwraps `$value` on the way out — so callers still get `string[]`.
 */
function collect (icons: EmIconCollection): TokenCollection {
  const tokens: TokenCollection = {}

  for (const [role, glyph] of Object.entries(icons)) {
    tokens[role] = isString(glyph) ? glyph : { $value: glyph }
  }

  return tokens
}

/** Bare `chevron-down` and `{chevron-down}` both mean "point at that role". */
function brace (target: string): string {
  return target.startsWith('{') ? target : `{${target}}`
}

/**
 * Build an icon registry. Called for you by `createEmeraldPlugin`; call it
 * directly only to provide a set to a subtree.
 */
export function createEmIcons (options: EmeraldIconsOptions = {}): EmIconsContext {
  const aliases: EmIconCollection = {}

  for (const [role, target] of Object.entries(options.aliases ?? {})) {
    aliases[role] = brace(target)
  }

  return createTokens({
    ...collect(emeraldIcons),
    ...collect(emeraldIconAliases),
    ...collect(options.icons ?? {}),
    ...collect(aliases),
  })
}

export const EM_ICONS_NAMESPACE = 'emerald:icons'

const [useIconsContext, provideIconsContext] = createContext<EmIconsContext>()

/**
 * The default set is built once, on first use by an unprovided `EmIcon`, and
 * shared from then on — so dropping an `EmIcon` into an app that never
 * installed the plugin still draws, at the cost of one registry.
 */
let fallback: EmIconsContext | undefined

export function useEmIcons (namespace = EM_ICONS_NAMESPACE): EmIconsContext {
  return useIconsContext(namespace, (fallback ??= createEmIcons()))
}

export function provideEmIcons (
  context: EmIconsContext,
  app?: App,
  namespace = EM_ICONS_NAMESPACE,
): EmIconsContext {
  return provideIconsContext(namespace, context, app)
}
