<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxExampleProps extends V0PaperProps {
    /** Anchor id for deep linking */
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxExample' })

  const {
    id,
    ...paperProps
  } = defineProps<CxExampleProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :id
    as="div"
    class="codex-example"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
  .codex-example {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
