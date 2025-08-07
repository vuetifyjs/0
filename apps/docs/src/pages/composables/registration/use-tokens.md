---
meta:
  title: useTokens
  description: Creates a token registry for managing design token collections with alias resolution.
  keywords: useTokens, tokens, design tokens, composable, Vue
category: Registration
performance: 0
---

# useTokens

The `useTokens` composable creates a token registry for managing design token collections with alias resolution. It provides functionalities to store, retrieve, and resolve design tokens, including support for token aliases and nested token structures.

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
  - `tokens`: An optional `TokenCollection` to initialize the registry with.
  
  Returns a `TokenContext` object.

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
  - `namespace`: The namespace for the token registry context.
  - `tokens`: An optional `TokenCollection` to initialize the registry with.
  
  Returns a `TokenContext` object.

### `flatten(tokens, prefix?)`

* **Type**

  ```ts
  function flatten (tokens: TokenCollection, prefix?: string): FlatTokenCollection[]
  ```

* **Details**

  A utility function that flattens a nested `TokenCollection` into a flat array of `FlatTokenCollection` objects. Each flattened token includes its full ID (path) and its value.
  - `tokens`: The `TokenCollection` to flatten.
  - `prefix`: An optional string prefix to prepend to each token ID during flattening.


## Typescript

### `TokenAlias`

```ts
export interface TokenAlias {
  [key: string]: any
  $value: string
  $type?: string
  $description?: string
}
```

Represents a token alias, which is an object containing a `$value` property that references another token. It can also include optional `$type` and `$description` properties.

### `TokenValue`

```ts
export type TokenValue = string | number | boolean | TokenAlias
```

Defines the possible types for a token's value: a primitive (string, number, boolean) or a `TokenAlias` object.

### `TokenCollection`

```ts
export interface TokenCollection {
  [key: string]: TokenValue | TokenCollection
}
```

Represents a collection of tokens, which can be a flat object or a deeply nested object structure where keys are token names and values are `TokenValue`s or other `TokenCollection`s.

### `FlatTokenCollection`

```ts
export type FlatTokenCollection = {
  id: string
  value: TokenValue
}
```

Represents a flattened token, containing its full `id` (path) and its `value`.

### `TokenTicket`

```ts
export interface TokenTicket extends RegistryTicket {}
```

Extends `RegistryTicket` and is used internally by the token registry.

### `TokenContext`

```ts
export interface TokenContext<Z extends TokenTicket> extends RegistryContext<Z> {
  resolve: (token: string) => string | undefined
}
```

Extends `RegistryContext` with a `resolve` method:
- `resolve(token: string)`: Resolves a token string (which might be an alias like `{primary}`) to its final string value. Returns `undefined` if the token or its alias cannot be resolved.

## Examples

### Using `useTokens` to Resolve Design Tokens

```html
<template>
  <div>
    <p :style="{ color: tokens.resolve("colors.primary") }">Primary Color Text</p>
    <p :style="{ backgroundColor: tokens.resolve("colors.background") }">Background Color Div</p>
    <p>Resolved Alias: {{ tokens.resolve("alias.mainColor") }}</p>
  </div>
</template>

<script setup lang="ts">
  import { useTokens } from "@vuetify/v0/composables/useTokens";

  const designTokens = {
    colors: {
      primary: "#1976D2",
      secondary: "#424242",
      background: "#F5F5F5",
    },
    spacing: {
      small: "8px",
      medium: "16px",
    },
    alias: {
      mainColor: { $value: "{colors.primary}" },
    },
  };

  const tokens = useTokens(designTokens);
</script>
```

### Using `createTokensContext` with Vue's Provide/Inject

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import { createTokensContext } from "@vuetify/v0/composables/useTokens";

const app = createApp(App);

const designTokens = {
  colors: {
    brand: "#FF5722",
    text: "#333333",
  },
};

const [, provideTokens, tokensContext] = createTokensContext("my-app-tokens", designTokens);

app.use({
  install(app) {
    provideTokens(tokensContext, app);
  },
});

app.mount("#app");
```

```html
<!-- MyComponent.vue -->
<template>
  <div :style="{ color: tokens.resolve("colors.text") }">
    This text uses a token from the provided context.
    <p>Brand Color: {{ tokens.resolve("colors.brand") }}</p>
  </div>
</template>

<script setup lang="ts">
  import { inject } from "vue";
  import { TokenContext } from "@vuetify/v0/composables/useTokens";

  const tokens = inject<TokenContext<any>>("my-app-tokens");

  if (!tokens) {
    console.error("Token context not provided!");
  }
</script>
```
