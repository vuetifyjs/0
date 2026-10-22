<script lang="ts">
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
</script>

<template>
  <component
    :is="as"
    class="navbar-brand"
    :href="as === 'a' ? href : undefined"
  >
    <slot />
  </component>
</template>
