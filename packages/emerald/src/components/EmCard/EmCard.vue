<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmCardVariant = 'complete' | 'simple'

  export interface EmCardProps extends V0PaperProps {
    variant?: EmCardVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCard' })

  const { variant = 'complete', ...paperProps } = defineProps<EmCardProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-card"
    :data-variant="variant"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.emerald-card {
  display: flex;
  flex-direction: column;
  background: var(--emerald-background);
  border-radius: var(--emerald-radius-m);
  overflow: clip;
}

.emerald-card[data-variant="complete"] {
  padding: var(--emerald-spacing-2xl) var(--emerald-spacing-3xl);
  box-shadow: var(--emerald-shadow-l);
}

.emerald-card[data-variant="simple"] {
  padding: var(--emerald-spacing-3xs);
}
</style>
