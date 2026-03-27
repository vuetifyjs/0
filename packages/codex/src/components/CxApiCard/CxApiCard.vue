<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxApiCardProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxApiCard' })

  const { ...paperProps } = defineProps<CxApiCardProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="codex-api-card"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-api-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
