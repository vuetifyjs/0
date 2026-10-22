<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BNavLinkProps {
    /** Adds `.active` and `aria-current="page"`. */
    active?: boolean
    /** Adds `.disabled` and `aria-disabled`. Drops `href`. */
    disabled?: boolean
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavLink' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    active = false,
    disabled = false,
    href,
  } = defineProps<BNavLinkProps>()

  const classes = toRef(() => {
    const list = ['nav-link']

    if (active) list.push('active')
    if (disabled) list.push('disabled')

    return list
  })

  const address = toRef(() => disabled ? undefined : href)
</script>

<template>
  <a
    :aria-current="active ? 'page' : undefined"
    :aria-disabled="disabled ? true : undefined"
    :class="classes"
    :href="address"
    :tabindex="disabled ? -1 : undefined"
  >
    <slot />
  </a>
</template>
