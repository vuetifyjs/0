<script lang="ts">
  export interface HxCodeBlockActionsProps {
    /** Raw code string for copy functionality */
    code: string
    /** Show copy button */
    showCopy?: boolean
    /** Show line wrap toggle */
    showWrap?: boolean
  }
</script>

<script setup lang="ts">
  // Composables
  import { useClipboard } from '#helix/composables/useClipboard'

  defineOptions({ name: 'HxCodeBlockActions' })

  const {
    code,
    showCopy = true,
    showWrap = false,
  } = defineProps<HxCodeBlockActionsProps>()

  const wrap = defineModel<boolean>('wrap', { default: false })

  const { copied, copy } = useClipboard()

  function onCopy () {
    copy(code)
  }

  function onWrap () {
    wrap.value = !wrap.value
  }
</script>

<template>
  <div class="helix-code-block__actions">
    <button
      v-if="showWrap"
      aria-label="Toggle line wrap"
      class="helix-code-block__action"
      :data-active="wrap || undefined"
      type="button"
      @click="onWrap"
    >
      Wrap
    </button>

    <button
      v-if="showCopy"
      :aria-label="copied ? 'Copied!' : 'Copy code'"
      class="helix-code-block__action"
      :data-copied="copied || undefined"
      type="button"
      @click="onCopy"
    >
      {{ copied ? '\u2713' : 'Copy' }}
    </button>
  </div>
</template>

<style scoped>
  .helix-code-block__actions {
    position: absolute;
    top: 0.5rem;
    inset-inline-end: 0.5rem;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
  }

  :global(.group:hover) .helix-code-block__actions,
  :global(.group:focus-within) .helix-code-block__actions {
    opacity: 1;
  }

  .helix-code-block__action {
    flex-shrink: 0;
    cursor: pointer;
    background: transparent;
    border: 1px solid var(--v0-divider);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font: inherit;
    font-size: 0.75rem;
    color: var(--v0-on-surface-variant);
    transition: color 0.15s, background-color 0.15s;
  }

  .helix-code-block__action:hover {
    color: var(--v0-on-surface);
    background-color: var(--v0-surface-tint);
  }
</style>
