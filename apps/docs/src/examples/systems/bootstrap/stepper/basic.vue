<script setup lang="ts">
  import { BStepper, BStepperItem } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const step = shallowRef(1)
</script>

<template>
  <BStepper v-model="step">
    <BStepperItem>Create account</BStepperItem>

    <BStepperItem>Confirm email</BStepperItem>

    <BStepperItem>Update profile</BStepperItem>

    <BStepperItem>Finish</BStepperItem>
  </BStepper>
</template>
