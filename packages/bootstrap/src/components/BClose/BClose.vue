<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  export interface BCloseProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BClose' })

  const { disabled = false } = defineProps<BCloseProps>()

  const locale = useLocale()
</script>

<template>
  <button
    :aria-label="locale.ti('Close.label') ?? 'Close'"
    class="btn-close"
    :disabled="disabled || undefined"
    type="button"
  />
</template>
