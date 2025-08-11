# useTokens

A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system.

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
  The `useTokens` function creates takes a TokenCollection and maps it to a [Registry](/composables/registration/use-registry). It exposes a resolve function that allows you to retrieve the value of a token by its name or alias. The function supports nested collections and aliases, allowing for a flexible design token system.

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