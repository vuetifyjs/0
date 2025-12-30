<script setup lang="ts">
  // Framework
  import { useClickOutside, useKeydown } from '@vuetify/v0'

  // Utilities
  import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'

  const isOpen = shallowRef(false)
  const buttonRef = useTemplateRef<HTMLElement>('button')
  const menuRef = useTemplateRef<HTMLElement>('menu')
  const firstItemRef = useTemplateRef<HTMLElement>('firstItem')

  function close () {
    isOpen.value = false
    nextTick(() => buttonRef.value?.focus())
  }

  useClickOutside([buttonRef, menuRef], close)
  useKeydown({ key: 'Escape', handler: close })

  watch(isOpen, open => {
    if (open) {
      nextTick(() => firstItemRef.value?.focus())
    }
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
    :aria-expanded="isOpen"
    aria-haspopup="menu"
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
      role="menu"
      :style="menuStyle"
    >
      <button
        ref="firstItem"
        class="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-tint"
        role="menuitem"
      >
        Profile
      </button>
      <button
        class="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-tint"
        role="menuitem"
      >
        Settings
      </button>
      <button
        class="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-tint"
        role="menuitem"
      >
        Sign out
      </button>
    </div>
  </Teleport>
</template>
