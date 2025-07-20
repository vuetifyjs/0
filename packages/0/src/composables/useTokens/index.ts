// Composables
import { useRegistrar } from '#v0/composables/useRegistrar'
import { createTrinity } from '#v0/factories/createTrinity'

// Utilities
import { computed } from 'vue'

// Types
import type { ComputedRef } from 'vue'
import type { RegistrarTicket, RegistrarContext } from '#v0/composables/useRegistrar'

export type TokenAlias = {
  $value: string
}

export type TokenValue = string | TokenAlias

export type TokenCollection = {
  [key: string]: TokenValue | TokenCollection
}

export type TokenTicket = RegistrarTicket & {
  value: string
}

export type TokenContext = RegistrarContext & {
  resolve: (token: string) => string | undefined
  resolved: ComputedRef<Record<string, string>>
}

interface FlattenedToken {
  id: string
  value: TokenValue
}

/**
 * Flattens a nested collection of tokens into a flat array of tokens.
 * Each token is represented by an object containing its ID and value.
 *
 * @param tokens The collection of tokens to flatten.
 * @param prefix An optional prefix to prepend to each token ID.
 * @returns An array of flattened tokens, each with an ID and value.
 */
function flattenTokens (tokens: TokenCollection, prefix = ''): FlattenedToken[] {
  const flattened: FlattenedToken[] = []

  for (const [key, value] of Object.entries(tokens)) {
    const id = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      flattened.push({ id, value })
    } else if (value && typeof value === 'object' && '$value' in value) {
      flattened.push({ id, value: value as TokenAlias })
    } else if (value && typeof value === 'object') {
      flattened.push(...flattenTokens(value as TokenCollection, id))
    }
  }

  return flattened
}

/**
 * Resolves token aliases within a collection of tokens.
 * This function replaces aliases in the tokens with their actual values,
 * handling circular references and invalid formats gracefully.
 *
 * @see Inspired by https://www.designtokens.org/tr/drafts/format/#aliases-references
 * @param tokens The collection of tokens to resolve.
 * @returns A new collection of tokens with resolved aliases.
 * @throws Will log warnings for circular references or invalid alias formats.
 */
function resolveAliases (tokens: Record<string, TokenValue>): Record<string, string> {
  const resolved: Record<string, string> = {}
  const resolving = new Set<string>()

  function resolveValue (key: string, value: TokenValue): string {
    const isTokenAlias = (v: any): v is TokenAlias => typeof v === 'object' && v !== null && '$value' in v
    const ref = isTokenAlias(value) ? value.$value : value

    if (typeof ref !== 'string' || !ref.startsWith('{') || !ref.endsWith('}')) {
      if (isTokenAlias(value)) {
        console.warn(`Invalid alias format for "${key}": ${ref}`)
      }
      return ref
    }

    const aliasPath = ref.slice(1, -1)
    if (resolving.has(aliasPath)) {
      console.warn(`Circular reference detected for "${key}": ${aliasPath}`)
      return ref
    }

    if (!(aliasPath in tokens)) {
      console.warn(`Alias not found for "${key}": ${aliasPath}`)
      return ref
    }

    resolving.add(aliasPath)
    const result = resolveValue(aliasPath, tokens[aliasPath])
    resolving.delete(aliasPath)

    return result
  }

  for (const [key, value] of Object.entries(tokens)) {
    resolved[key] = resolveValue(key, value)
  }

  return resolved
}

/**
 *  Creates a token registrar for managing tokens within a specific namespace.
 *  This function provides a way to register, unregister, and resolve tokens,
 *  allowing for dynamic token management in applications.
 *
 * @param namespace The namespace for the token registrar context.
 * @param tokens An optional collection of tokens to initialize the registrar with.
 * @template Z The type of the tokens managed by the registrar.
 * @template E The type of the token context.
 * @returns A tuple containing the inject function, provide function, and the token context.
 */
export function createTokens<
  Z extends TokenTicket = TokenTicket,
  E extends TokenContext = TokenContext,
> (
  namespace: string,
  tokens: TokenCollection = {},
) {
  const [
    useTokenContext,
    provideTokenContext,
    registrar,
  ] = useRegistrar<Z, E>(namespace)

  const flatTokens = flattenTokens(tokens)
  const collection = new Map<string, TokenValue>()

  for (const { id, value } of flatTokens) {
    collection.set(id, value)
  }

  const resolved = computed(() => resolveAliases(Object.fromEntries(collection.entries())))

  for (const { id, value } of flatTokens) {
    const resolvedValue = resolved.value[id] || (typeof value === 'string' ? value : value.$value)

    registrar.register({ value: resolvedValue } as Partial<Z>, id)
  }

  function clean (token: string): string {
    return token.startsWith('{') && token.endsWith('}') ? token.slice(1, -1) : token
  }

  function resolve (token: string): string | undefined {
    return resolved.value[clean(token)]
  }

  return createTrinity<E>(useTokenContext, provideTokenContext, {
    ...registrar,
    resolve,
    resolved,
  } as E)
}
