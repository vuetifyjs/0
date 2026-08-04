<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  // Utilities
  import { toRef, watch } from 'vue'

  export interface BuPaginationProps {
    /** Total page count (maps to v0 size with one item per page) */
    pages?: number
    /** `.pagination-previous` label */
    previous?: string
    /** `.pagination-next` label */
    next?: string
    /** Number of visible page buttons; omit for v0's responsive auto-measure */
    visible?: number
    /** Ellipsis character rendered between page ranges */
    ellipsis?: string
    /** Bulma size modifier */
    size?: 'small' | 'normal' | 'medium' | 'large'
    /** Rounded page buttons */
    rounded?: boolean
    /** Center the page list */
    centered?: boolean
    /** Right-align the page list */
    right?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPagination' })

  defineEmits<{
    /** Emitted when the current page changes */
    'update:model-value': [value: number]
  }>()

  const {
    pages = 1,
    previous = 'Previous',
    next = 'Next page',
    visible,
    ellipsis = '…',
    size,
    rounded,
    centered,
    right,
  } = defineProps<BuPaginationProps>()

  const page = defineModel<number>({ default: 1 })

  // v0's createPagination clamps only in its computed getter and writes raw
  // values through, so an out-of-range v-model (page > pages, or pages
  // shrinking below the current page) silently desyncs from the rendered
  // state. Write the clamp back so the parent's model matches what renders.
  watch([() => pages, page], () => {
    const max = Math.max(1, pages)
    if (page.value > max) page.value = max
    else if (page.value < 1) page.value = 1
  }, { immediate: true })

  const classes = toRef(() => [
    size && `is-${size}`,
    rounded && 'is-rounded',
    centered && 'is-centered',
    right && 'is-right',
  ])
</script>

<template>
  <Pagination.Root
    v-model="page"
    class="pagination"
    :class="classes"
    :ellipsis
    :items-per-page="1"
    role="navigation"
    :size="pages"
    :total-visible="visible"
  >
    <template #default="{ items, isFirst, isLast, page: current }">
      <Pagination.Prev
        as="a"
        class="pagination-previous"
        :class="{ 'is-disabled': isFirst }"
      >
        {{ previous }}
      </Pagination.Prev>

      <Pagination.Next
        as="a"
        class="pagination-next"
        :class="{ 'is-disabled': isLast }"
      >
        {{ next }}
      </Pagination.Next>

      <ul class="pagination-list">
        <template v-for="(item, index) in items" :key="index">
          <li v-if="item.type === 'page'">
            <Pagination.Item
              as="a"
              class="pagination-link"
              :class="{ 'is-current': item.value === current }"
              :value="item.value"
            />
          </li>

          <li v-else>
            <Pagination.Ellipsis as="span" class="pagination-ellipsis" />
          </li>
        </template>
      </ul>
    </template>
  </Pagination.Root>
</template>
