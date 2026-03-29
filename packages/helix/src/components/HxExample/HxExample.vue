<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { createOverflow, isUndefined, Tabs } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { ComponentPublicInstance } from 'vue'

  export interface HxExampleFile {
    name: string
    code: string
    language?: string
  }

  export interface HxExampleProps extends V0PaperProps {
    /** Anchor id for deep linking */
    id?: string
    /** Files to display in the code pane */
    files?: HxExampleFile[]
    /** Display order for files (indices match files array) */
    fileOrders?: (number | undefined)[]
    /** Single-file code string */
    code?: string
    /** Language for single-file mode */
    language?: string
    /** File name display */
    fileName?: string
    /** Example title */
    title?: string
    /** Enable peek mode (truncated with expand) */
    peek?: boolean
    /** Number of visible lines in peek mode */
    peekLines?: number
  }
</script>

<script setup lang="ts">
  // Utilities
  import { computed, ref, shallowRef, toRef, useId, useSlots, watch } from 'vue'

  defineOptions({ name: 'HxExample' })

  const {
    id,
    files,
    fileOrders,
    code,
    language = 'vue',
    fileName,
    title,
    peek = false,
    peekLines = 6,
    ...paperProps
  } = defineProps<HxExampleProps>()

  const slots = useSlots()
  const uid = useId()
  const showCode = ref(false)
  const peekExpanded = ref(false)
  const combinedView = ref(false)

  // Sort files by display order if fileOrders specified
  const displayFiles = computed(() => {
    if (!files?.length || !fileOrders?.some(o => !isUndefined(o))) return files
    return files
      .map((f, i) => ({ file: f, order: fileOrders![i] ?? Infinity }))
      .toSorted((a, b) => a.order - b.order)
      .map(x => x.file)
  })

  const hasMultipleFiles = toRef(() => displayFiles.value && displayFiles.value.length > 1)
  const selectedTab = ref<string>()
  const hasDescription = toRef(() => !!slots.description)

  watch(() => displayFiles.value, f => {
    if (f?.length && !selectedTab.value) {
      selectedTab.value = f[0]?.name
    }
  }, { immediate: true })

  // Overflow detection for file tabs
  const tabsContainer = shallowRef<HTMLElement>()
  const overflow = createOverflow({
    container: tabsContainer,
    gap: 4,
    reserved: 80,
  })

  const visibleCount = computed(() => {
    if (!displayFiles.value?.length) return 0
    const cap = overflow.capacity.value
    if (cap === Infinity || cap >= displayFiles.value.length) {
      return displayFiles.value.length
    }
    return Math.max(1, cap - 1)
  })

  const hiddenFiles = computed(() => {
    if (!displayFiles.value?.length) return []
    return displayFiles.value.slice(visibleCount.value)
  })

  // Loading state tracking
  const hasLoadedOnce = shallowRef(false)
  const showSkeleton = toRef(() =>
    showCode.value && hasMultipleFiles.value && !hasLoadedOnce.value,
  )

  function onLoaded () {
    hasLoadedOnce.value = true
  }

  function toggleCode () {
    showCode.value = !showCode.value
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :id
    as="div"
    class="helix-example"
  >
    <div class="helix-example__container">
      <!-- Description slot -->
      <slot v-if="hasDescription || title" name="description" />

      <!-- Preview slot -->
      <div class="helix-example__preview">
        <slot />
      </div>

      <!-- Code toggle button -->
      <div v-if="!peek && (code || displayFiles?.length)" class="helix-example__toggle-bar">
        <button
          :aria-controls="`${uid}-code`"
          :aria-expanded="showCode"
          class="helix-example__toggle-btn"
          type="button"
          @click="toggleCode"
        >
          <slot :has-code="showCode" name="toggle-icon">
            {{ showCode ? 'Hide code' : 'Show code' }}
          </slot>

          <span v-if="hasMultipleFiles" class="helix-example__file-count">
            {{ displayFiles!.length }} file(s)
          </span>
          <span v-else-if="fileName" class="helix-example__file-count">{{ fileName }}</span>
        </button>
      </div>

      <!-- Single file code display -->
      <div
        v-if="(showCode || peek) && code && !hasMultipleFiles"
        :id="`${uid}-code`"
      >
        <HxExampleCode
          v-model:expanded="peekExpanded"
          :code
          :language
          :peek
          :peek-height="peekLines * 1.5 + 1"
        />
      </div>

      <!-- Multi-file skeleton -->
      <slot
        v-if="showSkeleton"
        name="skeleton"
      />

      <!-- Multi-file tabs -->
      <div
        v-if="showCode && hasMultipleFiles"
        :class="showSkeleton && 'helix-example__hidden'"
      >
        <Tabs.Root v-model="selectedTab">
          <!-- Tab list with overflow -->
          <div
            :ref="(el: unknown) => { tabsContainer = (el as HTMLElement) }"
            class="helix-example__tabs"
          >
            <template v-if="!combinedView">
              <Tabs.List class="helix-example__tab-list" label="Example files">
                <Tabs.Item
                  v-for="(f, i) in displayFiles"
                  :key="f.name"
                  :ref="(el: unknown) => overflow.measure(i, (el as ComponentPublicInstance)?.$el)"
                  class="helix-example__tab"
                  :data-hidden="i >= visibleCount || undefined"
                  :data-selected="f.name === selectedTab || undefined"
                  :value="f.name"
                >
                  {{ f.name }}
                </Tabs.Item>
              </Tabs.List>

              <!-- Dropdown for hidden files -->
              <select
                v-if="hiddenFiles.length > 0"
                aria-label="Additional files"
                class="helix-example__tab-overflow"
                :value="hiddenFiles.some(f => f.name === selectedTab) ? selectedTab : ''"
                @change="selectedTab = ($event.target as HTMLSelectElement).value"
              >
                <option disabled value="">+{{ hiddenFiles.length }} more</option>
                <option v-for="f in hiddenFiles" :key="f.name" :value="f.name">
                  {{ f.name }}
                </option>
              </select>
            </template>

            <span v-else class="helix-example__tab-all">
              All files
            </span>

            <div class="helix-example__tab-actions">
              <slot name="tab-actions" />

              <button
                class="helix-example__tab-action-btn"
                :title="combinedView ? 'Split files' : 'Combine files'"
                type="button"
                @click="combinedView = !combinedView"
              >
                <slot :combined="combinedView" name="combine-icon">
                  {{ combinedView ? 'Split' : 'Combine' }}
                </slot>
              </button>
            </div>
          </div>

          <!-- Tabbed panels (single file view) -->
          <template v-if="!combinedView">
            <Tabs.Panel
              v-for="f in displayFiles"
              :key="f.name"
              :value="f.name"
            >
              <HxExampleCode
                :code="f.code"
                :language="f.language || f.name.split('.').pop() || 'text'"
                @vue:mounted="onLoaded"
              />
            </Tabs.Panel>
          </template>

          <!-- Combined view (all files stacked) -->
          <template v-else>
            <HxExampleCode
              v-for="f in displayFiles"
              :key="f.name"
              :code="f.code"
              :language="f.language || f.name.split('.').pop() || 'text'"
              @vue:mounted="onLoaded"
            />
          </template>
        </Tabs.Root>
      </div>
    </div>

    <!-- Peek expand button -->
    <slot
      v-if="peek && !hasMultipleFiles"
      :expanded="peekExpanded"
      name="peek-button"
      :toggle="() => peekExpanded = !peekExpanded"
    />
  </V0Paper>
</template>

<style scoped>
  .helix-example {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .helix-example__container {
    overflow: hidden;
  }

  .helix-example__preview {
    padding: 1.5rem;
  }

  .helix-example__toggle-bar {
    border-top: 1px solid var(--helix-example-border, currentcolor);
  }

  .helix-example__toggle-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .helix-example__file-count {
    margin-inline-start: auto;
    opacity: 0.6;
    font-family: monospace;
    font-size: 0.8125rem;
  }

  .helix-example__hidden {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }

  .helix-example__tabs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    min-height: 3rem;
  }

  .helix-example__tab-list {
    display: contents;
  }

  .helix-example__tab {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    white-space: nowrap;
    cursor: pointer;
  }

  .helix-example__tab[data-hidden] {
    visibility: hidden;
    position: absolute;
  }

  .helix-example__tab-overflow {
    margin-inline-start: 0.25rem;
    height: 30px;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .helix-example__tab-all {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0.6;
  }

  .helix-example__tab-actions {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .helix-example__tab-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    background: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
