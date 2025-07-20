# useTriad

A standardized way to create context patterns, abstracting the common pattern of returning `[useContext, provideContext, context]` for context-based composables.

## Examples

### Basic Triad Creation

```ts
import { toTriad } from '@vuetify/0'

// Create your context functions
const useMyContext = () => ({ value: 'hello' })
const provideMyContext = (context, app) => {
  // Provide context logic
  return context
}
const myContext = { value: 'hello' }

// Create the triad
const [useContext, provideContext, context] = toTriad(
  useMyContext,
  provideMyContext,
  myContext
)

// Use in components
const MyComponent = {
  setup() {
    // Provide context to children
    const ctx = provideContext()

    // Access context
    const context = useContext()

    return { context }
  }
}
```

### With Custom Context Logic

```ts
import { toTriad } from '@vuetify/0'

interface MyContext {
  data: string[]
  addItem: (item: string) => void
}

const useMyContext = () => inject<MyContext>('my-context')!
const provideMyContext = (context?: MyContext, app?: App) => {
  if (!context) {
    context = {
      data: [],
      addItem: (item) => context!.data.push(item)
    }
  }
  provide('my-context', context)
  return context
}

const defaultContext: MyContext = {
  data: [],
  addItem: () => {}
}

export const [useMyContext, provideMyContext, myContext] = toTriad(
  useMyContext,
  provideMyContext,
  defaultContext
)
```

## When to Use

Use `toTriad` when you want to:

- **Standardize context patterns** - Ensure consistent return structures across composables
- **Simplify context creation** - Reduce boilerplate for context-based composables
- **Enable default handling** - Automatically handle default context values
- **Build foundational composables** - Create base composables that other composables extend

## Type Safety

`toTriad` is fully typed and will infer types from your input functions:

```ts
interface MyContext {
  value: string
}

const triad = toTriad(
  (): MyContext => ({ value: 'test' }),
  (context?: MyContext) => context || { value: 'default' },
  { value: 'initial' }
)

// TypeScript knows the return type is:
// readonly [() => MyContext, (context?: MyContext, app?: App) => MyContext, MyContext]
```

## Related

- [`useSingleton`](./use-singleton.md) - For contexts that need model binding
- [`useContext`](./use-context.md) - Basic context injection/provision
- [`useRegistrar`](./use-registrar.md) - Registration-based contexts using triads
