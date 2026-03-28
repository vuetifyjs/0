<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxCardProps extends V0PaperProps {
    /** Make card hoverable with interactive effects */
    hoverable?: boolean
    /** Router link destination */
    to?: string
    /** Link destination (internal or external) */
    href?: string
    /** Disabled state */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxCard' })

  const {
    hoverable = false,
    to,
    href,
    disabled = false,
    ...paperProps
  } = defineProps<HxCardProps>()

  const isExternal = toRef(() => href?.startsWith('http'))

  const tag = toRef(() => {
    if (disabled) return 'div'
    if (to) return RouterLink as unknown as DOMElement
    if (href) return 'a'
    return paperProps.as ?? 'div'
  })

  const linkAttrs = toRef(() => {
    if (disabled) return {}
    if (to) return { to }
    if (href) {
      return {
        href,
        target: isExternal.value ? '_blank' : undefined,
        rel: isExternal.value ? 'noopener noreferrer' : undefined,
      }
    }
    return {}
  })

  const interactive = toRef(() => !disabled && (to || href || hoverable))
</script>

<template>
  <V0Paper
    v-bind="{ ...paperProps, ...linkAttrs }"
    :as="tag"
    class="helix-card"
    :data-disabled="disabled || undefined"
    :data-interactive="interactive || undefined"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-card {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .helix-card[data-disabled] {
    cursor: not-allowed;
  }

  .helix-card[data-interactive] {
    cursor: pointer;
  }
</style>
