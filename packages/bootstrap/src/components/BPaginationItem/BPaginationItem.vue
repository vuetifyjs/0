<script lang="ts">
  // Framework
  import { PaginationItem } from '@vuetify/v0'

  export interface BPaginationItemProps {
    /** Page number. v0 Pagination is 1-based. */
    value: number
    disabled?: boolean
    href?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BPaginationItem' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    value,
    disabled = false,
    href = '#',
    namespace = 'v0:pagination',
  } = defineProps<BPaginationItemProps>()
</script>

<template>
  <PaginationItem
    v-slot="{ isSelected, isDisabled, select }"
    :disabled
    :namespace
    renderless
    :value
  >
    <li
      class="page-item"
      :class="{ active: isSelected, disabled: isDisabled }"
    >
      <a
        :aria-current="isSelected ? 'page' : undefined"
        class="page-link"
        :href="isDisabled ? undefined : href"
        @click.prevent="select"
      >
        <slot />
      </a>
    </li>
  </PaginationItem>
</template>
