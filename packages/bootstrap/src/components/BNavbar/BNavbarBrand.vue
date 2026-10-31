<script lang="ts">
  // Framework
  import { Atom, isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BNavbarBrandProps {
    /** `a` in the docs link form, `span` for a heading. */
    as?: string
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavbarBrand' })

  defineSlots<{
    default?: () => any
  }>()

  const { as = 'a', href } = defineProps<BNavbarBrandProps>()

  const address = toRef(() => as === 'a' && isString(href) && href.length > 0 ? href : undefined)
</script>

<template>
  <Atom
    :as
    class="navbar-brand"
    :href="address"
  >
    <slot />
  </Atom>
</template>
