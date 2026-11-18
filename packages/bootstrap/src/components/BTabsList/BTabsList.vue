<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  import { useBTabs } from '../BTabs/BTabs.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BTabsList' })

  defineSlots<{
    /** `BTabs.Item` elements. */
    default?: () => any
  }>()

  const tabs = useBTabs()

  orphan('BTabsList', 'BTabs', tabs)

  const listClass = toRef(() => {
    const list = ['nav']

    if (tabs?.vertical.value) {
      list.push('nav-pills', 'nav-pills-vertical')
    } else if (tabs?.variant.value === 'pills') {
      list.push('nav-pills')
    } else {
      list.push('nav-tabs')
    }

    return list
  })

  const orientation = toRef(() => tabs?.vertical.value ? 'vertical' as const : undefined)
</script>

<template>
  <ul
    :aria-orientation="orientation"
    :class="listClass"
    role="tablist"
  >
    <slot />
  </ul>
</template>
