<script setup lang="ts">
  import { Button, DataGrid } from '@vuetify/v0'
  import type { Project } from './useProjects'
  import { columns } from './useProjects'

  const { projects } = defineProps<{
    projects: Project[]
  }>()

  const tableWidth = 1100

  type LayoutCol = {
    id: string
    size: number
    pinned: 'left' | 'right' | false
    offset: number
  }

  function cols (layout: readonly LayoutCol[]): LayoutCol[] {
    if (layout.length > 0) return [...layout]
    return columns.map(col => ({
      id: String(col.id),
      size: col.size,
      pinned: col.pinned ?? false,
      offset: 0,
    }))
  }

  function inset (offset: number) {
    return `${tableWidth * offset / 100}px`
  }

  function pinVars (pinned: 'left' | 'right' | false, offset: number) {
    if (!pinned) return undefined
    return pinned === 'left'
      ? { '--pin-left': inset(offset) }
      : { '--pin-right': inset(offset) }
  }

  function pinLabel (pinned: 'left' | 'right' | false) {
    if (pinned === 'left') return 'Pin right'
    if (pinned === 'right') return 'Unpin'
    return 'Pin left'
  }

  function cycle (id: string, pinned: 'left' | 'right' | false, pin: (id: string, pos: 'left' | 'right' | false) => void) {
    if (pinned === 'left') pin(id, 'right')
    else if (pinned === 'right') pin(id, false)
    else pin(id, 'left')
  }

  function title (id: string) {
    return columns.find(col => col.id === id)?.title ?? id
  }

  function cell (project: Project, id: string) {
    return project[id as keyof Project]
  }
</script>

<template>
  <DataGrid.Root v-slot="{ context }">
    <div class="w-full overflow-x-auto border border-divider rounded-lg">
      <DataGrid.Table
        aria-label="Projects"
        class="table-fixed"
        :style="{ width: `${tableWidth}px`, overflow: 'visible' }"
      >
        <DataGrid.Header>
          <DataGrid.Row class="bg-surface-tint">
            <DataGrid.Column
              v-for="col in cols(context.layout.columns.value)"
              :id="col.id"
              :key="col.id"
              class="p-3 text-start font-semibold bg-surface-tint"
              :data-pin="col.pinned || undefined"
              :pinned="col.pinned || undefined"
              :size="col.size"
              :style="pinVars(col.pinned, col.offset)"
            >
              <div class="flex items-center gap-2">
                <Button.Root
                  :aria-label="pinLabel(col.pinned) + ' ' + title(col.id)"
                  class="px-1.5 py-0.5 rounded text-xs border border-divider text-on-surface-variant hover:text-primary"
                  @click="cycle(col.id, col.pinned, context.layout.pin)"
                >
                  {{ col.pinned === 'left' ? 'L' : col.pinned === 'right' ? 'R' : '·' }}
                </Button.Root>

                <span>{{ title(col.id) }}</span>
              </div>
            </DataGrid.Column>
          </DataGrid.Row>
        </DataGrid.Header>

        <DataGrid.Body v-slot="{ rank }">
          <DataGrid.Row
            v-for="project in rank(projects)"
            :id="project.id"
            :key="project.id"
            class="group hover:bg-surface-tint/50"
            :value="project"
          >
            <DataGrid.Cell
              v-for="col in cols(context.layout.columns.value)"
              :key="col.id"
              class="p-3 truncate bg-surface"
              :class="col.pinned ? 'group-hover:bg-surface-tint/50' : undefined"
              :column="String(col.id)"
              :data-pin="col.pinned || undefined"
              :style="pinVars(col.pinned, col.offset)"
            >
              {{ cell(project, col.id) }}
            </DataGrid.Cell>
          </DataGrid.Row>
        </DataGrid.Body>
      </DataGrid.Table>
    </div>
  </DataGrid.Root>
</template>

<style scoped>
  :deep([data-pin='left']) {
    position: sticky;
    left: var(--pin-left, 0px);
    z-index: 2;
    box-shadow: 1px 0 0 0 var(--v0-divider);
  }

  :deep([data-pin='right']) {
    position: sticky;
    right: var(--pin-right, 0px);
    z-index: 2;
    box-shadow: -1px 0 0 0 var(--v0-divider);
  }
</style>
