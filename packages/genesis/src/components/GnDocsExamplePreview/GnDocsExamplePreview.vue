<script lang="ts">
  export interface GnDocsExamplePreviewProps {
    /** Minimum panel size (passed to Splitter.Panel). */
    minSize?: string | number
    /** Show drag-width indicator in the corner while resizing. */
    showWidthIndicator?: boolean
    /** Disable the splitter resize affordance entirely. */
    disableResize?: boolean
  }
</script>

<script setup lang="ts">
  // Framework
  import { Splitter, useElementSize } from '@vuetify/v0'

  // Utilities
  import { shallowRef, useTemplateRef } from 'vue'

  defineOptions({ name: 'GnDocsExamplePreview' })

  const {
    minSize = '348px',
    showWidthIndicator = true,
    disableResize = false,
  } = defineProps<GnDocsExamplePreviewProps>()

  const resetKey = shallowRef(0)
  const previewContent = useTemplateRef<HTMLElement>('preview-content')
  const { width } = useElementSize(previewContent)

  function reset () {
    resetKey.value++
  }

  defineExpose({ reset })
</script>

<template>
  <div class="genesis-docs-example-preview">
    <div v-if="disableResize" ref="preview-content" class="genesis-docs-example-preview__panel">
      <slot />
    </div>

    <Splitter.Root v-else :key="resetKey" v-slot="{ isDragging }" class="genesis-docs-example-preview__splitter">
      <Splitter.Panel :default-size="100" :min-size>
        <template #default="{ attrs }">
          <div
            ref="preview-content"
            v-bind="attrs"
            class="genesis-docs-example-preview__panel"
          >
            <slot :is-dragging :width />

            <Transition
              enter-active-class="genesis-docs-example-preview__indicator-enter-active"
              enter-from-class="genesis-docs-example-preview__indicator-enter-from"
              leave-active-class="genesis-docs-example-preview__indicator-leave-active"
              leave-to-class="genesis-docs-example-preview__indicator-leave-to"
            >
              <div
                v-if="showWidthIndicator && isDragging"
                aria-hidden="true"
                class="genesis-docs-example-preview__indicator"
              >
                {{ Math.round(width) }}px
              </div>
            </Transition>
          </div>
        </template>
      </Splitter.Panel>

      <Splitter.Handle v-slot="{ state, attrs }" label="Resize example" renderless>
        <div
          v-bind="attrs"
          class="genesis-docs-example-preview__handle"
          :data-collapsed="attrs['aria-valuenow'] >= attrs['aria-valuemax'] || undefined"
          :data-state="state"
        >
          <span class="genesis-docs-example-preview__handle-grip" :data-state="state">
            <svg
              aria-hidden="true"
              height="14"
              viewBox="0 0 4 14"
              width="4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="2" cy="2" r="1" />
              <circle cx="2" cy="7" r="1" />
              <circle cx="2" cy="12" r="1" />
            </svg>
          </span>
        </div>
      </Splitter.Handle>

      <Splitter.Panel :default-size="0" :min-size="0" />
    </Splitter.Root>
  </div>
</template>

<style scoped>
  .genesis-docs-example-preview {
    position: relative;
    padding: 0.5rem;
    background: var(--v0-surface-tint, var(--v0-surface, #f5f5f8));
    color: var(--v0-on-surface, #1a1c1e);
  }

  .genesis-docs-example-preview__splitter {
    position: relative;
    width: 100%;
  }

  .genesis-docs-example-preview__panel {
    position: relative;
    min-width: 0;
    padding: 1.5rem;
    background: var(--v0-surface, #fff);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .genesis-docs-example-preview__handle {
    position: relative;
    flex-shrink: 0;
    width: 0.25rem;
    margin-inline: 0.25rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    transition: background-color 0.15s;
    cursor: col-resize;
  }

  .genesis-docs-example-preview__handle[data-collapsed] {
    background: transparent;
  }

  .genesis-docs-example-preview__handle:hover,
  .genesis-docs-example-preview__handle[data-state='drag'] {
    background: var(--v0-primary, #5f3aed);
  }

  .genesis-docs-example-preview__handle[data-state='drag'] {
    cursor: grabbing;
  }

  .genesis-docs-example-preview__handle-grip {
    position: absolute;
    inset-inline-start: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 1rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    background: var(--v0-surface-tint, var(--v0-surface, #f5f5f8));
    color: var(--v0-on-surface, #1a1c1e);
    border: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
  }

  .genesis-docs-example-preview__handle-grip[data-state='drag'] {
    cursor: grabbing;
  }

  .genesis-docs-example-preview__handle-grip svg {
    fill: currentcolor;
  }

  .genesis-docs-example-preview__indicator {
    position: absolute;
    top: 0.5rem;
    inset-inline-end: 0.5rem;
    z-index: 2;
    padding: 0.125rem 0.375rem;
    background: var(--v0-on-surface, #1a1c1e);
    color: var(--v0-surface, #fff);
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    line-height: 1;
    pointer-events: none;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
  }

  .genesis-docs-example-preview__indicator-enter-active,
  .genesis-docs-example-preview__indicator-leave-active {
    transition: opacity 0.15s;
  }

  .genesis-docs-example-preview__indicator-enter-from,
  .genesis-docs-example-preview__indicator-leave-to {
    opacity: 0;
  }
</style>
