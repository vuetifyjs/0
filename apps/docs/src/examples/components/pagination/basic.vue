<script lang="ts" setup>
  import { Pagination } from '@vuetify/v0'
</script>

<template>
  <Pagination.Root
    class="flex items-center justify-center gap-1"
    :size="200"
  >
    <Pagination.First class="w-9 h-9 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
      «
    </Pagination.First>

    <Pagination.Prev class="w-9 h-9 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
      ‹
    </Pagination.Prev>

    <Pagination.Content v-slot="{ items }" class="flex gap-1">
      <template v-for="(item, index) in items" :key="index">
        <Pagination.Ellipsis
          v-if="item.type === 'ellipsis'"
          class="w-9 h-9 flex items-center justify-center text-on-surface opacity-60"
        />

        <Pagination.Item
          v-else
          class="w-9 h-9 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:border-primary data-[selected]:hover:bg-primary"
          :value="item.value as number"
        >
          {{ item.value }}
        </Pagination.Item>
      </template>
    </Pagination.Content>

    <Pagination.Next class="w-9 h-9 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
      ›
    </Pagination.Next>

    <Pagination.Last class="w-9 h-9 rounded border border-divider flex items-center justify-center bg-surface hover:bg-surface-tint data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed">
      »
    </Pagination.Last>
  </Pagination.Root>
</template>
