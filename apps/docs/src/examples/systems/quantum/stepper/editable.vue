<script setup lang="ts">
  import { QuStepper } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const step = shallowRef('ad')
</script>

<template>
  <QuStepper v-model="step" class="quantum-docs-stepper">
    <QuStepper.Step editable label="Campaign settings" value="settings">
      <QuStepper.Content>
        Settings can be changed until the campaign is published.

        <QuStepper.Actions />
      </QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Billing account" value="billing">
      <QuStepper.Content>
        The billing account is fixed once the campaign is created.

        <QuStepper.Actions />
      </QuStepper.Content>
    </QuStepper.Step>

    <QuStepper.Step label="Create an ad" value="ad">
      <QuStepper.Content>
        Write the headline and the two description lines.

        <QuStepper.Actions />
      </QuStepper.Content>
    </QuStepper.Step>
  </QuStepper>
</template>

<style>
  .quantum-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
