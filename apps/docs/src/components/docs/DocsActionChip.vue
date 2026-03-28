<script setup lang="ts">
  import { HxChip } from '@paper/helix'

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
    <HxChip :text>
      <template v-if="icon" #icon>
        <AppIcon :class="color" :icon size="1.2em" />
      </template>
    </HxChip>
  </a>

  <HxChip
    v-else
    :text
    :title
    @click="emit('click', $event)"
  >
    <template v-if="icon" #icon>
      <AppIcon :class="color" :icon size="1.2em" />
    </template>
  </HxChip>
</template>
