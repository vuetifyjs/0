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

// Adapters
import { V0StyleSheetThemeAdapter } from '#v0/composables/useTheme/adapters'

// Utilities
import { foreground as foregroundFn } from '#v0/utilities'
import { computed, shallowRef, toRef } from 'vue'

// Types
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { SingleContext, SingleTicket, SingleTicketInput } from '#v0/composables/createSingle'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ThemeAdapter } from '#v0/composables/useTheme/adapters'
import type { ID } from '#v0/types'
import type { ComputedRef, Ref } from 'vue'

// Exports
export { V0StyleSheetThemeAdapter, V0UnheadThemeAdapter } from '#v0/composables/useTheme/adapters'

export type { ThemeAdapter } from '#v0/composables/useTheme/adapters'

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
   */
  default?: ID
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
 * export const [useTheme, provideTheme] = createTheme({
 *   namespace: 'v0:theme',
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
  const { themes = {}, palette = {}, foreground: genForeground, ...options } = _options
  const tokens = createTokens({ palette, ...themes }, { flat: true })
  const registry = createSingle<SingleTicketInput<ThemeColors>, SingleTicket<SingleTicketInput<ThemeColors>>>({ ...options, reactive: true })

  for (const id in themes) {
    const { colors: value, ...theme } = themes[id]!

    register({ id, value, ...theme } as Partial<ThemeTicketInput>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
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

  function cycle (themes: readonly ID[] = names.value) {
    const current = themes.indexOf(registry.selectedId.value ?? '')
    const next = current === -1 ? 0 : (current + 1) % themes.length

    registry.select(themes[next]!)
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
    register,
    onboard,
    cycle,
    get size () {
      return registry.size
    },
  } as ThemeContext
}

function createThemeFallback (): ThemeContext {
  return {
    size: 0,
    colors: computed(() => ({})),
    isDark: shallowRef(false),
    cycle: () => {},
    onboard: () => [],
  } as unknown as ThemeContext
}

export const [createThemeContext, createThemePlugin, useTheme] =
  createPluginContext<ThemePluginOptions, ThemeContext>(
    'v0:theme',
    options => createTheme(options),
    {
      fallback: () => createThemeFallback(),
      setup: (context, app, { adapter = new V0StyleSheetThemeAdapter(), target, rgb }) => {
        if (rgb) adapter.rgb = true
        adapter.setup(app, context, target)
      },
      persist: ctx => ctx.selectedId.value,
      restore: (ctx, saved) => ctx.select(saved as ID),
    },
  )
