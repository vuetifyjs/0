<script lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  export interface GnActionButtonProps {
    /**
     * Accessible label. Forwarded to `Button.Root`'s `ariaLabel` prop, not as a
     * fallthrough attribute: a slotted icon makes every action button a solo
     * icon button, and `Button.Root` overrides a fallthrough `aria-label` with
     * its locale default for solo buttons.
     */
    'aria-label'?: string
    /** Native tooltip text. */
    'title'?: string
    /** Native button type. */
    'type'?: 'button' | 'submit' | 'reset'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnActionButton' })

  const {
    'aria-label': label,
    title,
    type = 'button',
  } = defineProps<GnActionButtonProps>()
</script>

<template>
  <Button.Root
    :aria-label="label"
    class="genesis-action-button"
    :title
    :type
  >
    <Button.Icon as="span" class="genesis-action-button__icon">
      <slot />
    </Button.Icon>
  </Button.Root>
</template>

<style scoped>
  .genesis-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 0.5rem;
    background: transparent;
    color: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
    border: none;
    border-radius: 0.25rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-action-button:hover {
    background: color-mix(in srgb, var(--v0-on-surface, #1a1c1e) 8%, transparent);
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-action-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .genesis-action-button__icon :deep(svg),
  .genesis-action-button__icon :deep(i) {
    width: 16px;
    height: 16px;
  }
</style>
