# useTokens

A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system.

# Overview
Design tokens represent atomic pieces of design information such as colors, spacing, typography, and more. This utility helps you register, manage, and resolve these tokens efficiently. It leverages a generic registry system and provides alias support, allowing tokens to reference other tokens through a simple syntax.

## API

### `useTokens`

* **Type**
  ```ts
  interface TokenAlias {
    [key: string]: any
    $value: string
    $type?: string
    $description?: string
  }

  type TokenValue = string | number | boolean | TokenAlias

  interface TokenCollection {
    [key: string]: TokenValue | TokenCollection
  }

  export interface TokenTicket extends RegistryTicket {}

  interface TokenContext<Z extends TokenTicket> extends RegistryContext<Z> {
    resolve: (token: string) => string | undefined
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
* **Usage Example**
  ```ts
  const tokens = {
    color: {
      primary: '#007bff',
      secondary: { $value: '{color.primary}', $type: 'color' },
    },
    fontSize: {
      base: '16px',
      large: { $value: '{fontSize.base}' },
    },
  };

  const tokenContext = useTokens(tokens);

  const primaryColor = tokenContext.resolve('color.primary'); // '#007bff'
  const secondaryColor = tokenContext.resolve('color.secondary'); // '#007bff'
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
* **Usage Example**
  ```ts
  const [useTokensContext, provideTokensContext, tokensContext] = createTokensContext('my-app:tokens', tokens);

  // In root component or plugin setup
  provideTokensContext(tokensContext, app);

  // In any descendant component
  const tokens = useTokensContext();
  const baseFontSize = tokens.resolve('fontSize.base');
  ```

## Internal Details

### `Token Flattening`
The utility internally flattens nested token objects into a flat array of { id, value } pairs where:
* id is a dot-separated string path representing the token key path (e.g., "color.primary").
* value is the token value which can be a primitive or an alias object.
This flattening allows the registry to manage tokens uniformly regardless of nesting.
### `Alias Resolution`
* Tokens can be aliases referencing other tokens using the syntax {tokenName}.
* Aliases can be nested, and the resolve function recursively resolves these references.
* If an alias cannot be resolved, a warning is logged.
* Resolved values are cached for performance.
### `Registry Integration`
* Uses a generic registry composable (useRegistry) to manage tokens.
* Tokens are registered with unique IDs and values.
* The registry provides lookup, iteration, and event capabilities.
### `Related Utilities`
* useRegistry: Core registry composable for managing collections of items.
* useLogger: Logging composable used internally for warnings and debug.
* createContext / createTrinity: Utilities for Vue provide/inject context management.
### `Summary`
useTokens and createTokensContext provide a robust, flexible, and scalable foundation for managing design tokens in Vue applications or other JavaScript projects. They enable token aliasing, hierarchical token structures, and efficient resolution, making design system management easier and more maintainable.

