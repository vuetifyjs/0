<script setup vapor lang="ts">
  import { toElement } from '#v0/composables'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  // Types
  import type { Component } from 'vue'

  const { is, onResolve } = defineProps<{
    is: Component
    onResolve: (el: Element | undefined) => void
  }>()

  const child = useTemplateRef('child')

  onMounted(() => onResolve(toElement(child)))
</script>

<template>
  <div>
    <component :is ref="child" />
  </div>
</template>
