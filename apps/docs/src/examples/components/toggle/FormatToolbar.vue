<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import type { AlignTool, FormatTool } from './useEditorFormat'

  const { formatTools, alignTools } = defineProps<{
    formatTools: FormatTool[]
    alignTools: AlignTool[]
  }>()

  const marks = defineModel<string[]>('marks', { default: () => [] })
  const align = defineModel<string>('align', { default: 'left' })
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 px-2 py-1.5 rounded-lg border border-divider bg-surface-variant/30">
    <Toggle.Group v-model="marks" class="inline-flex gap-1" multiple>
      <Toggle.Root
        v-for="tool in formatTools"
        :key="tool.value"
        :aria-label="tool.tip"
        class="size-8 flex items-center justify-center text-sm text-on-surface-variant rounded transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        :class="tool.class"
        :value="tool.value"
      >
        {{ tool.label }}
      </Toggle.Root>
    </Toggle.Group>

    <span class="h-6 w-px bg-divider" />

    <Toggle.Group v-model="align" class="inline-flex rounded-lg border border-divider overflow-hidden" mandatory>
      <Toggle.Root
        v-for="tool in alignTools"
        :key="tool.value"
        class="px-3 py-1 text-sm text-on-surface-variant transition-colors border-l border-divider first:border-l-0 data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        :value="tool.value"
      >
        {{ tool.label }}
      </Toggle.Root>
    </Toggle.Group>
  </div>
</template>
