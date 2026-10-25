<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const destination = shallowRef('')
  const phone = shallowRef('')
  const password = shallowRef('')
</script>

<template>
  <div class="md1-docs-placeholders">
    <Md1TextField
      v-model="destination"
      helper="Domestic cities only"
      label="Destination"
      placeholder="New York, NY"
    />

    <Md1TextField
      v-model="phone"
      autocomplete="tel"
      helper="This will not be shared with others"
      inputmode="tel"
      label="Phone number"
      placeholder="(123) 456-7890"
    />

    <Md1TextField
      v-model="password"
      autocomplete="new-password"
      helper="At least 8 characters"
      label="Password"
      placeholder="••••••••"
      type="password"
    />
  </div>
</template>

<style>
  .md1-docs-placeholders {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-4, 32px);
  }
</style>
