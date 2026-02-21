<script setup>
  // Components
  import SearchInput from './SearchInput.vue'
  import SelectableList from './SelectableList.vue'

  // Utilities
  import { ref, computed } from 'vue'

  const users = [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Carol', role: 'Manager' },
    { id: 4, name: 'Dan', role: 'Engineer' },
    { id: 5, name: 'Eve', role: 'Designer' },
  ]

  const query = ref('')
  const selectedUser = ref()

  const filtered = computed(() => {
    if (!query.value) return users
    const q = query.value.toLowerCase()
    return users.filter(u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
  })
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      defineModel
    </h1>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <SearchInput v-model="query" class="mb-4" />

        <SelectableList
          v-model="selectedUser"
          :items="filtered"
          :label="user => user.name"
        />

        <p v-if="filtered.length === 0" class="text-on-surface-variant text-sm mt-3">
          No results for "{{ query }}"
        </p>
      </div>

      <div>
        <h2 class="text-lg font-bold text-on-surface mb-3">Details</h2>

        <div v-if="selectedUser" class="p-4 rounded-lg bg-surface-tint">
          <p class="text-on-background font-medium">
            {{ selectedUser.name }}
          </p>

          <p class="text-sm text-on-surface-variant">
            {{ selectedUser.role }}
          </p>
        </div>

        <p v-else class="text-on-surface-variant text-sm">
          Click a user to see details.
        </p>

        <div class="mt-4 p-3 rounded-lg bg-surface text-sm">
          <span class="text-on-surface-variant">Debounced query:</span>
          <strong class="text-on-surface ml-1">{{ query || '(empty)' }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>
