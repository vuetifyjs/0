<script lang="ts">
  export interface GnDocsExampleCodeProps {
    /** Raw code string (rendered in <pre> fallback when no slot is provided) */
    code?: string
    /** Language identifier surfaced as data-language for styling hooks */
    language?: string
    /** Filename displayed in the top-left badge */
    fileName?: string
    /** Truncate code with a fade and expand button */
    peek?: boolean
    /** Visible rows when peeking */
    peekLines?: number
    /** Hide the internal Show more/less peek toggle (when a parent supplies its own) */
    hidePeekToggle?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'GnDocsExampleCode' })

  const {
    code,
    language = 'text',
    fileName,
    peek = false,
    peekLines = 6,
    hidePeekToggle = false,
  } = defineProps<GnDocsExampleCodeProps>()

  const expanded = defineModel<boolean>('expanded', { default: false })

  const lineCount = toRef(() => code?.split('\n').length ?? 0)
  const shouldPeek = toRef(() => peek && lineCount.value > peekLines)
  const peekHeight = toRef(() => `${peekLines * 1.5 + 1}rem`)
  const truncated = toRef(() => shouldPeek.value && !expanded.value)

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <div
    class="genesis-docs-example-code"
    :data-has-filename="fileName || undefined"
    :data-language="language"
    :data-truncated="truncated || undefined"
  >
    <span v-if="fileName && !truncated" class="genesis-docs-example-code__filename">
      {{ fileName }}
    </span>

    <div
      class="genesis-docs-example-code__content"
      :style="truncated ? { maxHeight: peekHeight, overflow: 'hidden' } : undefined"
    >
      <slot :code :file-name :language>
        <pre class="genesis-docs-example-code__fallback"><code>{{ code }}</code></pre>
      </slot>
    </div>

    <div v-if="truncated" aria-hidden="true" class="genesis-docs-example-code__fade" />

    <button
      v-if="shouldPeek && !hidePeekToggle"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-label="expanded ? 'Collapse code' : 'Expand code'"
      class="genesis-docs-example-code__peek-toggle"
      type="button"
      @click="onToggle"
    >
      {{ expanded ? 'Show less' : 'Show more' }}
    </button>
  </div>
</template>

<style scoped>
  .genesis-docs-example-code {
    --genesis-docs-example-code-bg: var(--v0-pre, var(--v0-surface, transparent));
    --genesis-docs-example-code-fg: var(--v0-on-surface, inherit);
    --genesis-docs-example-code-fg-muted: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
    --genesis-docs-example-code-accent: var(--v0-primary, currentcolor);

    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--genesis-docs-example-code-bg);
    color: var(--genesis-docs-example-code-fg);
  }

  .genesis-docs-example-code__filename {
    position: absolute;
    top: 0.75rem;
    inset-inline-start: 0.75rem;
    z-index: 10;
    padding: 0.125rem 0.375rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    color: var(--genesis-docs-example-code-fg-muted);
    pointer-events: none;
  }

  .genesis-docs-example-code__content {
    overflow-x: auto;
    transition: max-height 0.3s ease-out;
  }

  .genesis-docs-example-code__content :deep(pre),
  .genesis-docs-example-code__fallback {
    margin: 0;
    padding: 1rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre;
  }

  .genesis-docs-example-code[data-has-filename] .genesis-docs-example-code__content :deep(pre),
  .genesis-docs-example-code[data-has-filename] .genesis-docs-example-code__fallback {
    padding-top: 2.25rem;
  }

  .genesis-docs-example-code__fallback {
    color: var(--genesis-docs-example-code-fg-muted);
  }

  .genesis-docs-example-code__fade {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--genesis-docs-example-code-bg));
  }

  .genesis-docs-example-code__peek-toggle {
    align-self: center;
    padding: 0.5rem 1rem;
    background: none;
    border: none;
    color: var(--genesis-docs-example-code-accent);
    font: inherit;
    font-size: 0.8125rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .genesis-docs-example-code__peek-toggle:hover {
    opacity: 0.8;
  }
</style>
