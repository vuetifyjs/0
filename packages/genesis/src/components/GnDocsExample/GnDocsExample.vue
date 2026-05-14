<script lang="ts">
  // Types
  import type { GnDocsExampleFile } from '../GnDocsExampleTabs'

  export interface GnDocsExampleProps {
    /** Anchor id for deep linking */
    id?: string
    /** Single-file code body */
    code?: string
    /** Language for single-file mode */
    language?: string
    /** Filename for single-file mode */
    fileName?: string
    /** Files for multi-file mode (overrides single-file code) */
    files?: GnDocsExampleFile[]
    /** Display order for files (indices match files array) */
    fileOrders?: (number | undefined)[]
    /** Description title rendered in the header */
    title?: string
    /** Enable description collapse toggle */
    collapse?: boolean
    /** Peek mode: code is truncated below the preview with an expand button */
    peek?: boolean
    /** Visible rows when peeking */
    peekLines?: number
    /** Disable the splitter resize affordance */
    disableResize?: boolean
    /** Hide the splitter drag-width indicator */
    hideWidthIndicator?: boolean
  }

</script>

<script setup lang="ts">
  // Utilities
  import { shallowRef, toRef, useId, useSlots, useTemplateRef } from 'vue'

  // Components
  import { GnDocsExampleCode } from '../GnDocsExampleCode'
  import { GnDocsExampleDescription } from '../GnDocsExampleDescription'
  import { GnDocsExamplePeek } from '../GnDocsExamplePeek'
  import { GnDocsExamplePreview } from '../GnDocsExamplePreview'
  import { GnDocsExampleTabs } from '../GnDocsExampleTabs'

  defineOptions({ name: 'GnDocsExample' })

  const {
    id,
    code,
    language = 'vue',
    fileName,
    files,
    fileOrders,
    title,
    collapse = false,
    peek = false,
    peekLines = 6,
    disableResize = false,
    hideWidthIndicator = false,
  } = defineProps<GnDocsExampleProps>()

  const emit = defineEmits<{
    reset: []
    playground: [files: GnDocsExampleFile[]]
    bin: [files: GnDocsExampleFile[]]
    combine: [combined: boolean]
  }>()

  const slots = useSlots()
  const uid = useId()
  const showCode = shallowRef(false)
  const peekExpanded = shallowRef(false)

  const previewRef = useTemplateRef<InstanceType<typeof GnDocsExamplePreview>>('preview')

  const hasMultipleFiles = toRef(() => (files?.length ?? 0) > 1)
  const hasCode = toRef(() => Boolean(code || files?.length))
  const hasDescription = toRef(() => Boolean(slots.description || title))

  function toggleCode () {
    showCode.value = !showCode.value
  }

  function onReset () {
    previewRef.value?.reset()
    emit('reset')
  }

  function onPlayground (list: GnDocsExampleFile[]) {
    emit('playground', list)
  }

  function onBin (list: GnDocsExampleFile[]) {
    emit('bin', list)
  }

  function onCombine (combined: boolean) {
    emit('combine', combined)
  }
</script>

<template>
  <div
    :id
    class="genesis-docs-example"
    :data-expanded="showCode || undefined"
    :data-peek="peek || undefined"
  >
    <GnDocsExampleDescription
      v-if="hasDescription"
      :anchor-id="id"
      :collapse
      :title
    >
      <slot name="description" />
    </GnDocsExampleDescription>

    <GnDocsExamplePreview
      ref="preview"
      :disable-resize
      :show-width-indicator="!hideWidthIndicator"
    >
      <slot />
    </GnDocsExamplePreview>

    <div v-if="hasCode && !peek" class="genesis-docs-example__toggle-bar">
      <button
        :aria-controls="`${uid}-code`"
        :aria-expanded="showCode"
        class="genesis-docs-example__toggle"
        type="button"
        @click="toggleCode"
      >
        <slot :expanded="showCode" name="toggle">
          {{ showCode ? 'Hide code' : 'Show code' }}
        </slot>

        <span v-if="hasMultipleFiles" class="genesis-docs-example__meta">
          {{ files!.length }} file(s)
        </span>

        <span v-else-if="fileName || language" class="genesis-docs-example__meta">
          {{ fileName || language }}
        </span>
      </button>
    </div>

    <div
      v-if="(showCode || peek) && hasCode"
      :id="`${uid}-code`"
      class="genesis-docs-example__code"
    >
      <GnDocsExampleTabs
        v-if="hasMultipleFiles"
        :file-orders
        :files="files!"
        @bin="onBin"
        @combine="onCombine"
        @playground="onPlayground"
        @reset="onReset"
      />

      <GnDocsExampleCode
        v-else-if="code"
        v-model:expanded="peekExpanded"
        :code
        :file-name
        hide-peek-toggle
        :language
        :peek
        :peek-lines
      />
    </div>

    <GnDocsExamplePeek
      v-if="peek && !hasMultipleFiles && hasCode"
      v-model:expanded="peekExpanded"
    />
  </div>
</template>

<style scoped>
  .genesis-docs-example {
    --genesis-docs-example-border: color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    --genesis-docs-example-bg: var(--v0-surface, transparent);
    --genesis-docs-example-bg-tint: var(--v0-surface-tint, rgb(0 0 0 / 0.04));
    --genesis-docs-example-fg: var(--v0-on-surface, inherit);
    --genesis-docs-example-fg-muted: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));

    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--genesis-docs-example-border);
    border-radius: 0.5rem;
    background: var(--genesis-docs-example-bg);
    color: var(--genesis-docs-example-fg);
  }

  .genesis-docs-example__toggle-bar {
    border-top: 1px solid var(--genesis-docs-example-border);
    background: var(--genesis-docs-example-bg-tint);
  }

  .genesis-docs-example > *:first-child:not(.genesis-docs-example-peek) {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .genesis-docs-example > *:nth-last-child(1 of :not(.genesis-docs-example-peek)) {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .genesis-docs-example > *:nth-last-child(1 of :not(.genesis-docs-example-peek)) .genesis-docs-example__toggle {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .genesis-docs-example__toggle {
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

  .genesis-docs-example__toggle:hover {
    background: var(--genesis-docs-example-bg);
  }

  .genesis-docs-example__meta {
    margin-inline-start: auto;
    color: var(--genesis-docs-example-fg-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
  }

  .genesis-docs-example__code {
    overflow: hidden;
    border-top: 1px solid var(--genesis-docs-example-border);
  }
</style>
