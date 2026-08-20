<script setup lang="ts">
  import { EmBadge, EmButton } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const unread = shallowRef(97)

  function add () {
    unread.value += 1
  }

  function clear () {
    unread.value = 0
  }
</script>

<template>
  <div class="emerald-docs-count">
    <span class="emerald-docs-label">
      Inbox

      <EmBadge :content="unread" :max="99" variant="danger" />
    </span>

    <EmButton size="sm" variant="secondary" @click="add">Receive one</EmButton>

    <EmButton :disabled="unread === 0" size="sm" variant="tertiary" @click="clear">Clear</EmButton>
  </div>
</template>

<style>
  .emerald-docs-count {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-label {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface);
  }
</style>
