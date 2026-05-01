<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center p-12">
    <Tooltip.Root :close-delay="300" interactive :open-delay="500">
      <Tooltip.Activator
        class="px-3 py-1 rounded border border-divider bg-surface text-on-surface hover:bg-surface-tint"
      >
        Hover for actions
      </Tooltip.Activator>

      <Tooltip.Content
        class="flex gap-2 px-3 py-2 rounded bg-on-surface text-surface text-xs shadow-md"
      >
        <button class="underline" @click="$event.target.dispatchEvent(new Event('click'))">Edit</button>
        <button class="underline">Delete</button>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</template>
