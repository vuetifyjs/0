<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxButtonProps extends V0PaperProps {
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    href?: string
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxButton' })

  const {
    disabled = false,
    loading = false,
    type = 'button',
    href,
    variant = 'secondary',
    ...paperProps
  } = defineProps<HxButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled || loading) return

    emit('click', event)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :aria-busy="loading || undefined"
    :aria-disabled="(disabled || loading) || undefined"
    :as="href ? 'a' : 'button'"
    class="helix-button"
    :data-disabled="(disabled || loading) || undefined"
    :data-loading="loading || undefined"
    :data-variant="variant"
    :disabled="(disabled || loading) || undefined"
    :href
    :type="href ? undefined : type"
    @click="onClick"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.helix-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.helix-button[data-disabled] {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
