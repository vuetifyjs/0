<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const color = shallowRef<string>()

  const colors = [
    { id: 'red', label: 'Red' },
    { id: 'orange', label: 'Orange' },
    { id: 'green', label: 'Green' },
    { id: 'blue', label: 'Blue' },
    { id: 'purple', label: 'Purple' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <Select.Root v-model="color">
      <Select.Activator class="activator">
        <Select.Value v-slot="{ selectedIds }" placeholder="Choose a color…">
          {{ colors.find(c => c.id === selectedIds[0])?.label }}
        </Select.Value>

        <span aria-hidden="true" class="chevron">&#x25BE;</span>
      </Select.Activator>

      <Select.Content class="content">
        <Select.Item
          v-for="item in colors"
          :id="item.id"
          :key="item.id"
          class="option"
          :value="item.label"
        >
          {{ item.label }}
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ color ?? 'None' }}
    </p>
  </div>
</template>

<style scoped>
.activator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--v0-divider);
  background: var(--v0-surface);
  color: var(--v0-on-surface);
  cursor: pointer;
  font-size: 0.875rem;
}

.activator:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: 2px;
}

.chevron {
  font-size: 0.75rem;
  opacity: 0.5;
}

.content {
  min-width: anchor-size(width);
  border-radius: 0.5rem;
  border: 1px solid var(--v0-divider);
  background: var(--v0-surface);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  padding: 0.25rem;
}

.option {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  cursor: default;
  user-select: none;
  font-size: 0.875rem;
  color: var(--v0-on-surface);
}

.option:hover {
  background: var(--v0-surface-variant);
  opacity: 0.8;
}

.option[data-highlighted] {
  background: var(--v0-primary);
  color: var(--v0-on-primary);
  opacity: 1;
}

.option[data-selected] {
  color: var(--v0-primary);
  font-weight: 500;
}

.option[data-selected]:hover {
  opacity: 1;
}

.option[data-selected][data-highlighted] {
  background: var(--v0-primary);
  color: var(--v0-on-primary);
}
</style>
