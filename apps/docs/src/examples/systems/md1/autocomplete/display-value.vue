<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
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
  <div class="md1-docs-fields">
    <Md1Autocomplete
      v-model="from"
      :display-value="label"
      label="From"
      strict
    >
      <Md1Autocomplete.Item v-for="item in airports" :key="item.code" :value="item" />
    </Md1Autocomplete>

    <p class="md1-docs-departure">Departing from: {{ from ? from.code : 'none' }}</p>
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }

  /* Two classes: the docs shell's `.markdown-body p` margin would otherwise win. */
  .md1-docs-fields .md1-docs-departure {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
