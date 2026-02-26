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
 * - Token alias resolution via useTokens
 * - Lazy theme loading (compute colors only when selected)
 * - CSS variable generation via adapter pattern
 * - SSR support with head integration
 * - Theme cycling
 *
 * Integrates with createSingle for selection and useTokens for color resolution.
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createSingle } from '#v0/composables/createSingle'
import { createTokens } from '#v0/composables/createTokens'

// Adapters
import { Vuetify0ThemeAdapter } from '#v0/composables/useTheme/adapters'

// Utilities
import { computed, toRef } from 'vue'

// Types
import type { RegistryOptions } from '#v0/composables/createRegistry'
import type { SingleContext, SingleTicket, SingleTicketInput } from '#v0/composables/createSingle'
import type { TokenCollection } from '#v0/composables/createTokens'
import type { ThemeAdapter } from '#v0/composables/useTheme/adapters'
import type { ID } from '#v0/types'
import type { ComputedRef, Ref } from 'vue'

// Exports
export { Vuetify0ThemeAdapter } from '#v0/composables/useTheme/adapters'

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
   * A computed reference to the resolved colors of the current theme.
   *
   * @remarks The colors are resolved by replacing any token aliases with their actual values.
   *
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme#colors
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
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme#isDark
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
   * @see https://0.vuetifyjs.com/composables/plugins/use-theme#cycle
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
  /** Register a theme (accepts input type, returns output type) */
  register: (registration?: Partial<Z>) => E
}

export interface ThemeOptions<Z extends ThemeRecord = ThemeRecord> extends RegistryOptions {
  /**
   * The theme adapter to use.
   *
   * @remarks Defaults to `Vuetify0ThemeAdapter`.
   */
  adapter?: ThemeAdapter
  /**
   * The default theme ID to select on initialization.
   */
  default?: ID
  /**
   * A collection of tokens to use for resolving theme colors.
   */
  palette?: TokenCollection
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

export interface ThemePluginOptions extends ThemeContextOptions {}

/**
 * Creates a new theme instance.
 *
 * @param options The options for the theme instance.
 * @template Z The type of the theme ticket.
 * @template E The type of the theme context.
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

export function createTheme<
  Z extends ThemeTicketInput = ThemeTicketInput,
  E extends ThemeTicket<Z> = ThemeTicket<Z>,
  R extends ThemeContext<Z, E> = ThemeContext<Z, E>,
> (_options: ThemeOptions = {}): R {
  const { themes = {}, palette = {}, ...options } = _options
  const tokens = createTokens({ palette, ...themes }, { flat: true })
  const registry = createSingle<SingleTicketInput<ThemeColors>, SingleTicket<SingleTicketInput<ThemeColors>>>(options)

  for (const id in themes) {
    const { colors: value, ...theme } = themes[id]!

    register({ id, value, ...theme } as Partial<Z>)

    if (id === options.default && !registry.selectedId.value) {
      registry.select(id as ID)
    }
  }

  type InternalTicket = SingleTicket<SingleTicketInput<ThemeColors>> & { dark: boolean, lazy: boolean }

  const names = computed(() => registry.keys())
  const colors = computed(() => {
    const resolved = {} as Record<ID, Colors>
    for (const theme of registry.values() as InternalTicket[]) {
      if (theme.lazy && theme.id !== registry.selectedId.value) continue

      resolved[theme.id] = resolve(theme.value as Colors)
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

  function register (registration: Partial<Z> = {} as Partial<Z>): E {
    const item = {
      lazy: false,
      dark: false,
      ...registration,
    }

    return registry.register(item as unknown as Partial<SingleTicketInput<ThemeColors>>) as unknown as E
  }

  function onboard (registrations: Partial<Z>[]): E[] {
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
  } as unknown as R
}

export const [createThemeContext, createThemePlugin, useTheme] =
  createPluginContext<ThemePluginOptions, ThemeContext>(
    'v0:theme',
    options => createTheme(options),
    {
      setup: (context, app, { adapter = new Vuetify0ThemeAdapter(), target }) => {
        adapter.setup(app, context, target)
      },
    },
  )
