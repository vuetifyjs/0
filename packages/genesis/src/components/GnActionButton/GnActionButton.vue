<script lang="ts">
  // Framework
  import { Button, Tooltip } from '@vuetify/v0'

  // Utilities
  import { mergeProps } from 'vue'

  export interface GnActionButtonProps {
    /**
     * Accessible label. Forwarded to `Button.Root`'s `ariaLabel` prop, not as a
     * fallthrough attribute: a slotted icon makes every action button a solo
     * icon button, and `Button.Root` overrides a fallthrough `aria-label` with
     * its locale default for solo buttons. Declared camelCase so the consumer's
     * `aria-label` attribute resolves to this prop rather than falling through.
     */
    ariaLabel?: string
    /**
     * Tooltip text. Empty skips the tooltip. Delays come from the
     * `createTooltipPlugin` region when one is installed.
     */
    title?: string
    /** Native button type. */
    type?: 'button' | 'submit' | 'reset'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnActionButton', inheritAttrs: false })

  const {
    ariaLabel,
    title,
    type = 'button',
  } = defineProps<GnActionButtonProps>()
</script>

<template>
  <Tooltip.Root v-if="title">
    <Tooltip.Activator v-slot="{ attrs, styles }" as="span" renderless>
      <Button.Root
        :aria-label
        class="genesis-action-button"
        :style="styles"
        :type
        v-bind="mergeProps($attrs, attrs)"
      >
        <Button.Icon as="span" class="genesis-action-button__icon">
          <slot />
        </Button.Icon>
      </Button.Root>
    </Tooltip.Activator>

    <Tooltip.Content class="genesis-action-button__tooltip">
      {{ title }}
    </Tooltip.Content>
  </Tooltip.Root>

  <Button.Root
    v-else
    :aria-label
    class="genesis-action-button"
    :type
    v-bind="$attrs"
  >
    <Button.Icon as="span" class="genesis-action-button__icon">
      <slot />
    </Button.Icon>
  </Button.Root>
</template>

<!-- Unscoped: a scoped rule's data-v never lands on Button.Root's multi-root <button>
     or Tooltip.Content's popover node. -->
<style>
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

  .genesis-action-button__icon svg,
  .genesis-action-button__icon i {
    width: 16px;
    height: 16px;
  }

  .genesis-action-button__tooltip {
    max-width: 16rem;
    margin-block: 6px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--v0-divider, rgb(0 0 0 / 0.12));
    border-radius: 0.25rem;
    background: var(--v0-surface, #fff);
    color: var(--v0-on-surface, #1a1c1e);
    font-size: 0.75rem;
    line-height: 1.25rem;
    white-space: normal;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
</style>
