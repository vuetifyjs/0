<script setup lang="ts">
  import { Button, DataTable } from '@vuetify/v0'
  import type { User } from './useLoading'

  const { users } = defineProps<{
    users: User[]
  }>()

  function shown (items: readonly Record<string, unknown>[], user: User) {
    return items.some(item => item.id === user.id)
  }

  function divided (items: readonly Record<string, unknown>[], user: User) {
    return shown(items, user) && items.at(-1)?.id !== user.id
  }
</script>

<template>
  <DataTable.Root v-slot="{ context }" :pagination="{ itemsPerPage: 3 }">
    <DataTable.Table aria-label="Users" class="w-full border-separate border-spacing-0">
      <DataTable.Header>
        <DataTable.Row class="border-b border-divider">
          <DataTable.Column
            id="name"
            v-slot="{ toggle, direction }"
            class="text-left p-3 font-semibold"
            sortable
          >
            <Button.Root class="flex items-center gap-1 font-semibold hover:text-primary" @click="toggle">
              Name
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">{{ direction }}</span>
            </Button.Root>
          </DataTable.Column>

          <DataTable.Column
            id="role"
            v-slot="{ toggle, direction }"
            class="text-left p-3 font-semibold"
            sortable
          >
            <Button.Root class="flex items-center gap-1 font-semibold hover:text-primary" @click="toggle">
              Role
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">{{ direction }}</span>
            </Button.Root>
          </DataTable.Column>
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body v-slot="{ items, rank }">
        <DataTable.Row
          v-for="user in rank(users)"
          :id="user.id"
          :key="user.id"
          :class="divided(items, user) ? 'border-b border-divider' : undefined"
          :value="user"
        >
          <DataTable.Cell class="p-3">{{ user.name }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ user.role }}</DataTable.Cell>
        </DataTable.Row>
      </DataTable.Body>
    </DataTable.Table>

    <div class="flex items-center gap-2 mt-3">
      <Button.Root
        class="px-3 py-1 rounded-lg border border-divider text-sm data-[disabled]:opacity-50"
        :disabled="context.pagination.isFirst.value"
        @click="context.pagination.prev()"
      >
        Previous
      </Button.Root>

      <span class="text-sm text-on-surface-variant">
        {{ context.pagination.page.value }} / {{ context.pagination.pages }}
      </span>

      <Button.Root
        class="px-3 py-1 rounded-lg border border-divider text-sm data-[disabled]:opacity-50"
        :disabled="context.pagination.isLast.value"
        @click="context.pagination.next()"
      >
        Next
      </Button.Root>
    </div>
  </DataTable.Root>
</template>
