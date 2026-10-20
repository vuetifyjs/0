<script setup lang="ts">
  import {
    BuField,
    BuHelp,
    BuLabel,
    BuNumberField,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const price = shallowRef<number | null>(9.5)
</script>

<template>
  <BuField>
    <BuLabel for="price">Price</BuLabel>

    <BuNumberField
      id="price"
      v-model="price"
      color="link"
      :format="{ style: 'currency', currency: 'USD' }"
      locale="en-US"
      :min="0"
      :step="0.5"
    >
      <BuNumberField.Decrement />
      <BuNumberField.Input expanded />
      <BuNumberField.Increment />
    </BuNumberField>

    <BuHelp>Focus the input to edit the raw number; blur it to see the currency.</BuHelp>
  </BuField>
</template>
