<script lang="ts" setup>
  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'

  defineProps<{
    id: string
    tag?: 'h2' | 'h3' | 'h4'
  }>()

  const { scrollToAnchor } = useApiHelpers()
</script>

<template>
  <component
    :is="tag ?? 'h3'"
    :id="id"
  >
    <a
      class="header-anchor"
      :href="`#${id}`"
      @click.prevent="scrollToAnchor(id)"
    ><slot /></a>
  </component>
</template>
