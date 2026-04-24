<script setup lang="ts">
  import { Combobox, ComboboxServerAdapter, useComboboxContext } from '@vuetify/v0'
  import { defineComponent, shallowRef, watch } from 'vue'

  const SearchWatcher = defineComponent({
    emits: ['search'],
    setup (_, { emit }) {
      const ctx = useComboboxContext('v0:combobox')
      watch(ctx.query, q => emit('search', q))
    },
    render: () => null,
  })

  const selected = shallowRef<string>()
  const adapter = new ComboboxServerAdapter()

  const ALL_COLORS = [
    { id: 'red', label: 'Red' },
    { id: 'orange', label: 'Orange' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'green', label: 'Green' },
    { id: 'blue', label: 'Blue' },
    { id: 'indigo', label: 'Indigo' },
    { id: 'violet', label: 'Violet' },
  ]

  const items = shallowRef([...ALL_COLORS])
  const loading = shallowRef(false)

  let timer: ReturnType<typeof setTimeout>

  function onSearch (q: string) {
    loading.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      const term = q.toLowerCase()
      items.value = term
        ? ALL_COLORS.filter(c => c.label.toLowerCase().includes(term))
        : ALL_COLORS
      loading.value = false
    }, 300)
  }
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <Combobox.Root v-model="selected" :adapter>
      <SearchWatcher @search="onSearch" />

      <Combobox.Activator class="flex items-center gap-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm">
        <Combobox.Control
          class="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search colors…"
        />

        <span v-if="loading" class="text-xs opacity-50 select-none">…</span>
        <Combobox.Cue v-else class="opacity-50 cursor-pointer transition-transform data-[state=open]:rotate-180"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg></Combobox.Cue>
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          class="px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface data-[selected]:text-primary data-[selected]:font-medium data-[highlighted]:bg-primary data-[highlighted]:text-on-primary data-[highlighted]:data-[selected]:text-on-primary"
          :value="item.label"
        >
          {{ item.label }}
        </Combobox.Item>

        <Combobox.Empty class="px-3 py-2 text-sm text-on-surface-variant">
          No results
        </Combobox.Empty>
      </Combobox.Content>
    </Combobox.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected ?? 'None' }}
    </p>
  </div>
</template>
