<script setup lang="ts">
  defineProps<{
    id: string
    tag?: 'h2' | 'h3' | 'h4'
  }>()
</script>

<template>
  <component
    :is="tag ?? 'h3'"
    :id
  >
    <a
      class="header-anchor"
      :href="`#${id}`"
    ><slot /></a>
  </component>
</template>
