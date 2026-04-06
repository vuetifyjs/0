---
title: createStep - Sequential Navigation for Vue 3
meta:
- name: description
  content: Navigate sequential steps with first, last, next, and prev methods. Build form wizards, carousels, and guided flows with circular navigation support.
- name: keywords
  content: createStep, step navigation, wizard, stepper, carousel, multi-step form, Vue 3, composable
features:
  category: Composable
  label: 'E: createStep'
  github: /composables/createStep/
  level: 2
related:
  - /composables/selection/create-single
  - /components/providers/step
---

# createStep

Extends `createSingle` with bounded or circular navigation. Built for wizards, multi-step forms, and onboarding flows.

<DocsPageFeatures :frontmatter />

## Usage

The `createStep` composable manages a list of steps and allows navigation between them with configurable circular (wrapping) or bounded (stopping at edges) behavior.
You register each step (with an `id` and value) in the order they should be navigated, then use the navigation methods to move

```ts collapse no-filename
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

## Context / DI

Use `createStepContext` to share a step navigation instance across a component tree:

```ts
import { createStepContext } from '@vuetify/v0'

export const [useWizard, provideWizard, wizard] =
  createStepContext({ namespace: 'my:wizard', circular: false })

// In parent component
provideWizard()

// In child component
const step = useWizard()
step.next()
```

## Architecture

`createStep` extends `createSingle` with directional navigation:

```mermaid "Step Navigation Hierarchy"
flowchart TD
  createRegistry --> createModel
  createModel --> createSelection
  createSelection --> createSingle
  createSingle --> createStep
  createStep --> first/last
  createStep --> next/prev
  createStep --> step
```

## Reactivity

Step navigation state is **always reactive**. Use `selectedIndex` to derive disabled states for navigation buttons.

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `selectedId` | <AppSuccessIcon /> | Computed — current step ID |
| `selectedIndex` | <AppSuccessIcon /> | Computed — current step position |
| `selectedItem` | <AppSuccessIcon /> | Computed — current step ticket |
| `selectedValue` | <AppSuccessIcon /> | Computed — current step value |
| `step(count)` | <AppErrorIcon /> | Move by `count` positions — positive forward, negative backward |

> [!TIP] step(count)
> `step(-2)` moves back two positions; `step(3)` skips ahead three. In circular mode it wraps at both ends; in bounded mode it clamps at the first and last steps. Disabled steps are skipped automatically.

> [!TIP] Navigation button state
> Derive boundary checks from `selectedIndex` and registry size:
> ```ts
> const atFirst = toRef(() => selection.selectedIndex.value === 0)
> const atLast  = toRef(() => selection.selectedIndex.value === selection.size - 1)
> ```
> In circular mode, buttons are never disabled.

## Examples

::: example
/composables/create-step/stepper

### Multi-Step Stepper

Numbered steps with a progress bar, clickable navigation, and a disabled step that auto-skips.

:::

<DocsApi />
