/**
 * The icon plugin — registry construction, app installation, and the consumer.
 *
 * Split from `./glyphs` so the artwork is a leaf module with no imports: it
 * makes what pulls the 1.9 kB map into a bundle legible, and this file is the
 * only thing that does. See DESIGN_SYSTEMS.md "Icons".
 */

// Framework
import { createPluginContext, createTokens } from '@vuetify/v0'
import { isString } from '@vuetify/v0/utilities'

// Glyphs
import { emeraldIconAliases, emeraldIcons } from './glyphs'

// Types
import type { EmIconCollection, EmIconGlyph } from './glyphs'
import type { TokenCollection, TokenContext, TokenTicket } from '@vuetify/v0'

export { emeraldIconAliases, emeraldIcons } from './glyphs'
export type { EmIconGlyph, EmIconName } from './glyphs'

export type EmIconsContext = TokenContext<TokenTicket>

/** Factory options — what the registry is built from. */
export interface EmeraldIconsOptions {
  /**
   * Glyphs merged over the built-in set. A key that already exists replaces its
   * artwork; a new key extends the vocabulary. Pointing one name at another is
   * `aliases`' job, not this one.
   */
  icons?: Record<string, EmIconGlyph>
  /**
   * Extra `role -> target` references. Bare role names are accepted and wrapped,
   * so `{ expand: 'chevron-down' }` and `{ expand: '{chevron-down}' }` mean the
   * same thing.
   */
  aliases?: Record<string, string>
}

export interface EmeraldIconsContextOptions extends EmeraldIconsOptions {
  namespace?: string
}

/**
 * No `persist` tier, unlike the rest of the plugin family: the registry is
 * built from static artwork and never mutates, so there is no session state a
 * reload could lose.
 */
export interface EmeraldIconsPluginOptions extends EmeraldIconsContextOptions {}

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
 * Build an icon registry. Reach for the plugin instead unless you are giving a
 * subtree its own set.
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

/**
 * Built on first use by an `EmIcon` that found no plugin, then shared by every
 * later one. Sharing is deliberate: the default set is immutable, so a second
 * registry would cost memory to hold identical data. Memoized here rather than
 * left to `createPluginContext`, which calls the factory per invocation.
 */
let fallback: EmIconsContext | undefined

/**
 * `useEmIcons` resolves the installed registry, or the built-in set when no
 * plugin was installed — `EmIcon` draws in an app with zero Emerald plugins.
 */
export const [
  createEmeraldIconsContext,
  createEmeraldIconsPlugin,
  useEmIcons,
] = /* @__PURE__ */ createPluginContext<EmeraldIconsPluginOptions, EmIconsContext>(
  EM_ICONS_NAMESPACE,
  options => createEmIcons(options),
  { fallback: () => (fallback ??= createEmIcons()) },
)
