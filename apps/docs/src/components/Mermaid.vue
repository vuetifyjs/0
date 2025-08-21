<script setup lang="ts">
  // Plugins
  import mermaid from 'mermaid'

  // Utilities
  import { onMounted } from 'vue'

  mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    flowchart: {
      htmlLabels: false,
    },
  })

  const props = defineProps<{
    code: string
  }>()

  onMounted(() => {
    mermaid.contentLoaded()
  })
</script>

<template>
  <div
    class="mermaid flex justify-center w-full mb-4"
    v-html="props.code"
  />
</template>
