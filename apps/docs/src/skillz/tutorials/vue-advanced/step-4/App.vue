<script setup>
  // Components
  import SelectableList from './SelectableList.vue'

  // Utilities
  import { ref } from 'vue'

  const users = [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Carol', role: 'Manager' },
    { id: 4, name: 'Dan', role: 'Engineer' },
  ]

  const selectedUser = ref()
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Generics in Components
    </h1>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <h2 class="text-lg font-bold text-on-surface mb-3">Select a user</h2>

        <SelectableList
          v-model="selectedUser"
          :items="users"
          :label="user => user.name"
        />
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
          Click a user to see their details.
        </p>
      </div>
    </div>
  </div>
</template>
