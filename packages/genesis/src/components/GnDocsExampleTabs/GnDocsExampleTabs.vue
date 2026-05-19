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
  import { GnDocsExampleActions } from '../GnDocsExampleActions'
  import { GnDocsExampleCode } from '../GnDocsExampleCode'
  import { GnDocsExamplePanel } from '../GnDocsExamplePanel'

  defineOptions({ name: 'GnDocsExampleTabs' })

  const {
    files,
    fileOrders,
    showReset = true,
    showCombine = true,
  } = defineProps<GnDocsExampleTabsProps>()

  const emit = defineEmits<{
    reset: []
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

  // Overflow detection for tabs. `reserved` budgets space for the actions toolbar
  // on the right (2 icon buttons run ~80px; bump if your toolbar is larger).
  const tabsContainer = useTemplateRef<HTMLElement>('tabs-container')
  const overflow = createOverflow({
    container: tabsContainer,
    gap: 4,
    reserved: 90,
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

        <GnDocsExampleActions label="Example actions">
          <button
            v-if="showReset"
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

          <button
            v-if="showCombine"
            :aria-label="combined ? 'Split files' : 'Combine files'"
            :title="combined ? 'Split files' : 'Combine files'"
            type="button"
            @click="onCombine"
          >
            <slot v-if="combined" name="split-icon">
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
              </svg>
            </slot>

            <slot v-else name="combine-icon">
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.59,5.41L15.17,4L12,7.17L8.83,4L7.41,5.41L12,10M7.41,18.59L8.83,20L12,16.83L15.17,20L16.58,18.59L12,14L7.41,18.59Z" />
              </svg>
            </slot>
          </button>
        </GnDocsExampleActions>
      </div>

      <template v-if="!combined">
        <Tabs.Panel
          v-for="file in displayFiles"
          :key="file.name"
          :value="file.name"
        >
          <GnDocsExamplePanel :file>
            <slot :file>
              <GnDocsExampleCode
                :code="file.code"
                :language="file.language || file.name.split('.').pop() || 'text'"
              />
            </slot>
          </GnDocsExamplePanel>
        </Tabs.Panel>
      </template>

      <template v-else>
        <GnDocsExamplePanel
          v-for="file in displayFiles"
          :key="file.name"
          :file
        >
          <slot :file>
            <GnDocsExampleCode
              :code="file.code"
              :file-name="file.name"
              :language="file.language || file.name.split('.').pop() || 'text'"
            />
          </slot>
        </GnDocsExamplePanel>
      </template>
    </Tabs.Root>
  </div>
</template>

<style scoped>
  .genesis-docs-example-tabs {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .genesis-docs-example-tabs__bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--gn-surface);
    border-top: 1px solid var(--gn-divider);
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
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface);
    border: 1px solid var(--gn-divider);
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;
  }

  .genesis-docs-example-tabs__tab:hover {
    background: color-mix(in srgb, var(--gn-surface-tint), currentcolor 8%);
  }

  .genesis-docs-example-tabs__tab[data-selected] {
    background: var(--gn-accent);
    color: var(--gn-on-accent);
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
    background: var(--gn-surface-tint);
    color: var(--gn-on-surface);
    border: 1px solid var(--gn-divider);
    cursor: pointer;
  }

  .genesis-docs-example-tabs__all {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gn-on-surface-variant);
    border: 1px solid transparent;
  }
</style>
