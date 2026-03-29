<script setup lang="ts">
  import { HxExample } from '@paper/helix'

  // Composables
  import { getMultiFileBinUrl } from '@/composables/bin'
  import { useExamples } from '@/composables/useExamples'
  import { usePlayground } from '@/composables/usePlayground'

  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed, toRef, useSlots } from 'vue'

  // Types
  import type { HxExampleFile } from '@paper/helix'

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
    files?: HxExampleFile[]
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
    files ?? ('files' in (auto.value || {}) ? (auto.value as { files?: HxExampleFile[] }).files : undefined),
  )

  const slots = useSlots()
  const hasDescription = toRef(() => !!slots.description)

  const anchorId = toRef(() => id ?? (title ? `example-${toKebab(title)}` : undefined))

  const fileName = toRef(() =>
    file?.split('/').pop() || (filePath ? `${filePath.split('/').pop()}.vue` : ''),
  )

  async function openAllInPlayground () {
    const f = resolvedFiles.value
    if (!f?.length) return
    const payload = f.map(item => ({ name: item.name, code: item.code }))
    const url = await usePlayground(payload, undefined, imports)
    window.open(url, '_blank')
  }

  function openAllInBin () {
    const f = resolvedFiles.value
    if (!f?.length) return
    const payload = f.map(item => ({ name: item.name, code: item.code, language: item.language }))
    const url = getMultiFileBinUrl(payload, title)
    window.open(url, '_blank')
  }
</script>

<template>
  <div class="relative my-6" :class="peek && !(resolvedFiles && resolvedFiles.length > 1) && 'mb-10'">
    <HxExample
      :id="anchorId"
      class="border border-divider rounded-lg"
      :code="resolvedCode"
      :file-name
      :file-orders
      :files="resolvedFiles"
      :language="file?.split('.').pop() || 'vue'"
      :peek
      :peek-lines
      :title
    >
      <!-- Description -->
      <template v-if="hasDescription || title" #description>
        <DocsExampleDescription
          :anchor-id
          :collapse
          :title
        >
          <slot name="description" />
        </DocsExampleDescription>
      </template>

      <!-- Preview -->
      <component :is="auto?.component" v-if="auto?.component" />
      <slot v-else />

      <!-- Code toggle icons -->
      <template #toggle-icon="{ hasCode }">
        <HxLoaderIcon v-if="false" variant="orbit" />
        <AppIcon v-else-if="hasCode" icon="chevron-up" :size="16" />
        <AppIcon v-else class="transition-colors group-hover:text-primary" icon="code" :size="16" />
      </template>

      <!-- Multi-file skeleton -->
      <template #skeleton>
        <div class="border-t border-divider">
          <div class="flex items-center gap-2 px-3 py-3 bg-surface border-b border-divider">
            <HxSkeleton
              direction="row"
              gap="gap-2"
              height="h-[30px]"
              :lines="3"
              :widths="['w-24', 'w-20', 'w-28']"
            />
          </div>
          <div class="p-4 bg-pre">
            <HxSkeleton :lines="6" :widths="['w-1/4', 'w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-4/5']" />
          </div>
        </div>
      </template>

      <!-- Tab actions (playground/bin buttons) -->
      <template #tab-actions>
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
      </template>

      <!-- Combine/split icon -->
      <template #combine-icon="{ combined }">
        <AppIcon :icon="combined ? 'split' : 'combine'" :size="16" />
      </template>

      <!-- Peek expand button -->
      <template #peek-button="{ expanded, toggle }">
        <button
          :aria-label="expanded ? 'Collapse code' : 'Expand code'"
          class="absolute left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-on-primary bg-primary rounded cursor-pointer transition-200 hover:bg-primary/85 touch-action-manipulation"
          :class="expanded ? '-bottom-6' : '-bottom-3'"
          type="button"
          @click="toggle"
        >
          <span>{{ expanded ? 'Collapse' : 'Expand' }}</span>
          <AppIcon :icon="expanded ? 'up' : 'down'" :size="14" />
        </button>
      </template>
    </HxExample>
  </div>
</template>

<style scoped>
  :deep(.helix-example) {
    --helix-example-border: var(--v0-divider);
  }

  :deep(.helix-example__preview) {
    background-color: var(--v0-surface);
  }

  :deep(.helix-example__toggle-bar) {
    background-color: var(--v0-surface-tint);
  }

  :deep(.helix-example__toggle-btn) {
    color: var(--v0-on-surface);
    transition: color 0.15s, background-color 0.15s;
  }

  :deep(.helix-example__toggle-btn:hover) {
    background-color: var(--v0-surface);
  }

  :deep(.helix-example__tabs) {
    background-color: var(--v0-surface);
    border-top: 1px solid var(--v0-divider);
    min-height: 3rem;
  }

  :deep(.helix-example__tab) {
    background-color: var(--v0-surface-tint);
    border: 1px solid var(--v0-divider);
    color: var(--v0-on-surface-tint);
  }

  :deep(.helix-example__tab:hover) {
    background-color: var(--v0-surface-variant);
  }

  :deep(.helix-example__tab[data-selected]) {
    background-color: var(--v0-primary);
    color: var(--v0-on-primary);
    border-color: transparent;
  }

  :deep(.helix-example__tab-overflow) {
    background-color: var(--v0-surface-tint);
    border: 1px solid var(--v0-divider);
    color: var(--v0-on-surface);
  }

  :deep(.helix-example__tab-all) {
    color: var(--v0-on-surface-variant);
  }

  :deep(.helix-example__tab-action-btn) {
    color: var(--v0-on-surface-variant);
    transition: background-color 0.15s;
  }

  :deep(.helix-example__tab-action-btn:hover) {
    background-color: var(--v0-surface-variant);
  }
</style>
