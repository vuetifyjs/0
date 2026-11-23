<script setup lang="ts">
  import { ScrollArea } from '@vuetify/v0'

  const { orientation = 'vertical' } = defineProps<{
    orientation?: 'vertical' | 'horizontal'
  }>()
</script>

<template>
  <ScrollArea.Scrollbar
    :class="[
      'p-0.5 bg-surface-variant/40 transition-opacity duration-300',
      'data-[state=hidden]:opacity-0',
      orientation === 'vertical' ? 'w-2.5' : 'h-2.5',
    ]"
    :orientation
  >
    <ScrollArea.Thumb
      class="rounded-full bg-on-surface/30 transition-colors hover:bg-on-surface/50 data-[dragging]:bg-primary"
    />
  </ScrollArea.Scrollbar>
</template>
