<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('settings')
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-stepper">
    <Md1Stepper.Step label="Campaign settings" value="settings">
      <Md1Stepper.Content>
        Name the campaign and pick the markets it runs in.

        <Md1Stepper.Actions />
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Audience" optional value="audience">
      <Md1Stepper.Content>
        Narrow the audience, or continue to show the ads to everyone.

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
