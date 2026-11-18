<script setup lang="ts">
  import { BStepper, BStepperItem } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const step = shallowRef(1)
</script>

<template>
  <BStepper v-model="step" overflow>
    <BStepperItem>Create account</BStepperItem>

    <BStepperItem>Verify email address</BStepperItem>

    <BStepperItem>Complete profile setup</BStepperItem>

    <BStepperItem>Add payment method</BStepperItem>

    <BStepperItem>Review and confirm</BStepperItem>

    <BStepperItem>Finish onboarding</BStepperItem>
  </BStepper>
</template>
