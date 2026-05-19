<script setup lang="ts">
  import { GnDocsExample, GnDocsExampleCode } from '@paper/genesis'

  // Context
  import DocsGenesisShikiBlock from './DocsGenesisShikiBlock.vue'

  // Composables
  import { getMultiFileBinUrl } from '@/composables/bin'
  import { useExamples } from '@/composables/useExamples'
  import { usePlayground } from '@/composables/usePlayground'

  // Utilities
  import { computed, toRef } from 'vue'

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

  const fileName = toRef(() =>
    props.file?.split('/').pop()
    ?? (props.filePath ? `${props.filePath.split('/').pop()}.vue` : undefined),
  )
  const language = toRef(() => props.file?.split('.').pop() || 'vue')

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
</script>

<template>
  <GnDocsExample
    :id
    :code="resolvedCode"
    :collapse
    :file-name
    :file-orders
    :files="resolvedFiles"
    :language
    :peek
    :peek-lines
    show-bin
    show-playground
    :title
    @bin="onBin"
    @playground="onPlayground"
  >
    <component :is="resolvedComponent" v-if="resolvedComponent" />
    <slot v-else />

    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>

    <template #code="{ code, language: codeLanguage }">
      <DocsGenesisShikiBlock :code="code ?? ''" :language="codeLanguage ?? 'text'" />
    </template>

    <template #panel="{ file }">
      <GnDocsExampleCode :code="file.code" :file-name="file.name" :language="file.language || 'text'">
        <DocsGenesisShikiBlock :code="file.code" :language="file.language || 'text'" />
      </GnDocsExampleCode>
    </template>
  </GnDocsExample>
</template>
