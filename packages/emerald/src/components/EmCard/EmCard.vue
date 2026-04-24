<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmCardProps extends V0PaperProps {
    hoverable?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCard' })

  const { hoverable = false, ...paperProps } = defineProps<EmCardProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-card"
    :data-hoverable="hoverable || undefined"
  >
    <slot />
  </V0Paper>
</template>

<style>
.emerald-card {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #ffffff, var(--emerald-background));
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 12px;
  overflow: clip;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-card[data-hoverable]:hover {
  border: 0.5px solid var(--emerald-primary-500);
  box-shadow:
    0 3px 8px 0 rgba(5, 0, 18, 0.13),
    0 2px 4px 0 rgba(5, 0, 18, 0.1);
}
</style>
