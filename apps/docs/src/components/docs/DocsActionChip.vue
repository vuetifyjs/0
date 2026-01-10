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
    :href="href"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :target="isExternal ? '_blank' : undefined"
    :title="title"
  >
    <AppChip :color="color" :icon="icon" :text="text" />
  </a>

  <AppChip
    v-else
    :color="color"
    :icon="icon"
    :text="text"
    :title="title"
    @click="emit('click', $event)"
  />
</template>
