<script setup lang="ts">
  import {
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const page = shallowRef(1)
</script>

<template>
  <EmPagination
    v-slot="{ items, pageStart, pageStop, size }"
    v-model="page"
    :items-per-page="8"
    :size="87"
  >
    <span class="emerald-docs-summary">{{ pageStart + 1 }}–{{ pageStop }} of {{ size }}</span>

    <EmPaginationPrev>Previous</EmPaginationPrev>

    <template v-for="(item, index) in items" :key="index">
      <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />

      <span v-else aria-hidden="true" class="emerald-docs-gap">{{ item.value }}</span>
    </template>

    <EmPaginationNext>Next</EmPaginationNext>
  </EmPagination>
</template>

<style>
  .emerald-docs-summary {
    margin-right: var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .emerald-docs-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }
</style>
