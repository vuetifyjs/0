<script lang="ts">
  // Framework
  import { PaginationPrev } from '@vuetify/v0'

  export interface BPaginationPrevProps {
    disabled?: boolean
    href?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BPaginationPrev' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    disabled = false,
    href = '#',
    namespace = 'v0:pagination',
  } = defineProps<BPaginationPrevProps>()
</script>

<template>
  <PaginationPrev
    v-slot="{ isDisabled, prev }"
    :disabled
    :namespace
    renderless
  >
    <li class="page-item" :class="{ disabled: isDisabled }">
      <a
        :aria-disabled="isDisabled ? true : undefined"
        class="page-link"
        :href="isDisabled ? undefined : href"
        :tabindex="isDisabled ? -1 : undefined"
        @click.prevent="prev"
      >
        <slot>Previous</slot>
      </a>
    </li>
  </PaginationPrev>
</template>
