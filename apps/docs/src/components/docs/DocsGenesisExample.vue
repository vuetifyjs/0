<script setup lang="ts">
  import { GnDocsExample } from '@paper/genesis'

  // Context
  import DocsCodeActions from './DocsCodeActions.vue'
  import DocsGenesisShikiBlock from './DocsGenesisShikiBlock.vue'

  // Composables
  import { getMultiFileBinUrl } from '@/composables/bin'
  import { useExamples } from '@/composables/useExamples'
  import { prehighlight } from '@/composables/useHighlightCode'
  import { useIdleCallback } from '@/composables/useIdleCallback'
  import { usePlayground } from '@/composables/usePlayground'
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { computed, onMounted, toRef } from 'vue'

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

  const settings = useSettings()
  const lineWrap = useSyncedRef(settings.lineWrap)
  const size = settings.codeSize

  // Highlight code into the shared cache before the pane opens, so the first
  // "Show code" renders highlighted output instead of flashing raw text
  function warm () {
    const files = resolvedFiles.value
    if (files?.length) {
      for (const f of files) prehighlight(f.code, f.language || f.name.split('.').pop() || 'text')
    } else if (resolvedCode.value) {
      prehighlight(resolvedCode.value, language.value)
    }
  }

  onMounted(() => {
    useIdleCallback(warm)
  })

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
    class="mb-6"
    :code="resolvedCode"
    :collapse
    data-tour="example"
    :file-name
    :file-orders
    :files="resolvedFiles"
    :language
    :peek
    :peek-lines
    show-bin
    show-playground
    :style="{ '--gn-docs-example-sticky-top': 'calc(48px + var(--app-banner-h, 0px))' }"
    :title
    @bin="onBin"
    @playground="onPlayground"
  >
    <component :is="resolvedComponent" v-if="resolvedComponent" />
    <slot v-else />

    <template #decoration>
      <AppDotGrid :coverage="60" />
    </template>

    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>

    <template #toggle-icon="{ expanded }">
      <AppChevron :open="expanded" :size="16" vertical />
    </template>

    <template #reset-icon>
      <AppIcon icon="restart" :size="16" />
    </template>

    <template #playground-icon>
      <AppIcon icon="vuetify-play" :size="16" />
    </template>

    <template #bin-icon>
      <AppIcon icon="vuetify-bin" :size="16" />
    </template>

    <template #combine-icon>
      <AppIcon icon="combine" :size="16" />
    </template>

    <template #split-icon>
      <AppIcon icon="split" :size="16" />
    </template>

    <template #code="{ code: paneCode, file: paneFile, language: paneLanguage }">
      <div
        class="docs-genesis-example-pane"
        :class="lineWrap && 'docs-genesis-example-pane--wrap'"
        data-tour="example-code"
      >
        <DocsGenesisShikiBlock :code="paneCode ?? ''" :language="paneLanguage ?? 'text'" />

        <div class="docs-genesis-example-pane__actions" data-tour="example-toolbar">
          <DocsCodeActions
            v-model:size="size"
            v-model:wrap="lineWrap"
            bin
            :code="paneCode ?? ''"
            :language="paneLanguage"
            :playground="!paneFile"
            show-copy
            show-size
            show-wrap
            :title="paneFile?.name ?? fileName"
          />
        </div>
      </div>
    </template>
  </GnDocsExample>
</template>

<style scoped>
  /* Skin the example surfaces with the AppBar's glass treatment so the
     description and the sticky toolbars read as continuous page chrome. */
  :deep(.genesis-docs-example-description),
  :deep(.genesis-docs-example__toggle-bar),
  :deep(.genesis-docs-example__code-bar),
  :deep(.genesis-docs-example-tabs__bar) {
    background: var(--v0-glass-surface);
    backdrop-filter: blur(12px);
  }

  .docs-genesis-example-pane {
    position: relative;
  }

  .docs-genesis-example-pane__actions {
    position: absolute;
    top: 0.75rem;
    inset-inline-end: 0.75rem;
    z-index: 10;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .docs-genesis-example-pane:hover .docs-genesis-example-pane__actions,
  .docs-genesis-example-pane:focus-within .docs-genesis-example-pane__actions {
    opacity: 1;
  }

  @media (max-width: 767px) {
    .docs-genesis-example-pane__actions {
      opacity: 1;
    }
  }

  .docs-genesis-example-pane--wrap :deep(.docs-genesis-shiki-block pre),
  .docs-genesis-example-pane--wrap :deep(.docs-genesis-shiki-block pre code) {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
