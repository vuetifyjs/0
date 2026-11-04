<script lang="ts">
  // Framework
  import { createContext, isUndefined } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Ref } from 'vue'

  export type BNavbarExpand = boolean | 'sm' | 'md' | 'lg'

  export interface BNavbarProps {
    /**
     * `navbar-expand`, or a colon utility `sm:navbar-expand` /
     * `md:navbar-expand` / `lg:navbar-expand`. Omit it and the bar does not
     * expand — the pin has no `navbar-expand-md` form.
     */
    expand?: BNavbarExpand
  }

  export interface BNavbarContext {
    /** Drawer open state. The toggler and `BDrawer` share it. */
    open: Ref<boolean>
  }

  const [useBNavbar, provideBNavbar] = createContext<BNavbarContext>('bootstrap:navbar')

  export { useBNavbar }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavbar' })

  defineSlots<{
    /** Brand, toggler, and collapse. The consumer supplies the container. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const { expand } = defineProps<BNavbarProps>()

  const open = defineModel<boolean>({ default: false })

  const expandClass = toRef(() => {
    if (isUndefined(expand) || expand === false) return undefined
    if (expand === true) return 'navbar-expand'
    return `${expand}:navbar-expand`
  })

  provideBNavbar({ open })
</script>

<template>
  <nav
    class="navbar"
    :class="expandClass"
  >
    <slot />
  </nav>
</template>
