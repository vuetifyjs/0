<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const city = shallowRef<string>()
  const cities = ['Amsterdam', 'Athens', 'Barcelona', 'Berlin', 'Lisbon', 'London', 'Madrid', 'Milan', 'Paris', 'Prague']
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete
      v-model="city"
      helper="Press Enter to accept the suggestion"
      inline
      label="City"
    >
      <QuAutocomplete.Item v-for="item in cities" :key="item" :value="item" />
    </QuAutocomplete>
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }
</style>
