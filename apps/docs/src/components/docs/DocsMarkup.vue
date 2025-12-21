<script lang="ts" setup>
  // Utilities
  import { computed } from 'vue'
  import { decodeBase64 } from '@/utilities/decodeBase64'

  const props = defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    playground?: boolean
  }>()

  const decodedCode = computed(() => decodeBase64(props.code))
</script>

<template>
  <div class="docs-markup relative my-4 group">
    <span
      v-if="language && language !== 'text'"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 rounded text-xs font-mono uppercase opacity-50 bg-surface-tint"
    >
      {{ language }}
    </span>

    <DocsCodeActions
      bin
      class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      :code="decodedCode"
      :language
      :playground
      show-copy
      :title
    />

    <slot />
  </div>
</template>

<style scoped>
  .docs-markup :deep(pre) {
    padding-top: 2.5rem;
    padding-right: 5rem;
  }
</style>
