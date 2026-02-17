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

  const selectedA = ref()
  const selectedB = ref()
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Scoped Slots
    </h1>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <h2 class="text-lg font-bold text-on-surface mb-3">Card style</h2>

        <SelectableList v-model="selectedA" :items="users">
          <template #default="{ item, isSelected, select }">
            <button
              class="w-full text-left p-3 rounded-lg border border-solid transition-colors"
              :class="isSelected
                ? 'border-primary bg-primary text-on-primary'
                : 'border-divider bg-surface text-on-surface hover:bg-surface-tint'"
              @click="select"
            >
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm" :class="isSelected ? 'text-on-primary/70' : 'text-on-surface-variant'">
                {{ item.role }}
              </p>
            </button>
          </template>
        </SelectableList>
      </div>

      <div>
        <h2 class="text-lg font-bold text-on-surface mb-3">Chip style</h2>

        <SelectableList v-model="selectedB" :items="users">
          <template #default="{ item, isSelected, select }">
            <button
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              :class="isSelected
                ? 'bg-primary text-on-primary'
                : 'bg-surface-tint text-on-surface hover:bg-surface'"
              @click="select"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="isSelected ? 'bg-on-primary' : 'bg-primary'"
              />
              {{ item.name }}
            </button>
          </template>
        </SelectableList>
      </div>
    </div>
  </div>
</template>
