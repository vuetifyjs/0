<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'
  import { tools } from './context'
</script>

<template>
  <div class="flex flex-wrap items-center gap-1 rounded-xl border border-divider bg-surface p-2">
    <Tooltip.Root v-for="tool in tools" :key="tool.id">
      <Tooltip.Activator
        :aria-label="tool.label"
        class="size-9 rounded-lg border border-transparent text-sm font-semibold text-on-surface transition-colors hover:bg-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        {{ tool.glyph }}
      </Tooltip.Activator>

      <Tooltip.Content
        class="max-w-48 rounded-md border border-transparent bg-on-surface px-2.5 py-1.5 text-xs text-surface shadow-lg data-[state=instant-open]:border-primary data-[state=instant-open]:bg-primary data-[state=instant-open]:text-on-primary"
      >
        <p class="font-semibold">{{ tool.label }}</p>
        <p class="opacity-80">{{ tool.hint }}</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</template>
