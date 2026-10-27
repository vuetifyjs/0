<script lang="ts">
  // Framework
  import { Atom, isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export type BBadgeVariant = 'subtle' | 'outline'

  export interface BBadgeProps {
    /** Host element. */
    as?: string
    /** Adds `theme-{theme}`. */
    theme?: string
    /** `badge-subtle` or `badge-outline`, added to `.badge`. */
    variant?: BBadgeVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BBadge' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    as = 'span',
    theme,
    variant,
  } = defineProps<BBadgeProps>()

  const classes = toRef(() => {
    const list = ['badge']

    if (variant === 'subtle') list.push('badge-subtle')
    if (variant === 'outline') list.push('badge-outline')
    if (isString(theme) && theme.length > 0) list.push(`theme-${theme}`)

    return list
  })
</script>

<template>
  <Atom
    :as
    :class="classes"
  >
    <slot />
  </Atom>
</template>
