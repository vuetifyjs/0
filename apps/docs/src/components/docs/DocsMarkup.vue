<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed, ref, shallowRef } from 'vue'

  const props = withDefaults(defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    playground?: boolean
    collapse?: boolean
    collapseLines?: number
  }>(), {
    collapseLines: 10,
  })

  const { lineWrap: defaultLineWrap } = useSettings()

  // Local state initialized from global default, per-instance
  const lineWrap = shallowRef(defaultLineWrap.value)
  const decodedCode = computed(() => decodeBase64(props.code))

  // Collapse state
  const expanded = ref(false)
  const lineCount = computed(() => decodedCode.value.split('\n').length)
  const shouldCollapse = computed(() => props.collapse && lineCount.value > props.collapseLines)
  const collapsedHeight = computed(() => `${props.collapseLines * 1.5 + 2.5}rem`)
</script>

<template>
  <div class="docs-markup relative my-4 group" :class="{ 'docs-markup--wrap': lineWrap }">
    <span
      v-if="title || (language && language !== 'text')"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
      :class="{ 'uppercase': !title }"
    >
      {{ title || language }}
    </span>

    <DocsCodeActions
      v-model:wrap="lineWrap"
      bin
      class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
      :code="decodedCode"
      :language
      :playground
      show-copy
      show-wrap
      :title
    />

    <div
      class="docs-markup-content"
      :class="{ 'docs-markup-content--collapsed': shouldCollapse && !expanded }"
      :style="shouldCollapse && !expanded ? { maxHeight: collapsedHeight } : undefined"
    >
      <slot />
    </div>

    <button
      v-if="shouldCollapse"
      :aria-expanded="expanded"
      class="docs-markup-expand"
      :class="{ 'docs-markup-expand--collapsed': !expanded }"
      type="button"
      @click="expanded = !expanded"
    >
      <span class="i-lucide-chevron-down" :class="{ 'rotate-180': expanded }" />
    </button>
  </div>
</template>

<style>
  .docs-markup-content {
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .docs-markup-content--collapsed {
    overflow: hidden;
  }

  .docs-markup-expand {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    font-size: 1rem;
    color: var(--v0-on-surface-variant);
    background: var(--v0-surface-variant);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, bottom 0.2s, right 0.2s;
    z-index: 10;
  }

  .docs-markup-expand--collapsed {
    bottom: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .docs-markup-expand:not(.docs-markup-expand--collapsed) {
    bottom: 0.5rem;
    right: 0.5rem;
  }

  .docs-markup-expand:hover {
    background: var(--v0-surface-tint);
    color: var(--v0-on-surface);
  }

  .docs-markup-expand span {
    transition: transform 0.3s ease;
  }
</style>
