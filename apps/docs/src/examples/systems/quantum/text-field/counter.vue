<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const title = shallowRef('Weekend in the hills')
  const summary = shallowRef('')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField v-model="title" :counter="24" label="Title" />

    <QuTextField v-model="summary" :counter="{ words: 12 }" label="Summary" multiline />
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
