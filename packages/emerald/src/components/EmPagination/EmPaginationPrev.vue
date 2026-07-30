<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  export interface EmPaginationPrevProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationPrev' })

  const { namespace } = defineProps<EmPaginationPrevProps>()
</script>

<template>
  <Pagination.Prev class="emerald-pagination__prev" :namespace>
    <slot />
  </Pagination.Prev>
</template>

<style>
  .emerald-pagination__prev {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 32px;
    height: 28px;
    padding: 0 var(--emerald-spacing-xs, 8px);
    background: transparent;
    border: var(--emerald-stroke-s, 1px) solid transparent;
    border-radius: var(--emerald-radius-xs, 4px);
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: background-color var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-pagination__prev:hover:not([data-disabled]) {
    background: var(--emerald-neutral-200, #ebf0f4);
  }

  .emerald-pagination__prev[data-disabled] {
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }

  .emerald-pagination__prev:focus-visible {
    outline: none;
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }
</style>
