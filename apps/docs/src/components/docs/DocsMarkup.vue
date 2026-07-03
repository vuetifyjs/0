<script setup lang="ts">
  // Components
  import { GnPeek } from '@paper/genesis'

  // Composables
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { ref, toRef } from 'vue'

  const {
    code,
    language,
    title,
    binTitle,
    playground,
    collapse,
    collapseLines = 15,
    hideFilename,
  } = defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    binTitle?: string
    playground?: boolean
    collapse?: boolean
    collapseLines?: number
    hideFilename?: boolean
  }>()

  const settings = useSettings()
  const lineWrap = useSyncedRef(settings.lineWrap)
  const size = settings.codeSize

  const decodedCode = toRef(() => decodeBase64(code))

  // Collapse state
  const expanded = ref(false)
  const lineCount = toRef(() => decodedCode.value.split('\n').length)
  const shouldCollapse = toRef(() => collapse && lineCount.value > collapseLines)
  const collapsedHeight = toRef(() => `${collapseLines * 1.5 + 2.5}rem`)
</script>

<template>
  <div class="relative my-4" :class="shouldCollapse && 'mb-8'">
    <div
      class="docs-markup relative group"
      :class="[
        { 'docs-markup--wrap': lineWrap },
        shouldCollapse && !expanded && 'overflow-hidden rounded-b-2 border-b border-divider'
      ]"
    >
      <span
        v-if="title || language"
        class="absolute top-3 start-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
        :class="{ 'uppercase': !title || hideFilename }"
      >
        {{ hideFilename ? language : title ?? language }}
      </span>

      <div class="absolute top-3 end-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity max-md:opacity-100">
        <DocsCodeActions
          v-model:size="size"
          v-model:wrap="lineWrap"
          bin
          :bin-title
          :code="decodedCode"
          :language
          :playground
          show-copy
          show-size
          show-wrap
          :title
        />
      </div>

      <div
        class="transition-[max-height] duration-300 ease-out"
        :style="shouldCollapse && !expanded ? { maxHeight: collapsedHeight } : undefined"
      >
        <slot />
      </div>

      <div v-if="shouldCollapse && !expanded" class="docs-markup-fade absolute inset-x-0 bottom-0 h-16 rounded-b-2 pointer-events-none" />
    </div>

    <GnPeek
      v-if="shouldCollapse"
      v-slot="{ expanded: open }"
      v-model:expanded="expanded"
      collapsed-label="Expand code"
      expanded-label="Collapse code"
    >
      {{ open ? 'Collapse' : 'Expand' }}
    </GnPeek>
  </div>
</template>

<style>
  .docs-markup-fade {
    background: var(--v0-pre);
    mask: linear-gradient(transparent, var(--v0-primary));
  }
</style>
