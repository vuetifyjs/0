<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCodeBlockProps extends V0PaperProps {
    /** Raw code string for copy functionality */
    code: string
    /** Language identifier */
    language?: string
    /** Optional filename to display in header */
    filename?: string
    /** Show copy button */
    showCopy?: boolean
    /** Show line numbers */
    showLineNumbers?: boolean
  }
</script>

<script setup lang="ts">
  // Composables
  import { useClipboard } from '../../composables/useClipboard'

  defineOptions({ name: 'CxCodeBlock' })

  const {
    code,
    language = 'text',
    filename,
    showCopy = true,
    showLineNumbers = false,
    ...paperProps
  } = defineProps<CxCodeBlockProps>()

  const { copied, copy } = useClipboard()

  function onCopy () {
    copy(code)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-code-block"
    :data-language="language"
    :data-line-numbers="showLineNumbers || undefined"
  >
    <div v-if="filename || showCopy" class="codex-code-block__header">
      <span v-if="filename" class="codex-code-block__filename">{{ filename }}</span>
      <span v-else class="codex-code-block__language">{{ language }}</span>

      <button
        v-if="showCopy"
        :aria-label="copied ? 'Copied!' : 'Copy code'"
        class="codex-code-block__copy"
        :data-copied="copied || undefined"
        type="button"
        @click="onCopy"
      >
        {{ copied ? '\u2713' : 'Copy' }}
      </button>
    </div>

    <div class="codex-code-block__content">
      <!-- Consumer provides pre-highlighted HTML via default slot (e.g. Shiki output) -->
      <slot>
        <pre><code>{{ code }}</code></pre>
      </slot>
    </div>
  </V0Paper>
</template>

<style scoped>
  .codex-code-block {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .codex-code-block__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .codex-code-block__filename {
    font-family: monospace;
    font-size: 0.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .codex-code-block__language {
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  .codex-code-block__copy {
    flex-shrink: 0;
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
    font-size: 0.75rem;
  }

  .codex-code-block__content {
    overflow-x: auto;
  }

  .codex-code-block__content pre {
    margin: 0;
  }

  .codex-code-block__content code {
    font-family: monospace;
  }
</style>
