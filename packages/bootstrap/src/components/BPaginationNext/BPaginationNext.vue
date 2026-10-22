<script lang="ts">
  // Framework
  import { PaginationNext } from '@vuetify/v0'

  export interface BPaginationNextProps {
    disabled?: boolean
    href?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BPaginationNext' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    disabled = false,
    href = '#',
    namespace = 'v0:pagination',
  } = defineProps<BPaginationNextProps>()
</script>

<template>
  <PaginationNext
    v-slot="{ isDisabled, next }"
    :disabled
    :namespace
    renderless
  >
    <li class="page-item" :class="{ disabled: isDisabled }">
      <a
        class="page-link"
        :href="isDisabled ? undefined : href"
        @click.prevent="next"
      >
        <slot>Next</slot>
      </a>
    </li>
  </PaginationNext>
</template>
