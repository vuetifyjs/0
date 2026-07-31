<script setup lang="ts">
  import { computed } from 'vue'
  import { mdiChevronDown, mdiChevronRight, mdiFileOutline, mdiFolder, mdiFolderOpen } from '@mdi/js'
  import { Checkbox } from '@vuetify/v0'
  import { useFileTree } from './context'
  import type { ID } from '@vuetify/v0'

  const tree = useFileTree()

  function walk (ids: readonly ID[]): ID[] {
    return ids.flatMap(id => {
      const result: ID[] = [id]
      if (tree.opened(id)) {
        const childIds = tree.children.get(id)
        if (childIds) result.push(...walk(childIds))
      }
      return result
    })
  }

  const visible = computed(() => walk(tree.roots.value.map(node => node.id)))

  const selectedFiles = computed(() => {
    const labels: string[] = []
    for (const id of tree.selectedIds) {
      if (!tree.isLeaf(id)) continue
      const label = tree.meta(id)?.label
      if (label) labels.push(label)
    }
    return labels
  })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <button
        class="px-2.5 py-1 text-xs rounded-md border border-divider text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors"
        @click="tree.expandAll()"
      >
        Expand all
      </button>

      <button
        class="px-2.5 py-1 text-xs rounded-md border border-divider text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors"
        @click="tree.collapseAll()"
      >
        Collapse all
      </button>

      <span class="flex-1" />

      <span class="flex items-center gap-3 text-xs text-on-surface-variant">
        <span class="text-primary">{{ tree.stats.value.selected }} selected</span>
        <span>{{ tree.stats.value.opened }} open</span>
        <span>{{ tree.stats.value.total }} items</span>
      </span>
    </div>

    <div class="border border-divider rounded-lg p-1 bg-surface">
      <div
        v-for="id in visible"
        :key="id"
        class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-variant/40 transition-colors"
        :class="{ 'cursor-pointer': !tree.isLeaf(id) }"
        :style="{ paddingLeft: `${tree.getDepth(id) * 16 + 8}px` }"
        @click="!tree.isLeaf(id) && tree.flip(id)"
      >
        <svg
          v-if="!tree.isLeaf(id)"
          class="size-4 shrink-0 text-on-surface-variant"
          viewBox="0 0 24 24"
        >
          <path :d="tree.opened(id) ? mdiChevronDown : mdiChevronRight" fill="currentColor" />
        </svg>

        <span v-else class="size-4 shrink-0" />

        <span @click.stop>
          <Checkbox.Root
            class="size-4.5 rounded border-2 border-divider flex items-center justify-center transition-colors shrink-0 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary"
            :indeterminate="tree.mixed(id)"
            :model-value="tree.selected(id)"
            @update:model-value="tree.toggle(id)"
          >
            <Checkbox.Indicator v-slot="{ isMixed }" class="text-on-primary text-xs leading-none">
              {{ isMixed ? '–' : '✓' }}
            </Checkbox.Indicator>
          </Checkbox.Root>
        </span>

        <svg
          class="size-4 shrink-0"
          :class="tree.meta(id)?.kind === 'folder' ? 'text-warning' : 'text-on-surface-variant/70'"
          viewBox="0 0 24 24"
        >
          <path
            :d="tree.meta(id)?.kind === 'folder'
              ? (tree.opened(id) ? mdiFolderOpen : mdiFolder)
              : mdiFileOutline"
            fill="currentColor"
          />
        </svg>

        <span
          class="text-sm"
          :class="tree.meta(id)?.kind === 'folder' ? 'font-medium text-on-surface' : 'text-on-surface-variant'"
        >
          {{ tree.meta(id)?.label }}
        </span>
      </div>
    </div>

    <div
      v-if="selectedFiles.length > 0"
      class="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2"
    >
      <p class="text-xs font-medium text-primary mb-1.5">
        {{ selectedFiles.length }} file{{ selectedFiles.length === 1 ? '' : 's' }} selected
      </p>

      <div class="flex flex-wrap gap-1">
        <span
          v-for="label in selectedFiles"
          :key="label"
          class="px-1.5 py-0.5 text-[11px] rounded bg-primary/10 text-primary font-mono"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </div>
</template>
