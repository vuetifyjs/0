<script setup lang="ts">
  import { Button, useClickOutside } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const isOpen = shallowRef(false)
  const menu = useTemplateRef('menu')

  useClickOutside(menu, () => {
    isOpen.value = false
  })
</script>

<template>
  <div ref="menu" class="inline-block relative">
    <Button.Root
      class="px-4 py-2 bg-primary text-on-primary rounded"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Close' : 'Open' }} Menu
    </Button.Root>

    <div
      v-if="isOpen"
      class="mt-2 w-48 py-2 bg-surface border border-divider rounded shadow-lg"
    >
      <Button.Root class="w-full text-left px-4 py-2 text-sm hover:bg-surface-tint">
        Profile
      </Button.Root>

      <Button.Root class="w-full text-left px-4 py-2 text-sm hover:bg-surface-tint">
        Settings
      </Button.Root>

      <Button.Root class="w-full text-left px-4 py-2 text-sm hover:bg-surface-tint">
        Sign out
      </Button.Root>
    </div>
  </div>
</template>
