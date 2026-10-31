<script setup lang="ts">
  import { BFormControl, BFormFeedback, BFormField, BFormLabel } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const name = shallowRef('Mark Otto')
</script>

<template>
  <BFormField>
    <BFormLabel for="validationCustom01">Name</BFormLabel>

    <BFormControl
      id="validationCustom01"
      v-model="name"
      aria-describedby="validationCustom01Feedback"
      invalid
      required
    />

    <BFormFeedback id="validationCustom01Feedback">Full name is required</BFormFeedback>
  </BFormField>
</template>
