// Composables
import { useRegistrar } from '../useRegistrar'

// Types
import type { App } from 'vue'
import type { RegistrarTicket, RegistrarContext } from '../useRegistrar'

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
  resolveItem: (token: string) => TokenTicket | undefined
}

interface FlattenedToken {
  path: string
  value: TokenValue
}

function flattenTokens (tokens: TokenCollection, prefix = ''): FlattenedToken[] {
  const flattened: FlattenedToken[] = []

  for (const [key, value] of Object.entries(tokens)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      flattened.push({ path, value })
    } else if (value && typeof value === 'object' && '$value' in value) {
      flattened.push({ path, value: value as TokenAlias })
    } else if (value && typeof value === 'object') {
      flattened.push(...flattenTokens(value as TokenCollection, path))
    }
  }

  return flattened
}

function resolveAliases (tokens: Record<string, TokenValue>): Record<string, string> {
  const resolved: Record<string, string> = {}
  const resolving = new Set<string>()

  function resolveValue (key: string, value: TokenValue): string {
    if (typeof value === 'string') return value

    const ref = value.$value
    if (!ref.startsWith('{') || !ref.endsWith('}')) {
      console.warn(`Invalid alias format for "${key}": ${ref}`)
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

export function createTokens<T extends TokenContext> (namespace: string, tokens: TokenCollection = {}) {
  const [
    useTokenContext,
    provideTokenContext,
    registrar,
  ] = useRegistrar<TokenTicket, T>(namespace)

  const flatTokens = flattenTokens(tokens)
  const tokenMap = new Map<string, TokenValue>()

  for (const { path, value } of flatTokens) {
    tokenMap.set(path, value)
  }

  const resolvedTokens = resolveAliases(
    Object.fromEntries(tokenMap.entries()),
  )

  for (const { path, value } of flatTokens) {
    const resolvedValue = resolvedTokens[path] || (typeof value === 'string' ? value : value.$value)

    registrar.register({
      value: resolvedValue,
    } as Partial<TokenTicket>, path)
  }

  function resolve (token: string): string | undefined {
    const cleanToken = token.startsWith('{') && token.endsWith('}')
      ? token.slice(1, -1)
      : token

    return resolvedTokens[cleanToken]
  }

  function resolveItem (token: string): TokenTicket | undefined {
    const cleanToken = token.startsWith('{') && token.endsWith('}')
      ? token.slice(1, -1)
      : token

    return registrar.registeredItems.get(cleanToken)
  }

  const context = {
    ...registrar,
    resolve,
    resolveItem,
  } as T

  return [
    useTokenContext,
    function (
      _context: T = context,
      app?: App,
    ) {
      provideTokenContext(_context, app)

      return _context
    },
    context,
  ] as const
}
