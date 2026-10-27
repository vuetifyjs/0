<script setup vapor lang="ts">
  // Mounts `is` with a template ref and reports what toElement resolves it to.

  // Framework
  import { toElement } from '@vuetify/v0'

  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  // Types
  import type { Component } from 'vue'

  const { is, onResolve } = defineProps<{
    is: Component
    onResolve: (el: Element | undefined, raw: unknown) => void
  }>()

  const target = useTemplateRef('target')

  onMounted(() => {
    onResolve(toElement(target.value as never), target.value)
  })
</script>

<template>
  <component :is ref="target" />
</template>
