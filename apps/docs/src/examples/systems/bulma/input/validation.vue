<script setup lang="ts">
  import { BuControl, BuField, BuHelp, BuInput, BuLabel } from '@paper/bulma'

  import { InputRoot, isString } from '@vuetify/v0'

  import { shallowRef } from 'vue'

  const email = shallowRef('')

  const rules = [(value: unknown) => (isString(value) && /.+@.+\..+/.test(value)) || 'This email is invalid']
</script>

<template>
  <InputRoot v-model="email" renderless :rules>
    <BuField>
      <BuLabel namespace="v0:input:root">Email</BuLabel>

      <BuControl>
        <BuInput placeholder="Email input" />
      </BuControl>

      <BuHelp namespace="v0:input:root" validation />
    </BuField>
  </InputRoot>
</template>
