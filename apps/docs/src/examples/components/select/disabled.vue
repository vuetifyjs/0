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
      <Select.Activator
        class="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        :class="disabled && 'opacity-50 cursor-not-allowed'"
      >
        <Select.Value v-slot="{ selectedValue }">
          {{ selectedValue }}
        </Select.Value>
        <Select.Placeholder class="text-on-surface-variant">Choose a size…</Select.Placeholder>

        <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
          {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
        </Select.Cue>
      </Select.Activator>

      <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Select.Item
          v-for="item in sizes"
          :id="item.id"
          :key="item.id"
          :disabled="item.disabled"
          :value="item.label"
        >
          <template #default="{ isSelected, isHighlighted, isDisabled }">
            <div
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
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ size ?? 'None' }}
    </p>
  </div>
</template>
