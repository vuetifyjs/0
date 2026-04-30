<script setup lang="ts">
  // Framework
  import { createOverflow, isUndefined, Select, Splitter, Tabs, useElementSize } from '@vuetify/v0'

  // Components
  import DocsSkeleton from './DocsSkeleton.vue'

  // Composables
  import { getMultiFileBinUrl } from '@/composables/bin'
  import { useExamples } from '@/composables/useExamples'
  import { usePlayground } from '@/composables/usePlayground'

  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed, ref, shallowRef, toRef, useId, useSlots, useTemplateRef, watch } from 'vue'

  // Types
  import type DocsExampleCodePaneType from './DocsExampleCodePane.vue'
  import type { ComponentPublicInstance } from 'vue'

  export interface ExampleFile {
    name: string
    code: string
    language?: string
  }

  const {
    file,
    filePath,
    filePaths,
    fileOrders,
    title,
    id,
    code,
    collapse,
    files,
    imports,
    peek,
    peekLines = 6,
  } = defineProps<{
    file?: string
    filePath?: string
    filePaths?: string[]
    fileOrders?: (number | undefined)[]
    title?: string
    id?: string
    code?: string
    collapse?: boolean
    files?: ExampleFile[]
    imports?: Record<string, string>
    peek?: boolean
    peekLines?: number
  }>()

  // Auto-resolve component and code from filePath(s)
  const examples = useExamples()
  const auto = computed(() => {
    if (filePaths?.length) return examples.resolveMultiple(filePaths)
    if (filePath) return examples.resolve(filePath)
    return null
  })

  const resolvedCode = toRef(() =>
    code ?? ('code' in (auto.value || {}) ? (auto.value as { code?: string }).code : undefined),
  )
  const resolvedFiles = toRef(() =>
    files ?? ('files' in (auto.value || {}) ? (auto.value as { files?: ExampleFile[] }).files : undefined),
  )

  // Sort files by display order if fileOrders specified
  const displayFiles = computed(() => {
    const files = resolvedFiles.value
    if (!files?.length || !fileOrders?.some(o => !isUndefined(o))) return files
    return files
      .map((f, i) => ({ file: f, order: fileOrders![i] ?? Infinity }))
      .toSorted((a, b) => a.order - b.order)
      .map(x => x.file)
  })

  const slots = useSlots()
  const hasDescription = toRef(() => !!slots.description)
  const descriptionExpanded = ref(false)

  const anchorId = toRef(() => id ?? (title ? `example-${toKebab(title)}` : undefined))

  const uid = useId()
  const showCode = ref(false)
  const peekExpanded = ref(false)
  const combinedView = ref(false)
  const resetKey = shallowRef(0)

  // Multi-file support
  const hasMultipleFiles = toRef(() => displayFiles.value && displayFiles.value.length > 1)
  const selectedTab = ref<string>()

  watch(() => displayFiles.value, files => {
    if (files?.length && !selectedTab.value) {
      selectedTab.value = files[0]?.name
    }
  }, { immediate: true })

  // Overflow detection for file tabs
  const tabsContainer = useTemplateRef<HTMLElement>('tabs-container')
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

  // Preview width tracking for the resize indicator
  const previewContent = useTemplateRef<HTMLElement>('preview-content')
  const { width: previewWidth } = useElementSize(previewContent)

  // Code pane refs for triggering highlight
  const codePaneRefs = ref<Map<string, InstanceType<typeof DocsExampleCodePaneType>>>(new Map())
  const singleCodePane = useTemplateRef<InstanceType<typeof DocsExampleCodePaneType>>('single-code-pane')

  const isLoading = toRef(() => {
    if (hasMultipleFiles.value) {
      const pane = codePaneRefs.value.get(selectedTab.value ?? '')
      return pane?.isLoading ?? false
    }
    return singleCodePane.value?.isLoading ?? false
  })

  const hasHighlightedCode = toRef(() => {
    if (hasMultipleFiles.value) {
      const pane = codePaneRefs.value.get(selectedTab.value ?? '')
      return !!pane?.highlightedCode
    }
    return !!singleCodePane.value?.highlightedCode
  })

  const hasLoadedOnce = shallowRef(false)
  watch(hasHighlightedCode, val => {
    if (val) hasLoadedOnce.value = true
  })

  const showSkeleton = toRef(() =>
    showCode.value && hasMultipleFiles.value && !hasLoadedOnce.value,
  )

  function toggleCode () {
    showCode.value = !showCode.value
  }

  function onReset () {
    resetKey.value++
  }

  function setCodePaneRef (name: string, el: unknown) {
    if (el) {
      codePaneRefs.value.set(name, el as InstanceType<typeof DocsExampleCodePaneType>)
    } else {
      codePaneRefs.value.delete(name)
    }
  }

  const fileName = toRef(() =>
    file?.split('/').pop() || (filePath ? `${filePath.split('/').pop()}.vue` : ''),
  )

  const language = toRef(() => file?.split('.').pop() || 'vue')

  async function openAllInPlayground () {
    if (!displayFiles.value?.length) return
    const files = displayFiles.value.map(f => ({ name: f.name, code: f.code }))
    const url = await usePlayground(files, undefined, imports)
    window.open(url, '_blank')
  }

  async function openAllInBin () {
    if (!displayFiles.value?.length) return
    const files = displayFiles.value.map(f => ({ name: f.name, code: f.code, language: f.language }))
    const url = await getMultiFileBinUrl(files, title)
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="relative my-6" :class="peek && !hasMultipleFiles && 'mb-10'">
    <div class="border border-divider rounded-lg [&>*:first-child]:rounded-t-lg [&>*:last-child]:rounded-b-lg [&>*:last-child]:overflow-hidden">
      <!-- Description -->
      <DocsExampleDescription
        v-if="hasDescription || title"
        :anchor-id
        :collapse
        :title
      >
        <slot name="description" />
      </DocsExampleDescription>

      <!-- Preview -->
      <div class="relative p-2 bg-surface-tint">
        <AppDotGrid :coverage="60" :density="20" />

        <Splitter.Root :key="resetKey" v-slot="{ isDragging }" class="relative w-full">
          <Splitter.Panel
            class="bg-surface rounded-md overflow-hidden"
            :default-size="100"
            :min-size="20"
          >
            <template #default="{ attrs }">
              <div
                ref="preview-content"
                v-bind="attrs"
                class="relative min-w-0 p-6"
                :class="hasDescription && !descriptionExpanded && 'pt-8'"
              >
                <component :is="auto?.component" v-if="auto?.component" />
                <slot v-else />

                <Transition
                  enter-active-class="transition-opacity duration-150"
                  enter-from-class="opacity-0"
                  leave-active-class="transition-opacity duration-200"
                  leave-to-class="opacity-0"
                >
                  <div
                    v-show="isDragging"
                    aria-hidden="true"
                    class="absolute top-2 right-2 z-2 px-1.5 py-0.5 text-xs font-mono leading-none bg-on-surface text-surface rounded shadow pointer-events-none tabular-nums"
                  >
                    {{ Math.round(previewWidth) }}px
                  </div>
                </Transition>
              </div>
            </template>
          </Splitter.Panel>

          <Splitter.Handle v-slot="{ state, attrs }" label="Resize example" renderless>
            <div
              v-bind="attrs"
              class="relative shrink-0 w-1 mx-1 rounded-full transition-colors hover:bg-primary data-[state=drag]:bg-primary"
              :class="[
                state !== 'drag' && 'cursor-col-resize',
                attrs['aria-valuenow'] < attrs['aria-valuemax'] ? 'bg-divider' : 'bg-transparent',
              ]"
            >
              <span
                class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-1 w-4 h-6 rounded inline-flex items-center justify-center bg-surface text-on-surface border border-divider"
                :class="state === 'drag' ? 'cursor-grabbing' : 'cursor-grab'"
              >
                <AppIcon icon="drag-vertical" :size="16" />
              </span>
            </div>
          </Splitter.Handle>

          <Splitter.Panel :default-size="0" :min-size="0" />
        </Splitter.Root>
      </div>

      <!-- Code toggle button -->
      <div v-if="!peek && (resolvedCode || displayFiles?.length)" class="border-t border-divider bg-surface-tint">
        <button
          :aria-controls="`${uid}-code`"
          :aria-expanded="showCode"
          class="group w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors"
          :class="!showCode && 'hover:bg-surface'"
          type="button"
          @click="toggleCode"
        >
          <AppLoaderIcon v-if="isLoading" variant="orbit" />
          <AppIcon v-else-if="showCode && hasHighlightedCode" icon="chevron-up" :size="16" />
          <AppIcon v-else class="transition-colors group-hover:text-primary" icon="code" :size="16" />

          <span v-if="hasMultipleFiles" class="ml-auto opacity-60 font-mono text-[0.8125rem]">
            {{ displayFiles!.length }} file(s)
          </span>

          <span v-else-if="language" class="ml-auto opacity-60 font-mono text-[0.8125rem]">{{ language }}</span>
        </button>
      </div>

      <!-- Single-file toolbar (visible when code expanded, not in peek mode) -->
      <div
        v-if="showCode && resolvedCode && !hasMultipleFiles"
        class="flex items-center gap-2 px-3 py-3 bg-surface border-t border-divider min-h-12"
      >
        <span
          v-if="fileName"
          class="h-[30px] px-2 text-xs font-medium rounded whitespace-nowrap inline-flex items-center bg-primary text-on-primary border border-transparent"
        >
          {{ fileName }}
        </span>

        <div class="ml-auto flex items-center gap-1">
          <button
            class="size-[30px] rounded text-on-surface-variant hover:bg-surface-variant transition-colors inline-flex items-center justify-center"
            title="Reset example"
            type="button"
            @click="onReset"
          >
            <AppIcon icon="restart" :size="16" />
          </button>
        </div>
      </div>

      <!-- Single file code display -->
      <DocsExampleCodePane
        v-if="(showCode || peek) && resolvedCode && !hasMultipleFiles"
        :id="`${uid}-code`"
        ref="single-code-pane"
        v-model:expanded="peekExpanded"
        :code="resolvedCode"
        :file-name
        :language
        :peek
        :peek-lines
        :title="title || fileName"
      />

      <!-- Multi-file skeleton -->
      <div v-if="showSkeleton" class="border-t border-divider">
        <!-- Fake tab bar -->
        <div class="flex items-center gap-2 px-3 py-3 bg-surface border-b border-divider">
          <DocsSkeleton
            direction="row"
            gap="gap-2"
            height="h-[30px]"
            :lines="3"
            :widths="['w-24', 'w-20', 'w-28']"
          />
        </div>
        <!-- Fake code area -->
        <div class="p-4 bg-pre">
          <DocsSkeleton :lines="6" :widths="['w-1/4', 'w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-4/5']" />
        </div>
      </div>

      <!-- Multi-file tabs (invisible while skeleton shows, so code can load) -->
      <div
        v-if="showCode && hasMultipleFiles"
        :class="showSkeleton && 'invisible h-0 overflow-hidden'"
      >
        <Tabs.Root v-model="selectedTab">
          <!-- Tab list with overflow -->
          <div
            ref="tabs-container"
            class="flex items-center gap-2 px-3 py-3 bg-surface border-t border-divider min-h-12"
          >
            <template v-if="!combinedView">
              <Tabs.List class="contents" label="Example files">
                <Tabs.Item
                  v-for="(f, i) in displayFiles"
                  :key="f.name"
                  :ref="(el: unknown) => overflow.measure(i, (el as ComponentPublicInstance)?.$el)"
                  class="h-[30px] px-2 text-xs font-medium rounded whitespace-nowrap inline-flex items-center cursor-pointer"
                  :class="[
                    i >= visibleCount ? 'invisible absolute' : '',
                    f.name === selectedTab
                      ? 'bg-primary text-on-primary border border-transparent'
                      : 'bg-surface-tint border border-divider text-on-surface-tint hover:bg-surface-variant'
                  ]"
                  :value="f.name"
                >
                  {{ f.name }}
                </Tabs.Item>
              </Tabs.List>

              <!-- Dropdown for hidden files -->
              <Select.Root
                v-if="hiddenFiles.length > 0"
                :model-value="hiddenFiles.some(f => f.name === selectedTab) ? selectedTab : undefined"
                @update:model-value="selectedTab = String($event)"
              >
                <Select.Activator
                  aria-label="Additional files"
                  class="ml-1 h-[30px] px-2 text-xs font-medium bg-surface-tint border border-divider rounded text-on-surface cursor-pointer inline-flex items-center gap-1"
                >
                  <Select.Value v-slot="{ selectedValue }">{{ selectedValue }}</Select.Value>
                  <Select.Placeholder>+{{ hiddenFiles.length }} more</Select.Placeholder>
                  <Select.Cue v-slot="{ isOpen }" class="text-[10px] opacity-50">{{ isOpen ? '&#x25B4;' : '&#x25BE;' }}</Select.Cue>
                </Select.Activator>

                <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
                  <Select.Item
                    v-for="f in hiddenFiles"
                    :id="f.name"
                    :key="f.name"
                    v-slot="{ isSelected, isHighlighted }"
                    :value="f.name"
                  >
                    <div
                      class="px-3 py-1.5 rounded-md cursor-default select-none text-xs font-mono"
                      :class="[
                        isHighlighted ? 'bg-primary text-on-primary'
                        : isSelected ? 'text-primary font-medium'
                          : 'text-on-surface hover:bg-surface-variant',
                      ]"
                    >
                      {{ f.name }}
                    </div>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </template>

            <span
              v-else
              class="px-2 py-1 text-xs font-medium inline-flex items-center line-height-relaxed text-on-surface-variant opacity-60 border border-transparent"
            >
              All files
            </span>

            <div class="ml-auto flex items-center gap-1">
              <button
                class="size-[30px] rounded text-on-surface-variant hover:bg-surface-variant transition-colors inline-flex items-center justify-center"
                title="Reset example"
                type="button"
                @click="onReset"
              >
                <AppIcon icon="restart" :size="16" />
              </button>

              <button
                class="size-[30px] rounded text-on-surface-variant hover:bg-surface-variant transition-colors inline-flex items-center justify-center"
                title="Open in Playground"
                type="button"
                @click="openAllInPlayground"
              >
                <AppIcon icon="vuetify-play" :size="16" />
              </button>

              <button
                class="size-[30px] rounded text-on-surface-variant hover:bg-surface-variant transition-colors inline-flex items-center justify-center"
                title="Open in Bin"
                type="button"
                @click="openAllInBin"
              >
                <AppIcon icon="vuetify-bin" :size="16" />
              </button>

              <button
                class="size-[30px] rounded text-on-surface-variant hover:bg-surface-variant transition-colors inline-flex items-center justify-center"
                :title="combinedView ? 'Split files' : 'Combine files'"
                type="button"
                @click="combinedView = !combinedView"
              >
                <AppIcon :icon="combinedView ? 'split' : 'combine'" :size="16" />
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
              <DocsExampleCodePane
                :ref="(el: unknown) => setCodePaneRef(f.name, el)"
                :code="f.code"
                :file-name="f.name"
                :language="f.language || f.name.split('.').pop() || 'text'"
                :show-playground="false"
                :title="f.name"
              />
            </Tabs.Panel>
          </template>

          <!-- Combined view (all files stacked) -->
          <template v-else>
            <DocsExampleCodePane
              v-for="f in displayFiles"
              :key="f.name"
              :ref="(el: unknown) => setCodePaneRef(f.name, el)"
              :code="f.code"
              :file-name="f.name"
              :language="f.language || f.name.split('.').pop() || 'text'"
              :show-playground="false"
              :title="f.name"
            />
          </template>
        </Tabs.Root>
      </div>
    </div>

    <!-- Peek expand button -->
    <button
      v-if="peek && !hasMultipleFiles"
      :aria-label="peekExpanded ? 'Collapse code' : 'Expand code'"
      class="absolute left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-on-primary bg-primary rounded cursor-pointer transition-200 hover:bg-primary/85 touch-action-manipulation"
      :class="peekExpanded ? '-bottom-6' : '-bottom-3'"
      type="button"
      @click="peekExpanded = !peekExpanded"
    >
      <span>{{ peekExpanded ? 'Collapse' : 'Expand' }}</span>
      <AppIcon :icon="peekExpanded ? 'up' : 'down'" :size="14" />
    </button>
  </div>
</template>
