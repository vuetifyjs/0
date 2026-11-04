<script lang="ts">
  // Framework
  import { isNumber } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BColProps {
    /**
     * Width out of 12. Adds `col-{span}` instead of `col`.
     */
    span?: number
    /**
     * Width from the sm breakpoint. Adds `sm:col-{sm}`, not `col-sm-*`.
     */
    sm?: number
    /**
     * Width from the md breakpoint. Adds `md:col-{md}`, not `col-md-*`.
     */
    md?: number
    /**
     * Width from the lg breakpoint. Adds `lg:col-{lg}`, not `col-lg-*`.
     */
    lg?: number
    /**
     * Left offset. Adds `offset-{offset}`.
     */
    offset?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCol' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    span,
    sm,
    md,
    lg,
    offset,
  } = defineProps<BColProps>()

  function push (list: string[], prefix: string, value: number | undefined) {
    if (!isNumber(value)) return
    list.push(`${prefix}${value}`)
  }

  const classes = toRef(() => {
    const list: string[] = []
    if (isNumber(span)) list.push(`col-${span}`)
    else list.push('col')
    push(list, 'sm:col-', sm)
    push(list, 'md:col-', md)
    push(list, 'lg:col-', lg)
    push(list, 'offset-', offset)
    return list
  })
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
