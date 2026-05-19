<script setup lang="ts">
  import {
    GnDocsExampleCode,
    GnDocsExampleDescription,
    GnDocsExamplePreview,
    GnDocsExampleTabs,
  } from '@paper/genesis'

  // Context
  import DocsGenesisShikiBlock from './DocsGenesisShikiBlock.vue'

  // Composables
  import { getMultiFileBinUrl } from '@/composables/bin'
  import { useExamples } from '@/composables/useExamples'
  import { usePlayground } from '@/composables/usePlayground'

  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed, shallowRef, toRef } from 'vue'

  // Types
  import type { GnDocsExampleFile } from '@paper/genesis'

  export interface DocsGenesisExampleProps {
    /** Display filename for single-file mode (when not auto-resolved) */
    file?: string
    /** Auto-resolve example by path (extensionless; .vue assumed) */
    filePath?: string
    /** Auto-resolve multi-file example by paths (extensions required) */
    filePaths?: string[]
    /** Display order for files (indices match filePaths/files array) */
    fileOrders?: (number | undefined)[]
    /** Description title */
    title?: string
    /** Anchor id for deep linking */
    id?: string
    /** Raw code (single-file override) */
    code?: string
    /** Enable description collapse toggle */
    collapse?: boolean
    /** Multi-file override (skip auto-resolve) */
    files?: GnDocsExampleFile[]
    /** Imports passed to Playground hash */
    imports?: Record<string, string>
    /** Peek mode for single-file */
    peek?: boolean
    /** Visible peek lines (default 6) */
    peekLines?: number
  }

  const props = defineProps<DocsGenesisExampleProps>()

  // ───────────────────────── auto-resolve ─────────────────────────
  const examples = useExamples()

  const auto = computed(() => {
    if (props.filePaths?.length) return examples.resolveMultiple(props.filePaths)
    if (props.filePath) return examples.resolve(props.filePath)
    return null
  })

  const resolvedCode = toRef(() =>
    props.code ?? (auto.value && 'code' in auto.value ? auto.value.code : undefined),
  )
  const resolvedFiles = toRef(() =>
    props.files ?? (auto.value && 'files' in auto.value ? auto.value.files : undefined),
  )
  const resolvedComponent = toRef(() => auto.value?.component)

  // ───────────────────────── derived state ─────────────────────────
  const hasMultipleFiles = toRef(() => (resolvedFiles.value?.length ?? 0) > 1)
  const hasCode = toRef(() => Boolean(resolvedCode.value || resolvedFiles.value?.length))

  const fileName = toRef(() =>
    props.file?.split('/').pop()
    ?? (props.filePath ? `${props.filePath.split('/').pop()}.vue` : ''),
  )
  const language = toRef(() => props.file?.split('.').pop() || 'vue')

  const anchorId = toRef(() => props.id ?? (props.title ? `example-${toKebab(props.title)}` : undefined))

  const showCode = shallowRef(false)
  const peekExpanded = shallowRef(false)

  // ───────────────────────── actions ─────────────────────────
  async function onPlayground (list: GnDocsExampleFile[]) {
    const files = list.map(f => ({ name: f.name, code: f.code }))
    const url = await usePlayground(files, undefined, props.imports)
    window.open(url, '_blank')
  }

  async function onBin (list: GnDocsExampleFile[]) {
    const files = list.map(f => ({ name: f.name, code: f.code, language: f.language }))
    const url = await getMultiFileBinUrl(files, props.title)
    window.open(url, '_blank')
  }

  function toggleCode () {
    showCode.value = !showCode.value
  }
</script>

<template>
  <div class="docs-genesis-example">
    <GnDocsExampleDescription
      v-if="title || $slots.description"
      :anchor-id
      :collapse
      :title
    >
      <slot name="description" />
    </GnDocsExampleDescription>

    <GnDocsExamplePreview>
      <component :is="resolvedComponent" v-if="resolvedComponent" />
      <slot v-else />
    </GnDocsExamplePreview>

    <div v-if="hasCode && !peek" class="docs-genesis-example__toggle-bar">
      <button
        :aria-expanded="showCode"
        class="docs-genesis-example__toggle"
        type="button"
        @click="toggleCode"
      >
        {{ showCode ? 'Hide code' : 'Show code' }}

        <span v-if="hasMultipleFiles" class="docs-genesis-example__meta">
          {{ resolvedFiles!.length }} file(s)
        </span>

        <span v-else-if="fileName || language" class="docs-genesis-example__meta">
          {{ fileName || language }}
        </span>
      </button>
    </div>

    <div v-if="(showCode || peek) && hasCode" class="docs-genesis-example__code">
      <GnDocsExampleTabs
        v-if="hasMultipleFiles"
        v-slot="{ file }"
        :file-orders
        :files="resolvedFiles!"
        show-bin
        show-playground
        @bin="onBin"
        @playground="onPlayground"
      >
        <GnDocsExampleCode :code="file!.code" :language="file!.language">
          <DocsGenesisShikiBlock :code="file!.code" :language="file!.language || 'text'" />
        </GnDocsExampleCode>
      </GnDocsExampleTabs>

      <GnDocsExampleCode
        v-else-if="resolvedCode"
        v-model:expanded="peekExpanded"
        :code="resolvedCode"
        :file-name
        hide-peek-toggle
        :language
        :peek
        :peek-lines
      >
        <DocsGenesisShikiBlock :code="resolvedCode" :language />
      </GnDocsExampleCode>
    </div>
  </div>
</template>

<style scoped>
  .docs-genesis-example {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    border-radius: 0.5rem;
    background: var(--v0-surface, #fff);
    color: var(--v0-on-surface, #1a1c1e);
    margin-block: 1.5rem;
  }

  .docs-genesis-example > *:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .docs-genesis-example > *:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .docs-genesis-example__toggle-bar {
    border-top: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    background: var(--v0-surface-tint, var(--v0-surface, #f5f5f8));
  }

  .docs-genesis-example__toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.12s;
  }

  .docs-genesis-example__toggle:hover {
    background: var(--v0-surface, #fff);
  }

  .docs-genesis-example__meta {
    margin-inline-start: auto;
    color: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
  }

  .docs-genesis-example__code {
    overflow: hidden;
    border-top: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
  }
</style>
