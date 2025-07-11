# useStep

The `useStep` composable manages navigation through a multi-step process, such as forms, wizards, or onboarding flows. It provides methods to navigate between steps, track the current step, and handle step completion while supporting features like disabled steps and circular navigation.

## Usage

```ts
import { useStep } from '@vuetify/0'

const [useStepContext, provideStepContext, stepContext] = useStep('wizard')
```

## API Reference

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `namespace` | `string` | Unique identifier for the step context |
| `options` | `StepOptions` | Configuration options |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mandatory` | `boolean` | `true` | Whether a step must always be selected |

### Returns

| Return | Type | Description |
|--------|------|-------------|
| `[0]` | `() => StepContext` | Function to consume the step context |
| `[1]` | `(model?, context?) => StepContext` | Function to provide the step context |
| `[2]` | `StepContext` | The step context object |

### Step Context Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentItem` | `Ref<StepItem>` | Currently active step item |
| `selectedIds` | `Set<string>` | Set of selected step IDs |
| `registeredItems` | `Map<string, StepItem>` | Map of all registered steps |
| `register` | `(options?) => StepTicket` | Function to register a new step |
| `unregister` | `(id: string) => void` | Function to unregister a step |
| `first` | `() => void` | Navigate to the first step |
| `last` | `() => void` | Navigate to the last step |
| `next` | `() => void` | Navigate to the next step |
| `prev` | `() => void` | Navigate to the previous step |
| `step` | `(count: number) => void` | Navigate by a specific number of steps |

## TypeScript Support

The composable is fully typed with TypeScript:

```ts
export interface StepItem extends GroupItem {
  title?: string
  disabled?: boolean
  index: number
}

export interface StepTicket extends GroupTicket {
  id: string
  disabled: boolean
  index: number
}

export interface StepContext extends GroupContext {
  currentItem: Ref<StepItem>
  register: (options?: Partial<StepItem>) => StepTicket
  unregister: (id: string) => void
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}
```
