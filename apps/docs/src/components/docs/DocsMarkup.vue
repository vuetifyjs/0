<script lang="ts" setup>
  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed } from 'vue'

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
      v-if="title || (language && language !== 'text')"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
      :class="{ 'uppercase': !title }"
    >
      {{ title || language }}
    </span>

    <DocsCodeActions
      bin
      class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
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
