---
meta:
  title: useStep
  description: A composable for controlling navigation between steps in a sequence, such as in multi-step forms, wizards, or guided flows.
  keywords: useStep, step navigation, multi-step, wizard, composable, Vue, state management
category: Navigation
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useStep

A composable for managing navigation through multi-step processes like forms, wizards, or onboarding flows, with support for step tracking, completion, and navigation controls.

## Usage

The `useStep` composable manages a list of steps and allows navigation between them in a controlled way.  
You register each step (with an `id` and value) in the order they should be navigated, then use the navigation methods to move

```ts
import { useStep } from '@vuetify/v0'

const steps = useStep()

// Register steps
steps.register({ id: 'step1', value: 'Step 1' })
steps.register({ id: 'step2', value: 'Step 2' })
steps.register({ id: 'step3', value: 'Step 3' })

// Jump to first step
steps.first()

// Move forward
steps.next()

// Move backward
steps.prev()

// Jump to last step
steps.last()

// Go directly to a step by its index (0-based)
steps.step(1) // moves to 'step2'
```

## API

- **Type**

  ```ts
  export interface StepTicket extends SingleTicket {}

  export interface StepContext<Z extends StepTicket> extends SingleContext<Z> {
    /** Select the first Ticket in the collection */
    first: () => void
    /** Select the last Ticket in the collection */
    last: () => void
    /** Select the next Ticket based on current index */
    next: () => void
    /** Select the previous Ticket based on current index */
    prev: () => void
    /** Step through the collection by a given count */
    step: (count: number) => void
  }

  export interface StepOptions extends SingleOptions {}
  ```
- **Details**

  - `first()`: Jump to the first step.
  - `last()`: Jump to the last step.
  - `next()`: Move forward one step.
  - `prev()`: Move back one step.
  - `step(index)`: Jump to a specific step by its 0-based index.

### `first`

- **Type**
  ```ts
  function first(): void
  ```

- **Details**
  Selects the first registered step in the sequence.
  Does nothing if no steps are registered.

- **Example**
  ```ts
  const steps = useStep()
  steps.register({ id: 's1', value: 'Intro' })
  steps.register({ id: 's2', value: 'Details' })

  steps.first()
  console.log(steps.selectedId.value) // 's1'
  console.log(steps.selectedValue.value) // 'Intro'
  ```

### `last`

- **Type**
  ```ts
  function last(): void
  ```

- **Details**
  Selects the last registered step in the sequence.
  Does nothing if no steps are registered.

- **Example**
  ```ts
  const steps = useStep()
  steps.register({ id: 's1', value: 'Intro' })
  steps.register({ id: 's2', value: 'Details' })
  steps.register({ id: 's3', value: 'Summary' })

  steps.last()
  console.log(steps.selectedId.value) // 's3'
  console.log(steps.selectedValue.value) // 'Summary'
  ```

### `next`

- **Type**
  ```ts
  function next(): void
  ```

- **Details**
  Moves selection to the next step in the sequence.
  If the current step is the last, this method does nothing.

- **Example**
  ```ts
  const steps = useStep()
  steps.register({ id: 's1', value: 'Intro' })
  steps.register({ id: 's2', value: 'Details' })

  steps.first()
  steps.next()
  console.log(steps.selectedId.value) // 's2'
  ```

### `prev`

- **Type**
  ```ts
  function prev(): void
  ```

- **Details**
  Moves selection to the previous step in the sequence.
  If the current step is the first, this method does nothing.

- **Example**
  ```ts
  const steps = useStep()
  steps.register({ id: 's1', value: 'Intro' })
  steps.register({ id: 's2', value: 'Details' })

  steps.last()
  steps.prev()
  console.log(steps.selectedId.value) // 's1'
  ```

### `step`

- **Type**
  ```ts
  function step(index: number): void
  ```

- **Details**
  Moves selection directly to the step at the given 0-based index, if it exists in the registry.

- **Example**
  ```ts
  const steps = useStep()
  steps.register({ id: 's1', value: 'Intro' })
  steps.register({ id: 's2', value: 'Details' })
  steps.register({ id: 's3', value: 'Summary' })

  steps.step(1)
  console.log(steps.selectedId.value) // 's2'
  console.log(steps.selectedValue.value) // 'Details'
  ```