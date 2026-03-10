<script setup lang="ts">
  import { Splitter } from '@vuetify/v0'

  const {
    label,
    horizontal = true,
  } = defineProps<{
    label: string
    horizontal?: boolean
  }>()
</script>

<template>
  <Splitter.Handle
    :class="[
      'shrink-0 bg-divider flex items-center justify-center transition-colors',
      'hover:bg-primary data-[state=drag]:bg-primary',
      horizontal ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize',
    ]"
    :label
  >
    <div
      :class="[
        'rounded-full bg-on-surface-variant',
        horizontal ? 'w-0.5 h-8' : 'h-0.5 w-8',
      ]"
    />
  </Splitter.Handle>
</template>
