<script lang="ts">
  // Framework
  import { Atom, Button } from '@vuetify/v0'

  /**
   * `interactive` and `dismissible` are mutually exclusive. `interactive` renders the
   * chip as a native `<button>` root; nesting the dismiss affordance's own `Button.Root`
   * (also a `<button>`) inside that root would be invalid HTML, so when both are set
   * `interactive` wins and the dismiss affordance is not rendered.
   */
  export interface OnChipProps {
    disabled?: boolean
    dismissible?: boolean
    interactive?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnChip' })

  const emit = defineEmits<{ dismiss: [] }>()

  const { disabled = false, dismissible = false, interactive = false } = defineProps<OnChipProps>()

  function onDismiss () {
    emit('dismiss')
  }
</script>

<template>
  <Atom
    :as="interactive ? 'button' : 'span'"
    class="onyx-chip"
    :data-disabled="disabled || undefined"
    :data-interactive="interactive || undefined"
    :disabled="interactive ? disabled : undefined"
    :type="interactive ? 'button' : undefined"
  >
    <slot />

    <Button.Root
      v-if="dismissible && !interactive"
      aria-label="Remove"
      class="onyx-chip__dismiss"
      :disabled
      @click="onDismiss"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="12"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="12"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </Button.Root>
  </Atom>
</template>

<!-- Unscoped: onyx-chip__dismiss is a nested Button.Root — a compound child from
     v0's own file scope — whose root never receives this file's scoped data-v attribute
     (mirrors the OnButton/Button.Root case; DESIGN_SYSTEMS.md §3). -->
<style>
  .onyx-chip {
    align-items: center;
    background: var(--onyx-secondary, #27272a);
    border: none;
    border-radius: 9999px;
    color: var(--onyx-secondary-foreground, #fafafa);
    display: inline-flex;
    font-size: var(--onyx-text-xs-size, 12px);
    font-weight: 500;
    gap: var(--onyx-spacing-2xs, 4px);
    line-height: var(--onyx-text-xs-height, 16px);
    padding: 2px 10px;
  }

  .onyx-chip[data-interactive] {
    cursor: pointer;
  }

  .onyx-chip[data-interactive]:hover:not([data-disabled]) {
    background: var(--onyx-accent, #27272a);
  }

  .onyx-chip[data-interactive]:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-ring, #71717a) 50%, transparent);
    outline: none;
  }

  .onyx-chip[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  .onyx-chip__dismiss {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: 9999px;
    color: currentcolor;
    cursor: pointer;
    display: inline-flex;
    height: 12px;
    justify-content: center;
    padding: 0;
    width: 12px;
  }

  .onyx-chip__dismiss:hover:not([data-disabled]) {
    color: var(--onyx-destructive, #ef4444);
  }
</style>
