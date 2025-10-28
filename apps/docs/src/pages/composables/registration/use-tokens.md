---
meta:
  title: useTokens
  description: A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system.
  keywords: useTokens, design tokens, tokens, aliases, composable, Vue
features:
  category: Composable
  label: 'E: useTokens'
  github: /composables/useTokens/
---

# useTokens

A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system. Inspired by [Design Tokens](https://www.designtokens.org/tr/drafts/format/#design-token).

<DocsPageFeatures :frontmatter />

## Usage

The `useTokens` composable allows you to define a collection of design tokens, which can be primitive values or aliases that reference other tokens. It provides a context for resolving these tokens, making it easy to access design values throughout your application.

```ts
import { useTokens } from '@vuetify/v0'

// Default behavior (depth = Infinity): fully flatten nested objects
const tokens = useTokens({
  color: {
    primary: '#3b82f6',
    secondary: '#64748b',
    info: '{primary}'
  },
  radius: {
    sm: '4px',
    md: '8px',
  },
})

tokens.resolve('color.primary') // '#3b82f6'
tokens.resolve('color.info') // '#3b82f6' (alias resolved)
tokens.resolve('radius.md') // '8px'

const features = useTokens({
  dark: true,
  rtl: { value: true, variation: 'toggle' },
}, { flat: true })

// With flat: true, nested objects are kept as-is at their base id
features.resolve('rtl') // { value: true, variation: 'toggle' }
```

## API


| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | Base registry system |
| [useProxyRegistry](/composables/registration/use-proxy-registry) | Reactive registry wrapper |
| [useTheme](/composables/plugins/use-theme) | Theme system using tokens |
| [useFeatures](/composables/plugins/use-features) | Feature flags using tokens |
### `useTokens`

* **Type**
  ```ts
  interface TokenAlias<T = unknown> {
    [key: string]: unknown
    $value: T
    $type?: string
    $description?: string
    $extensions?: Record<string, unknown>
    $deprecated?: boolean | string
  }

  type TokenPrimitive = string | number | boolean

  type TokenValue = TokenPrimitive | TokenAlias

  interface TokenCollection {
    [key: string]: TokenValue | TokenCollection
  }

  interface TokenTicket extends RegistryTicket {}

  interface TokenContext<Z extends TokenTicket> extends RegistryContext<Z> {
    isAlias: (token: unknown) => token is string
    resolve: (token: string | TokenAlias) => unknown | undefined
  }

  interface TokenOptions {
    flat?: boolean
    prefix?: string
  }

  function useTokens<
    Z extends TokenTicket = TokenTicket,
    E extends TokenContext<Z> = TokenContext<Z>,
  > (
    tokens: TokenCollection,
    options?: TokenOptions,
  ): TokenContext<Z>
  ```

* **Details**
  The `useTokens` function creates a TokenCollection and maps it to a [Registry](/composables/registration/use-registry). It exposes a resolve function that allows you to retrieve the value of a token by its name or alias. The function supports nested collections and aliases, allowing for a flexible design token system.

* **Description**
  * Creates a token registry context initialized with an optional nested collection of tokens.
  * Flattens nested token collections into a flat list of token entries for registration.
  * The `flat` option keeps nested objects intact at their base id.
  * Supports tokens defined as primitive values or as aliases referencing other tokens.
  * Provides a resolve method to recursively resolve tokens and aliases into their final string value.
  * Exposes an isAlias method to detect whether a string is an alias (e.g. "{color.primary}").
  * Utilizes caching for efficient resolution of repeated token lookups.
  * Integrates with a generic registry system (useRegistry) for management of tokens by ID.

* **Parameters**
  * tokens (optional): A nested collection of tokens to initialize the registry.
  * options (optional):
  * flat?: boolean — keep nested objects intact at their base id
    * prefix?: string — a prefix to preprend to all generated ids

* **Returns**
  * A token context object containing:
    * Registry management methods (register, get, keys, values, etc.).
    * The resolve method to resolve token values or aliases.

* **Example**
  ```ts
  const tokens = useTokens({
    color: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#6366f1',
    },
  })

  const primary = tokens.resolve('color.primary'); // '#007bff'
  const secondary = tokens.resolve('color.secondary'); // '#007bff'
  ```

* **Example**
  ```ts
  const tokens = useTokens({
    color: {
      primary: '#3b82f6',
      secondary: '#64748b',
    },
    fontSize: {
      base: '16px',
    },
  })

  console.log(tokens.resolve('color.primary')) // '#3b82f6'
  console.log(tokens.resolve('fontSize.base')) // '16px'
  ```

### `createTokensContext`

* **Type**
  ```ts
  interface TokenContextOptions extends TokenOptions, RegistryContextOptions {
    namespace: string
    tokens?: TokenCollection
  }

  function createTokensContext<
    Z extends TokenTicket = TokenTicket,
    E extends TokenContext<Z> = TokenContext<Z>
  > (options: TokenContextOptions): ContextTrinity<E>
  ```
* **Details**
  The `createTokensContext` function is a factory that creates a context for managing tokens using the trinity pattern. It takes an options object and returns a readonly tuple of `[useTokensContext, provideTokensContext, context]` for dependency injection.

* **Description**
  * Factory function to create a fully injectable/providable token context for Vue applications.
  * Accepts a namespace string to isolate the context.
  * Initializes the token registry with optional tokens.
  * Returns a readonly tuple (trinity pattern) containing:
    * The injection function (useTokensContext) to consume the context.
    * The provision function (provideTokensContext) to provide the context in a Vue app or component.
    * The underlying token context object (default instance).

* **Parameters**
  * options: Configuration object containing:
    * namespace: A unique string key for providing/injecting the token context.
    * tokens (optional): Initial token collection to register.
    * flat (optional): Keep nested objects intact at their base id.
    * prefix (optional): Prefix to prepend to all generated ids.

* **Returns**
  * A readonly tuple `[useTokensContext, provideTokensContext, context]` for managing token context lifecycle.

* **Example**
  ```ts
  const [useTokensContext, provideTokensContext, context] = createTokensContext({
    namespace: 'my-app:tokens',
    tokens: {
      fontSize: {
        base: '16px',
        lg: '18px'
      }
    }
  })

  // In root component or plugin setup
  provideTokensContext(context, app)

  // In any descendant component
  const tokens = useTokensContext()

  console.log(tokens.resolve('fontSize.base')) // '16px'
  ```
