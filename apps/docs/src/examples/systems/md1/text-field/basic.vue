<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const name = shallowRef('')
  const city = shallowRef('Lisbon')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField v-model="name" helper="As it appears on your card" label="Full name" />

    <Md1TextField v-model="city" label="City" />
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
