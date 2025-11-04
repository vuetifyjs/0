<script lang="ts" setup>
  import { Group } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref([])
  const items = ['apple', 'banana', 'cherry']
</script>

<template>
  <Group.Root v-model="selected">
    <template #default="{ select, unselect }">
      <div class="flex gap-2 mb-4">
        <button class="px-3 py-1 rounded bg-primary text-on-primary" @click="select(items)">
          Select All
        </button>
        <button class="px-3 py-1 rounded bg-secondary text-on-secondary" @click="unselect(items)">
          Clear
        </button>
      </div>

      <div class="flex flex-col gap-2">
        <Group.Item v-for="item in items" :key="item" :value="item">
          <template #default="{ isSelected, toggle }">
            <label class="flex items-center gap-2 cursor-pointer">
              <input :checked="isSelected" type="checkbox" @change="toggle">
              {{ item }}
            </label>
          </template>
        </Group.Item>
      </div>
    </template>
  </Group.Root>

  <p class="mt-4">Selected: {{ selected.join(', ') }}</p>
</template>
