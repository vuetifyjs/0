// Factories
import { createTrinity } from '#v0/factories/createTrinity'
import { createContext } from '#v0/factories/createContext'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { isObject, isPrimitive, isString } from '#v0/utilities'

// Types
import type { RegistryTicket, RegistryContext } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/factories/createTrinity'
import type { App } from 'vue'

export interface TokenAlias {
  [key: string]: any
  $value: string
  $type?: string
  $description?: string
}

export type TokenValue = string | number | boolean | TokenAlias

export interface TokenCollection {
  [key: string]: TokenValue | TokenCollection
}

export type FlatTokenCollection = {
  id: string
  value: TokenValue
}

export interface TokenTicket extends RegistryTicket {}

export interface TokenContext<Z extends TokenTicket> extends RegistryContext<Z> {
  resolve: (token: string) => string | undefined
}

/**
 * Creates a token registry for managing design token collections with alias resolution.
 * Returns the token context directly for simple usage.
 *
 * @param tokens An optional collection of tokens to initialize
 * @template Z The structure of the registry token items.
 * @template E The available methods for the token's context.
 * @returns The token context object.
 */
export function useTokens<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext<Z> = TokenContext<Z>,
> (tokens: TokenCollection = {}): E {
  const logger = useLogger()
  const cache = new Map<string, string | undefined>()

  const registry = useRegistry<Z, E>()

  for (const { id, value } of flatten(tokens)) {
    registry.register({ value, id } as Partial<Z>)
  }

  function isAlias (token: unknown): token is string {
    return isString(token) && token.length > 2 && token[0] === '{' && token.at(-1) === '}'
  }

  function isTokenAlias (value: unknown): value is TokenAlias {
    return isObject(value) && '$value' in value
  }

  function resolve (token: string): string | undefined {
    const cached = cache.get(token)

    if (cached !== undefined) return cached

    const reference = isTokenAlias(token) ? token.$value : token
    const cleaned = isAlias(reference) ? reference.slice(1, -1) : reference

    const found = registry.collection.get(cleaned)

    if (found?.value === undefined) {
      logger.warn(`Alias not found for "${reference}"`)
      cache.set(token, undefined)
      return undefined
    }

    let result: string | undefined

    if (isTokenAlias(found.value)) result = resolve(found.value.$value)
    else if (isAlias(found.value)) result = resolve(found.value)
    else result = String(found.value)

    cache.set(token, result)

    return result
  }

  const context: E = {
    ...registry,
    resolve,
  }

  return context
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
  const [useTokensContext, provideTokensContext] = createContext<E>(namespace)

  const context = useTokens<Z, E>(tokens)

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

    for (const key in currentTokens) {
      const value = currentTokens[key]
      const id = currentPrefix ? `${currentPrefix}.${key}` : key

      if (isPrimitive(value)) {
        flattened.push({ id, value: String(value) })
      } else if (isObject(value) && '$value' in value) {
        flattened.push({ id, value: value as TokenAlias })
      } else if (isObject(value)) {
        stack.push({ tokens: value, prefix: id })
      }
    }
  }

  return flattened
}
