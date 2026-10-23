<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export type BNavVariant = 'tabs' | 'pills' | 'underline'

  export interface BNavProps {
    /** `ul` wraps items. `nav` is the flat link list. */
    as?: 'ul' | 'nav'
    /** Adds `.nav-fill`. */
    fill?: boolean
    /** Adds `.nav-justified`. */
    justified?: boolean
    /**
     * `nav-tabs`, `nav-pills`, or `nav-underline`.
     * `vertical` uses pills instead.
     */
    variant?: BNavVariant
    /**
     * Adds `.nav-pills` and `.nav-pills-vertical`.
     *
     * @default false
     */
    vertical?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNav' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    as = 'ul',
    fill = false,
    justified = false,
    variant,
    vertical = false,
  } = defineProps<BNavProps>()

  const classes = toRef(() => {
    const list = ['nav']

    if (vertical) {
      list.push('nav-pills', 'nav-pills-vertical')
    } else switch (variant) {
      case 'tabs': {
        list.push('nav-tabs')

        break
      }
      case 'pills': {
        list.push('nav-pills')

        break
      }
      case 'underline': {
        list.push('nav-underline')

        break
      }
      // No default
    }

    if (fill) list.push('nav-fill')
    if (justified) list.push('nav-justified')

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
