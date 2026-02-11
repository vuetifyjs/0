<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { Checkbox, createBreadcrumbs, Popover } from '@vuetify/v0'
  import { tree } from './tree'

  import type { BreadcrumbTicketInput } from '@vuetify/v0'
  import type { FolderNode } from './tree'

  interface FileBreadcrumbTicketInput<T = FolderNode> extends BreadcrumbTicketInput<T> {
    text: string
    value: T
  }

  const anchor = shallowRef<'start' | 'end'>('end')

  const breadcrumbs = createBreadcrumbs<FileBreadcrumbTicketInput>({
    visible: 4,
    anchor,
  })

  const current = computed(() => breadcrumbs.selectedValue.value ?? tree)
  const children = computed(() => current.value.children ?? [])

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
        v-for="ticket in breadcrumbs.tickets.value"
        :key="ticket.type === 'crumb' ? ticket.value.id : 'ellipsis'"
      >
        <template v-if="ticket.type === 'ellipsis'">
          <span class="text-on-surface-variant">/</span>

          <Popover.Root>
            <Popover.Activator class="text-on-surface-variant px-1 cursor-pointer hover:text-primary">
              {{ ticket.value }}
            </Popover.Activator>

            <Popover.Content class="py-1 rounded-lg bg-surface border border-divider shadow-lg" position-area="top">
              <button
                v-for="crumb in ticket.collapsed"
                :key="crumb.id"
                class="block w-full px-3 py-1.5 text-sm text-left text-primary hover:bg-surface-tint cursor-pointer"
                @click="navigate(crumb.id)"
              >
                {{ crumb.text }}
              </button>
            </Popover.Content>
          </Popover.Root>
        </template>

        <template v-else>
          <span v-if="ticket.index > 0" class="text-on-surface-variant">/</span>

          <button
            class="text-primary hover:underline cursor-pointer"
            @click="navigate(ticket.value.id)"
          >
            {{ ticket.value.text }}
          </button>
        </template>
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

    <div class="flex items-center gap-4 text-xs text-on-surface-variant">
      <span>Visible: 4</span>

      <label class="flex items-center gap-1.5 cursor-pointer">
        <Checkbox.Root
          class="size-4 border border-divider rounded flex items-center justify-center text-xs data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-on-primary"
          :model-value="anchor === 'start'"
          @update:model-value="anchor = $event ? 'start' : 'end'"
        >
          <Checkbox.Indicator>&#10003;</Checkbox.Indicator>
        </Checkbox.Root>
        <span>Anchor start</span>
      </label>
    </div>
  </div>
</template>
