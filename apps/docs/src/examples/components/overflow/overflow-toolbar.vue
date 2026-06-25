<script setup lang="ts">
  import OverflowToolbar from './OverflowToolbar.vue'
  import { useToolbarItems } from './useToolbarItems'

  const { actions, last, run } = useToolbarItems()
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col gap-3">
    <OverflowToolbar :actions :run />

    <p class="text-xs text-on-surface-variant">
      Trailing actions that do not fit collapse into the menu; the split recomputes as the container resizes.
    </p>

    <p class="rounded-lg bg-surface-variant px-3 py-2 text-sm text-on-surface">
      Last action:
      <span class="font-medium">{{ last?.label ?? 'none yet' }}</span>
    </p>
  </div>
</template>
