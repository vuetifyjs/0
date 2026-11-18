<script setup lang="ts">
  import { BFormControl, BFormFeedback, BFormField, BFormLabel, BFormText } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const email = shallowRef('')
</script>

<template>
  <BFormField>
    <BFormLabel for="fieldText">Email address</BFormLabel>

    <BFormControl
      id="fieldText"
      v-model="email"
      aria-describedby="fieldTextHelp fieldTextFeedback"
      invalid
      placeholder="name@example.com"
      type="email"
    />

    <BFormText id="fieldTextHelp">We’ll never share your email with anyone else.</BFormText>
    <BFormFeedback id="fieldTextFeedback">Email is required</BFormFeedback>
  </BFormField>
</template>
