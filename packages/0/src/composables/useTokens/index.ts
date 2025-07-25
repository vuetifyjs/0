// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useLogger } from '#v0/composables/useLogger'

// Types
import type { RegistryTicket, RegistryContext } from '#v0/composables/useRegistry'
import { isObject, isString } from '#v0/utilities'

export type TokenAlias = {
  $value: string
}

export type TokenValue = string | TokenAlias

export type TokenCollection = {
  [key: string]: TokenValue | TokenCollection
}

export type FlatTokenCollection = {
  id: string
  value: TokenValue
}

export type TokenTicket = RegistryTicket & {
  value: string
}

export type TokenContext = RegistryContext & {
  resolve: (token: string) => string | undefined
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

  for (const [key, value] of Object.entries(tokens)) {
    const id = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      flattened.push({ id, value })
    } else if (value && typeof value === 'object' && '$value' in value) {
      flattened.push({ id, value: value as TokenAlias })
    } else if (value && typeof value === 'object') {
      flattened.push(...flatten(value as TokenCollection, id))
    }
  }

  return flattened
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
  Z extends TokenContext,
  E extends TokenTicket,
> (
  namespace: string,
  tokens: TokenCollection = {},
) {
  const logger = useLogger()

  const [useTokenContext, provideTokenContext, registry] = useRegistry<Z, E>(namespace)

  for (const { id, value } of flatten(tokens)) {
    registry.register({ value } as Partial<E>, id)
  }

  function clean (token: string): string {
    return isAlias(token) ? token.slice(1, -1) : token
  }

  function isAlias (token: unknown): token is string {
    return isString(token) && token.startsWith('{') && token.endsWith('}')
  }

  function isTokenAlias (value: unknown): value is TokenAlias {
    return isObject(value) && '$value' in value
  }

  function resolve (token: string): string | undefined {
    const reference = isTokenAlias(token) ? token.$value : token

    const found = registry.collection.get(clean(reference)) as E | undefined

    if (isTokenAlias(found?.value)) return resolve(found.value.$value)
    if (isAlias(found?.value)) return resolve(found.value)

    if (found?.value === undefined) logger.warn(`Alias not found for "${token}"`)

    return found?.value
  }

  return createTrinity<Z>(useTokenContext, provideTokenContext, {
    ...registry,
    resolve,
  } as Z)
}
