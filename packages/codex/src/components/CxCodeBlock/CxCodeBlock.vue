<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCodeBlockProps extends V0PaperProps {
    /** Raw code string */
    code: string
    /** Language identifier */
    language?: string
    /** Show line numbers */
    showLineNumbers?: boolean
    /** Shiki theme for syntax highlighting */
    highlighterTheme?: string
  }
</script>

<script setup lang="ts">
  // Composables
  import { useCodeHighlighter } from '#codex/composables/useCodeHighlighter'

  // Utilities
  import { shallowRef, watch } from 'vue'

  defineOptions({ name: 'CxCodeBlock' })

  const {
    code,
    language = 'text',
    showLineNumbers = false,
    highlighterTheme = 'github-dark',
    ...paperProps
  } = defineProps<CxCodeBlockProps>()

  const { highlight, isReady } = useCodeHighlighter({ theme: highlighterTheme })

  const html = shallowRef('')

  let gen = 0
  watch(
    () => [code, language, isReady.value] as const,
    async ([source, lang]) => {
      const current = ++gen
      const result = await highlight(source, lang)
      if (current === gen) html.value = result
    },
    { immediate: true },
  )
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-code-block group"
    :data-language="language"
    :data-line-numbers="showLineNumbers || undefined"
    :data-loading="!html || undefined"
  >
    <slot />

    <div class="codex-code-block__content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="html" v-html="html" />
      <pre v-else><code>{{ code }}</code></pre>
    </div>
  </V0Paper>
</template>

<style scoped>
  .codex-code-block {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
