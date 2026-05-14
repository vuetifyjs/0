<script lang="ts">
  export interface GnDocsExampleFile {
    name: string
    code: string
    language?: string
  }

  export interface GnDocsExampleTabsProps {
    /** Files to display in the tab list */
    files: GnDocsExampleFile[]
    /** Display order (indices match files array); files without order go last */
    fileOrders?: (number | undefined)[]
    /** Show reset action button */
    showReset?: boolean
    /** Show playground action button */
    showPlayground?: boolean
    /** Show bin action button */
    showBin?: boolean
    /** Show combine/split action button */
    showCombine?: boolean
  }
</script>

<script setup lang="ts">
  // Framework
  import { createOverflow, isUndefined, Tabs } from '@vuetify/v0'

  // Utilities
  import { computed, useTemplateRef, watch } from 'vue'

  // Types
  import type { ComponentPublicInstance } from 'vue'

  // Components
  import { GnDocsExampleCode } from '../GnDocsExampleCode'

  defineOptions({ name: 'GnDocsExampleTabs' })

  const {
    files,
    fileOrders,
    showReset = true,
    showPlayground = true,
    showBin = true,
    showCombine = true,
  } = defineProps<GnDocsExampleTabsProps>()

  const emit = defineEmits<{
    reset: []
    playground: [files: GnDocsExampleFile[]]
    bin: [files: GnDocsExampleFile[]]
    combine: [combined: boolean]
  }>()

  const selected = defineModel<string>('selected')
  const combined = defineModel<boolean>('combined', { default: false })

  const displayFiles = computed(() => {
    if (!fileOrders?.some(o => !isUndefined(o))) return files
    return files
      .map((f, i) => ({ file: f, order: fileOrders[i] ?? Infinity }))
      .toSorted((a, b) => a.order - b.order)
      .map(x => x.file)
  })

  watch(displayFiles, list => {
    if (list?.length && !selected.value) selected.value = list[0]?.name
  }, { immediate: true })

  // Overflow detection for tabs
  const tabsContainer = useTemplateRef<HTMLElement>('tabs-container')
  const overflow = createOverflow({
    container: tabsContainer,
    gap: 4,
    reserved: 80,
  })

  const visibleCount = computed(() => {
    const list = displayFiles.value
    if (!list?.length) return 0
    const cap = overflow.capacity.value
    if (cap === Infinity || cap >= list.length) return list.length
    return Math.max(1, cap - 1)
  })

  const hiddenFiles = computed(() => {
    const list = displayFiles.value
    if (!list?.length) return []
    return list.slice(visibleCount.value)
  })

  const hiddenSelected = computed(() => hiddenFiles.value.some(f => f.name === selected.value))

  function onReset () {
    emit('reset')
  }

  function onPlayground () {
    emit('playground', displayFiles.value)
  }

  function onBin () {
    emit('bin', displayFiles.value)
  }

  function onCombine () {
    combined.value = !combined.value
    emit('combine', combined.value)
  }
</script>

<template>
  <div
    class="genesis-docs-example-tabs"
    :data-combined="combined || undefined"
  >
    <Tabs.Root v-model="selected">
      <div
        ref="tabs-container"
        class="genesis-docs-example-tabs__bar"
      >
        <template v-if="!combined">
          <Tabs.List class="genesis-docs-example-tabs__list" label="Example files">
            <Tabs.Item
              v-for="(file, i) in displayFiles"
              :key="file.name"
              :ref="(el: unknown) => overflow.measure(i, (el as ComponentPublicInstance)?.$el)"
              class="genesis-docs-example-tabs__tab"
              :data-hidden="i >= visibleCount || undefined"
              :data-selected="file.name === selected || undefined"
              :value="file.name"
            >
              {{ file.name }}
            </Tabs.Item>
          </Tabs.List>

          <select
            v-if="hiddenFiles.length > 0"
            aria-label="Additional files"
            class="genesis-docs-example-tabs__overflow"
            :data-selected="hiddenSelected || undefined"
            :value="hiddenSelected ? selected : ''"
            @change="selected = ($event.target as HTMLSelectElement).value"
          >
            <option disabled value="">+{{ hiddenFiles.length }} more</option>
            <option v-for="f in hiddenFiles" :key="f.name" :value="f.name">{{ f.name }}</option>
          </select>
        </template>

        <span v-else class="genesis-docs-example-tabs__all">All files</span>

        <div class="genesis-docs-example-tabs__actions">
          <slot name="actions" />

          <button
            v-if="showReset"
            class="genesis-docs-example-tabs__action"
            title="Reset example"
            type="button"
            @click="onReset"
          >
            <slot name="reset-icon">Reset</slot>
          </button>

          <button
            v-if="showPlayground"
            class="genesis-docs-example-tabs__action"
            title="Open in Playground"
            type="button"
            @click="onPlayground"
          >
            <slot name="playground-icon">Play</slot>
          </button>

          <button
            v-if="showBin"
            class="genesis-docs-example-tabs__action"
            title="Open in Bin"
            type="button"
            @click="onBin"
          >
            <slot name="bin-icon">Bin</slot>
          </button>

          <button
            v-if="showCombine"
            class="genesis-docs-example-tabs__action"
            :title="combined ? 'Split files' : 'Combine files'"
            type="button"
            @click="onCombine"
          >
            <slot :combined name="combine-icon">{{ combined ? 'Split' : 'Combine' }}</slot>
          </button>
        </div>
      </div>

      <template v-if="!combined">
        <Tabs.Panel
          v-for="file in displayFiles"
          :key="file.name"
          :value="file.name"
        >
          <slot :file name="panel">
            <GnDocsExampleCode
              :code="file.code"
              :language="file.language || file.name.split('.').pop() || 'text'"
            />
          </slot>
        </Tabs.Panel>
      </template>

      <template v-else>
        <slot name="combined">
          <GnDocsExampleCode
            v-for="file in displayFiles"
            :key="file.name"
            :code="file.code"
            :file-name="file.name"
            :language="file.language || file.name.split('.').pop() || 'text'"
          />
        </slot>

        <!-- In combined view we keep filenames so users can tell the files apart -->
      </template>
    </Tabs.Root>
  </div>
</template>

<style scoped>
  .genesis-docs-example-tabs {
    --genesis-docs-example-tabs-bar-bg: var(--v0-surface, transparent);
    --genesis-docs-example-tabs-tab-bg: var(--v0-surface-tint, rgb(0 0 0 / 0.04));
    --genesis-docs-example-tabs-tab-fg: var(--v0-on-surface-tint, var(--v0-on-surface, inherit));
    --genesis-docs-example-tabs-tab-active-bg: var(--v0-primary, currentcolor);
    --genesis-docs-example-tabs-tab-active-fg: var(--v0-on-primary, white);
    --genesis-docs-example-tabs-border: color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
    --genesis-docs-example-tabs-fg-muted: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));

    display: flex;
    flex-direction: column;
  }

  .genesis-docs-example-tabs__bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--genesis-docs-example-tabs-bar-bg);
    border-top: 1px solid var(--genesis-docs-example-tabs-border);
    min-height: 3rem;
  }

  .genesis-docs-example-tabs__list {
    display: contents;
  }

  .genesis-docs-example-tabs__tab {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    white-space: nowrap;
    background: var(--genesis-docs-example-tabs-tab-bg);
    color: var(--genesis-docs-example-tabs-tab-fg);
    border: 1px solid var(--genesis-docs-example-tabs-border);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-docs-example-tabs__tab:hover {
    background: color-mix(in srgb, var(--genesis-docs-example-tabs-tab-bg), currentcolor 8%);
  }

  .genesis-docs-example-tabs__tab[data-selected] {
    background: var(--genesis-docs-example-tabs-tab-active-bg);
    color: var(--genesis-docs-example-tabs-tab-active-fg);
    border-color: transparent;
  }

  .genesis-docs-example-tabs__tab[data-hidden] {
    visibility: hidden;
    position: absolute;
  }

  .genesis-docs-example-tabs__overflow {
    margin-inline-start: 0.25rem;
    height: 30px;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    background: var(--genesis-docs-example-tabs-tab-bg);
    color: var(--genesis-docs-example-tabs-tab-fg);
    border: 1px solid var(--genesis-docs-example-tabs-border);
    cursor: pointer;
  }

  .genesis-docs-example-tabs__all {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--genesis-docs-example-tabs-fg-muted);
    border: 1px solid transparent;
  }

  .genesis-docs-example-tabs__actions {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .genesis-docs-example-tabs__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 0.5rem;
    background: transparent;
    color: var(--genesis-docs-example-tabs-fg-muted);
    border: none;
    border-radius: 0.25rem;
    font: inherit;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-docs-example-tabs__action:hover {
    background: var(--genesis-docs-example-tabs-tab-bg);
    color: var(--v0-on-surface, inherit);
  }
</style>
