# useStep

A composable for managing navigation through multi-step processes like forms, wizards, or onboarding flows, with support for step tracking, completion, and navigation controls.

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
| `registeredItems` | `Map<string, StepTicket>` | Map of all registered steps |
| `register` | `(item?: Partial<StepTicket>, id?: ID) => Reactive<StepTicket>` | Function to register a new step |
| `unregister` | `(id: string) => void` | Function to unregister a step |
| `first` | `() => void` | Navigate to the first step |
| `last` | `() => void` | Navigate to the last step |
| `next` | `() => void` | Navigate to the next step |
| `prev` | `() => void` | Navigate to the previous step |
| `step` | `(count: number) => void` | Navigate by a specific number of steps |

## Example

```vue
<script lang="ts" setup>
import { useStep } from 'v0'
import { ref } from 'vue'

const [useWizard, provideWizard, wizard] = useStep('wizard', {
  mandatory: 'force',
})

const model = ref()
provideWizard(model)

const steps = useWizard()

steps.register({ value: 'step-1', title: 'Step 1' })
steps.register({ value: 'step-2', title: 'Step 2' })
steps.register({ value: 'step-3', title: 'Step 3', disabled: true })
steps.register({ value: 'step-4', title: 'Step 4' })
</script>

<template>
  <div>
    <div class="steps">
      <button
        v-for="[id, item] in steps.registeredItems"
        :key="id"
        :class="{ 'active': item.isActive, 'disabled': item.disabled }"
        @click="item.toggle()"
      >
        {{ item.title }}
      </button>
    </div>

    <div class="content">
      <p>Selected Step: {{ steps.selectedValue }}</p>
      <p>Selected Index: {{ steps.selectedIndex }}</p>
    </div>

    <div class="navigation">
      <button @click="steps.first()">First</button>
      <button @click="steps.prev()">Prev</button>
      <button @click="steps.next()">Next</button>
      <button @click="steps.last()">Last</button>
    </div>
  </div>
</template>
```

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
