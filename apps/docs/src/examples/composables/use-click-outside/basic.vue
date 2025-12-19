<script lang="ts" setup>
  import { ref, useTemplateRef } from 'vue'
  import { useClickOutside } from '@vuetify/v0'

  const isOpen = ref(false)
  const menuRef = useTemplateRef<HTMLElement>('menu')

  useClickOutside(menuRef, () => {
    isOpen.value = false
  })
</script>

<template>
  <div class="relative inline-block">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded hover:opacity-90 transition-opacity"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Close' : 'Open' }} Menu
    </button>

    <div
      v-if="isOpen"
      ref="menu"
      class="absolute top-full left-0 mt-2 w-48 py-2 bg-surface border border-divider rounded shadow-lg z-10"
    >
      <div class="px-4 py-2 text-sm text-on-surface hover:bg-surface-tint cursor-pointer">
        Profile
      </div>
      <div class="px-4 py-2 text-sm text-on-surface hover:bg-surface-tint cursor-pointer">
        Settings
      </div>
      <div class="px-4 py-2 text-sm text-on-surface hover:bg-surface-tint cursor-pointer">
        Sign out
      </div>
    </div>
  </div>
</template>
