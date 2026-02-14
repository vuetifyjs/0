<script setup lang="ts">
  // Framework
  import { useIntersectionObserver, useLogger, useTheme } from '@vuetify/v0'

  // Composables
  import { useCodeHighlighter } from '@/composables/useCodeHighlighter'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, onMounted, onScopeDispose, shallowRef, useTemplateRef, watch } from 'vue'

  const props = withDefaults(defineProps<{
    code: string
    language?: string
    fileName?: string
    title?: string
    peek?: boolean
    peekLines?: number
    showPlayground?: boolean
  }>(), {
    language: 'vue',
    peekLines: 6,
    showPlayground: true,
  })

  const expanded = defineModel<boolean>('expanded', { default: false })

  const theme = useTheme()
  const settings = useSettings()
  const lineWrap = shallowRef(settings.lineWrap.value)

  watch(() => settings.lineWrap.value, val => {
    lineWrap.value = val
  })

  // Highlighting
  const highlightedCode = shallowRef<string>()
  const isLoading = shallowRef(false)

  const logger = useLogger()
  const { highlight: highlightCode } = useCodeHighlighter()

  async function highlight () {
    if (highlightedCode.value || !props.code) return
    isLoading.value = true
    try {
      const result = await highlightCode({ code: props.code, language: props.language })
      highlightedCode.value = result.html
    } catch (error) {
      logger.error('Failed to highlight code', error)
    } finally {
      isLoading.value = false
    }
  }

  // Trigger highlight on mount and when visible (belt and suspenders for mobile Safari)
  const containerRef = useTemplateRef<HTMLElement>('container')
  onMounted(highlight)
  useIntersectionObserver(
    containerRef,
    entries => {
      if (entries[0]?.isIntersecting) highlight()
    },
    { once: true },
  )

  // Re-highlight when code changes
  watch(() => props.code, () => {
    highlightedCode.value = undefined
    highlight()
  })

  // Peek mode
  const lineCount = computed(() => props.code?.split('\n').length ?? 0)
  const shouldPeek = computed(() => props.peek && lineCount.value > props.peekLines)
  const peekHeight = computed(() => `${props.peekLines * 1.5 + 1}rem`)

  onScopeDispose(() => {
    highlightedCode.value = undefined
  }, true)

  defineExpose({ highlight, highlightedCode, isLoading })
</script>

<template>
  <div
    ref="container"
    class="docs-example-code relative bg-pre group"
    :class="{
      'docs-example-code--wrap': lineWrap,
      'docs-example-code--expanded': !shouldPeek || expanded,
    }"
  >
    <span
      v-if="fileName && (!shouldPeek || expanded)"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
    >
      {{ fileName }}
    </span>

    <div
      v-if="!shouldPeek || expanded"
      class="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity max-md:opacity-100"
    >
      <DocsCodeActions
        v-model:wrap="lineWrap"
        bin
        :code="code"
        :file-name="fileName"
        :language="language"
        :playground="showPlayground"
        show-copy
        show-wrap
        :title="title || fileName"
      />

      <button
        v-if="shouldPeek && expanded"
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
      :data-theme="theme.isDark.value ? 'dark' : 'light'"
      :style="shouldPeek && !expanded ? { maxHeight: peekHeight } : undefined"
    >
      <div v-if="highlightedCode" v-html="highlightedCode" />
      <pre v-else class="p-4 text-on-surface-variant opacity-50 whitespace-pre-wrap"><code>{{ code }}</code></pre>
    </div>

    <div
      v-if="shouldPeek && !expanded"
      class="docs-example-fade absolute left-0 right-0 bottom-0 h-12 rounded-b-lg pointer-events-none"
    />
  </div>
</template>

<style scoped>
  .docs-example-fade {
    background: var(--v0-pre);
    mask: linear-gradient(transparent, var(--v0-primary));
  }
</style>
