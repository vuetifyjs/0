<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    color?: string
    href?: string
    icon?: string
    text?: string
    title?: string
  }>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const isExternal = toRef(() => props.href?.startsWith('http'))
</script>

<template>
  <a
    v-if="href"
    :href
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :target="isExternal ? '_blank' : undefined"
    :title
  >
    <AppChip :color :icon :text />
  </a>

  <AppChip
    v-else
    :color
    :icon
    :text
    :title
    @click="emit('click', $event)"
  />
</template>
