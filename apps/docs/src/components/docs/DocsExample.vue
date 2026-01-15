<script setup lang="ts">
  // Composables
  import { useHighlightCode } from '@/composables/useHighlightCode'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, ref, shallowRef, toRef, useId, watch } from 'vue'

  const props = defineProps<{
    file?: string
    title?: string
    code?: string
  }>()

  const uid = useId()
  const showCode = ref(false)
  const { highlightedCode, highlight, isLoading, showLoader } = useHighlightCode(toRef(() => props.code), { immediate: false })
  const { lineWrap: defaultLineWrap } = useSettings()

  // Local state initialized from global default, per-instance
  const lineWrap = shallowRef(defaultLineWrap.value)

  // Sync when global setting changes
  watch(defaultLineWrap, val => {
    lineWrap.value = val
  })

  const fileName = computed(() => props.file?.split('/').pop() || '')

  function toggleCode () {
    showCode.value = !showCode.value
    if (showCode.value && !highlightedCode.value && props.code) {
      highlight(props.code)
    }
  }
</script>

<template>
  <div class="border border-divider rounded-lg my-6 overflow-hidden">
    <div
      v-if="title"
      class="px-4 py-3 font-semibold border-b border-divider bg-surface-tint"
    >
      {{ title }}
    </div>

    <div class="p-6 bg-surface">
      <slot />
    </div>

    <div class="border-t border-divider bg-surface-tint">
      <button
        :aria-controls="code ? `${uid}-code` : undefined"
        :aria-expanded="showCode"
        class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface"
        type="button"
        @click="toggleCode"
      >
        <AppLoaderIcon v-if="showLoader" variant="orbit" />
        <AppIcon v-else-if="showCode && !isLoading" icon="chevron-up" :size="16" />
        <AppIcon v-else icon="code" :size="16" />
        <span v-if="fileName" class="ml-auto opacity-60 font-mono text-[0.8125rem]">{{ fileName }}</span>
      </button>
    </div>

    <div
      v-if="showCode && highlightedCode"
      :id="code ? `${uid}-code` : undefined"
      class="docs-example-code relative bg-pre group"
      :class="{ 'docs-example-code--wrap': lineWrap }"
    >
      <DocsCodeActions
        v-model:wrap="lineWrap"
        bin
        class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        :code="code!"
        language="vue"
        playground
        show-copy
        show-wrap
        :title="title || fileName"
      />
      <div
        class="[&_pre]:p-4 [&_pre]:pr-20 [&_pre]:leading-relaxed [&_pre]:overflow-x-auto"
        v-html="highlightedCode"
      />
    </div>
  </div>
</template>

<style scoped>
  ::v-deep(.shiki) {
    border: none;
    border-top: thin solid var(--v0-divider);
    border-radius: 0;
    margin-bottom: 0;
  }

  .docs-example-code--wrap ::v-deep(pre) {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
