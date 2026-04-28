<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxApiTableItem {
    name: string
    type?: string
    default?: string
    description?: string
  }

  export interface CxApiTableProps extends V0PaperProps {
    /** API items to display */
    items: CxApiTableItem[]
    /** Kind of API items */
    kind?: 'prop' | 'event' | 'slot'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxApiTable' })

  const {
    items,
    kind = 'prop',
    ...paperProps
  } = defineProps<CxApiTableProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-api-table"
    :data-kind="kind"
  >
    <table class="codex-api-table__table">
      <thead>
        <tr>
          <th class="codex-api-table__th">Name</th>
          <th class="codex-api-table__th">Type</th>
          <th class="codex-api-table__th">Default</th>
          <th class="codex-api-table__th">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name" class="codex-api-table__row">
          <td class="codex-api-table__td codex-api-table__name">
            <code>{{ item.name }}</code>
          </td>
          <td class="codex-api-table__td codex-api-table__type">
            <code v-if="item.type">{{ item.type }}</code>
          </td>
          <td class="codex-api-table__td codex-api-table__default">
            <code v-if="item.default">{{ item.default }}</code>
          </td>
          <td class="codex-api-table__td codex-api-table__description">
            {{ item.description }}
          </td>
        </tr>
      </tbody>
    </table>
  </V0Paper>
</template>

<style scoped>
  .codex-api-table {
    overflow-x: auto;
  }

  .codex-api-table__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .codex-api-table__th {
    text-align: start;
    white-space: nowrap;
  }

  .codex-api-table__td {
    vertical-align: top;
  }

  .codex-api-table__name code,
  .codex-api-table__type code,
  .codex-api-table__default code {
    font-family: monospace;
    font-size: 0.8125rem;
    white-space: nowrap;
  }
</style>
