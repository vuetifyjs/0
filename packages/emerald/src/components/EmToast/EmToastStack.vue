<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmToastStackPosition =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

  export interface EmToastStackProps extends AtomProps {
    position?: EmToastStackPosition
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastStack' })

  const { position = 'bottom-right', ...paperProps } = defineProps<EmToastStackProps>()
</script>

<template>
  <Atom
    v-bind="paperProps"
    aria-live="polite"
    as="div"
    class="emerald-toast-stack"
    :data-position="position"
    role="region"
  >
    <slot />
  </Atom>
</template>

<style scoped>
.emerald-toast-stack {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  pointer-events: none;
}

.emerald-toast-stack > :deep(*) {
  pointer-events: auto;
}

.emerald-toast-stack[data-position="bottom-right"] {
  bottom: 16px;
  right: 16px;
  align-items: flex-end;
}

.emerald-toast-stack[data-position="bottom-left"] {
  bottom: 16px;
  left: 16px;
  align-items: flex-start;
}

.emerald-toast-stack[data-position="top-right"] {
  top: 16px;
  right: 16px;
  align-items: flex-end;
  flex-direction: column;
}

.emerald-toast-stack[data-position="top-left"] {
  top: 16px;
  left: 16px;
  align-items: flex-start;
  flex-direction: column;
}
</style>
