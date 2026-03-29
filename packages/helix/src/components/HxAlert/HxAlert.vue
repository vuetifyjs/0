<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxAlertProps extends V0PaperProps {
    type?: 'info' | 'success' | 'warning' | 'error'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAlert' })

  const {
    type = 'info',
    ...paperProps
  } = defineProps<HxAlertProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-alert"
    :data-type="type"
    role="alert"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-alert {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    position: relative;
  }
</style>
