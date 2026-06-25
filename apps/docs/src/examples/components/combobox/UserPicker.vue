<script setup lang="ts">
  import { Combobox, ServerComboboxAdapter, useComboboxContext } from '@vuetify/v0'
  import { defineComponent, watch } from 'vue'
  import type { User } from './useUserSearch'

  const { results, loading } = defineProps<{
    results: User[]
    loading: boolean
  }>()

  const assignees = defineModel<string[]>('assignees', { default: () => [] })

  // Pass-through adapter — disables client filtering so the server owns results
  const adapter = new ServerComboboxAdapter()

  const emit = defineEmits<{ search: [query: string] }>()

  // Renderless watcher — observes the combobox query and forwards it upward
  const SearchWatcher = defineComponent({
    setup () {
      const ctx = useComboboxContext('v0:combobox')
      watch(ctx.query, query => emit('search', query))
    },
    render: () => null,
  })
</script>

<template>
  <Combobox.Root
    v-model="assignees"
    :adapter
    multiple
    name="assignees"
  >
    <SearchWatcher />

    <Combobox.Activator class="flex items-center gap-1 flex-wrap w-full min-h-10 px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm">
      <span
        v-for="handle in assignees"
        :key="handle"
        class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-on-primary text-xs font-medium"
      >
        @{{ handle }}
      </span>

      <Combobox.Control
        autocomplete="off"
        class="flex-1 min-w-32 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
        open-on="input"
        placeholder="Assign people…"
      />

      <span v-if="loading" class="ms-auto text-xs text-on-surface-variant select-none">Searching…</span>
      <Combobox.Cue v-else class="ms-auto opacity-50 cursor-pointer transition-transform data-[state=open]:rotate-180"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg></Combobox.Cue>
    </Combobox.Activator>

    <Combobox.Description class="text-xs text-on-surface-variant">
      Results are fetched from a mock server as you type.
    </Combobox.Description>

    <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
      <Combobox.Item
        v-for="user in results"
        :id="user.id"
        :key="user.id"
        v-slot="{ isSelected }"
        class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface data-[selected]:font-medium data-[highlighted]:bg-primary data-[highlighted]:text-on-primary"
        :value="user.handle"
      >
        <span class="flex items-center justify-center w-7 h-7 rounded-full bg-surface-variant text-on-surface-variant text-xs font-medium">
          {{ user.avatar }}
        </span>

        <span class="flex flex-col leading-tight">
          <span>{{ user.name }}</span>
          <span class="text-xs text-on-surface-variant">@{{ user.handle }}</span>
        </span>

        <span class="w-4 ms-auto text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
      </Combobox.Item>

      <Combobox.Empty v-slot="{ query }" class="px-3 py-2 text-sm text-on-surface-variant">
        No people match "{{ query }}"
      </Combobox.Empty>
    </Combobox.Content>
  </Combobox.Root>
</template>
