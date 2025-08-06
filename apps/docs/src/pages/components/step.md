---
meta:
  title: Step
  description: A component for creating multi-step flows or wizards, guiding users through a defined sequence of actions.
  keywords: step, vuetify0, component, wizard, multi-step, form
category: Component
performance: 0
---

# Step Component

## Description

The `Step` component in Vuetify0 is designed to facilitate the creation of multi-step processes, such as forms, onboarding flows, or wizards. It provides a structured way to define individual steps and manage the progression between them. The `Step` component works in conjunction with `StepItem` components to define the content of each step.

## API

### Props

- **`namespace`**: `string`
  - A unique identifier for the step context, used for internal state management.
- **`modelValue`**: `any`
  - The current active step. This prop is used with `v-model` for two-way data binding.
- **`mandatory`**: `boolean`
  - If `true`, a step must always be active.
- **`max`**: `number`
  - The maximum number of steps allowed.

### Slots

- **`default`**: `(scope: StepContext) => any`
  - The default slot provides access to the `StepContext` object, which contains properties and methods related to the step progression. This allows for dynamic rendering and control over the step flow.

### Events

- **`update:modelValue`**: `(value: any) => void`
  - Emitted when the active step changes.

## Examples

### Basic Multi-Step Form

```vue
<template>
  <Step v-model="currentStep">
    <StepItem value="step1">
      <h2>Step 1: Personal Information</h2>
      <input type="text" placeholder="Name" />
      <button @click="currentStep = 'step2'">Next</button>
    </StepItem>
    <StepItem value="step2">
      <h2>Step 2: Contact Details</h2>
      <input type="email" placeholder="Email" />
      <button @click="currentStep = 'step1'">Previous</button>
      <button @click="currentStep = 'step3'">Next</button>
    </StepItem>
    <StepItem value="step3">
      <h2>Step 3: Confirmation</h2>
      <p>Please review your information.</p>
      <button @click="currentStep = 'step2'">Previous</button>
      <button>Submit</button>
    </StepItem>
  </Step>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Step, StepItem } from '@vuetify/0/components/Step';

const currentStep = ref('step1');
</script>
```

### Step with Custom Navigation

```vue
<template>
  <Step v-model="currentStep">
    <template #default="{ next, prev }">
      <StepItem value="intro">
        <h1>Welcome!</h1>
        <button @click="next">Start</button>
      </StepItem>
      <StepItem value="main">
        <p>Main content here.</p>
        <button @click="prev">Back</button>
        <button @click="next">Continue</button>
      </StepItem>
      <StepItem value="finish">
        <h2>All Done!</h2>
        <button @click="prev">Go Back</button>
      </StepItem>
    </template>
  </Step>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Step, StepItem } from '@vuetify/0/components/Step';

const currentStep = ref('intro');
</script>
```

