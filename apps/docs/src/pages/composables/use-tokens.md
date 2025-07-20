# useTokens

A utility for managing design tokens with support for hierarchical collections, aliases, and token resolution across your application's design system.
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
