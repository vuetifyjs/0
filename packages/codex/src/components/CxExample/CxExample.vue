<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxExampleProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxExample' })

  const {} = defineProps<CxExampleProps>()
</script>

<template>
  <V0Paper as="div" class="codex-example">
    <slot />
  </V0Paper>
</template>
