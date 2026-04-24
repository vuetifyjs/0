<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmGridItemProps extends AtomProps {
    span?: number
    start?: number
    rowSpan?: number
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmGridItem' })

  const { span, start, rowSpan } = defineProps<EmGridItemProps>()

  const style = toRef(() => ({
    gridColumn: span ? `span ${span} / span ${span}` : undefined,
    gridColumnStart: start,
    gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined,
  }))
</script>

<template>
  <Atom as="div" class="emerald-grid__item" :style>
    <slot />
  </Atom>
</template>
