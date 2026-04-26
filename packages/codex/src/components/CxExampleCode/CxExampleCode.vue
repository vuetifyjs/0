<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxExampleCodeProps extends V0PaperProps {
    /** Raw code string */
    code: string
    /** Language identifier */
    language?: string
    /** Enable peek mode (truncated with expand) */
    peek?: boolean
    /** Number of lines visible in peek mode */
    peekLines?: number
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'CxExampleCode' })

  const {
    code,
    language = 'text',
    peek = false,
    peekLines = 6,
    ...paperProps
  } = defineProps<CxExampleCodeProps>()

  const expanded = defineModel<boolean>('expanded', { default: false })

  const lineHeight = 1.5 // rem
  const peekHeight = toRef(() => `${peekLines * lineHeight}rem`)
  const truncated = toRef(() => peek && !expanded.value)

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-example-code"
    :data-language="language"
    :data-truncated="truncated || undefined"
  >
    <div
      class="codex-example-code__content"
      :style="truncated ? { maxHeight: peekHeight, overflow: 'hidden' } : undefined"
    >
      <!-- Consumer provides highlighted code via default slot -->
      <slot>
        <pre><code>{{ code }}</code></pre>
      </slot>
    </div>

    <!-- Fade gradient overlay when truncated -->
    <div v-if="truncated" class="codex-example-code__fade" />

    <!-- Expand/collapse toggle -->
    <button
      v-if="peek"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-label="expanded ? 'Collapse code' : 'Expand code'"
      class="codex-example-code__toggle"
      type="button"
      @click="onToggle"
    >
      {{ expanded ? 'Show less' : 'Show more' }}
    </button>
  </V0Paper>
</template>

<style scoped>
  .codex-example-code {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .codex-example-code__content {
    overflow-x: auto;
  }

  .codex-example-code__content pre {
    margin: 0;
  }

  .codex-example-code__content code {
    font-family: monospace;
  }

  .codex-example-code__fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--codex-example-code-fade, currentcolor));
    opacity: 0.1;
  }

  .codex-example-code[data-truncated] .codex-example-code__fade {
    display: block;
  }

  .codex-example-code__toggle {
    align-self: center;
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
    font-size: 0.8125rem;
  }
</style>
