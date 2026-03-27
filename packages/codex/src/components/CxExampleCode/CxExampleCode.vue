<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxExampleCodeProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxExampleCode' })

  const {} = defineProps<CxExampleCodeProps>()
</script>

<template>
  <V0Paper as="div" class="codex-example-code">
    <slot />
  </V0Paper>
</template>
