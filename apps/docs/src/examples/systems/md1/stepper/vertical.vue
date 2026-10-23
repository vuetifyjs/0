<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('settings')
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-stepper" vertical>
    <Md1Stepper.Step label="Select campaign settings" value="settings">
      <Md1Stepper.Content>
        Name the campaign and pick the markets it runs in.

        <Md1Stepper.Actions />
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Create an ad group" value="group">
      <Md1Stepper.Content>
        Group the ads that share a budget and a set of keywords.

        <Md1Stepper.Actions />
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Create an ad" value="ad">
      <Md1Stepper.Content>
        Write the headline and the two description lines.

        <Md1Stepper.Actions />
      </Md1Stepper.Content>
    </Md1Stepper.Step>
  </Md1Stepper>
</template>

<style>
  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
