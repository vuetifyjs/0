<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Composables
  import { useScrollLock } from '#codex/composables/useScrollLock'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAppNavProps extends V0PaperProps {
    /** Width of the sidebar */
    width?: string
    /** Whether the nav is open (mobile) */
    open?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppNav' })

  const {
    width = '230px',
    open = false,
    ...paperProps
  } = defineProps<CxAppNavProps>()

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
    class="codex-app-nav bg-surface border-e border-divider"
    :data-open="open || undefined"
    :style="{ width }"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-app-nav {
    display: none;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    overflow-y: auto;
  }

  .codex-app-nav[data-open] {
    display: flex;
  }

  @media (min-width: 768px) {
    .codex-app-nav {
      display: flex;
    }
  }
</style>
