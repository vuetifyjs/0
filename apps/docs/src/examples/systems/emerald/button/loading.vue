<script setup lang="ts">
  import { EmButton } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const saving = shallowRef(false)

  function onSave () {
    saving.value = true

    setTimeout(() => {
      saving.value = false
    }, 1600)
  }
</script>

<template>
  <div class="emerald-docs-row">
    <EmButton :loading="saving" @click="onSave">Save changes</EmButton>

    <EmButton disabled>Disabled</EmButton>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
