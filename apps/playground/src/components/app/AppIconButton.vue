<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface AppIconButtonProps extends AtomProps {
    ariaLabel?: string
    icon: string
    size?: string | number
    title?: string
  }

  const {
    as = 'button',
    size = 18,
    ariaLabel,
    title,
  } = defineProps<AppIconButtonProps>()
</script>

<template>
  <Atom
    :aria-label="ariaLabel ?? title"
    :as
    class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none max-md:opacity-80 max-md:bg-surface/50"
    :title
  >
    <AppIcon
      aria-hidden="true"
      :icon
      :size
    />
  </Atom>
</template>
