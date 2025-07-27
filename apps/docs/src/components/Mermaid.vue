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
  <div class="flex justify-center w-full">
    <div class="mermaid" v-html="props.code" />
  </div>
</template>
