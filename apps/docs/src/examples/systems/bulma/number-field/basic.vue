<script setup lang="ts">
  import {
    BuField,
    BuHelp,
    BuLabel,
    BuNumberField,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const quantity = shallowRef<number | null>(1)
</script>

<template>
  <BuField>
    <BuLabel for="quantity">Quantity</BuLabel>

    <BuNumberField
      id="quantity"
      v-model="quantity"
      :max="10"
      :min="0"
      :step="1"
    >
      <BuNumberField.Decrement />
      <BuNumberField.Input expanded />
      <BuNumberField.Increment />
    </BuNumberField>

    <BuHelp>Value: {{ quantity }} — the steppers go inert at 0 and 10.</BuHelp>
  </BuField>
</template>
