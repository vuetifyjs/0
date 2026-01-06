<script setup lang="ts">
  import { useClickOutside } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const isOpen = shallowRef(false)
  const menu = useTemplateRef('menu')

  useClickOutside(menu, () => {
    isOpen.value = false
  })
</script>

<template>
  <div ref="menu" class="inline-block">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Close' : 'Open' }} Menu
    </button>

    <div
      v-if="isOpen"
      class="absolute mt-2 w-48 py-2 bg-surface border border-divider rounded shadow-lg"
    >
      <button class="w-full text-left px-4 py-2 text-sm hover:bg-surface-tint">
        Profile
      </button>
      <button class="w-full text-left px-4 py-2 text-sm hover:bg-surface-tint">
        Settings
      </button>
      <button class="w-full text-left px-4 py-2 text-sm hover:bg-surface-tint">
        Sign out
      </button>
    </div>
  </div>
</template>
