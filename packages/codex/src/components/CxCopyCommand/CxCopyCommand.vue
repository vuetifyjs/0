<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Composables
  import { useClipboard } from '#codex/composables/useClipboard'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCopyCommandProps extends V0PaperProps {
    /** The command text to display and copy */
    command: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxCopyCommand' })

  const { command, ...paperProps } = defineProps<CxCopyCommandProps>()

  const { copied, copy } = useClipboard()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-copy-command"
    :title="command"
  >
    <code class="codex-copy-command__text">{{ command }}</code>

    <button
      :aria-label="copied ? 'Copied!' : 'Copy command'"
      class="codex-copy-command__button"
      :data-copied="copied || undefined"
      type="button"
      @click="copy(command)"
    >
      <slot>
        {{ copied ? '\u2713' : '\u2398' }}
      </slot>
    </button>
  </V0Paper>
</template>

<style scoped>
  .codex-copy-command {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: monospace;
    font-size: 0.875rem;
    max-width: 100%;
  }

  .codex-copy-command__text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .codex-copy-command__button {
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
