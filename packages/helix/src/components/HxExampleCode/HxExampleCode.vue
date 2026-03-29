<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxExampleCodeProps extends V0PaperProps {
    /** Raw code string */
    code: string
    /** Language identifier */
    language?: string
    /** Enable peek mode (truncated with expand) */
    peek?: boolean
    /** Max height in rem visible in peek mode */
    peekHeight?: number
    /** Shiki theme for syntax highlighting */
    highlighterTheme?: string
  }
</script>

<script setup lang="ts">
  // Composables
  import { useCodeHighlighter } from '#helix/composables/useCodeHighlighter'

  // Utilities
  import { shallowRef, toRef, useSlots, watch } from 'vue'

  defineOptions({ name: 'HxExampleCode' })

  const {
    code,
    language = 'text',
    peek = false,
    peekHeight = 9,
    highlighterTheme = 'github-dark',
    ...paperProps
  } = defineProps<HxExampleCodeProps>()

  const slots = useSlots()
  const expanded = defineModel<boolean>('expanded', { default: false })

  const { highlight, isReady } = useCodeHighlighter({ theme: highlighterTheme })

  const html = shallowRef('')

  watch(
    () => [code, language, isReady.value] as const,
    async ([source, lang]) => {
      if (slots.default) return
      html.value = await highlight(source, lang)
    },
    { immediate: true },
  )

  const maxHeight = toRef(() => `${peekHeight}rem`)
  const truncated = toRef(() => peek && !expanded.value)

  function onToggle () {
    expanded.value = !expanded.value
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-example-code"
    :data-language="language"
    :data-truncated="truncated || undefined"
  >
    <div
      class="helix-example-code__content"
      :style="truncated ? { maxHeight, overflow: 'hidden' } : undefined"
    >
      <!-- Consumer provides highlighted code via default slot -->
      <slot>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="html" v-html="html" />
        <pre v-else><code>{{ code }}</code></pre>
      </slot>
    </div>

    <!-- Fade gradient overlay when truncated -->
    <div v-if="truncated" class="helix-example-code__fade" />

    <!-- Expand/collapse toggle -->
    <button
      v-if="peek"
      :aria-expanded="expanded ? 'true' : 'false'"
      :aria-label="expanded ? 'Collapse code' : 'Expand code'"
      class="helix-example-code__toggle"
      type="button"
      @click="onToggle"
    >
      {{ expanded ? 'Show less' : 'Show more' }}
    </button>
  </V0Paper>
</template>

<style scoped>
  .helix-example-code {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background-color: var(--v0-surface);
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
  }

  .helix-example-code__content {
    overflow-x: auto;
    padding: 1rem;
  }

  .helix-example-code__content pre {
    margin: 0;
  }

  .helix-example-code__content code {
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .helix-example-code__fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3rem;
    pointer-events: none;
    background: linear-gradient(transparent, var(--v0-surface));
  }

  .helix-example-code[data-truncated] .helix-example-code__fade {
    display: block;
  }

  .helix-example-code__toggle {
    align-self: center;
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
    font-size: 0.8125rem;
    color: var(--v0-primary);
    padding: 0.5rem 1rem;
    transition: opacity 0.15s;
  }

  .helix-example-code__toggle:hover {
    opacity: 0.8;
  }
</style>
