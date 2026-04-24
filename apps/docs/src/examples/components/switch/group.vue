<script setup lang="ts">
  import { Switch } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])

  const options = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'bluetooth', label: 'Bluetooth' },
    { value: 'location', label: 'Location services' },
  ]
</script>

<template>
  <Switch.Group v-model="selected" class="flex flex-col gap-3" label="Connectivity">
    <label
      v-for="option in options"
      :key="option.value"
      class="inline-flex items-center justify-between gap-4 cursor-pointer"
    >
      <span>{{ option.label }}</span>

      <Switch.Root
        class="inline-flex items-center border-none bg-transparent p-0 outline-none"
        :value="option.value"
      >
        <Switch.Track
          class="relative inline-flex items-center w-11 h-6 rounded-full bg-gray-300 transition-colors data-[state=checked]:bg-primary"
        >
          <Switch.Thumb
            class="![visibility:visible] block size-4 rounded-full bg-white shadow-sm transition-transform translate-x-1 data-[state=checked]:translate-x-6"
          />
        </Switch.Track>
      </Switch.Root>
    </label>
  </Switch.Group>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.join(', ') || 'none' }}
  </p>
</template>
