<script setup lang="ts">
  // Composables
  import { useHighlightCode } from '@/composables/useHighlightCode'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, ref, shallowRef, toRef, useId, watch } from 'vue'

  const props = withDefaults(defineProps<{
    file?: string
    title?: string
    code?: string
    peek?: boolean
    peekLines?: number
  }>(), {
    peekLines: 6,
  })

  const uid = useId()
  const showCode = ref(false)
  const expanded = ref(false)
  const { highlightedCode, highlight, isLoading, showLoader } = useHighlightCode(toRef(() => props.code), { immediate: props.peek })
  const { lineWrap: defaultLineWrap } = useSettings()

  // Local state initialized from global default, per-instance
  const lineWrap = shallowRef(defaultLineWrap.value)

  // Sync when global setting changes
  watch(defaultLineWrap, val => {
    lineWrap.value = val
  })

  const fileName = computed(() => props.file?.split('/').pop() || '')

  // Peek mode: show partial code by default
  const lineCount = computed(() => props.code?.split('\n').length ?? 0)
  const shouldPeek = computed(() => props.peek && lineCount.value > props.peekLines)
  const peekHeight = computed(() => `${props.peekLines * 1.5 + 1}rem`)

  function toggleCode () {
    showCode.value = !showCode.value
    if (showCode.value && !highlightedCode.value && props.code) {
      highlight(props.code)
    }
  }
</script>

<template>
  <div class="relative my-6" :class="shouldPeek && !expanded && 'mb-10'">
    <div class="border border-divider rounded-lg overflow-hidden">
      <div
        v-if="title"
        class="px-4 py-3 font-semibold border-b border-divider bg-surface-tint"
      >
        {{ title }}
      </div>

      <div class="p-6 bg-surface">
        <slot />
      </div>

      <div v-if="!peek" class="border-t border-divider bg-surface-tint">
        <button
          :aria-controls="code ? `${uid}-code` : undefined"
          :aria-expanded="showCode"
          class="group w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface"
          type="button"
          @click="toggleCode"
        >
          <AppLoaderIcon v-if="showLoader" variant="orbit" />
          <AppIcon v-else-if="showCode && !isLoading" icon="chevron-up" :size="16" />
          <AppIcon v-else class="transition-colors group-hover:text-primary" icon="code" :size="16" />
          <span v-if="fileName" class="ml-auto opacity-60 font-mono text-[0.8125rem]">{{ fileName }}</span>
        </button>
      </div>

      <div
        v-if="(showCode || peek) && highlightedCode"
        :id="code ? `${uid}-code` : undefined"
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
            :code="code!"
            language="vue"
            playground
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
          :style="shouldPeek && !expanded ? { maxHeight: peekHeight } : undefined"
        >
          <div v-html="highlightedCode" />
        </div>

        <div v-if="shouldPeek && !expanded" class="docs-example-fade absolute left-0 right-0 bottom-0 h-12 rounded-b-lg pointer-events-none" />
      </div>
    </div>

    <button
      v-if="shouldPeek && !expanded"
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

<style scoped>
  .docs-example-fade {
    background: var(--v0-pre);
    mask: linear-gradient(transparent, var(--v0-primary));
  }
</style>
