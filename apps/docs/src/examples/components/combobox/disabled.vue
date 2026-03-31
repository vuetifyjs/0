<script setup lang="ts">
  import { Combobox } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string>()
  const disabled = shallowRef(false)

  const roles = [
    { id: 'admin', label: 'Admin' },
    { id: 'editor', label: 'Editor', disabled: true },
    { id: 'viewer', label: 'Viewer' },
    { id: 'guest', label: 'Guest', disabled: true },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <label class="flex items-center gap-2 text-sm text-on-surface">
      <input v-model="disabled" type="checkbox">
      Disable entire combobox
    </label>

    <Combobox.Root v-model="selected" :disabled>
      <Combobox.Activator
        class="flex items-center gap-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
        :class="disabled && 'opacity-50 cursor-not-allowed'"
      >
        <Combobox.Input
          class="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search roles…"
        />
        <Combobox.Cue class="text-xs opacity-50 cursor-pointer" />
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in roles"
          :id="item.id"
          :key="item.id"
          class="px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface data-[selected]:text-primary data-[selected]:font-medium data-[highlighted]:bg-primary data-[highlighted]:text-on-primary data-[highlighted]:data-[selected]:text-on-primary data-[disabled]:opacity-30 data-[disabled]:line-through data-[disabled]:cursor-not-allowed"
          :disabled="item.disabled"
          :value="item.label"
        >
          {{ item.label }}
        </Combobox.Item>

        <Combobox.Empty v-slot="{ query }" class="px-3 py-2 text-sm text-on-surface-variant">
          No results for "{{ query }}"
        </Combobox.Empty>
      </Combobox.Content>
    </Combobox.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected ?? 'None' }}
    </p>
  </div>
</template>
