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
    background: var(--onyx-secondary, #211c19);
    border: none;
    border-radius: 9999px;
    color: var(--onyx-secondary-foreground, #f0ece5);
    display: inline-flex;
    font-size: var(--onyx-text-xs-size, 12px);
    font-weight: 550;
    gap: var(--onyx-spacing-2xs, 4px);
    line-height: var(--onyx-text-xs-height, 18px);
    padding: 2px 10px;
  }

  .onyx-chip[data-interactive] {
    cursor: pointer;
  }

  .onyx-chip[data-interactive]:hover:not([data-disabled]) {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 70%, transparent);
  }

  .onyx-chip[data-interactive]:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  /* Explicit disabled colors, never opacity (graft — see OnButton's [data-disabled] comment). */
  .onyx-chip[data-disabled] {
    background: var(--onyx-card, #181411);
    color: var(--onyx-muted-foreground, #bab3ab);
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
    color: var(--onyx-destructive, #cf4b3b);
  }

  .onyx-chip__dismiss:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }
</style>
