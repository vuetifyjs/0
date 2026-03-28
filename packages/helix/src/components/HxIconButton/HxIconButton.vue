<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxIconButtonProps extends V0PaperProps {
    ariaLabel?: string
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxIconButton' })

  const {
    ariaLabel,
    disabled = false,
    ...paperProps
  } = defineProps<HxIconButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled) return
    emit('click', event)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :aria-label
    as="button"
    class="helix-icon-button"
    :data-disabled="disabled || undefined"
    :disabled="disabled || undefined"
    type="button"
    @click="onClick"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
  }

  .helix-icon-button[data-disabled] {
    cursor: default;
    pointer-events: none;
  }
</style>
