<script setup lang="ts">
  import { ScrollArea } from '@vuetify/v0'

  const tags = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`)
</script>

<template>
  <ScrollArea.Root class="h-64 w-56 border border-divider rounded-lg bg-surface">
    <ScrollArea.Viewport class="size-full">
      <div class="p-4">
        <h4 class="mb-3 text-sm font-medium text-on-surface">Tags</h4>

        <div
          v-for="tag in tags"
          :key="tag"
          class="py-1.5 text-sm text-on-surface-variant border-b border-divider last:border-b-0"
        >
          {{ tag }}
        </div>
      </div>
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar
      class="w-2.5 p-0.5 transition-opacity duration-200 data-[state=hidden]:opacity-0"
      orientation="vertical"
    >
      <ScrollArea.Thumb class="rounded-full bg-on-surface/30 hover:bg-on-surface/50" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>
