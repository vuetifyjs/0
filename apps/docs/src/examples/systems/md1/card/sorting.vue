<script setup lang="ts">
  import { Md1Button, Md1Card, Md1DropdownButton } from '@paper/md1'
  import { createSortable, useProxyRegistry } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  import type { SortableTicketInput } from '@vuetify/v0'

  interface Doc {
    name: string
    /** Last modified, ISO date. */
    modified: string
    shown: string
    /** Size in kilobytes. */
    size: number
  }

  interface FileTicket extends SortableTicketInput {
    value: Doc
  }

  const files: Doc[] = [
    { name: 'Quarterly report', modified: '2026-10-21', shown: 'Oct 21', size: 2400 },
    { name: 'Budget 2027', modified: '2026-09-30', shown: 'Sep 30', size: 860 },
    { name: 'Team offsite photos', modified: '2026-10-02', shown: 'Oct 2', size: 48_200 },
    { name: 'Launch checklist', modified: '2026-10-26', shown: 'Oct 26', size: 34 },
    { name: 'Hiring plan', modified: '2026-08-14', shown: 'Aug 14', size: 120 },
    { name: 'Customer interviews', modified: '2026-10-11', shown: 'Oct 11', size: 15_600 },
  ]

  const sortable = createSortable<FileTicket>()
  const proxy = useProxyRegistry(sortable)

  const labels = {
    modified: 'Last modified',
    size: 'File size',
    name: 'Name',
  }

  const key = shallowRef<keyof typeof labels>('modified')
  const status = shallowRef('')

  // Newest and largest first, names A to Z: the order a reader scans for.
  function compare (a: Doc, b: Doc) {
    if (key.value === 'name') return a.name.localeCompare(b.name)
    if (key.value === 'size') return b.size - a.size
    return b.modified.localeCompare(a.modified)
  }

  function onSort () {
    const ids = sortable.values()
      .toSorted((a, b) => compare(a.value, b.value))
      .map(ticket => ticket.id)

    sortable.reorder(ids)
  }

  function onDismiss (id: string | number, name: string) {
    sortable.unregister(id)
    status.value = `${name} dismissed`
  }

  function load () {
    sortable.clear()
    sortable.onboard(files.map(value => ({ value })))
    onSort()
  }

  function onRestore () {
    load()
    status.value = 'All files restored'
  }

  function size (kb: number) {
    return kb >= 1000 ? `${(kb / 1000).toFixed(1)} MB` : `${kb} KB`
  }

  load()

  watch(key, onSort)
</script>

<template>
  <div class="md1-docs-sorting">
    <div class="md1-docs-sorting__bar">
      <Md1DropdownButton v-model="key" :aria-label="`Sort by ${labels[key]}`" dense>
        <Md1DropdownButton.Item v-for="(label, value) in labels" :key="value" :value>{{ label }}</Md1DropdownButton.Item>
      </Md1DropdownButton>

      <Md1Button :disabled="proxy.size === files.length" @click="onRestore">Restore all</Md1Button>
    </div>

    <ul aria-label="Files" class="md1-docs-sorting__grid">
      <li v-for="ticket in proxy.values" :key="ticket.id" class="md1-docs-sorting__cell">
        <Md1Card>
          <Md1Card.Title>{{ ticket.value.name }}</Md1Card.Title>

          <Md1Card.Subtitle>{{ ticket.value.shown }} · {{ size(ticket.value.size) }}</Md1Card.Subtitle>

          <Md1Card.Actions>
            <Md1Button>Open</Md1Button>

            <Md1Button :aria-label="`Dismiss ${ticket.value.name}`" @click="onDismiss(ticket.id, ticket.value.name)">Dismiss</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </li>
    </ul>

    <span class="md1-docs-sorting__note" role="status">{{ status }}</span>
  </div>
</template>

<style>
  /*
   * The collection's grid fills row by row, so a new order reads left to right,
   * top to bottom, the way the guidelines sort; in RTL the grid mirrors with it.
   */
  .md1-docs-sorting {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    inline-size: 100%;
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-sorting__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-sorting__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .md1-docs-sorting__cell {
    display: grid;
  }

  .md1-docs-sorting__note {
    min-block-size: 1lh;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
