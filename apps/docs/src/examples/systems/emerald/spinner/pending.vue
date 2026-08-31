<script setup lang="ts">
  import { EmButton, EmSpinner } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const pending = shallowRef(false)

  function reload () {
    if (pending.value) return

    pending.value = true

    setTimeout(() => {
      pending.value = false
    }, 1600)
  }
</script>

<template>
  <div class="emerald-docs-pending">
    <EmButton size="sm" variant="secondary" @click="reload">Reload</EmButton>

    <EmSpinner v-if="pending" label="Loading activity" size="sm" />

    <span v-else class="emerald-docs-result">3 new events since yesterday</span>
  </div>
</template>

<style>
  .emerald-docs-pending {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-result {
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface);
  }
</style>
