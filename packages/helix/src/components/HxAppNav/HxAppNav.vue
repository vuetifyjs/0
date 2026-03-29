<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Composables
  import { useScrollLock } from '#helix/composables/useScrollLock'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAppNavProps extends V0PaperProps {
    /** Width of the sidebar */
    width?: string
    /** Whether the nav is open (mobile) */
    open?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppNav' })

  const {
    width = '230px',
    open = false,
    ...paperProps
  } = defineProps<HxAppNavProps>()

  useScrollLock(() => open)

  defineEmits<{
    'update:open': [value: boolean]
  }>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-label="Main navigation"
    as="nav"
    :data-open="open || undefined"
    :style="{ width }"
  >
    <slot />
  </V0Paper>
</template>
