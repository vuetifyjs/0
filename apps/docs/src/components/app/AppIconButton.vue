<script lang="ts" setup>
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface AppIconButtonProps extends AtomProps {
    'aria-label'?: string
    'icon': string
    'size'?: string | number
    'title'?: string
  }

  const props = defineProps<AppIconButtonProps>()

  const {
    as = 'button',
    size = 18,
  } = props

  if (import.meta.env.DEV && !props['aria-label'] && !props.title) {
    console.warn('[AppIconButton] Missing aria-label or title for icon:', props.icon)
  }
</script>

<template>
  <Atom
    :aria-label="props['aria-label']"
    :as
    class="pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
    :title="props.title"
  >
    <AppIcon aria-hidden="true" :icon :size />
  </Atom>
</template>
