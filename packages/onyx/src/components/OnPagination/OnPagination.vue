<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  export interface OnPaginationProps {
    boundaries?: boolean
    itemsPerPage?: number
    size: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnPagination' })

  const {
    boundaries = false,
    itemsPerPage = 10,
    size,
  } = defineProps<OnPaginationProps>()

  const page = defineModel<number>({ default: 1 })
</script>

<template>
  <Pagination.Root
    v-slot="{ items }"
    v-model="page"
    class="onyx-pagination"
    :items-per-page
    :size
  >
    <Pagination.First v-if="boundaries" class="onyx-pagination__item">
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="m11 17-5-5 5-5" />
        <path d="m18 17-5-5 5-5" />
      </svg>
    </Pagination.First>

    <Pagination.Prev class="onyx-pagination__item">
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </Pagination.Prev>

    <template v-for="item in items" :key="`${item.type}-${item.value}`">
      <Pagination.Item v-if="item.type === 'page'" class="onyx-pagination__item" :value="item.value" />
      <Pagination.Ellipsis v-else class="onyx-pagination__ellipsis" />
    </template>

    <Pagination.Next class="onyx-pagination__item">
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Pagination.Next>

    <Pagination.Last v-if="boundaries" class="onyx-pagination__item">
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="m6 17 5-5-5-5" />
        <path d="m13 17 5-5-5-5" />
      </svg>
    </Pagination.Last>
  </Pagination.Root>
</template>

<!-- Unscoped: Pagination.First/Prev/Item/Ellipsis/Next/Last are compound children
     from v0's own file scope; scoped data-v never reaches their roots (mirrors
     the OnButton/Button.Root case). -->
<style>
  .onyx-pagination {
    align-items: center;
    display: flex;
    gap: var(--onyx-spacing-3xs, 2px);
  }

  .onyx-pagination__item {
    align-items: center;
    background: transparent;
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #27272a);
    border-radius: var(--onyx-radius-md, 0.375rem);
    color: var(--onyx-foreground, #fafafa);
    cursor: pointer;
    display: inline-flex;
    font-size: var(--onyx-text-sm-size, 13px);
    height: var(--onyx-control-md, 36px);
    justify-content: center;
    transition: background-color var(--onyx-motion-fast, 120ms), color var(--onyx-motion-fast, 120ms), border-color var(--onyx-motion-fast, 120ms);
    width: var(--onyx-control-md, 36px);
  }

  .onyx-pagination__item:hover:not([data-disabled]):not([data-selected]) {
    background: var(--onyx-accent, #27272a);
  }

  .onyx-pagination__item[data-selected] {
    background: var(--onyx-primary, #fafafa);
    border-color: var(--onyx-primary, #fafafa);
    color: var(--onyx-primary-foreground, #18181b);
  }

  .onyx-pagination__item[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .onyx-pagination__item:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-ring, #71717a) 50%, transparent);
    outline: none;
  }

  .onyx-pagination__ellipsis {
    align-items: center;
    color: var(--onyx-muted-foreground, #a1a1aa);
    display: inline-flex;
    height: var(--onyx-control-md, 36px);
    justify-content: center;
    width: var(--onyx-control-md, 36px);
  }
</style>
