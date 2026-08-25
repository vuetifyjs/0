<script setup lang="ts">
  import { Button, DataTable } from '@vuetify/v0'
  import type { Issue } from './useIssues'

  const { issues, archive } = defineProps<{
    issues: Issue[]
    archive: (ids: string[]) => void
  }>()

  const query = defineModel<string>('search', { default: '' })

  function onArchive (selection: { selectedIds: ReadonlySet<string | number>, unselectAll: () => void }) {
    archive([...selection.selectedIds].map(String))
    selection.unselectAll()
  }
</script>

<template>
  <DataTable.Root v-slot="{ context }" v-model:search="query">
    <div class="flex items-center gap-2 mb-3 min-h-9">
      <input
        v-model="query"
        aria-label="Search issues"
        class="border border-divider rounded-md px-3 py-1.5 w-56 bg-surface text-on-surface text-sm"
        placeholder="Search title or assignee..."
        type="search"
      >

      <Button.Root
        class="px-2.5 py-1 rounded-md border border-divider text-xs font-medium hover:bg-surface-variant"
        @click="context.selection.toggleAll()"
      >
        Toggle page
      </Button.Root>

      <Button.Root
        class="px-2.5 py-1 rounded-md border border-divider text-xs font-medium text-error hover:bg-surface-variant"
        :class="context.selection.selectedIds.size > 0 ? undefined : 'invisible'"
        :disabled="context.selection.selectedIds.size === 0"
        @click="onArchive(context.selection)"
      >
        Archive selected
      </Button.Root>
    </div>

    <DataTable.Table aria-label="Issue list" class="w-full border-separate border-spacing-0">
      <DataTable.Header>
        <DataTable.Row class="border-b border-divider">
          <DataTable.Column id="select" class="w-10 p-3" />

          <DataTable.Column
            id="title"
            v-slot="{ isSortable, toggle, direction }"
            class="text-left p-3 font-semibold"
            filterable
            sortable
          >
            <Button.Root
              v-if="isSortable"
              class="flex items-center gap-1 font-semibold hover:text-primary"
              @click="toggle"
            >
              Title
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">{{ direction }}</span>
            </Button.Root>
          </DataTable.Column>

          <DataTable.Column
            id="status"
            v-slot="{ isSortable, toggle, direction }"
            class="text-left p-3 font-semibold"
            sortable
          >
            <Button.Root
              v-if="isSortable"
              class="flex items-center gap-1 font-semibold hover:text-primary"
              @click="toggle"
            >
              Status
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">{{ direction }}</span>
            </Button.Root>
          </DataTable.Column>

          <DataTable.Column
            id="assignee"
            v-slot="{ isSortable, toggle, direction }"
            class="text-left p-3 font-semibold"
            filterable
            sortable
          >
            <Button.Root
              v-if="isSortable"
              class="flex items-center gap-1 font-semibold hover:text-primary"
              @click="toggle"
            >
              Assignee
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">{{ direction }}</span>
            </Button.Root>
          </DataTable.Column>
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body v-slot="{ rank }">
        <DataTable.Row
          v-for="issue in rank(issues)"
          :id="issue.id"
          :key="issue.id"
          v-slot="{ isSelected }"
          class="border-b border-divider cursor-pointer hover:bg-surface-variant data-[selected]:bg-surface-variant/60"
          selectable
          :value="issue"
        >
          <DataTable.Cell class="p-3 align-middle">
            <Button.Root
              :aria-pressed="isSelected"
              class="size-5 p-0 shrink-0 overflow-hidden rounded border border-divider inline-flex items-center justify-center align-middle leading-none aria-pressed:bg-primary aria-pressed:border-primary aria-pressed:text-on-primary"
            >
              <span class="text-xs leading-none" :class="isSelected ? undefined : 'opacity-0'">✓</span>
            </Button.Root>
          </DataTable.Cell>

          <DataTable.Cell class="p-3">{{ issue.title }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ issue.status }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ issue.assignee }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty v-slot="{ columnCount }">
          <DataTable.Cell class="p-8 text-center" :colspan="columnCount">
            <p class="font-medium">
              {{ query ? 'No issues match that search' : 'Inbox zero' }}
            </p>

            <p class="text-sm text-on-surface-variant mt-1">
              {{ query ? 'Try a different query, or clear search to see the full list.' : 'Everything is archived.' }}
            </p>

            <Button.Root
              v-if="query"
              class="mt-3 px-3 py-1 rounded-md border border-divider text-sm"
              @click="query = ''"
            >
              Clear search
            </Button.Root>
          </DataTable.Cell>
        </DataTable.Empty>
      </DataTable.Body>
    </DataTable.Table>
  </DataTable.Root>
</template>
