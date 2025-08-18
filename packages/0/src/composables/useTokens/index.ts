// Factories
import { createTrinity } from '#v0/factories/createTrinity'
import { createContext } from '#v0/factories/createContext'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { isObject, isString } from '#v0/utilities'

// Types
import type { RegistryTicket, RegistryContext } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/factories/createTrinity'
import type { App } from 'vue'

export interface TokenAlias<T = unknown> {
  [key: string]: unknown
  $value: T
  $type?: string
  $description?: string
  $extensions?: Record<string, unknown>
  $deprecated?: boolean | string
}

export type TokenPrimitive = string | number | boolean

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
  resolve: (token: string | TokenAlias) => unknown | undefined
}

/**
 * Creates a token registry for managing design token collections with alias resolution.
 * Returns the token context directly for simple usage.
 *
 * @param tokens A collection of tokens to initialize with
 * @template Z The structure of the registry token items.
 * @template E The available methods for the token's context.
 * @returns The token context object.
 * @see https://www.designtokens.org/tr/drafts/format/
 */
export function useTokens<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext<Z> = TokenContext<Z>,
> (tokens: TokenCollection = {}): E {
  const logger = useLogger()
  const registry = useRegistry<Z, E>()

  const cache = new Map<string, unknown | undefined>()

  registry.onboard(flatten(tokens) as Partial<Z>[])

  function isAlias (token: unknown): token is string {
    return isString(token) && token.length > 2 && token[0] === '{' && token.at(-1) === '}'
  }

  function isTokenAlias (value: unknown): value is TokenAlias {
    return isObject(value) && '$value' in value
  }

  function resolve (token: string | TokenAlias): unknown | undefined {
    const cacheKey = isString(token) ? token : JSON.stringify(token)
    const cached = cache.get(cacheKey)

    if (cached !== undefined) return cached

    const reference: unknown = isTokenAlias(token) ? token.$value : token
    const clean = isString(reference) && isAlias(reference) ? reference.slice(1, -1) : String(reference)

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
        if (isString(inner) && isAlias(inner)) return resolve(inner as string)
        result = inner
      } else if (isString(current) && isAlias(current)) {
        return resolve(current)
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
  } as E
}

/**
 * Creates a token registry context with full injection/provision control.
 * Returns the complete trinity for advanced usage scenarios.
 *
 * @param namespace The namespace for the token registry context
 * @param tokens An optional collection of tokens to initialize
 * @template Z The structure of the registry token items.
 * @template E The available methods for the token's context.
 * @returns A tuple containing the inject function, provide function, and the token context.
 */
export function createTokensContext<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext<Z> = TokenContext<Z>,
> (
  namespace: string,
  tokens: TokenCollection = {},
): ContextTrinity<E> {
  const [useTokensContext, _provideTokensContext] = createContext<E>(namespace)

  const context = useTokens<Z, E>(tokens)

  function provideTokensContext (_context: E = context, app?: App): E {
    return _provideTokensContext(_context, app)
  }

  return createTrinity<E>(useTokensContext, provideTokensContext, context)
}

/**
 * Flattens a nested collection of tokens into a flat array of tokens.
 * Each token is represented by an object containing its ID & value.
 * @param tokens The collection of tokens to flatten.
 * @param prefix An optional prefix to prepend to each token ID.
 * @returns An array of flattened tokens, each with an ID and value.
 */
function flatten (tokens: TokenCollection, prefix = ''): FlatTokenCollection[] {
  const flattened: FlatTokenCollection[] = []
  const stack: Array<{ tokens: TokenCollection, prefix: string }> = [{ tokens, prefix }]

  while (stack.length > 0) {
    const { tokens: currentTokens, prefix: currentPrefix } = stack.pop()!

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
        if (isObject(inner)) {
          for (const innerKey in inner) {
            if (innerKey.startsWith('$')) continue

            const child = inner[innerKey]
            const childId = `${id}.${innerKey}`
            if (!isObject(child)) {
              flattened.push({ id: childId, value: child as string | boolean | number })
            } else if ('$value' in child) {
              flattened.push({ id: childId, value: child as TokenAlias })
            } else {
              stack.push({ tokens: child as TokenCollection, prefix: childId })
            }
          }
        }
        continue
      }

      stack.push({ tokens: value as TokenCollection, prefix: id })
    }
  }

  return flattened
}
