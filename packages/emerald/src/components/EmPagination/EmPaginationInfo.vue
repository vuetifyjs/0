<script lang="ts">
  // Framework
  import { usePaginationRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface EmPaginationInfoProps {
    namespace?: string
  }

  export interface EmPaginationInfoSlotProps {
    /** First visible item on the current page (1-indexed) */
    start: number
    /** Last visible item on the current page */
    stop: number
    /** Total number of items */
    size: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationInfo' })

  defineSlots<{
    default: (props: EmPaginationInfoSlotProps) => any
  }>()

  const { namespace = 'v0:pagination' } = defineProps<EmPaginationInfoProps>()

  const pagination = usePaginationRoot(namespace)

  const start = toRef(() => Math.min(pagination.pageStart.value + 1, pagination.size))
  const stop = toRef(() => pagination.pageStop.value)
  const size = toRef(() => pagination.size)
</script>

<template>
  <span class="emerald-pagination__info">
    <slot
      :size
      :start
      :stop
    >
      Showing <span class="emerald-pagination__count">{{ start }}-{{ stop }}</span> of <span class="emerald-pagination__count">{{ size }}</span>
    </slot>
  </span>
</template>

<style>
.emerald-pagination__info {
  font: inherit;
  color: var(--emerald-on-background);
  white-space: nowrap;
}

.emerald-pagination__count {
  color: var(--emerald-neutral-700);
}
</style>
