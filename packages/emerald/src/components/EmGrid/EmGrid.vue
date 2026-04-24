<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmGridGap = 0 | 4 | 6 | 8 | 12 | 16 | 24

  export interface EmGridProps extends AtomProps {
    columns?: number
    rows?: number
    gap?: EmGridGap
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmGrid' })

  const {
    columns = 12,
    rows,
    gap = 0,
  } = defineProps<EmGridProps>()

  const style = toRef(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: rows ? `repeat(${rows}, minmax(0, 1fr))` : undefined,
    gap: gap ? `${gap}px` : undefined,
  }))
</script>

<template>
  <Atom as="div" class="emerald-grid" :style>
    <slot />
  </Atom>
</template>
