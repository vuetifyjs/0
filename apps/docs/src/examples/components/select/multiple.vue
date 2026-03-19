<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])

  const fruits = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
    { id: 'mango', label: 'Mango' },
    { id: 'peach', label: 'Peach' },
  ]

  function label (ids: (string | number)[]) {
    return ids
      .map(id => fruits.find(f => f.id === id)?.label)
      .filter(Boolean)
      .join(', ')
  }
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <Select.Root v-model="selected" multiple>
      <Select.Activator class="activator">
        <Select.Value v-slot="{ selectedIds, hasValue }" placeholder="Choose fruits…">
          <template v-if="hasValue">
            <span
              v-for="id in selectedIds"
              :key="id"
              class="chip"
            >
              {{ fruits.find(f => f.id === id)?.label }}
            </span>
          </template>
        </Select.Value>

        <span aria-hidden="true" class="chevron">&#x25BE;</span>
      </Select.Activator>

      <Select.Content class="content">
        <Select.Item
          v-for="item in fruits"
          :id="item.id"
          :key="item.id"
          class="option"
          :value="item.label"
        >
          <span class="check" :class="{ visible: selected.includes(item.id) }">&#x2713;</span>
          {{ item.label }}
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected.length > 0 ? label(selected) : 'None' }}
    </p>
  </div>
</template>

<style scoped>
.activator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.375rem 0.75rem;
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
  margin-inline-start: auto;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--v0-primary);
  color: var(--v0-on-primary);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.check {
  width: 1rem;
  font-size: 0.75rem;
  visibility: hidden;
}

.check.visible {
  visibility: visible;
}
</style>
