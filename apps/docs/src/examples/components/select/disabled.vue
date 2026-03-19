<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const size = shallowRef<string>()
  const disabled = shallowRef(false)

  const sizes = [
    { id: 'sm', label: 'Small' },
    { id: 'md', label: 'Medium' },
    { id: 'lg', label: 'Large' },
    { id: 'xl', label: 'X-Large', disabled: true },
    { id: '2xl', label: '2X-Large', disabled: true },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <label class="flex items-center gap-2 text-sm text-on-surface">
      <input v-model="disabled" type="checkbox">
      Disable entire select
    </label>

    <Select.Root v-model="size" :disabled>
      <Select.Activator class="activator" :class="{ 'is-disabled': disabled }">
        <Select.Value v-slot="{ selectedIds }" placeholder="Choose a size…">
          {{ sizes.find(s => s.id === selectedIds[0])?.label }}
        </Select.Value>

        <span aria-hidden="true" class="chevron">&#x25BE;</span>
      </Select.Activator>

      <Select.Content class="content">
        <Select.Item
          v-for="item in sizes"
          :id="item.id"
          :key="item.id"
          class="option"
          :disabled="item.disabled"
          :value="item.label"
        >
          {{ item.label }}
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ size ?? 'None' }}
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

.activator.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.option[data-disabled] {
  opacity: 0.3;
  cursor: not-allowed;
  text-decoration: line-through;
}
</style>
