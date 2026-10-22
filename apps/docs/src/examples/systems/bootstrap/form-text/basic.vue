<script setup lang="ts">
  import { BFormControl, BFormField, BFormLabel, BFormText } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const email = shallowRef('')
</script>

<template>
  <BFormField>
    <BFormLabel for="formTextEmail">Email address</BFormLabel>

    <BFormControl
      id="formTextEmail"
      v-model="email"
      aria-describedby="formTextHelp"
      placeholder="name@example.com"
      type="email"
    />

    <BFormText id="formTextHelp">We’ll never share your email with anyone else.</BFormText>
  </BFormField>
</template>
