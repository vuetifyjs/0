<script setup lang="ts">
  import { computed } from 'vue'
  import { createBreadcrumbs } from '@vuetify/v0'
  import { tree } from './tree'

  import type { BreadcrumbTicketInput } from '@vuetify/v0'
  import type { FolderNode } from './tree'

  interface FileBreadcrumbTicketInput<T = FolderNode> extends BreadcrumbTicketInput<T> {
    text: string
    value: T
  }

  const breadcrumbs = createBreadcrumbs<FileBreadcrumbTicketInput>()

  const current = computed(() => breadcrumbs.selectedValue.value ?? tree)
  const children = computed(() => current.value.children ?? [])
  const items = computed(() => breadcrumbs.values())

  function isFolder (node: FolderNode) {
    return !!node.children
  }

  breadcrumbs.register({
    text: tree.name,
    value: tree,
  })

  function open (node: FolderNode) {
    if (!isFolder(node)) return

    breadcrumbs.register({
      text: node.name,
      value: node,
    })
  }

  function navigate (id: string | number) {
    breadcrumbs.select(id)
  }

  function back () {
    breadcrumbs.prev()
  }
</script>

<template>
  <div class="space-y-3">
    <nav class="flex items-center gap-1.5 text-sm min-h-6">
      <template
        v-for="(ticket, i) in items"
        :key="ticket.id"
      >
        <span v-if="i > 0" class="text-on-surface-variant">/</span>

        <button
          class="text-primary hover:underline cursor-pointer"
          @click="navigate(ticket.id)"
        >
          {{ ticket.text }}
        </button>
      </template>
    </nav>

    <div class="border border-divider rounded-lg divide-y divide-divider">
      <button
        v-if="!breadcrumbs.isRoot.value"
        class="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-tint cursor-pointer"
        @click="back()"
      >
        <span>&larr;</span>
        <span>Back</span>
      </button>

      <button
        v-for="item in children"
        :key="item.name"
        class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-surface-tint cursor-pointer"
        :class="isFolder(item) ? 'text-on-surface' : 'text-on-surface-variant'"
        :disabled="!isFolder(item)"
        @click="open(item)"
      >
        <span>{{ isFolder(item) ? '&#128193;' : '&#128196;' }}</span>
        <span>{{ item.name }}</span>
      </button>
    </div>

    <div class="text-xs text-on-surface-variant">
      Depth: {{ breadcrumbs.depth.value }} &middot;
      At root: {{ breadcrumbs.isRoot.value }}
    </div>
  </div>
</template>
