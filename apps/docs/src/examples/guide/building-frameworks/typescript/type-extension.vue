<script setup lang="ts">
  import type { SelectionContext, SelectionTicket } from '@vuetify/v0/composables'
  import type { ComputedRef } from 'vue'

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

  // Icon paths (mdi icons)
  const icons: Record<string, string> = {
    'file-document': 'M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z',
    'code-json': 'M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z',
    'folder': 'M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z',
    'folder-outline': 'M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z',
  }

  // Create typed selection with custom ticket
  const files = createSelection<FileTicket, FileContext>({
    multiple: true,
    events: true,
  })

  // Register items with extended properties
  files.onboard([
    { id: 'readme', value: 'README.md', icon: 'file-document', size: 2048 },
    { id: 'package', value: 'package.json', icon: 'code-json', size: 1024 },
    { id: 'src', value: 'src/', icon: 'folder', size: 4096 },
    { id: 'tests', value: 'tests/', icon: 'folder-outline', size: 8192 },
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
          <svg
            :class="file.isSelected.value ? 'text-primary' : 'text-on-surface-variant'"
            fill="currentColor"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="icons[file.icon]" />
          </svg>
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
            <svg
              v-if="file.isSelected.value"
              fill="currentColor"
              height="12"
              viewBox="0 0 24 24"
              width="12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
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
