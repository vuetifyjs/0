<script lang="ts">
  export interface HxCopyCommandActionProps {
    /** The text to copy to clipboard */
    text: string
  }
</script>

<script setup lang="ts">
  // Composables
  import { useClipboard } from '#helix/composables/useClipboard'

  defineOptions({ name: 'HxCopyCommandAction' })

  const { text } = defineProps<HxCopyCommandActionProps>()

  const { copied, copy } = useClipboard()
</script>

<template>
  <button
    :aria-label="copied ? 'Copied!' : 'Copy command'"
    class="helix-copy-command__action"
    :data-copied="copied || undefined"
    type="button"
    @click="copy(text)"
  >
    <slot>
      {{ copied ? '\u2713' : '\u2398' }}
    </slot>
  </button>
</template>

<style scoped>
  .helix-copy-command__action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    padding: 0.25rem;
    font: inherit;
    color: var(--v0-on-surface-variant);
    transition: color 0.15s;
  }

  .helix-copy-command__action:hover {
    color: var(--v0-on-surface);
  }
</style>
