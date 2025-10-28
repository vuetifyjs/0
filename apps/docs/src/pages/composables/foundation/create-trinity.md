---
meta:
  title: createTrinity
  description: A factory function for creating a 3 item tuple that contains a context consumer, a provider, and the actual context object, allowing for easy state management and sharing across components.
  keywords: createTrinity, context, composable, Vue, state management
features:
  category: Factory
  label: 'E: createTrinity'
  github: /factories/createTrinity/
---

# createTrinity

The **createTrinity** factory function is a type-safe utility for generating a 3-item tuple—called a **trinity**—which contains a context consumer, a provider, and the underlying context object.

<DocsPageFeatures :frontmatter />

## Usage

The trinity pattern is the marrying of provide and inject with a context object. It provides a clean and type safe way to create a sharable singleton state.

```ts
import { createContext, createTrinity } from '@vuetify/v0'
import { ref } from 'vue'

interface User {
  id: string
  name: string
}

interface UserContext {
  user: Ref<User>
  updateUser: (user: User) => void
}

function createUserContext() {
  const [useContext, provideContext] = createContext<UserContext>('user')

  const user = ref<User>({ id: '123', name: 'John Doe' })

  function updateUser(newUser: User) {
    user.value = newUser
  }

  const context: UserContext = {
    user,
    updateUser
  }

  return createTrinity<UserContext>(useContext, provideContext, context)
}

export const [useUser, provideUser, defaultUserContext] = createUserContext()
```

## API


| Composable | Description |
|---|---|
| [createContext](/composables/foundation/create-context) | Creates context consumer/provider functions |
| [createPlugin](/composables/foundation/create-plugin) | Creates Vue plugin with context |
### `createTrinity`

- **Type**
  ```ts
  type ContextTrinity<Z = unknown> = readonly [
    () => Z,
    (context: Z, app?: App) => Z,
    Z,
  ]

  function createTrinity<Z>(
    useContext: () => Z,
    provideContext: (context: Z, app?: App) => Z,
    context: Z
  ): ContextTrinity<Z>
  ```

- **Details**

  Creates a readonly 3-item tuple (trinity) containing:
  1. A context consumer function (useContext)
  2. A context provider function (provideContext)
  3. The default context instance

  This pattern provides a clean and type-safe way to create sharable singleton state across components.

- **Parameters**

  - `useContext`: Function to access/consume the context
  - `provideContext`: Function to provide the context to the application or component tree
  - `context`: The actual context object instance

- **Returns**

  A readonly tuple `[useContext, provideContext, context]`

- **Example**
  ```ts
  const [useAuth, provideAuth] = createContext<AuthContext>('auth')

  const context: AuthContext = {
    user: ref(null),
    login: async (credentials) => { /* ... */ },
    logout: () => { /* ... */ }
  }

  const [use, provide, defaultContext] = createTrinity<AuthContext>(
    useAuth,
    provideAuth,
    context
  )

  // Export for use in components
  export { use as useAuth, provide as provideAuth, defaultContext }
  ```

## The Trinity Elements

The trinity tuple contains three elements that work together:

### 1. **useContext** - Consumer Function
The first element is a function that injects the context using Vue's `inject()`. It throws an error if the context hasn't been provided.

```ts
// In a child component
const auth = useAuth()
auth.user.value // Access provided context
```

### 2. **provideContext** - Provider Function
The second element provides the context to descendants using Vue's `provide()`. Can be called at app-level or component-level.

```ts
// In parent component or plugin
provideAuth(context, app)
```

### 3. **context** - Default Instance
The third element is the actual context object - useful for standalone usage, testing, or direct access without provide/inject.

```ts
// Direct usage without provide/inject
defaultContext.login(credentials)
```

## Composables Using Trinity Pattern

The following composables in v0 export context creation functions that return trinities:

### Registration System
- `createRegistryContext` - Base registry with collection management
- `createTokensContext` - Design tokens with alias resolution
- `createTimelineContext` - Undo/redo with bounded history
- `createQueueContext` - FIFO queue with timeouts

### Selection System
- `createSelectionContext` - Base selection tracking
- `createSingleContext` - Single-item selection
- `createGroupContext` - Multi-item selection with batch operations
- `createStepContext` - Navigation with first/last/next/prev

### Feature Systems
- `createFeaturesContext` - Feature flags with variations
- `createThemeContext` - Theme management with CSS variables
- `createFormContext` - Form validation and state

### Example Usage

```ts
import { createSelectionContext } from '@vuetify/v0'

// Create a custom selection context
const [useMySelection, provideMySelection, selection] = createSelectionContext({
  namespace: 'my-app:selection',
  mandatory: true
})

// In root component
provideMySelection()

// In any descendant component
const selection = useMySelection()
selection.select('item-1')
```

## Reactivity & Lifecycle

### Shared Reactive State

The trinity pattern provides **shared reactive state** - all consumers access the same reactive objects:

```ts
const [useTheme, provideTheme, theme] = createThemeContext({
  namespace: 'app:theme',
  default: 'light',
  themes: { light: {...}, dark: {...} }
})

// In main.ts
provideTheme() // Provides 'theme' instance

// In component A
const themeA = useTheme()
themeA.select('dark')

// In component B
const themeB = useTheme()
console.log(themeB.selectedId) // 'dark' (updated everywhere!)
```

### Component Lifecycle

Provided contexts are scoped to the providing component's lifetime:

- When the provider component unmounts, descendants lose access
- Calling `useContext()` after provider unmounts throws an error
- The default context (third element) persists independently

### When to Use Each Element

| Element | Use Case |
|---------|----------|
| **useContext** | In child components that need injected state |
| **provideContext** | In parent components or plugins to share state |
| **context (default)** | For standalone usage, testing, or direct access |

## Type Safety

The trinity pattern is fully type-safe:

```ts
const [useTypedContext, provide, context] = createTrinity<MyContext>(
  useContext,
  provideContext,
  myContext
)

// TypeScript knows the exact return type
const ctx = useTypedContext() // Type: MyContext
ctx.someMethod() // Fully typed!
```

## Understanding the Export Patterns

v0 composables use different export patterns depending on their complexity. Understanding when to use each is key to effective usage.

### Pattern 1: Standalone + Context (Most Common)

Most composables export three functions:

```ts
// 1. createX - Creates standalone instance
export function createSelection(options?) { ... }

// 2. createXContext - Creates trinity for DI
export function createSelectionContext(options) { ... }

// 3. useX - Uses provided context (requires provider)
export function useSelection(namespace = 'v0:selection') { ... }
```

**When to use each:**

| Function | Usage | Provider Required? | Namespace |
|----------|-------|-------------------|-----------|
| `createSelection()` | Local, component-scoped state | No | N/A |
| `createSelectionContext()` | Shared state with custom namespace | Must call provide | Custom |
| `useSelection()` | Access globally provided context | Yes | Default or custom |

**Example:**

```ts
// Pattern A: Standalone (local state)
const selection = createSelection({ mandatory: true })
selection.register({ id: 'item-1' })

// Pattern B: Context with custom namespace
const [useMySelection, provideMySelection, selection] = createSelectionContext({
  namespace: 'my-app:selection',
  mandatory: true
})
provideMySelection() // Provide to descendants
const sel = useMySelection() // Use in child components

// Pattern C: Use global context (must be provided via plugin)
const selection = useSelection() // Uses 'v0:selection' namespace
```

### Pattern 2: Registry-Style (useRegistry)

Some composables like `useRegistry` use a simplified pattern:

```ts
// 1. useX - Creates standalone instance
export function useRegistry(options?) { ... }

// 2. createXContext - Creates trinity for DI
export function createRegistryContext(options) { ... }
```

**No separate `createRegistry` function** - `useRegistry()` serves as both the standalone and creation function.

### Pattern 3: Plugin-Based (useTheme, useFeatures)

Plugin composables add a fourth export:

```ts
// 1. createX - Standalone instance
export function createTheme(options?) { ... }

// 2. createXContext - Trinity for custom DI
export function createThemeContext(options) { ... }

// 3. createXPlugin - Vue plugin installer
export function createThemePlugin(options?) { ... }

// 4. useX - Access provided plugin context
export function useTheme() { ... }
```

**Plugin pattern workflow:**

```ts
// Step 1: Install plugin in main.ts
import { createThemePlugin } from '@vuetify/v0'

app.use(createThemePlugin({
  default: 'light',
  themes: { light: {...}, dark: {...} }
}))

// Step 2: Use anywhere in app
import { useTheme } from '@vuetify/v0'

const theme = useTheme() // Access plugin-provided context
theme.select('dark')
```

## Decision Guide

Use this guide to choose the right pattern:

### Use Standalone Functions (`createX()`)

When you need:
- Local component state
- No sharing between components
- Testing/utilities
- Temporary instances

```ts
const selection = createSelection()
```

### Use Context Functions (`createXContext()`)

When you need:
- Shared state across component tree
- Custom namespace isolation
- Multiple independent instances
- Fine-grained control over provision

```ts
const [use, provide, context] = createSelectionContext({
  namespace: 'custom:selection'
})
```

### Use Plugin Functions (`createXPlugin()`)

When you need:
- Global app-wide configuration
- Single source of truth
- Automatic provision
- Simplified setup

```ts
app.use(createThemePlugin({ ... }))
```

### Use Consumer Functions (`useX()`)

When you need:
- Access to provided context
- No local state needed
- Consume plugin or parent context

```ts
const theme = useTheme()
```

## Common Mistakes

### Using consumer without provider

```ts
// Error: Context not provided!
const selection = useSelection()
```

**Fix:** Provide first or use standalone:
```ts
// Option 1: Provide then use
const [_, provide] = createSelectionContext({ namespace: 'v0:selection' })
provide()
const selection = useSelection()

// Option 2: Use standalone
const selection = createSelection()
```

### Mixing namespaces

```ts
const [useCustom, provide] = createSelectionContext({ namespace: 'custom' })
provide()
const selection = useSelection() // Wrong: Uses 'v0:selection', not 'custom'
```

**Fix:** Use the returned consumer:
```ts
const [useCustom, provide] = createSelectionContext({ namespace: 'custom' })
provide()
const selection = useCustom() // Correct: Uses 'custom' namespace
```

### Not calling provide

```ts
const [use, provide, context] = createSelectionContext({ namespace: 'app' })
const selection = use() // Error: context not provided
```

**Fix:** Call provide first:
```ts
const [use, provide, context] = createSelectionContext({ namespace: 'app' })
provide() // Provide before consuming
const selection = use()
```
