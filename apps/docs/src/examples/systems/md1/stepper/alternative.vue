<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('details')
  const channel = shallowRef('channels')
</script>

<template>
  <div class="md1-docs-steppers">
    <Md1Stepper v-model="step" alternative-labels class="md1-docs-stepper">
      <Md1Stepper.Step label="Ad unit details" value="details">
        <Md1Stepper.Content>Name the ad unit and choose its type.</Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Ad sizes" optional value="sizes">
        <Md1Stepper.Content>Pick the sizes the unit may serve, or keep the recommended set.</Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Ad templates" value="templates">
        <Md1Stepper.Content>Choose how text ads look inside the unit.</Md1Stepper.Content>
      </Md1Stepper.Step>
    </Md1Stepper>

    <Md1Stepper
      v-model="channel"
      alternative-labels
      class="md1-docs-stepper"
      :linear="false"
    >
      <Md1Stepper.Step complete label="Ad style" value="style">
        <Md1Stepper.Content>Colours and fonts are set.</Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step error="Add a channel" label="Custom channels" value="channels">
        <Md1Stepper.Content>Channels group units so their reports can be compared.</Md1Stepper.Content>
      </Md1Stepper.Step>

      <Md1Stepper.Step label="Get code" value="code">
        <Md1Stepper.Content>Copy the code into each page that shows the unit.</Md1Stepper.Content>
      </Md1Stepper.Step>
    </Md1Stepper>
  </div>
</template>

<style>
  .md1-docs-steppers {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
    max-width: 720px;
  }

  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
