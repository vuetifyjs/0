<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BCardProps {
    /** Host element. The pin's first example is a `section`. */
    as?: string
    /** Adds `.card-subtle`. */
    subtle?: boolean
    /** Adds `.card-translucent`. */
    translucent?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCard' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    as = 'section',
    subtle = false,
    translucent = false,
  } = defineProps<BCardProps>()

  const classes = toRef(() => {
    const list = ['card']

    if (subtle) list.push('card-subtle')
    if (translucent) list.push('card-translucent')

    return list
  })
</script>

<template>
  <component
    :is="as"
    :class="classes"
  >
    <slot />
  </component>
</template>
