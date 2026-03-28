<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface HxDividerProps extends AtomProps {
    orientation?: 'horizontal' | 'vertical'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxDivider' })

  const { as = 'hr', orientation = 'horizontal' } = defineProps<HxDividerProps>()
</script>

<template>
  <Atom
    :aria-orientation="orientation"
    :as
    :class="['helix-divider', `helix-divider--${orientation}`]"
    :role="as !== 'hr' ? 'separator' : undefined"
  />
</template>

<style scoped>
  .helix-divider {
    border: none;
    flex-shrink: 0;
  }

  .helix-divider--horizontal {
    width: 100%;
    height: 1px;
  }

  .helix-divider--vertical {
    width: 1px;
    height: 100%;
  }
</style>
