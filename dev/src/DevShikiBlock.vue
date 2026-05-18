<script lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  export interface DevShikiBlockProps {
    code: string
    language?: string
    theme?: string
  }

  type Highlighter = {
    codeToHtml: (code: string, options: { lang: string, theme: string }) => string
    getLoadedLanguages: () => string[]
    loadLanguage: (lang: string) => Promise<void>
  }

  // Module-level singleton — shared across every <DevShikiBlock> instance.
  // Must live in the non-setup script; <script setup> runs per component instance.
  let instance: Highlighter | null = null
  let loading: Promise<Highlighter | null> | null = null

  async function loadHighlighter (theme: string): Promise<Highlighter | null> {
    if (!IN_BROWSER) return null
    if (instance) return instance
    if (loading) return loading
    loading = (async () => {
      const { createHighlighter } = await import('shiki')
      instance = await createHighlighter({
        themes: [theme],
        langs: ['vue', 'ts', 'bash', 'json'],
      }) as unknown as Highlighter
      return instance
    })()
    return loading
  }
</script>

<script setup lang="ts">
  // Utilities
  import { onScopeDispose, shallowRef, watch } from 'vue'

  defineOptions({ name: 'DevShikiBlock' })

  const {
    code,
    language = 'text',
    theme = 'github-dark',
  } = defineProps<DevShikiBlockProps>()

  const html = shallowRef('')
  const cancelled = shallowRef(false)

  watch(
    () => [code, language] as const,
    async ([source, lang]) => {
      if (cancelled.value) return
      const hl = await loadHighlighter(theme)
      if (cancelled.value || !hl) return
      if (!hl.getLoadedLanguages().includes(lang)) {
        try {
          await hl.loadLanguage(lang)
        } catch { /* fallback */ }
      }
      if (cancelled.value) return
      html.value = hl.codeToHtml(source, { lang, theme })
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    cancelled.value = true
  })
</script>

<template>
  <div v-if="html" class="dev-shiki-block" v-html="html" />
  <pre v-else class="dev-shiki-block__fallback"><code>{{ code }}</code></pre>
</template>

<style scoped>
  .dev-shiki-block :deep(pre),
  .dev-shiki-block__fallback {
    margin: 0;
    padding: 1rem;
    background: transparent !important;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    line-height: 1.6;
    white-space: pre;
  }
</style>
