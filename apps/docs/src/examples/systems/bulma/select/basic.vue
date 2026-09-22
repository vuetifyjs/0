<script setup lang="ts">
  import { BuControl, BuField, BuLabel, BuSelect } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const choice = shallowRef<string | undefined>()
</script>

<template>
  <BuField>
    <BuLabel>Country</BuLabel>

    <BuControl>
      <BuSelect v-model="choice">
        <option>Select dropdown</option>
        <option>With options</option>
      </BuSelect>
    </BuControl>
  </BuField>
</template>
