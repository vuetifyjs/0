<script setup lang="ts">
  import {
    BuField,
    BuHelp,
    BuLabel,
    BuNumberField,
  } from '@paper/bulma'

  import { isNumber, NumberFieldRoot } from '@vuetify/v0'

  import { shallowRef } from 'vue'

  const seats = shallowRef<number | null>(null)

  const rules = [(value: unknown) => (isNumber(value) && value >= 2) || 'At least 2 seats']
</script>

<template>
  <NumberFieldRoot
    v-model="seats"
    label="Seats"
    :min="0"
    renderless
    :rules
  >
    <BuField>
      <BuLabel namespace="v0:number-field:root">Seats</BuLabel>

      <BuNumberField>
        <BuNumberField.Decrement />
        <BuNumberField.Input expanded />
        <BuNumberField.Increment />
      </BuNumberField>

      <BuHelp namespace="v0:number-field:root" validation />
    </BuField>
  </NumberFieldRoot>
</template>
