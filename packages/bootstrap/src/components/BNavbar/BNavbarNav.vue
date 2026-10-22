<script lang="ts">
  export interface BNavbarNavProps {
    /** `ul` in the docs. `div` when the nav is not a list. */
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavbarNav' })

  defineSlots<{
    /** `li.nav-item` children, or bare links when `as` is `div`. */
    default?: () => any
  }>()

  const { as = 'ul' } = defineProps<BNavbarNavProps>()
</script>

<template>
  <component
    :is="as"
    class="navbar-nav"
  >
    <slot />
  </component>
</template>
