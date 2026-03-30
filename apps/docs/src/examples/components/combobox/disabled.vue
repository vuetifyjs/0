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
        <Combobox.Cue v-slot="{ isOpen }" class="text-xs opacity-50 cursor-pointer">
          {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
        </Combobox.Cue>
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in roles"
          :id="item.id"
          :key="item.id"
          :disabled="item.disabled"
          :value="item.label"
        >
          <template #default="{ isSelected, isHighlighted, isDisabled, attrs }">
            <div
              v-bind="attrs"
              class="px-3 py-2 rounded-md cursor-default select-none text-sm"
              :class="[
                isDisabled
                  ? 'opacity-30 line-through cursor-not-allowed'
                  : isHighlighted
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
