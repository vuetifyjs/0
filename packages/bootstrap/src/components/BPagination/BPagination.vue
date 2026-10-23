<script lang="ts">
  // Framework
  import { PaginationRoot, useLocale } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export interface BPaginationProps {
    /** `pagination-sm` or `pagination-lg`. Omit for the default size. */
    size?: 'sm' | 'lg'
    /**
     * Total item count, passed to v0 Pagination as `size`.
     * With `perPage` at 1 this is the page count.
     */
    total?: number
    /** Items per page. Defaults to 1 so `total` is the page count. */
    perPage?: number
    /** `aria-label` on the nav. Falls back to `Pagination.label`, then `Page navigation`. */
    label?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BPagination', inheritAttrs: false })

  defineSlots<{
    default?: () => any
  }>()

  const {
    size,
    total = 1,
    perPage = 1,
    label,
    namespace = 'v0:pagination',
  } = defineProps<BPaginationProps>()

  const page = defineModel<number>({ default: 1 })

  defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const attrs = useAttrs()
  const locale = useLocale()
  const name = toRef(() => label ?? locale.ti('Pagination.label') ?? 'Page navigation')
</script>

<template>
  <PaginationRoot
    v-model="page"
    :items-per-page="perPage"
    :namespace
    renderless
    :size="total"
  >
    <nav :aria-label="name">
      <ul
        v-bind="attrs"
        class="pagination"
        :class="{
          'pagination-sm': size === 'sm',
          'pagination-lg': size === 'lg',
        }"
      >
        <slot />
      </ul>
    </nav>
  </PaginationRoot>
</template>
