---
meta:
  title: useStep
  description: Creates a step selection context for managing collections where users can navigate through items sequentially.
  keywords: useStep, step, navigation, single selection, composable, Vue
category: Selection
performance: 0
---

# useStep

The `useStep` composable creates a step selection context for managing collections where users can navigate through items sequentially. This function extends the single selection functionality provided by `useSingle` with stepping navigation, allowing for easy movement between items in a defined order.

## API

### `StepTicket`

```ts
export interface StepTicket extends SingleTicket {}
```

Extends `SingleTicket` and represents an item that can be part of a step-by-step navigation.

### `StepContext`

```ts
export interface StepContext<Z extends StepTicket> extends SingleContext<Z> {
  first: () => void
  last: () => void
  next: () => void
  prev: () => void
  step: (count: number) => void
}
```

Extends `SingleContext` with methods for sequential navigation:
- `first()`: Selects the first item in the collection.
- `last()`: Selects the last item in the collection.
- `next()`: Selects the next item in the sequence. Wraps around to the beginning if at the end.
- `prev()`: Selects the previous item in the sequence. Wraps around to the end if at the beginning.
- `step(count: number)`: Advances or retreats the selection by a specified `count`. Positive `count` moves forward, negative moves backward.

### `useStep(options?)`

* **Type**
    
  ```ts
  export interface StepOptions extends SingleOptions {}

  export function useStep<
    Z extends StepTicket = StepTicket,
    E extends StepContext<Z> = StepContext<Z>,
  > (options?: StepOptions): E
  ```
    
* **Details**
    
  - `options`: Optional configuration for step behavior. Extends `SingleOptions` from `useSingle`.

  Returns a `StepContext` object with properties and methods for managing sequential selection and navigation.

## Examples

### Basic Usage

```html
<template>
  <div>
    <h3>Wizard Steps:</h3>
    <div v-for="s in steps" :key="s.id">
      <input
        type="radio"
        :id="s.id"
        :value="s.id"
        :checked="s.isActive.value"
        @change="s.toggle()"
      />
      <label :for="s.id">{{ s.value }}</label>
    </div>
    <p>Current Step: {{ stepContext.selectedValue.value || 'None' }}</p>
    <button @click="stepContext.first()">First</button>
    <button @click="stepContext.prev()">Previous</button>
    <button @click="stepContext.next()">Next</button>
    <button @click="stepContext.last()">Last</button>
    <button @click="stepContext.step(2)">Skip 2 Steps</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useStep } from '@vuetify/v0/composables/useStep'

  const steps = ref([
    { id: 'step-1', value: 'Introduction' },
    { id: 'step-2', value: 'Configuration' },
    { id: 'step-3', value: 'Review' },
    { id: 'step-4', value: 'Confirmation' },
  ])

  const stepContext = useStep({ mandatory: true, enroll: true })

  onMounted(() => {
    steps.value.forEach(s => stepContext.register(s))
  })
</script>
```


