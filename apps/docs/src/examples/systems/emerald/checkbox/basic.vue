<script setup lang="ts">
  import { EmCheckbox } from '@paper/emerald'
  import { shallowRef } from 'vue'

  const releases = shallowRef(true)
  const digest = shallowRef(false)
  const mentions = shallowRef(false)
</script>

<template>
  <div class="emerald-docs-stack">
    <EmCheckbox v-model="releases">Release announcements</EmCheckbox>

    <EmCheckbox v-model="digest">Weekly digest</EmCheckbox>

    <EmCheckbox v-model="mentions">Mentions and replies</EmCheckbox>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }
</style>
