<script lang="ts">
  export interface CxCopyCommandActionProps {
    /** The text to copy to clipboard */
    text: string
  }
</script>

<script setup lang="ts">
  // Composables
  import { useClipboard } from '#codex/composables/useClipboard'

  defineOptions({ name: 'CxCopyCommandAction' })

  const { text } = defineProps<CxCopyCommandActionProps>()

  const { copied, copy } = useClipboard()
</script>

<template>
  <button
    :aria-label="copied ? 'Copied!' : 'Copy command'"
    class="codex-copy-command__action"
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
  .codex-copy-command__action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border: none;
    font: inherit;
  }
</style>
