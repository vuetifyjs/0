<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])

  const permissions = [
    {
      name: 'Users',
      value: 'users',
      children: [
        { name: 'View', value: 'users:view' },
        { name: 'Create', value: 'users:create' },
        { name: 'Delete', value: 'users:delete' },
      ],
    },
    {
      name: 'Posts',
      value: 'posts',
      children: [
        { name: 'View', value: 'posts:view' },
        { name: 'Create', value: 'posts:create' },
        { name: 'Edit', value: 'posts:edit' },
        { name: 'Delete', value: 'posts:delete' },
      ],
    },
    {
      name: 'Settings',
      value: 'settings',
      children: [
        { name: 'General', value: 'settings:general' },
        { name: 'Security', value: 'settings:security' },
      ],
    },
  ]
</script>

<template>
  <Treeview.Root v-slot="{ selectAll, unselectAll, isAllSelected }" v-model="selected">
    <div class="flex items-center gap-2 mb-3">
      <button
        class="px-3 py-1 border border-divider rounded text-sm"
        :class="isAllSelected ? 'opacity-50' : 'hover:bg-surface-tint'"
        :disabled="isAllSelected"
        @click="selectAll()"
      >
        Select All
      </button>

      <button
        class="px-3 py-1 border border-divider rounded text-sm"
        :class="selected.length === 0 ? 'opacity-50' : 'hover:bg-surface-tint'"
        :disabled="selected.length === 0"
        @click="unselectAll()"
      >
        Clear
      </button>

      <span class="text-sm text-on-surface-variant ml-auto">
        {{ selected.length }} selected
      </span>
    </div>

    <Treeview.List class="text-sm text-on-surface">
      <Treeview.Item
        v-for="group in permissions"
        :key="group.value"
        class="py-0.5"
        :value="group.value"
      >
        <div class="flex items-center gap-2">
          <Treeview.Checkbox
            class="size-4 border rounded inline-flex items-center justify-center border-divider data-[selected]:bg-primary data-[selected]:border-primary data-[mixed]:bg-primary data-[mixed]:border-primary cursor-pointer"
          >
            <Treeview.Indicator v-slot="{ isMixed }" class="text-on-primary text-xs">
              <span v-if="isMixed">−</span>
              <span v-else>✓</span>
            </Treeview.Indicator>
          </Treeview.Checkbox>

          <span class="font-medium">{{ group.name }}</span>
        </div>

        <Treeview.Group class="pl-5">
          <Treeview.Item
            v-for="perm in group.children"
            :key="perm.value"
            class="py-0.5"
            :value="perm.value"
          >
            <div class="flex items-center gap-2">
              <Treeview.Checkbox
                class="size-4 border rounded inline-flex items-center justify-center border-divider data-[selected]:bg-primary data-[selected]:border-primary cursor-pointer"
              >
                <Treeview.Indicator class="text-on-primary text-xs">✓</Treeview.Indicator>
              </Treeview.Checkbox>

              <span>{{ perm.name }}</span>
            </div>
          </Treeview.Item>
        </Treeview.Group>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.join(', ') || 'none' }}
  </p>
</template>
