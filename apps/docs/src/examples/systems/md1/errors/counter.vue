<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const LIMIT = 60

  const status = shallowRef('Hiking the ridge above the lake this weekend, back late on Sunday')

  // The counter stays hidden until the text is within 20% of the limit.
  const counter = toRef(() => status.value.length >= LIMIT * 0.8 ? LIMIT : undefined)
</script>

<template>
  <div class="md1-docs-errors-fields">
    <Md1TextField v-model="status" :counter label="Status" />
  </div>
</template>

<style>
  .md1-docs-errors-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
