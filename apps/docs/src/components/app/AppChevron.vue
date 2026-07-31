<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { toRef } from 'vue'

  export interface AppChevronProps {
    /** Rotated (expanded) state */
    open?: boolean
    /** Dropdown idiom (▼→▲) instead of the tree idiom (▶→▼) */
    vertical?: boolean
    size?: string | number
  }

  const {
    open = false,
    vertical = false,
    size = 14,
  } = defineProps<AppChevronProps>()

  const settings = useSettings()

  const animate = toRef(() => !settings.prefersReducedMotion.value)
  const rotation = toRef(() => open && (vertical ? 'rotate-180' : 'rotate-90'))
</script>

<template>
  <AppIcon
    aria-hidden="true"
    :class="[
      rotation,
      animate && 'transition-transform duration-200 ease-in-out',
    ]"
    :icon="vertical ? 'chevron-down' : 'chevron-right'"
    :size
  />
</template>
