<script setup lang="ts">
  import { useVirtualFocus } from '@vuetify/v0'
  import { computed, useTemplateRef, watch } from 'vue'

  export interface ListboxItem {
    id: string
    label: string
    disabled?: boolean
  }

  const {
    items,
    placeholder = 'Search…',
  } = defineProps<{
    items: ListboxItem[]
    placeholder?: string
  }>()

  const emit = defineEmits<{
    select: [id: string]
  }>()

  const selected = defineModel<string>()
  const query = defineModel<string>('query', { default: '' })

  const input = useTemplateRef('input')
  const list = useTemplateRef('list')

  const filtered = computed(() =>
    items.filter(item =>
      item.label.toLowerCase().includes(query.value.toLowerCase()),
    ),
  )

  const { highlightedId, clear } = useVirtualFocus(
    () => filtered.value.map(item => ({
      id: item.id,
      el: () => list.value?.querySelector(`[data-id="${item.id}"]`),
      disabled: item.disabled,
    })),
    {
      control: input,
      orientation: 'vertical',
    },
  )

  watch(filtered, () => clear())

  function onSelect () {
    if (highlightedId.value) {
      selected.value = String(highlightedId.value)
      emit('select', String(highlightedId.value))
    }
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <input
      ref="input"
      v-model="query"
      aria-autocomplete="list"
      aria-controls="listbox"
      aria-expanded="true"
      class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface outline-none focus:ring-2 focus:ring-primary"
      :placeholder
      role="combobox"
      @keydown.enter.prevent="onSelect"
    >

    <div class="max-h-48 overflow-y-auto rounded-lg border border-divider bg-surface">
      <ul
        id="listbox"
        ref="list"
        role="listbox"
      >
        <li
          v-for="item in filtered"
          :id="`option-${item.id}`"
          :key="item.id"
          :aria-disabled="item.disabled || undefined"
          :aria-selected="selected === item.id || undefined"
          class="option"
          :data-disabled="item.disabled || undefined"
          :data-id="item.id"
          :data-selected="selected === item.id || undefined"
          role="option"
          @click="!item.disabled && (selected = item.id, emit('select', item.id), input?.focus())"
        >
          {{ item.label }}
        </li>

        <li
          v-if="filtered.length === 0"
          class="px-3 py-2 text-on-surface-variant italic"
        >
          No results
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.option {
  padding: 0.5rem 0.75rem;
  cursor: default;
  user-select: none;
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
