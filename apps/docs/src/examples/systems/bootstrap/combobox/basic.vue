<script setup lang="ts">
  import { BCombobox } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const value = shallowRef<string>()

  const items = [
    { value: '1', text: 'Option one' },
    { value: '2', text: 'Option two' },
    { value: '3', text: 'Option three' },
  ]
</script>

<template>
  <BCombobox
    v-model="value"
    :items
    name="option"
    placeholder="Select an item…"
  />
</template>
