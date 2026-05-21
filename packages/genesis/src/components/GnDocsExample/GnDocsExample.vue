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
    /**
     * Scope a v0 theme to the preview content. Forwarded to GnDocsExamplePreview;
     * applies `data-theme="<name>"` to the panel so the example renders in the
     * named v0 theme (e.g., "dark", "corporateIndigo"), independent of the page.
     */
    theme?: string
    /** Show "open in playground" action button on multi-file tab toolbar */
    showPlayground?: boolean
    /** Show "open in bin" action button on multi-file tab toolbar */
    showBin?: boolean
  }

</script>

<script setup lang="ts">
  // Utilities
  import { shallowRef, toRef, useId, useTemplateRef } from 'vue'

  // Components
  import { GnDocsExampleActions } from '../GnDocsExampleActions'
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
    theme,
    showPlayground = false,
    showBin = false,
  } = defineProps<GnDocsExampleProps>()

  const emit = defineEmits<{
    reset: []
    combine: [combined: boolean]
    playground: [files: GnDocsExampleFile[]]
    bin: [files: GnDocsExampleFile[]]
  }>()

  const uid = useId()
  const showCode = shallowRef(false)
  const peekExpanded = shallowRef(false)

  const previewRef = useTemplateRef<InstanceType<typeof GnDocsExamplePreview>>('preview')

  const hasMultipleFiles = toRef(() => (files?.length ?? 0) > 1)
  const hasCode = toRef(() => Boolean(code || files?.length))

  function toggleCode () {
    showCode.value = !showCode.value
  }

  function onReset () {
    previewRef.value?.reset()
    emit('reset')
  }

  function onCombine (combined: boolean) {
    emit('combine', combined)
  }

  function onPlayground (list: GnDocsExampleFile[]) {
    emit('playground', list)
  }

  function onBin (list: GnDocsExampleFile[]) {
    emit('bin', list)
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
      v-if="title"
      :anchor-id="id"
      :collapse
      :title
    />

    <GnDocsExamplePreview
      ref="preview"
      :disable-resize
      :show-width-indicator="!hideWidthIndicator"
      :theme
    >
      <slot />

      <template v-if="$slots.decoration" #decoration>
        <slot name="decoration" />
      </template>
    </GnDocsExamplePreview>

    <div v-if="hasCode && !peek" class="genesis-docs-example__toggle-bar">
      <button
        :aria-controls="`${uid}-code`"
        :aria-expanded="showCode"
        class="genesis-docs-example__toggle"
        type="button"
        @click="toggleCode"
      >
        {{ showCode ? 'Hide code' : 'Show code' }}

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
        :show-bin
        :show-playground
        @bin="onBin"
        @combine="onCombine"
        @playground="onPlayground"
        @reset="onReset"
      >
        <template v-if="$slots.code" #default="{ code: paneCode, combined: paneCombined, file: paneFile, language: paneLanguage }">
          <slot
            :code="paneCode"
            :combined="paneCombined"
            :file="paneFile"
            :language="paneLanguage"
            name="code"
          />
        </template>

        <template v-if="$slots['reset-icon']" #reset-icon>
          <slot name="reset-icon" />
        </template>

        <template v-if="$slots['playground-icon']" #playground-icon>
          <slot name="playground-icon" />
        </template>

        <template v-if="$slots['bin-icon']" #bin-icon>
          <slot name="bin-icon" />
        </template>

        <template v-if="$slots['combine-icon']" #combine-icon>
          <slot name="combine-icon" />
        </template>

        <template v-if="$slots['split-icon']" #split-icon>
          <slot name="split-icon" />
        </template>
      </GnDocsExampleTabs>

      <template v-else-if="code">
        <div v-if="!peek" class="genesis-docs-example__code-bar">
          <span v-if="fileName" class="genesis-docs-example__code-filename">
            {{ fileName }}
          </span>

          <GnDocsExampleActions label="Example actions">
            <button
              aria-label="Reset example"
              title="Reset example"
              type="button"
              @click="onReset"
            >
              <slot name="reset-icon">
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                </svg>
              </slot>
            </button>
          </GnDocsExampleActions>
        </div>

        <GnDocsExampleCode
          v-model:expanded="peekExpanded"
          :code
          :file-name
          hide-filename
          hide-peek-toggle
          :language
          :peek
          :peek-lines
        >
          <template v-if="$slots.code" #default="{ code: paneCode, language: paneLanguage }">
            <slot
              :code="paneCode"
              :combined="false"
              :file="undefined"
              :language="paneLanguage"
              name="code"
            />
          </template>
        </GnDocsExampleCode>
      </template>
    </div>

    <GnDocsExamplePeek
      v-if="peek && !hasMultipleFiles && hasCode"
      v-model:expanded="peekExpanded"
    />
  </div>
</template>

<style scoped>
  .genesis-docs-example {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    border-radius: 0.5rem;
    background: var(--v0-surface, #fff);
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-docs-example__toggle-bar {
    position: sticky;
    top: var(--gn-docs-example-sticky-top, 0);
    z-index: 2;
    border-top: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    background: var(--v0-surface-tint, var(--v0-surface, #f5f5f8));
  }

  .genesis-docs-example > *:first-child:not(.genesis-docs-example-peek) {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .genesis-docs-example > *:nth-last-child(1 of :not(.genesis-docs-example-peek)) {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .genesis-docs-example > *:nth-last-child(1 of :not(.genesis-docs-example-peek)) .genesis-docs-example__toggle {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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
    background: var(--v0-surface, #fff);
  }

  .genesis-docs-example__meta {
    margin-inline-start: auto;
    color: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
  }

  .genesis-docs-example__code {
    overflow: clip;
    border-top: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
  }

  .genesis-docs-example__code-bar {
    position: sticky;
    top: calc(var(--gn-docs-example-sticky-top, 0px) + var(--gn-docs-example-toggle-h, 45px));
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--v0-surface, #fff);
    border-bottom: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    min-height: 3rem;
  }

  .genesis-docs-example__code-filename {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding-inline: 0.5rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--v0-on-primary, #fff);
    background: var(--v0-primary, #5f3aed);
    border-radius: 0.25rem;
    white-space: nowrap;
  }
</style>
