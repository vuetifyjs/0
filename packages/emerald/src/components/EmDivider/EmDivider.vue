<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type EmDividerOrientation = 'horizontal' | 'vertical'
  export type EmDividerVariant = 'solid' | 'dashed'

  export interface EmDividerProps {
    orientation?: EmDividerOrientation
    variant?: EmDividerVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDivider' })

  const {
    orientation = 'horizontal',
    variant = 'solid',
  } = defineProps<EmDividerProps>()
</script>

<template>
  <Atom
    :aria-orientation="orientation"
    as="div"
    class="emerald-divider"
    :data-orientation="orientation"
    :data-variant="variant"
    role="separator"
  >
    <slot />
  </Atom>
</template>

<style>
.emerald-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--emerald-on-background);
}

.emerald-divider[data-orientation="horizontal"] {
  width: 100%;
}

.emerald-divider[data-orientation="vertical"] {
  flex-direction: column;
  height: 100%;
}
</style>
