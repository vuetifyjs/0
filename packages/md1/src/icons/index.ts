/**
 * The icon plugin: registry construction, app installation, and the consumer.
 *
 * Split from `./glyphs` so the artwork is a leaf module with no imports: it
 * makes what pulls the glyph map into a bundle legible, and this file is the
 * only thing that does. See DESIGN_SYSTEMS.md "Icons".
 */

// Framework
import { createPluginContext, createTokens, isString } from '@vuetify/v0'

// Glyphs
import { md1IconAliases, md1Icons } from './glyphs'

// Types
import type { Md1IconCollection, Md1IconGlyph } from './glyphs'
import type { ContextTrinity, TokenCollection, TokenContext, TokenTicket } from '@vuetify/v0'
import type { Plugin } from 'vue'

export { md1IconAliases, md1IconMirrors, md1Icons } from './glyphs'
export type { Md1IconCollection, Md1IconGlyph, Md1IconName } from './glyphs'

export type Md1IconsContext = TokenContext<TokenTicket>

/** Factory options: what the registry is built from. */
export interface Md1IconsOptions {
  /**
   * Glyphs merged over the built-in set. A key that already exists replaces its
   * artwork; a new key extends the vocabulary. Pointing one name at another is
   * `aliases`' job, not this one.
   */
  icons?: Record<string, Md1IconGlyph>
  /**
   * Extra `role -> target` references. Bare role names are accepted and wrapped,
   * so `{ expand: 'expand-more' }` and `{ expand: '{expand-more}' }` mean the
   * same thing.
   */
  aliases?: Record<string, string>
}

export interface Md1IconsContextOptions extends Md1IconsOptions {
  namespace?: string
}

/**
 * No `persist` tier, unlike the rest of the plugin family: the registry is
 * built from static artwork and never mutates, so there is no session state a
 * reload could lose.
 */
export interface Md1IconsPluginOptions extends Md1IconsContextOptions {
  /** When true, this plugin appears in the Vue DevTools v0 inspector. @default false */
  devtools?: boolean
}

/**
 * `createTokens` stores each glyph behind `$value` rather than as a bare array:
 * `TokenValue` admits primitives, and an array is neither that nor a nested
 * collection. Wrapping keeps the map assignable without a cast, and `resolve`
 * unwraps `$value` on the way out, so callers still get `string[]`.
 */
function collect (icons: Md1IconCollection): TokenCollection {
  const tokens: TokenCollection = {}

  for (const [role, glyph] of Object.entries(icons)) {
    tokens[role] = isString(glyph) ? glyph : { $value: glyph }
  }

  return tokens
}

/** Bare `expand-more` and `{expand-more}` both mean "point at that role". */
function brace (target: string): string {
  return target.startsWith('{') ? target : `{${target}}`
}

/**
 * Build an icon registry. Reach for the plugin instead unless you are giving a
 * subtree its own set.
 */
export function createMd1Icons (options: Md1IconsOptions = {}): Md1IconsContext {
  const aliases: Md1IconCollection = {}

  for (const [role, target] of Object.entries(options.aliases ?? {})) {
    aliases[role] = brace(target)
  }

  return createTokens({
    ...collect(md1Icons),
    ...collect(md1IconAliases),
    ...collect(options.icons ?? {}),
    ...collect(aliases),
  })
}

export const MD1_ICONS_NAMESPACE = 'md1:icons'

/**
 * Built on first use by an `Md1Icon` that found no plugin, then shared by every
 * later one. Sharing is deliberate: the default set is immutable, so a second
 * registry would cost memory to hold identical data. Memoized here rather than
 * left to `createPluginContext`, which calls the factory per invocation.
 */
let fallback: Md1IconsContext | undefined

/**
 * `useMd1Icons` resolves the installed registry, or the built-in set when no
 * plugin was installed: `Md1Icon` draws in an app with zero MD1 plugins.
 *
 * `createMd1Plugin` composes `createMd1IconsPlugin`; `{ icons: false }`
 * there skips the install, not the bundle (DESIGN_SYSTEMS.md ruling 6).
 *
 * The tuple is annotated, not inferred: the declaration bundler writes the
 * inferred `createPluginContext` return type through v0's internal barrel and
 * emits `undefined<_E>` for `ContextTrinity` and `Plugin` in `dist/index.d.mts`.
 * Naming the types here makes vue-tsc import them from `@vuetify/v0` and `vue`.
 */
export const [
  createMd1IconsContext,
  createMd1IconsPlugin,
  useMd1Icons,
]: readonly [
  <_E extends Md1IconsContext = Md1IconsContext>(options?: Md1IconsPluginOptions) => ContextTrinity<_E>,
  (options?: Md1IconsPluginOptions) => Plugin,
  <_E extends Md1IconsContext = Md1IconsContext>(namespace?: string) => _E,
] = /* @__PURE__ */ createPluginContext<Md1IconsPluginOptions, Md1IconsContext>(
  MD1_ICONS_NAMESPACE,
  options => createMd1Icons(options),
  { fallback: () => (fallback ??= createMd1Icons()) },
)
