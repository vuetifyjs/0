<script lang="ts" setup>
  import { shallowRef, useTemplateRef, computed } from 'vue'
  import { useClickOutside } from '@vuetify/v0'

  const isOpen = shallowRef(false)
  const buttonRef = useTemplateRef<HTMLElement>('button')
  const menuRef = useTemplateRef<HTMLElement>('menu')

  useClickOutside([buttonRef, menuRef], () => {
    isOpen.value = false
  })

  const menuStyle = computed(() => {
    const button = buttonRef.value
    if (!button) return {}

    const rect = button.getBoundingClientRect()
    return {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
    }
  })
</script>

<template>
  <button
    ref="button"
    class="px-4 py-2 bg-primary text-on-primary rounded hover:opacity-90 transition-opacity"
    @click="isOpen = !isOpen"
  >
    {{ isOpen ? 'Close' : 'Open' }} Menu
  </button>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="menu"
      class="fixed w-48 py-2 bg-surface border border-divider rounded shadow-lg z-50"
      :style="menuStyle"
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
  </Teleport>
</template>
