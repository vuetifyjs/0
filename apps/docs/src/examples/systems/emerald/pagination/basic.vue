<script setup lang="ts">
  import {
    EmIcon,
    EmPagination,
    EmPaginationItem,
    EmPaginationNext,
    EmPaginationPrev,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const page = shallowRef(1)
</script>

<template>
  <EmPagination v-slot="{ items }" v-model="page" :size="95">
    <EmPaginationPrev>
      <EmIcon name="chevron-left" size="s" />
    </EmPaginationPrev>

    <template v-for="(item, index) in items" :key="index">
      <EmPaginationItem v-if="item.type === 'page'" :value="item.value" />

      <span v-else aria-hidden="true" class="emerald-docs-gap">{{ item.value }}</span>
    </template>

    <EmPaginationNext>
      <EmIcon name="chevron-right" size="s" />
    </EmPaginationNext>
  </EmPagination>
</template>

<style>
  .emerald-docs-gap {
    padding: 0 var(--emerald-spacing-2xs, 4px);
    color: var(--emerald-on-surface-variant, #757e85);
  }
</style>
