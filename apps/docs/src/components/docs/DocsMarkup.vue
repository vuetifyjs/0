<script lang="ts" setup>
  // Composables
  import { useBin } from '@/composables/bin'
  import { useClipboard } from '@/composables/useClipboard'
  import { usePlayground } from '@/composables/playground'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    playground?: boolean
  }>()

  const decodedCode = computed(() => {
    try {
      return atob(props.code)
    } catch (error) {
      console.error('Failed to decode base64 code:', error)
      return props.code
    }
  })

  const { copied, copy } = useClipboard()

  function copyCode () {
    copy(decodedCode.value)
  }

  function openInBin () {
    const url = useBin(decodedCode.value, props.language || 'markdown', props.title)
    window.open(url, '_blank')
  }

  function openInPlayground () {
    const url = usePlayground(decodedCode.value)
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="docs-markup relative my-4 group">
    <span
      v-if="language && language !== 'text'"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 rounded text-xs font-mono uppercase opacity-50 bg-surface-tint"
    >
      {{ language }}
    </span>
    <div class="absolute top-3 right-3 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        v-if="playground"
        aria-label="Open in Vuetify Play"
        class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
        title="Open in Vuetify Play"
        type="button"
        @click="openInPlayground"
      >
        <AppIcon icon="vuetify-play" />
      </button>
      <button
        aria-label="Open in Vuetify Bin"
        class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
        title="Open in Vuetify Bin"
        type="button"
        @click="openInBin"
      >
        <AppIcon icon="vuetify-bin" />
      </button>
      <button
        :aria-label="!copied ? 'Copy code' : 'Copied'"
        class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
        :title="!copied ? 'Copy code' : 'Copied'"
        type="button"
        @click="copyCode"
      >
        <AppIcon :icon="!copied ? 'copy' : 'success'" />
      </button>
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .docs-markup :deep(pre) {
    padding-top: 2.5rem;
    padding-right: 5rem;
  }
</style>
