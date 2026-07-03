<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import VirtualDirectory from './VirtualDirectory.vue'
  import { useDirectory } from './useDirectory'

  const { rows, append } = useDirectory()
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <p class="text-sm text-on-surface-variant">
        A {{ rows.length.toLocaleString() }}-row employee directory — only the visible window is mounted to the DOM.
      </p>

      <Button.Root
        class="px-3 py-1 rounded border border-divider text-sm hover:bg-surface-tint"
        @click="append(1_000)"
      >
        Add 1,000 rows
      </Button.Root>
    </div>

    <VirtualDirectory :rows />
  </div>
</template>
