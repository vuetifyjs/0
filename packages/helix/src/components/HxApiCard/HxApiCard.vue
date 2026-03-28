<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxApiCardProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxApiCard' })

  const { ...paperProps } = defineProps<HxApiCardProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-api-card"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-api-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
