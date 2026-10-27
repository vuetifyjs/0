<script setup lang="ts">
  import { Md1Checkbox, Md1Stepper } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const step = shallowRef('address')
  const business = shallowRef(false)

  // The flow is derived from the answers so far: a business address adds a step.
  const steps = toRef(() => [
    { value: 'address', label: 'Shipping address' },
    ...(business.value ? [{ value: 'company', label: 'Company details' }] : []),
    { value: 'delivery', label: 'Delivery speed' },
    { value: 'payment', label: 'Payment' },
    { value: 'review', label: 'Review the order' },
  ])
</script>

<template>
  <Md1Stepper v-model="step" class="md1-docs-phone" mobile="progress">
    <Md1Stepper.Step
      v-for="item in steps"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <Md1Stepper.Content>
        <template v-if="item.value === 'address'">
          Where should the order go?

          <Md1Checkbox v-model="business" label="Shipping to a business" />
        </template>

        <template v-else-if="item.value === 'company'">
          Add the company name and a VAT number for the invoice.
        </template>

        <template v-else>{{ item.label }}.</template>
      </Md1Stepper.Content>
    </Md1Stepper.Step>

    <Md1Stepper.Bar />
  </Md1Stepper>
</template>

<style>
  .md1-docs-phone {
    width: 100%;
    max-width: 360px;
  }
</style>
