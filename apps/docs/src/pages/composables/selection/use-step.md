---
title: useStep Composable
meta:
- name: description
  content: A composable for controlling navigation between steps in a sequence, such
    as in multi-step forms, wizards, or guided flows.
- name: keywords
  content: useStep, step navigation, multi-step, wizard, composable, Vue, state management
features:
  category: Composable
  label: 'E: useStep'
  github: /composables/useStep/
---

# useStep

A composable for managing navigation through multi-step processes like forms, wizards, or onboarding flows, with support for step tracking, completion, and navigation controls.

<DocsPageFeatures :frontmatter />

## Usage

The `useStep` composable manages a list of steps and allows navigation between them with configurable circular (wrapping) or bounded (stopping at edges) behavior.
You register each step (with an `id` and value) in the order they should be navigated, then use the navigation methods to move

```ts
import { createStep } from '@vuetify/v0'

// Bounded navigation (default) - for wizards, forms
const wizard = createStep({ circular: false })

wizard.onboard([
  { id: 'step1', value: 'Account Info' },
  { id: 'step2', value: 'Payment' },
  { id: 'step3', value: 'Confirmation' },
])

wizard.first()    // Go to step1
wizard.next()     // Go to step2
wizard.next()     // Go to step3
wizard.next()     // Stays at step3 (bounded)

// Circular navigation - for carousels, theme switchers
const carousel = createStep({ circular: true })

carousel.onboard([
  { id: 'slide1', value: 'First' },
  { id: 'slide2', value: 'Second' },
  { id: 'slide3', value: 'Third' },
])

carousel.last()   // Go to slide3
carousel.next()   // Wraps to slide1
carousel.prev()   // Wraps to slide3
```

## API


| Composable | Description |
|---|---|
| [useSingle](/composables/selection/use-single) | Single-selection system that useStep extends |
| [useSelection](/composables/selection/use-selection) | Base selection system |
| [useTheme](/composables/plugins/use-theme) | Theme management (uses useSingle for theme selection) |
| [useRegistry](/composables/registration/use-registry) | Base registry system |
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

  export interface StepOptions extends SingleOptions {
    /**
     * Enable circular navigation (wrapping at boundaries).
     * - true: Navigation wraps around (carousel behavior)
     * - false: Navigation stops at boundaries (pagination behavior)
     * @default false
     */
    circular?: boolean
  }
  ```
- **Details**

  - `first()`: Jump to the first step.
  - `last()`: Jump to the last step.
  - `next()`: Move forward one step (wraps if `circular: true`, stops at boundary if `circular: false`).
  - `prev()`: Move back one step (wraps if `circular: true`, stops at boundary if `circular: false`).
  - `step(count)`: Move by `count` positions (negative for backward, wraps or stops depending on `circular`).

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
  - If `circular: false` (default): Stops at the last step (does nothing if already at the end)
  - If `circular: true`: Wraps around to the first step when called on the last step

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
  - If `circular: false` (default): Stops at the first step (does nothing if already at the start)
  - If `circular: true`: Wraps around to the last step when called on the first step

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
  function step(count: number): void
  ```

- **Details**
  Moves selection by `count` positions (positive for forward, negative for backward).
  - If `circular: false` (default): Stops at boundaries (does nothing if stepping beyond edges)
  - If `circular: true`: Wraps around using modulo arithmetic

- **Example**
  ```ts
  const steps = createStep({ circular: false })
  steps.onboard([
    { id: 's1', value: 'Intro' },
    { id: 's2', value: 'Details' },
    { id: 's3', value: 'Summary' },
  ])

  steps.first()
  steps.step(2)   // Move forward 2 steps
  console.log(steps.selectedId.value) // 's3'

  steps.step(-1)  // Move back 1 step
  console.log(steps.selectedId.value) // 's2'
  ```
