<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxApiTableItem {
    name: string
    type?: string
    default?: string
    description?: string
  }

  export interface HxApiTableProps extends V0PaperProps {
    /** API items to display */
    items: HxApiTableItem[]
    /** Kind of API items */
    kind?: 'prop' | 'event' | 'slot'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxApiTable' })

  const {
    items,
    kind = 'prop',
    ...paperProps
  } = defineProps<HxApiTableProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-api-table"
    :data-kind="kind"
  >
    <table class="helix-api-table__table">
      <thead>
        <tr>
          <th class="helix-api-table__th">Name</th>
          <th class="helix-api-table__th">Type</th>
          <th class="helix-api-table__th">Default</th>
          <th class="helix-api-table__th">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name" class="helix-api-table__row">
          <td class="helix-api-table__td helix-api-table__name">
            <code>{{ item.name }}</code>
          </td>
          <td class="helix-api-table__td helix-api-table__type">
            <code v-if="item.type">{{ item.type }}</code>
          </td>
          <td class="helix-api-table__td helix-api-table__default">
            <code v-if="item.default">{{ item.default }}</code>
          </td>
          <td class="helix-api-table__td helix-api-table__description">
            {{ item.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </V0Paper>
</template>

<style scoped>
  .helix-api-table {
    overflow-x: auto;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
  }

  .helix-api-table__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .helix-api-table__th {
    text-align: start;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    background-color: var(--v0-surface-tint);
    color: var(--v0-on-surface-variant);
    font-weight: 600;
    border-bottom: 1px solid var(--v0-divider);
  }

  .helix-api-table__td {
    vertical-align: top;
    padding: 0.5rem 1rem;
    color: var(--v0-on-surface);
  }

  .helix-api-table__row + .helix-api-table__row .helix-api-table__td {
    border-top: 1px solid var(--v0-divider);
  }

  .helix-api-table__name code {
    font-family: monospace;
    font-size: 0.8125rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .helix-api-table__type code,
  .helix-api-table__default code {
    font-family: monospace;
    font-size: 0.8125rem;
    white-space: nowrap;
    color: var(--v0-primary);
  }

  .helix-api-table__description {
    color: var(--v0-on-surface-variant);
  }
</style>
