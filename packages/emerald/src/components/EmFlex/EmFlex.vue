<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmFlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
  export type EmFlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  export type EmFlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  export type EmFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
  export type EmFlexGap = 0 | 4 | 6 | 8 | 12 | 16 | 24

  export interface EmFlexProps extends AtomProps {
    direction?: EmFlexDirection
    align?: EmFlexAlign
    justify?: EmFlexJustify
    wrap?: EmFlexWrap
    gap?: EmFlexGap
    inline?: boolean
  }

  const JUSTIFY_MAP: Record<string, string> = {
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  }

  function resolveJustify (value?: EmFlexJustify): string | undefined {
    if (!value) return undefined
    return JUSTIFY_MAP[value] ?? value
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmFlex' })

  const {
    direction = 'row',
    align,
    justify,
    wrap = 'nowrap',
    gap = 0,
    inline = false,
  } = defineProps<EmFlexProps>()

  const style = toRef(() => ({
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: resolveJustify(justify),
    flexWrap: wrap,
    gap: gap ? `${gap}px` : undefined,
  }))
</script>

<template>
  <Atom
    as="div"
    class="emerald-flex"
    :data-direction="direction"
    :style
  >
    <slot />
  </Atom>
</template>
