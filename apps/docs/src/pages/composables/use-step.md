# useStep

The `useStep` composable manages navigation through a multi-step process, such as forms, wizards, or onboarding flows. It provides methods to navigate between steps, track the current step, and handle step completion while supporting features like disabled steps and circular navigation. Built on top of `useSingle`, it provides a single-selection interface for step management.

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
| `mandatory` | `boolean \| 'force'` | `false` | Whether a step must always be selected |
| `returnObject` | `boolean` | `false` | Whether to return full objects instead of values |

### Returns

| Return | Type | Description |
|--------|------|-------------|
| `[0]` | `() => StepContext` | Function to consume the step context |
| `[1]` | `(model?, context?) => StepContext` | Function to provide the step context |
| `[2]` | `StepContext` | The step context object |

### Step Context Properties

| Property | Type | Description |
|----------|------|-------------|
| `selectedId` | `ComputedRef<ID \| undefined>` | ID of the currently selected step |
| `selectedItem` | `ComputedRef<StepTicket \| undefined>` | Currently selected step item |
| `selectedValue` | `ComputedRef<unknown>` | Value of the currently selected step |
| `selectedIndex` | `Ref<number>` | Index of the currently selected step |
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
export interface StepItem extends SingleItem {}

export interface StepTicket extends SingleTicket {}

export interface StepOptions extends SingleOptions {}

export interface StepContext extends SingleContext {
  selectedIndex: Ref<number>
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}
```
