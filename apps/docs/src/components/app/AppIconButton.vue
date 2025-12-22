<script lang="ts" setup>
  // Types
  import type { AtomProps } from '@vuetify/v0'

  // Components
  import { Atom } from '@vuetify/v0'

  export interface AppIconButtonProps extends AtomProps {
    icon: string
    size?: string | number
  }

  const {
    as = 'button',
    size = 18,
  } = defineProps<AppIconButtonProps>()
</script>

<template>
  <Atom
    :as
    class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
  >
    <AppIcon :icon :size />
  </Atom>
</template>
