<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
  import { shallowRef } from 'vue'

  const country = shallowRef<string>()
  const countries = ['Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Portugal', 'Spain']
</script>

<template>
  <div class="md1-docs-fields">
    <Md1Autocomplete
      v-model="country"
      helper="Only countries we ship to"
      label="Country"
      strict
    >
      <Md1Autocomplete.Item v-for="item in countries" :key="item" :value="item" />

      <Md1Autocomplete.Empty v-slot="{ query }">
        We do not ship to "{{ query }}"
      </Md1Autocomplete.Empty>
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
