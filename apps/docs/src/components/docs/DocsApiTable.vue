<script lang="ts" setup generic="T extends { name: string }">
  defineProps<{
    items: T[]
    columns: {
      key: keyof T | 'name'
      label: string
      code?: boolean
      small?: boolean
      fallback?: string
    }[]
    showRequired?: boolean
  }>()
</script>

<template>
  <table v-if="items.length > 0">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="String(col.key)"
          class="text-left"
          scope="col"
        >
          {{ col.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in items"
        :key="item.name"
      >
        <td
          v-for="col in columns"
          :key="String(col.key)"
          :class="{ 'text-sm': col.small }"
        >
          <template v-if="col.key === 'name'">
            <code>{{ item.name }}</code>

            <span
              v-if="showRequired && 'required' in item && item.required"
              class="text-error text-xs ml-1"
            >*</span>
          </template>

          <template v-else-if="item[col.key]">
            <code v-if="col.code" class="text-xs">{{ item[col.key] }}</code>

            <template v-else>{{ item[col.key] }}</template>
          </template>

          <span v-else class="text-on-surface-variant">{{ col.fallback ?? '—' }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
