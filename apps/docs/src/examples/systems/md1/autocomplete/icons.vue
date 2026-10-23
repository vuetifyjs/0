<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
  import { shallowRef } from 'vue'

  const place = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-fields">
    <Md1Autocomplete v-model="place" label="Destination">
      <Md1Autocomplete.Item icon="home" value="Home" />

      <Md1Autocomplete.Item icon="history" value="Central Station" />

      <Md1Autocomplete.Item icon="history" value="City Library" />

      <Md1Autocomplete.Item value="Harbour Market" />

      <Md1Autocomplete.Item value="Old Town Square" />
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
