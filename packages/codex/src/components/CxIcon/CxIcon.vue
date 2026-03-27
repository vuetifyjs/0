<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxIconProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxIcon' })

  const {} = defineProps<CxIconProps>()
</script>

<template>
  <V0Paper as="span" class="codex-icon">
    <slot />
  </V0Paper>
</template>
