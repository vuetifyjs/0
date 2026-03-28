<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxExampleProps extends V0PaperProps {
    /** Anchor id for deep linking */
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxExample' })

  const {
    id,
    ...paperProps
  } = defineProps<HxExampleProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :id
    as="div"
    class="helix-example"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .helix-example {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
