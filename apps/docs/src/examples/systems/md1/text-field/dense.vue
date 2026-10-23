<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const first = shallowRef('Grace')
  const last = shallowRef('')
  const company = shallowRef('')
</script>

<template>
  <div class="md1-docs-fields-dense">
    <Md1TextField v-model="first" dense label="First name" />

    <Md1TextField v-model="last" dense label="Last name" />

    <Md1TextField v-model="company" dense helper="Leave empty for personal accounts" label="Company" />
  </div>
</template>

<style>
  .md1-docs-fields-dense {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    max-width: 360px;
  }
</style>
