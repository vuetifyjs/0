<script setup lang="ts">
  import { Switch } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const enabled = shallowRef(false)
</script>

<template>
  <label class="inline-flex items-center gap-3 cursor-pointer">
    <Switch.Root
      v-model="enabled"
      class="inline-flex items-center border-none bg-transparent p-0 outline-none"
    >
      <Switch.Track
        class="relative inline-flex items-center w-11 h-6 rounded-full bg-surface-variant transition-colors data-[state=checked]:bg-primary"
      >
        <Switch.Thumb
          class="![visibility:visible] block size-4 rounded-full bg-white shadow-sm transition-transform translate-x-1 data-[state=checked]:translate-x-6"
        />
      </Switch.Track>
    </Switch.Root>

    <span>Enable notifications</span>
  </label>
</template>
