<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('group')
</script>

<template>
  <Md1Stepper v-model="step" alternative-labels class="md1-docs-stepper">
    <Md1Stepper.Step label="Campaign settings" value="settings">
      <Md1Stepper.Content>Name the campaign and pick its markets.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Ad group" value="group">
      <Md1Stepper.Content>Group the ads that share a budget.</Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Ad" value="ad">
      <Md1Stepper.Content>Write the headline and description.</Md1Stepper.Content>
    </Md1Stepper.Step>
  </Md1Stepper>
</template>

<style>
  .md1-docs-stepper {
    width: 100%;
    max-width: 720px;
  }
</style>
