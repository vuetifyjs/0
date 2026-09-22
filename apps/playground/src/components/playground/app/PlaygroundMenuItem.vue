<script setup lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  const {
    disabled = false,
    confirm = false,
  } = defineProps<{
    disabled?: boolean
    /** Second-click confirm state (Reset / Delete). */
    confirm?: boolean
  }>()
</script>

<template>
  <Button.Root
    class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors"
    :class="confirm
      ? 'text-error bg-error/10'
      : 'text-on-surface hover:bg-surface-tint data-[disabled]:opacity-50 data-[disabled]:hover:bg-transparent'"
    :disabled
  >
    <slot />
  </Button.Root>
</template>
