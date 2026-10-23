<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('ad')
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-stepper">
    <Md1Stepper.Step editable label="Campaign settings" value="settings">
      <Md1Stepper.Content>
        Settings can be changed until the campaign is published.

        <Md1Stepper.Actions />
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Step label="Billing account" value="billing">
      <Md1Stepper.Content>
        The billing account is fixed once the campaign is created.

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
