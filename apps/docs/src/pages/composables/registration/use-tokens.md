# useTokens

A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system. Inspired by [Design Tokens](https://www.designtokens.org/tr/drafts/format/#design-token).

<DocsPageFeatures />

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
  function createTokensContext<
    Z extends TokenTicket = TokenTicket,
    E extends TokenContext<Z> = TokenContext<Z>
  > (tokens: TokenCollection): E
  ```
* **Details**
  The `createTokensContext` function is a factory that creates a context for managing tokens. It takes a TokenCollection and returns a context object that includes the resolve function. This function is useful for creating a context that can be provided to components or composables that need access to the token system.

* **Description**
  * Factory function to create a fully injectable/providable token context for Vue applications.
  * Accepts a namespace string to isolate the context.
  * Initializes the token registry with optional tokens.
  * Returns a tuple containing:
    * The injection function (useTokensContext) to consume the context.
    * The provision function (provideTokensContext) to provide the context in a Vue app or component.
    * The underlying token context object.

* **Parameters**
  * namespace: A unique string key for providing/injecting the token context.
  * tokens (optional): Initial token collection to register.

* **Returns**
  * A tuple [useTokensContext, provideTokensContext, context] for managing token context lifecycle.

* **Example**
  ```ts
  const [useTokensContext, provideTokensContext, context] = createTokensContext('my-app:tokens', tokens)

  // In root component or plugin setup
  provideTokensContext(context, app)

  // In any descendant component
  const tokens = useTokensContext()

  console.log(tokens.resolve('fontSize.base')) // '16px'
  ```
