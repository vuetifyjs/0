<script setup lang="ts">
  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { computed, ref } from 'vue'

  const props = defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    playground?: boolean
  }>()

  const decodedCode = computed(() => decodeBase64(props.code))
  const wrap = ref(false)
</script>

<template>
  <div class="docs-markup relative my-4 group" :class="{ 'docs-markup--wrap': wrap }">
    <span
      v-if="title || (language && language !== 'text')"
      class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
      :class="{ 'uppercase': !title }"
    >
      {{ title || language }}
    </span>

    <DocsCodeActions
      v-model:wrap="wrap"
      bin
      class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
      :code="decodedCode"
      :language
      :playground
      show-copy
      show-wrap
      :title
    />

    <slot />
  </div>
</template>
