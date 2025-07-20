# useSingleton

Extends the triad pattern with model binding support for single-value contexts, designed for managing a "singleton" - a single selected or active value that can be bound to a reactive model.

## Examples

### Theme Selection

```ts
import { toSingleton } from '@vuetify/0'
import { ref, watch } from 'vue'

interface ThemeContext {
  themes: Map<string, Theme>
  currentTheme: Ref<string>
  setTheme: (id: string) => void
}

const useThemeContext = () => inject<ThemeContext>('themes')!

const provideThemeContext = (
  model?: Ref<string>,
  context?: ThemeContext,
  app?: App
) => {
  if (!context) {
    context = {
      themes: new Map(),
      currentTheme: ref('light'),
      setTheme: (id) => context!.currentTheme.value = id
    }
  }

  // Bind model to current theme
  if (model) {
    // Sync model with context
    watch(model, (theme) => context!.setTheme(theme))
    watch(context.currentTheme, (theme) => model.value = theme)
  }

  provide('themes', context)
  return context
}

export const [useTheme, provideTheme, themeContext] = toSingleton(
  useThemeContext,
  provideThemeContext,
  {
    themes: new Map(),
    currentTheme: ref('light'),
    setTheme: () => {}
  }
)
```

### Using with Model Binding

```vue
<script setup>
import { ref } from 'vue'
import { useTheme, provideTheme } from './theme'

// Create a reactive model
const selectedTheme = ref('dark')

// Provide theme context with model binding
const themeContext = provideTheme(selectedTheme)

// Access theme context
const { themes, currentTheme, setTheme } = useTheme()

// selectedTheme and currentTheme are now synchronized
watch(selectedTheme, (theme) => {
  console.log('Model changed to:', theme)
})
</script>

<template>
  <div>
    <p>Current theme: {{ currentTheme }}</p>
    <button @click="selectedTheme = 'light'">Light</button>
    <button @click="selectedTheme = 'dark'">Dark</button>
  </div>
</template>
```

### Single Selection Management

```ts
import { toSingleton } from '@vuetify/0'

interface SingleContext<T> {
  items: Map<string, T>
  selectedId: Ref<string | undefined>
  selectedItem: ComputedRef<T | undefined>
  select: (id: string) => void
}

const provideSingleContext = <T>(
  model?: Ref<T>,
  context?: SingleContext<T>
) => {
  // Context creation logic
  if (!context) {
    const selectedId = ref<string>()
    context = {
      items: new Map<string, T>(),
      selectedId,
      selectedItem: computed(() => selectedId.value ? context!.items.get(selectedId.value) : undefined),
      select: (id) => selectedId.value = id
    }
  }

  // Model binding
  if (model) {
    // Sync selected item with model
    watch(context.selectedItem, (item) => {
      if (item) model.value = item
    })
  }

  return context
}

export const [useSingle, provideSingle, singleContext] = toSingleton(
  useSingleContext,
  provideSingleContext,
  defaultContext
)
```

## When to Use

Use `toSingleton` when you need:

- **Model binding** - Two-way binding between context state and reactive models
- **Single value management** - Managing contexts with one active/selected item
- **Theme systems** - Binding current theme to a reactive model
- **Form controls** - Single-value form inputs with context support
- **Navigation state** - Current route/tab binding with models

## Difference from createTriad

| Feature | `createTriad` | `toSingleton` |
|---------|---------------|-------------------|
| Model parameter | ❌ No | ✅ Yes |
| Use case | Simple contexts | Model-bound contexts |
| Complexity | Lower | Higher |
| Binding support | Manual | Automatic |

## Type Safety

`toSingleton` maintains full type safety with generic support:

```ts
interface Item {
  id: string
  name: string
}

const singleton = toSingleton<Item, ItemContext>(
  useItemContext,
  provideItemContext,
  defaultContext
)

// TypeScript knows:
// - Z = Item (model type)
// - E = ItemContext (context type)
// - Return type includes proper Ref<Item> support
```

## Related

- [`createTriad`](./use-triad.md) - Basic triad pattern without model binding
- [`useGroup`](./use-group.md) - Multi-selection with singleton support
- [`useSingle`](./use-single.md) - Built using toSingleton
- [`useTheme`](./use-theme.md) - Example singleton implementation
