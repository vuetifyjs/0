# useTokens

The `useTokens` composable is a powerful utility for managing design tokens within your application. It allows you to define, resolve, and utilize a hierarchical collection of design tokens, supporting aliases to prevent repetition and maintain consistency across your UI. This composable is particularly useful in large-scale applications where maintaining a consistent design system is crucial.

## Usage

To use `useTokens`, you first need to create a token provider by calling `createTokens` with a namespace and a collection of tokens. This provider can then be used to supply and consume token data throughout your component tree.

```typescript
// styles/tokens.ts
import { createTokens } from 'v0'

export const {
  useTokenContext,
  provideTokenContext,
} = createTokens('app', {
  colors: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#FFC107',
    background: '#FFFFFF',
    surface: '#F5F5F5',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
  },
})
```

## API

### `createTokens(namespace, tokens)`

- **`namespace`**: `string` - A unique namespace for the token provider.
- **`tokens`**: `TokenCollection` - An object representing the design tokens.

Returns a `useTokenContext` and `provideTokenContext` function.

### `provideTokenContext(tokens)`

- **`tokens`**: `TokenCollection` - The tokens to provide to child components.

### `useTokenContext()`

Returns the resolved token context, which includes:

- **`resolve`**: `(token: string) => string | undefined` - A function to resolve a token by its path (e.g., `colors.primary`).
- **`resolveItem`**: `(token: string) => TokenTicket | undefined` - A function to resolve a token item, including its metadata.
- **`resolved`**: `Record<string, string>` - An object containing all resolved token values.

## Example

Here's an example of how to provide and use the token context in your components:

```vue
// App.vue
<script setup lang="ts">
import { provideTokenContext } from '@/styles/tokens'

provideTokenContext({
  colors: {
    primary: '#4CAF50',
  },
})
</script>

<template>
  <div class="app">
    <slot />
  </div>
</template>
```

```vue
// MyComponent.vue
<script setup lang="ts">
import { useTokenContext } from '@/styles/tokens'

const { resolve } = useTokenContext()

const primaryColor = resolve('colors.primary')
</script>

<template>
  <div :style="{ color: primaryColor }">
    Hello, Tokens!
  </div>
</template>
```
