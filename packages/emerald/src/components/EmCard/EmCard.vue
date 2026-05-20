<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmCardProps extends AtomProps {
    hoverable?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCard' })

  const { hoverable = false, ...paperProps } = defineProps<EmCardProps>()
</script>

<template>
  <Atom
    v-bind="paperProps"
    as="div"
    class="emerald-card"
    :data-hoverable="hoverable || undefined"
  >
    <slot />
  </Atom>
</template>

<style>
.emerald-card {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #ffffff, var(--emerald-background, #faf9ff));
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
