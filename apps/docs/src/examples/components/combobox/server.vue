<script setup lang="ts">
  import { Combobox, ServerAdapter, useComboboxContext } from '@vuetify/v0'
  import { defineComponent, shallowRef, watch } from 'vue'

  // QueryWatcher syncs the Root query to the parent via emit
  const QueryWatcher = defineComponent({
    emits: ['query'],
    setup (_, { emit }) {
      const ctx = useComboboxContext()
      watch(ctx.query, q => emit('query', q))
    },
    render: () => null,
  })

  const selected = shallowRef<string>()
  const adapter = new ServerAdapter()

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

  function onQuery (q: string) {
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
      <QueryWatcher @query="onQuery" />

      <Combobox.Activator class="flex items-center gap-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm">
        <Combobox.Input
          class="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          open-on="input"
          placeholder="Search colors…"
        />
        <span v-if="loading" class="text-xs opacity-50 select-none">…</span>
        <Combobox.Cue v-else v-slot="{ isOpen }" class="text-xs opacity-50 cursor-pointer">
          {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
        </Combobox.Cue>
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          :value="item.label"
        >
          <template #default="{ isSelected, isHighlighted, attrs }">
            <div
              v-bind="attrs"
              class="px-3 py-2 rounded-md cursor-default select-none text-sm"
              :class="[
                isHighlighted
                  ? 'bg-primary text-on-primary'
                  : isSelected
                    ? 'text-primary font-medium'
                    : 'text-on-surface hover:bg-surface-variant',
              ]"
            >
              {{ item.label }}
            </div>
          </template>
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
