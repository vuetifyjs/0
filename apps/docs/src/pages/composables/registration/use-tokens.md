# useTokens

A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system. Inspired by [Design Tokens](https://www.designtokens.org/tr/drafts/format/#design-token).

## Usage

The `useTokens` composable allows you to define a collection of design tokens, which can be primitive values or aliases that reference other tokens. It provides a context for resolving these tokens, making it easy to access design values throughout your application.

```ts
import { useTokens } from '@vuetify/v0'

const tokens = useTokens({
  color: {
    primary: '#3b82f6',
    secondary: '#64748b',
    brand: { $value: 'color.primary', $type: 'color' }, // alias to another token
  },
  radius: {
    sm: '4px',
    md: '8px',
  },
})

tokens.resolve('color.primary') // '#3b82f6'
tokens.resolve('color.brand')   // '#3b82f6' (alias resolved)
tokens.resolve('radius.md')     // '8px'
```

## Arbitrary values (objects)

Tokens can hold any $value type, including objects. This is useful when a token represents a composite concept—icons, shadows, typography scales, elevation specs, motion curves, etc.

```ts
const t = useTokens({
  icon: {
    close: { $value: { name: 'close', set: 'mdi', filled: false }, $type: 'icon' },
  },
})

t.resolve('icon.close')
// -> { name: 'close', set: 'mdi', filled: false }
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

  type FlatTokenCollection = {
    id: string
    value: TokenValue
  }

  interface TokenTicket extends RegistryTicket {}

  interface TokenContext<Z extends TokenTicket> extends RegistryContext<Z> {
    resolve: (token: string | TokenAlias) => unknown | undefined
  }

  function useTokens<
    Z extends TokenTicket = TokenTicket,
    E extends TokenContext<Z> = TokenContext<Z>,
  > (tokens: TokenCollection): TokenContext<Z>
  ```

* **Details**
  The `useTokens` function creates a TokenCollection and maps it to a [Registry](/composables/registration/use-registry). It exposes a resolve function that allows you to retrieve the value of a token by its name or alias. The function supports nested collections and aliases, allowing for a flexible design token system.

* **Description**
  * Creates a token registry context initialized with an optional nested collection of tokens.
  * Flattens nested token collections into a flat list of token entries for registration.
  * Supports tokens defined as primitive values or as aliases referencing other tokens.
  * Provides a resolve method to recursively resolve tokens and aliases into their final string value.
  * Utilizes caching for efficient resolution of repeated token lookups.
  * Integrates with a generic registry system (useRegistry) for management of tokens by ID.

* **Parameters**
  * tokens (optional): A nested collection of tokens to initialize the registry.

* **Returns**
  * A token context object containing:
    * Registry management methods (register, get, keys, values, etc.).
    * The resolve method to resolve token values or aliases.

* **Example**
  ```ts
  const tokenContext = useTokens({
    color: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#6366f1',
    },
  })

  const primary = tokenContext.resolve('color.primary'); // '#007bff'
  const secondary = tokenContext.resolve('color.secondary'); // '#007bff'
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
  const baseFontSize = tokens.resolve('fontSize.base')
  ```

### `flatten`

* **Type**
  ```ts
  function flatten (
    tokens: TokenCollection,
    prefix = ''
  ): FlatTokenCollection[]

  /** Items in the returned array */
  type FlatTokenValue = string | number | boolean | TokenAlias | TokenCollection

  interface FlatTokenCollection {
    /** Fully-qualified token id, e.g. "color.primary" */
    id: string
    /**
    * The leaf value:
    * - primitive (string | number | boolean), or
    * - TokenAlias (object with $value …), or
    * - a small object containing only $-meta keys when the node has group-level metadata
    */
    value: FlatTokenValue
  }
  ```
* **Details**
  * Uses an explicit stack for depth-first traversal (iterative; avoids recursion limits).
  * Order: depth-first (LIFO) per object-key enumeration order (stable for string keys in modern JS).
  * Resolution: this function is structural—it does not resolve aliases. Use your TokenContext.resolve(id) when you need the final value.

* **Description**
  Flattens a nested TokenCollection into a linear array of { id, value }.
  It preserves:
    * Primitive leaves (e.g., '4px', #3b82f6)
    * Alias objects (objects that include a $value key)
    * Group metadata (objects whose keys start with $, such as $type, $description, etc.) This variant is designed for iteration-friendly consumers (docs renderers, validators, preview UIs) that prefer an array over a map.

* **Parameters**
  * tokens: TokenCollection — The nested token tree to flatten.
  * prefix = '' — Optional path prefix to prepend to each generated id.
    * When provided (non-empty), root-level meta will be emitted as an item for that prefix.

* **Returns**
  * FlatTokenCollection[] — An array where each item represents one flattened entry:
    * id: dot-path (or prefixed) identifier (e.g., "color.primary", "theme/spacing/sm" if you use a custom prefix/format externally).
    * value: the corresponding leaf primitive, an alias object, or a $-meta object for group metadata.

* **Example**
1) Basic primitives and aliases
  ```ts
  const tree = {
    color: {
      brand:   { $value: '#3b82f6', $type: 'color' },
      primary: { $value: 'color.brand' }, // alias
    },
    spacing: { sm: '4px', md: '8px' },
  }

  flatten(tree)
  /*
  [
    { id: 'color.brand',   value: { $value: '#3b82f6', $type: 'color' } },
    { id: 'color.primary', value: { $value: 'color.brand' } },
    { id: 'spacing.sm',    value: '4px' },
    { id: 'spacing.md',    value: '8px' }
  ]
  */
  ```

2) Group metadata ($type, $description, …)
  ```ts
  const tokens = {
    color: {
      $type: 'color-group',
      primary: '#3b82f6',
    }
  }

  // No root prefix → group meta for "color" will be emitted
  // ONLY when currentPrefix is truthy during traversal.
  // In this tree, "color" becomes currentPrefix → meta is emitted:
  flatten(tokens)
  /*
  [
    { id: 'color',        value: { $type: 'color-group' } },
    { id: 'color.primary', value: '#3b82f6' }
  ]
  */
  ```

3) Meta at the root (emitted only if you pass a prefix)
  ```ts
  const tokens = {
    $type: 'theme',
    spacing: { sm: '4px' }
  }

  flatten(tokens, 'theme')
  /*
  [
    { id: 'theme',          value: { $type: 'theme' } },
    { id: 'theme.spacing.sm', value: '4px' }
  ]
  */
  ```

4) Alias whose $value is an object (expand inner children)
  ```ts
  const tokens = {
    icon: {
      // alias object; its $value is an OBJECT with nested fields
      close: {
        $value: {
          path: 'M0 0 L10 10',            // primitive inner child
          meta: { $value: 'icon.meta' },  // alias inner child
          set:  {                         // nested collection inner child
            svg: { $value: '<svg …>' }
          }
        }
      },
      meta: { $value: 'icons.common' }
    }
  }

  flatten(tokens)
  /*
  [
    { id: 'icon.close',           value: { $value: { path: 'M0 0 L10 10', meta: { $value: 'icon.meta' }, set: { svg: { $value: '<svg …>' } } } } },

    // inner children expanded:
    { id: 'icon.close.path',      value: 'M0 0 L10 10' },               
    // primitive inner
    { id: 'icon.close.meta',      value: { $value: 'icon.meta' } },     
    // alias inner
    { id: 'icon.close.set',       value: { svg: { $value: '<svg …>' } } }, 
    // queued as nested collection
    { id: 'icon.close.set.svg',   value: { $value: '<svg …>' } },       
    // from nested collection
    { id: 'icon.meta',            value: { $value: 'icons.common' } }
  ]
  */
  ```