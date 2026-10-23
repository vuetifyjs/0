<script setup lang="ts">
  import { QuAutocomplete } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const place = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-fields">
    <QuAutocomplete v-model="place" label="Destination">
      <QuAutocomplete.Item icon="home" value="Home" />

      <QuAutocomplete.Item icon="history" value="Central Station" />

      <QuAutocomplete.Item icon="history" value="City Library" />

      <QuAutocomplete.Item value="Harbour Market" />

      <QuAutocomplete.Item value="Old Town Square" />
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
