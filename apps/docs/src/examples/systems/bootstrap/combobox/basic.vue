<script setup lang="ts">
  import { BCombobox } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const country = shallowRef<string>()

  const items = [
    { value: 'us', text: 'United States' },
    { value: 'uk', text: 'United Kingdom' },
    { value: 'ca', text: 'Canada' },
  ]
</script>

<template>
  <BCombobox
    v-model="country"
    :items
    name="country"
    placeholder="Pick a country…"
  />
</template>
