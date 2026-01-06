<script setup lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center">
    <Popover.Root>
      <Popover.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Open Popover
      </Popover.Activator>

      <Popover.Content class="p-4 rounded-lg bg-surface border border-divider shadow-lg max-w-xs">
        <p class="text-sm text-on-surface">
          This is a popover using CSS anchor positioning.
        </p>
      </Popover.Content>
    </Popover.Root>
  </div>
</template>
