<script setup lang="ts">
  import { onMounted } from 'vue'
  import mermaid from 'mermaid'

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
  <div class="mermaid-container">
    <div ref="container" class="mermaid" v-html="props.code" />
  </div>
</template>

<style scoped>
.mermaid-container{
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
