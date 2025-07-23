// Factories
import { createTrinity } from '#v0/factories/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { computed } from 'vue'

// Types
import type { ComputedRef } from 'vue'
import type { RegistryTicket, RegistryContext } from '#v0/composables/useRegistry'

export type TokenAlias = {
  $value: string
}

export type TokenValue = string | TokenAlias

export type TokenCollection = {
  [key: string]: TokenValue | TokenCollection
}

export type TokenTicket = RegistryTicket & {
  value: string
}

export type TokenContext = RegistryContext & {
  resolve: (token: string) => string | undefined
  resolved: ComputedRef<Record<string, string>>
}

interface FlattenedToken {
  id: string
  value: TokenValue
}

/**
 * Flattens a nested collection of tokens into a flat array of tokens.
 * Each token is represented by an object containing its ID & value.
 * @param tokens The collection of tokens to flatten.
 * @param prefix An optional prefix to prepend to each token ID.
 * @returns An array of flattened tokens, each with an ID and value.
 */
function flatten (tokens: TokenCollection, prefix = ''): FlattenedToken[] {
  const flattened: FlattenedToken[] = []

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

  const flattened = flatten(tokens)
  const collection = new Map<string, TokenValue>()

  for (const { id, value } of flattened) {
    collection.set(id, value)
  }

  const resolved = computed(() => dereference(Object.fromEntries(collection.entries())))

  for (const { id, value } of flattened) {
    const resolvedValue = resolved.value[id] || (typeof value === 'string' ? value : value.$value)

    registry.register({ value: resolvedValue } as Partial<E>, id)
  }

  function clean (token: string): string {
    return token.startsWith('{') && token.endsWith('}') ? token.slice(1, -1) : token
  }

  function resolve (token: string): string | undefined {
    return resolved.value[clean(token)]
  }

  /**
 * Resolves token aliases within a collection of tokens
 * @param tokens The collection of tokens to resolve.
 * @returns A new collection of dereferenced tokens
 */
  function dereference (tokens: Record<string, TokenValue>): Record<string, string> {
    const resolved: Record<string, string> = {}
    const resolving = new Set<string>()

    function isTokenAlias (value: any): value is TokenAlias {
      return typeof value === 'object' && value !== null && '$value' in value
    }

    function resolve (key: string, value: TokenValue): string {
      const reference = isTokenAlias(value) ? value.$value : value

      if (typeof reference !== 'string' || !reference.startsWith('{') || !reference.endsWith('}')) {
        if (isTokenAlias(value)) logger.warn(`Invalid alias format for "${key}": ${reference}`)
        return reference
      }

      const alias = reference.slice(1, -1)
      if (resolving.has(alias)) {
        logger.warn(`Circular reference detected for "${key}": ${alias}`)
        return reference
      }

      if (!(alias in tokens)) {
        logger.warn(`Alias not found for "${key}": ${alias}`)
        return reference
      }

      resolving.add(alias)
      const result = resolve(alias, tokens[alias])
      resolving.delete(alias)

      return result
    }

    for (const [key, value] of Object.entries(tokens)) {
      resolved[key] = resolve(key, value)
    }

    return resolved
  }

  return createTrinity<Z>(useTokenContext, provideTokenContext, {
    ...registry,
    resolve,
    resolved,
  } as Z)
}
