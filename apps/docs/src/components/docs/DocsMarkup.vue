<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed, ref, shallowRef, watch } from 'vue'

  const props = withDefaults(defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    playground?: boolean
    collapse?: boolean
    collapseLines?: number
  }>(), {
    collapseLines: 15,
  })

  const { lineWrap: defaultLineWrap } = useSettings()

  // Local state initialized from global default, per-instance
  const lineWrap = shallowRef(defaultLineWrap.value)

  // Sync when global setting changes
  watch(defaultLineWrap, val => {
    lineWrap.value = val
  })

  const decodedCode = computed(() => decodeBase64(props.code))

  // Collapse state
  const expanded = ref(false)
  const lineCount = computed(() => decodedCode.value.split('\n').length)
  const shouldCollapse = computed(() => props.collapse && lineCount.value > props.collapseLines)
  const collapsedHeight = computed(() => `${props.collapseLines * 1.5 + 2.5}rem`)
</script>

<template>
  <div
    class="docs-markup relative my-4 group"
    :class="{
      'docs-markup--wrap': lineWrap,
      'mb-8': shouldCollapse
    }"
  >
    <span
      v-if="title || (language && language !== 'text')"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
      :class="{ 'uppercase': !title }"
    >
      {{ title || language }}
    </span>

    <div class="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
      <DocsCodeActions
        v-model:wrap="lineWrap"
        bin
        :code="decodedCode"
        :language
        :playground
        show-copy
        show-wrap
        :title
      />

      <button
        v-if="shouldCollapse && expanded"
        aria-label="Collapse code"
        class="inline-flex items-center justify-center size-7 text-on-primary bg-primary rounded cursor-pointer transition-200 hover:bg-primary/85"
        title="Collapse code"
        type="button"
        @click="expanded = false"
      >
        <AppIcon icon="fullscreen-exit" :size="16" />
      </button>
    </div>

    <div
      class="overflow-hidden transition-[max-height] duration-300 ease-out"
      :class="shouldCollapse && !expanded && 'rounded-b-2 border-b border-divider'"
      :style="shouldCollapse && !expanded ? { maxHeight: collapsedHeight } : undefined"
    >
      <slot />
    </div>

    <div v-if="shouldCollapse && !expanded" class="docs-markup-fade absolute left-px right-px bottom-px h-16 rounded-b-2 pointer-events-none" />

    <button
      v-if="shouldCollapse && !expanded"
      aria-label="Expand code"
      class="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-on-primary bg-primary rounded cursor-pointer transition-200 hover:bg-primary/85 touch-action-manipulation"
      type="button"
      @click="expanded = true"
    >
      <span>Expand</span>
      <AppIcon icon="down" :size="14" />
    </button>
  </div>
</template>

<style>
  .docs-markup-fade {
    background: var(--v0-pre);
    mask: linear-gradient(transparent, var(--v0-primary));
  }
</style>
