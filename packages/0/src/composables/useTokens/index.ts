// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { isObject, isString } from '#v0/utilities'

// Types
import type { RegistryTicket, RegistryContext } from '#v0/composables/useRegistry'

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

export type TokenTicket = RegistryTicket & {
  value: TokenValue
}

export type TokenContext = RegistryContext<TokenTicket> & {
  resolve: (token: string) => string | undefined
}

/**
 * Creates a token registry for managing data structures / aliases
 * @param namespace The namespace for the token registry context
 * @param tokens An optional collection of tokens to initialize
 * @template Z The available methods for the token's context.
 * @template E The structure of the registry token items.
 * @returns A trinity of provide/inject methods & context
 *
 * @see Inspired by https://www.designtokens.org/tr/drafts/format/#aliases-references
 * @see https://0.vuetifyjs.com/composables/registration/use-tokens
 */
export function useTokens<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext = TokenContext,
> (
  namespace: string,
  tokens: TokenCollection = {},
) {
  const logger = useLogger()
  const cache = new Map<string, string | undefined>()

  const [useTokenContext, provideTokenContext, registry] = useRegistry<Z, E>(namespace)

  for (const { id, value } of flatten(tokens)) {
    registry.register({ value }, id)
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

  return createTrinity<E>(useTokenContext, provideTokenContext, {
    ...registry,
    resolve,
  } as unknown as E)
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

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        flattened.push({ id, value: String(value) })
      } else if (value && typeof value === 'object' && '$value' in value) {
        flattened.push({ id, value: value as TokenAlias })
      } else if (value && typeof value === 'object') {
        stack.push({ tokens: value, prefix: id })
      }
    }
  }

  return flattened
}
