<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxKbdProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxKbd' })

  const {} = defineProps<CxKbdProps>()
</script>

<template>
  <V0Paper as="kbd" class="codex-kbd">
    <slot />
  </V0Paper>
</template>
