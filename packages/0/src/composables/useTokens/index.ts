/**
 * @module useTokens
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-tokens
 *
 * @remarks
 * Design token registry with alias resolution and W3C Design Tokens format support.
 *
 * Key features:
 * - Alias resolution with circular reference detection
 * - Nested token flattening with dot notation
 * - W3C Design Tokens format ($value, $type, $description, $extensions)
 * - Path-based resolution (e.g., {colors}.blue.500)
 * - Resolution caching for performance (~28,590 ops/sec)
 *
 * Used by useTheme, useLocale, and useFeatures for token-based configuration.
 */

// Factories
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { isObject, isString } from '#v0/utilities'

// Types
import type { RegistryTicket, RegistryContext, RegistryOptions, RegistryContextOptions } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { App } from 'vue'

export interface TokenAlias<T = unknown> {
  [key: string]: unknown
  $value: T
  $type?: string
  $description?: string
  $extensions?: Record<string, unknown>
  $deprecated?: boolean | string
}

export type TokenPrimitive = string | number | boolean | null

export type TokenValue = TokenPrimitive | TokenAlias

export interface TokenCollection {
  [key: string]: TokenValue | TokenCollection
}

export type FlatTokenCollection = {
  id: string
  value: TokenValue
}

export interface TokenTicket extends RegistryTicket {}

export interface TokenContext<Z extends TokenTicket> extends RegistryContext<Z> {
  /**
   * Checks if a token is an alias
   *
   * @param token The token to check.
   * @returns True if the token is an alias, false otherwise.
   * @remarks An alias is a string that starts with "{" and ends with "}".
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-tokens#is-alias
   *
   * @example
   * ```ts
   * const tokens = useTokens({
   *   colors: {
   *     primary: '#3b82f6',
   *     secondary: '{colors.primary}', // Alias reference
   *   },
   * })
   *
   * console.log(tokens.isAlias('{colors.primary}')) // true
   * console.log(tokens.isAlias('#3b82f6')) // false
   * ```
   */
  isAlias: (token: unknown) => token is string
  /**
   * Resolves a token or alias to its value.
   *
   * @param token The token or alias to resolve.
   * @returns The resolved value of the token or alias, or undefined if not found.
   * @remarks This function can resolve nested aliases and supports token paths using dot notation.
   *
   * @see https://0.vuetifyjs.com/composables/registration/use-tokens#resolve
   *
   * @example
   * ```ts
   * const tokens = useTokens({
   *   colors: {
   *     primary: '#3b82f6',
   *     secondary: '{colors.primary}', // Alias reference
   *   },
   * })
   *
   * console.log(tokens.resolve('{colors.primary}')) // '#3b82f6'
   * console.log(tokens.resolve('{colors.secondary}')) // '#3b82f6'
   * ```
   */
  resolve: (token: string | TokenAlias) => unknown | undefined
}

export interface TokenOptions extends RegistryOptions {
  /**
   * Whether to flatten nested token structures.
   *
   * @default false
   */
  flat?: boolean
  /**
   * An optional prefix to prepend to each token ID during registration.
   *
   * @remarks This is useful for namespacing tokens.
   */
  prefix?: string
}

export interface TokenContextOptions extends TokenOptions, RegistryContextOptions {
  tokens?: TokenCollection
}

/**
 * Creates a new token instance.
 *
 * @param tokens The tokens to use.
 * @param options The options for the token instance.
 * @template Z The type of the token ticket.
 * @template E The type of the token context.
 * @returns A new token instance.
 *
 * @see https://www.designtokens.org/tr/drafts/format/
 * @see https://0.vuetifyjs.com/composables/registration/use-tokens
 *
 * @example
 * ```ts
 * import { useTokens } from '@vuetify/v0'
 *
 * const tokens = useTokens({
 *   colors: {
 *     primary: '#3b82f6',
 *     secondary: '{colors.primary}', // Alias reference
 *   },
 * })
 *
 * console.log(tokens.resolve('{colors.primary}')) // '#3b82f6'
 * console.log(tokens.resolve('{colors.secondary}')) // '#3b82f6'
 * ```
 */
export function createTokens<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext<Z> = TokenContext<Z>,
> (
  tokens: TokenCollection = {},
  options: TokenOptions = {},
): E {
  const logger = useLogger()
  const registry = useRegistry<Z, E>(options)

  const cache = new Map<string, unknown | undefined>()

  registry.onboard(flatten(tokens, options.prefix, !!options.flat) as Partial<Z>[])

  function isAlias (token: unknown): token is string {
    return isString(token) && token.length > 2 && token[0] === '{' && token.at(-1) === '}'
  }

  function isTokenAlias (value: unknown): value is TokenAlias {
    return isObject(value) && '$value' in value
  }

  function resolve (token: string | TokenAlias, visited = new Set<string>()): unknown | undefined {
    const cacheKey = isString(token) ? token : JSON.stringify(token)
    const cached = cache.get(cacheKey)

    if (cached !== undefined) return cached

    const reference: unknown = isTokenAlias(token) ? token.$value : token
    const clean = isString(reference) && isAlias(reference) ? reference.slice(1, -1) : String(reference)

    // Detect circular references
    if (visited.has(clean)) {
      logger.warn(`Circular alias detected for "${clean}"`)
      cache.set(cacheKey, undefined)
      return undefined
    }

    visited.add(clean)

    let found = registry.get(clean)

    let segments: string[] = []
    if (!found && clean.includes('.')) {
      const parts = clean.split('.')
      for (let i = parts.length - 1; i > 0; i--) {
        const prefix = parts.slice(0, i).join('.')
        const suffix = parts.slice(i)
        const candidate = registry.get(prefix)
        if (candidate?.value !== undefined) {
          found = candidate
          segments = suffix
          break
        }
      }
    }

    if (found?.value === undefined) {
      logger.warn(`Alias not found for "${String(reference)}"`)
      cache.set(cacheKey, undefined)
      return undefined
    }

    let result: unknown | undefined
    let current: unknown = found.value

    if (segments.length > 0) {
      if (isTokenAlias(current)) current = current.$value

      for (const segment of segments) {
        if (!isObject(current) || !(segment in current)) {
          current = undefined
          break
        }

        current = current[segment]

        if (isTokenAlias(current)) current = current.$value
      }

      if (current === undefined) {
        logger.warn(`Path not found inside "${clean}": ${segments.join('.')}`)
        cache.set(cacheKey, undefined)
        return undefined
      }

      result = current
    } else {
      if (isTokenAlias(current)) {
        const inner = current.$value
        if (isString(inner) && isAlias(inner)) return resolve(inner as string, visited)
        result = inner
      } else if (isString(current) && isAlias(current)) {
        return resolve(current, visited)
      } else {
        result = current
      }
    }

    cache.set(cacheKey, result)

    return result
  }

  return {
    ...registry,
    resolve,
    isAlias,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new token context.
 *
 * @param namespace The namespace for the token context.
 * @param tokens The tokens to use.
 * @template Z The type of the token ticket.
 * @template E The type of the token context.
 * @returns A new token context.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-tokens
 *
 * @example
 * ```ts
 * import { createTokensContext } from '@vuetify/v0'
 *
 * export const [useTokens, provideTokens, context] = createTokensContext({
 *  namespace: 'v0:tokens',
 *  tokens: {
 *    colors: {
 *      primary: '#3b82f6',
 *      secondary: '{colors.primary}', // Alias reference
 *    },
 *  },
 * })
 * ```
 */
export function createTokensContext<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext<Z> = TokenContext<Z>,
> (_options: TokenContextOptions): ContextTrinity<E> {
  const { namespace, tokens = {}, ...options } = _options
  const [useTokensContext, _provideTokensContext] = createContext<E>(namespace)

  const context = createTokens<Z, E>(tokens, options)

  function provideTokensContext (_context: E = context, app?: App): E {
    return _provideTokensContext(_context, app)
  }

  return createTrinity<E>(useTokensContext, provideTokensContext, context)
}

/**
 * Returns the current tokens instance.
 *
 * @param namespace The namespace for the tokens context. Defaults to `'v0:tokens'`.
 * @returns The current tokens instance.
 *
 * @see https://0.vuetifyjs.com/composables/registration/use-tokens
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useTokens } from '@vuetify/v0'
 *
 *   const tokens = useTokens()
 * </script>
 * ```
 */
export function useTokens<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext<Z> = TokenContext<Z>,
> (namespace = 'v0:tokens'): E {
  return useContext<E>(namespace)
}

/**
 * Flattens a nested collection of tokens into a flat array of tokens.
 * Each token is represented by an object containing its ID & value.
 * @param tokens The collection of tokens to flatten.
 * @param prefix An optional prefix to prepend to each token ID.
 * @returns An array of flattened tokens, each with an ID and value.
 */
function flatten (tokens: TokenCollection, prefix = '', flat = false): FlatTokenCollection[] {
  const flattened: FlatTokenCollection[] = []
  const stack: { tokens: TokenCollection, prefix: string, flat: boolean }[] = [{ tokens, prefix, flat }]

  while (stack.length > 0) {
    const { tokens: currentTokens, prefix: currentPrefix, flat } = stack.pop()!

    const meta: Record<string, unknown> = {}
    for (const k in currentTokens) {
      if (k.startsWith('$')) meta[k] = (currentTokens as Record<string, unknown>)[k]
    }

    if (Object.keys(meta).length > 0 && currentPrefix) {
      flattened.push({ id: currentPrefix, value: meta as TokenValue })
    }

    for (const key in currentTokens) {
      if (key.startsWith('$')) continue

      const value = (currentTokens as Record<string, unknown>)[key]
      const id = currentPrefix ? `${currentPrefix}.${key}` : key

      if (!isObject(value)) {
        flattened.push({ id, value: value as string | boolean | number })
        continue
      }

      if ('$value' in value) {
        flattened.push({ id, value: value as TokenAlias })

        const inner = value.$value
        if (isObject(inner) && !flat) {
          for (const innerKey in inner) {
            if (innerKey.startsWith('$')) continue

            const child = inner[innerKey]
            const childId = `${id}.${innerKey}`
            if (!isObject(child)) {
              flattened.push({ id: childId, value: child as string | boolean | number })
            } else if ('$value' in child) {
              flattened.push({ id: childId, value: child as TokenAlias })
            } else {
              stack.push({ tokens: child as TokenCollection, prefix: childId, flat })
            }
          }
        }
        continue
      }

      if (flat) {
        flattened.push({ id, value: value as unknown as TokenValue })
        continue
      }

      stack.push({ tokens: value as TokenCollection, prefix: id, flat })
    }
  }

  return flattened
}
