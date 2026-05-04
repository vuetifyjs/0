<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center p-12">
    <Tooltip.Root :close-delay="200" :open-delay="500">
      <Tooltip.Activator
        class="px-3 py-1 rounded border border-divider bg-surface text-on-surface hover:bg-surface-tint"
      >
        Hover me
      </Tooltip.Activator>

      <Tooltip.Content
        class="px-2 py-1 rounded text-xs bg-on-surface text-surface shadow-md"
      >
        Helpful description
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</template>
