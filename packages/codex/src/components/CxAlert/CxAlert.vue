<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxAlertProps extends V0PaperProps {
    type?: 'info' | 'success' | 'warning' | 'error'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAlert' })

  const {
    type = 'info',
    ...paperProps
  } = defineProps<CxAlertProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-alert"
    :data-type="type"
    role="alert"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-alert {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
  }
</style>
