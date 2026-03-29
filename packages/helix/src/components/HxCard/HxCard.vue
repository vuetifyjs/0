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
    if (to) return RouterLink
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
    padding: 1rem;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    background-color: var(--v0-surface);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .helix-card[data-disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .helix-card[data-interactive] {
    cursor: pointer;
  }

  .helix-card[data-interactive]:hover {
    border-color: var(--v0-primary);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  }

  .helix-card[data-interactive]:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: 2px;
  }
</style>
