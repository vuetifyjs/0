<script setup>
  // Components
  import SelectableList from './SelectableList.vue'

  // Composables
  import { useFilter } from './useFilter'
  import { useList } from './useList'

  // Utilities
  import { ref } from 'vue'

  const { items, add, remove } = useList([
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Carol', role: 'Manager' },
    { id: 4, name: 'Dan', role: 'Engineer' },
    { id: 5, name: 'Eve', role: 'Designer' },
  ])

  const { query, filtered } = useFilter(items, ['name', 'role'])

  const selected = ref()

  let nextId = 6

  function addUser () {
    const names = ['Frank', 'Grace', 'Hank', 'Ivy', 'Jack']
    const roles = ['Engineer', 'Designer', 'Manager', 'Analyst']
    add({
      id: nextId++,
      name: names[Math.floor(Math.random() * names.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
    })
  }
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      Putting It Together
    </h1>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <div class="flex gap-2 mb-4">
          <input
            v-model="query"
            class="flex-1 px-3 py-2 rounded border border-solid border-divider bg-surface text-on-surface"
            placeholder="Search by name or role..."
          >

          <button
            class="px-4 py-2 rounded bg-primary text-on-primary font-medium"
            @click="addUser"
          >
            Add
          </button>
        </div>

        <SelectableList v-model="selected" :items="filtered">
          <template #default="{ item, isSelected, select }">
            <div
              class="flex items-center justify-between p-3 rounded-lg border border-solid cursor-pointer transition-colors"
              :class="isSelected
                ? 'border-primary bg-primary text-on-primary'
                : 'border-divider bg-surface text-on-surface hover:bg-surface-tint'"
              @click="select"
            >
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm" :class="isSelected ? 'text-on-primary/70' : 'text-on-surface-variant'">
                  {{ item.role }}
                </p>
              </div>

              <button
                class="text-sm px-2 py-1 rounded"
                :class="isSelected ? 'text-on-primary/70 hover:text-on-primary' : 'text-error hover:bg-surface-tint'"
                @click.stop="remove(items.indexOf(item))"
              >
                Remove
              </button>
            </div>
          </template>

          <template #empty>
            <p class="text-on-surface-variant text-sm mt-3">
              No results for "{{ query }}"
            </p>
          </template>
        </SelectableList>

        <p class="text-sm text-on-surface-variant mt-3">
          {{ filtered.length }} of {{ items.length }} items
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-on-surface mb-3">Selected</h2>

        <div v-if="selected" class="p-4 rounded-lg bg-surface-tint">
          <p class="text-on-background font-medium text-lg">
            {{ selected.name }}
          </p>

          <p class="text-on-surface-variant">
            {{ selected.role }}
          </p>

          <p class="text-sm text-on-surface-variant mt-2">
            ID: {{ selected.id }}
          </p>
        </div>

        <p v-else class="text-on-surface-variant text-sm">
          Select a user from the list.
        </p>
      </div>
    </div>
  </div>
</template>
