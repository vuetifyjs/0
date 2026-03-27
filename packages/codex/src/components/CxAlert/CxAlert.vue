<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Components
  import { CxCloseButton } from '#codex/components/CxCloseButton'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAlertProps extends V0PaperProps {
    type?: 'info' | 'success' | 'warning' | 'error'
    dismissible?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAlert' })

  const {
    type = 'info',
    dismissible = false,
    ...paperProps
  } = defineProps<CxAlertProps>()

  const visible = defineModel<boolean>('visible', { default: true })

  const emit = defineEmits<{
    dismiss: []
  }>()

  function onDismiss () {
    visible.value = false
    emit('dismiss')
  }
</script>

<template>
  <V0Paper
    v-if="visible"
    v-bind="paperProps"
    as="div"
    class="codex-alert"
    :data-type="type"
    role="alert"
  >
    <slot />

    <CxCloseButton
      v-if="dismissible"
      class="codex-alert__close"
      label="Dismiss alert"
      size="sm"
      @click="onDismiss"
    />
  </V0Paper>
</template>

<style scoped>
  .codex-alert {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
  }

  .codex-alert__close {
    flex-shrink: 0;
    margin-inline-start: auto;
  }
</style>
