<script setup lang="ts">
  import { Avatar, Button, DataTable } from '@vuetify/v0'
  import type { Member } from './useTeam'
  import { columns } from './useTeam'

  const { members } = defineProps<{
    members: Member[]
  }>()

  const query = defineModel<string>('search', { default: '' })

  function shown (items: readonly Record<string, unknown>[], member: Member) {
    return items.some(item => item.id === member.id)
  }

  function divided (items: readonly Record<string, unknown>[], member: Member) {
    return shown(items, member) && items.at(-1)?.id !== member.id
  }

  function initials (name: string) {
    return name.split(' ').map(part => part[0]).join('').slice(0, 2)
  }
</script>

<template>
  <DataTable.Root
    v-slot="{ context }"
    v-model:search="query"
    :pagination="{ itemsPerPage: 4 }"
  >
    <input
      v-model="query"
      aria-label="Search team"
      class="mb-3 border border-divider rounded-md px-3 py-2 w-64 bg-surface text-on-surface"
      placeholder="Search name or email..."
      type="search"
    >

    <DataTable.Table aria-label="Team directory" class="w-full border-separate border-spacing-0">
      <DataTable.Header>
        <DataTable.Row class="border-b border-divider">
          <DataTable.Column
            v-for="col in columns"
            :id="col.id"
            :key="col.id"
            v-slot="{ isSortable, toggle, direction }"
            class="text-left p-3 font-semibold"
            :filterable="col.filterable"
            :sortable="col.sortable"
          >
            <Button.Root
              v-if="isSortable"
              class="flex items-center gap-1 font-semibold hover:text-primary"
              @click="toggle"
            >
              {{ col.title }}
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">
                {{ direction }}
              </span>
            </Button.Root>

            <span v-else>{{ col.title }}</span>
          </DataTable.Column>
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body v-slot="{ items, rank }">
        <DataTable.Row
          v-for="member in rank(members)"
          v-show="shown(items, member)"
          :id="member.id"
          :key="member.id"
          class="hover:bg-surface-variant"
          :class="divided(items, member) ? 'border-b border-divider' : undefined"
          :value="member"
        >
          <DataTable.Cell class="p-3">
            <div class="flex items-center gap-3">
              <Avatar.Root class="size-8 rounded-full flex items-center justify-center overflow-hidden bg-surface-tint shrink-0">
                <Avatar.Image
                  v-if="member.avatar"
                  class="w-full h-full object-cover"
                  :src="member.avatar"
                />

                <Avatar.Fallback class="text-xs font-semibold text-secondary">
                  {{ initials(member.name) }}
                </Avatar.Fallback>
              </Avatar.Root>

              <span>{{ member.name }}</span>
            </div>
          </DataTable.Cell>

          <DataTable.Cell class="p-3">{{ member.email }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ member.role }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ member.team }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty v-slot="{ columnCount }">
          <DataTable.Cell class="p-6 text-center text-on-surface-variant" :colspan="columnCount">
            No teammates match that search
          </DataTable.Cell>
        </DataTable.Empty>
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
