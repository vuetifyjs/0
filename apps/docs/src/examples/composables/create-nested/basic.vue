<script setup lang="ts">
  import { createNested } from '@vuetify/v0'
  import { computed } from 'vue'

  const nav = createNested()

  // Register navigation with inline children
  nav.onboard([
    {
      id: 'getting-started',
      value: 'Getting Started',
      children: [
        { id: 'installation', value: 'Installation' },
        { id: 'quick-start', value: 'Quick Start' },
        { id: 'typescript', value: 'TypeScript Support' },
      ],
    },
    {
      id: 'components',
      value: 'Components',
      children: [
        { id: 'buttons', value: 'Buttons' },
        {
          id: 'inputs',
          value: 'Inputs',
          children: [
            { id: 'text-field', value: 'Text Field' },
            { id: 'checkbox', value: 'Checkbox' },
            { id: 'radio', value: 'Radio' },
          ],
        },
        { id: 'selection', value: 'Selection' },
      ],
    },
    {
      id: 'composables',
      value: 'Composables',
      children: [
        { id: 'use-theme', value: 'useTheme' },
        { id: 'use-form', value: 'useForm' },
        { id: 'use-nested', value: 'useNested' },
      ],
    },
    { id: 'changelog', value: 'Changelog' },
  ])

  nav.open('getting-started')

  const stats = computed(() => ({
    total: nav.size,
    opened: nav.openedIds.size,
    selected: nav.selectedIds.size,
  }))

  function getVisibleNodes (parentId?: string): string[] {
    const ids = parentId
      ? nav.children.get(parentId) ?? []
      : nav.roots.value.map(r => r.id)

    return ids.flatMap(id => {
      const result = [id]
      if (nav.opened(id)) {
        result.push(...getVisibleNodes(id))
      }
      return result
    })
  }

  const visibleNodes = computed(() => getVisibleNodes())

  function onCheckboxClick (e: Event, id: string) {
    e.stopPropagation()
    nav.toggle(id)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 flex-wrap">
      <button
        class="px-3 py-1 border border-divider rounded hover:bg-surface-tint text-sm"
        @click="nav.expandAll()"
      >
        Expand All
      </button>

      <button
        class="px-3 py-1 border border-divider rounded hover:bg-surface-tint text-sm"
        @click="nav.collapseAll()"
      >
        Collapse All
      </button>

      <span class="text-on-surface opacity-60 text-sm ml-auto">
        {{ stats.selected }} selected / {{ stats.opened }} open / {{ stats.total }} total
      </span>
    </div>

    <nav class="border border-divider rounded overflow-hidden">
      <div
        v-for="id in visibleNodes"
        :key="id"
        class="flex items-center gap-2 py-2 hover:bg-surface-tint border-b border-divider last:border-b-0"
        :class="{ 'cursor-pointer': !nav.isLeaf(id) }"
        :style="{ paddingLeft: `${nav.getDepth(id) * 16 + 12}px` }"
        @click="nav.flip(id)"
      >
        <span
          v-if="!nav.isLeaf(id)"
          class="w-4 text-center opacity-60"
        >
          {{ nav.opened(id) ? '-' : '+' }}
        </span>
        <span v-else class="w-4" />

        <button
          class="size-4 border rounded inline-flex items-center justify-center border-divider text-xs"
          :class="nav.selected(id) ? 'bg-primary border-primary text-on-primary' : nav.mixed(id) ? 'bg-primary border-primary text-on-primary' : ''"
          @click="onCheckboxClick($event, id)"
        >
          <span v-if="nav.selected(id)">✓</span>
          <span v-else-if="nav.mixed(id)">-</span>
        </button>

        <span
          class="text-sm"
          :class="nav.isLeaf(id) ? 'opacity-80' : 'font-medium'"
        >
          {{ nav.get(id)?.value }}
        </span>
      </div>
    </nav>
  </div>
</template>
