<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { shallowRef } from 'vue'

  interface Airport {
    code: string
    city: string
  }

  const airports: Airport[] = [
    { code: 'AMS', city: 'Amsterdam' },
    { code: 'CDG', city: 'Paris' },
    { code: 'JFK', city: 'New York' },
    { code: 'LHR', city: 'London' },
    { code: 'LIS', city: 'Lisbon' },
  ]

  const from = shallowRef<Airport>()

  function label (value: unknown): string {
    const airport = value as Airport

    return `${airport.city} (${airport.code})`
  }
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete
      v-model="from"
      :display-value="label"
      label="From"
      strict
    >
      <QuAutocomplete.Item v-for="item in airports" :key="item.code" :value="item" />
    </QuAutocomplete>

    <p class="quantum-docs-departure">Departing from: {{ from ? from.code : 'none' }}</p>
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }

  .quantum-docs-departure {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
