<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface CxDividerProps extends AtomProps {
    orientation?: 'horizontal' | 'vertical'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxDivider' })

  const { as = 'hr', orientation = 'horizontal' } = defineProps<CxDividerProps>()
</script>

<template>
  <Atom
    :aria-orientation="orientation"
    :as
    :class="['codex-divider', `codex-divider--${orientation}`]"
    :role="as !== 'hr' ? 'separator' : undefined"
  />
</template>

<style scoped>
  .codex-divider {
    border: none;
    flex-shrink: 0;
  }

  .codex-divider--horizontal {
    width: 100%;
    height: 1px;
  }

  .codex-divider--vertical {
    width: 1px;
    height: 100%;
  }
</style>
