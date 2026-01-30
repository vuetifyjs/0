<script setup lang="ts">
  // Framework
/**
   * Lightweight card container with consistent border/hover styling.
   * Uses slots for flexible content, avoiding a one-size-fits-all structure.
   */
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { computed, toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface DocsCardProps extends AtomProps {
    /** Make card hoverable with border/shadow effects */
    hoverable?: boolean
    /** Link destination (makes card clickable) */
    to?: string
    /** External link destination */
    href?: string
    /** Disabled state */
    disabled?: boolean
  }

  const {
    hoverable = false,
    disabled = false,
    ...props
  } = defineProps<DocsCardProps>()

  const isExternal = toRef(() => props.href?.startsWith('http'))

  const componentAs = computed(() => {
    if (disabled) return 'div'
    if (props.to) return RouterLink
    if (props.href) return 'a'
    return props.as ?? 'div'
  })

  const linkProps = computed(() => {
    if (disabled) return {}
    if (props.to) return { to: props.to }
    if (props.href) {
      return {
        href: props.href,
        target: isExternal.value ? '_blank' : undefined,
        rel: isExternal.value ? 'noopener noreferrer' : undefined,
      }
    }
    return {}
  })

  const isInteractive = computed(() => !disabled && (props.to || props.href || hoverable))
</script>

<template>
  <Atom
    :as="componentAs"
    class="p-4 border border-divider rounded-lg bg-surface no-underline text-inherit transition-[border-color,box-shadow] duration-200"
    :class="{
      'opacity-60 cursor-not-allowed': disabled,
      'hover:border-primary hover:shadow-md cursor-pointer': isInteractive && !disabled,
    }"
    v-bind="linkProps"
  >
    <slot />
  </Atom>
</template>
