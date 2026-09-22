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
  <AppTooltip
    v-if="href"
    as="a"
    :href
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :target="isExternal ? '_blank' : undefined"
    :text="title"
  >
    <AppChip :color :icon :text />
  </AppTooltip>

  <AppChip
    v-else
    :color
    :icon
    :text
    @click="emit('click', $event)"
  />
</template>
