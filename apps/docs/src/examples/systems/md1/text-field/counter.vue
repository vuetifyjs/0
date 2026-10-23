<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const title = shallowRef('Weekend in the hills')
  const summary = shallowRef('')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField v-model="title" :counter="24" label="Title" />

    <Md1TextField v-model="summary" :counter="{ words: 12 }" label="Summary" multiline />
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
