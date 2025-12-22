<script lang="ts" setup>
  // Utilities
  import { computed, ref, toRef } from 'vue'
  import { useBin } from '@/composables/bin'
  import { usePlayground } from '@/composables/playground'
  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  import { useHighlightCode } from '@/composables/useHighlightCode'

  const props = defineProps<{
    file?: string
    title?: string
    code?: string
  }>()

  const showCode = ref(false)
  const { copied, copy } = useClipboard()
  const { highlightedCode } = useHighlightCode(toRef(() => props.code))

  const fileName = computed(() => props.file?.split('/').pop() || '')

  function copyCode () {
    if (props.code) copy(props.code)
  }
</script>

<template>
  <div class="border border-divider rounded-lg my-6 overflow-hidden">
    <div
      v-if="title || code"
      class="px-4 py-3 font-semibold border-b border-divider bg-surface-tint flex items-center justify-between"
    >
      <span>{{ title }}</span>
      <a
        v-if="code"
        class="pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        :href="usePlayground(code)"
        rel="noopener"
        target="_blank"
        title="Open in Vuetify Play"
      >
        <AppIcon icon="vuetify-play" />
      </a>
    </div>

    <div class="p-6 bg-surface">
      <slot />
    </div>

    <div class="border-t border-divider bg-surface-tint">
      <button
        class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface"
        @click="showCode = !showCode"
      >
        <span v-if="showCode">Hide code</span>
        <span v-else>Show code</span>
        <span v-if="fileName" class="ml-auto opacity-60 font-mono text-[0.8125rem]">{{ fileName }}</span>
      </button>
    </div>

    <div
      v-if="showCode && highlightedCode"
      class="relative bg-pre"
    >
      <div class="absolute top-3 right-3 flex gap-1">
        <a
          class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
          :href="useBin(code!, 'vue', title || fileName)"
          rel="noopener"
          target="_blank"
          title="Open in Vuetify Bin"
        >
          <AppIcon icon="vuetify-bin" />
        </a>
        <AppIconButton
          :icon="!copied ? 'copy' : 'success'"
          title="Copy code"
          @click="copyCode"
        />
      </div>
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
</style>
