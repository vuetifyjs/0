<script setup lang="ts">
  import { BFormControl, BFormLabel, BFormText } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const password = shallowRef('')
</script>

<template>
  <div>
    <BFormLabel for="inputPassword5">Password</BFormLabel>

    <BFormControl
      id="inputPassword5"
      v-model="password"
      aria-describedby="passwordHelpBlock"
      type="password"
    />

    <BFormText id="passwordHelpBlock">
      Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
    </BFormText>
  </div>
</template>
