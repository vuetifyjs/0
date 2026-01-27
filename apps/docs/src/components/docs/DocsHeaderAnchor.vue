<script setup lang="ts">
  // Utilities
  import { useScrollToAnchor } from '@/utilities/scroll'

  defineProps<{
    id: string
    tag?: 'h2' | 'h3' | 'h4'
  }>()

  const scroll = useScrollToAnchor()
</script>

<template>
  <component
    :is="tag ?? 'h3'"
    :id="id"
  >
    <a
      class="header-anchor"
      :href="`#${id}`"
      @click.prevent="scroll.scrollToAnchor(id)"
    ><slot /></a>
  </component>
</template>
