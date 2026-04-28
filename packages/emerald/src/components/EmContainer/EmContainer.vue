<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'fluid'

  export interface EmContainerProps extends V0PaperProps {
    size?: EmContainerSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmContainer' })

  const { size = 'lg', ...paperProps } = defineProps<EmContainerProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-container"
    :data-size="size"
  >
    <slot />
  </V0Paper>
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
