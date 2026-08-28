/**
 * @module useTheme
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @remarks
 * Theme management composable with token resolution and CSS variable injection.
 *
 * Key features:
 * - Single-selection theme switching (extends createSingle)
 * - Token alias resolution via createTokens
 * - Lazy theme loading (compute colors only when selected)
 * - CSS variable generation via adapter pattern
 * - `isDark` reactive flag on the theme context
 * - Optional `system` pair that follows `prefers-color-scheme` until an explicit `select`
 * - SSR support with head integration
 * - Theme cycling
 *
 * Integrates with createSingle for selection and createTokens for color resolution.
 *
 * @example
 * ```ts
 * import { useTheme } from '@vuetify/v0'
 *
 * const theme = useTheme()
 * theme.select('dark')
 * console.log(theme.isDark.value) // true
 * ```
 */

// Composables
import { createPluginContext } from '#v0/composables/createPlugin'
import { createSingle } from '#v0/composables/createSingle'
import { createTokens, flatten } from '#v0/composables/createTokens'
import { useLogger } from '#v0/composables/useLogger'
import { usePrefersDark } from '#v0/composables/useMediaQuery'

// Adapters
import { V0StyleSheetThemeAdapter } from '#v0/composables/useTheme/adapters'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { foreground as foregroundFn, isNumber, isString } from '#v0/utilities'
import { computed, shallowRef, toRef, watch } from 'vue'

// Types
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { SingleContext, SingleTicket, SingleTicketInput } from '#v0/composables/createSingle'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ThemeAdapter } from '#v0/composables/useTheme/adapters'
import type { ID } from '#v0/types'
import type { ComputedRef, Ref } from 'vue'

// Exports
export { V0StyleSheetThemeAdapter, V0UnheadThemeAdapter } from '#v0/composables/useTheme/adapters'

export { ThemeAdapter } from '#v0/composables/useTheme/adapters'

export type Colors = {
  [key: string]: string
}

export type ThemeColors = {
  [key: string]: Colors | string
}

export type ThemeRecord = {
  dark?: boolean
  lazy?: boolean
  colors: ThemeColors
}

/**
 * Input type for theme tickets - what users provide to register().
 * Extend this interface to add custom properties.
 */
export interface ThemeTicketInput extends SingleTicketInput<ThemeColors> {
  /**
   * Theme color definitions. When provided to `register()`, these are
   * onboarded as flat tokens for alias resolution and stored as the
   * ticket value.
   */
  colors?: ThemeColors
  /**
   * Indicates whether the theme is dark or light.
   *
   * @remarks Defaults to `false` (light theme).
   */
  dark?: boolean
  /**
   * Indicates whether the theme should be loaded lazily.
   *
   * @remarks Defaults to `false`.
   */
  lazy?: boolean
}

/**
 * Output type for theme tickets - what users receive from get().
 * Includes all input properties plus guaranteed dark/lazy values.
 *
 * @template Z The input ticket type that extends ThemeTicketInput.
 */
export type ThemeTicket<Z extends ThemeTicketInput = ThemeTicketInput> = SingleTicket<Z> & {
  /**
   * Indicates whether the theme is dark or light.
   *
   * @remarks Defaults to `false` (light theme).
   */
  dark: boolean
  /**
   * Indicates whether the theme should be loaded lazily.
   *
   * @remarks Defaults to `false`.
   */
  lazy: boolean
}

/**
 * Context for managing theme collections.
 *
 * @template Z The input ticket type.
 * @template E The output ticket type.
 */
export interface ThemeContext<
  Z extends ThemeTicketInput = ThemeTicketInput,
  E extends ThemeTicket<Z> = ThemeTicket<Z>,
> extends Omit<SingleContext<Z, E>, 'register'> {
  /**
   * A computed reference to the resolved colors of all registered themes.
   *
   * @remarks Returns a record keyed by theme ID. Each value contains the theme's colors
   * with any token aliases resolved to their actual values. Lazy themes are excluded
   * unless they are currently selected.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme
   *
   * @example
   * ```ts
   * import { useTheme } from '@vuetify/v0'
   *
   * const theme = useTheme()
   *
   * console.log(theme.colors.value)
   * ```
   */
  colors: ComputedRef<Record<string, Colors>>
  /**
   * A ref indicating whether the current theme is dark.
   *
   * @remarks Returns `true` if the current theme has `dark: true`, otherwise `false`.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme
   *
   * @example
   * ```ts
   * import { useTheme } from '@vuetify/v0'
   *
   * const theme = useTheme()
   *
   * console.log(theme.isDark.value) // true or false
   * ```
   */
  isDark: Readonly<Ref<boolean>>
  /**
   * Cycles through the provided themes in order.
   *
   * @param themes An array of theme IDs to cycle through. Defaults to all registered themes.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme
   *
   * @example
   * ```ts
   * import { useTheme } from '@vuetify/v0'
   *
   * const theme = useTheme()
   *
   * theme.cycle(['light', 'dark'])
   * ```
   */
  cycle: (themes?: ID[]) => void
  /**
   * `true` while the configured `system` pair is driving selection.
   * Becomes `false` after an explicit `select`.
   *
   * @example
   * ```ts
   * const theme = useTheme()
   * console.log(theme.isSystem.value)
   * ```
   */
  isSystem: Readonly<Ref<boolean>>
  /**
   * Return to following the `system` pair. Without `system`, re-selects `default`.
   *
   * @example
   * ```ts
   * const theme = useTheme()
   * theme.select('dark')
   * theme.reset()
   * ```
   */
  reset: () => void
  /**
   * Register a theme with optional colors.
   *
   * When `colors` is provided, onboards them as flat tokens for
   * alias resolution and stores them as the ticket value.
   *
   * @example
   * ```ts
   * const theme = createTheme({ themes: { light, dark }, default: 'light' })
   *
   * // Register a custom theme at runtime
   * theme.register({ id: 'custom', dark: true, colors: { primary: '#ff5722' } })
   * theme.select('custom')
   * ```
   */
  register: (registration?: Partial<Z>) => E
  /** Bulk-register multiple themes in a single batch. */
  onboard: (registrations: Partial<Z>[]) => E[]
  /**
   * Release adapter resources (watchers, stylesheet, unhead entries).
   * Called automatically on `app.unmount` when using the plugin path.
   * Call manually when using a standalone context (`createThemeContext`).
   */
  dispose: () => void
  /** Active theme adapter. Defaults to `V0StyleSheetThemeAdapter`. */
  adapter: ThemeAdapter
}

export interface ThemeSystemPair {
  light: ID
  dark: ID
}

export interface ThemeOptions<Z extends ThemeRecord = ThemeRecord> extends RegistryOptions {
  /**
   * The theme adapter to use.
   *
   * @remarks Defaults to `V0StyleSheetThemeAdapter`.
   */
  adapter?: ThemeAdapter
  /**
   * The default theme ID to select on initialization.
   *
   * @remarks Used on the server and when `system` is omitted or invalid.
   */
  default?: ID
  /**
   * Follow `prefers-color-scheme` using these registered theme ids until
   * the user calls `select`. Both ids must already be in `themes`.
   *
   * @example
   * ```ts
   * app.use(
   *   createThemePlugin({
   *     system: { light: 'light', dark: 'dark' },
   *     persist: true,
   *     themes: {
   *       light: { colors: { primary: '#3b82f6' } },
   *       dark: { dark: true, colors: { primary: '#675496' } },
   *     },
   *   }),
   * )
   * ```
   */
  system?: ThemeSystemPair
  /**
   * Automatically generate `on-*` foreground colors for each theme color
   * using APCA contrast analysis.
   *
   * @remarks Defaults to `false`.
   */
  foreground?: boolean
  /**
   * A collection of tokens to use for resolving theme colors.
   */
  palette?: TokenCollection
  /**
   * Output CSS variable values as decomposed RGB channels (`R, G, B`)
   * instead of hex strings.
   *
   * @remarks Defaults to `false`.
   */
  rgb?: boolean
  /**
   * A record of themes to register.
   */
  themes?: Record<ID, Z>
  /**
   * The target element or selector to apply theme classes to.
   *
   * @remarks If `null`, no classes will be applied.
   */
  target?: string | HTMLElement | null
}

export interface ThemeContextOptions extends ThemeOptions {
  namespace?: string
}

export interface ThemePluginOptions extends ThemeContextOptions {
  persist?: boolean
  /** When true, this plugin appears in the Vue DevTools v0 inspector. @default false */
  devtools?: boolean
}

/**
 * Creates a new theme instance.
 *
 * @param options The options for the theme instance.
 * @returns A new theme instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-theme
 *
 * @example
 * ```ts
 * import { createTheme } from '@vuetify/v0'
 *
 * const theme = createTheme({
 *   default: 'light',
 *   themes: {
 *     light: {
 *       dark: false,
 *       colors: {
 *         primary: '#3b82f6',
 *       },
 *     },
 *     dark: {
 *       dark: true,
 *       colors: {
 *         primary: '#675496',
 *       },
 *     },
 *   },
 * })
 * ```
 */

export function createTheme (_options: ThemeOptions = {}): ThemeContext {
  const { themes = {}, palette = {}, foreground: genForeground, system, adapter = new V0StyleSheetThemeAdapter(), ...options } = _options
  const tokens = createTokens({ palette, ...themes }, { flat: true })
  const registry = createSingle<SingleTicketInput<ThemeColors>, SingleTicket<SingleTicketInput<ThemeColors>>>({ ...options, reactive: true })
  const logger = useLogger()

  for (const id in themes) {
    const { colors: value, ...theme } = themes[id]!

    register({ id, value, ...theme } as Partial<ThemeTicketInput>)
  }

  const pair = resolveSystemPair(system, registry, logger)
  const following = shallowRef(Boolean(pair))

  if (!pair && options.default && !registry.selectedId.value) {
    registry.select(options.default)
  }

  type InternalTicket = SingleTicket<SingleTicketInput<ThemeColors>> & { dark: boolean, lazy: boolean }

  const names = toRef(() => registry.keys())
  const colors = computed(() => {
    const resolved = {} as Record<ID, Colors>
    const currentId = registry.selectedId.value
    for (const theme of registry.values() as InternalTicket[]) {
      if (theme.lazy && theme.id !== currentId) continue

      const themeColors = resolve(theme.value as Colors)

      if (genForeground) {
        for (const [key, value] of Object.entries(themeColors)) {
          const onKey = `on-${key}`
          if (!key.startsWith('on-') && !(onKey in themeColors)) {
            themeColors[onKey] = foregroundFn(value)
          }
        }
      }

      resolved[theme.id] = themeColors
    }

    return resolved
  })

  const isDark = toRef(() => (registry.selectedItem.value as InternalTicket | undefined)?.dark ?? false)
  const isSystem = toRef(() => following.value)

  const media = pair ? usePrefersDark() : undefined

  function follow () {
    if (!pair || !media) return
    const id = media.matches.value ? pair.dark : pair.light
    if (registry.has(id)) registry.select(id)
  }

  if (pair) {
    if (IN_BROWSER) {
      follow()
    } else if (options.default && !registry.selectedId.value) {
      registry.select(options.default)
    }

    watch(() => media!.matches.value, () => {
      if (following.value) follow()
    })
  }

  function select (id: ID) {
    following.value = false
    registry.select(id)
  }

  function reset () {
    if (pair) {
      following.value = true
      follow()
      return
    }

    if (options.default) registry.select(options.default)
  }

  function cycle (themes: readonly ID[] = names.value) {
    const current = themes.indexOf(registry.selectedId.value ?? '')
    const next = current === -1 ? 0 : (current + 1) % themes.length

    select(themes[next]!)
  }

  function resolve (colors: Colors): Colors {
    const resolved: Colors = {}
    for (const [key, value] of Object.entries(colors)) {
      resolved[key] = tokens.isAlias(value) ? tokens.resolve(value) as string : value
    }

    return resolved
  }

  function register (registration: Partial<ThemeTicketInput> = {} as Partial<ThemeTicketInput>): ThemeTicket {
    const { colors, ...rest } = registration as Partial<ThemeTicketInput> & { colors?: ThemeColors }

    if (colors && rest.id && !registry.has(rest.id)) {
      tokens.onboard(flatten({ [rest.id]: { colors } }, '', true))
    }

    const item = {
      lazy: false,
      dark: false,
      ...rest,
      ...(colors ? { value: colors } : {}),
    }

    return registry.register(item as Partial<SingleTicketInput<ThemeColors>>) as ThemeTicket
  }

  function onboard (registrations: Partial<ThemeTicketInput>[]): ThemeTicket[] {
    return registry.batch(() => registrations.map(registration => register(registration)))
  }

  return {
    ...registry,
    colors,
    isDark,
    isSystem,
    select,
    reset,
    register,
    onboard,
    cycle,
    adapter,
    dispose: () => {
      media?.stop()
    },
    get size () {
      return registry.size
    },
  } as ThemeContext
}

function resolveSystemPair (
  system: ThemeSystemPair | undefined,
  registry: { get: (id: ID) => unknown },
  logger: { warn: (message: string) => void },
): ThemeSystemPair | undefined {
  if (!system) return undefined

  const light = registry.get(system.light)
  const dark = registry.get(system.dark) as { dark?: boolean } | undefined

  if (!light) {
    logger.warn(`[v0:theme] system.light "${String(system.light)}" is not registered`)
    return undefined
  }

  if (!dark) {
    logger.warn(`[v0:theme] system.dark "${String(system.dark)}" is not registered`)
    return undefined
  }

  if (!dark.dark) {
    logger.warn(`[v0:theme] system.dark "${String(system.dark)}" should have dark: true`)
  }

  return system
}

function createThemeFallback (): ThemeContext {
  return {
    size: 0,
    colors: computed(() => ({})),
    isDark: shallowRef(false),
    isSystem: shallowRef(false),
    cycle: () => {},
    reset: () => {},
    onboard: () => [],
    dispose: () => {},
    adapter: new V0StyleSheetThemeAdapter(),
  } as unknown as ThemeContext
}

export const [createThemeContext, createThemePlugin, useTheme] =
  createPluginContext<ThemePluginOptions, ThemeContext>(
    'v0:theme',
    options => createTheme(options),
    {
      inspect: ctx => ({
        selectedId: ctx.selectedId,
        isDark: ctx.isDark,
        isSystem: ctx.isSystem,
        adapter: ctx.adapter.constructor.name,
        themes: [...ctx.keys()],
      }),
      fallback: () => createThemeFallback(),
      setup: (context, app, { target, rgb }) => {
        if (rgb) context.adapter.rgb = true
        context.adapter.setup(app, context, target)
        app.onUnmount(() => context.adapter.dispose?.())
      },
      persist: ctx => ctx.isSystem.value ? null : ctx.selectedId.value,
      restore: (ctx, saved) => {
        if (isString(saved) || isNumber(saved)) ctx.select(saved)
      },
    },
  )
