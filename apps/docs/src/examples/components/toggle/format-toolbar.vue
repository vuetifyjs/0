<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import FormatToolbar from './FormatToolbar.vue'
  import { useEditorFormat } from './useEditorFormat'

  const { formatTools, alignTools, marks, align, previewClass, summary, reset } = useEditorFormat()
</script>

<template>
  <div class="max-w-xl mx-auto flex flex-col gap-4">
    <FormatToolbar
      v-model:align="align"
      v-model:marks="marks"
      :align-tools
      :format-tools
    />

    <p
      class="px-4 py-3 rounded-lg border border-divider bg-surface text-on-surface text-sm leading-relaxed"
      :class="previewClass"
    >
      The quick brown fox jumps over the lazy dog. Toggle the marks above to restyle this preview in real time.
    </p>

    <div class="flex items-center justify-between text-sm">
      <span class="text-on-surface-variant">
        Marks: {{ summary }} · Aligned {{ align }}
      </span>

      <Button.Root
        class="px-3 py-1 rounded-lg border border-divider text-on-surface"
        @click="reset"
      >
        Clear formatting
      </Button.Root>
    </div>
  </div>
</template>
