<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxChipProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxChip' })

  const {} = defineProps<CxChipProps>()
</script>

<template>
  <V0Paper as="span" class="codex-chip">
    <slot />
  </V0Paper>
</template>
