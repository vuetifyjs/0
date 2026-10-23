<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const country = shallowRef<string>()
  const countries = ['Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Portugal', 'Spain']
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete
      v-model="country"
      helper="Only countries we ship to"
      label="Country"
      strict
    >
      <QuAutocomplete.Item v-for="item in countries" :key="item" :value="item" />

      <QuAutocomplete.Empty v-slot="{ query }">
        We do not ship to "{{ query }}"
      </QuAutocomplete.Empty>
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
