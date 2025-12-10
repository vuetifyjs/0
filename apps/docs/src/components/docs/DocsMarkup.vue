<script lang="ts" setup>
  // Composables
  import { useBin } from '@/composables/bin'

  // Utilities
  import { ref, computed } from 'vue'

  const props = defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
  }>()

  const decodedCode = computed(() => {
    try {
      return atob(props.code)
    } catch {
      return props.code
    }
  })

  const copied = ref(false)

  async function copyCode () {
    try {
      await navigator.clipboard.writeText(decodedCode.value)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  function openInBin () {
    const url = useBin(decodedCode.value, props.language || 'markdown', props.title)
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="docs-markup relative my-4 group">
    <div class="absolute top-3 right-3 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
        title="Open in Vuetify Bin"
        @click="openInBin"
      >
        <AppIcon icon="vuetify-bin" />
      </button>
      <button
        class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
        title="Copy code"
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
    padding-right: 5rem;
  }
</style>
