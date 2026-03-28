<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxIconButtonProps extends V0PaperProps {
    ariaLabel?: string
    disabled?: boolean
    /** Icon identifier passed to the icon slot */
    icon?: string
    /** Icon size passed to the icon slot */
    size?: string | number
    /** Tooltip text; also used as aria-label fallback */
    title?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxIconButton' })

  const {
    ariaLabel,
    disabled = false,
    icon,
    size = 18,
    title,
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
    :aria-label="ariaLabel ?? title"
    as="button"
    class="helix-icon-button"
    :data-disabled="disabled || undefined"
    :disabled="disabled || undefined"
    :title
    type="button"
    @click="onClick"
  >
    <slot :icon :size>
      <slot :icon name="icon" :size />
    </slot>
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
