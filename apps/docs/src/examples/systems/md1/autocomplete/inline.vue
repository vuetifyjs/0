<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
  import { shallowRef } from 'vue'

  const city = shallowRef<string>()
  const cities = ['Amsterdam', 'Athens', 'Barcelona', 'Berlin', 'Lisbon', 'London', 'Madrid', 'Milan', 'Paris', 'Prague']
</script>

<template>
  <div class="md1-docs-fields">
    <Md1Autocomplete
      v-model="city"
      helper="Press Enter to accept the suggestion"
      inline
      label="City"
    >
      <Md1Autocomplete.Item v-for="item in cities" :key="item" :value="item" />
    </Md1Autocomplete>
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
