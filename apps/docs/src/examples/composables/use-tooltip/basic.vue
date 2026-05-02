<script setup lang="ts">
  import { Tooltip, useTooltip } from '@vuetify/v0'

  const region = useTooltip()
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex gap-2 text-xs">
      <div
        class="px-2 py-1 rounded"
        :class="region.isAnyOpen.value
          ? 'bg-success text-on-success'
          : 'bg-surface-variant text-on-surface-variant'"
      >
        isAnyOpen: {{ region.isAnyOpen.value }}
      </div>

      <div class="px-2 py-1 rounded bg-surface-variant text-on-surface-variant">
        openDelay: {{ region.openDelay.value }}ms
      </div>

      <div class="px-2 py-1 rounded bg-surface-variant text-on-surface-variant">
        skipDelay: {{ region.skipDelay.value }}ms
      </div>
    </div>

    <div class="flex gap-3">
      <Tooltip.Root v-for="i in 4" :key="i">
        <Tooltip.Activator
          class="px-3 py-1 rounded border border-divider bg-surface text-on-surface hover:bg-surface-tint"
        >
          Item {{ i }}
        </Tooltip.Activator>

        <Tooltip.Content
          class="px-2 py-1 rounded text-xs bg-on-surface text-surface shadow-md"
        >
          Description for item {{ i }}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>

    <p class="text-xs text-on-surface-variant max-w-md text-center">
      Hover the first item — wait {{ region.openDelay.value }}ms for the tooltip.
      Move to a neighbor while one is still open — the next appears instantly.
      Leave all four. After {{ region.skipDelay.value }}ms of idle, the next hover
      pays the full open delay again.
    </p>
  </div>
</template>
