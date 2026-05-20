<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid'

  export interface EmContainerProps extends AtomProps {
    size?: EmContainerSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmContainer' })

  const { size = 'lg', ...paperProps } = defineProps<EmContainerProps>()
</script>

<template>
  <Atom
    v-bind="paperProps"
    as="div"
    class="emerald-container"
    :data-size="size"
  >
    <slot />
  </Atom>
</template>

<style scoped>
.emerald-container {
  width: 100%;
  margin-inline: auto;
  padding-inline: 16px;
}

.emerald-container[data-size="sm"] { max-width: 640px; }
.emerald-container[data-size="md"] { max-width: 768px; }
.emerald-container[data-size="lg"] { max-width: 1024px; }
.emerald-container[data-size="xl"] { max-width: 1280px; }
.emerald-container[data-size="2xl"] { max-width: 1536px; }
.emerald-container[data-size="fluid"] { max-width: none; }
</style>
