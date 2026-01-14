<script setup lang="ts">
  // Types
  import type { SelectionContext, SelectionTicket } from '@vuetify/v0/composables'
  import type { ComputedRef } from 'vue'

  // Composables
  import { createSelection, useProxyRegistry } from '@vuetify/v0'

  // Extend the base ticket with custom properties
  interface FileTicket extends SelectionTicket<string> {
    icon: string
    size: number
  }

  // Extend the context with custom computed properties
  interface FileContext extends SelectionContext<FileTicket> {
    totalSize: ComputedRef<number>
  }

  // Create typed selection with custom ticket
  const files = createSelection<FileTicket, FileContext>({
    multiple: true,
  })

  // Register items with extended properties
  files.onboard([
    { id: 'readme', value: 'README.md', icon: 'i-mdi-file-document', size: 2048 },
    { id: 'package', value: 'package.json', icon: 'i-mdi-code-json', size: 1024 },
    { id: 'src', value: 'src/', icon: 'i-mdi-folder', size: 4096 },
    { id: 'tests', value: 'tests/', icon: 'i-mdi-folder-outline', size: 8192 },
  ])

  const proxy = useProxyRegistry(files)

  // Access extended properties with full type safety
  function formatSize (bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    return `${(bytes / 1024).toFixed(1)} KB`
  }
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-on-surface-variant">
      Extend v0's ticket and context types for custom properties:
    </p>

    <div class="border border-divider rounded-lg overflow-hidden">
      <div class="px-3 py-2 bg-surface-variant text-xs font-mono text-on-surface-variant">
        interface FileTicket extends SelectionTicket&lt;string&gt; { icon, size }
      </div>

      <div class="divide-y divide-divider">
        <button
          v-for="file in proxy.values"
          :key="file.id"
          class="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
          :class="file.isSelected.value ? 'bg-primary/10' : 'hover:bg-surface-variant'"
          @click="file.toggle"
        >
          <span
            class="text-lg"
            :class="[file.icon, file.isSelected.value ? 'text-primary' : 'text-on-surface-variant']"
          />
          <span class="flex-1 text-sm" :class="file.isSelected.value ? 'text-primary font-medium' : ''">
            {{ file.value }}
          </span>
          <span class="text-xs text-on-surface-variant font-mono">
            {{ formatSize(file.size) }}
          </span>
          <span
            class="size-4 rounded border flex items-center justify-center text-xs"
            :class="file.isSelected.value
              ? 'bg-primary border-primary text-on-primary'
              : 'border-divider'"
          >
            <span v-if="file.isSelected.value" class="i-mdi-check" />
          </span>
        </button>
      </div>
    </div>

    <div class="flex justify-between items-center p-3 bg-surface-variant rounded-lg text-sm">
      <span class="text-on-surface-variant">
        {{ files.selectedIds.size }} selected
      </span>
      <span class="font-mono text-xs">
        {{ formatSize(Array.from(files.selectedItems.value).reduce((sum, f) => sum + f.size, 0)) }}
      </span>
    </div>
  </div>
</template>
