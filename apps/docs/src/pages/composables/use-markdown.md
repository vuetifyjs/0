# useMarkdown

A composable for rendering Markdown content in Vue applications with a plugin-based architecture and customizable rendering behavior.
# Hello, Markdown!

This is a paragraph with some **bold** and *italic* text.

- List item 1
- List item 2
`

const htmlContent = render(markdownContent)
</script>

<template>
  <div v-html="htmlContent" />
</template>
```

## API Reference

### `createMarkdownPlugin(options?)`

Creates a Markdown plugin instance to be used with `app.use()`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `MarkdownOptions` | Configuration options for the Markdown renderer |

### `useMarkdown()`

Returns the `render` function from the provided Markdown context.

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `render` | `(content: string) => string` | Function to render Markdown content to HTML |

### MarkdownOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `adapter` | `MarkdownAdapter` | `new MarkedAdapter()` | The Markdown adapter to use for rendering |

## Custom Adapter

You can create a custom adapter to use a different Markdown library or customize the rendering process. The adapter must implement the `MarkdownAdapter` interface:

```typescript
// src/utils/customMarkdownAdapter.ts
import type { MarkdownAdapter } from 'v0'
import { someMarkdownLibrary } from 'some-markdown-library'

export class CustomMarkdownAdapter implements MarkdownAdapter {
  render (content: string): string {
    // Custom rendering logic
    return someMarkdownLibrary.render(content, {
      // Custom options
    })
  }
}
```

Then, you can pass your custom adapter to the `createMarkdownPlugin`:

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createMarkdownPlugin } from 'v0'
import { CustomMarkdownAdapter } from './utils/customMarkdownAdapter'
import App from './App.vue'

const app = createApp(App)

app.use(createMarkdownPlugin({
  adapter: new CustomMarkdownAdapter(),
}))

app.mount('#app')
```

## TypeScript Support

The composable is fully typed:

```typescript
export interface MarkdownAdapter {
  render: (content: string) => string
}

export interface MarkdownContext {
  render: MarkdownAdapter['render']
}

export interface MarkdownOptions {
  adapter?: MarkdownAdapter
}

export interface MarkdownPlugin {
  install: (app: App) => void
}
```
