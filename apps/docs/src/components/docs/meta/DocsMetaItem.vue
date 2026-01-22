<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    color?: string
    href?: string
    icon: string
    text: string
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
    class="docs-meta-item inline-flex items-center gap-1 hover:text-on-surface transition-colors"
    :href="href"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :target="isExternal ? '_blank' : undefined"
    :title="title"
    @click="emit('click', $event)"
  >
    <AppIcon :class="color" :icon="icon" size="1em" />
    <span>{{ text }}</span>
  </a>

  <span
    v-else
    class="docs-meta-item inline-flex items-center gap-1"
    :title="title"
  >
    <AppIcon :class="color" :icon="icon" size="1em" />
    <span>{{ text }}</span>
  </span>
</template>

<style scoped>
  @media (min-width: 640px) {
    .docs-meta-item + .docs-meta-item::before {
      content: '·';
      margin-inline: 0.5rem;
      opacity: 0.4;
    }
  }
</style>
